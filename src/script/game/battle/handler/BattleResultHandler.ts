import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import UIManager from "../../../core/ui/UIManager";
import { MultiFailedAlertAction } from "../../action/map/MultiFailedAlertAction";
import { BattleType } from "../../constant/BattleDefine";
import { SoundIds } from "../../constant/SoundIds";
import { EmWindow } from "../../constant/UIDefine";
import {
  BattleEvent,
  BattleNotic,
  NotificationEvent,
  SceneEvent,
} from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SharedManager } from "../../manager/SharedManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import WarlordsManager from "../../manager/WarlordsManager";
import { MapInitData } from "../../map/data/MapInitData";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import SpaceManager from "../../map/space/SpaceManager";
import { MapData } from "../../map/space/data/MapData";
import BattleFailedSimpleWnd from "../../module/battle/BattleFailedSimpleWnd";
import BattleFailedWnd from "../../module/battle/BattleFailedWnd";
import BattleVictorySimpleWnd from "../../module/battle/BattleVictorySimpleWnd";
import BattleVictoryWnd from "../../module/battle/BattleVictoryWnd";
import WarlordsModel from "../../module/warlords/WarlordsModel";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { DelayActionsUtils } from "../../utils/DelayActionsUtils";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { BatterModel } from "../data/BatterModel";
import { BattleRecordReader } from "../record/BattleRecordReader";
import { BloodHelper } from "../skillsys/helper/BloodHelper";

//@ts-expect-error: External dependencies
import BattleReportMsg = com.road.yishi.proto.battle.BattleReportMsg;

//@ts-expect-error: External dependencies
import BaseItemMsg = com.road.yishi.proto.battle.BaseItemMsg;
import Point = Laya.Point;
import NewbieBaseActionMediator from "../../module/guide/mediators/NewbieBaseActionMediator";
import NewbieModule from "../../module/guide/NewbieModule";
import { OuterCityWarModel } from "../../module/outercityWar/model/OuterCityWarModel";

/**
 * 战斗结果处理
 * @author yuanzhan.yu
 */
export class BattleResultHandler {
  private combat: number = 0;
  private _battlePkg: PackageIn;
  private _battleMsg: BattleReportMsg;
  /**
   * 战斗结果视图
   */
  private _resultView: any;

  private _resultViewData: any[];
  private goods: any[];
  private _signId: string = "";
  private _pos: Point;
  private _waitCount: number = 0;

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  private get battlerModel(): BatterModel {
    return BattleManager.Instance.batterModel;
  }

  constructor() {}

  public handler(data: PackageIn) {
    if (PlayerManager.Instance.loginState < 0) {
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.WARLORDS_ROOM) {
      //武斗会战斗中掉线特殊处理（玩家比赛中掉线再登陆进入武斗会房间, 会向服务器请求, 但服务器检测到跨服服务器已存在此玩家, 就不再加进玩家数据, 所以要再次请求, 并不执行场景切换）
      WarlordsManager.Instance.reqEnterWarlordsRoom();
      return;
    }
    if (this.battleModel) {
      if (
        this.battleModel.battleType == BattleType.CAMPAIGN_BATTLE ||
        this.battleModel.battleCapity == 4
      ) {
        //多人副本
        if (this.battlerModel) {
          //连击
          let batterCount: number = this.battlerModel.maxBatterCount;
          if (batterCount > 2) {
            SocketSendManager.Instance.sendBattleCount(batterCount);
          }
        }
      }
    }

    this._battlePkg = data;
    this._battleMsg = this._battlePkg.readBody(
      BattleReportMsg,
    ) as BattleReportMsg;
    this.readPkg();

    let str: string = LangManager.Instance.GetTranslation(
      "battle.handler.BattleResultHandler.debug01",
    ); //退出战斗, battleId=
    if (this.battleModel) {
      Logger.battle(str + this.battleModel.battleId);
    } else {
      str = LangManager.Instance.GetTranslation(
        "battle.handler.BattleResultHandler.debug02",
      ); //退出战斗,但找不到战斗相关数据
      Logger.battle(str);
    }
    this.checkExecuteAbled();
  }

