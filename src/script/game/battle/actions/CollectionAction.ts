import AudioManager from "../../../core/audio/AudioManager";
import LayerMgr from "../../../core/layer/LayerMgr";
import Logger from "../../../core/logger/Logger";
import { EmLayer } from "../../../core/ui/ViewInterface";
import { t_s_rewardcondictionData } from "../../config/t_s_rewardcondiction";
import {
  ClollectActionEvent,
  NotificationEvent,
} from "../../constant/event/NotificationEvent";
import { SoundIds } from "../../constant/SoundIds";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import KeyBoardRegister from "../../keyboard/KeyBoardRegister";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { GameBaseQueueManager } from "../../manager/GameBaseQueueManager";
import { NotificationManager } from "../../manager/NotificationManager";
import OfferRewardManager from "../../manager/OfferRewardManager";
import RingTaskManager from "../../manager/RingTaskManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TaskManage } from "../../manager/TaskManage";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { PosType } from "../../map/space/constant/PosType";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceManager from "../../map/space/SpaceManager";
import BaseOfferReward from "../../module/offerReward/BaseOfferReward";
import { RingTask } from "../../module/ringtask/RingTask";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import FUIHelper from "../../utils/FUIHelper";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { BattleManager } from "../BattleManager";
import { MapBaseAction } from "./MapBaseAction";
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
import { SpaceSocketOutManager } from "../../map/space/SpaceSocketOutManager";

/**
 * @author:pzlricky
 * @data: 2021-06-21 10:49
 * @description 采集
 * 在收到服务器响应后创建CollectionAction
 * 在采集副本会连续创建CollectionAction直到任务完成
 * 在战场只会执行一次
 */
export default class CollectionAction extends MapBaseAction {
  public static LEAVE: number = 2;
  public static ValidHitDis: number = 30;

  private _nodeId: number = 0;
  private _target: any;
  private _inSpace: boolean = false;
  private _simMc: fgui.GComponent;
  private _sound: string = "";
  private _sendTimeId: number = 0;

  constructor($target, $nodeId: number) {
    super();
    this._target = $target;
    this._nodeId = $nodeId;
    this._inSpace = false;
    NotificationManager.Instance.addEventListener(
      ClollectActionEvent.CANCEL_CLOLLECT,
      this.__cancellCollect,
      this,
    );
    if (CampaignManager.Instance.mapModel) {
      this._mapId = CampaignManager.Instance.mapModel.mapId;
      let node: CampaignNode =
        CampaignManager.Instance.mapModel.getMapNodesById(this._nodeId);
      if (node) {
        CampaignManager.Instance.mapModel.onCollectionId = node.nodeId;
        if (
          node.sonType == 2352 ||
          node.sonType == 2393 ||
          node.sonType == 2394 ||
          node.sonType == 2395
        ) {
          //木材和公会秘境中的采集物件
          this._sound = SoundIds.COLLECTION_TIMBER; //木材
        } else if (node.sonType == 2351 || node.sonType == 2380) {
          this._sound = SoundIds.COLLECTION_AMETHYST; //紫晶
        } else if (node.sonType == 2350) {
          this._sound = SoundIds.COLLECTION_COPER; //黄铜
        } else if (WorldBossHelper.checkGvg(this._mapId)) {
          this._sound = SoundIds.COLLECTION_TIMBER;
        } else if (WorldBossHelper.checkPetLand(this._mapId)) {
          this._sound = SoundIds.COLLECTION_TIMBER;
        }
      }
    } else {
      //是在天空之城中
      this._inSpace = true;
      let spaceNode: SpaceNode = SpaceManager.Instance.model.getMapNodeById(
        this._nodeId,
      );
      if (spaceNode) {
        SpaceManager.Instance.model.onCollectionId = spaceNode.nodeId;
        if (spaceNode.sonType == 9005) {
          //天空之城采集蔷薇
          this._sound = SoundIds.COLLECTION_TIMBER; //木材
        }
      }
    }
  }

