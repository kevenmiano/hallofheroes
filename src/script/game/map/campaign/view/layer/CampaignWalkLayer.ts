import Logger from "../../../../../core/logger/Logger";
import StringHelper from "../../../../../core/utils/StringHelper";
import { DisplayObject } from "../../../../component/DisplayObject";
import { ArmyState } from "../../../../constant/ArmyState";
import {
  CampaignEvent,
  CampaignMapEvent,
  FreedomTeamEvent,
  NotificationEvent,
  OuterCityEvent,
  SpaceEvent,
} from "../../../../constant/event/NotificationEvent";
import { FogGridType } from "../../../../constant/FogGridType";
// import { IEnterFrame } from "../../../../interfaces/IEnterFrame";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { EnterFrameManager } from "../../../../manager/EnterFrameManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { WalkDepthMediator } from "../../../../mvc/mediator/WalkDepthMediator";
import { WalkTargetMediator } from "../../../../mvc/mediator/WalkTargetMediator";
import { CampaignMapModel } from "../../../../mvc/model/CampaignMapModel";
import { ArmySpeedUtils } from "../../../../utils/ArmySpeedUtils";
import { HeroAvatarViewHelper } from "../../../../utils/HeroAvatarViewHelper";
import { PathPointUtils } from "../../../../utils/PathPointUtils";
import { SearchPathHelper } from "../../../../utils/SearchPathHelper";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { BaseArmyAiInfo } from "../../../ai/BaseArmyAiInfo";
import SimpleBuildingFilter from "../../../castle/filter/SimpleBuildingFilter";
import Tiles from "../../../space/constant/Tiles";
import { CampaignNode } from "../../../space/data/CampaignNode";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CampaignArmyView } from "../physics/CampaignArmyView";
import { MineralArmyView } from "../physics/MineralArmyView";
import { PvpWarFightArmyView } from "../physics/PvpWarFightArmyView";
import { GvgArmyView } from "../physics/GvgArmyView";
import { PetLandArmyView } from "../physics/PetLandArmyView";
import HoodRoomArmyView from "../physics/HoodRoomArmyView";
import { PetAvatarView } from "../../../avatar/view/PetAvatarView";
import UIManager from "../../../../../core/ui/UIManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { NpcAvatarView } from "../physics/NpcAvatarView";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import { eAvatarBaseViewType } from "../../../view/hero/AvatarBaseView";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { MonopolyArmyView } from "../physics/MonopolyArmyView";
import NewbieModule from "../../../../module/guide/NewbieModule";
import NewbieConfig from "../../../../module/guide/data/NewbieConfig";
import { PosType } from "../../../space/constant/PosType";
import { ShowAvatarBattle } from "../../../../avatar/view/ShowAvatarBattle";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";

/**
 *
 * @author jax.xu
 *
 */
export class CampaignWalkLayer extends Laya.Sprite implements IEnterFrame {
  public static NAME: string = "map.campaign.view.layer.CampaignWalkLayer";

  protected maxRenderPlayerNum: number = 100;
  protected isLimitPlayerNum: boolean = false; //同屏最大人数限制开关

  protected _armys: Map<string, any> = new Map();
  protected _filter = new SimpleBuildingFilter();
  protected _model: CampaignMapModel;
  protected _selfArmyView: CampaignArmyView | ShowAvatarBattle;
  protected _hideOtherPlayers: boolean;
  protected _mediatorKey: string;
  protected isClickLimit: boolean = false;
  protected renderList: any[] = [];
  protected clickPlayerArr: Array<HeroAvatarView> = [];

  constructor() {
    super();
    this.autoSize = true;
    this.mouseEnabled = true;
    this.scrollRect = null;
    this._model = CampaignManager.Instance.mapModel;

    this.init();
    this.addEvent();
  }

  protected init() {
    if (WorldBossHelper.checkPetLand(this._model.mapId)) {
      this.isLimitPlayerNum = true;
      this.maxRenderPlayerNum = 50;
    } else if (WorldBossHelper.checkMineral(this._model.mapId)) {
      this.isLimitPlayerNum = true;
      this.maxRenderPlayerNum = 31;
    } else if (WorldBossHelper.checkWorldBoss(this._model.mapId)) {
      this.isLimitPlayerNum = true;
      this.maxRenderPlayerNum = 30;
    }
  }

