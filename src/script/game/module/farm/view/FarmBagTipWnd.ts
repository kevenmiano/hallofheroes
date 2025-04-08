import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { BaseIcon } from "../../../component/BaseIcon";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import ComponentSetting from "../../../utils/ComponentSetting";
import { BagHelper } from "../../bag/utils/BagHelper";

export default class FarmBagTipWnd extends BaseWindow {
    public seedIcon: fgui.GLoader;
    public goodsNameTxt: fgui.GTextField;
    public needTimeTxt: fgui.GTextField;
    public getGoldTxt: fgui.GTextField;
    private _info: GoodsInfo;
    public baseIcon: BaseIcon;
    public bindTxt: fgui.GTextField;
    public priceTxt: fgui.GTextField;
    public btn_use: fgui.GButton;
    private _canOperate: boolean = false;
    public txt_owned: fgui.GTextField;

    public totalBox: fgui.GGroup;
    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.updateView();
        this.addEvent()
        this.totalBox.ensureBoundsCorrect();
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private addEvent() {
        this.btn_use.onClick(this, this.onBtnUseClick.bind(this));
    }

    private removeEvent() {
        this.btn_use.offClick(this, this.onBtnUseClick.bind(this));
    }

    private onBtnUseClick() {
        if (BagHelper.isOpenConsortiaStorageWnd()) {
            BagHelper.consortiaStorageOperate(this._info);
            this.hide();
        }
    }

    private initData() {
        [this._info, this._canOperate] = this.params;
    }

    private updateView() {
        if (this._info) {
            var gTemp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this._info.templateId);
            if (gTemp) {
                var tempStr: string = "";
                this.baseIcon.setIcon(IconFactory.getGoodsIconByTID(gTemp.TemplateId));
                var outputTemp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gTemp.Property2);
                let arr = gTemp.TemplateNameLang.split('-');
                this.goodsNameTxt.text = arr[0];
                this.goodsNameTxt.color = ComponentSetting.setFarmItemColor(gTemp.Profile);
                if (parseInt((gTemp.Property1 / 60).toString()) <= 0)
                    tempStr = LangManager.Instance.GetTranslation("public.needMinutes", gTemp.Property1 % 60);
                else if (gTemp.Property1 % 60 == 0)
                    tempStr = parseInt((gTemp.Property1 / 60).toString()) + LangManager.Instance.GetTranslation("public.time.hour");
                else
                    tempStr = LangManager.Instance.GetTranslation("public.needHM", parseFloat((gTemp.Property1 / 60).toString()), gTemp.Property1 % 60);
                this.needTimeTxt.text = tempStr;
                if (outputTemp)
                    tempStr = gTemp.Property3 + " " +outputTemp.TemplateNameLang;
                else
                    tempStr = gTemp.Property3.toString();
                this.getGoldTxt.text = tempStr;
                if (this._info.id != 0) {
                    if (this._info.isBinds) {
                        this.bindTxt.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind1");
                        this.bindTxt.color = "#FF0000";
                    }
                    else {
                        this.bindTxt.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind2");
                        this.bindTxt.color = "#FFECC6";
                    }
                    this.priceTxt.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.price", gTemp.SellGold);
                }
                else {
                    this.priceTxt.text = "";
                    this.bindTxt.text = "";
                }
                this.bindTxt.visible = false;


                let count = BagHelper.Instance.getUserCount(this._info.templateId);
                if (this._info.templateId == TemplateIDConstant.TEMP_ID_VIP_EXP) {//vip经验不显示数量
                    this.txt_owned.text = "";
                    this.txt_owned.visible = false;
                } else {
                    this.txt_owned.setVar("count", count + "").flushVars();
                    this.txt_owned.visible = true;
                }

            }
        }
        if (BagHelper.isOpenConsortiaStorageWnd()) {
            this.btn_use.visible = true;
            this.btn_use.title = BagHelper.getText(this._info);
        }
        else {
            this.btn_use.visible = false;
        }
    }

    protected OnClickModal() {
        super.OnClickModal();
        this.hide();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}