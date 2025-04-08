// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-01 15:28:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-26 18:21:42
 * @Description: 资源的管理, 基于引用计数, 可以包括该资源的动画（只适用于一个图集一个动画）
 * 注: 不适用于fgui创建的对象, Fgui调用的是Laya的接口
 */

import Logger from "../../core/logger/Logger";
import { ResInfo } from "../../core/res/ResInfo";
import ResMgr from '../../core/res/ResMgr';
import Utils from "../../core/utils/Utils";
import { AnimationManager } from "../manager/AnimationManager";

export class ResRefCountManager {
    public static resCache = new Map<string, ResInfo>()
    public static atlasCache = new Map<string, any>()

    static loadRes(url: string, complete: Function = null, progress: Function = null, type?: string,
        priority?: number, cache?: boolean, group?: string | null, ignoreCache?: boolean, useWorkerLoader?: boolean, args?: any) {

        if (type == Laya.Loader.ATLAS) {
            let res = this.atlasCache.get(url);
            if (res) {
                complete && complete(res, args);
                progress && progress(1);
                return
            }
        }

        ResMgr.Instance.loadRes(url, (res, args) => {
            let resInfo = this.resCache.get(url)
            if (!resInfo) {
                resInfo = Laya.Pool.getItemByClass("ResInfo", ResInfo);
                this.resCache.set(url, resInfo);
            }
            resInfo.url = url;
            resInfo.type = type;
            if (group) {
                resInfo.group = group;
            }

            if (type == Laya.Loader.ATLAS) {
                let tmp = Utils.deepCopy(res);
                this.atlasCache.set(url, tmp);
            }

            complete && complete(res, args)
        }, progress, type, priority, cache, null, ignoreCache, useWorkerLoader, args)
    }

    /**
     * 必须从这接口取资源, 不能从loadRes的回调里取
     * @param url 
     * @returns 
     */
    static getRes(url: string): any {
        let resInfo = this.resCache.get(url)
        if (!resInfo) {
            return null
        }

        resInfo.refCount++

        if (this.atlasCache.get(url)) {
            // Logger.info("[ResRefCountManager]getRes atlasCache ", url, resInfo.refCount)
            return this.atlasCache.get(url)
        }
        // Logger.info("[ResRefCountManager]getRes atlasCache is null", url)

        return ResMgr.Instance.getRes(url)
    }

    static loadResItem(loadItem: Laya.loadItem, complete: Function = null, progress: Function = null, type?: string,
        priority?: number, cache?: boolean, group?: string | null, ignoreCache?: boolean, useWorkerLoader?: boolean, args?: any) {

        if (type == Laya.Loader.ATLAS) {
            let res = this.atlasCache.get(loadItem.url);
            if (res) {
                complete && complete(res, args);
                progress && progress(1);
                return
            }
        }

        ResMgr.Instance.loadResItem(loadItem, (res, args) => {
            let resInfo = this.resCache.get(loadItem.url)
            if (!resInfo) {
                resInfo = Laya.Pool.getItemByClass("ResInfo", ResInfo);
                this.resCache.set(loadItem.url, resInfo);
            }
            resInfo.url = loadItem.url;
            resInfo.type = type;
            if (group) {
                resInfo.group = group;
            }

            if (type == Laya.Loader.ATLAS) {
                let tmp = Utils.deepCopy(res);
                this.atlasCache.set(loadItem.url, tmp);
            }

            complete && complete(res, args)
        }, progress, type)
    }

    /**
     * 记录动画名字，资源被销毁的时候自动清理动画
     * @param url  
     * @param cacheName 
     * @returns 
     */
    static setAniCacheName(url: string, cacheName: string): boolean {
        let resInfo = this.resCache.get(url)
        if (!resInfo) {
            return false
        }

        if (!cacheName) {
            return false
        }

        if (resInfo.aniCacheName.indexOf(cacheName) == -1) {
            resInfo.aniCacheName.push(cacheName) 
        }
        return true
    }

    static clearRes(url: string): boolean {
        let resInfo = this.resCache.get(url)
        if (resInfo) {
            resInfo.refCount--;
            // Logger.info("[ResRefCountManager]clearRes --", url, resInfo.refCount)
            if (resInfo.refCount <= 0) {
                // Logger.info("[ResRefCountManager]计数清理资源-----------", url, resInfo)
                if (resInfo.aniCacheName.length > 0) {
                    for (let index = 0; index < resInfo.aniCacheName.length; index++) {
                        const cacheName = resInfo.aniCacheName[index];
                        AnimationManager.Instance.clearAnimationByName(cacheName)
                        // Logger.info("[ResRefCountManager]计数清理资源动画-----------", url, cacheName)
                    }
                }
                resInfo.reset();
                Laya.Pool.recover("ResInfo", resInfo);
                this.resCache.delete(url)
                this.atlasCache.delete(url)
                ResMgr.Instance.cancelLoadByUrl(url)
                ResMgr.Instance.releaseRes(url)
                return true
            } else {
                return false
            }
        } else {
            return true
        }
    }

    static clearResByGroup(group: string) {
        this.resCache.forEach((element, url) => {
            if (element.group == group) {
                element.refCount = 0;
                this.clearRes(url)
            }
        });
    }

    static clearCache() {
        this.resCache.forEach((element, url) => {
            element.refCount = 0;
            this.clearRes(url)
        });
        this.resCache.clear();
    }
}
