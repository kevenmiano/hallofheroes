import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceManager from "../../map/space/SpaceManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import LangManager from "../../../core/lang/LangManager";
import { ArmyManager } from "../../manager/ArmyManager";
import RingTaskManager from "../../manager/RingTaskManager";
import { DialogOptionItem } from "./DialogOptionItem";
import AudioManager from "../../../core/audio/AudioManager";
import { SoundIds } from "../../constant/SoundIds";
import { RingTask } from "../ringtask/RingTask";
import { RewardConditionType } from "../../constant/RewardConditionType";
import { TaskTemplate } from "../task/TaskTemplate";
import { TaskManage } from "../../manager/TaskManage";
import { RingTaskEvent } from "../../constant/event/NotificationEvent";
import TreasureMapManager from "../../manager/TreasureMapManager";
import { t_s_questcondictionData } from "../../config/t_s_questcondiction";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { t_s_rewardcondictionData } from "../../config/t_s_rewardcondiction";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_campaignData } from "../../config/t_s_campaign";
import { ConfigManager } from "../../manager/ConfigManager";
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
import DialogOptionItemTwo from "./data/DialogOptionItemTwo";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import DialogItemInfo from "./data/DialogItemInfo";
import Utils from "../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/24 15:45
 * @ver 1.0
 *
 */
export class SpaceDialogWnd extends BaseWindow {
  public npcView: fgui.GLoader;
  public img_left: fgui.GImage;
  public img_right: fgui.GImage;
  public list: fgui.GList;
  public npcName: fgui.GTextField;
  public content: fgui.GTextField;
  public closebtn: fgui.GRichTextField;
  public rewardLookBtn: fgui.GButton;
  public click_rect: fgui.GComponent;
  public bg: fgui.GImage;
  public list1: fgui.GList;
  private _nodeInfo: SpaceNode;
  protected resizeContent: boolean = true;
  private typeArr: Array<number> = [2, 3, 5, 8, 9, 10, 13, 14, 101, 200];
  private _list1Data: Array<DialogItemInfo> = [];
  private _listData: Array<DialogItemInfo> = [];
  private initData() {
    this._nodeInfo = SpaceManager.Instance.model.selectNode;
  }

  private initView() {
    if (!this._nodeInfo) {
      this.OnBtnClose();
      return;
    }
    this.npcView.url = IconFactory.getNPCIcon(this._nodeInfo.nodeId);
    this.npcName.text = this._nodeInfo.info.names;
    this.content.text = this._nodeInfo.dialogue;

    if (
      this._nodeInfo.nodeId == 17 &&
      ArmyManager.Instance.thane.grades >= 35
    ) {
      //环任务
      this.rewardLookBtn.visible = true;
    } else {
      this.rewardLookBtn.visible = false;
    }
  }

