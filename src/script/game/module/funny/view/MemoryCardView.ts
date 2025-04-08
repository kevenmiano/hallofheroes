/*
 * @Author: jeremy.xu
 * @Date: 2022-05-27 11:37:41
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-08-29 17:40:03
 * @Description: 记忆翻牌
 */
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import BaseFguiCom from '../../../../core/ui/Base/BaseFguiCom';
import UIManager from '../../../../core/ui/UIManager';
import { MemoryCardData } from '../model/MemoryCardData';
import { GoodsInfo } from '../../../datas/goods/GoodsInfo';
import SimpleAlertHelper, { AlertBtnType } from "../../../component/SimpleAlertHelper";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { MemoryCardManager } from "../control/MemoryCardManager";
import LangManager from "../../../../core/lang/LangManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUI_MemoryCardView from "../../../../../fui/Funny/FUI_MemoryCardView";
import { SharedManager } from "../../../manager/SharedManager";
import MemoryCardItem from "./MemoryCardItem";
import Logger from '../../../../core/logger/Logger';
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { BaseItem } from '../../../component/item/BaseItem';
import { GoodsManager } from "../../../manager/GoodsManager";
import ItemID from "../../../constant/ItemID";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { FunnyContent } from "./FunnyContent";

export class MemoryCardView extends FUI_MemoryCardView implements FunnyContent {
    private _remainTime: number = 0;
    private _initFirstRefresh: boolean = true;

    protected onConstruct() {
        super.onConstruct();
        BaseFguiCom.autoGenerate(this, this)
    }

    onShow() {
        this.initView();
        this.addEvent();
        MemoryCardManager.Instance.memoryCardSendOp(MemoryCardData.OP_OPEN);
    }

    onUpdate() {
        this.initView();
    }

    onHide() {
        this.removeEvent();
    }

    private addEvent() {
        this.btnBuy.onClick(this, this.btnBuyClick)
        this.btnGet.onClick(this, this.btnGetClick)
        this.btnHelp.onClick(this, this.btnHelpClick)
        this.btnRefresh.onClick(this, this.btnRefreshClick)
        NotificationManager.Instance.addEventListener(NotificationEvent.MEMORYCARD_DATA_UPDATE, this.refreshView, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(NotificationEvent.MEMORYCARD_DATA_UPDATE, this.refreshView, this);
    }

    private initView() {
        for (let index = 0; index < this.list.numChildren; index++) {
            const item = this.list.getChildAt(index) as MemoryCardItem;
            item.onClick(this, this.__clickItem, [index]);
            item.index = index;
        }

        this.txt_btnBuyStep.text = LangManager.Instance.GetTranslation("NewMemoryCardFrame.btnBuyStep.text");
        let endTime = DateFormatter.parse(this.model.stopTime, "YYYY-MM-DD hh:mm:ss").getTime();
        this._remainTime = endTime / 1000 - PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
        if (this._remainTime > 0) {
            this.__updateTimeHandler();
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        } else {
            this.setRemainTime();
        }
    }

    setRemainTime() {
        this._remainTime--;
        if (this._remainTime >= 60) {
            this.txt_time.text = DateFormatter.getFullTimeString(this._remainTime);
        } else if (this._remainTime > 0) {
            this.txt_time.text = DateFormatter.getFullDateString(this._remainTime);
        } else {
            this.txt_time.text = LangManager.Instance.GetTranslation("activity.ActivityManager.command02");
            this.model.canOperate = false;
            this.model.isOpen = false;
            UIManager.Instance.HideWind(EmWindow.TodayNotAlert)
            NotificationManager.Instance.dispatchEvent(NotificationEvent.MEMORYCARD_STATE_UPDATE)
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("activity.ActivityManager.command02"))
        }
    }

    __updateTimeHandler() {
        this.setRemainTime();
    }

