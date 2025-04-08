// @ts-nocheck
import { SocketManager } from "../../../../core/net/SocketManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import LangManager from "../../../../core/lang/LangManager";
import { HeadIcon } from "./component/HeadIcon";
import { TempleteManager } from "../../../manager/TempleteManager";
import GoodsSonType from "../../../constant/GoodsSonType";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import IconAvatarFrame from "../../../map/space/view/physics/IconAvatarFrame";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";

import SNSInfoMsg = com.road.yishi.proto.simple.SNSInfoMsg;
import { NotificationEvent, SNSEvent } from "../../../constant/event/NotificationEvent";
import { SNSManager } from "../../../manager/SNSManager";
import HeadIconModel from "./HeadIconModel";
import HeadIconCtr from "./HeadIconCtr";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SharedManager } from "../../../manager/SharedManager";
import HeadFrameInfo from "./HeadFrameInfo";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/7 16:07
 * @ver 1.0
 */
export class HeadIconModifyWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public icon_head: IconAvatarFrame;
    public icon_frame: IconAvatarFrame;
    public list_head: fgui.GList;
    public list_frame: fgui.GList;
    public btn_sure: fgui.GButton;//头像替换
    public btn_equip: fgui.GButton;//头像框装备
    public btn_unequip: fgui.GButton;//头像框卸下
    private txt_head_pre: fairygui.GTextField;
    public headFrameNameTxt: fgui.GTextField;
    public descTxt: fgui.GTextField;
    private _currentHeadId: number;
    private _currentItemCfg: t_s_itemtemplateData;
    private tabCtrl: fgui.Controller;
    public operationCtr: fgui.Controller;
    public redStatus: fgui.Controller;
    private listFrames: t_s_itemtemplateData[];

    public OnInitWind() {
        super.OnInitWind();
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('HeadIconModifyWnd.titleTxt');
        this.txt_head_pre.text = LangManager.Instance.GetTranslation('HeadIconModifyWnd.previewTxt');
        this.descTxt.text = LangManager.Instance.GetTranslation("faterotary.LevelMin");
        this.redStatus = this.getController("redStatus");
        this.setCenter();
        this.initData();
        this.addEventListener();
    }

    private initData() {
        this.tabCtrl = this.getController("tabCtrl");
        this.operationCtr = this.getController("operationCtr");
        this.tabCtrl.selectedIndex = 0;
    }

    private addEventListener() {
        this.list_head.on(fgui.Events.CLICK_ITEM, this, this.onClickHeadItem);
        this.list_frame.on(fgui.Events.CLICK_ITEM, this, this.onClickFrameItem);
        this.tabCtrl.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
        this.btn_sure.onClick(this, this.onBtnSureClick.bind(this));
        this.btn_equip.onClick(this, this.onBtnEquipClick);
        this.btn_unequip.onClick(this, this.onBtnUnequipClick);
        SNSManager.Instance.addEventListener(SNSEvent.SNSINFO_UPDATE, this.__snsInfoSaveCompleteHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_HEADFRAME_INFO, this.updateView, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_HEADFRAME_ACTIVE, this.updateHeadRedStatus, this);
    }

    private removeEventListener() {
        this.list_head.off(fgui.Events.CLICK_ITEM, this, this.onClickHeadItem);
        this.list_frame.off(fgui.Events.CLICK_ITEM, this, this.onClickFrameItem);
        this.btn_sure.offClick(this, this.onBtnSureClick.bind(this));
        this.tabCtrl.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
        this.btn_equip.offClick(this, this.onBtnEquipClick);
        this.btn_unequip.offClick(this, this.onBtnUnequipClick);
        SNSManager.Instance.removeEventListener(SNSEvent.SNSINFO_UPDATE, this.__snsInfoSaveCompleteHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_HEADFRAME_INFO, this.updateView, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_HEADFRAME_ACTIVE, this.updateHeadRedStatus, this);
    }

    public OnShowWind() {
        super.OnShowWind();
        this.list_head.itemRenderer = Laya.Handler.create(this, this.renderHeadIconListItem, null, false);
        this.list_frame.itemRenderer = Laya.Handler.create(this, this.renderHeadFrameListItem, null, false);
        this.list_head.numItems = 26;//PathManager.getFaceNum();
        let headlist: Array<t_s_itemtemplateData> = TempleteManager.Instance.getGoodsTemplatesBySonType(GoodsSonType.SONTYPE_HEADFRAME);
        let filterHeadList: Array<t_s_itemtemplateData> = [];
        let item: t_s_itemtemplateData;
        for (let i: number = 0; i < headlist.length; i++) {
            item = headlist[i];
            if (item && item.Activation == -1) {//未激活也展示
                filterHeadList.push(item);
            } else if (HeadIconModel.instance.hasActive(item)) {//激活的
                filterHeadList.push(item);
            }
        }
        filterHeadList = ArrayUtils.sortOn(filterHeadList, "TemplateId", ArrayConstant.NUMERIC);
        this.listFrames = filterHeadList;
        this.list_frame.numItems = filterHeadList.length;
        this.currentHeadId = this.thane.snsInfo.headId;
        this.currentItemCfg = TempleteManager.Instance.getGoodsTemplatesByTempleteId(HeadIconModel.instance.currentEquipFrameId);
        if (HeadIconModel.instance.checkHasAllClick()) {//所有激活的都被点击过了
            this.redStatus.selectedIndex = 0;
        } else {
            this.redStatus.selectedIndex = 1;
        }
    }

    private __snsInfoSaveCompleteHandler() {
        this.currentHeadId = this.thane.snsInfo.headId;
        this.list_head.numItems = 26;
    }

    private updateHeadRedStatus() {
        this.redStatus.selectedIndex = 1;
    }

    private updateView() {
        let headlist: Array<t_s_itemtemplateData> = TempleteManager.Instance.getGoodsTemplatesBySonType(GoodsSonType.SONTYPE_HEADFRAME);
        let filterHeadList: Array<t_s_itemtemplateData> = [];
        let item: t_s_itemtemplateData;
        for (let i: number = 0; i < headlist.length; i++) {
            item = headlist[i];
            if (item && item.Activation == -1) {//未激活也展示
                filterHeadList.push(item);
            } else if (HeadIconModel.instance.hasActive(item)) {//激活的
                filterHeadList.push(item);
            }
        }
        filterHeadList = ArrayUtils.sortOn(filterHeadList, "TemplateId", ArrayConstant.NUMERIC);
        this.listFrames = filterHeadList;
        this.list_frame.numItems = filterHeadList.length;
        if (!HeadIconModel.instance.hasActive(this._currentItemCfg)) {
            this.operationCtr.selectedIndex = 2;
        } else {
            if (this._currentItemCfg && this._currentItemCfg.TemplateId != HeadIconModel.instance.currentEquipFrameId) {
                this.operationCtr.selectedIndex = 0;
            } else {
                this.operationCtr.selectedIndex = 1;
            }
        }
        this.icon_head.headId = this.currentHeadId;
        // if (HeadIconModel.instance.currentEquipFrameId > 0) {
        //     let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(HeadIconModel.instance.currentEquipFrameId);
        //     if (itemData) {
        //         this.icon_frame.headFrame = itemData.Avata;
        //         this.icon_frame.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
        //     }
        // }
        // else {
        //     this.icon_head.headFrame = "";
        //     this.icon_head.headEffect = "";
        // }
    }

    get currentHeadId(): number {
        return this._currentHeadId;
    }

    set currentHeadId(value: number) {
        if (this._currentHeadId == value) {
            return;
        }
        this._currentHeadId = value;
        this.refreshView(this._currentHeadId);
    }

    get currentItemCfg(): t_s_itemtemplateData {
        return this._currentItemCfg;
    }

    set currentItemCfg(value: t_s_itemtemplateData) {
        if (this._currentItemCfg == value) {
            return;
        }
        this._currentItemCfg = value;
        this.refreshView(this._currentItemCfg);
    }

    private refreshView(value: number | t_s_itemtemplateData) {
        if (typeof value == "number") {
            this.icon_head.headId = Number(value);
            if (HeadIconModel.instance.currentEquipFrameId > 0) {
                let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(HeadIconModel.instance.currentEquipFrameId);
                if (itemData) {
                    this.icon_head.headFrame = itemData.Avata;
                    this.icon_head.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
                }
            }
            else {
                this.icon_head.headFrame = "";
                this.icon_head.headEffect = "";
            }
        } else {
            this.icon_frame.headId = this._currentHeadId;
            let tempData = value as t_s_itemtemplateData;
            if (!tempData) return;
            this.icon_frame.headFrame = tempData.Avata;
            this.icon_frame.headEffect = (Number(tempData.Property1) == 1) ? tempData.Avata : "";
            this.headFrameNameTxt.text = tempData.TemplateNameLang;
            if (!HeadIconModel.instance.hasActive(tempData)) {
                this.operationCtr.selectedIndex = 2;
            } else {
                if (tempData && tempData.TemplateId != HeadIconModel.instance.currentEquipFrameId) {
                    this.operationCtr.selectedIndex = 0;
                } else {
                    this.operationCtr.selectedIndex = 1;
                }
            }
        }
    }

    private onClickHeadItem(item: HeadIcon, evt: Laya.Event) {
        this.currentHeadId = Number(item.sdata);
    }

    private onClickFrameItem(item: HeadIcon, evt: Laya.Event) {
        this.currentItemCfg = item.sdata as t_s_itemtemplateData;
        if (HeadIconModel.instance.hasActive(item.sdata as t_s_itemtemplateData)) {//未激活的
            item.redStatus.selectedIndex = 0;
            let headFrameInfo: HeadFrameInfo =  HeadIconModel.instance.allHeadFrameList.get((item.sdata as t_s_itemtemplateData).TemplateId)
            headFrameInfo.clickNum = 1;
            SharedManager.Instance.headIconClickDic[this.currentItemCfg.TemplateId] = 1;
            SharedManager.Instance.saveHeadIconClickDic();
            if (HeadIconModel.instance.checkHasAllClick()) {//所有激活的都被点击过了
                this.redStatus.selectedIndex = 0;
                //派发事件
                NotificationManager.Instance.sendNotification(NotificationEvent.UPDATE_HEADFRAME_CLICK_STATUS);
            }
        }
    }

    private onTabChanged(cc: fgui.Controller) {
        if (cc.selectedIndex == 0) {
            this.refreshView(this._currentHeadId);
        } else {
            this.refreshView(this._currentItemCfg);
        }
    }

    private renderHeadIconListItem(index: number, item: HeadIcon) {
        item.sdata = index + 1;
        item.select.selectedIndex = (this.thane.snsInfo.headId == item.sdata) ? 1 : 0;
        item.setBg = 1;
    }

    private renderHeadFrameListItem(index: number, item: HeadIcon) {
        item.setVisible = 1;
        item.sdata = this.listFrames[index];
        if (!HeadIconModel.instance.hasActive(item.sdata)) {//未激活的
            item.lock.selectedIndex = 1;
            item.redStatus.selectedIndex = 0;
            item.setBg = 1;
        } else {//已经激活的
            item.lock.selectedIndex = 0;
            if (!SharedManager.Instance.headIconClickDic[item.sdata.TemplateId]) {//未点击的
                item.redStatus.selectedIndex = 1;
            }
        }
        item.select.selectedIndex = (HeadIconModel.instance.currentEquipFrameId == item.sdata.TemplateId) ? 1 : 0;
    }

    private onBtnSureClick() {
        if (this._currentHeadId != this.thane.snsInfo.headId) {
            let msg: SNSInfoMsg = new SNSInfoMsg();
            msg.headId = this._currentHeadId;  //只发送头像ID, 即单独保存头像ID
            SocketManager.Instance.send(C2SProtocol.CH_SNS_UPDATE, msg);
        }
    }

    private onBtnEquipClick() {
        HeadIconCtr.changeFrameId(this._currentItemCfg.TemplateId);
    }

    private onBtnUnequipClick() {
        HeadIconCtr.changeFrameId(0);
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEventListener();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}