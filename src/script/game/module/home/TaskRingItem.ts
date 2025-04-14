//@ts-expect-error: External dependencies
import FUI_TaskRingItem from "../../../../fui/Home/FUI_TaskRingItem";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import SDKManager from "../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../core/thirdlib/RptEvent";
import UIManager from "../../../core/ui/UIManager";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import StringHelper from "../../../core/utils/StringHelper";
import { t_s_campaignData } from "../../config/t_s_campaign";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_rewardcondictionData } from "../../config/t_s_rewardcondiction";
import ColorConstant from "../../constant/ColorConstant";
import { ConfigType } from "../../constant/ConfigDefine";
import NewbieEvent, {
  NotificationEvent,
  RewardEvent,
  RingTaskEvent,
  TaskEvent,
} from "../../constant/event/NotificationEvent";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { RewardConditionType } from "../../constant/RewardConditionType";
import { TaskType } from "../../constant/TaskType";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { KingContractManager } from "../../manager/KingContractManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { MopupManager } from "../../manager/MopupManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RingTaskManager from "../../manager/RingTaskManager";
import { SharedManager } from "../../manager/SharedManager";
import { TaskSocketManager } from "../../manager/TaskSocketManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import NewbieBaseConditionMediator from "../guide/mediators/NewbieBaseConditionMediator";
import { KingContractInfo } from "../kingcontract/KingContractInfo";
import BaseOfferReward from "../offerReward/BaseOfferReward";
import { RingTask } from "../ringtask/RingTask";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { TaskTemplate } from "../task/TaskTemplate";
export default class TaskRingItem extends FUI_TaskRingItem {
  private _vdata: any;
  private _flag: boolean = false;
  private _type: string = "";
  // 跑环任务
  public static TypeRing: string = "TypeRing";
  // 悬赏
  public static TypeBaseOfferReward: string = "TypeBaseOfferReward";
  // 主线、日常、其他
  public static TypeTask: string = "TypeTask";
  private _handIn: string = LangManager.Instance.GetTranslation(
    "YiShi.mainBar.view.TaskTraceItem.HandInText",
  );
  onConstruct() {
    super.onConstruct();
    this.bgActive = false;
    this.initEvent();
  }

  private clean() {
    this.typeTxt.text = "";
    // this.ringNumTxt.text = "";
    this.ringTaskTxt.text = "";
    this.cType.selectedIndex = 0;
    if (this._vdata && this._vdata instanceof TaskTemplate)
      this._vdata.removeEventListener(
        TaskEvent.TASK_DETAIL_CHANGE,
        this.__taskChangeHandler,
        this,
      );
    else if (this._vdata && this._vdata instanceof BaseOfferReward)
      this._vdata.removeEventListener(
        RewardEvent.REWARD_TASK_UPDATE,
        this.__taskChangeHandler,
        this,
      );
    else if (this._vdata && this._vdata instanceof RingTask)
      this._vdata.removeEventListener(
        RingTaskEvent.REFRESHRING,
        this.__taskChangeHandler,
        this,
      );
    this._vdata = null;
  }

  private set bgActive(value: boolean) {
    this.bg.visible = value;
  }

  public set vData(value: any) {
    this.clean();
    this._vdata = value;
    if (this._vdata) {
      this.bgActive = true;
      if (this._vdata instanceof TaskTemplate) {
        this._type = TaskRingItem.TypeTask;
        this._vdata.addEventListener(
          TaskEvent.TASK_DETAIL_CHANGE,
          this.__taskChangeHandler,
          this,
        );
      } else if (this._vdata instanceof BaseOfferReward) {
        this._type = TaskRingItem.TypeBaseOfferReward;
        this._vdata.addEventListener(
          RewardEvent.REWARD_TASK_UPDATE,
          this.__taskChangeHandler,
          this,
        );
      } else if (this._vdata instanceof RingTask) {
        this._type = TaskRingItem.TypeRing;
        this._vdata.addEventListener(
          RingTaskEvent.REFRESHRING,
          this.__taskChangeHandler,
          this,
        );
      }
      this.refresh();
    }
  }

