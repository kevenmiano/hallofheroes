//@ts-expect-error: External dependencies
import Logger from "../../../../../core/logger/Logger";
import UIManager from "../../../../../core/ui/UIManager";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import {
  CampaignMapEvent,
  OuterCityEvent,
  SpaceEvent,
} from "../../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { IEnterFrame } from "../../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../../manager/EnterFrameManager";
import FreedomTeamManager from "../../../../manager/FreedomTeamManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { SpaceTemplateManager } from "../../../../manager/SpaceTemplateManager";
import { SpaceWalkDepthMediator } from "../../../../mvc/mediator/SpaceWalkDepthMediator";
import { SpaceWalkTargetMediator } from "../../../../mvc/mediator/SpaceWalkTargetMediator";
import { ArmySpeedUtils } from "../../../../utils/ArmySpeedUtils";
import { PathPointUtils } from "../../../../utils/PathPointUtils";
import AIBaseInfo from "../../../ai/AIBaseInfo";
import { BaseArmyAiInfo } from "../../../ai/BaseArmyAiInfo";
import SimpleBuildingFilter from "../../../castle/filter/SimpleBuildingFilter";
import { AvatarBaseView } from "../../../view/hero/AvatarBaseView";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import Tiles from "../../constant/Tiles";
import SpaceArmy from "../../data/SpaceArmy";
import SpaceManager from "../../SpaceManager";
import { SpaceArmyView } from "../physics/SpaceArmyView";
import { SpaceNpcView } from "../physics/SpaceNpcView";
import SpacePlayerMoveMsg = com.road.yishi.proto.campaign.SpacePlayerMoveMsg;
import SpacePlayerMsg = com.road.yishi.proto.campaign.SpacePlayerMsg;
import { JobType } from "../../../../constant/JobType";
import { ShadowUILayer } from "../../../view/layer/ShadowUILayer";

/**
 * 天空之城人物显示层
 *
 */
export class SpaceWalkLayer extends Laya.Sprite implements IEnterFrame {
  public static RENDER_MAX: number = 30;
  public static ROBOT_MAX: number = 10;
  public static RENDER_TICK: number = 500;
  public static NAME: string = "map.space.view.layer.SpaceWalkLayer";
  private _mediatorKey: string;
  private _walkTarget: fgui.GMovieClip;
  private _filter: SimpleBuildingFilter = new SimpleBuildingFilter();
  private _armyCount: number = 0;
  private _armys: Map<string, SpaceArmyView>;
  private _items: Map<AvatarBaseView, AvatarBaseView>;
  private _userQueue: any[];
  private _robotQueue: any[];
  private _lastTime: number = 0;
  private _renderTime: number = 0;
  private _initPlayersTimeId: number = 0;
  private _initPlayersFlag: boolean = false;

  constructor() {
    super();

    this.autoSize = true;
    this.mouseEnabled = true;
    this.init();
    this.addEvent();
  }

  public get needRobotCount(): number {
    if (this._initPlayersFlag) {
      return (
        SpaceWalkLayer.ROBOT_MAX -
        this._armyCount -
        this._userQueue.length -
        this._robotQueue.length
      );
    }
    return 0;
  }

  private init() {
    this._armys = new Map();
    this._items = new Map();
    this._userQueue = [];
    this._robotQueue = [];

    this._walkTarget = fgui.UIPackage.createObject(
      EmPackName.Base,
      "asset.map.WalkTargetEffectAsset",
    ).asMovieClip;
    this._walkTarget.setPivot(0.5, 0.75, true);
    this._walkTarget.touchable = false;
    SpaceManager.Instance.controller.walkTarget = this._walkTarget;
  }

