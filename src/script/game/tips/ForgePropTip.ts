/*
 * @Author: jeremy.xu
 * @Date: 2021-11-25 14:27:26
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-03-24 20:02:47
 * @Description: 
 */

import BaseWindow from "../../core/ui/Base/BaseWindow";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import GoodsSonType from "../constant/GoodsSonType";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import LangManager from "../../core/lang/LangManager";
import { GoodsCheck } from "../utils/GoodsCheck";
import { ArmyManager } from "../manager/ArmyManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { PlayerManager } from "../manager/PlayerManager";
import { BaseItem } from "../component/item/BaseItem";
import UIButton from "../../core/ui/UIButton";
import { VicePasswordUtil } from "../module/vicePassword/VicePasswordUtil";
import AudioManager from "../../core/audio/AudioManager";
import { BagType } from "../constant/BagDefine";
import { SoundIds } from "../constant/SoundIds";
import { EmWindow } from "../constant/UIDefine";
import ForgeCtrl from "../module/forge/ForgeCtrl";
import ForgeData from "../module/forge/ForgeData";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import ConfigMgr from "../../core/config/ConfigMgr";
import Logger from "../../core/logger/Logger";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { ConfigType } from "../constant/ConfigDefine";
import { GoodsType } from "../constant/GoodsType";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { ResourceManager } from "../manager/ResourceManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import UIManager from "../../core/ui/UIManager";
import ForgeWnd from "../module/forge/ForgeWnd";
import BaseTips from "./BaseTips";
import ComponentSetting from "../utils/ComponentSetting";
import { MountsManager } from "../manager/MountsManager";
import { WildSoulInfo } from "../module/mount/model/WildSoulInfo";
import { ToolTipsManager } from "../manager/ToolTipsManager";
import { NotificationManager } from "../manager/NotificationManager";
import { ExtraJobEvent } from "../constant/event/NotificationEvent";

export class ForgePropTip extends BaseTips {
    public bg: fgui.GLoader;
    public item: BaseItem;
    public txt_name: fgui.GTextField;
    public txt_useLevel: fgui.GTextField;
    public txt_type: fgui.GTextField;
    public txt_bind: fgui.GTextField;
    public subBox1: fgui.GGroup;
    public txt_desc: fgui.GTextField;
    public txt_price: fgui.GTextField;
    public group_price: fgui.GGroup;
    public txt_time: fgui.GTextField;
    public btn_equip: UIButton;
    public btn_lock: UIButton;
    public group_oprate: fgui.GGroup;
    public totalBox: fgui.GGroup;

    private _info: GoodsInfo;


    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initView();

