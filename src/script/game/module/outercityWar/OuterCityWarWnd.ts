//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 19:52:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-10 11:24:55
 * @Description: 城战界面
 */
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import {
  ChatEvent,
  OuterCityWarEvent,
} from "../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityWarManager } from "./control/OuterCityWarManager";
import { OuterCityWarModel } from "./model/OuterCityWarModel";
import { OuterCityWarMapView } from "./view/OuterCityWarMapView";
import OuterCityWarScoreItem from "./view/item/OuterCityWarScoreItem";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { EmOuterCityWarCastlePeriodType } from "../../constant/OuterCityWarDefine";
import { TimerEvent, TimerTicker } from "../../utils/TimerTicker";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import HomeChatMsgView from "../home/HomeChatMsgView";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import Logger from "../../../core/logger/Logger";
import UIManager from "../../../core/ui/UIManager";
import { ChatManager } from "../../manager/ChatManager";
import { ClientStateType } from "../../constant/ClientStateType";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import CastleConfigUtil from "../../map/castle/utils/CastleConfigUtil";

export default class OuterCityWarWnd extends BaseWindow {
  protected resizeContent: boolean = true;
  protected setSceneVisibleOpen: boolean = true;
  public map: OuterCityWarMapView;
  private defanceScoreItem: OuterCityWarScoreItem;
  private attackScoreList: fgui.GList;
  private txtPowerDesc: fgui.GTextField;
  private txtScoreDesc: fgui.GTextField;
  private txtPowerValue: fgui.GTextField;
  private txtCastleState: fgui.GTextField;
  private gAttack: fgui.GGroup;
  private gCastleState: fgui.GGroup;
  private gOptInfo: fgui.GGroup;
  private comCampBlue: fgui.GComponent;
  private comCampRed: fgui.GComponent;
  private btnNotice: UIButton;
  private btnBattleList: UIButton;
  private btnGiveUpWar: UIButton;
  private btnDeclareWar: UIButton;
  private ChatBtn: UIButton;
  private frame: fgui.GComponent;
  private messageView: HomeChatMsgView; //主界面聊天展示信息
  private stateTimer: TimerTicker;

  public OnInitWind() {
    super.OnInitWind();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    if (this.frameData) {
      if (this.frameData.needReqCastle) {
        OuterCityWarManager.Instance.sendReqCastleInfo();
      }
      if (this.frameData.needRefreshAll) {
        OuterCityWarManager.Instance.commitAll();
      }
      this.fightModel.showReplaceTip();
    }
    this.refreshView();
    this.refreshChat();
  }

  public resize() {
    super.resize();

    if (!this.map) return;
    let scaleV = 0.8;
    if (CastleConfigUtil.MAP_RAW_WIDTH * scaleV < Resolution.gameWidth) {
      scaleV = Resolution.gameWidth / CastleConfigUtil.MAP_RAW_WIDTH;
    }
    this.map.scaleX = this.map.scaleY = scaleV;
    this.map.x = -(
      this.map.getRealWidth() * OuterCityWarMapView.MAP_SHOW_ANCHOR_POINT.x -
      Resolution.gameWidth / 2
    );
    this.map.y = -(
      this.map.getRealHeight() * OuterCityWarMapView.MAP_SHOW_ANCHOR_POINT.y -
      Resolution.gameHeight / 2
    );
    this.map.dragingCallBack();
  }

  private addEvent() {
    OuterCityWarManager.Instance.sendLeaveOutcityWar(1);
    SocketSendManager.Instance.sendCurrentClientState(
      ClientStateType.CLIENT_CAMPAIGN,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.CASTLE_INFO,
      this.__castleInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.ACTION_POINT,
      this.__actionPoint,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.DEFENCE_NPC_SCORE,
      this.__defanceNpcScore,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__showChatBtn,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_CHAT_BUGLE_VIEW_VISIBLE,
      this.__showChatBtn,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_CHAT_VIEW_VISIBLE,
      this.__showChatBtn,
      this,
    );
  }

