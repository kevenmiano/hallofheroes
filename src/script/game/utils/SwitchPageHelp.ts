/**
 * 页面跳转类
 * @author Chance
 * **/
import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import UIManager from "../../core/ui/UIManager";
import { BattleManager } from "../battle/BattleManager";
import { DisplayObject } from "../component/DisplayObject";
import { t_s_campaignData } from "../config/t_s_campaign";
import { t_s_composeData } from "../config/t_s_compose";
import { t_s_rewardcondictionData } from "../config/t_s_rewardcondiction";
import { ConfigType } from "../constant/ConfigDefine";
import {
  NotificationEvent,
  SpaceEvent,
} from "../constant/event/NotificationEvent";
import GTabIndex from "../constant/GTabIndex";
import OpenGrades from "../constant/OpenGrades";
import { RewardConditionType } from "../constant/RewardConditionType";
import { EmWindow } from "../constant/UIDefine";
import { ArmyPawn } from "../datas/ArmyPawn";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { CampaignManager } from "../manager/CampaignManager";
import { CampaignSocketOutManager } from "../manager/CampaignSocketOutManager";
import { DataCommonManager } from "../manager/DataCommonManager";
import { FarmManager } from "../manager/FarmManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { MopupManager } from "../manager/MopupManager";
import { NotificationManager } from "../manager/NotificationManager";
import OfferRewardManager from "../manager/OfferRewardManager";
import { PlayerManager } from "../manager/PlayerManager";
import RingTaskManager from "../manager/RingTaskManager";
import { RoomManager } from "../manager/RoomManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import { WorldBossSocketOutManager } from "../manager/WorldBossSocketOutManager";
import BuildingManager from "../map/castle/BuildingManager";
import BuildingType from "../map/castle/consant/BuildingType";
import { BuildInfo } from "../map/castle/data/BuildInfo";
import { CrossMapSearchActionQueue } from "../map/crossmapsearch/CrossMapSearchActionQueue";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import SpaceNodeType from "../map/space/constant/SpaceNodeType";
import { CampaignNode } from "../map/space/data/CampaignNode";
import SpaceManager from "../map/space/SpaceManager";
import { SpaceSocketOutManager } from "../map/space/SpaceSocketOutManager";
import ForgeData from "../module/forge/ForgeData";
import BaseOfferReward from "../module/offerReward/BaseOfferReward";
import OfferRewardTemplate from "../module/offerReward/OfferRewardTemplate";
import { RingTask } from "../module/ringtask/RingTask";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import { ShopModel } from "../module/shop/model/ShopModel";
import { TaskTemplate } from "../module/task/TaskTemplate";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import { RoomInfo } from "../mvc/model/room/RoomInfo";
import { WorldBossHelper } from "./WorldBossHelper";

