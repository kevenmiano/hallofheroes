//@ts-expect-error: External dependencies
import FUI_SJewelCom from "../../../../fui/SBag/FUI_SJewelCom";
import LangManager from "../../../core/lang/LangManager";
import { SocketManager } from "../../../core/net/SocketManager";
import UIManager from "../../../core/ui/UIManager";
import BaseTipItem from "../../component/item/BaseTipItem";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { BagType } from "../../constant/BagDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { EmWindow } from "../../constant/UIDefine";
import { UpgradeType } from "../../constant/UpgradeType";
import {
  BagEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { GoodsHelp } from "../../utils/GoodsHelp";
import ItemUseStoreReqMsg = com.road.yishi.proto.item.ItemUseStoreReqMsg;

/**
 * 新版背包
 * @description 灵魂刻印
 * @author zhihua.zhou
 * @date 2022/12/2
 * @ver 1.3
 */
export class SJewelCom extends FUI_SJewelCom {
  private ownNum: number = 0;
  private _max: number;
  private _isMaxLevel: boolean = false;
  private isInited: boolean = false;

  public tipItem: BaseTipItem;
  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  onConstruct() {
    super.onConstruct();
  }

  onShow() {
    this._max = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_SOUL_CRYSTAL,
      BagType.Player,
    );
    this.txt_input.text = this._max.toString();
    if (!this.isInited) {
      //避免切换页签的时候重复添加、移除事件
      this.isInited = true;
      this.addEvent();
    }
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_SHUJING);
    this.refreshView();
  }

  onHide() {
    if (this.isInited) {
      this.isInited = false;
      this.removeEvent();
    }
  }

  private addEvent() {
    this.btn_levelup.onClick(this, this.onLevelup);
    // this.txt_input.on(Laya.Event.INPUT, this, this.onChange);
    this.thane.addEventListener(
      PlayerEvent.JEWELGP_UPDATE,
      this.__updateHandler,
      this,
    );
    this.thane.addEventListener(
      PlayerEvent.JEWELGRADES_UPDATE,
      this.__updateHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdateHandler,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemUpdateHandler,
      this,
    );
  }

  private removeEvent() {
    this.btn_levelup.offClick(this, this.onLevelup);

    this.thane.removeEventListener(
      PlayerEvent.JEWELGP_UPDATE,
      this.__updateHandler,
      this,
    );
    this.thane.removeEventListener(
      PlayerEvent.JEWELGRADES_UPDATE,
      this.__updateHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdateHandler,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemUpdateHandler,
      this,
    );
  }

  private refreshView(): void {
    this.txt_lv0.text = LangManager.Instance.GetTranslation(
      "armyII.viewII.equip.JewelFrame.JewelEffValueTxt",
      GoodsHelp.getJewelEffecyByGrade(this.thane.jewelGrades),
    );
    this.txt_lv.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this.thane.jewelGrades,
    );
    this.ownNum = GoodsManager.Instance.getCountBySontypeAndBagType(
      GoodsSonType.SONTYPE_SOUL_CRYSTAL,
      BagType.Player,
    );
    var temp: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.thane.jewelGrades + 1,
        UpgradeType.UPGRADE_TYPE_SOUL,
      );
    if (temp) {
      this.bar.value = (this.thane.jewelGp / temp.Data) * 100;
      this.bar.getChild("title").asTextField.text =
        this.thane.jewelGp + "/" + temp.Data;
      this.btn_levelup.enabled = this.ownNum > 0;
      this.txt_lv1.text = LangManager.Instance.GetTranslation(
        "armyII.viewII.equip.JewelFrame.JewelEffValueTxt",
        GoodsHelp.getJewelEffecyByGrade(this.thane.jewelGrades + 1),
      );
      let needNum = temp.Data - this.thane.jewelGp;
      this.txt_input.text = needNum + "";
      this.btn_levelup.getChild("redDot").visible = this.ownNum >= needNum;
    } else {
      temp = TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.thane.jewelGrades,
        UpgradeType.UPGRADE_TYPE_SOUL,
      );
      this.bar.value = 100;
      this.bar.getChild("title").asTextField.text = temp.Data + "/" + temp.Data;
      this.txt_lv1.text = LangManager.Instance.GetTranslation(
        "buildings.casern.view.PawnLevelUpFrame.command03",
      );
      this.btn_levelup.enabled = false;
      this._isMaxLevel = true;
      this.txt_input.text = "0";
      this.txt_input.visible = false;
      this.maxTitle.visible = true;
      this.tipItem.visible = false;
      this.txt_input.visible = false;
      this.nextLevelLab.visible = false;
      this.btn_levelup.visible = false;
      this.btn_levelup.getChild("redDot").visible = false;
    }
    // this.txt_own.text = own_num.toString();
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.UPDATE_FISH_INFO,
    );
  }

  private onChange(): void {
    var value: number = Number(this.txt_input.text);
    if (!value) value = 0;
    if (value > this._max) {
      this.txt_input.text = this._max.toString();
    } else {
      this.txt_input.text = value.toString();
    }
    if (this._isMaxLevel) {
      if (!this.btn_levelup.enabled) return;
      this.btn_levelup.enabled = false;
    } else {
      this.btn_levelup.enabled = this._max > 0 && value > 0;
    }
  }

  private __updateHandler(e: PlayerEvent): void {
    this.refreshView();
    this._max = this.ownNum;
    //TODO
    // let wnd: RoleWnd = UIManager.Instance.FindWind(EmWindow.RoleWnd)
    // if (wnd) {
    //     if (wnd.isShowing) {
    //         wnd.forceUpdate(this.thane.jewelGrades)
    //     }
    // }
  }

  private __bagItemUpdateHandler(infos: GoodsInfo[]): void {
    for (let info of infos)
      if (info.templateInfo.SonType == GoodsSonType.SONTYPE_SOUL_CRYSTAL) {
        this.refreshView();
        break;
      }
  }

  /**
   * 升级
   */
  private onLevelup(): void {
    let msg: ItemUseStoreReqMsg = new ItemUseStoreReqMsg();
    let need = +this.txt_input.text;
    if (need > this.ownNum) {
      need = this.ownNum;
    }
    msg.count = need;
    SocketManager.Instance.send(C2SProtocol.C_BAG_USESTORE, msg);
    this.btn_levelup.enabled = false;
    this.txt_add.text = "+" + need;
    this.txt_add.visible = true;
    this.txt_add.y = 270;
    this.txt_input.text = "0";

    Laya.Tween.to(
      this.txt_add,
      { y: 240 },
      500,
      Laya.Ease.sineOut,
      Laya.Handler.create(this, function () {
        this.txt_add.visible = false;
      }),
    );
  }

  private onHelp() {
    let title = "";
    let content = "";
    title = LangManager.Instance.GetTranslation("public.help");
    content = LangManager.Instance.GetTranslation(
      "role.roleProperty.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  public dispose() {
    super.dispose();
  }
}
