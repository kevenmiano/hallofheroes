/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:16:46
 * @LastEditTime: 2023-10-20 11:07:32
 * @LastEditors: jeremy.xu
 * @Description: 英灵竞技主界面
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { PetChallengeMainHeadItem } from "./item/PetChallengeMainHeadItem";
import { PetData } from "../pet/data/PetData";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import UIManager from "../../../core/ui/UIManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";
import { NotificationManager } from "../../manager/NotificationManager";
import PetChallengeData from "./PetChallengeData";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { PetChallengeEvent } from "../../constant/PetDefine";
import { IconFactory } from "../../../core/utils/IconFactory";
import { IconType } from "../../constant/IconType";
import { ArmyManager } from "../../manager/ArmyManager";
import { BaseIcon } from "../../component/BaseIcon";
import { VIPManager } from "../../manager/VIPManager";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import QueueItem from "../home/QueueItem";
import {
  BagEvent,
  NativeEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import ItemID from "../../constant/ItemID";
import { GoodsManager } from "../../manager/GoodsManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { PetChallengeFigureItem } from "./item/PetChallengeFigureItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";

export default class PetChallengeWnd extends BaseWindow {
  protected setSceneVisibleOpen: boolean = true;
  protected setOptimize: boolean = false;
  private itemHead: BaseIcon;
  private txtMyRankValue: fgui.GLabel;
  private txtScoreValue: fgui.GLabel;
  private txtTeamCapacityValue: fgui.GLabel;

  private txtOrderTime: fgui.GLabel;
  private gOrder: fgui.GGroup;
  private txtChallengeCnt: fgui.GLabel;

  private petItem1: PetChallengeMainHeadItem;
  private petItem2: PetChallengeMainHeadItem;
  private petItem3: PetChallengeMainHeadItem;
  private playerInfo: PlayerInfo;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;

    this.petItem1.onClick(this, this.onPetItemClick, [1]);
    this.petItem2.onClick(this, this.onPetItemClick, [2]);
    this.petItem3.onClick(this, this.onPetItemClick, [3]);

    this.addEvent();
    this.ctrl.requestChallengeData();

    this.refreshPetItemList();
    this.__refreshBuildOrder();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    this.delEvent();
  }

  private addEvent() {
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    this.model.buildingOrder.addEventListener(
      Laya.Event.CHANGE,
      this.__refreshBuildOrder,
      this,
    );
    this.playerInfo.addEventListener(
      PlayerEvent.PLAYER_PET_LIST_CHANGE,
      this.refreshPetItemList,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
    NotificationManager.Instance.addEventListener(
      PetChallengeEvent.CHALLENGE_TIME_CHANGE,
      this.__refreshBuildOrder,
      this,
    );
    NotificationManager.Instance.addEventListener(
      PetChallengeEvent.CHALLENGE_INFO_CHAGNE,
      this.__refreshChallengeInfo,
      this,
    );
  }

  private delEvent() {
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    Laya.timer.clear(this, this.refreshFigure);
    this.model.buildingOrder.removeEventListener(
      Laya.Event.CHANGE,
      this.__refreshBuildOrder,
      this,
    );
    this.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_PET_LIST_CHANGE,
      this.refreshPetItemList,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NativeEvent.AFTER_STATUS_BAR_CHANGE,
      this.onAfterStatusBarChange,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      PetChallengeEvent.CHALLENGE_TIME_CHANGE,
      this.__refreshBuildOrder,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      PetChallengeEvent.CHALLENGE_INFO_CHAGNE,
      this.__refreshChallengeInfo,
      this,
    );
  }

  private __bagItemUpdate(infos: GoodsInfo[]) {
    for (let info of infos) {
      if (info.templateId == ItemID.OUTLANDER_ORDER) {
        this.refresOutLanderAlert();
      }
    }
  }

  private __refreshBuildOrder() {
    // Logger.xjy("[PetChallengeWnd]__refreshBuildOrder")
    if (!this.model) return;

    this.refresOutLanderAlert();
    this.txtChallengeCnt.text = "" + this.model.buildingOrder.remainCount;

    if (this.model.buildingOrder.remainCount <= 0) {
      this.txtChallengeCnt.text = "0";
    }

    this.txtOrderTime.text = DateFormatter.getCountDate(
      this.model.buildingOrder.remainTime,
    );
    if (this.model.buildingOrder.remainTime > 0) {
      this.gOrder.visible = true;
    } else {
      this.gOrder.visible = false;
      UIManager.Instance.HideWind(EmWindow.VipCoolDownFrameWnd);
    }
  }

  //刷新 出战英灵列表 按战斗力排序
  private refreshPetItemList() {
    let petlist: PetData[] = [];
    for (
      let index = 0;
      index < this.playerInfo.petChallengeFormationOfArray.length;
      index++
    ) {
      const id = this.playerInfo.petChallengeFormationOfArray[index];
      if (!id) continue;
      let petData: PetData = this.playerInfo.getPet(Number(id));
      if (petData) {
        petlist.push(petData);
      }
    }

    petlist = ArrayUtils.sortOn(
      petlist,
      ["fightPower"],
      [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING],
    );

    let totalFightPower = 0;
    for (let index = 0; index < PetChallengeData.CARRY_PET_CNT; index++) {
      this["petItem" + (index + 1)].info = petlist[index];
      if (petlist[index]) {
        totalFightPower += petlist[index].fightPower;
      }
    }
    this.model.totalFightPower = totalFightPower;
    this.txtTeamCapacityValue.text = totalFightPower.toString();
  }

  private __refreshChallengeInfo() {
    this._refreshFigureCnt = 0;
    Laya.timer.clear(this, this.refreshFigure);
    Laya.timer.loop(100, this, this.refreshFigure);
    this.refresSelfInfo();
  }

  private _refreshFigureCnt = 0;
  private refreshFigure() {
    let challengeList = this.model.getChallengeListExceptSelf();
    (
      this[
        "itemFigure" + (this._refreshFigureCnt + 1)
      ] as PetChallengeFigureItem
    ).info = challengeList[this._refreshFigureCnt];
    this._refreshFigureCnt++;
    if (this._refreshFigureCnt >= challengeList.length) {
      Laya.timer.clear(this, this.refreshFigure);
    }
  }

  public refresSelfInfo() {
    this.txtMyRankValue.text =
      this.model.ranking <= 0
        ? LangManager.Instance.GetTranslation(
            "colosseum.view.ColosseumPlayerItem.newPeople",
          )
        : this.model.ranking;
    this.txtScoreValue.text = this.model.score;
    this.txtTeamCapacityValue.text = this.model.totalFightPower;
    this.itemHead.icon = IconFactory.getPlayerIcon(
      ArmyManager.Instance.thane.snsInfo.headId,
      IconType.HEAD_ICON,
    );
  }

  private refresOutLanderAlert() {
    let num: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.OUTLANDER_ORDER,
    );

    let content: string = LangManager.Instance.GetTranslation(
      "PetChallenge.notEnoughOutLander01",
      this.model.buildingOrder.remainCount,
    );
    let goodsCount: string =
      LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
    let params = {
      content: content,
      goodsId: ItemID.OUTLANDER_ORDER,
      goodsCount: goodsCount,
      autoClose: !this.notAutoCloseUseGoodAlert(),
    };
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.USE_PROP,
      params,
    );
  }

  private onPetItemClick(index: number) {
    if (this["petItem" + index] && this["petItem" + index].info) {
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.PetChallengeAdjust);
  }

  private btnTeamFormationClick() {
    FrameCtrlManager.Instance.open(EmWindow.PetChallengeAdjust);
  }

  private btnEventClick() {
    FrameCtrlManager.Instance.open(EmWindow.PetChallengeEvent);
  }

  private btnRankClick() {
    FrameCtrlManager.Instance.open(EmWindow.PetChallengeRank);
  }

  private btnRewardsClick() {
    FrameCtrlManager.Instance.open(EmWindow.PetChallengeReward);
  }

  private btnOrderCoolClick() {
    let order = this.model.buildingOrder;
    if (!order || order.remainTime <= 0) return;

    if (VIPManager.Instance.model.vipCoolPrivilege) {
      this.__btnOrderCoolClick(true, order.orderId);
    } else {
      let cfgItemChallenge = TempleteManager.Instance.getConfigInfoByConfigName(
        "QuickCoolChallenge_Price",
      );
      let cfgItemChallengeValue = 1;
      if (cfgItemChallenge) {
        //挑战
        cfgItemChallengeValue = Number(cfgItemChallenge.ConfigValue);
      }
      let point = cfgItemChallengeValue * Math.ceil(order.remainTime / 60);
      UIManager.Instance.ShowWind(EmWindow.VipCoolDownFrameWnd, {
        type: QueueItem.QUEUE_TYPE_ALCHEMY,
        orderId: order.orderId,
        pointNum: point,
        backFun: this.__btnOrderCoolClick.bind(this),
      });
    }
  }

  private __btnOrderCoolClick(
    b: boolean,
    id: number = 0,
    type: number = 0,
    useBind: boolean = true,
  ) {
    if (b) {
      this.ctrl.coolDownChallengeCD(useBind);
    }
  }

  private btnAddChallengeCntClick() {
    let content: string = LangManager.Instance.GetTranslation(
      "PetChallenge.notEnoughOutLander01",
      this.model.buildingOrder.remainCount,
    );
    let num: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.OUTLANDER_ORDER,
    );
    let goodsCount: string =
      LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
    UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
      autoClose: !this.notAutoCloseUseGoodAlert(),
      content: content,
      goodsId: ItemID.OUTLANDER_ORDER,
      goodsCount: goodsCount,
      callback: this.useGoodeCallBack.bind(this),
    });
  }

  private useGoodeCallBack(b: boolean) {
    if (!b) return;

    let pos = this.model.getOutLanderOrderPos();
    if (pos == -1) {
      let info: ShopGoodsInfo =
        TempleteManager.Instance.getShopTempInfoByItemId(
          ItemID.OUTLANDER_ORDER,
        );
      if (info && info.OneDayCount - info.OneCurrentCount > 0) {
        UIManager.Instance.HideWind(EmWindow.UseGoodsAlert);
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
          info: info,
          count: 1,
        });
      } else {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "PetChallenge.notEnoughOutLander02",
          ),
        );
      }
    } else {
      SocketSendManager.Instance.sendUseItem(pos);
    }
  }

  private notAutoCloseUseGoodAlert() {
    let num: number = GoodsManager.Instance.getGoodsNumByTempId(
      ItemID.OUTLANDER_ORDER,
    );

    let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(
      ItemID.OUTLANDER_ORDER,
    );
    let canBuy = info && info.OneDayCount - info.OneCurrentCount > 0;

    return num > 1 || canBuy;
  }

  private closeBtnClick() {
    this.hide();
  }

  private helpBtnClick() {
    let title: string = LangManager.Instance.GetTranslation(
      "PetChallengeFrame.helpBtnTip",
    );
    let grade: number = VIPManager.Instance.model.getMinGradeHasPrivilege(
      VipPrivilegeType.PET_ARENA_WAIT,
    );
    let content: string = LangManager.Instance.GetTranslation(
      "PetChallengeFrame.helpContent",
      grade,
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }
}
