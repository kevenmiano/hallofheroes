/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-07 12:23:14
 * @LastEditTime: 2024-02-02 11:26:19
 * @LastEditors: jeremy.xu
 * @Description: 战斗地图视图类
 */

import Resolution from "../../../../core/comps/Resolution";
import Logger from "../../../../core/logger/Logger";
import ResMgr from "../../../../core/res/ResMgr";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { DisplayObject } from "../../../component/DisplayObject";
import {
  ActionLabesType,
  BattleType,
  InheritRoleType,
} from "../../../constant/BattleDefine";
import {
  BattleEvent,
  BattleNotic,
  RoleEvent,
} from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PathManager } from "../../../manager/PathManager";
import { SharedManager } from "../../../manager/SharedManager";
import FUIHelper from "../../../utils/FUIHelper";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
// import { BattleBackGroundData } from "../../data/BattleBackGroundData";
// import { BattleMapData } from "../../data/BattleMapData";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { BattleEffect } from "../../skillsys/effect/BattleEffect";
import { EffectContainer } from "../../skillsys/effect/EffectContainer";
import { BattleUtils } from "../../utils/BattleUtils";
import { BaseRoleView } from "../roles/BaseRoleView";
import { BattleMap } from "./BattleMap";
import { RepeatBackGroundLayer } from "./RepeatBackGroundLayer";

export class BattleMapView extends BattleMap {
  private static REVIVE_BATTLE_TYPE: Array<number> = [
    BattleType.DOUBLE_BOSS_BATTLE,
  ];
  private _mapData;
  /**
   * 场景切换特效层
   */
  private _gasEffectContainer = new EffectContainer();
  private _mapLayers: DisplayObject[] = [];

  private _sceneEffectLayers: DisplayObject[] = [];

  constructor(_model: BattleModel) {
    super();
  }

  protected addEvent() {
    super.addEvent();
    Laya.stage.on(Laya.Event.VISIBILITY_CHANGE, this, this.onVisibilityChange);
    NotificationManager.Instance.on(
      BattleEvent.SCENE_EFFECT_CLOSE,
      this.onSceneEffecCloseHandler,
      this,
    );
    NotificationManager.Instance.on(
      BattleEvent.BATTLE_BGANI_LOADED,
      this.onBattleBgAniLoadHandler,
      this,
    );
  }

  protected delEvent() {
    super.delEvent();
    Laya.stage.off(Laya.Event.VISIBILITY_CHANGE, this, this.onVisibilityChange);
    NotificationManager.Instance.off(
      BattleEvent.SCENE_EFFECT_CLOSE,
      this.onSceneEffecCloseHandler,
      this,
    );
    NotificationManager.Instance.off(
      BattleEvent.BATTLE_BGANI_LOADED,
      this.onBattleBgAniLoadHandler,
      this,
    );
  }

  protected initView() {
    super.initView();
    if (BattleModel.battleBgAniLoaded) {
      this.onBattleBgAniLoadHandler();
    }
  }

  private onSceneEffecCloseHandler() {
    if (SharedManager.Instance.allowSceneEffect) {
      this.showSceneEffect();
    } else {
      this.removeSceneEffect();
    }
  }

  private onBattleBgAniLoadHandler() {
    if (!this._mapBgAni) {
      let mapId = BattleManager.Instance.battleModel.mapResId;
      this._mapBgAni = FUIHelper.createFUIInstance(
        EmWindow.BattleBgAni,
        PathManager.getBattleMapAniPath(mapId),
      );
      if (this._mapBgAni) {
        this.addLayerAt(this._mapBgAni.displayObject, 1);
        this.resize();
      } else {
        Logger.battle("战斗地图动画创建失败", mapId);
      }
    }
  }

  private onVisibilityChange() {
    if (Laya.stage.isVisibility) {
      if (this.battleModel.isTrail()) {
        this.removeAlreadyDeadBoss();
      }
    } else {
    }
  }

  // 切后台动作不执行导致英雄残留bug
  private removeAlreadyDeadBoss() {
    let battleWnd = BattleManager.Instance.battleUIView;
    if (battleWnd) {
      let roleShowViewII = battleWnd.getRoleShowViewII();
      if (roleShowViewII && roleShowViewII.bossInfo) {
        let lID = roleShowViewII.bossInfo.livingId;
        let rightHeros = this.battleModel.armyInfoRight.getHeros;
        for (const key in rightHeros) {
          let hRole = rightHeros.get(key);
          if (hRole.livingId != lID) {
            this.removeRole(hRole.livingId);
            this.battleModel.removeRole(hRole);
          }
        }
      }
    }
  }