  private initOptions() {
    if (!this._nodeInfo) {
      return;
    }
    this._list1Data = [];
    this._listData = [];
    this.list.numItems = 0;
    this.list1.numItems = 0;
    let ringTask: RingTask = RingTaskManager.Instance.getRingTask();
    if (this._nodeInfo.nodeId == 17 && ringTask) {
      this.changeDialogContext(null, false);
      this.rewardLookBtn.visible = false;
    }
    if (this._nodeInfo.param3) {
      let options: any[] = this._nodeInfo.param3.split("|");
      let params: any[] = this._nodeInfo.param4.split("|");
      let talkContents: any[];
      if (this._nodeInfo.param5) {
        talkContents = this._nodeInfo.param5.split("$");
      }

      if (
        RingTaskManager.Instance.getRingTaskType() ==
        RewardConditionType.TALKTASK
      ) {
        if (
          this._nodeInfo.nodeId == RingTaskManager.Instance.getTalkTaskNPCNode()
        ) {
          //跑环对话任务 完成NPC
          let str: string =
            "11," +
            LangManager.Instance.GetTranslation(
              "map.space.view.frame.SpaceDialogFrame.RingTask",
            ) +
            ",35";
          options.push(str);
        }
      }
      for (let i: number = 0; i < options.length; i++) {
        let nextStep: Function = null;
        let p: any = this.stringToObject(options[i]);
        if (params[i]) {
          p.optionParam = parseInt(params[i]);
        }

        if (p.optionType == DialogOptionItem.STORY_TASK) {
          nextStep = this.storyTaskNextStep.bind(this);

          p.taskId = parseInt(params[i]);
          if (talkContents && talkContents[i]) {
            p.dialogues = talkContents[i].split("|");
            p.totalStep = p.dialogues.length;
          } else {
            p.dialogues = [];
            p.totalStep = 0;
          }
          p.currentStep = 0;

          let task: TaskTemplate = TaskManage.Instance.getTaskByID(p.taskId);
          if (!task) {
            continue;
          }
          if (TaskManage.Instance.cate.hasTask(task)) {
            if (task.isCompleted) {
              //接取,已完成
              continue;
            } else {
              //接取,进行中
              p.optionTitle += LangManager.Instance.GetTranslation(
                "YiShi.mainBar.view.TaskTraceItem.Doing",
              );
            }
          } else {
            //没接取
            if (!TaskManage.Instance.isAvailableTask(task)) {
              continue;
            }
          }
        } else if (p.optionType == DialogOptionItem.RING_TASK) {
          RingTaskManager.Instance.addEventListener(
            RingTaskEvent.COMPLETETASK,
            this.ringTaskCompleteHandler,
            this,
          );
          nextStep = this.changeDialogContext.bind(this);
          p.optionParam = -1;
          if (this._nodeInfo.nodeId == 17 && ringTask) {
            continue;
          }
        } else if (p.optionType == DialogOptionItem.TREASURE_MAP) {
          TreasureMapManager.Instance.model.updateVipReward();
          p.optionTitle = LangManager.Instance.GetTranslation(
            "map.space.view.frame.SpaceDialogFrame.TreasureMapRewardTipsTxt",
            p.optionTitle,
          );
        } else {
          nextStep = this.closeDialog.bind(this);
        }
        if (this._nodeInfo.nodeId == 17) {
          p.optionParam = 17;
        }
        let dialogItemInfo: DialogItemInfo = new DialogItemInfo();
        dialogItemInfo.type = p.optionType;
        dialogItemInfo.title = p.optionTitle;
        dialogItemInfo.level = p.optionLevel;
        dialogItemInfo.param = p.optionParam;
        dialogItemInfo.nextStep = nextStep;
        dialogItemInfo.nextStepParam = p;
        if (this.typeArr.indexOf(p.optionType) != -1) {
          this._listData.push(dialogItemInfo);
          this.list.numItems = this._listData.length;
          this.list.resizeToFit();
        } else {
          this._list1Data.push(dialogItemInfo);
          this.list1.numItems = this._list1Data.length;
          this.list1.resizeToFit();
        }
      }
    }
  }

  private stringToObject(str: string): object {
    let p: any = {
      optionType: 0,
      optionTitle: "",
      optionLevel: 0,
      optionParam: 0,
    };
    if (!str) {
      return p;
    }
    let optionParams: any[];
    optionParams = str.split(",");
    if (optionParams[0]) {
      p.optionType = parseInt(optionParams[0]);
    }
    if (optionParams[1]) {
      p.optionTitle = String(optionParams[1]);
    }
    if (optionParams[2]) {
      p.optionLevel = parseInt(optionParams[2]);
    }
    return p;
  }

  private closeDialog(param?: object) {
    this.OnBtnClose();
  }

  private onClickBg() {
    this.OnBtnClose();
  }

