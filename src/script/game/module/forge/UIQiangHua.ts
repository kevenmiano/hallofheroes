// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-19 11:40:58
 * @LastEditTime: 2023-06-28 18:18:15
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import AudioManager from "../../../core/audio/AudioManager";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import {PackageIn} from "../../../core/net/PackageIn";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import Dictionary from "../../../core/utils/Dictionary";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import StringHelper from "../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import {t_s_itemtemplateData} from "../../config/t_s_itemtemplate";
import {BagType} from "../../constant/BagDefine";
import {BagEvent} from "../../constant/event/NotificationEvent";
import {SoundIds} from "../../constant/SoundIds";
import {EmWindow} from "../../constant/UIDefine";
import {GoodsInfo} from "../../datas/goods/GoodsInfo";
import {GoodsManager} from "../../manager/GoodsManager";
import {MessageTipManager} from "../../manager/MessageTipManager";
import {PlayerManager} from "../../manager/PlayerManager";
import {ResourceManager} from "../../manager/ResourceManager";
import {SharedManager} from "../../manager/SharedManager";
import {FrameCtrlManager} from "../../mvc/FrameCtrlManager";
import {GoodsCheck} from "../../utils/GoodsCheck";
import ForgeCtrl from "./ForgeCtrl";
import ForgeData from "./ForgeData";
import {StoreIntensifyCell} from "../../component/item/StoreIntensifyCell";
import CommonUtils from "../../../core/utils/CommonUtils";
import ColorConstant from "../../constant/ColorConstant";
import BaseTipItem from "../../component/item/BaseTipItem";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import StoreRspMsg = com.road.yishi.proto.store.StoreRspMsg;

export default class UIQiangHua extends BaseFguiCom {
    private equip1: StoreIntensifyCell
    private equip2: StoreIntensifyCell
    private txtName: fgui.GLabel
    private txtCost: fgui.GLabel
    private totalCost: fgui.GLabel
    private txtIntensifyMaxLevel: fgui.GLabel
    private txtSuccessRate: fgui.GLabel
    public btnComp: fgui.GButton
    private imgArrow: fgui.GImage
    private gUpGrade: fgui.GGroup
    private gMaxGrade: fgui.GGroup

    private item01: fgui.GComponent;
    private item02: fgui.GComponent;
    private item03: fgui.GComponent;

    private _itemDic: Dictionary = new Dictionary;
    private tipItem: BaseTipItem;
    constructor(comp: fgui.GComponent) {
        super(comp)

        this.equip1.item.pos = 0;
        this.equip2.item.pos = 1;
        this._itemDic["0_0_" + BagType.Hide] = this.equip1;
        this._itemDic["1_0_" + BagType.Hide] = this.equip2;
        this.btnComp.onClick(this, this.onBtnConfirm.bind(this))
        this.resetView()
        this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }

    refresh(tag: string, data: any) {
        switch (tag) {
            case "IntensifyResult":
                this.__onIntensifyResult(data)
                break;
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
        this.updateView();
    }

    private updateItem(item: fgui.GComponent, name: string, cur: string, next: string, profile: number = null) {
        let rTxtName = item.getChild("rTxtName") as fgui.GRichTextField
        rTxtName.text = name
        if (profile && ForgeData.Colors[profile - 1]) {
            rTxtName.color = ForgeData.Colors[profile - 1]
        }
        item.getChild("rTxtCur").text = cur
        item.getChild("rTxtNext").text = next
    }

    private onBtnConfirm()
    {
        let info:GoodsInfo = this.equip1.info;
        if(!info)
        {
            Logger.log("[UIQiangHua]先选择一样装备")
            return
        }

        if(ForgeData.getSuccessRate(info, this.equip2.info) <= 50)
        {//成功率<= 50%就弹确认框
            let isStrengthen:boolean = SharedManager.Instance.getProperty(SharedManager.IS_STRENGTHEN);
            let strengthenCheckDate = SharedManager.Instance.getProperty(SharedManager.STRENGTHEN_CHECK_DATE);
            let strengthenDate = new Date(strengthenCheckDate);
            let now:Date = new Date();
            let outdate:boolean = false;
            let check:boolean = SharedManager.Instance.resolveStrengthen;
            if(!isStrengthen || (strengthenDate && strengthenDate.getMonth() <= now.getMonth() && strengthenDate.getDate() < now.getDate()))
            {
                outdate = true;
            }
            if(outdate)
            {
                let content:string = LangManager.Instance.GetTranslation("store.Intensify.IntensifyView.isStrengthen");
                let checkStr:string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
                SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, {checkRickText:checkStr}, null, content, null, null, this.strengthenAndSaveSO.bind(this));
            }
            else//没过期, 直接强化
            {
                this.strengthen();
            }
        }
        else
        {//成功率大于50%, 直接强化
            this.strengthen();
        }
    }

