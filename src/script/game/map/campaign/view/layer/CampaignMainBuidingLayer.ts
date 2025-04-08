import LangManager from '../../../../../core/lang/LangManager';
import { CampaignArmyViewHelper } from '../../CampaignArmyViewHelper';
import { OuterCityEvent, RewardEvent, RingTaskEvent, TaskEvent } from '../../../../constant/event/NotificationEvent';
import { CampaignManager } from '../../../../manager/CampaignManager';
import MediatorMananger from '../../../../manager/MediatorMananger';
import { CampaignMapModel } from '../../../../mvc/model/CampaignMapModel';
import { MultipleDictionaryInfo } from '../../../../utils/MultipleDictionaryInfo';
import { WorldBossHelper } from '../../../../utils/WorldBossHelper';
import SimpleBuildingFilter from "../../../castle/filter/SimpleBuildingFilter";
import NodeResourceType from '../../../space/constant/NodeResourceType';
import { NodeState } from "../../../space/constant/NodeState";
import { PosType } from "../../../space/constant/PosType";
import Tiles from "../../../space/constant/Tiles";
import { CampaignNode } from "../../../space/data/CampaignNode";
import { PhysicInfo } from "../../../space/data/PhysicInfo";
import { MapPhysicsBase } from "../../../space/view/physics/MapPhysicsBase";
import { PhysicsStaticView } from "../../../space/view/physics/PhysicsStaticView";
import { PhysicsChestView } from '../../data/PhysicsChestView';
import { CampaignNpcPhysics } from "../physics/CampaignNpcPhysics";
import OfferRewardManager from '../../../../manager/OfferRewardManager';
import RingTaskManager from '../../../../manager/RingTaskManager';
import { TaskManage } from '../../../../manager/TaskManage';
import { CampaignResManager } from '../../../../managerRes/CampaignResManager';
import ResMgr from '../../../../../core/res/ResMgr';
import { MonopolyManager } from '../../../../manager/MonopolyManager';
import { MonopolyNodeInfo } from '../../../../module/monopoly/model/MonopolyNodeInfo';
import { MonopolyEventView } from '../../../space/view/physics/MonopolyEventView';

/**
 * 建筑层 主要监听OuterCityEvent.CURRENT_CONFIG_CHANGE事件进行动态渲染
 * 
 * 
 */
export class CampaignMainBuidingLayer extends Laya.Sprite {
	private _items: Map<string, MapPhysicsBase>;
	private _buttomLayer: Laya.Sprite;
	private _centerLayer: Laya.Sprite;
	private _topLayer: Laya.Sprite;
	private _mediatorKey: string;

	private _filter: SimpleBuildingFilter = new SimpleBuildingFilter();
	public static NAME: string = "map.campaign.view.layer.CampaignMainBuidingLayer";
	private _model: CampaignMapModel;
	constructor() {
		super();
		this._model = CampaignManager.Instance.mapModel;
		this._buttomLayer = new Laya.Sprite();
		this._centerLayer = new Laya.Sprite();
		this._topLayer = new Laya.Sprite();
		this.addChild(this._buttomLayer);
		this.addChild(this._centerLayer);
		this.addChild(this._topLayer);
		this.mouseEnabled = true;
		this._centerLayer.mouseEnabled = true;
		this._items = new Map();
		this.init();
		this.addDataEvent();
	}

	private get inMonopoly():boolean
	{
		return WorldBossHelper.checkMonopoly(CampaignManager.Instance.mapId);
	}

	private init() {
		if (this.mapView && !this.mapView.stepRender) {
			if(this.inMonopoly && MonopolyManager.Instance.model && this._model.mapNodesData){
				this.initMonopolyNodes(this._model.mapNodesData);
			}else{
				this.addNpcs(this._model.mapNodesData);
			}
        }
	}

