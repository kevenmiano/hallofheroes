import LayerMgr from "../../core/layer/LayerMgr";
import { EmLayer } from "../../core/ui/ViewInterface";
import Dictionary from "../../core/utils/Dictionary";
import { DisplayObject } from "../component/DisplayObject";
import {
  ActionLabesType,
  BattleModelNotic,
  BattleType,
  InheritRoleType,
} from "../constant/BattleDefine";
import {
  BattleEvent,
  BattleNotic,
  ChatEvent,
} from "../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../constant/UIDefine";
import { ChatChannel } from "../datas/ChatChannel";
import { NotificationManager } from "../manager/NotificationManager";
import ChatData from "../module/chat/data/ChatData";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { BattleManager } from "./BattleManager";
import { BattleModel } from "./BattleModel";
import { HeroRoleInfo } from "./data/objects/HeroRoleInfo";
import { BattleUtils } from "./utils/BattleUtils";
import { BattleMapView } from "./view/map/BattleMapView";
import { BaseRoleView } from "./view/roles/BaseRoleView";
import Resolution from "../../core/comps/Resolution";
import RedScreenEffect from "./view/ui/RedScreenEffect";
import ObjectUtils from "../../core/utils/ObjectUtils";
import ChatPopView from "../module/chat/ChatPopView";
import FUIHelper from "../utils/FUIHelper";
import { PlayerManager } from "../manager/PlayerManager";
import StringHelper from "../../core/utils/StringHelper";

/**
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 12:12:02
 * @LastEditTime: 2021-01-29 16:54:48
 * @LastEditors: jeremy.xu
 * @Description:  战斗视图
 */
export class BattleView extends Laya.Sprite {
  private _model: BattleModel;
  private _sceneWidth: number = 0;
  private _sceneHeight: number = 0;
  /**
   * 战斗地图
   */
  private _map: BattleMapView;
  /**
   * 奥义播放层
   */
  private _profoundLayer: Laya.Sprite;
  /**
   * 战斗场景的背景（被挡在下面的, 平时看不到, 为了实现扭曲效果）
   */
  private _bitmap_background: Laya.Sprite; //
  /**
   * 自己英雄被暴击是红屏显示层
   */
  private _redScreenEffect: RedScreenEffect;
  public static CAMERA_Y: number = 0;
  public static CAMERA_X: number = 0; //1100
  /** 缓存战斗场景中每个角色发送过的气泡 */
  private chatPopViewDic: Dictionary = new Dictionary();

  constructor($model: BattleModel) {
    super();
    this._model = $model;
    this._sceneWidth = Laya.stage.width;
    this._sceneHeight = Laya.stage.height;
    this.init();
  }

  public init() {
    BattleView.CAMERA_Y = Resolution.gameHeight / 2;
    BattleView.CAMERA_X = Resolution.gameWidth / 2;
    BattleManager.Instance.battleScene = this;
    this._bitmap_background = new Laya.Sprite();
    this.addChild(this._bitmap_background);
    this._map = new BattleMapView(this._model);
    this.buildMap();
    this.addChild(this._map);
    this._profoundLayer = new Laya.Sprite();
    this.addChild(this._profoundLayer);

    this._map.cameraY = BattleView.CAMERA_Y;
    this._map.cameraX = BattleView.CAMERA_X;

    BattleManager.Instance.battleMap = this._map;
    FrameCtrlManager.Instance.open(EmWindow.Battle);

    this._redScreenEffect = new RedScreenEffect();
    this.addChild(this._redScreenEffect);

    this.initRole();
    this.addEvent();

    BattleManager.Instance.resourceModel.startSilentlyLoadFigure();
    LayerMgr.Instance.getLayerByType(EmLayer.GAME_UI_LAYER).setVisible(false);
    this.resize();
  }

  resize() {
    this.x = Resolution.gameWidth / 2;
    this.y = Resolution.gameHeight / 2;

    this._map.x = -Resolution.gameWidth / 2;
    this._map.y = -Resolution.gameHeight / 2;

    this._map.resize();

    if (this._redScreenEffect) {
      this._redScreenEffect.x = -Resolution.gameWidth / 2;
      this._redScreenEffect.y = -Resolution.gameHeight / 2;
      this._redScreenEffect.resize();
    }
  }

