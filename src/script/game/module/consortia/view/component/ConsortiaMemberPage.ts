import FUI_ConsortiaMemberPage from "../../../../../../fui/Consortia/FUI_ConsortiaMemberPage";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { ConsortiaSocektSendManager } from "../../../../manager/ConsortiaSocektSendManager";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../../data/ConsortiaDutyInfo";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import UIButton from "../../../../../core/ui/UIButton";
import LangManager from "../../../../../core/lang/LangManager";
import UIManager from "../../../../../core/ui/UIManager";
import { ConsortiaMemberView } from "./ConsortiaMemberView";
import Logger from "../../../../../core/logger/Logger";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/20 17:17
 * @ver 1.0
 *
 */
export class ConsortiaMemberPage extends FUI_ConsortiaMemberPage {
  public memberView: ConsortiaMemberView;

  private _contorller: ConsortiaControler;
  private _model: ConsortiaModel;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.initData();
    this.initView();
    this.addEvent();
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._model = this._contorller.model;
  }

  private initView() {
    let onlineNum: number = this._model.getOnlineConsortiaMembers().length;
    if (onlineNum <= 0) {
      onlineNum = 1;
    }
    this.txtOnlineValue.text =
      "(" + `${onlineNum}/${this._model.consortiaInfo.currentCount}` + ")";
    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.PASSINVITE)) {
      this.recruitBtn.visible = true;
      UIButton.setRedDot(this.recruitBtn, this._model.recruitNum, 1);
      UIButton.setRedDotPos(this.recruitBtn, 2, -5);
    } else {
      this.recruitBtn.visible = false;
    }

    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.SPEAK)) {
      this.recruitLinkBtn.visible = true;
    } else {
      this.recruitLinkBtn.visible = false;
    }

    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.TRANSFER)) {
      this.consortTransferBtn.visible = true;
    } else {
      this.consortTransferBtn.visible = false;
    }

    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.SPEAK)) {
      this.consortEmailBtn.visible = true;
    } else {
      this.consortEmailBtn.visible = false;
    }

    if (this._contorller.getRightsByIndex(ConsortiaDutyInfo.UPDATEBUILDING)) {
      this.consortEventBtn.visible = true;
    } else {
      this.consortEventBtn.visible = false;
    }
  }

  private addEvent() {
    this.recruitBtn.onClick(this, this.__recruitBtnHandler);
    this.recruitLinkBtn.onClick(this, this._recruitLinkBtnHandler);
    this.consortEventBtn.onClick(this, this.__consortEventBtnHandler);
    this.consortTransferBtn.onClick(this, this._consortTransferBtnHandler);
    this.consortEmailBtn.onClick(this, this._consortEmailBtnHandler);
    this._model.addEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_RIGHTS,
      this.__onConsortiaDutyInfoUpdata,
      this,
    );
  }

  private removeEvent() {
    this.recruitBtn.offClick(this, this.__recruitBtnHandler);
    this.recruitLinkBtn.offClick(this, this._recruitLinkBtnHandler);
    this.consortEventBtn.offClick(this, this.__consortEventBtnHandler);
    this.consortTransferBtn.offClick(this, this._consortTransferBtnHandler);
    this.consortEmailBtn.offClick(this, this._consortEmailBtnHandler);
    this._model.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_RIGHTS,
      this.__onConsortiaDutyInfoUpdata,
      this,
    );
  }

  private __onConsortiaDutyInfoUpdata() {
    this.refreshView();
  }

  private refreshView() {
    this.initView();
  }

  private __recruitBtnHandler() {
    UIButton.setRedDot(this.recruitBtn, 0);
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaAuditing);
  }

  private _recruitLinkBtnHandler() {
    if (ConsortiaManager.Instance.model.consortiaInfo.speakTimes <= 0) {
      let str: string = LangManager.Instance.GetTranslation(
        "consortia.view.myConsortia.chairmanPath.ConsortiaChairmanPath.command05",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaRecruitMember);
  }

  private __consortEventBtnHandler(evt: MouseEvent) {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaUpgrade);
  }

  private _consortTransferBtnHandler(evt: MouseEvent) {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaTransfer);
  }

  private _consortEmailBtnHandler(evt: MouseEvent) {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaEmail);
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  dispose() {
    this.removeEvent();
    this._contorller = null;
    this._model = null;
    super.dispose();
  }
}