  private removeEvent() {
    SocketSendManager.Instance.sendCurrentClientState(
      ClientStateType.CLIENT_WORLDMAP,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.CASTLE_INFO,
      this.__castleInfo,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.ACTION_POINT,
      this.__actionPoint,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.DEFENCE_NPC_SCORE,
      this.__defanceNpcScore,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__showChatBtn,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_CHAT_BUGLE_VIEW_VISIBLE,
      this.__showChatBtn,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_CHAT_VIEW_VISIBLE,
      this.__showChatBtn,
      this,
    );
  }

  private initView() {
    this.frame.displayObject.mouseThrough = true;
    this.map = new OuterCityWarMapView();
    this.addChildAt(this.map, 0);

    this.stateTimer = new TimerTicker(1000);
    this.txtFrameTitle.text = OuterCityWarManager.Instance.model.castleNodeName;
    this.txtPowerDesc.text = LangManager.Instance.GetTranslation(
      "outerCityWar.actionPoint",
    );
    this.txtScoreDesc.text = LangManager.Instance.GetTranslation(
      "outerCityWar.realTimeScore",
    );
    this.btnGiveUpWar.title =
      LangManager.Instance.GetTranslation("public.giveup2");
    this.btnNotice.title = LangManager.Instance.GetTranslation(
      "outerCityWar.presidentNotice",
    );
    this.btnBattleList.title = LangManager.Instance.GetTranslation(
      "public.battle.enterBattleList",
    );
    this.comCampBlue.getChild("title").text =
      LangManager.Instance.GetTranslation("public.camp.defanceCamp");
    this.comCampRed.getChild("title").text =
      LangManager.Instance.GetTranslation("public.camp.attackCamp");
  }

  private refreshView() {
    this.__actionPoint();
    this.__guildScore();
    this.__fightBtnState();
    this.__castleState();
    this.__enterWarGuild();
    this.__showChatBtn();
  }

  private refreshChat() {
    this.messageView && this.messageView.refreshChatScene();
  }

  private __castleInfo() {
    this.refreshView();
  }

  /** 守城方权限人员非争夺期可放弃
   *  进攻方权限人员宣战期、备战期可宣战
   * */
  private __fightBtnState() {
    if (this.fightModel.getSelfAttackDuty()) {
      this.gAttack.visible = true;

      let isDefencer = this.fightModel.checkDefenceGuild(
        this.fightModel.selfGuildId,
      );
      let isAttacker = this.fightModel.checkAttackGuild(
        this.fightModel.selfGuildId,
      );
      this.btnGiveUpWar.visible = false;
      this.btnDeclareWar.visible = false;
      if (isDefencer) {
        this.btnGiveUpWar.visible = true;
        let canNotGiveUp =
          this.fightModel.castleState ==
            EmOuterCityWarCastlePeriodType.Fighting ||
          this.fightModel.castleState ==
            EmOuterCityWarCastlePeriodType.DeclaringWar;
        this.btnGiveUpWar.enabled = !canNotGiveUp;
      } else {
        this.btnDeclareWar.visible = true;
        this.btnDeclareWar.enabled = !isAttacker;
        this.btnDeclareWar.title = LangManager.Instance.GetTranslation(
          isAttacker ? "public.battle.declaredWar" : "public.battle.declareWar",
        );
      }
    } else {
      this.gAttack.visible = false;
    }
  }

  private __actionPoint() {
    this.txtPowerValue.text = this.fightModel.curCastleActionPoint.toString();
  }

  /** 参战公会有更新 */
  private __enterWarGuild() {
    this.gOptInfo.visible = this.fightModel.checkGuildEnterWar(
      this.fightModel.selfGuildId,
    );
  }

