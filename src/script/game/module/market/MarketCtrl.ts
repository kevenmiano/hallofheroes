// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import MarketManager from "../../manager/MarketManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import FrameCtrlInfo from "../../mvc/FrameCtrlInfo";

export default class MarketCtrl extends FrameCtrlBase {


    open(frameInfo: FrameCtrlInfo) {
        if (!MarketManager.Instance.checkCanMarket()) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ShopManager.ConsumeError"));
            return;
        }
        super.open(frameInfo);
    }


}