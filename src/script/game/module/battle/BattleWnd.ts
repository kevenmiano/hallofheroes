/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-12-31 11:43:59
 * @LastEditTime: 2024-04-28 10:55:01
 * @LastEditors: jeremy.xu
 * @Description: 战斗UI界面
 */
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import ObjectPool from "../../../core/pool/ObjectPool";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { BattleManager } from "../../battle/BattleManager";
import { BattleModel } from "../../battle/BattleModel";
import { HeroRoleInfo } from "../../battle/data/objects/HeroRoleInfo";
import { BattleType, BattleRoleBufferType } from "../../constant/BattleDefine";
import {
  BattleNotic,
  ChatEvent,
  IMEvent,
  NativeEvent,
} from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyManager } from "../../manager/ArmyManager";
import IMManager from "../../manager/IMManager";
import { NotificationManager } from "../../manager/NotificationManager";
import ChatData from "../chat/data/ChatData";
import HomeChatMsgView from "../home/HomeChatMsgView";
import { BatterHandler } from "./handler/BatterHandler";
import { BottomBar } from "./ui/bottom/BottomBar";
import { RoleShowViewII } from "./ui/RoleShowViewII";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import OpenGrades from "../../constant/OpenGrades";
import { BattleRecordReader } from "../../battle/record/BattleRecordReader";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { RoleShowViewIII } from "./ui/RoleShowViewIII";
import { PetBattleBar } from "./ui/bottom/PetBattleBar";
import FUI_BattleSkillItemCircle from "../../../../fui/Battle/FUI_BattleSkillItemCircle";
import FUI_BattleSkillItemRect from "../../../../fui/Battle/FUI_BattleSkillItemRect";
import Utils from "../../../core/utils/Utils";
import Resolution from "../../../core/comps/Resolution";
import { ResistUIView } from "./ui/ResistUIView";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import OutyardShowView from "./ui/OutyardShowView";
import AssetAutoAnimation from "../../component/AssetAutoAnimation";
import PetInfoView from "./ui/PetInfoView";
import PetPKSkillItemListView from "./ui/skill/PetPKSkillItemListView";
import { PetPKBattleBar } from "./ui/bottom/PetPKBattleBar";
import BloodsViews from "./ui/BloodsViews";
import { OuterCityWarModel } from "../outercityWar/model/OuterCityWarModel";
import { HurtUpHandler } from "./handler/HurtUpHandler";
import { WithdrawHandler } from "./handler/WithdrawHandler";
import { ReduceEffectHandler } from "./handler/ReduceEffectHandler";
import { SkillNameHandler } from "./handler/SkillNameHandler";
import { ReinforceViewHandler } from "./handler/ReinforceViewHandler";
import { OutyardViewHandler } from "./handler/OutyardViewHandler";
import { SkillItemListView } from "./ui/skill/SkillItemListView";

export default class BattleWnd extends BaseWindow {
  public static ISINIT: boolean = false;
  private chatDataPool: ObjectPool<ChatData>;
  private btnChat: UIButton;
  private btnVoice: UIButton;
  private btnShortcuts: UIButton;
  private chatMessage: HomeChatMsgView;
  private chatMessageBg: fgui.GImage;
  private cPetPvp: fgui.Controller;
  private cRecord: fgui.Controller;
  private comAutoFightAni: AssetAutoAnimation;
  private bloodsViews: BloodsViews;

  /**
   * 试炼技能
   */
  public skill_trail: fgui.GGroup;
  public gPropSkills: fgui.GGroup;

  /**
   * 自动战斗
   */
  public btnAutoAttack: UIButton;
  public btnOwnRoleInfoList: UIButton;
  public btnEnemyRoleInfoList: UIButton;

