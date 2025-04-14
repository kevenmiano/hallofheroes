//@ts-expect-error: External dependencies
import IBuildingFilter from "../../../space/interfaces/IBuildingFilter";
import { BuildInfo } from "../../data/BuildInfo";
import SimpleBuildingFilter from "../../filter/SimpleBuildingFilter";
import { MasterTypes } from "../../data/MasterTypes";
import BuildingManager from "../../BuildingManager";
import CastleBuildingView from "./CastleBuildingView";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import BuildingType from "../../consant/BuildingType";
import { SimpleDictionary } from "../../../../../core/utils/SimpleDictionary";
import { AnimationManager } from "../../../../manager/AnimationManager";
import ResMgr from "../../../../../core/res/ResMgr";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { HookEvent } from "../../../../constant/event/NotificationEvent";
import { HookManager } from "../../../../manager/HookManager";
import Utils from "../../../../../core/utils/Utils";
import CastleConfigUtil from "../../utils/CastleConfigUtil";
import OpenGrades from "../../../../constant/OpenGrades";

export default class CastleWalkLayer extends Laya.Sprite {
  protected _buildingFilter: IBuildingFilter;
  protected _buildingsDic: Map<number, CastleBuildingView>;
  public _viewList: CastleBuildingView[];

  constructor() {
    super();
    Utils.setDrawCallOptimize(this);
    this.initConfig();
    this.initBuild();

    this.initEvent();
  }

  private initConfig() {
    this._viewList = [];
    this._buildingsDic = new Map();
    this._buildingFilter = new SimpleBuildingFilter();
  }

  initBuild() {
    let dic: SimpleDictionary = BuildingManager.Instance.model.buildingListByID;
    dic.getList().forEach((element: BuildInfo) => {
      if (
        element.templeteInfo &&
        element.templeteInfo.MasterType != MasterTypes.MT_INTERNALTECHNOLOGY &&
        element.templeteInfo.MasterType != MasterTypes.MT_WARTECHNOLOGY
      ) {
        this.updateBuildingView(element);
      }
    });
    this.initClientBuild();
  }

  private initClientBuild() {
    this.createGateBuild(); //城门
    this.createFortressBuild(); //堡垒
    this.createTrainingGroundBuild(); //训练场
    this.createStarTowerBuild(); //占星塔
    this.createHookBuild(); //英灵神殿
    this.createMarket(); //市场
    this.createAttackCampSiteBuild(); // 攻击方阵营

    for (let i: number = 0; i < this._viewList.length; i++) {
      let obj: CastleBuildingView = this._viewList[i] as CastleBuildingView;
      if (!obj.parent) this.addChild(obj);
      obj.zOrder = CastleConfigUtil.Instance.getBuildZorder(
        obj.buildingInfo.sonType,
      );
    }
    this.updateHookInfo();
  }

