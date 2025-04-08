// @ts-nocheck
import IMediator from "../../interfaces/IMediator";

	/**
	 *  
	 * 多人本中 队友头像
	 * 
	 */	
	export class TeamListMediator implements IMediator
	{
		// private _teamList           : TeamListView;
		constructor()
		{
		}
		
		public register(target : Object)
		{
			// this._teamList = new TeamListView();
			// LayerManager.Instance.addToLayer(this._teamList,LayerManager.GAME_UI_LAYER,false,false,0,UISpriteLayer.LEFT_CONTAINER);
			
		}
		public unregister(target : Object)
		{
			// if(this._teamList)this._teamList.dispose();this._teamList = null;
		}
	}