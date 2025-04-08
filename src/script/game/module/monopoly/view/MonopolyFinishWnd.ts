// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ChatEvent, MonopolyEvent } from "../../../constant/event/NotificationEvent";
import { ChatChannel } from "../../../datas/ChatChannel";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MonopolyManager } from "../../../manager/MonopolyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import ChatData from "../../chat/data/ChatData";
import { MonopolyItemInfo } from "../model/MonopolyItemInfo";
import MonopolyModel from "../model/MonopolyModel";
import MonopolyFinishColumnView from "./MonopolyFinishColumnView";
import TempMsg = com.road.yishi.proto.campaign.TempMsg;
import CampaignNodeInfoMsg = com.road.yishi.proto.campaign.CampaignNodeInfoMsg;
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

/**
* @author:zhihua.zhou
* @data: 2022-12-19
* @description 云端历险闯关成功老虎机界面
    1、触发战斗时弹出显示奖励倍数
    2、到达终点通关成功时弹出
*/
export default class MonopolyFinishWnd extends BaseWindow 
{
    private _model:MonopolyModel;
    private _itemInfos:Array<any>;
    private _data:CampaignNodeInfoMsg;
    private btn_start: fairygui.GButton;
    txt_title:fairygui.GTextField;
    txt_cost:fairygui.GTextField;
    txt_first:fairygui.GTextField;
    ani:fairygui.GComponent;
    columns:fairygui.GComponent;
    _rewardView1:MonopolyFinishColumnView;
    _rewardView2:MonopolyFinishColumnView;
    _rewardView3:MonopolyFinishColumnView;
    trans:fairygui.Transition;
    private isPlaying:boolean=false;
    private _rewardIndex1:number = -1;
	private _rewardIndex2:number = -1;
	private _rewardIndex3:number = -1;
    private _playMax:number=0;
    private _playCount:number=0;

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this._model = MonopolyManager.Instance.model;
        this._itemInfos = [];
        this._rewardView1 = this.columns.getChild('column1') as MonopolyFinishColumnView;
        this._rewardView2 = this.columns.getChild('column2') as MonopolyFinishColumnView;
        this._rewardView3 = this.columns.getChild('column3') as MonopolyFinishColumnView;
        this.initLanguage();
        this.addEvent();
        this.setData(this.frameData);

