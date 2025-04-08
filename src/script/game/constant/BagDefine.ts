// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-12-02 17:16:14
 * @LastEditTime: 2021-02-22 14:48:37
 * @LastEditors: jeremy.xu
 * @Description: 
 */
export class BagType {
    /**
     * 隐藏背包
     */
    public static Hide: number = 0;
    /**
     * 领主背包
     */
    public static Player: number = 1;
    /**
     * 战斗背包(符文背包)
     */
    public static Battle: number = 2;
    /**
     * 荣誉背包
     */
    public static Honer: number = 3;
    /**
     * 英雄装备背包
     */
    public static HeroEquipment: number = 4;

    /**
     * 公会保管箱
     */
    public static Storage: number = 6;

    /**
     * 临时背包
     */
    public static Temporary: number = 7;

    /**
     * 公会宝箱
     */
    public static PrizeBox: number = 8;

    /**
     * 物品在邮件中
     */
    public static mail: number = 10;

    /**
     * 物品在拍卖行中
     */
    public static auction: number = 11;
    /**
     * 魔罐仓库
     */
    public static Bottle: number = 22;
    /**
     * 鱼篓
     */
    public static Fish: number = 23;
    /**
     * 迷阵
     */
    public static Maze: number = 24;
    /**
     * 符文石背包
     */
    public static RUNE: number = 25;
    /**
     * 符文石装备背包
     */
    public static RUNE_EQUIP: number = 26;
    /**
     * 英灵背包
     */
    public static PET_BAG: number = 27;
    /**
     * 英灵装备背包
     */
    public static PET_EQUIP_BAG: number = 28;
}

export class BagSortType {
    public static Default: number = 0;
    public static Fashion: number = 1;
    public static Prop: number = 2;
    public static Equip: number = 3;
    public static Jewel: number = 4;
}

export class BagNotic {
    /**
     * 拖动物品
     * arr:any[] = [BaseItemView//被拖动的实例,count//拖动的数量,默认-1,可以不填]
     *  
     */
    public static DRAG_ITEM: string = "DRAG_ITEM_BagNotic";
    /**
     * 拆分物品
     * (未改成消息模式) 
     */
    public static BREAK_ITEM: string = "BREAK_ITEM_BagNotic";
    /**
     * 拖动物品结束(放下物品)
     *  BaseItemView
     */
    public static ITEM_DROP: string = "ITEM_DROP_BagNotic";
    /**
     *  双击物品
     */
    public static ITEM_DOUBLE_CLICK: string = "ITEM_DOUBLE_CLICK";
}

export class BagMediatorName {
    public static StoreBagCell: string = "cell.view.storebag.StoreBagCell";
    public static StoreIntensifyCell: string = "cell.view.storebag.StoreIntensifyCell";
}
