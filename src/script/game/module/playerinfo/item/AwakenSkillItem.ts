//@ts-expect-error: External dependencies
import FUI_AwakenSkillItem from "../../../../../fui/PlayerInfo/FUI_AwakenSkillItem";
import Logger from "../../../../core/logger/Logger";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import AwakenSkillItemDrag from "./AwakenSkillItemDrag";

export default class AwakenSkillItem extends FUI_AwakenSkillItem {
  private _skillType: number = 0;

  private item: AwakenSkillItemDrag = null;

  public set skillType(value: number) {
    this._skillType = value;
    this.cSkillType.selectedIndex = value == 1 ? 1 : 0;
  }

  public get skillType(): number {
    return this._skillType;
  }
  private _info: t_s_skilltemplateData;

  onConstruct() {
    super.onConstruct();
  }

  public set info(data: t_s_skilltemplateData) {
    this._info = data;
    try {
      this.list.removeChildrenToPool();
    } catch (error) {
      Logger.error(error);
    }
    this.item = this.list.addItemFromPool() as AwakenSkillItemDrag;
    (this.item as AwakenSkillItemDrag).isLock = this._skillType == 1;
    (this.item as AwakenSkillItemDrag).skillType = this._skillType;
    if (data) {
      (this.item as AwakenSkillItemDrag).info = data;
    } else {
      (this.item as AwakenSkillItemDrag).info = null;
    }
  }

  public get info() {
    if (this.item) {
      //优先返回子对象数据信息
      return (this.item as AwakenSkillItemDrag).info;
    }
    return this._info;
  }

  public set index(index: number) {
    this.txtIndex.text = index.toString();
  }

  public dispose() {
    this.item.dispose();
  }
}
