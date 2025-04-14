/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2022-04-13 16:53:51
 * @LastEditTime: 2024-03-12 18:03:45
 * @LastEditors: jeremy.xu
 * @Description: 非战斗可行走的人或怪物基类 分层的节点创建必须在设置uuid之后
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import StringHelper from "../../../../core/utils/StringHelper";
import {
  AiEvents,
  ObjectsEvent,
} from "../../../constant/event/NotificationEvent";
import AIBaseInfo from "../../ai/AIBaseInfo";
import Tiles from "../../space/constant/Tiles";
import Logger from "../../../../core/logger/Logger";
import { Avatar } from "../../../avatar/view/Avatar";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { HeroAvatar } from "../../avatar/view/HeroAvatar";
import { AvatarInfoTag, ShadowType } from "../../../constant/Const";
import { PetAvatarView } from "../../avatar/view/PetAvatarView";
import ChatData from "../../../module/chat/data/ChatData";
import { AvatarInfoUILayerHandler } from "../layer/AvatarInfoUILayer";
import { ShadowUILayerHandler } from "../layer/ShadowUILayer";
import GameConfig from "../../../../../GameConfig";
import { ResourceLoaderInfo } from "../../avatar/data/ResourceLoaderInfo";
import { eFilterFrameText } from "../../../component/FilterFrameText";
// import IBuildingFilter from "../../space/interfaces/IBuildingFilter";
import { SceneManager } from "../../scene/SceneManager";
import SceneType from "../../scene/SceneType";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import SpaceManager from "../../space/SpaceManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { MovieClip } from "../../../component/MovieClip";
import Utils from "../../../../core/utils/Utils";
import QQDawankaManager from "../../../manager/QQDawankaManager";
import { UIFilter } from "../../../../core/ui/UIFilter";

interface IBuildingFilter {
  filterType: number;
  filterValue: number;
}

export enum eAvatarBaseViewType {
  Default = "Default",
  PetAvatar = "PetAvatar",
  MineralCar = "MineralCar",
  SpaceArmy = "SpaceArmy",
  SpaceNpc = "SpaceNpc",
  OuterCityArmy = "OuterCityArmy",
  OuterCityNpc = "OuterCityNpc",
  CampaignArmy = "CampaignArmy",
  CampaignNpc = "CampaignNpc",
}

export class AvatarBaseView extends Laya.Sprite {
  public avatarBaseViewType: eAvatarBaseViewType = eAvatarBaseViewType.Default;
  protected _px: number = 0;
  protected _py: number = 0;
  public restrictMoveCount: number = 0;
  public defShowNamePosY: number = -125;
  public defTranslucenceNamePosY: number = -150;
  protected _showNamePosY: number = -125;
  public get showNamePosY(): number {
    return this._showNamePosY;
  }
  protected _info: AIBaseInfo;
  protected _nextPoint: Laya.Point;
  protected _prePoint: Laya.Point;
  protected _event: GameEventDispatcher = new GameEventDispatcher();
  protected _noShadow: boolean = false;
  protected _showMountShadow: boolean = false;
  protected _hitTestAlpha: boolean = true;
  protected _isPlaying: boolean = true;
  protected _filter: IBuildingFilter;
  protected _hitRect: any;
  protected _debugSp: Laya.Sprite;
  protected _fateSkillEffect: MovieClip;
  public isWarlodPlayer: boolean = false;
  protected _isStand: boolean;
  public get isStand(): boolean {
    return this._isStand;
  }

  protected _isMounting: boolean = false;
  public set isMounting(v: boolean) {
    this._isMounting = v;
    if (this._avatar) {
      this._avatar.isMounting = v;
    }
  }
  public get isMounting(): boolean {
    return this._isMounting;
  }
  protected _shadowAlpha: number = 0;
  public get shadowAlpha(): number {
    return this._shadowAlpha;
  }
  public set shadowAlpha(value: number) {
    this._shadowAlpha = value;
    ShadowUILayerHandler.handle_ALPHA(this._uuid, value);
  }
  protected _infoAlpha: number = 0;
  public get infoAlpha(): number {
    return this._infoAlpha;
  }
  public set infoAlpha(value: number) {
    this._infoAlpha = value;
    AvatarInfoUILayerHandler.handle_CON_ALPHA(
      this._uuid,
      AvatarInfoTag.All,
      value,
    );
  }