  private removeMc() {
    if (this._simMc && !this._simMc.isDisposed) {
      LayerMgr.Instance.removeByLayer(
        this._simMc.displayObject,
        EmLayer.GAME_BOTTOM_LAYER,
      );
      this._simMc = null;
    }
  }

  getTimer(): number {
    return new Date().getTime();
  }

  update() {
    if (this._count % 25 == 0) {
      if (this._sound) {
        AudioManager.Instance.playSound(this._sound);
      }
    }
    if (!this._inSpace) {
      if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
        this.actionOver();
        return;
      }
    }

    if (this._count == 1) {
      let collectAssets: fairygui.GComponent = FUIHelper.createFUIInstance(
        EmPackName.Space,
        "CollectionAsset",
      );
      if (!collectAssets) {
        return;
      }
      this._simMc = collectAssets;
      let movie: fgui.Transition = collectAssets.getTransition("aniMovie");
      let stateMc: fgui.Controller = collectAssets.getController("cState");
      this.bar = collectAssets.getChild("n4").asImage;
      if (movie) {
        KeyBoardRegister.Instance.keyEnable = false;
        // let delay: number = movie.frame * 33;
        let speed: number = 1;
        let node: CampaignNode;
        if (!this._inSpace) {
          node = CampaignManager.Instance.mapModel.getMapNodesById(
            this._nodeId,
          );
        }
        stateMc.selectedIndex = 1 - 1;
        if (WorldBossHelper.checkPvp(this._mapId)) {
          // delay = 1000;
          speed = 10;
        } else if (WorldBossHelper.checkGvg(this._mapId)) {
          stateMc.selectedIndex = 3 - 1; //占领中
        } else if (WorldBossHelper.checkPetLand(this._mapId)) {
          if (node.resource == 2) {
            stateMc.selectedIndex = 1 - 1;
          } else {
            stateMc.selectedIndex = 6 - 1;
          }

          this.lockNode();
        }
        // this._sendTimeId = setInterval(this.sendCollection.bind(this), delay);
        LayerMgr.Instance.addToLayer(
          this._simMc.displayObject,
          EmLayer.GAME_BOTTOM_LAYER,
        );
        // movie.setPlaySettings(0, -1, 1, -1, Laya.Handler.create(this, this.playerOverCall));
        this.bar.fillAmount = 0;
        movie.play(Laya.Handler.create(this, this.playerOverCall), 1);
        Laya.Tween.to(this.bar, { fillAmount: 1 }, 4750 / speed);
        // movie.playing = true;
        movie.timeScale = speed;
        // if (WorldBossHelper.checkPvp(this._mapId) || WorldBossHelper.checkConsortiaBoss(this._mapId)) {
        //     movie.frame = 64;
        // }
        this.__stageResizeHandler();

        // TODO 一个状态动画
        // this._nodeEff = FUIHelper.createFUIInstance(EmPackName.Space, "asset.core.CollectionNodeEffectAsset");
        // if (this._target instanceof Laya.Sprite) {
        //     (this._target as Laya.Sprite).addChild(this._nodeEff.displayObject);
        // } else {
        //     if (this._target.hasOwnProperty("nameView")) {
        //         this._target.nameView.addChildAt(this._nodeEff, 0);
        //     }
        // }

        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.__onMouseDown);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.__onMouseUp);
        NotificationManager.Instance.addEventListener(
          NotificationEvent.LOCK_PVP_WARFIGHT,
          this.__fightHandler,
          this,
        );
      } else {
        this.actionOver();
      }
    }

    this._count++;
  }

  private mouseDownPt: Laya.Point = new Laya.Point();
  private __onMouseDown(evt: Laya.Event) {
    this.mouseDownPt.x = evt.stageX;
    this.mouseDownPt.y = evt.stageY;
  }

  private __onMouseMove(evt: Laya.Event) {}

  private __onMouseUp(evt: Laya.Event) {
    let dis = this.mouseDownPt.distance(evt.stageX, evt.stageY);
    if (dis <= CollectionAction.ValidHitDis) {
      this.__onClickHandler(evt);
    }
  }

  protected __fightHandler(evt) {
    this.actionOver();
  }

  private __cancellCollect() {
    this.actionOver();
  }

  private lockNode() {
    NotificationManager.Instance.sendNotification(
      NotificationEvent.LOCK_NODE,
      this._nodeId,
    );
  }

  private unLockNode() {
    NotificationManager.Instance.sendNotification(
      NotificationEvent.UN_LOCK_NODE,
      this._nodeId,
    );
  }

  /**
   * 监听到点击事件 取消采集
   * @param evt
   *
   */
  private __onClickHandler(evt: Laya.Event) {
    let flag: boolean = false;

    //判断点击对象是否为木材或者其他
    if (!this._target || this._target instanceof Laya.Sprite) {
      if (evt.target == this._target) {
        if (evt.target.hasOwnProperty("getCurrentPixels")) {
          let pixel: number = evt.target["getCurrentPixels"]();
          if (pixel < 50) {
            flag = true;
          }
        }
      } else {
        let map: object;
        if (this._inSpace) {
          map = SpaceManager.Instance.mapView;
        } else {
          map = CampaignManager.Instance.mapView;
        }

        let t: Laya.Sprite = evt.target;
        while (t) {
          // TODO 不知其具体视图
          // if (t == map || t == FrameControllerManager.instance.spaceController.frame) {
          if (t == map) {
            flag = true;
            break;
          } else {
            t = t.parent as Laya.Sprite;
          }
        }
      }
    }

    if (flag) {
      if (this._simMc) {
        this._isCancel = true;
        if (WorldBossHelper.checkPetLand(this._mapId)) {
          this.unLockNode();
        }

        LayerMgr.Instance.removeByLayer(
          this._simMc.displayObject,
          EmLayer.GAME_BOTTOM_LAYER,
        );
        this._simMc = null;
        this.actionOver();
      }
    }
  }

  private __stageResizeHandler(evt: Event = null) {
    if (this._simMc) {
      this._simMc.x = (StageReferance.stageWidth - this._simMc.width) / 2;
      this._simMc.y = StageReferance.stageHeight - 200;
    }
  }

  /**
   * 向服务器发送采集命令
   */
  private sendCollection() {
    // if (this._sendTimeId == 0) return;
    if (!this._inSpace) {
      let mapModel = CampaignManager.Instance.mapModel;
      if (!mapModel) {
        return;
      }
      if (this._sendTimeId > 0) {
        clearInterval(this._sendTimeId);
      }
      this._sendTimeId = 0;
      if (BattleManager.Instance.started) {
        Logger.error("CollectionAction.sendCollection 已处于战斗中");
        return;
      }
      let node: CampaignNode = mapModel.getMapNodesById(this._nodeId);
      if (!node) {
        Logger.error(
          "CollectionAction.sendCollection 找不到该节点",
          this._nodeId,
        );
        return;
      }
      let mapId: number = mapModel.mapId;
      SocketSendManager.Instance.sendSessionOverToBattle(
        mapId,
        node.nodeId,
        CollectionAction.LEAVE,
      );
    } else {
      let mapModel = SpaceManager.Instance.model;
      if (!mapModel) {
        return;
      }
      if (this._sendTimeId > 0) {
        clearInterval(this._sendTimeId);
      }
      this._sendTimeId = 0;
      let spaceNode: SpaceNode = mapModel.getMapNodeById(this._nodeId);
      if (!spaceNode) {
        return;
      }
      if (SpaceNodeType.isYearNode(spaceNode.info.types)) {
        SpaceSocketOutManager.Instance.sendYearBoxCollectConfirm(this._nodeId);
      } else {
        SocketSendManager.Instance.sendSpaceCollectOver(spaceNode);
      }
    }
  }

  private _isCancel: boolean = false;
  private bar: fgui.GImage;
  /**
   * 采集动画播放完成
   *
   */
  private playerOverCall() {
    Laya.Tween.clearAll(this.bar);
    KeyBoardRegister.Instance.keyEnable = true;
    Laya.stage.off(Laya.Event.RESIZE, this, this.__stageResizeHandler);
    Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.__onMouseDown);
    Laya.stage.off(Laya.Event.MOUSE_UP, this, this.__onMouseUp);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.LOCK_PVP_WARFIGHT,
      this.__fightHandler,
      this,
    );

    this.removeMc();
    if (!this._isCancel) {
      this.sendCollection();
      if (
        (WorldBossHelper.checkCrystal(this._mapId) && this.checkCollectAgain) ||
        (WorldBossHelper.checkMineral(this._mapId) &&
          this.mineralPick < 4 &&
          this.mineralCarNotFull) ||
        this.getFlag()
      ) {
        GameBaseQueueManager.Instance.addAction(
          new CollectionAction(this._target, this._nodeId),
          true,
        );
      }
      this.actionOver();
    } else {
      if (this._sendTimeId > 0) {
        clearInterval(this._sendTimeId);
      }
      this._sendTimeId = 0;
    }
  }

  private getFlag(): boolean {
    let ringtask: RingTask = RingTaskManager.Instance.getRingTask();
    if (!ringtask) {
      return false;
    }
    let condition: t_s_rewardcondictionData = ringtask
      .conditionList[0] as t_s_rewardcondictionData;
    if (condition.CondictionType != 4) {
      //不是采集
      return false;
    }
    if (WorldBossHelper.checkMineral(this._mapId)) {
      //在紫晶矿场中
      return false;
    }
    if (ringtask.isCompleted) {
      return false;
    }
    if (WorldBossHelper.checkPetLand(this._mapId)) {
      let node: CampaignNode =
        CampaignManager.Instance.mapModel.getMapNodesById(this._nodeId);
      if (
        !node ||
        (node && node.info.types == PosType.COLLECTION && node.resource != 2)
      ) {
        return false;
      }
    }
    return true;
  }

  /**
   * 检测是否要继续创建采集动画
   * @return
   *
   */
  private get checkCollectAgain(): boolean {
    let node: CampaignNode = CampaignManager.Instance.mapModel.getMapNodesById(
      this._nodeId,
    );
    if (node) {
      let taskIdList: Array<string> = node.param3.split(",");
      let acceptedList = TaskManage.Instance.cate.acceptedList;
      for (const key in acceptedList) {
        if (Object.prototype.hasOwnProperty.call(acceptedList, key)) {
          let task = acceptedList[key];
          if (
            taskIdList.indexOf(task.TemplateId.toString()) > -1 &&
            !task.isCompleted
          ) {
            return true;
          }
        }
      }
      taskIdList = node.param4.split(",");
      let baseRewardDic = OfferRewardManager.Instance.model.baseRewardDic;
      for (const key in baseRewardDic) {
        if (Object.prototype.hasOwnProperty.call(baseRewardDic, key)) {
          let reward: BaseOfferReward = baseRewardDic[key];
          if (reward && reward.rewardTemp) {
            if (
              taskIdList.indexOf(reward.rewardTemp.TemplateId.toString()) >
                -1 &&
              !reward.isCompleted
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  private get mineralPick(): number {
    return CampaignManager.Instance.mineralModel.selfCarInfo.pick_count;
  }

  private get mineralCarNotFull(): boolean {
    return CampaignManager.Instance.mineralModel.selfCarInfo.minerals < 200;
  }

  private get selfarmy(): BaseArmy {
    return ArmyManager.Instance.army;
  }

  prepare() {}

  dispose() {
    this._isCancel = true;
    this.removeMc();
    NotificationManager.Instance.removeEventListener(
      ClollectActionEvent.CANCEL_CLOLLECT,
      this.__cancellCollect,
      this,
    );
    if (CampaignManager.Instance.mapModel) {
      CampaignManager.Instance.mapModel.onCollectionId = 0;
    }
    if (SpaceManager.Instance.model) {
      SpaceManager.Instance.model.onCollectionId = 0;
    }
  }
}
