import { PathManager } from "../../../../manager/PathManager";
import { PosType } from "../../constant/PosType";
import { CampaignNode } from "../../data/CampaignNode";
import { MapPhysicsBase } from "./MapPhysicsBase";

/**
	 * 
	 * 地图上一些静态的物件 主要用于渲染  
	 * 
	 */
export class PhysicsStaticView extends MapPhysicsBase {
	constructor() {
		super();
	}

	public mouseOverHandler(evt: Laya.Event): boolean {
		return false;
	}
	public mouseOutHandler(evt: Laya.Event): boolean {
		return false;
	}
	public mouseClickHandler(evt: Laya.Event): boolean {
		return false;
	}

	public get resourcesPath(): string {
		if (this.info.info.types == PosType.MOVIE) {
			return PathManager.solveCampaignMovieByUrl(this.info.info.names);
		}
		return PathManager.solveMapPhysicsBySonType((<CampaignNode>this.info).sonType);
	}

	public get url(): string {
		return this.resourcesPath;
	}
}
