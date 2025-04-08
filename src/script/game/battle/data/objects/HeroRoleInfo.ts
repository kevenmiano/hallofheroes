// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  英雄角色信息
 **/

import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { MovieClip } from "../../../component/MovieClip";
import { ActionMovie } from "../../../component/tools/ActionMovie";
import { t_s_skillbuffertemplateData } from "../../../config/t_s_skillbuffertemplate";
import { ActionLabesType, InheritRoleType, RoleType } from "../../../constant/BattleDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import { RoleEvent } from "../../../constant/event/NotificationEvent";
import { IconType } from "../../../constant/IconType";
import { BattlePropItem } from "../../../datas/BattlePropItem";
import { TalentData } from "../../../datas/playerinfo/TalentData";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { TrailPropInfo } from "../../../datas/TrailPropInfo";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { HeroRoleView } from "../../view/roles/HeroRoleView";
import { BufferDamageData } from "../BufferDamageData";
import { BaseRoleInfo } from "./BaseRoleInfo";
import { PetRoleInfo } from "./PetRoleInfo";

export class HeroRoleInfo extends BaseRoleInfo {
    public inheritType: InheritRoleType = InheritRoleType.Hero

    /** 宠物的livingid 唯一标示宠物 */
    public petLivingId: number = 0;
    /** 变身以后 宠物的技能 */
    public petSkillIds = [];

    public heroInfo: ThaneInfo;
    public pawnTempId: number = 0;
    public consortiaId: number = 0;
    /**
     * 怒气 
     */
    private _sp: number = 0;

    /**
     * 怒气 上限值
     */
    private _spMax: number = 0;
    /**
     * 觉醒值 
     */
    private _awaken: number = 0;
    /**
     * 类型3为boss; 
     */
    public type: number = 0;
    /**
     * 该英雄所隶属的用户的ID 
     */
    public userId: number = 0;
    /**
     * 该英雄所隶属的区服
     */
    public serverName: string = "";

    /**
     * 领主头像ID. 
     */
    public playerIconId: number = 0;
    /**
     * 用于缓存变化后的怒气值. 
     */
    public bufferSp: number = -1;
    /**
     * 用于标记怒气值是否已作出了改变. 
     */
    public spChanged: boolean = false;
    /**
     * 英雄资源路径,
     * 如果是BOSS,根据此值读取,
     * 如果是普通英雄,当此值为""时,按默认规则读取,否则按此值读取 
     */
    public resPath: string = "";
    /**
     * 符文道具 
     */
    public props: any[] = [];

    /**
     * 天赋数据
     */
    public talentData:TalentData;
    /**
     * 试练道具 
     */
    public trialProps: any[];
    private _countDown: boolean;//倒计时

    private _isPetState: boolean;
    public isWaitingChangeBody: boolean = false;
    public useSkill700001: boolean = false;
    public useSkill700002: boolean = false;


    //变身前的3个位置
    public pos_head_hero: Laya.Point;
    public pos_body_hero: Laya.Point;
    public pos_leg_hero: Laya.Point

    public constructor(heroInfo?:ThaneInfo) {
        super();
        this.pos_head_hero = new Laya.Point();
        this.pos_body_hero = new Laya.Point();
        this.pos_leg_hero = new Laya.Point();
        if (heroInfo) {
            this.heroInfo = heroInfo;
        } else {
            this.heroInfo = new ThaneInfo();
        }
    }

    // override 
    public initView(roleview: HeroRoleView) {
        this._roleView = roleview
    }

    public get sp(): number {
        return this._sp;
    }

    public get spMax(): number {
        return this._spMax;
    }

    /**
     * 更新英雄怒气上限 
     * @param value 怒气上限

     * 
     */
    public updateSpMax(value: number) {
        this._spMax = value;
    }

    /**
     * 更新英雄怒气 
     * @param value 新的怒气值
     * @param flyBool 
     * @param increaseBool 是否播放怒气增长时, 飞的动画
     * @param showTipBool
     * @param buffCauseBool
     * 
     */
    public updateSp(value: number,flyBool: boolean = true, increaseBool: boolean = true, showTipBool: boolean = true, buffCauseBool: boolean = false) {
        this._sp = value;
        if (this._sp > this._spMax) {
            this._sp = this._spMax;
        } else if (this._sp <= 0) {
            this._sp = 0;
        }
        this.dispatchEvent(RoleEvent.SP, { sp: value, fly: flyBool, increase: increaseBool, showTip: showTipBool, buffCause: buffCauseBool });
    }

