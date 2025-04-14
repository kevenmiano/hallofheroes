//@ts-expect-error: External dependencies
import FUI_OuterCityVehicleItem from "../../../../../fui/OuterCity/FUI_OuterCityVehicleItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import FreedomTeamSocketOutManager from "../../../manager/FreedomTeamSocketOutManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import VehiclePlayerInfo from "../../../map/data/VehiclePlayerInfo";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import OutercityPersonItem from "./OutercityPersonItem";

export default class OuterCityVehicleItem extends FUI_OuterCityVehicleItem {
  private _info: WildLand;
  private _index: number = 0;
  private _arr: Array<VehiclePlayerInfo>;
  public static MAX_COUNT: number = 3;
  private _intervalTime: number = 0;
  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
    Utils.setDrawCallOptimize(this);
  }

  private addEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false,
    );
    this.advanceBtn.onClick(this, this.advanceBtnHandler);
    this.escortBtn.onClick(this, this.escortBtnHandler);
    this.exitBtn.onClick(this, this.exitBtnHandler);
  }

  private removeEvent() {
    Utils.clearGListHandle(this.list);
    this.advanceBtn.offClick(this, this.advanceBtnHandler);
    this.escortBtn.offClick(this, this.escortBtnHandler);
    this.exitBtn.offClick(this, this.exitBtnHandler);
  }

  /**
   * 推进
   */
  private advanceBtnHandler() {
    if (this._info.pushStatus == 1) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.advanceBtnHandler.pushStatus",
        ),
      );
      return;
    }
    let t: number = new Date().getTime();
    if (t - this._intervalTime < 300) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = t;
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.advanceBtn.check",
        ),
      );
      return;
    }
    if (this._arr.length == OuterCityVehicleItem.MAX_COUNT) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.advanceBtnHandler.tips",
        ),
      );
      return;
    }
    if (FreedomTeamManager.Instance.hasTeam) {
      //如果存在队伍信息，则退出队伍
      FreedomTeamSocketOutManager.sendQuik();
    }
    OuterCityManager.Instance.vehicleOperation(
      OuterCityModel.VEHICLE_OPERATION_TYPE2,
      this._info.templateId,
    );
  }

  /**
   * 护送
   */
  private escortBtnHandler() {
    if (this._info.protectStatus == 1) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.escortBtnHandler.protectStatus",
        ),
      );
      return;
    }
    let t: number = new Date().getTime();
    if (t - this._intervalTime < 300) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = t;
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.escortBtn.check",
        ),
      );
      return;
    }
    if (this._arr.length == OuterCityVehicleItem.MAX_COUNT) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.escortBtnHandler.tips",
        ),
      );
      return;
    }
    if (FreedomTeamManager.Instance.hasTeam) {
      //如果存在队伍信息，则退出队伍
      FreedomTeamSocketOutManager.sendQuik();
    }
    OuterCityManager.Instance.vehicleOperation(
      OuterCityModel.VEHICLE_OPERATION_TYPE1,
      this._info.templateId,
    );
  }

  /**
   * 退出
   */
  private exitBtnHandler() {
    let t: number = new Date().getTime();
    if (t - this._intervalTime < 300) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = t;
    if (this._index == 0) {
      OuterCityManager.Instance.vehicleOperation(
        OuterCityModel.VEHICLE_OPERATION_TYPE4,
        this._info.templateId,
      );
    } else {
      OuterCityManager.Instance.vehicleOperation(
        OuterCityModel.VEHICLE_OPERATION_TYPE3,
        this._info.templateId,
      );
    }
  }

  private __renderListItem(index: number, item: OutercityPersonItem) {
    if (index < this._arr.length) {
      item.info = this._arr[index];
    } else {
      item.info = null;
    }
  }

  public set index(value: number) {
    this._index = value;
  }

  public set info(value: WildLand) {
    if (value) {
      this._info = value;
      this.refreshView();
    }
  }

  private refreshView() {
    if (this._info) {
      this.type.selectedIndex = this._index;
      if (this.outercityModel.checkSelfInTeam(this._info, this._index)) {
        //玩家自己在队列中
        this.statusCtr.selectedIndex = 2;
      } else {
        this.statusCtr.selectedIndex = this._index;
      }
      if (this._index == 0) {
        //推进队列
        this._arr = this._info.pushPlayer;
        this.titleDescTxt.text = LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.titleDescTxt1",
        );
      } else {
        //护卫队列
        this._arr = this._info.protectPlayer;
        this.titleDescTxt.text = LangManager.Instance.GetTranslation(
          "OuterCityVehicleItem.titleDescTxt2",
        );
      }
      this.countTxt.text =
        this._arr.length + "/" + OuterCityVehicleItem.MAX_COUNT;
      this.list.numItems = OuterCityVehicleItem.MAX_COUNT;
    }
  }

  private get outercityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