  private _objName: string = "";
  public set objName(value: string) {
    this._objName = value;
    if (this._avatar) {
      this._avatar.objName = value;
    }
  }
  public get objName(): string {
    return this._objName;
  }
  /** 唯一标志 */
  public _uuid: string = "";
  public set uuid(value: string) {
    this._uuid = this.avatarBaseViewType + "_" + value;
    if (this._avatar) {
      this._avatar.uuid = value;
    }
    this.showMountShadow = false;
    this.createNickName();

    // 为了方便先这样写
    this.createConsortiaName();
    this.createVip();
    this.createQQDWKName();

    this.uuidCallBack();
  }
  public get uuid(): string {
    return this._uuid;
  }

  // 玩家头顶信息需要在设置uuid之后, 因为要重排
  protected uuidCallBack() {
    this.setName();
  }

  protected createNickName() {
    //Logger.info("[AvatarBaseView]createNickName", this.objName, this._uuid)
    AvatarInfoUILayerHandler.handle_CON_CREATE(
      this._uuid,
      AvatarInfoTag.NickName,
      { strokeWidth: 0 },
    );
  }

  protected createConsortiaName() {
    //Logger.info("[AvatarBaseView]createConsortiaName", this.objName, this._uuid)
    AvatarInfoUILayerHandler.handle_CON_CREATE(
      this._uuid,
      AvatarInfoTag.ConsortiaName,
      { strokeWidth: 0 },
    );
  }

  protected createVip() {
    AvatarInfoUILayerHandler.handle_CON_CREATE(this._uuid, AvatarInfoTag.Vip);
  }

  protected createQQDWKName() {
    if (!Utils.isQQHall()) return;
    if (
      !QQDawankaManager.Instance.isDWK &&
      !QQDawankaManager.Instance.isSuperDWK
    )
      return;
    if (
      this.avatarBaseViewType == eAvatarBaseViewType.SpaceArmy ||
      this.avatarBaseViewType == eAvatarBaseViewType.CampaignArmy ||
      this.avatarBaseViewType == eAvatarBaseViewType.OuterCityArmy
    ) {
      AvatarInfoUILayerHandler.handle_CON_CREATE(
        this._uuid,
        AvatarInfoTag.QQ_DWK,
      );
    }
  }

  protected get isDwk(): boolean {
    if (Utils.isQQHall() && this.isSelf) {
      return (
        QQDawankaManager.Instance.isDWK || QQDawankaManager.Instance.isSuperDWK
      );
    } else {
      return false;
    }
  }

  public get isSelf(): boolean {
    return false;
  }

  protected _avatar: Avatar;
  public set avatarView(value: Avatar) {
    if (this._avatar) {
      ObjectUtils.disposeObject(this._avatar);
    }
    this._avatar = value;
    (<HeroAvatar>this._avatar).isShowWeapons = true;
    this._avatar.angle = 2;
    if (this._isPlaying) this.addChild(this._avatar);
  }

  public get avatarView(): Avatar {
    return this._avatar;
  }

  protected _petAvatarView: PetAvatarView;
  public get petAvatarView(): PetAvatarView {
    return this._petAvatarView;
  }
  public set petAvatarView(value: PetAvatarView) {
    if (this._petAvatarView) {
      this._petAvatarView.dispose();
    }
    this._petAvatarView = value;
    if (this._petAvatarView) {
      this.addChild(this._petAvatarView);
    }
  }

  protected _showTranslucenceView: boolean = false;
  public set showTranslucenceView(v: boolean) {
    if (this._avatar) {
      this._avatar.showTranslucenceView = v;
    }
    this._showTranslucenceView = v;
    this.layoutView();
  }

