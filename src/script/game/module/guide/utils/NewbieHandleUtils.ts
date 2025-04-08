import GTabIndex from "../../../constant/GTabIndex";
import { EmWindow } from "../../../constant/UIDefine";
import NewbieEvent from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import NewbieConfig from "../data/NewbieConfig";

/*
 * @Author: jeremy.xu
 * @Date: 2024-02-23 15:39:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-06-21 17:21:03
 * @Description: 
 */
export default class NewbieHandleUtils {
    static onHandleTabber(gIndex: number) {
        let nodeID = 0

        switch (gIndex) {
            case GTabIndex.Forge_QH:
                nodeID = NewbieConfig.NEWBIE_220
                break;
            case GTabIndex.Forge_XQ:
                nodeID = NewbieConfig.NEWBIE_250
                break;
            case GTabIndex.Skill_FW:
                nodeID = NewbieConfig.NEWBIE_300
                break;
            case GTabIndex.Skill_TF:
                nodeID = NewbieConfig.NEWBIE_340
                break;
            default:
                break;
        }
        NotificationManager.Instance.dispatchEvent(NewbieEvent.MANUAL_TRIGGER, nodeID)
    }

    static onHandleWnd(typeWin: EmWindow) { 
        let nodeID = 0
        switch (typeWin) {
            case EmWindow.PoliticsFrameWnd:
                nodeID = NewbieConfig.NEWBIE_200
                break;
            case EmWindow.CasernWnd:
                nodeID = NewbieConfig.NEWBIE_210
                break;
            case EmWindow.PveGate:
                nodeID = NewbieConfig.NEWBIE_211
                break;
            case EmWindow.Skill:
                nodeID = NewbieConfig.NEWBIE_214
                break;
            case EmWindow.Farm:
                nodeID = NewbieConfig.NEWBIE_230
                break;
            case EmWindow.Consortia:
                nodeID = NewbieConfig.NEWBIE_240
                break;
            case EmWindow.OfferRewardWnd:
                nodeID = NewbieConfig.NEWBIE_260
                break;
            case EmWindow.MazeFrameWnd:
                nodeID = NewbieConfig.NEWBIE_270
                break;
            case EmWindow.Star:
                nodeID = NewbieConfig.NEWBIE_280
                break;
            case EmWindow.MountsWnd:
                nodeID = NewbieConfig.NEWBIE_290
                break;
            case EmWindow.Pet:
                nodeID = NewbieConfig.NEWBIE_310
                break;
            case EmWindow.PetCampaignWnd:
                nodeID = NewbieConfig.NEWBIE_320
                break;
            case EmWindow.RemotePetWnd:
                nodeID = NewbieConfig.NEWBIE_330
                break;
            case EmWindow.TattooBaptizeWnd:
                nodeID = NewbieConfig.NEWBIE_360
                break;
            case EmWindow.PveSecretWnd:
                nodeID = NewbieConfig.NEWBIE_380
                break;
            case EmWindow.MarketBuyWnd:
                nodeID = NewbieConfig.NEWBIE_401
                break;
            case EmWindow.MarketSellWnd:
                nodeID = NewbieConfig.NEWBIE_402
                break;
            default:
                break;
        }
        NotificationManager.Instance.dispatchEvent(NewbieEvent.MANUAL_TRIGGER, nodeID)
    }
}