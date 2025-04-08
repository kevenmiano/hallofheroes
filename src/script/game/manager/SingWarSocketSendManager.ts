// @ts-nocheck
import LangManager from '../../core/lang/LangManager';
import { SocketManager } from '../../core/net/SocketManager';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { MessageTipManager } from './MessageTipManager';

	/**
	 *战场进入查看相关操作 
	 * @author xiaobin.chen
	 * 
	 */
	export class SingWarSocketSendManager
	{
		constructor()
		{
		}
		private static _enterTime:number = 0;
		/**
		 *进入战场 
		 * @param mapId 副本Id
		 * 
		 */		
		public static enterWarfield(mapId:number) 
		{
			if(new Date().getTime()- SingWarSocketSendManager._enterTime < 5000)
			{
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
				return;
			}
			SingWarSocketSendManager._enterTime = new Date().getTime();
			var msg : com.road.yishi.proto.worldmap.WorldBossMsg = new com.road.yishi.proto.worldmap.WorldBossMsg();
			msg.param1 = mapId;
            SocketManager.Instance.send(C2SProtocol.C_ENTER_WARFIELD, msg);
		}
		/**
		 *检查战场进入次数 
		 * @param campaignId  副本Id
		 * 
		 */		
		public static sendRequestPvpRemainNumber(campaignId:number) 
		{
			if(new Date().getTime() - SingWarSocketSendManager._enterTime < 5000)
			{
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01"));
				return;
			}
			SingWarSocketSendManager._enterTime = new Date().getTime();
			var msg:com.road.yishi.proto.campaign.CampaignReqMsg = new com.road.yishi.proto.campaign.CampaignReqMsg();
			msg.paraInt1 = campaignId;
            SocketManager.Instance.send(C2SProtocol.C_CHECK_WARFIELD_COUNT, msg);
		}
		
		private static _time : number = 0;
		/**
		 *战役部队信息 
		 * @param campaignId 副本Id
		 * @param capicity
		 * @param callBack  回调函数
		 * 
		 */		
		public static sendStartCampaignScene(campaignId:number = 0,capicity:number = 0 , callBack:Function=null) 
		{
			var time : number = new Date().getTime();
			if(time - SingWarSocketSendManager._time < 3000)
			{
				if(callBack !=null)
					callBack();
				return;
			}
			SingWarSocketSendManager._time = time;
			var msg:com.road.yishi.proto.campaign.CampaignReqMsg = new com.road.yishi.proto.campaign.CampaignReqMsg();
			if(capicity == 1)
				msg.paraInt1 = capicity;
			msg.paraInt2 = campaignId;
            SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_ENTER, msg);
		}
	}