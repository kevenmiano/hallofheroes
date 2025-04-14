//@ts-expect-error: External dependencies
import FUI_DragRuneIcon from "../../../../../fui/Skill/FUI_DragRuneIcon";
import FUI_DragSealIcon from "../../../../../fui/Skill/FUI_DragSealIcon";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { DragObject, DragType } from "../../../component/DragObject";
import { ConfigType } from "../../../constant/ConfigDefine";
import { RuneInfo } from "../../../datas/RuneInfo";
import { SkillInfo } from "../../../datas/SkillInfo";
/**
 * 圣印拖动图标
 */
export default class DragSealIcon
  extends FUI_DragSealIcon
  implements DragObject
{
  dragType: DragType = null;
  dragEnable: boolean = false;
  private _maxGrade: number = 10;

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
    return this._skillInfo;
  }
  setDragData(value: any) {
    this._skillInfo = value;
  }

  updateLevel(level: number) {
    this._skillInfo.grade = level;
    this.level.text = level + "/" + this._maxGrade;
  }

  public set skillInfo(value: SkillInfo) {
    this._skillInfo = value;
    let skillTemplateDic = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      "SonType" + value.templateInfo.SonType,
    );
    this._maxGrade = skillTemplateDic.length;
    this.level.text = value.grade + "/" + this._maxGrade;
    if (this._skillInfo.templateInfo.Icons)
      this.iconloader.url = IconFactory.getTecIconByIcon(
        this._skillInfo.templateInfo.Icons,
      );
  }

  public get skillInfo(): SkillInfo {
    return this._skillInfo;
  }

  private _skillInfo: SkillInfo;
}
