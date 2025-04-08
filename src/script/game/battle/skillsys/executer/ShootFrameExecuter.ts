// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description 技能帧执行者(射击类).
 **/

import Logger from "../../../../core/logger/Logger";
import { MovieClip } from "../../../component/MovieClip";
import { DannyAction } from "../../actions/DannyAction";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { AttackData } from "../../data/AttackData";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { ResistModel } from "../../data/ResistModel";
import { BaseRoleView } from "../../view/roles/BaseRoleView";
import { ArrowSkillEffect } from "../effect/ArrowSkillEffect";
import { BattleEffect } from "../effect/BattleEffect";
import { SkillEffect } from "../effect/SkillEffect";
import { ShootFrameData } from "../mode/framedata/FrameDatas";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";
import { RipplePreCreater } from "../ripple/RipplePreCreater";
import { BaseSkill } from "../skills/BaseSkill";
import { SkillSystem } from "../SkillSystem";

export class ShootFrameExecuter {
    private _skill: BaseSkill;
    private _frameData: SkillFrameData;
    private _attackIndex: number = 0;
    private _completeFun: Function;

    private _shootCount: number = 0;
    private _startPoint: Laya.Point;
    private _attackData: any[];

    constructor(skill: BaseSkill, frameData: SkillFrameData, attackIndex: number, completeFun: Function) {
        this._skill = skill;
        this._frameData = frameData;
        this._attackIndex = attackIndex;
        this._completeFun = completeFun;

        this._startPoint = new Laya.Point(0, -85);
        this._attackData = this._skill.getSkillData().data[this._attackIndex]

        this.execute();
    }
    private execute() {
        let flyTime: number = 0;

        if (this._frameData && this._frameData.shootData.rippleRes && this._frameData.shootData.rippleRes != "") {
            RipplePreCreater.addRippleId(this._frameData.shootData.rippleRes);
        }
        this._attackData.forEach(element => {
            //BaseRoleInfo
            let target = BattleManager.Instance.battleModel.getRoleById(element.roleId);
            if (!target) {
                Logger.warn("[ShootFrameExecuter] 受击目标不存在", element.roleId, element.roleName)
                return
            }

            let attackRole = BattleManager.Instance.battleModel.getRoleById(element.fId);
            if (attackRole) {
                Logger.battle(`[ShootFrameExecuter]${attackRole.roleName}(${attackRole.livingId})对${target.roleName}(${target.livingId})添加射箭特效: ${this._frameData.shootData.arrowRes}`)
            }

            let arrowRes = this._frameData.shootData.arrowRes
            let arrow: ArrowSkillEffect = new ArrowSkillEffect(arrowRes);
            this._skill.getCurrentRole().map.effectContainer.addEffect(arrow, -1);
            arrow.startPoint = new Laya.Point();
            arrow.travelPoints = [];
            arrow.travelPoints.push(arrow.startPoint);
            arrow.lastPoint = arrow.startPoint;

            let movie = arrow.getDisplayObject();
            if (!movie) {
                Logger.warn("[ShootFrameExecuter] ArrowSkillEffect不存在", arrowRes)
                this.onHit(arrow, target)
                return
            }

            arrow.startPoint.x = movie.x = this._skill.getCurrentRole().point.x + this._startPoint.x;
            arrow.startPoint.y = movie.y = this._skill.getCurrentRole().point.y + this._startPoint.y;

            let distance: number = arrow.startPoint.distance(target.point.x, target.point.y)
            flyTime = distance / (this._frameData.shootData.speed * 25) * 1000;

            if (this._frameData.shootData.flyType == ShootFrameData.FLY_TYPE_COMMON) {
                // TweenMax.to(movie, flyTime, {
                //     bezier: [{ x: target.point.x, y: target.point.y - 70 }], orientToBezier: true,
                //     onCompleteParams: [arrow, target], onComplete: this.onHit, ease: Linear.easeNone,
                //     onUpdate: this.onArrowUpate, onUpdateParams: [arrow]
                // });
                Laya.Tween.to(movie, { x: target.point.x, y: target.point.y - 70, update: new Laya.Handler(this, this.onArrowUpate, [arrow]) },
                    flyTime, Laya.Ease.linearIn, Laya.Handler.create(this, this.onHit, [arrow, target]))
            } else { //TODO  X方向匀速  Y先匀减速后匀加速  实现抛物线
                // let minPoint:Point = Point.interpolate(arrow.startPoint,target.point,0.5);
                let x = arrow.startPoint.x + (arrow.startPoint.x - target.point.x) / 2
                let y = arrow.startPoint.y + (arrow.startPoint.y - target.point.y) / 2
                let minPoint: Laya.Point = new Laya.Point(x, y)
                // let curve: number = distance / 1000 * this._frameData.shootData.curve
                // TweenMax.to(movie, flyTime,
                //     {
                //         bezier: [{ x: minPoint.x, y: minPoint.y + curve }, { x: target.point.x, y: target.point.y - 100 }],
                //         orientToBezier: true,
                //         onCompleteParams: [arrow, target], onComplete: this.onHit, ease: Linear.easeNone,
                //         onUpdate: this.onArrowUpate, onUpdateParams: [arrow]
                //     });

                // 先这样替代
                let curve: number = this._frameData.shootData.curve
                minPoint.y = minPoint.y < arrow.startPoint.y ? arrow.startPoint.y : minPoint.y
                minPoint.y -= curve
                Laya.Tween.to(movie, { y: minPoint.y }, flyTime / 2, Laya.Ease.bounceOut)
                Laya.timer.once(flyTime / 2, this, () => {
                    Laya.Tween.to(movie, { y: target.point.y }, flyTime / 2, Laya.Ease.bounceIn)
                })
                Laya.Tween.to(movie, { x: target.point.x, update: new Laya.Handler(this, this.onArrowUpate, [arrow]) },
                    flyTime, Laya.Ease.linearIn, Laya.Handler.create(this, this.onHit, [arrow, target]))
            }
        });
    }
    private onArrowUpate(arrow: ArrowSkillEffect) {
        if (this._frameData && this._frameData.shootData && this._frameData.shootData.rippleRes && this._frameData.shootData.rippleRes != "") {
            let currentCount: number = this.getCurrentRipple(arrow);
            let pos: Laya.Point;
            if (arrow.rippleCount < currentCount) {
                for (let i: number = arrow.rippleCount + 1; i <= currentCount; i++) {
                    let mc: MovieClip = BattleManager.Instance.resourceModel.getEffectMC(this._frameData.shootData.rippleRes) as MovieClip;
                    if (mc) {
                        pos = this.getRipplePos(arrow, i);
                        mc.blendMode = "screen";
                        mc.x = pos.x;
                        mc.y = pos.y;

                        this._skill.getCurrentRole().map.effectContainer.addChild(mc);
                        mc.addFrameScript(() => {
                            mc.removeSelf();
                        });
                    }
                    else {
                        Logger.warn("[ShootFrameExecuter]特效资源不存在", mc)
                    }
                }

                arrow.rippleCount = currentCount;
                arrow.lastPoint = new Laya.Point(arrow.getDisplayObject().x, arrow.getDisplayObject().y);
            }
        }
    }
    private getCurrentRipple(arrow: ArrowSkillEffect): number {
        let distance: number = arrow.travelDistance;
        let pt: Laya.Point = new Laya.Point(arrow.getDisplayObject().x, arrow.getDisplayObject().y);

        distance += arrow.lastPoint.distance(pt.x, pt.y)

        let count: number = Math.floor(distance / this._frameData.shootData.rippleGap);
        arrow.travelDistance = distance;
        return count;
    }
    private getRipplePos(arrow: ArrowSkillEffect, index: number): Laya.Point {
        let pt: Laya.Point = new Laya.Point(arrow.getDisplayObject().x, arrow.getDisplayObject().y);
        let lastDistance: number = arrow.lastPoint.distance(pt.x, pt.y)

        let pos: Laya.Point = new Laya.Point();
        let dis: number = this._frameData.shootData.rippleGap * index - arrow.travelDistance + lastDistance;
        let angle: number = Math.atan2(pt.y - arrow.lastPoint.y, pt.x - arrow.lastPoint.x);
        pos.x = arrow.lastPoint.x + Math.cos(angle) * dis;
        pos.y = arrow.lastPoint.y + Math.sin(angle) * dis;
        return pos;
    }
    private onHit(arrow: BattleEffect, target) {
        // BattleLogSystem.skillDannyFlag(this._skill);
        let battleModel: BattleModel = BattleManager.Instance.battleModel;
        if (!battleModel) return;

        SkillSystem.playSound(this._frameData.shootData.soundRes, "射箭");
        
        let selfCause: boolean;
        if (this._skill && this._skill.getCurrentRole() == battleModel.selfHero) {
            selfCause = true;
        }

        let resistModel: ResistModel = BattleManager.Instance.resistModel;
        resistModel.attackOver = false;
        this._attackData.forEach((element: AttackData) => {
            if (target && element.roleId == target.livingId) {
                let attackRole = battleModel.getRoleById(element.fId);
                if (attackRole) {
                    Logger.battle(`[ShootFrameExecuter]${attackRole.roleName}(${attackRole.livingId})的射箭击中${target.roleName}(${target.livingId}), damageValue=${element.damageValue}`)
                }

                let effect: BattleEffect = new SkillEffect(this._frameData.shootData.dannyRes);
                let spBodyPos = target.getSpecialPos(BaseRoleInfo.POS_BODY);
                let spLegPos = target.getSpecialPos(BaseRoleInfo.POS_LEG);
                effect.getDisplayObject().x = spBodyPos.x - spLegPos.x;
                // effect.getDisplayObject().y = spBodyPos.y - spLegPos.y;
                effect.getDisplayObject().y = -70;

                let roleView: BaseRoleView = (BattleManager.Instance.battleMap.rolesDict[element.roleId])
                if (roleView) {
                    roleView.effectContainer.addEffect(effect);
                }
                new DannyAction(target, element, 12, true, 50, 0, 4, true, 0x666666, true, selfCause, this._skill.getSkillData().skillId);
                resistModel.currentResistSide = (target.side == battleModel.selfSide) ? 1 : 2;
                resistModel.resistTotal += element.resitPercent;
                if (battleModel.selfHero.livingId != element.fId && battleModel.selfHero.livingId != element.roleId)
                    resistModel.resistTotal = 0;
            }
        });
        resistModel.attackOver = resistModel.resistTotal != 0;

        this._skill.getCurrentRole().map.effectContainer.removeEffect(arrow);

        this._shootCount++;
        if (this._shootCount >= this._attackData.length) {
            this._completeFun && this._completeFun();
            this._completeFun = null;
            this._frameData = null;
            this._skill = null;
        }
    }
}