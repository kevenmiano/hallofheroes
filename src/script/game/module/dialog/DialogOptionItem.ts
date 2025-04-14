//@ts-expect-error: External dependencies
import LangManager from "../../../core/lang/LangManager";
import RingTaskManager from "../../manager/RingTaskManager";
import {
  NotificationEvent,
  RingTaskEvent,
} from "../../constant/event/NotificationEvent";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { SoundIds } from "../../constant/SoundIds";
import AudioManager from "../../../core/audio/AudioManager";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { SpaceArmyViewHelper } from "../../map/space/utils/SpaceArmyViewHelper";
import { TaskManage } from "../../manager/TaskManage";
import { ConfigManager } from "../../manager/ConfigManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { NotificationManager } from "../../manager/NotificationManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import Utils from "../../../core/utils/Utils";
import OpenGrades from "../../constant/OpenGrades";
import { RemotePetController } from "../remotepet/RemotePetController";
import FUIHelper from "../../utils/FUIHelper";
import FUI_Btn_2red from "../../../../fui/Dialog/FUI_Btn_2red";
import DialogItemInfo from "./data/DialogItemInfo";

/**
 * @description  天空之城对话框选项item
 * @author yuanzhan.yu
 * @date 2021/6/24 16:39
 * @ver 1.0
 *
 */
export class DialogOptionItem extends FUI_Btn_2red {
  public static STORY_TASK: number = 7;
  public static PET_PVP: number = 9;
  public static RING_TASK: number = 11; //跑环任务
  public static START_OFF: number = 12; //跑环任务  即刻出发
  public static TREASURE_MAP: number = 13; //藏宝图
  public static SINGLE_PASS: number = 14; //天穹之径
  public static COMPONENT_TASK: number = 98; //跑环任务 完成任务
  public static LEAVE: number = 99;
  public static PET_CAMPAIGN: number = 200; //英灵战役
  /**
   *英灵远征
   */
  public static REMOTEPET: number = 101;
  private _type: number = 0;
  private _level: number = 0;
  private _param: number = 0;
  private _showNext: boolean = false; //是否显示下一个

  private _nextStep: Function;
  private _nextStepParam: object;
  private _btn: fgui.GButton;
  private _picLoader: fgui.GLoader;
  private _info: DialogItemInfo;
  onConstruct() {
    super.onConstruct();
    this.addEvent();
    Utils.setDrawCallOptimize(this);
  }

  public set info(value: DialogItemInfo) {
    if (value) {
      this._info = value;
      this.refreshView();
    }
  }

  private refreshView() {
    this.typeTxt.text = this._info.title;
    this._type = this._info.type;
    this._level = this._info.level;
    this._param = this._info.param;
    this._nextStep = this._info.nextStep;
    this._nextStepParam = this._info.nextStepParam;
    this.typeIcon.url = this.getTypeIconUrl();
  }

  private addEvent() {
    this.onClick(this, this.__optionBtnClickHandler);
    RingTaskManager.Instance.addEventListener(
      RingTaskEvent.ADDRINGTASK,
      this.__showTalkNext,
      this,
    );
  }

