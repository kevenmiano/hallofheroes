import FUI_FarmTree from "../../../../../../fui/Farm/FUI_FarmTree";
import Logger from "../../../../../core/logger/Logger";
import { PackageIn } from "../../../../../core/net/PackageIn";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import { FarmOperateType } from "../../../../constant/FarmOperateType";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { UpgradeType } from "../../../../constant/UpgradeType";
import {
  FarmEvent,
  WaterEvent,
} from "../../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { FarmManager } from "../../../../manager/FarmManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { WaterManager } from "../../../../manager/WaterManager";
import FUIHelper from "../../../../utils/FUIHelper";
import { TimerTicker } from "../../../../utils/TimerTicker";
import FarmInfo from "../../data/FarmInfo";
import { FarmModel } from "../../data/FarmModel";
import { WaterTreeModel } from "../../data/WaterTreeModel";
//@ts-expect-error: External dependencies
import TreeUpdateRsp = com.road.yishi.proto.farm.TreeUpdateRsp;
import AudioManager from "../../../../../core/audio/AudioManager";
import LangManager from "../../../../../core/lang/LangManager";
import SDKManager from "../../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../../core/thirdlib/RptEvent";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import { SoundIds } from "../../../../constant/SoundIds";
import { BuildingSocketOutManager } from "../../../../manager/BuildingSocketOutManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ServerDataManager } from "../../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../../constant/protocol/S2CProtocol";

