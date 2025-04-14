//@ts-expect-error: External dependencies
import Resolution from "../../../../core/comps/Resolution";
import LangManager from "../../../../core/lang/LangManager";
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import { t_s_skillbuffertemplateData } from "../../../config/t_s_skillbuffertemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { UIAlignType } from "../../../constant/UIAlignType";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { CampaignManager } from "../../../manager/CampaignManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { CampaignNode } from "../../../map/space/data/CampaignNode";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../control/ConsortiaControler";
import ConsortiaBossUserInfo from "../data/ConsortiaBossUserInfo";
import { ConsortiaModel } from "../model/ConsortiaModel";
import ConsortiaBossTaskItem from "./component/ConsortiaBossTaskItem";

export default class ConsortiaBossTaskView extends BaseWindow {
  public skillTipsCtr: fgui.Controller;
  public coinTipsCtr: fgui.Controller;
  public rewardBtn: fgui.GButton;
  public extendBtn: fgui.GButton;
  public campaignNameTxt: fgui.GTextField;
  public fightTimeDescTxt: fgui.GTextField; //剩余挑战时间
  public fightTimeValueTxt: fgui.GTextField;
  public rewardTitle: fgui.GTextField;
  public rewardTxt: fgui.GTextField;
  public descTitle: fgui.GTextField;
  public descTxt: fgui.GTextField;
  public coinDescTxt: fgui.GTextField;
  public taskList: fgui.GList;
  public icon1: fgui.GLoader;
  public icon2: fgui.GLoader;

  private _model: ConsortiaModel;
  private _contorller: ConsortiaControler;
  private _bossUserInfo: ConsortiaBossUserInfo;
  private selectedItem: ConsortiaBossTaskItem = null;
  private selectedItem2: fgui.GLoader = null;

  public static SONTYPE_1: number = 40701;
  public static SONTYPE_2: number = 40702;
  public static SONTYPE_3: number = 40703;

