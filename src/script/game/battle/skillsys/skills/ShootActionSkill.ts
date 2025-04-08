// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description 射箭类动作的技能类.
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
import { BundleShootFrameExecuter } from "../executer/BundleShootFrameExecuter";
import { ShootFrameExecuter } from "../executer/ShootFrameExecuter";
import { SkillFrameExecuter } from "../executer/SkillFrameExecuter";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";
import { BaseSkill } from "./BaseSkill";

export class ShootActionSkill extends BaseSkill {
    public inheritType: InheritIActionType = InheritIActionType.ShootActionSkill

    private _shootCount: number = 0;  //记录射击次数   
    private _damageIndex: number = 0; //获取SkillData所用
    private _copyFrameData: any[] = [];

    protected startRun() {
        if (!this.getCurrentRole().isLiving) {
            this.actionAttackLeft(0);
            return;
        }

        this.createCopyFrameData();
        this.addPassiveEffectAction();
        this.addSkillPreEffect();
        this._currentRole.addAction(this.createShootAction());
    }

    private addSkillPreEffect() {
        let skillPriority: number = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, String(this._skillData.skillId)).Priority;
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

    private createCopyFrameData() {
        let sourceFrameData: any[] = [];
        let cFrame: SkillFrameData

        if (this._actionTemplate.shootTime > 0 && this._actionTemplate.shootTime < this.getSkillData().data.length) {
            this._actionTemplate.frames.forEach(frame => {
                if (frame.shootData) {
                    sourceFrameData.push(frame);
                }
            });
            sourceFrameData.forEach(frame => {
                cFrame = frame.clone();
                cFrame.Frame += 8;
                cFrame.Frame2 += 8;
                this._copyFrameData.push(cFrame);
            });
        }
    }

    private createShootAction(): SimpleScriptAction {
        let actionScript: SimpleScriptAction = new SimpleScriptAction(this._skillData.liftTime, this.skillComplete.bind(this));

        let shootComplete = () => {
            this.addParryBuffer(this._shootCount);
            this.addBuffer(this._shootCount);
            this._shootCount++;
            if (this._shootCount == 1) {
                this.updataSp();
            }

            if (this._shootCount >= this._actionTemplate.shootTime + this._copyFrameData.length) {
                actionScript.finish();
            }
        }

        actionScript.onPrepare = () => {
            if (!this.getCurrentRole().isLiving) {
                actionScript.finished = true;
                this.actionAttackLeft(0);
                return;
            }
            for (let index = 0; index < this._actionTemplate.frames.length; index++) {
                const frame = this._actionTemplate.frames[index];
                if (frame.Frame == 0) {
                    // if(!this.isFrameSexFit(frame)){
                    //     continue;
                    // }
                    SkillFrameExecuter.execute(this._thisProxy, frame, actionScript);
                }
                this.setArrangePriority(true);
            }
        }

        actionScript.onUpdate = () => {
            this.started = true;
            let frame: SkillFrameData
            let tempFrame: number = 0;
            if (!this.getCurrentRole().isLiving) {
                actionScript.finished = true;
                this.actionAttackLeft(this._damageIndex);
                return;
            }

            for (let index = 0; index < this._actionTemplate.frames.length; index++) {
                frame = this._actionTemplate.frames[index];
                tempFrame = frame.Frame

                if (tempFrame == actionScript.frameCount) {
                    if (frame.shootData) {
                        this.shootFrameExecute(frame, this._damageIndex, shootComplete);
                        this._damageIndex++;
                    }
                    else {
                        SkillFrameExecuter.execute(this._thisProxy, frame, actionScript);
                    }
                }
            }
            for (let index = 0; index < this._copyFrameData.length; index++) {
                frame = this._copyFrameData[index];
                tempFrame = frame.Frame
                if (tempFrame == actionScript.frameCount) {
                    this.shootFrameExecute(frame, this._damageIndex, shootComplete);
                    this._damageIndex++;
                }
            }
        }

        return actionScript;
    }

    protected shootFrameExecute(frameData: SkillFrameData, damageIndex: number, completeFun: Function) {
        if (frameData.ActionType == SkillFrameType.SHOOT2) {
            new BundleShootFrameExecuter(this, frameData, damageIndex, completeFun);
        } else {
            new ShootFrameExecuter(this, frameData, damageIndex, completeFun);
        }
    }

    protected addParryBuffer(index: number) {
        if (index > 0) return;

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
                            Logger.battle(`[ShootActionSkill]格挡时候${attackRoleInfo.roleName}(${attackRoleInfo.livingId})的技能${skillTemplate.SkillTemplateName}(${skillTemplate.TemplateId})对
                            ${beAttackRoleInfo.roleName}(${beAttackRoleInfo.livingId})造成${str}`)
                        }
                    }
                    
                    BufferHandler.processBuffer(buffer, this._skillData.fId, index);
                }
            });
        }
    }
}
