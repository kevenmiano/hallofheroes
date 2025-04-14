//@ts-expect-error: External dependencies
import UIButton from "../../../core/ui/UIButton";
import { CampaignEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { PlayerManager } from "../../manager/PlayerManager";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { CampaignManager } from "../../manager/CampaignManager";
import MineralModel from "../../mvc/model/MineralModel";
import { MineralCarInfo } from "../../map/campaign/data/MineralCarInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { ShopControler } from "../shop/control/ShopControler";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import MineralAwardCell from "./MineralAwardCell";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import Utils from "../../../core/utils/Utils";
import { isCNLanguage } from "../../../core/lang/LanguageDefine";
import { ActionUtils } from "../../action/ActionUtils";
/**
 * @author:pzlricky
 * @data: 2021-11-08 15:06
 * @description ***
 */
export default class MineralView extends BaseFguiCom {
  private show: fgui.Controller;
  private helpBtn: UIButton;
  private _awardBtn: fgui.GButton;
  private award: fgui.Controller;
  private list: fgui.GList;
  private cIsOversea: fgui.Controller;
  private txt_leftCount: fgui.GTextField;
  private title: fgui.GTextField;
  private txt_doubleTime: fgui.GTextField;
  private txt_mineral: fgui.GTextField;
  private txt_stone: fgui.GTextField;
  private rewardView: fgui.GGroup;
  public bgGrid: fgui.GGraph;

  private _showingAward: boolean = false;
  private _goodsList: Array<ShopGoodsInfo>;
  private carBtn: fgui.GButton;
  private _currentStatus: number = 0;
  public static GET_CAR: number = 1; //领取矿车状态
  public static HAND_IN: number = 2; //提交矿车状态
  private _aInfo: CampaignArmy;
  constructor(target: fgui.GComponent) {
    super(target);
    this.show = this.getController("show");
    this.award = this.getController("award");
    this.cIsOversea = this.getController("cIsOversea");
    this._awardBtn = this.UIObj.get("awardBtn") as fgui.GButton;
    this.carBtn = this.UIObj.get("carBtn") as fgui.GButton;
    this.show.on(fgui.Events.STATE_CHANGED, this, this.onShowChange);
    this.onRefresh();
  }

  private onShowChange() {
    this.view.width = this.bgGrid.width;
  }

  onRefresh() {
    this.show.selectedIndex = 0;
    this.award.selectedIndex = 0;
    this.cIsOversea.selectedIndex = isCNLanguage() ? 0 : 1;
    this._showingAward = false;
    this.offEvent();
    this.addEvent();
    this.__updateHandler();
    this.initAwardData();
  }

  private addEvent() {
    PlayerManager.Instance.addEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__updateHandler,
      this,
    );
    if (this.mineralModel)
      this.mineralModel.addEventListener(
        CampaignEvent.UPDATE_MINERAL_INFO,
        this.__updateHandler,
        this,
      );
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.helpBtn.onClick(this, this.__onHelpBtnHandler);
    this._awardBtn && this._awardBtn.onClick(this, this.__lookRewardHandler);
    this.carBtn && this.carBtn.onClick(this, this._carBtnHandler);
  }

  onStageClick(evt: Laya.Event) {
    let sourceTarget = evt.target["$owner"];
    if (this.rewardView.displayObject == sourceTarget) {
      evt.stopPropagation();
      return;
    }
    if (this._showingAward) {
      this.__lookRewardHandler(evt);
    }
    evt.stopPropagation();
  }

  private __lookRewardHandler(evt?: any) {
    this._showingAward = !this._showingAward;
    if (this._showingAward)
      Laya.stage.on(Laya.Event.CLICK, this, this.onStageClick);
    else Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
    if (this.award) {
      this.award.selectedIndex = this.award.selectedIndex == 0 ? 1 : 0;
    }
    evt.stopPropagation();
  }

  private renderListItem(index: number, item: MineralAwardCell) {
    item.cellData = this._goodsList[index];
  }

  private initAwardData(): void {
    this._goodsList = this.goodsList;
    this._goodsList.sort(this.shopControl.mineralShopGoodsSort);
    this.list.numItems = this._goodsList.length;
  }

  private get goodsList(): Array<any> {
    return this.shopControl.mineralShopGoods;
  }

  private get shopControl(): ShopControler {
    return FrameCtrlManager.Instance.getCtrl(
      EmWindow.MineralShopWnd,
    ) as ShopControler;
  }

  private __updateHandler() {
    if (!this.mineralModel || !this.selfCarInfo) {
      Logger.log(
        "-----------------___________----------------->>>找不到自身矿车信息",
      );
      return;
    }
    //剩余采集次数
    if (this.selfCarInfo.is_own == 1) {
      //有矿车
      this.txt_leftCount.text = LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.mineral.countText",
        5 - this.selfCarInfo.pick_count,
      );
      if (this.carBtn) {
        this.carBtn.title =
          LangManager.Instance.GetTranslation("mineraView.handInCar") +
          LangManager.Instance.GetTranslation(
            "public.parentheses1",
            this.getHandCount + "/" + this.mineralModel.maxCount,
          );
      }
      this._currentStatus = MineralView.HAND_IN;
    } else if (this.selfCarInfo.is_own == 0) {
      this.txt_leftCount.text = LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.mineral.countText",
        0,
      );
      if (this.carBtn) {
        this.carBtn.title =
          LangManager.Instance.GetTranslation("mineraView.getCar") +
          LangManager.Instance.GetTranslation(
            "public.parentheses1",
            this.getCarCount + "/" + this.mineralModel.maxCount,
          );
      }
      this._currentStatus = MineralView.GET_CAR;
    }
    if (this.mineralModel.activeTime > 0) {
      //n被收益
      this.title.text = LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.mineral.multititleText",
        this.mineralModel.multiple,
      );
      this.txt_doubleTime.text = LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.mineral.titleText2",
        this.mineralModel.multiple,
        "[color=#39a82d]" +
          Math.ceil(this.mineralModel.activeTime / 60) +
          "[/color]",
      );
    } else {
      //普通收益
      this.title.text = LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.mineral.titleText1",
      );
      this.txt_doubleTime.text = LangManager.Instance.GetTranslation(
        "map.campaign.view.ui.mineral.doubleText",
      );
    }
    //矿石
    this.txt_mineral.text = LangManager.Instance.GetTranslation(
      "map.campaign.view.physics.MineralCarView.minerals",
      this.selfCarInfo.minerals + "/200",
    );
    //紫晶
    this.txt_stone.text = LangManager.Instance.GetTranslation(
      "map.campaign.view.physics.MineralCarView.mineralsCount",
      this.playerInfo.mineral,
    );
  }

  private offEvent() {
    PlayerManager.Instance.removeEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__updateHandler,
      this,
    );
    if (this.mineralModel)
      this.mineralModel.removeEventListener(
        CampaignEvent.UPDATE_MINERAL_INFO,
        this.__updateHandler,
        this,
      );
    this.helpBtn.offClick(this, this.__onHelpBtnHandler);
    this._awardBtn && this._awardBtn.offClick(this, this.__lookRewardHandler);
    // this.list.itemRenderer && this.list.itemRenderer.recover();
    Utils.clearGListHandle(this.list);
    this.carBtn && this.carBtn.offClick(this, this._carBtnHandler);
  }

  private __onHelpBtnHandler() {
    let title = LangManager.Instance.GetTranslation(
      "map.campaign.view.ui.mineral.HelpFrameTitle",
    );
    let content = LangManager.Instance.GetTranslation(
      "map.campaign.view.ui.mineral.HelpFrameText",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  private _carBtnHandler() {
    var nextNode: CampaignNode;
    if (this._currentStatus == MineralView.GET_CAR) {
      //领取矿车
      nextNode = CampaignManager.Instance.mapModel.getMineraCardNode();
    } else if (this._currentStatus == MineralView.HAND_IN) {
      //提交矿车
      ActionUtils.cancelClollectActionDetection();
      nextNode = CampaignManager.Instance.mapModel.getMineraHandCardNode();
    }
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

  private get selfCarInfo(): MineralCarInfo {
    return CampaignManager.Instance.mineralModel.selfCarInfo;
  }

  private get mineralModel(): MineralModel {
    return CampaignManager.Instance.mineralModel;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get getCarCount(): number {
    return this.mineralModel.maxCount - this.selfCarInfo.get_count;
  }

  private get getHandCount(): number {
    return this.mineralModel.maxCount - this.selfCarInfo.hand_count;
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