  private bosslist: fgui.GComponent;
  private getGoodsBtn: fgui.GButton;
  private _aInfo: CampaignArmy;
  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    // Resolution.addWidget(this,UIAlignType.RIGHT);
    this.fixFguiCom();
    this.skillTipsCtr = this.getController("skillTipsCtr");
    this.coinTipsCtr = this.getController("coinTipsCtr");
    this.initData();
    this.initEvent();
    // this.taskList.lineGap = 20;
    this.fightTimeValueTxt.text = this.leftTime;
    Laya.timer.loop(1000, this, this.setFightTimeValueTxt);
    this.consortiaSwitchHandler();
    this.refreshView();
  }

  private fixFguiCom() {
    BaseFguiCom.autoGenerate(this.bosslist, this);
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._model = this._contorller.model;
  }

  private initEvent() {
    this.taskList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTaskList,
      null,
      false,
    );
    this.rewardBtn.onClick(this, this.rewardBtnHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CONSORTIA_BOSS_SWITCH,
      this.consortiaSwitchHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CONSORTIA_BOSS_STATE_UPDATE,
      this.consortiaBossStateUpdateHandler,
      this,
    );
    this.on(Laya.Event.CLICK, this, this.clickHandler);
    this.getGoodsBtn.onClick(this, this.getGoodsBtnHandler);
  }

  private removeEvent() {
    // this.taskList.itemRenderer.recover();
    Utils.clearGListHandle(this.taskList);
    this.rewardBtn.offClick(this, this.rewardBtnHandler);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CONSORTIA_BOSS_SWITCH,
      this.consortiaSwitchHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CONSORTIA_BOSS_STATE_UPDATE,
      this.consortiaBossStateUpdateHandler,
      this,
    );
    Laya.timer.clear(this, this.setFightTimeValueTxt);
    this.off(Laya.Event.CLICK, this, this.clickHandler);
    this.getGoodsBtn.offClick(this, this.getGoodsBtnHandler);
  }

  private clickHandler(event: Laya.Event) {
    let item1: any = event.target;
    if (!item1) return;
    let item: any = item1.$owner;
    if (item instanceof ConsortiaBossTaskItem) {
      //点击任务项
      if (this.skillTipsCtr.selectedIndex == 1) {
        //tips现在已经是显示的
        if (this.selectedItem && this.selectedItem == item) {
          //点击的是同一个则是关掉当前tips。
          this.selectedItem = null;
          this.skillTipsCtr.selectedIndex = 0;
        } else if (this.selectedItem && this.selectedItem != item) {
          //点击的不是同一个则是替换当前tips的内容。
          this.setRewardTxt(item); //设置tips内容
        }
      } else {
        //tips原来没有显示, 现在需要显示tips
        this.skillTipsCtr.selectedIndex = 1;
        this.setRewardTxt(item); //设置tips内容
      }
    } else if (
      item instanceof fgui.GLoader &&
      (item.name == "icon1" || item.name == "icon2")
    ) {
      //点击下面两个图标
      if (this.coinTipsCtr.selectedIndex == 1) {
        //道具tips现在已经是显示的
        if (this.selectedItem2 && this.selectedItem2 == item) {
          //点击的是同一个则是关掉当前道具tips。
          this.selectedItem2 = null;
          this.coinTipsCtr.selectedIndex = 0;
        } else if (this.selectedItem2 && this.selectedItem2 != item) {
          //点击的不是同一个则是替换当前tips的内容。
          this.setCoinTxt(item); //设置tips内容
        }
      } else {
        //tips原来没有显示, 现在需要显示tips
        this.coinTipsCtr.selectedIndex = 1;
        this.setCoinTxt(item); //设置tips内容
      }
    } else {
      this.selectedItem = null;
      this.selectedItem2 = null;
      this.skillTipsCtr.selectedIndex = 0;
      this.coinTipsCtr.selectedIndex = 0;
    }
  }

  private getGoodsBtnHandler() {
    let nextNode: CampaignNode =
      CampaignManager.Instance.mapModel.getConsortiaBossGoodsNode();
    if (nextNode) {
      this._aInfo = CampaignManager.Instance.mapModel.selfMemberData;
      if (!this._aInfo) return;
      CampaignManager.Instance.mapModel.selectNode = nextNode;
      CampaignManager.Instance.controller.moveArmyByPos(
        nextNode.x,
        nextNode.y,
        true,
        true,
      );
    }
  }

  private setRewardTxt(item: ConsortiaBossTaskItem) {
    this.selectedItem = item;
    let type = this.selectedItem.type;
    let sonType: number;
    if (type == 0) {
      sonType = ConsortiaBossTaskView.SONTYPE_1;
    } else if (type == 1) {
      sonType = ConsortiaBossTaskView.SONTYPE_2;
    } else if (type == 2) {
      sonType = ConsortiaBossTaskView.SONTYPE_3;
    }
    this.rewardTxt.text = LangManager.Instance.GetTranslation(
      "ConsortiaBoss.ConsortiaBossTaskItem.rewardTips" + type,
    );
    this.descTxt.text = this.getDescTxt(item, sonType);
  }

  private getDescTxt(item: ConsortiaBossTaskItem, sonType: number): string {
    let str: string;
    let skillData: t_s_skilltemplateData;
    if (sonType == ConsortiaBossTaskView.SONTYPE_2) {
      if (item.currentProcess >= item.maxProcessValue) {
        skillData =
          TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
            sonType,
            1,
          );
      } else {
        skillData =
          TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
            sonType,
            0,
          );
      }
    } else {
      skillData =
        TempleteManager.Instance.getSkillTemplateInfoBySonTypeAndGrade(
          sonType,
          item.currentProcess,
        );
    }
    if (skillData) {
      let skillBufferData: t_s_skillbuffertemplateData =
        TempleteManager.Instance.getSkillBuffTemplateByID(skillData.TemplateId);
      if (skillBufferData) {
        str = skillBufferData.BufferNameLang;
      }
    }
    return str;
  }

  private setCoinTxt(item: fgui.GLoader) {
    this.selectedItem2 = item;
    if (item.name == "icon1") {
      this.coinDescTxt.text = LangManager.Instance.GetTranslation(
        "ConsortiaBossTaskView.collectImage.tipdata",
      );
    } else if (item.name == "icon2") {
      this.coinDescTxt.text = LangManager.Instance.GetTranslation(
        "ConsortiaBossTaskView.propImage.tipdata",
      );
    } else {
      this.coinDescTxt.text = "";
    }
  }

  private renderTaskList(index: number, item: ConsortiaBossTaskItem) {
    if (!item || item.isDisposed) return;
    item.type = index;
  }

  private rewardBtnHandler() {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaBossRewardWnd);
  }

  private refreshView() {
    this.fightTimeValueTxt.text = this.leftTime;
    this.taskList.numItems = 3;
    // this.taskList.ensureSizeCorrect();
    // this.taskList.ensureBoundsCorrect();
    UIFilter.gray(this.icon2.displayObject);
    UIFilter.gray(this.icon1.displayObject);
    this._bossUserInfo = this._model.bossInfo.getBossUserInfoByUserId(
      this.playerInfo.userId,
    );
    if (!this._bossUserInfo) return;
    if (this._bossUserInfo.propCount < 1) {
      UIFilter.gray(this.icon2.displayObject);
    } else {
      UIFilter.normal(this.icon2.displayObject);
    }
    if (this._bossUserInfo.mineralsCount < 1) {
      UIFilter.gray(this.icon1.displayObject);
    } else {
      UIFilter.normal(this.icon1.displayObject);
    }
  }

  private setFightTimeValueTxt() {
    this.fightTimeValueTxt.text = this.leftTime;
  }

  private consortiaSwitchHandler() {
    if (this._model.bossInfo.state == 1) {
      //准备中
      this.fightTimeDescTxt.text = LangManager.Instance.GetTranslation(
        "ui.tasktracebar.view.consortiaboss.ConsortiaBossSortView.startTxt",
      );
    } else if (this._model.bossInfo.state == 2) {
      //进行中
      this.fightTimeDescTxt.text = LangManager.Instance.GetTranslation(
        "ui.tasktracebar.view.petboss.PetBossSortView.timeTxt",
      );
    }
  }

  private consortiaBossStateUpdateHandler() {
    this.refreshView();
  }

  private get leftTime(): string {
    var str: string = "";
    var endTime: number =
      DateFormatter.parse(
        this._model.bossInfo.endTime,
        "YYYY-MM-DD hh:mm:ss",
      ).getTime() / 1000;
    if (this._model.bossInfo.state == 1) {
      //准备中
      endTime = endTime - 1800;
    }
    var curTime: number =
      PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
    if (endTime > curTime) {
      str = DateFormatter.getCountDateByMS(endTime - curTime);
    } else {
      if (this._model.bossInfo.state == 1) {
        str = LangManager.Instance.GetTranslation(
          "ui.tasktracebar.view.petboss.PetBossSortView.starStr",
        );
      } else if (this._model.bossInfo.state == 2) {
        str = LangManager.Instance.GetTranslation(
          "ui.tasktracebar.view.petboss.PetBossSortView.endStr",
        );
      }
    }
    return str;
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
  }

  dispose(dispose?: boolean) {
    Laya.timer.clear(this, this.setFightTimeValueTxt);
    super.dispose(dispose);
  }
}
