//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import Utils from "../../../core/utils/Utils";
import { OuterCityShopEvent } from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ChatChannel } from "../../datas/ChatChannel";
import ConfigInfosTempInfo from "../../datas/ConfigInfosTempInfo";
import { OuterCityShopManager } from "../../manager/OuterCityShopManager";
import { TempleteManager } from "../../manager/TempleteManager";
import ChatData from "../chat/data/ChatData";
import { OuterCityShopModel } from "./OuterCityShopModel";
import listMsgItem from "./view/listMsgItem";

/**
 * 神秘商店
 */
export default class OuterCityShopWnd extends BaseWindow {
  private frame: fgui.GComponent;

  private txt_luckyTitle: fgui.GTextField;
  private txt_buyCount: fgui.GTextField;

  private listMsgs: fgui.GList;
  private listData: Array<ChatData>;
  protected setOptimize = true;

  public OnInitWind() {
    super.OnInitWind();
    this.listMsgs.displayObject["dyna"] = true;
    this.setCenter();
    this.addEvent();
    this.initView();
    this.updateLuckShowInfoHandler();
  }

  private initView() {
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "auction.view.mysteryshop.MysteryShopFrame.titleText",
    );
    this.txt_luckyTitle.text = LangManager.Instance.GetTranslation(
      "auction.view.mysteryshop.MysteryShopFrame.txt_luckyTitle",
    );
    this.updateBuyCount();
    // 去掉限购
    this.txt_buyCount.text = "";
  }

  /**
   * 更新可购买次数
   */
  private updateBuyCount() {
    var config: ConfigInfosTempInfo =
      TempleteManager.Instance.getConfigInfoByConfigName("ShopBuy_MaxCount");
    if (config && parseInt(config.ConfigValue))
      var maxCount: number = parseInt(config.ConfigValue);
    this.outerCityShopModel.maxBuyCount = maxCount;
    // 去掉限购
    // var _canBuyCount: number = this.outerCityShopModel.maxBuyCount - this.outerCityShopModel.fresh_count;
    // this.txt_buyCount.text = LangManager.Instance.GetTranslation("auction.view.mysteryshop.MysteryShopFrame.txt_buyCount", _canBuyCount, maxCount);
  }

  private get outerCityShopModel(): OuterCityShopModel {
    return OuterCityShopManager.instance.model;
  }

  helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation(
      "auction.view.mysteryshop.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private addEvent() {
    this.outerCityShopModel.addEventListener(
      OuterCityShopEvent.FRESH_VIEW,
      this.onRefresh,
      this,
    );
    this.outerCityShopModel.addEventListener(
      OuterCityShopEvent.UPDATE_LUCK_SHOW_INFO,
      this.updateLuckShowInfoHandler,
      this,
    );
    this.listMsgs.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  private offEvent() {
    this.outerCityShopModel.removeEventListener(
      OuterCityShopEvent.FRESH_VIEW,
      this.onRefresh,
      this,
    );
    this.outerCityShopModel.removeEventListener(
      OuterCityShopEvent.UPDATE_LUCK_SHOW_INFO,
      this.updateLuckShowInfoHandler,
      this,
    );
    // this.listMsgs.itemRenderer.recover();
    Utils.clearGListHandle(this.listMsgs);
  }

  private renderListItem(index: number, item: listMsgItem) {
    item.info = this.listData[index];
  }

  /**
   * 刷新幸运传递信息
   *
   */
  private updateLuckShowInfoHandler() {
    if (this.outerCityShopModel.shopLuckShowInfo) {
      this.listData = [];
      for (
        var i: number = 0;
        i < this.outerCityShopModel.shopLuckShowInfo.length;
        i++
      ) {
        var chatData: ChatData = new ChatData();
        chatData.channel = ChatChannel.MYSTERYSHOP_LUCKYPLAYER;
        chatData.msg = this.outerCityShopModel.shopLuckShowInfo[i];
        this.listData.unshift(chatData);
      }
      this.listMsgs.numItems = this.listData.length;
    }
  }

  private onRefresh() {
    this.updateBuyCount();
  }

  public OnHideWind() {
    this.offEvent();
    super.OnHideWind();
  }
}