  /**
   * 判断该动作是否可执行
   *
   */
  private checkExecuteAbled() {
    if (this._waitCount > 100 || BattleManager.Instance.isAllSkillExecuted()) {
      Logger.battle("播放胜利失败面板: " + this._waitCount);
      this.execute();
    } else {
      Laya.timer.once(30, this, this.checkExecuteAbled);
      this._waitCount++;
    }
  }

  private execute() {
    let vs: number = 1;
    let ls: number = 1;
    if (this.battleModel) {
      vs = this.battleModel.selfHero.side;
      if (this.combat != 1) {
        if (vs == 1) {
          vs = 2;
        } else {
          vs = 1;
        }
      }
      if (this.battleModel.isAllDead()) {
        this.battleModel.playVictoryAction(vs);
      }
      // 英灵竞技, 快速结束特殊处理
      if (vs == 1) {
        ls = 2;
      }
      if (this.battleModel.battleType == BattleType.PET_PK) {
        this.battleModel.playDefeatedAction(ls);
      }
    }
    this.showNewVersionPane();
    let playerModel = PlayerManager.Instance.currentPlayerModel;
    if (playerModel) {
      if (this.combat == 1 && playerModel.isAutoWalk) {
        playerModel.setAutoWalk(PlayerModel.AUTO_WALK);
      } else {
        playerModel.setAutoWalk(PlayerModel.CANCAL_AUTO_WALK);
      }
    }
    if (this.battleModel) {
      this.battleModel.isOver = true;
      NotificationManager.Instance.sendNotification(
        BattleNotic.SKILL_ENABLE,
        false,
      );
    }
  }

  /**
   * 显示新版本的战斗结果弹出面板.
   *
   */
  private _preScent: string;

