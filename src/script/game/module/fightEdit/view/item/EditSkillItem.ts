import FUI_EditSkillItem from "../../../../../../fui/SkillEdit/FUI_EditSkillItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { t_s_runetemplateData } from "../../../../config/t_s_runetemplate";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { SkillPriorityType } from "../../../../constant/SkillSysDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { SkillEditModel } from "../../SkillEditModel";

/**
 * 战斗编辑选择技能列表ITEM
 */
export class EditSkillItem extends FUI_EditSkillItem {
  // public isLock: boolean = false;
  // protected _enabled: boolean = true
  private _showMask: boolean = true;

  protected _skillData: t_s_skilltemplateData | t_s_runetemplateData;
  public type: number = -1;

  public get skillData(): t_s_skilltemplateData | t_s_runetemplateData {
    return this._skillData;
  }

  onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  public setData(
    job: number,
    value: t_s_skilltemplateData | t_s_runetemplateData,
    showMask: boolean = true,
  ) {
    this._showMask = showMask;
    this._skillData = value;
    let tipData: any;
    // Logger.xjy("[BattleSkillItemII]data", value)
    if (this._skillData) {
      this.iconLoader.visible = true;
      if (value instanceof t_s_skilltemplateData) {
        this.iconLoader.icon = IconFactory.getTecIconByIcon(
          (this._skillData as t_s_skilltemplateData).Icons,
        );
        if (this.Img_Battle_S) {
          this.Img_Battle_S.visible = SkillPriorityType.isSuperSkill(
            (this._skillData as t_s_skilltemplateData).Priority,
          );
        }
        tipData = value;
      } else {
        this.Img_Battle_S.visible = false;
        tipData = TempleteManager.Instance.getSkillTemplateInfoById(
          (this._skillData as t_s_runetemplateData).SkillTemplateId,
        );
        this.iconLoader.icon = IconFactory.getTecIconByIcon(
          (this._skillData as t_s_runetemplateData).Icon,
        );
      }
      let isExist: boolean = false;
      let idx: number;
      if (this.type == 0) {
        idx = SkillEditModel.instance.getNormalSortIndex(
          job,
          this._skillData.TemplateId,
        );
        if (idx != -1) {
          this.txt_posIdx.text = (idx + 1).toString();
          this.imgMask.visible = this.txt_posIdx.visible = true;
          this.touchable = false;
          isExist = true;
        }
      } else if (this.type == 1) {
        idx = SkillEditModel.instance.getSpecialSortIndex(
          job,
          this._skillData.TemplateId,
        );
        if (idx != -1) {
          this.txt_posIdx.text = (idx + 1).toString();
          this.imgMask.visible = this.txt_posIdx.visible = true;
          this.touchable = false;
          isExist = true;
        }
      }

      if (!isExist) {
        this.imgMask.visible = this.txt_posIdx.visible = false;
        this.touchable = true;
      }
      if (!showMask) {
        this.imgMask.visible = this.txt_posIdx.visible = false;
        this.touchable = true;
        FUIHelper.setTipData(
          this,
          EmWindow.SkillTip,
          tipData,
          undefined,
          TipsShowType.onLongPress,
        );
      } else {
        FUIHelper.setTipData(
          this,
          EmWindow.SkillTip,
          tipData,
          undefined,
          TipsShowType.onLongPress,
        );
      }
    }
  }

  private addEvent() {
    this.onClick(this, this.__iconClick);
  }

  private removeEvent() {
    this.onClick(this, this.__iconClick);
  }

  protected __iconClick(evt: any) {
    // if (!this._enabled) return;
    // if (this.isLock) return;
    // this._clickFunc && this._clickFunc(this, this._data);
    if (!this._showMask) {
      this.selected = false;
    }
  }

  setSelect(isselect: boolean): void {
    // if (isselect && this.Img_Down && this.Img_Down.displayObject){
    //     this.Img_Down.visible = true;
    // }else{
    //     this.Img_Down.visible = false;
    // }
  }

  // public setEnabled(value: boolean) {
  //     this._enabled = value
  //     // this.view.displayObject.mouseEnabled = value
  //     this.setState(value ? SkillEditModel.STATE_NORMAL : SkillEditModel.STATE_DARK)
  // }

  // public getEnabled() {
  //     return this._enabled
  // }

  dispose(): void {
    this.removeEvent();
    super.dispose();
  }
}
