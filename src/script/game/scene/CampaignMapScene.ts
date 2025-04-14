import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import ResMgr from "../../core/res/ResMgr";
import { CampaignArmyViewHelper } from "../map/campaign/CampaignArmyViewHelper";
import { WalkRectScanUtils } from "../../core/utils/WalkRectScanUtils";
import { BattleGetMoviesAction } from "../action/map/BattleGetMoviesAction";
import { CampaignActionsFactory } from "../action/map/CampaignActionsFactory";
import { SceneMoveAction } from "../battle/actions/SceneMoveAction";
import { BattleManager } from "../battle/BattleManager";
import { DisplayObject } from "../component/DisplayObject";
import { t_s_mapData } from "../config/t_s_map";
import { ArmyState } from "../constant/ArmyState";
import { CreateCampaignType } from "../constant/CreateCampaignType";
import {
  CampaignMapEvent,
  NotificationEvent,
  PK_Event,
  SceneEvent,
  SLGSocketEvent,
} from "../constant/event/NotificationEvent";
import { FogGridType } from "../constant/FogGridType";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { CampaignManager } from "../manager/CampaignManager";
import CampaignSocketManger from "../manager/CampaignSocketManger";
import { CampaignSocketOutManager } from "../manager/CampaignSocketOutManager";
import { GameBaseQueueManager } from "../manager/GameBaseQueueManager";
import { MapSocketOuterManager } from "../manager/MapSocketOuterManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { SocketSceneBufferManager } from "../manager/SocketSceneBufferManager";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../map/campaign/data/CampaignArmyState";
import { PreCampaignData } from "../map/campaign/PreCampaignData";
import { PreLoadNextCampaign } from "../map/campaign/PreLoadNextCampaign";
import { CampaignMapView } from "../map/campaign/view/CampaignMapView";
import { AcorrsLineGrid } from "../map/findPath/AcorrsLineGrid";
import { FindPath8 } from "../map/findPath/FindPath8";
import { MapElmsLibrary } from "../map/libray/MapElmsLibrary";
import { BaseSceneView } from "../map/scene/BaseSceneView";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { MovieTargetType } from "../map/space/constant/MovieTargetType";
import { NodeState } from "../map/space/constant/NodeState";
import Tiles from "../map/space/constant/Tiles";
import { CampaignNode } from "../map/space/data/CampaignNode";
import { MapData } from "../map/space/data/MapData";
import { MouseData } from "../map/space/data/MouseData";
import { MapUtils } from "../map/space/utils/MapUtils";
import { MapViewHelper } from "../map/outercity/utils/MapViewHelper";
import HomeWnd from "../module/home/HomeWnd";
import SmallMapBar from "../module/home/SmallMapBar";
import JoyStickWnd from "../module/joystick/JoyStickWnd";
import LoadingSceneWnd from "../module/loading/LoadingSceneWnd";
import { CampaignMapModel } from "../mvc/model/CampaignMapModel";
import ComponentSetting from "../utils/ComponentSetting";
import { WorldBossHelper } from "../utils/WorldBossHelper";
import UIManager from "../../core/ui/UIManager";

//@ts-expect-error: External dependencies
import CampaignConfirmMsg = com.road.yishi.proto.campaign.CampaignConfirmMsg;

//@ts-expect-error: External dependencies
import PlayerMovieMsg = com.road.yishi.proto.player.PlayerMovieMsg;

//@ts-expect-error: External dependencies
import PlayerNodeStateMsg = com.road.yishi.proto.campaign.PlayerNodeStateMsg;

//@ts-expect-error: External dependencies
import WarMovieMsg = com.road.yishi.proto.campaign.WarMovieMsg;

//@ts-expect-error: External dependencies
import PlayerMoveCameraMsg = com.road.yishi.proto.player.PlayerMoveCameraMsg;

//@ts-expect-error: External dependencies
import FightOverMoiveMsg = com.road.yishi.proto.simple.FightOverMoiveMsg;

//@ts-expect-error: External dependencies
import PlayerMoveMsg = com.road.yishi.proto.campaign.PlayerMoveMsg;

//@ts-expect-error: External dependencies
import BaseItemMsg = com.road.yishi.proto.battle.BaseItemMsg;

//@ts-expect-error: External dependencies
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;

//@ts-expect-error: External dependencies
import HangupAttackMsg = com.road.yishi.proto.campaign.HangupAttackMsg;

//@ts-expect-error: External dependencies
import NPCChaseMsg = com.road.yishi.proto.campaign.NPCChaseMsg;

//@ts-expect-error: External dependencies
import NPCChatMsg = com.road.yishi.proto.campaign.NPCChatMsg;
import { EmWindow } from "../constant/UIDefine";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import Resolution from "../../core/comps/Resolution";
import ChatData from "../module/chat/data/ChatData";
import PlayerMoveAction from "../action/map/PlayerMoveAction";
import ScoreOrGesteAction from "../action/pvp/ScoreOrGesteAction";
import { ConsortiaModel } from "../module/consortia/model/ConsortiaModel";
import { ConsortiaManager } from "../manager/ConsortiaManager";
import MovieType from "../map/space/constant/MovieType";
import { NpcAvatarView } from "../map/campaign/view/physics/NpcAvatarView";
import { BaseArmy } from "../map/space/data/BaseArmy";
import { SocketSendManager } from "../manager/SocketSendManager";
import CollectionAction from "../battle/actions/CollectionAction";
import { FarmManager } from "../manager/FarmManager";
import ObjectUtils from "../../core/utils/ObjectUtils";
import { ResRefCountManager } from "../managerRes/ResRefCountManager";
import { MonopolyArmyView } from "../map/campaign/view/physics/MonopolyArmyView";
import { MapCameraMediator } from "../mvc/mediator/MapCameraMediator";
import { t_s_campaignData } from "../config/t_s_campaign";
import ConfigMgr from "../../core/config/ConfigMgr";
import { SharedManager } from "../manager/SharedManager";
import { MineralCarInfo } from "../map/campaign/data/MineralCarInfo";
import { TaskManage } from "../manager/TaskManage";
import { GlobalConfig } from "../constant/GlobalConfig";

/**
 * 副本 原CampaignMapController
 */
export class CampaignMapScene extends BaseSceneView {
  private _view: CampaignMapView;
  private _mapModel: CampaignMapModel;
  private _preLoad: PreCampaignData;
  private _preLoadNextCampaign: PreLoadNextCampaign;
  private _bSendCampaignArriveCool: boolean = false;
  private _preSceneData: any;