  private createGateBuild() {
    if (this._buildingsDic.get(-1)) {
      return;
    }
    if (this.thane.grades >= 0) {
      let build = new BuildInfo();
      build.buildingId = -1;
      build.templateId = 151401;
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  private createFortressBuild() {
    if (this._buildingsDic.get(-2)) {
      return;
    }
    if (this.thane.grades >= 0) {
      let build = new BuildInfo();
      build.buildingId = -2;
      build.templateId = 151301;
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  private createTrainingGroundBuild() {
    if (this._buildingsDic.get(-3)) {
      return;
    }
    if (this.thane.grades >= 0) {
      let build = new BuildInfo();
      build.buildingId = -3;
      build.templateId = 151501;
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  private createStarTowerBuild() {
    if (this._buildingsDic.get(-4)) {
      return;
    }
    if (this.thane.grades >= 0) {
      let build = new BuildInfo();
      build.buildingId = -4;
      build.templateId = 151201;
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  private createHookBuild() {
    if (this._buildingsDic.get(-5)) {
      return;
    }
    if (this.thane.grades >= OpenGrades.HOOK) {
      let build = new BuildInfo();
      build.buildingId = -5;
      build.templateId = 150401;
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  private createMarket() {
    if (this._buildingsDic.get(-6)) return;
    if (this.thane.grades >= 0) {
      let build = new BuildInfo();
      build.buildingId = -6;
      build.templateId = 150601;
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  private createAttackCampSiteBuild() {
    let tIds = [151601, 151701, 151801, 151901];
    for (let index = 0; index < 4; index++) {
      let build = new BuildInfo();
      let buildId = -100 - index;
      if (this._buildingsDic.get(buildId)) continue;
      build.buildingId = buildId;
      build.templateId = tIds[index];
      BuildingManager.Instance.model.addBuildInfo(build);
      this.updateClientBuild(build);
    }
  }

  public updateBuildingView(bInfo: BuildInfo) {
    let bView: CastleBuildingView = this._buildingsDic.get(
      bInfo.buildingId,
    ) as CastleBuildingView;
    if (bInfo.sonType == BuildingType.TRANSFER_BUILD) {
      return;
    }
    if (bView) {
      bView.buildingLevelUpdated(1);
      bView.buildingInfo = bInfo;
    } else {
      bView = this.getCastleBuildingView();
      bView.buildingInfo = bInfo;
      this.addChild(bView);
      bView.zOrder = CastleConfigUtil.Instance.getBuildZorder(bInfo.sonType);

      this._viewList.push(bView);
      this._buildingsDic.set(bInfo.buildingId, bView);
    }

    let pos: Laya.Point = this.getPos(bInfo);
    bView.x = pos.x;
    bView.y = pos.y;
  }

  protected getPos(build: BuildInfo): Laya.Point {
    return CastleConfigUtil.Instance.getBuildPos(build.sonType);
  }

  protected getCastleBuildingView() {
    return new CastleBuildingView(this._buildingFilter);
  }

  private updateClientBuild(bInfo: BuildInfo) {
    let bView: CastleBuildingView = this.getCastleBuildingView();
    if (bView) {
      let pos: Laya.Point = this.getPos(bInfo);
      bView.x = pos.x;
      bView.y = pos.y;
      bView.buildingLevelUpdated(1);
      bView.buildingInfo = bInfo;
    }
    bView.buildingInfo = bInfo;
    this._viewList.push(bView);
    this._buildingsDic.set(bInfo.buildingId, bView);
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private initEvent() {
    this.thane.addEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__levelUpdateHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      HookEvent.UPDATE_HOOK,
      this.updateHookInfo,
      this,
    );
  }

  private removeEvent() {
    this.thane.removeEventListener(
      PlayerEvent.THANE_LEVEL_UPDATE,
      this.__levelUpdateHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      HookEvent.UPDATE_HOOK,
      this.updateHookInfo,
      this,
    );
  }

  private __levelUpdateHandler() {
    this.initClientBuild();
  }

  /**更新修行神殿红点 */
  private updateHookInfo() {
    if (this.thane.grades >= 21) {
      if (!this._buildingsDic.get(-4)) return;
      let bView = this._buildingsDic.get(-4);
      let isHook = HookManager.Instance.canReceiveHook;
      bView.setRedPoint(isHook);
    }
  }

  public get buildingsDic(): Map<number, CastleBuildingView> {
    return this._buildingsDic;
  }

  public dispose() {
    this.removeEvent();
    BuildingManager.Instance.model.buildingListByID
      .getList()
      .forEach((element: BuildInfo) => {
        if (element.templeteInfo) {
          element.templeteInfo.view = null;
        }
      });
    this._buildingsDic.forEach((ele, cacheName) => {
      ele.dispose();
    });
    this._buildingsDic.clear();
    BuildingManager.Instance.model._cacheNameMap.forEach((ele, cacheName) => {
      AnimationManager.Instance.clearAnimationByName(cacheName);
    });
    BuildingManager.Instance.model._resUrlNameMap.forEach((ele, urlPath) => {
      ResMgr.Instance.releaseRes(urlPath);
    });
    BuildingManager.Instance.model._resUrlNameMap.clear();

    BuildingManager.Instance.model._cacheNameMap.forEach((ele, cacheName) => {
      AnimationManager.Instance.clearAnimationByName(cacheName);
    });
    BuildingManager.Instance.model._cacheNameMap.clear();
    this._viewList = null;
    if (this._buildingFilter) this._buildingFilter = null;
    this.removeSelf();
  }
}
