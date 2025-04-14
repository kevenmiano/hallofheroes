//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_consortiabossData } from "../../../config/t_s_consortiaboss";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";

export default class ConsortiaBossRewardWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public descTxt2: fgui.GTextField;
  public descTxt1: fgui.GTextField;
  public vicoryList: fgui.GList;
  public failedList: fgui.GList;
  private _winGoodsList: Array<GoodsInfo> = [];
  private _lostGoodsList: Array<GoodsInfo> = [];
  private _model: ConsortiaModel;
  private _contorller: ConsortiaControler;
  public OnInitWind() {
    super.OnInitWind();
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "ConsortiaBossWnd.title",
    );
    this.descTxt1.text = LangManager.Instance.GetTranslation(
      "ConsortiaBossWnd.descTxt1",
    );
    this.descTxt2.text = LangManager.Instance.GetTranslation(
      "ConsortiaBossWnd.descTxt2",
    );
    this.initData();
    this.initEvent();
    this.initView();
    this.setCenter();
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._model = this._contorller.model;
  }

  private initEvent() {
    Utils.setDrawCallOptimize(this.vicoryList);
    Utils.setDrawCallOptimize(this.failedList);
    this.vicoryList.itemRenderer = Laya.Handler.create(
      this,
      this.rendervicoryList,
      null,
      false,
    );
    this.failedList.itemRenderer = Laya.Handler.create(
      this,
      this.renderfailedList,
      null,
      false,
    );
  }

  private removeEvent() {
    // this.vicoryList.itemRenderer.recover();
    // this.failedList.itemRenderer.recover();
    Utils.clearGListHandle(this.vicoryList);
    Utils.clearGListHandle(this.failedList);
  }

  private rendervicoryList(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    item.info = this._winGoodsList[index];
  }

  private renderfailedList(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    item.info = this._lostGoodsList[index];
  }

  private initView() {
    let bosstemp: t_s_consortiabossData =
      TempleteManager.Instance.getConsortiaBossRewardByLevel(
        this._model.bossInfo.grade,
      );
    if (!bosstemp) return;
    let winArr: Array<any> = bosstemp.WinReward.split("|");
    let lostArr: Array<any> = bosstemp.LostReward.split("|");
    let winLen: number = winArr.length;
    let lostLen: number = lostArr.length;
    this._winGoodsList = [];
    this._lostGoodsList = [];
    for (let i: number = 0; i < winLen; i++) {
      let winGoodsArr: Array<any> = winArr[i].split(",");
      let winGoodsTempInfo: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(winGoodsArr[0]);
      if (!winGoodsTempInfo) continue;

      var winGoodsInfo: GoodsInfo = new GoodsInfo();
      winGoodsInfo.templateId = winGoodsArr[0];
      winGoodsInfo.count = winGoodsArr[1];
      this._winGoodsList.push(winGoodsInfo);
    }
    for (var j: number = 0; j < lostLen; j++) {
      var lostGoodsArr: Array<any> = lostArr[j].split(",");
      var lostGoodsTempInfo: t_s_itemtemplateData =
        TempleteManager.Instance.getGoodsTemplatesByTempleteId(lostGoodsArr[0]);
      if (!lostGoodsTempInfo) continue;
      var lostGoodsInfo: GoodsInfo = new GoodsInfo();
      lostGoodsInfo.templateId = lostGoodsArr[0];
      lostGoodsInfo.count = lostGoodsArr[1];
      this._lostGoodsList.push(lostGoodsInfo);
    }
    this.vicoryList.numItems = this._winGoodsList.length;
    this.failedList.numItems = this._lostGoodsList.length;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
