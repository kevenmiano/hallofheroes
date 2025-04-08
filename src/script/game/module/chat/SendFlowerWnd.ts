// @ts-nocheck
import FUI_SendFlowerItem from "../../../../fui/Chat/FUI_SendFlowerItem";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import Utils from "../../../core/utils/Utils";
import { NumericStepper } from "../../component/NumericStepper";
import { BaseItem } from "../../component/item/BaseItem";
import { CommonConstant } from "../../constant/CommonConstant";
import RelationType from "../../constant/RelationType";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { BagEvent } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { FilterWordManager } from "../../manager/FilterWordManager";
import { FriendManager } from "../../manager/FriendManager";
import { GoodsManager } from '../../manager/GoodsManager';
import { MessageTipManager } from "../../manager/MessageTipManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import FUIHelper from "../../utils/FUIHelper";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";

/**
* @author:zhihua.zhou
* @data: 2021-12-21
* @description 聊天赠花
*/
export default class SendFlowerWnd extends BaseWindow {

    private list: fairygui.GList;
    private listData: Array<GoodsInfo> = []
    public stepper: NumericStepper;
    private txt_name: fairygui.GTextField;
    private txt_player: fairygui.GTextField;
    private txt_num: fairygui.GTextField;
    private txt_desc: fairygui.GTextInput;
    protected _count: number = 1;
    public btn_send: fgui.GButton;
    private curData: GoodsInfo;
    private _targetName: string;
    private btn_close: fairygui.GButton;
    private frame: fairygui.GComponent;
    private c1: fairygui.Controller;

    public OnInitWind() {
        super.OnInitWind();
        this.btn_close = this.frame.getChild('closeBtn').asButton;
        this.setCenter();
        this.addEvent();
        this.initList();
        this.c1 = this.getController('c1');

        this._targetName = this.params;
        this.txt_player.text +=  `[color=#0000FF]${this._targetName}[/color]`;
        this.onItemSelect(this.list.getChildAt(0));
        // this._handler = Laya.Handler.create(this, this.stepperChangeHandler, null, false);
        // this.select_com.touchable = false;
        (this.txt_desc.displayObject as Laya.Input).wordWrap = true;
    }


