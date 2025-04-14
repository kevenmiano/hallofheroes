/*
 * @Author: jeremy.xu
 * @Date: 2022-09-08 20:01:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-21 14:25:20
 * @Description: 副本人物渲染优化  -- 使用半透明动画替代
 */
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignMapModel } from "../model/CampaignMapModel";
import { CampaignMapScene } from "../../scene/CampaignMapScene";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import Logger from "../../../core/logger/Logger";
import Tiles from "../../map/space/constant/Tiles";

export default class ActivationAvatarTranslucenceMediator
  implements IMediator, IEnterFrame
{
  // 正常显示的人物
  public static NormalShowAvatarCnt: number = 20;
  // 正常显示范围
  public static NormalShowAvatarRange: number = 400;
  public static CheckFrame: number = 25;

  private _disObject: Laya.Sprite;
  private _model: CampaignMapModel;
  private _controler: CampaignMapScene;
  private _mapView: CampaignMapView;
  private _frameCount: number = 0;
  private _normalShowAvatarCnt: number = 0;

  public register(target: any) {
    this._disObject = target as Laya.Sprite;
    this._controler = CampaignManager.Instance.controller;
    this._model = CampaignManager.Instance.mapModel;
    this._mapView = CampaignManager.Instance.mapView;
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  public unregister(target: any) {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  public enterFrame() {
    if (!this._mapView) {
      return;
    }
    if (!this._model || this._model.exit) {
      return;
    }
    this._frameCount++;
    if (this._frameCount > ActivationAvatarTranslucenceMediator.CheckFrame) {
      this._frameCount = 0;
      // this._normalShowAvatarCnt = 0;

      let dic: Map<string, CampaignArmy> = this._model.allBaseArmy;
      if (dic && this.selfCampaignArmy) {
        let tempArr: CampaignArmyView[] = [];
        dic.forEach((aInfo) => {
          // let outRange = distance > ActivationAvatarTranslucenceMediator.NormalShowAvatarRange
          let armyView = this._controler.getArmyView(aInfo) as CampaignArmyView;
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
            index < ActivationAvatarTranslucenceMediator.NormalShowAvatarCnt
          ) {
            // Logger.xjy("正常显示的人", index, armyView, armyView.distanceWeight)
            // this._normalShowAvatarCnt++
            armyView.showTranslucenceView = false;
          } else {
            // Logger.xjy("人数超出 半透明替代", index, armyView, armyView.distanceWeight)
            armyView.showTranslucenceView = true;
          }
        }

        // if (!outRange) {
        //     if (this._normalShowAvatarCnt < ActivationAvatarTranslucenceMediator.NormalShowAvatarCnt) {
        //         Logger.xjy("正常显示的人", this._normalShowAvatarCnt, armyView)
        //         this._normalShowAvatarCnt++
        //         armyView.showTranslucenceView = false;
        //     } else {
        //         Logger.xjy("人数超出 半透明替代", this._normalShowAvatarCnt, armyView)
        //         armyView.showTranslucenceView = true;
        //     }
        // } else {
        //     Logger.xjy("范围超出 替代", this._normalShowAvatarCnt, armyView)
        //     armyView.distanceWeight = distance
        //     tempArr.push(armyView)
        //     armyView.showTranslucenceView = true;
        // }

        // let offsetCnt = ActivationAvatarTranslucenceMediator.NormalShowAvatarCnt - (this._normalShowAvatarCnt + 1)
        // if (offsetCnt > 0) {
        //     tempArr = ArrayUtils.sortOn(tempArr, "distanceWeight", ArrayConstant.NUMERIC)
        //     Logger.xjy("需要继续显示的人", offsetCnt, tempArr)
        //     for (let index = 0; index < offsetCnt; index++) {
        //         const armyView = tempArr[index];
        //         armyView.hideStyleView()
        //     }
        // }
      }
    }
  }

  private calDistance(armyInfo: CampaignArmy): number {
    let self: Laya.Point = new Laya.Point(
      this.selfCampaignArmy.curPosX,
      this.selfCampaignArmy.curPosY,
    );
    let army: Laya.Point = new Laya.Point(armyInfo.curPosX, armyInfo.curPosY);
    let dis = self.distance(army.x, army.y) * Tiles.WIDTH;
    return dis;
  }

  private get selfCampaignArmy(): CampaignArmy {
    let mapModel = CampaignManager.Instance.mapModel;
    return mapModel && mapModel.selfMemberData;
  }
}
