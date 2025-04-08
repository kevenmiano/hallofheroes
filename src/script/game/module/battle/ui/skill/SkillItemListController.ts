/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-12 10:18:47
 * @LastEditTime: 2024-02-02 14:50:41
 * @LastEditors: jeremy.xu
 * @Description: 点击技能选人的逻辑
 */
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import Dictionary from "../../../../../core/utils/Dictionary";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { BattleManager } from "../../../../battle/BattleManager";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { SkillData } from "../../../../battle/data/SkillData";
import { BaseRoleView } from "../../../../battle/view/roles/BaseRoleView";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { BattleNotic, RoleEvent, NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";
import { BattlePropItem } from "../../../../datas/BattlePropItem";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { SkillInfo } from "../../../../datas/SkillInfo";
import { TrailPropInfo } from "../../../../datas/TrailPropInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { SocketSendManager } from "../../../../manager/SocketSendManager";
import { ThaneInfoHelper } from "../../../../utils/ThaneInfoHelper";
import { SkillItemListView } from "./SkillItemListView";
import { TempleteManager } from '../../../../manager/TempleteManager';
import SealOrderMsg = com.road.yishi.proto.battle.SealOrderMsg;
import HeroOrderMsg = com.road.yishi.proto.battle.HeroOrderMsg;
import ItemUseResultMsg = com.road.yishi.proto.battle.ItemUseResultMsg;
import { BattleRecordReader } from "../../../../battle/record/BattleRecordReader";
import { BattleType } from "../../../../constant/BattleDefine";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import SDKManager from "../../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../../core/thirdlib/RptEvent";
import { PetData } from "../../../pet/data/PetData";

export class SkillItemListController {
    private view: SkillItemListView;
    private skills: (t_s_skilltemplateData | BattlePropItem)[] = [];
    private petSkills: t_s_skilltemplateData[] = [];
    private _heroRoleInfo: HeroRoleInfo;

    private skillSelectingTargets: any[] = [];//当前可选目标数组.
    private skillType: number = 0;
    private _selected: boolean;
    private _useSkillFailed: boolean;
    private awakenSkills: any[] = [];

    constructor(view: SkillItemListView) {
        this.view = view;
        this._heroRoleInfo = BattleManager.Instance.battleModel.selfHero;
        this.init();
    }

    private init() {
        let arr: SimpleDictionary = this.getFastkey();
        let info: t_s_skilltemplateData
        for (let i: number = 1; i <= 7; i++) {
            if (arr.hasOwnProperty("fastkey_" + i)) {
                info = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, arr["fastkey_" + i])
                this.skills.push(info);
                // if (!SkillPriorityType.isSuperSkill(info.Priority)) {
                //     this.skills.push(info);
                // }
            } else if (i == 7) {
                info = this.getSkillIdByJob();
                this.skills.push(info);
            } else {
                this.skills.push(null);
            }
        }
        if (BattleManager.Instance.battleModel) {
            let j: number = 0;
            let len: number = 0;
            let roleInfo: HeroRoleInfo = BattleManager.Instance.battleModel.selfHero
            Logger.battle("[SkillItemListController]携带符文", roleInfo.props)
            if (roleInfo && roleInfo.props) {
                for (j = 0, len = roleInfo.props.length; j < len; j++) {
                    let item: BattlePropItem = roleInfo.props[j];
                    let index: number = roleInfo.props[j].bagPos;

                    this.skills[7 + index] = item;
                }
            }

            // 宠物技能
            // roleInfo.petSkillIds = [30851,30121,30851,30851,30851];
            let petFastKey: any[] = this.getPetSkillFastkey();
            let petFastKeyIndex: number = 0;
            if (roleInfo && roleInfo.petSkillIds) {
                for (j = 0; j < PetData.CHANGE_SKILL_NUM; j++) {
                    let skillId: number = roleInfo.petSkillIds[j];
                    if (skillId) {
                        info = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, skillId);
                        petFastKeyIndex = petFastKey.indexOf(info.SonType.toString());
                        if (petFastKeyIndex != -1) {
                            this.petSkills[petFastKeyIndex] = info;
                        }
                    }
                }
            }

            this.awakenSkills.push(ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, SkillData.PET_MORPH_SKILL));
            this.awakenSkills.push(ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, SkillData.PET_UNMORPH_SKILL));
        }

        if (this.view) {
            this.view.initView(this.skills);
            this.view.initPetSkills(this.petSkills);
        }
        this.addEvent();

        this.__onAwkenValueChangeHandler();
    }


    addEvent() {
        NotificationManager.Instance.addEventListener(BattleNotic.ACTION_SKILL, this.__skillUse, this);
        NotificationManager.Instance.addEventListener(BattleNotic.RESET_ACTION_TIME, this.__cleanSkillSelect, this);
        NotificationManager.Instance.addEventListener(BattleNotic.SKILL_ENABLE, this.__skillEnable, this);
        NotificationManager.Instance.addEventListener(BattleNotic.FORCE_SKILL_ENABLE, this.__forceSkillEnable, this);
        NotificationManager.Instance.addEventListener(BattleNotic.RESTRICT_CHANGED, this.restrictChangedHandler, this);
        NotificationManager.Instance.addEventListener(BattleNotic.SKILL_CD, this.onSkillCdHandler, this);
        ServerDataManager.listen(S2CProtocol.U_B_HERO_ORDER, this, this.__skillUseServerBack);
        ServerDataManager.listen(S2CProtocol.U_B_USE_ITEM_RESULT, this, this.__useBattleItemServerBack);
        ServerDataManager.listen(S2CProtocol.U_C_SEAL_ORDER, this, this.__onRecvSealOrder);

        if (this._heroRoleInfo) {
            this._heroRoleInfo.addEventListener(RoleEvent.SP, this.onHeroSpChanged, this);
            this._heroRoleInfo.addEventListener(RoleEvent.AWAKEN, this.__onAwkenValueChangeHandler, this);
        }
    }

    offEvent() {
        NotificationManager.Instance.removeEventListener(BattleNotic.SKILL_ENABLE, this.__skillEnable, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.FORCE_SKILL_ENABLE, this.__forceSkillEnable, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.ACTION_SKILL, this.__skillUse, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.RESET_ACTION_TIME, this.__cleanSkillSelect, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.RESTRICT_CHANGED, this.restrictChangedHandler, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.SKILL_CD, this.onSkillCdHandler, this);
        ServerDataManager.cancel(S2CProtocol.U_B_HERO_ORDER, this, this.__skillUseServerBack);
        ServerDataManager.cancel(S2CProtocol.U_B_USE_ITEM_RESULT, this, this.__useBattleItemServerBack);
        ServerDataManager.cancel(S2CProtocol.U_C_SEAL_ORDER, this, this.__onRecvSealOrder);

        if (this._heroRoleInfo) {
            this._heroRoleInfo.removeEventListener(RoleEvent.SP, this.onHeroSpChanged, this);
            this._heroRoleInfo.removeEventListener(RoleEvent.AWAKEN, this.__onAwkenValueChangeHandler, this);
        }
    }

    /**
     *更新战斗中圣印顺序
     */
    protected __onRecvSealOrder(pkg: PackageIn) {
        let msg: SealOrderMsg = pkg.readBody(SealOrderMsg) as SealOrderMsg;
        if (msg) {
            let info = this.getTalentSkillBySontype(msg.sealOrder[0]);
            if (this.skills && this.skills[SkillItemListView.TalentIndex]) {
                this.skills[SkillItemListView.TalentIndex] = info;
            }
            this.view.updateTalentSkill(info);
            this.view.startCD(info.TemplateId);
        }
    }

    private getTalentSkillBySontype(sontType): t_s_skilltemplateData {
        let thane: ThaneInfo = ArmyManager.Instance.thane;
        let array = thane.talentData.talentSkill.split(',');
        for (let index = 0; index < array.length; index++) {
            const tempId = array[index];
            if (tempId) {
                let cfg: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, tempId);
                if (cfg && cfg.SonType == sontType) {
                    return cfg;
                }
            }
        }
        return null;
    }

    /**
     * 根据职业取得天赋技能模板id, 写死 
     * @return 
     * 
     */
    private getSkillIdByJob(): t_s_skilltemplateData {
        let thane: ThaneInfo = ArmyManager.Instance.thane;
        let sontType = thane.talentData.sealOrder[0];
        return this.getTalentSkillBySontype(sontType);
    }
    /**
     * 使用技能成功, 对应技能进入cd时间 
     * @param event
     * 
     */
    private onSkillCdHandler(data: any) {
        let skillId: number = data.skillId;
        let waitTime: number = data.waitTime;
        Logger.battle("[SkillItemListController]onSkillCdHandler", skillId, waitTime)
        this.view.startCD(skillId, waitTime);
    }

    /**
     * 返回技能快捷键列表 
     * @return 
     * 
     */
    private getPetSkillFastkey(): any[] {
        let hero: PlayerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo
        let fastKey: any[] = [];
        if (hero.enterWarPet) {
            fastKey = hero.enterWarPet.petFastKeyOfString.split(",");
        }
        return fastKey;
    }
    /**
     * 返回技能快捷键列表 
     * @return 
     * 
     */
    private getFastkey(): SimpleDictionary {
        let hero: ThaneInfo = ArmyManager.Instance.thane;
        let setList: SimpleDictionary = new SimpleDictionary();
        let fastKey: any[] = [];
        if (hero.skillCate && hero.skillCate.fastKey != undefined)
            fastKey = hero.skillCate.fastKey.split(",");
        let length: number = 0;
        for (let j: number = 1; j < fastKey.length; j++) {
            if (fastKey[j - 1] != -1) {
                let info: SkillInfo = hero.getSkillBySontype(fastKey[j - 1])
                if (!info) {
                    info = hero.getExtrajobSkillBySontype(fastKey[j - 1]) 
                }
                if(info){
                    setList.add("fastkey_" + j, info.templateInfo.TemplateId);
                    setList.add("index_" + info.templateInfo.TemplateId, j);
                    length++;
                }
            }
        }
        return setList;
    }

    /**
     * 将技能栏强制不可用 
     * @param e
     * 
     */
    private __forceSkillEnable(e: NotificationEvent) {
        let self: any = BattleManager.Instance.getSelfRoleView();
        if (self && this.view) {
            this.view.setEnableForce(false);
        }
    }
    /**
     * 设置技能栏的可用状态 
     * @param event
     * 
     */
    private __skillEnable(b: boolean) {
        if (!this.view) return

        if (BattleManager.Instance.battleModel && BattleManager.Instance.battleModel.isControledByBoss()) {//泰拉神庙副本里面boss控制了玩家, 持续时间内技能不可用
            this.view.setEnableForce(false);
            return;
        }
        let isOver: boolean = BattleManager.Instance.battleModel.isOver;
        let restricted: boolean = BattleManager.Instance.battleModel.selfHero.restricted;
        let selfView = BattleManager.Instance.getSelfRoleView();
        //如果这时还是宠物形态 但是觉醒值是0 要设为false 因为这时要等释放解除变身技能
        let isWaitChangeBody: boolean = (this._heroRoleInfo.isPetState && this._heroRoleInfo.awaken == 0);

        if (isOver || restricted || isWaitChangeBody) {
            if (selfView) {
                selfView.cancelReadyState();
            }
            this.view.setEnable(false);
        }
        else {
            this.view.setEnable(b);
        }
        this._useSkillFailed = false;
    }
    /**
     * 角色被锁定的状态改变 
     * @param event
     * 
     */
    private restrictChangedHandler(event: NotificationEvent) {
        this.__skillEnable(null);
    }
    /**
     * 英雄愤怒值改变时的处理函数. 
     * @param event
     * 
     */
    private onHeroSpChanged(data: any) {
        this.view.refreshForSpChanged();
        if (data.buffCause) {
            let skillId: number = BattleManager.Instance.battleModel.currentReadySkillId;
            if (skillId != -1) {
                let skillTemp: t_s_skilltemplateData = this.getSkilltemplateDataById(skillId);
                if (skillTemp && skillTemp.Cost > BattleManager.Instance.battleModel.selfHero.sp) {
                    this.view.setEnable(true);
                }
            }
        }
    }


    private __onAwkenValueChangeHandler(e: RoleEvent = null) {
        if (this.view) {
            if (this._heroRoleInfo.isWaitingChangeBody) {
                this.view.setEnable(false);
            }
            this.view.refreshForAwakenValueChanged();
        }
    }

    /**
     * 客户端使用技能 
     * @param event
     * 
     */
    private __skillUse(data: any) {
        if (this._heroRoleInfo.isWaitingChangeBody) {
            Logger.battle("正在等待变身......");
            return;
        }

        if (BattleManager.Instance.battleModel.battleType == BattleType.REMOTE_PET_BATLE) return;
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess == GlobalConfig.NEWBIE_11400) {
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_SKILL);
        }
        Logger.battle("[SkillItemListController]__skillUse使用技能", data);
        // this.view.setEnable(false);
        let currentskillId: number = 0;
        let battleId: string = BattleManager.Instance.battleModel.battleId;
        let livingID: number = BattleManager.Instance.battleModel.selfHero.livingId;
        if (BattleManager.Instance.battleModel.isAutoFight) {
            NotificationManager.Instance.sendNotification(BattleNotic.RESET_ACTION_TIME);
        }
        if (data instanceof t_s_skilltemplateData) {
            let skillInfo: t_s_skilltemplateData = <t_s_skilltemplateData>data
            currentskillId = skillInfo.TemplateId;
            Logger.battle("[SkillItemListController]__skillUse使用普通技能 : " + currentskillId + ", type:" + skillInfo.MasterType);
            SocketSendManager.Instance.gameCommand(battleId, livingID, currentskillId);
            BattleManager.Instance.battleModel.currentReadySkillId = currentskillId;
            this.addSkillUsedFlag(skillInfo);
        } else if (data instanceof BattlePropItem) {
            let item: BattlePropItem = <BattlePropItem>data.clone()
            Logger.battle("[SkillItemListController]__skillUse使用符文技能 : " + item.skillTempId);
            SocketSendManager.Instance.sendUseItemInBattle(battleId, livingID, item.skillTempId);
            BattleManager.Instance.battleModel.currentReadySkillId = item.skillTempId;
            this.addPropUsedFlag(item);
        } else if (data instanceof TrailPropInfo) {
            let currentProp: TrailPropInfo = <TrailPropInfo>data;
            BattleManager.Instance.battleModel.currentReadySkillId = currentProp.skillTemp.TemplateId;
            this.addTrailPropUsedFlag(currentProp);
            SocketSendManager.Instance.sendUseBattleTrialProp(battleId, currentProp.id, livingID);
        }
        BattleManager.Instance.battleModel.defaultSkillCount = 0;
    }
    /**
     * 在人物身上添加使用试练技能图标 
     * @param item
     * 
     */
    private addTrailPropUsedFlag(item: TrailPropInfo) {
        if (!item) return
        let heroView: BaseRoleView = BattleManager.Instance.getSelfRoleView();
        if (heroView && heroView.info && heroView.info.isLiving) {
            heroView.addSkillFlagByIconPath(IconFactory.getTecIconByIcon(item.skillTemp.Icons));
        }
    }
    /**
     * 在人物身上添加使用技能的图标 
     * @param skillInfo
     * 
     */
    private addSkillUsedFlag(skillInfo: t_s_skilltemplateData) {
        if (!skillInfo) return
        let heroView: BaseRoleView = BattleManager.Instance.getSelfRoleView();
        if (heroView && heroView.info && heroView.info.isLiving) {
            heroView.addSkillFlag(skillInfo);
        }
    }
    /**
     * 在人物身上添加使用符文的图标 
     * @param item
     * 
     */
    private addPropUsedFlag(item: BattlePropItem) {
        if (!item) return
        let heroView: BaseRoleView = BattleManager.Instance.getSelfRoleView();
        if (heroView && heroView.info && heroView.info.isLiving) {
            heroView.addSkillFlagByIconPath(IconFactory.getTecIconByIcon(item.getSkillTemplate().Icons));
        }
    }
    /**
     * 服务器返回使用道具结果, 符文和试练技能 
     * @param event
     * 
     */
    private __useBattleItemServerBack(pkg: PackageIn) {
        let msg = pkg.readBody(ItemUseResultMsg) as ItemUseResultMsg;
        Logger.battle("[SkillItemListController]__useBattleItemServerBack", msg)

        let roleId: number = msg.livingId
        let heroView: BaseRoleView
        if (msg.result == 0) {
            let self: HeroRoleInfo = BattleManager.Instance.battleModel.selfHero;
            if (roleId == self.livingId) {
                heroView = BattleManager.Instance.battleMap.rolesDict[self.livingId]
                let prop: BattlePropItem = self.getPropByID(msg.tempId);
                if (prop) {
                    BattleManager.Instance.battleModel.currentReadySkillId = prop.skillTempId;
                    prop.useCount = msg.count;
                }
                if (heroView.info && heroView.info.isLiving) {
                    heroView.addCollectionEffect();
                }
                if (msg.type == 2)//试练道具
                {
                    let data: TrailPropInfo = self.getTrialPropInfoByIndex(msg.uItemId);
                    data.useCount = msg.count;
                    Logger.battle("[SkillItemListController]试炼道具", msg.uItemId, msg.count)
                }
            } else {
                heroView = BattleManager.Instance.battleMap.rolesDict[roleId]
                if (heroView) {
                    if (heroView.info && heroView.info.isLiving) {
                        heroView.addCollectionEffect(false);
                        let skillTemp: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(msg.tempId);
                        if (skillTemp)
                            heroView.addSkillFlagByIconPath(IconFactory.getTecIconByIcon(skillTemp.Icons));
                    }
                }
            }
        }
        else {
            Logger.battle("[SkillItemListController]__useBattleItemServerBack使用技能失败 : " + msg.tempId);
            this.view.setEnable(true);
        }
    }


    /**
     * 服务器返回技能使用结果 
     * @param event
     * 
     */
    private __skillUseServerBack(pkg: PackageIn) {
        let msg = pkg.readBody(HeroOrderMsg) as HeroOrderMsg;
        let mapRoleDic: Dictionary = BattleManager.Instance.battleMap.rolesDict;
        let selfLivingId: number = BattleManager.Instance.battleModel.selfHero.livingId;

        Logger.battle("[SkillItemListController]__skillUseServerBack", msg)

        let roleId: number = msg.heroIndexId;
        let skillId: number = msg.skillId;
        let result: number = msg.result;
        let castTime: number = msg.castTime;
        let qteTime: number = 0;
        let aims: any[] = []
        let aimLen: number = msg.targetIndexs.length//pkg.readInt()			
        for (let i: number = 0; i < aimLen; i++) {
            aims.push(msg.targetIndexs[i]);
        }
        let skillInfo: t_s_skilltemplateData
        if (result == 1 && roleId == BattleManager.Instance.battleModel.selfHero.livingId) {
            let str2: string = LangManager.Instance.GetTranslation("battle.view.ui.SkillItemListController.str2");
        }
        let heroView: BaseRoleView;
        let flag: boolean = true;
        let isAutoFight = BattleManager.Instance.battleModel.isAutoFight;
        if (result == 0) {//服务器返回技能使用成功
            flag = true;
            skillInfo = this.getSkilltemplateDataById(skillId);
            if (skillInfo && !isAutoFight) {
                // qteTime = skillInfo.QTETime; //???
            }

            let isSelf = this.isSelfUseSkill(roleId, selfLivingId)
            if (isSelf) {
                Logger.battle("技能使用成功 :  " + skillId);
                BattleManager.Instance.battleModel.currentReadySkillId = skillId;
                heroView = mapRoleDic[selfLivingId];
                if (heroView && heroView.info && heroView.info.isLiving) {
                    // 添加续气效果
                    heroView.addCollectionEffect();
                    // 自己自动战斗、播放回放时候给自己添加技能使用图标
                    if (isAutoFight || BattleRecordReader.inRecordMode) {
                        this.addSkillUsedFlag(skillInfo);
                    }
                    NotificationManager.Instance.sendNotification(BattleNotic.SHOW_SKILL_USE_SUCCESS, [skillInfo, qteTime, castTime, aims]);
                }
            } else {
                heroView = mapRoleDic[roleId];
                if (heroView && heroView.info && heroView.info.isLiving) {
                    skillInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, skillId)
                    //添加续气效果, 并在头上显示技能图标
                    heroView.addCollectionEffect(false);
                    heroView.addSkillFlag(skillInfo);
                }
            }
        } else {
            flag = false;
            Logger.battle("使用技能失败");

            BattleManager.Instance.battleModel.currentReadySkillId = -1;
            if (roleId == selfLivingId) {
                this._useSkillFailed = true;
                //失败 移除技能标志
                heroView = mapRoleDic[selfLivingId];
                if (heroView) {
                    heroView.removeSkillFlag()
                }

                //失败 移除选中的效果
                for (const key in aims) {
                    if (Object.prototype.hasOwnProperty.call(aims, key)) {
                        const living = aims[key];
                        heroView = mapRoleDic[living]
                        if (heroView) {
                            heroView.removeSkillAimFlag();
                            Logger.battle("移除选中的效果:" + living);
                        }
                    }
                }

                //失败时,让技能可选
                setTimeout(delayOpenSkillEnable.bind(this), 1000);
            }
            function delayOpenSkillEnable() {
                if (this._useSkillFailed) {
                    this._useSkillFailed = false;
                    if (this.view) this.view.setEnable(true);
                }
            }
        }

        if (roleId == selfLivingId) {
            NotificationManager.Instance.sendNotification(NotificationEvent.USE_SKILL_RESULT, { skillId: skillId, result: flag });
        }
    }

    /**
     * 根据技能id取得技能模板信息 
     * @param skillId
     * @return 
     * 
     */
    private getSkilltemplateDataById(skillId: number): t_s_skilltemplateData {
        let skillInfo: t_s_skilltemplateData
        let allSkill: any[] = this.skills.concat(this.petSkills);
        allSkill.push.apply(allSkill, this.awakenSkills);
        for (const key in allSkill) {
            if (Object.prototype.hasOwnProperty.call(allSkill, key)) {
                const element = allSkill[key];
                if (!element) {
                    continue;
                }
                if (element instanceof t_s_skilltemplateData) {
                    if (element.TemplateId == skillId || (BattleManager.Instance.battleModel.isAutoFight && element.Parameter3 == skillId))////技能id匹配 技能QTE id 匹配
                    {
                        skillInfo = <t_s_skilltemplateData>element;
                        return skillInfo;
                    }
                } else if (element instanceof BattlePropItem) {
                    if (element.skillTempId == skillId) {
                        skillInfo = element.getSkillTemplate();
                        return skillInfo;
                    }
                }
            }

        }
        return skillInfo;
    }
    private __cleanSkillSelect(event: Event) {
        let heroView: BaseRoleView = BattleManager.Instance.battleModel.selfHero.view;
        if (heroView) {
            heroView.removeCollectionEffect();
            heroView.removeSkillFlag();
        }
        let rolesDict = BattleManager.Instance.battleMap.rolesDict
        for (const key in rolesDict) {
            if (Object.prototype.hasOwnProperty.call(rolesDict, key)) {
                const roleView = rolesDict[key];
                roleView.removeSkillAimFlag();
            }
        }
    }

    private isSelfUseSkill(roleId: number, selfLivingId: number): boolean {
        if (roleId == selfLivingId) {
            return true;
        }
        return false;
    }

    public dispose() {
        this.offEvent();
        this.skills = null;
    }
}