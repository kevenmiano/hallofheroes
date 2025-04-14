//@ts-expect-error: External dependencies
import AudioManager from "../../../core/audio/AudioManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import StringHelper from "../../../core/utils/StringHelper";
import Utils from "../../../core/utils/Utils";
import { BattleManager } from "../../battle/BattleManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_campaignData } from "../../config/t_s_campaign";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_questcondictionData } from "../../config/t_s_questcondiction";
import { t_s_questgoodData } from "../../config/t_s_questgood";
import { t_s_rewardcondictionData } from "../../config/t_s_rewardcondiction";
import { t_s_rewardgoodData } from "../../config/t_s_rewardgood";
import { ConfigType } from "../../constant/ConfigDefine";
import { RewardConditionType } from "../../constant/RewardConditionType";
import { SoundIds } from "../../constant/SoundIds";
import { TaskConditionType } from "../../constant/TaskConditionType";
import { TaskType } from "../../constant/TaskType";
import { EmWindow } from "../../constant/UIDefine";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import {
  RewardEvent,
  RingTaskEvent,
  TaskEvent,
} from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { KingContractManager } from "../../manager/KingContractManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import RingTaskManager from "../../manager/RingTaskManager";
import { SharedManager } from "../../manager/SharedManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TaskManage } from "../../manager/TaskManage";
import { TempleteManager } from "../../manager/TempleteManager";
import { VIPManager } from "../../manager/VIPManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { StringUtil } from "../../utils/StringUtil";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { KingContractInfo } from "../kingcontract/KingContractInfo";
import BaseOfferReward from "../offerReward/BaseOfferReward";
import OfferRewardTemplate from "../offerReward/OfferRewardTemplate";
import { RingTask } from "../ringtask/RingTask";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import ConditionContentItem from "./ConditionContentItem";
import SelectTaskItemData from "./SelectTaskItemData";
import TaskCategory from "./TaskCategory";
import TaskCtrl from "./TaskCtrl";
import { eSelectTaskItemType } from "./TaskData";
import TaskPhoneView from "./TaskPhoneView";
import TaskRewardItem from "./TaskRewardItem";
import { TaskTemplate } from "./TaskTemplate";

export default class TaskWnd extends BaseWindow {
  private tree: fgui.GTree;
  private ConditionTitleTxt: fgui.GLabel;
  private ConditionContentTxt: fgui.GLabel;
  private DescribleTitleTxt: fgui.GLabel;
  private DescribleContentTxt: fgui.GLabel;
  private RewardTitleTxt: fgui.GLabel;
  private ConditionTitleTxt2: fgui.GLabel;
  private ConditionContentTxt2: fgui.GLabel;
  private Btn_giveup: UIButton;
  private Btn_getreward: UIButton;
  private Btn_limitcomplete: UIButton;
  private Btn_campaign: UIButton;
  private Btn_goArrest: UIButton;
  private Btn_startPlay: UIButton;
  private Btn_immediatelyWent: UIButton;
  private _fTreeNodeList: fgui.GTreeNode[] = [];
  private _sTreeNodeList: fgui.GTreeNode[] = [];
  private _rightRewardData: any;
  private _rightData: any;
  private _baseReward: BaseOfferReward;
  private _ringTask: RingTask;
  private _isRing: boolean = false;
  private rewardList1: fgui.GList = null;
  private rewardList2: fgui.GList = null;
  private info: KingContractInfo;
  private treeData: any;
  private _isRingTask: boolean;
  private nodeData: any;
  private defaultSelectedData: any;
  private taskPhone: TaskPhoneView; //手机任务视图
  private rightReward: any;
  private _rewardList = [
    "RewardPlayGP",
    "RewardGold",
    "RewardConsortiaOffer",
    "RewardPlayerOffer",
  ];
  private conditionContentList: fgui.GList = null;
  private _conditionContentArr: Array<any> = [];
  public OnInitWind() {
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.tree.on(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);
    this.tree.treeNodeRender = Laya.Handler.create(
      this,
      this.renderTreeNode,
      null,
      false,
    );
    this.conditionContentList.itemRenderer = Laya.Handler.create(
      this,
      this.renderConditionContentList,
      null,
      false,
    );
    this.treeData = this.model.getTreeData();
    this.initTreeData(this.treeData[0]);
    this.ConditionTitleTxt.text = LangManager.Instance.GetTranslation(
      "TaskWnd.ConditionTitleTxt",
    );
    this.DescribleTitleTxt.text = LangManager.Instance.GetTranslation(
      "TaskWnd.DescribleTitleTxt",
    );
    this.RewardTitleTxt.text = LangManager.Instance.GetTranslation(
      "TaskWnd.RewardTitleTxt",
    );
    this.info = KingContractManager.Instance.model.getInfoById(2);
    this.addEvent();
    this.defaultSelectedData = this.params.frameData;
    if (this.defaultSelectedData) {
      let type: number;
      let templateId: number;
      if (this.defaultSelectedData instanceof TaskTemplate) {
        type = this.defaultSelectedData.TemplateType;
        templateId = this.defaultSelectedData.TemplateId;
      } else {
        type = 100;
      }
      for (let index = 0; index < this._fTreeNodeList.length; index++) {
        let sTreeNode = this._fTreeNodeList[index];
        if (sTreeNode && sTreeNode.data && sTreeNode.data.taskType == type) {
          for (let i: number = 0; i < sTreeNode.numChildren; i++) {
            let sNode: fgui.GTreeNode = sTreeNode.getChildAt(i);
            if (sNode.data.TemplateId == templateId) {
              this.tree.selectNode(sNode);
              this._rightData = sNode.data;
              this.refreshRight(sNode.data);
              this.tree.scrollToView(this.tree.getChildIndex(sTreeNode._cell));
              break;
            }
          }
        }
      }
    } else {
      this.defaultView();
    }
  }

