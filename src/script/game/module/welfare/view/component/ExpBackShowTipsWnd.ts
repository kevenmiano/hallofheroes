// @ts-nocheck
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../../core/ui/UIButton";
import { NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import StringHelper from '../../../../../core/utils/StringHelper';
import LangManager from "../../../../../core/lang/LangManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ShopManager } from "../../../../manager/ShopManager";
import ExpBackCtr from "../../../expback/control/ExpBackCtr";
import ConfigInfoManager from "../../../../manager/ConfigInfoManager";

/**
 * 经验找回
 */
export default class ExpBackShowTipsWnd extends BaseWindow {
    public title: fgui.GTextField;
    public closeBtn: fgui.GButton;
    public content: fgui.GRichTextField;
    public resourceTxt1: fgui.GRichTextField;
    public resourceTxt2: fgui.GRichTextField;
    public diamondNumTxt: fgui.GRichTextField;
    public diamonInfoGroup: fgui.GGroup;
    public check2Btn: UIButton;//钻石替代勾选框
    public check2RickText: fgui.GRichTextField;
    public checkContainer2: fgui.GGroup;
    public cancelBtn: fgui.GButton;
    public confirmBtn: fgui.GButton;
    public totalBox: fgui.GGroup;
    public c1: fgui.Controller;
    private _needCount: number = 0;
    private _type: number = 0;//1、材料足够 2、材料不足
    private _price:number = 0;
    public OnInitWind() {
        super.OnInitWind();
        this.c1 = this.getController("c1");
        this._price = ConfigInfoManager.Instance.getRecoverPoint();
        this.setCenter();
        if (this.params) {
            if (this.params.content) {
                this.content.text = this.params.content;
            }
            if (this.params.resourceTxt1 && !StringHelper.isNullOrEmpty(this.params.resourceTxt1)) {
                this.resourceTxt1.text = this.params.resourceTxt1;
                this.resourceTxt1.visible = true;
            }
            else {
                this.resourceTxt1.visible = false;
            }
            if (this.params.needCount) {
                this._needCount = this.params.needCount;
            }
            if (this.params.type) {
                this._type = this.params.type;
                this.c1.selectedIndex = this._type;
            }
            this.diamondNumTxt.text = (this._needCount * this._price).toString();
        }
        this.addSceneEvent();
    }

    private addSceneEvent() {
        NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.onSceneSwitch, this);
        this.check2Btn.onClick(this, this.check2BtnHander);
    }

    private offSceneEvent() {
        NotificationManager.Instance.addEventListener(NotificationEvent.SWITCH_SCENE, this.onSceneSwitch, this);
        this.check2Btn.offClick(this, this.check2BtnHander);
    }

    private check2BtnHander() {
        if (!this.check2Btn.selected) {
            this.c1.selectedIndex = 1;
        }
        else {
            this.c1.selectedIndex = 0;
        }
    }

    private onSceneSwitch() {
        this.hide();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    /**确定点击回调 */
    confirmBtnClick() {
        if (this._type == 2) {//道具数量足够
            this.ctr.getExtraReward();
            this.hide();
        } else {//道具数量不足
            if (this.check2Btn.selected) {//勾选了使用钻石替代
                if (ShopManager.Instance.isCannotUsePoint) {
                    return
                }
                if (this.playerInfo.point + this.playerInfo.giftToken < this._price * this._needCount) {//钻石总量不够
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ExpBackShowTipsWnd.diamond.notEnough"));
                    return;
                }
                else {
                    this.ctr.getExtraReward();
                    this.hide();
                }
            }
            else {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ExpBackItem.cost.notEnough"));
                return;
            }
        }
    }

    /**取消回调 */
    cancelBtnClick() {
        this.hide();
    }

    /**关闭点击 */
    protected OnBtnClose() {
        this.hide();
    }

    private get ctr(): ExpBackCtr {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.ExpBackWnd) as ExpBackCtr;
    }

    public OnHideWind(): void {
        super.OnHideWind();
        this.offSceneEvent();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}