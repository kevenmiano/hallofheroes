/*
 * @Author: jeremy.xu
 * @Date: 2024-03-15 17:49:10
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-28 17:39:06
 * @Description: 副本地图：单张背景地图 人物层
 *  目前只有秘境
 */

import Logger from "../../../../../core/logger/Logger";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { ShowAvatarBattle } from "../../../../avatar/view/ShowAvatarBattle";
import { GameLoadNeedData } from "../../../../battle/data/GameLoadNeedData";
import {
  HeroMovieClipRefType,
  SideType,
} from "../../../../constant/BattleDefine";
import {
  OuterCityEvent,
  SecretEvent,
} from "../../../../constant/event/NotificationEvent";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { CampaignMapModel } from "../../../../mvc/model/CampaignMapModel";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CampaignArmyState } from "../../data/CampaignArmyState";
import { CampaignWalkLayer } from "./CampaignWalkLayer";

export class CampaignSingleBgWalkLayer extends CampaignWalkLayer {
  protected init() {}

  protected addEvent() {
    this.initRegisterList();
    this._model.addEventListener(
      OuterCityEvent.ADD_GARRISON,
      this.__addBaseArmyHandler2,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.__removeBaseArmyHandler2,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.UPDATE_SELF,
      this.__updateSelfHandler2,
      this,
    );

    NotificationManager.Instance.on(SecretEvent.FAILED, this.__died, this);
    NotificationManager.Instance.on(SecretEvent.REVIVE, this.__alive, this);
    NotificationManager.Instance.on(SecretEvent.ADD_NPC, this.__addNpc, this);
    NotificationManager.Instance.on(
      SecretEvent.REMOVE_NPC,
      this.__removeNpc,
      this,
    );
  }

  protected removeEvent() {
    this.removeRegisterList();
    this._model.removeEventListener(
      OuterCityEvent.ADD_GARRISON,
      this.__addBaseArmyHandler2,
      this,
    );
    this._model.removeEventListener(
      OuterCityEvent.REMOVE_ARMY,
      this.__removeBaseArmyHandler2,
      this,
    );
    this._model.removeEventListener(
      OuterCityEvent.UPDATE_SELF,
      this.__updateSelfHandler2,
      this,
    );

    NotificationManager.Instance.off(SecretEvent.FAILED, this.__died, this);
    NotificationManager.Instance.off(SecretEvent.REVIVE, this.__alive, this);
    NotificationManager.Instance.off(SecretEvent.ADD_NPC, this.__addNpc, this);
    NotificationManager.Instance.off(
      SecretEvent.REMOVE_NPC,
      this.__removeNpc,
      this,
    );
  }

  private __updateSelfHandler2() {
    this.initSelfArmy();
  }

  private __addBaseArmyHandler2(data: CampaignArmy) {
    this.addAmryView2(data);
  }

  private __removeBaseArmyHandler2(data: CampaignArmy) {
    this.removeArmyView2(data);
  }

  private __died() {
    if (!this._model) return;
    this._model.allBaseArmy.forEach((army) => {
      army.isDie = CampaignArmyState.STATE_DIED;
    });
  }

  private __alive() {
    if (!this._model) return;
    this._model.allBaseArmy.forEach((army) => {
      army.isDie = CampaignArmyState.STATE_LIVE;
    });
  }

  private __addNpc(data: GameLoadNeedData) {
    if (this._armys.get(data.key)) {
      return this._armys.get(data.key);
    }

    let pos;
    let mapId: number = this._model.mapId;
    let arr = CampaignMapModel.getSingleBgMapPosList(-1);
    if (WorldBossHelper.checkSecret(mapId)) {
      pos = arr[1];
    } else if (WorldBossHelper.checkMultiSecret(mapId)) {
      // 根据玩家在房间列表中的位置来排列
      // pos = arr[1]
    }
    let armyView = new ShowAvatarBattle(
      HeroMovieClipRefType.SINGLEBG_CAMPAIGN_SCENE,
      false,
    );
    armyView.showShadow(true);
    armyView.setSide(SideType.DEFANCE_TEAM);
    armyView.x = pos.x;
    armyView.y = pos.y;
    armyView.data = data;
    this.addChild(armyView);
    this._armys.set(data.key, armyView);
    Logger.info("__addNpc", data);
    return armyView;
  }

  private __removeNpc() {
    this._armys.forEach((armyView) => {
      if (armyView.data instanceof GameLoadNeedData) {
        this.removeArmyView2(armyView.data);
      }
    });
  }

  public addToStage(evt: Event) {
    this.initSelfArmy();
    this.addArmys2(this._model.allBaseArmy);
  }

  protected initRegisterList() {}
  protected removeRegisterList() {}

  protected initSelfArmy() {
    let armyInfo: CampaignArmy = this._model.selfMemberData;
    if (armyInfo) {
      this._selfArmyView = this.addAmryView2(armyInfo);
    }
  }

  protected addArmys2(dic: Map<string, CampaignArmy>) {
    if (!dic) {
      return;
    }
    dic.forEach((aInfo) => {
      this.addAmryView2(aInfo);
    });
  }

  protected addAmryView2(armyInfo: CampaignArmy): ShowAvatarBattle {
    if (this._armys.get(armyInfo.key)) {
      return this._armys.get(armyInfo.key);
    }
    Logger.info("addAmryView2", armyInfo);

    let pos;
    let mapId: number = this._model.mapId;
    let arr = CampaignMapModel.getSingleBgMapPosList(1);
    if (WorldBossHelper.checkSecret(mapId)) {
      pos = arr[1];
    } else if (WorldBossHelper.checkMultiSecret(mapId)) {
      // 根据玩家在房间列表中的位置来排列
      // pos = arr[1]
    }
    let armyView = new ShowAvatarBattle(
      HeroMovieClipRefType.SINGLEBG_CAMPAIGN_SCENE,
      false,
    );
    armyView.showShadow(true);
    armyView.setSide(SideType.ATTACK_TEAM);
    armyView.x = pos.x;
    armyView.y = pos.y;
    armyView.data = armyInfo;
    this.addChild(armyView);
    this._armys.set(armyInfo.key, armyView);
    // CampaignManager.Instance.controller.addArmyView(armyView);
    return armyView;
  }

  protected removeArmyView2(armyInfo: CampaignArmy | GameLoadNeedData) {
    Logger.info("[CampaignWalkLayer]removeArmyView", armyInfo);

    let armyView = this._armys.get(armyInfo.key);
    // CampaignManager.Instance.controller.removeArmyView(armyView);
    this._armys.delete(armyInfo.key);
    ObjectUtils.disposeObject(armyView);
  }

  public get mapView() {
    return CampaignManager.Instance.mapView;
  }

  public dispose() {
    this.removeEvent();
    this._armys.forEach((element) => {
      element && ObjectUtils.disposeObject(element);
    });
    super.dispose();
  }
}
