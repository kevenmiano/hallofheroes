import FUI_Btn_3red from "../../../../../fui/Dialog/FUI_Btn_3red";
import AudioManager from "../../../../core/audio/AudioManager";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import {
  NotificationEvent,
  RingTaskEvent,
} from "../../../constant/event/NotificationEvent";
import OpenGrades from "../../../constant/OpenGrades";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ConfigManager } from "../../../manager/ConfigManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import RingTaskManager from "../../../manager/RingTaskManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TaskManage } from "../../../manager/TaskManage";
import { SpaceArmyViewHelper } from "../../../map/space/utils/SpaceArmyViewHelper";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../../../utils/SwitchPageHelp";
import { RemotePetController } from "../../remotepet/RemotePetController";
import { DialogOptionItem } from "../DialogOptionItem";
import DialogItemInfo from "./DialogItemInfo";

export default class DialogOptionItemTwo extends FUI_Btn_3red {
  public static STORY_TASK: number = 7;
  public static START_OFF: number = 12; //跑环任务  即刻出发
  public static COMPONENT_TASK: number = 98; //跑环任务 完成任务
  private _type: number = 0;
  private _level: number = 0;
  private _param: number = 0;
  private _showNext: boolean = false; //是否显示下一个
  private _nextStep: Function;
  private _nextStepParam: object;
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

  public get textStr(): string {
    return this.titleTxt.text;
  }

  private refreshView() {
    this.titleTxt.text = this._info.title;
    this._type = this._info.type;
    this._level = this._info.level;
    this._param = this._info.param;
    this._nextStep = this._info.nextStep;
    this._nextStepParam = this._info.nextStepParam;
  }

  private addEvent() {
    this.onClick(this, this.__optionBtnClickHandler);
    RingTaskManager.Instance.addEventListener(
      RingTaskEvent.ADDRINGTASK,
      this.__showTalkNext,
      this,
    );
  }

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
        FrameCtrlManager.Instance.open(EmWindow.PetCampaignWnd);
        UIManager.Instance.HideWind(EmWindow.SpaceDialogWnd);
        break;
      case DialogOptionItem.REMOTEPET:
        if (ArmyManager.Instance.thane.grades < OpenGrades.REMOTEPET) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "map.sapce.view.frame.DialogOptionItem.remotePetTips",
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
    super.dispose();
  }
}
