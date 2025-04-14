/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 20:48:57
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-22 17:56:04
 * @Description: 城战地图建筑层
 */
import Logger from "../../../../core/logger/Logger";
import {
  SequenceList,
  ActionsExecutionMode,
} from "../../../../core/task/SequenceList";
import Utils from "../../../../core/utils/Utils";
import { DisplayObject } from "../../../component/DisplayObject";
import { OuterCityWarEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import CastleConfigUtil, {
  EmCastlePos,
} from "../../../map/castle/utils/CastleConfigUtil";
import { CastleBuildingBaseViewLoadTask } from "../../../map/castle/view/layer/CastleBuildingBaseView";
import { OuterCityWarManager } from "../control/OuterCityWarManager";
import { OuterCityWarBuildInfo } from "../model/OuterCityWarBuildInfo";
import { OuterCityWarModel } from "../model/OuterCityWarModel";
import OuterCityWarBuildingView from "./OuterCityWarBuildingView";

export class OuterCityWarBuildLayer extends DisplayObject {
  private _loadBuildTaskMgr: SequenceList;

  constructor() {
    super();
    Utils.setDrawCallOptimize(this);
    this.initBuild();
    this.addEvent();
  }

  private initBuild() {
    this._loadBuildTaskMgr = new SequenceList(
      ActionsExecutionMode.RunInSequence,
    );

    for (let info of this.fightModel.buildingInfoMap.values()) {
      let sonType = info.sonType;

      let view: OuterCityWarBuildingView = new OuterCityWarBuildingView(info);
      let pos: Laya.Point = CastleConfigUtil.Instance.getBuildPos(
        sonType,
        EmCastlePos.OuterCityWar,
      );
      this.addChild(view);
      view.x = pos.x;
      view.y = pos.y;
      view.zOrder = CastleConfigUtil.Instance.getBuildZorder(sonType);
      this.fightModel.buildingViewMap.set(sonType, view);

      this._loadBuildTaskMgr.addTask(new CastleBuildingBaseViewLoadTask(view));
    }
    this._loadBuildTaskMgr.setComplete(
      new Laya.Handler(this, this.loadComplete),
    );
    this._loadBuildTaskMgr.execute(this);
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.BUILD_INFO,
      this.__buildInfo,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.BUILD_INFO,
      this.__buildInfo,
      this,
    );
  }

  private loadComplete() {
    // Logger.outcityWar("所有城战建筑加载完成，开始显示信息");
    this.refreshAllBuildInfo();
  }

  private __allBuildInfo() {
    // Logger.outcityWar("刷新所有城战建筑信息");
    this.refreshAllBuildInfo();
  }

  private __buildInfo(info: OuterCityWarBuildInfo) {
    // Logger.outcityWar("刷新城战建筑信息");
    this.refreshOneBuildInfo(info);
  }

  private refreshOneBuildInfo(info: OuterCityWarBuildInfo) {
    let view = this.fightModel.buildingViewMap.get(info.sonType);
    if (view) {
      view.buildInfo = info;
      view.updateInfoView();
    }
  }

  private refreshAllBuildInfo() {
    for (let info of this.fightModel.buildingInfoMap.values()) {
      this.refreshOneBuildInfo(info);
    }
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }

  private dispose() {
    this.removeEvent();
    this._loadBuildTaskMgr.clear();
  }
}
