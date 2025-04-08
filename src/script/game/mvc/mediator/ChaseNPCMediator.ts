import Logger from "../../../core/logger/Logger";
import {CampaignArmyViewHelper} from "../../map/campaign/CampaignArmyViewHelper";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import {DisplayObject} from "../../component/DisplayObject";
import {NotificationEvent} from "../../constant/event/NotificationEvent";
import {IEnterFrame} from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import {CampaignManager} from "../../manager/CampaignManager";
import {EnterFrameManager} from "../../manager/EnterFrameManager";
import {NotificationManager} from "../../manager/NotificationManager";
import {CampaignArmy} from "../../map/campaign/data/CampaignArmy";
import {NpcAvatarView} from "../../map/campaign/view/physics/NpcAvatarView";
import {NodeState} from "../../map/space/constant/NodeState";
import {CampaignNode} from "../../map/space/data/CampaignNode";
import {SearchPathHelper} from "../../utils/SearchPathHelper";

/**
 * 追击NPC
 */
export class ChaseNPCMediator implements IMediator, IEnterFrame {
    private _map: DisplayObject;
    private _mapId: number = 0;
    private _selectFlag: DisplayObject;
    private _selfArmy: CampaignArmy;
    private _selfArmyView: any;
    private _npcInfo: CampaignNode;
    private _npcView: NpcAvatarView;
    private _targetPoint: Laya.Point;
    private _count: number = 0;

    constructor() {
        this._targetPoint = new Laya.Point();
    }

    public register(target: Object) {
        this._map = <DisplayObject>target;
        this._mapId = CampaignManager.Instance.mapId;
        // this._selectFlag = ComponentFactory.Instance.creatCustomObject("asset.map.SelectTargetAsset");
        this._selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
        if (this._selfArmy) {
            this._selfArmyView = CampaignManager.Instance.controller.getArmyView(this._selfArmy);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.CHASE_NPC, this.__chaseNPCHandler, this);
    }

    public unregister(target: Object) {
        NotificationManager.Instance.removeEventListener(NotificationEvent.CHASE_NPC, this.__chaseNPCHandler, this);
        ObjectUtils.disposeObject(this._selectFlag); this._selectFlag = null;
        this._selfArmy = null;
        this._selfArmyView = null;
        this._map = null;
    }

    private __chaseNPCHandler(data: any) {
        this._npcInfo = <CampaignNode>data;
        if (this._npcInfo) {
            this._npcView = <NpcAvatarView>this._npcInfo.nodeView;
            if (this._npcView) {
                this._targetPoint.x = this._npcView.x;
                this._targetPoint.y = this._npcView.y;
            }
            this.lockWarFight();
        } else {
            this.unLockWarFight();
        }
    }

    private lockWarFight() {
        if (this._npcView) {
            this._npcView.addChildAt(this._selectFlag, 0);
        }
        this._count = 0;
        EnterFrameManager.Instance.registeEnterFrame(this);
        this._map.on(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler.bind(this));

    }
    private unLockWarFight() {
        if (this._selectFlag && this._selectFlag.parent) this._selectFlag.parent.removeChild(this._selectFlag);
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        if (this._map) this._map.off(Laya.Event.MOUSE_DOWN, this, this.__onClickHandler.bind(this));
    }

    private __onClickHandler(evt:Laya.Event)
    {
        if(evt.target == this._npcView)
        {
            var pixel:number = this._npcView.getCurrentPixels();
            //fixme by yuyuanzhan 暂时屏蔽, 像素检测有问题  先直接return
            // if(pixel > 50)
            // {
            //     return;
            // }
            return
        }

        this.unLockWarFight();
    }

    public enterFrame() {
        //没有自己形象, npc形象 节点消失
        if (!(this._selfArmyView && this._npcView && NodeState.displayState(this._npcInfo.info.state))) {
            this.unLockWarFight();
            return;
        }

        this._targetPoint.x = this._npcView.x;
        this._targetPoint.y = this._npcView.y;

        var walkOver: boolean;
        var vx: number = (this._selfArmyView.x - this._targetPoint.x);
        var vy: number = (this._selfArmyView.y - this._targetPoint.y);
        var leng: number = vx * vx + vy * vy;

        if (leng < 3200) {//正常
            this._selfArmyView.info.pathInfo = [];
            CampaignArmyViewHelper.selfArmyToEnd(this._selfArmyView.aiInfo, this._selfArmyView);
            EnterFrameManager.Instance.unRegisteEnterFrame(this);
        }
        else if (this._count % 25 == 0) { //跟随目标
            Logger.warn("[ChaseNPCMediator]NPC寻路")
            this.searchPath(this._selfArmyView.x, this._selfArmyView.y, this._targetPoint.x, this._targetPoint.y);
        }
        this._count++;
    }

    private searchPath(startX: number, startY: number, endX: number, endY: number) {
        //			var start : Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(startX,startY);
        //			if(!start)return;
        //			var end : Point = CampaignManager.Instance.mapModel.getAroundWalkPoint(endX,endY);
        //			if(!end)return;
        //			var arr :any[] = SearchPathHelper.searchPath(new Laya.Point(start.x*Tiles.WIDTH, start.y*Tiles.HEIGHT),
        //				                                          new Laya.Point(end.x*Tiles.WIDTH, end.y*Tiles.HEIGHT));
        var arr: any[] = SearchPathHelper.searchPath(new Laya.Point(startX, startY), new Laya.Point(endX, endY));
        if (!arr) return;
        if (arr.length > 2) arr.shift();

        if (this._selfArmyView) this._selfArmyView.aiInfo.pathInfo = arr;
    }
}