import FUI_QueueItem from "../../../../fui/Home/FUI_QueueItem";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { EmWindow } from "../../constant/UIDefine";
import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { BuildingSocketOutManager } from "../../manager/BuildingSocketOutManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { MopupManager } from "../../manager/MopupManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { VIPManager } from "../../manager/VIPManager";
import BuildingManager from "../../map/castle/BuildingManager";
import BuildingType from "../../map/castle/consant/BuildingType";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";

/**
 * 主界面冷却CD队列
 */
export default class QueueItem extends FUI_QueueItem {
  private _vData: BuildingOrderInfo;
  public type: number;
  public static QUEUE_TYPE_NULL: number = 0;
  public static QUEUE_TYPE_BUILD: number = 1;
  public static QUEUE_TYPE_TEC: number = 2;
  public static QUEUE_TYPE_ALCHEMY: number = 3;
  public static QUEUE_TYPE_COLOSSEUM: number = 4;
  public static QUEUE_TYPE_ACTIVE: number = 5;
  public static QUEUE_TYPE_PET: number = 6;

  onConstruct() {
    super.onConstruct();
    this.initEvent();
    // this.Btn_CompImmediately.visible = false;
    this.cType.selectedIndex = 1;
  }

  public set vData(info: any) {
    this.type = info.type;
    this._vData = info.vData;
    if (this._vData) {
      this._vData.removeEventListener(
        Laya.Event.COMPLETE,
        this.__completeHandler,
        this,
      );
      this._vData.removeEventListener(
        Laya.Event.CHANGE,
        this.__changeHandler,
        this,
      );
    }
    if (this._vData) {
      this._vData.addEventListener(
        Laya.Event.COMPLETE,
        this.__completeHandler,
        this,
      );
      this._vData.addEventListener(
        Laya.Event.CHANGE,
        this.__changeHandler,
        this,
      );
    }
    this.updateView();
  }

