/*
 * @Author: jeremy.xu
 * @Date: 2024-03-19 10:27:40
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-20 16:26:48
 * @Description: 
 * 
 */

/** 秘境类型 */
export class SecretType {
    /**
     * 单人
     */
    public static Single: number = 1;
    /**
     * 多人 
    */
    public static Multi: number = 2;
    /**
     * 英灵单人
     */
    public static PetSingle: number = 3;
}

/** 秘境掉落类型 */
export class SecretDropType {
    /**
     * 物品
     */
    public static Item: number = 1;
    /**
     * 秘宝
    */
    public static Tresure: number = 2;
}

/** 秘境进入方式 */
export class SecretEnterType {
    static Free: number = 1;
    static UseProp: number = 2;
}

/** 秘境开始（消耗进入次数）或继续（不消耗进入次数） */
export class SecretStartType {
    static Start: number = 1;
    static Continue: number = 2;
}