    /**直接强化*/
    private strengthen() {
        // Logger.log("[UIQiangHua]strengthen selfGold=", ResourceManager.Instance.gold.count)
        if (ResourceManager.Instance.gold.count < Number(StringHelper.trim(this.txtCost.text))) {
            let str: string = LangManager.Instance.GetTranslation("public.gold");
            MessageTipManager.Instance.show(str);
            return;
        }

        // let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
        // if (!info.isBinds) {
        //     let content: string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
        //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, this.__intensifyConfirm.bind(this));
        // } else {
        this.btnComp.enabled = false;
        this.ctrl.data.isIntensifing = true;
        this.ctrl.sendItemIntensify();
        // }
    }

    /**保存SO和直接强化*/
    private strengthenAndSaveSO(b: boolean, check: boolean = true) {
        if (b) {
            //保存SO值
            let strengthenCheckDate: Date = new Date();
            SharedManager.Instance.setProperty(SharedManager.IS_STRENGTHEN, check, SharedManager.STRENGTHEN_CHECK_DATE, strengthenCheckDate);

            this.strengthen();
        }
    }

    private __intensifyConfirm(b: boolean) {
        if (b) {
            this.btnComp.enabled = false;
            this.ctrl.data.isIntensifing = true;
            this.ctrl.sendItemIntensify();
        }
        else {
            this.btnComp.enabled = true;
            this.ctrl.data.isIntensifing = false;
        }
    }

    protected __bagItemUpdateHandler(info: GoodsInfo) {
        Logger.log("[UIQiangHua]__bagItemUpdateHandler", info.pos + "_" + info.objectId + "_" + info.bagType)
        let item: StoreIntensifyCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        if (item) {
            item.info = info;
            if (info.pos == 0) {
                this.equip1.item.tipType = EmWindow.ForgeEquipTip
            } else {
                this.equip2.item.tipType = EmWindow.ForgePropTip
            }
            this.updateView();
        }
    }

    private __bagItemDeleteHandler(info: GoodsInfo) {
        Logger.log("[UIQiangHua]__bagItemDeleteHandler", info.pos + "_" + info.objectId + "_" + info.bagType)
        let item: StoreIntensifyCell = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
        if (item) {
            item.info = null;
            this.updateView();
        }
    }
    /**
     * 强化结果 
     */
    protected __onIntensifyResult(pkg: PackageIn) {
        let msg = pkg.readBody(StoreRspMsg) as StoreRspMsg;

        let strTip = LangManager.Instance.GetTranslation(msg.strengResult ? "store.Intensify.IntensifyView.successWord.text" : "store.Intensify.IntensifyView.failWord.text")
        MessageTipManager.Instance.show(strTip)

        AudioManager.Instance.playSound(msg.strengResult ? SoundIds.INTENSIFY_SUCCEED_SOUND : SoundIds.INTENSIFY_FAIL_SOUND);

        if (msg.strengResult) {
            let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(msg.pos);
            info.objectId = msg.objectId;
            info.bagType = msg.bagType;
            info.strengthenGrade = msg.strengthenGrade;
            let item = this._itemDic[info.pos + "_" + info.objectId + "_" + info.bagType];
            if (item) {
                item.info = info;
                if (info.pos == 0) {
                    this.equip1.item.tipType = EmWindow.ForgeEquipTip
                } else {
                    this.equip2.item.tipType = EmWindow.ForgePropTip
                }
            }
            GoodsManager.Instance.dispatchEvent(BagEvent.INTENSIFY_GOODS);
        }
        this.btnComp.enabled = true;
        this.ctrl.data.isIntensifing = false
        this.updateEquipNatureView();
    }

