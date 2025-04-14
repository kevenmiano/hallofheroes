import FUI_SFashionCom from "../../../../../fui/SBag/FUI_SFashionCom";
import { FashionManager } from "../../../manager/FashionManager";
import { SharedManager } from "../../../manager/SharedManager";
import { FashionModel } from "../../bag/model/FashionModel";
import { SFashionComposeView } from "./SFashionComposeView";
import { SFashionSwitchView } from "./SFashionSwitchView";

/**
 * @description 时装图鉴和时装合成界面  对应时装部位的分页, 以及对应时装的鉴定按钮上增加红点
 * @author zhihua.zhou
 * @date 2023/2/17 19:24
 * @ver 1.5
 *
 */
export class SFashionCom extends FUI_SFashionCom {
  private isInited: boolean = false;
  private fashcompose: SFashionComposeView;
  private fashswitch: SFashionSwitchView;
  private _detailBtn: any;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.fashcompose = this.fashcompose_com as SFashionComposeView;
    this.fashswitch = this.fashswitch_com as SFashionSwitchView;
  }

  onShow(type: number = 0, detailBtn: any) {
    this._detailBtn = detailBtn;
    this.initView(type);
  }

  updateRedDot(showRed) {
    this.tab.getChildAt(0).asButton.getChild("redDot").visible = showRed;
    this.fashswitch.checkRedDot();
  }

  onHide() {
    if (this.isInited) {
      this.removeEvent();
      if (this.fashcompose) {
        this.fashcompose.removeEvent();
      }
      if (this.fashswitch) {
        this.fashswitch.removeEvent();
      }
    }
    this.isInited = false;
  }

  private initView(type: number = 0) {
    if (type == 1) {
      if (FashionManager.Instance.fashionIdentityProgress <= 2) {
        SharedManager.Instance.fashionIdentityProgress = 3;
      }
      this.fashionModel.selectedPanel = FashionModel.FASHION_SWITCH_PANEL;
      this.c1.selectedIndex = 0;
      this.tab.selectedIndex = 0;
    } else {
      this.c1.selectedIndex = 1;
      this.tab.selectedIndex = 1;
      this.fashionModel.selectedPanel = FashionModel.FASHION_COMPOSE_PANEL;
    }
    this.fashswitch.initView();
    this.fashcompose.initView();
    if (!this.isInited) {
      this.isInited = true;
      this.addEvent();
    }
  }

  private addEvent() {
    this.tab.on(Laya.Event.CLICK, this, this.onTab);
  }

  private removeEvent() {
    this.tab.off(Laya.Event.CLICK, this, this.onTab.bind(this));
  }

  private onTab() {
    let btnIndex = this.tab.selectedIndex;
    this.c1.selectedIndex = btnIndex;
    switch (btnIndex) {
      case 0:
        this.fashionModel.selectedPanel = FashionModel.FASHION_SWITCH_PANEL;
        this._detailBtn!.visible = true;
        break;
      case 1:
        this.fashionModel.selectedPanel = FashionModel.FASHION_COMPOSE_PANEL;
        this._detailBtn!.visible = false;
        break;
    }
  }
  private get fashionModel(): FashionModel {
    return FashionManager.Instance.fashionModel;
  }

  dispose(): void {
    this.removeEvent();
    super.dispose();
  }
}
