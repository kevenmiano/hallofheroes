// @ts-nocheck
import ResMgr from "../../../core/res/ResMgr"
import ObjectUtils from "../../../core/utils/ObjectUtils"

/*
 * @Author: jeremy.xu
 * @Date: 2023-03-31 14:52:51
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-04-25 14:34:11
 * @Description: 需要精简战斗动画的怪物
 */
export class RoleActionSimplifyData {
    public static list: string[] = ["boss001", "boss020b"]
    public static pathMap: Map<string, boolean> = new Map()

    public static isSimplify(path: string) {
        if (!path) return false

        if (path.indexOf("animation/equip/") != -1) return;

        if (this.pathMap.get(path)) {
            return true
        }

        let jsonData = ResMgr.Instance.GetRes(path)
        if (jsonData && ObjectUtils.getObjLength(jsonData.frames) <= 8) {
            this.pathMap.set(path, true)
            return true
        }

        // for (let index = 0; index < RoleActionSimplifyData.list.length; index++) {
        //     const url = RoleActionSimplifyData.list[index];
        //     if (path.indexOf(url) != -1) {
        //         this.pathMap.set(path, true)
        //         return true
        //     }
        // }
        return false
    }
}