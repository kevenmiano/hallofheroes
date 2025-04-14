import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../../core/utils/IconFactory";
import WarlordsModel from "../WarlordsModel";
import WarlordsCheckRewardItem from "./component/WarlordsCheckRewardItem";
import WarlordsRewardItem from "./component/WarlordsRewardItem";
import WarlordsRewardInfo from "./data/WarlordsRewardInfo";
import LangManager from "../../../../core/lang/LangManager";

/**
 * 众神之战奖励列表
 */
export default class WarlordsCheckRewardWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public tabList: fgui.GList;
  public maxRewardList: fgui.GList;
  public rewardList: fgui.GList;
  private rankListData: Array<string> = [];
  private maxListData: Array<WarlordsRewardInfo>;
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initEvent();
    this.initData();
    this.tabList.selectedIndex = 0;
    this.onSelectedChangeHandler();
  }

  private initEvent() {
    this.tabList.on(
      Laya.Event.CLICK,
      this,
      this.onSelectedChangeHandler.bind(this),
    );
    this.rewardList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.maxRewardList.itemRenderer = Laya.Handler.create(
      this,
      this.renderMaxListItem,
      null,
      false,
    );
  }

  private removeEvent() {
    this.tabList.off(
      Laya.Event.CLICK,
      this,
      this.onSelectedChangeHandler.bind(this),
    );
  }

  private initData() {
    this.maxListData = [];
    let maxCount = 3;
    for (var i: number = 0; i < maxCount; i++) {
      let goodsRewardInfo: WarlordsRewardInfo = new WarlordsRewardInfo();
      goodsRewardInfo.type = WarlordsModel.REWARD_TYPE_THREE;
      goodsRewardInfo.tipData = LangManager.Instance.GetTranslation(
        "warlords.WarlordsCheckRewardFrame.privilege" + i,
      );
      if (i == 0) {
        goodsRewardInfo.picUrl =
          IconFactory.getCommonIconPath("/shadoweffect.png");
      } else if (i == 1) {
        goodsRewardInfo.picUrl =
          IconFactory.getCommonIconPath("/callmonster.png");
      } else if (i == 2) {
        goodsRewardInfo.picUrl =
          IconFactory.getCommonIconPath("/lordbless.png");
      }
      if (i != 0) {
        this.maxListData.push(goodsRewardInfo);
      }
    }
    this.maxRewardList.numItems = this.maxListData.length;
  }

  private onSelectedChangeHandler() {
    let tabIndex: number = this.tabList.selectedIndex;
    if (tabIndex == 0) {
      this.rankListData = ["1", "2", "3", "4-5", "6-8", "9-12", "13-16"];
    } else {
      this.rankListData = ["1", "2", "3", "4-20", "21-40", "41-60", "61-84"];
    }
    this.rewardList.numItems = this.rankListData.length;
  }

  renderListItem(index: number, item: WarlordsCheckRewardItem) {
    item.index = index + 1;
    item.selectedType = this.tabList.selectedIndex;
    item.info = this.rankListData[index];
  }

  renderMaxListItem(index: number, item: WarlordsRewardItem) {
    item.info = this.maxListData[index];
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