  // testData() {
  //     let armyInfo: CampaignArmy = new CampaignArmy();
  //     armyInfo.pos = 0;
  //     armyInfo.baseHero = new ThaneInfo();
  //     armyInfo.baseHero.templateId = 3  //英雄职业
  //     armyInfo.userId = 340480;
  //     armyInfo.setTranseferWait(false, 0, 0);
  //     armyInfo.id = 384492;
  //     armyInfo.curPosX = 80;
  //     armyInfo.curPosY = 87;
  //     armyInfo.state = 0;
  //     armyInfo.teamId = 0;
  //     armyInfo.mapId = 1091;
  //     armyInfo.online = true;
  //
  //     // 英灵
  //     armyInfo.petInfo.petName = "克尔柏洛斯"
  //     armyInfo.petInfo.petQuaity = 5
  //     armyInfo.petInfo.petTemQuality = 21
  //     armyInfo.petInfo.posX = 0
  //     armyInfo.petInfo.posY = 0
  //     armyInfo.petInfo.petTemplateId = 101205 // "克尔柏洛斯"
  //
  //     // 坐骑
  //     armyInfo.mountTemplateId = 1000 // 白色战马
  //     armyInfo.mountGrade = 10;
  //
  //     this._mapModel.addBaseArmy(armyInfo, false);
  //     let posX = [80, 65, 45, 26, 34, 79]
  //     let poxY = [87, 60, 77, 76, 35, 54]
  //     let fixX = [1609, 1309, 909, 529, 689, 1589]
  //     let fixY = [1750, 1210, 1550, 1529, 709, 1089];
  //     let nextNodeIds = ["109102", "109106", "109103", "", "", ""];
  //     let nodeId = [109101, 109103, 109102, 109108, 109109, 109104];
  //     let resource = [2, 1, 1, 2, 2, 2]
  //     let sonType = [2301, 2119, 2119, 2333, 2203, 2331];
  //     let param3 = ["", "", "", "您发现了亡者墓地, 是否挖掘？", "是否消耗1个骷髅钥匙开启神秘宝箱？", ""];
  //     let param5 = ["", "", "", "-200,0,15000,25|-200,0,7500,25|-500,0,0,50", "", ""]
  //     let resetPosX = [0, 0, 0, 28, 32, 77];
  //     let resetPosY = [0, 0, 0, 75, 37, 56];
  //     let types = [40, 42, 42, 61, 61, 61];
  //     let preNodeIds = ["0", "0", "0", "0", "0"]
  //     let state = [2, 1, 1, 1, 1, 1];
  //     let id = [9302, 9304, 9303, 9309, 9310, 9305];
  //     let names = ["", "利爪魔蜥", "利爪魔蜥", "亡者墓地", "神秘宝箱", ""];
  //     let list: Array<CampaignNode> = new Array<CampaignNode>();
  //     for (let i: number = 0; i < 6; i++) {
  //         let node: CampaignNode = new CampaignNode();
  //         let info: PhysicInfo = new PhysicInfo();
  //         info.types = types[i];
  //         info.state = state[i];
  //         info.names = names[i];
  //         info.id = id[i];
  //         info.posX = posX[i];
  //         info.posY = poxY[i];
  //         node.curPosX = posX[i];
  //         node.curPosY = poxY[i];
  //         node.fixX = fixX[i];
  //         node.fixY = fixY[i];
  //         node.heroTemplateId = -1;
  //         node.nextNodeIds = nextNodeIds[i];
  //         node.nodeId = nodeId[i];
  //         node.resource = resource[i];
  //         node.sonType = sonType[i];
  //         node.param3 = param3[i];
  //         node.param5 = param5[i];
  //         node.resetPosX = resetPosX[i]
  //         node.resetPosY = resetPosY[i];
  //         node.preNodeIds = preNodeIds[i];
  //         node.info = info;
  //         node.attackTypes = 1;
  //         list.push(node);
  //     }
  //     this._mapModel.mapNodesData = list;
  //     let server: any[] = [];
  //     for (let i: number = 0; i < 24; i++) {
  //         let arr: any = [];
  //         for (let j: number = 0; j < 19; j++) {
  //             arr[j] = 0;
  //         }
  //         server[i] = arr;
  //     }
  //     this._mapModel.fogData = server;
  // }

  /**
   * 进入场景
   */
  public enter(preScene: BaseSceneView, data: object = null): Promise<void> {
    Logger.log("SceneManager.CampaignMapScene:enter");
    return new Promise(async (resolve) => {
      if (this.gotoOutCampaign()) {
        return;
      }

      ResRefCountManager.resCache.forEach((element, url) => {
        if (element.refCount > 0) {
          Logger.warn("[CampaignMapScene]enter", element.refCount, url);
        }
      });
      ResRefCountManager.clearCache();

      this._preSceneData = data;
      this._mapModel.onCollectionId = 0;

      /** 秘境无地图数据 new一个 省的其他地方做容错 */
      if (!this._mapModel.mapTempInfo) {
        this._mapModel.template = new t_s_mapData();
      }
      let w: number = this._mapModel.mapTempInfo.Width / 20;
      let h: number = this._mapModel.mapTempInfo.Height / 20;
      this._finPath = new FindPath8(w, h, this._mapModel.mapTielsData);
      this._algUtils = new AcorrsLineGrid(this._finPath, this._mapModel);
      this._rectScanUtils = new WalkRectScanUtils();

      this._view = new CampaignMapView();
      CampaignManager.Instance.mapView = this._view;
      this.addChild(this._view);
      this.addEvent();
      this._mapModel.createType = CreateCampaignType.CAMPAIGN_GAME;
      // if(ExternalInterface.available && LocalConnectionManager.Instance.isUse)
      // {
      // 	let para1 :any[] = [this._mapModel.mapTielsData];
      // 	LocalConnectionManager.Instance.Call("initCampaignTitles",para1,this.searchPathSyc,null);
      // }
      // if(this._mapModel.campaignTemplate.Types == 3)//修行神殿
      // {
      // 	SmallMapBar.Instance.switchSmallMapState(SmallMapBar.HOOKROOM_SMALL_MAP_STATE);
      // 	FarmManager.Instance.model.preMapId = this._mapModel.campaignTemplate.CampaignId;
      // }
      // else if(this._mapModel.campaignTemplate.Types == 10 || this._mapModel.campaignTemplate.Types == 11)//英灵岛, 紫晶矿场
      // {
      // 	FarmManager.Instance.model.preMapId = this._mapModel.campaignTemplate.CampaignId;
      resolve();
    });
  }

