import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import { EmWindow } from '../../constant/UIDefine';
import { PlayerManager } from '../../manager/PlayerManager';
import { SharedManager } from '../../manager/SharedManager';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import QueueItem from '../home/QueueItem';
import { VIPManager } from '../../manager/VIPManager';
import { VipPrivilegeType } from '../../constant/VipPrivilegeType';
import RechargeAlertMannager from '../../manager/RechargeAlertMannager';
import { ResourceManager } from '../../manager/ResourceManager';
export default class VipCoolDownFrameWnd extends BaseWindow {
    public modelEnable = false;

    private n3: fgui.GLabel;
    private n4: fgui.GLabel;
    private n10: fgui.GLabel;
    private n11: fgui.GLabel;
    private costDiamondCount: fgui.GLabel;//消耗的钻石数量
    private Btn_Cancel: UIButton;//取消
    private Btn_Confirm: UIButton;//确认
    private Btn_selected: UIButton;//勾选框
    private _point: number;
    private _callBack: Function;
    private _orderId: number = 0;
    private _type: number = 0;
    public group1: fgui.GGroup;
    public vipTxt: fgui.GTextField;
    public OnInitWind() {
        this.n3.text = LangManager.Instance.GetTranslation("VipCoolDownFrameWnd.title");
        this.n4.text = LangManager.Instance.GetTranslation("VipCoolDownFrameWnd.n4");
        this.n10.text = LangManager.Instance.GetTranslation("VipCoolDownFrameWnd.n10");
        this.n11.text = LangManager.Instance.GetTranslation("VipCoolDownFrameWnd.n11");
        this.addEvent();
        this.setCenter();
        let frameData = this.params;
        if (frameData.orderId) {
            this._orderId = frameData.orderId;
        }
        if (frameData.pointNum) {
            this._point = frameData.pointNum;
        }
        if (frameData.backFun) {
            this._callBack = frameData.backFun;
        }
        if (frameData.type) {
            this._type = frameData.type;
        }
        this.Btn_selected.selected = true;
        this.group1.y = 55;
        let grade: number = 0;
        if (this._type == QueueItem.QUEUE_TYPE_ALCHEMY) {//挑战
            grade = VIPManager.Instance.model.getMinGradeHasPrivilege(VipPrivilegeType.PVP_PET_CHALLENGE_COOLDOWN);
            if (grade > 0) {
                this.vipTxt.text = LangManager.Instance.GetTranslation("VipCoolDownFrameWnd.vipTxt", grade);
            }
        }
        else if (this._type == QueueItem.QUEUE_TYPE_COLOSSEUM) {
            grade = VIPManager.Instance.model.getMinGradeHasPrivilege(VipPrivilegeType.TAX_COOLDOWN);
            if (grade > 0) {
                this.vipTxt.text = LangManager.Instance.GetTranslation("VipCoolDownFrameWnd.vipTxt", grade);
            }
        }
        else {
            this.vipTxt.text = "";
            this.group1.y = 68;
        }
        this.costDiamondCount.text = this._point.toString();
        if(this._point <= PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken || this._point <= PlayerManager.Instance.currentPlayerModel.playerInfo.point){
            this.costDiamondCount.color ="#FFECC6";
        }
    }

    private addEvent() {
        this.Btn_Confirm.onClick(this, this.ConfirmHandler.bind(this));
        this.Btn_Cancel.onClick(this, this.CancelHandler.bind(this));
    }

    private removeEvent() {
        this.Btn_Confirm.offClick(this, this.ConfirmHandler.bind(this));
        this.Btn_Cancel.offClick(this, this.CancelHandler.bind(this));
    }

    private openVip() {
        RechargeAlertMannager.Instance.openShopRecharge();
        this.Hide();
    }

    private ConfirmHandler() {
        var ownNum: number;
        SharedManager.Instance.payChooseType = 3;
        ownNum = PlayerManager.Instance.currentPlayerModel.playerInfo.point + PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
        if (ownNum < this._point) {
            this.Hide();
            RechargeAlertMannager.Instance.show();
            // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            return;
        }
        var hasMoney: number;
        if (this.checked) {
            hasMoney = PlayerManager.Instance.currentPlayerModel.playerInfo.point + PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
        }
        else {
            hasMoney = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        }
        if (hasMoney < this._point) {
            this._callBack(false);
            RechargeAlertMannager.Instance.show();
            // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
            this.Hide();
            return;
        }
        this._callBack(true, this._orderId, 3, this.checked);
        this.Hide();
    }

    private get checked(): boolean {
        let controller = this.Btn_selected.view.getController('button');
        return controller.selectedIndex == 1 || controller.selectedIndex == 3;
    }

    private CancelHandler() {
        this.Hide();
    }

    Hide() {
        this.removeEvent();
        UIManager.Instance.HideWind(EmWindow.VipCoolDownFrameWnd);

    }
}