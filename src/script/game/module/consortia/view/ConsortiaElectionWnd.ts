import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import ConsortiaElectionItem from "./component/ConsortiaElectionItem";
import LangManager from '../../../../core/lang/LangManager';
import { ConsortiaSocektSendManager } from "../../../manager/ConsortiaSocektSendManager";
import { ConsortiaVotingUserInfo } from "../data/ConsortiaVotingUserInfo";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import UIManager from "../../../../core/ui/UIManager";

/**公会选举 */
export default class ConsortiaElectionWnd extends BaseWindow {
    private _contorller: ConsortiaControler;
    private _consortiaModel: ConsortiaModel;
    public playerList: fgui.GList;
    public descTxt: fgui.GTextField;
    public voteBtn: fgui.GButton;
    private _dataProvider: Array<ConsortiaVotingUserInfo> = [];
    private _selecteItem: ConsortiaElectionItem;
    public frame: fgui.GLabel;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initData();
        this.initEvent();
        this.refreshView();
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._consortiaModel = this._contorller.model;
        this.voteBtn.enabled = false;
        this.setDescTxt();
    }

    private initEvent() {
        this.voteBtn.onClick(this, this.voteBtnHandler);
        this.playerList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        this.playerList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this._consortiaModel.addEventListener(ConsortiaEvent.CONSORTIA_VOTINGLIST_CHANGE, this.refreshView, this);
        this.frame.getChild('helpBtn').onClick(this, this.helpBtnHandler);
    }

    private removeEvent() {
        this.voteBtn.offClick(this, this.voteBtnHandler);
        this.playerList.off(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        this.playerList.itemRenderer = null;
        this._consortiaModel.removeEventListener(ConsortiaEvent.CONSORTIA_VOTINGLIST_CHANGE, this.refreshView, this);
        this.frame.getChild('helpBtn').offClick(this, this.helpBtnHandler);
    }

    private helpBtnHandler() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanElection.help");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private onClickItem() {
        let selecteIndex: number = this.playerList.selectedIndex;
        let consortiaElectionItem:ConsortiaElectionItem = this.playerList.getChildAt(selecteIndex) as ConsortiaElectionItem
        if(consortiaElectionItem && consortiaElectionItem.enable == false)return;
        this._selecteItem = consortiaElectionItem;
        for (let i: number = 0; i < this.playerList.numItems; i++) {
            let item: ConsortiaElectionItem = this.playerList.getChildAt(i) as ConsortiaElectionItem;
            if (selecteIndex == i) {
                item.flag = true;
            }
            else {
                item.flag = false;
            }
        }
    }

    private voteBtnHandler() {
        if (this._selecteItem) {
            ConsortiaSocektSendManager.sendVotingInfo(this._selecteItem.info);
            this.voteBtn.enabled = false;
            this.OnBtnClose();
        }
    }

    renderListItem(index: number, item: ConsortiaElectionItem) {
        item.enable = (this._consortiaModel.hasVotePermission == false || this._consortiaModel.hasVoted == true) ? false : true;
        item.info = this._dataProvider[index];
    }

    private refreshView() {
        let dataList: Array<ConsortiaVotingUserInfo> = this._consortiaModel.votingUsers;
        if (!dataList) return;
        let itemData: ConsortiaVotingUserInfo;
        this._dataProvider = [];
        for (let i:number = 0; i < dataList.length; i++) {
            itemData = dataList[i];
            if (itemData && itemData.isVotingman) {
                this._dataProvider.push(itemData);
            }
        }
        let flag: boolean = true;
        if (this._dataProvider.length == 0 || this._consortiaModel.hasVotePermission == false || this._consortiaModel.hasVoted == true) {
            flag = false;
        }
        this.playerList.numItems = this._dataProvider.length;
        this.voteBtn.enabled = flag;
    }

    private setDescTxt() {
        var startDate: Date = this._consortiaModel.consortiaInfo.votingDate;
        var endDate: Date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), startDate.getHours());
        endDate.setDate(startDate.getDate()+14);
        if (endDate.getFullYear() == startDate.getFullYear()) {
            this.descTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanElection.note", endDate.getMonth() + 1, endDate.getDate(), endDate.getHours());
        } else {
            this.descTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.chairmanElection.note2", endDate.getFullYear(),(endDate.getMonth() + 1), endDate.getDate(), endDate.getHours());
        }
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