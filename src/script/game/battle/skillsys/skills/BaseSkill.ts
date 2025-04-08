/**
* @author:jeremy.xu
* @data: 2020-11-30 11:00
* @description :  技能基类
**/

import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import ResMgr from "../../../../core/res/ResMgr";
import { MovieClip } from "../../../component/MovieClip";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { BattleType, BufferEffectiveType, BufferProcessType, InheritIActionType, InheritRoleType, RoleType } from "../../../constant/BattleDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import { SkillFrameType } from "../../../constant/SkillSysDefine";
import { BattleNotic } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PathManager } from "../../../manager/PathManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { DannyAction } from "../../actions/DannyAction";
import { GameBaseAction } from "../../actions/GameBaseAction";
import { SimpleScriptAction } from "../../actions/common/SimpleScriptAction";
import { AttackData } from "../../data/AttackData";
import { BufferDamageData } from "../../data/BufferDamageData";
import { ResistModel } from "../../data/ResistModel";
import { ResourceModel } from "../../data/ResourceModel";
import { SkillData } from "../../data/SkillData";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { AwakenHandler } from "../../handler/AwakenHandler";
import { BufferHandler } from "../../handler/BufferHandler";
import { SkillProcessStrategy } from "../../handler/SkillProcessStrategy";
import { BattleUtils } from "../../utils/BattleUtils";
import { BaseRoleView } from "../../view/roles/BaseRoleView";
import { BattleEffect } from "../effect/BattleEffect";
import { ProfoundEffect } from "../effect/ProfoundEffect";
import { ProfoundEffectII } from "../effect/ProfoundEffectII";
import { SkillEffect } from "../effect/SkillEffect";
import { ActionTemplateData } from "../mode/ActionTemplateData";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";

export class BaseSkill extends GameBaseAction {
    public inheritType: InheritIActionType = InheritIActionType.BaseSkill

    protected _skillData: SkillData;
    public get skillData(): SkillData {
        return this._skillData
    }
    protected _actionTemplate: ActionTemplateData;
    protected _thisProxy: BaseSkill;
    protected _addBufferFrame: number = -1;
    protected _bufferAdded: boolean = false;
    protected _isPlayer: boolean = false;
    protected _dannyReleased: boolean = false;

    public actionId: number = 0;
    private _started: boolean = false;

    constructor() {
        super()
        this._thisProxy = this;
    }

    public get started(): boolean {
        return this._started;
    }

    public set started(value: boolean) {
        this._started = value;
    }

    /**
     * 设置技能的数据（如伤害目标, 伤害值, 伤害时间等） 
     * @param data
     * 
     */
    public setData(data: SkillData) {
        this._skillData = data;
        this._liftTime = this._skillData.liftTime;
        this._currentRole = this.battleModel.getRoleById(this._skillData.fId);
        if (this._currentRole && (this._currentRole.inheritType == InheritRoleType.Hero) && (this._currentRole as HeroRoleInfo).type != RoleType.T_NPC_BOSS) {
            this._isPlayer = true;
        }
    }

    /**
     *设置动作模板 
     * @param template	模板数据
     */
    public setTemplate(template: ActionTemplateData) {
        this._actionTemplate = template;

        for (let index = 0; index < this._actionTemplate.frames.length; index++) {
            const frame: SkillFrameData = this._actionTemplate.frames[index];
            if (frame.ActionType == SkillFrameType.ADD_DANNY) {
                this._addBufferFrame = frame.Frame;
                break;
            }
        }
    }

    /**
     * 设置技能的处理策略. 
     * @param strategy
     * 
     */
    public setProcessStrategy(strategy: number) {
        this._skillData.processStrategy = strategy;
    }

    /**
     * 准备 
     */
    public prepare() {
        // Logger.log("[BaseSkill]prepare")
        // BattleLogSystem.skillProgress(this, 1);
        if (Laya.stage.isVisibility && this._currentRole.isLoadComplete && (this._skillData.processStrategy == SkillProcessStrategy.NORMAL
            || this._skillData.skillId == 1 || this._skillData.skillId == 2|| this._skillData.skillId == 3 || this._skillData.skillId == 4))
        {
            if ((BattleManager.loginToBattleFlag && (this._skillData.skillId == 1 || this._skillData.skillId == 2))) {
                this.skipFun();
            } else {
                this.beforeRun();
                this.startRun();
                this.bufferProcess();
            }
        } else {
            this.skipFun();
        }
        this.getCurrentRole().refreshBufferTurn();
        this.awakenSoldiers();
    }