	private initMonopolyNodes(arr:any){
		if(arr){

			arr.sort(this.sortFun);
			let nodeInfos:Array<MonopolyNodeInfo> = MonopolyManager.Instance.model.nodeInfos;
			let campaignNode:CampaignNode;
			let nodeInfo:MonopolyNodeInfo;
			let nodeCount:number = arr.length;
			let ima : MapPhysicsBase;
			for(let i:number = 0; i < nodeCount; i++) 
			{
				nodeInfo = nodeInfos[i] as MonopolyNodeInfo;
				campaignNode = arr[i] as CampaignNode;
				if(i==0){
					campaignNode.info.state = NodeState.EXIST;//起点不显示的特殊处理
				}
				if(nodeInfo && campaignNode)
				{
					ima = this._items[campaignNode.info.id] as MapPhysicsBase;
					if(!ima)ima = new MonopolyEventView(nodeInfo);
					ima.x = campaignNode.fixX;// * Tiles.WIDTH;
					ima.y = campaignNode.fixY;// * Tiles.HEIGHT;
					// ima.x = campaignNode.curPosX * Tiles.WIDTH;
					// ima.y = campaignNode.curPosY * Tiles.HEIGHT;
					this._items[campaignNode.info.id] = ima;
					campaignNode.nodeView = ima;
					this._centerLayer.addChild(ima);
					ima.info = campaignNode;
					campaignNode.preParent = this._centerLayer;
				}
			}
		}
	}

	private sortFun(node1:CampaignNode, node2:CampaignNode):number
	{
		if(node1.nodeId < node2.nodeId)
		{
			return -1
		}
		else if(node1.nodeId > node2.nodeId)
		{
			return  1;
		}
		return 0;
	}