  public get showTranslucenceView(): boolean {
    return this._showTranslucenceView;
  }

  public get info(): AIBaseInfo {
    return this._info;
  }

  public set info($baseInfo: AIBaseInfo) {
    if (!this._info) {
      this._info = $baseInfo;
    } else {
      this._info.sysInfo($baseInfo);
    }
  }

  /////////////////////////////事件//////////////////////////
  protected addEvent() {
    if (this._info) {
      this._info.addEventListener(
        AiEvents.UPDATE_PATHS,
        this.mNewMoveHandler,
        this,
      );
    }
  }

  protected removeEvent() {
    if (this._info)
      this._info.removeEventListener(
        AiEvents.UPDATE_PATHS,
        this.mNewMoveHandler,
        this,
      );
  }

  private mNewMoveHandler(data: any) {
    this.newMove();
  }

  protected newMove() {}

  // protected mBlurMask(data: any) {
  //     if (data && data.isBlur) {
  //         if (this._avatar && !this._avatar.destroyed) this._avatar.filters = [UIFilter.blurFilter];
  //     } else {
  //         if (this._avatar && !this._avatar.destroyed) this._avatar.filters = [];
  //     }
  // }
  ///////////////////////////////////////////////////////////

  public execute() {
    if (this.restrictMoveCount > 0) {
      this.restrictMoveCount--; //限制移动
      this._isStand = true;
      return;
    }
    if (
      this._info &&
      this._info.pathInfo &&
      this._info.pathInfo.length > this._info.walkIndex
    ) {
      this._isStand = false;
      if (this._info.currentFrame >= this._info.totalFrame) {
        var nextPoint: Laya.Point = this._info.pathInfo[
          this._info.walkIndexToNext
        ] as Laya.Point;
        this.nextWalk(nextPoint);
        this._info.currentFrame++;
        this.playMovie();
      } else {
        this._info.currentFrame++;
        this.playMovie();
      }
    } else {
      if (this._info) {
        if (this._info.currentFrame < this._info.totalFrame - 1) {
          this._info.currentFrame++;
          this.playMovie();
          return;
        } else if (this._info.currentFrame == this._info.totalFrame - 1) {
          this._info.currentFrame++;
          this.playMovie();
        }
      }

      if (!this._isStand) this.walkOver();
      this._isStand = true;
    }
  }

