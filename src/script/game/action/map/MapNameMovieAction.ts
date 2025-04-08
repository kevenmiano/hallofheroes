import UIManager from "../../../core/ui/UIManager";
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import MapNameMovie from "../../component/MapNameMovie";
import { EmWindow } from "../../constant/UIDefine";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";

/**
 *地图名动画 
 * @author 
 * 
 */
export default class MapNameMovieAction extends MapBaseAction {

	constructor() {
		super();
	}

	update() {
		var model: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!model || !model.mapTempInfo) {
			this.actionOver();
			return;
		}
		if (this._count == 0) {
			var id: number = CampaignManager.Instance.mapModel.mapTempInfo.MapFileId;
			UIManager.Instance.ShowWind(EmWindow.MapNameMovie, { backCall: this.actionOver.bind(this), mapId: id,mapName:CampaignManager.Instance.mapModel.mapTempInfo.MapNameLang});
		} else if (this._count > 50) {
			this.actionOver();
		}
		this._count++;
	}
}