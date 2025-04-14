//@ts-expect-error: External dependencies
import FUI_EditTalentItem from "../../../../../../fui/SkillEdit/FUI_EditTalentItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { EmWindow } from "../../../../constant/UIDefine";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { SkillEditModel } from "../../SkillEditModel";

/**
 * 战斗编辑选择技能天赋列表ITEM
 */
export class EditTalentItem extends FUI_EditTalentItem {
  isLock: boolean = false;
  type: number = -1;
  protected _skillData: t_s_skilltemplateData;

  public get skillData(): t_s_skilltemplateData {
    return this._skillData;
  }

  onConstruct() {
    super.onConstruct();
    // this.addEvent();
  }
  public setData(job: number, value: t_s_skilltemplateData) {
    this._skillData = value;
    // Logger.xjy("[BattleSkillItemII]data", value)
    if (this._skillData) {
      this._skillData.Grades = 0;
      this.itemIcon.icon = IconFactory.getTecIconByIcon(this._skillData.Icons);
      if (!this.isLock) {
        FUIHelper.setTipData(
          this,
          EmWindow.SkillTip,
          value,
          undefined,
          TipsShowType.onLongPress,
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
    }
  }

  // private addEvent() {
  //     this.onClick(this, this.__iconClick)
  // }

  // private removeEvent() {
  //     this.onClick(this, this.__iconClick)
  // }

  // protected __iconClick(evt: any) {
  // if (!this._enabled) return;
  // if (this.isLock) return;
  // if (BattleManager.Instance.battleModel) {
  //     BattleManager.Instance.battleModel.setAutoFight(BattleModel.CANCEL_AUTO_FIGHT);
  // }
  // if (!this._data || this._data.useCount <= 0) return;
  // if (this.isCding) return;

  // this._clickFunc && this._clickFunc(this, this._data);

  // if (this.Img_Down && this.Img_Down.displayObject){
  //     this.Img_Down.visible = true;
  // }

  // }

  // public setEnabled(value: boolean) {
  //     this._enabled = value
  //     // this.view.displayObject.mouseEnabled = value
  //     this.setState(value ? SkillEditModel.STATE_NORMAL : SkillEditModel.STATE_DARK)
  // }

  // public getEnabled() {
  //     return this._enabled
  // }

  dispose(): void {
    // this.removeEvent();
    super.dispose();
  }
}