  public update() {
    if (this._map) this._map.update();
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      BattleModelNotic.ADD_ROLE,
      this.__modelAddRole,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleNotic.REFRESH_BACK_BITMAP,
      this.__refreshBackGroundBitmap,
      this,
    );
    NotificationManager.Instance.addEventListener(
      BattleEvent.SHAKE_MAP_COMPLETE,
      this.onShakeMapComplete,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__playerChatHandler,
      this,
    );
  }

  private onShakeMapComplete(event: BattleEvent) {
    // if (this._map.cameraY != BattleView.CAMERA_Y) {
    this.resize();
    // }
  }

  private __playerChatHandler(chatData: ChatData) {
    if (
      !PlayerManager.Instance.currentPlayerModel.playerInfo
        .isOpenSettingType9 ||
      chatData.uid == 0
    ) {
      return;
    }
    if (
      chatData.htmlText.indexOf("<a") > -1 &&
      chatData.htmlText.indexOf("/>") > -1
    ) {
      return;
    }
    if (
      chatData.encodemsg.indexOf("<a") > -1 &&
      chatData.encodemsg.indexOf("/>") > -1
    ) {
      return;
    }
    if (chatData.serverId) {
      return;
    }
    let showPop: boolean = false;
    let targetRole: HeroRoleInfo;
    let key: any;
    if (chatData.channel == ChatChannel.BATTLE_CHAT) {
      targetRole = this._model.getRoleById(chatData.livingId);
      if (targetRole) {
        chatData.uid = targetRole.userId;
        //队内”快捷语和信息编辑栏消息仅队友可见, 对立阵营仅可见“全局”快捷语
        if (chatData.type == 0) {
          if (targetRole.side == this._model.selfHero.side) {
            showPop = true;
          }
        } else {
          showPop = true;
        }
      }
      if (!StringHelper.isNullOrEmpty(chatData.serverName)) {
        key =
          PlayerManager.Instance.currentPlayerModel.userInfo.mainSite +
          chatData.uid +
          "_" +
          chatData.serverName;
      } else {
        key =
          PlayerManager.Instance.currentPlayerModel.userInfo.mainSite +
          chatData.uid;
      }
    } else {
      if (
        chatData.channel != ChatChannel.TEAM &&
        chatData.channel != ChatChannel.WORLD &&
        chatData.channel != ChatChannel.BIGBUGLE &&
        chatData.channel != ChatChannel.CONSORTIA
      ) {
        return;
      }
      let userId: number = chatData.uid;
      if (!StringHelper.isNullOrEmpty(chatData.serverName)) {
        targetRole = this._model.getHeroRoleByUserId(
          userId,
          chatData.serverName,
        );
        if (targetRole && targetRole.side == this._model.selfHero.side) {
          showPop = true;
        }
        key =
          PlayerManager.Instance.currentPlayerModel.userInfo.mainSite +
          userId +
          "_" +
          chatData.serverName;
      } else {
        targetRole = this._model.getHeroRoleByUserId(userId);
        if (targetRole && targetRole.side == this._model.selfHero.side) {
          showPop = true;
        }
        key =
          PlayerManager.Instance.currentPlayerModel.userInfo.mainSite + userId;
      }
    }
    if (showPop) {
      //判断是不是同一个人发出的
      let roleView = targetRole.getRoleView().body;
      let chatPopView: ChatPopView = this.chatPopViewDic[key] as ChatPopView;
      if (!chatPopView) {
        chatPopView = FUIHelper.createFUIInstance(
          EmPackName.Base,
          "ChatBubbleTip",
        );
        this.chatPopViewDic[key] = chatPopView;
      }
      chatPopView.updateContent(
        chatData.htmlText,
        chatData.encodemsg,
        null,
        0,
        chatData.channel,
      );
      if (!chatPopView.displayObject.parent) {
        chatPopView.x = 0;
        chatPopView.y = -140;
        roleView.addChild(chatPopView.displayObject);
      }
    }
  }

  /**
   * 战斗中添加角色
   * @param event
   *
   */
  private __modelAddRole(data: any) {
    let oldRole = data.oldInfo;
    if (oldRole) {
      this._map.removeRole(oldRole.livingId);
    }
    let newRole = data.newInfo;
    if (newRole) {
      this.addRole(newRole);
    }
  }
  /**
   * 初始化地图
   *
   */
  private buildMap() {
    // let mapId = BattleManager.Instance.battleModel.mapId;
    // let mapShowmapId = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_map, mapId).BattleGround;
    // let _battleMapData: BattleMapData = new BattleMapData();
    this._map.changeSingleMap(
      BattleManager.Instance.resourceModel.battleMapRes,
    );
    // this._map.changeMap(_battleMapData);
  }

  /**
   * 初始化角色
   *
   */
  private initRole() {
    let roles: Dictionary;
    roles = this._model.armyInfoLeft.getHeros;
    this.initRoles(roles);
    roles = this._model.armyInfoLeft.getPawns;
    this.initRoles(roles);
    roles = this._model.armyInfoLeft.getPets;
    this.initRoles(roles);
    roles = this._model.armyInfoRight.getHeros;
    this.initRoles(roles);
    roles = this._model.armyInfoRight.getPawns;
    this.initRoles(roles);
    roles = this._model.armyInfoRight.getPets;
    this.initRoles(roles);
  }

  private initRoles(roles: Dictionary) {
    for (const key in roles) {
      if (Object.prototype.hasOwnProperty.call(roles, key)) {
        const roleInfo = roles[key];
        let temp: Laya.Point = BattleUtils.rolePointByPos(
          roleInfo.pos,
          roleInfo.face,
        );
        roleInfo.initPos(temp);
        this.addRole(roleInfo);
      }
    }
  }
  /**
   * 添加一个role
   * @param roleInfo
   *
   */
  public addRole(roleInfo) {
    if (roleInfo.needShow) {
      return;
    }

    let role: BaseRoleView;
    role = roleInfo.getRoleView();
    roleInfo.defaultAction = roleInfo.isLiving
      ? ActionLabesType.STAND
      : ActionLabesType.DIE;

    this.addRoleView(role);
    if (
      roleInfo.inheritType == InheritRoleType.Hero &&
      roleInfo.type != 3 &&
      this.checkBattleType()
    ) {
      this.addTeamStrip(roleInfo);
    }
    if (role.inheritType == InheritRoleType.Pawn && !roleInfo.isLiving) {
      roleInfo.isLiving = false;
    }
  }

  private addTeamStrip(roleInfo) {
    if (roleInfo == null || BattleManager.Instance.battleUIView == null) return;
    BattleManager.Instance.battleUIView.addTeamStrip(roleInfo);
  }
  private checkBattleType(): boolean {
    if (!this._model) return false;
    switch (this._model.battleType) {
      case BattleType.BATTLE_CHALLENGE:
      case BattleType.HANGUP_PVP:
      case BattleType.CROSS_WAR_FIELD_BATTLE:
      case BattleType.WARLORDS:
      case BattleType.WARLORDS_OVER:
      case BattleType.PET_PK:
      case BattleType.PET__HUMAN_PK:
      case BattleType.MINERAL_PK:
        return false;
      default:
        return true;
    }
  }
  /**
   *	添加英雄形象
   * @param roleView
   */
  private addRoleView(roleView: BaseRoleView) {
    roleView.info.map = this._map;
    this._map.addRole(roleView);
  }
  public playRedScreen() {
    this._redScreenEffect.play();
  }

  protected __refreshBackGroundBitmap(event: Event) {
    // 绘制舞台背景 TODO
    if (BattleManager.Instance.mainViewContainer.view) {
      this._bitmap_background.texture = this.drawDisplayObject(
        BattleManager.Instance.mainViewContainer.view,
      );
      this._bitmap_background.filters = [new Laya.BlurFilter(1)];
      this._bitmap_background.x = -1;
      this._bitmap_background.y = -1;
    }
  }

  public drawDisplayObject(obj: DisplayObject = null): Laya.Texture {
    let rect: Laya.Rectangle = obj.getBounds();
    if (obj instanceof Laya.Stage || (rect.width != 0 && rect.height != 0)) {
      let bimap_rect: Laya.Rectangle = new Laya.Rectangle(
        0,
        0,
        Math.abs(rect.width),
        Math.abs(rect.height),
      );
      bimap_rect.width = bimap_rect.width > 2880 ? 2880 : bimap_rect.width;
      bimap_rect.height = bimap_rect.height > 2880 ? 2880 : bimap_rect.height;
      let bitmapdata: Laya.Texture = new Laya.Texture(
        obj.texture,
        null,
        bimap_rect.width,
        bimap_rect.height,
      );
      let matrix: Laya.Matrix = new Laya.Matrix();
      matrix.translate(-rect.x, -rect.y);
      return bitmapdata;
    }
    return null;
  }

  public get sceneWidth(): number {
    return this._sceneWidth;
  }

  public get sceneHeight(): number {
    return this._sceneHeight;
  }
  public getProfoundLayer(): Laya.Sprite {
    return this._profoundLayer;
  }
  public dispose() {
    // BattleChatController.Instance.dispose();
    LayerMgr.Instance.getLayerByType(EmLayer.GAME_UI_LAYER).setVisible(true);
    NotificationManager.Instance.removeEventListener(
      BattleModelNotic.ADD_ROLE,
      this.__modelAddRole,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleNotic.REFRESH_BACK_BITMAP,
      this.__refreshBackGroundBitmap,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      BattleEvent.SHAKE_MAP_COMPLETE,
      this.onShakeMapComplete,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ChatEvent.UPDATE_CHAT_VIEW,
      this.__playerChatHandler,
      this,
    );

    for (const key in this.chatPopViewDic) {
      let popView = this.chatPopViewDic.get(key);
      ObjectUtils.disposeObject(popView);
    }
    ObjectUtils.clearDictionary(this.chatPopViewDic);
    ObjectUtils.disposeObject(this._redScreenEffect);
    this._redScreenEffect = null;
    // ObjectUtils.disposeAllChildren(this._profoundLayer); this._profoundLayer = null;
  }
}
