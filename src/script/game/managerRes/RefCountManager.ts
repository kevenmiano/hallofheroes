// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-01 15:28:13
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-09-02 20:43:17
 * @Description: 引用计数管理
 */

export class RefInfo {
    public refCount: number = 0;
    public tag: string = "";
    public url: string = "";
    public data: any = null;

    public reset() {
        this.refCount = 0;
        this.tag = "";
        this.url = "";
        this.data = null;
    }
}

export class RefCountManager {
    public static cache = new Map<string, RefInfo>()

    static add(url: string, tag?: string, data?: any) {
        let resInfo = this.cache.get(url)
        if (!resInfo) {
            resInfo = Laya.Pool.getItemByClass("RefInfo", RefInfo);
            resInfo.url = url
            resInfo.tag = tag
            resInfo.data = data
            this.cache.set(url, resInfo)
        }
        resInfo.refCount++
    }

    static del(url: string): boolean {
        let resInfo = this.cache.get(url)
        if (resInfo) {
            resInfo.refCount--;
            if (resInfo.refCount <= 0) {
                resInfo.reset();
                Laya.Pool.recover("RefInfo", this.cache.get(url));
                this.cache.delete(url)
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