  OnHideWind() {
    super.OnHideWind();
    this.tree.off(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);
    this.removeEvent();
  }

  private addEvent() {
    this.Btn_getreward.onClick(this, this.__getRewardHandler.bind(this));
    this.Btn_limitcomplete.onClick(this, this.__completeNowHandler.bind(this));
    this.Btn_campaign.onClick(this, this.__enterCampainHandler.bind(this));
    this.Btn_startPlay.onClick(this, this.__onStartPlayClick.bind(this));
    this.Btn_goArrest.onClick(this, this.__onGoArrestClick.bind(this));
    this.Btn_giveup.onClick(this, this.__onRemoveRewardTaskClick.bind(this));
    this.Btn_immediatelyWent.onClick(this, this.__onImmediateClick.bind(this));

    this.cate.addEventListener(TaskEvent.TASK_ADDED, this.__addHandler, this);
    this.cate.addEventListener(TaskEvent.TASK_REMOVE, this.__addHandler, this);
    OfferRewardManager.Instance.addEventListener(
      RewardEvent.REWARD_TASK_ADD,
      this.__addHandler,
      this,
    );
    OfferRewardManager.Instance.addEventListener(
      RewardEvent.REWARD_TASK_FINISH,
      this.__addHandler,
      this,
    );
    this.ringTaskManager.addEventListener(
      RingTaskEvent.REFRESHRING,
      this.__addHandler,
      this,
    );
    OfferRewardManager.Instance.addEventListener(
      RewardEvent.REWARD_TASK_UPDATE,
      this.__updateRewardTaskHandler,
      this,
    );
    TaskManage.Instance.addEventListener(
      TaskEvent.TASK_DETAIL_CHANGE,
      this.__updateRewardTaskHandler,
      this,
    );
  }

  private removeEvent() {
    this.Btn_getreward.offClick(this, this.__getRewardHandler.bind(this));
    this.Btn_limitcomplete.offClick(this, this.__completeNowHandler.bind(this));
    this.Btn_campaign.offClick(this, this.__enterCampainHandler.bind(this));
    this.Btn_startPlay.offClick(this, this.__onStartPlayClick.bind(this));
    this.Btn_goArrest.offClick(this, this.__onGoArrestClick.bind(this));
    this.Btn_giveup.offClick(this, this.__onRemoveRewardTaskClick.bind(this));
    this.Btn_immediatelyWent.offClick(this, this.__onImmediateClick.bind(this));
    this.tree.off(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);
    // this.tree.treeNodeRender.recover();
    Utils.clearGListHandle(this.tree);

    this.cate.removeEventListener(
      TaskEvent.TASK_ADDED,
      this.__addHandler,
      this,
    );
    this.cate.removeEventListener(
      TaskEvent.TASK_REMOVE,
      this.__addHandler,
      this,
    );
    OfferRewardManager.Instance.removeEventListener(
      RewardEvent.REWARD_TASK_ADD,
      this.__addHandler,
      this,
    );
    OfferRewardManager.Instance.removeEventListener(
      RewardEvent.REWARD_TASK_FINISH,
      this.__addHandler,
      this,
    );
    this.ringTaskManager.removeEventListener(
      RingTaskEvent.REFRESHRING,
      this.__addHandler,
      this,
    );
    OfferRewardManager.Instance.removeEventListener(
      RewardEvent.REWARD_TASK_UPDATE,
      this.__updateRewardTaskHandler,
      this,
    );
    TaskManage.Instance.removeEventListener(
      TaskEvent.TASK_DETAIL_CHANGE,
      this.__updateRewardTaskHandler,
      this,
    );
  }

