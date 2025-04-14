import AudioManager from "../../core/audio/AudioManager";
import LayerMgr from "../../core/layer/LayerMgr";
import Logger from "../../core/logger/Logger";
import UIManager from "../../core/ui/UIManager";
import { BattleManager } from "../battle/BattleManager";
import { BattleModel } from "../battle/BattleModel";
import { BattleView } from "../battle/BattleView";
import { BloodHelper } from "../battle/skillsys/helper/BloodHelper";
import { BattleEvent, SceneEvent } from "../constant/event/NotificationEvent";
import { SoundIds } from "../constant/SoundIds";
import { EmWindow } from "../constant/UIDefine";

import { EnterFrameManager } from "../manager/EnterFrameManager";
import { NotificationManager } from "../manager/NotificationManager";
import { BaseSceneView } from "../map/scene/BaseSceneView";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import HomeWnd from "../module/home/HomeWnd";

/**
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-12-30 17:54:22
 * @LastEditTime: 2021-01-07 20:12:04
 * @LastEditors: jeremy.xu
 * @Description: 战斗场景
 */
export default class BattleScene extends BaseSceneView {
  private _view: BattleView;
  public get view(): BattleView {
    return this._view;
  }
  private _model: BattleModel;

  constructor() {
    super();
  }

  public preLoadingStart(data: object = null): Promise<void> {
    return new Promise((resolve) => {
      NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, true);
      // SceneManager.Instance.lockScene = true;
      this.preLoadingOver();
      resolve();
    });
  }

  public enter(preScene: BaseSceneView, data: object = null): Promise<void> {
    return new Promise(async (resolve) => {
      resolve();
    });
  }

  public enterOver(): Promise<void> {
    return new Promise(async (resolve) => {
      super.enterOver();

      Logger.yyz("enter战斗场景:  :  ");

      //预加载战斗胜利的声音资源, 避免在其他界面经常会错误播放战斗胜利的背景音乐问题
      Laya.loader.load(
        SoundIds.BATTLE_RESULT_WIN,
        Laya.Handler.create(this, function () {
          Logger.log("战斗胜利资源预加载完成");
        }),
      );
      LayerMgr.Instance.clearnStageDynamic();
      LayerMgr.Instance.clearGameMenuLayer();
      BloodHelper.setup();

      BattleManager.Instance.initBattle(this);
      this._model = BattleManager.Instance.battleModel;

      this._view = new BattleView(this._model);
      this.addChild(this._view);

      UIManager.Instance.HideWind(EmWindow.SpaceTaskInfoWnd);
      if (UIManager.Instance.FindWind(EmWindow.Alert)) {
        UIManager.Instance.HideWind(EmWindow.Alert);
      }
      await HomeWnd.Instance.instHide();
      EnterFrameManager.Instance.registeEnterFrame(this);
      NotificationManager.Instance.dispatchEvent(
        BattleEvent.ENTER_BATTLE_SCENE,
      );
      resolve();
    });
  }

  resize() {
    super.resize();
    if (!this._view) return;
    this._view.resize();
  }

  public leaving(): Promise<void> {
    return new Promise((resolve) => {
      Logger.yyz(
        "leaving战斗场景:  :  ",
        SceneManager.Instance.currentType,
        SceneManager.Instance.nextScene.SceneName,
      );
      NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
      // SceneManager.Instance.lockScene = false;

      BattleManager.loginToBattleFlag = false;
      EnterFrameManager.Instance.unRegisteEnterFrame(this);
      // BattleTransactionManager.Instance.dispose();
      BattleManager.Instance.started = false;

      // ChatBar.inBattleFlag = false;
      // SkillResourceLoader.clearSkillLoader();
      // RipplePreCreater.clear();
      // ShadowEffectMaker.stopAll();
      LayerMgr.Instance.clearGameMenuLayer();
      BattleManager.Instance.disposeBattle(
        SceneManager.Instance.nextScene.SceneName ==
          SceneType.CAMPAIGN_MAP_SCENE,
      );

      resolve();
    });
  }

  public get SceneName(): string {
    return SceneType.BATTLE_SCENE;
  }

  public getUIID() {
    return SceneType.BATTLE_SCENE;
  }

  public enterFrame() {
    if (!this._view) return;
    this._view.update();
  }
}