    /**
     * 更新英雄怒气 
     * @param value 新的怒气值
     * @param flyBool 
     * @param increaseBool 是否播放怒气增长时, 飞的动画
     * @param showTipBool
     * @param buffCauseBool
     * 
     */
    public updateAwaken(value: number) {
        if (this._awaken == value) return;
        this._awaken = value;
        if (this._awaken > BattleModel.AWAKEN_FULL_VALUE) {
            this._awaken = BattleModel.AWAKEN_FULL_VALUE;
        } else if (this._awaken <= 0) {
            this._awaken = 0;
        }
        if (this._awaken == 0 && this.isPetState) {
            this.isWaitingChangeBody = true;
        }
        this.dispatchEvent(RoleEvent.AWAKEN, { awaken: value });
    }


    /**
     * 觉醒值 
     * @return 
     * 
     */
    public get awaken(): number {
        return this._awaken;
    }

    // override 
    public set templateId(value: number) {
        this._templateId = value;
        this.heroInfo.templateId = value;
    }

    public get templateId(): number {
        return this._templateId;
    }

    public refreshEffectInfo() {
        this.resPath = this.resPath.toLowerCase()
        if (this.resPath != "" && this.type != RoleType.T_NPC_BOSS) {
            this.effectId = this.resPath;
        } else {
        }
    }

    public get countDown(): boolean {
        return this._countDown;
    }
    // override 
    public update() {
        super.update();
    }
    public set countDown(value: boolean) {
        this._countDown = value;
        this.dispatchEvent(RoleEvent.COUNT_DOWN, value);
    }
    /**
     * 根据试练道具序号, 取得试练道具信息 
     * @param index
     * @return 
     * 
     */
    public getTrialPropInfoByIndex(index: number): TrailPropInfo {
        for (let i = 0; i < this.trialProps.length; i++) {
            const info = this.trialProps[i] as TrailPropInfo;
            if (info.index == index) return info;
        }
        return null;
    }
    /**
     * 根据试练道具id取得试练道具信息 
     * @param id
     * @return 
     * 
     */
    public getTrialPropInfoById(id: number): TrailPropInfo {
        for (let i: number = 0; i < this.trialProps.length; i++) {
            let info: TrailPropInfo = this.trialProps[i];
            if (info.id == id) return info;
        }
        return null;
    }

    // override 
    public set actionMovieClip(value: MovieClip) {
        super.actionMovieClip = value;
    }

    public get actionMovieClip(): MovieClip {
        return super.actionMovieClip
    }

    /**
     * 判断该英雄是否带兵 
     * @return 
     * 
     */
    private hasPawn(): boolean {
        let list: Array<any> = BattleManager.Instance.battleModel.getRoleBySide(this.side)
        for (let index = 0; index < list.length; index++) {
            const mem = list[index];
            // if(mem instanceof PawnRoleInfo){
            if (mem.inheritType == InheritRoleType.Pawn) {
                return true
            }
        }
        return false;
    }
    /**
     * 根据技能模板id取得对应的符文信息 
     * @param id
     * @return 
     */
    public getPropByID(id: number): BattlePropItem {
        for (let index = 0; index < this.props.length; index++) {
            const item = this.props[index];
            if (item.skillTempId == id) return item;
        }
        return null;
    }

    /**
     * 找到宠物信息 
     * @return 
     * 
     */
    public petRoleInfo: PetRoleInfo;

    /**
     * 是否变身 
     */
    public get isPetState(): boolean {
        return this._isPetState;
    }

    /**
     * @private
     */
    public set isPetState(value: boolean) {
        Logger.battle("设置为变身状态 :  " + value);
        if (this._isPetState == value) return;
        this._isPetState = value;

        if (this.petRoleInfo) {
            this.petRoleInfo.visible = true;
            if (this._isPetState || this.bloodA <= 0) {
                this.petRoleInfo.visible = false;
            }
        }

        if (this.view instanceof HeroRoleView) {
            (this.view as HeroRoleView).changeBody();
        }
        this.isWaitingChangeBody = false;
        this.dispatchEvent(RoleEvent.MORPH, value); //切技能栏
        this.dispatchEvent(RoleEvent.BLOOD_CHANGE_S, this);//血量变化
    }

    /**
     * 是否可以变身 
     * @return 
     * 
     */
    public canMorph(): boolean {
        return (this.isPetState == false && this.awaken == BattleModel.AWAKEN_FULL_VALUE)
    }

