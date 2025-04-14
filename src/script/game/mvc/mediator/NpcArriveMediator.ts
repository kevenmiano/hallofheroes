import { NpcEffectiveState } from "../../constant/NpcEffectiveState";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { MapSocketOuterManager } from "../../manager/MapSocketOuterManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignNpcView } from "../../map/campaign/view/physics/CampaignNpcView";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { NodeState } from "../../map/space/constant/NodeState";
import { PosType } from "../../map/space/constant/PosType";
import { CampaignNode } from "../../map/space/data/CampaignNode";

/**
 * 当有npc靠近注册目标时 则npc消失
 * 注册目标一般为PosType.TOWER_DEFENCE
 * 每一帧都去查找周围是否有节点靠近
 */
export class NpcArriveMediator implements IMediator, IEnterFrame {
  private _npc: CampaignNpcView;
  private _count: number = 0;
  private _npcPoint: Laya.Point = new Laya.Point();
  private _targetPoint: Laya.Point = new Laya.Point();

  constructor() {}

  private _errorCount: number = 0;
  public enterFrame() {
    this._count++;
    if (!this._npc || this._count % 30 != 0) return;
    this._npcPoint.x = this._npc.x;
    this._npcPoint.y = this._npc.y;
    var nList: any[] = CampaignManager.Instance.mapModel.mapNodesData;
    if (!nList) return;
    for (const key in nList) {
      if (nList.hasOwnProperty(key)) {
        let nInfo: CampaignNode = nList[key];
        if (
          (nInfo.info.types != PosType.COPY_NPC &&
            nInfo.info.types != PosType.BOMBER_MAN) ||
          nInfo.info.state != NodeState.EXIST
        )
          continue;
        this._targetPoint.x = nInfo.nodeView.x;
        this._targetPoint.y = nInfo.nodeView.y;
        if (
          this._npcPoint.distance(this._targetPoint.x, this._targetPoint.y) <
          NpcEffectiveState.TOWER_RADIUS
        ) {
          (<NpcAvatarView>nInfo.nodeView).aiInfo.pathInfo = [];
          if (
            isNaN(nInfo.createTime) ||
            PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond -
              nInfo.createTime / 1000 >
              30
          ) {
            //怪物出生起码30秒后才能走到祭坛
            nInfo.nodeView.x = Number(nInfo.param3) * 20; //把怪重置到某个隐藏位置, 以减少向服务器发送的次数
            nInfo.nodeView.y = Number(nInfo.param4) * 20;
            MapSocketOuterManager.sendNpcArrive(nInfo.nodeId, nInfo.uid);
          } else {
            if (this._errorCount < 1) {
              var time: number =
                PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond -
                nInfo.createTime / 1000;
              this._errorCount++;
            }
          }
        }
      }
    }
  }

  public register(target: object) {
    this._npc = <CampaignNpcView>target;
    if (
      this._npc &&
      this._npc.info &&
      this._npc.info.info.types == PosType.TOWER_DEFENCE
    ) {
      EnterFrameManager.Instance.registeEnterFrame(this);
    }
  }

  public unregister(target: object) {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    this._npc = null;
  }
}
