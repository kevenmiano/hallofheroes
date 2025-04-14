//@ts-expect-error: External dependencies
import FUI_DragIconCom from "../../../../../fui/Skill/FUI_DragIconCom";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { DragObject, DragType } from "../../../component/DragObject";
import { SkillPriorityType } from "../../../constant/SkillSysDefine";
import { RuneInfo } from "../../../datas/RuneInfo";
import { SkillInfo } from "../../../datas/SkillInfo";
/**
 *
 */
export default class DragIconCom extends FUI_DragIconCom implements DragObject {
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
    if (this._data) {
      return this.vdata;
    } else {
      return this._runeInfo;
    }
  }
  setDragData(value: any) {
    if (value instanceof SkillInfo) {
      this._data = value;
    } else {
      this._runeInfo = value;
    }
  }

  public set vdata(value: SkillInfo) {
    this._data = value;
    this.iconloader.url = IconFactory.getTecIconByIcon(
      this._data.templateInfo.Icons,
    );
    this._SIcon.visible = SkillPriorityType.isSuperSkill(
      this._data.templateInfo.Priority,
    ); // == SkillPriorityType.SUPER_SKILL;
  }

  public set runeInfo(value: RuneInfo) {
    this._runeInfo = value;
    this.iconloader.url = IconFactory.getTecIconByIcon(
      this._runeInfo.templateInfo.Icon,
    );
  }

  public get vdata(): SkillInfo {
    return this._data;
  }

  public get runeInfo(): RuneInfo {
    return this._runeInfo;
  }

  private _data: SkillInfo;
  private _runeInfo: RuneInfo;
}