  private __guildScore() {
    let defenceGuildInfo = this.fightModel.getDefenceGuildInfoList();
    if (defenceGuildInfo) {
      this.defanceScoreItem.info = defenceGuildInfo;
    } else {
      // 打完城战回来的时候更新
      this.__defanceNpcScore();
    }

    let attackGuildInfoList = this.fightModel.getAttackGuildInfoList();
    for (let index = 0; index < OuterCityWarModel.AttackCampSite; index++) {
      let info = attackGuildInfoList[index];
      let item = this.attackScoreList.getChildAt(
        index,
      ) as OuterCityWarScoreItem;
      if (item) {
        item.info = info;
      }
    }
  }

  private __defanceNpcScore() {
    this.defanceScoreItem.txtName.text = this.fightModel.castleDefenceNpcName;
    this.defanceScoreItem.txtScore.text =
      this.fightModel.castleDefenceNpcScore.toString();
    this.defanceScoreItem.imgScore.visible = true;
  }

  private __castleState() {
    let state = this.fightModel.castleState;

    let flag = false;
    switch (state) {
      case EmOuterCityWarCastlePeriodType.Peace:
        break;
      case EmOuterCityWarCastlePeriodType.DeclareWar:
        break;
      case EmOuterCityWarCastlePeriodType.DeclaringWar:
        flag = true;
        break;
      case EmOuterCityWarCastlePeriodType.Fighting:
        flag = true;
        break;
      case EmOuterCityWarCastlePeriodType.Protected:
        flag = true;
        break;
    }
    if (flag) {
      this.stateTimer.stop();
      this.stateTimer.addEventListener(
        TimerEvent.TIMER,
        this.__stateTimerHandler,
        this,
      );
      this.stateTimer.repeatCount = this.fightModel.leftTime;
      Logger.outcityWar("开始计时 城堡状态", this.fightModel.castleState);
      this.stateTimer.start();
      this.gCastleState.visible = true;
      this.__stateTimerHandler();
    } else {
      this.hideStateTimerTip();
    }
  }

  private showLeftTimeTipSpecial() {
    let state = this.fightModel.castleState;
    let timeStr = LangManager.Instance.GetTranslation("public.needMinutes", 1);
    let str = "";
    switch (state) {
      case EmOuterCityWarCastlePeriodType.Peace:
      case EmOuterCityWarCastlePeriodType.DeclareWar:
        break;
      case EmOuterCityWarCastlePeriodType.DeclaringWar:
        str = LangManager.Instance.GetTranslation(
          "outerCityWar.castleState01",
          timeStr,
        );
        break;
      case EmOuterCityWarCastlePeriodType.Fighting:
        str = LangManager.Instance.GetTranslation(
          "outerCityWar.castleState02",
          timeStr,
        );
        break;
      case EmOuterCityWarCastlePeriodType.Protected:
        str = LangManager.Instance.GetTranslation(
          "outerCityWar.castleState03",
          timeStr,
        );
        break;
    }
    this.gCastleState.visible = true;
    this.txtCastleState.text = str;
    if (!str) {
      this.hideStateTimerTip();
    }
  }

  private __stateTimerHandler() {
    let time: number =
      this.stateTimer.repeatCount - this.stateTimer.currentCount;
    if (this.stateTimer.repeatCount == 0 || time <= 60) {
      this.stateTimer.stop();
      this.showLeftTimeTipSpecial();
      return;
    }

    let str = "";
    let state = this.fightModel.castleState;
    let dd = DateFormatter.getStopDateString(time, false);
    switch (state) {
      case EmOuterCityWarCastlePeriodType.DeclaringWar:
        str = LangManager.Instance.GetTranslation(
          "outerCityWar.castleState01",
          dd,
        );
        break;
      case EmOuterCityWarCastlePeriodType.Fighting:
        str = LangManager.Instance.GetTranslation(
          "outerCityWar.castleState02",
          dd,
        );
        break;
      case EmOuterCityWarCastlePeriodType.Protected:
        str = LangManager.Instance.GetTranslation(
          "outerCityWar.castleState03",
          dd,
        );
        break;
    }

    // Logger.outcityWar("倒计时", this.stateTimer.currentCount, this.stateTimer.repeatCount, time, dd, state, str)

    if (str) {
      this.txtCastleState.text = str;
    }
  }