        this.updateView();
        //note 调用ensureBoundsCorrect立即重排
        this.totalBox.ensureBoundsCorrect();
    }

    private initData() {
        this._info = this.params[0];
    }

    private initView() {
        this.checkShowOptBtn();
        let selectTab
        let equipOffStr = LangManager.Instance.GetTranslation("public.unEquip");//卸下
        let equipOnStr = LangManager.Instance.GetTranslation("public.equip");//装备
        if(!this.forgeControler.view){
            selectTab = ForgeData.TabIndex.XQ;//镶嵌   
        }else{
            selectTab= (this.forgeControler.view as ForgeWnd).curTabIndex;//当前选择Tab索引
        }
        let isInlay = false;
        switch (selectTab) {
            case ForgeData.TabIndex.QH://强化
                equipOnStr = LangManager.Instance.GetTranslation("public.putIn");//放入
                equipOffStr = LangManager.Instance.GetTranslation("public.unEquip");
                break;
            case ForgeData.TabIndex.XQ://镶嵌
                equipOnStr = LangManager.Instance.GetTranslation("Forge.TabTitle.Inlay");//镶嵌
                equipOffStr = LangManager.Instance.GetTranslation("public.unEquip");
                break;
            case ForgeData.TabIndex.ZH://转换
                equipOnStr = LangManager.Instance.GetTranslation("Forge.TabTitle.Switch");//转换
                equipOffStr = LangManager.Instance.GetTranslation("public.unEquip");
                break;
        }
        if (!ComponentSetting.PROP_LOCK) {
            this.btn_lock.visible = false;
            this.btn_equip.x = 88;
        }
        else {
            this.btn_lock.visible = !this.isEquiped;
        }
        this.btn_lock.title = LangManager.Instance.GetTranslation(this.isLocked ? "public.unLock" : "public.lock");
        switch (selectTab) {
            case ForgeData.TabIndex.QH://强化
                this.btn_equip.title = this.isEquiped ? equipOffStr : equipOnStr;
                break;
            case ForgeData.TabIndex.XQ://镶嵌
                //@ts-ignore   镶嵌仅有
                isInlay = this._info.isInlay;
                if(!this.forgeControler.view){
                    this.btn_equip.title = isInlay ? equipOffStr : equipOnStr;
                    return
                }else{
                    this.btn_equip.title = this.isEquiped && isInlay ? equipOffStr : equipOnStr;
                }
                break;
            case ForgeData.TabIndex.ZH://转换
                this.btn_equip.title = this.isEquiped ? equipOffStr : equipOnStr;
                break;
        }
    }

    private updateView() {
        if (this._info) {
            this.item.info = this._info;
            this.item.text = "";
            this.txt_name.text = this._info.templateInfo.TemplateNameLang;
            this.txt_name.color = GoodsSonType.getColorByProfile(this._info.templateInfo.Profile);
            this.txt_type.text = this.getGoodsTypeName(this._info.templateInfo);
            ToolTipsManager.Instance.setMountActiveTxt(this._info,this.txt_bind);
            this.txt_desc.text = this._info.templateInfo.DescriptionLang;
            this.group_price.visible = this._info.templateInfo.SellGold > 0;
            let str: string = "" + this._info.templateInfo.SellGold * (1 + this._info.strengthenGrade * 2);
            this.txt_price.text = this._info.templateInfo.SellGold == 0 ? "" : str;

            if (this._info.templateInfo.NeedGrades > 1) {
                this.txt_useLevel.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.grade", this._info.templateInfo.NeedGrades);
                if (!GoodsCheck.isGradeFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
                    this.txt_useLevel.color = "#FF0000";
                }
            }
            else {
                this.txt_useLevel.text = "";
            }

            if (this._info.id != 0) {
                this.txt_bind.visible = true;
            }
            else {
                this.txt_bind.visible = false;
            }

            if (this._info.validDate > 0)//加上时效性
            {
                this.txt_time.visible = true;
            }
            else {
                this.txt_time.visible = false;
            }

            let timeStr: string;
            if (this._info.leftTime == -1) {
                timeStr = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.timeStr01");
            }
            else if (this._info.leftTime < 0) {
                timeStr = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.timeStr02");
            }
            else {
                timeStr = DateFormatter.getFullDateString(this._info.leftTime);
            }
            this.txt_time.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.time.text") + ":" + timeStr;
        }
    }

    private getGoodsTypeName(temp: t_s_itemtemplateData): string {
        switch (temp.SonType) {
            case GoodsSonType.SONTYPE_TASK:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.SONTYPE_TASK");
            case GoodsSonType.SONTYPE_COMPOSE_MATERIAL:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.COMPOSE_MATERIAL");
        }
        return "";
    }

    private btn_equipClick() {
        if (!this.forgeModel) {
            this.hide();
            return;
        }

        if (this._info.templateInfo.MasterType != GoodsType.PROP) {
            this.hide();
            return
        }
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge);
        if(!ctrl.view){//魂器镶嵌
            NotificationManager.Instance.dispatchEvent(ExtraJobEvent.CLICK_INLAY,this._info);
            this.hide();
            return;
        }
        switch (this.forgeModel.curTabIndex) {
            case ForgeData.TabIndex.XQ:
                //@ts-ignore
                if (this.isEquiped && this._info.isInlay) {
                    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) {
                        let pos = this._info.pos;
                        SocketSendManager.Instance.sendPunch(pos, false);
                        // let Property3 = this._info.templateInfo.Property3
                        // let content: string = LangManager.Instance.GetTranslation("cell.view.storebag.StoreJewelCell.content", this._info.templateInfo.Property3);
                        // SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean, check: boolean) => {
                        //     if (!b) {
                        //         return;
                        //     }
                        //     if (Property3 > ResourceManager.Instance.gold.count) {
                        //         MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.gold"));
                        //         return;
                        //     }
                        //     SocketSendManager.Instance.sendPunch(pos, false);
                        // });
                    }
                } else {
                    this.isMountJewel;
                }
                this.hide();
                break;
            case ForgeData.TabIndex.QH:
                if (this.isEquiped) {
                    let count = GoodsManager.Instance.getBagCountByTempIdAndPos(BagType.Hide, this._info.templateId, this._info.pos);
                    this.moveBagToBag(this._info.bagType, this._info.objectId, this._info.pos, BagType.Player, 0, 0, count);
                    this.hide();
                } else {
                    let forgeWnd = this.forgeControler.view as ForgeWnd
                    if (forgeWnd.uiQiangHua.equipMaxGrade) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("buildings.BaseBuildFrame.maxGrade"));
                        this.hide();
                        return
                    }

                    let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
                    if (!info) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellDropMediator.command01"));
                        this.hide();
                        return
                    }

                    let to_pos = 0
                    let moveCnt = 1
                    if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_INTENSIFY) {
                        to_pos = 1
                        moveCnt = GoodsManager.Instance.getBagCountByTempIdAndPos(BagType.Player, this._info.templateId, this._info.pos);
                    }
                    this.moveBagToBag(this._info.bagType, this._info.objectId, this._info.pos, BagType.Hide, 0, to_pos, moveCnt);
                    this.hide();
                    return;
                }
                break;
            case ForgeData.TabIndex.ZH:
                if (this.isEquiped) {
                    this.moveBagToBag(this._info.bagType, this._info.objectId, this._info.pos, BagType.Player, 0, 0, 1);
                    this.hide();
                } else {
                    if (this._info.isLock) {
                        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("store.view.compose.ComposeMatetialView.sendComposeTip05"));
                        this.hide();
                    } else {
                        //如果数量大于1则弹框选择数量
                        let ownCount = GoodsManager.Instance.getBagCountByTempIdAndPos(BagType.Player, this._info.templateId, this._info.pos);
                        if (ownCount > 1) {
                            UIManager.Instance.ShowWind(EmWindow.QuantitySelector, {
                                content: "ForgePropTip.ConfirmNeedSwitchGemCnt",
                                count: 1,
                                maxCount: ownCount,
                                info: this._info,
                                price: 0,
                                callBack: this.quantitySelectorCallBack.bind(this)
                            })
                        } else {
                            this.moveBagToBag(this._info.bagType, this._info.objectId, this._info.pos, BagType.Hide, 0, 0, 1);
                        }
                        this.hide();
                    }
                }
                break;
            default:
                break;
        }
    }

    private quantitySelectorCallBack(b: boolean, count: number, info: GoodsInfo) {
        if (b) {
            this.moveBagToBag(info.bagType, info.objectId, info.pos, BagType.Hide, 0, 0, count);
        }
    }

    private get isMountJewel(): boolean {
        if (this.forgeModel.curTabIndex == ForgeData.TabIndex.XQ && this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) {
            let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
            if (info) {
                let emptyPos: number[] = [];
                for (let i: number = 1; i <= ForgeData.XQJewelNum; i++) {
                    if (info["join" + i] > 0) {
                        let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, Number(info["join" + i]))
                        if (temp.Property1 == this._info.templateInfo.Property1) {
                            let str: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command03");
                            MessageTipManager.Instance.show(str);
                            this.hide();
                            return true;
                        }
                    }
                    else if (info["join" + i] == 0) {
                        emptyPos.push(i);
                    }
                }
                if (emptyPos.length <= 0) {
                    let str = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellClickMediator.command04")
                    MessageTipManager.Instance.show(str);
                }
                else {
                    this.forgeControler.sendItemMount(emptyPos[0], this._info.pos, this._info.bagType);
                }
            } else {
                let str: string = LangManager.Instance.GetTranslation("cell.mediator.storebag.StoreBagCellDropMediator.command01");
                MessageTipManager.Instance.show(str);
            }
            this.hide();
            return true;
        }
        return false;
    }

    private btn_lockClick() {
        MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.unopen"));
        return;
        if (!this._info) return;
        VicePasswordUtil.vpLockOp(3, this._info.pos);
        this.hide();
    }

    private checkShowOptBtn() {
        if (!this.forgeModel) return;

        this.group_oprate.visible = false
        switch (this.forgeModel.curTabIndex) {
            case ForgeData.TabIndex.QH:
                // 幸运石 GoodsSonType.SONTYPE_INTENSIFY
                this.group_oprate.visible = true
                break;
            case ForgeData.TabIndex.XQ:
                // 宝石 金刚钻
                if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) { //宝石
                    this.group_oprate.visible = true
                }
                break;
            case ForgeData.TabIndex.XL:
            // case ForgeData.TabIndex.FJ:
                // 洗练石
                this.group_oprate.visible = false
                break;
            case ForgeData.TabIndex.ZH:
                // 宝石
                this.group_oprate.visible = true
                break;
            default:
                if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT) { //宝石
                    this.group_oprate.visible = true
                }
                break;
        }
    }

    private moveBagToBag(beginBagType: number, beginObjectId: number, beginPos: number, endBagType: number, endObjectId: number, endPos: number, count: number) {
        AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
        PlayerManager.Instance.moveBagToBag(beginBagType, beginObjectId, beginPos, endBagType, endObjectId, endPos, count);
    }

    private get isLocked(): boolean {
        return this._info && this._info.isLock
    }

    private get isEquiped(): boolean {
        // 如果是镶嵌->宝石tip 另外判断
        if (this.forgeModel.curTabIndex == ForgeData.TabIndex.XQ) {
            let arr: GoodsInfo[] = GoodsManager.Instance.getGoodsByBagType(BagType.Hide);
            for (let i = 0; i < arr.length; i++) {
                const goods: GoodsInfo = arr[i];
                for (let index = 1; index <= ForgeData.XQJewelNum; index++) {
                    const id = goods['join' + index];
                    if (id > 0 && id == this._info.templateId) {
                        return true
                    }
                }
            }
            return false
        } else {
            let arr: GoodsInfo[] = GoodsManager.Instance.getGoodsByBagType(BagType.Hide);
            for (let i = 0; i < arr.length; i++) {
                const goods: GoodsInfo = arr[i];
                if (this._info.pos == goods.pos && this._info.id == goods.id) {
                    return true
                }
            }
        }

    }

    private get forgeModel(): ForgeData {
        return this.forgeControler.data;
    }

    private get forgeControler(): ForgeCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl;
    }

    protected OnClickModal() {
        this.hide();
    }

    public OnHideWind() {
        super.OnHideWind();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}