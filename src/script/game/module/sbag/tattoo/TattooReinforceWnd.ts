// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ArmyEvent } from "../../../constant/event/NotificationEvent";
import { RoleCtrl } from "../../bag/control/RoleCtrl";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TattooModel } from "./model/TattooModel";
import { TattooHole } from "./model/TattooHole";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import LangManager from "../../../../core/lang/LangManager";
import UIManager from "../../../../core/ui/UIManager";
import UIButton from "../../../../core/ui/UIButton";
import { TattooHoleView } from "./TattooHoleView";
import { GoodsManager } from "../../../manager/GoodsManager";
import { BagType } from "../../../constant/BagDefine";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FUIHelper from "../../../utils/FUIHelper";
import BaseTipItem from "../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { SharedManager } from "../../../manager/SharedManager";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/11/17 18:26
 * @ver 1.0
 */
export class TattooReinforceWnd extends BaseWindow {
    public baptize: fgui.Controller;
    public frame: fgui.GLabel;
    public txt_update_property_type_0: fgui.GTextField;
    public txt_update_property_type_1: fgui.GTextField;
    public txt_update_property_value_0: fgui.GTextField;
    public txt_update_property_value_1: fgui.GTextField;
    public txt_update_property_value_new_0: fgui.GTextField;
    public txt_update_property_value_new_1: fgui.GTextField;
    public txt_material_update: fgui.GTextField;
    public btn_update: UIButton;
    public txt_tips_update: fgui.GTextField;
    public txt_material_update_advance: fgui.GTextField;
    public btn_update_advance: UIButton;
    public txt_tips_update_advance: fgui.GTextField;
    public txt_material_baptize: fgui.GTextField;
    public btn_baptize: UIButton;
    public txt_tips_baptize: fgui.GTextField;
    public txt_baptize_property_type_0: fgui.GTextField;
    public txt_baptize_property_type_1: fgui.GTextField;
    public txt_baptize_property_value_0: fgui.GTextField;
    public txt_baptize_property_value_1: fgui.GTextField;
    public icon_tattoo: TattooHoleView;
    public btn_replace: UIButton;
    public icon_dragonCrystal: fgui.GButton;
    public icon_dragonCrystal2: fgui.GButton;
    public icon_z: BaseTipItem;

    private _index: number = 0;
    private _oldAddValue: number = 0;

    constructor() {
        super();
    }

    OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.initEvent();
        this.setCenter();
    }

    private initData() {
        this.baptize = this.getController("baptize");
    }

    private initView() {
        let goods: GoodsInfo = new GoodsInfo();
        goods.templateId = TattooModel.DragonCrystalId;
        FUIHelper.setTipData(this.icon_dragonCrystal, EmWindow.NewPropTips, goods);
        let goods2: GoodsInfo = new GoodsInfo();
        goods2.templateId = TattooModel.DragonCrystalId2;
        FUIHelper.setTipData(this.icon_dragonCrystal2, EmWindow.NewPropTips, goods2);

        if (this.tattooModel.showBind) {
            this.icon_z.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
        }
        else {
            this.icon_z.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        }

        this.baptize.selectedIndex = 0;
        this.txt_update_property_type_0.text = "";
        this.txt_update_property_type_1.text = "";
        this.txt_update_property_value_0.text = "";
        this.txt_update_property_value_1.text = "";
        this.txt_update_property_value_new_0.text = "";
        this.txt_update_property_value_new_1.text = "";

        this.updateTattooInfo();
    }

    private initEvent() {
        this.btn_update.onClick(this, this.__onUpdateBtnClick);
        this.btn_update_advance.onClick(this, this.__onUpdateAdvanceBtnClick);
        this.btn_replace.onClick(this, this.__onReplaceAttriBtnClick);
        this.btn_baptize.onClick(this, this.__onBaptizeBtnClick);
        NotificationManager.Instance.addEventListener(ArmyEvent.TATTOO_INFO, this.updateTattooInfo, this);
    }

    OnShowWind() {
        super.OnShowWind();
    }

    /*********************************** 洗炼 ********************************* */
    private __onBaptizeBtnClick(): void {
        if (!this.tattooModel.hasNotReplaceProperty()) {
            this.alertBaptizeUseDiamond()
            return
        }

        let isAlert = SharedManager.Instance.checkIsExpired(SharedManager.Instance.tattooBaptizeCheckDate)
        if (!isAlert) {
            this.alertBaptizeUseDiamond()
            return
        }

        /** 提示：洗炼属性尚未替换，是否再次洗炼？ */
        let content: string = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattoo7");
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
            content: content, backFunction: (b) => {
                this.alertBaptizeUseDiamond()
                if (b) {
                    SharedManager.Instance.tattooBaptizeCheckDate = new Date();
                    SharedManager.Instance.saveTattooBaptizeCheckDate();
                }
            }, state: 2
        });
    }

    /** 提示: 是否消耗{0}钻石进行洗炼？*/
    private alertBaptizeUseDiamond(): void {
        if (this.tattooModel.notAlertBaptizeUseDiamond) {
            this.alertBaptizeUseDiamondBack(true);
        }
        else {
            let content: string = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattoo1", this.tattooModel.tattooBaptizePrice);
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.alertBaptizeUseDiamondBack.bind(this)});
        }
    }

    private alertBaptizeUseDiamondBack(check1: boolean = false, check2: boolean = true): void {
        if (check1) {
            this.tattooModel.notAlertBaptizeUseDiamond = true;
        }

        this.tattooModel.showBind = check2;
        if (this.tattooModel.showBind) {
            this.icon_z.setInfo(TemplateIDConstant.TEMP_ID_GIFT);
        }
        else {
            this.icon_z.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND);
        }

        if (check2) {
            if (this.playerInfo.point + this.playerInfo.giftToken < this.tattooModel.tattooBaptizePrice) {
                RechargeAlertMannager.Instance.show();
            }
            else {
                this.tattooController.sendRefresh(this.tattooController.tattooModel.currHoleIndex, 2);
            }
        }
        else {
            if (this.playerInfo.point < this.tattooModel.tattooBaptizePrice) {
                RechargeAlertMannager.Instance.show();
            }
            else {
                this.tattooController.sendRefresh(this.tattooController.tattooModel.currHoleIndex, 1);
            }
        }
    }

    /*********************************** 升级 **********************************/
    private __onUpdateBtnClick(): void {
        if (!this.tattooModel.hasNotReplaceProperty()) {
            this.alertUpdateUseDiamond()
            return
        }

        let isAlert = SharedManager.Instance.checkIsExpired(SharedManager.Instance.tattooUpdateCheckDate)
        if (!isAlert) {
            this.alertUpdateUseDiamond()
            return
        }

        /** 提示：升级会清空尚未保存的洗炼属性，是否确认？ */
        let content: string = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattoo6");
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
            content: content, backFunction: (b) => {
                this.alertUpdateUseDiamond()
                if (b) {
                    SharedManager.Instance.tattooUpdateCheckDate = new Date();
                    SharedManager.Instance.saveTattooUpdateCheckDate();
                }
            }, state: 2
        });
    }

    private alertUpdateUseDiamond(): void {
        if (this.tattooModel.notAlertUpdateUseDiamond) {
            this.alertUpdateUseDiamondBack();
            return;
        }

        /** 提示：已达到当前阶级上限，升级无法提供数值，仅调整属性类型，是够确认继续升级？ */
        let hole: TattooHole = this.holes[this._index];
        if (hole.oldStep >= this.tattooModel.coreStep && this._oldAddValue >= this.tattooModel.getProtertyValueMaxByStep(hole.oldStep)) {
            let content: string = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattoo2");
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.alertUpdateUseDiamondBack.bind(this), state: 2 });
        }
        else {
            this.alertUpdateUseDiamondBack();
        }
    }
    
    private alertUpdateUseDiamondBack(check: boolean = false): void {
        if (check) {
            this.tattooModel.notAlertUpdateUseDiamond = true;
        }
        this.tattooController.sendUpgrade(this.tattooController.tattooModel.currHoleIndex);
    }

    /*********************************** 高级升级 **********************************/
    private __onUpdateAdvanceBtnClick(): void {
        if (!this.tattooModel.hasNotReplaceProperty()) {
            this.alertUpdateAdvanceUseDiamond()
            return
        }

        let isAlert = SharedManager.Instance.checkIsExpired(SharedManager.Instance.tattooUpdateCheckDate)
        if (!isAlert) {
            this.alertUpdateAdvanceUseDiamond()
            return
        }


        /** 提示：升级会清空尚未保存的洗炼属性，是否确认？ */
        let content: string = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattoo6");
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
            content: content, backFunction: (b) => {
                this.alertUpdateAdvanceUseDiamond()
                if (b) {
                    SharedManager.Instance.tattooUpdateCheckDate = new Date();
                    SharedManager.Instance.saveTattooUpdateCheckDate();
                }
            }, state: 2
        });
    }

    private alertUpdateAdvanceUseDiamond(): void { 
        if (this.tattooModel.notAlertUpdateAdvanceUseDiamond) {
            this.alertUpdateAdvanceUseDiamondBack();
            return;
        }

        /** 提示：当前龙纹升级属性值将溢出，是否确认使用高级龙晶继续升级？ */
        let hole: TattooHole = this.holes[this._index];
        if (this._oldAddValue + 10 > this.tattooModel.getProtertyValueMaxByStep(hole.oldStep)) {
            let content: string = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattoo3");
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.alertUpdateAdvanceUseDiamondBack.bind(this), state: 2 });
        }
        else {
            this.alertUpdateAdvanceUseDiamondBack();
        }
    }

    private alertUpdateAdvanceUseDiamondBack(check: boolean = false): void {
        if (check) {
            this.tattooModel.notAlertUpdateAdvanceUseDiamond = true;
        }
        this.tattooController.sendSeniorUpgrade(this.tattooController.tattooModel.currHoleIndex);
    }


    private __onReplaceAttriBtnClick(): void {
        this.tattooController.sendReplace(this.tattooController.tattooModel.currHoleIndex);
    }

    private updateTattooInfo(): void {
        this.refresh();
        this.refreshPoint();
    }

    public refresh(): void {
        this._index = this.tattooModel.currHoleIndex;
        let hole: TattooHole = this.holes[this._index];
        if (!hole) {
            hole = new TattooHole();
        }
        let addPropertyStr: string = "";
        let reducePropertyStr: string = "";
        // this.btn_baptize.enabled = true;

        if ((this.tattooModel.lastOpType == RoleCtrl.OP_BAPTIZE || this.tattooModel.lastOpType == RoleCtrl.OP_INFO) && (hole.newAddProperty > 0 || hole.newReduceProperty > 0)
            && (hole.newAddingValue > 0 || hole.newReduceValue > 0)) {
            this.baptize.selectedIndex = 1;

            addPropertyStr = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + hole.newAddProperty);
            reducePropertyStr = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + hole.newReduceProperty);
            this.txt_baptize_property_type_0.text = addPropertyStr;
            this.txt_baptize_property_type_1.text = reducePropertyStr;
            this.txt_baptize_property_value_0.text = "+" + hole.newAddingValue;
            this.txt_baptize_property_value_1.text = "" + hole.newReduceValue;
        }
        else {
            this.baptize.selectedIndex = 0;
        }
        this.icon_tattoo.visible = hole.oldAddProperty > 0;

        if (hole.oldAddProperty > 0) {
            this.icon_tattoo.setHoleInfo(2, hole);

            this._oldAddValue = hole.oldAddingValue;
            addPropertyStr = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + hole.oldAddProperty);
            reducePropertyStr = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + hole.oldReduceProperty);

            this.txt_update_property_type_0.text = addPropertyStr;
            this.txt_update_property_type_1.text = reducePropertyStr;
            this.txt_update_property_value_0.text = "+" + hole.oldAddingValue;
            this.txt_update_property_value_1.text = "" + hole.oldReduceValue;
            this.txt_update_property_value_new_0.text = "";
            this.txt_update_property_value_new_1.text = "";
        }

        if (hole.newAddProperty > 0 && (this.tattooModel.lastOpType == RoleCtrl.OP_REFRESH || this.tattooModel.lastOpType == RoleCtrl.OP_ADVANCE_REFRESH)) {
            this.icon_tattoo.setHoleInfo(3, hole);
            addPropertyStr = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + hole.newAddProperty);
            reducePropertyStr = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.propertyName" + hole.newReduceProperty);

            this.txt_update_property_type_0.text = addPropertyStr;
            this.txt_update_property_type_1.text = reducePropertyStr;
            this.txt_update_property_value_0.text = "+" + hole.newAddingValue;
            this.txt_update_property_value_1.text = "" + hole.newReduceValue;
            let deltaAdd: number = hole.newAddingValue - hole.lastAddingValue;
            this.txt_update_property_value_new_0.text = (deltaAdd > 0 ? "+" : "") + (deltaAdd != 0 ? deltaAdd : "");
            this.txt_update_property_value_new_0.color = deltaAdd > 0 ? "#71F000" : "#FF2E2E";
            let deltaReduce: number = hole.newReduceValue - hole.lastReduceValue;
            this.txt_update_property_value_new_1.text = (deltaReduce > 0 ? "+" : "") + (deltaReduce != 0 ? deltaReduce : "");
            this.txt_update_property_value_new_1.color = deltaReduce > 0 ? "#71F000" : "#FF2E2E";
        }

        this.txt_material_update.text = this.tattooModel.tattooConsumeNum + "";
        this.txt_material_update_advance.text = this.tattooModel.tattooConsumeNum + "";
        // this.txt_tips_update.text = this.getTattooAddRange(hole);
        this.txt_tips_update_advance.text = LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.AddPropertyTips2")

        this.txt_material_baptize.text = this.tattooModel.tattooBaptizePrice + "";
    }

    private refreshPoint(): void {
        this.btn_update.enabled = this.tattooModel.canUpgrade();
        this.btn_update_advance.enabled = this.tattooModel.canUpgrade2();
        this.btn_baptize.enabled = this.tattooModel.canBaptize(this.holes[this.tattooModel.currHoleIndex]);
        let hasNum: number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, TattooModel.DragonCrystalId);
        this.txt_material_update.color = hasNum >= this.tattooModel.tattooConsumeNum ? '#FFECC6' : '#FF0000';
        let hasNum2: number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, TattooModel.DragonCrystalId2);
        this.txt_material_update_advance.color = hasNum2 >= this.tattooModel.tattooConsumeNum ? '#FFECC6' : '#FF0000';
    }

    private getTattooAddRange(hole: TattooHole): string {
        let max: number = this.tattooModel.getTattooMaxAddValue(hole);
        if (max > 1) {
            return LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.AddProperty") + "1~" + max;
        }
        else if (max == 1) {
            return LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.AddProperty") + "1";
        }
        else {
            return LangManager.Instance.GetTranslation("tattoo.TattooPopFrame.tattooCannotAdd");
        }
    }

    private removeEvent() {
        this.btn_update.offClick(this, this.__onUpdateBtnClick);
        this.btn_update_advance.offClick(this, this.__onUpdateAdvanceBtnClick);
        this.btn_replace.offClick(this, this.__onReplaceAttriBtnClick);
        this.btn_baptize.offClick(this, this.__onBaptizeBtnClick);
        NotificationManager.Instance.removeEventListener(ArmyEvent.TATTOO_INFO, this.updateTattooInfo, this);
    }

    private get tattooController(): RoleCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
    }

    private get tattooModel(): TattooModel {
        return this.tattooController.tattooModel;
    }

    private get holes(): TattooHole[] {
        return this.tattooController.tattooModel.holes;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    helpBtnClick() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation('tattoo.TattooBaptizeWnd.helpContent02');
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}