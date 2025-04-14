import FUI_RuneHoldRuneItem from "../../../../../fui/Skill/FUI_RuneHoldRuneItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export class RuneHoldRuneItem extends FUI_RuneHoldRuneItem {
  public updateView(info: GoodsInfo | number) {
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
    this.cbg.visible = false;
    this.lockImg.visible = false;
    this.plusImg.visible = false;
    this.runeIcon.visible = true;
    this.runeIcon.url = IconFactory.getGoodsIconByTID(
      good.templateInfo.TemplateId,
    );
  }

  private setLocked() {
    this.cbg.visible = true;
    this.lockImg.visible = true;
    this.plusImg.visible = false;
    this.runeIcon.visible = false;
  }

  private setPlus() {
    this.cbg.visible = true;
    this.lockImg.visible = false;
    this.plusImg.visible = true;
    this.runeIcon.visible = false;
  }
}
