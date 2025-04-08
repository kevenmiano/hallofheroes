/**
* @author:jeremy.xu
* @data: 2020-11-23 10:00
* @description 技能帧执行者.
* 此类用于执行技能中的每一个技能帧数据.该相应的数据转变为技能的可视效果.
* 外部主要通过调用静态方法execute来播放技能.
**/

import Logger from "../../../../core/logger/Logger";
import { ActionMovie } from "../../../component/tools/ActionMovie";
import { ActionLabesType, FaceType, InheritRoleType } from "../../../constant/BattleDefine";
import { SkillFrameType } from "../../../constant/SkillSysDefine";
import { SharedManager } from "../../../manager/SharedManager";
import { SimpleScriptAction } from "../../actions/common/SimpleScriptAction";
import { DisplacementAction } from "../../actions/DisplacementAction";
import { HideRoleAction } from "../../actions/HideRoleAction";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { AttackData } from "../../data/AttackData";
import { DannyEffectData } from "../../data/DannyEffectData";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { RoleActionSimplifyData } from "../../data/RoleActionSimplifyData";
// import { PetRoleInfo } from "../../data/objects/PetRoleInfo";
import { SkillData } from "../../data/SkillData";
import { BattleUtils } from "../../utils/BattleUtils";
import { SkillEffect } from "../effect/SkillEffect";
import { EffectFrameData, ColorTransformFrameData } from "../mode/framedata/FrameDatas";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";
import { BaseSkill } from "../skills/BaseSkill";
import { SkillSystem } from "../SkillSystem";

export class SkillFrameExecuter {
    private _skill: BaseSkill;
    private _frameData: SkillFrameData
    private _action: SimpleScriptAction;

    private _currentRole: any;//BaseRoleInfo
    private _attackData: any[];


    constructor(skill: BaseSkill, frameData: SkillFrameData, action: SimpleScriptAction) {
        this._skill = skill;
        this._frameData = frameData;
        this._action = action;

        this._currentRole = skill.getCurrentRole();
        this._attackData = skill.getSkillData().data;
    }

    /**
        * 执行技能. 
        * @param skill
        * @param frameData
        * @param action
        * 
        */
    public static execute(skill: BaseSkill, frameData: SkillFrameData, action: SimpleScriptAction) {
        let executer: SkillFrameExecuter = new SkillFrameExecuter(skill, frameData, action);

        executer.run();
    }

    /**
        * 执行技能. 
        * 
        */
    private run() {
        switch (this._frameData.ActionType) {
            case SkillFrameType.PLAY_ATTACK_ACTION: //1攻击动作
                this.playAttackAction();
                break;
            case SkillFrameType.ADD_RELEASE_EFFECT: //2添加施法效果
                this.addReleaseEffect();
                break;
            case SkillFrameType.ADD_DANNY:
                this.addDanny();
                break;
            case SkillFrameType.ZOOM:
                this.zoomMap();
                break;
            case SkillFrameType.GAS_EFFECT:
                this.addGasEffect();
                break;
            case SkillFrameType.BG_COLOR:
                this.playBgColorEffect();
                break;
            case SkillFrameType.BG_SHOCK:
                this.playBgShockEffect();
                break;
            case SkillFrameType.FINISH:
                this.finish();
                break;
            case SkillFrameType.DISPLACEMENT_FORWARD:
                this.displacementForward()
                break;
            case SkillFrameType.DISPLACEMENT_BACK:
                this.displacementBack()
                break;
            case SkillFrameType.HIDE:
                this.hideRole();
                break;
        }
    }
    /**
        * 播放攻击动作. 
        * 
        */
    private playAttackAction() {
        SkillSystem.playSound(this._frameData.attackSound, "攻击")

        let delayFrame = 12
        let attackFrameLabel: string = this._frameData.attackLabel; //ActionLabesType.ATTACK + this._frameData.attackNum
        let roleView = this._currentRole && this._currentRole.getRoleView()
        if (RoleActionSimplifyData.isSimplify(roleView && roleView.rolePartUrlPath)) {
            let actionTemplate = this._skill.getActionTemplate()
            if (actionTemplate) {
                Logger.battle("[SkillFrameExecuter]playAttackAction", actionTemplate.ActionId, actionTemplate.frames)
                delayFrame = actionTemplate.getCompleteFrameIndex() - this._frameData.Frame;
            }
            this._currentRole.action(attackFrameLabel, ActionMovie.WAIT_AND_GOTO, ActionLabesType.STAND, delayFrame);
        } else {
            this._currentRole.action(attackFrameLabel, ActionMovie.WAIT_AND_GOTO, ActionLabesType.STAND, delayFrame);
        }
    }