  private _addSpBallLayer: Laya.Sprite;
  /**
   * 右上角对方信息UI
   */
  private _roleShowII: RoleShowViewII;
  private _roleShowIII: RoleShowViewIII;
  /**
   * 战斗底部UI
   */
  private _bottomBar: BottomBar;
  /**
   * 战斗底部UI 英灵远征版
   */
  private _petBar: PetBattleBar;
  private _petPKBar: PetPKBattleBar;

  private _hurtUpHandler: HurtUpHandler;
  private _batterHandler: BatterHandler;
  private _withdrawHandler: WithdrawHandler;
  public get withdrawHandler(): WithdrawHandler {
    return this._withdrawHandler;
  }
  private _reduceEffectHandler: ReduceEffectHandler;
  private _skillNameHandler: SkillNameHandler;
  private _reinforceViewHandler: ReinforceViewHandler;
  public get reinforceViewHandler(): ReinforceViewHandler {
    return this._reinforceViewHandler;
  }

  // /**
  //  * 队友血条
  //  */
  // private _teamStripContainer1 : VBox;
  // /**
  //  * 对方血条
  //  */
  // private _teamStripContainer2 : VBox;

  // private _godArriveTimeTxt:FilterFrameText;
  // private _godArrivetimer:Timer;

  public _outyardShow: OutyardViewHandler;
  public petInfoView: PetInfoView;
  public petPkSkillView: PetPKSkillItemListView;
  private itemSkill_1: FUI_BattleSkillItemCircle;
  private itemSkill_2: FUI_BattleSkillItemCircle;
  private itemSkill_3: FUI_BattleSkillItemCircle;
  private itemSkill_4: FUI_BattleSkillItemCircle;
  private itemSkill_5: FUI_BattleSkillItemCircle;
  private itemSkill_6: FUI_BattleSkillItemCircle;
  private itemRune_1: FUI_BattleSkillItemRect;
  private itemRune_2: FUI_BattleSkillItemRect;
  private bottom_Box: fgui.GGroup;

  /**
   * 抗性UI, 记录抗性减伤和忽抗加成
   */
  private _resistUIView1: ResistUIView;
  private _resistUIView2: ResistUIView;

  constructor() {
    super();
    this.resizeContent = true;
    this.chatDataPool = new ObjectPool("chatDataPool");
  }

  public OnInitWind() {
    super.OnInitWind();
    BattleManager.Instance.battleUIView = this;
    if (Utils.isApp() && Resolution.scaleFixWidth) {
      this.adaptPad();
    }
    this.initView();
    this.addEvent();
  }