    private updateEquipNatureView() {
        let info: GoodsInfo = this.equip1.info;
        if (info && !this.ctrl.data.isIntensifing) {
            this.initAttribute(info, info.templateInfo);
        }
    }

    public get equipMaxGrade() {
        if (!this.equip1.info) {
            return false;
        }
        return this.gMaxGrade.visible
    }

    private updateView() {
        this.resetView()

        // let info2: GoodsInfo = this.equip2.info;
        // if(!info2){
        //     this.equip2.setTickIcon(fgui.UIPackage.getItemURL(EmPackName.Base, "Icon_IconBox_Add"))
        // }
        let info: GoodsInfo = this.equip1.info;
        if (!info) {
            if (this.equip2.info) {
                PlayerManager.Instance.moveBagToBag(this.equip2.info.bagType, this.equip2.info.objectId, this.equip2.info.pos, BagType.Player, 0, 0, 1);
            }
            // this.equip1.setTickIcon(fgui.UIPackage.getItemURL(EmPackName.Base, "Icon_IconBox_Add"))
            return
        }
        let temp: t_s_itemtemplateData = info.templateInfo;
        if (!temp) return

        let bMaxGrade = temp.StrengthenMax <= info.strengthenGrade
        this.gUpGrade.visible = !bMaxGrade
        this.gMaxGrade.visible = bMaxGrade

        if (!bMaxGrade) {
            this.txtCost.text = GoodsCheck.getIntensifuGold(info).toString();
            this.totalCost.text = ResourceManager.Instance.gold.count.toString() + " / ";
            this.txtSuccessRate.text = ForgeData.getSuccessRate(info, this.equip2.info) + "%";
            this.totalCost.color = this.txtCost.color = CommonUtils.changeColor(GoodsCheck.getIntensifuGold(info), ResourceManager.Instance.gold.count);
        } else {
            /**
             * 强化满级把强化石移入背包
             */
            if (this.equip2.info) {
                PlayerManager.Instance.moveBagToBag(this.equip2.info.bagType, this.equip2.info.objectId, this.equip2.info.pos, BagType.Player, 0, 0, 1);
            }
        }

        this.btnComp.enabled = !bMaxGrade;
        this.imgArrow.visible = !bMaxGrade

        this.item01.visible = true
        this.txtName.text = info.templateInfo.TemplateNameLang + this.ctrl.data.getStrengthenGrade(info)
        this.txtName.color = ForgeData.Colors[info.templateInfo.Profile - 1]
        this.txtIntensifyMaxLevel.text = info.templateInfo.StrengthenMax == 0 ? "" : LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.intensify", info.templateInfo.StrengthenMax);

        let curGrade = info.strengthenGrade
        let strEquipLevel: string = LangManager.Instance.GetTranslation("gemMaze.GemMazeSort.Level");
        this.updateItem(this.item01, strEquipLevel, bMaxGrade ? "" : String(curGrade), bMaxGrade ? String(curGrade) : String(curGrade + 1))

        this.updateEquipNatureView()
    }

