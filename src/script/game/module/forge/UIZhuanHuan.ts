/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2022-09-23 16:07:24
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { BagType } from "../../constant/BagDefine";
import { ConfigType } from "../../constant/ConfigDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { SwitchGoodsInfo } from "../../datas/SwitchGoodsInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { SharedManager } from "../../manager/SharedManager";
import ForgeData from "./ForgeData";
import { ForgeSocketOutManager } from "./ForgeSocketOutManager";
import { StoreIntensifyCell } from "../../component/item/StoreIntensifyCell";
import { ItemWithSelectEffect } from "../../component/item/ItemWithSelectEffect";
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import { EmWindow } from "../../constant/UIDefine";
import ForgeCtrl from './ForgeCtrl';
import { VIPManager } from '../../manager/VIPManager';
import { TempleteManager } from '../../manager/TempleteManager';
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import ForgeTargetItem from "./item/ForgeTargetItem";
import CommonUtils from "../../../core/utils/CommonUtils";
import ColorConstant from "../../constant/ColorConstant";
import Utils from "../../../core/utils/Utils";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";

export default class UIZhuanHuan extends BaseFguiCom {
    private txtCost: fgui.GLabel
    private txtAll: fgui.GLabel
    private txtDstItemName: fgui.GLabel
    private btnSwitch: fgui.GButton
    private resolveList: fgui.GList
    private imgDstItemNameBg: fgui.GImage;

    private itemSource: ForgeTargetItem;
    private itemTarget: StoreIntensifyCell;
    private itemCurrent: ItemWithSelectEffect;
    private _rTxtDesc: fgui.GRichTextField;

    private _switchTemp: SwitchGoodsInfo;
    private _itemDic: SimpleDictionary = new SimpleDictionary();
    private _itemInfoList: GoodsInfo[] = []; // 可转换的材料信息列表
    private tipItem: BaseTipItem;
    constructor(comp: fgui.GComponent) {
        super(comp)
        Utils.setDrawCallOptimize(this.resolveList);
        this.resolveList.displayObject['dyna'] = true;

        this.resolveList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.resolveList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);

        this._rTxtDesc = this.itemSource.getChild("rTxtDesc") as fgui.GRichTextField
        this.itemTarget.item.pos = 0
        this._itemDic.add("0_0_" + BagType.Hide, this.itemTarget);

