import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import ColorConstant from "../../../constant/ColorConstant";
import { ConfigType } from "../../../constant/ConfigDefine";
import { EmWindow } from "../../../constant/UIDefine";
import {
  NotificationEvent,
  OuterCityEvent,
} from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityMap } from "../../../map/outercity/OuterCityMap";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import OuterCityVehicleRewardItem from "../com/OuterCityVehicleRewardItem";

export default class OuterCityVehicleTips extends BaseWindow {
  public bg: fgui.GLoader;
  public carNameTxt: fgui.GTextField;
  public descTxt1: fgui.GTextField;
  public rewardDescTxt: fgui.GTextField;
  public descTxt2: fgui.GTextField;
  public occupyConsortiaNameTxt: fgui.GTextField;
  public descTxt3: fgui.GTextField;
  public personCountTxt1: fgui.GTextField;
  public descTxt4: fgui.GTextField;
  public personCountTxt2: fgui.GTextField;
  public descTxt5: fgui.GTextField;
  public leftTimeTxt: fgui.GTextField;
  public btnLookInfo: fgui.GButton;
  public btnGoto: fgui.GButton;
  public goodsList: fgui.GList;
  private _mapView: OuterCityMap;
  private _info: WildLand;
  private _count: number = 0;
  private _goodsArr: Array<GoodsInfo> = [];
  constructor() {
    super();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initEvent();
    this.initData();
    this.initView();
  }

