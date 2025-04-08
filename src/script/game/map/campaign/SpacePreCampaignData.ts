/*
 * @Author: jeremy.xu
 * @Date: 2022-06-08 18:09:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-08-02 17:48:02
 * @Description: 
 */
import { MapInfo } from "../space/data/MapInfo";
import { PreCampaignData } from "./PreCampaignData";

export class SpacePreCampaignData extends PreCampaignData {
	constructor(model: MapInfo, behindBool: boolean = false) {
		super(model, behindBool);
	}
}
