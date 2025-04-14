import { MemToolItemInfo } from "@/script/game/module/memTool/MemToolItemInfo";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import Utils from "../../../core/utils/Utils";
import MemToolItem from "./MemToolItem";
// import MemToolItemInfo from "./MemToolItemInfo";
import MemToolModel from "./MemToolModel";

export default class MemToolWnd extends BaseWindow {
  // public frame: fgui.GLabel;
  public memList: fgui.GList = null;
  public memTitle: MemToolItem = null;
  public btnP: fgui.GButton = null;
  public imgPreview: fgui.GLoader = null;
  public imgBg: fgui.GGraph = null;
  public releaseMask: fgui.GGraph = null;
  public preControl: fgui.Controller = null;

  private _type: number;
  private helpBtn: UIButton;
  frame: any;

  public OnInitWind() {
    this.setCenter();
    this._type = this.params;
    this.helpBtn.visible = false;
    this.preControl = this.getController("preControl");

    // Logger.log(this.preControl);
    this.initView();
  }

  initView() {
    this.memTitle.txt1.text = "Preview";
    this.memTitle.txt2t.text = "Url";
    this.memTitle.txt3.text = "Size";
    this.memTitle.txt4.text = "Type";
    this.memTitle.txt5.fontSize = 14;
    this.memTitle.txt5.text = "RefCount";
    this.memTitle.txt6.text = "Force Release";
    this.memTitle.btnRelease.visible = false;
  }

  OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    this.setDataList();

    this.frame.getChild("title").text = MemToolModel.instance.getTips();
    this.preControl.selectedIndex = 0;
  }

  private addEvent() {
    this.memList.setVirtual();
    this.memList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.btnP.onClick(this, this.onClosePreview);
    MemToolModel.instance.addEventListener(
      "ResfreshMemTool",
      this.onRefresh,
      this,
    );
    MemToolModel.instance.addEventListener("MemPreview", this.onPreview, this);
  }

  private offEvent() {
    // this.memList && this.memList.itemRenderer.recover();
    Utils.clearGListHandle(this.memList);
    MemToolModel.instance.off("ResfreshMemTool", this.onRefresh, this);
    MemToolModel.instance.off("MemPreview", this.onPreview, this);
  }

  private datalist: Array<MemToolItemInfo> = [];
  setDataList() {
    this.datalist = MemToolModel.instance.memList;
    if (this.datalist && this.datalist.length)
      this.memList.numItems = this.datalist.length;
    this.memList.ensureBoundsCorrect();
  }

  onRefresh() {
    this.setDataList();

    this.frame.getChild("title").text = MemToolModel.instance.getTips();
  }

  onPreview(tex) {
    if (tex) {
      this.preControl.selectedIndex = 1;

      (this.imgPreview as any).onExternalLoadSuccess(tex);
    }
  }

  onClosePreview() {
    this.preControl.selectedIndex = 0;
  }

  renderListItem(index: number, item: MemToolItem) {
    item.type = this._type;
    item.vdata = this.datalist[index];
  }

  OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }
}