        this.resetView()
        this.btnSwitch.onClick(this, this.btnSwitchClick.bind(this))
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }


    refresh(tag: string, data: any) {
        switch (tag) {
            case "BagItemUpdate":
                this.__bagItemUpdateHandler(data)
                break;
            case "BagItemDelete":
                this.__bagItemDeleteHandler(data)
                break;
            default:
                break;
        }
    }

    refreshResources() {

    }

    private btnSwitchClick() {
        if (Number(this.txtCost.text) > ResourceManager.Instance.gold.count) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.gold"));
            return;
        }
        let info: GoodsInfo = this.itemTarget.info;
        this.sendSwitch(!info.isBinds);
    }

    public sendSwitch(check: boolean = false) {
        // if (check) {
        //     if (this.showSwitchAlert()) return;
        // }
        if (this.itemTarget && this.itemCurrent) {
            ForgeSocketOutManager.sendSwitch(this.itemTarget.info.templateId, this.itemCurrent.info.templateId, this.itemCurrent.info.count);
        }
    }

    private showSwitchAlert(): boolean {
        let preDate: Date = new Date(SharedManager.Instance.storeSwitchCheckDate);
        let now: Date = new Date();
        let outdate: boolean = false;
        let check: boolean = SharedManager.Instance.storeSwitch;
        if (!check || preDate.getMonth() <= preDate.getMonth() && preDate.getDate() < now.getDate())
            outdate = true;
        if (outdate) {
            let content: string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
            let checkTxt: string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkTxt }, null, content, null, null, this.switchAlertBack.bind(this));
        }
        return outdate;
    }

    private switchAlertBack(b: boolean, check: boolean) {
        SharedManager.Instance.storeSwitch = check;
        SharedManager.Instance.storeSwitchCheckDate = new Date();
        SharedManager.Instance.saveSwitchTipCheck();
        this.sendSwitch(false);
    }

    private __bagItemUpdateHandler(info: GoodsInfo) {
        Logger.log("[UIZhuanHuan]__bagItemUpdateHandler", info.pos + "_" + info.objectId + "_" + info.bagType)
        let item: StoreIntensifyCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        if (item) {
            item.info = info;
            item.item.tipType = EmWindow.ForgePropTip;
            this.updateView(info);
        }

        // 刷新合成数据
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl
        if (ctrl) {
            ctrl.data.initComposeInfo()
        }
    }

    private __bagItemDeleteHandler(info: GoodsInfo) {
        Logger.log("[UIZhuanHuan]__bagItemDeleteHandler", info.pos + "_" + info.objectId + "_" + info.bagType)
        let item: StoreIntensifyCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        if (item) {
            item.info = null;
            this.updateView(info);
        }
    }

    private updateView(value: GoodsInfo) {
        this.resetView()

        let targetTransformId = value.templateInfo.TransformId
        if (targetTransformId > 0) {
            this._switchTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_transformtemplate, targetTransformId);
        }

        this.btnSwitch.enabled = this.itemTarget.info != null;

        if (!this._switchTemp || !this.itemTarget.info) return

        for (let i: number = 1; i <= ForgeData.ZHMateNum; i++) {
            let id = this._switchTemp["Material" + i]
            if (id == 0 || id == value.templateInfo.TemplateId) continue

            let goods: GoodsInfo = new GoodsInfo();
            goods.templateId = id;
            goods.count = value.count;

            this._itemInfoList.push(goods)
        }

        this.resolveList.numItems = ForgeData.ZHMateNum;
        let vipPrivilegeCount = 1;
        if (VIPManager.Instance.model.vipInfo.IsVipAndNoExpirt) {//特权专享折扣
            let grade = VIPManager.Instance.model.vipInfo.VipGrade;
            let hasPrivilege = VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.DISCOUNT, grade);
            if (!hasPrivilege) {
                vipPrivilegeCount = 1;
            } else {
                let item = TempleteManager.Instance.getPrivilegeTempletesByTypeLevel(VipPrivilegeType.DISCOUNT, grade);
                if (item) {
                    vipPrivilegeCount = 1 - item.para1 / 100;
                }
            }
        }
        this.txtCost.text = (Math.floor(this._switchTemp.CostGold * value.count * vipPrivilegeCount)).toString();
        this.txtAll.text = ResourceManager.Instance.gold.count.toString() + "/";
        this._rTxtDesc.text = value.templateInfo.TemplateNameLang
        this._rTxtDesc.color = ForgeData.Colors[value.templateInfo.Profile - 1]
        this.txtAll.color = this.txtCost.color = CommonUtils.changeColor(this._switchTemp.CostGold * value.count * vipPrivilegeCount, ResourceManager.Instance.gold.count);
        this.selectDefItem();
    }

    private onClickItem(item: ItemWithSelectEffect, e: Laya.Event) {
        if (!this.itemTarget.item.info) {
            this.resolveList.selectNone();
            return;
        }
        this.itemCurrent = item;

        if (!this.itemCurrent.info) {
            this.selectDefItem();
        } else {
            this.setCurItemName();
        }
    }

    private selectDefItem() {
        this.resolveList.selectedIndex = 0;
        this.itemCurrent = this.resolveList.getChildAt(this.resolveList.selectedIndex) as ItemWithSelectEffect;
        this.setCurItemName();
    }

    private setCurItemName() {
        this.imgDstItemNameBg.visible = true;
        let template = this.itemCurrent.info.templateInfo;
        this.txtDstItemName.text = template.TemplateNameLang;
        this.txtDstItemName.color = ForgeData.Colors[template.Profile - 1]
    }

    private renderListItem(index: number, item: ItemWithSelectEffect) {
        if (!this._switchTemp) return

        let itemData = this._itemInfoList[index]
        if (!itemData) {
            item.info = null
            return
        }

        item.info = itemData
        item.selected = false
        item.item.text = String(itemData.count)
        item.item.touchable = false
    }

    public resetView() {
        this.txtCost.text = "--";
        this.txtAll.text = "-- / ";
        this.txtDstItemName.text = "";
        this._rTxtDesc.text = "";
        this._itemInfoList = [];
        this.resolveList.numItems = ForgeData.ZHMateNum;
        this.btnSwitch.enabled = false;
        this.imgDstItemNameBg.visible = false;
        this.resolveList.selectNone();
        this.txtAll.color = this.txtCost.color = ColorConstant.LIGHT_TEXT_COLOR;
    }

    public resetTarget() {
        this.itemTarget.info = null
    }

    public dispose(d) {
        this.btnSwitch.offClick(this, this.btnSwitchClick.bind(this));
        this.resolveList.off(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.resolveList.itemRenderer.recover();
        this.resolveList.itemRenderer = null;
        super.dispose(d);
    }
}