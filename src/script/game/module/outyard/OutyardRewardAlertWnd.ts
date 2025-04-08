// @ts-nocheck
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import Utils from "../../../core/utils/Utils";
import { BaseItem } from "../../component/item/BaseItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import OutyardRewardInfo from "./data/OutyardRewardInfo";

export default class OutyardRewardAlertWnd extends BaseWindow{
    public rewardList:fgui.GList;
    private _listData:Array<GoodsInfo> = [];
    public OnInitWind() {
        this.setCenter();
        this.addEvent();
        this.initView();
    }
    
    OnShowWind() {
        super.OnShowWind();
    }

    private initView(){
        this._listData = this.getListData();
        this.rewardList.numItems = this._listData.length;
    }
    
    private addEvent() {
        this.rewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private removeEvent() {
        // this.rewardList.itemRenderer.recover();
        Utils.clearGListHandle(this.rewardList);
    }

    private renderListItem(index: number, item: BaseItem) {
        if (!item || item.isDisposed) return;
        item.info = this._listData[index];
    }

    private getListData():Array<GoodsInfo>{
        let outyardRewardArr:OutyardRewardInfo[] = TempleteManager.Instance.getOutyardRewardByType(2);
        outyardRewardArr = ArrayUtils.sortOn(outyardRewardArr, ["rank"], [ArrayConstant.DESCENDING]);
        let len:number = outyardRewardArr.length;
        let outyardRewardInfo:OutyardRewardInfo;
        let item:OutyardRewardInfo;
        for(let i:number = 0;i<len;i++){
            outyardRewardInfo = outyardRewardArr[i];
            if(outyardRewardInfo && outyardRewardInfo.cost <= this.playerInfo.outyardCostEnergy){
                item = outyardRewardInfo;
                break;
            }
        }
        if(item){
            return item.goodsInfoArr;
        }
        return [];
    }
    
    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    
    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    dispose() {
        super.dispose();
    }
}