/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 18:16:15
 * @LastEditTime: 2021-05-17 18:34:34
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_ShopItem from "../../../../../fui/Base/FUI_ShopItem";
import LangManager from "../../../../core/lang/LangManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { FilterFrameText, eFilterFrameText } from "../../../component/FilterFrameText";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { UpgradeType } from "../../../constant/UpgradeType";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ShopManager } from "../../../manager/ShopManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import {BaseItem} from "../../../component/item/BaseItem";


export class PvpShopItem extends FUI_ShopItem {
    //@ts-ignore
    public item: BaseItem;
    private _info: ShopGoodsInfo;
    //@ts-ignore
    public tipBtn:BaseTipItem;
    get info(): ShopGoodsInfo {
        return this._info;
    }

    set info(value: ShopGoodsInfo) {
        this._info = value;
        this.enabled = false;
        this.txt_openDescible.text = "";
        this.txt_price.visible = false;
        this.tipBtn.visible = false
        this.item.info = null
        this.txt_name.text = ""
        if (this._info) {
            let goodsInfo: GoodsInfo = new GoodsInfo();
            goodsInfo.templateId = this._info.ItemId;
            this.item.info = goodsInfo;
            this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang;
            this.txt_name.color = FilterFrameText.Colors[eFilterFrameText.ItemQuality][goodsInfo.templateInfo.Profile - 1];
            let templateId: number = ShopManager.Instance.model.getTemplateId(this._info.PayType);
            this.tipBtn.setInfo(templateId);
            var honorTemp: t_s_upgradetemplateData = this.getHonorNameByValue(this._info.NeedGeste);
            if (this._info.NeedGeste > ArmyManager.Instance.thane.honer) {
                this.txt_openDescible.text = LangManager.Instance.GetTranslation("room.view.pvp.PVPShop.Condition", honorTemp.TemplateNameLang);
            }

            if (this.txt_openDescible.text == "") {
                this.txt_price.text = this._info.price + "";
                this.txt_price.visible = true;
                this.tipBtn.visible = true;
                this.enabled = true;
            }
        }
    }

    public getHonorNameByValue(honer: number): t_s_upgradetemplateData {
        var tempList: any[] = TempleteManager.Instance.getTemplatesByType(UpgradeType.UPGRADE_TYPE_HONER);
        tempList = ArrayUtils.sortOn(tempList, "Data", ArrayConstant.NUMERIC | ArrayConstant.DESCENDING);
        for (var i: number = 0; i < tempList.length; i++) {
            var temp = tempList[i] as t_s_upgradetemplateData;
            if (honer >= temp.Data)
                return temp;
        }
        return null;
    }

    dispose()
    {
        this._info = null;
        super.dispose();
    }
}