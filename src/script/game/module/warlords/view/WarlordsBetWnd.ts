import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { WarlordsEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import WarlordsManager from "../../../manager/WarlordsManager";
import WarlordsModel from "../WarlordsModel";
import WarlordsPlayerInfo from "../WarlordsPlayerInfo";
import LangManager from "../../../../core/lang/LangManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import UIManager from "../../../../core/ui/UIManager";
import StringHelper from "../../../../core/utils/StringHelper";

/**
 * 众神之战欢乐竞猜界面
 */
export default class WarlordsBetWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public succeedNumTxt: fgui.GTextField;
  public failNumTxt: fgui.GTextField;
  public totalNumTxt: fgui.GTextField;
  public noticeTxt: fgui.GTextField;
  public commitBetBtn: fgui.GButton;
  public betInfoGroup: fgui.GGroup;
  public betTimeTxt: fgui.GTextField;
  public betTimeGroup: fgui.GGroup;
  public hasCostTxt: fgui.GTextField;
  public hasCostMoneyGroup: fgui.GGroup;
  public AwardTotalTxt: fgui.GTextField;
  public LastAwardNumTxt: fgui.GTextField;
  public CheckMoreTxt: fgui.GRichTextField;
  public titleInfoGroup: fgui.GGroup;
  public firstTxt: fgui.GTextField;
  public thirdTxt: fgui.GTextField;
  public secondTxt: fgui.GTextField;
  public firstBtn: fgui.GButton;
  public secondBtn: fgui.GButton;
  public thirdBtn: fgui.GButton;
  public peopleSeleectGroup: fgui.GGroup;
  public successPic: fgui.GImage;
  public notSelectedPic: fgui.GImage;
  public failPic: fgui.GImage;
  public rankOneTxt: fgui.GTextField;
  public rankThreeTxt: fgui.GTextField;
  public rankTwoTxt: fgui.GTextField;
  public resultAwardTxt: fgui.GTextField;
  public rewardInfoGroup: fgui.GGroup;
  public successFailGroup: fgui.GGroup;

  private _betNum: number = 0;
  private _tempInfo: WarlordsPlayerInfo;
  private prompt: string = LangManager.Instance.GetTranslation("public.prompt");
  private confirm: string =
    LangManager.Instance.GetTranslation("public.confirm");
  private cancel: string = LangManager.Instance.GetTranslation("public.cancel");

  private _operType: number = 0;
  private _cstyle: number = -1;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initView();
    this.initEvent();
    this.refreshView();
    WarlordsManager.Instance.reqCanBetList();
  }

  private initView() {
    this.betInfoGroup.visible =
      this.betTimeGroup.visible =
      this.hasCostMoneyGroup.visible =
        false;
    this.peopleSeleectGroup.visible =
      this.rewardInfoGroup.visible =
      this.successFailGroup.visible =
        false;
    this.betTimeGroup.y = 428;
    this.hasCostMoneyGroup.y = 467;
    switch (this.warlordsModel.process) {
      case WarlordsModel.PROCESS_READY:
      case WarlordsModel.PROCESS_PRELIM:
        this._cstyle = WarlordsModel.PROCESS_PRELIM;
        this.betTimeGroup.visible = this.peopleSeleectGroup.visible = true;
        this.betTimeGroup.y = 476;
        this.firstBtn.enabled =
          this.secondBtn.enabled =
          this.thirdBtn.enabled =
            false;
        this.betTimeTxt.text = this.warlordsModel.getMatchDateString(
          2,
          LangManager.Instance.GetTranslation("public.dateFormat"),
        );
        break;
      case WarlordsModel.PROCESS_FINAL:
        this._cstyle = WarlordsModel.PROCESS_FINAL;
        this.peopleSeleectGroup.visible = this.hasCostMoneyGroup.visible = true;
        this.hasCostMoneyGroup.visible =
          this.successFailGroup.visible =
          this.betTimeGroup.visible =
            true;
        this.betTimeGroup.y = 450;
        this.hasCostMoneyGroup.y = 512;
        this.firstBtn.enabled =
          this.secondBtn.enabled =
          this.thirdBtn.enabled =
            false;
        this.betTimeTxt.text = LangManager.Instance.GetTranslation(
          "warlords.WarlordsBetFrame.str02",
        );
        break;
      case WarlordsModel.PROCESS_BET:
        this._cstyle = WarlordsModel.PROCESS_BET;
        this.successFailGroup.visible =
          this.betInfoGroup.visible =
          this.peopleSeleectGroup.visible =
            true;
        break;
      case WarlordsModel.PROCESS_OVER:
        this._cstyle = WarlordsModel.PROCESS_OVER;
        this.rewardInfoGroup.visible = true;
        this.successPic.visible =
          this.notSelectedPic.visible =
          this.failPic.visible =
            false;
        break;
    }
  }

  private initEvent() {
    this.CheckMoreTxt.onClick(this, this.onCheckMoreClick);
    this.warlordsModel.addEventListener(
      WarlordsEvent.INFO_UPDATE,
      this.warlordsInfoUpdateHandler,
      this,
    );
    this.warlordsModel.addEventListener(
      WarlordsEvent.CUR_BETTING_CHANGE,
      this.warlordsBetSelectedHandler,
      this,
    );
    this.commitBetBtn.onClick(this, this.onCommitBetClick);
    this.totalNumTxt.on(Laya.Event.INPUT, this, this.__totalNumChange);
    this.firstBtn.onClick(this, this.onFirstBtnClick);
    this.secondBtn.onClick(this, this.onSecondBtnClick);
    this.thirdBtn.onClick(this, this.onThirdBtnClick);
    this.frame.getChild("helpBtn").onClick(this, this.helpBtnHandler);
  }

  private removeEvent() {
    this.CheckMoreTxt.offClick(this, this.onCheckMoreClick);
    this.warlordsModel.removeEventListener(
      WarlordsEvent.INFO_UPDATE,
      this.warlordsInfoUpdateHandler,
      this,
    );
    this.warlordsModel.removeEventListener(
      WarlordsEvent.CUR_BETTING_CHANGE,
      this.warlordsBetSelectedHandler,
      this,
    );
    this.commitBetBtn.offClick(this, this.onCommitBetClick);
    this.totalNumTxt.off(Laya.Event.INPUT, this, this.__totalNumChange);
    this.firstBtn.offClick(this, this.onFirstBtnClick);
    this.secondBtn.offClick(this, this.onSecondBtnClick);
    this.thirdBtn.offClick(this, this.onThirdBtnClick);
    this.frame.getChild("helpBtn").offClick(this, this.helpBtnHandler);
  }

  private helpBtnHandler() {
    let title: string = LangManager.Instance.GetTranslation("public.help");
    let content: string = LangManager.Instance.GetTranslation(
      "warlords.WarlordsBetFrame.helpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private __totalNumChange(event: Laya.Event) {
    let count = this.totalNumTxt.text.length;
    if (count >= 8) return;
    if (this.warlordsModel.hasBet) {
      this.totalNumTxt.text = this.warlordsModel.betNum.toString();
      return;
    }
    if (StringHelper.isNullOrEmpty(this.totalNumTxt.text)) {
      this.betNum = 0;
    } else {
      this.betNum = parseInt(this.totalNumTxt.text);
    }
  }

  private onFirstBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.WarlordsBetSelectWnd, 1);
  }

  private onSecondBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.WarlordsBetSelectWnd, 2);
  }

  private onThirdBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.WarlordsBetSelectWnd, 3);
  }

  refreshView() {
    this.AwardTotalTxt.text = this.warlordsModel.curAwardTotal.toString();
    this.LastAwardNumTxt.text = this.warlordsModel.lastAwardNum.toString();
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.BETTING,
      1,
    ) as WarlordsPlayerInfo;
    this.firstTxt.text = this._tempInfo ? this._tempInfo.nickname : "";
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.BETTING,
      2,
    ) as WarlordsPlayerInfo;
    this.secondTxt.text = this._tempInfo ? this._tempInfo.nickname : "";
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.BETTING,
      3,
    ) as WarlordsPlayerInfo;
    this.thirdTxt.text = this._tempInfo ? this._tempInfo.nickname : "";
    if (this._cstyle == WarlordsModel.PROCESS_OVER) {
      this.resultAwardTxt.text = this.warlordsModel.selfAwardNum.toString();
      for (let i: number = 1; i <= 3; i++) {
        this._tempInfo = this.warlordsModel.getListData(
          WarlordsModel.JOB_TOP3,
          i,
        ) as WarlordsPlayerInfo;
        var tipName: string = this._tempInfo ? this._tempInfo.nickname : "";
        if (i == 1) {
          this.rankOneTxt.text = tipName;
        } else if (i == 2) {
          this.rankTwoTxt.text = tipName;
        } else if (i == 3) {
          this.rankThreeTxt.text = tipName;
        }
      }
      var betResultList: Array<number> = this.warlordsModel.getBetResultList();
      if (betResultList[0]) {
        this.successPic.visible = true;
        this.notSelectedPic.visible = false;
        this.failPic.visible = false;
      } else {
        if (!this.warlordsModel.hasBet) {
          this.notSelectedPic.visible = true;
          this.successPic.visible = false;
          this.failPic.visible = false;
        } else {
          this.successPic.visible = this.notSelectedPic.visible = false;
          this.failPic.visible = true;
        }
      }
    } else {
      this.betNum =
        this.warlordsModel.betNum > 0 ||
        this._cstyle == WarlordsModel.PROCESS_FINAL
          ? this.warlordsModel.betNum
          : WarlordsModel.MIN_BET_NUM;
      if (this.warlordsModel.hasBet) {
        this.firstBtn.enabled =
          this.secondBtn.enabled =
          this.thirdBtn.enabled =
            false;
      }
    }
  }

  warlordsInfoUpdateHandler() {
    this.refreshView();
  }

  warlordsBetSelectedHandler() {
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.CUR_BETTING,
      1,
    ) as WarlordsPlayerInfo;
    if (this._tempInfo) {
      this.firstTxt.text = this._tempInfo.nickname;
      this.firstBtn.title = LangManager.Instance.GetTranslation(
        "WarlordsBetWnd.selectedBtnTxt1",
      );
    } else {
      this.firstTxt.text = "";
      this.firstBtn.title = LangManager.Instance.GetTranslation(
        "WarlordsBetWnd.selectedBtnTxt2",
      );
    }
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.CUR_BETTING,
      2,
    ) as WarlordsPlayerInfo;
    if (this._tempInfo) {
      this.secondTxt.text = this._tempInfo.nickname;
      this.secondBtn.title = LangManager.Instance.GetTranslation(
        "WarlordsBetWnd.selectedBtnTxt1",
      );
    } else {
      this.secondTxt.text = "";
      this.secondBtn.title = LangManager.Instance.GetTranslation(
        "WarlordsBetWnd.selectedBtnTxt2",
      );
    }
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.CUR_BETTING,
      3,
    ) as WarlordsPlayerInfo;
    if (this._tempInfo) {
      this.thirdTxt.text = String(this._tempInfo.nickname);
      this.thirdBtn.title = LangManager.Instance.GetTranslation(
        "WarlordsBetWnd.selectedBtnTxt1",
      ); //更改
    } else {
      this.thirdTxt.text = "";
      this.thirdBtn.title = LangManager.Instance.GetTranslation(
        "WarlordsBetWnd.selectedBtnTxt2",
      ); //选择
    }
  }

  onCheckMoreClick() {
    FrameCtrlManager.Instance.open(EmWindow.WarlordsWinPrizesWnd);
  }

  onCommitBetClick() {
    if (this.warlordsModel.hasBet) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("warlords.WarlordsBetFrame.str10"),
      );
      return;
    }
    if (
      this._betNum < WarlordsModel.MIN_BET_NUM ||
      this._betNum > WarlordsModel.MAX_BET_NUM
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "warlords.WarlordsBetFrame.betNumTip",
          WarlordsModel.MIN_BET_NUM,
          WarlordsModel.MAX_BET_NUM,
        ),
      );
      return;
    }
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.CUR_BETTING,
      1,
    ) as WarlordsPlayerInfo;
    var first: string = this._tempInfo ? this._tempInfo.userKey : "";
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.CUR_BETTING,
      2,
    ) as WarlordsPlayerInfo;
    var second: string = this._tempInfo ? this._tempInfo.userKey : "";
    this._tempInfo = this.warlordsModel.getListData(
      WarlordsModel.CUR_BETTING,
      3,
    ) as WarlordsPlayerInfo;
    var third: string = this._tempInfo ? this._tempInfo.userKey : "";
    if (
      this.secondTxt.text == "" ||
      this.firstTxt.text == "" ||
      this.thirdTxt.text == ""
    ) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("warlords.WarlordsBetFrame.str07"),
      );
      return;
    }
    var needBuyNum: number = this.getNeedBuyNum();
    if (needBuyNum > 0) {
      var tip: string = LangManager.Instance.GetTranslation(
        "warlords.WarlordsBetFrame.gloryBuyTip",
        needBuyNum,
        needBuyNum,
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        [needBuyNum, first, second, third],
        this.prompt,
        tip,
        this.confirm,
        this.cancel,
        this.gloryBuyCall.bind(this),
      );
      return;
    }
    this.commitBet(first, second, third);
  }

  private gloryBuyCall(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      let needBuyNum: number = data[0];
      if (
        PlayerManager.Instance.currentPlayerModel.playerInfo.point < needBuyNum
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("Auction.ResultAlert11"),
        );
        return;
      }
      this.commitBet(data[1], data[2], data[3]);
    }
  }

  private commitBet(first: string, second: string, third: string) {
    var tip: string = LangManager.Instance.GetTranslation(
      "warlords.WarlordsBetFrame.str08",
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      [first, second, third],
      this.prompt,
      tip,
      this.confirm,
      this.cancel,
      this.commitCall.bind(this),
    );
  }

  private commitCall(b: boolean, flag: boolean, data: any[]) {
    if (b) {
      WarlordsManager.Instance.reqBet(data[0], data[1], data[2], this.betNum);
      this._operType = 1;
      this.OnBtnClose();
    }
  }

  private getNeedBuyNum(): number {
    var num: number = this._betNum - ArmyManager.Instance.thane.gloryPoint;
    return num > 0 ? num : 0;
  }

  private get warlordsModel(): WarlordsModel {
    return WarlordsManager.Instance.model;
  }

  private get betNum(): number {
    return this._betNum;
  }

  private set betNum(value: number) {
    this._betNum = value;
    this.totalNumTxt.text = this._betNum.toString();
    this.hasCostTxt.text = this._betNum.toString();
    var succeedMaxNum: number = this._betNum * WarlordsModel.MAX_WIN_RATE;
    var failNum: number = this._betNum * WarlordsModel.FAIL_RATE;
    this.succeedNumTxt.text = succeedMaxNum.toString();
    this.failNumTxt.text = failNum.toString();
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