  renderTreeNode(node: fgui.GTreeNode, obj: fgui.GComponent) {
    if (!node || node.cell.isDisposed || obj.isDisposed) return;
    let data = node.data;
    if (node.data && node.data.type == eSelectTaskItemType.FirstItem) {
      let taskType: number = data.taskType;
      obj.getChild("TypeIcon0").visible = false;
      obj.getChild("TypeIcon1").visible = false;
      obj.getChild("TypeIcon2").visible = false;
      obj.getChild("TypeIcon3").visible = false;
      obj.getChild("TypeIcon4").visible = false;
      obj.getChild("TypeIcon-2").visible = false;
      if (taskType == TaskType.BACK_PLAYER) {
        obj.getChild("TypeIcon0").visible = true;
      } else if (taskType == TaskType.OFFER_REWARD) {
        obj.getChild("TypeIcon4").visible = true;
      } else {
        obj.getChild("TypeIcon" + taskType).visible = true;
      }

      obj.getChild("TaskTitleTxt").text = data.titleName;
    } else {
      let isComplete: boolean;
      obj.getChild("Img_type1").visible = false;
      obj.getChild("Img_type2").visible = false;
      obj.getChild("Img_type3").visible = false;
      if (data instanceof BaseOfferReward || data instanceof RingTask) {
        isComplete = data.isCompleted;
      } else {
        isComplete =
          data.taskInfo && data.isCompleted && data.taskInfo.isSelect;
      }
      if (isComplete) {
        obj.getChild("Img_type1").visible = true;
      } else if (data["isNew"]) {
        obj.getChild("Img_type2").visible = true;
      } else if (data instanceof TaskTemplate) {
        for (const key in data.conditionList) {
          if (Object.prototype.hasOwnProperty.call(data.conditionList, key)) {
            let con2: t_s_questcondictionData = data.conditionList[key];
            if (con2.CondictionType == TaskConditionType.PHONE_CHECK) {
              obj.getChild("Img_type3").visible = true;
            }
          }
        }
      }
      obj.getChild("TaskItemTxt").text = data.TitleLang;
    }
  }

  private defaultView(type: number = -1) {
    var hasSet: boolean = false;
    var selectMenuType: number = 0;
    if (type == -1) {
      var list: any[] = TaskManage.Instance.getCompletedList();
      if (this.rewardManager.completedRewardList.length > 0)
        list = list.concat(this.rewardManager.completedRewardList);
      list = ArrayUtils.sortOn(
        list,
        ["isCompleted", "Sort"],
        [ArrayConstant.DESCENDING, ArrayConstant.NUMERIC],
      );
      var isVipAndNoExpirt: boolean =
        VIPManager.Instance.model.vipInfo.IsVipAndNoExpirt;
      var info: object;
      for (let i: number = 0; i < list.length; i++) {
        info = list[0];
        if (
          info instanceof TaskTemplate &&
          info["TemplateType"] == TaskType.VIP_TASK &&
          !isVipAndNoExpirt
        )
          continue;
        if (info instanceof BaseOfferReward) selectMenuType = 100;
        else selectMenuType = (info as TaskTemplate).TemplateType;
        hasSet = true;
      }
    } else {
      selectMenuType = type;
      hasSet = true;
    }
    for (let j = 0; j < this.model.taskTypeList.length; j++) {
      let taskType = this.model.taskTypeList[j];
      if (!hasSet) {
        selectMenuType = taskType;
        hasSet = true;
      }
    }
    for (let index = 0; index < this._fTreeNodeList.length; index++) {
      let sTreeNode = this._fTreeNodeList[index];
      if (
        sTreeNode &&
        sTreeNode.data &&
        sTreeNode.data.taskType == selectMenuType
      ) {
        for (let i: number = 0; i < sTreeNode.numChildren; i++) {
          let sNode: fgui.GTreeNode = sTreeNode.getChildAt(0);
          this.tree.selectNode(sNode);
          this._rightData = sNode.data;
          this.refreshRight(sNode.data);
          this.tree.scrollToView(this.tree.getChildIndex(sTreeNode._cell));
          break;
        }
      }
    }
  }

  private setMobileToTop(arr: any[], index: number) {
    var indexNotCompleted: number; //第一个未完成的任务位置
    for (var i: number = 0; i < arr.length; i++) {
      if (arr[i].isCompleted == false) {
        indexNotCompleted = i;
        break;
      }
    }
    var mobileTem: TaskTemplate = arr[index] as TaskTemplate;
    arr.splice(index, 1);
    if (mobileTem.isCompleted == false) {
      arr.splice(indexNotCompleted, 0, mobileTem);
    } else {
      arr.splice(0, 0, mobileTem);
    }
  }

  private initTreeData(firstData: SelectTaskItemData[]) {
    while (this.tree.rootNode.numChildren > 0) {
      this.tree.rootNode.removeChildAt(0);
      this._fTreeNodeList = [];
      this._sTreeNodeList = [];
    }
    for (let index = 0; index < firstData.length; index++) {
      let topNode: fgui.GTreeNode = new fgui.GTreeNode(true);
      let selectTaskItemData: SelectTaskItemData = firstData[index];
      topNode._resURL = fgui.UIPackage.getItemURL(EmWindow.TaskWnd, "TabTree3");
      topNode.data = selectTaskItemData;
      this.tree.rootNode.addChild(topNode);
      this._fTreeNodeList.push(topNode);
      let sData: Array<any> = TaskManage.Instance.cate.getListByType(
        selectTaskItemData.taskType,
      );
      sData = ArrayUtils.sortOn(
        sData,
        ["isCompleted", "Sort"],
        [ArrayConstant.DESCENDING, ArrayConstant.NUMERIC],
      );
      for (var j: number = 0; j < sData.length; j++) {
        if (
          sData[j].conditionList[0] instanceof t_s_questcondictionData ==
          false
        )
          continue;
        for (let m: number = 0; m < sData[j].conditionList.length; m++) {
          var con: t_s_questcondictionData = sData[j].conditionList[m];
          if (con.CondictionType == TaskConditionType.PHONE_CHECK) {
            this.setMobileToTop(sData, j);
          }
        }
      }
      for (let i: number = 0; i < sData.length; i++) {
        let sNode: fgui.GTreeNode = new fgui.GTreeNode(false);
        sNode._resURL = fgui.UIPackage.getItemURL(
          EmWindow.TaskWnd,
          "TaskItemInfo",
        );
        sNode.data = sData[i];
        topNode.addChild(sNode);
        this._sTreeNodeList.push(sNode);
      }
    }
  }

