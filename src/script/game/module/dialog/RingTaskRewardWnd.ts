import ConfigMgr from "../../../core/config/ConfigMgr";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { ConfigType } from "../../constant/ConfigDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import RingTaskManager from "../../manager/RingTaskManager";
import OfferRewardTemplate from "../offerReward/OfferRewardTemplate";
import { RingTask } from "../ringtask/RingTask";
import RingTaskRewardInfo from "./data/RingTaskRewardInfo";
import RingTaskRewardItem from "./RingTaskRewardItem";

export default class RingTaskRewardWnd extends BaseWindow {
  public list1: fgui.GList;
  public list2: fgui.GList;
  private rightReward: OfferRewardTemplate;
  private rewardList = [
    "RewardPlayGP",
    "RewardGold",
    "RewardConsortiaOffer",
    "RewardPlayerOffer",
  ];
  private rewardDataList: Array<RingTaskRewardInfo> = [];
  private rewardGoodList: Array<GoodsInfo> = [];
  public OnInitWind() {
    super.OnInitWind();
    this.addEvent();
    this.setCenter();
    this.initData();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
  }

  private addEvent() {
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.renderList1Item,
      null,
      false,
    );
    this.list2.itemRenderer = Laya.Handler.create(
      this,
      this.renderList2Item,
      null,
      false,
    );
  }

  private removeEvent() {
    this.list1.itemRenderer.recover();
    this.list2.itemRenderer.recover();
  }

  private renderList1Item(index: number, item: RingTaskRewardItem) {
    item.info = this.rewardDataList[index];
  }

  private renderList2Item(index: number, item: BaseItem) {
    item.info = this.rewardGoodList[index];
  }

  private initData() {
    let ringtaskInfos: Array<RingTask>;
    let taskInfo: RingTask;
    if (RingTaskManager.Instance.getRingTask()) {
      ringtaskInfos = RingTaskManager.Instance.model.hasAccessList.getList();
    } else {
      ringtaskInfos = RingTaskManager.Instance._defaultList.getList();
    }
    if (ringtaskInfos) {
      taskInfo = ringtaskInfos[0];
      this.rewardDataList = [];
      if (taskInfo && taskInfo.ringTaskTemp) {
        this.rightReward = taskInfo.ringTaskTemp;
        for (var i: number = 0; i < this.rewardList.length; i++) {
          if (
            this.rightReward.hasOwnProperty(this.rewardList[i]) &&
            parseInt(this.rightReward[this.rewardList[i]].toString()) > 0
          ) {
            let currentReward: RingTaskRewardInfo = new RingTaskRewardInfo();
            currentReward.index = i + 1;
            currentReward.count = parseInt(
              this.rightReward[this.rewardList[i]].toString(),
            );
            this.rewardDataList.push(currentReward);
          }
        }
      }
      this.list1.numItems = this.rewardDataList.length;
      var goodList: any[] =
        RingTaskManager.Instance.getAllRingTaskGoodsReward();
      this.rewardGoodList = [];
      let goodsInfo: GoodsInfo;
      var len: number = goodList.length;
      for (var i: number = 0; i < len; i++) {
        var good: any = goodList[i];
        goodsInfo = new GoodsInfo();
        var temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          good.RewardItemID,
        );
        if (temp) goodsInfo.templateId = temp.TemplateId;
        switch (i) {
          case 0:
            goodsInfo.count = good.RewardItemCount * 16;
            break;
          case 1:
            goodsInfo.count = good.RewardItemCount * 3;
            break;
          case 2:
            goodsInfo.count = good.RewardItemCount * 1;
            break;
        }
        this.rewardGoodList.push(goodsInfo);
      }
      this.list2.numItems = this.rewardGoodList.length;
    }
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
