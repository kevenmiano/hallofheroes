//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-13 17:44:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-19 17:44:33
 * @Description: 农场的土地Item
 */

import LangManager from "../../../../../core/lang/LangManager";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { DisplayObject } from "../../../../component/DisplayObject";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { CropPhase } from "../../../../constant/CropPhase";
import { CropState } from "../../../../constant/CropState";
import { FarmEvent } from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { FarmOperateType } from "../../../../constant/FarmOperateType";
import { PlayerModel } from "../../../../datas/playerinfo/PlayerModel";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ResourceData } from "../../../../datas/resource/ResourceData";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { FarmManager } from "../../../../manager/FarmManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ResourceManager } from "../../../../manager/ResourceManager";
import FarmInfo from "../../data/FarmInfo";
import FarmLandInfo from "../../data/FarmLandInfo";
import { FarmModel } from "../../data/FarmModel";
import FUI_FarmLandItem from "../../../../../../fui/Farm/FUI_FarmLandItem";
import FUIHelper from "../../../../utils/FUIHelper";
import { EmWindow } from "../../../../constant/UIDefine";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import FriendFarmStateInfo from "../../data/FriendFarmStateInfo";
import Logger from "../../../../../core/logger/Logger";
import GameManager from "../../../../manager/GameManager";
import HitTestUtils from "../../../../utils/HitTestUtils";
import Utils from "../../../../../core/utils/Utils";
import { NotificationManager } from "../../../../manager/NotificationManager";
import GoodsSonType from "../../../../constant/GoodsSonType";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import ItemID from "../../../../constant/ItemID";

export class FarmLandItem extends FUI_FarmLandItem {
  /**
   * 土地位置
   */
  public pos: number;
  private _isOpen: boolean;
  private _curState: number;
  private _curPhase: number;
  private _info: FarmLandInfo;

  onConstruct() {
    super.onConstruct();
    this.initView();
    this.addEvent();
  }

  private initView() {
    this.isOpen = false;
    this.txtGetMsg.visible = false;
    this.mcMature.visible = false;
    this.imgGrass2.visible = false;
    this.btnLandOpt.onClick(this, this.__onItemClick);
    this.btnClickItem.displayObject.name = "FarmLand_ClickItem";
    this.imgCrop.displayObject.name = "FarmLand_ClickItem";
    this.imgCrop.displayObject.mouseThrough = true;
  }

  private addEvent() {
    this.imgCrop.on(Laya.Event.CLICK, this, this.__onCropItemClick);
    this.imgCrop.on(Laya.Event.MOUSE_MOVE, this, this.__onCropItemMove);
    this.imgCrop.on(Laya.Event.MOUSE_OUT, this, this.__onCropItemOut);
    this.btnClickItem.on(Laya.Event.CLICK, this, this.__onItemClick);
    this.btnClickItem.on(Laya.Event.MOUSE_OVER, this, this.__onItemOver);
    this.btnClickItem.on(Laya.Event.MOUSE_OUT, this, this.__onItemOut);
  }

  private delEvent() {
    this.imgCrop.off(Laya.Event.CLICK, this, this.__onCropItemClick);
    this.imgCrop.off(Laya.Event.MOUSE_MOVE, this, this.__onCropItemMove);
    this.imgCrop.off(Laya.Event.MOUSE_OUT, this, this.__onCropItemOut);
    this.btnClickItem.off(Laya.Event.CLICK, this, this.__onItemClick);
    this.btnClickItem.off(Laya.Event.MOUSE_OVER, this, this.__onItemOver);
    this.btnClickItem.off(Laya.Event.MOUSE_OUT, this, this.__onItemOut);
  }

  private __onItemOut(e: Laya.Event) {
    if (!this._info || !this.isOpen) return;
    // UIFilter.normal(this.gLand.displayObject)
    UIFilter.normal(this.imgUnOpen.displayObject);
    UIFilter.normal(this.imgDef.displayObject);
    UIFilter.normal(this.imgGrass2.displayObject);
    UIFilter.normal(this.imgCrop.displayObject);
    UIFilter.normal(this.mcMature.displayObject);
  }