  /**
   * 地图更新, 带动角色刷新, 技能系统, 和角色动作队列执行
   *
   */
  public update() {
    super.update();

    BattleUtils.ManagerDepth(this._rolesContainer);
    this._rolesDict.forEach((role: BaseRoleView) => {
      role.updateShadowPos();
      //之前死亡会把视图上的info清空, 导致死亡的对象就不会再执行身上的动作, 但是battlemodel还存在该info,
      //技能系统分发动作的时候会从battlemodel上取数据去判断是否有动作未播完, 可能导致技能系统队列阻塞
      //如果角色死亡就没有执行他身上的动作了, 可能导致, 死亡后的一些动作不能执行, 比如复活
      // if(role.info)
      //     role.info.update();
    });

    var roles = this.battleModel.roleList;
    roles.forEach((info) => {
      info.update(); //接上, 从battlemodel里面的info去更新战斗角色, 从而达到死亡后也能继续执行角色身上的动作的目的
    });
  }
  /**
   * 在地图上添加一个角色
   * @param role
   *
   */
  public addRole(role: BaseRoleView) {
    //BaseRoleInfo
    var info = (role as BaseRoleView).info;
    this.removeRole(info.livingId);
    this._rolesContainer.addChild(role);
    this._rolesDict[info.livingId] = role;
    info.addEventListener(RoleEvent.DIE, this.onRoleDie.bind(this), this);
  }
  /**
   * 角色死亡
   * @param event
   *
   */
  private onRoleDie(info) {
    info.removeEventListener(RoleEvent.DIE, this.onRoleDie.bind(this), this);
    if (!this._rolesDict) {
      return;
    }
    var roleView: BaseRoleView = this._rolesDict[info.livingId];
    if (!roleView) {
      return;
    }
    roleView.clearEffectWhenDie();
    var isReviveBoss: boolean =
      BattleMapView.REVIVE_BATTLE_TYPE.indexOf(this.battleModel.battleType) >=
      0;
    if (
      info.inheritType == InheritRoleType.Hero &&
      (info as HeroRoleInfo).type != 3
    ) {
      roleView.setBloodStripVisible(false, true);
      // Logger.battle("[BattleMapView]onRoleDie 英雄死亡")
    } else if (
      info.inheritType == InheritRoleType.Hero &&
      (info as HeroRoleInfo).type == 3 &&
      isReviveBoss
    ) {
      info.action(ActionLabesType.DIE);
      roleView.setBloodStripVisible(false, false);
      if (roleView.parent) roleView.parent.removeChild(roleView);
    } else if (!(info.inheritType == InheritRoleType.Pet)) {
      // Logger.battle("[BattleMapView]onRoleDie 怪物死亡")
      this.removeRole(info.livingId);
      this.battleModel.removeRole(info);
    }
  }

  public revierBoss(role: BaseRoleView) {
    var info = (role as BaseRoleView).info;
    this._rolesContainer.addChild(role);
    this._rolesDict[info.livingId] = role;
    info.addEventListener(RoleEvent.DIE, this.onRoleDie.bind(this), this);
  }
  /**
   * 从地图上删除一个角色
   * @param id
   *
   */
  public removeRole(id: number) {
    var role: BaseRoleView = this._rolesDict[id] as BaseRoleView;
    if (role) {
      if (role.parent) role.parent.removeChild(role);
      role.dispose();
    }
    delete this._rolesDict[id];
  }
  /**
   * 改变战斗地图
   * @param url
   */
  public changeSingleMap(url: string) {
    let res = ResMgr.Instance.getRes(url);
    if (res) {
      this._mapBg.texture = res;
    } else {
    }
  }

  public resize() {
    this._mapBg.pivot(this._mapBg.width / 2, this._mapBg.height / 2);
    let widthRatio: number = Resolution.gameWidth / this._mapBg.width;
    let heightratio: number = Resolution.gameHeight / this._mapBg.height;
    let scaleV = Math.max(heightratio, widthRatio);
    this._mapBg.scaleX = this._mapBg.scaleY = scaleV;
    this._mapBg.x = Resolution.gameWidth / 2;
    this._mapBg.y = Resolution.gameHeight / 2;

    if (this._mapBgAni) {
      // this._mapBgAni.displayObject.pivot(GameConfig.width / 2, GameConfig.height / 2)
      this._mapBgAni.scaleX = this._mapBgAni.scaleY = scaleV;
      this._mapBgAni.x = Resolution.gameWidth / 2;
      this._mapBgAni.y = Resolution.gameHeight / 2;
    }
  }