  private onClickTreeItem(itemObject: fgui.GObject) {
    let treeNode: fgui.GTreeNode = itemObject.treeNode;
    let itemData = treeNode.data;
    AudioManager.Instance.playSound(SoundIds.CAMPAIGN_CLICK_SOUND);
    let model = this.model;
    if (itemData.type == eSelectTaskItemType.FirstItem) {
      for (let index = 0; index < this._fTreeNodeList.length; index++) {
        let element = this._fTreeNodeList[index];
        if (element && element != treeNode) {
          this.tree.collapseAll(element);
        }
        if (treeNode && treeNode.data.taskType == TaskType.RING_TASK) {
          this._isRingTask = true;
        } else {
          this._isRingTask = false;
        }
      }
    } else {
      model.selectedData = itemData;
      if (model.selectedData instanceof TaskTemplate)
        model.selectedData["isNew"] = false;
      this._rightData = model.selectedData;
      this.refreshRight(model.selectedData);
      itemObject.asCom.getChild("Img_type2").asImage.visible = false;
    }
  }

  refreshRight(data: any) {
    this.nodeData = data;
    this.refreshTargetView(data); //任务目标
    this.refreshDescribeView(data);
    this.refreshRewardView(data);
    this.refreshButton(data);
  }

  private refreshTargetView(data: any) {
    this.ConditionTitleTxt2.text = "";
    if (data instanceof TaskTemplate) {
      this._rightRewardData = data;
    } else if (data instanceof BaseOfferReward) {
      this._baseReward = data;
      this._rightRewardData = this._baseReward.rewardTemp;
    } else if (data instanceof RingTask) {
      if (data.ringTaskTemp.Type != 3) {
        this.ConditionTitleTxt2.text = LangManager.Instance.GetTranslation(
          "task.view.TaskTargetViewII.ringTaskNum",
          RingTaskManager.Instance.model.rewardNum,
        );
      }
      this._ringTask = <RingTask>data;
      this._rightRewardData = this._ringTask;
    }
    this.refreshCondition();
  }

  renderConditionContentList(index: number, item: ConditionContentItem) {
    if (!item) return;
    item.info = this._conditionContentArr[index];
  }

  private refreshCondition() {
    if (!this._rightData) return;
    let progress: any[] = [];
    progress = this._rightData.getProgress();
    this._conditionContentArr = [];
    let ConditionContentTxt2: string;
    let ConditionContentTxt: string;
    for (let i: number = 0; i < this._rightData.conditionList.length; i++) {
      let condition: any = this._rightData.conditionList[i];
      let title: string = condition.CondictionTitleLang;
      if (this._rightData instanceof TaskTemplate) {
        ConditionContentTxt2 = progress[i].toString();
      } else if (this._rightData instanceof RingTask) {
        if (this._isRingTask) {
          if (this._ringTask.ringTaskTemp.Type == 3) {
            let num: number = RingTaskManager.Instance.model.rewardNum - 1;
            let str: string =
              num +
              " " +
              LangManager.Instance.GetTranslation(
                "ui.tasktracebar.view.ringTaskNum",
              );
            ConditionContentTxt2 = str;
          } else {
            ConditionContentTxt2 = progress[i].toString();
            let ringCondition: t_s_rewardcondictionData =
              RingTaskManager.Instance.getCurrCondition();
            let ringtask: RingTask = RingTaskManager.Instance.getRingTask();
            switch (ringCondition.CondictionType) {
              case RewardConditionType.COMMITITEM:
                let goodstempleteInfo: t_s_itemtemplateData =
                  ConfigMgr.Instance.getTemplateByID(
                    ConfigType.t_s_itemtemplate,
                    ringtask.currTask.condition_3,
                  );
                let itemName: string = goodstempleteInfo.TemplateNameLang;
                title = title.replace("{0}", itemName);
                break;
              case RewardConditionType.KILLDUPLICATEMONSTER:
                let campaignTemp: t_s_campaignData =
                  TempleteManager.Instance.getCampaignTemplateByID(
                    ringtask.currTask.condition_2,
                  );
                title = title.replace("{0}", campaignTemp.CampaignNameLang);
                break;
            }
          }
        }
      } else if (this._rightData instanceof BaseOfferReward) {
        ConditionContentTxt2 = progress[i].toString();
      }
      ConditionContentTxt = title;
      let conditionData: any = {
        contentTxt: ConditionContentTxt,
        contentTxt2: ConditionContentTxt2,
      };
      this._conditionContentArr.push(conditionData);
    }
    this.conditionContentList.numItems = this._conditionContentArr.length;
  }