  private showNewVersionPane() {
    this._tme = Laya.Browser.now();
    this._preScent = BattleManager.preScene;
    this.clearView();
    AudioManager.Instance.stopMusic();

    let isInBattle: boolean = BattleManager.Instance.battleScene ? true : false;
    if (
      this.combat == 1 &&
      isInBattle &&
      SceneManager.Instance.currentType == SceneType.BATTLE_SCENE
    ) {
      AudioManager.Instance.playSound(SoundIds.BATTLE_RESULT_WIN);
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.BATTLE_RESULT,
        true,
      );
      try {
        if (this.needDetailInfo()) {
          this._resultView = BattleVictoryWnd.Instance;
        } else {
          this._resultView = BattleVictorySimpleWnd.Instance;
        }
      } catch (e) {
        this.exitDirect();
        return;
      }
    } else if ((this.combat == 2 || this.combat == 3) && isInBattle) {
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.BATTLE_RESULT,
        false,
      );
      try {
        if (this.needDetailInfo()) {
          this._resultView = BattleFailedWnd.Instance;
        } else {
          this._resultView = BattleFailedSimpleWnd.Instance;
        }
      } catch (e) {
        this.exitDirect();
        return;
      }
    } else {
      this.exitDirect();
      return;
    }
    Logger.battle("🔥退出战斗场景 显示胜利失败", this._resultViewData);
    this._tme = Laya.Browser.now();

    //为了解决多人竞技战斗中重新上线后的战斗结束时结算界面不正确的问题 因为重新上线后的BattleManager.preScene会清空的, 服务器也不会记录, 只会根据战斗类型判断
    if (
      this.battleModel &&
      this.battleModel.battleType == BattleType.BATTLE_MATCHING &&
      this.combat != 3
    ) {
      // && BattleManager.preScene == SceneType.PVP_ROOM_SCENE) {
      let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
      Logger.battle(
        "[BattleResultHandler]pvp竞技场结算",
        playerInfo.mulSportChange,
      );
      let win = playerInfo.mulSportChange >= 0 ? true : false;
      FrameCtrlManager.Instance.open(EmWindow.PvpRoomResultWnd, {
        win: win,
        change: Math.abs(playerInfo.mulSportChange),
      });
    } else {
      this._resultView.setData(this._resultViewData);
      this._resultView.Show(this.battleModel.battleType);
    }

    // jeremy 慎用, 加载不出来界面不会执行callback
    // this._resultView.autoCloseFun = this.resultViewCloseFun.bind(this);

    Laya.timer.once(2000, this, this.resultViewCloseFun);
  }

  /**
   * 是否需要详细信息
   * @return
   *
   */
  private _tme: number = 0;

  private needDetailInfo(): boolean {
    if (this.battleModel) {
      if (
        this.battleModel.battleType == BattleType.BATTLE_MATCHING ||
        this.battleModel.battleType == BattleType.OUTYARD_BATLE
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * 直接退出
   *
   */
  private exitDirect() {
    this.resultViewCloseFun();
    NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_CANCEL, null);
  }

  private resultViewCloseFun() {
    let scene: string =
      this._preScent != "" ? this._preScent : SwitchPageHelp.returnScene;
    BattleResultHandler.exitBattle(scene, this.combat, this._battleMsg);
    BattleManager.exitFlag = true;
    BattleManager.loginToBattleFlag = false;
    this.clearView();
    if (!SharedManager.Instance.multiFailded) {
      if (
        this._battleMsg &&
        this._battleMsg.battleResult == 2 &&
        this._battleMsg.failCount > 4
      ) {
        DelayActionsUtils.Instance.addAction(new MultiFailedAlertAction());
      }
    }
  }

  private clearView() {
    NewbieBaseActionMediator.cleanGuildFrame();

    if (this._resultView) {
      if (this._resultView.type == EmWindow.BattleFailed) {
        UIManager.Instance.HideWind(EmWindow.BattleFailed);
      } else if (this._resultView.type == EmWindow.BattleFailedSimple) {
        UIManager.Instance.HideWind(EmWindow.BattleFailedSimple);
      } else if (this._resultView.type == EmWindow.BattleVictory) {
        UIManager.Instance.HideWind(EmWindow.BattleVictory);
      } else if (this._resultView.type == EmWindow.BattleVictorySimple) {
        UIManager.Instance.HideWind(EmWindow.BattleVictorySimple);
      }
    }
    this._resultView = null;
  }

  /**
   * 退出战斗 , 通过战斗类型, 决定退出到什么场景
   * @param preScene
   * @return
   *
   */
  public static exitBattle(
    preScene: string = BattleManager.preScene,
    combat: number = 1,
    data: object = null,
  ): string {
    //			CancelBattleEffectController.cancel();/、当前应策划要求取消 提示取消特效
    BloodHelper.setup();
    let sceneType: string =
      preScene != "" ? preScene : SwitchPageHelp.returnScene;

    // 录像场景回到自己上一个场景
    if (BattleRecordReader.inRecordMode) {
      SceneManager.Instance.setScene(sceneType, null, false, true);
      return;
    }

    let bmodel = BattleManager.Instance.battleModel;
    BattleManager.Instance.plotHandler.inactive();
    if (BattleManager.Instance.battleScene) {
      NotificationManager.Instance.addEventListener(
        SceneEvent.SCENE_SWITCH_CALL,
        BattleResultHandler.sceneSwitchCallHandler,
        this,
      );
    } else {
      BattleResultHandler.exitBattleComplete();
    }

    SceneManager.Instance.lock = false;
    let parm: any = {};
    parm.isShowLoading = false;
    if (bmodel) {
      switch (bmodel.battleType) {
        case BattleType.RES_WILDLAND_BATTLE:
        case BattleType.NPC_WILDLAND_BATTLE:
        case BattleType.TRE_WILDLAND_BATTLE:
        case BattleType.CASTLE_BATTLE:
        case BattleType.WILD_QUEUE_BATTLE:
          sceneType = SceneType.OUTER_CITY_SCENE;
          break;
        case BattleType.BATTLE_CHALLENGE:
        case BattleType.BATTLE_SECRET:
          sceneType = BattleManager.preScene;
          break;
        case BattleType.PET_PK:
        case BattleType.SINGLE_PASS:
        case BattleType.TOLLGATE_GOD_BATTLE:
        case BattleType.PET_CAMPAIGN:
        case BattleType.REMOTE_PET_BATLE:
          sceneType = SwitchPageHelp.returnScene; //离线挑战翻牌后跳转
          break;
        case BattleType.TREASUREMAP_BATTLE:
          //藏宝图战斗
          if (preScene == SceneType.CAMPAIGN_MAP_SCENE) {
            sceneType = SceneType.CAMPAIGN_MAP_SCENE;
          } else {
            sceneType = SwitchPageHelp.returnScene;
          }
        case BattleType.WORLD_BOSS_BATTLE:
        case BattleType.HANGUP_PVP:
        case BattleType.SECRECT_LAND:
        case BattleType.FAM_NPC_BATTLE:
        case BattleType.GUILD_TOTEM_BATTLE:
        case BattleType.GUILD_WAR_BATTLE_PLAYER:
          sceneType = SceneType.CAMPAIGN_MAP_SCENE;
          break;
        case BattleType.WARLORDS:
          sceneType = SceneType.WARLORDS_ROOM;
          break;
        case BattleType.WARLORDS_OVER:
          sceneType =
            WarlordsManager.Instance.model.process ==
            WarlordsModel.PROCESS_FINAL
              ? SceneType.WARLORDS_ROOM
              : SwitchPageHelp.returnScene;
          break;
        case BattleType.WORLD_MAP_NPC: //野外战斗
          sceneType = SceneType.OUTER_CITY_SCENE;
          break;
        case BattleType.TREASURE_MINE_BATTLE: //宝矿战斗
          sceneType = SceneType.OUTER_CITY_SCENE;
          break;
        case BattleType.OUT_CITY_PK: //外城PK
          sceneType = SceneType.OUTER_CITY_SCENE;
          break;
        case BattleType.OUT_CITY_WAR_PK:
        case BattleType.OUT_CITY_WAR_PET_PK:
        case BattleType.OUT_CITY_WAR_PET_MONSTER_PK:
        case BattleType.OUT_CITY_VEHICLE:
          sceneType = SceneType.OUTER_CITY_SCENE;
          break;
      }
    }

    if (
      (sceneType == SceneType.CAMPAIGN_MAP_SCENE ||
        SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) &&
      CampaignManager.Instance.mapModel == null
    ) {
      sceneType = SwitchPageHelp.returnScene;
    }
    if (!bmodel && !NewbieModule.Instance.checkEnterCastle()) {
      return sceneType;
    } //新手副本战斗中断开连接后再登陆会被传到内城, 此处return
    if (sceneType == SceneType.SPACE_SCENE && SpaceManager.Instance.exit) {
      return "";
    }

    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE && bmodel) {
      switch (bmodel.battleType) {
        case BattleType.BATTLE_CHALLENGE:
          parm.isOpenColosseum = true;
          break;
        case BattleType.PET_PK:
          parm.isOpenPetChallenge = true;
          break;
        case BattleType.REMOTE_PET_BATLE:
          parm.isOpenRemotePet = true;
          break;
        case BattleType.TOLLGATE_GOD_BATTLE:
          parm.isOpenGodArrive = true;
          break;
        case BattleType.OUTYARD_BATLE:
          parm.isOutyardBattle = true;
          break;
        case BattleType.PET_CAMPAIGN:
          if (combat == 1) {
            parm.isOpenPetCampaignBattleResult = true;
            parm.data = data;
          } else {
            parm.isOpenPetCampaign = true;
          }
          break;
        case BattleType.SINGLE_PASS:
          if (combat == 1) {
            parm.isOpenSinglePassResultView = true;
            parm.data = data;
          } else {
            parm.isOpenSinglePass = true;
          }
          break;
      }
    }

    if (sceneType == SceneType.OUTER_CITY_SCENE) {
      let mapData: MapInitData = new MapInitData();
      let selfArmy = ArmyManager.Instance.army;
      if (MapData.movePos) {
        mapData.targetPoint = MapData.movePos;
      } else {
        mapData.targetPoint = new Point(
          selfArmy.curPosX * 20,
          selfArmy.curPosY * 20,
        );
      }
      let mapId: number =
        PlayerManager.Instance.currentPlayerModel.mapNodeInfo.info.mapId;
      mapData.mapTempInfo = TempleteManager.Instance.getMapTemplatesByID(mapId);
      mapData.showMapName = false;
      mapData.isShowLoading = false;
      if (bmodel) {
        switch (bmodel.battleType) {
          case BattleType.BATTLE_CHALLENGE:
            mapData.isOpenColosseum = true;
            break;
          case BattleType.CASTLE_BATTLE:
          case BattleType.OUT_CITY_WAR_PK:
          case BattleType.OUT_CITY_WAR_PET_PK:
          case BattleType.OUT_CITY_WAR_PET_MONSTER_PK:
            mapData.isOpenOutCityWar = true;
            break;
        }
      }

      Logger.battle("战斗结束返回外城", bmodel && bmodel.battleType);
      SceneManager.Instance.setScene(sceneType, mapData, false, true);
    } else {
      SceneManager.Instance.setScene(sceneType, parm, false, true);
    }

    return sceneType;
  }

  /**
   * 场景切换回调
   * @param evt
   *
   */
  private static sceneSwitchCallHandler(evt: Event) {
    // KeyBoardRegister.instance.battleFlag = false;
    BattleResultHandler.exitBattleComplete();
    NotificationManager.Instance.removeEventListener(
      SceneEvent.SCENE_SWITCH_CALL,
      BattleResultHandler.sceneSwitchCallHandler,
      this,
    );
  }

  private static exitBattleComplete() {
    NotificationManager.Instance.dispatchEvent(
      BattleEvent.BATTLE_COMPLETE,
      null,
    );
  }

  private readPkg() {
    this._resultViewData = [];
    this.combat = this._battleMsg.battleResult; //_battlePkg.readShort();//1胜利, 2失败
    this._resultViewData.push(this._battleMsg.gpBonus);
    let petBonus: number =
      this._battleMsg.petGpBonus > 0 ? this._battleMsg.petGpBonus : 0;
    this._resultViewData.push(petBonus);
    this._resultViewData.push(this._battleMsg.param1);
    this._resultViewData.push(this._battleMsg.param2);
    this.goods = [];
    let goodsCount: number = this._battleMsg.baseItem.length; //_battlePkg.readInt();
    let baseItem: BaseItemMsg;
    for (let j: number = 0; j < goodsCount; j++) {
      baseItem = this._battleMsg.baseItem[j] as BaseItemMsg;

      let goodInfo: GoodsInfo = new GoodsInfo();
      goodInfo.templateId = baseItem.templateId; //_battlePkg.readInt();
      goodInfo.count = baseItem.count; //_battlePkg.readInt();
      this.goods.push(goodInfo);
    }

    if (goodsCount > 0) {
      this._signId = this._battleMsg.signId; //_battlePkg.readUTF();
      this._pos = new Point(this._battleMsg.posX, this._battleMsg.posY);
    }
    OuterCityWarModel.BattleVictory = this.combat == 1;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }
}
