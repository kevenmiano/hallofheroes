import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import ProgressHelp from "../../../core/utils/ProgressHelp";
import Utils from "../../../core/utils/Utils";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import SevenGoalsManager from "../../manager/SevenGoalsManager";
import SevenDayInfo from "../welfare/data/SevenDayInfo";
import SevenGiftBagInfo from "../welfare/data/SevenGiftBagInfo";
import SevenTaskInfo from "../welfare/data/SevenTaskInfo";
import SevenTreasureInfo from "../welfare/data/SevenTreasureInfo";
import SevenTabListItem from "./SevenTabListItem";
import { SevenGoalsBagView } from "./SevenGoalsBagView";
import SevenGoalsBoxItem from "./SevenGoalsBoxItem";
import SevenGoalsDayItem from "./SevenGoalsDayItem";
import SevenGoalsModel from "./SevenGoalsModel";
import SevenGoalsTaskItem from "./SevenGoalsTaskItem";
import LangManager from "../../../core/lang/LangManager";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import GoodsSonType from "../../constant/GoodsSonType";
import { MovieClip } from "../../component/MovieClip";
import { t_s_mounttemplateData } from "../../config/t_s_mounttemplate";
import { TempleteManager } from "../../manager/TempleteManager";
import { PathManager } from "../../manager/PathManager";
import ResMgr from "../../../core/res/ResMgr";
import { AnimationManager } from "../../manager/AnimationManager";
import { ShowAvatar } from "../../avatar/view/ShowAvatar";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";

export default class SevenGoalsWnd extends BaseWindow {
  public type: fgui.Controller;
  public todayHasBuyCtr: fgui.Controller;
  public isDiamond: fgui.Controller;
  public progressValue: fgui.GProgressBar;
  public boxList: fgui.GList;
  public spliteList: fgui.GList;
  public dayList: fgui.GList;
  public tabList: fgui.GList;
  public taskList: fgui.GList;
  public currentValueTxt: fgui.GTextField;
  public timeTxt: fgui.GTextField;
  public descTxt3: fgui.GTextField;
  public progressTxt: fgui.GRichTextField;
  public closeBtn: fgui.GButton;
  public descTxt1: fgui.GRichTextField;
  public descTxt2: fgui.GTextField;
  public helpBtn: fgui.GButton;
  public limitTxt: fgui.GTextField;
  public limitGroup: fgui.GGroup;
  public sevenGoalsBag: SevenGoalsBagView;
  private _remainTime: number = 0;
  private _dayArr: Array<SevenDayInfo> = [];
  private _tabArr: Array<any> = [];
  private _taskArr: Array<SevenTaskInfo> = [];
  private _boxArr: Array<SevenTreasureInfo> = [];
  private _maxIntegralValue: number = 0;
  private _integralValueArr: Array<number> = [];
  public animationCom: fgui.GComponent;
  private _mountMovieClip: MovieClip;
  private _figure: ShowAvatar;
  private _showThane: ThaneInfo;

  public OnInitWind() {
    this._remainTime = this.sevenGoalsModel.leftTime;
    this.timeTxt.text = DateFormatter.getSevenDateString(this._remainTime);
    this.initEvent();
    this.type = this.getController("type");
    this.todayHasBuyCtr = this.getController("todayHasBuyCtr");
    this.isDiamond = this.getController("isDiamond");
    this.descTxt1.text = LangManager.Instance.GetTranslation(
      "SevenGoalsWnd.descTxt1",
    );
    this.descTxt2.text = LangManager.Instance.GetTranslation(
      "SevenGoalsWnd.descTxt2",
    );
    this.descTxt3.text = LangManager.Instance.GetTranslation(
      "SevenGoalsWnd.descTxt3",
    );
    this.limitTxt.text = LangManager.Instance.GetTranslation(
      "SevenGoalsWnd.limitTxt",
    );
    this.progressValue.min = 0;
    this.sevenGoalsModel.currentSelectedDay =
      this.sevenGoalsModel.sevenCurrentDay;
    this.sevenGoalsModel.tabValue = 0;
    this.refreshView(this.sevenGoalsModel.currentSelectedDay - 1);
    this.updateRewardLook();
    SevenGoalsManager.Instance.requestTaskInfo(); //请求七日任务活动数据
  }

  OnShowWind() {
    super.OnShowWind();
  }