	private initRegister() {
		let arr: any[] = [];
		this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, CampaignMainBuidingLayer.NAME);
	}
	private addDataEvent() {
		this._model.addEventListener(OuterCityEvent.CURRENT_NPC_POS, this.__addNpcHandler, this);
		this._model.addEventListener(OuterCityEvent.CURRENT_CONFIG_CHANGE, this.__moviesHandler, this);
		this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
		if (TaskManage.Instance.cate) {
			TaskManage.Instance.cate.addEventListener(TaskEvent.TASK_ADDED, this.refreshNode, this);
			TaskManage.Instance.cate.addEventListener(TaskEvent.TASK_REMOVE, this.refreshNode, this);
		}
		RingTaskManager.Instance.addEventListener(RingTaskEvent.REFRESHRING, this.refreshNode, this);
		OfferRewardManager.Instance.addEventListener(RewardEvent.REWARD_TASK_UPDATE, this.refreshNode, this);
	}

	public onClickHandler(evt: Laya.Event): boolean {
		let mc: any = evt.target;
		if (mc && mc["mouseClickHandler"]) {
			return mc.mouseClickHandler(evt);
		}
		return false;
	}
	
	public mouseOverHandler(evt: Laya.Event): boolean {
		let mc: any = evt.target;
		if (mc && mc["mouseOverHandler"]) {
			return mc.mouseOverHandler(evt);
		}
		return false;
	}

	public mouseOutHandler(evt: Laya.Event): boolean {
		let mc: any = evt.target;
		if (mc && mc["mouseOutHandler"]) {
			return mc.mouseOutHandler(evt);
		}
		return false;
	}
	public mouseMoveHandler(evt: Laya.Event): boolean {
		let mc: CampaignNpcPhysics = evt.target as CampaignNpcPhysics;
		return (mc ? true : false);
	}

	private __addToStageHandler(evt: Event) {
		this.initRegister();
	}
	private __moviesHandler(data: any) {
		let obj: any = data;
		if (obj) {
			this.addMoviesByLayer(obj.movies, 0);
			this.addMoviesByLayer(obj.tops, 2);
		}
	}
	private addMoviesByLayer(arr: any[], layer: number) {
		if (!arr) return;
		for (const key in arr) {
			let info = arr[key];
			let node: PhysicsStaticView = new PhysicsStaticView();
			let nodeInfo: CampaignNode = new CampaignNode();
			let pInfo: PhysicInfo = new PhysicInfo();
			pInfo.types = PosType.MOVIE;
			pInfo.state = NodeState.EXIST;
			pInfo.names = info.url;
			pInfo.posX = info.x / Tiles.WIDTH;
			pInfo.posY = info.y / Tiles.HEIGHT;
			nodeInfo.info = pInfo;
			node.rotation = info.rotation;
			node.info = nodeInfo;
			node.x = info.x;
			node.y = info.y;
			if (info.hasOwnProperty("scaleX")) {
				node.scaleX = info.scaleX;
			}
			if (info.hasOwnProperty("scaleY")) {
				node.scaleY = info.scaleY;
			}

			nodeInfo.nodeView = node;
			nodeInfo.layer = layer;
			this._model.staticMovies.push(nodeInfo);//fixme by yuyuanzhan 页神遗留bug,  this._model.staticMovies没有地方清空, 会越来越大
			if (layer == 0) {
				this._buttomLayer.addChild(node);
				nodeInfo.preParent = this._buttomLayer;
			} else if (layer == 2) {
				this._topLayer.addChild(node);
				nodeInfo.preParent = this._topLayer;
			}

			if (this._items) {
				this._items.set(node.x + "," + node.y, node);
				CampaignResManager.cachePhysicsRes.set(node.resourcesPath, true)
			}
		}
	}
	private __addNpcHandler() {
		if (this.mapView && !this.mapView.stepRender) {
            this.addNpcs(this._model.mapNodesData);
        }
	}

	public addNpc(node: CampaignNode) {
        if (!node) {
            return
        }
        if (node.resource == NodeResourceType.Image) {
            return
        }
		let ima = this._items.get(node.info.id.toString()) as MapPhysicsBase;
		if (!ima) ima = this.createNodeView(node);
		ima.filter = this._filter;
		if (node.fixX != 0 && node.fixY != 0) {
			ima.x = node.fixX;
			ima.y = node.fixY;
		} else {
			ima.x = node.info.posX * Tiles.WIDTH;
			ima.y = node.info.posY * Tiles.HEIGHT;
		}
		if (node.info.types == PosType.FALL_CHEST) {
			//宝箱掉落 判断是否在可行走区域 否则偏移
			let walkable: boolean = this._model.getWalkable(node.info.posX, node.info.posY);
			if (!walkable) {
				let newPos: Laya.Point = CampaignArmyViewHelper.getNodeStationPointImp(node);
				ima.x = newPos.x * Tiles.WIDTH;
				ima.y = newPos.y * Tiles.HEIGHT;
			}
		}

		node.nodeView = ima;
		// if(node.info.names)ima.tipData = this.createItemTips(node.info,node);
		if (node.info.types == PosType.COPY_LOGO || node.info.types == PosType.STATIC) {
			this._centerLayer.addChildAt(ima, 0);
		} else {
			this._centerLayer.addChild(ima);
		}
		ima.info = node;
		node.preParent = this._centerLayer;

		this._items.set(node.info.id.toString(), ima);
		CampaignResManager.cachePhysicsRes.set(ima.resourcesPath, true)
	}
	private addNpcs(arr: any[]) {
		if (!arr) return;

		// Logger.xjy("[CampaignMainBuidingLayer]addNpcs ", arr)
		for (let i = 0, len = arr.length; i < len; i++) {
			this.addNpc(arr[i]);
		}
		this.refreshNode();
	}

	private refreshNode() {
		let mapId: number = CampaignManager.Instance.mapId;
		if (!WorldBossHelper.checkPetLand(mapId))  //不是宠物岛时就不改变节点的鼠标事件
		{
			return;
		}
		if (!this._items) return;
		for (const element of this._items.values()) {
			let node: CampaignNode = <CampaignNode>element.info;
			if (node) {
				if (node.info.types == PosType.COLLECTION) {
					if (node.param3 || node.param4) {
						let normalTasks: any[];
						let wantedTasks: any[];
						if (node.param3) normalTasks = node.param3.split(",");
						if (node.param4) wantedTasks = node.param4.split(",");
						let taskId: number = 0;
						let show: boolean = false;
						if (normalTasks) {
							for (let i: number = 0; i < normalTasks.length; i++) {
								taskId = normalTasks[i];
								if (TaskManage.Instance.cate.hasTaskAndNotCompleted(taskId)) {
									show = true;
									break;
								}
							}
						}
						if (wantedTasks) {
							for (let i: number = 0; i < wantedTasks.length; i++) {
								taskId = wantedTasks[i];
								if (OfferRewardManager.Instance.model.hasTaskAndNotCompleted(taskId) ||
									RingTaskManager.Instance.hasTaskAndNotCompleted(taskId)) {
									show = true;
									break;
								}
							}
						}
						element.mouseEnabled = show;
						element.showName(show);
					}
				}
			}
		}
	}

	public get centerLayer(): Laya.Sprite {
		return this._centerLayer;
	}

	createNodeView(info: CampaignNode): MapPhysicsBase {
		if (info.info.types == PosType.STATIC) {
			return new PhysicsStaticView();
		} else if (info.info.types == PosType.FALL_CHEST) {
			return new PhysicsChestView(info.tempData);
		}
		return new CampaignNpcPhysics();
	}

	private createItemTips($info: PhysicInfo, node: CampaignNode): MultipleDictionaryInfo {
		let tipInfo: MultipleDictionaryInfo = new MultipleDictionaryInfo();
		tipInfo.addItem($info.names, null);
		if ($info.types == PosType.COPY_NPC || $info.types == PosType.COPY_END) {
			let str: string = LangManager.Instance.GetTranslation("yishi.view.PlayerMenu.playerLevel");
			tipInfo.addItem(str, $info.grade.toString());
			str = LangManager.Instance.GetTranslation("public.colon", LangManager.Instance.GetTranslation("public.playerInfo.ap"));
			tipInfo.addItem(str, node.fightCapaity.toString());
		}
		return tipInfo;
	}

	public get items(): Map<string, MapPhysicsBase> {
		return this._items;
	}

    public get mapView() {
        return CampaignManager.Instance.mapView
	}
	
	public dispose() {
		MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
		this._model.removeEventListener(OuterCityEvent.CURRENT_NPC_POS, this.__addNpcHandler, this);
		this._model.removeEventListener(OuterCityEvent.CURRENT_CONFIG_CHANGE, this.__moviesHandler, this);
		this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
		if (TaskManage.Instance.cate) {
			TaskManage.Instance.cate.removeEventListener(TaskEvent.TASK_ADDED, this.refreshNode, this);
			TaskManage.Instance.cate.removeEventListener(TaskEvent.TASK_REMOVE, this.refreshNode, this);
		}
		RingTaskManager.Instance.removeEventListener(RingTaskEvent.REFRESHRING, this.refreshNode, this);
		OfferRewardManager.Instance.removeEventListener(RewardEvent.REWARD_TASK_UPDATE, this.refreshNode, this);

		CampaignResManager.cachePhysicsRes.forEach((ele, url) => {
			// Logger.xjy("[CampaignMainBuidingLayer]清理副本静态资源",url)
			ResMgr.Instance.releaseRes(url)
		});
		CampaignResManager.cachePhysicsRes.clear();

		this._items.forEach(element => {
			if (element) element.dispose();
		})
		this._items = null;
		this._buttomLayer = null;
		this._centerLayer = null;
		this._topLayer = null;
		if (this.parent) this.parent.removeChild(this);
	}
}