  private initView() {
    Logger.battle(
      "战斗UI界面初始化 isPvP:",
      this.battleModel.isPvP(),
      "isTrail:",
      this.battleModel.isTrail(),
      "录像模式:",
      BattleRecordReader.inRecordMode,
    );

    /**
     * 动态添加 需要时候创建
     */
    this._hurtUpHandler = new HurtUpHandler(
      this,
      this.battleModel.getHurtMode(),
    );
    this._batterHandler = new BatterHandler(this);
    this._withdrawHandler = new WithdrawHandler(this);
    this._reduceEffectHandler = new ReduceEffectHandler(this);
    this._skillNameHandler = new SkillNameHandler(this);
    this._reinforceViewHandler = new ReinforceViewHandler(this);

    //初始化自动战斗文本
    let fightTxt = LangManager.Instance.GetTranslation(
      "battle.view.ui.BattleAutoFightAnimation",
    );
    this.comAutoFightAni.initText(fightTxt, true, false);
    if (this.battleModel.isAllPetPKBattle()) {
      this._petPKBar = new PetPKBattleBar(this.petPkSkillView);
    } else {
      this._bottomBar = new BottomBar(this);
    }
    if (this.battleModel.battleType == BattleType.OUTYARD_BATLE) {
      this._outyardShow = new OutyardViewHandler(this);
    }
    if (
      BattleManager.Instance.batterModel &&
      BattleManager.Instance.battleModel.battleType ==
        BattleType.DOUBLE_BOSS_BATTLE
    ) {
      this._roleShowIII = new RoleShowViewIII(this);
    } else if (
      BattleManager.Instance.batterModel &&
      BattleManager.Instance.battleModel.battleType != BattleType.OUTYARD_BATLE
    ) {
      this._roleShowII = new RoleShowViewII(this);
    }

    this._addSpBallLayer = new Laya.Sprite();
    this.addChild(this._addSpBallLayer);

    this._resistUIView1 = new ResistUIView(1);
    this._resistUIView2 = new ResistUIView(2);
    this._resistUIView1.visible = false;
    this._resistUIView2.visible = false;
    this.addChild(this._resistUIView1);
    this.addChild(this._resistUIView2);
    let resistX = 60;
    this._resistUIView1.x = resistX;
    this._resistUIView1.y = 180;
    this._resistUIView2.x = StageReferance.stageWidth - resistX;
    this._resistUIView2.y = 180;

    this.cPetPvp = this.getController("cPetPvp");
    this.cRecord = this.getController("cRecord");
    if (this.battleModel.isAllPetPKBattle()) {
      this.cPetPvp.selectedIndex = 1;
    } else {
      this.cPetPvp.selectedIndex = 0;
    }
    this.cRecord.selectedIndex = BattleRecordReader.inRecordMode ? 1 : 0;
    this.gPropSkills.visible =
      ArmyManager.Instance.thane.grades >= OpenGrades.VEHICEL;

    let showBtnChat =
      ArmyManager.Instance.thane.grades >= OpenGrades.BATTLE_CHAT;
    this.chatMessage.visible =
      this.btnChat.visible =
      this.chatMessageBg.visible =
      this.btnVoice.visible =
        showBtnChat;
    this.btnShortcuts.visible = this.battleModel.isShowShortCut;
    this.btnAutoAttack.visible = this.battleModel.isShowAutoFight;
    this.updateAutoFightBtn(this.battleModel.getAutoFightFlag());
    if (this.battleModel.isShowAutoFight) {
      NotificationManager.Instance.addEventListener(
        BattleNotic.AUTO_FIGHT_CHANGED,
        this.onAutoFightChanged.bind(this),
        this,
      );
    }

    // if (this.isGodArrive) {
    //     let info: GodArriveGateInfo = godArriveModel.gateInfos[godArriveModel.info.curTollgateId];
    //     if (info == null) {
    //         GodArriveManager.Instance.addEventListener(GodArriveEvent.GOD_INFO, __godArriveHandler);
    //         godArriveModel.sendGodArriveInfo();
    //     } else if (info.remainTime > 0) {
    //         this.initGodArriveView();
    //     }
    // }
    this.bloodsViews.init();
    BattleWnd.ISINIT = true;
    OuterCityWarModel.BattleVictory = false;
  }

  /**
   * 在pad和折叠屏下将下排技能按钮缩小
   */
  adaptPad() {
    for (let i = 1; i <= SkillItemListView.TalentIndex; i++) {
      let item: FUI_BattleSkillItemCircle = this["itemSkill_" + i];
      item.setScale(0.7, 0.7);
    }
    for (let i = 1; i <= SkillItemListView.PropCnt; i++) {
      let item1: FUI_BattleSkillItemRect = this["itemRune_" + i];
      item1.setScale(0.7, 0.7);
    }
  }

  private initGodArriveView() {
    // let info: GodArriveGateInfo = godArriveModel.gateInfos[godArriveModel.info.curTollgateId];
    // if (!isGodArrive || !info) return;
    // _godArriveTimeTxt = ComponentFactory.Instance.creatComponentByStylename("battle.godArriveTimeTxt");
    // this.addChild(_godArriveTimeTxt);
    // let str: string = DateFormatter.getConsortiaCountDate(info.remainTime);
    // let chatData = this.chatDataPool.get(() => { return new ChatData() })
    // chatData.channel = ChatChannel.INFO;
    // chatData.msg = LangManager.Instance.GetTranslation("battle.view.ui.BattleUIView.GodArriveReTime", str);;
    // chatData.commit();
    // NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT, chatData);
    // Laya.timer.once(1000, this, this.__onGodArriveTimer.bind(this))
  }