  /**
   * 改变战斗地图
   * @param mapData BattleMapData
   * @param asset
   *
   */
  public changeMap(mapData: any, asset: string = "asset") {
    var data;
    this._mapData = mapData;
    for (var i: number = 0; i < mapData.bg_back_arr.length; i++) {
      data = mapData.bg_back_arr[i];
      if (data.repeat) {
        var layer: RepeatBackGroundLayer = new RepeatBackGroundLayer(
          data[asset],
          data.transparent,
        );
        layer.moveSpeed = data.moveSpeed;
        layer.mouseEnabled = false;
        this.addLayerAt(layer, i, data.moveCoefficient);
        layer.setParaData(data);
        this._mapLayers.push(layer);
      } else {
        if (SharedManager.Instance.allowSceneEffect) {
          var t_layer: RepeatBackGroundLayer = new RepeatBackGroundLayer(
            data[asset],
          );
          t_layer.mouseEnabled = false;
          this.addLayerAt(t_layer, i, data.moveCoefficient);
          this._mapLayers.push(t_layer);
          this._sceneEffectLayers.push(t_layer);
          t_layer.setParaData(data);
        }
      }
    }
    for (i = 0; i < mapData.bg_front_arr.length; i++) {
      data = mapData.bg_front_arr[i];
      var layer_f: RepeatBackGroundLayer;
      if (data.repeat) {
        layer_f = new RepeatBackGroundLayer(data[asset], data.transparent);
        layer_f.mouseEnabled = false;
        this.addLayer(layer_f, data.moveCoefficient);
        this._mapLayers.push(layer_f);
        layer_f.setParaData(data);
      } else {
        if (SharedManager.Instance.allowSceneEffect) {
          layer_f = new RepeatBackGroundLayer(data[asset]);
          layer_f.mouseEnabled = false;
          this.addLayer(layer_f, data.moveCoefficient);
          this._mapLayers.push(layer_f);
          this._sceneEffectLayers.push(layer_f);
          layer_f.setParaData(data);
        }
      }
    }

    this.addLayer(this._gasEffectContainer); //放到最高层
    if (!SharedManager.Instance.allowSceneEffect) {
      this.stopMovingAllMembers();
    }
  }

  /**
   * 关闭场景特效
   *
   */
  private removeSceneEffect() {
    var index: number = 0;
    if (this._sceneEffectLayers) {
      this._sceneEffectLayers.forEach((layer) => {
        layer.visible = false;
      });
    }
    this.stopMovingAllMembers();
  }
  /**
   * 开启场景特效
   *
   */
  private showSceneEffect() {
    var index: number = 0;
    if (this._sceneEffectLayers) {
      this._sceneEffectLayers.forEach((layer) => {
        layer.visible = true;
      });
    }
    this.playMovingAllMembers();
  }
  /**
   * 此特效层可擦除背景, 形成气浪效果
   * @return
   *
   */
  public addGasEffect(effect: BattleEffect, repeat: number = 1) {
    if (!SharedManager.Instance.allowAttactedEffect) {
      return;
    }
    // this.blendMode = Laya.BlendMode.OVERLAY;
    // this._gasEffectContainer.blendMode = Laya.BlendMode.SCREEN;

    NotificationManager.Instance.sendNotification(
      BattleNotic.REFRESH_BACK_BITMAP,
    );
    this._gasEffectContainer.addEffect(effect, repeat);
    effect.callBackComplete.addListener(gasEnd);
    function gasEnd() {
      this.blendMode = Laya.BlendMode.NORMAL;
      this._gasEffectContainer.blendMode = Laya.BlendMode.NORMAL;
    }
  }

  public get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  public dispose() {
    for (const key in this._mapLayers) {
      if (Object.prototype.hasOwnProperty.call(this._mapLayers, key)) {
        var layer: DisplayObject = this._mapLayers[key];
        if (layer instanceof RepeatBackGroundLayer) {
          (layer as RepeatBackGroundLayer).dispose();
        }
      }
    }
    if (this._mapLayers) this._mapLayers.length = 0;
    this._mapLayers = null;
    if (this._mapData) {
      this._mapData.dispose();
      this._mapData = null;
    }
    ObjectUtils.disposeAllChildren(this._gasEffectContainer);
    this._gasEffectContainer = null;
    while (this._sceneEffectLayers && this._sceneEffectLayers.length > 0) {
      ObjectUtils.disposeObject(this._sceneEffectLayers.pop());
    }
    this._sceneEffectLayers = null;
    ObjectUtils.disposeObject(this._mapBgAni);
    super.dispose();
  }
}