  private initData() {
    this._mapView = OuterCityManager.Instance.mapView;
    if (this.frameData) {
      this._info = this.frameData;
      this.setCenter();
    } else {
      [this._info] = this.params;
    }
    this.descTxt1.text = LangManager.Instance.GetTranslation(
      "OuterCityVehicleInfoWnd.descTxt1",
    );
    this.descTxt2.text = LangManager.Instance.GetTranslation(
      "OuterCityVehicleInfoWnd.descTxt2",
    );
    this.descTxt3.text = LangManager.Instance.GetTranslation(
      "OuterCityVehicleItem.titleDescTxt1",
    );
    this.descTxt4.text = LangManager.Instance.GetTranslation(
      "OuterCityVehicleItem.titleDescTxt2",
    );
    this.descTxt5.text = LangManager.Instance.GetTranslation(
      "OuterCityVehicleInfoWnd.descTxt3",
    );
    if (this._info) {
      let tempInfo: t_s_mapphysicpositionData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_mapphysicposition,
          this._info.templateId,
        );
      if (tempInfo) {
        this.carNameTxt.text = tempInfo.NameLang;
      }
      let str: string = this._info.tempInfo.Property2;
      let arr = str.split("|");
      if (arr) {
        let goods: GoodsInfo;
        for (let i: number = 0; i < arr.length; i++) {
          goods = new GoodsInfo();
          goods.templateId = parseInt(arr[i].split(",")[0].toString());
          goods.count = parseInt(arr[i].split(",")[1].toString());
          this._goodsArr.push(goods);
        }
        this.goodsList.numItems = this._goodsArr.length;
      }
    }
  }

  private initView() {
    if (this._info) {
      if (this._info.info.occupyLeagueName == "") {
        //占领的公会信息无
        this.occupyConsortiaNameTxt.text = LangManager.Instance.GetTranslation(
          "maze.MazeFrame.Order",
        );
        this.occupyConsortiaNameTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
      } else {
        this.occupyConsortiaNameTxt.text =
          "<" + this._info.info.occupyLeagueName + ">";
        if (
          this.outerCityModel.checkIsSameConsortiaByName(
            this._info.info.occupyLeagueName,
          )
        ) {
          //同工会的
          this.occupyConsortiaNameTxt.color = ColorConstant.GREEN_COLOR;
        } else {
          this.occupyConsortiaNameTxt.color = ColorConstant.RED_COLOR;
        }
      }
      if (this._info.leftTime > 0) {
        this._count = this._info.leftTime;
        this.leftTimeTxt.text =
          "(" + DateFormatter.getConsortiaCountDate(this._count) + ")";
        Laya.timer.loop(1000, this, this.refreshLeftTime);
      } else {
        this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
          "OuterCityVehicleInfoWnd.leftTimeTxt",
        );
        Laya.timer.clearAll(this);
      }
      this.personCountTxt1.text = this._info.pushPlayer.length + "/3";
      this.personCountTxt2.text = this._info.protectPlayer.length + "/3";
    }
  }

  private refreshLeftTime() {
    if (this._count > 0) {
      this._count--;
      this.leftTimeTxt.text =
        "(" + DateFormatter.getConsortiaCountDate(this._count) + ")";
    }
  }

  private initEvent() {
    this.btnLookInfo.onClick(this, this.lookInfoHandler);
    this.btnGoto.onClick(this, this.btnGotoHandler);
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE,
      this.updateView,
      this,
    );
  }

  private removeEvent() {
    this.btnLookInfo.offClick(this, this.lookInfoHandler);
    this.btnGoto.offClick(this, this.btnGotoHandler);
    Utils.clearGListHandle(this.goodsList);
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE,
      this.updateView,
      this,
    );
  }

  private updateView() {
    let templateId = this._info.templateId;
    this._info = OuterCityManager.Instance.model.allVehicleNode.get(templateId);
    this.initView();
  }

  private __renderListItem(index: number, item: OuterCityVehicleRewardItem) {
    item.info = this._goodsArr[index];
  }

  /**
   * 查看
   */
  private lookInfoHandler() {
    if (this._info.info.state == 2) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleTips.lookInfoHandler.tips",
        ),
      );
      return;
    }
    this._mapView.motionTo(
      new Laya.Point(
        parseInt((this._info.movePosX * 20).toString()) -
          StageReferance.stageWidth / 2,
        parseInt((this._info.movePosY * 20).toString()) -
          StageReferance.stageHeight / 2,
      ),
    );
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.CLOSE_OUTERCITY_MAP_WND,
    );
    OuterCityMapCameraMediator.lockMapCamera();
    this.hide();
  }

  /**
   * 前往
   */
  private btnGotoHandler() {
    if (this._info.info.state == 2) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleTips.lookInfoHandler.tips",
        ),
      );
      return;
    }
    let self: OutercityVehicleArmyView =
      OuterCityManager.Instance.model.getSelfVehicle();
    if (this._info.leftTime <= 0) {
      //点击的是静态物资车
      if (self) {
        //玩家自己处于物资车状态
        if (self.wildInfo.templateId == this._info.templateId) {
          //点击的是自己的物资车
          FrameCtrlManager.Instance.open(
            EmWindow.OuterCityVehicleInfoWnd,
            this._info,
          );
          this.hide();
        } else {
          //点击的是别人的物资车，提示玩家当前处于物资车状态，要先退出才能操作
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips",
            ),
          );
          this.hide();
        }
      } else {
        //玩家是处于空闲状态，移动到固定的物资车点
        if (
          OuterCityManager.Instance.model.checkTeamInFight(this._info) ||
          OuterCityManager.Instance.model.checkCanAttackVehicle(this._info)
        ) {
          //可攻击
          NotificationManager.Instance.dispatchEvent(
            OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT,
            this._info,
          );
        } else if (
          OuterCityManager.Instance.model.checkAllInFighting(this._info)
        ) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "outercityVehicle.checkCanAttackVehicle.tips",
            ),
          );
        } else {
          //移动到固定的物资车点
          NotificationManager.Instance.dispatchEvent(
            OuterCityEvent.START_MOVE,
            this._info,
          );
        }
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.CLOSE_OUTERCITY_MAP_WND,
        );
        this.hide();
      }
    } else {
      //点击的是动态物资车
      if (self) {
        //玩家自己处于物资车状态
        if (self.wildInfo.templateId == this._info.templateId) {
          //点击的是自己的物资车
          FrameCtrlManager.Instance.open(
            EmWindow.OuterCityVehicleInfoWnd,
            this._info,
          );
          this.hide();
        } else {
          //提示玩家当前处于物资车状态，要先退出才能操作
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips",
            ),
          );
          this.hide();
        }
      } else {
        //玩家是处于空闲状态，追踪移动的物资车
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.CLOSE_OUTERCITY_MAP_WND,
        );
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
        ) {
          //如果没有公会，提示无法发动攻击
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityVehicleMediator.attackTips",
            ),
          );
          this.hide();
          return;
        }
        if (
          OuterCityManager.Instance.model.checkTeamInFight(this._info) ||
          OuterCityManager.Instance.model.checkCanAttackVehicle(this._info)
        ) {
          //可攻击
          NotificationManager.Instance.dispatchEvent(
            OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT,
            this._info,
          );
        } else if (
          OuterCityManager.Instance.model.checkAllInFighting(this._info)
        ) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "outercityVehicle.checkCanAttackVehicle.tips",
            ),
          );
        } else {
          NotificationManager.Instance.dispatchEvent(
            OuterCityEvent.OUTERCITY_LOCK_VEHICLE_FIGHT,
            this._info,
          );
        }
        this.hide();
      }
    }
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
    Laya.timer.clearAll(this);
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
