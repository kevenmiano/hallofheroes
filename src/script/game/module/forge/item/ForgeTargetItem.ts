/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-08 14:45:34
 * @LastEditTime: 2024-04-17 14:39:09
 * @LastEditors: jeremy.xu
 * @Description: 镶嵌Item
 */

import FUI_ForgeTargetItem from "../../../../../fui/Forge/FUI_ForgeTargetItem";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import GoodsSonType from "../../../constant/GoodsSonType";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { DoubleClickManager } from "../../../manager/DoubleClickManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ForgeCtrl from "../ForgeCtrl";
import ForgeData from "../ForgeData";
import { BaseItem } from "../../../component/item/BaseItem";
import { InteractiveEvent } from "../../../constant/event/NotificationEvent";

export default class ForgeTargetItem extends FUI_ForgeTargetItem {
  public item: BaseItem;

  public index: number = 0;
  public bNotOpen: boolean;
  // public bSSEquipOpen: boolean; // 史诗及以上品质开启

  public set pos(pos: number) {
    this.item.pos = pos;
  }
  public get pos(): number {
    return this.item.pos;
  }
  public set bagType(bagType: number) {
    this.item.bagType = bagType;
  }
  public get bagType(): number {
    return this.item.bagType;
  }
  public setIcon(icon: string) {
    this.item.icon = icon;
  }
  public getIcon(): string {
    return this.item.icon;
  }
  public setIconTick(icon: string) {
    this.iconTick.icon = icon;
  }

  public set selected(value: boolean) {
    this.imgSelectEffect.visible = value;
  }

  constructor() {
    super();
    // this.registerMediator()
  }

  onConstruct() {
    super.onConstruct();
  }

  protected registerMediator() {
    this.displayObject.on(InteractiveEvent.CLICK, this, this.__clickHandler);
    this.displayObject.on(
      InteractiveEvent.DOUBLE_CLICK,
      this,
      this.__onDoubleClick,
    );
    DoubleClickManager.Instance.enableDoubleClick(this.displayObject);
  }

  protected unRegisterMediator() {
    if (this.displayObject) {
      this.displayObject.off(InteractiveEvent.CLICK, this, this.__clickHandler);
      this.displayObject.off(
        InteractiveEvent.DOUBLE_CLICK,
        this,
        this.__onDoubleClick,
      );
      DoubleClickManager.Instance.disableDoubleClick(this.displayObject);
    }
  }

  //单击打孔
  private __clickHandler(c: Event) {
    if (this.bNotOpen) {
      // //开启第四个宝石孔不需要史诗装备限制
      this.ctrl.openHole(this.pos);
    }
  }

  //双击卸下
  private __onDoubleClick(c: Event) {
    if (
      this.ctrl.data.curTabIndex == ForgeData.TabIndex.XQ &&
      this.info &&
      this.info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT
    ) {
      Laya.timer.once(100, this, () => {
        let content: string = LangManager.Instance.GetTranslation(
          "cell.view.storebag.StoreJewelCell.content",
          this.info.templateInfo.Property3,
        );
        SimpleAlertHelper.Instance.Show(
          null,
          null,
          null,
          content,
          null,
          null,
          this.removeJewelResponse.bind(this),
        );
      });
    }
  }

  private removeJewelResponse(b: boolean, check: boolean) {
    if (b) {
      if (
        this.info.templateInfo.Property3 > ResourceManager.Instance.gold.count
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("public.gold"),
        );
        return;
      }
      SocketSendManager.Instance.sendPunch(this.pos, false);
    }
  }

  public get info(): GoodsInfo {
    return this.item.info;
  }

  public set info(value: GoodsInfo) {
    this.resetItem();
    this.offClick(this, this.__clickHandler);
    if (value) {
      this.onClick(this, this.__clickHandler);
      // this.bSSEquipOpen = value.templateInfo.Profile < GoodsProfile.Level5 && this.index == 4
      let id = value["join" + this.index];
      if (id > 0) {
        //已打孔, 已装备
        let info: GoodsInfo = new GoodsInfo();
        info.pos = this.pos;
        info.templateId = id;

        info.isInlay = true;
        this.item.info = info;
      } else if (id == 0) {
        //已打孔, 未装备 Icon_IconBox_Add
        this.item.info = null;
      } else if (id == -1) {
        //未打孔 Icon_IconBox70_Lock2
        this.bNotOpen = true;
        this.item.info = null;
      }

      // Logger.log("[InlayItem] id=", value['join' + this.index], "index=", this.index, "bNotOpen=", this.bNotOpen, "bSSEquipOpen=", this.bSSEquipOpen, "itemInfo=", this.item.info)
    } else {
      this.item.info = null;
    }
  }

  private get ctrl(): ForgeCtrl {
    let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl;
    return ctrl;
  }

  public resetItem() {
    this.item.info = null;
    this.selected = false;
    this.bNotOpen = false;
    // this.bSSEquipOpen = false
    this.rTxtDesc.text = "";
    this.rTxtDesc.color = "#FFC68F";
  }

  public dispose() {
    this.item.dispose();
    // this.unRegisterMediator()
    super.dispose();
  }
}