  private initEvent() {
    this.onClick(this, this.__clickHandler);
    this.speedBtn.onClick(this, this.speedBtnHandler);
  }

  private removeEvent() {
    this.offClick(this, this.__clickHandler);
    this.speedBtn.offClick(this, this.speedBtnHandler);
  }

  private speedBtnHandler(e: Laya.Event) {
    if (this._vdata instanceof RingTask) {
      //跑环
      this.ringTaskQuickHandler();
    } else if (this._vdata instanceof BaseOfferReward) {
      UIManager.Instance.ShowWind(EmWindow.OfferRewardWnd);
    }
    e.stopPropagation();
  }

  private get cfgRingTaskQuickCost(): number {
    let cfgValue = 10;
    let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName(
      "SkipRepeatReward_Price",
    );
    if (cfgItem) {
      cfgValue = Number(cfgItem.ConfigValue);
    }
    return cfgValue;
  }

  private ringTaskQuickHandler() {
    var needAlert: boolean = true;
    var lastSaveFlag: boolean = SharedManager.Instance.completeRingTaskFlag;
    // var useBind: boolean = SharedManager.Instance.completeRingTaskUseBind;
    if (lastSaveFlag) {
      needAlert = false;
    }
    if (needAlert) {
      let content: string = LangManager.Instance.GetTranslation(
        "task.TaskFrameII.usePointPrompt2",
      );
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.IMPERIAL_PASS,
      );
      let goodsCount: string =
        LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
      UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
        content: content,
        goodsId: ShopGoodsInfo.IMPERIAL_PASS,
        goodsCount: goodsCount,
        hidecheck1: false,
        callback: this.quickSubmit.bind(this),
      });
      return;
    } else {
      this.quickSubmit(true, lastSaveFlag);
    }
  }

  private quickSubmit(b: boolean, flag: boolean) {
    if (b) {
      SharedManager.Instance.completeRingTaskFlag = flag;

      var hasGoods: Array<GoodsInfo> =
        GoodsManager.Instance.getBagGoodsByTemplateId(
          ShopGoodsInfo.IMPERIAL_PASS,
        );
      if (hasGoods.length > 0) {
        RingTaskManager.Instance.CompletedImmediately(b);
      } else {
        //数量不足时, 弹商城购买窗口
        let info: ShopGoodsInfo =
          TempleteManager.Instance.getShopTempInfoByItemId(
            ShopGoodsInfo.IMPERIAL_PASS,
            ShopGoodsInfo.PROP_GOODS,
          );
        if (info) {
          FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
            info: info,
            count: 1,
          });
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("public.lackProps"),
          );
        }
      }
    }
  }

  private __clickHandler() {
    if (MopupManager.Instance.model.isMopup) {
      let str: string = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (this.checkTaskComplete(this._vdata)) {
      // NotificationManager.Instance.sendNotification(NewbieEvent.ARROW_STATE, { type: 0, tip: null });
      return;
    }
    // NotificationManager.Instance.sendNotification(NewbieEvent.ARROW_STATE, { type: 0, tip: null });
    SwitchPageHelp.skipPageByTaskCondictionType(
      this._vdata,
      this.openTaskFrame,
      this,
    );
  }

  private openTaskFrame() {
    if (MopupManager.Instance.model.isMopup) {
      let str: string = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.TaskWnd, this._vdata);
  }

  private checkTaskComplete(vData: any): boolean {
    if (vData instanceof BaseOfferReward) {
      if (vData.isCompleted) {
        OfferRewardManager.Instance.sendFinishRewardTask(vData.rewardID);
        return true;
      }
    } else if (vData instanceof TaskTemplate) {
      if (vData.isCompleted) {
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess ==
          GlobalConfig.NEWBIE_32000
        ) {
          SDKManager.Instance.getChannel().adjustEvent(
            RPT_EVENT.TASK_TO_GRASSLAND,
          );
        } else if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess ==
          GlobalConfig.NEWBIE_35600
        ) {
          SDKManager.Instance.getChannel().adjustEvent(
            RPT_EVENT.TASK_CHALLENGE,
          );
        } else if (vData.TemplateId == 350) {
          SDKManager.Instance.getChannel().adjustEvent(
            RPT_EVENT.TASK_GET_FOREST_UNDERWORLD,
          );
        }
        TaskSocketManager.sendGetTaskReward(vData.TemplateId, 0, false);
        return true;
      }
    } else if (vData instanceof RingTask) {
      if (vData.isCompleted) {
        RingTaskManager.Instance.submitRingTask();
        return true;
      }
    }
    return false;
  }

  public get vData(): any {
    return this._vdata;
  }

  private __taskChangeHandler() {
    this.clean();
    this.refresh();
    //会再次触发SpaceTaskInfoWnd的 _taskChangeHandler
    NotificationManager.Instance.sendNotification(
      NotificationEvent.TASKRING_ITEM_UPDATE,
    );
  }

  private refresh() {
    if (!this._vdata) {
      return;
    }
    this.setVState();
    this.refreshCondition();
  }

  private cleanBtn() {
    // this.ringNumTxt.text = "";
    this.typeTxt.text = "";
    this.cType.selectedIndex = 0;
  }

  /**
   * 更新类型标志, 悬赏进度
   */
  private setVState() {
    this.cleanBtn();
    if (!this._vdata || !this.ringTaskTxt) return;
    if (this._vdata instanceof TaskTemplate) {
      if (
        this._vdata.TemplateType == TaskType.TASK_ACT ||
        this._vdata.TemplateType == TaskType.VIP_TASK ||
        this._vdata.TemplateType == TaskType.BACK_PLAYER
      ) {
        return;
      }
      switch (this._vdata.TemplateType) {
        case TaskType.TASK_MAIN:
          this.typeTxt.text = LangManager.Instance.GetTranslation(
            "TaskRingItem.type.text1",
          );
          break;
        case TaskType.TASK_COMMON:
          this.typeTxt.text = LangManager.Instance.GetTranslation(
            "TaskRingItem.type.text2",
          );
          break;
        default:
          this.typeTxt.text = "";
          break;
      }
    } else if (this._vdata instanceof BaseOfferReward) {
      this.cType.selectedIndex = 1;
      this.typeTxt.text = LangManager.Instance.GetTranslation(
        "TaskRingItem.type.text3",
      );
    } else if (this._vdata instanceof RingTask) {
      this.ringNumStr =
        "(" +
        (RingTaskManager.Instance.model.rewardNum - 1) +
        LangManager.Instance.GetTranslation(
          "ui.tasktracebar.view.ringTaskNum",
        ) +
        ")";
      this.typeTxt.text = LangManager.Instance.GetTranslation(
        "TaskRingItem.type.text4",
      );

      if (RingTaskManager.Instance.getRingTask()) {
        this.cType.selectedIndex = 1;
        this.ringNumStr =
          "(" +
          RingTaskManager.Instance.model.rewardNum +
          LangManager.Instance.GetTranslation(
            "ui.tasktracebar.view.ringTaskNum",
          ) +
          ")";
      } else {
        this.cType.selectedIndex = 0;
      }
    }
  }
  private ringNumStr: string = "";

  /**
   * 更新进度
   */
  private refreshCondition() {
    let progress: any[] = this._vdata.getProgress();
    this._flag = true;
    this.ringTaskTxt.text = "";
    let initStr: string = "";
    let progressStr: string = "";
    let descTxt: string = "";
    for (let i: number = 0; i < this._vdata.conditionList.length; i++) {
      let condition: any = this._vdata.conditionList[i];
      let flag: boolean = false;
      if (i == 0) {
        initStr = condition.CondictionTitleLang;
      }
      if (
        String(progress[i]) ==
        LangManager.Instance.GetTranslation(
          "buildings.offerreward.data.BaseOfferReward.progress",
        )
      ) {
        continue;
      }
      let str: string = condition.CondictionTitleLang;
      if (this._vdata instanceof RingTask) {
        let ringCondition: t_s_rewardcondictionData =
          RingTaskManager.Instance.getCurrCondition();
        if (RingTaskManager.Instance.getRingTask()) {
          switch (ringCondition.CondictionType) {
            case RewardConditionType.COMMITITEM:
              let goodstempleteInfo: t_s_itemtemplateData =
                ConfigMgr.Instance.getTemplateByID(
                  ConfigType.t_s_itemtemplate,
                  this._vdata.currTask.condition_3,
                );
              if (goodstempleteInfo) {
                let itemName: string = goodstempleteInfo.TemplateNameLang;
                str = str.replace("{0}", itemName);
              }
              break;
            case RewardConditionType.KILLDUPLICATEMONSTER:
              let mapTemplate: t_s_campaignData =
                TempleteManager.Instance.getCampaignTemplateByID(
                  this._vdata.currTask.condition_2,
                );
              if (mapTemplate) {
                str = str.replace("{0}", mapTemplate.CampaignNameLang);
              }
              break;
          }
        } else {
          str = LangManager.Instance.GetTranslation(
            "ui.tasktracebar.view.TaskTraceItem.taskcontent",
          );
          flag = true;
        }
      }
      if (StringHelper.isNullOrEmpty(this.ringTaskTxt.text)) {
        this.ringTaskTxt.text = str;
        descTxt = str;
        if (!flag) {
          progressStr = progress[i];
          this.ringTaskTxt.text += progress[i];
        }
      }
      this._flag = false;
    }
    if (this._flag) {
      this.typeTxt.color = this.ringTaskTxt.color = ColorConstant.GREEN_COLOR;
      this.ringTaskTxt.text = initStr;
      this.cType.selectedIndex = 0;
    } else {
      this.typeTxt.color = this.ringTaskTxt.color =
        ColorConstant.LIGHT_TEXT_COLOR;
      this.ringTaskTxt.text = this.ringTaskTxt.text.replace(this._handIn, "");
      let endIndex: number = 0;
      if (this._vdata instanceof RingTask) {
        // this.cType.selectedIndex = 1;
        this.ringTaskTxt.text += " " + this.ringNumStr;
        // if (this.ringTaskTxt.text.length * 2 + this.ringNumStr.length + 1 > 23*2) {
        //     endIndex = 1 + Math.floor((19 - this.ringNumStr.length) / 2);
        //     // this.ringTaskTxt.text = this.ringTaskTxt.text.slice(0, endIndex) + "...";
        //     this.ringTaskTxt.text = this.ringTaskTxt.text + "...";
        // }
      } else if (this._vdata instanceof BaseOfferReward) {
        if (descTxt.length * 2 + progressStr.length > 21 * 2) {
          endIndex = 1 + Math.floor((21 - progressStr.length) / 2);
          // this.ringTaskTxt.text = descTxt.slice(0, endIndex*2) + "..." + progressStr;
          // this.ringTaskTxt.text = descTxt + "..." + progressStr;
          this.ringTaskTxt.text = descTxt + " " + progressStr;
        }
      } else {
        if (this._vdata.TemplateType == TaskType.TASK_MAIN) {
          //主线
          this.typeTxt.color = this.ringTaskTxt.color =
            ColorConstant.GOLD_COLOR;
        }
        if (this._vdata.TemplateId != 761) {
          // if (descTxt.length * 2 + progressStr.length > 26*2) {
          //     endIndex = Math.floor((26 - progressStr.length) / 2);
          // this.ringTaskTxt.text = descTxt.slice(0, endIndex*2) + "..." + progressStr;
          this.ringTaskTxt.text = descTxt + " " + progressStr;
          // }
        }
      }
    }
  }

  public startBlink(time: number = 1) {
    TweenMax.killTweensOf(this.Img_Shine);
    this.Img_Shine.alpha = 1;
    this.Img_Shine.visible = true;
    TweenMax.to(this.Img_Shine, 0.5, {
      alpha: 0,
      yoyo: true,
      repeat: time,
      onComplete: () => {
        TweenMax.killTweensOf(this.Img_Shine);
        this.Img_Shine.visible = false;
      },
    });
  }

  public stopBlink() {
    this.Img_Shine.alpha = 1;
    this.Img_Shine.visible = false;
    TweenMax.killTweensOf(this.Img_Shine);
  }

  public dispose() {
    this.clean();
    this._vdata = null;
    this.removeEvent();
    TweenMax.killTweensOf(this.Img_Shine);
    ObjectUtils.disposeAllChildren(this);
    super.dispose();
  }
}
