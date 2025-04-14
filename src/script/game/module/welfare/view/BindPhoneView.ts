/*
 * @Author: jeremy.xu
 * @Date: 2023-05-23 10:26:51
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-06-01 11:41:25
 * @Description:
 */
import FUI_BindPhoneView from "../../../../../fui/Welfare/FUI_BindPhoneView";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { EmailEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import { BaseItem } from "../../../component/item/BaseItem";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { WelfareManager } from "../WelfareManager";

export class BindPhoneView extends FUI_BindPhoneView {
  private rewardArray: Array<GoodsInfo> = [];

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
    this.initView();

    this.__phoneCheckInfoHandler();
  }

  private initEvent() {
    this.btnBind.onClick(this, this.onBtnBindClick);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      EmailEvent.WELFARE_BIND_STATE,
      this.__phoneCheckInfoHandler,
      this,
    );
  }

  private initView() {
    let configTemp = TempleteManager.Instance.getConfigInfoByConfigName(
      "bind_mobile_rewards",
    );
    if (!configTemp) return;
    let configValue = configTemp.ConfigValue;
    let configItems = configValue.split("|");
    let configsCount = configItems.length;
    if (configsCount > 0) {
      let configItemStr = "";
      let rewardItem = [];
      let goods: GoodsInfo;
      for (let index = 0; index < configsCount; index++) {
        configItemStr = String(configItems[index]);
        rewardItem = configItemStr.split(",");
        goods = new GoodsInfo();
        goods.templateId = Number(rewardItem[0]);
        goods.count = Number(rewardItem[1]);
        this.rewardArray.push(goods);
      }
    }
    this.list.numItems = this.rewardArray.length;
  }

  private onBtnBindClick(e: Laya.Event) {
    if (!WelfareManager.Instance.isReachOpenBindCon(1)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.ActivityManager.command11",
        ),
      );
      return;
    }

    let state = WelfareManager.Instance.bindPhoneState;
    switch (state) {
      case 1:
        FrameCtrlManager.Instance.open(EmWindow.BindVertifyWnd, { type: 1 });
        break;
      case 2:
        WelfareManager.Instance.recvBindPhoneReward();
        break;
      case 3:
        break;
    }
  }

  private onRenderListItem(index: number, item: BaseItem) {
    item.info = this.rewardArray[index];
  }

  private __phoneCheckInfoHandler() {
    this.btnBind.enabled = true;
    let state = WelfareManager.Instance.bindPhoneState;
    switch (state) {
      case 1: //未验证
        this.btnBind.text =
          LangManager.Instance.GetTranslation("BindVertify.bind");
        break;
      case 2: //已验证完毕
        if (FrameCtrlManager.Instance.isOpen(EmWindow.BindVertifyWnd)) {
          FrameCtrlManager.Instance.exit(EmWindow.BindVertifyWnd);
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("BindVertify.bindSuccess"),
          );
        }
        this.btnBind.text = LangManager.Instance.GetTranslation(
          "BindVertify.getReward",
        );
        break;
      case 3: //已领取
        this.btnBind.text = LangManager.Instance.GetTranslation(
          "dayGuide.view.FetchItem.alreadyGet",
        );
        this.btnBind.enabled = false;
        break;
    }
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      EmailEvent.WELFARE_BIND_STATE,
      this.__phoneCheckInfoHandler,
      this,
    );
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
