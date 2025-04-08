import BaseWindow from "../../core/ui/Base/BaseWindow";
import UIButton from "../../core/ui/UIButton";
import LangManager from "../../core/lang/LangManager";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import ConfigMgr from "../../core/config/ConfigMgr";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { ConfigType } from "../constant/ConfigDefine";
import ObjectUtils from "../../core/utils/ObjectUtils";
import { CampaignManager } from "../manager/CampaignManager";
import { BaseItem } from "../component/item/BaseItem";
export default class IconAlertHelperWnd extends BaseWindow {
  public modelEnable: boolean = false;
  private Btn_confirm: UIButton;
  private Btn_cancel: UIButton;
  private AlertTxt: fgui.GLabel;
  private GoodsCountTxt: fgui.GLabel;
  private n1: fgui.GComponent;
  private _data: any[];
  private _frameMinW: number = 475;
  private _buttonGap: number = 35;
  private _rowSpace: number = 10;
  private item: BaseItem;
  private param: any;
  private content: any[];
  public OnInitWind() {
    this.addEvent();
    this.setCenter();
  }

  OnShowWind() {
    super.OnShowWind();
    this.param = this.params;
    if (this.param) {
      this._data = this.param.data;
      this.content = this.param.content;
      if (this.content)
        this.popAlertFrame(
          this.content[0],
          this.content[1],
          this.content[2],
          this.content[3]
        );
    }
  }

  private addEvent() {
    this.Btn_confirm.onClick(this, this.__BtnConfirmHandler.bind(this));
    this.Btn_cancel.onClick(this, this.__BtnCancelHandler.bind(this));
    this.n1.getChild("closeBtn").on(Laya.Event.CLICK, this, this.cloaseHandler);
  }

  private removeEvent() {
    this.Btn_confirm.offClick(this, this.__BtnConfirmHandler.bind(this));
    this.Btn_cancel.offClick(this, this.__BtnCancelHandler.bind(this));
    this.n1
      .getChild("closeBtn")
      .off(Laya.Event.CLICK, this, this.cloaseHandler);
  }

  private __BtnConfirmHandler() {
    this.succeedBack();
    this.OnBtnClose();
  }

  private __BtnCancelHandler() {
    this.failBack();
    this.OnBtnClose();
  }

  private cloaseHandler() {
    this.failBack();
    this.OnBtnClose();
  }

  private succeedBack() {
    if (!this._data || this._data.length < 1) return;
    var fun: Function = this._data[0] as Function;
    this.backCall(fun, true);
    fun = null;
  }

  private failBack() {
    if (!this._data || this._data.length < 1) return;
    var fun: Function = this._data[0] as Function;
    this.backCall(fun, false);
    fun = null;
  }

  private popAlertFrame(
    title: string,
    msg: string,
    goodsTempID: number,
    goodsCount: number,
    enableHTML: boolean = false
  ) {
    this.n1.getChild("title").text = title;
    this.AlertTxt.text = msg;
    if (goodsTempID) {
      var gInfo: GoodsInfo = new GoodsInfo();
      gInfo.templateId = goodsTempID;
      this.item.info = gInfo;
      var temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        gInfo.templateId.toString()
      );
      if (temp) {
        this.GoodsCountTxt.text = gInfo.count.toString();
      }
      this.GoodsCountTxt.text = " x " + goodsCount.toString();
    } else {
      ObjectUtils.disposeObject(this.GoodsCountTxt);
      this.GoodsCountTxt = null;
      ObjectUtils.disposeObject(this.item);
      this.item = null;
    }
    this.updatePos();
  }

  private updatePos() {
    if (this.AlertTxt.width <= this._frameMinW - 70) {
      this.n1.width = this._frameMinW;
      this.AlertTxt.x = (this._frameMinW - this.AlertTxt.width) / 2;
      if (this.item) {
        this.item.x = (this._frameMinW - 70) / 2 - 70 + 10;
        this.GoodsCountTxt.x = this.item.x + 80;
      }
      this.Btn_cancel.x = this._buttonGap;
      this.Btn_confirm.x = this._frameMinW - 191 - this._buttonGap - 12;
    } else {
      this.n1.width = this.AlertTxt.width + 70;
      if (this.item) {
        this.item.x = this.n1.width / 2 - 70 + 10;
        this.GoodsCountTxt.x = this.item.x + 80;
      }
      this.Btn_cancel.x =
        (this.n1.width - this._frameMinW) / 4 + this._buttonGap;
      this.Btn_confirm.x =
        (this._frameMinW - 70) / 4 - 191 - this._buttonGap - 12;
    }
    this.AlertTxt.y = 64;
    if (this.item) {
      this.item.y = this.AlertTxt.y + this.AlertTxt.height + this._rowSpace;
      this.GoodsCountTxt.y = this.item.y + 35;
      this.Btn_confirm.y = this.Btn_cancel.y = this.item.y + 90;
    } else {
      this.Btn_confirm.y = this.Btn_cancel.y =
        this.AlertTxt.y + this.AlertTxt.height + 20;
    }
    this.n1.height = this.Btn_confirm.y + 90;
  }

  private backCall(fun: Function, b: boolean) {
    var vCanFiveParams: string = LangManager.Instance.GetTranslation(
      "yishi.utils.IconAlertHelper.CanFiveParams"
    );
    if (fun == null) return;
    switch (this._data.length - 1) {
      case 0:
        fun(b);
        break;
      case 1:
        fun(b, this._data[1]);
        break;
      case 2:
        fun(b, this._data[1], this._data[2]);
        break;
      case 3:
        fun(b, this._data[1], this._data[2], this._data[3]);
        break;
      case 4:
        fun(b, this._data[1], this._data[2], this._data[3], this._data[4]);
        break;
      case 5:
        fun(
          b,
          this._data[1],
          this._data[2],
          this._data[3],
          this._data[4],
          this._data[5]
        );
        break;
      default:
        throw new Error(vCanFiveParams);
    }
    this.cleanData();
  }

  private cleanData() {
    if (this._data) {
      while (this._data.length > 0) {
        this._data.pop();
      }
      this._data = null;
    }
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    if (CampaignManager.Instance.controller) {
      CampaignManager.Instance.controller._preFrameIsClose = true;
    }
  }
}
