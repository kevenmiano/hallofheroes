//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 16:22:29
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-28 11:37:55
 * @Description: 城战建筑视图
 * Mark 由于逻辑比较简单 进攻方阵营与内城建筑就放一个视图
 */

import Logger from "../../../../core/logger/Logger";
import { EmOuterCityWarBuildSortType } from "../../../constant/OuterCityWarDefine";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import BuildingType from "../../../map/castle/consant/BuildingType";
import CastleConfigUtil, {
  EmCastlePos,
} from "../../../map/castle/utils/CastleConfigUtil";
import CastleBuildingBaseView from "../../../map/castle/view/layer/CastleBuildingBaseView";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUIHelper from "../../../utils/FUIHelper";
import { OuterCityWarBuildInfo } from "../model/OuterCityWarBuildInfo";
import OuterCityWarBuildBriefInfoItem from "./item/OuterCityWarBuildBriefInfoItem";

export default class OuterCityWarBuildingView extends CastleBuildingBaseView {
  // public notEffect: boolean = true
  public buildInfo: OuterCityWarBuildInfo;

  private _infoItem: OuterCityWarBuildBriefInfoItem;

  constructor(buildInfo: OuterCityWarBuildInfo) {
    super(buildInfo.sonType, buildInfo.buildTemplate);
    this.buildInfo = buildInfo;

    this._infoItem = FUIHelper.createFUIInstance(
      EmPackName.OuterCityWar,
      "OuterCityWarBuildBriefInfoItem",
    );
    let pos = CastleConfigUtil.Instance.getBuildNamePos(
      this.sonType,
      EmCastlePos.OuterCityWar,
    );
    this.addChild(this._infoItem.displayObject);
    this._infoItem.x = pos.x;
    this._infoItem.y = pos.y;
    this._infoItem.sonType = this.sonType;
  }

  public updateInfoView() {
    this._infoItem.info = this.buildInfo;
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    let b = super.mouseClickHandler(evt);
    if (!b) return false;

    Logger.outcityWar("成功点击了", this.buildInfo.buildName);
    switch (this.buildInfo.buildSortType) {
      case EmOuterCityWarBuildSortType.Hero:
      case EmOuterCityWarBuildSortType.Pet:
        FrameCtrlManager.Instance.open(EmWindow.OuterCityWarDefencerBuildWnd, {
          buildInfo: this.buildInfo,
        });
        break;
      case EmOuterCityWarBuildSortType.AttackSite:
        // 进攻方阵营
        FrameCtrlManager.Instance.open(EmWindow.OuterCityWarAttackerBuildWnd, {
          buildInfo: this.buildInfo,
        });
        break;
    }
    return true;
  }

  public dispose() {
    super.dispose();
  }
}