  public set isPlaying(value: boolean) {
    // if (this._isPlaying == value) {
    // 	return;
    // }

    if (this._avatar) {
      (<HeroAvatar>this._avatar).isRending = value;
    }
    if (this._petAvatarView) {
      this._petAvatarView.isPlaying = value;
    }
    if (value) {
      if (this._avatar && this._avatar.parent == null) {
        this.addChild(this._avatar);
      }
      if (this._petAvatarView && this.petAvatarView.parent == null) {
        this.addPetToStage();
      }
    } else {
      if (this._avatar) {
        this._avatar.removeSelf();
      }
      if (this._petAvatarView) {
        this._petAvatarView.removeSelf();
      }
    }
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  protected addPetToStage() {
    if (this.petAvatarView.followType == 1) {
      let sceneType = SceneManager.Instance.currentType;
      switch (sceneType) {
        case SceneType.OUTER_CITY_SCENE:
          OuterCityManager.Instance.mapView.worldWalkLayer.addChild(
            this._petAvatarView,
          );
          break;
        case SceneType.CAMPAIGN_MAP_SCENE:
          CampaignManager.Instance.mapView.walkLayer.addChild(
            this._petAvatarView,
          );
          break;
        case SceneType.SPACE_SCENE:
          SpaceManager.Instance.mapView.walkLayer.addChild(this._petAvatarView);
          break;
      }
    } else {
      this.addChild(this.petAvatarView);
    }
  }

  protected walkOver() {
    this._info.dispatchEvent(ObjectsEvent.WALK_OVER, this);
    this.event(ObjectsEvent.WALK_OVER, this);
  }

  protected nextWalk(point: Laya.Point) {
    this._prePoint = new Laya.Point(this.x, this.y);
    this._nextPoint = new Laya.Point(point.x, point.y);
    var leng: number = this._prePoint.distance(
      this._nextPoint.x,
      this._nextPoint.y,
    );
    this.info.currentFrame = 0;
    this.info.totalFrame = Math.floor(leng / this._info.speed);
  }

  protected playMovie() {
    if (!this._prePoint) return;
    var temp: Laya.Point = StringHelper.interpolate(
      this._nextPoint,
      this._prePoint,
      this.info.currentFrame / this.info.totalFrame,
    );
    this.x = temp.x;
    this.y = temp.y;
  }

  protected resetSizeType() {
    if (this._avatar) {
      this._avatar.resetSizeType();
    }
    this.setHitArea();
  }

  protected layoutView() {
    if (!this._avatar) return;
    this.resetSizeType();
    this.layoutTxtViewWithNamePosY();
  }

  protected layoutTxtViewWithNamePosY() {
    this._showNamePosY = this.getPosYBySizeType(
      this._avatar.sizeType,
      this._avatar.flight,
    );
    AvatarInfoUILayerHandler.handle_CON_POSY(
      this._uuid,
      this.y + this._showNamePosY,
    );
  }

  protected getPosYBySizeType(sizeType: number, flight: number = 0): number {
    return 0;
  }

  protected setHitArea() {
    if (!this._avatar) {
      return;
    }

    let rect = this._avatar.sizeMax[this._avatar.sizeType];
    if (rect != this._hitRect) {
      this._hitRect = rect;
      if (!this.hitArea) {
        this.hitArea = new Laya.HitArea();
      }
      this.hitArea.hit.clear();
      this.hitArea.hit.drawRect(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        "#FF0000",
      );
      this.setHitTestAlpha();

      if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") {
        if (!this._debugSp) {
          this._debugSp = new Laya.Sprite();
          this._debugSp.alpha = 0.5;
          this.addChild(this._debugSp);
        }
        this._debugSp.graphics.clear();
        this._debugSp.graphics.drawRect(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          "#FF0000",
        );
        Logger.yyz("Avatar的点击区域: ", this.hitArea);
      }
    }
  }

  // 尺寸太小不要开启alpha检测, 要不然可能点不到
  protected setHitTestAlpha() {
    switch (this._avatar.sizeType) {
      case 1: // 天空之城npc 副本怪物等等
      case 7: // 英灵岛英灵
      case 8:
        this._hitTestAlpha = false;
        break;
      default:
        this._hitTestAlpha = true;
        break;
    }
  }

  protected changeLandEffect() {}

  public gray(b: boolean) {
    if (b) {
      UIFilter.gray(this);
    } else {
      UIFilter.normal(this);
    }
  }

  ///////////////////////////信息显示////////////////////////////
  public get x(): number {
    if (this._px % 1 != 0) {
      Logger.yyz(
        "========================================角色坐标出现小数！！！===============================",
      );
    }
    return this._px;
  }