export class FarmTree extends FUI_FarmTree {
  private WaterImg = "Icon_Farm_Energize";
  private PickImg = "Icon_Farm_TreeCollect";
  private waterTimer: TimerTicker;
  private pickTimer: TimerTicker;
  private waterFlag: boolean = false;
  private pickFlag: boolean = false;
  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
    this.progTranstion.getChild("title").visible = false;
  }
  initView() {
    this.refreshTreeView();
  }

  private refreshTreeView() {
    this.clean();
    this.refreshTreeExpBar();
    this.refreshWaterState();
    this.refreshPickState();
  }

  private refreshTreeExpBar() {
    let treeInfo = this.model.currentSelectedTreeInfo;
    if (treeInfo && !treeInfo.notHasTree) {
      let grade = this.farmModel.curSelectedFarmInfo.grade;
      let temp: t_s_upgradetemplateData =
        TempleteManager.Instance.getTemplateByTypeAndLevel(
          grade,
          UpgradeType.UPGRADE_TYPE_TREEPOWER,
        );
      if (temp) {
        var waterCount: number =
          treeInfo.waterCount > temp.Data ? temp.Data : treeInfo.waterCount;
        this.progShow.value = Math.floor((waterCount / temp.Data) * 100);
        this.progShow.getChild("title").text = waterCount + " / " + temp.Data;
      }
    } else {
      this.progShow.value = 0;
      this.progShow.getChild("title").text = "0 / 0";
    }
  }

  private refreshWaterState() {
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    if (!curTreeInfo || curTreeInfo.notHasTree) {
      Logger.xjy("[WaterViewContainer]refreshWaterState 树信息不存在");
      return;
    }
    //展示了 收获，就不展示充能
    if (this.isShowPick()) {
      return;
    }

    let isSelf = curTreeInfo.userId == this.thane.userId;
    let isWater = this.isShowWater();

    this.playBtnTipOptAni();
    this.btnTipOpt.icon = FUIHelper.getItemURL(EmPackName.Base, this.WaterImg);

    //好友,直接用 isWater
    if (!isSelf) {
      this.waterFlag = isWater;
      this.btnTipOpt.visible = isWater;
      return;
    }

    //自己 必定显示 ，不可浇水做置灰处理
    let waterLeftTime = curTreeInfo.left_time;
    let todayCanWater = curTreeInfo.todayCanWater;
    this.btnTipOpt.visible = true;
    // 可以浇水
    if (todayCanWater && waterLeftTime <= 0) {
      this.waterFlag = true;
      return;
    }

    this.stopBtnTipOptAni();

    // 今天不能充能，隐藏。其它情况置灰。
    if (!todayCanWater) {
      this.btnTipOpt.visible = false;
      return;
    }
    if (waterLeftTime <= 0) return;

    if (!this.waterTimer) {
      this.waterTimer = new TimerTicker(
        1000,
        0,
        this.onTickWater.bind(this),
        this.onCompleteWater.bind(this),
      );
    }
    this.waterTimer.reset();
    this.waterTimer.repeatCount = waterLeftTime;
    this.waterTimer.start();
    this.onTickWater();
    this.txtCountDown.visible = true;
  }

  private refreshPickState() {
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    if (!curTreeInfo || curTreeInfo.notHasTree) {
      Logger.xjy("[WaterViewContainer]refreshPickState 树信息不存在");
      return;
    }

    if (!this.isShowPick()) return;
    this.mcTree.visible = true;
    this.btnTipOpt.visible = true;
    this.btnTipOpt.icon = FUIHelper.getItemURL(EmWindow.Farm, this.PickImg);
    this.playBtnTipOptAni();
    this.pickFlag = true;
    let pickTime = curTreeInfo.left_pickTime;
    if (pickTime <= 0) {
      return;
    }

    //冷却 进入倒计时
    if (!this.pickTimer) {
      this.pickTimer = new TimerTicker(
        1000,
        0,
        this.onTickPick.bind(this),
        this.onCompletePick.bind(this),
      );
    }

    this.pickTimer.reset();
    this.pickTimer.repeatCount = pickTime;
    this.pickTimer.start();
    this.onTickPick();
    this.pickFlag = false;
    this.txtCountDown.visible = true;

    this.stopBtnTipOptAni();
  }

  private clean() {
    this.txtCountDown.text = "";
    this.txtCountDown.visible = this.img_timebg.visible = false;
    this.pickFlag = false;
    this.waterFlag = false;
    this.mcTree.visible = false;
    this.btnTipOpt.visible = false;
    this.resetTimers();
  }

  private playBtnTipOptAni(normal: boolean = true, times: number = -1) {
    this.btnTipOpt.getTransition("t0").play(null, times);
    if (normal) {
      UIFilter.normal(this.btnTipOpt);
    }
  }

  private resetTimers() {
    this.waterTimer && this.waterTimer.reset();
    this.pickTimer && this.pickTimer.reset();
  }

  private onTickWater() {
    let sec = this.waterTimer.repeatCount - this.waterTimer.currentCount;
    this.txtCountDown.text = DateFormatter.getConsortiaCountDate(sec);
  }

  private onCompleteWater() {
    this.txtCountDown.visible = false;
    this.txtCountDown.text = "";
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    if (!curTreeInfo || curTreeInfo.notHasTree) {
      Logger.xjy("[WaterViewContainer]refreshWaterState 树信息不存在");
      return;
    }
    // 倒计时结束判断下是不是自己的农场
    if (curTreeInfo.userId == this.thane.userId) {
      // 在自己农场中重新请求农场消息来刷新树
      FarmManager.Instance.sendReqFarmInfo(curTreeInfo.userId);
    }
  }

  public isShowWater() {
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    if (!curTreeInfo || curTreeInfo.notHasTree) {
      return false;
    }

    let upData: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.farmModel.curSelectedFarmInfo.grade,
        UpgradeType.UPGRADE_TYPE_TREEPOWER,
      );

    let isMaxCount = !upData || curTreeInfo.waterCount >= upData.Data;
    //已经充满了
    if (isMaxCount) {
      return false;
    }

    return curTreeInfo.canWater;
  }

  public isShowPick() {
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    if (!curTreeInfo || curTreeInfo.notHasTree) {
      return false;
    }

    let isSelf = curTreeInfo.userId == this.thane.userId;
    //只有自己 显示 收集
    if (!isSelf) return false;
    //有 果实就是 收集
    return curTreeInfo.fruitCount > 0;
  }

  private stopBtnTipOptAni(gray: boolean = true) {
    this.btnTipOpt.getTransition("t0").stop(true);
    if (gray) {
      UIFilter.gray(this.btnTipOpt);
    }
  }

  private onTickPick() {
    this.txtCountDown.text = DateFormatter.getConsortiaCountDate(
      this.pickTimer.repeatCount - this.pickTimer.currentCount,
    );
  }

  private onCompletePick() {
    this.txtCountDown.visible = false;
    this.txtCountDown.text = "";
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    if (!curTreeInfo || curTreeInfo.notHasTree) {
      Logger.xjy("[WaterViewContainer]refreshWaterState 树信息不存在");
      return;
    }
    // 倒计时结束判断下是不是自己的农场	在自己农场中重新请求农场消息来刷新树
    if (curTreeInfo.userId == this.thane.userId) {
      FarmManager.Instance.sendReqFarmInfo(curTreeInfo.userId);
    }
  }

  private onTreeClickHandler(e?: Laya.Event) {
    let str: string = "";
    let curTreeInfo = this.model.currentSelectedTreeInfo;
    let isSelf = curTreeInfo.userId == this.thane.userId;
    if (curTreeInfo.fruitCount > 0 && isSelf && curTreeInfo.left_pickTime > 0) {
      str = LangManager.Instance.GetTranslation(
        "buildings.water.view.WaterViewContainer.command02",
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    if (this.pickFlag) {
      if (curTreeInfo.fruitCount < 1) {
        str = LangManager.Instance.GetTranslation(
          "buildings.water.view.WaterViewContainer.command01",
        );
        MessageTipManager.Instance.show(str);
        return;
      }

      if (curTreeInfo.left_pickTime > 0) {
        str = LangManager.Instance.GetTranslation(
          "buildings.water.view.WaterViewContainer.command02",
        );
        MessageTipManager.Instance.show(str);
        return;
      }

      BuildingSocketOutManager.pickFruits(0);
      return;
    }

    if (this.waterFlag) {
      if (
        PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess ==
        GlobalConfig.NEWBIE_32000
      ) {
        SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_TREE);
      }
      AudioManager.Instance.playSound(SoundIds.WATER_TREE_GIVEPOW_SOUND);
      BuildingSocketOutManager.water(this.model.currentSelectedTreeInfo.userId);
    }
  }

  // 充能返回 0x0092
  private onHarvestMsg(pkg: PackageIn) {
    let msg = pkg.readBody(TreeUpdateRsp) as TreeUpdateRsp;
    let len: number = msg.harvestMsg.length;
    if (len == 0) return;
    // 充能读条展示
    this.showOpt(false);
    this.showProgTransition(true, 0);
    TweenLite.killTweensOf(this.progTranstion);
    //@ts-expect-error: External dependencies
    TweenLite.to(this.progTranstion, 1, {
      value: 100,
      //@ts-expect-error: External dependencies
      ease: Linear.easeNone,
      onUpdate: null,
      onComplete: this.onWaterProgressBack.bind(this),
    });

    this.touchable = false;
    Logger.xjy("[WaterViewContainer]__harvestMsg", msg.harvestMsg);
    let str = msg.harvestMsg.join(", ");
    MessageTipManager.Instance.show(str);
    let curSelectedFarm: FarmInfo = this.farmModel.curSelectedFarmInfo;
    if (!curSelectedFarm || msg.isUpGrade) return; //如果充能后农场升级, 服务端会把farminfo推过来, 客户端这边不需要再加经验
    let addExp: number = this.farmModel.expByOper(FarmOperateType.GIVE_POWER);
    this.farmModel.myFarm.gp += addExp;
    if (curSelectedFarm.userId != this.thane.userId)
      this.farmModel.myFarm.dayGpFromFriend += addExp;
  }

  private onWaterProgressBack() {
    if (this.isDisposed) return;
    this.showOpt(true);
    this.touchable = true;
    this.showProgTransition(false);
  }

  private onPickHavestHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TreeUpdateRsp) as TreeUpdateRsp;
    let len = msg.harvestMsg.length;
    if (len == 0) return;
    Logger.xjy("[WaterViewContainer]__pickHavestHandler", msg.harvestMsg);
    let str = msg.harvestMsg.join(", ");
    MessageTipManager.Instance.show(str);
    this.farmModel.myFarm.gp += this.farmModel.expByOper(
      FarmOperateType.TREE_PICK,
    );
  }

  //0x006A
  private onPickResultHandler(pkg: PackageIn) {
    let msg = pkg.readBody(TreeUpdateRsp) as TreeUpdateRsp;
    let len: number = msg.pickMsg.length;
    if (len == 0) return;
    Logger.xjy("[WaterViewContainer]__pickResultHandler", msg.pickMsg);
    this.showProgTransition(true, 1);
    let str = msg.pickMsg.join(", ");
    MessageTipManager.Instance.show(str);
    this.onPickProgressBack();
  }

  private onPickProgressBack() {
    this.showProgTransition(false);
  }

  private showProgTransition(show: boolean, type: number = 0) {
    this.progTranstion.value = 0;
    this.progTranstion.visible = show;
    this.txtProgTranstion.visible = show;
    if (type == 1) {
      this.txtProgTranstion.text = LangManager.Instance.GetTranslation(
        "WaterViewContainer.getTxt",
      );
    } else {
      this.txtProgTranstion.text = LangManager.Instance.GetTranslation(
        "ConsortiaTreeExpView.energy",
      );
    }
  }

  private showOpt(show: boolean) {
    this.txtCountDown.alpha = this.img_timebg.alpha = show ? 1 : 0;
    this.btnTipOpt.alpha = show ? 1 : 0;
  }

  public checkCanWater() {
    return this.waterFlag;
  }

  public doOneKey() {
    this.onTreeClickHandler();
  }

  /**
   * 新手用 是否浇水过
   * @returns
   */
  public get isTreeWatered(): boolean {
    let treeInfo = this.model.currentSelectedTreeInfo;
    if (treeInfo && !treeInfo.notHasTree) {
      return treeInfo.waterCount > 0;
    }
    return false;
  }
  private initEvent() {
    this.imgTree.on(Laya.Event.CLICK, this, this.onTreeClickHandler);
    this.farmModel.addEventListener(
      FarmEvent.SELECTED_CHANGE,
      this.refreshTreeView,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HARVEST_MSG,
      this,
      this.onHarvestMsg,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TREE_PICK,
      this,
      this.onPickResultHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PICK_HARVEST_MSG,
      this,
      this.onPickHavestHandler,
    );
    WaterManager.Instance.addEventListener(
      WaterEvent.UPDATA_WATER_STATE,
      this.refreshTreeView,
      this,
    );
    WaterManager.Instance.addEventListener(
      WaterEvent.TREE_UPDATE,
      this.refreshTreeView,
      this,
    );
  }
  private removeEvent() {
    TweenLite.killTweensOf(this.progTranstion);
    this.imgTree.off(Laya.Event.CLICK, this, this.onTreeClickHandler);
    this.farmModel.removeEventListener(
      FarmEvent.SELECTED_CHANGE,
      this.refreshTreeView,
      this,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_HARVEST_MSG,
      this,
      this.onHarvestMsg,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_TREE_PICK,
      this,
      this.onPickResultHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PICK_HARVEST_MSG,
      this,
      this.onPickHavestHandler,
    );
    WaterManager.Instance.removeEventListener(
      WaterEvent.UPDATA_WATER_STATE,
      this.refreshTreeView,
      this,
    );
    WaterManager.Instance.removeEventListener(
      WaterEvent.TREE_UPDATE,
      this.refreshTreeView,
      this,
    );
  }

  private get farmModel(): FarmModel {
    return FarmManager.Instance.model;
  }

  private get model(): WaterTreeModel {
    return WaterManager.Instance.model;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public dispose() {
    this.waterTimer && this.waterTimer.stop();
    this.pickTimer && this.pickTimer.stop();
    this.waterTimer = null;
    this.pickTimer = null;
    this.removeEvent();
    super.dispose();
  }
}
