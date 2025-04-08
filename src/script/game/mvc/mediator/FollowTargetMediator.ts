import { AiEvents, ObjectsEvent } from "../../constant/event/NotificationEvent";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { AiStateType } from "../../map/space/constant/AiStateType";
import Tiles from "../../map/space/constant/Tiles";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { HeroAvatarViewHelper } from "../../utils/HeroAvatarViewHelper";


/**
 *  
 * npc跟随
 * 
 */
export class FollowTargetMediator implements IMediator {
    /** 跟随的npc */
    private _curNpc: NpcAvatarView;
    /** 被跟随的军队 */
    private _followTarge: any;
    private _minIndex: number = 0;
    private _curPath: any[];
    private static initMinIndex: number = 100000;

    constructor() {
    }

    public register(target: Object) {
        var mapView: CampaignMapView = CampaignManager.Instance.mapView;
        if (!mapView || !mapView.walkLayer) return;
        this._curNpc = <NpcAvatarView>target;
        if (!this._curNpc) return;
        this._minIndex = FollowTargetMediator.initMinIndex;
        var targetId: number = (<CampaignNode>this._curNpc.nodeInfo).followTarget;
        var serviceName: string = (<CampaignNode>this._curNpc.nodeInfo).followTargetServiceName;
        var cArmy: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByArmyId(targetId, serviceName);
        var armyView: CampaignArmy = CampaignManager.Instance.controller.getArmyView(cArmy);
        if (cArmy) this._followTarge = armyView;
        if (!this._followTarge || !this._followTarge.aiInfo) return;
        this._followTarge.aiInfo.addEventListener(AiEvents.UPDATE_PATHS, this.__followTargerHandler, this);
        this._followTarge.aiInfo.addEventListener(AiEvents.NEXT_POINT, this.__nextPointHandler, this);
        this._followTarge.addEventListener(ObjectsEvent.WALK_OVER, this.__targetWalkOverHandler, this);
        this._curNpc.on(ObjectsEvent.WALK_OVER, this, this.__walkOverHandler.bind(this));
        this.setNpcAngle(false);
        if (this._followTarge.aiInfo.pathInfo) {
            this._curPath = this._followTarge.aiInfo.pathInfo;
            this._minIndex = this.getRecentIndex(this._curPath);
        }
    }

    public unregister(target: Object) {
        if (this._followTarge) {
            if (this._followTarge.aiInfo) {
                this._followTarge.aiInfo.removeEventListener(AiEvents.UPDATE_PATHS, this.__followTargerHandler, this);
                this._followTarge.aiInfo.removeEventListener(AiEvents.NEXT_POINT, this.__nextPointHandler, this);
            }
            this._followTarge.removeEventListener(ObjectsEvent.WALK_OVER, this.__targetWalkOverHandler, this);
        }
        this._curNpc.off(ObjectsEvent.WALK_OVER, this, this.__walkOverHandler.bind(this));
    }

    /**
     * 军队改变路线 需要重新设置npc路径
     * @param evt
     * 
     */
    private __followTargerHandler(data: any) {
        this._curPath = data;
        if (!this._curPath) return;
        this._minIndex = this.getRecentIndex(this._curPath);
    }

    /**
     * 在军队的路径中找到与npc最近的一个点 
     * @param arr 路径
     * @return 最近点的索引
     * 
     */
    private getRecentIndex(arr: any[]): number {
        var cur: Laya.Point = new Laya.Point(parseInt((this._curNpc.x / 20).toString()), parseInt((this._curNpc.y / 20).toString()));
        var min: number = FollowTargetMediator.initMinIndex;
        var index: number = 0;
        for (var i: number = 0; i < arr.length; i++) {
            var temp: Laya.Point = arr[i];
            var curLeng: number = temp.distance(cur.x, cur.y);
            if (curLeng < min) {
                min = curLeng;
                index = i;
            }
        }
        return index;
    }

    /**
     * 军队每行走一格时的逻辑 , 当两者距离>20开始跟随
     * @param evt
     * 
     */
    private __nextPointHandler(data: any) {
        var index: number = data;
        if (index > this._minIndex && this._curPath) {
            var cur: Laya.Point = new Laya.Point(this._curNpc.x, this._curNpc.y);
            var tPoint: Laya.Point = new Laya.Point(this._followTarge.x, this._followTarge.y);
            if (tPoint.distance(cur.x, cur.y) < 20) {
                this.setNpcAngle();
                return;
            }

            var arr: any[] = [];
            for (var i: number = this._minIndex; i < this._curPath.length; i++) {
                arr.push(new Laya.Point(this._curPath[i].x, this._curPath[i].y));
            }
            if (arr.length > 0) {
                var end: Laya.Point = new Laya.Point(arr[0].x, arr[0].y);
                var temp: any[] = CampaignManager.Instance.controller.searchPath(new Laya.Point(parseInt((cur.x / Tiles.WIDTH).toString()), parseInt((cur.y / Tiles.HEIGHT).toString())), end);
                if (!temp) temp = [];
                temp = temp.concat(arr);
                if (!temp || temp.length < 1) return;
                this._curNpc.aiInfo.pathInfo = temp;
                this._curNpc.aiInfo.moveState = AiStateType.NPC_FOLLOW_STATE;
            }
            this._minIndex = FollowTargetMediator.initMinIndex;
        }
        else {
            if (this._minIndex != FollowTargetMediator.initMinIndex && this._curPath) {
                this.setNpcAngle();
            }
        }
    }

    /**
     * 军队停止 
     * @param evt
     * 
     */
    private __targetWalkOverHandler(evt: ObjectsEvent) {
        if (!this._followTarge || !this._curNpc) return;
        var tPoint: Laya.Point = new Laya.Point(parseInt((this._followTarge.x / 20).toString()), parseInt((this._followTarge.y / 20).toString()));
        var path: any[] = this._curNpc.aiInfo.pathInfo.concat();
        var max: number = path.length - 1;
        for (var i: number = max; i > 0; i--) {
            if (i < this._curNpc.aiInfo.walkIndex) { path.splice(i, 1); continue; };
            var cur: Laya.Point = path[i];
            var pre: Laya.Point = path[i - 1];
            if (!cur || !pre) continue;
            var leng: number = tPoint.distance(cur.x, cur.y);
            if (leng > tPoint.distance(pre.x, pre.y)) { path.pop(); continue; };
            if (leng < 2) { path.pop(); continue; };

        }
        this._curNpc.aiInfo.pathInfo = path;
    }
    /**
     * npc停下的逻辑 
     * @param evt
     * 
     */
    private __walkOverHandler(evt: ObjectsEvent) {
        this.setNpcAngle();
    }


    /**
     * 设置npc朝向 
     * @param stop 是否使其停止
     * 
     */
    private setNpcAngle(stop: boolean = true) {
        if (!this._followTarge || !this._curNpc) return;
        if (stop) this._curNpc.aiInfo.pathInfo = [];
        var angle: number = HeroAvatarViewHelper.twoPointAngle(this._followTarge.x, this._followTarge.y, this._curNpc.x, this._curNpc.y);
        if(this._curNpc && this._curNpc.avatarView){
            this._curNpc.avatarView.angle = angle;
        }
    }
}