  private addEvent() {
    this.btnAutoAttack.view.on(
      fgui.Events.STATE_CHANGED,
      this,
      this.btnAutoAttackChangeHandler,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SET_BATTERUI_VISIBLE,
      this.__batterUIVisible.bind(this),
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SET_RESIST_VISIBLE,
      this.__resistUIVisible.bind(this),
      this,
    );
    // NotificationManager.Instance.addEventListener(BattleNotic.SET_RESIST_TOTAL_DAMAGE, this.__setResistTotalDamage.bind(this), this);
    NotificationManager.Instance.addEventListener(
      BattleNotic.SHOW_SKILL_USE_SUCCESS,
      this.__skillUseSuccess.bind(this),
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.SKILL_ENABLE,
      this.__skillEnable.bind(this),
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.CHAT_FROM_CONSORTIA,
      this.__receiveGroupChatHandler.bind(this),
      this,
    );
    IMManager.Instance.addEventListener(
      IMEvent.MSGBOX_SHINING_UPDATE,
      this.__msgboxShiningUpdateHandler.bind(this),
      this,
    );
    NotificationManager.Instance.addEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
  }

  private removeEvent() {
    this.btnAutoAttack.view.off(
      fgui.Events.STATE_CHANGED,
      this,
      this.btnAutoAttackChangeHandler,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SHOW_SKILL_USE_SUCCESS,
      this.__skillUseSuccess.bind(this),
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SET_BATTERUI_VISIBLE,
      this.__batterUIVisible.bind(this),
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SET_RESIST_VISIBLE,
      this.__resistUIVisible.bind(this),
      this,
    );
    // NotificationManager.Instance.removeEventListener(BattleNotic.SET_RESIST_TOTAL_DAMAGE, this.__setResistTotalDamage.bind(this), this);
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SKILL_ENABLE,
      this.__skillEnable.bind(this),
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.CHAT_FROM_CONSORTIA,
      this.__receiveGroupChatHandler.bind(this),
      this,
    );
    IMManager.Instance.removeEventListener(
      IMEvent.MSGBOX_SHINING_UPDATE,
      this.__msgboxShiningUpdateHandler.bind(this),
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
  }

  private __receiveGroupChatHandler() {}

  private __msgboxShiningUpdateHandler() {}

  private __batterUIVisible(visible: boolean) {
    // this._resistUIView.visible = visible
    if (visible == true) {
      BattleManager.Instance.batterModel.lock = false;
      this._batterHandler && this._batterHandler.show();
    } else {
      Laya.timer.once(25, this, () => {
        this._batterHandler && this._batterHandler.hide();
        if (BattleManager.Instance.batterModel)
          BattleManager.Instance.batterModel.lock = false;
      });
    }
  }
  //抗性隐藏显示
  private __resistUIVisible(visible: boolean, side: number) {
    let battleModel = this.battleModel;
    // if (battleModel.battleType == BattleType.DARK_DUST_MOUNTAINS_BOSS_BATTLE ||
    //     battleModel.battleType == BattleType.REMAIN_TUNNEL_BOSS_BATTLE ||
    //     battleModel.battleType == BattleType.REMAIN_HILL_BOSS_BATTLE) {
    //     return;
    // }

    let _resistUIView: ResistUIView =
      side == 1 ? this._resistUIView1 : this._resistUIView2;
    if (visible && _resistUIView) {
      _resistUIView.show(visible);
    }
  }

  private __skillEnable(data: any) {
    if (!this.battleModel.isEnableAutoFight) {
      this.btnAutoAttack.enabled = false;
      return;
    }
    if (this.battleModel.isOver) {
      this.btnAutoAttack.enabled = false;
    } else {
      this.btnAutoAttack.enabled = true;
    }
  }

