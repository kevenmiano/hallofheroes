import { ChatEvent } from "../constant/event/NotificationEvent";
import { ChatChannel } from "../datas/ChatChannel";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import SpaceArmy from "../map/space/data/SpaceArmy";
import SpaceManager from "../map/space/SpaceManager";
import ChatData from "../module/chat/data/ChatData";
import { NotificationManager } from "./NotificationManager";

export class SpaceSocketManager {
	private static _instance: SpaceSocketManager
	public static get Instance(): SpaceSocketManager {
		if (!SpaceSocketManager._instance) {
			SpaceSocketManager._instance = new SpaceSocketManager();
		}
		return SpaceSocketManager._instance;
	}

	private _isUse: boolean = false;

	constructor() {
	}

	public setup(isProxy: boolean = false) {
		if (this._isUse) {
			return;
		}
		this._isUse = true;
		if (isProxy) {
			// this.removeSocketEvent(SocketManager.Instance);
		}
		else {
			// this.addSocketEvent(SocketManager.Instance);
		}
		this.addEvent();
	}

	private __playerChatHandler(chatData:ChatData):void{
		if (SceneManager.Instance.currentType != SceneType.SPACE_SCENE) 
		{
			return;
		}
		if(!SpaceManager.Instance.model || !chatData)return;
		if(chatData.channel != ChatChannel.TEAM && chatData.channel != ChatChannel.WORLD&& chatData.channel != ChatChannel.BIGBUGLE&& chatData.channel != ChatChannel.CONSORTIA)
		{
			return;
		}
		var aInfo : SpaceArmy = SpaceManager.Instance.model.getUserArmyByUserId(chatData.uid);
		if(aInfo) 
		{
			aInfo.chatData = chatData;
		}
	}

	private addEvent() {
		NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.__playerChatHandler, this);
	}

	private removeEvent() {
		NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.__playerChatHandler, this);
	}

	public dispose() {
		if (!this._isUse) {
			return;
		}
		this._isUse = false;
		// removeSocketEvent(SocketDataProxyManager.instance.model);
		// removeSocketEvent(SocketManager.instance);
		this.removeEvent();
	}

}