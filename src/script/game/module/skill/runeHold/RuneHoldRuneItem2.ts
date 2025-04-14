import FUI_RuneHoldRuneItem2 from "../../../../../fui/Skill/FUI_RuneHoldRuneItem2";
import LangManager from "../../../../core/lang/LangManager";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class RuneHoldRuneItem2 extends FUI_RuneHoldRuneItem2 {
  private _info: GoodsInfo | number;

  private hideLevel = false;

  public get info() {
    return this._info;
  }

  public set info(info: GoodsInfo | number) {
    this._info = info;
    if (info instanceof GoodsInfo) {
      this.setIcon(info);
      return;
    }

    if (!info) {
      this.setLocked();
      return;
    }

    if (info == -1) {
      this.setPlus();
      return;
    }
  }

  private setIcon(good: GoodsInfo) {
    this.lockImg.visible = false;
    this.pulsFlag.visible = false;
    this.levelFlag.visible = true && !this.hideLevel;
    this.runeIcon.url = IconFactory.getGoodsIconByTID(
      good.templateInfo.TemplateId,
    );
    this.runeIcon.visible = true;
    this.levelTxt.text = LangManager.Instance.GetTranslation(
      "public.level3",
      good.strengthenGrade,
    );
  }

  private setLocked() {
    this.lockImg.visible = true;
    this.pulsFlag.visible = false;
    this.levelFlag.visible = false;
    this.runeIcon.visible = false;
  }

  private setPlus() {
    this.levelFlag.visible = false;
    this.lockImg.visible = false;
    this.pulsFlag.visible = true;
    this.runeIcon.visible = false;
  }

  public setLevelHide() {
    this.levelFlag.visible = false;
    this.hideLevel = true;
  }
}
