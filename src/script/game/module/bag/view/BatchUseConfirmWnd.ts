import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerBufferInfo } from "../../../datas/playerinfo/PlayerBufferInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import { PlayerBufferManager } from "../../../manager/PlayerBufferManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ResourceManager } from "../../../manager/ResourceManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { PetData } from "../../pet/data/PetData";
import { NumericStepper } from "../../../component/NumericStepper";
import { BaseItem } from "../../../component/item/BaseItem";
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FashionManager } from "../../../manager/FashionManager";

/**
 * @description 背包物品批量使用界面
 * @author yuanzhan.yu
 * @date 2021/3/5 14:48
 * @ver 1.0
 *
 */
export class BatchUseConfirmWnd extends BaseWindow {
    public modelEnable: boolean = false;
    public item: BaseItem;
    public btn_cancel: UIButton
    public btn_sure: UIButton
    public stepper: NumericStepper;
    public txt_name: fgui.GTextField;
    public txt_hasNum: fgui.GTextField;

    private _currCount: number = 0;
    private _info: GoodsInfo;
    private _handler: Laya.Handler;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this._info = this.params[0];
        this.updateView();
        this.addEventListener();
        this.setCenter();
    }

    private addEventListener() {
        this.btn_cancel.onClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.onClick(this, this.onBtnSureClick.bind(this));
    }

    public OnShowWind() {
        super.OnShowWind();

        this.updateCount();
    }

    private updateCount() {
        let initValue = this._info.count;
        let limitValue = initValue;
        if (this._info.isWearyItem) {
            let wearyCanGet: number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
            let wearyTodayCanGet: number = PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
            let wearyTemp = Math.min(wearyTodayCanGet, wearyCanGet);
            let sugestCount = Math.floor(wearyTemp / this._info.templateInfo.Property2);
            if (sugestCount < 1) {
                sugestCount = 1;
            }
            let ownCount = GoodsManager.Instance.getGoodsNumByTempId(this._info.templateId);//拥有数量
            initValue = Math.max(this._info.count, sugestCount);
            initValue = Math.min(ownCount, initValue);
            limitValue = initValue;
        }
        this._currCount = initValue;

        this._handler && this._handler.recover();
        this._handler = null;
        this._handler = Laya.Handler.create(this, this.stepperChangeHandler, null, false);
        this.stepper.show(1, initValue, 1, 999, limitValue, 1, this._handler);
    }

    private updateView() {
        this.item.info = this._info;
        this.txt_name.text = this._info.templateInfo.TemplateNameLang;
        this.txt_name.color = FilterFrameText.Colors[eFilterFrameText.ItemQuality][this._info.templateInfo.Profile - 1];
        this.txt_hasNum.text = GoodsManager.Instance.getGoodsNumByTempId(this._info.templateId) + "";
    }

    private stepperChangeHandler(value: number) {
        this._currCount = value;
    }

    private onBtnCancelClick() {
        this.hide();
    }

    protected onBtnSureClick() {
        let data: GoodsInfo = this._info;
        let str: string = "";
        if (!data || this._currCount <= 0) {
            this.hide();
            return;
        }
        if (data.templateInfo.SonType == GoodsSonType.SONTYPE_BLOOD) {
            SocketSendManager.Instance.sendUseItem(data.pos, this._currCount);
            this.hide();
        } else if (data.templateInfo.SonType == GoodsSonType.SONTYPE_VIP_BOX) {
            if (MopupManager.Instance.model.isMopup) {
                str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                MessageTipManager.Instance.show(str);
                return;
            }
            // MaskUtils.instance.maskShow(0);
            SocketSendManager.Instance.sendUseVipMoney();
            this.hide();
        } else if (data.templateInfo.SonType == GoodsSonType.SONTYPE_ROSE) {
            // CheckUIModuleUtil.Instance.tryCall(UIModuleTypes.FRIENDS,this.openRosePresentCall,[data,this._currCount]);
            this.hide();
        } else if (data.templateInfo.SonType == GoodsSonType.SONTYPE_PET_EXP_BOOK) {
            this.checkForUsePetExpBook(data, this._currCount);
            this.hide();
        } else if (data.templateInfo.SonType == GoodsSonType.SONTYPE_MULTI_BOX) { //多选宝箱
            // UIManager.Instance.ShowWind(EmWindow.MultiBoxSelectWnd, [this._info, this._currCount]);
            UIManager.Instance.ShowWind(EmWindow.PreviewBoxWnd, [this._info, this._currCount, false]);
            this.hide();
        }
        else if (data.templateInfo.SonType == GoodsSonType.SONTYPE_BOX) {
            switch (data.templateInfo.Property2) {
                case -800: //荣耀水晶
                    if (this.thane.gloryPoint < data.templateInfo.Property3 * this._currCount) {
                        //荣耀水晶不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -700: //经验
                    if (ResourceManager.Instance.gold.count < data.templateInfo.Property3 * this._currCount) {
                        //经验不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -600: //光晶
                    if (ResourceManager.Instance.waterCrystal.count < data.templateInfo.Property3 * this._currCount) {
                        //光晶不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -500: //绑定钻石
                    if (this.playerInfo.giftToken < data.templateInfo.Property3 * this._currCount) {
                        //绑定钻石不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -400: //钻石
                    if (this.playerInfo.point < data.templateInfo.Property3 * this._currCount) {
                        //钻石不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -300: //战魂
                    if (ResourceManager.Instance.gold.count < data.templateInfo.Property3 * this._currCount) {
                        //战魂不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -200: //紫晶
                    if (this.playerInfo.mineral < data.templateInfo.Property3 * this._currCount) {
                        //紫晶不足
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                case -100: //黄金
                    if (ResourceManager.Instance.gold.count < data.templateInfo.Property3 * this._currCount) {
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
                default:
                    if (GoodsManager.Instance.getGoodsNumByTempId(data.templateInfo.Property2) < data.templateInfo.Property3 * this._currCount) {
                        str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08"); //开启宝箱需要消耗的物品不足, 不能开启
                        MessageTipManager.Instance.show(str);
                    }
                    else {
                        this.checkForUseBox(data, this._currCount);
                    }
                    break;
            }

            this.hide();
        }
        else if (FashionManager.Instance.getOptType(this._info).length > 0) {
            FashionManager.Instance.putInOut(this._info, this._currCount);
            this.hide();
        }
        else if (this.check()) {
            let itemBuffer: PlayerBufferInfo = PlayerBufferManager.Instance.getItemBufferInfo(data.templateInfo.Property1);
            if (itemBuffer) {
                if (data.templateInfo.Property3 < itemBuffer.grade) {
                    let str: string = LangManager.Instance.GetTranslation("bag.view.MulItemUseFrame.command02");
                    MessageTipManager.Instance.show(str)
                    this.hide();
                    return;
                }
                SocketSendManager.Instance.sendUseItem(data.pos, this._currCount);
            }
            else {
                if (data.templateInfo.Property1 == 5 && data.templateInfo.Property2 > 0) {
                    let wearyGet: number = data.templateInfo.Property2 * this._currCount;
                    let pos: number = data.pos;
                    if (!this.checkWearyCanGet(wearyGet, pos, this._currCount)) {
                        this.hide();
                        return;
                    }
                    else {
                        if (!this.checkWearyTodayCanGet(wearyGet, pos, this._currCount)) {
                            this.hide();
                            return;
                        }
                    }
                }
                SocketSendManager.Instance.sendUseItem(data.pos, this._currCount);
            }
            this.hide();
        }
    }

    private checkForUseBox(item: GoodsInfo, num: number) {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let itemconfig: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, item.templateInfo.Property2);
        let costName: string = itemconfig.TemplateNameLang;
        let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command09", num, item.templateInfo.TemplateNameLang, num * item.templateInfo.Property3, costName);
        SimpleAlertHelper.Instance.Show(undefined, [item, num], prompt, content, confirm, cancel, this.useBoxCallBack.bind(this));
    }

    private useBoxCallBack(b: boolean, flag: boolean, data: any) {
        if (b) {
            let item: GoodsInfo = data[0];
            let num: number = data[1];
            SocketSendManager.Instance.sendUseItem(item.pos, num);
        }
    }

    /** 使用英灵经验书时 弹出确认框 */
    private checkForUsePetExpBook(item: GoodsInfo, count: number) {
        let exp: number = item.templateInfo.Property2 * count;
        let confirm3: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel3: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt3: string = LangManager.Instance.GetTranslation("public.prompt");
        let content3: string = LangManager.Instance.GetTranslation("checkForUsePetExpBook.content02", exp);
        SimpleAlertHelper.Instance.Show(undefined, [item, count], prompt3, content3, confirm3, cancel3, this.checkForUsePetExpBookBack.bind(this));
    }

    private checkForUsePetExpBookBack(result: boolean, flag: boolean, data: any) {
        if (!result) {
            return;
        }

        let item: GoodsInfo = data[0];
        let count: number = data[1];
        if (!item) {
            return;
        }
        let curPet: PetData = this.playerInfo.enterWarPet;
        let msg: string;
        if (!curPet) {
            msg = LangManager.Instance.GetTranslation("checkForUsePetExpBook.content01");
            MessageTipManager.Instance.show(msg);
            return;
        }
        if (curPet.isFullExp()) {
            msg = LangManager.Instance.GetTranslation("PetSwallowView.fullExp");
            MessageTipManager.Instance.show(msg);
            return;
        }
        SocketSendManager.Instance.sendUseItem(item.pos, count);
    }

    private checkWearyCanGet(wearyGet: number, pos: number, count: number = 1): boolean {
        // let wearyCanGet: number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
        // if (wearyGet > wearyCanGet) {
        //     // let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        //     // let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        //     // let prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
        //     // let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command07", PlayerInfo.WEARY_MAX, wearyCanGet);
        //     // SimpleAlertHelper.Instance.Show(undefined, [wearyGet, pos, count], prompt, content, confirm, cancel, this.wearyCanGetCallBack.bind(this));
        //     return false;
        // }
        return true;
    }

    private checkWearyTodayCanGet(wearyGet: number, pos: number, count: number = 1): boolean {
        let wearyTodayCanGet: number = PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
        if (wearyGet > wearyTodayCanGet) {
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
            let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command06", PlayerInfo.WEARY_GET_MAX, wearyTodayCanGet);
            SimpleAlertHelper.Instance.Show(undefined, [wearyGet, pos, count, true], prompt, content, confirm, cancel, this.wearyTodayCanGetCallBack.bind(this));
            return false;
        }
        return true;
    }

    private wearyCanGetCallBack(b: boolean, flag: boolean, data: any) {
        if (b) {
            let wearyGet: number = data[0];
            let pos: number = data[1];
            let count: number = data[2];
            if (this.checkWearyTodayCanGet(wearyGet, pos, count)) {
                SocketSendManager.Instance.sendUseItem(pos, count);
            }
        }
    }

    private wearyTodayCanGetCallBack(b: boolean, flag: boolean, data: any) {
        if (b) {
            let wearyGet: number = data[0];
            let pos: number = data[1];
            let count: number = data[2];
            let today: number = data[3];
            SocketSendManager.Instance.sendUseItem(pos, count);
        }
    }

    // private openRosePresentCall(data:any[])
    // {
    //     let presentView:RosePresentView = ComponentFactory.Instance.creatComponentByStylename("friends.RosePresentView");
    //     presentView.setData(data[0],data[1]);
    //     presentView.show();
    // }

    private callBack(b: boolean, pos: number) {
        if (b) {
            SocketSendManager.Instance.sendUseItem(this._info.pos, this._currCount);
            this.hide();
        }
    }

    private check(): boolean {
        if (this._info.templateInfo.Property1 == 8 && this.playerInfo.consortiaID == 0) {
            let str: string = LangManager.Instance.GetTranslation("bag.view.MulItemUseFrame.command03");
            MessageTipManager.Instance.show(str);
            this.hide();
            return false;
        }
        return true;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEventListener();
    }

    private removeEventListener() {
        this.btn_cancel.offClick(this, this.onBtnCancelClick.bind(this));
        this.btn_sure.offClick(this, this.onBtnSureClick.bind(this));
    }

    protected get modelAlpha() {
        return 0
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
        this._handler && this._handler.recover();
        this._handler=null;
        this._info = null;
    }
}