        //消耗骰子数量
        this.txt_cost.text = this._model.endCost.toString();
        this.trans = this.ani.getTransition('tranArm')
        this.trans.stop(true);
        // this.updateBtnState();
    }

    private initLanguage(){
        this.txt_title.text = LangManager.Instance.GetTranslation('monopoly.suceess');
        this.btn_start.title = LangManager.Instance.GetTranslation('monopoly.start');
        this.txt_first.text = LangManager.Instance.GetTranslation('freeSlotmachineCount');
    }

    public setData(value:CampaignNodeInfoMsg):void
    {
        this._data = value;
        this.initItemInfos();
    }

    private initItemInfos():void
    {
        if(this._data)
        {
            this._itemInfos = [];
            this._data.nodeInfo.forEach(tempMsg => {
                this._itemInfos.push(tempMsg);
            });
            this._rewardView1.initInfos(this._itemInfos);
            this._rewardView2.initInfos(this._itemInfos);
            this._rewardView3.initInfos(this._itemInfos);
        }
    }

    private addEvent(){
        this.btn_start.onClick(this, this.onStart);
        this._model.addEventListener(MonopolyEvent.MONOPOLY_INFO_CHANGE, this.__infoChangeHandler,this);
    }

    private removeEvent(){
        this.btn_start.offClick(this, this.onStart);
        this._model.removeEventListener(MonopolyEvent.MONOPOLY_INFO_CHANGE, this.__infoChangeHandler,this);
    }

	private __infoChangeHandler(isBuyMagic):void
    {
        this.contentPane.getControllerAt(0).selectedIndex = this._model.slotMachineTimes > 0 ? 1 : 0;
        // this.updateBtnState();
        if(isBuyMagic) return;
        let tempMsg:TempMsg;
        let itemInfo1:MonopolyItemInfo = this._model.itemInfos[0] as MonopolyItemInfo;
        let itemInfo2:MonopolyItemInfo = this._model.itemInfos[1] as MonopolyItemInfo;
        let itemInfo3:MonopolyItemInfo = this._model.itemInfos[2] as MonopolyItemInfo;
        for(let i:number = 0; i < this._itemInfos.length; i++)
        {
            tempMsg = this._itemInfos[i] as TempMsg;
            if(this._rewardIndex1 == -1 && itemInfo1 && tempMsg.templateId == itemInfo1.templateId && tempMsg.count == itemInfo1.count) 
            {
                this._rewardIndex1 = i;
            }
            if(this._rewardIndex2 == -1 && itemInfo2 && tempMsg.templateId == itemInfo2.templateId && tempMsg.count == itemInfo2.count)
            {
                this._rewardIndex2 = i;
            }
            if(this._rewardIndex3 == -1 && itemInfo3 && tempMsg.templateId == itemInfo3.templateId && tempMsg.count == itemInfo3.count)
            {
                this._rewardIndex3 = i;
            }
        }
        this.handleQuickCallBack();
    }

    private handleQuickCallBack():void
    {
        this._playMax = 0;
        if(this._rewardIndex1 != -1)
        {
            this._playMax++;
            this._rewardView1.start(this.rewardPlayCallBack.bind(this), this._rewardIndex1, 10);
            this._rewardIndex1 = -1;
        }
        if(this._rewardIndex2 != -1)
        {
            this._playMax++;
            this._rewardView2.start(this.rewardPlayCallBack.bind(this), this._rewardIndex2, 20);
            this._rewardIndex2 = -1;
        }
        if(this._rewardIndex3 != -1)
        {
            this._playMax++;
            this._rewardView3.start(this.rewardPlayCallBack.bind(this), this._rewardIndex3, 30);
            this._rewardIndex3 = -1;
        }
    }

    private rewardPlayCallBack():void
    {
        this._playCount++;
        if(this._playCount >= this._playMax)
        {
            this._playCount = 0;
            this.showSlotRewardMsg();
            this.isPlaying = false;
        }
    }

    /**
     * 抽奖结束后提示获得什么
     */
    private showSlotRewardMsg():void
    {
        let content:string = "";
        let str:string = "";
        let goodsTempInfo:t_s_itemtemplateData;
        let goodsInfo:GoodsInfo;
        this._model.itemInfos.forEach(itemInfo => {
            goodsTempInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemInfo.templateId);
            if(goodsTempInfo)
            {
                goodsInfo = new GoodsInfo();
                goodsInfo.templateId = itemInfo.templateId;
                goodsInfo.count = itemInfo.count;
                content += LangManager.Instance.GetTranslation("MonopolyManager.BattleGetTip02", goodsTempInfo.TemplateNameLang, itemInfo.count);
            }
        });

        if(content != "")
        {
            content = content.substring(0, content.length - 1);
        }
        str = LangManager.Instance.GetTranslation("MonopolyManager.BattleGetTip01", content);
        let chatData:ChatData = new ChatData(); 
        chatData.channel = ChatChannel.INFO;
        chatData.msg = str;
        chatData.commit();
        NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT,chatData);
        MessageTipManager.Instance.show(str);
        if(this._model.isMail)
        {
            str = LangManager.Instance.GetTranslation("vip.view.VipBoxFrame.command03");
            MessageTipManager.Instance.show(str);
        }
    }

    // private updateBtnState(){
    //     //从背包读取骰子道具数量
    //     let count = GoodsManager.Instance.getGoodsNumByTempId(MonopolyModel.DICE_TEMPID);
    //     this.btn_start.enabled = count >= this._model.endCost;
    // }

    private leaveCampaign():void
    {
        MonopolyManager.Instance.sendLeaveCampaign();
    }

    private onStart(){
        if(this.isPlaying){
            return;
        }

        let count = GoodsManager.Instance.getGoodsNumByTempId(MonopolyModel.DICE_TEMPID);
        if(count >= this._model.endCost || this._model.slotMachineTimes > 0 ){
            this.isPlaying = true;
            this.trans.play(Laya.Handler.create(this,this.onAniComplete),1);
            return;
        }

        //若已达到最大购买上限，且魔力骰子数量为0，则点击时提示“魔力骰子不足”
        if(this._model.leftBuyTimes == 0){
            let str = LangManager.Instance.GetTranslation("MonopolyBottomView.magicBtnClickTip3");
            MessageTipManager.Instance.show(str);
            return;
        }

        //点击右下角魔力骰子、以及点击开始抽奖时，若魔力骰子数量为0，则弹出提示 ——“是否消耗X钻石购买1个魔力骰子？\n（本日还可购买X次）” 
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("monopoly.buyTimes",this._model.needDiamond,this._model.leftBuyTimes);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, {point:this._model.needDiamond,checkDefault: true }, prompt, content, confirm, cancel, this.callback.bind(this));    
    }

    private callback(b: boolean, usebind: boolean) {
		if (b) {
            MonopolyManager.Instance.sendMonopolyBuy(1,usebind);
		} 
	}

    private onAniComplete(){
        MonopolyManager.Instance.sendSlotMachine();
    }

    OnShowWind() {
        super.OnShowWind();
        this.contentPane.getControllerAt(0).selectedIndex = this._model.slotMachineTimes > 0 ? 1 : 0;
    }

    /**关闭 */
    OnHideWind() {
        this.leaveCampaign();
        this.removeEvent();
        super.OnHideWind();
    }
}