    public __clickItem(idx: number) {
        if (!this.model.canOperate) return;
        if (this.model.step <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("NewMemoryCardItem.step.txt"));
            return;
        }
        if (!this.model.lock && this.model.clickIndexArr.length < 2) {
            let item = this.list.getChildAt(idx) as MemoryCardItem;
            if (this.model.clickIndexArr.length == 1 && this.model.clickIndexArr[0] == idx) {
                item.imgSelect.visible = false;
                this.model.clickIndexArr = [];
                return;
            }

            if (this.model.clickIndexArr.length == 0) {
                item.imgSelect.visible = true;
            }
            this.model.clickIndexArr.push(idx);
            if (this.model.clickIndexArr.length >= 2) {
                this.model.lock = true;
                MemoryCardManager.Instance.memoryCardSendChoose();
            }
        }
    }

    public refreshView() {
        if (this._initFirstRefresh) {
            let posArr: string[] = this.model.posInfo.split(",");
            if (posArr.length == MemoryCardData.CARD_NUM) {
                let content: string = LangManager.Instance.GetTranslation("NewMemoryCardItem.content.txt");
                SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b) => {
                    if (b) {
                        MemoryCardManager.Instance.memoryCardSendOp(MemoryCardData.OP_REFRESH);
                    }
                }, AlertBtnType.O, true, true);
            }
            this._initFirstRefresh = false;
        }

        // 刷新不在此次翻牌队列的牌的可用状态
        for (let j: number = 0; j < this.list.numItems; j++) {
            let item = this.list.getChildAt(j) as MemoryCardItem;
            if (this.model.clickIndexArr.indexOf(j) == -1) {
                item.usable = !item.notUsable
            }
        }

        if (this.model.clickIndexArr.length >= 2) {
            for (let i: number = 0; i < this.model.clickIndexArr.length; i++) {
                let item = this.list.getChildAt(this.model.clickIndexArr[i]) as MemoryCardItem;
                item.playAni();
            }
        }

        this.txt_freeStep.text = this.model.freeStep.toString();
        this.txt_buyStep.text = this.model.buyStep.toString();

        let specialArr: any[] = this.model.specialInfo.split(",");
        let info: GoodsInfo = new GoodsInfo();
        info.templateId = specialArr[0];
        info.count = specialArr[1];
        (this.itemSpecial as BaseItem).info = info;
        (this.itemSpecial as BaseItem).countText = info.count.toString();

        this.btnRefresh.enabled = this.model.canRefresh;
        if (this.model.opType == MemoryCardData.OP_REFRESH) {
            Logger.xjy("刷新游戏")
            this.resetItem();
        }
    }

    private btnRefreshClick() {
        if (this.model.lock) return;
        let content: string = LangManager.Instance.GetTranslation("NewMemoryCardFrame.refresh.content.txt");
        SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b) => {
            if (b) {
                MemoryCardManager.Instance.memoryCardSendOp(MemoryCardData.OP_REFRESH);
            }
        });
    }

    private btnGetClick() {
        // if (this.model.lock) return;
        FrameCtrlManager.Instance.open(EmWindow.DisplayItems, { itemInfos: this.model.dropGoodsInfo, title: LangManager.Instance.GetTranslation("map.campaign.view.frame.MazeFallItemsFrame.title") })
    }

    private btnBuyClick() {
        if (!this.model.isOpen) return;
        let tmp = TempleteManager.Instance.getConfigInfoByConfigName("memorycard_limittimes")
        let limit = MemoryCardData.MEMORYCARD_LIMITIMES;
        if (tmp) {
            limit = Number(tmp.ConfigValue);
        }
        if (this.model.step >= limit) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("NewMemoryCardFrame.buy.limitText"));
            return;
        }
        // let max: number = Number(TempleteManager.Instance.getConfigInfoByConfigName("MEMORYCARD_MAXTIMES").ConfigValue);
        tmp = TempleteManager.Instance.getConfigInfoByConfigName("memorycard_maxtimes")
        let max = MemoryCardData.MEMORYCARD_MAXTIMES;
        if (tmp) {
            max = Number(tmp.ConfigValue);
        }
        if (this.model.buyCount >= max) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("NewMemoryCardFrame.buy.maxText"));
            return;
        }

        tmp = TempleteManager.Instance.getConfigInfoByConfigName("memorycard_costdiamond")
        let point = MemoryCardData.MEMORYCARD_COSTDIAMOND;
        if (tmp) {
            point = Number(tmp.ConfigValue);
        }
        if (SharedManager.Instance.checkIsExpired(SharedManager.Instance.memoryCardBuyAlertDate)) {
            let itemTmp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, ItemID.MEMORY_CARD_KEY) as t_s_itemtemplateData
            let propName = itemTmp ? itemTmp.TemplateNameLang : "";
            let leftCount = max - this.model.buyCount;
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, {
                state: 2, content: LangManager.Instance.GetTranslation("NewMemoryCardFrame.TodayNotAlert.content.text", point, propName, leftCount), backFunction: (check1: boolean, check2: boolean) => {
                    if (!this.buyCheckCallback()) return;
                    if (check1) {
                        SharedManager.Instance.memoryCardBuyAlertDate = new Date();
                        SharedManager.Instance.saveMemoryCardBuyAlertDate()
                    }
                }, closeFunction: () => {

                }
            });
        } else {
            this.buyCheckCallback()
        }
    }

    private buyCheckCallback() {
        let tmp = TempleteManager.Instance.getConfigInfoByConfigName("memorycard_costdiamond")
        let point = MemoryCardData.MEMORYCARD_COSTDIAMOND;
        if (tmp) {
            point = Number(tmp.ConfigValue);
        }

        let propNum: number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.MEMORY_CARD_KEY);

        let hasMoney: number = this.playerInfo.point;
        if (propNum < 1 && hasMoney < point) {
            RechargeAlertMannager.Instance.show();
            return false;
        }
        MemoryCardManager.Instance.memoryCardSendOp(MemoryCardData.OP_BUY);
        return true;
    }

    private btnHelpClick() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("NewMemoryCardFrame.helpTxt.text");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private resetItem() {
        for (let j: number = 0; j < this.list.numItems; j++) {
            let item = this.list.getChildAt(j) as MemoryCardItem;
            item.resetItem();
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public get model(): MemoryCardData {
        return MemoryCardManager.Instance.memoryCardData;
    }

    dispose() {
        Laya.timer.clear(this, this.__updateTimeHandler);
        MemoryCardManager.Instance.model.clear();
        this.removeEvent();
        super.dispose();
    }
}