  private __godArriveHandler() {
    // GodArriveManager.Instance.removeEventListener(GodArriveEvent.GOD_INFO, this.__godArriveHandler.bind(this), this);
    // let info: GodArriveGateInfo = godArriveModel.gateInfos[godArriveModel.info.curTollgateId];
    // if (info && info.remainTime > 0) {
    //     initGodArriveView();
    // }
  }
  private __onGodArriveTimer() {
    // let info:GodArriveGateInfo = godArriveModel.gateInfos[godArriveModel.info.curTollgateId];
    // if(info)
    // {
    //     if(info.remainTime <= 0)
    //     {
    //         if (_godArrivetimer) {
    //             _godArrivetimer.stop();
    //             _godArrivetimer.removeEventListener(TimerEvent.TIMER, __onGodArriveTimer);
    //             _godArrivetimer = null;
    //         }
    //         if(_godArriveTimeTxt)_godArriveTimeTxt.visible = false;
    //         return;
    //     }
    //     let str:string = DateFormatter.getConsortiaCountDate(info.remainTime);
    //     if(_godArriveTimeTxt)_godArriveTimeTxt.text = str;
    //     info.remainTime -= 1;
    // }
  }

  //     private get godArriveModel():GodArriveModel
  //     {
  //         return GodArriveManager.Instance.model;
  //     }

  public addTeamStrip(roleInfo: HeroRoleInfo) {
    // if (roleInfo == null) return;
    // let selfSide: number = BattleManager.Instance.battleModel.selfSide;
    // if (roleInfo.side == selfSide) {
    //     if (roleInfo.heroInfo.userId != ArmyManager.Instance.thane.userId) {
    //         _teamStripContainer1.addChild(new TeamStrip(roleInfo, FaceType.LEFT_TEAM));
    //     }
    // } else {
    //     _teamStripContainer2.addChild(new TeamStrip(roleInfo, FaceType.RIGHT_TEAM));
    // }
  }

  private onAutoFightChanged() {
    if (this.battleModel && !this.battleModel.isOver) {
      this.updateAutoFightBtn(this.battleModel.getAutoFightFlag());
    }
  }
  //type 1自动  2 取消自动
  private updateAutoFightBtn(type: number) {
    if (type == BattleModel.AUTO_FIGHT) {
      this.btnAutoAttack.selected = true;
      this.comAutoFightAni.visible = true;
      this.comAutoFightAni.start();
    } else {
      this.btnAutoAttack.selected = false;
      this.comAutoFightAni.visible = false;
      this.comAutoFightAni.stop();
    }
    if (!this.battleModel.isEnableAutoFight) {
      this.btnAutoAttack.enabled = false;
    }
  }

  public getAutoFightBtn(): UIButton {
    return this.btnAutoAttack;
  }
  public getRoleShowViewII(): RoleShowViewII {
    return this._roleShowII;
  }
  public get autoFightBtn(): UIButton {
    return this.btnAutoAttack;
  }
  public get roleShowViewII(): RoleShowViewII {
    return this._roleShowII;
  }
  public get bottomBar(): BottomBar {
    return this._bottomBar;
  }
  public showTopView() {
    if (this._roleShowII) this._roleShowII.visible = true;
    if (this._roleShowIII) this._roleShowIII.visible = true;
  }
  public hideTopView() {
    if (this._roleShowII) this._roleShowII.visible = false;
    if (this._roleShowIII) this._roleShowIII.visible = false;
  }
  /**
   * 技能使用成功, 播放动画
   * @param data
   */
  private __skillUseSuccess(data: any) {
    // if (!BattleManager.Instance.battleModel.isAutoFight) {
    //     BattleManager.Instance.battleMap.addSkillAimFlag(data[3]);
    // }
    BattleManager.Instance.battleMap.addSkillAimFlag(data[3]);
  }
  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  private get isGodArrive(): boolean {
    if (this.battleModel.battleType == BattleType.TOLLGATE_GOD_BATTLE) {
      return true;
    }
    return false;
  }

