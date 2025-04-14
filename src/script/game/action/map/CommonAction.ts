import { IEffect } from "@/script/game/interfaces/Effect";
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { DisplayObject } from "../../component/DisplayObject";
import { CampaignEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { NodeState } from "../../map/space/constant/NodeState";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { MapPhysicsBase } from "../../map/space/view/physics/MapPhysicsBase";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";

export class CommonAction extends MapBaseAction {
  private _nodeEffct: IEffect;
  private _target: any;
  private _isPlayer: boolean = false;
  private _time: number = 0;
  private _nodeId: number = 0;
  /**
   *
   * @param $target
   * @param time
   *
   */
  constructor($target: any, $time: number = 75) {
    super();

    this._target = $target;
    this._isPlayer = false;
    this._time = $time;
    if (this._target && this._target instanceof MapPhysicsBase) {
      this._nodeId = (<MapPhysicsBase>this._target).info.info.id;
    }
  }

  public update() {
    if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
      this.actionOver();
      return;
    }
    if (this._isPlayer) {
      this._count++;
      if (this._count < this._time) return;
      if (this._target) {
        // Utils.clearflashTarget(this._target);
        this._target.visible = false;
        this._target.active = false;
      }
      this.actionOver();
      return;
    }
    if (this._target) {
      if (this._target.parent) {
        this._count = 0;
        this._target.visible = true;
        this._target.active = true;
        if (this._target.hasOwnProperty("isPlaying")) {
          this._target["isPlaying"] = true;
        }
        // Utils.flashTarget(this._target, UIFilter.yellowFilter);
        this._isPlayer = true;
      } else {
        this._count++;
        if (this._count > 50) this.actionOver();
      }
    }
  }

  public dispose() {
    if (this._nodeEffct) this._nodeEffct.stop();
    if (
      this._nodeId > 0 &&
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE
    ) {
      var mapView: CampaignMapView = CampaignManager.Instance.mapView;
      var nodeView: DisplayObject;
      if (mapView) nodeView = mapView.getNpcNodeById(this._nodeId);
      if (nodeView) {
        nodeView.visible = false;
      }
    }
    var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
    if (mapModel) {
      var nodeInfo: CampaignNode = mapModel.getMapNodesById(this._nodeId);
      if (nodeInfo && nodeInfo.info) {
        nodeInfo.info.state = NodeState.DESTROYED;
      }
    }
    this._target = null;
    super.dispose();
  }

  actionOver() {
    super.actionOver();
    Laya.timer.once(2000, this, this.updateStatus);
  }

  private updateStatus() {
    if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
      this.playerModel.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED);
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }
}