  public preLoadingStart(data: object = null): Promise<void> {
    NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, true);
    // SceneManager.Instance.lockScene = true;
    return new Promise((resolve) => {
      let preLoadingOver = () => {
        LoadingSceneWnd.Instance.Hide();
        let maskPicPath: string = ComponentSetting.CAMPAIGN_MASK_PIC;
        ResMgr.Instance.loadRes(maskPicPath, (res) => {
          this._mapModel.fogMaskData = res;
          this.preLoadingOver();
          resolve();
        });
      };
      if (this.gotoOutCampaign()) {
        return;
      }
      CampaignSocketManger.Instance.setup(true);
      // FootprintItems.setup();
      CampaignManager.Instance.controller = this;
      this._mapModel = CampaignManager.Instance.mapModel;
      MapElmsLibrary.Instance.lock();
      if (this._mapModel.createType == CreateCampaignType.CREATE_TYPE_TRANS) {
        LoadingSceneWnd.Instance.Show();
      }
      this._preLoad = new PreCampaignData(this._mapModel);
      this._preLoad.syncBackCall(preLoadingOver);
      // if (MapData.mapId == this._mapModel.mapTempInfo.Id && MapData.mapBitmap && this._mapModel.mapTielsData) {
      //     preLoadingOver();
      // }
      // else {
      //     if (this._mapModel.createType == CreateCampaignType.CREATE_TYPE_TRANS) {
      //         LoadingSceneWnd.Instance.Show();
      //     }
      //     this._preLoad = new PreCampaignData(this._mapModel);
      //     this._preLoad.syncBackCall(preLoadingOver);
      // }
    });
  }

  public enterOver(): Promise<void> {
    return new Promise(async (resolve) => {
      this.releaseScene();
      SceneManager.Instance.removeSceneType();
      this.moveMapCallBack(MapViewHelper.getCurrentMapRect(this._view));
      MapCameraMediator.unlockMapCamera();
      CampaignManager.Instance.controller = this;

      // await JoyStickWnd.Instance.Show();//TODO --暂时屏蔽遥杆
      let ismonopoly: boolean = WorldBossHelper.checkMonopoly(
        this._mapModel.mapId,
      );
      if (!HomeWnd.Instance.isShowing) {
        if (!ismonopoly) {
          await HomeWnd.Instance.instShow();
          HomeWnd.Instance.getSmallMapBar().switchSmallMapState(
            SmallMapBar.CAMPAIGN_SMALL_MAP_STATE,
          );
        }
      }
      if (!ismonopoly) {
        HomeWnd.Instance.showCrossInfo();
      }

      if (
        UIManager.Instance.isShowSpaceTaskInfoWndScene &&
        !UIManager.Instance.isShowing(EmWindow.SpaceTaskInfoWnd)
      ) {
        await UIManager.Instance.ShowWind(EmWindow.SpaceTaskInfoWnd);
      } else if (!UIManager.Instance.isShowSpaceTaskInfoWndScene) {
        /**
         * 关闭界面同时从当前场景A切换至场景B（B场景不显示快捷任务栏）,
         * 执行SceneManager.onHideSceneObj 逻辑的时候还没切至B, 导致快捷任务栏显示但又不能操作
         * 比如战场入口RvrBattleWnd(setSceneVisibleOpen=true)
         */
        let wind = UIManager.Instance.FindWind(EmWindow.SpaceTaskInfoWnd);
        if (wind) {
          wind.visible = false;
        }
      }

      if (
        !WorldBossHelper.checkPetLand(this._mapModel.mapId) &&
        !WorldBossHelper.checkIsNoviceMap(this._mapModel.mapId) &&
        !WorldBossHelper.checkSingleBgMap(this._mapModel.mapId)
      ) {
        this._preLoadNextCampaign = new PreLoadNextCampaign(this._mapModel);
        this._preLoadNextCampaign.mapId = this._mapModel.mapId;
      }

      if (WorldBossHelper.checkSecretFb(this._mapModel.mapId)) {
        if (this._preSceneData && this._preSceneData.isOpenSecretSuccess) {
          FrameCtrlManager.Instance.open(EmWindow.PveSecretSceneWnd, {
            battleReportMsg: this._preSceneData.data,
          });
        } else {
          FrameCtrlManager.Instance.open(EmWindow.PveSecretSceneWnd);
        }
      } else if (
        WorldBossHelper.checkPetLand(this._mapModel.mapId) ||
        WorldBossHelper.checkMineral(this._mapModel.mapId)
      ) {
        // //英灵岛, 紫晶矿场 农作物收获提示
        // FarmManager.Instance.showGatherCropTip();
        FarmManager.Instance.model.needReturnSpace = true;
      }

      if (this._mapModel.campaignTemplate) {
        let campaignId = this._mapModel.campaignTemplate.CampaignId;
        let currentTem: t_s_campaignData =
          ConfigMgr.Instance.campaignTemplateDic[campaignId];
        if (!currentTem)
          currentTem = ConfigMgr.Instance.worldBossDic[campaignId];
        if (!currentTem)
          currentTem = ConfigMgr.Instance.pvpWarFightDic[campaignId];
        if (
          currentTem &&
          currentTem.Capacity == 1 &&
          currentTem.CampaignId != 1 &&
          !FrameCtrlManager.Instance.isOpen(EmWindow.AutoWalkWnd)
        ) {
          //单人本自动寻路
          FrameCtrlManager.Instance.open(EmWindow.AutoWalkWnd);
        }
      }

      super.enterOver();
      resolve();
    });
  }

  public leaving(): Promise<void> {
    return new Promise(async (resolve) => {
      Logger.log("SceneManager.CampaignMapScene:leaving");
      // NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
      MapCameraMediator.unlockMapCamera();
      this.removeEvent();
      this.saveBitmap();
      if (this._view) {
        ObjectUtils.disposeObject(this._view);
        this._view = null;
      }
      if (this._mapModel) {
        this._mapModel.nineSliceScaling = [];
      }
      if (this._preLoadNextCampaign) {
        this._preLoadNextCampaign.dispose();
        this._preLoadNextCampaign = null;
      }
      CampaignManager.Instance.mapView = null;
      await JoyStickWnd.Instance.Hide();
      await HomeWnd.Instance.instHide();
      HomeWnd.Instance.hideCrossInfo();
      if (UIManager.Instance.isShowing(EmWindow.SpaceTaskInfoWnd))
        UIManager.Instance.HideWind(EmWindow.SpaceTaskInfoWnd);
      // FullBar.Instance.hide();
      // MainToolBar.Instance.hide();
      // TopToolsBar.Instance.hide();
      // TipsBar.Instance.hide();
      // ChatBar.Instance.hide();
      // ResourcesBar.Instance.hide();
      // SmallMapBar.Instance.hide();
      // TaskTraceBar.Instance.hide();
      // ShowTipManager.Instance.removeCurrentTip();
      // BagHelper.Instance.stopSelling();

      //新手
      // MaskUtils.Instance.dispose();
      if (CampaignManager.Instance.exit) {
        CampaignManager.Instance.dispose();
        CampaignSocketManger.Instance.dispose();
      }
      if (FrameCtrlManager.Instance.isOpen(EmWindow.AutoWalkWnd)) {
        FrameCtrlManager.Instance.exit(EmWindow.AutoWalkWnd);
      }
      // if(this._preBattle){
      // 	KeyBoardRegister.Instance.keyEnable = true;
      // 	this._preBattle.dispose();
      // 	this._preBattle= null;
      // }
      // if(this._battleFrame)this._battleFrame.dispose();this._battleFrame=null;
      CampaignManager.Instance.controller = null;
      if (this._rectScanUtils) {
        this._rectScanUtils.getWalkable = null;
        this._rectScanUtils.dispose();
        this._rectScanUtils = null;
      }
      MapElmsLibrary.Instance.unLock();
      this._finPath = null;
      this._algUtils = null;
      this._preLoad = null;
      if (this._mapModel && this._mapModel.exit) {
        MapData.clearData();
        this._mapModel.dispose();
        this._mapModel = null;
        CampaignManager.Instance.controller = null;
      }
      PlayerManager.Instance.currentPlayerModel.selectTarget = null;

      resolve();
    });
  }

  public onEnter(preScene: BaseSceneView, data: object = null) {}

  private gotoCastleScene() {
    if (this._gotoCastleTimeId > 0) {
      clearInterval(this._gotoCastleTimeId);
    }
    this._gotoCastleTimeId = 0;
    SceneManager.Instance.lock = false;
    // SwitchPageHelp.returnToSpace();
  }

  private gotoOutCampaign(): boolean {
    if (CampaignManager.Instance.exit) {
      this._gotoCastleTimeId = setInterval(
        this.gotoCastleScene.bind(this),
        1000,
      ); //loading时被人踢了
      return true;
    }
    return false;
  }

  private _gotoCastleTimeId: any = 0;

  private searchPathSyc(arr: any[], para: object) {
    let str: string = LangManager.Instance.GetTranslation(
      "map.campaign.CampaignMapController.command01",
    );
    MessageTipManager.Instance.show(str);
  }

  private saveBitmap() {
    if (
      !this._mapModel ||
      !this._mapModel.mapTempInfo ||
      !this._view ||
      !this._view.staticRenderLayer
    )
      return;
    if (this._mapModel.exit) return;
    MapData.mapBitmap = this._view.staticRenderLayer.bitmap;
    MapData.mapId = this._mapModel.mapTempInfo.Id;
    MapData.stageWidth = Resolution.gameWidth;
    MapData.stageHeight = Resolution.gameHeight;
    MapData.movePos = null;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public moveMapCallBack(rect: Laya.Rectangle) {
    this._mapModel.targetPoint = new Laya.Point(rect.x, rect.y);
    this._mapModel.nineSliceScaling = MapUtils.getNineSliceScaling(rect);
    let arr: any[] = this._mapModel.checkConfigNoExites();
    if (arr.length > 0) {
      this._mapModel.currentFloorData = arr;
    }
  }

  /***************************************************
   *             事件响应
   * *************************************************/
  private addEvent() {
    NotificationManager.Instance.addEventListener(
      S2CProtocol.U_C_CAMERA_MOVE.toString(),
      this.__campaignSceneMoveHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SLGSocketEvent.U_PLAY_MOVIE,
      this.__playNodeMovieHandler,
      this,
    );
    this._mapModel.addEventListener(
      CampaignMapEvent.ATTACK_BOSS_TEMA,
      this.__refreshTeamHandler,
      this,
    );
    this._mapModel.addEventListener(
      CampaignMapEvent.ATTACK_BOSS_INVITE,
      this.__showInviteHandler,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAY_GETMOIVE,
      this,
      this.__playGetMovieHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_WARMOVIE,
      this,
      this.__warMovieHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_MOVE,
      this,
      this.__playerMoveHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_CONFIRM,
      this,
      this.__confirmFrameHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_TAKEDROP_FAIL,
      this,
      this.__resetFallHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_NPC_CHAT,
      this,
      this.__npcChatHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_NPC_CHASE_ARMY,
      this,
      this.__npcChaseArmyHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_HANGUP_PVP,
      this,
      this.__onPKRequestHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_PLAYER_NODE_STATE,
      this,
      this.__playerTranseferStateHandler,
    );
    //节点
    NotificationManager.Instance.addEventListener(
      NotificationEvent.UN_LOCK_NODE,
      this.__unlockNodeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NotificationEvent.SELF_HELP_RESET_POSITION,
      this.__resetPositionHandler,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      S2CProtocol.U_C_CAMERA_MOVE.toString(),
      this.__campaignSceneMoveHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SLGSocketEvent.U_PLAY_MOVIE,
      this.__playNodeMovieHandler,
      this,
    );
    if (this._mapModel) {
      this._mapModel.removeEventListener(
        CampaignMapEvent.ATTACK_BOSS_TEMA,
        this.__refreshTeamHandler,
        this,
      );
      this._mapModel.removeEventListener(
        CampaignMapEvent.ATTACK_BOSS_INVITE,
        this.__showInviteHandler,
        this,
      );
    }
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAY_GETMOIVE,
      this,
      this.__playGetMovieHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_WARMOVIE,
      this,
      this.__warMovieHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_MOVE,
      this,
      this.__playerMoveHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_CONFIRM,
      this,
      this.__confirmFrameHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_TAKEDROP_FAIL,
      this,
      this.__resetFallHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_NPC_CHAT,
      this,
      this.__npcChatHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_NPC_CHASE_ARMY,
      this,
      this.__npcChaseArmyHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_HANGUP_PVP,
      this,
      this.__onPKRequestHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_PLAYER_NODE_STATE,
      this,
      this.__playerTranseferStateHandler,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.UN_LOCK_NODE,
      this.__unlockNodeHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SELF_HELP_RESET_POSITION,
      this.__resetPositionHandler,
      this,
    );
  }

  /**
   * 玩家到达副本传送点
   * @param evt
   *
   */
  private __playerTranseferStateHandler(pkg: PackageIn) {
    let msg: PlayerNodeStateMsg = pkg.readBody(
      PlayerNodeStateMsg,
    ) as PlayerNodeStateMsg;
    let cArmy: CampaignArmy = this._mapModel.getBaseArmyByArmyId(msg.armyId);
    if (cArmy) {
      cArmy.setTranseferWait(msg.isStand, msg.nodeId, msg.mapId);
    }
  }

  /**
   * 收到一条切磋请求
   * @param evt
   *
   */
  private __onPKRequestHandler(pkg: PackageIn) {
    let msg: HangupAttackMsg = pkg.readBody(HangupAttackMsg) as HangupAttackMsg;
    NotificationManager.Instance.dispatchEvent(PK_Event.SPACE_PK, msg);
  }

  /**
   * NPC追击玩家
   * @param evt
   *
   */
  private __npcChaseArmyHandler(pkg: PackageIn) {
    let msg: NPCChaseMsg = pkg.readBody(NPCChaseMsg) as NPCChaseMsg;
    this._mapModel.npcChase(msg);
    pkg = null;
  }

  /**
   * NPC说话
   * @param evt
   *
   */
  private __npcChatHandler(pkg: PackageIn) {
    let msg: NPCChatMsg = pkg.readBody(NPCChatMsg) as NPCChatMsg;

    let chatData: ChatData = new ChatData();
    chatData.uid = msg.id;
    chatData.msg = msg.content;
    chatData.commit();
    let node: CampaignNode = this._mapModel.getMapNodesById(msg.id);
    if (node) node.chatData = chatData;
  }

  private __resetFallHandler(pkg: PackageIn) {
    let msg: BattleReportMsg = pkg.readBody(BattleReportMsg) as BattleReportMsg;
    let nInfo: CampaignNode = this._mapModel.getNodeBySindId(msg.signId);
    if (nInfo) {
      let goods: any[] = [];
      let goodsCount: number = msg.baseItem.length;
      let baseItem: BaseItemMsg;
      for (let j: number = 0; j < goodsCount; j++) {
        baseItem = msg.baseItem[j] as BaseItemMsg;

        let goodInfo: GoodsInfo = new GoodsInfo();
        goodInfo.templateId = baseItem.templateId;
        goodInfo.count = baseItem.count;
        goods.push(goodInfo);
      }
      nInfo.tempData = goods;
      nInfo.info.state = NodeState.EXIST;
      if (nInfo.nodeView) nInfo.nodeView["goods"] = goods;
      nInfo.commit();
    }
  }

  public _preFrameIsClose: boolean = true;

  private __confirmFrameHandler(pkg: PackageIn) {
    // if (!this._preFrameIsClose) {
    //     return;
    // }
    let msg = pkg.readBody(CampaignConfirmMsg) as CampaignConfirmMsg;
    // Logger.xjy("[CampaignMapScene]__confirmFrameHandler", msg)

    let title: string = msg.title;
    let str: string = msg.body;
    let itemTempId: number = msg.itemTempId;
    let itemCount: number = msg.itemCount;
    let mapId: number = msg.mapId;
    let nodeId: number = msg.nodeId;
    let type: number = msg.type;
    // if (StringHelper.isNullOrEmpty(str) && type < 4) {
    //     this.__callServerSccess(false, mapId, nodeId);
    //     return;
    // }
    this._preFrameIsClose = false;
    let frame: DisplayObject;
    if (type == 0) {
      UIManager.Instance.ShowWind(EmWindow.IconAlertHelperWnd, {
        data: [this.__callServerSccess, mapId, nodeId],
        content: [title, str, itemTempId, itemCount],
      });
    } else if (type == 2) {
      FrameCtrlManager.Instance.open(EmWindow.RvrBattleGetResourceWnd, {
        mapId: mapId,
        nodeId: nodeId,
      });
    } else if (type == 3) {
      FrameCtrlManager.Instance.open(EmWindow.TrailDialog, {
        title: title,
        content: str,
        mapId: mapId,
        nodeId: nodeId,
        callBack: this.__callServerSccess.bind(this),
      });
    } else if (type == 4) {
      // 英灵岛 神秘人不触发对话
      if (nodeId == GlobalConfig.CampaignNodeID.Node_2000149) {
        if (
          TaskManage.Instance.cate.hasTaskAndNotCompleted(
            TaskManage.PET_SYSTEM_OPEN_TASK02,
          )
        ) {
          FrameCtrlManager.Instance.open(EmWindow.PetFirstSelectWnd);
        }
        return;
      }

      let node: CampaignNode = this._mapModel.getMapNodeByNodeId(nodeId);
      FrameCtrlManager.Instance.open(EmWindow.PetLandDialogWnd, {
        title: title,
        content: str,
        mapId: mapId,
        nodeId: nodeId,
        node: node,
      });
    } else if (type == 5) {
      let node1: CampaignNode = this._mapModel.getMapNodeByNodeId(nodeId);
      if (node1.nodeId == CampaignMapModel.MINERA_GET_CAR_NODEID) {
        //领取矿车
        if (
          node1.nodeId == CampaignMapModel.MINERA_HAND_CAR_NODEID &&
          this.selfCarInfo.minerals < 200 &&
          this.selfCarInfo.pick_count < 5 &&
          this.selfCarInfo.is_own == 1 &&
          SharedManager.Instance.checkIsExpired(
            SharedManager.Instance.handInMineralDate,
          )
        ) {
          let content: string = LangManager.Instance.GetTranslation(
            "map.campaign.view.frame.MineralDialogFrame.handInAlert",
          );
          UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
            state: 2,
            content: content,
            backFunction: this.handInAlertBack.bind(this),
            dataArray: [mapId],
          });
        } else {
          MapSocketOuterManager.sendFrameCallBack(mapId, node1.nodeId, true);
        }
      } else if (node1.nodeId == CampaignMapModel.MINERA_HAND_CAR_NODEID) {
        MapSocketOuterManager.sendFrameCallBack(mapId, node1.nodeId, true);
      }
    } else if (type == 6) {
      UIManager.Instance.ShowWind(EmWindow.IconAlertHelperWnd, {
        data: [this.__mineralConfirmCall, mapId, nodeId],
        content: [title, str, itemTempId, itemCount],
      });
    } else if (type == 10) {
      //王者之塔
      FrameCtrlManager.Instance.open(EmWindow.TrailDialog, {
        title: title,
        content: str,
        mapId: mapId,
        nodeId: nodeId,
        callBack: this.__callServerSccess.bind(this),
      });
    } else if (type == 16) {
      //公会BOSS
      MapSocketOuterManager.sendFrameCallBack(mapId, nodeId, true);
    }
  }

  private hookAlertBack(isSccess: boolean, mapId: number, nodeId: number) {
    MapSocketOuterManager.sendFrameCallBack(mapId, nodeId, isSccess);
  }

  private get selfCarInfo(): MineralCarInfo {
    return CampaignManager.Instance.mineralModel.selfCarInfo;
  }

  protected handInAlertBack(notAlert: boolean, data: Array<any>) {
    if (notAlert) {
      SharedManager.Instance.handInMineralDate = new Date();
      SharedManager.Instance.saveHandInMineralAlert();
    }
    MapSocketOuterManager.sendFrameCallBack(
      data[0],
      CampaignMapModel.MINERA_GET_CAR_NODEID,
      true,
    );
  }

  private __mineralConfirmCall(
    isSccess: boolean,
    mapId: number,
    nodeId: number,
  ) {
    if (isSccess)
      SocketSendManager.Instance.sendSessionOverToBattle(
        mapId,
        nodeId,
        CollectionAction.LEAVE,
      );
  }

  private __callServerSccess(isSccess: boolean, mapId: number, nodeId: number) {
    MapSocketOuterManager.sendFrameCallBack(mapId, nodeId, isSccess);
  }

  //////////////////////////////////////////////////////////////////
  private __playerMoveHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      BattleManager.preScene,
      this.createPlayerMoveAction.bind(this),
    );
  }

  private createPlayerMoveAction(pkg: PackageIn) {
    let msg: PlayerMoveMsg = pkg.readBody(PlayerMoveMsg) as PlayerMoveMsg;
    GameBaseQueueManager.Instance.addAction(new PlayerMoveAction(msg));
    pkg = null;
  }

  private __warMovieHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.playerMovie.bind(this),
    );
  }

  private playerMovie(pkg: PackageIn) {
    let msg: WarMovieMsg = pkg.readBody(WarMovieMsg) as WarMovieMsg;
    GameBaseQueueManager.Instance.addAction(new ScoreOrGesteAction(msg));
  }

  /**
   * 副本中玩家获得奖励 在头上飘动画
   * @param evt
   *
   */
  private __playGetMovieHandler(pkg: PackageIn) {
    SocketSceneBufferManager.Instance.addPkgToBuffer(
      pkg,
      SceneType.CAMPAIGN_MAP_SCENE,
      this.playGetMovie.bind(this),
    );
  }

  private playGetMovie(pkg: PackageIn) {
    // Logger.xjy("[CampaignMapScene]playGetMovie", pkg, this._mapModel)
    if (this._mapModel && pkg) {
      let msg: FightOverMoiveMsg = pkg.readBody(
        FightOverMoiveMsg,
      ) as FightOverMoiveMsg;
      let armyInfo: CampaignArmy = this._mapModel.selfMemberData;
      if (armyInfo)
        GameBaseQueueManager.Instance.addAction(
          new BattleGetMoviesAction(armyInfo, msg),
        );
    }
  }

  private exitSubmitBack(b: boolean) {
    if (b) {
      CampaignSocketOutManager.Instance.sendExitCampaignScene(
        this.currentArmyId,
      );
    }
  }

  // private _preBattle:PrepareBattleFrame2;
  private __refreshTeamHandler(evt: CampaignMapEvent) {
    // if(this._preBattle && !this._preBattle.isDie)
    // {
    // 	this._preBattle.data = evt.data;
    // 	return;
    // }
    // else
    // {
    // 	if(this._preBattle && this._preBattle.isDie)this._preBattle = null;
    // }
    // this._preBattle = ComponentFactory.Instance.creatComponentByStylename("map.campaign.PrepareBattleFrame2");
    // this._preBattle.show();
    // KeyBoardRegister.Instance.keyEnable = false;
    // this._preBattle.data = evt.data;
  }

  // private _battleFrame : PrepareBattleFrame1;
  private __showInviteHandler(evt: CampaignMapEvent) {
    // if(this._battleFrame && !this._battleFrame.isDie)return;
    // this._battleFrame = ComponentFactory.Instance.creatComponentByStylename("map.campaign.PrepareBattleFrame1");
    // this._battleFrame.data = evt.data;
    // this._battleFrame.show();
  }

  private __campaignSceneMoveHandler(pkg: PackageIn) {
    let msg: PlayerMoveCameraMsg = pkg.readBody(
      PlayerMoveCameraMsg,
    ) as PlayerMoveCameraMsg;
    GameBaseQueueManager.Instance.addAction(
      new SceneMoveAction(msg.targetX, msg.targetY),
      true,
    );
    msg = null;
    pkg = null;
  }

  private __playNodeMovieHandler(pkg: PackageIn) {
    let msg: PlayerMovieMsg = pkg.readBody(PlayerMovieMsg) as PlayerMovieMsg;

    let node: any;
    if (msg.movieTargetType == MovieTargetType.NODE) {
      node = this._view.getNpcNodeById(msg.targetId);
    } else if (msg.movieTargetType == MovieTargetType.ARMY) {
      let caInfo: CampaignArmy = this._mapModel.getBaseArmyByArmyId(
        msg.targetId,
      );
      let armyView: object =
        CampaignManager.Instance.controller.getArmyView(caInfo);
      if (caInfo) node = armyView;
    }
    if (node) this._mapModel.updateFog(node.x, node.y, FogGridType.OPEN_TWO);

    // Logger.xjy("[CampaignMapScene]__playNodeMovieHandler", msg, msg.movieType)

    let delay = 75;
    switch (msg.movieType) {
      case MovieType.DISAPPEARD:
        delay = 1;
        break;
    }
    CampaignActionsFactory.createAction(
      msg.movieType,
      node,
      pkg,
      delay,
      msg.targetId,
    );
  }

  private get consortiaModel(): ConsortiaModel {
    return ConsortiaManager.Instance.model;
  }

  // physics view
  public _armyViewList: any[] = [];

  public getArmyView(aInfo: BaseArmy): any {
    if (!aInfo) {
      return null;
    }
    for (let i = 0; i < this._armyViewList.length; i++) {
      let aView = this._armyViewList[i];
      if (!aView) continue;
      let aData = aView.data;
      if (!aData) continue;
      if (aData == aInfo || aData.key == aInfo.key) {
        return aView;
      }
    }
    return null;
  }

  public addArmyView(armyView: any) {
    this._armyViewList.push(armyView);
  }

  public removeArmyView(armyView: any) {
    let index: number = this._armyViewList.indexOf(armyView);
    if (index >= 0) {
      this._armyViewList.splice(index, 1);
    }
  }

  public moveArmyByPath(path: any): void {
    if (path) {
      let sfArmy: CampaignArmy = this._mapModel.selfMemberData;
      let selfView: MonopolyArmyView = this.getArmyView(sfArmy);
      // let selfView1:MonopolyArmyView = this.getArmyView(sfArmy);
      selfView.aiInfo.pathInfo = path;
    }
  }

  /**
   * 找出公会战中可增援/可战斗的部队
   *
   */
  public get armyGvgFight(): any {
    let sfArmy: CampaignArmy = this._mapModel.selfMemberData;
    let selfView: any = this.getArmyView(sfArmy);
    for (let element of this._mapModel.allBaseArmy.values()) {
      let armyView: any = this.getArmyView(element);
      if (armyView) {
        let offX: number = selfView.x - armyView.x;
        let offY: number = selfView.y - armyView.y;
        let off: number = offX * offX + offY * offY;
        if (off < 10000) {
          if (element.baseHero.consortiaID != sfArmy.baseHero.consortiaID) {
            return element;
          } else {
            if (!ArmyState.checkCampaignAttack(element.state)) {
              return element;
            }
          }
        }
      }
    }
    return null;
  }

  /***************************************************
   *   GET / SET
   * *************************************************/
  private get currentArmyId(): number {
    return ArmyManager.Instance.army.id;
  }

  private _rectScanUtils: WalkRectScanUtils;

  private initRectScan() {
    this._rectScanUtils.outWidth =
      this._mapModel.mapTempInfo.Width / Tiles.WIDTH;
    this._rectScanUtils.outHeight =
      this._mapModel.mapTempInfo.Height / Tiles.HEIGHT;
    this._rectScanUtils.getWalkable = this.getWalkable.bind(this);
  }

  private _finPath: FindPath8;
  private _algUtils: AcorrsLineGrid;

  public get findPath(): FindPath8 {
    return this._finPath;
  }

  public searchPath(beginPoint: Laya.Point, endPoint: Laya.Point): any[] {
    if (this._finPath && this._algUtils) {
      return this._algUtils.getPsnode(this._finPath.find(beginPoint, endPoint));
    }
    return null;
  }

  private __resetPositionHandler(evt: NotificationEvent) {
    let army: CampaignArmy = this._mapModel.selfMemberData;
    if (!army) {
      return;
    }
    let armyView: any = this.getArmyView(army);
    if (!armyView) {
      return;
    }
    let curX: number = armyView.x / Tiles.WIDTH;
    let curY: number = armyView.y / Tiles.WIDTH;
    if (this.getWalkable(curX, curY)) {
      if (!this._mapModel.getMapNodesByPoint(new Laya.Point(curX, curY))) {
        return;
      }
    }
    let reset: Laya.Point = this._mapModel.getNeighborII(curX, curY);
    if (reset) {
      if (!this._mapModel.getMapNodesByPoint(reset)) {
        return;
      }
    }
    reset = this._mapModel.getNeighborIII(curX, curY);
    if (!reset) {
      return;
    }
    armyView.x = reset.x * Tiles.WIDTH;
    armyView.y = reset.y * Tiles.HEIGHT;
  }

  /**
   * 把自己移动到地图的某一点
   * @param endX
   * @param endY
   * @param isCheckRect
   * @param isAttack
   * @return
   *
   */
  public moveArmyByPos(
    endX: number,
    endY: number,
    isCheckRect: boolean = false,
    isAttack: boolean = false,
  ): boolean {
    //移动到某个点
    NotificationManager.Instance.sendNotification(
      NotificationEvent.LOCK_TEAM_FOLLOW_TARGET,
      0,
    );
    let end: Laya.Point = new Laya.Point(endX, endY);
    let army: CampaignArmy = this._mapModel.selfMemberData;
    // Logger.xjy("[CampaignMapScene]moveArmyByPos:", endX, endY)
    if (!army) {
      return false;
    }
    let armyView: any = CampaignManager.Instance.controller.getArmyView(army);
    if (!armyView) {
      return false;
    }
    let current: Laya.Point = new Laya.Point(armyView.x, armyView.y);
    let start: Laya.Point = this.getStartPoint(armyView.x, armyView.y, end);
    if (
      start.x < 0 ||
      start.x > this._mapModel.mapTempInfo.Width ||
      start.y < 0 ||
      this._mapModel.mapTempInfo.Height < start.y
    ) {
      return false;
    }
    if (isCheckRect) {
      this.initRectScan();
      end = this._rectScanUtils.walkRectScan(
        end,
        new Laya.Point(start.x / 20, start.y / 20),
        current,
      );
    }
    if (end) {
      if (!ArmyState.checkCampaignAttack(army.state)) {
        return false;
      }
      let startPos: Laya.Point = new Laya.Point(
        parseInt((start.x / 20).toString()),
        parseInt((start.y / 20).toString()),
      );
      let endPos: Laya.Point = new Laya.Point(
        parseInt((end.x / 20).toString()),
        parseInt((end.y / 20).toString()),
      );
      let distance: number = startPos.distance(endPos.x, endPos.y);
      let arr: any[] = this._finPath.find(startPos, endPos);
      // Logger.xjy("[CampaignMapScene]startPos:", startPos.x, startPos.y, "endPos:", endPos.x, endPos.y, "path:", arr)

      if (!arr || arr.length <= 0) {
        if (
          WorldBossHelper.checkPetLand(this._mapModel.mapId) ||
          WorldBossHelper.checkMineral(this._mapModel.mapId) ||
          WorldBossHelper.checkPvp(this._mapModel.mapId) ||
          WorldBossHelper.checkCrystal(this._mapModel.mapId)
        ) {
          //执行到达事件
          if (CampaignArmyViewHelper.selfArmyToEnd(armyView.aiInfo, armyView)) {
            return false;
          }
          if (
            CampaignArmyViewHelper.selfArmyEvent(
              army.userId,
              armyView.aiInfo,
              armyView,
              new Laya.Point(
                parseInt((start.x / 20).toString()),
                parseInt((start.y / 20).toString()),
              ),
              true,
            )
          ) {
            return false;
          }
        } else if (WorldBossHelper.single(this._mapModel.mapId)) {
          //单人副本里面没有路径的时候
          let campaignNodeArr: Array<CampaignNode> =
            CampaignManager.Instance.mapModel.getNearTransportNode(); //所有的传送点
          let minDistance: number = 99999;
          let minArrLength: number = 999999;
          let minArr: any[];
          let selectNode: CampaignNode;
          for (let i: number = 0; i < campaignNodeArr.length; i++) {
            var nextNode: CampaignNode = campaignNodeArr[i];
            if (nextNode) {
              var vNode: DisplayObject =
                CampaignManager.Instance.mapView.getNpcNodeById(
                  nextNode.info.id,
                );
              end = new Laya.Point(vNode.x, vNode.y);
              if (isCheckRect) {
                this.initRectScan();
                end = this._rectScanUtils.walkRectScan(
                  end,
                  new Laya.Point(start.x / 20, start.y / 20),
                  current,
                );
              }
              if (end) {
                if (!ArmyState.checkCampaignAttack(army.state)) {
                  return false;
                }
                let startPos: Laya.Point = new Laya.Point(
                  parseInt((start.x / 20).toString()),
                  parseInt((start.y / 20).toString()),
                );
                let endPos: Laya.Point = new Laya.Point(
                  parseInt((end.x / 20).toString()),
                  parseInt((end.y / 20).toString()),
                );

                distance = startPos.distance(endPos.x, endPos.y);
                if (distance < minDistance) {
                  minDistance = distance;
                }
                arr = this._finPath.find(startPos, endPos);
                if (arr.length < minArrLength && arr.length > 0) {
                  minArrLength = arr.length;
                  minArr = arr;
                  selectNode = nextNode;
                }
              }
            }
          }
          CampaignManager.Instance.mapModel.selectNode = selectNode;
          distance = minDistance;
          arr = minArr;
        } else {
          Logger.warn(
            "[CampaignMapScene]点击物体, 无移动路径点, 没执行军队到达, 若需要在上面加条件",
            this._mapModel.mapId,
          );
        }
      }

      if (distance > 2) {
        if (!this.checkWorldBossAndPlayerDie(army)) {
          if (
            CampaignArmyViewHelper.selfArmyEvent(
              army.userId,
              armyView.aiInfo,
              armyView,
              new Laya.Point(
                parseInt((start.x / 20).toString()),
                parseInt((start.y / 20).toString()),
              ),
            )
          ) {
            return false;
          }
        }
      } else if (isAttack) {
        if (!this.checkWorldBossAndPlayerDie(army)) {
          if (CampaignArmyViewHelper.selfArmyToEnd(armyView.aiInfo, armyView)) {
            return false;
          }
          if (
            CampaignArmyViewHelper.selfArmyEvent(
              army.userId,
              armyView.aiInfo,
              armyView,
              new Laya.Point(
                parseInt((start.x / 20).toString()),
                parseInt((start.y / 20).toString()),
              ),
              true,
            )
          ) {
            return false;
          }
        }
      }
      if (arr) {
        // startPos: 85 28 endPos: 52 21
        // pathInfo1: [85,28][84,27][83,26][82,25][81,24][80,23][79,23][78,23][77,23][76,23][75,23][74,23][73,23][72,23][71,23][70,22][69,21][68,21][67,21][66,21][65,21][64,21][63,21][62,21][61,21][60,21][59,21][58,21][57,21][56,21][55,21][54,21][53,21][52,21]
        // pathInfo2: [85,28][52,21]

        // let str1 = ""
        // let str2 = ""
        // arr.forEach(element => {
        //     str1 += "[" + element.x + "," + element.y + "]"
        // });
        // Logger.xjy("[CampaignMapScene]pathInfo1:", str1)

        arr = this._algUtils.getPsnode2(arr);
        armyView.aiInfo.pathInfo = arr;

        // arr.forEach(element => {
        //     str2 += "[" + element.x + "," + element.y + "]"
        // });
        // Logger.xjy("[CampaignMapScene]pathInfo2:", str2)

        if (arr && arr.length > 1) {
          this._mapModel.updateWalkTarget(end);
        }
        if (MouseData.Instance.curState != MouseData.LOCK) {
          MouseData.Instance.curState = MouseData.NORMAL;
        }
        return true;
      }
    }
    return false;
  }

  private checkWorldBossAndPlayerDie(armyData: CampaignArmy): boolean {
    if (
      WorldBossHelper.checkWorldBoss(this._mapModel.mapId) &&
      CampaignArmyState.checkDied(armyData.isDie)
    ) {
      return true;
    }
    return false;
  }

  /**
   * 找到一个可行走的起始点
   * @param curX 像素点
   * @param curY 像素点
   * @param nextPoint
   * @return
   *
   */
  private getStartPoint(
    curX: number,
    curY: number,
    nextPoint: Laya.Point,
  ): Laya.Point {
    if (this.getWalkable(curX / 20, curY / 20)) {
      return new Laya.Point(curX, curY);
    }

    let p: Laya.Point = this._mapModel.getNeighborII(curX / 20, curY / 20);
    if (!p) {
      p = new Laya.Point(curX / 20, curY / 20);
    }
    p.x = p.x * 20;
    p.y = p.y * 20;
    return p;
  }

  /**
   * 检查一个点（20 X 20）是否可行走
   * @param $x
   * @param $y
   * @return
   *
   */
  public getWalkable($x: number, $y: number): boolean {
    return this._mapModel.getPointValue($x, $y);
  }

  /**
   * 军队到达某个节点 向服务器发送消息
   * @param armyId 军队id
   * @param nodeId 节点id
   *
   */
  public sendCampaignArrive(
    armyId: number,
    nodeId: number,
    protocolId: number = 0,
  ) {
    if (!this._bSendCampaignArriveCool) {
      this._bSendCampaignArriveCool = true;
      Laya.timer.once(500, null, () => {
        this._bSendCampaignArriveCool = false;
      });
      Logger.base(
        "🚩军队到达某个节点,向服务器发送消息 armyId-->" +
          armyId +
          " nodeId-->" +
          nodeId +
          " protocolId-->" +
          protocolId,
      );
      MapSocketOuterManager.sendCampaignArrive(
        armyId,
        nodeId,
        true,
        protocolId,
      );
    } else {
      Logger.base(
        "🚩重复发送 军队到达某个节点armyId-->" + armyId + " nodeId-->" + nodeId,
      );
    }
  }

  /**
   * 战斗增援
   * @param nodeId 正在战斗的节点id
   *
   */
  public sendReinforce(nodeId: number) {
    MapSocketOuterManager.sendReinforce(nodeId);
  }

  /**
   * 公会战中攻击玩家
   * @param enemyUserId 玩家的userId
   *
   */
  public gvgPlayerFight(enemyUserId: number) {
    MapSocketOuterManager.gvgPlayerFight(enemyUserId);
  }

  /**
   * 使用点卷或礼金购买世界bossbuffer
   * @param type 1--点卷  2--礼金
   *
   */
  public buyWorldBossBufferWithPointOrGiftToken(type: number) {
    MapSocketOuterManager.sendBuyWorldBossBuffer(2, type); //2 购买
  }

  /**
   * 接受切磋邀请
   * @param defencer 防御者userid
   * @param attacker 攻击者userid
   *
   */
  public receivePKRequest(defencer: number, attacker: number) {
    MapSocketOuterManager.receivePKRequest(defencer, attacker);
  }

  /**
   * 拒绝切磋邀请
   * @param defencer 防御者userid
   * @param attacker 攻击者userid
   *
   */
  public refusePKRequest(defencer: number, attacker: number) {
    MapSocketOuterManager.refusePKRequest(defencer, attacker);
  }

  public alertMsg(msg: string) {
    MessageTipManager.Instance.show(msg);
  }

  private __unlockNodeHandler(data: any) {
    let id: number = parseInt(data.toString());
    let node: CampaignNode = this._mapModel.getMapNodesById(id);
    if (node && node.nodeView instanceof NpcAvatarView) {
      (<NpcAvatarView>node.nodeView).aiInfo.pathInfo = [];
      MapSocketOuterManager.sendAlertState(node.nodeId, false);
    }
  }

  public get SceneName(): string {
    return SceneType.CAMPAIGN_MAP_SCENE;
  }

  public getUIID() {
    return SceneType.CAMPAIGN_MAP_SCENE;
  }
}