    /**
        * 添加施法效果. 
        * 
        */
    private addReleaseEffect() {
        this.addEffect(false);
    }

    /**
        * 添加气浪效果 
        * 
        */
    private addGasEffect() {
        this.addEffect(true);
    }

    private addEffect(isGas: boolean = false) {
        SkillSystem.playSound(this._frameData.effectData.soundRes, "特效");

        let effectName: string = this._frameData.effectData.effectRes;
        let effect: SkillEffect = new SkillEffect(effectName);
        let mc = effect.getDisplayObject()
        if (this._frameData.effectData.type == EffectFrameData.TYPE_ROLE) {
            if (isGas) {
                // 角色容器坐标点 + 特效的表格配置点
                mc.x = this._currentRole.point.x + this._frameData.effectData.posX
                mc.y = this._currentRole.point.y + this._frameData.effectData.posY;
                this._currentRole.map.addGasEffect(effect);
            } else {
                mc.x = this._frameData.effectData.posX;
                mc.y = this._frameData.effectData.posY;
                this._currentRole.view.addEffect(effect, 1, this._frameData.effectData.arrange);
            }

            Logger.battle(`[SkillFrameExecuter]${this._currentRole.roleName}(${this._currentRole.livingId})自身的特效: ${effectName}`)
        } else if (this._frameData.effectData.type == EffectFrameData.TYPE_MAP) {
            let targetPos: number = this._frameData.effectData.target
            if (targetPos == 0) {//
                targetPos = 5;
            }
            let isLeft = this._currentRole.face == FaceType.RIGHT_TEAM ? true : false;
            let pt = BattleUtils.getPosition(isLeft ? FaceType.LEFT_TEAM : FaceType.RIGHT_TEAM, targetPos)

            mc.scaleX = isLeft ? -1 : 1;
            mc.x = pt.x + this._frameData.effectData.posX;
            mc.y = pt.y + this._frameData.effectData.posY;

            if (isGas) {
                this._currentRole.map.addGasEffect(effect);
            } else {
                if (this._currentRole && this._currentRole.map) {
                    this._currentRole.map.addEffect(effect, 1, this._frameData.effectData.arrange);
                }
            }

            Logger.battle(`[SkillFrameExecuter]对地图添加${this._currentRole.roleName}(${this._currentRole.livingId})的特效: ${effectName}`)
        } else if (this._frameData.effectData.type == EffectFrameData.TYPE_TARGET) {
            let battleModel: BattleModel = BattleManager.Instance.battleModel;
            let singelAttackArr: any[] = this._attackData[0]

            let str = ""
            for (let j: number = 0; j < singelAttackArr.length; j++) {
                let command: AttackData = (singelAttackArr[j] as AttackData);
                let role: any = battleModel.getRoleById(command.roleId);
                if (role) {
                    str += `${role.roleName}(${command.fId})_`
                }
                // 角色容器坐标点 + 特效的表格配置点
                if (role && SharedManager.Instance.allowAttactedEffect) {
                    if (isGas && role.map) {
                        mc.x = role.point.x + this._frameData.effectData.posX
                        mc.y = role.point.y + this._frameData.effectData.posY
                        role.map.addGasEffect(effect);
                    } else if (role.view) {
                        mc.x = this._frameData.effectData.posX;
                        mc.y = this._frameData.effectData.posY;
                        role.view.addEffect(effect, 1, this._frameData.effectData.arrange);
                    }
                }
            }

            Logger.battle(`[SkillFrameExecuter]对受击角色${str}添加${this._currentRole.roleName}(${this._currentRole.livingId})的特效: ${effectName}`)
        }
    }

    /**
        * 背景变色. 
        * 
        */
    private playBgColorEffect() {
        let frameData: ColorTransformFrameData = this._frameData.bgColorData;
        SkillSystem.playSound(frameData.soundRes);
        this._currentRole.map.backGroundToColor(frameData.color, frameData.tweenTime,
            frameData.stopTime, frameData.atOnceBool, frameData.isReduce);
    }

    private playBgShockEffect() {
        SkillSystem.playSound(this._frameData.bgShockData.soundRes);
        this._currentRole.map.shakeScreen(this._frameData.bgShockData.time, this._frameData.bgShockData.range);
    }

