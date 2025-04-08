import { MapElmsLibrary } from "../libray/MapElmsLibrary";
import Logger from '../../../core/logger/Logger';
import { CampaignMapView } from "./view/CampaignMapView";
import { WorldBossHelper } from "../../utils/WorldBossHelper";

/**
	 *  加载maps文件中用到的图片 
	 */
export class PreLoadFloorData {
	constructor(result: Function) {
		this._result = result;
	}
	private _totalCount: number = 0;
	private _curCount: number = 0;
	private _result: Function;

	/**
	 *  传入地表数据, 找出所有引用的图片分别加载
	 * @param data maps文件解析后的数据
	 * @param mapId  地图id
	 * 
	 */
	public getMapFloorData(data: Map<string, any>, mapId: number): Map<string, any> {
		let dic: Map<string, any> = new Map();
		if (WorldBossHelper.checkSliceBgMap(mapId) || WorldBossHelper.checkSingleBgMap(mapId)) {

		} else {
			let oldFloorUrl: string = "mapmaterial/floor/grassland/a00.jpg";
			let newFloorUrl: string = "mapmaterial/floor/greeland/greenland_floor/at01.jpg";
			for (const key1 in data) {
				const element1 = data[key1];
				for (const key2 in element1) {
					const element2 = element1[key2];
					for (const key3 in element2) {
						const element = element2[key3];
						if (element.url == oldFloorUrl) element.url = newFloorUrl;
						// dic[element.url] = element;
						dic.set(element.url, element);
					}
				}
			}
		}
		return dic;
	}

	public load(dic: Map<string, any>) {
		this._totalCount = dic.size;
		dic.forEach((element, key) => {
			MapElmsLibrary.Instance.getElementSource(key, this.loadImageResult.bind(this));//加载图片
		});

		if (this._totalCount == 0) this.loadImageResult(null);
		dic.clear()
	}

	private loadImageResult(o: Object) {
		this._curCount++;
		Logger.info("加载中", this._curCount, this._totalCount);
		if (this._curCount >= this._totalCount) {
			if (this._result != null) {
				Logger.info("加载完成");
				this._result(true, this._curCount, this._totalCount);
			}
			this._result = null;
		}
		else {
			if (this._result != null) {
				this._result(false, this._curCount, this._totalCount);
			}
		}
	}
}
