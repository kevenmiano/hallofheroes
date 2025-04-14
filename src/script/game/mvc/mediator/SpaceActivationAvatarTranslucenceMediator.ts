/*
 * @Author: jeremy.xu
 * @Date: 2022-09-08 20:01:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-11-23 10:19:21
 * @Description: 天空之城人物渲染优化  -- 使用半透明动画替代
 */
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import { SpaceArmyView } from "../../map/space/view/physics/SpaceArmyView";
import { SpaceModel } from "../../map/space/SpaceModel";
import Tiles from "../../map/space/constant/Tiles";
import SpaceManager from "../../map/space/SpaceManager";
import SpaceScene from "../../scene/SpaceScene";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";

export default class SpaceActivationAvatarTranslucenceMediator
  implements IMediator, IEnterFrame
{
  // 正常显示的人物
  public static NormalShowAvatarCnt: number = 20;
  public static CheckFrame: number = 25;

  private _selfArmy: SpaceArmy;
  private _disObject: Laya.Sprite;
  private _model: SpaceModel;
  private _controler: SpaceScene;
  private _frameCount: number = 0;

  public register(target: any) {
    this._disObject = target as Laya.Sprite;
    this._controler = SpaceManager.Instance.controller;
    this._model = SpaceManager.Instance.model;
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  public unregister(target: any) {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  public enterFrame() {
    this._frameCount++;
    if (
      this._frameCount > SpaceActivationAvatarTranslucenceMediator.CheckFrame
    ) {
      this._frameCount = 0;

      let dic: Map<number, SpaceArmy> = this._model.allArmyDict;
      if (dic && this.selfArmy) {
        let tempArr: SpaceArmyView[] = [];
        dic.forEach((aInfo) => {
          let armyView = this._controler.getArmyView(aInfo) as SpaceArmyView;
          if (armyView) {
            armyView.distanceWeight = this.calDistance(aInfo);
            tempArr.push(armyView);
          }
        });

        tempArr = ArrayUtils.sortOn(
          tempArr,
          "distanceWeight",
          ArrayConstant.NUMERIC,
        );
        for (let index = 0; index < tempArr.length; index++) {
          const armyView = tempArr[index];

          if (
            index <
            SpaceActivationAvatarTranslucenceMediator.NormalShowAvatarCnt
          ) {
            // Logger.xjy("正常显示的人", index, armyView, armyView.distanceWeight)
            armyView.showTranslucenceView = false;
          } else {
            // Logger.xjy("人数超出 半透明替代", index, armyView, armyView.distanceWeight)
            armyView.showTranslucenceView = true;
          }
        }
      }
    }
  }

  private calDistance(armyInfo: SpaceArmy): number {
    if (!this.selfArmy) return 0;
    let self: Laya.Point = new Laya.Point(
      this.selfArmy.curPosX,
      this.selfArmy.curPosY,
    );
    let army: Laya.Point = new Laya.Point(armyInfo.curPosX, armyInfo.curPosY);
    return self.distance(army.x, army.y) * Tiles.WIDTH;
  }

  private get selfArmy(): SpaceArmy {
    if (this._selfArmy) return this._selfArmy;

    let mapModel = SpaceManager.Instance.model;
    if (mapModel && mapModel.selfArmy) {
      this._selfArmy = mapModel.selfArmy;
    }
    return this._selfArmy;
  }
}
