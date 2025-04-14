import FUI_ConsortiaActivityPage from "../../../../../../fui/Consortia/FUI_ConsortiaActivityPage";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import {
  ConsortiaEvent,
  NotificationEvent,
} from "../../../../constant/event/NotificationEvent";
import LangManager from "../../../../../core/lang/LangManager";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ConsortiaDutyInfo } from "../../data/ConsortiaDutyInfo";
import { VotingState } from "../../data/VotingState";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import { ConsortiaSocketOutManager } from "../../../../manager/ConsortiaSocketOutManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import Logger from "../../../../../core/logger/Logger";
import UIManager from "../../../../../core/ui/UIManager";
import { ConsortiaSocektSendManager } from "../../../../manager/ConsortiaSocektSendManager";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";

/**
 * @description 公会成员界面
 * @author yuanzhan.yu
 * @date 2021/7/20 17:17
 * @ver 1.0
 */
export class ConsortiaActivityPage extends FUI_ConsortiaActivityPage {
  public member: any;

  private _contorller: ConsortiaControler;
  private _model: ConsortiaModel;
  private isOpen: boolean = false;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.initData();
    this.initEvent();
    this.initView();
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._model = this._contorller.model;
    this._contorller.getConsortiaInfos();
    this.isOpen = false;
  }

  private initView() {
    if (
      this._model.consortiaInfo.consortiaName == null ||
      this._model.consortiaInfo.consortiaName == ""
    ) {
      return;
    }
    this.txtConsortiaName.text = this._model.consortiaInfo.consortiaName;
    this._model.dispatchEvent(
      ConsortiaEvent.REFRESH_CONSORTIA_NAME,
      this._model.consortiaInfo.consortiaName,
    );
    this.txtConsortChairman.text = this._model.consortiaInfo.chairmanName;
    this.txtConsortiaRank.text = this._model.consortiaInfo.orderInfo
      ? this._model.consortiaInfo.orderInfo.gradeOrder.toString()
      : "";
    let maxCount = this._model.SortiaMaxMembers;
    this.txtConsortiaNum.text =
      this._model.consortiaInfo.currentCount.toString() +
      "/" +
      maxCount.toString();
    this.txtConsortiaWealth.text = this._model.consortiaInfo.offer.toString();
    this.txtConsortiaMaintain.text =
      this._model.consortiaInfo.levels * 500 +
      LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.ConsortiaFrameTopView.maintenanceCostTxt.week",
      );
    this.txtConsortiaContribution.text =
      this.playerInfo.consortiaOffer +
      "/" +
      this.playerInfo.consortiaTotalOffer;
    this.txtConsortiawuzi.text =
      this._model.consortiaInfo.consortiaMaterials.toString(); //公会物资
    this.txtSelfJianse.text =
      this.playerInfo.consortiaJianse +
      "/" +
      this.playerInfo.consortiaTotalJianse;
    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.UPDATEBUILDING)) {
      this.c1.selectedIndex = 0; //有权限
    } else {
      this.c1.selectedIndex = 1; //无权限
    }

    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.RENAME)) {
      this.renameBtn.visible = true;
    } else {
      this.renameBtn.visible = false;
    }
    this.consortiaInfoTxt.text = this._model.consortiaInfo.placard;
    this.txtConsortiaLevel.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this._model.consortiaInfo.levels,
    );
    if (this._model.consortiaInfo.votingState == VotingState.VOTINGING) {
      this.impeachBtn.visible = true;
    } else {
      this.impeachBtn.visible = false;
    }
  }

  private initEvent() {
    this.upgradeBtn.onClick(this, this._upgradeBtnHandler);
    this.donateBtn.onClick(this, this._donateBtnHandler);
    this._model.addEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdata,
      this,
    );
    this._model.addEventListener(
      ConsortiaEvent.PRIZE_MEMBER_LIST_UPDATE,
      this.__prizeMemberListUpdateHandler,
      this,
    );
    this.impeachBtn.onClick(this, this.__impeachBtnClickHandler);
    this.renameBtn.onClick(this, this._changeNameBtnHandler);
    this.changeBtn.onClick(this, this.changeBtnHander);
    this.extiConsortiaBtn.onClick(this, this._extiConsortiaBtnHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CONSORTIA_BOSS_SWITCH,
      this.__consortiaOfferUpdata,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.CONSORTIA_OFFER_CHANGE,
      this.updateView,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.CONSORTIA_JIANSE_CHANGE,
      this.updateView,
      this,
    );
  }

  private removeEvent() {
    this.upgradeBtn.offClick(this, this._upgradeBtnHandler);
    this.donateBtn.offClick(this, this._donateBtnHandler);
    this._model.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdata,
      this,
    );
    this._model.removeEventListener(
      ConsortiaEvent.PRIZE_MEMBER_LIST_UPDATE,
      this.__prizeMemberListUpdateHandler,
      this,
    );
    this.impeachBtn.offClick(this, this.__impeachBtnClickHandler);
    this.changeBtn.offClick(this, this.changeBtnHander);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CONSORTIA_BOSS_SWITCH,
      this.__consortiaOfferUpdata,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.CONSORTIA_OFFER_CHANGE,
      this.updateView,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.CONSORTIA_JIANSE_CHANGE,
      this.updateView,
      this,
    );
  }

  private updateView() {
    this.txtConsortiaContribution.text =
      this.playerInfo.consortiaOffer +
      "/" +
      this.playerInfo.consortiaTotalOffer;
    this.txtSelfJianse.text =
      this.playerInfo.consortiaJianse +
      "/" +
      this.playerInfo.consortiaTotalJianse;
  }

  private _upgradeBtnHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaEvent);
  }

  private _donateBtnHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute);
  }

  private __onConsortiaInfoUpdata(evt: ConsortiaEvent) {
    ConsortiaSocketOutManager.consortiaPrizeCheck();
    this.initView();
  }

  private __consortiaOfferUpdata() {
    this.txtConsortiaWealth.text = this._model.consortiaInfo.offer.toString();
  }

  private __prizeMemberListUpdateHandler(e: ConsortiaEvent) {
    if (this.isOpen) {
      FrameCtrlManager.Instance.open(EmWindow.ConsortiaPrizeAllotWnd);
    }
  }

  private __impeachBtnClickHandler() {
    this._contorller.getVotingUserInfos();
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaElectionWnd);
  }

  /**
   * 修改公会公告
   */
  private changeBtnHander() {
    //弹窗，输入内容点击确定，调用下面接口
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaInfoChange);
  }

  /**退出公会 */
  private _extiConsortiaBtnHandler(evt: MouseEvent) {
    let point: string = TempleteManager.Instance.getConfigInfoByConfigName(
      "Consortia_ClearCD_Point",
    ).ConfigValue;
    let content: string = LangManager.Instance.GetTranslation(
      "consortia.view.myConsortia.ConsortiaFrame.content",
    );
    let isFirst =
      PlayerManager.Instance.currentPlayerModel.playerInfo.addGuildCount <= 1; //加入公会次数
    let checkTxt: string = "";
    let hideCheck1: boolean = false;
    if (isFirst) {
      content +=
        "<br>" +
        LangManager.Instance.GetTranslation(
          "consortia.view.myConsortia.ConsortiaFrame.checkTxt.first",
        );
      hideCheck1 = true;
    } else {
      checkTxt = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.ConsortiaFrame.checkTxt",
        point,
      );
      hideCheck1 = false;
    }
    UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
      content: content,
      checkTxt: checkTxt,
      hidecheck1: hideCheck1,
      state: 2,
      backFunction: this.exitCallback.bind(this),
      closeFunction: null,
    });
  }

  private exitCallback(check: boolean) {
    if (this._model) {
      //退出公会
      if (
        this._model.consortiaInfo.chairmanID == this.playerInfo.userId &&
        this._model.consortiaInfo.currentCount > 1
      ) {
        let str: string = LangManager.Instance.GetTranslation(
          "consortia.view.myConsortia.ConsortiaFrame.command02",
        );
        MessageTipManager.Instance.show(str);
        return;
      }
      if (check) {
        let num: number = GoodsManager.Instance.getGoodsNumByTempId(208013);
        let point: number =
          PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        let point2: string = TempleteManager.Instance.getConfigInfoByConfigName(
          "Consortia_ClearCD_Point",
        ).ConfigValue;
        Logger.log(num < 0);
        if (num <= 0 && point < +point2) {
          RechargeAlertMannager.Instance.show();
          return;
        }
        ConsortiaSocektSendManager.exitConsortia(1, true);
      } else {
        ConsortiaSocektSendManager.exitConsortia(0, true);
      }

      FrameCtrlManager.Instance.exit(EmWindow.Consortia);
    }
  }

  private _changeNameBtnHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaRename);
  }

  public get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  dispose() {
    this.removeEvent();
    this._contorller = null;
    this._model = null;
    super.dispose();
  }
}