  private refreshDescribeView(data: any) {
    this.taskPhone.visible = false;
    if (data instanceof TaskTemplate) {
      for (let i = 0; i < data.conditionList.length; i++) {
        var con: t_s_questcondictionData = data.conditionList[i];
        if (con.CondictionType == TaskConditionType.PHONE_CHECK) {
          this.DescribleContentTxt.text = "";
          this.taskPhone.visible = true;
          this.taskPhone.taskTemp = data;
          break;
        } else {
          this.DescribleContentTxt.text = data.DetailLang; //StringHelper.repHtmlTextToFguiText(data.DetailLang);
        }
      }
    } else if (data instanceof BaseOfferReward) {
      this.DescribleContentTxt.text = data.rewardTemp.DetailLang; //StringHelper.repHtmlTextToFguiText(data.rewardTemp.DetailLang);
    } else if (data instanceof RingTask) {
      var str: string = (data as RingTask).ringTaskTemp.DetailLang;
      var ringCondition: t_s_rewardcondictionData =
        RingTaskManager.Instance.getCurrCondition();
      var ringtask: RingTask = RingTaskManager.Instance.getRingTask();
      if (ringtask) {
        switch (ringCondition.CondictionType) {
          case RewardConditionType.COMMITITEM:
            let goodstempleteInfo: t_s_itemtemplateData =
              ConfigMgr.Instance.getTemplateByID(
                ConfigType.t_s_itemtemplate,
                ringtask.currTask.condition_3,
              );
            var shopName: string;
            switch (ringtask.currTask.condition_2) {
              case ShopGoodsInfo.CONSORTIA_SHOP:
                shopName =
                  LangManager.Instance.GetTranslation("public.consortia") +
                  LangManager.Instance.GetTranslation(
                    "taskwnd.ringtask.titleTxt",
                  );
                break;
              case ShopGoodsInfo.ATHLETICS_SHOP:
                shopName =
                  LangManager.Instance.GetTranslation(
                    "map.space.view.frame.SpaceDialogFrame.pvp",
                  ) +
                  LangManager.Instance.GetTranslation(
                    "taskwnd.ringtask.titleTxt",
                  );
                break;
              case ShopGoodsInfo.MAZE_SHOP:
                shopName =
                  LangManager.Instance.GetTranslation(
                    "map.space.view.frame.SpaceDialogFrame.Maze",
                  ) +
                  LangManager.Instance.GetTranslation(
                    "taskwnd.ringtask.titleTxt",
                  );
                break;
            }
            var itemName: string = goodstempleteInfo.TemplateNameLang;
            str = StringUtil.replace(str, "{0}", itemName);
            str = str.replace("{1}", shopName);
            break;
          case RewardConditionType.KILLDUPLICATEMONSTER:
            let campaignTemp: t_s_campaignData =
              TempleteManager.Instance.getCampaignTemplateByID(
                ringtask.currTask.condition_2,
              );
            str = str.replace("{0}", campaignTemp.CampaignNameLang);
            break;
        }
      }
      this.DescribleContentTxt.text = str;
    }
  }

  private refreshRewardView(data: any) {
    this._isRing = false;
    this.RewardTitleTxt.text = LangManager.Instance.GetTranslation(
      "TaskWnd.RewardTitleTxt",
    );
    if (data instanceof TaskTemplate) {
      this.rightReward = data;
    } else if (data instanceof BaseOfferReward) {
      {
        this._baseReward = data;
        this.rightReward = this._baseReward.rewardTemp;
      }
    } else if (data instanceof RingTask) {
      this._ringTask = data;
      this.rightReward = this._ringTask.ringTaskTemp;
      if (this._ringTask.ringTaskTemp.Type == 3) {
        this.RewardTitleTxt.text = LangManager.Instance.GetTranslation(
          "TaskWnd.RewardTitleTxt2",
        );
        this.getRewardByLevel(this.rightReward);
      }
      this._isRing = true;
    }

    while (this.rewardList1.numChildren > 0) {
      this.rewardList1.removeChildToPoolAt(0);
    }
    while (this.rewardList2.numChildren > 0) {
      this.rewardList2.removeChildToPoolAt(0);
    }
    this.refreshReward();
    this.refreshGoods();
  }

  private getRewardByLevel(_data: any) {
    var grade: number = ArmyManager.Instance.thane.grades;
    if (grade >= 35 && grade < 45) {
      _data["RewardGold"] = 2000 * 200;
      // _data["RewardStrategy"] = 10000 * 200;
    } else if (grade >= 45 && grade < 55) {
      _data["RewardGold"] = 2400 * 200;
      // _data["RewardStrategy"] = 12000 * 200;
    } else if (grade >= 55 && grade < 65) {
      _data["RewardGold"] = 3000 * 200;
      // _data["RewardStrategy"] = 15000 * 200;
    } else if (grade >= 65 && grade < 100) {
      _data["RewardGold"] = 4000 * 200;
      // _data["RewardStrategy"] = 20000 * 200;
    }
  }

