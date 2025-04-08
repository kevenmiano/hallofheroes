import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_configData } from "../../config/t_s_config";
import ColorConstant from "../../constant/ColorConstant";
import { ConfigType } from "../../constant/ConfigDefine";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { EmWindow } from "../../constant/UIDefine";
import { ExpBackEvent } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import FUIHelper from "../../utils/FUIHelper";
import UIHelper from "../../utils/UIHelper";
import ExpBackCtr from "./control/ExpBackCtr";
import ExpBackModel from "./model/ExpBackModel";

export default class ExpBackWnd extends BaseWindow {
    public c1: fgui.Controller;
    public frame: fgui.GLabel;
    public coinBtn: UIButton;
    public countTxt: fgui.GTextField;
    public descTxt: fgui.GRichTextField;
    public expNumTxt: fgui.GTextField;
    public goldNumTxt: fgui.GTextField;
    public getBtn: fgui.GButton;
    public costNumTxt: fgui.GTextField;
    public extraGetBtn: fgui.GButton;
    private _type: number = 0;//1 免费领取 2额外领取 
    public static RECOVER_ID: number = 2131020;
    private _needCount: number = 20;
    private _expValue: number = 0;
    private _goldValue: number = 0;
    private _price:number = 0;
    private _hasNeedCount:number = 0;
    public OnInitWind() {
        super.OnInitWind();
        this.c1 = this.getController("c1");
        this.initData();
        this.addEvent();
        this.setCenter();
        this.refreshView();
    }

    /**
     * 界面展示
     */
    OnShowWind() {
        super.OnShowWind();
    }

    private initData() {
        this.coinBtn.scaleParas.paraScale = 1;
        let goodsInfo1: GoodsInfo = new GoodsInfo();
        goodsInfo1.templateId = TemplateIDConstant.TEMP_ID_WENZHANG;
        FUIHelper.setTipData(this.coinBtn.view, EmWindow.NewPropTips, goodsInfo1);
        this._price = ConfigInfoManager.Instance.getRecoverPoint();
    }

    private refreshView() {
        this._type = ExpBackModel.instance.openState;
        this.c1.selectedIndex = this._type - 1;
        this.countTxt.text = GoodsManager.Instance.getGoodsNumByTempId(ExpBackWnd.RECOVER_ID) + "";
        if (this.c1.selectedIndex == 1) {//额外领取
            let temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_config, "recover_consume") as t_s_configData;
            if (temp) {
                this._needCount = parseInt(temp.ConfigValue);
            }
            this.costNumTxt.text = this._needCount.toString();
            if (this._needCount > GoodsManager.Instance.getGoodsNumByTempId(ExpBackWnd.RECOVER_ID)) {//道具不足, 红色显示
                this.costNumTxt.color = ColorConstant.RED_COLOR;
            } else {
                this.costNumTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
            }
            this._expValue = ExpBackModel.instance.extraExpValue;
            this._goldValue = ExpBackModel.instance.extraGoldValue;
            this.expNumTxt.text = this._expValue.toString();
            this.goldNumTxt.text = this._goldValue.toString();
        } else {//免费领取
            this._expValue = ExpBackModel.instance.freeExpValue;
            this._goldValue = ExpBackModel.instance.freeGoldValue;
            this.expNumTxt.text = this._expValue.toString();
            this.goldNumTxt.text = this._goldValue.toString();
        }
    }

    addEvent() {
        this.getBtn.onClick(this, this.getBtnHandler);
        this.extraGetBtn.onClick(this, this.extraGetBtnHandler);
        NotificationManager.Instance.addEventListener(ExpBackEvent.UPDATE_EXPBACK_STATUS, this.backResultHandler, this);
    }

    removeEvent() {
        this.getBtn.offClick(this, this.getBtnHandler);
        this.extraGetBtn.offClick(this, this.extraGetBtnHandler);
        NotificationManager.Instance.addEventListener(ExpBackEvent.UPDATE_EXPBACK_STATUS, this.backResultHandler, this);
    }

    /**
     * 免费领取
     */
    private getBtnHandler() {
        this.ctr.getComReward();
    }

    /**
     * 额外领取
     */
    private extraGetBtnHandler() {
        this._hasNeedCount = this._needCount - this.hasCount;//需要购买的修炼纹章数量
        let needPoint: number = this._hasNeedCount*this._price;
        let content: string = LangManager.Instance.GetTranslation("ExpBackItem.advBtnHandler.tips", needPoint);
        if (this.hasCount < this._needCount)//材料不足
        {
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, point:needPoint,backFunction: this.alertCallback.bind(this), state: 1 });
        }
        else {//材料足
            this.ctr.getExtraReward();
        }
    }

    alertCallback(noAlert:boolean,isCheck:boolean){
        if(isCheck){//勾了优先使用绑定钻石
            //判断钻石数量够不够
            if (this.playerInfo.point + this.playerInfo.giftToken < this._hasNeedCount*this._price) {//钻石总量不够
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ExpBackShowTipsWnd.diamond.notEnough"));
                return;
            }
            this.ctr.getExtraReward();
        }else{
            if(this.playerInfo.point < this._hasNeedCount*this._price){
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ExpBackShowTipsWnd.diamond.notEnough"));
                return;
            }
            this.ctr.getExtraReward(0);
        }
    }
    
    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private backResultHandler(type: number) {
        if (type == 3 || type == 0) {//领取成功或者重置关闭界面
            this.hide();
        } else {
            this.refreshView();
        }
    }
    /**
     * 关闭界面
     */
    OnHideWind() {
        super.OnHideWind();
    }

    private get ctr(): ExpBackCtr {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.ExpBackWnd) as ExpBackCtr;
    }

    private get hasCount(): number {
        return GoodsManager.Instance.getGoodsNumByTempId(ExpBackWnd.RECOVER_ID)
    }

    dispose(dispose?: boolean) {
        this.removeEvent();
        super.dispose();
    }
}