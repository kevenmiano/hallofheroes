/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 15:56:33
 * @LastEditTime: 2021-05-11 17:15:14
 * @LastEditors: jeremy.xu
 * @Description: 
 */

/**
 * 前二位表示RankItemType, 后三位用来区分相同Item样式的不同标题
 */
export class RankIndex {
    public static RankItemR3 = 30000;
    public static RankItemR3_001 = 30001;
    public static RankItemR3_002 = 30002;
    public static RankItemR4 = 40000;
    /**
     * pvp英雄榜
     */
    public static RankItemR4_001 = 40001;
    public static RankItemR4_002 = 40002;
    public static RankItemR5 = 50000;
    /**
     * pvp跨服英雄榜
     */
    public static RankItemR5_001 = 50001;
    public static RankItemR5_002 = 50002;
}

/**
 * Item样式类型
 */
export class RankItemType {
    public static RankItemR3 = 30;   //3列 
    public static RankItemR4 = 40;   //4列 
    public static RankItemR5 = 50;   //5列 
}