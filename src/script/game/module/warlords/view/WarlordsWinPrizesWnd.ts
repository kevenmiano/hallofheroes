// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { WarlordsEvent } from "../../../constant/event/NotificationEvent";
import WarlordsManager from "../../../manager/WarlordsManager";
import WarlordsModel from "../WarlordsModel";
import WarlordsPlayerInfo from "../WarlordsPlayerInfo";
import WarlordsWinPrizesItem from "./component/WarlordsWinPrizesItem";
/**
 * 众神之战获奖名单
 */
export default class WarlordsWinPrizesWnd extends BaseWindow {
    public rewardList:fgui.GList;
	public titleTxt:fgui.GTextField;
    private rankListData:Array<WarlordsPlayerInfo>;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initEvent();
        this.refresh();
        if (!this.warlordsModel.isExistData(WarlordsModel.LAST_AWARD)) {
            WarlordsManager.Instance.reqAwardList();
        }
    }

    private initEvent() {
        this.rewardList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.warlordsModel.addEventListener(WarlordsEvent.LAST_AWARDLIST_UPDATE, this.awardListUpdateHandler,this);
    }

    private removeEvent() {
        this.warlordsModel.removeEventListener(WarlordsEvent.LAST_AWARDLIST_UPDATE, this.awardListUpdateHandler,this);
    }

    private awardListUpdateHandler(){
        this.refresh();
    }

    private renderListItem(index: number, item: WarlordsWinPrizesItem) {
        item.info = this.rankListData[index];
    }

    public refresh() {
        this.rankListData = this.warlordsModel.lastAwardList;
        if(this.rankListData){
            this.rewardList.numItems = this.rankListData.length;
        }
        else{
            this.rewardList.numItems = 0;
        }
    }

    private get warlordsModel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}