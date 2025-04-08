// @ts-nocheck
import { GoodsInfo } from "../goods/GoodsInfo";
import { SecretDropType } from "./SecretConst";
import { SecretTresureInfo } from "./SecretTresureInfo";

/*
 * @Author: jeremy.xu
 * @Date: 2024-03-12 12:25:47
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-26 12:30:50
 * @Description: 秘境物品信息 秘宝或物品
 */
export class SecretItemInfo {
    dropType: SecretDropType;
    itemGoodInfo = new GoodsInfo()
    secretInfo = new SecretTresureInfo()
    private _count: number = 0;

    constructor(type?: SecretDropType) {
        this.dropType = type
    }

    parseTempId(id: number) {
        if (this.dropType == SecretDropType.Tresure) {
            this.secretInfo.templateId = id
        } else if (this.dropType == SecretDropType.Item) {
            this.itemGoodInfo.templateId = id
        }
    }

    set count(v: number){
        this._count = v;
        if (this.dropType == SecretDropType.Tresure) {
            this.secretInfo.count = v
        } else if (this.dropType == SecretDropType.Item) {
            this.itemGoodInfo.count = v
        }
    }
    get count(): number{
        return this._count;
    }
}