  protected addEvent() {
    this.initRegisterList();
    EnterFrameManager.Instance.registeEnterFrame(this);
    if (CampaignManager.Instance.needHidePlayerScene(this._model.mapId)) {
      NotificationManager.Instance.addEventListener(
        SpaceEvent.HIDE_OTHERS,
        this.__hideOthers,
        this,
      );
      NotificationManager.Instance.addEventListener(
        FreedomTeamEvent.TEAM_INFO_UPDATE,
        this.__teamInfoUpdateHandler,
        this,
      );
      // NotificationManager.Instance.addEventListener(SpaceEvent.HIDE_OTHER_NAME, this.__hideOtherName, this);
    }
    this._model.addEventListener(
      OuterCityEvent.ADD_GARRISON,
      this.__addBaseArmyHandler,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.__removeBaseArmyHandler,
      this,
    );
    this._model.addEventListener(
      CampaignEvent.MOVE_ARMY_TO_RANGE,
      this.__moveArmyToRangeHandler,
      this,
    );
    this._model.addEventListener(
      CampaignEvent.STANDPOS,
      this.__standPosHandler,
      this,
    );
    this._model.addEventListener(
      CampaignMapEvent.GO_TO_POS,
      this.__updateArmyPosHandler,
      this,
    );
    this._model.addEventListener(
      CampaignMapEvent.MOVE_PATHS_ARMY,
      this.__armyPosBroadHandler,
      this,
    );
    this._model.addEventListener(
      CampaignMapEvent.MOVE_TO_VISIBLE,
      this.__armyMoveToVisibleHandler,
      this,
    );
    this._model.addEventListener(
      CampaignMapEvent.MOVE_TO_UNVISIBLE,
      this.__armyMoveToUnVisibleHandler,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.UPDATE_SELF,
      this.__updateSelfHandler,
      this,
    );
  }

