import BaseWindow from "../../../core/ui/Base/BaseWindow";
import LangManager from "../../../core/lang/LangManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import OutyardManager from "../../manager/OutyardManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";

export default class OutyardBuyEnergyWnd extends BaseWindow {
    public descTxt: fgui.GTextField;
    public giftTxt: fgui.GTextField;
    public btn_buy: fgui.GButton;
    public cancelBtn: fgui.GButton;
    public confrimBtn: fgui.GButton;
    private _maxLimit: number = 0;
    private _usePoint: number = 0;
    public OnInitWind() {
        this.addEvent();
        let frameData = this.params.frameData;
        if (frameData) {
            this._usePoint = frameData._usePoint;
            this._maxLimit = frameData._maxLimit;
        }
        this.setCenter();
        this.initView();
    }

    private initView() {
        this.descTxt.text = LangManager.Instance.GetTranslation("outyard.OutyardFrame.addExecutionTxt", this._usePoint, this._maxLimit);
        this.giftTxt.text = PlayerManager.Instance.currentPlayerModel.playerInfo.point.toString();
    }

    private addEvent() {
        this.cancelBtn.onClick(this, this.cancelBtnHandler);
        this.confrimBtn.onClick(this, this.confrimBtnHandler);
        this.btn_buy.onClick(this, this.buyHandler);
    }

    private removeEvent() {
        this.cancelBtn.offClick(this, this.cancelBtnHandler);
        this.confrimBtn.offClick(this, this.confrimBtnHandler);
        this.btn_buy.offClick(this, this.buyHandler);
    }

    private cancelBtnHandler() {
        this.hide();
    }

    private confrimBtnHandler() {
        if (this._usePoint > PlayerManager.Instance.currentPlayerModel.playerInfo.point) {
            RechargeAlertMannager.Instance.show();
            // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            return;
        }
        OutyardManager.Instance.OperateOutyard(OutyardManager.BUY_EXECUTION);
        this.hide();
    }

    private buyHandler() {
        this.hide();
        RechargeAlertMannager.Instance.openShopRecharge();
    }

    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }
}