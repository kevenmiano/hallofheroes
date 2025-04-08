/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-01 10:05:31
 * @LastEditTime: 2021-03-02 21:11:37
 * @LastEditors: jeremy.xu
 * @Description: 
 */

export class SelectCampaignItemData {
    constructor(type: number, itemData: any, id: number = -1, enabled: boolean = true, grayFilterFlag: boolean = false) {
        this.type = type
        this.itemData = itemData
        this.id = id
        this.enabled = enabled
        this.grayFilterFlag = grayFilterFlag
    }
    public type: number
    public itemData: any
    public id: number          // 定位数据用  chapterID 或 areaID
    public enabled: boolean    // 是否可用
    public grayFilterFlag: boolean    // 是否置灰色
}