  private storyTaskNextStep(param: any) {
    this.rewardLookBtn.visible = false;

    RingTaskManager.Instance.removeEventListener(
      RingTaskEvent.COMPLETETASK,
      this.ringTaskCompleteHandler,
      this,
    );
    let task: TaskTemplate = TaskManage.Instance.getTaskByID(param.taskId);
    if (param.currentStep >= param.totalStep) {
      if (task && !task.isCompleted) {
        let conds: any[] = task.conditionList;
        let flag: boolean = true;
        for (let i: number = 0; i < conds.length; i++) {
          let cond: t_s_questcondictionData = conds[i];
          if (cond.CondictionType == 85) {
            task.finishStory = true;
            task.commit();
            flag = false;
            break;
          }
        }

        if (flag) {
          SwitchPageHelp.skipPageByTaskCondictionType(task, null, null);
        }
      }
      this.closeDialog();
    } else {
      let contents: any[] = param.dialogues[param.currentStep].split("#");
      this.resetFrame(
        contents[0],
        contents[1],
        this.storyTaskNextStep.bind(this),
        param,
      );
      param.currentStep++;
      let hasTask: boolean = TaskManage.Instance.cate.hasTask(task);
      if (!hasTask && param.currentStep == param.totalStep) {
        TaskManage.Instance.requestAcceptTask(task);
      }
    }
  }

  private changeDialogContext(param: object = null, b: boolean = true) {
    this.rewardLookBtn.visible = false;
    let nodeId: number = RingTaskManager.Instance.getTalkTaskNPCNode(); //获取当前环任务中对话任务的NPC_ID;
    this.list.numItems = 0;
    this.list1.numItems = 0;
    this._list1Data = [];
    let dialogItemInfo: DialogItemInfo = new DialogItemInfo();
    if (nodeId == this._nodeInfo.nodeId) {
      this.content.text = LangManager.Instance.GetTranslation(
        "map.space.view.frame.SpaceDialogFrame.talkTask02",
      );
      dialogItemInfo.type = DialogOptionItem.COMPONENT_TASK;
      dialogItemInfo.title = LangManager.Instance.GetTranslation(
        "map.space.view.frame.SpaceDialogFrame.RingTask.completeTask",
      );
      this._list1Data.push(dialogItemInfo);
      this.list1.numItems = this._list1Data.length;
      this.list1.resizeToFit();
    } else {
      let condition: t_s_rewardcondictionData =
        RingTaskManager.Instance.getCurrCondition();
      this.content.text = this.getRingTaskTalkContent();
      // if (condition.CondictionType == RewardConditionType.TALKTASK) {
      dialogItemInfo.type = 12;
      dialogItemInfo.title = LangManager.Instance.GetTranslation(
        "map.space.view.frame.SpaceDialogFrame.RingTask.goto",
      );
      dialogItemInfo.level = 35;
      dialogItemInfo.param = nodeId;
      this._list1Data.push(dialogItemInfo);
      this.list1.numItems = this._list1Data.length;
      this.list1.resizeToFit();
      // }
    }
  }