  private __onItemOver(e: Laya.Event) {
    if (!this._info || !this.isOpen) return;
    // UIFilter.yellow(this.gLand.displayObject)
    UIFilter.yellow(this.imgUnOpen.displayObject);
    UIFilter.yellow(this.imgDef.displayObject);
    UIFilter.yellow(this.imgGrass2.displayObject);
    UIFilter.yellow(this.imgCrop.displayObject);
    UIFilter.yellow(this.mcMature.displayObject);
  }

  private __btnTipOptClick() {}

  private __onCropItemClick(evt: Laya.Event) {
    let point = new Laya.Point(evt.stageX, evt.stageY);

    let isOver = true;
    let view = this.imgCrop.displayObject;
    if (view) {
      view.globalToLocal(point);
      isOver = HitTestUtils.hitTest(view.getChildAt(0), point);
    }
    if (!isOver) {
      return;
    }
    this.__onItemClick(null);
  }

  private __onCropItemMove(evt: Laya.Event) {
    let point = new Laya.Point(evt.stageX, evt.stageY);

    let isOver = true;
    let view = this.imgCrop.displayObject;
    if (view) {
      view.globalToLocal(point);
      isOver = HitTestUtils.hitTest(view.getChildAt(0), point);
    }
    if (isOver) {
      this.__onItemOver(null);
    } else {
      this.__onItemOut(null);
    }
  }

  private __onCropItemOut(evt: Laya.Event) {
    this.__onItemOut(null);
  }

