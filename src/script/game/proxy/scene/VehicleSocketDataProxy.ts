import { SocketManager } from "../../../core/net/SocketManager";
import { SLGSocketEvent } from "../../constant/event/NotificationEvent";
import SceneType from "../../map/scene/SceneType";
import { SocketDataProxyModel } from "../data/SocketDataProxyModel";
import { BaseSceneSocketDataProxy } from "./BaseSceneSocketDataProxy";
import { ServerDataManager } from '../../../core/net/ServerDataManager';
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';

    export class VehicleSocketDataProxy extends BaseSceneSocketDataProxy
	{
		constructor($model:SocketDataProxyModel)
		{
			super($model);
		}
		
		
		/**
		 *开始载具socket数据缓存 
		 * 
		 */		
		protected proxyStart() 
		{
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_CAMPAIGN_LIST_RSP,this,this.__onDataHandler);//初始化玩家列表
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_JOIN, this,this.__onDataHandler);//玩家新加入副本
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_EXIT, this,this.__onDataHandler);//玩家离开副本
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_MOVE, this,this.__onDataHandler);//同步玩家移动
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_SYNC_BUFF, this,this.__onDataHandler);//同步buff
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_SYNC_SKILL, this,this.__onDataHandler);//同步技能信息
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_ATTACK_RSP, this,this.__onDataHandler);//同步玩家攻击信息
			ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_NODE, this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_NODE_ADD,  this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_NODE_UPDATE, this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_NPC_NODE, this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_DETAILE, this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_CAMPAIGN_CREATE, this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_END, this,this.__onDataHandler);
			ServerDataManager.listen(S2CProtocol.U_C_VEHICLE_BOSS_ATTACK_TIP, this,this.__onDataHandler);
		}
		
		/**
		 *结束载具socket数据缓存 
		 * 
		 */		
		protected proxyOver() 
		{
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_CAMPAIGN_LIST_RSP,this,this.__onDataHandler);//初始化玩家列表
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_JOIN, this,this.__onDataHandler);//玩家新加入副本
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_EXIT, this,this.__onDataHandler);//玩家离开副本
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_MOVE, this,this.__onDataHandler);//同步玩家移动
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_SYNC_BUFF, this,this.__onDataHandler);//同步buff
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_SYNC_SKILL, this,this.__onDataHandler);//同步技能信息
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_ATTACK_RSP, this,this.__onDataHandler);//同步玩家攻击信息
			ServerDataManager.cancel(S2CProtocol.U_C_CAMPAIGN_NODE, this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_CAMPAIGN_NODE_ADD,  this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_CAMPAIGN_NODE_UPDATE, this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_NPC_NODE, this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_DETAILE, this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_CAMPAIGN_CREATE, this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_END, this,this.__onDataHandler);
			ServerDataManager.cancel(S2CProtocol.U_C_VEHICLE_BOSS_ATTACK_TIP, this,this.__onDataHandler);
		}
		public get sceneType() : string
		{
			return SceneType.VEHICLE;
		}
	}