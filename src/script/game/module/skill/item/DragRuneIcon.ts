import FUI_DragRuneIcon from "../../../../../fui/Skill/FUI_DragRuneIcon";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { DragObject, DragType } from "../../../component/DragObject";
import { RuneInfo } from "../../../datas/RuneInfo";
/**
 *
 */
export default class DragRuneIcon
  extends FUI_DragRuneIcon
  implements DragObject
{
  dragType: DragType = null;
  dragEnable: boolean = false;

  constructor() {
    super();
    // if (!this.displayObject['dyna']) {
    //     this.displayObject['dyna'] = true;
    // }
  }

  getDragType(): DragType {
    return this.dragType;
  }

  setDragType(value: DragType) {
    this.dragType = value;
  }

  getDragEnable(): boolean {
    return this.dragEnable;
  }

  setDragEnable(value: boolean) {
    this.dragEnable = value;
  }

  getDragData() {
    return this._runeInfo;
  }
  setDragData(value: any) {
    this._runeInfo = value;
  }

  public set runeInfo(value: RuneInfo) {
    this._runeInfo = value;
    this.iconloader.url = IconFactory.getTecIconByIcon(
      this._runeInfo.templateInfo.Icon,
    );
  }

  public get runeInfo(): RuneInfo {
    return this._runeInfo;
  }

  private _runeInfo: RuneInfo;
}
