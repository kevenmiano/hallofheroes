import FUI_PveGateItem from "../../../../../fui/PveGate/FUI_PveGateItem";
import Logger from "../../../../core/logger/Logger";
import { EmPackName } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import { PveGateListData } from "./PveGateWnd";

export default class PveGateItem extends FUI_PveGateItem {
  private _locked = false;

  private _info: PveGateListData;

  protected onConstruct(): void {
    super.onConstruct();
    this.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDown);
    this.on(Laya.Event.MOUSE_UP, this, this.__mouseUp);
  }

  private __mouseDown() {
    this.imgSelected.visible = true;
  }

  private __mouseUp() {
    this.imgSelected.visible = false;
  }

  public get locked() {
    return this._locked;
  }

  public set locked(b: boolean) {
    this._locked = b;
    this.lockCtrl.selectedIndex = b ? 1 : 0;
    this.crusadeImg.grayed = b;
    this.itemIcon.grayed = b;
  }

  public set info(info: PveGateListData) {
    this._info = info;
    this.updateView();
  }

  private updateView() {
    if (!this._info) return;
    this.locked = this._info.locked;
    this.title = this._info.title;
    this.itemIcon.url = FUIHelper.getItemURL(
      EmPackName.PveGate,
      this._info.icon,
    );
    this.desc.text = this._info.desc;
    this.bottomGroup.visible = this._info.locked;
  }

  public get info() {
    return this._info;
  }
}
