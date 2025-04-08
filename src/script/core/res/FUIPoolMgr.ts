// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-09-26 15:04:22
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:16:02
 * @Description: 
 */

import { EmPackName } from "../../game/constant/UIDefine";
import FUIHelper from "../../game/utils/FUIHelper";
import Logger from "../logger/Logger";

export class FUIPoolMgr {
    // 铁匠铺背包格子预创建
    public StoreBagCellCnt: number = 50;
    private _storeBagCellCnt: number = 0;

    private _instances: any;

    private static instance: FUIPoolMgr;
    public static get Instance(): FUIPoolMgr {
        return this.instance ? this.instance : this.instance = new FUIPoolMgr();
    }

    public setup() {
        this.setupStoreBagCell();
        this._instances = new Object();
    }

    public setupStoreBagCell() {
        Laya.timer.loop(20, this, this.createStoreBagCell)
    }

    public createStoreBagCell() {
        this._storeBagCellCnt++;
        fgui.GObjectPool.addGPool(FUIHelper.getItemURL(EmPackName.Base, "StoreBagCell"))
        if (this._storeBagCellCnt >= this.StoreBagCellCnt) {
            this._storeBagCellCnt = 0;
            Laya.timer.clear(this, this.createStoreBagCell)
        }
    }

    /**
     * 从对象池获取对象
     * @param FUI_URL 
     * @returns 
     */
    public getObject(FUI_URL: string): any {
        if (!FUI_URL) {
            return null;
        }
        let instances: any[] = this._instances[FUI_URL];
        if (!instances) {
            instances = [];
            this._instances[FUI_URL] = instances;
        }

        Logger.warn("FUIPoolMgr-getObject:", instances.length);
        if (instances.length > 0) {
            return instances.shift();
        }
        Logger.warn("FUIPoolMgr-createObject:", instances.length);
        let instanceURL = fgui.UIPackage.normalizeURL(FUI_URL);
        let obj = fgui.UIPackage.createObjectFromURL(instanceURL);
        return obj;
    }

    /**
     * 回收到对象
     * @param retObject 回收对象
     * @param FUI_URL 回收对象链接
     * @returns 
     */
    public returnObject(retObject: any, FUI_URL: string): any {
        if (!FUI_URL) {
            return null;
        }
        let instances: any[] = this._instances[FUI_URL];
        if (!instances) {
            instances = [];
            this._instances[FUI_URL] = instances;
        }
        instances.push(retObject);
        Logger.warn("FUIPoolMgr-returnObject:", instances.length);
        return retObject;
    }

    /**清理对象池 */
    public clearPool(FUI_URL: string) {
        if (!FUI_URL) {
            return null;
        }
        let instances: any[] = this._instances[FUI_URL];
        if (!instances) {
            instances = [];
            this._instances[FUI_URL] = instances;
        }
        while (instances.length) {
            let item = instances.shift();
            try {
                if (item && item['removeFromParent']) {
                    item.removeFromParent();
                }
                if (item && item["dispose"]) {
                    item.dispose();
                }
                item = null;
            } catch (error) {
                Logger.error("FUIPoolMgr-clearPool:", error);
            }
        }
    }

}