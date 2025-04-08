// @ts-nocheck
import { HintCampaignGetType } from "../../constant/HintDefine";
import { MapBattleMovieMediater } from "./MapBattleMovieMediater";

/**
 *  
 * 战斗获得动画, 在人物身上播放
 * 
 */
export class BattleMovieMediator extends MapBattleMovieMediater {
	constructor() {
		super();
	}

	public register($target: Object) {
		super.register($target);
		// if (this.data && this.target instanceof PvpWarFightArmyView) {
		// 	this.data.addEventListener(CampaignMapEvent.UPDATE_PVP_SCORE, this.__updatePvpScoreHandler.bind(this));
		// 	this.data.addEventListener(CampaignMapEvent.UPDATE_PVP_GESTE, this.__updatePvpGesteHandler.bind(this));
		// }
	}

	public unregister($target: Object) {
		// if (this.data && this.target instanceof PvpWarFightArmyView) {
		// 	this.data.removeEventListener(CampaignMapEvent.UPDATE_PVP_SCORE, this.__updatePvpScoreHandler.bind(this));
		// 	this.data.removeEventListener(CampaignMapEvent.UPDATE_PVP_GESTE, this.__updatePvpGesteHandler.bind(this));
		// }
		super.unregister($target);
	}

	private __updatePvpScoreHandler(data: any) {
		this.playScoreMovie(parseInt(data.toString()));
	}
	private __updatePvpGesteHandler(data: any) {
		this.playScoreMovie(parseInt(data.toString()), HintCampaignGetType.Honor);
	}
}