  private getRingTaskTalkContent(): string {
    let content: string = "";
    let ringTask: RingTask = RingTaskManager.Instance.getRingTask();
    let condition: t_s_rewardcondictionData =
      RingTaskManager.Instance.getCurrCondition();
    if (condition.CondictionType == RewardConditionType.COMMITITEM) {
      content = condition.Para5Lang;
      let shopName: string = "";
      switch (ringTask.currTask.condition_2) {
        case ShopGoodsInfo.CONSORTIA_SHOP:
          shopName = LangManager.Instance.GetTranslation("public.consortia");
          break;
        case ShopGoodsInfo.ATHLETICS_SHOP:
          shopName = LangManager.Instance.GetTranslation(
            "map.space.view.frame.SpaceDialogFrame.pvp",
          );
          break;
        case ShopGoodsInfo.MAZE_SHOP:
          shopName = LangManager.Instance.GetTranslation(
            "map.space.view.frame.SpaceDialogFrame.Maze",
          );
          break;
      }
      content = content.replace("{1}", shopName);
      let itemName: string = "";
      if (ringTask.currTask.condition_3 > 0) {
        //物品ID
        //根据物品的templeteID 取得物品的名称
        let goodstempleteInfo: t_s_itemtemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_itemtemplate,
            ringTask.currTask.condition_3,
          );
        itemName = goodstempleteInfo.TemplateNameLang;
      }
      content = content.replace("{0}", itemName);
    } else if (
      condition.CondictionType == RewardConditionType.KILLDUPLICATEMONSTER
    ) {
      let str: string = LangManager.Instance.GetTranslation(
        "map.space.view.frame.SpaceDialogFrame.killMonster",
      );
      let _campaignTemp: t_s_campaignData =
        TempleteManager.Instance.getCampaignTemplateByID(
          ringTask.currTask.condition_2,
        );
      str = str.replace("{0}", _campaignTemp.CampaignNameLang);
      str = str.replace("{2}", ringTask.currTask.condition_4.toString());
      content = str;
    } else {
      let temp: t_s_rewardcondictionData =
        RingTaskManager.Instance.getCurrCondition();
      content = temp.Para5Lang;
    }
    return content;
  }

  private ringTaskCompleteHandler() {
    this.OnBtnClose();
  }

  private resetFrame(
    txt: string,
    opString: string,
    callFun: Function,
    param: object,
  ) {
    this.content.text = txt;
    this.list.numItems = 0;
    this.list1.numItems = 0;
    this._list1Data = [];
    let dialogItemInfo: DialogItemInfo = new DialogItemInfo();
    dialogItemInfo.type = 7;
    dialogItemInfo.title = opString;
    dialogItemInfo.level = 0;
    dialogItemInfo.param = 0;
    dialogItemInfo.nextStep = callFun;
    dialogItemInfo.nextStepParam = param;
    this._list1Data.push(dialogItemInfo);
    this.list1.numItems = this._list1Data.length;
    this.list1.resizeToFit();
  }

  public OnInitWind() {
    super.OnInitWind();
  }

  public OnShowWind() {
    super.OnShowWind();
    this.initData();
    this.initView();
    this.addEvent();
    this.initOptions();
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    Laya.timer.once(500, this, () => {
      if (!this.destroyed && this.contentPane && !this.contentPane.isDisposed) {
        this.click_rect.onClick(this, this.onClickBg);
      }
    });
  }

  public OnHideWind() {
    this.click_rect.offClick(this, this.onClickBg);
    SpaceManager.Instance.setNpcBeingVisit(false);
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    RingTaskManager.Instance.removeEventListener(
      RingTaskEvent.COMPLETETASK,
      this.ringTaskCompleteHandler,
      this,
    );
    this.removeEvent();
    super.dispose(dispose);
  }

  private addEvent() {
    if (this.rewardLookBtn)
      this.rewardLookBtn.onClick(this, this.rewardLookBtnHandler);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list1.itemRenderer = Laya.Handler.create(
      this,
      this.renderList1Item,
      null,
      false,
    );
  }

  private removeEvent() {
    if (this.rewardLookBtn)
      this.rewardLookBtn.offClick(this, this.rewardLookBtnHandler);
    Utils.clearGListHandle(this.list);
    Utils.clearGListHandle(this.list1);
  }

  private renderListItem(index: number, item: DialogOptionItem) {
    if (item && !item.isDisposed) {
      item.info = this._listData[index];
    }
  }

  private renderList1Item(index: number, item: DialogOptionItemTwo) {
    if (item && !item.isDisposed) {
      item.info = this._list1Data[index];
    }
  }

  private rewardLookBtnHandler() {
    FrameCtrlManager.Instance.open(EmWindow.RingTaskRewardWnd);
  }

  private addToList(optionItem: DialogOptionItem) {
    if (this.list && this.list.displayObject) {
      this.list.addChild(optionItem);
      this.list.resizeToFit();
    }
    if (
      !ConfigManager.info.SYS_OPEN &&
      this._nodeInfo.nodeId == SpaceNodeType.PET_CAMPAIGN
    ) {
      this.list.visible = false;
    } else {
      this.list.visible = true;
    }
  }

  private addToList1(optionItem: DialogOptionItemTwo) {
    if (this.list1 && this.list.displayObject) {
      this.list1.addChild(optionItem);
      this.list.resizeToFit();
    }
    if (
      !ConfigManager.info.SYS_OPEN &&
      this._nodeInfo.nodeId == SpaceNodeType.PET_CAMPAIGN
    ) {
      this.list1.visible = false;
    } else {
      this.list1.visible = true;
    }
  }
}
