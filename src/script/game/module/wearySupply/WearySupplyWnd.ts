/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-03 10:35:50
 * @LastEditTime: 2024-02-19 17:54:34
 * @LastEditors: jeremy.xu
 * @Description: 体力补充
 */

import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { ItemWithSelectEffect } from "../../component/item/ItemWithSelectEffect";
import { SocketSendManager } from '../../manager/SocketSendManager';
import { GoodsManager } from '../../manager/GoodsManager';
import ItemID from '../../constant/ItemID';
import { BagEvent } from '../../constant/event/NotificationEvent';
import { TipsShowType } from '../../tips/ITipedDisplay';
import { NotificationManager } from '../../manager/NotificationManager';
import LangManager from '../../../core/lang/LangManager';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { PlayerManager } from '../../manager/PlayerManager';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import PveCampaignData from '../pve/pveCampaign/PveCampaignData';

export default class WearySupplyWnd extends BaseWindow {
    private btnConfirm: UIButton
    private btnCancel: UIButton
    private itemList: fgui.GList
    private selItem: ItemWithSelectEffect
    private selTemplateId: number = 0
    private goodInfoList: GoodsInfo[] = []
    private _type: number = 0;
    private descTxt1:fgui.GTextField;
	private descTxt2:fgui.GTextField;
    public OnInitWind() {
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        if (this.frameData) {
            if (this.frameData.type = 1) {
                this._type = 1;
                this.btnCancel.title = LangManager.Instance.GetTranslation("public.cancel")
            }
        }
        this.itemList.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.itemList.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.refreshPower, this);
        this.refresh();
        this.refreshPower();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdate, this);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.refreshPower, this);
    }

    private refreshPower(){
        this.descTxt1.text = LangManager.Instance.GetTranslation("WearySupplyWnd.descTxt1", PlayerManager.Instance.currentPlayerModel.playerInfo.weary,200);
        this.descTxt2.text = LangManager.Instance.GetTranslation("WearySupplyWnd.descTxt2",PlayerInfo.WEARY_GET_MAX-this.playerInfo.wearyLimit,PlayerInfo.WEARY_GET_MAX);
    }

    private __bagItemUpdate(good_infos: GoodsInfo[]) {
        for (let good_info of good_infos)
            if (good_info.templateId == ItemID.WEARY_MEDICINE0 || good_info.templateId == ItemID.WEARY_MEDICINE1 || good_info.templateId == ItemID.WEARY_MEDICINE2 || good_info.templateId == ItemID.WEARY_MEDICINE3) {
                this.refresh()
                break;
            }
    }

    private refresh() {
        this.goodInfoList = []
        let num0: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE0)
        let num1: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE1)
        let num2: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE2)
        let num3: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.WEARY_MEDICINE3)
        if (num3 > 0) {
            let gInfo = new GoodsInfo()
            gInfo.templateId = ItemID.WEARY_MEDICINE3
            gInfo.count = num3
            this.goodInfoList.push(gInfo)
        } else {
            if (this.selTemplateId == ItemID.WEARY_MEDICINE3) {
                this.selTemplateId = 0
            }
        }
        if (num2 > 0) {
            let gInfo = new GoodsInfo()
            gInfo.templateId = ItemID.WEARY_MEDICINE2
            gInfo.count = num2
            this.goodInfoList.push(gInfo)
        } else {
            if (this.selTemplateId == ItemID.WEARY_MEDICINE2) {
                this.selTemplateId = 0
            }
        }
        if (num1 > 0) {
            let gInfo = new GoodsInfo()
            gInfo.templateId = ItemID.WEARY_MEDICINE1
            gInfo.count = num1
            this.goodInfoList.push(gInfo)
        } else {
            if (this.selTemplateId == ItemID.WEARY_MEDICINE1) {
                this.selTemplateId = 0
            }
        }
        if (num0 > 0) {
            let gInfo = new GoodsInfo()
            gInfo.templateId = ItemID.WEARY_MEDICINE0
            gInfo.count = num0
            this.goodInfoList.push(gInfo)
        } else {
            if (this.selTemplateId == ItemID.WEARY_MEDICINE0) {
                this.selTemplateId = 0
            }
        }
        if (this.goodInfoList.length > 0) {
            this.itemList.numItems = this.goodInfoList.length

            Laya.timer.callLater(this, () => {
                if (this.destroyed) return;

                if (this.selTemplateId) {
                    let idx
                    for (let i = 0; i < this.itemList.numChildren; i++) {
                        const element = this.itemList.getChildAt(i) as ItemWithSelectEffect;
                        if (element.info.templateId == this.selTemplateId) {
                            idx = i;
                            break;
                        }
                    }
                    idx = idx ? idx : 0;
                    this.selItem = this.itemList.getChildAt(idx) as ItemWithSelectEffect;
                    this.itemList.selectedIndex = idx;
                } else {
                    this.selItem = this.itemList.getChildAt(0) as ItemWithSelectEffect;
                    this.itemList.selectedIndex = 0;
                }
            })
        } else {
            this.hide()
        }

    }

    private onClickItem(item: ItemWithSelectEffect) {
        this.selItem = item;
        this.selTemplateId = item.info.templateId;
    }

    private onRenderListItem(index: number, item: ItemWithSelectEffect) {
        let itemData = this.goodInfoList[index];
        if (!itemData) return;
        item.showName = true;
        item.item.showType = TipsShowType.onLongPress;
        item.info = itemData;
        item.item.countText = itemData.count.toString();
    }

    private btnConfirmClick() {
        if (!this.selItem) return;

        let tInfo: GoodsInfo
        let bagDic = GoodsManager.Instance.getGeneralBagList();
        for (const key in bagDic) {
            if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
                let info: GoodsInfo = bagDic[key];
                if (info.templateId == this.selItem.info.templateId) {
                    tInfo = info;
                    break;
                }
            }
        }

        if (tInfo) {
            let wearyGet: number = tInfo.templateInfo.Property2;
            let pos: number = tInfo.pos;
            let itemCount: number = 1;
            if (!this.checkWearyCanGet(wearyGet, pos, itemCount)) {
                return;
            }
            else {
                if (!this.checkWearyTodayCanGet(wearyGet, pos, itemCount)) {
                    return;
                }
            }
            SocketSendManager.Instance.sendUseItem(tInfo.pos);
        }
    }

    private checkWearyCanGet(wearyGet: number, pos: number, count: number = 1): boolean {
        // let wearyCanGet: number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
        // if (wearyGet > wearyCanGet) {
        //     let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command07", PlayerInfo.WEARY_MAX, wearyCanGet);
        //     SimpleAlertHelper.Instance.Show(null, [wearyGet, pos, count], null, content, null, null, this.wearyCanGetCallBack.bind(this));
        //     return false;
        // }
        return true;
    }

    private checkWearyTodayCanGet(wearyGet: number, pos: number, count: number = 1): boolean {
        let wearyTodayCanGet: number = PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
        if (wearyGet > wearyTodayCanGet) {
            let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command06", PlayerInfo.WEARY_GET_MAX, wearyTodayCanGet);
            SimpleAlertHelper.Instance.Show(null, [wearyGet, pos, count, true], null, content, null, null, this.wearyTodayCanGetCallBack.bind(this));
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
            let pos: number = data[1];
            SocketSendManager.Instance.sendUseItem(pos);
        }
    }

    private btnCancelClick() {
        if (this._type == 0) {
            NotificationManager.Instance.dispatchEvent(PveCampaignData.CancelUseWearySupply)
        }
        this.hide();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
}