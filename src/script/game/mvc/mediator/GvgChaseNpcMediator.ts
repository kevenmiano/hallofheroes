import {NotificationEvent} from "../../constant/event/NotificationEvent";
import {IEnterFrame} from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import {CampaignManager} from "../../manager/CampaignManager";
import {EnterFrameManager} from "../../manager/EnterFrameManager";
import {NotificationManager} from "../../manager/NotificationManager";
import {BaseArmyAiInfo} from "../../map/ai/BaseArmyAiInfo";
import {CampaignArmy} from "../../map/campaign/data/CampaignArmy";
import {CampaignArmyView} from "../../map/campaign/view/physics/CampaignArmyView";
import {NpcAvatarView} from "../../map/campaign/view/physics/NpcAvatarView";
import {NodeState} from "../../map/space/constant/NodeState";
import {CampaignNode} from "../../map/space/data/CampaignNode";
import {SearchPathHelper} from "../../utils/SearchPathHelper";

/**
 *
 * 锁定玩家并追击, 靠近后进入战斗, 如果玩家下线则跑到玩家位置不动<br/>
 * 再点击一次其他地方解除锁定
 *
 */
export class GvgChaseNpcMediator implements IMediator, IEnterFrame
{
    private _selfInfo:CampaignArmy;
    private _targetInfo:CampaignNode;
    private _targetPoint:Laya.Point = new Laya.Point();
    private _container:Laya.Sprite;
    private _count:number;

    // private _selectFlag : MovieClip;
    constructor()
    {
    }

    public register(target:Object):void
    {
        this._container = target as Laya.Sprite;
        // this._selectFlag = ComponentFactory.Instance.creatCustomObject("asset.map.SelectTargetAsset");
        this._selfInfo = CampaignManager.Instance.mapModel.selfMemberData;
        NotificationManager.Instance.addEventListener(NotificationEvent.LOCK_PVP_WARFIGHT, this.__lockPvpWarFightHandler, this);
    }

    public unregister(target:Object):void
    {
        this.unLockWarFight();
        NotificationManager.Instance.removeEventListener(NotificationEvent.LOCK_PVP_WARFIGHT, this.__lockPvpWarFightHandler, this);
        this._container = null;
        this._targetPoint = null;
        this._selfInfo = null;
        this._targetInfo = null;
        // if(this._selectFlag && this._selectFlag.parent)this._selectFlag.parent.removeChild(this._selectFlag);this._selectFlag = null;
    }

    private __lockPvpWarFightHandler(data:any):void
    {
        if(data instanceof CampaignArmy)
        {
            return;
        }
        this._targetInfo = data as CampaignNode;
        if(this._targetInfo)
        {
            this.lockWarFight();
            this._targetPoint.x = this._targetInfo.nodeView.x;
            this._targetPoint.y = this._targetInfo.nodeView.y;
        }
        else
        {
            this.unLockWarFight();
        }
    }

    private lockWarFight():void
    {
        // (this._targetInfo.nodeView as NpcAvatarView).avatarView.addChildAt(this._selectFlag, 0);
        EnterFrameManager.Instance.registeEnterFrame(this);
        this._container.on(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);

    }

    private unLockWarFight():void
    {
        // if(this._selectFlag && this._selectFlag.parent)
        // {
        //     this._selectFlag.parent.removeChild(this._selectFlag);
        // }
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        if(this._container)
        {
            this._container.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler);
        }
    }

    private __onClickHandler(evt:Laya.Event):void
    {
        if(this._targetInfo && evt.target == this._targetInfo.nodeView)
        {
            return;
        }
        this._targetInfo = null;
        this.unLockWarFight();
    }

    public enterFrame():void
    {
        if(!this._selfInfo)
        {
            this.unLockWarFight();
            return;
        }
        if(this._targetInfo && this._targetInfo.nodeView)
        {
            if(this._targetInfo.info.state == NodeState.EXIST)
            {
                this._targetPoint.x = this._targetInfo.nodeView.x;
                this._targetPoint.y = this._targetInfo.nodeView.y;
            }
            let armyView:CampaignArmyView = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
            let vx:number = (armyView.x - this._targetPoint.x);
            let vy:number = (armyView.y - this._targetPoint.y);
            let leng:number = vx * vx + vy * vy;
            let cInfo:BaseArmyAiInfo = (<CampaignArmyView>armyView).aiInfo;
            let walkOver:boolean;
            if(cInfo && cInfo.pathInfo)
            {
                walkOver = (cInfo.walkIndex == cInfo.pathInfo.length);
            }
            let array:any[] = (<CampaignArmyView>armyView).aiInfo.pathInfo
            if(leng < 10000 && this._targetInfo.info.state == NodeState.EXIST)
            {
                CampaignManager.Instance.controller.sendCampaignArrive(this._selfInfo.id, this._targetInfo.nodeId);
                this.unLockWarFight();
            }
            else if(this._targetInfo.info.state != NodeState.EXIST)
            {
                this.unLockWarFight();
            }
            else if(this._count % 70 == 0 || walkOver)
            {
                this.searchPath(armyView.x, armyView.y, this._targetPoint.x, this._targetPoint.y);
            }
            this._count++;
        }
        else
        {
            this.unLockWarFight();
        }
    }

    private searchPath(startX:number, startY:number, endX:number, endY:number):void
    {
        let start:Laya.Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(startX, startY);
        if(!start)
        {
            return;
        }
        let end:Laya.Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(endX, endY);
        if(!end)
        {
            return;
        }
        let arr:any[] = SearchPathHelper.searchPath(new Laya.Point(start.x * 20, start.y * 20), new Laya.Point(end.x * 20, end.y * 20));
        if(!arr)
        {
            return;
        }
        let armyView:CampaignArmyView = CampaignManager.Instance.controller.getArmyView(this._selfInfo);
        armyView.aiInfo.pathInfo = arr;
    }
}