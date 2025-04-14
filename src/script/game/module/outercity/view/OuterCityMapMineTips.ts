//@ts-expect-error: External dependencies
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import { ConfigType } from "../../../constant/ConfigDefine";
import {
  NotificationEvent,
  OuterCityEvent,
} from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import { WildLand } from "../../../map/data/WildLand";
import OutCityMineNode from "../../../map/outercity/OutCityMineNode";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import OuterCityMapMineItem from "../com/OuterCityMapMineItem";

export default class OuterCityMapMineTips extends BaseWindow {
  public c1: fgui.Controller;
  public bg: fgui.GLoader;
  public txt_name: fgui.GTextField;
  public txt_count: fgui.GTextField;
  public descTxt: fgui.GTextField;
  public list: fgui.GList;
  public btnLookInfo: fgui.GButton;
  public btnGoto: fgui.GButton;
  private _mapView: OuterCityMap;
  private _info: WildLand;
  public _type: number = 0;
  public cityNameTxt: fgui.GTextField;
  private _nodeAllMineInfoArr: Array<OutCityMineNode> = [];
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initEvent();
    this.initView();
  }

  private initData() {
    this._mapView = OuterCityManager.Instance.mapView;
    this.c1 = this.getController("c1");

    if (this.frameData) {
      this._info = this.frameData;
      this._type = 1;
      this.setCenter();
    } else {
      [this._info] = this.params;
      this._type = 0;
    }
  }

  private initView() {
    if (this._info) {
      if (this._info.tempInfo) {
        this.txt_name.text =
          this._info.tempInfo.NameLang +
          " " +
          LangManager.Instance.GetTranslation(
            "public.level3",
            this._info.tempInfo.Grade,
          );
        this.txt_count.text =
          "(" +
          this.outerCityModel.occupyCount(this._info) +
          "/" +
          this._info.tempInfo.Property1 +
          ")";
        this.c1.selectedIndex = 0;
        this._nodeAllMineInfoArr = this._info.allNodeInfo;
        this.list.numItems = this._nodeAllMineInfoArr.length;
        this.list.height = 40 + (this.list.numItems - 1) * 35;
        let propterty2 = this._info.tempInfo.Property2;
        let owerTempInfo: t_s_mapphysicpositionData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_mapphysicposition,
            propterty2.toString(),
          ) as t_s_mapphysicpositionData;
        if (owerTempInfo) this.cityNameTxt.text = owerTempInfo.NameLang;
      }
    }
  }

  private initEvent() {
    this.btnLookInfo.onClick(this, this.lookInfoHandler);
    this.btnGoto.onClick(this, this.btnGotoHandler);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderCountList,
      null,
      false,
    );
  }

  private removeEvent() {
    this.btnLookInfo.offClick(this, this.lookInfoHandler);
    this.btnGoto.offClick(this, this.btnGotoHandler);
    this.list.itemRenderer.recover();
    this.list.itemRenderer = null;
  }

  private renderCountList(index: number, item: OuterCityMapMineItem) {
    if (!item || item.isDisposed) return;
    item.info = this._nodeAllMineInfoArr[index];
  }

  protected createModel() {
    super.createModel();
    this.modelMask.alpha = 0;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  /**
   * 查看
   */
  private lookInfoHandler() {
    if (this._type == 1) {
      this.hide();
    } else {
      this._mapView.motionTo(
        new Laya.Point(
          this._info.posX * 20 - StageReferance.stageWidth / 2,
          this._info.posY * 20 - StageReferance.stageHeight / 2,
        ),
      );
      OuterCityManager.Instance.mapView.moveEnd();
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.CLOSE_OUTERCITY_MAP_WND,
      );
      OuterCityMapCameraMediator.lockMapCamera();
      this.hide();
    }
  }

  /**
   * 前往
   */
  private btnGotoHandler() {
    let self: OutercityVehicleArmyView =
      OuterCityManager.Instance.model.getSelfVehicle();
    if (self) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"),
      );
      this.hide();
    }
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.START_MOVE,
      this._info,
    );
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.CLOSE_OUTERCITY_MAP_WND,
    );
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTERCITY_UNLOCK_WAR_FIGHT,
    );
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.OUTERCITY_UNLOCK_VEHICLE_FIGHT,
    );
    this.hide();
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