  private initRegister() {
    var arr: any[] = [SpaceWalkTargetMediator, SpaceWalkDepthMediator];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      SpaceWalkLayer.NAME,
    );
  }

  private addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
    SpaceManager.Instance.model.addEventListener(
      OuterCityEvent.ADD_GARRISON,
      this.__addSpaceArmyHandler,
      this,
    );
    SpaceManager.Instance.model.addEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.__removeSpaceArmyHandler,
      this,
    );
    SpaceManager.Instance.model.addEventListener(
      CampaignMapEvent.MOVE_PATHS_ARMY,
      this.__armyPosBroadHandler,
      this,
    );
    SpaceManager.Instance.model.addEventListener(
      CampaignMapEvent.MOVE_TO_VISIBLE,
      this.__armyMoveToVisibleHandler,
      this,
    );
    SpaceManager.Instance.model.addEventListener(
      CampaignMapEvent.MOVE_TO_UNVISIBLE,
      this.__armyMoveToUnVisibleHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      SpaceEvent.HIDE_OTHERS,
      this.__hideOthersHandler,
      this,
    );
  }

  private removeEvent() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    SpaceManager.Instance.model.removeEventListener(
      OuterCityEvent.ADD_GARRISON,
      this.__addSpaceArmyHandler,
      this,
    );
    SpaceManager.Instance.model.removeEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.__removeSpaceArmyHandler,
      this,
    );
    SpaceManager.Instance.model.removeEventListener(
      CampaignMapEvent.MOVE_PATHS_ARMY,
      this.__armyPosBroadHandler,
      this,
    );
    SpaceManager.Instance.model.removeEventListener(
      CampaignMapEvent.MOVE_TO_VISIBLE,
      this.__armyMoveToVisibleHandler,
      this,
    );
    SpaceManager.Instance.model.removeEventListener(
      CampaignMapEvent.MOVE_TO_UNVISIBLE,
      this.__armyMoveToUnVisibleHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      SpaceEvent.HIDE_OTHERS,
      this.__hideOthersHandler,
      this,
    );
  }

  /**
   * 玩家退出公会时, 其他玩家没有刷新, 还能看到公会名称
   * @param userid
   */
  private otherExitConsortia(userid: number): void {
    this._armys.forEach((elements) => {
      if (userid == elements.data.userId) {
        elements.setConsortiaName("", 0);
      }
    });
  }

  private __hideOthersHandler() {
    this._armys.forEach((elements) => {
      elements.isPlaying = this.isPlaying(elements.data.userId);
    });
  }

  /**
   * 添加机器人
   *
   */
  private __armyMoveToVisibleHandler(data: SpaceArmy) {
    this.addToRobotRenderQueue(data.userId);
  }

  /**
   * 删除机器人
   *
   */
  private __armyMoveToUnVisibleHandler(data: SpaceArmy) {
    this.removeArmy(data);
  }

  private __addSpaceArmyHandler(data: SpaceArmy) {
    this.addToRenderQueue(data.userId);
  }

  private __removeSpaceArmyHandler(data: SpaceArmy) {
    this.removeArmy(data);
  }

  public get armys(): Map<string, SpaceArmyView> {
    return this._armys;
  }

  private isPlaying(userId: number): boolean {
    let spaceModel = SpaceManager.Instance.model;
    if (!spaceModel) return;
    let selfArmy = spaceModel.selfArmy;
    if (!selfArmy) return;

    if (userId != selfArmy.userId) {
      if (
        FreedomTeamManager.Instance.hasTeam &&
        FreedomTeamManager.Instance.inMyTeam(userId)
      ) {
        return true;
      }
      return !SharedManager.Instance.hideOthers;
    }
    return true;
  }

  private addArmy(armyInfo: SpaceArmy): SpaceArmyView {
    if (!this._armys) {
      return null;
    }
    if (armyInfo.isRobot) {
      if (this._armyCount >= SpaceWalkLayer.ROBOT_MAX) {
        return null;
      }
      armyInfo.isAdded = true;
    } else {
      if (this._armyCount >= SpaceWalkLayer.RENDER_MAX) {
        return null;
      }
    }
    if (this._armys.has(armyInfo.key)) {
      return null;
    }
    // if(!armyInfo.baseHero || !armyInfo.baseHero.templateInfo)
    // {
    // 	return null;
    // }
    // Logger.xjy("[SpaceWalkLayer]addArmy armyInfo", armyInfo)
    var armyView: SpaceArmyView = this.createArmy(armyInfo);
    armyView.isPlaying = this.isPlaying(armyView.data.userId);
    this.addChild(armyView);
    this._items.set(armyView, armyView);
    this._armys.set(armyInfo.key, armyView);
    armyView.x = armyInfo.curPosX * Tiles.WIDTH;
    armyView.y = armyInfo.curPosY * Tiles.HEIGHT;
    this._armyCount++;
    return armyView;
  }

  private removeArmy(armyInfo: SpaceArmy) {
    if (!this._armys) {
      return;
    }
    if (armyInfo.isRobot) {
      armyInfo.isAdded = false;
    }
    var armyView: SpaceArmyView = this._armys.get(
      armyInfo.key,
    ) as SpaceArmyView;
    if (armyView) {
      ObjectUtils.disposeObject(armyView);
      this._items.delete(armyView);
      this._armyCount--;
    }
    if (PlayerManager.Instance.currentPlayerModel.selectTarget == armyInfo) {
      PlayerManager.Instance.currentPlayerModel.selectTarget = null;
    }
    this._armys.delete(armyInfo.key);
  }

  private __armyPosBroadHandler(msg: SpacePlayerMoveMsg) {
    if (!msg) {
      return;
    }
    var armyInfo: SpaceArmy;
    var armyView: SpaceArmyView;
    for (const key in msg.players) {
      let playerMsg: SpacePlayerMsg = msg.players[key] as SpacePlayerMsg;
      armyInfo = SpaceManager.Instance.model.getBaseArmyByUserId(
        playerMsg.playerId,
      );
      if (!armyInfo) {
        continue;
      }
      armyView = this._armys.get(armyInfo.key) as SpaceArmyView;
      if (!armyView) {
        continue;
      }
      var paths: any[] = [];
      var pathLength: number = playerMsg.path.length;
      for (var i: number = 0; i < pathLength; i++) {
        paths.push(
          new Laya.Point(
            Math.ceil(playerMsg.path[i].x),
            Math.ceil(playerMsg.path[i].y),
          ),
        );
      }

      var ser: Laya.Point = new Laya.Point(
        paths[0].x * Tiles.WIDTH,
        paths[0].y * Tiles.HEIGHT,
      );
      var leng: number = ser.distance(armyView.x, armyView.y);
      var leftPath: any[];
      if (leng > 250) {
        armyView.x = ser.x;
        armyView.y = ser.y;
      } else {
        var nextIndex: number = armyView.info.nextIndex;
        if (
          armyView.info.pathInfo &&
          armyView.info.pathInfo.length >= nextIndex
        ) {
          leftPath = armyView.info.pathInfo.slice(nextIndex);
        }
      }
      if (leftPath) {
        paths = leftPath.concat(paths);
      }
      var armyPos: Laya.Point = armyView.getTilePos();
      if (armyPos.x != paths[0].x || armyPos.y != paths[0].y) {
        paths.unshift(armyPos);
      }
      paths = PathPointUtils.optimizePath(paths);

      armyView.info.pathInfo = paths;
    }
  }

  public addToStage() {
    this.initSelf();
    this.initRegister();
    this.clearInitPlayersTimeId();
    // this._initPlayersTimeId = setTimeout(this.clearInitPlayersTimeId,this, 5000);
  }

  private clearInitPlayersTimeId() {
    if (this._initPlayersTimeId > 0) {
      clearTimeout(this._initPlayersTimeId);
    }
    this._initPlayersTimeId = 0;
    this._initPlayersFlag = true;
    this.initPlayers();
  }

  private clickPlayerArr: Array<HeroAvatarView> = [];
  private isshowing: boolean = false;
  /**
   * 获得重叠玩家的数量
   * @param posx 被点击玩家的坐标
   * @param posy
   */
  public checkClickPlayerNum(posx: number, posy: number) {
    if (this.isshowing) {
      return;
    }
    this.isshowing = true; //避免快速执行两次
    setTimeout(() => {
      this.isshowing = false;
    }, 1000);
    this.clickPlayerArr.length = 0;
    this["_children"].forEach((element) => {
      if (element instanceof SpaceArmyView) {
        let roleView = element as SpaceArmyView;
        let spaceArmy = roleView.data;

        /** 自己 */
        let isSelf =
          spaceArmy.baseHero.userId == this.playerModel.playerInfo.userId;
        /** 众神之战展示形象 */
        let warlordsId = spaceArmy.id - ShadowUILayer.INIT_ID;
        let isWarlordsIdArmy =
          warlordsId == JobType.WIZARD ||
          warlordsId == JobType.HUNTER ||
          warlordsId == JobType.WARRIOR;
        if (!isSelf && !isWarlordsIdArmy) {
          let ishit = roleView.avatarView.hitTestPoint(posx, posy); //avatar本身的区域比较大, 要用avatar模型做点击检测
          if (ishit) {
            this.clickPlayerArr.push(roleView);
          }
        }
      } else if (element instanceof SpaceNpcView) {
        let npcView = element as SpaceNpcView;
        let ishit = npcView.avatarView.hitTestPoint(posx, posy);
        if (ishit) {
          this.clickPlayerArr.push(element);
        }
      }
    });
    if (this.clickPlayerArr.length > 1) {
      UIManager.Instance.ShowWind(EmWindow.LookPlayerList, this.clickPlayerArr);
    } else if (this.clickPlayerArr.length == 1) {
      if (this.clickPlayerArr[0] instanceof SpaceArmyView) {
        this.playerModel.selectTarget = (
          this.clickPlayerArr[0] as SpaceArmyView
        ).data;
        this.playerModel.reinforce = (
          this.clickPlayerArr[0] as SpaceArmyView
        ).data;
      }
    }
  }

  public onClickHandler(evt: Laya.Event): boolean {
    SpaceManager.Instance.model.selectNode = null;
    PlayerManager.Instance.currentPlayerModel.reinforce = null;
    SpaceManager.Instance.setNpcBeingVisit(false);

    if (evt) {
      if (evt.target instanceof SpaceArmyView) {
        if ((<SpaceArmyView>evt.target).mouseClickHandler(evt)) {
          SpaceManager.Instance.controller.moveArmyByPos(
            this.mouseX,
            this.mouseY,
            true,
          );
          return true;
        }
      }
    }
    return SpaceManager.Instance.controller.moveArmyByPos(
      this.mouseX,
      this.mouseY,
      true,
    );
  }

  protected initSelf() {
    var armyInfo: SpaceArmy = SpaceManager.Instance.model.selfArmy;
    if (armyInfo) {
      this.addArmy(armyInfo);
    }
  }

  protected initPlayers() {
    var players: Map<number, SpaceArmy> =
      SpaceManager.Instance.model.allArmyDict;
    players.forEach((element) => {
      this.addToRenderQueue(element.userId);
    });
  }

  protected addToRenderQueue(userId: number) {
    if (this._userQueue.indexOf(userId) == -1) {
      this._userQueue.push(userId);
    }
  }

  protected addToRobotRenderQueue(userId: number) {
    if (this._robotQueue.indexOf(userId) == -1) {
      this._robotQueue.push(userId);
    }
  }

  protected addArmys() {
    this._renderTime = new Date().getTime();
    if (this._renderTime - this._lastTime >= SpaceWalkLayer.RENDER_TICK) {
      var userId: number = 0;
      var armyInfo: SpaceArmy;
      var armyView: SpaceArmyView;
      if (this._userQueue.length > 0) {
        userId = this._userQueue.pop();
        armyInfo = SpaceManager.Instance.model.getBaseArmyByUserId(userId);
        if (armyInfo) {
          armyView = this.addArmy(armyInfo);
        }
      } else if (this._robotQueue.length > 0) {
        userId = this._robotQueue.pop();
        armyInfo =
          SpaceTemplateManager.Instance.getRobotArmyInfoByUserId(userId);
        if (armyInfo) {
          armyView = this.addArmy(armyInfo);
        }
      }
      this._lastTime = this._renderTime;
    }
  }

  protected createArmy(armyInfo: SpaceArmy): SpaceArmyView {
    var cArmy: SpaceArmyView = new SpaceArmyView();
    var info: AIBaseInfo = new BaseArmyAiInfo();
    info.speed = ArmySpeedUtils.getMoveSpeed(armyInfo);
    cArmy.info = info;
    cArmy.data = armyInfo;
    cArmy.filter = this._filter;
    cArmy.mouseEnabled = true;
    SpaceManager.Instance.controller.addArmyView(cArmy);
    return cArmy;
  }

  public enterFrame() {
    if (!this._items) {
      return;
    }
    this._items.forEach((element) => {
      element.execute();
      if (!element.isLiving) {
        if (element) {
          ObjectUtils.disposeObject(element);
          this._items.delete(element);
        }
        element = null;
      }
    });
    this.addArmys();
  }

  public stop() {
    if (!this._items) {
      return;
    }
    //forEach优化  没什么用??注释掉
    // this._items.forEach(element => {
    //     if (element) {
    //         // element.avatarView.stop();
    //     }
    // })
  }

  private get playerModel() {
    return PlayerManager.Instance.currentPlayerModel;
  }

  public dispose() {
    if (this._initPlayersTimeId > 0) {
      clearTimeout(this._initPlayersTimeId);
    }
    this._initPlayersTimeId = 0;
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    this.removeEvent();
    this._armys.forEach((element) => {
      ObjectUtils.disposeObject(element);
    });
    this._armys.clear();
    this._items.clear();
    if (this._walkTarget) {
      this._walkTarget.playing = false;
      this._walkTarget.displayObject.removeSelf();
      this._walkTarget.dispose();
    }
    this._walkTarget = null;
    SpaceManager.Instance.controller.walkTarget = null;
    this._userQueue = null;
    this._robotQueue = null;
    this._filter = null;
  }
}
