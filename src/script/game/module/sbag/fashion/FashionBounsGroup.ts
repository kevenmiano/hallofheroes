import FUI_FashionBounsGroup from "../../../../../fui/SBag/FUI_FashionBounsGroup";
import { FashionBounsAttribute } from "./FashionBounsAttribute";

export class FashionBounsGroup extends FUI_FashionBounsGroup {
  private listData: string[];

  protected onConstruct(): void {
    super.onConstruct();
    this.attList.itemRenderer = Laya.Handler.create(
      this,
      this.fashionBonusRender,
      null,
      false,
    );
    this.attList.setVirtual();
  }

  public setTitle(text: string) {
    this.titleLab.text = text;
  }

  public setAttributeList(listData: string[]) {
    if (!listData) return;
    this.listData = listData;
    this.attList.numItems = this.listData.length;
  }

  private fashionBonusRender(index: number, item: FashionBounsAttribute) {
    let attributeData = this.listData[index];
    item.setAttribute(attributeData);
  }
}