  initEvent() {
    this.boxList.itemRenderer = Laya.Handler.create(
      this,
      this.renderBoxList,
      null,
      false,
    );
    this.dayList.itemRenderer = Laya.Handler.create(
      this,
      this.renderDayList,
      null,
      false,
    );
    this.tabList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTabList,
      null,
      false,
    );
    Utils.setDrawCallOptimize(this.taskList);
    this.taskList.itemRenderer = Laya.Handler.create(
      this,
      this.renderTaskList,
      null,
      false,
    );
    this.taskList.setVirtual();
    this.dayList.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onDaySelectHandler,
    );
    this.tabList.on(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onTabSelectHandler,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SEVEN_GOALS_TASK_UPDATE,
      this.updateView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SEVEN_GOALS_TASKGET_UPDATE,
      this.updateView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SEVEN_GOALS_REWARDSITE_UPDATE,
      this.updateBoxView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SEVEN_GOALS_GIFTSITE_UPDATE,
      this.updateGiftView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SEVEN_GOALS_REWARD_LOOK_UPDATE,
      this.updateRewardLook,
      this,
    );
    if (this._remainTime > 0) {
      Laya.timer.loop(1000, this, this.__updateTimeHandler);
    }
  }

  removeEvent() {
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SEVEN_GOALS_TASK_UPDATE,
      this.updateView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SEVEN_GOALS_TASKGET_UPDATE,
      this.updateView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SEVEN_GOALS_REWARDSITE_UPDATE,
      this.updateBoxView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SEVEN_GOALS_GIFTSITE_UPDATE,
      this.updateGiftView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SEVEN_GOALS_REWARD_LOOK_UPDATE,
      this.updateRewardLook,
      this,
    );
    this.dayList.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onDaySelectHandler,
    );
    this.tabList.off(
      fairygui.Events.CLICK_ITEM,
      this,
      this.__onTabSelectHandler,
    );
    Laya.timer.clear(this, this.__updateTimeHandler);
  }

  private __updateTimeHandler() {
    this._remainTime--;
    this.timeTxt.text = DateFormatter.getSevenDateString(this._remainTime);
    if (this._remainTime <= 0) {
      Laya.timer.clear(this, this.__updateTimeHandler);
    }
  }

  /**积分 */
  renderBoxList(index: number, item: SevenGoalsBoxItem) {
    if (!item) return;
    item.info = this._boxArr[index];
  }

  /**天数 */
  renderDayList(index: number, item: SevenGoalsDayItem) {
    if (!item) return;
    item.info = this._dayArr[index];
  }

  /**类型 */
  renderTabList(index: number, item: SevenTabListItem) {
    if (!item) return;
    item.info = this._tabArr[index];
  }

  /**任务 */
  renderTaskList(index: number, item: SevenGoalsTaskItem) {
    if (!item) return;
    item.info = this._taskArr[index];
  }

  /**切换天数按钮 */
  __onDaySelectHandler() {
    this.sevenGoalsModel.currentSelectedDay = this.dayList.selectedIndex + 1;
    this.tabList.selectedIndex = 0;
    this.__onTabSelectHandler();
    if (
      this.sevenGoalsModel.checkBagHasBuy(
        this.sevenGoalsModel.currentSelectedDay,
      )
    ) {
      //已经购买了
      this.todayHasBuyCtr.selectedIndex = 1;
    } else {
      this.todayHasBuyCtr.selectedIndex = 0;
    }
  }

  /**任务类型 */
  __onTabSelectHandler() {
    let dayValue: number = this.dayList.selectedIndex;
    let tabValue: number = this.tabList.selectedIndex;
    this.tabList.numItems = this._tabArr.length;
    this.sevenGoalsModel.tabValue = tabValue;
    if (tabValue == 2) {
      this.type.selectedIndex = 1;
      let sevenGiftBagInfo: SevenGiftBagInfo =
        this.sevenGoalsModel.sevenGiftBagArr[dayValue];
      this.sevenGoalsBag.info = sevenGiftBagInfo;
    } else {
      this.type.selectedIndex = 0;
      this._taskArr = this.sevenGoalsModel.getTaskArray(dayValue + 1, tabValue);
      this.taskList.numItems = this._taskArr.length;
    }
  }

  private updateView() {
    this.refreshView(this.dayList.selectedIndex, this.tabList.selectedIndex);
  }

  /**属性视图 */
  refreshView(dayIndex: number = 0, tabIndex: number = 0) {
    this.currentValueTxt.text = this.sevenGoalsModel.starNum.toString();
    this._boxArr = this.sevenGoalsModel.sevenTreasureArr;
    this._dayArr = this.sevenGoalsModel.getDayArray();
    this._tabArr = this.sevenGoalsModel.getTabArray();
    if (this._integralValueArr.length == 0) {
      this.initIntegralArray();
    }
    this.progressValue.value = ProgressHelp.getCurrentValue(
      this.sevenGoalsModel.starNum,
      this._maxIntegralValue,
      this._integralValueArr,
    );
    this.boxList.numItems = this._boxArr.length;
    this.dayList.numItems = this._dayArr.length;
    this.tabList.numItems = this._tabArr.length;
    this.dayList.selectedIndex = dayIndex;
    this.tabList.selectedIndex = tabIndex;
    if (tabIndex == 2) {
      //选中特惠礼包tab
      this.type.selectedIndex = 1;
      let sevenGiftBagInfo: SevenGiftBagInfo =
        this.sevenGoalsModel.sevenGiftBagArr[dayIndex];
      this.sevenGoalsBag.info = sevenGiftBagInfo;
    } else {
      this.type.selectedIndex = 0;
      this._taskArr = this.sevenGoalsModel.getTaskArray(dayIndex + 1, tabIndex);
      this.taskList.numItems = this._taskArr.length;
    }
  }

  private updateRewardLook() {
    let currentProgress = this.sevenGoalsModel.getProgress();
    if (currentProgress > this.sevenGoalsModel.sevenTreasureArr.length) {
      this.progressTxt.text = LangManager.Instance.GetTranslation(
        "SevenGoalsWnd.progressTxt1",
        this.sevenGoalsModel.sevenTreasureArr.length,
        this.sevenGoalsModel.sevenTreasureArr.length,
      );
      this.descTxt3.text = LangManager.Instance.GetTranslation(
        "SevenGoalsWnd.descTxt4",
      );
    } else {
      this.progressTxt.text = LangManager.Instance.GetTranslation(
        "SevenGoalsWnd.progressTxt2",
        currentProgress,
        this.sevenGoalsModel.sevenTreasureArr.length,
      );
      this.descTxt3.text = LangManager.Instance.GetTranslation(
        "SevenGoalsWnd.descTxt3",
      );
    }
    let lookInfo: GoodsInfo = this.sevenGoalsModel.getNextLookInfo();
    if (lookInfo) {
      if (lookInfo.templateId == -500) {
        this.isDiamond.selectedIndex = 0;
      } else if (
        lookInfo.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD
      ) {
        //坐骑卡
        this.isDiamond.selectedIndex = 1;
        let mountTemplate: t_s_mounttemplateData =
          TempleteManager.Instance.getMountTemplateById(
            lookInfo.templateInfo.Property1,
          );
        if (mountTemplate) {
          this.createAnimation(mountTemplate);
        }
      } else if (
        lookInfo.templateInfo.SonType == GoodsSonType.FASHION_WEAPON ||
        lookInfo.templateInfo.SonType == GoodsSonType.FASHION_HEADDRESS ||
        lookInfo.templateInfo.SonType == GoodsSonType.FASHION_CLOTHES ||
        lookInfo.templateInfo.SonType == GoodsSonType.SONTYPE_WING
      ) {
        this.isDiamond.selectedIndex = 2;
        if (this._figure) {
          this._figure.parent && this._figure.parent.removeChild(this._figure);
        }
        this._figure = new ShowAvatar();
        this._figure.x = 20;
        this.animationCom.displayObject.addChild(this._figure);
        this._showThane = new ThaneInfo();
        this._showThane.templateId = this.thane.templateId;
        this._showThane.armsEquipAvata = this.thane.armsEquipAvata;
        this._showThane.bodyEquipAvata = this.thane.bodyEquipAvata;
        switch (lookInfo.templateInfo.SonType) {
          case GoodsSonType.FASHION_CLOTHES:
            this._showThane.bodyFashionAvata = lookInfo.templateInfo.Avata;
            break;
          case GoodsSonType.FASHION_HEADDRESS:
            this._showThane.hairFashionAvata = lookInfo.templateInfo.Avata;
            break;
          case GoodsSonType.FASHION_WEAPON:
            this._showThane.armsFashionAvata = lookInfo.templateInfo.Avata;
            break;
          case GoodsSonType.SONTYPE_WING:
            this._showThane.wingAvata = lookInfo.templateInfo.Avata;
            break;
        }
        this._figure.data = this._showThane;
      }
    }
  }

  private updateBoxView() {
    this.boxList.numItems = this.sevenGoalsModel.sevenTreasureArr.length;
  }

  private updateGiftView() {
    let sevenGiftBagInfo: SevenGiftBagInfo =
      this.sevenGoalsModel.sevenGiftBagArr[this.dayList.selectedIndex];
    this.sevenGoalsBag.info = sevenGiftBagInfo;
    if (
      this.sevenGoalsModel.checkBagHasBuy(
        this.sevenGoalsModel.currentSelectedDay,
      )
    ) {
      //已经购买了
      this.todayHasBuyCtr.selectedIndex = 1;
    } else {
      this.todayHasBuyCtr.selectedIndex = 0;
    }
  }

  private initIntegralArray() {
    let item: SevenTreasureInfo;
    for (let i = 0; i < this._boxArr.length; i++) {
      item = this._boxArr[i];
      if (item) {
        this._integralValueArr.push(item.integral);
        if (i == this._boxArr.length - 1) {
          this._maxIntegralValue = item.integral;
          this.progressValue.max = item.integral;
        }
      }
    }
  }

  private _cacheName = "";
  private createAnimation(mountTemplate: t_s_mounttemplateData) {
    let avatarPath = PathManager.getMountPath(mountTemplate.AvatarPath);
    ResMgr.Instance.loadRes(
      avatarPath,
      (res) => {
        if (this.destroyed) {
          return;
        }
        if (this._mountMovieClip) {
          this._mountMovieClip.stop();
          this._mountMovieClip.parent &&
            this._mountMovieClip.parent.removeChild(this._mountMovieClip);
        }
        if (!res) {
          return;
        }
        let frames = res.frames;
        let _preUrl = res.meta.prefix;
        this._cacheName = _preUrl;

        let offsetX: number = 0;
        let offsetY: number = 0;
        if (res.offset) {
          let offset = res.offset;
          offsetX = offset.footX;
          offsetY = offset.footY;
        }
        AnimationManager.Instance.createAnimation(
          _preUrl,
          "",
          undefined,
          "",
          AnimationManager.MapPhysicsFormatLen,
        );
        this._mountMovieClip = new MovieClip(this._cacheName);
        this.animationCom.displayListContainer.addChild(this._mountMovieClip);
        this._mountMovieClip.gotoAndStop(1);
        let sourceSize = new Laya.Rectangle();
        for (let key in frames) {
          if (Object.prototype.hasOwnProperty.call(frames, key)) {
            let sourceItem = frames[key].sourceSize;
            sourceSize.width = sourceItem.w;
            sourceSize.height = sourceItem.h;
            break;
          }
        }
        this._mountMovieClip.pivotX = sourceSize.width >> 1;
        this._mountMovieClip.pivotY = sourceSize.height >> 1;

        let comWidth = this.animationCom.width;
        let comHiehgt = this.animationCom.height;
        let scaleX = comWidth / sourceSize.width;
        let scaleY = comHiehgt / sourceSize.height;
        let scale = Math.min(scaleX, scaleY);
        this._mountMovieClip.scale(scale, scale, true);
        this._mountMovieClip.x = this.animationCom.width >> 1;
        this._mountMovieClip.y = this.animationCom.height >> 1;
        this._mountMovieClip.gotoAndPlay(1, true);
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  private get sevenGoalsModel(): SevenGoalsModel {
    return SevenGoalsManager.Instance.sevenGoalsModel;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  dispose() {
    this.removeEvent();
    this.spliteList.numItems = 0;
    this.boxList.numItems = 0;
    this.dayList.numItems = 0;
    this.tabList.numItems = 0;
    this.taskList.numItems = 0;
    Utils.clearGListHandle(this.boxList);
    Utils.clearGListHandle(this.dayList);
    Utils.clearGListHandle(this.tabList);
    Utils.clearGListHandle(this.taskList);
    this._dayArr = [];
    this._tabArr = [];
    this._taskArr = [];
    this._boxArr = [];
    super.dispose();
  }
}
