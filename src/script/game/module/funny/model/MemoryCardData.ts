/*
 * @Author: jeremy.xu
 * @Date: 2022-05-27 14:25:11
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-06-06 17:03:12
 * @Description: 
 */

import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { GoodsType } from "../../../constant/GoodsType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import Logger from '../../../../core/logger/Logger';

export class MemoryCardData {
    public static OP_OPEN: number = 1;// 打开界面
    public static OP_CHOOSE: number = 2;//翻开卡牌
    public static OP_BUY: number = 3;//购买步数
    public static OP_REFRESH: number = 4;//刷新游戏

    public static MEMORYCARD_BUYTIMES: number = 10; //每次购买步数
    public static MEMORYCARD_MAXTIMES: number = 10; //每天可购买最大次数
    public static MEMORYCARD_LIMITIMES: number = 99; //最大步数
    public static MEMORYCARD_DEFAULTTIMES: number = 15; //初始步数
    public static MEMORYCARD_COSTDIAMOND: number = 75; //每次购买步数需要消耗钻石

    public static CARD_NUM: number = 20;

    public isOpen: boolean = false;
    public canOperate: boolean = false;
    public openTime: string = "";//开启时间
    public stopTime: string = "";//结束时间

    /**点击的卡牌index*/
    public clickIndexArr: any[] = [];
    /**是否锁定*/
    public lock: boolean = false;

    /**操作类型*/
    public opType: number = 1;
    /**免费步数*/
    public freeStep: number = 20;
    /**购买步数*/
    public buyStep: number = 0;
    /**购买次数*/
    public buyCount: number = 0;
    /**掉落信息(物品ID,数量|物品ID,数量)*/
    public dropInfo: string = "";
    /**消失位置信息(位置,位置)*/
    public posInfo: string = "";
    /**特殊道具(物品ID,数量)*/
    public specialInfo: string = "";
    /**是否能刷新*/
    public canRefresh: boolean = false;
    /**是否匹配*/
    public isMatch: boolean = false;
    /**结果(位置,物品ID,数量|位置,物品ID,数量)*/
    public result: string = "";

    public get step(): number {
        return this.freeStep + this.buyStep;
    }

    public get dropGoodsInfo(): GoodsInfo[] {
        let infos: GoodsInfo[] = []
        if (!this.dropInfo) {
            return infos
        }
        let resultArr: string[] = this.dropInfo.split("|");
        for (let index = 0; index < resultArr.length; index++) {
            const str = resultArr[index];
            let arr: string[] = str.split(",");
            let tempId = Number(arr[0]);
            let count = Number(arr[1]);
            let tmpInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, tempId);
            if (!tmpInfo) {
                Logger.xjy("[MemoryCardData]为找到物品模板", str)
                continue
            }
            // if ((tmpInfo.MasterType == GoodsType.EQUIP || tmpInfo.MasterType == GoodsType.HONER) && count > 1) {
            //     for (let i = 0; i < count; i++) {
            //         let info = new GoodsInfo();
            //         info.templateId = tempId;
            //         info.count = 1;
            //         infos.push(info);
            //     }
            // } else {
                let info = new GoodsInfo();
                info.templateId = tempId;
                info.count = count;
                infos.push(info);
            // }
        }
        return infos
    }

    public clear() {
        this.canRefresh = false;
        this.canOperate = false;
        this.clickIndexArr = [];
    }
}