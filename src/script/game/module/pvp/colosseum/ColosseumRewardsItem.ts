/*
 * @Author: jeremy.xu
 * @Date: 2024-02-19 18:08:33
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-19 18:09:29
 * @Description:
 */
import FUI_ColosseumRewardsItem from "../../../../../fui/Pvp/FUI_ColosseumRewardsItem";
import LangManager from "../../../../core/lang/LangManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_singlearenarewardsData } from "../../../config/t_s_singlearenarewards";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

export default class ColosseumRewardsItem extends FUI_ColosseumRewardsItem {
  goodsArr: GoodsInfo[];
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  setInfo(info: t_s_singlearenarewardsData) {
    this.txtScore.text = info.Property1 + "";
    this.goodsArr = this.getRewards(info);
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

  getRewards(info: t_s_singlearenarewardsData) {
    let rewards: GoodsInfo[] = [];
    if (info.RewardItemID1) {
      let goods1 = new GoodsInfo();
      goods1.templateId = info.RewardItemID1;
      goods1.count = info.RewardItemCount1;
      rewards.push(goods1);
    }
    if (info.RewardItemID2) {
      let goods2 = new GoodsInfo();
      goods2.templateId = info.RewardItemID2;
      goods2.count = info.RewardItemCount2;
      rewards.push(goods2);
    }

    return rewards;
  }

  public dispose() {
    super.dispose();
  }
}
