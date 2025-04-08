import BaseWindow from "../../core/ui/Base/BaseWindow";
import UIButton from "../../core/ui/UIButton";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { BaseItem } from "../component/item/BaseItem";
import { TempleteManager } from "../manager/TempleteManager";
import LangManager from "../../core/lang/LangManager";
import { SharedManager } from "../manager/SharedManager";
import Utils from "../../core/utils/Utils";
/**
 * 获得道具确认框
 * 1、道具图标显示
 * 2、当前道具拥有数量文字显示
 * 3、提示内容
 * UIManager.Instance.ShowWind(EmWindow.GetGoodsAlert, {content:提示内容,goodsId:道具ID,goodsCount:道具拥有数量文字显示,callback:确认回调});
 */
export default class GetGoodsAlert extends BaseWindow {
  /**确认按钮 */
  private btn_confirm: UIButton;
  /**取消按钮 */
  private btn_cancel: UIButton;

  private check1Btn: UIButton;
  /**提示内容 */
  private txt_content: fgui.GLabel;
  /** 道具图标显示 */
  private list: fgui.GList;
  private n1: fgui.GComponent;
  private c1: fgui.Controller;
  private listData: Array<GoodsInfo>;
  private goodsIdMap = {};

  public OnInitWind() {
    this.addEvent();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.listData = [];
    if (this.params) {
      this.txt_content.text = LangManager.Instance.GetTranslation(
        "petEuip.resolveTip1"
      );
      let len = this.params.goodsList.length;

      // {goodsId:element.templateInfo.Refresh,count:element.templateInfo.Property5}
      //同道具ID的合并为1个道具项
      for (let i = 0; i < len; i++) {
        let obj = this.params.goodsList[i];
        const gid = obj.goodsId;
        if (this.goodsIdMap[gid]) {
          this.goodsIdMap[gid] += obj.count;
        } else {
          this.goodsIdMap[gid] = obj.count;
        }
      }

      for (const key in this.goodsIdMap) {
        if (Object.prototype.hasOwnProperty.call(this.goodsIdMap, key)) {
          const element = this.goodsIdMap[key];
          let goodsInfo = new GoodsInfo();
          goodsInfo.templateId = Number(key);
          goodsInfo.count = element;
          this.listData.push(goodsInfo);
        }
      }

      len = this.listData.length;
      this.list.numItems = len;
      this.c1 = this.contentPane.getController("c1");
      if (len >= 5) {
        this.c1.setSelectedIndex(4);
      } else {
        this.c1.setSelectedIndex(len - 1);
      }
    }
  }

  private addEvent() {
    this.btn_confirm.onClick(this, this.onConfirm.bind(this));
    this.btn_cancel.onClick(this, this.onCancel.bind(this));
    this.n1.getChild("closeBtn").on(Laya.Event.CLICK, this, this.onClose);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.__renderListItem,
      null,
      false
    );
  }

  private removeEvent() {
    this.btn_confirm.offClick(this, this.onConfirm.bind(this));
    this.btn_cancel.offClick(this, this.onCancel.bind(this));
    this.n1.getChild("closeBtn").off(Laya.Event.CLICK, this, this.onClose);
    // this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
  }

  private __renderListItem(index: number, item: BaseItem) {
    if (item) {
      let goodsInfo = this.listData[index];
      if (goodsInfo) {
        if (this.goodsIdMap[goodsInfo.templateId] > 1) {
          goodsInfo.count = this.goodsIdMap[goodsInfo.templateId];
        }
        item.info = goodsInfo;
      }
    }
  }

  private onConfirm() {
    if (this.params.callback) {
      this.params.callback(true);
    }
    this.OnBtnClose();
  }

  private onCancel() {
    this.OnBtnClose();
  }

  private onClose() {
    this.OnBtnClose();
  }

  OnHideWind() {
    SharedManager.Instance.notAlertThisLogin = this.check1Btn.selected;
    super.OnHideWind();
    this.removeEvent();
    this.params = null;
  }
}