  public getAddSpBallLayer(): Laya.Sprite {
    return this._addSpBallLayer;
  }

  /**怒气坐标点 */
  public getAddSpDestPoint(): Laya.Point {
    var pt: Laya.Point;
    // pt = new Laya.Point(this.heroRage.x, this.heroRage.y - this.heroRage.height * 1 / 4);
    // pt = this._addSpBallLayer.globalToLocal(pt);
    return pt;
  }

  OnHideWind() {
    BattleWnd.ISINIT = false;
    this.removeEvent();
    Laya.timer.clearAll(this);
    NotificationManager.Instance.removeEventListener(
      BattleNotic.AUTO_FIGHT_CHANGED,
      this.onAutoFightChanged.bind(this),
      this,
    );
    // GodArriveManager.Instance.removeEventListener(GodArriveEvent.GOD_INFO, this.__godArriveHandler.bind(this), this)
    // this._hurtUpHandler.dispose();
    // this._batterHandler.dispose();
    this._reduceEffectHandler.dispose();
    this._withdrawHandler.dispose();
    this._skillNameHandler.dispose();
    this._reinforceViewHandler.dispose();

    if (this._bottomBar) {
      this._bottomBar.dispose();
    }
    if (this._roleShowII) {
      this._roleShowII.dispose();
    }
    this._roleShowII = null;
    if (this._roleShowIII) {
      this._roleShowIII.dispose();
    }
    this._roleShowIII = null;
    if (this._batterHandler) {
      this._batterHandler.dispose();
    }
    if (this._petBar) {
      this._petBar.dispose();
      this._petBar = null;
    }
    if (this._petPKBar) {
      this._petPKBar.dispose();
      this._petPKBar = null;
    }
    this.bloodsViews.clear();
    super.OnHideWind();
  }

  /////////////点击事件//////////////////
  // testBossHp = 1000
  private btnAutoAttackChangeHandler() {
    // 测试 减boss血
    // this.testBossHp -= 100
    // this._roleShowII._bossView.setCurrentHp(this.testBossHp);

    if (!this.btnAutoAttack.enabled) {
      return;
    }

    if (this.battleModel.getAutoFightFlag() == BattleModel.AUTO_FIGHT) {
      this.battleModel.setAutoFight(BattleModel.CANCEL_AUTO_FIGHT);
    } else {
      this.battleModel.setAutoFight(BattleModel.AUTO_FIGHT);
    }
  }

  private btnOwnRoleInfoListClick() {
    FrameCtrlManager.Instance.open(EmWindow.BattleBuffDetailInfo, {
      type: BattleRoleBufferType.ALL,
    });
  }

  private btnExitRecordClick() {
    let str = LangManager.Instance.GetTranslation("battle.record.closePlay");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      null,
      str,
      null,
      null,
      (b: boolean) => {
        if (b) {
          BattleRecordReader.stop();
        }
      },
    );
  }

  /**打开聊天 */
  private btnChatClick() {
    FrameCtrlManager.Instance.open(EmWindow.ChatWnd);
  }

  /**打开广播 */
  private btnVoiceClick() {
    if (!UIManager.Instance.isShowing(EmWindow.ChatBugleWnd)) {
      UIManager.Instance.ShowWind(EmWindow.ChatBugleWnd);
    }
  }

  /**打开快捷语 */
  private btnShortcutsClick() {
    FrameCtrlManager.Instance.open(EmWindow.BattleShortCutWnd);
  }

  /**打开 */
  private btnSettingClick() {
    FrameCtrlManager.Instance.open(EmWindow.BattleSettingWnd);
  }

  dispose() {
    super.dispose();
    this._resistUIView1.destroy();
    this._resistUIView2.destroy();
    this._resistUIView1 = null;
    this._resistUIView2 = null;
  }
}
