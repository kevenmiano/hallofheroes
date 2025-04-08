// @ts-nocheck
import { t_s_campaigndataData } from "../../game/config/t_s_campaigndata";
import { t_s_herotemplateData } from "../../game/config/t_s_herotemplate";
import { t_s_itemtemplateData } from "../../game/config/t_s_itemtemplate";
import { ConfigType } from "../../game/constant/ConfigDefine";
import { CropPhase } from "../../game/constant/CropPhase";
import { PathManager } from "../../game/manager/PathManager";
import { TempleteManager } from "../../game/manager/TempleteManager";
import ConfigMgr from "../config/ConfigMgr";
import UnExistRes from "../res/UnExistRes";

export class IconFactory {
	public static getBuidIconByIcon(icon: string): string {
		let url = PathManager.resourcePath + icon.toLocaleLowerCase();
		if (UnExistRes.isExist(url)) {
			return UnExistRes.BlankURL;
		}
		return url
	}
	public static getTecIconByIcon(icon: string): string {
		let url = PathManager.resourcePath + "icon" + icon.toLocaleLowerCase();
		if (UnExistRes.isExist(url)) {
			return UnExistRes.BlankURL;
		}
		return url
	}
	public static getSoldierIconByIcon(icon: string): string {
		let url = PathManager.resourcePath + "icon" + icon.toLocaleLowerCase();
		if (UnExistRes.isExist(url)) {
			return UnExistRes.BlankURL;
		}
		return url
	}

	public static getCommonIconPath(icon: string): string {
		let url = PathManager.resourcePath + "icon" + icon.toLocaleLowerCase();
		if (UnExistRes.isExist(url)) {
			return UnExistRes.BlankURL;
		}
		return url
	}

	public static getCommonIconPath1(icon: string): string {
		return PathManager.resourcePath + "icon/" + icon.toLocaleLowerCase();
	}

	// 占星动画资源
	public static getStarIconPath(tempId: number | string): string {
		return PathManager.resourcePath + "icon/star/" + tempId + "/" + tempId + ".json";
	}

	public static getEmojiIconPath(icon: string): string {
		return PathManager.resourcePath + "emoji/" + icon.toLocaleLowerCase();
	}

	public static getGoodsIconByTID(tid: number): string {
		let gTemplate: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tid);
		return gTemplate ? gTemplate.iconPath.toLocaleLowerCase() : "";
	}
	public static getNPCIcon(nodeId: number): string {
		return PathManager.resourcePath + "images/head/space/" + nodeId + ".png";
	}
	public static getHeroIconByPics(icon: string): string {
		let url = this.toLowerCase(PathManager.resourcePath + "icon" + icon);
		if (UnExistRes.isExist(url)) {
			return UnExistRes.BlankURL;
		}
		return url
	}
	public static getBossIcon(mapId: number, med: string = ".png"): string {
		return PathManager.resourcePath + "images/instanceimg/" + mapId + "/icon" + med;
	}
	public static getPvpWarFight(mapId: number, med: string = ".png"): string {
		return PathManager.resourcePath + "images/instanceimg/" + mapId + "/icon" + med;
	}
	
	/**头像 */
	public static getHeadIcon(headId: number, type: string, med: string = ".png"): string {
		return PathManager.resourcePath + "icon/player/" + headId + "/" + type + med;
	}

	public static getPlayerIcon(templateId: number, type: string, med: string = ".png"): string {
		return PathManager.resourcePath + "icon/player/" + templateId + "/" + type + med;
	}
	
	/**头像边框 */
	public static getHeadFrame(path: string): string {
		return PathManager.resourcePath + "icon/icon_avatar_frame" + path + "/frame.png";
	}

	/**头像边框特效 */
	public static getHeadFrameEffect(path: string): string {
		return PathManager.resourcePath + "icon/icon_avatar_frame" + path + "/effect.json";
	}

	public static getHeroicon(templateId: number): string {
		var hero: t_s_herotemplateData = TempleteManager.Instance.gameHeroTemplateCate(templateId);
		return hero ? PathManager.resourcePath + "icon" + hero.Icon : "";
	}

	public static getCropIcon(cropTemp: t_s_itemtemplateData, cropPhase: number): string {
		if (!cropTemp) return "";
		var path: string = PathManager.resourcePath + "icon";
		switch (cropPhase) {
			case CropPhase.GROW:
				return path + cropTemp.Avata.toLocaleLowerCase() + "/grow.png";
			case CropPhase.MATURE:
				return path + cropTemp.Avata.toLocaleLowerCase() + "/ripe.png";
			case CropPhase.DIE:
				return path + "/common" + "/die.png";
			default:
				return path + "/common" + "/young.png";
		}
	}

	public static getVehicleHeadIcon(tempId: number): string {
		return PathManager.resourcePath + "icon/vehicle_" + tempId + ".png";
	}

	public static getPetHeadSmallIcon(tempId: number): string {
		if (tempId == 0) return null;
		return PathManager.resourcePath + "icon/pet/" + tempId + "/small.png";
	}

	public static getPetHeadBigIcon(tempId: number): string {
		if (tempId == 0) return null;
		return PathManager.resourcePath + "icon/pet/" + tempId + "/big.png";
	}

	public static getPetHeadItemIcon(tempId: number): string {
		if (tempId == 0) return null;
		return PathManager.resourcePath + "icon/pet/" + tempId + "/small.png";
	}

	public static getGodArriveBossIcon(campId: number, gateId: number): string {
		var data: t_s_campaigndataData = TempleteManager.Instance.getGodArriveData(campId, gateId);
		var temp: t_s_herotemplateData;
		let bossId = data.Heros.split(",")[0];
		if (data) temp = temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_herotemplate, bossId);;
		if (!temp) return null;
		return this.toLowerCase(PathManager.resourcePath + "images/level/" + temp.ResPath + ".png");
	}

	//获取英灵战役icon
	public static getUiPlayIcon(tempId: number): string {
		if (tempId == 0) return null;
		return PathManager.resourcePath + "icon/uiplay/Img_Dungeon_" + tempId + ".png";
	}

	//英灵远征关卡icon
	public static getRemotePetIconPath(icon: string): string {
		return this.toLowerCase(PathManager.resourcePath + "icon" + icon);
	}

	/**转小写 */
	public static toLowerCase(value: string): string {
		return value.toLocaleLowerCase();
	}

	/**外城资源车 */
	public static getOutercityVehicle(path: number): string {
		return PathManager.resourcePath + "mapmaterial/build/" + path + "/"+ path + ".json";
	}
}