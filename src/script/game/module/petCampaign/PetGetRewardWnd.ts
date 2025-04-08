// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { BaseItem } from "../../component/item/BaseItem";
import { t_s_dropitemData } from "../../config/t_s_dropitem";
import { t_s_uiplaylevelData } from "../../config/t_s_uiplaylevel";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PetCampaignManager } from "../../manager/PetCampaignManager";
import { TempleteManager } from "../../manager/TempleteManager";
import PetCampaignModel from "./PetCampaignModel";

export default class PetGetRewardWnd extends BaseWindow{
    private frame:fgui.GComponent;
    public list:fgui.GList;
	public getReward:fgui.GButton;
    private _selectedData: t_s_uiplaylevelData;
    private _goodsList:Array<GoodsInfo>;
    public OnInitWind() {
        this.setCenter();
        this.frame.getChild("title").text = LangManager.Instance.GetTranslation("yishi.view.tips.SinglePassRewardTip.firstKill");
        let frameData = this.frameData;
        if (frameData) {
            if (frameData.selectedData) {
                this._selectedData = frameData.selectedData;
                this.getReward.enabled = frameData.flag;
                let dataArr:Array<t_s_dropitemData> = TempleteManager.Instance.getDropItemssByDropId(this._selectedData.FristReward);
                if(dataArr && dataArr.length>0){
                    this._goodsList = [];
                    let len:number = dataArr.length;
                    for(let i:number = 0;i<len;i++){
                        let item:t_s_dropitemData = dataArr[i] as t_s_dropitemData;
                        let goods:GoodsInfo = new GoodsInfo();
                        goods.templateId = item.ItemId;
                        goods.count = item.Data;
                        this._goodsList.push(goods);
                    }
                }
            }
        }
        this.initEvent();
    }

    private initEvent(){
        this.getReward.onClick(this,this.getRewardHandler);
    }

    private removeEvent(){
        this.getReward.offClick(this,this.getRewardHandler);
    }

    private getRewardHandler(){
        PetCampaignManager.Instance.sendUIPlayChallenge(PetCampaignModel.GET_REWARD, this._selectedData.UiPlayId, this._selectedData.UiLevelId);
        this.hide();
    }

    OnShowWind() {
        super.OnShowWind();
        this.list.itemRenderer = Laya.Handler.create(this, this.renderLevelListItem, null, false);
        this.list.numItems = this._goodsList.length;
    }

    private renderLevelListItem(index: number, item: BaseItem) {
        item.info = this._goodsList[index];
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }
}