    initList() {
        let goodsInfo: GoodsInfo;
        let tid: number = 0;
        for (let i = 0; i < 6; i++) {
            tid = i + 2170001;
            let arr: GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId(tid);
            if (arr && arr[0]) {
                goodsInfo = arr[0];
            } else {
                goodsInfo = new GoodsInfo();
                goodsInfo.templateId = tid;
            }
            this.listData.push(goodsInfo);
        }
        this.listData =  ArrayUtils.sortOn(this.listData, ["count"], ArrayConstant.NUMERIC | ArrayConstant.DESCENDING);
        //礼物栏根据背包内物品数量排序，且背包内没有的物品置灰，同时右下角增加数量为0时的显示
        this.list.numItems = this.listData.length;
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onItemSelect);
        this.btn_send.onClick(this, this.onSend);
        this.btn_close.onClick(this, this.onClose);
        this.txt_desc.on(Laya.Event.INPUT, this, this.onChange, [1]);
        Utils.setDrawCallOptimize(this.list);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
    }


    private __bagItemUpdateHandler(infos: GoodsInfo[]) {
        this.updateList();
    }

    private __bagItemDeleteHandler(infos: GoodsInfo[]) {
       this.updateList();
    }

    private updateList(){
        let array = this.listData;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            let arr: GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId(element.templateId);
            if (arr && arr[0]) {
                element.count =arr[0].count;
            } else {
                element.count =0;
            }
        }
        this.list.numItems = this.listData.length;
        let limit = Math.max(1, this.curData.count);
        this.stepper.show(0, this._count, 1, 999, limit, 1, null);
    }

    private onChange(): void {
        let len = this.txt_desc.text.length;
        let maxCount = TempleteManager.Instance.CfgMaxWordCount
        if (len > maxCount) {
            len = maxCount;
            this.txt_desc.text = this.txt_desc.text.substring(0, maxCount);
        }
        this.txt_num.text = LangManager.Instance.GetTranslation("yishi.view.RosePresentView.wordCount", len, maxCount);
    }

    onClose() {
        UIManager.Instance.HideWind(EmWindow.SendFlowerWnd);
    }

    private removeEvent() {
        this.txt_desc.off(Laya.Event.INPUT, this, this.onChange);
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.onItemSelect);
        this.btn_send.offClick(this, this.onSend);
        this.btn_close.offClick(this, this.onClose);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
    }

    onSend() {
        if (this.c1.selectedIndex == 1) {
            // if (StringUtils.checkEspicalWorld(this.txt_desc.text)) {
            //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("special.words"));
            //     return;
            // }
            if (FilterWordManager.isGotForbiddenWords(this.txt_desc.text, "name") || FilterWordManager.isGotForbiddenWords(this.txt_desc.text, "chat")) {
                let str: string = LangManager.Instance.GetTranslation("consortia.ConsortiaControler.command05");
                MessageTipManager.Instance.show(str);
                return;
            }
        } else {
            this.txt_desc.text = '';
        }
        this.sendRosePresent(this.curData.templateId, this._targetName, this.stepper.value, this.txt_desc.text);
    }

    private renderListItem(index: number, cell: FUI_SendFlowerItem): void {
        let itemData: GoodsInfo = this.listData[index];
        let baseItem = (cell.getChild('item') as BaseItem);
        baseItem.info = itemData;
        if(itemData.count == 0){
            baseItem.text = '0';
            //背包内没有的物品置灰
            baseItem.grayed = true;
        }else{
            baseItem.grayed = false;
        }
        baseItem.touchable = false;
    }

    private _lastSelect:FUI_SendFlowerItem;

    /**选择功能按钮 */
    onItemSelect(targetItem) {
        this.curData = targetItem.getChild('item').info;
        if(this._lastSelect){
            this._lastSelect.getController('c1').selectedIndex = 0;
            this._lastSelect.getChild('item').touchable = false;
        }
        targetItem.getController('c1').selectedIndex = 1;
        targetItem.getChild('item').touchable = true;
        this._lastSelect = targetItem;
        this.txt_name.text = this.curData.templateInfo.TemplateNameLang;

        let limit = Math.max(1, this.curData.count);
        this.stepper.show(0, this._count, 1, 999, limit, 1, null);
        if(this.curData.templateId > 2170002){
            this.c1.setSelectedIndex(1);
            this.onChange();
        }else{
            this.c1.setSelectedIndex(0);
            this.stepper.visible = true;
            this.txt_desc.text = '';
        }
    }

    showQuickBuy() {
        var data: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(this.curData.templateId);
        if (!data) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("giftbag.GiftBagItem.noGoodsText"));
            return;
        }
        let obj = {
            info: data,
            count: 1,
            // callback: this.buySucCallback.bind(this),
        }
        FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, obj);
    }

    private sendRosePresent($roseTempId: number, $fname: string, $useCount: number, content: string): boolean {
        if ($useCount <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("giftbag.GiftBagItem.noGoodsText"));
            this.showQuickBuy();
            return false;
        }
        let goodsArr: GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId($roseTempId);
        if (goodsArr.length == 0) {
            this.showQuickBuy();
            // this.onClose();
        }
        else {
            let fInfo: ThaneInfo = this.getFriendInfoByName($fname);
            if (!fInfo) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("friends.im.IMFrame.present.NotFriends"));
                return false;
            }
            // let str = LangManager.Instance.GetTranslation("colosseum.view.ColosseumEventItem.txt2") + " " +
            //     LangManager.Instance.GetTranslation("yishi.view.frame.BuyFrameI.Presentation") + " " +
            //     this._targetName + ' ' + this.txt_name.text + ($useCount > 1 ? " x" + $useCount.toString() : "");
            // MessageTipManager.Instance.show(str);
            goodsArr = ArrayUtils.sortOn(goodsArr, "isBinds", ArrayConstant.DESCENDING);
            SocketSendManager.Instance.sendUseItem(goodsArr[0].pos, $useCount, 1, content, fInfo.userId);
            // this.onClose();
            return true;
        }
    }

    public getFriendInfoByName(name: string): ThaneInfo {
        let dic = FriendManager.getInstance().friendList;
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let info: ThaneInfo = dic[key];
                if (info.nickName == name && info.relation == RelationType.FRIEND) {
                    return info;
                }
            }
        }
        return null;
    }

    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

}