    /**
        * 添加受伤指令 
        * 
        */
    private addDanny() {
        SkillSystem.playSound(this._frameData.effectData.soundRes, "受伤")

        let selfCause: boolean
        if (this._skill.getCurrentRole() == BattleManager.Instance.battleModel.selfHero) {
            selfCause = true;
        }
        if (this._skill.actionId == SkillData.PET_MORPH_SKILL) {
            this.morph();//敌人受伤的同时变身
        } else if (this._skill.actionId == SkillData.PET_UNMORPH_SKILL) {
            this.unMorph();
        }

        let effectData = this._frameData.effectData
        let singelAttackArr = this._attackData[effectData.count]
        if (effectData.effectRes && effectData.effectRes.length > 1) {
            Logger.battle("[SkillFrameExecuter]受击者身上的特效", effectData.effectRes, singelAttackArr)

            let effectObject = new DannyEffectData();
            effectObject.effect = effectData.effectRes
            effectObject.x = effectData.posX
            effectObject.y = effectData.posY
            BattleUtils.addSingleDannyTakeEffect(singelAttackArr, effectObject, 12, true,
                effectData.backDistance, 0, 4, true, 0x666666, true, selfCause, effectData.delayBleed, this._skill.getSkillData().skillId);
        } else {
            BattleUtils.addSingleDanny(singelAttackArr, 12, true,
                effectData.backDistance, 0, 4, true, 0x666666, true, selfCause, effectData.delayBleed, this._skill.getSkillData().skillId);
        }
    }

    /**
        * 变身指令 
        * 
        */
    private morph() {
        // if (this._skill.getCurrentRole() instanceof HeroRoleInfo) {
        if (this._skill.getCurrentRole().inheritType == InheritRoleType.Hero) {
            let hero = this._skill.getCurrentRole() as HeroRoleInfo;
            let pet = hero.petRoleInfo;

            if (hero && pet) {
                hero.isPetState = true;
            } else {
                Logger.battle("变身异常。。。")
            }
        }
    }

    private unMorph() {
        if (this._skill.getCurrentRole().inheritType == InheritRoleType.Hero) {
            let hero = this._skill.getCurrentRole() as HeroRoleInfo;
            let pet = hero.petRoleInfo;

            if (hero && pet) {
                hero.isPetState = false; //切换状态
            } else {
                Logger.battle("取消变身异常。。。")
            }
        }
    }

    /**
        * 缩放地图. 
        * 
        */
    private zoomMap() {
        SkillSystem.playSound(this._frameData.zoomData.soundRes)

        TweenLite.to(this._currentRole.map, this._frameData.zoomData.zoomTime, { zoom: this._frameData.zoomData.zoom, overwrite: 0, onComplete: zoomInComplete });

        if (this._frameData.zoomData.zoomType == 1) {
            let point = (new Laya.Point()).copy(this._currentRole.point)
            point.x += this._frameData.zoomData.posX
            point.y += this._frameData.zoomData.posY
            this._currentRole.map.setCamera(point, this._frameData.zoomData.zoomTime);
        }

        function zoomInComplete() {
            if (this._frameData.zoomData.stopTime > 0) {
                setTimeout(this.backZoomStart.bind(this), this._frameData.zoomData.stopTime * 1000);
            } else {
                this.backZoomStart();
            }


        }
    }
    private backZoomStart() {
        // TweenLite.to(this._currentRole.map,this._frameData.zoomData.backTime,{zoom:1,overwrite:0});
        // this._currentRole.map.setCamera(new Laya.Point(NoviceReinforceHandler.CAMERA_X,NoviceReinforceHandler.CAMERA_Y),this._frameData.zoomData.backTime);
    }
    private displacementForward() {
        SkillSystem.playSound(this._frameData.displacementForward.soundRes);
        new DisplacementAction(this._currentRole, this._frameData.displacementForward, this._skill)
    }
    private displacementBack() {
        SkillSystem.playSound(this._frameData.displacementBack.soundRes);
        new DisplacementAction(this._currentRole, this._frameData.displacementBack, this._skill)
    }
    private hideRole() {
        SkillSystem.playSound(this._frameData.hideData.soundRes);

        if (this._frameData.hideData.target == 0) {//0代表受击方
            let singelAttackArr: any[] = this._attackData[0]
            for (let j: number = 0; j < singelAttackArr.length; j++) {
                let command: AttackData = (singelAttackArr[j] as AttackData);
                let role: any = BattleManager.Instance.battleModel.getRoleById(command.roleId);
                if (role) {
                    new HideRoleAction(role, this._frameData.hideData);
                }
            }
        } else {//1代表自己
            new HideRoleAction(this._currentRole, this._frameData.hideData);
        }
    }

    /**
    * 添加完成指令 
    */
    private finish() {
        if (this._action) {
            this._action.finish();
        }
    }
}