import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import { eFilterFrameText, FilterFrameText } from "../../../component/FilterFrameText";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { BagType } from "../../../constant/BagDefine";
import { TreasureMapEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { SharedManager } from "../../../manager/SharedManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import TreasureMapManager from "../../../manager/TreasureMapManager";
import { TreasureMapSocketOutManager } from "../../../manager/TreasureMapSocketOutManager";
import { TreasureMapModel } from "../../../mvc/model/Treasuremap/TreasureMapModel";
import MapItem from "../item/MapItem";

/**
* @author:zhihua.zhou
* @data: 2021-11-11 10:24
* @description 领取宝图界面
*/
export default class TreasureClaimMapWnd extends BaseWindow {

    private list:fairygui.GList;
    private txt_name:fairygui.GTextField;
    private txt_count:fairygui.GTextField;
    private btn_refresh:fairygui.GButton;
    private btn_onekey:fairygui.GButton;
    private btn_claim:fairygui.GButton;

    private _treasureNameTxt:FilterFrameText;
    private _refreshItemCost:number = 0;
    private _refreshPointsCost:number = 0;
    private _quickPointsCost:number = 0;
    private _quickItemCost:number = 0;

    private listData:t_s_itemtemplateData[]=[];

    public get model():TreasureMapModel
    {
        return TreasureMapManager.Instance.model;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.model.updateVipReward();
        this._treasureNameTxt = new FilterFrameText(this.txt_name.width,this.txt_name.height,this.txt_name.font,this.txt_name.fontSize);
        this._treasureNameTxt.pos(this.txt_name.x +this.txt_name.width/2,this.txt_name.y);
        this.addChild(this._treasureNameTxt);
        this.addEvent();
        this._quickItemCost = Number(TempleteManager.Instance.getConfigInfoByConfigName('treasure_refresh_item').ConfigValue);
        this._quickPointsCost = this._quickItemCost * TreasureMapModel.COST_ITEM_TO_POINTS;
        TreasureMapSocketOutManager.sendRequestTreasureMap();
    }

    private addEvent():void{
        this.btn_claim.onClick(this,this.onClaim);
        this.btn_refresh.onClick(this,this.onRefresh);
        this.btn_onekey.onClick(this,this.onOnekey);
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderList, null, false);
        this.model.addEventListener(TreasureMapEvent.TREASURE_INFO_UPDATE, this.__treasureInfoUpdateHandler,this);
    }

    private __treasureInfoUpdateHandler(e:TreasureMapEvent):void{
        let mapID:number = this.model.templateIds[this.model.index];
		let itemtemplateData:t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(mapID);
        if(itemtemplateData){
            this._refreshItemCost = itemtemplateData.Property3;
            this._refreshPointsCost = this._refreshItemCost * TreasureMapModel.COST_ITEM_TO_POINTS;
            this._treasureNameTxt.text = itemtemplateData.TemplateNameLang;
            this._treasureNameTxt.setFrame(this.model.index+1,eFilterFrameText.TreasureMapQuality);
            this.txt_count.text =  (this.model.joinMax - this.model.joinCount) + " / " + this.model.joinMax;
        }
        
        for (let i = 0; i < 4; i++) {
            let itemData:t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this.model.templateIds[i]);
            this.listData[i] = itemData;
        }
        this.list.numItems = this.listData.length;
        this.setBtnEnabled();
    }

    /**
     * 更新按钮状态
     */
    private setBtnEnabled():void
    {
        if(this.model.index >= TreasureMapModel.QUALITY_MAX || this.model.joinCount >= this.model.joinMax)
        {
            this.btn_refresh.enabled = false;
            this.btn_onekey.enabled = false;
        }else
        {
            this.btn_refresh.enabled = true;
            this.btn_onekey.enabled = true;

        }
        if(this.model.joinCount >= this.model.joinMax)
        {
            this.btn_claim.enabled = false;
        }else
        {
            this.btn_claim.enabled = true;
        }
    }

    private onRenderList(index: number, item: MapItem)
    {
        let itemData:t_s_itemtemplateData = this.listData[index];
        item.getControllerAt(0).setSelectedIndex(index);
        item.border.getControllerAt(0).setSelectedIndex(index);
        // item.txt_name.text = itemData.TemplateName;
        item.txt_name.color =FilterFrameText.Colors[eFilterFrameText.TreasureMapQuality][index];
        item.txt_count.text = 'X'+itemData.Property6;
        if(index < this.model.index)
        {
            item.border.visible = false;
        }
        else if(index == this.model.index)
        {
            item.border.visible = true;
        }else
        {
            item.border.visible = false;
        }
    }


    /**
     * 领取宝图
     */
    private onClaim():void
    {
        let  needAlert:Boolean = !SharedManager.Instance.claimMapNotAlert;
        /** 是否需要弹出提示 在判断组队人数之后才做这个判断 */
        if(needAlert && !FreedomTeamManager.Instance.teamIsFull)
        {
            let content = LangManager.Instance.GetTranslation("map.internals.view.treasuremap.TreasureMapGetFrame.getBtnAlertTxt",this._refreshPointsCost);
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.claimBackFun.bind(this), state: 2 });
        }
        else if(this.model.joinCount < this.model.joinMax)
        {
            TreasureMapSocketOutManager.sendGetTreasureMap();
        }
    }

    /**
     * 
     * @param quickly 是否一键刷新
     * @param useBind 是否使用绑定钻石
     */
    private reqRefresh(quickly:boolean, useBind:boolean):void{
        if(this.model.joinCount < this.model.joinMax)
		{
            let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
            var hasMoney:number = playerInfo.point;
            var hasItem:number = GoodsManager.Instance.getBagCountByTempId(BagType.Player, TreasureMapModel.COST_TEMPLATE_ID);
            var pointsCost:number = 0;
			hasMoney = hasMoney + hasItem * TreasureMapModel.COST_ITEM_TO_POINTS;
			if(useBind)
			{
				hasMoney = hasMoney + playerInfo.giftToken;
			}
            if(quickly)
			{
				pointsCost = this._quickPointsCost;
			}else 
			{
				pointsCost = this._refreshPointsCost;
			}
            if(hasMoney >= pointsCost)
			{
				TreasureMapSocketOutManager.sendRefreshTreasureMap(quickly, useBind);
			}else
			{
				RechargeAlertMannager.Instance.show();
			}
		}
    }

    /**
     * 领取宝图弹窗确认回调
     * @param notAlert 
     */
    private claimBackFun(notAlert: boolean){
        if (notAlert) {
            SharedManager.Instance.claimMapNotAlert = true;
            SharedManager.Instance.saveTreasureMapNotAlertNextTime();
        }
        TreasureMapSocketOutManager.sendGetTreasureMap();
    }

    /**
     * 刷新奖励
     */
    private onRefresh():void
    {
        // if(SharedManager.Instance.refreshRewardNotAlert){
        //     this.reqRefresh(false,SharedManager.Instance.refreshRewardUseBind);
        //     return;
        // }
        let content = LangManager.Instance.GetTranslation("map.internals.view.treasuremap.TreasureMapGetFrame.refreshBtnAlertTxt",this._refreshPointsCost);
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.onRefreshCallback0.bind(this), state: 1 });
    }



    /**
     * 一键刷新奖励
     */
    private onOnekey():void
    {
        // if(SharedManager.Instance.quicklyRefreshRewardNotAlert){
        //     this.reqRefresh(true,SharedManager.Instance.quicklyRefreshRewardUseBind);
        //     return;
        // }
        let content = LangManager.Instance.GetTranslation("map.internals.view.treasuremap.TreasureMapGetFrame.quicklyRefreshBtnAlertTxt",this._quickPointsCost);
        UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.onRefreshCallback1.bind(this), state: 1 });
    }

    /**
     * 立即刷新弹窗确认回调
     * @param notAlert 
     * @param useBind 
     */
    private onRefreshCallback0(notAlert: boolean, useBind: boolean) {
        if (notAlert) {
            SharedManager.Instance.refreshRewardNotAlert = true;
            SharedManager.Instance.saveTreasureMapNotAlertNextTime();
        }

        SharedManager.Instance.refreshRewardUseBind = useBind;
        SharedManager.Instance.saveTreasureMapNotAlertNextTime();
        this.reqRefresh(false,SharedManager.Instance.refreshRewardUseBind);
    }

    /**
     * 一键刷新新弹窗确认回调
     * @param notAlert 
     * @param useBind 
     */
    private onRefreshCallback1(notAlert: boolean, useBind: boolean) {
        if (notAlert) {
            SharedManager.Instance.quicklyRefreshRewardNotAlert = true;
            SharedManager.Instance.saveTreasureMapNotAlertNextTime();
        }
       
        SharedManager.Instance.quicklyRefreshRewardUseBind = useBind;
        SharedManager.Instance.saveTreasureMapNotAlertNextTime();
        this.reqRefresh(true,SharedManager.Instance.quicklyRefreshRewardUseBind);
    }

    /**
     * 帮助说明
     */
    private helpBtnClick() {
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation("TreasureMap.help0");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    OnShowWind() {
        super.OnShowWind();
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private removeEvent():void
    {
        this.btn_claim.offClick(this,this.onClaim);
        this.btn_refresh.offClick(this,this.onRefresh);
        this.btn_onekey.offClick(this,this.onOnekey);
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.model.removeEventListener(TreasureMapEvent.TREASURE_INFO_UPDATE, this.__treasureInfoUpdateHandler,this);
    }
}