  private refreshReward() {
    if (!this.rightReward) return;
    for (var i: number = 0; i < this._rewardList.length; i++) {
      if (
        this.rightReward.hasOwnProperty(this._rewardList[i]) &&
        parseInt(this.rightReward[this._rewardList[i]].toString()) > 0
      ) {
        let currentReward: TaskRewardItem = <TaskRewardItem>(
          this.rewardList1.addItemFromPool()
        );
        currentReward.propertyName = i + 1;
        if (this.rightReward instanceof TaskTemplate) {
          if (this.rightReward.TemplateType == TaskType.TASK_COMMON && i == 0)
            currentReward.propertyValue = (
              parseInt(this.rightReward[this._rewardList[i]].toString()) +
              (this.thane.grades - this._rightData.NeedMinLevel) * 500
            ).toString();
          else
            currentReward.propertyValue = parseInt(
              this.rightReward[this._rewardList[i]],
            ).toString();
        } else if (this.rightReward instanceof OfferRewardTemplate) {
          if (!this._isRing) {
            if (this._baseReward.profile != 5)
              currentReward.propertyValue = parseInt(
                (
                  this.rightReward[this._rewardList[i]] *
                  this._baseReward.profile *
                  this.thane.grades
                ).toString(),
              ).toString();
            else
              currentReward.propertyValue = parseInt(
                (
                  this.rightReward[this._rewardList[i]] *
                  (this._baseReward.profile + 1) *
                  this.thane.grades
                ).toString(),
              ).toString();
          } else {
            currentReward.propertyValue = parseInt(
              this.rightReward[this._rewardList[i]].toString(),
            ).toString();
          }
        }
      }
    }
    this.rewardList1.ensureBoundsCorrect();
  }