  private hideStateTimerTip() {
    this.txtCastleState.text = "";
    this.gCastleState.visible = false;
    if (this.stateTimer.running) {
      this.stateTimer.stop();
    }
  }

  private __showChatBtn() {
    if (ChatManager.Instance.model.showChatViewFlag) {
      this.ChatBtn.visible = false;
    } else {
      this.ChatBtn.visible = true;
    }
  }

  private btnAddPowerClick() {
    let content = LangManager.Instance.GetTranslation(
      "outerCityWar.buyActionPoint",
      this.fightModel.ActionPointPrice,
      this.fightModel.ActionPointBuyGet,
    );
    SimpleAlertHelper.Instance.Show(
      null,
      null,
      null,
      content,
      null,
      null,
      (b) => {
        if (b) {
          var hasMoney: number =
            PlayerManager.Instance.currentPlayerModel.playerInfo.point;
          if (hasMoney < this.fightModel.ActionPointPrice) {
            RechargeAlertMannager.Instance.show();
            return;
          }
          OuterCityWarManager.Instance.sendBuyActionPoint();
        }
      },
    );
  }

  private btnGiveUpWarClick() {
    let state = this.fightModel.castleState;
    switch (state) {
      case EmOuterCityWarCastlePeriodType.DeclaringWar:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("outerCityWar.cannotGiveup01"),
        );
        break;
      case EmOuterCityWarCastlePeriodType.Fighting:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("outerCityWar.cannotGiveup02"),
        );
        break;
      default:
        let content: string = LangManager.Instance.GetTranslation(
          "outerCityWar.giveupCastleAlert",
        );
        SimpleAlertHelper.Instance.Show(
          null,
          null,
          null,
          content,
          null,
          null,
          (b) => {
            if (b) {
              OuterCityWarManager.Instance.sendGiveUpCastle();
            }
          },
        );
        break;
    }
  }

  private btnDeclareWarClick() {
    let state = this.fightModel.castleState;
    switch (state) {
      case EmOuterCityWarCastlePeriodType.Peace:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "outerCityWar.cannotDeclareWar03",
          ),
        );
        break;
      case EmOuterCityWarCastlePeriodType.DeclareWar:
      case EmOuterCityWarCastlePeriodType.DeclaringWar:
        let content: string = LangManager.Instance.GetTranslation(
          "outerCityWar.consumeDeclareWar",
          this.fightModel.castleInfo.declareWarCost,
        );
        SimpleAlertHelper.Instance.Show(
          null,
          null,
          null,
          content,
          null,
          null,
          (b) => {
            if (b) {
              OuterCityWarManager.Instance.sendDeclareWar();
            }
          },
        );
        break;
      case EmOuterCityWarCastlePeriodType.Fighting:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "outerCityWar.cannotDeclareWar01",
          ),
        );
        break;
      case EmOuterCityWarCastlePeriodType.Protected:
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "outerCityWar.cannotDeclareWar02",
          ),
        );
        break;
    }
  }

  private btnBattleListClick() {
    FrameCtrlManager.Instance.open(EmWindow.OuterCityWarEnterWarSettingWnd);
  }

  private btnNoticeClick() {
    FrameCtrlManager.Instance.open(EmWindow.OuterCityWarNoticeWnd);
  }

  private ChatBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.ChatWnd);
  }

  protected OnBtnClose() {
    super.OnBtnClose();
    // 主动退出城战界面
    OuterCityWarManager.Instance.sendLeaveOutcityWar(2);
  }

  private helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content1 = LangManager.Instance.GetTranslation("outerCityWar.help01");
    let content2 = LangManager.Instance.GetTranslation("outerCityWar.help02");
    let content3 = LangManager.Instance.GetTranslation("outerCityWar.help03");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content1 + "<br>" + content2 + "<br>" + content3,
    });
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }

  public OnHideWind() {
    this.removeEvent();
    this.stateTimer.stop();
    this.stateTimer = null;
    super.OnHideWind();
  }
}