  public __itemClickHandler() {
    var str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    var bInfo: BuildInfo;
    switch (this.type) {
      case QueueItem.QUEUE_TYPE_NULL:
        this.buyQueueItem();
        break;
      case QueueItem.QUEUE_TYPE_COLOSSEUM:
        if (this.vData.remainTime > 0) this.coolItem();
        else if (this.vData.remainCount > 0 || this.vData.remainBuyCount > 0)
          FrameCtrlManager.Instance.open(EmWindow.Colosseum);
        break;
      case QueueItem.QUEUE_TYPE_ALCHEMY:
        if (this.vData.remainTime > 0) this.coolItem();
        else {
          bInfo = BuildingManager.Instance.getBuildingInfoBySonType(
            BuildingType.OFFICEAFFAIRS,
          );
          if (
            bInfo.property2 > bInfo.property1 ||
            BuildingManager.Instance.innerLevy.length - bInfo.payImpose
          )
            this.openBuildFrame(bInfo);
        }
        break;
      case QueueItem.QUEUE_TYPE_BUILD: //建筑
        if (this.vData.remainTime > 0) {
          this.coolItem();
        } else {
          FrameCtrlManager.Instance.open(EmWindow.CastleBuildInfoWnd);
          //跳转到等级最低的建筑, 如有多个建筑等级相同, 则优先弹出内政厅, 若所有建筑均达到玩家等级, 则提示“当前没有可升级的建筑”
          // 	let buildInfo: BuildInfo = BuildingManager.Instance.model.getMinLevelBuindInfo();
          // 	if (buildInfo) {
          // 		if (buildInfo.level >= ArmyManager.Instance.thane.grades) {
          // 			MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("QueueItem.type.build"));
          // 			return;
          // 		}
          // 		switch (buildInfo.sonType) {
          // 			case BuildingType.CASERN:
          // 				FrameCtrlManager.Instance.open(EmWindow.CasernWnd, buildInfo);
          // 				break;
          // 			case BuildingType.HOUSES:
          // 				UIManager.Instance.ShowWind(EmWindow.ResidenceFrameWnd, buildInfo);
          // 				break;
          // 			case BuildingType.OFFICEAFFAIRS:
          // 				UIManager.Instance.ShowWind(EmWindow.PoliticsFrameWnd, buildInfo);
          // 				break;
          // 			case BuildingType.WAREHOUSE:
          // 				UIManager.Instance.ShowWind(EmWindow.DepotWnd, buildInfo);
          // 				break;
          // 			case BuildingType.CRYSTALFURNACE:
          // 				UIManager.Instance.ShowWind(EmWindow.CrystalWnd, buildInfo);
          // 				break;
          // 			case BuildingType.SEMINARY:
          // 				UIManager.Instance.ShowWind(EmWindow.SeminaryWnd, buildInfo);
          // 				break;
          // 		}
          // 	}
        }
        break;
      case QueueItem.QUEUE_TYPE_TEC: //科技
        if (this.vData.remainTime > 0) this.coolItem();
        else {
          //若所有科技均达到玩家等级, 则提示“当前没有可升级的科技” 否则点击正在等待中的科技队列, 会弹出神学院界面
          let flag = BuildingManager.Instance.model.checkHasTecCanUpdate();
          if (!flag) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation("QueueItem.type.tec"),
            );
            return;
          } else {
            bInfo = BuildingManager.Instance.getBuildingInfoBySonType(
              BuildingType.SEMINARY,
            );
            this.openBuildFrame(bInfo);
          }
        }
        break;
    }
  }

  private coolItem() {
    var back: Function;
    if (this._vData && this._vData.remainTime > 0) {
      if (this.type == QueueItem.QUEUE_TYPE_COLOSSEUM) {
        back = this.coolColosseBack;
      } else {
        back = BuildingManager.Instance.allCoolBack;
      }
      var point: number = 0;
      let cfgItemOrder =
        TempleteManager.Instance.getConfigInfoByConfigName(
          "QuickenOrder_Price",
        );
      let cfgItemChallenge = TempleteManager.Instance.getConfigInfoByConfigName(
        "QuickCoolChallenge_Price",
      );
      let cfgItemChallengeValue = 1;
      let cfgOrderValue = 1;
      if (cfgItemOrder) {
        //冷却
        cfgOrderValue = Number(cfgItemOrder.ConfigValue);
      }
      if (cfgItemChallenge) {
        //挑战
        cfgItemChallengeValue = Number(cfgItemChallenge.ConfigValue);
      }
      if (
        this.type == QueueItem.QUEUE_TYPE_COLOSSEUM ||
        this.type == QueueItem.QUEUE_TYPE_PET
      )
        point = cfgItemChallengeValue * Math.ceil(this._vData.remainTime / 60);
      else point = cfgOrderValue * Math.ceil(this._vData.remainTime / 600);
      if (VIPManager.Instance.model.vipCoolPrivilege) {
        back(true, this._vData.orderId);
      } else {
        UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
          type: this.type,
          orderId: this._vData.orderId,
          pointNum: point,
          backFun: back.bind(BuildingManager.Instance),
        });
      }
    }
  }

  private buyQueueItem() {
    let cfgValue = 100;
    let cfgItem =
      TempleteManager.Instance.getConfigInfoByConfigName("Order_NeedPay");
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    var content: string = LangManager.Instance.GetTranslation(
      "mainBar.QueueBar.content",
      cfgValue,
    );
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation(
      "mainBar.QueueBar.prompt",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.USEBINDPOINT_ALERT,
      { point: cfgValue, checkDefault: true },
      prompt,
      content,
      confirm,
      cancel,
      this.buyCallBack.bind(this),
    );
  }

  private coolColosseBack(
    result: boolean,
    id: number = 0,
    type: number = 0,
    useBind: boolean = true,
  ) {
    if (result) {
      SocketSendManager.Instance.sendCoolColosseun(0, useBind);
    }
  }

  private buyCallBack(result: boolean, flag: boolean) {
    if (result) {
      BuildingSocketOutManager.sendBuyOrder(flag);
    }
  }

  private openBuildFrame(bInfo: BuildInfo) {
    switch (bInfo.templeteInfo.SonType) {
      case BuildingType.STORE_BUILD:
        break;
      case BuildingType.PVP_BUILD:
        break;
      case BuildingType.HERODOOR_BUILD:
        break;
      case BuildingType.XUANSHANG_BUILD:
        break;
      case BuildingType.HOOK_BUILD:
        break;
      case BuildingType.WUXIANTA_BUILD:
        FrameCtrlManager.Instance.open(EmWindow.MazeFrameWnd);
        break;
      case BuildingType.VEHICLE_BUILD:
        break;
      case BuildingType.TREE:
        break;
      case BuildingType.HOME_BUILD:
        break;
      case BuildingType.MAKET_BUILD:
        break;
      case BuildingType.CASERN:
        FrameCtrlManager.Instance.open(EmWindow.CasernWnd, bInfo);
        break;
      case BuildingType.HOUSES:
        UIManager.Instance.ShowWind(EmWindow.ResidenceFrameWnd, bInfo);
        break;
      case BuildingType.OFFICEAFFAIRS:
        UIManager.Instance.ShowWind(EmWindow.PoliticsFrameWnd, bInfo);
        break;
      case BuildingType.WAREHOUSE:
        UIManager.Instance.ShowWind(EmWindow.DepotWnd, bInfo);
        break;
      case BuildingType.CRYSTALFURNACE:
        UIManager.Instance.ShowWind(EmWindow.CrystalWnd, bInfo);
        break;
      case BuildingType.SEMINARY:
        UIManager.Instance.ShowWind(EmWindow.SeminaryWnd, bInfo);
        break;
      default:
        break;
    }
  }

  public get vData(): any {
    return this._vData;
  }

  private initEvent() {
    if (this.Btn_CompImmediately)
      this.Btn_CompImmediately.onClick(this, this.__clickHandler.bind(this));
    this.onClick(this, this.__itemClickHandler);
  }

  private removeEvent() {
    if (this._vData) {
      this._vData.removeEventListener(
        Laya.Event.COMPLETE,
        this.__completeHandler,
        this,
      );
      this._vData.removeEventListener(
        Laya.Event.CHANGE,
        this.__changeHandler,
        this,
      );
    }
    if (this.Btn_CompImmediately)
      this.Btn_CompImmediately.offClick(this, this.__clickHandler.bind(this));
    this.offClick(this, this.__itemClickHandler);
  }

  private __clickHandler(e: Laya.Event) {
    e.stopPropagation();
    var back: Function;
    if (this._vData && this._vData.remainTime > 0) {
      if (this.type == QueueItem.QUEUE_TYPE_COLOSSEUM) {
        back = this.coolColosseBack;
      } else {
        back = BuildingManager.Instance.allCoolBack;
      }
      var point: number = 0;
      let cfgItemOrder =
        TempleteManager.Instance.getConfigInfoByConfigName(
          "QuickenOrder_Price",
        );
      let cfgItemChallenge = TempleteManager.Instance.getConfigInfoByConfigName(
        "QuickCoolChallenge_Price",
      );
      let cfgItemChallengeValue = 1;
      let cfgOrderValue = 1;
      if (cfgItemOrder) {
        //冷却
        cfgOrderValue = Number(cfgItemOrder.ConfigValue);
      }
      if (cfgItemChallenge) {
        //挑战
        cfgItemChallengeValue = Number(cfgItemChallenge.ConfigValue);
      }
      if (
        this.type == QueueItem.QUEUE_TYPE_COLOSSEUM ||
        this.type == QueueItem.QUEUE_TYPE_PET
      )
        point = cfgItemChallengeValue * Math.ceil(this._vData.remainTime / 60);
      else point = cfgOrderValue * Math.ceil(this._vData.remainTime / 600);
      if (VIPManager.Instance.model.vipCoolPrivilege) {
        back(true, this._vData.orderId);
      } else {
        UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
          type: this.type,
          orderId: this._vData.orderId,
          pointNum: point,
          backFun: back.bind(BuildingManager.Instance),
        });
      }
    }
  }

  private __completeHandler() {
    if (this.type == QueueItem.QUEUE_TYPE_COLOSSEUM) {
      this.updateView();
    } else {
      BuildingManager.Instance.upgradeOrderList();
    }
  }

  private __changeHandler() {
    this.updateView();
  }

  private updateView() {
    var str: string;
    var txt1: string;
    var txt2: string;
    switch (this.type) {
      case QueueItem.QUEUE_TYPE_NULL:
        this.titleTxt1.text =
          "[color=#00aeef]" +
          LangManager.Instance.GetTranslation("mainBar.view.QueueItem.NULL") +
          "[/color]";
        // this.titleTxt1.color = "#00aeef";
        // this.Btn_CompImmediately.visible = false;
        this.cType.selectedIndex = 1;
        break;
      case QueueItem.QUEUE_TYPE_BUILD:
        txt1 = LangManager.Instance.GetTranslation(
          "mainBar.view.QueueItem.BUILD",
        );
        txt2 = LangManager.Instance.GetTranslation(
          "mainBar.view.QueueItem.BUILD2",
        );
        this.updateTxt(txt1, txt2);
        break;
      case QueueItem.QUEUE_TYPE_TEC:
        txt1 = LangManager.Instance.GetTranslation(
          "buildings.seminary.view.TechnologyOrderItemView.content",
        );
        txt2 = LangManager.Instance.GetTranslation(
          "buildings.seminary.view.TechnologyOrderItemView.content2",
        );
        this.updateTxt(txt1, txt2);
        break;
      case QueueItem.QUEUE_TYPE_COLOSSEUM:
        if (!this._vData) return;
        if (this._vData.remainCount > 0) {
          txt1 = LangManager.Instance.GetTranslation(
            "mainBar.view.QueueItem.COLOSSEUM",
          );
          str =
            txt1 +
            " " +
            this._vData.remainCount +
            " / " +
            this._vData.totalCount;
        } else {
          str = LangManager.Instance.GetTranslation(
            "mainBar.view.QueueItem.COLOSSEUM1",
          );
        }
        this.updateTxt(str, str);
        break;
      case QueueItem.QUEUE_TYPE_PET:
        if (!this._vData) return;
        str = LangManager.Instance.GetTranslation(
          "QueueItem.petchallenge",
          this._vData.remainCount,
        );
        this.updateTxt(str, str);
        break;
      case QueueItem.QUEUE_TYPE_ALCHEMY:
        var info: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
          BuildingType.OFFICEAFFAIRS,
        );
        if (info.property2 - info.property1 == 0) {
          let maxLevy: number = BuildingManager.Instance.innerLevy.length;
          if (maxLevy - info.payImpose == 0) {
            str = LangManager.Instance.GetTranslation(
              "mainBar.view.QueueItem.ALCHEMY1",
            );
          } else {
            txt1 = LangManager.Instance.GetTranslation(
              "mainBar.view.QueueItem.ALCHEMY2",
            );
            str = txt1 + " " + (maxLevy - info.payImpose) + " / " + maxLevy;
          }
        } else {
          txt1 = LangManager.Instance.GetTranslation(
            "mainBar.view.QueueItem.ALCHEMY",
          );
          str =
            txt1 +
            " " +
            (info.property2 - info.property1) +
            " / " +
            info.property2;
        }
        this.updateTxt(str, str);
        break;
      default:
        break;
    }
  }

  protected updateTxt(str1: string, str2: string) {
    if (!this._vData) {
      // this.Btn_CompImmediately.visible = false;
      this.cType.selectedIndex = 1;
      // this.titleTxt1.color = this.leftTimeTxt.color = "#ffffff";
      this.titleTxt1.text = "";
      // this.leftTimeTxt.text = "";
    } else if (
      this._vData &&
      parseInt(this._vData.remainTime.toString()) <= 0
    ) {
      // this.Btn_CompImmediately.visible = false;
      this.cType.selectedIndex = 1;
      // this.titleTxt1.color = "#04ef25";
      this.titleTxt1.text = "[color=#04ef25]" + str1 + "[/color]";
      // this.leftTimeTxt.text = "";
      // this.leftTimeTxt.color = "#04ef25";
    } else {
      // this.Btn_CompImmediately.visible = true;
      this.cType.selectedIndex = 0;
      // this.titleTxt1.color = this.leftTimeTxt.color = "#ffffff";

      let leftTimeTxt =
        "[color=#ffffff]" +
        DateFormatter.getCountDate(this._vData.remainTime) +
        "[/color]";

      this.titleTxt1.text = str2 + " " + leftTimeTxt;
    }
  }

  public dispose() {
    this.removeEvent();
    ObjectUtils.disposeAllChildren(this);
    super.dispose();
  }
}