export class SwitchPageHelp {
  constructor() {}
  public static skipPageByTaskCondictionType(
    data: any,
    func: Function,
    target: any
  ) {
    let str: string = LangManager.Instance.GetTranslation(
      "yishi.SwitchPageHelp.taskNotFinish"
    );
    if (data instanceof TaskTemplate) {
      let conTask: any[] = (<TaskTemplate>data).conditionList;
      if (!conTask[0].hasOwnProperty("CondictionType")) return;
      if (conTask[0]["Para4"] != "0" && conTask[0].CondictionType != 96) {
        //多人副本协助玩家杀怪任务96特殊处理
        SwitchPageHelp.walkToCrossMapTarget(conTask[0]["Para4"]);
        return;
      }
      switch (conTask[0].CondictionType) {
        case 1: //领主相关
          MessageTipManager.Instance.show(str);
          break;
        case 2: //建筑/科技
          if (conTask[0].hasOwnProperty("Para1"))
            SwitchPageHelp.gotoBuildingFrame(conTask[0].Para1);
          break;
        case 3: //招募兵种
          SwitchPageHelp.gotoCasernFrame();
          break;
        case 7: //占领野矿
          if (SceneManager.Instance.currentType == SceneType.CASTLE_SCENE) {
            SwitchPageHelp.gotoOuterCity();
          } else if (
            SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE
          ) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation("tip.outercity")
            ); //
          }
          break;
        case 8: //掠夺城镇
          if (SceneManager.Instance.currentType == SceneType.CASTLE_SCENE) {
            SwitchPageHelp.gotoOuterCity();
          } else if (
            SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE
          ) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation("tip.outercity")
            );
          }
          break;
        case 9: //传送
          SwitchPageHelp.gotoWorldMapFrame();
          break;
        case 10: //兵种升级
          if (conTask[0].hasOwnProperty("Para1"))
            SwitchPageHelp.gotoUpgradePawnFrame(conTask[0].Para1);
          break;
        case 11: //使用道具
        case 12: //加速
          MessageTipManager.Instance.show(str);
          break;
        case 13: //击杀副本怪物
          if (conTask[0].hasOwnProperty("Para3"))
            SwitchPageHelp.gotoCampaignById(conTask[0].Para3);
          break;
        case 14: //通关副本
          if (conTask[0].hasOwnProperty("Para3"))
            SwitchPageHelp.gotoCampaignById(conTask[0].Para3);
          break;
        case 16: //竞技场战斗
          SwitchPageHelp.gotoPvpFrame();
          break;
        case 17: //强化
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
          break;
        case 18: //镶嵌
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XQ);
          break;
        case 19: //合成
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_HC, conTask[0].Para1);
          break;
        case 20: //浇水
          // gotoFarmFrame();
          break;
        case 21: //添加好友
          SwitchPageHelp.gotoFriendFrame();
          break;
        case 22: //加入公会
          this.gotoConsortiaFrame(1);
          break;
        case 23: //新手进度
          SwitchPageHelp.walkNext(); //任务面板对应页
          break;
        case 24: //通过副本节点
        case 25: //战斗中杀怪
        case 26: //战斗中杀BOSS
        case 27: //收集怪物掉落物品
        case 28: //收集BOSS掉落物品
          if (conTask[0].hasOwnProperty("Para3"))
            SwitchPageHelp.gotoCampaignById(conTask[0].Para3);
          break;
        case 29: //公会贡献
          this.gotoConsortiaFrame(2);
          break;
        case 30: //公会祈福
          // gotoConsortiaFrame(4);
          break;
        case 31: //通关战役
          if (conTask[0].hasOwnProperty("Para1")) {
            if (conTask[0].Para1 == 1) {
              SwitchPageHelp.gotoSingleCampaign();
            } else if (conTask[0].Para1 > 1) {
              SwitchPageHelp.gotoHeroDoor();
            }
          }
          break;
        case 32: //收集任务
          if (SwitchPageHelp.checkCollectCampaign)
            SwitchPageHelp.walkNext(
              SwitchPageHelp.getCollectNodeIdByGoodId(Number(conTask[0].Para1))
            );
          else SwitchPageHelp.gotoCollectScene(data);
          break;
        case 34: //阵型调整
          SwitchPageHelp.gotoLineupFrame();
          break;
        case 35: //离线挑战
          SwitchPageHelp.gotoColosseumFrame();
          break;
        case 36: //占星
          this.gotoStarFrame();
          break;
        case 37: //所在地图
          func && func.call(target); //任务面板对应页
          break;
        case 38: //无限塔
          SwitchPageHelp.gotoMazeFrame();
          break;
        case 39: //二次登录
          MessageTipManager.Instance.show(str);
          break;
        case 40: //击杀世界boss次数
        case 41: //世界boss累计伤害
          this.gotoWorldBossFrame();
          break;
        case 42: //征收
          SwitchPageHelp.gotoOfficeFrame();
          break;
        case 43: //充值
          // RechargeAlertMannager.navigateToRechargePage();
          break;
        case 44: //参与阵营战
        case 45: //战场击杀
          this.gotoWorldFightFrame();
          break;
        case 46: //装备分解
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_FJ);
          break;
        case 47: //装备洗练
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XL);
          break;
        case 48: //手机验证
          func && func.call(target); //任务面板对应页
          break;
        case 49: //物品上缴
          MessageTipManager.Instance.show(str);
          break;
        case 50: //阵营战胜利次数
          // gotoWorldFightFrame();
          break;
        case 51: //公会养成任务
          SwitchPageHelp.gotoConsortiaFrame();
          break;
        case 52: //兵种特性领悟
          break;
        case 53: //星运锁定
          SwitchPageHelp.gotoStarBagFrame();
          break;
        case 54: //悬赏任务完成次数
          SwitchPageHelp.gotoOfferRewardFrame();
          break;
        case 55: //用户活跃度
          SwitchPageHelp.gotoDayGuideFrame();
          break;
        case 56: //拍卖
          SwitchPageHelp.gotoMarkeFrame();
          break;
        case 57: //科技轮盘操作
          SwitchPageHelp.gotoSeminaryFrame();
          break;
        case 58: //灵魂刻印
          SwitchPageHelp.gotoBagFrame();
          break;
        //  case 59://农场种植
        case 60: //农场收获
          //  case 61://农场除虫,除草
          FarmManager.Instance.showFriendList = true;
          this.gotoFarmFrame();

          break;
        case 63: //VIP用户活跃度
          SwitchPageHelp.gotoDayGuideFrame();
          break;
        case 71: //坐骑培养
          this.gotoMounts();
          break;
        case 74: //试练之塔
          SwitchPageHelp.gotoHeroDoor();
          break;
        case 76: //符文学习
        case 77: //符文书吞噬
        case 78: //符文升级
          SwitchPageHelp.gotoRunnesSkill();
          break;
        case 79: //参与载具
        case 80: //载具胜利
          // gotoVehicleRoom();
          break;
        case 81: //载具数量
          // gotoVehicleBuild();
          break;
        case 90:
          SwitchPageHelp.openBattleGuardFrame();
          break;
        case 91: //寻宝之轮
          // gotoTreasureHunt();
          break;
        case 92:
          //挑战之路
          SwitchPageHelp.challengeSelf((<TaskTemplate>data).TemplateId);
          break;
        default:
          func && func.call(target); //任务面板对应页
          break;
      }
    } else if (data instanceof BaseOfferReward) {
      let conOffer: any[] = (<BaseOfferReward>data).conditionList;
      switch (conOffer[0].CondictionType) {
        case 1: //招募兵种
          SwitchPageHelp.gotoCasernFrame();
          break;
        case 2: //强化
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
          break;
        case 3: //镶嵌
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XQ);
          break;
        case 4: //采集
          if (SwitchPageHelp.checkCollectCampaign)
            SwitchPageHelp.walkNext(
              SwitchPageHelp.getCollectNodeIdByGoodId(conOffer[0].Para1)
            );
          else SwitchPageHelp.gotoCollectScene(data);
          break;
        case 5: //神树充能
          this.gotoFarmFrame();
          break;
        case 6: //占星
          this.gotoStarFrame();
          break;
        case 7: //讨伐魔物
          if (!SwitchPageHelp.checkScene()) return;
          FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd);
          break;
        case 9: //公会贡献
          if (
            PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID ==
            0
          ) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "dayGuide.DayGuideManager.command05"
              )
            );
            return;
          }
          this.gotoConsortiaFrame(2);
          break;
        case 10: //合成
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_HC_ZB);
          break;
        case 11: //商城消费
          SwitchPageHelp.gotoShopFrame();
          break;
        case 12: //QTE训练
          // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.QTE, showQte, [data]);
          break;
        case 13: //触发战斗
        case 14: //触发战斗
          SwitchPageHelp.goArrest(data.conditionList);
          break;
        case 15: //打地鼠
          // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.HAMSTER, showHamster, [data]);
          break;
        default:
          func && func.call(target); //任务面板对应页
          break;
      }
    } else if (data instanceof RingTask) {
      let conRing: any[] = (<RingTask>data).conditionList;
      let ringtask: RingTask = RingTaskManager.Instance.getRingTask();
      switch (conRing[0].CondictionType) {
        case RewardConditionType.GIVE_PAWNS: //缴兵
          SwitchPageHelp.gotoCasernFrame();
          break;
        case RewardConditionType.STRENGTHEN: //装备强化
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
          break;
        case RewardConditionType.MOSAIC: //镶嵌宝石
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XQ);
          break;
        case RewardConditionType.COLLECTION: //采集
          NotificationManager.Instance.dispatchEvent(
            NotificationEvent.DISPOSEVIEW
          );
          SwitchPageHelp.walkToCrossMapTarget(conRing[0].Para4); //"10000,5"
          break;
          break;
        case RewardConditionType.CHARGE: //神树充能
          this.gotoFarmFrame();
          break;
        case RewardConditionType.ASTROLOGY: //占星
          this.gotoStarFrame();
          break;
        case RewardConditionType.DONATE: //公会捐献
          if (
            PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID ==
            0
          ) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "dayGuide.DayGuideManager.command05"
              )
            );
            return;
          }
          this.gotoConsortiaFrame(2);
          break;
        case RewardConditionType.SYNTHESIS: //合成物品
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_HC);
          break;
        case RewardConditionType.CONSUME: //商城消费
          SwitchPageHelp.gotoShopFrame();
          break;
        case RewardConditionType.QTE: //进行qte
          // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.QTE, showQte, [data]);
          break;
        case RewardConditionType.HAMSTER_GAME: //打地鼠
          // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.HAMSTER, showHamster, [data]);
          break;
        case RewardConditionType.TALKTASK: //送信、对话
          NotificationManager.Instance.dispatchEvent(
            NotificationEvent.DISPOSEVIEW
          );
          SwitchPageHelp.walkToCrossMapTarget(conRing[0].Para4); //"10000,5|20001,2000149"
          break;
        case RewardConditionType.KILLPETMONSTER: //击杀宠物岛英灵
          NotificationManager.Instance.dispatchEvent(
            NotificationEvent.DISPOSEVIEW
          );
          SwitchPageHelp.walkToCrossMapTarget(conRing[0].Para4); //"10000,5"
          break;
        case RewardConditionType.KILLDUPLICATEMONSTER: //击杀副本怪物
          NotificationManager.Instance.dispatchEvent(
            NotificationEvent.DISPOSEVIEW
          );
          SwitchPageHelp.gotoCampaignById(ringtask.currTask.condition_2);
          break;
        case RewardConditionType.COMMITITEM: //提交物品
          this.openShop(ringtask.currTask.condition_2);
          break;
        case RewardConditionType.PETSACRIFICE: //英灵祭献
          // openPetFrame();
          break;
        case RewardConditionType.RESIDENTTASK:
          if (MopupManager.Instance.model.isMopup) {
            let str2: string = LangManager.Instance.GetTranslation(
              "mopup.MopupManager.mopupTipData01"
            );
            MessageTipManager.Instance.show(str2);
            return;
          }
          SwitchPageHelp.walkToCrossMapTarget("10000,17"); //conRing[0].Para4
          break;
        default:
          func && func.call(target); //任务面板对应页
          break;
      }
    } else if (data instanceof OfferRewardTemplate) {
      let conOffer: any[] = data.conditionList;
      switch (conOffer[0].CondictionType) {
        case 1: //招募兵种
          SwitchPageHelp.gotoCasernFrame();
          break;
        case 2: //强化
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
          break;
        case 3: //镶嵌
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_XQ);
          break;
        case 4: //采集
          if (SwitchPageHelp.checkCollectCampaign)
            SwitchPageHelp.walkNext(
              SwitchPageHelp.getCollectNodeIdByGoodId(conOffer[0].Para1)
            );
          else SwitchPageHelp.gotoCollectScene(data);
          break;
        case 5: //神树充能
          this.gotoFarmFrame();
          break;
        case 6: //占星
          this.gotoStarFrame();
          break;
        case 7: //讨伐魔物
          if (!SwitchPageHelp.checkScene()) return;
          FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd);
          break;
        case 9: //公会贡献
          if (
            PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID ==
            0
          ) {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "dayGuide.DayGuideManager.command05"
              )
            );
            return;
          }
          this.gotoConsortiaFrame(2);
          break;
        case 10: //合成
          SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_HC_ZB);
          break;
        case 11: //商城消费
          SwitchPageHelp.gotoShopFrame();
          break;
        case 12: //QTE训练
          // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.QTE, showQte, [data]);
          break;
        case 13: //触发战斗
        case 14: //触发战斗
          SwitchPageHelp.goArrest(data.conditionList);
          break;
        case 15: //打地鼠
          // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.HAMSTER, showHamster, [data]);
          break;
        default:
          func && func.call(target); //任务面板对应页
          break;
      }
    }
  }

  private static openBattleGuardFrame() {
    UIManager.Instance.ShowWind(EmWindow.SRoleWnd, { openBattleGuard: true });
    FrameCtrlManager.Instance.open(EmWindow.BagWnd, null, false);
  }

  private static get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  /**
   * 挑战镜像
   */
  private static challengeSelf(tid: number) {
    let curScene: string = SceneManager.Instance.currentType;
    switch (curScene) {
      case SceneType.CAMPAIGN_MAP_SCENE:
      case SceneType.BATTLE_SCENE:
      case SceneType.EMPTY_SCENE:
      case SceneType.PVE_ROOM_SCENE:
      case SceneType.PVP_ROOM_SCENE:
        let str: string = LangManager.Instance.GetTranslation(
          "task.TaskFrameII.command01"
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
    SocketSendManager.Instance.challengeSelf(tid);
  }

  /**
   *  外城
   *
   */
  public static gotoOuterCity() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "mainBar.MainToolBar.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    SceneManager.Instance.setScene(SceneType.OUTER_CITY_SCENE);
  }

  /**
   * 打开前往缉捕
   *
   * @param conditionList
   */
  private static goArrest(conditionList: t_s_rewardcondictionData[]) {
    let curScene: string = SceneManager.Instance.currentType;
    switch (curScene) {
      case SceneType.CAMPAIGN_MAP_SCENE:
      case SceneType.BATTLE_SCENE:
      case SceneType.EMPTY_SCENE:
      case SceneType.PVE_ROOM_SCENE:
      case SceneType.PVP_ROOM_SCENE:
        let str: string = LangManager.Instance.GetTranslation(
          "task.TaskFrameII.command02"
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
    if (conditionList) {
      OfferRewardManager.Instance.sendRewardArrest(
        conditionList[0].CondictionType,
        conditionList[0].Para1
      );
    }
  }
  // 		/**
  // 		 * 打开QTE
  // 		 * @param data
  // 		 *
  // 		 */
  // 		private static showQte(arr:any[])
  // 		{
  // 			let qte:QTETraining = new QTETraining(arr[0].conditionList[0].Para2, arr[0].conditionList[0].Para1*1000, qteSucceedCall);
  // 			qte.show();
  // 			function qteSucceedCall()
  // 			{
  // 				if(arr[0])
  // 					arr[0].qteResult = true;
  // 			}
  // 		}
  // 		/**
  // 		 * 打开打地鼠
  // 		 * @param data
  // 		 *
  // 		 */
  // 		private static showHamster(arr:any[])
  // 		{
  // 			let hamsterGame:HamsterGameFrame = new HamsterGameFrame(arr[0].conditionList[0].Para1,arr[0].conditionList[0].Para2,_hamsterGameSucceed);
  // 			hamsterGame.show();
  // 			function _hamsterGameSucceed()
  // 			{
  // 				if(arr[0])
  // 					arr[0].hamsterGameResult = true;
  // 			}
  // 		}
  /**
   * 检查是否采集本
   */
  private static get checkCollectCampaign(): boolean {
    if (
      SwitchPageHelp.mapModel &&
      WorldBossHelper.checkCrystal(SwitchPageHelp.mapModel.mapId)
    )
      return true;
    return false;
  }
  /**
   * 通过物品ID得到采集节点ID
   * @param goodId
   * @return
   *
   */
  private static getCollectNodeIdByGoodId(goodId: number): number {
    switch (goodId) {
      case 2100022:
        return 600108;
        break;
      case 2100023:
        return 600113;
        break;
      case 2100024:
        return 600107;
        break;
      default:
        return -1;
    }
  }
  /**
   * 前往采集
   */
  public static gotoCollectScene(info: any) {
    let str: string;
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      if (WorldBossHelper.checkCrystal(SwitchPageHelp.mapModel.mapId))
        str = LangManager.Instance.GetTranslation("task.TaskFrameII.command03");
      else
        str = LangManager.Instance.GetTranslation("task.TaskFrameII.command01");
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.army.onVehicle) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips")
      );
      return;
    }
    let campaignTemp: t_s_campaignData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_campaign,
      info.NeedFightId
    );
    WorldBossSocketOutManager.sendWorldBossCmd(campaignTemp.CampaignId);
  }
  /**
   * 打开英雄之门
   */
  public static gotoHeroDoor() {
    let str: string;
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVE_ROOMLIST);
  }
  /**
   * 打开战役
   *
   */
  public static gotoSingleCampaign() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.PVE_CAMPAIGN) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.PVE_CAMPAIGN
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd);
  }
  /**
   * 副本中点击任务追踪, 走到下一节点
   * @param nodeId
   *
   */
  private static walkNext(nodeId: number = 0) {
    if (nodeId < 0) return;
    if (nodeId == 0) {
      if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
        let str: string = LangManager.Instance.GetTranslation(
          "emailII.view.ReadBattleReportView.command01"
        );
        MessageTipManager.Instance.show(str);
        return;
      }
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.WORK_NEXT_NODE,
        null
      );
    } else {
      if (!SwitchPageHelp.mapModel) return;
      let targetNode: CampaignNode =
        SwitchPageHelp.mapModel.getMapNodeByNodeId(nodeId);
      if (!targetNode || !targetNode.info) return;
      let mapView = CampaignManager.Instance.mapView;
      if (!mapView) return;
      SwitchPageHelp.mapModel.selectNode = targetNode;
      let targetView: DisplayObject = mapView.getNpcNodeById(
        targetNode.info.id
      );
      CampaignManager.Instance.controller.moveArmyByPos(
        targetView.x,
        targetView.y,
        false,
        true
      );
    }
  }

  /**
   * 跨地图寻路到目标点
   * @param target
   *
   */
  public static walkToCrossMapTarget(
    target: string,
    position: Laya.Point = null
  ) {
    CrossMapSearchActionQueue.Instance.clean();
    let mapArr: any[] = target.split("|");
    let path: any[] = [];
    for (let i: number = 0; i < mapArr.length; i++) {
      let mapStr: string = mapArr[i];
      let mapPoint: any[] = mapStr.split(",");
      path.push({
        mapId: parseInt(mapPoint[0].toString()),
        nodeId: parseInt(mapPoint[1].toString()),
      });
    }
    let fromMapId: number = 0;
    let targetNode: any = path[path.length - 1];
    let currentScene: string = SceneManager.Instance.currentType;
    let needSwitch: boolean = false;
    if (
      currentScene == SceneType.CASTLE_SCENE ||
      currentScene == SceneType.FARM ||
      currentScene == SceneType.OUTER_CITY_SCENE
    ) {
      needSwitch = true;
      fromMapId = 10000;
    } else if (currentScene == SceneType.SPACE_SCENE) {
      //在天空之城
      fromMapId = 10000;
    } else if (currentScene == SceneType.CAMPAIGN_MAP_SCENE) {
      let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
      if (!mapModel) return;
      fromMapId = mapModel.mapId;
    } else {
      return;
    }
    path = [];
    if (fromMapId != targetNode.mapId) {
      let p: any[] = CrossMapSearchActionQueue.Instance.searchPath(
        fromMapId,
        targetNode.mapId
      );
      if (!p) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation("task.TaskFrameII.command01")
        );
        return;
      }
      for (const key in p) {
        if (Object.hasOwnProperty.call(p, key)) {
          let obj: any = p[key];
          path.push({ mapId: obj.from, nodeId: obj.by });
        }
      }
    }
    path.push(targetNode);
    for (let j: number = 0; j < path.length; j++) {
      let crossMapSearchAction = Laya.ClassUtils.getClass(
        "CrossMapSearchAction"
      );
      let action = new crossMapSearchAction();
      action.mapId = parseInt(path[j].mapId);
      action.toPoint = parseInt(path[j].nodeId);
      if (j == path.length - 1 && position) {
        action.toPosition = position;
      }
      CrossMapSearchActionQueue.Instance.addAction(action, needSwitch);
    }
    if (needSwitch) {
      SwitchPageHelp.enterToSpace();
    }
  }

  private static get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }
  /**
   * 根据副本id跳到英雄之门或者战役
   * @param campaignId
   *
   */
  public static gotoCampaignById(campaignId: number) {
    let str: string = "";
    if (MopupManager.Instance.model.isMopup) {
      //扫荡中。返回
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (campaignId == 0) SwitchPageHelp.gotoHeroDoor(); //任务条件列表中多人本配了英雄和普通的id, 暂此处理
    let currentTem: t_s_campaignData =
      ConfigMgr.Instance.campaignTemplateDic[campaignId];
    if (!currentTem) currentTem = ConfigMgr.Instance.worldBossDic[campaignId];
    if (!currentTem) currentTem = ConfigMgr.Instance.pvpWarFightDic[campaignId];

    if (currentTem == null) {
      //无此副本信息
      return;
    }
    if (
      currentTem.Capacity == 1 &&
      SwitchPageHelp.mapModel &&
      SwitchPageHelp.mapModel.campaignTemplate &&
      SwitchPageHelp.mapModel.campaignTemplate.CampaignId == campaignId
    ) {
      //处于当前单人本, 走到下一节点
      SwitchPageHelp.walkNext();
      return;
    }
    if (!SwitchPageHelp.checkScene()) return; //处于其它副本地图中,返回
    if (currentTem.Capacity > 1) {
      // 多人本
      SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVE_ROOMLIST);
    } else if (currentTem.Capacity == 1) {
      //单人本
      if (ArmyManager.Instance.thane.grades < currentTem.MinLevel) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "yishi.SwitchPageHelp.gotoCampaignById.levelLimit"
          )
        );
        return;
      }
      if (WorldBossHelper.checkMaze2(currentTem.CampaignId)) {
        //切换到内城
        if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
          SceneManager.Instance.setScene(SceneType.CASTLE_SCENE, {
            isOpenPetMaze2: true,
          });
        } else if (
          SceneManager.Instance.currentType == SceneType.CASTLE_SCENE
        ) {
          FrameCtrlManager.Instance.open(EmWindow.MazeFrameWnd);
        }
      } else {
        // AudioManager.Instance.playSound(SoundIds.CAMPAIGN_OUTERCITY_STAR_SOUND, 1);
        // AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND, 1);
        FrameCtrlManager.Instance.open(EmWindow.PveCampaignWnd, {
          campaignData: currentTem,
        });
      }
    }
  }

  /**
   * 跳转到相应士兵升级界面
   * @param pawnMasterType
   *
   */
  public static gotoUpgradePawnFrame(pawnMasterType: number) {
    // AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    let army: ArmyPawn =
      ArmyManager.Instance.getCasernPawnByMastertype(pawnMasterType);
    FrameCtrlManager.Instance.open(EmWindow.PawnLevelUp, army);
  }
  /**
   *  打开公会界面
   * @param type: (0.公会搜索、1.公会主界面、2.公会捐献、3.公会建筑、4.公会祈福、5.公会技能、6.公会信息、7.公会仓库宝箱分配)
   */
  public static gotoConsortiaFrame(type: number = 1) {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 1);
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.CONSORTIA) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.CONSORTIA
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (type == 1) {
      if (
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
      ) {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
      } else {
        FrameCtrlManager.Instance.open(EmWindow.Consortia);
      }
    } else if (type == 2) {
      if (
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
      ) {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
      } else {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute);
      }
    }
  }
  /**
   * 打开占星
   *
   */
  public static gotoStarFrame() { //跳转到占星
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.STAR) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.STAR
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.Star);
  }
  /**
   * 打开商城界面
   *
   */
  public static gotoShopFrame(
    pageIndex: number = 0 //跳转到商城
  ) {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    if (ArmyManager.Instance.thane.grades < OpenGrades.SHOP) {
      let str: string = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.SHOP
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: pageIndex });
  }
  /**
   * 打开背包
   *
   */
  public static gotoBagFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 1);
    FrameCtrlManager.Instance.open(EmWindow.SRoleWnd, { openJewel: true });
  }
  /**
   * 打开世界boss
   *
   */
  public static gotoWorldBossFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 1);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.WORLD_BOSS) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.WORLD_BOSS
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!this.checkScene()) return;
    if (!this.playerInfo.worldbossState) {
      str = LangManager.Instance.GetTranslation(
        "YiShi.SwitchPageHelp.WorldBoss"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.WorldBossWnd);
  }
  /**
   * 打开战场
   *
   */
  public static gotoWorldFightFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.RVR) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.RVR
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!this.checkScene()) return;
    if (!this.worldFightState) {
      str = LangManager.Instance.GetTranslation(
        "YiShi.SwitchPageHelp.warFight"
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    FrameCtrlManager.Instance.open(EmWindow.RvrBattleWnd);
  }

  private static get worldFightState(): boolean {
    let dic = ConfigMgr.Instance.pvpWarFightDic;
    for (const key in dic) {
      if (Object.prototype.hasOwnProperty.call(dic, key)) {
        let bossTemp: t_s_campaignData = dic[key];
        if (
          bossTemp.state == 0 &&
          WorldBossHelper.checkPvp(bossTemp.CampaignId)
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 打开日常活动
   *
   */
  private static gotoDayGuideFrame() { //跳转活跃度
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.WELFARE) {
      str = LangManager.Instance.GetTranslation(
        "mainBar.TopToolsBar.dayGuideBtn.underLevel"
      );
      MessageTipManager.Instance.show(str);
    } else {
      FrameCtrlManager.Instance.open(EmWindow.Welfare, {
        str: LangManager.Instance.GetTranslation(
          "welfareWnd.tabTitle.DegreeActivity"
        ),
      });
    }
  }
  /**
   * 打开铁匠铺相应界面
   * @param tabIndex GTabIndex
   * @param materialId 要合成的物品的道具ID
   */
  public static gotoStoreFrame(tabIndex: number, materialId?: number) {
    // 配GTabIndex.Forge_HC 必须要配 materialId, 要不然找不到具体的item
    materialId = Number(materialId);
    if (tabIndex == GTabIndex.Forge_HC && materialId) {
      let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_compose);
      for (const key in dic) {
        if (Object.prototype.hasOwnProperty.call(dic, key)) {
          const item = dic[key] as t_s_composeData;
          if (item.NewMaterial == materialId) {
            switch (item.Types) {
              case ForgeData.COMPOSE_TYPE_PROP:
                tabIndex = GTabIndex.Forge_HC_DJ;
                break;
              case ForgeData.COMPOSE_TYPE_EQUIP:
                tabIndex = GTabIndex.Forge_HC_ZB;
                break;
              case ForgeData.COMPOSE_TYPE_GEM:
                tabIndex = GTabIndex.Forge_HC_BS;
                break;
              case ForgeData.COMPOSE_TYPE_ADVANCE_EQUIP:
                tabIndex = GTabIndex.Forge_HC_ZBJJ;
                break;
              case ForgeData.COMPOSE_TYPE_CRYSTAL:
                tabIndex = GTabIndex.Forge_HC_SJ;
                break;
            }
          }
        }
      }
    }

    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    switch (tabIndex) {
      case GTabIndex.Forge_QH:
        if (ArmyManager.Instance.thane.grades < OpenGrades.INTENSIFY) {
          str = LangManager.Instance.GetTranslation(
            "dayGuide.DayGuideManager.command02",
            OpenGrades.INTENSIFY
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        break;
      case GTabIndex.Forge_XQ:
      case GTabIndex.Forge_HC:
      case GTabIndex.Forge_HC_DJ:
      case GTabIndex.Forge_HC_ZB:
      case GTabIndex.Forge_HC_BS:
      case GTabIndex.Forge_HC_ZBJJ:
      case GTabIndex.Forge_HC_SJ:
        if (ArmyManager.Instance.thane.grades < OpenGrades.INSERT) {
          str = LangManager.Instance.GetTranslation(
            "dayGuide.DayGuideManager.command02",
            OpenGrades.INSERT
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        break;
      case GTabIndex.Forge_XL:
      case GTabIndex.Forge_FJ:
      case GTabIndex.Forge_ZH:
        break;
    }
    FrameCtrlManager.Instance.open(EmWindow.Forge, {
      tabIndex: tabIndex,
      materialId: materialId,
    });
  }
  /**
   * 打开悬赏
   *
   */
  public static gotoOfferRewardFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.OFFER_REWARD) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.OFFER_REWARD
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_OFFER_REWARD);
  }
  /**
   * 打开拍卖场
   *
   */
  public static gotoMarkeFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.MYSTERIOUS) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.MYSTERIOUS
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_SUPER_MARKET);
  }
  /**
   * 打开内政厅
   *
   */
  private static gotoOfficeFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    // if (!SwitchPageHelp.checkScene()) return;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    let bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.OFFICEAFFAIRS
    );
    if (bInfo.property2 > bInfo.property1) {
      SwitchPageHelp.openBuildFrame(bInfo);
    }
  }
  /**
   * 打开兵营
   *
   */
  public static gotoCasernFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.ARMY) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.ARMY
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    let bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.CASERN
    );
    SwitchPageHelp.openBuildFrame(bInfo);
  }
  /**
   * 打开神学院
   *
   */
  public static gotoSeminaryFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.SEMINARY) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.SEMINARY
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    let bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(
      BuildingType.SEMINARY
    );
    SwitchPageHelp.openBuildFrame(bInfo);
  }
  /**
   * 打开社交
   *
   */
  private static gotoFriendFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
  }
  /**
   * 打开阵形调整
   *
   */
  private static gotoLineupFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    FrameCtrlManager.Instance.open(EmWindow.AllocateWnd);
  }
  /**
   *  跳转地下迷宫
   *
   */
  public static gotoMazeFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < 23) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        23
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    FrameCtrlManager.Instance.open(EmWindow.MazeFrameWnd);
  }
  /**
   * 跳转挂机房(修行神殿)
   *
   */
  public static gotoHookRoom() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.HOOK);;
  }
  /**
   * 跳转挑战
   *
   */
  public static gotoColosseumFrame() {
    // AudioManager.Instance.playSound(SoundIds.INNERCITY_CLICK_BUILD_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.PVP_COLOSSEUM) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.PVP_COLOSSEUM
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVP);
  }
  /**
   * 跳转竞技场
   */
  public static gotoPvpFrame() {
    // AudioManager.Instance.playSound(SoundIds.INNERCITY_CLICK_BUILD_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.CHALLENGE) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.CHALLENGE
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE) {
      str = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (!SwitchPageHelp.checkScene()) return;
    SwitchPageHelp.goSpaceAndFind(SpaceNodeType.ID_PVP);
  }
  /**
   *  跳转星运背包
   *
   */
  public static gotoStarBagFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.STAR) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.STAR
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.StarBag);
  }

  /**
   * 跳转世界地图
   *
   */
  private static gotoWorldMapFrame() {
    // AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.WORLD_MAP);
  }
  /**
   *  跳转建筑/科技
   * @param sonType
   *
   */
  private static gotoBuildingFrame(sonType: number) {
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    // if (!SwitchPageHelp.checkScene()) return;
    let bInfo: BuildInfo;
    if (
      (sonType >= 1300 && sonType < 1500) ||
      (sonType >= 2304 && sonType < 2446)
    ) {
      bInfo = BuildingManager.Instance.getBuildingInfoBySonType(
        BuildingType.SEMINARY
      );
    } else {
      bInfo = BuildingManager.Instance.getBuildingInfoBySonType(sonType);
    }
    SwitchPageHelp.openBuildFrame(bInfo);
  }

  private static openBuildFrame(bInfo: BuildInfo) {
    switch (bInfo.templeteInfo.SonType) {
      case BuildingType.STORE_BUILD:
        break;
      case BuildingType.PVP_BUILD:
        break;
      case BuildingType.HERODOOR_BUILD:
        break;
      case BuildingType.XUANSHANG_BUILD:
        break;
      case BuildingType.HOOK_BUILD:
        FrameCtrlManager.Instance.open(EmWindow.Hook);
        break;
      case BuildingType.WUXIANTA_BUILD:
        FrameCtrlManager.Instance.open(EmWindow.MazeFrameWnd);
        break;
      case BuildingType.VEHICLE_BUILD:
        break;
      case BuildingType.TREE:
        break;
      case BuildingType.HOME_BUILD:
        break;
      case BuildingType.MAKET_BUILD:
        break;
      case BuildingType.CASERN:
        FrameCtrlManager.Instance.open(EmWindow.CasernWnd, bInfo);
        break;
      case BuildingType.HOUSES:
        UIManager.Instance.ShowWind(EmWindow.ResidenceFrameWnd, bInfo);
        break;
      case BuildingType.OFFICEAFFAIRS:
        UIManager.Instance.ShowWind(EmWindow.PoliticsFrameWnd, bInfo);
        break;
      case BuildingType.WAREHOUSE:
        UIManager.Instance.ShowWind(EmWindow.DepotWnd, bInfo);
        break;
      case BuildingType.CRYSTALFURNACE:
        UIManager.Instance.ShowWind(EmWindow.CrystalWnd, bInfo);
        break;
      case BuildingType.SEMINARY:
        UIManager.Instance.ShowWind(EmWindow.SeminaryWnd, bInfo);
        break;
      default:
        break;
    }
  }
  /**
   *
   * 聚魂
   */
  public static gotoSoulMakeFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 1);
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.SOULMAKE) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.SOULMAKE
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    //TODO
    // if (SoulMakeData.remainCount <= 0) {
    // 	str = LangManager.Instance.GetTranslation("maze.MazeFrame.command01");
    // 	MessageTipManager.Instance.show(str);
    // 	return;
    // }
    //TODO
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.SOUlMAKE);
  }
  /**
   *
   * 炼金
   */
  public static gotoAlchemyFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND, 1);
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.ALCHEMY) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.ALCHEMY
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    //TODO
    // if (Alchemydata.remainCount <= 0) {
    // 	str = LangManager.Instance.GetTranslation("maze.MazeFrame.command01");
    // 	MessageTipManager.Instance.show(str);
    // 	return;
    // }
    //TODO
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.ALCHEMY);;
  }
  /**
   *
   * 跳转到农场
   */
  public static gotoFarmFrame() {
    // AudioManager.Instance.playSound(SoundIds.MAINTOOLBAR_CLICK_SOUND);
    let str: string;
    if (MopupManager.Instance.model.isMopup) {
      str = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01"
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (ArmyManager.Instance.thane.grades < OpenGrades.FARM) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.FARM
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    // if (!this.checkScene()) return;
    FarmManager.Instance.enterFarm();
  }
  /**
   * 跳转到魔灵建筑
   *
   */
  public static gotoVehicleBuild() {
    if (
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.EMPTY_SCENE
    ) {
      return;
    }
    let str: string;
    if (ArmyManager.Instance.thane.grades < 0) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        0
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    //TODO
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.VEHICLE_DAIMON);
  }
  /**
   *  跳转到魔灵房间（魔灵试练）
   *
   */
  public static gotoVehicleRoom() {
    if (
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.EMPTY_SCENE
    ) {
      return;
    }
    let str: string;
    if (ArmyManager.Instance.thane.grades < 0) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        0
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.isVehicleStart) {
      if (this.checkScene()) {
        //TODO
        // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.VEHICLE_DAIMON_TRAIL);
      }
    } else {
      this.gotoVehicleBuild();
    }
  }
  /**
   * 跳转到寻宝界面
   *
   */
  public static gotoTreasureHunt() {
    if (
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.EMPTY_SCENE
    ) {
      return;
    }
    let str: string;
    if (ArmyManager.Instance.thane.grades < 32) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        32
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    //TODO
    // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.TREASURE_HUNT);
  }

  /**
   * 跳转到符文技能
   *
   */
  public static gotoRunnesSkill() {
    if (
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.EMPTY_SCENE
    ) {
      return;
    }
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.VEHICEL) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.VEHICEL
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.Skill, {
      tabIndex: GTabIndex.Skill_FW,
    });
  }

  /** 跳转到天赋和圣印 */
  public static gotoMarkingSkill() {
    if (
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.EMPTY_SCENE
    ) {
      return;
    }
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.VEHICEL) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.VEHICEL
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.Skill, {
      tabIndex: GTabIndex.Skill_TF,
    });
  }

  /**
   * 跳转到坐骑
   *
   */
  public static gotoMounts() {
    if (
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE ||
      SceneManager.Instance.currentType == SceneType.EMPTY_SCENE
    ) {
      return;
    }
    let str: string;
    if (ArmyManager.Instance.thane.grades < OpenGrades.MOUNT) {
      str = LangManager.Instance.GetTranslation(
        "dayGuide.DayGuideManager.command02",
        OpenGrades.MOUNT
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
  }

  public static checkScene(): boolean {
    let tip: string = WorldBossHelper.getCampaignTips();
    if (tip != "") {
      MessageTipManager.Instance.show(tip);
      return false;
    }

    if (this.checkInRoom()) return false;
    if (this.checkInBattle()) return false;
    if (ArmyManager.Instance.army.onVehicle) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips")
      );
      return false;
    }
    return true;
  }

  public static get isInCampaign(): boolean {
    let type: string = SceneManager.Instance.currentType;
    switch (type) {
      case SceneType.CAMPAIGN_MAP_SCENE:
      case SceneType.VEHICLE:
        return true;
        break;
      default:
        return false;
        break;
    }
  }

  public static get isInSpace(): boolean {
    let type: string = SceneManager.Instance.currentType;
    switch (type) {
      case SceneType.SPACE_SCENE:
        return true;
        break;
      default:
        return false;
        break;
    }
  }

  public static enterToSpace() {
    SpaceSocketOutManager.Instance.enterSpace();
  }

  public static get returnScene(): string {
    let retScene = null;
    if (PlayerManager.Instance.currentPlayerModel.inCastle) {
      retScene = SceneType.CASTLE_SCENE;
    } else if (PlayerManager.Instance.currentPlayerModel.inOutCity) {
      retScene = SceneType.OUTER_CITY_SCENE;
    } else {
      if (PlayerManager.Instance.currentPlayerModel.spaceMapId == 0) {
        retScene = SceneType.CASTLE_SCENE;
      } else if (ArmyManager.Instance.thane.grades < OpenGrades.ENTER_SPACE) {
        retScene = SceneType.CASTLE_SCENE;
      } else {
        retScene = SceneType.SPACE_SCENE;
      }
    }
    Logger.info("SwitchPageHelp.returnScene 返回上一个场景", retScene);
    return retScene;
  }

  public static returnToSpace(
    data: Object = null,
    isForce: boolean = false,
    showLoader: boolean = false
  ) {
    if (
      this.returnScene == SceneType.SPACE_SCENE &&
      SpaceManager.Instance.exit
    ) {
      Logger.info(
        "SwitchPageHelp.returnToSpace 返回天空之城失败 天空之城已销毁"
      );
      return;
    }
    SceneManager.Instance.setScene(this.returnScene, data, isForce, showLoader);
  }

  public static goSpaceAndFind(target: number) {
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      PlayerManager.Instance.currentPlayerModel.spaceNodeId = target;
      NotificationManager.Instance.dispatchEvent(SpaceEvent.FIND_NODE, null);
    } else if (
      SceneManager.Instance.currentType == SceneType.OUTER_CITY_SCENE
    ) {
      let str: string = LangManager.Instance.GetTranslation(
        "emailII.view.ReadBattleReportView.command01"
      );
      MessageTipManager.Instance.show(str);
      return;
    } else if (ArmyManager.Instance.thane.grades < OpenGrades.ENTER_SPACE) {
      let str: string = LangManager.Instance.GetTranslation(
        "mainBar.SmallMapBar.spaceBtnNotOpen"
      );
      MessageTipManager.Instance.show(str);
      return;
    } else {
      PlayerManager.Instance.currentPlayerModel.spaceNodeId = target;
      if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
        var bArmy: any = ArmyManager.Instance.army;
        if (bArmy) {
          CampaignSocketOutManager.Instance.sendReturnCampaignRoom(bArmy.id);
        }
      } else {
        SwitchPageHelp.enterToSpace();
      }
    }
  }

  public static isEnterSpaceNow(): boolean {
    let roomInfo: RoomInfo = RoomManager.Instance.roomInfo;
    if (roomInfo) {
      let player = roomInfo.getPlayerByUserId(
        DataCommonManager.thane.userId,
        DataCommonManager.thane.serviceName
      );
      let isInTeam = Boolean(player);
      return !isInTeam;
    }
    if (BattleManager.loginToBattleFlag) {
      return false;
    }
    // if (PlayerManager.Instance.currentPlayerModel.inCastle && !SpaceManager.ClickEnterHome) {
    // 	return false;
    // }
    return true;
  }

  // 		public static switchGuidePage(type:number)
  // 		{
  // 			let str:string="";
  // 			switch(type)
  // 			{
  // 				case GuideTaskType.ARMY_LEVEL:
  // 					gotoCasernFrame();
  // 					break
  // 				case GuideTaskType.GUILD_SKILL:
  // 					if(FrameControllerManager.Instance.consortiaController.model.consortiaInfo.consortiaId>0)
  // 					{
  // 						gotoConsortiaFrame(5);
  // 					}
  // 					else
  // 					{
  // 						str = LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.promptTxt");
  // 						MessageTipManager.Instance.show(str);
  // 						return ;
  // 					}
  // 					break
  // 				case GuideTaskType.PERSONAL_SKILL:
  // 					gotoSeminaryFrame();
  // 					break
  // //				case GuideTaskType.HEARO_LEVEL:
  // //
  // //					break
  // 				case GuideTaskType.USE_STAR:
  // 					gotoStarFrame();
  // 					break
  // 				case GuideTaskType.USE_EQUIPMENT:
  // 					gotoStoreFrame(StorePanelEnum.STORE_PANEL_COMPOSE);
  // 					break
  // 				case GuideTaskType.STRENGTHEN_EQU:
  // 					gotoStoreFrame(StorePanelEnum.STORE_PANEL_INTENSIFY);
  // 					break
  // 				case GuideTaskType.PASS_TOWER:
  // 					gotoMazeFrame();
  // 					break
  // 				case GuideTaskType.STAR_LEVEL:
  // 					gotoStarFrame();
  // 					break
  // 				case GuideTaskType.INLAY_STONE:
  // 					gotoStoreFrame(StorePanelEnum.STORE_PANEL_MOUNT);
  // 					break
  // 				case GuideTaskType.LEARN_FU_WEN:
  // 					gotoRunnesSkill();
  // 					break
  // 				case GuideTaskType.GET_MOUNT:
  // 					gotoMounts();
  // 					break
  // 				case GuideTaskType.PASS_CAMPAIGN:
  // 					gotoCampaignById(9004); //
  // 					break
  // 				case GuideTaskType.GUILD_DEVOTE:
  // 					if(PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0)
  // 					{
  // 						MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command05"));
  // 						return;
  // 					}
  // 					gotoConsortiaFrame(2);
  // 					break
  // 				case GuideTaskType.STAR_VALUE:
  // 					gotoStarFrame();
  // 					break
  // 				case GuideTaskType.SOUL_IMPORT_PARVAT:
  // 					gotoBagFrame();
  // 					break
  // 				case GuideTaskType.FU_WEN_LEVEL: //符文
  // 					gotoRunnesSkill();
  // 					break
  // 				case GuideTaskType.TALENT_LEVEL: //天赋等级
  // 					gotoRunnesSkill();
  // 					break
  // 				case GuideTaskType.MOUNT_LEVEL: //坐骑等级
  // 					gotoMounts();
  // 					break
  // 				case GuideTaskType.HONOUR_SOLDIER://荣誉
  // 					getProprtStr();
  // 					break
  // 				case GuideTaskType.FIGTHING_CAPACT:
  // 					FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.FIGHTING,FightIngModel.FIGHT_MAIN_FRAME);
  // 				case GuideTaskType.ENTER_CAMPAIGN:
  // 					gotoCampaignById(9004); //
  // 					break
  // 			}
  // 		}
  //
  // 		public static getProprtStr()
  // 		{
  //
  // //			下次战场开放时间: 00:00~00:00
  // //			下次公会战时间: 星期X, 00:00~00:00
  // 			let str:string = LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt01");
  // 			let date:Date = new Date();
  // 			let getweekDay:number = date.day;
  // 			let hours:number = date.hours;
  // 			let minutes:number = date.minutes;
  // 			switch(getweekDay)
  // 			{
  // 				case 0:      //星期天
  // 					str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Monday"));
  // 					break;
  // 				case 1:      //星期一
  // 					if(hours>=21)
  // 					{
  // 						str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Wednesday"));
  // 					}
  // 					else
  // 					{
  // 						str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Monday"));
  // 					}
  // 					break;
  // 				case 2:      //星期二
  // 					str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Wednesday"));
  // 					break;
  // 				case 3:      //星期三
  // 					if(hours>=21)
  // 					{
  // 						str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Friday"));
  // 					}
  // 					else
  // 					{
  // 						str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Wednesday"));
  // 					}
  // 					break;
  // 				case 4:      //星期四
  // 					str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Friday"));
  // 					break;
  // 				case 5:      //星期五
  // 					if(hours>=21)
  // 					{
  // 						str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Monday"));
  // 					}
  // 					else
  // 					{
  // 						str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Friday"));
  // 					}
  // 					break;
  // 				case 6:      //星期六
  // 					str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt02",LangManager.Instance.GetTranslation("public.Monday"));
  // 					break;
  // 			}
  //
  // 			if(hours<13)
  // 			{
  // 				str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt03",12,12);
  // 			}
  // 			else
  // 			{
  // 				if(minutes>=25)
  // 				{
  // 					str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt03",hours+1,hours+1);
  // 				}
  // 				else
  // 				{
  // 					str += LangManager.Instance.GetTranslation("yishi.SwitchPageHelp.HONOUR_SOLDIER.prompt03",hours,hours);
  // 				}
  // 			}
  // 			MessageTipManager.Instance.show(str);
  // 		}
  //
  // 		/** 打开宠物界面 */
  // 		public static openPetFrame(type:number = 0)
  // 		{
  // 			FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.PET,null,type);
  // 		}
  //

  public static openShop(type: number) {
    if (type == ShopGoodsInfo.SHOP) {
      FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1 });
    } else if (type == ShopGoodsInfo.CONSORTIA_SHOP) {
      // FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { shopType: ShopGoodsInfo.CONSORTIA_SHOP })
      FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 1 });
    } else if (type == ShopGoodsInfo.ATHLETICS_SHOP) {
      // FrameCtrlManager.Instance.open(EmWindow.PvpShop);
      FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 2 });
    } else if (type == ShopGoodsInfo.MAZE_SHOP) {
      // FrameCtrlManager.Instance.open(EmWindow.MazeShopWnd, { returnToWinFrameData: 0 });
      FrameCtrlManager.Instance.open(EmWindow.ShopWnd, {
        page: 3,
        returnToWinFrameData: 0,
      });
    } else if (type == ShopGoodsInfo.MYSTERY_SHOP) {
      if (
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
      ) {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
      } else {
        FrameCtrlManager.Instance.open(EmWindow.Consortia);
      }
    } else if (type == ShopGoodsInfo.FARM_SHOP) {
      FrameCtrlManager.Instance.open(EmWindow.FarmShopWnd);
    } else if (type == ShopGoodsInfo.STAR_SHOP) {
      FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, {
        shopType: ShopModel.STAR_SHOP,
      });
    } else if (type == ShopGoodsInfo.FASHION_ALL_BUY) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("SwitchPageHelp.openTips1")
      );
    } else if (type == ShopGoodsInfo.FASHION_LOOK) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("TopToolBar.openTips")
      );
    } else if (type == ShopGoodsInfo.WARLORDS_SHOP) {
      FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, {
        shopType: ShopGoodsInfo.WARLORDS_SHOP,
      });
    } else if (type == ShopGoodsInfo.PET_EXCHANGE_SHOPTYPE) {
      UIManager.Instance.ShowWind(EmWindow.PetExchangeShopWnd);
    } else if (type == ShopGoodsInfo.MINERAL_SHOP) {
      FrameCtrlManager.Instance.open(EmWindow.MineralShopWnd);
    } else {
      // return 'view.ShopFrame';
    }
  }

  public static checkInRoom(showTip: boolean = true): boolean {
    let currentType = SceneManager.Instance.currentType;
    if (
      currentType &&
      (currentType == SceneType.PVP_ROOM_SCENE ||
        currentType == SceneType.PVE_ROOM_SCENE ||
        currentType == SceneType.WARLORDS_ROOM)
    ) {
      if (showTip) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "dayGuide.DayGuideManager.command03"
          )
        );
      }
      return true;
    }
    return false;
  }

  public static checkInBattle(showTip: boolean = true): boolean {
    let currentType = SceneManager.Instance.currentType;
    if (currentType && currentType == SceneType.BATTLE_SCENE) {
      if (showTip) {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "worldboss.helper.WorldBossHelper.tip12"
          )
        );
      }
      return true;
    }
    return false;
  }

  public static formatSearchNode(campaignId: number, nodeId: number) {
    return campaignId + "," + nodeId;
  }
}