  private getTypeIconUrl(): string {
    this.typeIcon.x = this.typeIcon.y = 0;
    switch (this._type) {
      case 2: //英雄之门
        return FUIHelper.getItemURL("Dialog", "Btn_Eve_HallOfHeroes");
        break;
      case 3: //竞技场
        return FUIHelper.getItemURL("Dialog", "Btn_Eve_Arena");
        break;
      case 5: //神秘商店
        return FUIHelper.getItemURL("Dialog", "Btn_Eve_MysteryShop");
        break;
      case 8: //英灵兑换
      case 9: //英灵竞技
      case 101: //英灵远征
      case 200: //英灵战役
        this.typeIcon.x = 2;
        this.typeIcon.y = 6;
        return FUIHelper.getItemURL("Dialog", "Btn_Main_Sylph2");
        break;
      case 10: //紫晶兑换
        return FUIHelper.getItemURL("Dialog", "Btn_Eve_Amethyst");
        break;
      case 13: //藏宝图
        return FUIHelper.getItemURL("Dialog", "Btn_Eve_LostTreasure");
        break;
      case 14: //天穹之径
        return FUIHelper.getItemURL("Dialog", "Btn_Eve_SkyTrail");
        break;
    }
  }
  /**
   * 1, 悬赏
   * 2, 英雄之门
   * 3, 竞技大厅
   * 4, 载具
   * 5, 市场
   * 6, 传送
   * 7, 英灵兑换
   * 9, 英灵竞技
   * 10, 紫晶积分兑换
   *……后续待补充
   * @param evt
   *
   */
  private __optionBtnClickHandler(evt: MouseEvent) {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (this._level > ArmyManager.Instance.thane.grades) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "store.view.StoreFrame.command01",
          this._level,
        ),
      );
      return;
    }
    switch (this._type) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 8:
      case 10:
      case 9:
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        SpaceArmyViewHelper.openNodeFrame(this._type);
        break;
      case DialogOptionItem.TREASURE_MAP:
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        if (TaskManage.Instance.IsTaskFinish(TaskManage.TTREASURE_MAP_TASK)) {
          FrameCtrlManager.Instance.open(EmWindow.TreasureClaimMapWnd);
        } else {
          let alertStr: string = TaskManage.Instance.getTaskByID(
            TaskManage.TTREASURE_MAP_TASK,
          ).TitleLang;
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "task.isTaskCommit.Alert",
              alertStr,
            ),
          );
          return;
        }
        break;
      case DialogOptionItem.SINGLE_PASS:
        SpaceArmyViewHelper.openNodeFrame(this._type);
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        break;
      case 6:
        SocketSendManager.Instance.enterPetLand(this._param);
        break;
      case 7:
        if (this._nextStep != null) {
          this._nextStep(this._nextStepParam);
        }
        break;
      case DialogOptionItem.RING_TASK:
        //向服务端发送"接取环任务"的消息
        if (ArmyManager.Instance.thane.grades >= 35) {
          this._showNext = true;
          if (this._param == 17) {
            RingTaskManager.Instance.accessRingTask();
          } else {
            this._nextStep && this._nextStep(this._nextStepParam);
          }
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "map.space.view.frame.DialogOptionItem.Level",
            ),
          );
        }
        break;
      case 12:
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        SwitchPageHelp.skipPageByTaskCondictionType(
          RingTaskManager.Instance.getRingTask(),
          null,
          null,
        );
        break;
      case DialogOptionItem.COMPONENT_TASK:
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        NotificationManager.Instance.dispatchEvent(
          NotificationEvent.TALKRINGTASK_COMPLETE,
        );
        break;
      case DialogOptionItem.PET_CAMPAIGN:
        if (ArmyManager.Instance.thane.grades < OpenGrades.PET_CAMPAIGN) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "map.sapce.view.frame.DialogOptionItem.petCampaignTips",
              OpenGrades.PET_CAMPAIGN,
            ),
          );
          return;
        }
        FrameCtrlManager.Instance.open(EmWindow.PetCampaignWnd);
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        break;
      case DialogOptionItem.REMOTEPET:
        if (ArmyManager.Instance.thane.grades < OpenGrades.REMOTEPET) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "map.sapce.view.frame.DialogOptionItem.remotePetTips",
              OpenGrades.REMOTEPET,
            ),
          );
          return;
        }
        RemotePetController.Instance.startFrameByType(1);
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        break;
      default:
        if (this._nextStep != null) {
          this._nextStep(this._nextStepParam);
        }
        break;
    }
  }

  private __showTalkNext() {
    if (this._showNext) {
      this._showNext = false;
      this._nextStep && this._nextStep(this._nextStepParam);
    }
  }

  private removeEvent() {
    this.offClick(this, this.__optionBtnClickHandler);
    RingTaskManager.Instance.removeEventListener(
      RingTaskEvent.ADDRINGTASK,
      this.__showTalkNext,
      this,
    );
  }

  dispose() {
    this.removeEvent();
    this._showNext = false;
    this._nextStep = null;
    this._nextStepParam = null;
    if (this._btn) {
      ObjectUtils.disposeObject(this._btn);
      this._btn = null;
    }
    super.dispose();
  }
}