  public set x(value: number) {
    value = Math.round(value);
    if (value == this._px) return;

    this._px = value;
    super.x = value;

    ShadowUILayerHandler.handle_POSX(this._uuid, value);
    AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, value);
  }

  public get y(): number {
    return this._py;
  }

  public set y(value: number) {
    value = Math.round(value);
    if (value == this._py) return;

    this._py = value;
    super.y = value;

    ShadowUILayerHandler.handle_POSY(this._uuid, value);
    AvatarInfoUILayerHandler.handle_CON_POSY(
      this._uuid,
      value + this._showNamePosY,
    );
  }

  /**
   * 外城物资车专用 不对坐标进行取整操作
   */
  public set newY(value: number) {
    if (value == this._py) return;
    this._py = value;
    super.y = value;

    ShadowUILayerHandler.handle_POSY(this._uuid, value);
    AvatarInfoUILayerHandler.handle_CON_POSY(
      this._uuid,
      value + this._showNamePosY,
    );
  }

  /**
   * 外城物资车专用 不对坐标进行取整操作
   */
  public set newX(value: number) {
    if (value == this._px) return;
    this._px = value;
    super.x = value;
    ShadowUILayerHandler.handle_POSX(this._uuid, value);
    AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, value);
  }

  public set visible(value: boolean) {
    super.visible = value;
    this.active = value;
    ShadowUILayerHandler.handle_VISIBLE(this._uuid, value);
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.Info,
      value,
    );
    if (this.petAvatarView) {
      this.petAvatarView.visible = value;
    }
  }

  public get visible(): boolean {
    return super.visible;
  }

  // protected setFireView() {
  //     if (!this._attackView) this._attackView = new SimpleAvatarView(110, 110, PathManager.fightStatePath, 10);
  //     this._attackView.drawFrame = 2;
  //     this.addChild(this._attackView);
  //     this._attackView.x = - 55;
  //     this._attackView.y = this._showNamePosY - 90;

  //     this.showName();
  //     this.showConsortia();
  //     this.showHoner();
  //     this.showVipIcon(this.isVip)

  //     this._chatPopView && this.addChild(this._chatPopView.displayObject);
  // }

  // protected clearFireView() {
  //     if (this._attackView) {
  //         ObjectUtils.disposeObject(this._attackView); this._attackView = null;
  //     }
  // }

  public set noShadow(value: boolean) {
    ShadowUILayerHandler.handle_VISIBLE(this._uuid, !value);
    this._noShadow = value;
  }

  public get noShadow(): boolean {
    return this._noShadow;
  }

  public set showMountShadow(value: boolean) {
    if (value) {
      ShadowUILayerHandler.handle_CREATE(this._uuid, ShadowType.Mount);
      ShadowUILayerHandler.handle_DISPOSE(this._uuid, ShadowType.Normal);
    } else {
      ShadowUILayerHandler.handle_CREATE(this._uuid, ShadowType.Normal);
      ShadowUILayerHandler.handle_DISPOSE(this._uuid, ShadowType.Mount);
    }

    // 上下坐骑需要更新阴影
    ShadowUILayerHandler.handle_POSX(this._uuid, this.x);
    ShadowUILayerHandler.handle_POSY(this._uuid, this.y);

    this._showMountShadow = value;
  }

  public get showMountShadow(): boolean {
    return this._showMountShadow;
  }

  protected setName(name: string = "", nameColor?: number, grade?: number) {
    // if (grade && grade > 0) {
    // 	name = name + "  " + LangManager.Instance.GetTranslation("public.level4_space2", grade);
    // }
    //Logger.info("[AvatarBaseView]setName", this.objName, this.uuid, this.name)
    AvatarInfoUILayerHandler.handle_NAME_TEXT(this._uuid, name);
    AvatarInfoUILayerHandler.handle_NAME_FRAME(
      this._uuid,
      nameColor == 0 ? 1 : nameColor,
      eFilterFrameText.AvatarName,
    );
  }

  protected showChatPopView(chatData: ChatData) {
    AvatarInfoUILayerHandler.handle_CON_CREATE(
      this._uuid,
      AvatarInfoTag.ChatPopView,
      chatData,
    );
    AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, this._px);
    AvatarInfoUILayerHandler.handle_CON_POSY(
      this._uuid,
      this._py + this._showNamePosY,
    );
  }

  protected hideChatPopView(chatData: ChatData) {
    AvatarInfoUILayerHandler.handle_CON_DISPOSE(
      this._uuid,
      AvatarInfoTag.ChatPopView,
    );
  }

  public showConsortia(visible: boolean = true): void {
    //Logger.info("[AvatarBaseView]showConsortia", this.objName, this.uuid, visible)
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.ConsortiaName,
      visible,
    );
  }

  public showVipIcon(visible: boolean = true) {
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.Vip,
      visible,
    );
  }

  public showQQDWKIcon(visible: boolean = true) {
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.QQ_DWK,
      visible,
    );
  }

  public showName(visible: boolean = true) {
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.NickName,
      visible,
    );
  }

  public showHoner(visible: boolean = true) {
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.Appell,
      visible,
    );
  }

  /**
   * 除了人物形象外的其他所有信息
   * @param visible
   * @param includeFateSkillEffect
   */
  public showInfo(
    visible: boolean = true,
    showFateSkillEffect: boolean = true,
  ) {
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.Info,
      visible,
    );

    if (this._fateSkillEffect != null) {
      this._fateSkillEffect.visible = visible && showFateSkillEffect;
      this._fateSkillEffect.active = visible && showFateSkillEffect;
    }
    this.noShadow = false;
  }

  public disposeInfo() {
    AvatarInfoUILayerHandler.handle_CON_DISPOSE(this._uuid, AvatarInfoTag.Info);
  }

  public disposePetInfo() {
    AvatarInfoUILayerHandler.handle_CON_DISPOSE(
      this._uuid,
      AvatarInfoTag.PetInfo,
    );
  }

  public disposeShadows() {
    ShadowUILayerHandler.handle_DISPOSE(this._uuid, ShadowType.Normal);
    ShadowUILayerHandler.handle_DISPOSE(this._uuid, ShadowType.Mount);
  }
  ///////////////////////////////////////////////////////

  public getCurrentPixels(point?: Laya.Point): number {
    if (this._avatar) {
      return (<HeroAvatar>this._avatar).getCurrentPixels(point);
    }
    return 0;
  }

  public set filter(value: IBuildingFilter) {
    this._filter = value;
  }

  protected createResourceLoadInfo(
    url: string,
    sornStand: any[] = [],
    sornWalk: any[] = [],
    position: string,
    positionAddSign: string = "",
  ): ResourceLoaderInfo {
    let loadInfo: ResourceLoaderInfo = new ResourceLoaderInfo();
    loadInfo.packageName = "";
    loadInfo.url = url;
    loadInfo.stand = sornStand;
    loadInfo.walk = sornWalk;
    loadInfo.position = position;
    loadInfo.positionAddSign = positionAddSign;
    return loadInfo;
  }

  public get isLiving(): boolean {
    if (!this._info) return false;
    return this._info.isLiving;
  }

  protected updateDirection(angle: number) {
    if (this._avatar) this._avatar.angle = angle;
  }

  /**
   * 转换当前坐标为格子坐标
   */
  public getTilePos(x: number = this.x, y: number = this.y): Laya.Point {
    return new Laya.Point(
      parseInt((x / Tiles.WIDTH).toString()),
      parseInt((y / Tiles.HEIGHT).toString()),
    );
  }

  public get nextPoint(): Laya.Point {
    return this._nextPoint;
  }

  public get speedX(): number {
    return 0;
  }

  public get speedY(): number {
    return 0;
  }

  protected get isVip(): boolean {
    return false;
  }

  ///////////////////////////适配//////////////////////////////
  public addEventListener(
    eventName: any = "",
    callback: Function,
    target: object,
  ) {
    if (this._event) this._event.on(eventName, callback, target);
  }
  public removeEventListener(
    eventName: any,
    callback: Function,
    target: object,
  ) {
    if (this._event) this._event.off(eventName, callback, target);
  }
  public dispatchEvent(eventName: any, data?: any, data2?: any, data3?: any) {
    if (this._event) this._event.emit(eventName, data, data2, data3);
  }

  public dispose() {
    this.removeEvent();
    this._filter = null;
    this._nextPoint = null;
    this._prePoint = null;
    this.disposeInfo();
    this.disposeShadows();
    // this.clearFireView();
    if (this._avatar) ObjectUtils.disposeObject(this._avatar);
    this._avatar = null;
    if (this._petAvatarView) ObjectUtils.disposeObject(this._petAvatarView);
    this._petAvatarView = null;
    if (this._fateSkillEffect) ObjectUtils.disposeObject(this._fateSkillEffect);
    this._fateSkillEffect = null;
    this.removeSelf();
  }
}
