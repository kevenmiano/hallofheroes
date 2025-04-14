//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OutyardManager from "../../manager/OutyardManager";
import OutyardGuildInfo from "./data/OutyardGuildInfo";
import StackHeadStateMsg = com.road.yishi.proto.stackhead.StackHeadStateMsg;
import StackHeadSelfMsg = com.road.yishi.proto.stackhead.StackHeadSelfMsg;
import { PlayerManager } from "../../manager/PlayerManager";
/**
 * 外域争夺战祝福界面
 */
export default class OutyardBlessWnd extends BaseWindow {
  public frame: fgui.GLabel;
  public attackTxt: fgui.GRichTextField;
  public defenceTxt: fgui.GRichTextField;
  public attackDescTxt: fgui.GRichTextField;
  public defenceDescTxt: fgui.GRichTextField;
  public attackAddTxt: fgui.GRichTextField;
  public defenceAddTxt: fgui.GRichTextField;
  public attackCostTxt: fgui.GRichTextField;
  public defenceCostTxt: fgui.GRichTextField;
  public attackBtn: fgui.GButton;
  public defenceBtn: fgui.GButton;
  private _config1: Array<any>;
  private _config2: Array<any>;
  private _intervalTime: number = 0;
  public OnInitWind() {
    this.setCenter();
    this.addEvent();
    this.initView();
    this.selfInfoHandler();
  }

  private initView() {
    this._config1 = ConfigInfoManager.Instance.getStackHeadAttackBuff();
    this._config2 = ConfigInfoManager.Instance.getStackHeadDefenceBuff();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  private addEvent() {
    this.attackBtn.onClick(this, this.onAttackHandler);
    this.defenceBtn.onClick(this, this.onDefenceHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_FULL_INFO,
      this.selfInfoHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_SELF_INFO,
      this.selfInfoHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.OUTYARD_UPDATE_INFO,
      this.selfInfoHandler,
      this,
    );
  }

  private removeEvent() {
    this.attackBtn.offClick(this, this.onAttackHandler);
    this.defenceBtn.offClick(this, this.onDefenceHandler);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_FULL_INFO,
      this.selfInfoHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_SELF_INFO,
      this.selfInfoHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.OUTYARD_UPDATE_INFO,
      this.selfInfoHandler,
      this,
    );
  }

  private selfInfoHandler() {
    let myGuild: OutyardGuildInfo = OutyardManager.Instance.myGuild;
    if (!myGuild) return;
    this.attackAddTxt.text = myGuild.attackBuffLevel * this._config1[1] + "%";
    this.defenceAddTxt.text = myGuild.defenceBuffLevel * this._config2[1] + "%";
    this.attackCostTxt.text = LangManager.Instance.GetTranslation(
      "outyard.OutyardBlessFrame.attackNoteTxt.text1",
      this._config1[0],
      this._config1[1],
    );
    this.defenceCostTxt.text = LangManager.Instance.GetTranslation(
      "outyard.OutyardBlessFrame.attackNoteTxt.text2",
      this._config2[0],
      this._config2[1],
    );
  }

  private onAttackHandler() {
    if (Laya.Browser.now() - this._intervalTime < 500) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = Laya.Browser.now();
    if (!this.checkBlessing(1)) return;
    var myGuild: OutyardGuildInfo = OutyardManager.Instance.myGuild;
    myGuild.attackBuffLevel++;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_FULL_INFO,
    );
    OutyardManager.Instance.OperateOutyard(OutyardManager.ATTACK_BUFF);
  }

  private onDefenceHandler() {
    if (Laya.Browser.now() - this._intervalTime < 500) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "activity.view.ActivityItem.command01",
        ),
      );
      return;
    }
    this._intervalTime = Laya.Browser.now();
    if (!this.checkBlessing(2)) return;
    let myGuild: OutyardGuildInfo = OutyardManager.Instance.myGuild;
    myGuild.defenceBuffLevel++;
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTYARD_FULL_INFO,
    );
    OutyardManager.Instance.OperateOutyard(OutyardManager.DEFENCE_BUFF);
  }

  private checkBlessing(type: number): boolean {
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "friends.im.IMFrame.consortia.TipTxt",
        ),
      );
      return;
    }
    let selfMsg: StackHeadSelfMsg = OutyardManager.Instance.selfMsg;
    let stateMsg: StackHeadStateMsg = OutyardManager.Instance.stateMsg;
    let myGuild: OutyardGuildInfo = OutyardManager.Instance.myGuild;

    if (type == 1 && this._config1[2] <= myGuild.attackBuffLevel) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("outyard.StackHead.Buff.AttackMax"),
      );
      return false;
    }
    if (type == 2 && this._config2[2] <= myGuild.defenceBuffLevel) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "outyard.StackHead.Buff.DefenceMax",
        ),
      );
      return false;
    }
    if (stateMsg.state == 2) {
      //备战中
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "outyard.OutyardBlessFrame.cannotBlessingHandler",
        ),
      );
      return false;
    }
    if (stateMsg.state == 3) {
      //开战中
      if (
        (type == 1 && this._config1[0] > selfMsg.actionPoint) ||
        (type == 2 && this._config2[0] > selfMsg.actionPoint)
      ) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "outyard.OutyardBlessFrame.executionNotHandler",
          ),
        );
        return false;
      }
    }
    if (stateMsg.state == 4) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "outyard.OutyardBlessFrame.balanceHandler",
        ),
      );
      return false;
    }
    if (stateMsg.state == 5) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "outyard.OutyardBlessFrame.overHandler",
        ),
      );
      return false;
    }
    return true;
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose() {
    super.dispose();
  }
}
