/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-03 14:27:38
 * @LastEditTime: 2021-03-03 14:34:04
 * @LastEditors: jeremy.xu
 * @Description: 章节通关奖励item信息
 */

export class DistrictRewardInfo {
    public District: number;
    public ItemId: number;
    public Count: number;
    constructor(district: number, itemId: number, count: number){
        this.District = district
        this.ItemId = itemId
        this.Count = count
    }
}