  private refreshGoods() {
    var goodList: any[] = this.getTaskGoodList(this.rightReward);
    let goodsInfo: GoodsInfo;
    var len: number = goodList.length;
    for (var i: number = 0; i < len; i++) {
      var good: any = goodList[i];
      goodsInfo = new GoodsInfo();
      var temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        good.RewardItemID,
      );
      if (temp) goodsInfo.templateId = temp.TemplateId;
      let item: BaseItem = <BaseItem>this.rewardList2.addItemFromPool();
      goodsInfo.count = good.RewardItemCount;
      if (this._isRing) {
        if (this._ringTask.ringTaskTemp.Type == 3) {
          switch (i) {
            case 0:
              goodsInfo.count = good.RewardItemCount * 16;
              break;
            case 1:
              goodsInfo.count = good.RewardItemCount * 3;
              break;
            case 2:
              goodsInfo.count = good.RewardItemCount * 1;
              break;
          }
        }
      }
      item.info = goodsInfo;
    }
    this.rewardList2.ensureBoundsCorrect();
    if (this.rewardList1.numChildren <= 0) {
      this.rewardList2.y = 467;
    } else {
      this.rewardList2.y = 509;
    }
  }

  private getTaskGoodList(info: any): any[] {
    if (!info || !info.rewardItemList) return [];
    var list: any[] = info.rewardItemList;
    var arr: any[] = [];
    if (info instanceof TaskTemplate) {
      for (let i: number = 0; i < list.length; i++) {
        var good: t_s_questgoodData = list[i];
        if (
          good.TemplateId == info.TemplateId &&
          good.fitJob(this.thane.templateInfo.Job)
        ) {
          arr.push(good);
        }
      }
    } else if (info instanceof OfferRewardTemplate) {
      if (this._isRing) {
        if (this._ringTask.ringTaskTemp.Type == 3) {
          arr = RingTaskManager.Instance.getAllRingTaskGoodsReward();
          return arr;
        } else {
          arr = RingTaskManager.Instance.getRewardGoodsTemp(this._ringTask);
          return arr;
        }
      }
      for (let i: number = 0; i < list.length; i++) {
        let rewardGood: t_s_rewardgoodData = list[i];
        if (rewardGood.TemplateId == info.TemplateId) {
          arr.push(rewardGood);
        }
      }
    }
    return arr;
  }

  private removeAllBtn() {
    this.Btn_giveup.visible = false;
    this.Btn_getreward.visible = false;
    this.Btn_limitcomplete.visible = false;
    this.Btn_campaign.visible = false;
    this.Btn_goArrest.visible = false;
    this.Btn_startPlay.visible = false;
    this.Btn_immediatelyWent.visible = false;
  }

  private refreshButton(data: any) {
    this.removeAllBtn();
    if (data.isCompleted) {
      this.Btn_getreward.visible = true;
      this.Btn_getreward.enabled = true;
      if (data instanceof BaseOfferReward) {
        this.Btn_giveup.visible = true;
      }
    } else if (data instanceof TaskTemplate) {
      if (data.NeedFightId != 0) {
        this.Btn_campaign.visible = true;
      } else {
        this.Btn_getreward.visible = true;
        this.Btn_getreward.enabled = false;
      }
      for (let i: number = 0; i < data.conditionList.length; i++) {
        let con: t_s_questcondictionData = data.conditionList[i];
        if (con && con.CondictionType == TaskConditionType.CLIENT_DOWN) {
          break;
        } else if (con.CondictionType == 92) {
          this.Btn_campaign.visible = false;
          this.Btn_getreward.visible = false;
          this.Btn_immediatelyWent.visible = true;
          break;
        }
      }
    } else if (data instanceof RingTask) {
      if ((data as RingTask).ringTaskTemp.Type == 3) {
        this.Btn_getreward.visible = false;
        this.Btn_getreward.enabled = false;
        this.Btn_giveup.visible = false;
        this.Btn_limitcomplete.visible = false;
      } else {
        this.Btn_getreward.visible = false;
        this.Btn_getreward.enabled = false;
        this.Btn_giveup.visible = false;
        for (let i: number = 0; i < data.conditionList.length; i++) {
          var ringConditionTemp: t_s_rewardcondictionData =
            data.conditionList[i];
          if (
            ringConditionTemp.CondictionType == RewardConditionType.QTE ||
            ringConditionTemp.CondictionType == RewardConditionType.HAMSTER_GAME
          ) {
            this.Btn_startPlay.visible = true;
            this.Btn_getreward.visible = false;
          }
        }
      }
    } else {
      this.Btn_getreward.visible = true;
      this.Btn_getreward.enabled = false;
      this.Btn_giveup.visible = true;
      for (let i: number = 0; i < data.conditionList.length; i++) {
        var conditionTemp: t_s_rewardcondictionData = data.conditionList[i];
        switch (conditionTemp.CondictionType) {
          case RewardConditionType.COLLECTION:
            this.Btn_campaign.visible = true;
            this.Btn_getreward.visible = false;
            break;
          case RewardConditionType.QTE:
          case RewardConditionType.HAMSTER_GAME:
            this.Btn_startPlay.visible = true;
            this.Btn_getreward.visible = false;
            break;
          case RewardConditionType.ARREST_MONSTER:
          case RewardConditionType.ARREST_HERO:
            this.Btn_goArrest.visible = true;
            this.Btn_getreward.visible = false;
            break;
        }
      }
    }
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get taskControler(): TaskCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.TaskWnd) as TaskCtrl;
  }

  private __getRewardHandler() {
    if (!this._rightData) return;
    if (this._rightData instanceof BaseOfferReward) {
      if (
        this._rightData.isCompleted ||
        VIPManager.Instance.model.isOpenPrivilege(
          VipPrivilegeType.OFFER_REWARD_LIMIT,
          VIPManager.Instance.model.vipInfo.VipGrade,
        )
      ) {
        // NotificationManager.Instance.sendNotification(NewbieEvent.ARROW_STATE, { type: 0, tip: null, taskTempId: this._rightData.rewardID });
        OfferRewardManager.Instance.sendFinishRewardTask(
          this._rightData.rewardID,
        );
      }
      return;
    } else if (this._rightData instanceof RingTask) {
      if (this._rightData.isCompleted) {
        // NotificationManager.Instance.sendNotification(NewbieEvent.ARROW_STATE, { type: 0, tip: null, taskTempId: this._rightData.currTaskId });
        RingTaskManager.Instance.submitRingTask();
      }
    } else {
      if (this._rightData.isCompleted) {
        // NotificationManager.Instance.sendNotification(NewbieEvent.ARROW_STATE, { type: 0, tip: null, taskTempId: this._rightData.TemplateId });
        this.taskControler.sendGetTaskReward(this._rightData.TemplateId, 0);
      }
    }
  }

  private __completeNowHandler() {
    if (!this._rightData) return;
    if (this._rightData instanceof RingTask) {
      let needAlert: boolean = true;
      let lastSaveFlag: boolean = SharedManager.Instance.completeRingTaskFlag;
      let useBind: boolean = SharedManager.Instance.completeRingTaskUseBind;
      if (lastSaveFlag) {
        needAlert = false;
      }
      let hasGoods: any[] =
        GoodsManager.Instance.getBagGoodsByTemplateId(2131021);
      if (needAlert) {
        let point: number = 0;
        if (hasGoods.length <= 0) {
          point = 10;
        }
        let content: string = LangManager.Instance.GetTranslation(
          "task.TaskFrameII.usePointPrompt",
          point,
        );
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
          content: content,
          point: point,
          backFunction: this.quickSubmit.bind(this),
          closeFunction: null,
        });
      } else {
        let hasMoney: number =
          PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        if (useBind)
          hasMoney =
            PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
        if (hasMoney < 10 && hasGoods.length <= 0) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("Auction.ResultAlert11"),
          );
          return;
        }
        RingTaskManager.Instance.CompletedImmediately(useBind);
      }
    } else {
      if (
        VIPManager.Instance.model.isOpenPrivilege(
          VipPrivilegeType.OFFER_REWARD_LIMIT,
          VIPManager.Instance.model.vipInfo.VipGrade,
        )
      ) {
        //有特权, 直接完成
        OfferRewardManager.Instance.sendFinishRewardTask(
          this._rightData.rewardID,
          true,
        );
      } else {
        //没有特权
        if (!this._rightData) return;
        if (this._rightData.isCompleted) {
          OfferRewardManager.Instance.sendFinishRewardTask(
            this._rightData.rewardID,
            true,
          );
        } else {
          //提示开通特权
          // let needAlert: boolean = this.todayNeedAlertForOpenKingContract;
          // if (needAlert) {
          let needGrade: number =
            VIPManager.Instance.model.getMinGradeHasPrivilege(
              VipPrivilegeType.OFFER_REWARD_LIMIT,
            );
          let content: string = LangManager.Instance.GetTranslation(
            "taskRingItem.speed.AlertTxt",
            needGrade,
          );
          MessageTipManager.Instance.show(content);
          //     let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
          //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, this.showTipResult.bind(this));
          // } else {
          //     RechargeAlertMannager.Instance.openShopRecharge();
          // }
        }
      }
    }
  }

  private showTipResult(ret: boolean, notalert: boolean) {
    if (notalert) {
      SharedManager.Instance.openKingContractAlertDate = new Date();
      SharedManager.Instance.saveOpenKingContractAlertDate();
    }
    if (ret) RechargeAlertMannager.Instance.openShopRecharge();
  }

  private get todayNeedAlertForOpenKingContract(): boolean {
    var needAlert: boolean = true;
    var lastSaveDate: Date = new Date(
      SharedManager.Instance.openKingContractAlertDate,
    );
    if (lastSaveDate) {
      var today: Date = new Date();
      if (
        today.getFullYear() == lastSaveDate.getFullYear() &&
        today.getMonth() == lastSaveDate.getMonth() &&
        today.getDay() == lastSaveDate.getDay()
      ) {
        needAlert = false;
      }
    }
    return needAlert;
  }

  private quickSubmit(b: boolean, flag: boolean) {
    if (b) {
      SharedManager.Instance.completeRingTaskFlag = b;
      SharedManager.Instance.completeRingTaskUseBind = flag;
    }
    let hasMoney: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.point;
    if (flag)
      hasMoney = PlayerManager.Instance.currentPlayerModel.playerInfo.allPoint;
    var hasGoods: GoodsInfo[] =
      GoodsManager.Instance.getBagGoodsByTemplateId(2131021);
    if (hasMoney < 10 && hasGoods.length <= 0) {
      let str: string = LangManager.Instance.GetTranslation(
        "Auction.ResultAlert11",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    RingTaskManager.Instance.CompletedImmediately(flag);
  }

  private __enterCampainHandler() {
    if (!this._rightData) return;
    var str: string;
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      var model: CampaignMapModel = CampaignManager.Instance.mapModel;
      if (WorldBossHelper.checkCrystal(model.mapId))
        str = LangManager.Instance.GetTranslation("task.TaskFrameII.command03");
      else
        str = LangManager.Instance.GetTranslation("task.TaskFrameII.command01");
      MessageTipManager.Instance.show(str);
      return;
    }
    var mapTemp: t_s_campaignData =
      ConfigMgr.Instance.worldBossDic[this._rightData.NeedFightId];
    this.taskControler.sendEnterBattle(mapTemp);
  }

  private __onStartPlayClick() {
    if (this._rightData) {
      switch (this._rightData.conditionList[0].CondictionType) {
        case RewardConditionType.QTE:
          // CheckUIModuleUtil.instance.tryCall(UIModuleTypes.QTE, __showQte);
          break;
        case RewardConditionType.HAMSTER_GAME:
          // CheckUIModuleUtil.instance.tryCall(UIModuleTypes.HAMSTER, __showHamster);
          break;
      }
    }
  }

  private __onGoArrestClick() {
    if (this._rightData) {
      var curScene: string = SceneManager.Instance.currentType;
      switch (curScene) {
        case SceneType.CAMPAIGN_MAP_SCENE:
        case SceneType.BATTLE_SCENE:
        case SceneType.EMPTY_SCENE:
        case SceneType.PVE_ROOM_SCENE:
        case SceneType.PVP_ROOM_SCENE:
          var str: string = LangManager.Instance.GetTranslation(
            "task.TaskFrameII.command02",
          );
          MessageTipManager.Instance.show(str);
          return;
        case SceneType.SPACE_SCENE:
          BattleManager.preScene = SceneType.SPACE_SCENE;
          break;
        case SceneType.CASTLE_SCENE:
          BattleManager.preScene = SceneType.CASTLE_SCENE;
          break;
      }
      var condition: t_s_rewardcondictionData =
        this._rightData.conditionList[0];
      if (condition)
        OfferRewardManager.Instance.sendRewardArrest(
          condition.CondictionType,
          condition.Para1,
        );
    }
  }

  private __onRemoveRewardTaskClick() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "task.TaskFrameII.content",
    );
    SimpleAlertHelper.Instance.Show(
      undefined,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.removeRewardTaskCallBack.bind(this),
    );
  }

  private removeRewardTaskCallBack(b: boolean, flag: boolean) {
    if (b) {
      OfferRewardManager.Instance.sendRemoveRewardTask(this.nodeData.rewardID);
    }
  }

  private __onImmediateClick() {
    if (this._rightData instanceof TaskTemplate) {
      var taskTemp: TaskTemplate = this._rightData as TaskTemplate;
      SocketSendManager.Instance.challengeSelf(taskTemp.TemplateId);
    }
  }

  private __addHandler() {
    this.treeData = this.model.getTreeData();
    this.initTreeData(this.treeData[0]);
    this.defaultView();
  }

  private __updateRewardTaskHandler(data: any) {
    if (data["isCompleted"]) {
      this.defaultView();
    }
  }

  private get rewardManager(): OfferRewardManager {
    return OfferRewardManager.Instance;
  }

  private get cate(): TaskCategory {
    return TaskManage.Instance.cate;
  }

  private get ringTaskManager(): RingTaskManager {
    return RingTaskManager.Instance;
  }
}
