import { EmWindow } from "../../../constant/UIDefine"
import { QuickOpenFrameInfo } from "../DebugCfg"

/*
 * @Author: jeremy.xu
 * @Date: 2024-01-25 18:35:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 18:29:33
 * @Description: 
 */
export class QuickOpenFrameModel {
    dataList: QuickOpenFrameInfo[]
    
    constructor() {
        this.dataList = [
            /** 常用界面 */
            new QuickOpenFrameInfo(EmWindow.MemToolWnd, "内存查看"),
            new QuickOpenFrameInfo(EmWindow.LogWnd, "调试日志"),
            new QuickOpenFrameInfo(EmWindow.PveMultiCampaignWnd, "英雄之门"),
            new QuickOpenFrameInfo(EmWindow.OfferRewardWnd, "悬赏牌"),
            new QuickOpenFrameInfo(EmWindow.MarketWnd, "市场"),
            new QuickOpenFrameInfo(EmWindow.PvpGate, "竞技场"),
            new QuickOpenFrameInfo(EmWindow.PetChallenge, "英灵竞技"),
            new QuickOpenFrameInfo(EmWindow.RemotePetWnd, "英灵远征"),
            new QuickOpenFrameInfo(EmWindow.PetCampaignWnd, "英灵战役"),
            
            
            /** 不常用界面 */
            new QuickOpenFrameInfo(EmWindow.Pet, "英灵"),
            new QuickOpenFrameInfo(EmWindow.ShopWnd, "商城"),
            new QuickOpenFrameInfo(EmWindow.MineralShopWnd, "紫晶兑换商店"),
            new QuickOpenFrameInfo(EmWindow.PetExchangeShopWnd, "英灵兑换商店"),
            
            /** 自己模块 */
            new QuickOpenFrameInfo(EmWindow.OuterCityWarWnd, "城战主界面(外城打开)", null, null, true),
            new QuickOpenFrameInfo(EmWindow.OutyardFigureWnd, "公会战", null, null, true),
        ] 
    }
}