    private initAttribute(info: GoodsInfo, temp: t_s_itemtemplateData) {
        let bMaxGrade = temp.StrengthenMax == info.strengthenGrade

        let str: string = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
        this.updateAttributeTxt(str, temp.Power, this.getCurr(temp.Power, info), this.getNex(temp.Power, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02") + ":";
        this.updateAttributeTxt(str, temp.Agility, this.getCurr(temp.Agility, info), this.getNex(temp.Agility, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
        this.updateAttributeTxt(str, temp.Intellect, this.getCurr(temp.Intellect, info), this.getNex(temp.Intellect, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
        this.updateAttributeTxt(str, temp.Physique, this.getCurr(temp.Physique, info), this.getNex(temp.Physique, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
        this.updateAttributeTxt(str, temp.Captain, this.getCurr(temp.Captain, info), this.getNex(temp.Captain, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13");
        this.updateAttributeTxt(str, temp.Attack, this.getCurr(temp.Attack, info), this.getNex(temp.Attack, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15");
        this.updateAttributeTxt(str, temp.MagicAttack, this.getCurr(temp.MagicAttack, info), this.getNex(temp.MagicAttack, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14");
        this.updateAttributeTxt(str, temp.Defence, this.getCurr(temp.Defence, info), this.getNex(temp.Defence, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16");
        this.updateAttributeTxt(str, temp.MagicDefence, this.getCurr(temp.MagicDefence, info), this.getNex(temp.MagicDefence, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip19");
        this.updateAttributeTxt(str, temp.Parry, this.getCurr(temp.Parry, info), this.getNex(temp.Parry, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11");
        this.updateAttributeTxt(str, temp.Live, this.getCurr(temp.Live, info), this.getNex(temp.Live, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip10");
        this.updateAttributeTxt(str, temp.ForceHit, this.getCurr(temp.ForceHit, info), this.getNex(temp.ForceHit, info), bMaxGrade);

        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip17");
        this.updateAttributeTxt(str, temp.Conat, this.getCurr(temp.Conat, info), this.getNex(temp.Conat, info), bMaxGrade);
    }

    private updateAttributeTxt(property: string, value: number, addCurr: number, addNex: number, bMaxGrade: boolean) {
        // Logger.log("[UIQiangHua]updateAttributeTxt", "property=" + property + ", value=" + value)
        if (value != 0) {
            let curStr = bMaxGrade ? "" : String(value + addCurr);
            let nextStr = bMaxGrade ? "[color=#FFECC6]" + value + "[/color][color=#71FF00]" + "（" + addCurr + "）" + "[/color]" : "[color=#FFECC6]" + (value + addCurr) + "[/color][color=#71FF00]" + "（" + addNex + "）" + "[/color]";
            if (!this.item02.visible) {
                this.item02.visible = true;
                this.updateItem(this.item02, property, curStr, nextStr)
            } else {
                if (this.item02.getChild("rTxtName").text != property) {
                    this.item03.visible = true;
                    this.updateItem(this.item03, property, curStr, nextStr)
                }
            }
        }
    }

    private getCurr(preValue: number, gInfo: GoodsInfo): number {
        let curr: number = preValue * gInfo.strengthenGrade * 0.1 + gInfo.strengthenGrade * 5;
        return Math.floor(curr);
    }

    private getNex(preValue: number, gInfo: GoodsInfo): number {
        let info: GoodsInfo = this.getNextGrade(gInfo);
        let nex: number = preValue * info.strengthenGrade * 0.1 + info.strengthenGrade * 5;
        let curr: number = preValue * gInfo.strengthenGrade * 0.1 + gInfo.strengthenGrade * 5;
        return Math.floor(nex - curr);
    }

    private getNextGrade(value: GoodsInfo): GoodsInfo {
        let gInfo = ObjectUtils.copyProperties(value) as GoodsInfo
        gInfo.strengthenGrade = value.strengthenGrade + 1;
        return gInfo;
    }

    public get ctrl(): ForgeCtrl {
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Forge) as ForgeCtrl
        return ctrl
    }

    public resetView() {
        this.ctrl.data.isIntensifing = false;
        this.item01.visible = false
        this.item02.visible = false
        this.item03.visible = false

        this.txtName.text = ""
        this.txtIntensifyMaxLevel.text = ""
        this.txtSuccessRate.text = "--"
        this.txtCost.text = "--";
        this.totalCost.text = "--/";
        this.imgArrow.visible = false

        this.gUpGrade.visible = true
        this.gMaxGrade.visible = false
        this.totalCost.color = this.txtCost.color = ColorConstant.LIGHT_TEXT_COLOR;
        this.btnComp.enabled = false
    }

    public resetTarget() {
        this.equip1.info = null
        this.equip2.info = null
    }

    public dispose(destroy = true) {       
        this.btnComp.offClick(this, this.onBtnConfirm.bind(this))
        super.dispose(destroy);
    }
}