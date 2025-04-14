//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import BaseTipItem from "../../../component/item/BaseTipItem";
import ColorConstant from "../../../constant/ColorConstant";
import { ConsortiaUpgradeType } from "../../../constant/ConsortiaUpgradeType";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import ConfigInfoManager from "../../../manager/ConfigInfoManager";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaInfo } from "../data/ConsortiaInfo";
import { ConsortiaModel } from "../model/ConsortiaModel";
import ConsortiaPayItem from "./component/ConsortiaPayItem";

export default class ConsortiaPrayWnd extends BaseWindow {
  public c1: fgui.Controller;
  public frame: fgui.GLabel;
  public payBtn: UIButton;
  public highPayBtn: UIButton;
  public item1: ConsortiaPayItem;
  public item2: ConsortiaPayItem;
  public item3: ConsortiaPayItem;
  public item4: ConsortiaPayItem;
  public item5: ConsortiaPayItem;
  public item6: ConsortiaPayItem;
  public item7: ConsortiaPayItem;
  public item8: ConsortiaPayItem;
  public item9: ConsortiaPayItem;
  public item10: ConsortiaPayItem;
  public refreshBtn: fgui.GButton;
  public openOneBtn: fgui.GButton;
  public openAllBtn: fgui.GButton;
  public tip1: BaseTipItem;
  public tip2: BaseTipItem;
  public tipCountTxt1: fgui.GRichTextField;
  public tipCountTxt2: fgui.GRichTextField;
  public descTxt1: fgui.GTextField;
  public descTxt2: fgui.GTextField;
  public countTxt1: fgui.GTextField;
  public countTxt2: fgui.GTextField;
  public descTxt3: fgui.GRichTextField;
  public descTxt4: fgui.GRichTextField;
  public descTxt5: fgui.GRichTextField;
  public descTxt6: fgui.GRichTextField;
  private _contorller: ConsortiaControler;
  private _model: ConsortiaModel;
  private _goodsItemList: Array<ConsortiaPayItem> = [];
  private _needCostArr: Array<number>;
  private _refreshCostArr: Array<number>;
  private _leftCommRefreshCount: number; //祈福剩余刷新次数
  private _leftHighRefreshCount: number; //高级祈福剩余刷新次数
  private maxRefreshCount: number = 5; //最大刷新次数
  private _hasGetCommCount: number = 0; //普通祈福已经领取的物品个数
  private _hasGetHighCount: number = 0; //高级祈福已经领取的物品个数
  private _commAllOpenNeedCount: number = 0; //普通祈福全部开启需要消耗的贡献数量
  private _highAllOpenNeedCount: number = 0; //高级祈福全部开启需要消耗的建设数量
  private _commOneNeedCost: number = 0;
  private _highOneNeedCost: number = 0;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    this._contorller.getConsortiaPrayInfo();
    this.setComRedStatus();
    this.setHighRedStatus();
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._model = this._contorller.model;
    for (let i: number = 1; i < 11; i++) {
      let item: ConsortiaPayItem = this["item" + i];
      this._goodsItemList.push(item);
    }
    this.c1 = this.contentPane.getController("c1");
    this.descTxt1.text = LangManager.Instance.GetTranslation(
      "securityCode.view.remainCountText",
    );
    this.descTxt3.text = LangManager.Instance.GetTranslation(
      "ConsortiaPrayWnd.descTxt3",
    );
    this.descTxt4.text = LangManager.Instance.GetTranslation(
      "ConsortiaPrayWnd.descTxt4",
    );
    this.descTxt5.text = LangManager.Instance.GetTranslation(
      "ConsortiaPrayWnd.descTxt5",
    );
    this.descTxt6.text = LangManager.Instance.GetTranslation(
      "ConsortiaPrayWnd.descTxt6",
    );
    this._needCostArr = ConfigInfoManager.Instance.getConsortiaPrayCost();
    this._refreshCostArr =
      ConfigInfoManager.Instance.getConsortiaAltarRefresh();
    this.maxRefreshCount = this._refreshCostArr[0];
  }

  private initEvent() {
    this.refreshBtn.onClick(this, this.refreshBtnHandler);
    this.openOneBtn.onClick(this, this.openOneBtnHandler);
    this.openAllBtn.onClick(this, this.openAllBtnHandler);
    this.c1.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    NotificationManager.Instance.addEventListener(
      ConsortiaEvent.GET_ALTAR_GOODS,
      this.updateView,
      this,
    );
  }

  private removeEvent() {
    this.refreshBtn.offClick(this, this.refreshBtnHandler);
    this.openOneBtn.offClick(this, this.openOneBtnHandler);
    this.openAllBtn.offClick(this, this.openAllBtnHandler);
    this.c1.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
    NotificationManager.Instance.removeEventListener(
      ConsortiaEvent.GET_ALTAR_GOODS,
      this.updateView,
      this,
    );
  }

  private setComRedStatus() {
    let view = this.payBtn.getView();
    let dot = view.getChild("redDot");
    let flag: boolean = false;
    if (!ConsortiaManager.Instance.model) return;
    if (
      this.totalCount - this._model.commAltarCount > 0 &&
      !this._model.commAltarSeened
    ) {
      flag = true;
    }
    dot.visible = flag;
  }

  private setHighRedStatus() {
    let view = this.highPayBtn.getView();
    let dot = view.getChild("redDot");
    let flag: boolean = false;
    if (!ConsortiaManager.Instance.model) return;
    if (
      this.totalCount - this._model.highAltarCount > 0 &&
      !this._model.hightAltarSeened
    ) {
      flag = true;
    }
    dot.visible = flag;
  }

  updateView() {
    let tabIndex = this.c1.selectedIndex;

    if (tabIndex == 0) {
      this._model.commAltarSeened = true;
      this.tip1.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
      this.tip2.setInfo(TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE);
      this._hasGetCommCount = 0;
      for (var i: number = 0; i < 10; i++) {
        this._goodsItemList[i].info = this._model.commPrayGoodsList.get(i);
        if (
          this._goodsItemList[i].info &&
          this._goodsItemList[i].info.status == 1
        ) {
          this._hasGetCommCount++;
        }
      }
      if (this._hasGetCommCount == 10) {
        this._commOneNeedCost = 0;
        this._commAllOpenNeedCount = 0;
      } else {
        this._commOneNeedCost = this._needCostArr[this._hasGetCommCount];
        this._commAllOpenNeedCount = this.getCommTotalCost(
          this._hasGetCommCount,
        );
      }
      this._leftCommRefreshCount =
        this.maxRefreshCount - this._model.commFreshCount;
      if (this.playerInfo.consortiaOffer < this._commOneNeedCost) {
        //开启1次不足
        this.tipCountTxt2.color = ColorConstant.RED_COLOR;
      } else {
        this.tipCountTxt2.color = ColorConstant.LIGHT_TEXT_COLOR;
      }
      this.tipCountTxt2.text = this._commOneNeedCost.toString();

      this.tipCountTxt1.text = this._commAllOpenNeedCount.toString();
      if (this.playerInfo.consortiaOffer < this._commAllOpenNeedCount) {
        this.tipCountTxt1.color = ColorConstant.RED_COLOR;
      } else {
        this.tipCountTxt1.color = ColorConstant.LIGHT_TEXT_COLOR;
      }
      this.countTxt1.text =
        this.totalCount - this._model.commAltarCount + "/" + this.totalCount;
      this.countTxt2.text = this.playerInfo.consortiaOffer.toString();
      this.descTxt2.text = LangManager.Instance.GetTranslation(
        "ConsortiaPrayWnd.descTxt2",
      );
    } else if (tabIndex == 1) {
      this._model.hightAltarSeened = true;
      this._hasGetHighCount = 0;
      this.tip1.setInfo(TemplateIDConstant.GUILD_CONTRIBUTION);
      this.tip2.setInfo(TemplateIDConstant.GUILD_CONTRIBUTION);
      for (var i: number = 0; i < 10; i++) {
        this._goodsItemList[i].info = this._model.highPrayGoodsList.get(i);
        if (
          this._goodsItemList[i].info &&
          this._goodsItemList[i].info.status == 1
        ) {
          this._hasGetHighCount++;
        }
      }
      if (this._hasGetHighCount == 10) {
        this._highOneNeedCost = 0;
        this._highAllOpenNeedCount = 0;
      } else {
        this._highOneNeedCost = this._needCostArr[this._hasGetHighCount];
        this._highAllOpenNeedCount = this.getCommTotalCost(
          this._hasGetHighCount,
        );
      }

      this.countTxt1.text =
        this.totalCount - this._model.highAltarCount + "/" + this.totalCount;
      this.countTxt2.text = this.playerInfo.consortiaJianse.toString();
      this.descTxt2.text = LangManager.Instance.GetTranslation(
        "ConsortiaPrayWnd.new.descTxt2",
      );
      this._leftHighRefreshCount =
        this.maxRefreshCount - this._model.highFreshCount;

      if (this.playerInfo.consortiaJianse < this._highOneNeedCost) {
        //开启1次不足
        this.tipCountTxt2.color = ColorConstant.RED_COLOR;
      } else {
        this.tipCountTxt2.color = ColorConstant.LIGHT_TEXT_COLOR;
      }
      this.tipCountTxt2.text = this._highOneNeedCost.toString();

      if (this.playerInfo.consortiaJianse < this._highAllOpenNeedCount) {
        this.tipCountTxt1.color = ColorConstant.RED_COLOR;
      } else {
        this.tipCountTxt1.color = ColorConstant.LIGHT_TEXT_COLOR;
      }
      this.tipCountTxt1.text = this._highAllOpenNeedCount.toString();
    }

    this.setHighRedStatus();
    this.setComRedStatus();
  }

  private onTabChanged(cc: fgui.Controller) {
    this.updateView();
  }

  private refreshBtnHandler() {
    if (this.c1.selectedIndex == 0) {
      if (this._hasGetCommCount == 10) {
        this._contorller.refreshPrayCount(1);
      } else {
        if (this._leftCommRefreshCount <= 0) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "ConsortiaPrayWnd.refreshBtnHandler.tips1",
            ),
          );
          return;
        }
        var confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        var content: string = LangManager.Instance.GetTranslation(
          "ConsortiaPrayWnd.refreshBtnHandler.AltarHelper.content1",
          this._refreshCostArr[1],
          this._leftCommRefreshCount,
          this.maxRefreshCount,
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          prompt,
          content,
          confirm,
          cancel,
          this.refreshConfirmBtnClick1.bind(this),
        );
      }
    } else {
      if (this._hasGetHighCount == 10) {
        this._contorller.refreshPrayCount(2);
      } else {
        if (this._leftHighRefreshCount <= 0) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "ConsortiaPrayWnd.refreshBtnHandler.tips2",
            ),
          );
          return;
        }
        var confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        var content: string = LangManager.Instance.GetTranslation(
          "ConsortiaPrayWnd.refreshBtnHandler.AltarHelper.content2",
          this._refreshCostArr[1],
          this._leftHighRefreshCount,
          this.maxRefreshCount,
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          prompt,
          content,
          confirm,
          cancel,
          this.refreshConfirmBtnClick2.bind(this),
        );
      }
    }
  }

  private refreshConfirmBtnClick1(b: boolean, flag: boolean) {
    if (b) {
      if (this.playerInfo.consortiaOffer < this._refreshCostArr[1]) {
        //贡献值不足提示
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "consortiaPrayWnd.refreshConfirm.tips1",
          ),
        );
        return;
      }
      this._contorller.refreshPrayCount(1);
    }
  }

  private refreshConfirmBtnClick2(b: boolean, flag: boolean) {
    if (b) {
      if (this.playerInfo.consortiaJianse < this._refreshCostArr[1]) {
        //个人建设值不足提示
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "consortiaPrayWnd.refreshConfirm.tips2",
          ),
        );
        return;
      }
      this._contorller.refreshPrayCount(2);
    }
  }

  //开启一次
  private openOneBtnHandler() {
    if (this.c1.selectedIndex == 0) {
      if (this.totalCount - this._model.commAltarCount <= 0) {
        //次数不足
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips1",
          ),
        );
        return;
      }
      if (
        this.playerInfo.consortiaOffer <
        this._needCostArr[this._hasGetCommCount]
      ) {
        //贡献不足
        // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaPrayWnd.openOneBtnHandler.tips2"));
        this.showConfirm();
        return;
      }
      if (this._hasGetCommCount == 10) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips4",
          ),
        );
        return;
      }
      this._contorller.consortiaAltarBless(1, 1);
    } else if (this.c1.selectedIndex == 1) {
      if (this.totalCount - this._model.highAltarCount <= 0) {
        //次数不足
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips1",
          ),
        );
        return;
      }
      if (
        this.playerInfo.consortiaJianse <
        this._needCostArr[this._hasGetHighCount]
      ) {
        //建设不足
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips3",
          ),
        );
        return;
      }
      if (this._hasGetHighCount == 10) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips4",
          ),
        );
        return;
      }
      this._contorller.consortiaAltarBless(2, 1);
    }
  }

  //全部开启
  private openAllBtnHandler() {
    if (this.c1.selectedIndex == 0) {
      let leftCount = this.totalCount - this._model.commAltarCount; //剩余次数
      let needCount = 10 - this._hasGetCommCount;
      if (needCount > leftCount) {
        //次数不足
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips1",
          ),
        );
        return;
      }
      if (this.playerInfo.consortiaOffer < this._commAllOpenNeedCount) {
        // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ConsortiaPrayWnd.openOneBtnHandler.tips2"));
        this.showConfirm();
        return;
      }
      if (this._hasGetCommCount == 10) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips4",
          ),
        );
        return;
      }
      this._contorller.consortiaAltarBless(1, 10);
    } else if (this.c1.selectedIndex == 1) {
      let leftCount = this.totalCount - this._model.highAltarCount; //剩余次数
      let needCount = 10 - this._hasGetHighCount;
      if (needCount > leftCount) {
        //次数不足
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips1",
          ),
        );
        return;
      }
      if (this.playerInfo.consortiaJianse < this._highAllOpenNeedCount) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips3",
          ),
        );
        return;
      }
      if (this._hasGetHighCount == 10) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "ConsortiaPrayWnd.openOneBtnHandler.tips4",
          ),
        );
        return;
      }
      this._contorller.consortiaAltarBless(2, 10);
    }
  }

  private showConfirm() {
    SimpleAlertHelper.Instance.ShowSimple(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      LangManager.Instance.GetTranslation(
        "consortia.helper.ConsortiaAltarHelper.content02",
      ),
      this.gotoConsortiaContribute.bind(this),
    );
  }

  private gotoConsortiaContribute(b: boolean) {
    b && FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute);
  }

  /**
   * 得到祈福的总次数
   */
  private get totalCount(): number {
    return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
      ConsortiaUpgradeType.CONSORTIA_ALTAR,
      this.consortiaInfo.altarLevel,
    ).Property2;
  }

  private getCommTotalCost(hasCostNumber: number): number {
    let totalCount = 0;
    for (let i: number = hasCostNumber; i < this._needCostArr.length; i++) {
      totalCount += parseInt(this._needCostArr[i].toString());
    }
    return totalCount;
  }

  private get consortiaInfo(): ConsortiaInfo {
    return this._model.consortiaInfo;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    for (let i: number = 1; i <= 10; i++) {
      this["item" + i].dispose();
    }
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