    /**
     * 跳过 
     */
    public skipFun() {
        this.beforeRun();
        this.skip();
        this.bufferProcess(true);
        this._started = true;
    }
    /**
     * 是否是命运守护破击技能 
     * @return 
     * 
     */
    private checkNeedPlayAddBufferEffect(): boolean {
        if (!this._skillData.buffers) return

        let bufferList: BufferDamageData[] = this._skillData.buffers;
        for (let index = 0; index < bufferList.length; index++) {
            const info: BufferDamageData = bufferList[index];
            if ((info.AttackType == 28 || info.AttackType == 29)) {
                if (this._skillData.fId == info.bufferUser && this._skillData.fId == info.target) {
                    let bufferTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, String(info.templateId))
                    if (bufferTemp.Random < 100)
                        return true;
                }
                else {
                    Logger.battle("this.checkNeedPlayAddBufferEffect ==== 当前技能使用者与BUFFER对象不符");
                }
            }
        }
        return false;
    }
    /**
     * 被动效果
     */
    protected addPassiveEffectAction() {
        if (this._skillData.skillId == SkillData.PET_UNMORPH_SKILL) return;
        let leftHeroId: number = this.selfHero.livingId;

        let needFlash: boolean;
        let isSelf: boolean = (this._skillData.fId == leftHeroId);

        let playAddBufferEffedt: boolean = this.checkNeedPlayAddBufferEffect();
        needFlash = !((this._currentRole instanceof HeroRoleInfo) && (this._currentRole as HeroRoleInfo).type != 3);
        if (this.battleModel.battleType == BattleType.PET_PK) {
            needFlash = true;
        }
        if (needFlash || isSelf) {
            needFlash = !this.isDefaultSkill();
        }


        if (needFlash || playAddBufferEffedt) {
            let role_f: BaseRoleInfo = this.battleModel.getRoleById(this._skillData.fId);

            let action: SimpleScriptAction = new SimpleScriptAction(this._skillData.liftTime, null, 8);
            action.onPrepare = () => {
                let effect: BattleEffect = new SkillEffect(ResourceModel.PublicSkill_Names[1]);
                let mc = effect.getDisplayObject() as MovieClip
                mc.curCacheName = ResourceModel.PublicSkill_Prefix + ResourceModel.PublicSkill_Names[1] + "/"
                // 挂点在人物中心点
                if (role_f) {
                    let spBodyPos = role_f.getSpecialPos(BaseRoleInfo.POS_BODY)
                    let spLegPos = role_f.getSpecialPos(BaseRoleInfo.POS_LEG)
                    mc.x = spBodyPos.x - spLegPos.x;
                    mc.y = spBodyPos.y - spLegPos.y;
                    // if (mc['fateEffect']) {
                    //     mc['fateEffect'].visible = playAddBufferEffedt;
                    // }
                }

                let rolesDict = BattleManager.Instance.battleMap.rolesDict
                if (rolesDict.has(this._skillData.fId)) {

                    let fullUrl = PathManager.solveSkillPublicResPath(ResourceModel.PublicSkill_Names[1])
                    let resJson = ResMgr.Instance.getRes(fullUrl)
                    if (resJson && resJson.offset && resJson.offset.footX && resJson.offset.footY) {
                        mc.pos_leg = new Laya.Point(Math.floor(resJson.offset.footX), Math.floor(resJson.offset.footY))
                    }

                    let container = (rolesDict.get(this._skillData.fId) as BaseRoleView).effectContainer;
                    container.addEffect(effect);
                }

                if (isSelf) {
                    role_f.map.backGroundToColor2(0.2, 500); //TODO
                }
            }
            role_f.addAction(action);
        }
    }
    /**
     *施法技能准备 
        * 
        */
    private beforeRun() {
        let selfHeroId: number = this.selfHero.livingId;

        if (this._skillData.fId == selfHeroId) {
            NotificationManager.Instance.sendNotification(BattleNotic.RESET_ACTION_TIME);
            if (this._skillData.skillId == SkillData.PET_UNMORPH_SKILL) {
                NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, false);
            }
        }  else {
            if(this.battleModel.isAllPetPKBattle()){
                NotificationManager.Instance.sendNotification(BattleNotic.RESET_ACTION_TIME);
            }
            if (BattleManager.Instance.battleMap) {
                let heroView: BaseRoleView = BattleManager.Instance.battleMap.rolesDict[this._skillData.fId];
                if (heroView) {
                    heroView.removeCollectionEffect();
                    heroView.removeSkillFlag();
                }
            }
        }
        if (this._skillData.skillId != 1 && this._skillData.skillId != 2) {//不是突击和反击
            this.setAimRoleWait()
        }
        this.chkShadowSkill();

        if (this.checkIsHero(this._skillData.fId)) {
            switch (this._skillData.skillId) {
                case 1:
                case 2:
                case 3:
                case 4://突击反击胜利失败不显示;
                    break;
                default://显示技能名
                    let role = this.battleModel.getRoleById(this._skillData.fId);
                    if (!role) { return }
                    if((this.battleModel.isAllPetPKBattle() && role.side == this.selfHero.side && !this.isDefaultSkill())|| (!this.isDefaultSkill() && role == this.selfHero && !this.battleModel.isAllPetPKBattle())){
                        NotificationManager.Instance.sendNotification(BattleNotic.SHOW_SKILL_NAME, this._skillData.skillId);
                    }
                    break;
            }
        }

        this.addSkillBeforeRunCdTime()
    }

    protected startRun() {

    }
    protected skip() {
        let attackData: any[] = this._skillData.data


        let selfCause: boolean;
        if (this.getCurrentRole() == this.selfHero) {
            selfCause = true;
        }

        if (attackData) {
            attackData.forEach((i) => {
                BattleUtils.addSingleDanny(i, 12, true, 0, 0, 0, true, 0x666666, selfCause);
            });
        }
        this.updataSp();
        this.onSkip();
        this.skillComplete();
        // BattleLogSystem.skillDannyFlag(this);
    }
    protected onSkip() {

    }

    /**
     * 将目标对象设置为等待状态. 
     * 
     */
    protected setAimRoleWait() {
        let attackData: any[] = this._skillData.data
        if (!attackData) {
            return;
        }
        attackData.forEach(round => {
            for (let j = 0; j < round.length; j++) {
                let attackData = round[j] as AttackData
                if (!attackData || !attackData.roleId) {
                    return;
                }
                let role: BaseRoleInfo = this.battleModel.getRoleById(attackData.roleId);
                if (!role) {
                    Logger.battle("[BaseSkill]setAimRoleWait未找到角色信息", attackData.roleId)
                    return
                }
                if (role && !role.readyFlag) {
                    // Logger.battle("[BaseSkill]设置对象等待", this._skillData.skillId, this)
                    role.affectedSkill = this;
                }
            }
        });
    }

    /**
     * 取消目标对象的等待状态. 
     * 
     */
    private cancelAimRoleWait() {
        let attackData: any[] = this._skillData.data
        if (!attackData) {
            return;
        }
        attackData.forEach(round => {
            for (let j: number = 0; j < round.length; j++) {
                let attackData = round[j] as AttackData
                if (!attackData || !attackData.roleId) {
                    return;
                }
                let role: BaseRoleInfo = this.battleModel.getRoleById(attackData.roleId);
                if (role && role.affectedSkill == this) {
                    // Logger.battle("[BaseSkill]取消设置对象等待", this._skillData.skillId, this)
                    role.affectedSkill = null;
                }
            }
        });
    }

    /**
     * 更新能量SP. 
     * 
     */
    protected updataSp() {
        this._bufferAdded = true;
        if (this._currentRole)
            BattleUtils.skillUpdateSp(this._skillData, this._currentRole);
    }

    /**
     * 残影 
     */
    public chkShadowSkill(): boolean {
        // if (!this.getCurrentRole()) return false;
        // if (!SharedManager.Instance.shadowEffect) {
        //     ShadowEffectMaker.stopPhantom(this.getCurrentRole().view.body);
        //     return false;
        // }
        // let skillTempInfo: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(this._skillData.skillId);
        // if (skillTempInfo && skillTempInfo.OwnRequirements != "" && this.getCurrentRole().showShadow) {
        //     let arr: any[] = skillTempInfo.OwnRequirements.split(",");
        //     let color: number = arr[0];
        //     let frame: number = arr[1];
        //     if (ShadowEffectMaker.chkEffctObj(this.getCurrentRole().view.body)) {
        //         ShadowEffectMaker.stopPhantom(this.getCurrentRole().view.body);
        //     }
        //     ShadowEffectMaker.startPhantom(this.getCurrentRole().view.body, frame, 0, ShadowTypeEnum.HashMap[color], this.getCurrentRole().view);
        //     return true;
        // }
        return false;
    }

    protected startMoveFun() {
        if (this._currentRole.view) {
            this._currentRole.view.setBloodStripVisible(false);
        }
    }

    protected endMoveFun() {
        if (this._currentRole.view) {
            this._currentRole.view.setBloodStripVisible(true);
        }
    }
    private checkIsHero(fid: number): boolean {
        let heroRoleInfo: HeroRoleInfo = this.battleModel.getRoleById(fid) as HeroRoleInfo;
        return heroRoleInfo == null ? false : true;
    }

    private get selfHero(): HeroRoleInfo {
        return BattleManager.Instance.battleModel.selfHero;
    }

    protected skillComplete() {
        this._dannyReleased = true;
        if (this.battleModel.isAllPetPKBattle()) {
            let idArr = this.getLivingIdArr();
            if(this._skillData.skillId != 1 && this._skillData.skillId != 2 && idArr.indexOf(this._skillData.fId)!=-1){
                let skillTemp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, String(this.battleModel.currentReadySkillId));
                if ((this.battleModel.currentReadySkillId == this._skillData.skillId) || (skillTemp && (this._skillData.skillId == skillTemp.Parameter3))) {
                    this.battleModel.currentReadySkillId = -1;
                }
                if (!this.isDefaultSkill()) {
                    this.battleModel.needUpdatePetLivingId = this._skillData.fId;
                    // Logger.battle("技能放完了 技能id= ",this._skillData.skillId,"  技能名字==",this._skillData.skillTemplate.TemplateNameLang);
                    this.updateSpecial();
                    NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, true);//让技能可选
                    this.sendCDEvent();
                }
                else {
                    this.battleModel.defaultSkillCount++;
                    let count: number = this.battleModel.defaultSkillCount;
                    if (count > 1) {
                        this.battleModel.needUpdatePetLivingId = this._skillData.fId;
                        this.updateSpecial();
                        NotificationManager.Instance.sendNotification(BattleNotic.SPECIAL_SKILL_ENABLE,this._skillData);
                        NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, true);//让技能可选
                    }
                }
            }
        } else if (this._skillData.skillId != 1 && this._skillData.skillId != 2 && this.selfHero.livingId == this._skillData.fId) {//不是突击和反击
            Logger.battle("[BaseSkill]技能使用完成  : " + this._skillData.skillId + "  记录的当前使用技能  : " + this.battleModel.currentReadySkillId);
            let skillTemp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, String(this.battleModel.currentReadySkillId));
            if ((this.battleModel.currentReadySkillId == this._skillData.skillId) || (skillTemp && (this._skillData.skillId == skillTemp.Parameter3))) {
                this.battleModel.currentReadySkillId = -1
            }

            if (!this.isDefaultSkill()) {
                NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, true);//让技能可选
                this.sendCDEvent();
            }
            else {
                this.battleModel.defaultSkillCount++;
                let count: number = this.battleModel.defaultSkillCount;
                if (count > 1) {
                    NotificationManager.Instance.sendNotification(BattleNotic.SKILL_ENABLE, true);//让技能可选
                }
            }
        }

        // if (this._currentRole instanceof HeroRoleInfo) {
        if (this._currentRole && this._currentRole.inheritType == InheritRoleType.Hero) {
            let hero = <HeroRoleInfo>this._currentRole;
            if (this._skillData.skillId == SkillData.PET_UNMORPH_SKILL) {
                hero.isPetState = false;
            }
            else if (this._skillData.skillId == SkillData.PET_MORPH_SKILL) {
                hero.isPetState = true;
            }
        }
        // ShadowEffectMaker.stopPhantom(this.getCurrentRole().view.body);
        this.cancelAimRoleWait();
        this.setArrangePriority(false);
        this.removeSkillBeforeRunCdTime();
        this.finished = true;
    }

    private updateSpecial(){
        if(this.battleModel.skillUserInfoDic.get(this._skillData.skillId)){
            let data = this.battleModel.skillUserInfoDic.get(this._skillData.skillId);
            if(data && data.isProp){
                this.battleModel.hasPropIngUsed = false;
            }
        }
        this.battleModel.skillUserInfoDic.delete(this._skillData.skillId);
        NotificationManager.Instance.sendNotification(BattleNotic.SPECIAL_SKILL_ENABLE,this._skillData);
    }

    private getLivingIdArr():Array<number>{
        let ids:Array<number> = [];
        let armyInfoHeros = this.battleModel.armyInfoLeft.getHeros;
        for (const key in armyInfoHeros) {
            let hRole: HeroRoleInfo = armyInfoHeros.get(key)
            if (hRole && hRole.petRoleInfo) {
                ids.push(hRole.petRoleInfo.livingId);
            }
        }
        return ids;
    }

    private sendCDEvent() {
        if (!this._actionTemplate) {
            return;
        }
        let cdWait: number = 0;
        if (this._skillData.processStrategy != SkillProcessStrategy.NORMAL) {
            cdWait = this._actionTemplate.getCompleteFrameIndex();
            cdWait = cdWait * 40
        }
        let skillId = this._skillData.skillId
        let waitTime = cdWait
        NotificationManager.Instance.sendNotification(BattleNotic.SKILL_CD, { skillId: skillId, waitTime: waitTime })
    }

    public isDefaultSkill(): boolean {
        let skillTempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, String(this._skillData.skillId))
        if (this._skillData.skillId == -1 || (skillTempInfo && skillTempInfo.UseWay == 3)) {
            return true;
        }
        return false;
    }

    /**
     * 处理buffer. 
     * @param skip 是否是跳过技能.用于决定是否要马上施放buffer。值为true时, 总是释放buffer.
     * 
     */
    protected bufferProcess(skip: boolean = false) {
        if (this._skillData.skillId == 3 || this._skillData.skillId == 4) {
            return
        }

        let desc = ""
        let skillTemplate = this._skillData.skillTemplate
        let attackRoleInfo = this.battleModel.getRoleById(this._skillData.fId);
        if (attackRoleInfo && skillTemplate) {
            desc = `😀[BaseSkill]技能准备阶段处理buff: ${attackRoleInfo.roleName}(${attackRoleInfo.livingId})的技能-${skillTemplate.SkillTemplateName}(${skillTemplate.TemplateId}): `
            Logger.battle(desc, this._skillData.buffers)
        }

        let skillBuffers: BufferDamageData[];
        let buffer: BufferDamageData;
        if (this._skillData.buffers && this._skillData.buffers.length > 0) {
            skillBuffers = [];
            for (let i: number = 0; i < this._skillData.buffers.length; i++) {
                buffer = this._skillData.buffers[i];
                if (buffer.processType == BufferProcessType.ADD) {
                    let bufferTempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, String(buffer.templateId))
                    buffer.effectiveType = bufferTempInfo.AddWay;
                }
                if (buffer.effectiveType == BufferEffectiveType.ATTACKWAY_ACTION) {
                    // if (buffer.damages.length > 0) {
                    //     Logger.battle("行动时候处理:" + `${buffer.buffName}(${buffer.templateId})`)
                    // }
                    this.executeBufferAffectives(buffer);
                } else {
                    skillBuffers.push(buffer);
                }
            }
            if (skillBuffers.length > 0) {
                if (this._skillData.data && this._skillData.data.length > 0 && !skip) {
                    // Logger.battle("不跳过技能, 保存供使用", skillBuffers)
                    this._skillData.skillBuffers = skillBuffers;
                } else {
                    // Logger.battle("跳过技能, 处理该技能的所有", skillBuffers)
                    skillBuffers.forEach(buffer => {
                        this.executeBufferAffectives(buffer);
                    });
                }
            }
        }
    }
    protected executeBufferAffectives(buffer: BufferDamageData) {
        if (Logger.openBattleBuff) {
            let battleModel = this.battleModel
            let attackRoleInfo = battleModel.getRoleById(this._skillData.fId);
            let beAttackRoleInfo = battleModel.getRoleById(buffer.target);
            let skillTemplate = this._skillData.skillTemplate
            if (attackRoleInfo && beAttackRoleInfo && skillTemplate) {
                let str = "造成"
                for (let index = 0; index < buffer.damages.length; index++) {
                    const damageData = buffer.getDamageByDannyCount(index);
                    if (damageData) {
                        str += `第${index}次${damageData.damageValue}数值_`
                    }
                }
                str += "<" + buffer.buffName + ">"
                if (buffer.damages.length > 0) {
                    Logger.battle(`[BaseSkill]开始buff处理: ${attackRoleInfo.roleName}(${attackRoleInfo.livingId})的技能-${skillTemplate.SkillTemplateName}(${skillTemplate.TemplateId})对${beAttackRoleInfo.roleName}(${beAttackRoleInfo.livingId})${str}`, buffer)
                }
            }
        }

        if (buffer.damages.length == 0) {
            BufferHandler.processBuffer(buffer, this._skillData.fId, 0);
        } else {
            for (let i: number = 0; i < buffer.damages.length; i++) {//遍历每一次掉血
                BufferHandler.processBuffer(buffer, this._skillData.fId, i);
            }
        }
    }

    protected addBuffer(index: number) {
        if (this._skillData.skillBuffers && this._skillData.skillBuffers.length > 0) {
            for (const key in this._skillData.skillBuffers) {
                if (Object.prototype.hasOwnProperty.call(this._skillData.skillBuffers, key)) {
                    let buffer = this._skillData.skillBuffers[key];
                    if (buffer.effectiveType != BufferEffectiveType.ATTACKWAY_PARRY) {//格挡已经提前执行

                        if (Logger.openBattleBuff) {
                            let battleModel = this.battleModel
                            let attackRoleInfo = battleModel.getRoleById(this._skillData.fId);
                            let beAttackRoleInfo = battleModel.getRoleById(buffer.target);
                            let skillTemplate = this._skillData.skillTemplate
                            if (attackRoleInfo && beAttackRoleInfo && skillTemplate) {
                                let str = ""
                                const damageData = buffer.getDamageByDannyCount(index);
                                if (damageData) {
                                    str = `造成第${index}次${damageData.damageValue}数值`
                                }
                                if (str) {
                                    str += "<" + buffer.buffName + ">"
                                    Logger.battle(`[BaseSkill]保存的buff处理: ${attackRoleInfo.roleName}(${attackRoleInfo.livingId})的技能-${skillTemplate.SkillTemplateName}(${skillTemplate.TemplateId})对${beAttackRoleInfo.roleName}(${beAttackRoleInfo.livingId})${str}`, buffer)
                                }
                            }
                        }

                        BufferHandler.processBuffer(buffer, this._skillData.fId, index);
                    }
                }
            }
        }
    }
    /**
     * 添加格挡buffer 
     * @param index
     */
    protected addParryBuffer(index: number) {

    }

    /**
     * 添加奥义效果. 
     * 
     */
    protected addProfoundEffect() {
        let skillPriority: number = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this._skillData.skillId.toString()).Priority;
        if (skillPriority != 3) return;

        let roleInfo: BaseRoleInfo = this.battleModel.getRoleById(this._skillData.fId)
        if (!roleInfo) {
            Logger.warn("[BaseSkill]addProfoundEffect 播发奥义效果失败", this._skillData.fId)
            return
        }
        let waitAction: SimpleScriptAction;
        let profound: ProfoundEffect;
        let roleView: BaseRoleView;
        waitAction = new SimpleScriptAction();
        waitAction.onPrepare = function () {
            if (this.battleMap) {
                roleView = this.battleMap.rolesDict[roleInfo.livingId] as BaseRoleView
            }
            if (roleView) {
                profound = new ProfoundEffect(roleView, profoundCallback);
            } else {
                profoundCallback();
            }

        }
        roleInfo.addAction(waitAction);

        function profoundCallback() {
            waitAction.finished = true;
        }
    }

    /**
     * 添加英灵奥义 
     * 
     */
    protected addProfoundEffect2() {
        let roleInfo: BaseRoleInfo = this.battleModel.getRoleById(this._skillData.fId);
        if (!roleInfo) {
            Logger.warn("[BaseSkill]addProfoundEffect2 播发奥义效果失败", this._skillData.fId)
            return
        }
        let waitAction: SimpleScriptAction;
        let profound: ProfoundEffectII;
        let roleView: BaseRoleView;
        waitAction = new SimpleScriptAction();
        waitAction.onPrepare = function () {
            if (this.battleMap) {
                roleView = this.battleMap.rolesDict[roleInfo.livingId] as BaseRoleView
            }
            if (roleView) {
                profound = new ProfoundEffectII(roleView, profoundCallback);
            } else {
                profoundCallback();
            }
        }
        roleInfo.addAction(waitAction);

        function profoundCallback() {
            waitAction.finished = true;
        }
    }

    /**
     * 召唤士兵 
     */
    private awakenSoldiers() {
        if (this._skillData.awakens) {
            let role: BaseRoleInfo
            for (let i: number = 0; i < this._skillData.awakens.length; i++) {
                role = this._skillData.awakens[i]
                AwakenHandler.addRole(role);
            }
        }
    }

    /**
     * 设置优先权 
     * @param b
     */
    protected setArrangePriority(b: boolean) {
        let battleMap: Object = BattleManager.Instance.battleMap;
        if (!battleMap) return;
        if (!this.getCurrentRole())
            return;
        let roleview: BaseRoleView = BattleManager.Instance.battleMap.rolesDict[this.getCurrentRole().livingId] as BaseRoleView;
        if (roleview) {
            roleview.setArrangePriority(b);
        }
    }
    /**
     * 技能帧是否匹配当前性别 （性别限制(0,表示仅限女性使用,1表示仅限男性使用,2表示男女通用).
     * @param frame
     * @return 
     */
    protected isFrameSexFit(frame: SkillFrameData): boolean {
        let sex: number
        if (this._isPlayer) {
            sex = (this.getCurrentRole() as HeroRoleInfo).heroInfo.sexs;
            if (frame.Sex != 2 && frame.Sex != sex) {
                return false;
            }
        }
        return true;
    }
    /**
     * 执行剩余攻击动作 
     * @param index 第几次攻击
     * 
     */
    protected actionAttackLeft(index: number) {
        if (this._dannyReleased) {
            return;
        }
        Logger.battle("[BaseSkill]actionAttackLeft index: " + index + "skillId: " + this._skillData.skillId, this._skillData);
        
        let selfCause: boolean;
        if (this.getCurrentRole() == this.selfHero) {
            selfCause = true;
        }
        let battleModel: BattleModel = BattleManager.Instance.battleModel;
        let attackDataArr = this._skillData.data
        if (attackDataArr) {
            for (let i: number = index; i < attackDataArr.length; i++) {
                let attackData: any[] = attackDataArr[i];
                if (!attackData) continue
                let resistModel: ResistModel = BattleManager.Instance.resistModel;
                resistModel.attackOver = false;
                attackData.forEach((element: AttackData) => {
                    new DannyAction(element.roleInfo, element, 12, true, 50, 0, 4, true, 0x666666, true, selfCause, this._skillData.skillId);
                    resistModel.resistTotal += element.resitPercent;

                    let target: any = battleModel.getRoleById(element.roleId);
                    if (target) {
                        resistModel.currentResistSide = (target.side == battleModel.selfSide) ? 1 : 2;
                        resistModel.resistTotal += element.resitPercent;
                        if (battleModel.selfHero.livingId != element.fId && battleModel.selfHero.livingId != element.roleId) {
                            resistModel.resistTotal = 0;
                        }
                    }
                });
                resistModel.attackOver = resistModel.resistTotal != 0;
                this.addBuffer(i);
            }
        }
        this._dannyReleased = true;
        if (!this._bufferAdded) {
            this.updataSp();
        }
        this.skillComplete();
    }

    protected addSkillBeforeRunCdTime() {
        if (this._skillData.skillTemplate) {
            this._skillData.skillTemplate.addSkillBeforeRunCdTime()
        }
    }

    protected removeSkillBeforeRunCdTime() {
        if (this._skillData.skillTemplate) {
            this._skillData.skillTemplate.removeSkillBeforeRunCdTime()
        }
    }

    /**
     *获取当前角色的性别 
     * @return  （2为通用性别）
     */
    public getRoleSex(): number {
        if (!this._isPlayer) {
            return 2;
        }
        return (this.getCurrentRole()).heroInfo.sexs;
    }

    /**
     * 获得当前(执行的)角色. 
     * @return 
     * 
     */
    public getCurrentRole(): any {
        return this._currentRole;
    }
    /**
     * 获得技能的数据(主要是伤害数据). 
     * @return 
     * 
     */
    public getSkillData(): SkillData {
        return this._skillData;
    }
    // 获取动作模板 
    public getActionTemplate(): ActionTemplateData {
        return this._actionTemplate;
    }

    public get battleModel(): BattleModel {
        return BattleManager.Instance.battleModel
    }
}