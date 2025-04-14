import { MovieClip } from "../../component/MovieClip";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { PhysicsEvent } from "../../constant/event/NotificationEvent";

/**
 * npc进入战斗的瞬间播放一个动画
 *
 *
 */
export class NpcEnterFightMediator implements IMediator {
  private _npc: NpcAvatarView;
  private _attackView: MovieClip;
  constructor() {}

  public register(target: object) {
    this._npc = <NpcAvatarView>target;
    if (this._npc && this._npc.nodeInfo && this._npc.nodeInfo.info)
      this._npc.nodeInfo.info.addEventListener(
        PhysicsEvent.UP_STATE,
        this.__updateNodeStateHandler,
        this,
      );
  }

  public unregister(target: object) {
    if (this._npc && this._npc.nodeInfo && this._npc.nodeInfo.info)
      this._npc.nodeInfo.info.removeEventListener(
        PhysicsEvent.UP_STATE,
        this.__updateNodeStateHandler,
        this,
      );
  }
  private __updateNodeStateHandler(evt: PhysicsEvent) {
    // if(!this._attackView)this._attackView = ComponentFactory.Instance.creatCustomObject("asset.campaign.attack.AttackMovieAsset");
    // var sim : SimpleMovie = new SimpleMovie(this._attackView,this.__call);
    // this._npc.addChild(sim);
    // this._attackView.y = -100;
  }

  private __call() {
    if (this._attackView) {
      if (this._attackView.parent)
        this._attackView.parent.removeChild(this._attackView);
      this._attackView.stop();
    }
    this._attackView = null;
  }
}
