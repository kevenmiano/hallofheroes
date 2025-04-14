//@ts-expect-error: External dependencies
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import SinglePassManager from "../../manager/SinglePassManager";
import SinglePassModel from "./SinglePassModel";
import SinglePassRankItem from "./item/SinglePassRankItem";

export default class SinglePassRankWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public rankList: fgui.GList;
  public confirmBtn: fgui.GButton;
  private _singlePassModel: SinglePassModel;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.setCenter();
    this.initEvent();
  }

  private initData() {
    this._singlePassModel = SinglePassManager.Instance.model;
    this.rankList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.rankList.numItems = this._singlePassModel.orderList.length;
  }

  private renderListItem(index: number, item: SinglePassRankItem) {
    item.info = this._singlePassModel.orderList[index];
  }

  private initEvent() {
    this.confirmBtn.onClick(this, this.confirmBtnHandler);
  }

  private removeEvent() {
    this.confirmBtn.offClick(this, this.confirmBtnHandler);
  }

  private confirmBtnHandler() {
    this.OnBtnClose();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
