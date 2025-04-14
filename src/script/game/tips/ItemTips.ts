import { BaseItem } from "../component/item/BaseItem";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import BaseTips from "./BaseTips";

/**
 * 技能提示
 */
export default class ItemTips extends BaseTips {
  private tipData: any;
  private canOperate: any;
  rewardData: GoodsInfo[] = [];
  public itemList: fgui.GList;

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.setTipsData();
  }

  protected onClickEvent() {
    this.onInitClick();
  }

  private initData() {
    [this.tipData, this.canOperate] = this.params;
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderItem,
      null,
      false,
    );
  }

  setTipsData() {
    if (!this.tipData) return;
    let rewardItem: string[] = this.tipData.split("|");
    let count = rewardItem.length;
    for (let index = 0; index < count; index++) {
      let tempStr = rewardItem[index];
      let infos = tempStr.split(",");
      let info = new GoodsInfo();
      info.templateId = Number(infos[0]);
      info.count = Number(infos[1]);
      this.rewardData.push(info);
    }
    this.itemList.numItems = this.rewardData.length;

    this.itemList.resizeToFit();
  }

  renderItem(index: number, item: BaseItem) {
    item.info = this.rewardData[index];
  }

  public OnHideWind() {
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
    // this.itemList.itemRenderer.recover();
  }
}