  protected removeEvent() {
    this.removeRegisterList();
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    if (CampaignManager.Instance.needHidePlayerScene(this._model.mapId)) {
      NotificationManager.Instance.removeEventListener(
        SpaceEvent.HIDE_OTHERS,
        this.__hideOthers,
        this,
      );
      NotificationManager.Instance.removeEventListener(
        FreedomTeamEvent.TEAM_INFO_UPDATE,
        this.__teamInfoUpdateHandler,
        this,
      );
      // NotificationManager.Instance.removeEventListener(SpaceEvent.HIDE_OTHER_NAME, this.__hideOtherName, this);
    }
    this._model.removeEventListener(
      OuterCityEvent.ADD_GARRISON,
      this.__addBaseArmyHandler,
      this,
    );
    this._model.removeEventListener(
      CampaignEvent.STANDPOS,
      this.__standPosHandler,
      this,
    );
    this._model.removeEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.__removeBaseArmyHandler,
      this,
    );
    this._model.removeEventListener(
      CampaignEvent.MOVE_ARMY_TO_RANGE,
      this.__moveArmyToRangeHandler,
      this,
    );
    this._model.removeEventListener(
      CampaignMapEvent.GO_TO_POS,
      this.__updateArmyPosHandler,
      this,
    );
    this._model.removeEventListener(
      CampaignMapEvent.MOVE_PATHS_ARMY,
      this.__armyPosBroadHandler,
      this,
    );
    this._model.removeEventListener(
      CampaignMapEvent.MOVE_TO_VISIBLE,
      this.__armyMoveToVisibleHandler,
      this,
    );
    this._model.removeEventListener(
      CampaignMapEvent.MOVE_TO_UNVISIBLE,
      this.__armyMoveToUnVisibleHandler,
      this,
    );
    this._model.removeEventListener(
      OuterCityEvent.UPDATE_SELF,
      this.__updateSelfHandler,
      this,
    );
  }

  private __standPosHandler(data: any) {
    Logger.info("[CampaignWalkLayer]同步军队站立位置", data);
    //@ts-expect-error: External dependencies
    let sPos: com.road.yishi.proto.campaign.StandPosMsg = <
      //@ts-expect-error: External dependencies
      com.road.yishi.proto.campaign.StandPosMsg
    >data;
    let serverName: string = sPos.serverName;
    let aView: CampaignArmyView = this._armys.get(
      serverName + "_" + sPos.id,
    ) as CampaignArmyView;
    aView.x = sPos.posX * 20;
    aView.y = sPos.posY * 20;
    aView.info.pathInfo = [];
  }

  public addToStage(evt: Event) {
    this.initSelfArmy();
    if (this.mapView && !this.mapView.stepRender) {
      this.addArmys(this._model.allBaseArmy);
    }
  }

  private __hideOthers(data: any) {
    this._armys.forEach((element) => {
      this.checkPlayerVisible(element);
    });
  }

  private __teamInfoUpdateHandler(data: any) {
    this._armys.forEach((element) => {
      this.checkPlayerVisible(element);
    });
  }

  private checkPlayerVisible(armyView: CampaignArmyView) {
    if (armyView.data) {
      let armyViewVisible = armyView.isSelf
        ? true
        : CampaignManager.Instance.getScenePlayerVisible(
            armyView.data.mapId,
            armyView.data.online,
          );
      let armyViewNameVisible =
        CampaignManager.Instance.getScenePlayerNameVisible(
          armyView.data.mapId,
          armyView.data.online,
        );
      armyView.visible = armyView.isSelf ? true : armyViewVisible;
      armyView.active = armyView.isSelf ? true : armyViewVisible;
      armyView.showInfo(
        armyViewNameVisible,
        armyView.isSelf || armyView.visible,
      );
    }
  }

  protected initRegisterList() {
    let arr: any[] = [WalkDepthMediator, WalkTargetMediator];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      CampaignWalkLayer.NAME,
    );
  }
  protected removeRegisterList() {
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
  }

  protected initSelfArmy() {
    let armyInfo: CampaignArmy = this._model.selfMemberData;
    if (armyInfo) {
      if (armyInfo.mapId != this._model.mapId) {
        return;
      }
      if (this._armys.get(armyInfo.key)) {
        return;
      }
      if (!armyInfo.baseHero || !armyInfo.baseHero.templateInfo) {
        return;
      }
      this._selfArmyView = this.addAmryView(armyInfo);
    }
  }

  public addArmy(aInfo: CampaignArmy) {
    if (this.check(aInfo)) {
      this.addAmryView(aInfo);
    }
  }

  public addArmys(dic: Map<string, CampaignArmy>) {
    if (!dic) {
      return;
    }
    dic.forEach((aInfo) => {
      this.addAmryView(aInfo);
    });
  }

  protected check(element: CampaignArmy): boolean {
    if (!element.needInit && this.checkMapNeededInit()) {
      return false;
    }
    if (element.mapId != this._model.mapId) {
      return false;
    }
    if (this._armys.get(element.key)) {
      return false;
    }
    if (!element.baseHero || !element.baseHero.templateInfo) {
      return false;
    }
    if (!this.checkDistance(element) || !this.canRenderArmyView()) {
      return false;
    }
    return true;
  }

  /**
   * 检查是否在需要同屏优先显示的地图中
   * @return
   *
   */
  protected checkMapNeededInit(): boolean {
    if (!this._model) {
      return false;
    }

    return (
      WorldBossHelper.checkMineral(this._model.mapId) ||
      WorldBossHelper.checkPetLand(this._model.mapId)
    );
  }

  /**
   * 判断距离是否超出范围   不要用此接口了
   * @param armyInfo
   * @return
   *
   */
  protected checkDistance(armyInfo: CampaignArmy): boolean {
    // if (!this._selfArmyView) {
    //     return false;
    // }
    // let self: Laya.Point = new Laya.Point(this._selfArmyView.data.curPosX, this._selfArmyView.data.curPosY);
    // let army: Laya.Point = new Laya.Point(armyInfo.curPosX, armyInfo.curPosY);
    // if (self.distance(army.x, army.y) <= 70) {
    //     return true;
    // }
    return true;
  }

  protected addAmryView(
    armyInfo: CampaignArmy,
    state: number = 0,
  ): CampaignArmyView {
    if (this._armys.get(armyInfo.key)) {
      return this._armys.get(armyInfo.key) as CampaignArmyView;
    }

    let cArmy: CampaignArmyView;
    let mapId: number = this._model.mapId;
    if (WorldBossHelper.checkPvp(mapId)) {
      cArmy = new PvpWarFightArmyView();
    } else if (WorldBossHelper.checkHoodRoom(mapId)) {
      // cArmy = new HoodRoomArmyView();
      // cArmy.filter = this._filter;
    } else if (WorldBossHelper.checkGvg(mapId)) {
      cArmy = new GvgArmyView();
    } else if (WorldBossHelper.checkPetLand(mapId)) {
      cArmy = new PetLandArmyView();
      cArmy.filter = this._filter;
    } else if (WorldBossHelper.checkMineral(mapId)) {
      cArmy = new MineralArmyView();
      // cArmy.filter = this._filter;
    } else if (WorldBossHelper.checkMonopoly(mapId)) {
      cArmy = new MonopolyArmyView();
      cArmy.filter = this._filter;
    } else {
      cArmy = new CampaignArmyView();
    }

    let info = new BaseArmyAiInfo();
    let speed = ArmySpeedUtils.getMoveSpeed(armyInfo);
    info.speed = speed;
    info.isLiving = true;
    info.moveOverState = state;
    cArmy.info = info;
    cArmy.data = armyInfo;
    armyInfo.preParent = this;
    this.addItem(cArmy);
    this.checkPlayerVisible(cArmy);

    cArmy.x = armyInfo.curPosX * Tiles.WIDTH;
    cArmy.y = armyInfo.curPosY * Tiles.HEIGHT;

    let isSelfCampaignArmy: boolean = false;
    if (WorldBossHelper.checkMapId(armyInfo.mapId)) {
      cArmy.avatarView.scaleX = cArmy.avatarView.scaleY = 0.85;
    } else {
      if (
        armyInfo.userId ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId
      ) {
        isSelfCampaignArmy = true;
        //新手刚进入地图播放从屏幕外走进的人物动画, 防止闪现
        if (
          !NewbieModule.Instance.checkNodeFinish(NewbieConfig.NEWBIE_10) &&
          WorldBossHelper.checkIsNoviceMapLayer1(this._model.mapId)
        ) {
          cArmy.visible = false;
          cArmy.active = false;
          cArmy.x = 0;
        }
      }
      this._model.updateFog(cArmy.x, cArmy.y, FogGridType.OPEN_FOUR);
    }

    let nextNode: CampaignNode = this._model.getToAttackNode();
    if (nextNode) {
      let curPoint: Laya.Point = new Laya.Point(cArmy.x, cArmy.y);
      let nextPoint: Laya.Point = new Laya.Point(nextNode.x, nextNode.y);
      let leng: number = curPoint.distance(nextPoint.x, nextPoint.y);
      let temp: Laya.Point = StringHelper.interpolate(
        nextPoint,
        curPoint,
        100 / leng,
      );
      // 初始朝向设置
      if (cArmy.data.angle == -1) {
        cArmy.avatarView.angle = HeroAvatarViewHelper.twoPointAngle(
          nextPoint.x,
          nextPoint.y,
          curPoint.x,
          curPoint.y,
        );
      } else {
        cArmy.avatarView.angle = cArmy.data.angle;
      }
      if (isSelfCampaignArmy) {
        this._model.updateFog(temp.x, temp.y, FogGridType.OPEN_FOUR);
      }
    }

    return cArmy;
  }

  /** 移除 CampaignArmyView 或 ShowAvatarBattle */
  protected removeArmyView(armyInfo: CampaignArmy) {
    armyInfo.needInit = false;
    let armyView = this._armys.get(armyInfo.key);
    this.removeItem(armyView);
  }

  public addItem(armyView: any) {
    if (!armyView) return;

    Logger.info("[CampaignWalkLayer]addItem", armyView.objName, armyView);
    this.addChild(armyView);
    this._armys.set(armyView.data.key, armyView);
    CampaignManager.Instance.controller.addArmyView(armyView);
  }

  public removeItem(armyView: any) {
    if (!armyView) return;

    Logger.info("[CampaignWalkLayer]removeItem", armyView.objName, armyView);
    CampaignManager.Instance.controller.removeArmyView(armyView);
    if (armyView.data) {
      this._armys.delete(armyView.data.key);
    }
    ObjectUtils.disposeObject(armyView);
  }

  public addChild(child: DisplayObject): DisplayObject {
    let target: any = child;
    if (target instanceof CampaignArmyView) {
      if (
        (this._selfArmyView == child || this.canRenderArmyView()) &&
        target.info.moveOverState != 2
      ) {
        if (this.renderList.indexOf(child) < 0) {
          this.renderList.push(child);
        }
        super.addChild(child);
      }
    } else {
      super.addChild(child);
    }
    return child;
  }

  public addChildAt(child: DisplayObject, index: number): DisplayObject {
    if (child instanceof CampaignArmyView) {
      if (this._selfArmyView == child || this.canRenderArmyView()) {
        if (this.renderList.indexOf(child) < 0) {
          this.renderList.push(child);
        }
        super.addChildAt(child, index);
      }
    } else {
      super.addChildAt(child, index);
    }
    return child;
  }

  public removeChild(child: DisplayObject): DisplayObject {
    let child2: any = super.removeChild(child);
    if (child2 instanceof CampaignArmyView) {
      let index: number = this.renderList.indexOf(child2);
      if (index >= 0) {
        this.renderList.splice(index, 1);
      }
    } else if (child2 instanceof PetAvatarView) {
      super.removeChild(child2);
    }
    return child2;
  }

  public removeChildAt(index: number): DisplayObject {
    let child: any = super.removeChildAt(index);
    if (child instanceof CampaignArmyView) {
      let index: number = this.renderList.indexOf(child);
      if (index >= 0) {
        this.renderList.splice(index, 1);
      }
    }
    return child;
  }

  /**
   * 能否渲染玩家
   * @return
   *
   */
  protected canRenderArmyView(): boolean {
    if (this._hideOtherPlayers) {
      return false;
    } else if (
      this.isLimitPlayerNum &&
      this.renderList.length >= this.maxRenderPlayerNum
    ) {
      return false;
    }
    return true;
  }

  public enterFrame() {
    if (!this._model || this._model.exit) {
      return;
    }
    if (!this._model.mapTielsData) {
      return;
    }
    // this.addArmys(this._model.allBaseArmy);
    this._armys.forEach((element) => {
      element.execute();
      if (!element.isLiving) {
        this.removeItem(element);
      }
    });
  }

  private __armyPosBroadHandler(data: any) {
    Logger.info("[CampaignWalkLayer]同步移动军队位置", data);
    if (CampaignManager.Instance.exit) {
      return;
    }

    //@ts-expect-error: External dependencies
    let msg: com.road.yishi.proto.worldmap.PosMoveMsg = data;
    let serverName: string = msg.serverName;
    let armyView: CampaignArmyView = this._armys.get(
      serverName + "_" + msg.armyId,
    ) as CampaignArmyView;
    if (armyView) {
      armyView.info.moveOverState = msg.armyState;
      if (msg.routes.length > 0) {
        let ser: Laya.Point = new Laya.Point(msg.routes[0].x, msg.routes[0].y);
        let leng: number = ser.distance(armyView.x, armyView.y);
        let leftPath: any[];
        if (leng > 250) {
          armyView.x = ser.x;
          armyView.y = ser.y;
        } else {
          let nextIndex: number = armyView.info.nextIndex;
          if (
            armyView.info.pathInfo &&
            armyView.info.pathInfo.length >= nextIndex
          ) {
            leftPath = armyView.info.pathInfo.slice(nextIndex);
          }
        }
        let paths: Array<Laya.Point> = [];
        for (let i: number = 0; i < msg.routes.length; i++) {
          paths.push(
            new Laya.Point(
              parseInt((msg.routes[i].x / 20).toString()),
              parseInt((msg.routes[i].y / 20).toString()),
            ),
          );
        }

        if (leftPath) {
          paths = leftPath.concat(paths);
        }

        let armyPos: Laya.Point = armyView.getTilePos();
        let point: Laya.Point = paths[0];
        if (armyPos.x != point.x || armyPos.y != point.y) {
          paths.unshift(armyPos);
        }
        paths = PathPointUtils.optimizePath(paths);
        armyView.info.pathInfo = paths;
      }
    } else {
      let armyInfo: CampaignArmy = this._model.getBaseArmyByArmyId(
        msg.armyId,
        serverName,
      );
      if (armyInfo) {
        armyInfo.needInit = true;
        armyInfo.curPosX = parseInt((msg.routes[0].x / 20).toString());
        armyInfo.curPosY = parseInt((msg.routes[0].y / 20).toString());
        this.addAmryView(armyInfo, msg.armyState);
      }
    }
    msg = null;
  }

  private __armyMoveToVisibleHandler(data: CampaignArmy) {
    Logger.info("[CampaignWalkLayer]军队移入视野 添加", data.nickName, data);
    this.addAmryView(data);
  }

  private __armyMoveToUnVisibleHandler(data: CampaignArmy) {
    Logger.info("[CampaignWalkLayer]军队移出视野 删除", data.nickName, data);
    this.removeArmyView(data);
  }

  private __updateSelfHandler() {
    this.initSelfArmy();
  }

  private __updateArmyPosHandler(
    //@ts-expect-error: External dependencies
    data: com.road.yishi.proto.army.ArmyPosUpdatedMsg,
  ) {
    Logger.info("[CampaignWalkLayer]把军队移动到某个位置", data);
    //@ts-expect-error: External dependencies
    let msg: com.road.yishi.proto.army.ArmyPosUpdatedMsg = data;
    let armyView: CampaignArmyView = this._armys.get(
      msg.serverName + "_" + msg.armyId,
    ) as CampaignArmyView;
    if (armyView) {
      let ser: Laya.Point = new Laya.Point(msg.curPosX * 20, msg.curPosY * 20);
      let leng: number = ser.distance(armyView.x, armyView.y);
      if (leng > 150) {
        armyView.x = ser.x;
        armyView.y = ser.y;
        armyView.info.pathInfo = SearchPathHelper.astartFindPath(
          ser,
          new Laya.Point(msg.endPosX * 20, msg.endPosY * 20),
        );
      }
    }
  }

  /**
   * 获得重叠玩家的数量
   * @param posx 被点击玩家的坐标
   * @param posy
   */
  public checkClickPlayerNum(posx: number, posy: number, viewData?) {
    if (this.isClickLimit) {
      return;
    }
    this.isClickLimit = true; //避免快速执行两次
    setTimeout(() => {
      this.isClickLimit = false;
    }, 1000);
    let mapId = CampaignManager.Instance.mapModel.mapId;
    let armyArr = [];
    this.clickPlayerArr = [];
    this["_children"].forEach((element) => {
      if (element.avatarBaseViewType == eAvatarBaseViewType.CampaignArmy) {
        let roleView = element;
        // Logger.xjy('-------------element.data.baseHero.userId',element.data.baseHero.userId,'========',PlayerManager.Instance.currentPlayerModel.playerInfo.nickName,'=======PlayerManager.Instance.currentPlayerModel.playerInfo.userId'+PlayerManager.Instance.currentPlayerModel.playerInfo.userId);
        if (
          roleView.data.baseHero.userId !=
          PlayerManager.Instance.currentPlayerModel.playerInfo.userId
        ) {
          let ishit = roleView.avatarView.hitTestPoint(posx, posy); //avatar本身的区域比较大, 要用avatar模型做点击检测
          if (ishit) {
            //紫晶矿场
            if (WorldBossHelper.checkMineral(roleView.data.mapId)) {
              //
              if (
                roleView.data.state != ArmyState.STATE_FIGHT &&
                !roleView.isSelfConsortia &&
                !roleView.isSelfTeam
              ) {
                armyArr.push(roleView);
              }
            } else if (WorldBossHelper.checkPvp(roleView.data.mapId)) {
              //战场
              if (
                roleView.data.state != ArmyState.STATE_FIGHT &&
                roleView.data.teamId !=
                  CampaignManager.Instance.mapModel.selfMemberData.teamId
              ) {
                armyArr.push(roleView);
              }
            } else {
              armyArr.push(roleView);
            }
          }
        }
      } else if (
        element.avatarBaseViewType == eAvatarBaseViewType.CampaignNpc
      ) {
        let npcView = element;
        let ishit = npcView.avatarView.hitTestPoint(posx, posy);
        if (ishit) {
          if (
            WorldBossHelper.checkPvp(mapId) &&
            npcView.getNpcTypes() != PosType.TRANSPORT_CAR
          ) {
            this.clickPlayerArr.push(npcView);
          } else {
            // console.log('test',npcView.getNpcTypes(),'ispvp:',WorldBossHelper.checkPvp(mapId))
            if (npcView.getNpcTypes() != PosType.TRANSPORT_CAR) {
              this.clickPlayerArr.push(npcView);
            }
          }
        }
      }
    });

    this.clickPlayerArr.push(...armyArr);
    if (this.clickPlayerArr.length > 1) {
      UIManager.Instance.ShowWind(EmWindow.LookPlayerList, this.clickPlayerArr);
    } else if (this.clickPlayerArr.length == 1) {
      let nodeView = this.clickPlayerArr[0];
      if (nodeView.avatarBaseViewType == eAvatarBaseViewType.CampaignArmy) {
        Logger.xjy("[CampaignWalkLayer]直接点到人");
        let data = (nodeView as CampaignArmyView).data;
        PlayerManager.Instance.currentPlayerModel.selectTarget = data;
        PlayerManager.Instance.currentPlayerModel.reinforce = data;
        if (
          WorldBossHelper.checkPvp(data.mapId) ||
          WorldBossHelper.checkMineral(data.mapId)
        ) {
          NotificationManager.Instance.dispatchEvent(
            NotificationEvent.LOCK_PVP_WARFIGHT,
            data,
          );
        }
      } else if (
        nodeView.avatarBaseViewType == eAvatarBaseViewType.CampaignNpc
      ) {
        Logger.xjy("[CampaignWalkLayer]直接点到npc");
        (nodeView as NpcAvatarView).attackFunEx();
      }
    } else {
      if (WorldBossHelper.checkPvp(mapId)) {
        PlayerManager.Instance.currentPlayerModel.selectTarget = viewData;
        PlayerManager.Instance.currentPlayerModel.reinforce = viewData;
        CampaignManager.Instance.controller.moveArmyByPos(
          this.mouseX,
          this.mouseY,
          true,
        );
      }
    }
  }

  public onClickHandler(evt: Laya.Event): boolean {
    if (evt) {
      if (evt.target instanceof HoodRoomArmyView) {
        if ((evt.target as HoodRoomArmyView).mouseClickHandler(evt)) {
          return true;
        }
      } else if (evt.target instanceof GvgArmyView) {
        if ((evt.target as GvgArmyView).mouseClickHandler(evt)) {
          return true;
        }
      } else if (evt.target instanceof PetLandArmyView) {
        if ((evt.target as PetLandArmyView).mouseClickHandler(evt)) {
          return true;
        }
      } else if (evt.target instanceof MineralArmyView) {
        if ((evt.target as MineralArmyView).mouseClickHandler(evt)) {
          return true;
        }
      }
    }
    PlayerManager.Instance.currentPlayerModel.reinforce = null;
    Logger.yyz("🔔点击地面进行移动！");
    return CampaignManager.Instance.controller.moveArmyByPos(
      this.mouseX,
      this.mouseY,
      true,
    );
  }

  private __addBaseArmyHandler(data: CampaignArmy) {
    if (!this.checkMapNeededInit()) {
      let armyInfo: CampaignArmy = data;
      if (armyInfo.mapId != this._model.mapId) {
        return;
      }
      if (this.checkDistance(armyInfo) && this.canRenderArmyView()) {
        this.addAmryView(armyInfo);
      }
    }
  }

  private __removeBaseArmyHandler(data: CampaignArmy) {
    this.removeArmyView(data);
  }

  private __moveArmyToRangeHandler(data: any) {
    let armyView: CampaignArmyView = this._armys.get(
      data.key,
    ) as CampaignArmyView;
    if (!armyView) {
      //系统部队
      let serverName: string = "";
      if (data.baseHero) {
        serverName = data.baseHero.serverName;
      }
      let armyInfo: CampaignArmy = this._model.getSysArmyByArmyId(
        data.id,
        serverName,
      );
      if (armyInfo) {
        armyView = this.addAmryView(armyInfo) as CampaignArmyView;
      }
    }
    if (armyView) {
      let userId: number =
        PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
      if (armyView.data.userId != userId) {
        if (!ArmyState.checkCampaignAttack(armyView.data.state)) {
          return;
        }
        let start: Laya.Point = new Laya.Point(armyView.x, armyView.y);
        let end: Laya.Point;
        let paths: any[];
        for (let point of data.range) {
          end = point;
          paths = SearchPathHelper.astartFindPath(start, end);
          if (paths) {
            break;
          }
        }
        if (paths) {
          armyView.info.pathInfo = paths;
        }
      }
    }
  }

  public get mapView() {
    return CampaignManager.Instance.mapView;
  }

  public dispose() {
    this.removeEvent();
    this._armys.forEach((element) => {
      element && element.dispose();
    });
    this._armys = null;
    this._model = null;
    this.renderList = null;
  }
}
