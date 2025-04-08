// @ts-nocheck
import FUI_FarmShopItem from "../../../../../../fui/Farm/FUI_FarmShopItem";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { ShopGoodsInfo } from "../../../shop/model/ShopGoodsInfo";
import LangManager from '../../../../../core/lang/LangManager';
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { BaseItem } from "../../../../component/item/BaseItem";
import { FarmManager } from "../../../../manager/FarmManager";
import { FarmModel } from "../../data/FarmModel";
import { UIFilter } from '../../../../../core/ui/UIFilter';
import ComponentSetting from '../../../../utils/ComponentSetting';
import Utils from "../../../../../core/utils/Utils";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";

export default class FarmShopItem extends FUI_FarmShopItem {
    private _info: ShopGoodsInfo;
    //@ts-ignore
    public item: BaseItem;
    private _tempStr: string = "";
    //@ts-ignore
    public tipItem: BaseTipItem;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);

    }

    public get info(): ShopGoodsInfo {
        return this._info;
    }

    public set info(value: ShopGoodsInfo) {
        if (this._info == value) return;
        this._info = value;
        if (this._info) {
            var gInfo: GoodsInfo = new GoodsInfo();
            gInfo.templateId = this._info.ItemId;
            var gTemp: t_s_itemtemplateData = gInfo.templateInfo;
            if (gTemp) {
                let arr = gTemp.TemplateNameLang.split('-')
                this.txt_name.text = arr[0];
                this.txt_name.color = ComponentSetting.setFarmItemColor(gTemp.Profile);
                this.item.info = gInfo;
                if (parseInt((gTemp.Property1 / 60).toString()) <= 0)
                    this._tempStr = LangManager.Instance.GetTranslation("public.needMinutes", gTemp.Property1 % 60);
                else if (gTemp.Property1 % 60 == 0)
                    this._tempStr = parseInt((gTemp.Property1 / 60).toString()) + LangManager.Instance.GetTranslation("public.time.hour");
                else
                    this._tempStr = LangManager.Instance.GetTranslation("public.needHM", parseFloat((gTemp.Property1 / 60).toString()), gTemp.Property1 % 60);
                this.txt_time.text = this._tempStr;
                var outputTemp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, gTemp.Property2);
                if (outputTemp)
                    this._tempStr = gTemp.Property3 + " " + outputTemp.TemplateNameLang;
                else
                    this._tempStr = gTemp.Property3.toString();
                this.txt_profit.setVar('value', this._tempStr).flushVars();
            }
            else {
                this.clean();
                this.txt_name.text = LangManager.Instance.GetTranslation("pvp.view.PvPShopItem.name");
                this.txt_name.color = ComponentSetting.setFarmItemColor(gTemp.Profile);
                return;
            }

            if (this.model.myFarm.grade < this._info.NeedGrades) {
                this.txt_openDescible.text = LangManager.Instance.GetTranslation("farm.view.FarmShopItem.needGradeTip", this._info.NeedGrades);
                this.setUnreachView(true);
            }
            else {
                this.txt_price.text = this._info.Gold.toString();
                this.setUnreachView(false);
            }
        }
        else
            this.clean();
    }

    private setUnreachView(b: boolean) {
        if (b) {
            this.gCost.visible = false;
            this.txt_price.visible = false;
            this.tipItem.visible = false;
            this.txt_openDescible.visible = true;
            UIFilter.gray(this.txt_name.displayObject);
            UIFilter.gray(this.txt_time.displayObject);
            UIFilter.gray(this.txt_profit.displayObject);
            UIFilter.gray(this.item.displayObject);
        }
        else {
            this.gCost.visible = true;
            this.txt_openDescible.visible = false;
            this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD, false);
            this.tipItem.visible = true;
            this.txt_price.visible = true;
            UIFilter.normal(this.txt_name.displayObject);
            UIFilter.normal(this.txt_time.displayObject);
            UIFilter.normal(this.txt_profit.displayObject);
            UIFilter.normal(this.item.displayObject);
        }
    }

    private clean() {
        this.item.data = null;
        this.txt_name.text = "";
        this.txt_price.text = "";
        this.txt_time.text = "";
        this.txt_profit.setVar('value', "").flushVars();
        this.txt_openDescible.text = "";
        this.tipItem.visible = false;
        this.profitImg.visible = false;
    }


    private get model(): FarmModel {
        return FarmManager.Instance.model;
    }

    dispose() {
        super.dispose();
    }
}