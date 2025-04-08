// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 普通动作类型的技能类.
 * 该类用于处理包含"施法+受击","远程（全攻）","移动+攻击+移动"等普通类型的动作.
 **/

import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import { BufferEffectiveType, InheritIActionType } from "../../../constant/BattleDefine";
import { ConfigType } from "../../../constant/ConfigDefine";
import { SkillFrameType } from "../../../constant/SkillSysDefine";
import { SimpleScriptAction } from "../../actions/common/SimpleScriptAction";
import { BattleManager } from "../../BattleManager";
import { BufferDamageData } from "../../data/BufferDamageData";
import { BufferHandler } from "../../handler/BufferHandler";
import { SkillFrameExecuter } from "../executer/SkillFrameExecuter";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";
import { BaseSkill } from "./BaseSkill";
import { MoveBackContext } from "./move/MoveBackContext";
import { MoveForwardContext } from "./move/MoveForwardContext";


export class CommonActionSkill extends BaseSkill {
    public inheritType: InheritIActionType = InheritIActionType.CommonActionSkill

    private _dannyCount: number = 0;
    constructor() {
        super();
    }
    protected startRun() {
        if (!this.getCurrentRole().isLiving && this._skillData.skillId != 103) {
            this.actionAttackLeft(0);
            return;
        }

        this.addPassiveEffectAction();

        this.addMoveForwardAction();

        this.addSkillPreEffect();

        this._currentRole.addAction(this.createAttackAction());

        this.addMoveBackAction();

    }

    /**
     * 添加技能前置特效 奥义
     * 
     */
    private addSkillPreEffect() {
        let skillPriority: number = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this._skillData.skillId.toString()).Priority;
        switch (skillPriority) {
            case 3:
                this.addProfoundEffect();
                break;
            case 4:
                this.addProfoundEffect2();
                break;
            default:
                break;
        }
    }

    /**
     * 添加向前移动动作. 
     */
    private addMoveForwardAction() {
        let mf: MoveForwardContext = new MoveForwardContext(this, this.startMoveFun, this.endMoveFun);
        mf.execute();
    }

    /**
     * 添加回退移动动作. 
     */
    private addMoveBackAction() {
        let mb: MoveBackContext = new MoveBackContext(this, this.startMoveFun, this.endMoveFun);
        mb.execute();
    }

    /**
     * 创始攻击动作. 
     */
    private createAttackAction(): SimpleScriptAction {
        let actionScript: SimpleScriptAction = new SimpleScriptAction(this._skillData.liftTime, this.skillComplete.bind(this));
        actionScript.onPrepare = () => {
            if (!this.getCurrentRole().isLiving) {
                actionScript.finished = true;
                this.actionAttackLeft(0);
                return;
            }
            for (let index = 0; index < this._actionTemplate.frames.length; index++) {
                const frame: SkillFrameData = this._actionTemplate.frames[index];
                if (frame.Frame == 0) {
                    // if(!this.isFrameSexFit(frame)){
                    //     continue;
                    // }
                    SkillFrameExecuter.execute(this._thisProxy, frame, actionScript);
                    if (!this._bufferAdded && this._addBufferFrame == 0) {
                        this.updataSp();
                        this.addBuffer(0);
                    }
                }
            }
            this.setArrangePriority(true);
        }

        actionScript.onUpdate = () => {
            this.started = true;
            if (!this.getCurrentRole().isLiving) {
                actionScript.finished = true;
                this.actionAttackLeft(this._dannyCount + 1);
                return;
            }

            for (let index = 0; index < this._actionTemplate.frames.length; index++) {
                const frame = this._actionTemplate.frames[index];
                // if(!this.isFrameSexFit(frame))
                //     continue;

                if (frame.Frame == actionScript.frameCount) {
                    if ((frame.ActionType == SkillFrameType.ADD_DANNY) || (frame.ActionType == SkillFrameType.SHOOT) || (frame.ActionType == SkillFrameType.SHOOT2)) {
                        //受伤执行格挡buffer, 格挡为第一次受伤时播放, 所以单独提出
                        this.addParryBuffer(frame.effectData.count);
                    }

                    SkillFrameExecuter.execute(this._thisProxy, frame, actionScript);

                    if ((frame.ActionType == SkillFrameType.ADD_DANNY) || (frame.ActionType == SkillFrameType.SHOOT) || (frame.ActionType == SkillFrameType.SHOOT2)) {
                        //受伤执行第" + frame.effectData.count + "次受伤的buffer
                        Logger.battle("[CommonActionSkill]createAttackAction.onUpdate", frame.effectData.count, frame)
                        this.addBuffer(frame.effectData.count);
                        this._dannyCount = frame.effectData.count;
                    }
                }
                if (!this._bufferAdded && this._addBufferFrame == actionScript.frameCount) {
                    this.updataSp();
                }

            }
            // BattleLogSystem.skillProgress(_thisProxy, 3+actionScript.frameCount);
        }

        return actionScript;
    }

    protected addParryBuffer(index: number) {
        if (index > 0) {
            return;
        }
        if (this._skillData.skillBuffers && this._skillData.skillBuffers.length > 0) {
            this._skillData.skillBuffers.forEach((buffer: BufferDamageData) => {
                if (buffer.effectiveType == BufferEffectiveType.ATTACKWAY_PARRY) {

                    if (Logger.openBattleBuff) {
                        let battleModel = BattleManager.Instance.battleModel
                        let attackRoleInfo = battleModel.getRoleById(this._skillData.fId);
                        let beAttackRoleInfo = battleModel.getRoleById(buffer.target);
                        let skillTemplate = this._skillData.skillTemplate
                        if (attackRoleInfo && beAttackRoleInfo && skillTemplate) {
                            let str = "无伤害"
                            const damageData = buffer.getDamageByDannyCount(index);
                            if (damageData) {
                                str = `第${index}次${damageData.damageValue}伤害`
                            }
                            Logger.battle(`[CommonActionSkill]格挡时候${attackRoleInfo.roleName}(${attackRoleInfo.livingId})的技能${skillTemplate.SkillTemplateName}(${skillTemplate.TemplateId})对
                            ${beAttackRoleInfo.roleName}(${beAttackRoleInfo.livingId})造成${str}`)
                        }
                    }

                    BufferHandler.processBuffer(buffer, this._skillData.fId, index);
                }
            });
        }
    }
}