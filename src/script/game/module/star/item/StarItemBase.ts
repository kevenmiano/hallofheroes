/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2021-12-30 21:01:02
 * @LastEditors: jeremy.xu
 * @Description:
 */
import FUI_StarItemBase from "../../../../../fui/Star/FUI_StarItemBase";
import { StarSelectState } from "../../../constant/StarDefine";
import StarInfo from "../../mail/StarInfo";
import StarItem from "./StarItem";

export default class StarItemBase extends FUI_StarItemBase {
  public itemDrag: StarItem;
  private _selectState: StarSelectState = StarSelectState.Default;
  private _composeState: StarSelectState = StarSelectState.Default;
  private _info: StarInfo;
  private _opened: boolean = false;
  public set opened(value: boolean) {
    this._opened = value;
    this.itemDrag.opened = value;
    this.cOpened.selectedIndex = value ? 0 : 1;
  }
  public get opened(): boolean {
    return this._opened;
  }

  onConstruct() {
    super.onConstruct();
    this.itemDrag = this.getChild("item") as StarItem;
    this.canOperationMc.stop();
    this.selectedPic.visible = false;
  }

  public set info(data: StarInfo) {
    this._info = data;
    this.itemDrag.info = data;
  }

  public get info() {
    return this._info;
  }

  public get selectState(): StarSelectState {
    return this._selectState;
  }

  public set flag(value: boolean) {
    if (value) {
      this.canOperationMc.play();
      this.selectedPic.visible = true;
    } else {
      this.canOperationMc.stop();
      this.selectedPic.visible = false;
    }
  }

  public set selectState(value: StarSelectState) {
    this._selectState = value;
    this.__starSelectState(value);
  }

  public get composeState(): StarSelectState {
    return this._composeState;
  }

  public set composeState(value: StarSelectState) {
    this._composeState = value;
    this.__starSelectState(value);
  }

  private __starSelectState(state: StarSelectState) {
    if (!this._info) return;

    switch (state) {
      case StarSelectState.Default:
        this.cSelectState.selectedIndex = 0;
        break;
      case StarSelectState.Selectable:
        this.cSelectState.selectedIndex = 1;
        break;
      case StarSelectState.Selected:
        this.cSelectState.selectedIndex = 2;
        break;
      default:
        break;
    }
  }

  public gray() {
    this.itemDrag.gray();
    this.itemDrag.touchable = false;
  }

  public normal() {
    this.itemDrag.normal();
    this.itemDrag.touchable = true;
  }

  public showName(show: boolean) {
    this.itemDrag.txtName.visible = show;
  }

  public dispose() {
    super.dispose();
  }
}