    public canCancelMorph(): boolean {
        return (this.isPetState == true && this.awaken > 0)
    }
    // override
    public set riveve(value: boolean) {
        super.riveve = value;
        if (value && this.petRoleInfo) {
            if (!this.isPetState) {
                this.petRoleInfo.visible = true;
            }
            this.petRoleInfo.defaultAction = ActionLabesType.STAND;
            this.petRoleInfo.action(ActionLabesType.STAND, ActionMovie.REPEAT);
        }
    }

    // override
    protected die() {
        if (this.petRoleInfo) {
            this.petRoleInfo.visible = false;
        }
        super.die();
    }
    // override
    public get roleName(): string {
        return this.heroInfo.nickName;
    }

    public get level(): number {
        return this.heroInfo.grades;
    }

    public get icon() {
        let iconStr = ""
        if (this.isPetState && this.petRoleInfo) {
            iconStr = IconFactory.getPetHeadItemIcon(this.petRoleInfo.templateId)
        } else {
            if (this.playerIconId == 0) {//如果是非玩家,则使用英雄的icon
                iconStr = IconFactory.getHeroIconByPics(this.heroInfo.templateInfo.Icon);
            } else {//使用领主的icon
                iconStr = IconFactory.getPlayerIcon(this.heroInfo.snsInfo.headId, IconType.HEAD_ICON);
            }
        }
        return iconStr
    }

    /**
     * 没有ICON的buff不展示, 只显示增益减益buff
     * @param buffLeft 偶数位放buff
     */
    public getBuffersWithFiller(buffLeft: boolean = true, isConsortiaBoss: boolean = false): Array<BufferDamageData> {
        let temp: BufferDamageData[] = [];
        let buffs: BufferDamageData[] = [];
        let deBuffs: BufferDamageData[] = [];
        for (let index = 0; index < this.getBuffers().length; index++) {
            let buffer: BufferDamageData = this.getBuffers()[index];
            if (buffer.currentTurn > 0 && buffer.Icon && (buffer.AttackData == 1 || buffer.AttackData == 2)) {
                if (buffer.AttackData == 1) {
                    buffs.push(buffer)
                } else if (buffer.AttackData == 2) {
                    deBuffs.push(buffer)
                }
            }
        }

        if (this.type == 3) {
            let immuneBuffer = this.heroInfo.templateInfo.RejectType;
            for (let j: number = 0; j < immuneBuffer.length; j++) {
                let type = immuneBuffer[j]
                let name = ""
                if (type == BattleModel.ImmuneSlowType) {
                    name = BattleModel.ImmuneSlow
                } else if (type == BattleModel.ImmuneFaintType) {
                    name = BattleModel.ImmuneFaint
                }
                if (name) {
                    let cfg = TempleteManager.Instance.getConfigInfoByConfigName(name)
                    let damageData = new BufferDamageData()
                    damageData.buffName = cfg ? cfg.Description : ""
                    damageData.IconPath = IconFactory.getCommonIconPath("/immune/" + type + ".png");
                    buffs.push(damageData);
                }
            }
        }
        if (!buffLeft && isConsortiaBoss) {
            var str: string = ConsortiaManager.Instance.model.bossInfo.BufferIds;
            if (str) {
                var arr: Array<any> = str.split(",");
                let bufferTempInfo: t_s_skillbuffertemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, arr[0]) as t_s_skillbuffertemplateData;
                if (bufferTempInfo && bufferTempInfo.Icon && bufferTempInfo.Icon.length > 0) {
                    if (bufferTempInfo && bufferTempInfo.Icon) {
                        let bossBuffer: BufferDamageData = new BufferDamageData();
                        bossBuffer.templateId = bufferTempInfo.Id;
                        if (bossBuffer.AttackData == 1) {
                            buffs.push(bossBuffer)
                        } else if (bossBuffer.AttackData == 2) {
                            deBuffs.push(bossBuffer)
                        }
                    }
                }
            }
        }

        let len = Math.max(buffs.length, deBuffs.length) * 2
        for (let index = 0; index < len; index++) {
            let evenNum = (index % 2) == 0

            let evenArr = buffLeft ? buffs : deBuffs
            let oddArr = buffLeft ? deBuffs : buffs
            if (evenNum) {
                let buff = evenArr[index / 2]
                temp.push(buff ? buff : null)
            } else {
                let buff = oddArr[(index - 1) / 2]
                temp.push(buff ? buff : null)
            }
        }
        return temp;
    }
}