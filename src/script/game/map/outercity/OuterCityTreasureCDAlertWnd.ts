// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { OuterCitySocketOutManager } from "../../manager/OuterCitySocketOutManager";
import { PlayerManager } from "../../manager/PlayerManager";

export default class OuterCityTreasureCDAlertWnd extends BaseWindow {
    public contentTxt: fgui.GRichTextField;
    public descTxt: fgui.GTextField;
    public cancelBtn: fgui.GButton;
    public confirmBtn: fgui.GButton;
    private _CDCostDiamondCount: number = 0;
    private _hasCDNumber: number = 0;//已经进行过CD加速的次数
    private _cdCostArray: Array<number> = [];//CD次数和消耗钻石数量关系数组, 数组的第N项代表第N次加速需要消耗的钻石数量
    private _CDMaxNumber: number = 0;//最大加速次数
    private _leftCDNumber: number = 0;//剩余加速次数
    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initEvent();
        this.setCenter();
    }

    private initData() {
        this._hasCDNumber = this.playerModel.skipCount;
        this._cdCostArray = ConfigInfoManager.Instance.getTreasureCdAccelerateSpend();
        if (this._cdCostArray.length > 0) {
            if (this._cdCostArray.length > this._CDCostDiamondCount) {
                this._CDCostDiamondCount = this._cdCostArray[this._hasCDNumber];
            }
            this._CDMaxNumber = this._cdCostArray.length;
            this._leftCDNumber = this._CDMaxNumber - this._hasCDNumber;
        }
        this.contentTxt.text = LangManager.Instance.GetTranslation("OuterCityTreasureCDAlertWnd.contentTxt", this._CDCostDiamondCount);
        this.descTxt.text = LangManager.Instance.GetTranslation("OuterCityTreasureCDAlertWnd.descTxt", this._leftCDNumber, this._CDMaxNumber);
    }

    private initEvent() {
        this.confirmBtn.onClick(this, this.confirmBtnHandler);
        this.cancelBtn.onClick(this, this.cancelBtnHandler);
    }

    private removeEvent() {
        this.confirmBtn.offClick(this, this.confirmBtnHandler);
        this.cancelBtn.offClick(this, this.cancelBtnHandler);
    }

    private confirmBtnHandler() {
        var hasMoney: number = this.playerModel.playerInfo.point;
        if (hasMoney < this._CDCostDiamondCount) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityTreasureCDAlertWnd.confirm.tips"));
            return;
        }
        OuterCitySocketOutManager.treasureCD(1);
        this.hide();
    }

    private cancelBtnHandler() {
        this.hide();
    }

    private get playerModel():PlayerModel{
        return PlayerManager.Instance.currentPlayerModel
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}