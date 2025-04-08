// @ts-nocheck
import { CampaignManager } from "../../../manager/CampaignManager";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export class CampaignMapCenterCheckHelper {
	constructor() {
	}
	private static _startX: number = -10;
	private static _startY: number = -10;
	/**
	 * 检测地图是否超出屏幕范围 
	 * @param p 不超出屏幕范围的点
	 * @return 
	 * 
	 */
	public static checkOutScene(p: Laya.Point, target?: Laya.Sprite): Laya.Point {
		if (p.x > CampaignMapCenterCheckHelper._startX) p.x = CampaignMapCenterCheckHelper._startX;
		if (p.y > CampaignMapCenterCheckHelper._startY) p.y = CampaignMapCenterCheckHelper._startY;
		var mMode: CampaignMapModel = CampaignManager.Instance.mapModel;

		let scaleX = target ? target.scaleX : 1;
		let scaleY = target ? target.scaleY : 1;
		var minX: number = StageReferance.stageWidth - (mMode ? mMode.mapTempInfo.Width * scaleX : 100000);
		var minY: number = StageReferance.stageHeight - (mMode ? mMode.mapTempInfo.Height * scaleY : 100000);
		if (p.x < minX) p.x = minX;
		if (p.y < minY) p.y = minY;
		return p;
	}
}