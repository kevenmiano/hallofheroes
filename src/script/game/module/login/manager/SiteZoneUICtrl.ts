import { EmWindow } from "../../../constant/UIDefine"
import { getZoneData, isOversea } from "./SiteZoneCtrl"
import { ZONE_AREA } from "../model/SiteZoneData";
import Logger from "../../../../core/logger/Logger";

/*
 * @Author: jeremy.xu
 * @Date: 2024-03-11 15:14:43
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-11 15:40:42
 * @Description 管理不同地区的不一样的界面
 */
export class SiteZoneUICtrl {
    private static _Instance: SiteZoneUICtrl;

    public static get Instance(): SiteZoneUICtrl {
        if (!this._Instance) {
            this._Instance = new SiteZoneUICtrl();
        }
        return this._Instance;
    }

    differWinMap = new Map()

    constructor() {
        let inland = []
        let oversea = [
            EmWindow.Login,
            EmWindow.LoginSetting]

        this.differWinMap.set(ZONE_AREA.INLANG, inland)
        this.differWinMap.set(ZONE_AREA.OVERSEA, oversea)
    }

    getDifferEmWindow(emWin: EmWindow): string {
        let zoneData = getZoneData();
        if (!zoneData) {
            return emWin
        }
        let tempEmWin: string = emWin;
        if(isOversea()) {//国内0，其它为海外
            let winArr = this.differWinMap.get(ZONE_AREA.OVERSEA);
            if (winArr.indexOf(emWin) != -1) {
                tempEmWin = tempEmWin + "OS"
                Logger.info("界面名称转换 海外", emWin, tempEmWin)
            }
        }

        return tempEmWin
    }
}