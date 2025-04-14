/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description 类似光束的射箭效果.
 * 与以往的射箭效果不同的是,这类光束效果不以箭矢到达目标者来判断是否执行伤害;
 * 而是通过影片是否播放到最后一帧来判断.
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
import { BattleEffect } from "../effect/BattleEffect";
import { SkillEffect } from "../effect/SkillEffect";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";
import { BaseSkill } from "../skills/BaseSkill";
import { SkillSystem } from "../SkillSystem";

export class BundleShootFrameExecuter {
  private _skill: BaseSkill;
  private _frameData: SkillFrameData;
  private _attackIndex: number = 0;
  private _completeFun: Function;

  private _shootCount: number = 0;
  private _startPoint: Laya.Point;
  private _attackData: any[];

  constructor(
    skill: BaseSkill,
    frameData: SkillFrameData,
    attackIndex: number,
    completeFun: Function,
  ) {
    this._skill = skill;
    this._frameData = frameData;
    this._attackIndex = attackIndex;
    this._completeFun = completeFun;

    this._startPoint = new Laya.Point(
      this._frameData.shootData.startX,
      this._frameData.shootData.startY,
    );
    this._attackData = this._skill.getSkillData().data[this._attackIndex];

    this.execute();
  }
  private execute() {
    this._attackData.forEach((element) => {
      //BaseRoleInfo
      let target: any = BattleManager.Instance.battleModel.getRoleById(
        element.roleId,
      );

      let attackRole = BattleManager.Instance.battleModel.getRoleById(
        element.fId,
      );
      if (target && attackRole) {
        Logger.battle(
          `[BundleShootFrameExecuter]${attackRole.roleName}(${attackRole.livingId})对${target.roleName}(${target.livingId})添加光束: ${this._frameData.shootData.arrowRes}`,
        );
      }

      this.addBundle(target);
    });
  }
  //BaseRoleInfo
  private addBundle(target: any) {
    let curRoleInfo = this._skill.getCurrentRole();
    if (!target || !target.point || !curRoleInfo || !curRoleInfo.map) {
      return;
    }

    let stPt: Laya.Point = new Laya.Point();
    let destPt: Laya.Point;
    let arrowWidth: number = this._frameData.shootData.arrowWidth;

    let arrowEffect: SkillEffect = new SkillEffect(
      this._frameData.shootData.arrowRes,
    );

    let mc: MovieClip = arrowEffect.getDisplayObject() as MovieClip;
    mc.x = curRoleInfo.point.x + this._startPoint.x;
    mc.y = curRoleInfo.point.y + this._startPoint.y;

    stPt.x = mc.x;
    stPt.y = mc.y;

    destPt = new Laya.Point(target.point.x, target.point.y - 80);

    let distance = stPt.distance(destPt.x, destPt.y);
    let scale = distance / arrowWidth;
    mc.scaleX *= scale;

    mc.rotation =
      (Math.atan2(destPt.y - stPt.y, destPt.x - stPt.x) * 180) / Math.PI;

    let dannyFrame = this._frameData.shootData.dannyFrame;
    if (dannyFrame != 0 && dannyFrame != mc.totalFrames) {
      mc.addFrameScript(dannyFrame - 1, () => {
        this.onHit(target);
      });
    } else {
      arrowEffect.callBackComplete.addListener(() => {
        this.onHit(target);
      }); //当特效完成一个周期时
    }

    curRoleInfo.map.effectContainer.addEffect(arrowEffect);
  }

  //BaseRoleInfo
  private onHit(target: any) {
    // BattleLogSystem.skillDannyFlag(this._skill);
    let battleModel: BattleModel = BattleManager.Instance.battleModel;
    if (!battleModel) return;

    SkillSystem.playSound(this._frameData.shootData.soundRes, "射箭光束");

    let selfCause: boolean;
    if (this._skill && this._skill.getCurrentRole() == battleModel.selfHero) {
      selfCause = true;
    }
    let bmap = BattleManager.Instance.battleMap;
    if (!bmap) return;

    let resistModel: ResistModel = BattleManager.Instance.resistModel;
    resistModel.attackOver = false;

    this._attackData.forEach((element: AttackData) => {
      if (target && element.roleId == target.livingId) {
        let attackRole = battleModel.getRoleById(element.fId);
        if (attackRole) {
          Logger.battle(
            `[BundleShootFrameExecuter]${attackRole.roleName}(${attackRole.livingId})的光束击中${target.roleName}(${target.livingId}), damageValue=${element.damageValue}`,
          );
        }

        let effect: BattleEffect = new SkillEffect(
          this._frameData.shootData.dannyRes,
        );
        let spBodyPos = target.getSpecialPos(BaseRoleInfo.POS_BODY);
        let spLegPos = target.getSpecialPos(BaseRoleInfo.POS_LEG);
        effect.getDisplayObject().x = spBodyPos.x - spLegPos.x;
        // effect.getDisplayObject().y = spBodyPos.y - spLegPos.y;
        effect.getDisplayObject().y = -70;

        let roleView: BaseRoleView = bmap.rolesDict.get(element.roleId);
        if (roleView) {
          roleView.effectContainer.addEffect(effect);
        }

        new DannyAction(
          target,
          element,
          12,
          true,
          50,
          0,
          4,
          true,
          0x666666,
          true,
          selfCause,
          this._skill.getSkillData().skillId,
        );
        resistModel.currentResistSide =
          target.side == battleModel.selfSide ? 1 : 2;
        resistModel.resistTotal += element.resitPercent;
        if (
          battleModel.selfHero.livingId != element.fId &&
          battleModel.selfHero.livingId != element.roleId
        )
          resistModel.resistTotal = 0;
      }
    });
    resistModel.attackOver = resistModel.resistTotal != 0;

    this._shootCount++;
    if (this._shootCount >= this._attackData.length) {
      this._completeFun();
    }
  }
}
