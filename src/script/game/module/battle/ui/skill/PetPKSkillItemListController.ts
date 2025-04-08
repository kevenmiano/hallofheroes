import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { RemotePetEvent } from "../../../../../core/event/RemotePetEvent";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { BattleManager } from "../../../../battle/BattleManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { BattleCooldownModel } from "../../../../battle/data/BattleCooldownModel";
import { SkillData } from "../../../../battle/data/SkillData";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import { BattleRecordReader } from "../../../../battle/record/BattleRecordReader";
import { BaseRoleView } from "../../../../battle/view/roles/BaseRoleView";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { BattleType } from "../../../../constant/BattleDefine";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { BattleNotic, NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";
import { BattlePropItem } from "../../../../datas/BattlePropItem";
import { TrailPropInfo } from "../../../../datas/TrailPropInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { SocketSendManager } from "../../../../manager/SocketSendManager";
import { PetData } from "../../../pet/data/PetData";
import PetPKSkillItemListView from "./PetPKSkillItemListView";
import Dictionary from "../../../../../core/utils/Dictionary";
import SealOrderMsg = com.road.yishi.proto.battle.SealOrderMsg;
import HeroOrderMsg = com.road.yishi.proto.battle.HeroOrderMsg;
import ItemUseResultMsg = com.road.yishi.proto.battle.ItemUseResultMsg;
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { TempleteManager } from "../../../../manager/TempleteManager";

export default class PetPKSkillItemListController {
    private skills: (t_s_skilltemplateData | BattlePropItem)[] = [];
    private view: PetPKSkillItemListView;
    private _useSkillFailed = false;
    private petTemlateId1: number = 0;
    private petTemlateId2: number = 0;
    private petTemlateId3: number = 0;
    public constructor(view: PetPKSkillItemListView) {
        this.view = view;
        this.initSkillData();
    }

    private initSkillData() {
        let petIndexArr = this.playerInfo.petChallengeIndexFormation.split(",");
        let index1 = (parseInt(petIndexArr[0]));
        let index2 = (parseInt(petIndexArr[1]));
        let index3 = (parseInt(petIndexArr[2]));
        let skills1 = this.getSkills(index1);
        let skills2 = this.getSkills(index2);
        let skills3 = this.getSkills(index3);
        this.skills = skills1.concat(skills2).concat(skills3);
        let info = this.getSkillIdByJob();//天赋
        this.skills.push(info);
        if (this.playerInfo.getPet(index1)) {
            this.petTemlateId1 = this.playerInfo.getPet(index1).templateId;
            this.battleModel.petTemplateId1 = this.petTemlateId1;
        }
        if (this.playerInfo.getPet(index2)) {
            this.petTemlateId2 = this.playerInfo.getPet(index2).templateId;
            this.battleModel.petTemplateId2 = this.petTemlateId2;
        }
        if (this.playerInfo.getPet(index3)) {
            this.petTemlateId3 = this.playerInfo.getPet(index3).templateId;
            this.battleModel.petTemplateId3 = this.petTemlateId3;
        }
        if (BattleManager.Instance.battleModel) {
            let j: number = 0;
            let len: number = 0;
            let roleInfo: HeroRoleInfo = BattleManager.Instance.battleModel.selfHero
            if (roleInfo && roleInfo.props) {//符文数据
                for (j = 0, len = roleInfo.props.length; j < len; j++) {
                    let item: BattlePropItem = roleInfo.props[j];
                    let index: number = roleInfo.props[j].bagPos;
                    this.skills[19 + index] = item;
                }
            }
        }
        if (this.view) {
            this.view.initView(this.skills);
            this.view.initCD();
        }
        this.addEvent();
        if (this.petTemlateId1 > 0) {
            this.view.petIndexCtr.selectedIndex = 0;
        } else if (this.petTemlateId2 > 0) {
            this.view.petIndexCtr.selectedIndex = 1;
        } else if (this.petTemlateId3 > 0) {
            this.view.petIndexCtr.selectedIndex = 2;
        }
    }

    private getSkills(petTemlateId: number): Array<any> {
        let skillArr: Array<any> = [];
        let petData: PetData;
        let fastKey: string[];
        if (petTemlateId > 0) {//位置有英灵
            petData = this.playerInfo.getPet(petTemlateId);
            if (!petData) return;
            fastKey = petData.petFastKeyOfString.split(",");
            for (let i: number = 0; i < 6; i++) {
                let skillTemplateData: t_s_skilltemplateData = petData.getChangeSkillTemplate(Number(fastKey[i])) as t_s_skilltemplateData;
                if (skillTemplateData) {
                    skillArr.push(skillTemplateData);
                } else {
                    skillArr.push(null);
                }
            }
        } else {
            for (let i: number = 0; i < 6; i++) {
                skillArr.push(null);
            }
        }
        return skillArr;
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(BattleNotic.PETPK_ACTION_SKILL, this.__skillUse, this);
        NotificationManager.Instance.addEventListener(BattleNotic.SKILL_CD, this.onSkillCdHandler, this);
        NotificationManager.Instance.addEventListener(BattleNotic.SKILL_ENABLE, this.__skillEnable, this);
        NotificationManager.Instance.addEventListener(BattleNotic.RESTRICT_CHANGED, this.restrictChangedHandler, this);
        NotificationManager.Instance.addEventListener(BattleNotic.RESET_ACTION_TIME, this.__cleanSkillSelect, this);
        ServerDataManager.listen(S2CProtocol.U_B_HERO_ORDER, this, this.__skillUseServerBack);
        ServerDataManager.listen(S2CProtocol.U_B_USE_ITEM_RESULT, this, this.__useBattleItemServerBack);
        ServerDataManager.listen(S2CProtocol.U_C_SEAL_ORDER, this, this.__onRecvSealOrder);
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_SELECTED_PET, this.__updateSelectePet, this);
        NotificationManager.Instance.addEventListener(BattleNotic.SPECIAL_SKILL_ENABLE, this.__specialSkillEnable, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_SELECTED_PET_STATUS, this.updateStatus, this);
        NotificationManager.Instance.addEventListener(BattleNotic.BUFFER_SKILL_ENABLE, this.updateBuffer, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(BattleNotic.PETPK_ACTION_SKILL, this.__skillUse, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.SKILL_CD, this.onSkillCdHandler, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.SKILL_ENABLE, this.__skillEnable, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.RESTRICT_CHANGED, this.restrictChangedHandler, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.RESET_ACTION_TIME, this.__cleanSkillSelect, this);
        ServerDataManager.cancel(S2CProtocol.U_B_HERO_ORDER, this, this.__skillUseServerBack);
        ServerDataManager.cancel(S2CProtocol.U_B_USE_ITEM_RESULT, this, this.__useBattleItemServerBack);
        ServerDataManager.cancel(S2CProtocol.U_C_SEAL_ORDER, this, this.__onRecvSealOrder);
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_SELECTED_PET, this.__updateSelectePet, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.SPECIAL_SKILL_ENABLE, this.__specialSkillEnable, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_SELECTED_PET_STATUS, this.updateStatus, this);
        NotificationManager.Instance.removeEventListener(BattleNotic.BUFFER_SKILL_ENABLE, this.updateBuffer, this);
    }

    private __cleanSkillSelect(event: Event) {
        let rolesDict = BattleManager.Instance.battleMap.rolesDict
        for (const key in rolesDict) {
            if (Object.prototype.hasOwnProperty.call(rolesDict, key)) {
                const roleView: BaseRoleView = rolesDict[key];
                roleView.removeSkillAimFlag();
            }
        }
    }

    /**
     * 客户端使用技能 
     * @param event
     * 
     */
    private __skillUse(data: any) {
        Logger.battle("[SkillItemListController]__skillUse使用技能", data);
        let currentskillId: number = 0;
        let battleId: string = BattleManager.Instance.battleModel.battleId;
        let livingID: number = BattleManager.Instance.battleModel.currentHero.livingId;
        NotificationManager.Instance.sendNotification(BattleNotic.RESET_ACTION_TIME);
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
        }
        BattleManager.Instance.battleModel.defaultSkillCount = 0;
    }

    /**
     * 在英灵身上添加使用技能的图标 
     * @param skillInfo
     * 
     */
    private addSkillUsedFlag(skillInfo: t_s_skilltemplateData) {
        if (!skillInfo) return
        let heroView: BaseRoleView = BattleManager.Instance.getCurrentRoleView();
        // let data = this.battleModel.skillUserInfoDic.get(skillInfo.TemplateId);
        if (heroView && heroView.info && heroView.info.isLiving) {
            heroView.addSkillFlag(skillInfo);
        }
    }
    /**
     * 在英灵身上添加使用符文的图标 
     * @param item
     * 
     */
    private addPropUsedFlag(item: BattlePropItem) {
        if (!item) return;
        let heroView: BaseRoleView = BattleManager.Instance.getCurrentRoleView();
        if (heroView && heroView.info && heroView.info.isLiving) {
            heroView.addSkillFlagByIconPath(IconFactory.getTecIconByIcon(item.getSkillTemplate().Icons));
        }
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
     * 英灵死亡的时候，重置特殊技能的可用性
     */
    private updateStatus(petTemplateId: number) {
        let arr = this.battleModel.skillUserInfoDic.values;
        let hero1: HeroRoleInfo = this.battleModel.getBaseRoleInfoByPetTemplateId(petTemplateId);//死亡的英灵
        let item: any;
        this.view.resetSelect(false);
        for (let i: number = 0; i < arr.length; i++) {
            item = arr[i];
            if (item && hero1 && hero1.petRoleInfo
                && item.livingId == hero1.petRoleInfo.livingId) {
                if (item.isProp) {
                    this.battleModel.hasPropIngUsed = false;
                }
                this.battleModel.skillUserInfoDic.delete(item.skillId);
            }
        }
    }

    private updateBuffer(){
        this.view && this.view.checkIsLockByPetInfo(this.battleModel.currentSelectedPet);
    }

    /**
     * 设置天赋符文技能栏的可用状态 
     * @param event
     */
    private __specialSkillEnable() {
        let restricted: boolean = BattleManager.Instance.battleModel.selfHero.restricted;
        if (!this.view) return
        if (restricted) {
            this.view.setSpecialEnable(false);
            this._useSkillFailed = false;
        }
        else {
            this.view.setSpecialEnable(true);
        }
    }

    /**
     * 设置普通技能栏的可用状态 
     * @param event
     */
    private __skillEnable(data: boolean) {
        let restricted: boolean = BattleManager.Instance.battleModel.selfHero.restricted;
        if (!this.view) return
        if (restricted) {
            this.view.setEnable(false);
            this._useSkillFailed = false;
        }
        else {
            if (data) {
                this.view.setEnable(data);
                if (!data) {
                    this._useSkillFailed = false;
                }
            } else {
                this.view.setEnable(false);
            }
        }
    }

    /**
     * 角色被锁定的状态改变 
     * @param event
     * 
     */
    private restrictChangedHandler(event: NotificationEvent) {
        this.__skillEnable(true);
    }

    /**
     * 服务器返回技能使用结果 
     * @param event
     * 
     */
    private __skillUseServerBack(pkg: PackageIn) {
        let msg = pkg.readBody(HeroOrderMsg) as HeroOrderMsg;
        let mapRoleDic: Dictionary = BattleManager.Instance.battleMap.rolesDict;
        if (!BattleManager.Instance.battleModel.currentHero) return;
        let selfLivingId: number = BattleManager.Instance.battleModel.currentHero.livingId;
        Logger.battle("[SkillItemListController]__skillUseServerBack", msg)
        let roleId: number = msg.heroIndexId;
        let skillId: number = msg.skillId;
        let result: number = msg.result;
        let castTime: number = msg.castTime;
        let qteTime: number = 0;
        let aims: any[] = []
        let aimLen: number = msg.targetIndexs.length;
        for (let i: number = 0; i < aimLen; i++) {
            aims.push(msg.targetIndexs[i]);
        }
        let skillInfo: t_s_skilltemplateData
        let heroView: BaseRoleView;
        let flag: boolean = true;
        if (result == 0) {//服务器返回技能使用成功
            flag = true;
            skillInfo = this.getSkilltemplateDataById(skillId);
            let isSelf = this.isSelfUseSkill(roleId, selfLivingId);
            if (isSelf) {
                Logger.battle("技能使用成功 :  " + skillId);
                BattleManager.Instance.battleModel.currentReadySkillId = skillId;
                heroView = mapRoleDic[selfLivingId];
                if (heroView && heroView.info && heroView.info.isLiving) {
                    // 添加续气效果
                    heroView.addCollectionEffect();
                    this.addSkillUsedFlag(skillInfo);
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
            this._useSkillFailed = true;
            if (this.battleModel.skillUserInfoDic.get(skillId)) {
                let data = this.battleModel.skillUserInfoDic.get(skillId);
                if (data && data.isProp) {
                    this.battleModel.hasPropIngUsed = false;
                }
                this.battleModel.skillUserInfoDic.delete(skillId);
            }
            //失败 移除技能标志
            heroView = mapRoleDic[roleId];
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
            function delayOpenSkillEnable() {
                if (this._useSkillFailed) {
                    this._useSkillFailed = false;
                    if (this.view) {
                        this.view.setEnable(true);
                        this.view.setSpecialEnable(true);
                    }
                }
            }
        }
        if (roleId == selfLivingId) {
            NotificationManager.Instance.sendNotification(NotificationEvent.USE_SKILL_RESULT, { skillId: skillId, result: flag });
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
            let self: HeroRoleInfo;
            let armyInfoHeros = this.battleModel.armyInfoLeft.getHeros;
            let flag:boolean = false;
            for (const key in armyInfoHeros) {
                let hRole: HeroRoleInfo = armyInfoHeros.get(key)
                if (hRole && hRole.petRoleInfo) {
                    if(roleId == hRole.petRoleInfo.livingId){
                        flag = true;
                        self = hRole;
                    }
                }
            }
            if (flag) {
                heroView = BattleManager.Instance.battleMap.rolesDict[self.livingId]
                BattleManager.Instance.battleMap.rolesDict[0];
                let prop: BattlePropItem = this.battleModel.lookHero.getPropByID(msg.tempId);
                if (prop) {
                    BattleManager.Instance.battleModel.currentReadySkillId = prop.skillTempId;
                    prop.useCount = msg.count;
                }
                if (heroView.info && heroView.info.isLiving) {
                    heroView.addCollectionEffect();
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
            this.view.setSpecialEnable(true);
        }
    }

    /**
     *更新战斗中圣印顺序
     */
    protected __onRecvSealOrder(pkg: PackageIn) {
        let msg: SealOrderMsg = pkg.readBody(SealOrderMsg) as SealOrderMsg;
        if (msg) {
            let info = this.getTalentSkillBySontype(msg.sealOrder[0]);
            if (this.skills && this.skills[PetPKSkillItemListView.TalentIndex]) {
                this.skills[PetPKSkillItemListView.TalentIndex] = info;
            }
            this.view.updateTalentSkill(info);
            this.view.startCD(info.TemplateId);
        }
    }

    private getSkillIdByJob(): t_s_skilltemplateData {
        let roleInfo: HeroRoleInfo = BattleManager.Instance.battleModel.selfHero;
        let sontType = roleInfo.talentData.sealOrder[0];
        let array = roleInfo.talentData.lookTalentSkill;
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

    private getTalentSkillBySontype(sontType): t_s_skilltemplateData {
        let roleInfo: HeroRoleInfo = BattleManager.Instance.battleModel.selfHero;
        let array = roleInfo.talentData.lookTalentSkill;
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
     * 根据技能id取得技能模板信息 
     * @param skillId
     * @return 
     * 
     */
    private getSkilltemplateDataById(skillId: number): t_s_skilltemplateData {
        let skillInfo: t_s_skilltemplateData
        let allSkill: any[] = this.skills;
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

    private __updateSelectePet(data: PetData) {
        if (data) {
            if (data.templateId == this.petTemlateId1) {
                this.view.petIndexCtr.selectedIndex = 0;
            } else if (data.templateId == this.petTemlateId2) {
                this.view.petIndexCtr.selectedIndex = 1;
            } else if (data.templateId == this.petTemlateId3) {
                this.view.petIndexCtr.selectedIndex = 2;
            }
            this.view.setSpecialEnable(true);
            this.view.checkIsLockByPetInfo(data);
        }
    }

    private isSelfUseSkill(roleId: number, selfLivingId: number): boolean {
        if (roleId == selfLivingId) {
            return true;
        }
        return false;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel;
    }

    public dispose() {
        this.removeEvent();
        this.view = null;
        this.skills = null;
    }

}