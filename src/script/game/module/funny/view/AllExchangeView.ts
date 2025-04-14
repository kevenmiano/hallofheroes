import FUI_AllExchangeView from "../../../../../fui/Funny/FUI_AllExchangeView";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { BaseItem } from "../../../component/item/BaseItem";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import AllManExchangeManager from "../../../manager/AllManExchangeManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import AllManExchangeModel from "../model/AllManExchangeModel";
import ExchangeItem from "./ExchangeItem";
import ExcSvrItem from "./ExcSvrItem";
import { FunnyContent } from "./FunnyContent";

/**
 * 全民兑换
 */
export default class AllExchangeView
  extends FUI_AllExchangeView
  implements FunnyContent
{
  private _remainTime: number = 0;
  private listData0: any = [1, 1, 1, 1, 1];
  private listData1: any = [1, 1, 1];

  onShow() {
    this.list0.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList0,
      null,
      false,
    );
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList1,
      null,
      false,
    );
    this.initView();
    AllManExchangeManager.Instance.sendOpenView();
  }

  onUpdate() {
    this.initView();
  }

  onHide() {
    this.list0.numItems = 0;
    this.list1.numItems = 0;
    this.removeEvent();
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private get model(): AllManExchangeModel {
    return AllManExchangeManager.Instance.model;
  }

  initView() {
    // AllManExchangeManager.Instance.sendOpenView();
    this.updateInfo(true);
    this.txt0.text = LangManager.Instance.GetTranslation(
      "allmainexchange.str12",
    );
    this.txt1.text = LangManager.Instance.GetTranslation(
      "allmainexchange.str15",
    );
    this.txt2.text =
      LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.demon.ConsortiaDemonWoundView.activityTimeTip",
      ) + ":";
    //活动时间
    let endTime = DateFormatter.parse(
      this.model.end,
      "YYYY-MM-DD hh:mm:ss",
    ).getTime();
    this._remainTime = endTime / 1000 - this.playerModel.sysCurTimeBySecond;
    if (this._remainTime > 0) {
      this.__updateTimeHandler();
      Laya.timer.loop(1000, this, this.__updateTimeHandler);
    }
    this.initEvent();
  }

  setRemainTime() {
    this._remainTime--;
    if (this._remainTime >= 60) {
      this.remainTImes.text = DateFormatter.getFullTimeString(this._remainTime);
    } else if (this._remainTime > 0) {
      this.remainTImes.text = DateFormatter.getFullDateString(this._remainTime);
    } else {
      this.remainTImes.text = LangManager.Instance.GetTranslation(
        "feedback.FeedBackItem.outDate",
      );
    }
  }

  __updateTimeHandler() {
    this.setRemainTime();
  }

  private updateInfo(isInit: boolean = false): void {
    if (this.model.allChangeCount == 0) {
      //总次数为0则说明可以无限兑换
      // _txtTodayCount.visible = false;
    }
    // _txtTodayCount.text = LangManager.Instance.GetTranslation("allmainexchange.str2",this.model.allChangeCount - this.model.changeItemCount,this.model.allChangeCount);
    this.txt_point.text = this.model.allPoint + "";
    this.list0.numItems = this.listData0.length;
    if (isInit) {
      this.list1.numItems = this.listData1.length; //只渲染一次
    } else {
      (this.list1.getChildAt(0) as ExchangeItem).update(0);
      (this.list1.getChildAt(1) as ExchangeItem).update(1);
      (this.list1.getChildAt(2) as ExchangeItem).update(2);
    }

    //消耗道具
    let goods: GoodsInfo = new GoodsInfo();
    goods.templateId = this.model.changeItem;
    goods.count = GoodsManager.Instance.getGoodsNumByTempId(
      this.model.changeItem,
    );
    (this.propItem as BaseItem).info = goods;

    // let total:number =  Number(this.model.allPointAward[4]);
    // this.bar.value = (this.model.allPoint / total) * 100;
    this.bar.getChild("title").visible = false;
    //整个大的进度条要分成5段小进度条

    let pro: number = 0;
    let curpoint = this.model.allPoint;
    for (let i = 0; i < this.model.allPointAward.length; i++) {
      const point = Number(this.model.allPointAward[i]);
      if (curpoint >= point) {
        pro += 20;
      } else {
        let total_pt = 0;
        let cur_tp = 0;
        if (i == 0) {
          total_pt = point;
          cur_tp = curpoint;
        } else {
          total_pt = point - Number(this.model.allPointAward[i - 1]);
          cur_tp = curpoint - Number(this.model.allPointAward[i - 1]);
        }
        pro += (cur_tp / total_pt) * 20;
        break;
      }
    }
    this.bar.value = pro;
  }

  private initEvent() {
    this.helpBtn.onClick(this, this.onHelp);

    // this.list1.on(fairygui.Events.CLICK_ITEM, this, this.onSelectList0);
    // _timer.addEventListener(TimerEvent.TIMER, __timerHandler);
    AllManExchangeManager.Instance.addEventListener(
      NotificationEvent.AllManExchangeUpdate,
      this.updateInfo,
      this,
    );
  }

  private removeEvent() {
    this.helpBtn.offClick(this, this.onHelp);
    // if (_timer) _timer.removeEventListener(TimerEvent.TIMER, __timerHandler);
    Laya.timer.clear(this, this.__updateTimeHandler);
    this.list0.itemRenderer && this.list0.itemRenderer.recover();
    this.list1.itemRenderer && this.list1.itemRenderer.recover();

    this.list0.itemRenderer = null;
    this.list1.itemRenderer = null;

    AllManExchangeManager.Instance.removeEventListener(
      NotificationEvent.AllManExchangeUpdate,
      this.updateInfo,
      this,
    );
  }

  /**渲染Tab单元格 */
  onRenderList1(index: number, item: ExchangeItem) {
    item.update(index);
  }

  /**渲染Tab单元格 */
  onRenderList0(index: number, item: ExcSvrItem) {
    item.update(index);
  }

  onHelp() {
    let title: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "allmainexchange.str11",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  dispose(): void {
    this.removeEvent();
    super.dispose();
  }
}