  public onItemClick() {
    this.__onItemClick(null);
  }
  private __onItemClick(e: Laya.Event) {
    if (!this.isOpen) {
      let str =
        this.pos < FarmModel.MAX_OPEN_LAND
          ? LangManager.Instance.GetTranslation(
              "farm.view.FarmLandLayer.needFarmGradeTip",
              (this.pos - 2) * 5,
            )
          : LangManager.Instance.GetTranslation("public.unopen");
      if (this.cNextOpen.selectedIndex == 1) {
        var curSelectedFarm: FarmInfo = this.model.curSelectedFarmInfo;
        if (this.checkIsSelf(curSelectedFarm.userId)) {
          //玩家在好友农场内点击好友的未解锁土地, 弹出提示五级开放, 更改为无需提示
          MessageTipManager.Instance.show(str);
        }
      } else {
        if (this.model.curSelectedFarmInfo) {
          let uid = this.model.curSelectedFarmInfo.userId;
          if (this.checkIsSelf(uid)) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "farm.data.FarmLandItem.Lock",
              ),
            );
          }
        }
      }
    }

    if (!this._info) return;
    switch (
      this._info.curOper //操作类型
    ) {
      case FarmOperateType.PLANT: //种植
        if (!this.isOpen || !this._info) {
          break;
        }

        //
        if (!this.farmManager.showingBag) {
          FarmManager.Instance.openBagFrame();
          break;
        }

        //未选中作物
        let goodInfo = this.model.curSelectedGoodInfo;
        if (!goodInfo) {
          let msg = LangManager.Instance.GetTranslation(
            "farm.data.FarmSeedNotEnough",
          );
          SimpleAlertHelper.Instance.Show(
            SimpleAlertHelper.SIMPLE_ALERT,
            null,
            null,
            msg,
            null,
            null,
            (b: boolean) => {
              if (b) FarmManager.Instance.openShopFrame();
            },
          );
          break;
        }

        //最多一种特殊作物
        if (
          this.farmManager.checkExistSameSpecialCrop(
            goodInfo.templateInfo,
            this.model.curSelectedFarmInfo,
          )
        ) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "farm.cell.FarmBagCellDropMediator.hasSpecialCropTip",
            ),
          );
          break;
        }

        this.farmManager.sendFarmOper(
          this._info.userId,
          FarmOperateType.PLANT,
          this._info.pos,
          goodInfo.pos,
          goodInfo.templateId,
        );
        break;
      case FarmOperateType.STEAL: //摘取
        if (this.checkGoldLimit(this._info.cropTemp)) return;
        var canBeStolen: string = this._info.canBeStolen;
        if (canBeStolen) {
          MessageTipManager.Instance.show(canBeStolen);
          this.cleanCanPickEffect();
          this.farmManager.updateFarmStateByType(
            this._info.userId,
            FarmOperateType.STEAL,
            false,
          );
          return;
        }
        if (this.model.myFarm.dayStealCount >= this.model.maxDayStealCount) {
          //偷取次数是否达到上限
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "farm.view.FarmLandItem.outStealCountTip",
            ),
          );
          return;
        }
        this.farmManager.sendFarmOper(
          this._info.userId,
          FarmOperateType.STEAL,
          this._info.pos,
        );
        break;
      case FarmOperateType.WORM: //除虫
        this.farmManager.sendFarmOper(
          this._info.userId,
          FarmOperateType.WORM,
          this._info.pos,
        );
        break;
      case FarmOperateType.WEED: //除草
        this.farmManager.sendFarmOper(
          this._info.userId,
          FarmOperateType.WEED,
          this._info.pos,
        );
        break;
      case FarmOperateType.PICK: //收获
        if (this.checkGoldLimit(this._info.cropTemp)) return;
        this.farmManager.sendFarmOper(
          this._info.userId,
          FarmOperateType.PICK,
          this._info.pos,
        );
        break;
      case FarmOperateType.REVIVE: //复活
        this.farmManager.sendFarmOper(
          this._info.userId,
          FarmOperateType.REVIVE,
          this._info.pos,
        );
        break;
      case FarmOperateType.CLEAR: //铲除
        var tip: string = LangManager.Instance.GetTranslation(
          this._info.isDie
            ? "farm.view.FarmOperMenu.DieClearTip"
            : "farm.view.FarmOperMenu.clearTip",
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          { oper: FarmOperateType.CLEAR, land: this._info },
          null,
          tip,
          null,
          null,
          this.operResponse.bind(this),
        );
        break;
      case FarmOperateType.SHOW_MENU: //弹出操作菜单
        FrameCtrlManager.Instance.open(EmWindow.FarmLandMenu, this.info);
        break;
    }
  }

  private operResponse(b: boolean, flag: boolean, data: any) {
    if (b && data) {
      this.farmManager.sendFarmOper(data.land.userId, data.oper, data.land.pos);
    }
  }
  /**
   * 检测是否已达摘取上限
   * 判断条件有黄金达上限、模版参数Property2
   * @param cropTemp: 物品模版
   * @return : boolean 是否已达上限
   *
   */
  private checkGoldLimit(cropTemp: t_s_itemtemplateData): boolean {
    if (
      cropTemp &&
      cropTemp.Property2 == ItemID.GOLD_PROP &&
      this.gold.count >= this.gold.limit
    ) {
      //黄金爆仓后, 无法摘取黄金作物
      let uid = 0;
      if (this.model.curSelectedFarmInfo) {
        uid = this.model.curSelectedFarmInfo.userId;
      }

      let str = LangManager.Instance.GetTranslation(
        "farm.view.FarmLandItem.goldLimitTip",
      );
      if (!this.checkIsSelf(uid)) {
        MessageTipManager.Instance.show(str);
      } else {
        SimpleAlertHelper.Instance.Show(
          null,
          null,
          null,
          str,
          LangManager.Instance.GetTranslation("farm.view.FarmOperMenu.clear"),
          null,
          (b: boolean) => {
            if (b) {
              var tip: string;
              this._info.isDie
                ? (tip = LangManager.Instance.GetTranslation(
                    "farm.view.FarmOperMenu.DieClearTip",
                  ))
                : (tip = LangManager.Instance.GetTranslation(
                    "farm.view.FarmOperMenu.clearTip",
                  ));
              SimpleAlertHelper.Instance.Show(
                null,
                { oper: FarmOperateType.CLEAR, land: this._info },
                null,
                tip,
                null,
                null,
                this.operResponse.bind(this),
              );
            }
          },
        );
      }
      return true;
    }
    return false;
  }

  private addLandListener(info: FarmLandInfo) {
    if (info) {
      info.addEventListener(
        FarmEvent.LANDINFO_UPDATE,
        this.__landInfoUpdateHandler,
        this,
      );
      info.addEventListener(FarmEvent.OPER_BACK, this.__operBackHandler, this);
      GameManager.Instance.addEventListener(
        PlayerEvent.SYSTIME_UPGRADE_SECOND,
        this.__timeUpdateHandler,
        this,
      );
    }
  }

  private delLandListener(info: FarmLandInfo) {
    if (info) {
      info.removeEventListener(
        FarmEvent.LANDINFO_UPDATE,
        this.__landInfoUpdateHandler,
        this,
      );
      info.removeEventListener(
        FarmEvent.OPER_BACK,
        this.__operBackHandler,
        this,
      );
      GameManager.Instance.removeEventListener(
        PlayerEvent.SYSTIME_UPGRADE_SECOND,
        this.__timeUpdateHandler,
        this,
      );
    }
  }

  private __operBackHandler(e: FarmEvent) {
    var curSelectedFarm: FarmInfo = this.model.curSelectedFarmInfo;
    if (
      !this._info ||
      !curSelectedFarm ||
      curSelectedFarm.userId != this._info.userId
    )
      return;
    switch (this._info.resultBack) {
      case 0: //操作成功
        this.addExpAndChatTip(curSelectedFarm);
        this.updateFriendFarmState(curSelectedFarm);
        break;
      case 1: //操作失败
        this.showFailTip();
        this.updateFriendFarmState(curSelectedFarm);
        break;
    }
  }

  private addExpAndChatTip(curFarm: FarmInfo) {
    var addExp: number = this.model.expByOper(this._info.operBack);
    if (addExp <= 0) {
      switch (this.model.fullExpType) {
        case 1:
          this.txtGetMsg.text = LangManager.Instance.GetTranslation(
            "farm.view.FarmLandItem.farmExpFull",
          );
          break;
        case 2:
          this.txtGetMsg.text = LangManager.Instance.GetTranslation(
            "farm.view.FarmLandItem.dayGpFull",
          );
          break;
      }
    } else {
      this.txtGetMsg.text =
        LangManager.Instance.GetTranslation("farm.view.FarmLandItem.farmExp") +
        "+" +
        addExp;
    }
    switch (this._info.operBack) {
      case FarmOperateType.WORM: //除虫
      case FarmOperateType.WEED: //除草
      case FarmOperateType.REVIVE: //复活
        this.txtGetMsg.visible = true;
        break;
      case FarmOperateType.STEAL: //偷取
        break;
      case FarmOperateType.ACCELERATE: //加速
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "farm.view.FarmLandItem.accelerateSucceed",
          ),
        );
        break;
    }

    this.model.myFarm.gp += addExp;
    if (!this.checkIsSelf(curFarm.userId)) {
      this.model.myFarm.dayGpFromFriend += addExp;
      var cropName: string = this._info.cropTemp
        ? this._info.cropTemp.TemplateNameLang
        : "";
      this.farmManager.addChatTip(
        2,
        this._info.operBack,
        curFarm.userId,
        curFarm.nickName,
        cropName,
        addExp,
      );
    } else {
      this.farmManager.addChatTip(1, this._info.operBack, 0, "", "", addExp);
    }
  }

  private updateFriendFarmState(curFarm: FarmInfo) {
    if (this.checkIsSelf(curFarm.userId)) return;
    var hasOper: boolean = false;
    var fsInfo: FriendFarmStateInfo = this.model.getFarmStateInfo(
      curFarm.userId,
    );
    for (let index = 0; index < curFarm.getLandList().length; index++) {
      const land: FarmLandInfo = curFarm.getLandList()[index];
      if (this.farmManager.checkHasOperNow(land, this._info.operBack))
        hasOper = true;
    }
    fsInfo.beginChanges();
    switch (this._info.operBack) {
      case FarmOperateType.STEAL:
        fsInfo.canSteal = hasOper;
        break;
      case FarmOperateType.REVIVE:
        if (this._info.canBeStolen == "") fsInfo.canSteal = true;
        fsInfo.canRevive = hasOper;
        break;
      case FarmOperateType.WORM:
        fsInfo.canWorm = hasOper;
        break;
      case FarmOperateType.WEED:
        fsInfo.canWeed = hasOper;
        break;
    }
    fsInfo.commitChanges();
  }

  private showFailTip() {
    var str: string = "";
    switch (this._info.operBack) {
      case FarmOperateType.WORM:
        str = LangManager.Instance.GetTranslation("farm.FarmManager.noWormTip");
        break;
      case FarmOperateType.WEED:
        str = LangManager.Instance.GetTranslation("farm.FarmManager.noWeedTip");
        break;
      case FarmOperateType.REVIVE:
        str = LangManager.Instance.GetTranslation(
          "farm.FarmManager.noReviveTip",
        );
        break;
      case FarmOperateType.STEAL:
        if (!this._info.hasCrop)
          str = LangManager.Instance.GetTranslation(
            "farm.data.FarmLandInfo.noCrop",
          );
        else if (this._info.canBeStolen != "") {
          str = this._info.canBeStolen;
          this.cleanCanPickEffect();
          this.farmManager.updateFarmStateByType(
            this._info.userId,
            FarmOperateType.STEAL,
            false,
          );
        }
        break;
      default:
        str = LangManager.Instance.GetTranslation("farm.FarmManager.noOperTip");
    }
    MessageTipManager.Instance.show(str);
  }

  private __timeUpdateHandler() {
    this.refreshView();
  }

  private __landInfoUpdateHandler() {
    // Logger.xjy("[FarmLandItem]__landInfoUpdateHandler")
    this.refreshView();

    // 如果不是在自己的农场中 且已经采摘过该农作物 则隐藏采摘提示按钮
    if (
      !this.checkIsSelf(this._info.userId) &&
      this._curPhase == CropPhase.MATURE &&
      this._info.canBeStolen
    ) {
      this.showBtnOptEffect(false);
    }
  }

  private refreshView() {
    if (this._info) {
      this.imgSelected.visible = this._info.hasCrop
        ? false
        : FarmManager.Instance.showingBag;
      let isSelf = this._info.userId == this.thane.userId;
      if (!isSelf) {
        this.imgSelected.visible = false;
      }
      if (this._info.hasCrop && this._info.cropTemp) {
        var iconPath: string = IconFactory.getCropIcon(
          this._info.cropTemp,
          this._info.cropPhase,
        );
        if (iconPath) {
          this.imgCrop.icon = iconPath;
        }
      } else {
        this.imgCrop.icon = "";
        this.imgCrop.setSize(10, 10);
      }
      this.refreshViewByState(this._info.cropState);
      this.refreshViewByPhase(this._info.cropPhase);
    } else {
      this.imgSelected.visible = false;
    }
  }

  public clean() {
    this._curState = this._curPhase = -1;
    this.imgCrop.icon = "";
    this.cNextOpen.selectedIndex = 0;
    this.cleanEffect();
  }

  private refreshViewByState(state: number) {
    if (this._curState == state) return;
    this._curState = state;
    this.cleanEffect();
    var target: DisplayObject;
    switch (state) {
      case CropState.GRASS:
        this.showBtnOptEffect(true);
        this.btnLandOpt.icon = FUIHelper.getItemURL(
          EmWindow.Farm,
          "Icon_Farm_Weed",
        );
        this.imgGrass2.visible = true;
        this.farmManager.updateFarmStateByType(
          this._info.userId,
          FarmOperateType.WEED,
          true,
        ); //长草以后更新好友列表状态图标
        break;
      case CropState.WORM:
        this.showBtnOptEffect(true);
        this.btnLandOpt.icon = FUIHelper.getItemURL(
          EmWindow.Farm,
          "Icon_Farm_Bug",
        );
        this.farmManager.updateFarmStateByType(
          this._info.userId,
          FarmOperateType.WORM,
          true,
        );
        break;
    }
  }

  private refreshViewByPhase(phase: number) {
    if (this._curPhase == phase) return;
    this._curPhase = phase;
    switch (phase) {
      case CropPhase.NONE:
        this.cleanEffect();
        break;
      case CropPhase.GROW:
        if (
          this._curState != CropState.WORM &&
          this._curState != CropState.GRASS
        )
          this.cleanEffect();
        break;
      case CropPhase.MATURE:
        this.cleanEffect();
        if (
          this._info.canBeStolen == "" ||
          this.checkIsSelf(this._info.userId)
        ) {
          this.showBtnOptEffect(true);
          this.btnLandOpt.icon = FUIHelper.getItemURL(
            EmWindow.Farm,
            "Icon_Farm_Collect",
          );
          this.farmManager.updateFarmStateByType(
            this._info.userId,
            FarmOperateType.STEAL,
            true,
          );
        }

        this.mcMature.visible = true;
        break;
      case CropPhase.DIE:
        this.cleanEffect();
        this.showBtnOptEffect(true);
        if (this.checkIsSelf(this._info.userId)) {
          this.btnLandOpt.icon = FUIHelper.getItemURL(
            EmWindow.Farm,
            "Icon_Farm_Rootout",
          );
        } else {
          this.btnLandOpt.icon = FUIHelper.getItemURL(
            EmWindow.Farm,
            "Icon_Farm_Revive",
          );
        }
        this.farmManager.updateFarmStateByType(
          this._info.userId,
          FarmOperateType.REVIVE,
          true,
        );
        break;
    }
  }

  private cleanEffect() {
    this.mcMature.visible = false;
    this.imgGrass2.visible = false;
    this.showBtnOptEffect(false);
  }
  /**
   *清除可以偷取的动画（手形）
   */
  private cleanCanPickEffect() {
    this.showBtnOptEffect(false);
  }

  private showBtnOptEffect(show: boolean = true) {
    if (show) {
      this.btnLandOpt.getTransition("t0").play(null, -1);
      this.btnLandOpt.visible = true;
    } else {
      this.btnLandOpt.visible = false;
    }
  }

  public set info(value: FarmLandInfo) {
    if (this._info == value) return;
    this.clean();
    this.delLandListener(this._info);
    this._info = value;
    this.addLandListener(this._info);
    this.refreshView();
  }

  public get info(): FarmLandInfo {
    return this._info;
  }

  public get canHandleOneKey() {
    return this._info && this._info.canHandleOneKey;
  }

  public get canHandleClear() {
    return this._info && this._info.curOper == FarmOperateType.CLEAR;
  }

  /**
   * 是否已开启
   */
  public get isOpen(): boolean {
    return this._isOpen;
  }

  public set isOpen(value: boolean) {
    if (this._isOpen == value) return;
    this._isOpen = value;
    this.cOpen.selectedIndex = this._isOpen ? 1 : 0;
  }

  public set someVisible(value: boolean) {
    this.imgGrass2.alpha = value ? 1 : 0;
    this.imgCrop.visible = value;
  }

  private checkIsSelf(userId: number): boolean {
    return userId == this.thane.userId;
  }

  private get model(): FarmModel {
    return FarmManager.Instance.model;
  }

  private get farmManager(): FarmManager {
    return FarmManager.Instance;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  private get gold(): ResourceData {
    return ResourceManager.Instance.gold;
  }

  public dispose() {
    this.delLandListener(this._info);
    this.delEvent();
    super.dispose();
  }
}
