import FUI_PvpRewardsItem from "../../../../../../fui/RoomList/FUI_PvpRewardsItem";
import LangManager from "../../../../../core/lang/LangManager";
import { BaseItem } from "../../../../component/item/BaseItem";
import { t_s_pluralpvpsegmentData } from "../../../../config/t_s_pluralpvpsegment";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";

export default class PvpRewardsItem extends FUI_PvpRewardsItem {
  goodsArr: GoodsInfo[];
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  setInfo(info: t_s_pluralpvpsegmentData) {
    this.rankStarItem.setInfo(info.Id);
    this.txtTitle.text = info.Segment;
    this.txtDes.text = this.getDes(info.Scoreinterval);
    this.goodsArr = this.getRewards(info.RewardShow);
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.itemList.numItems = this.goodsArr.length;
  }

  renderListItem(index: number, item: BaseItem) {
    item.info = this.goodsArr[index];
  }

  getDes(str: string) {
    let ret = "";
    let arrs = str.split(",");
    if (arrs.length == 2) {
      ret = LangManager.Instance.GetTranslation(
        "RoomList.pvp.rewards.item.txt1",
        arrs[0],
        arrs[1],
      );
    } else if (arrs.length == 1) {
      ret = LangManager.Instance.GetTranslation(
        "RoomList.pvp.rewards.item.txt2",
        arrs[0],
      );
    }
    return ret;
  }

  getRewards(rewardStr: string) {
    let rewards: GoodsInfo[] = [];
    let rewardItem: string[] = rewardStr.split("|");
    let count = rewardItem.length;
    for (let i = 0; i < count; i++) {
      let tempStr = rewardItem[i];
      let infos = tempStr.split(",");
      let goods = new GoodsInfo();
      goods.templateId = Number(infos[0]);
      goods.count = Number(infos[1]);
      rewards.push(goods);
    }
    return rewards;
  }

  public dispose() {
    super.dispose();
  }
}
