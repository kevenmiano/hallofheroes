import FUI_SortRankItemTitle from '../../../../fui/Sort/FUI_SortRankItemTitle';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { WarlordsEvent } from '../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { JobType } from '../../constant/JobType';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { PlayerManager } from '../../manager/PlayerManager';
import WarlordsManager from '../../manager/WarlordsManager';
import FUIHelper from '../../utils/FUIHelper';
import { ThaneInfoHelper } from '../../utils/ThaneInfoHelper';
import WarlordsModel from '../warlords/WarlordsModel';
import { WARLORDS_TAB } from './SortWnd';
import SortMemberItem from './SortMemberItem';
import Utils from '../../../core/utils/Utils';
/**
* @author:pzlricky
* @data: 2021-08-25 18:04
* @description 众神榜排行榜
*/
export default class WarlordsWnd extends BaseWindow {

    public frame: fgui.GComponent;
    public rankTitle: FUI_SortRankItemTitle;

    public time: fgui.GRichTextField;
    public para1: fgui.GRichTextField;
    public para2: fgui.GRichTextField;

    public tablist: fgui.GList;
    public contentList: fgui.GList;

    private _curSelectedJob: number = 0;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        let titleText = LangManager.Instance.GetTranslation("warlords.WarlordsRankFrame.str01");
        this.frame.getChild('title').text = titleText;
        this.addEvent();
        this.initView();
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private initView() {
        this.layout();
        this.initWarsTabList();
        this.__onSelectedChangeHandler();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private addEvent() {
        this.tablist.on(Laya.Event.CLICK, this, this.__onSelectedChangeHandler.bind(this));
        this.tablist.itemRenderer = Laya.Handler.create(this, this._rankTabRender, null, false);
        this.contentList.itemRenderer = Laya.Handler.create(this, this._rankCellRender, null, false);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerInfoUpdateHandler, this);
        this.smodel.addEventListener(WarlordsEvent.INFO_UPDATE, this.__warlordsInfoUpdateHandler, this);
    }

    private removeEvent() {
        this.tablist.off(Laya.Event.CLICK, this, this.__onSelectedChangeHandler.bind(this));
        this.tablist.itemRenderer = Laya.Handler.create(this, this._rankTabRender, null, false);
        // this.contentList.itemRenderer.recover();
        Utils.clearGListHandle(this.contentList);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__playerInfoUpdateHandler, this);
        this.smodel.removeEventListener(WarlordsEvent.INFO_UPDATE, this.__warlordsInfoUpdateHandler, this);
    }

    /**渲染左侧Tab列表 */
    private _rankTabRender(index: number, btnItem: fgui.GButton) {
        let btnData = this.rankWarlordsTabData[index];
        if (btnData) {
            btnItem.data = btnData;
            btnItem.title = btnData.title;
            btnItem.selectedTitle = btnData.selectedTitle;
            btnItem.icon = btnData.icon;
            btnItem.selectedIcon = btnData.selectedIcon;
        }
    }

    /**渲染单元格 */
    private _rankCellRender(index: number, cellItem: SortMemberItem) {
        if (this.currContentData) {
            let data = this.currContentData[index];
            cellItem.iswarlords = true;
            cellItem.issuperwarlords = true;
            cellItem.vdata = data;
        }
    }

    /**初始化众神战Tab */
    private rankWarlordsTabData: Array<any> = [];
    private initWarsTabList() {
        this.rankWarlordsTabData = [];
        this.createTabData(WARLORDS_TAB.WARRIOR, LangManager.Instance.GetTranslation("yishi.datas.consant.JobType.Name02"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankWarlordsTabData);
        this.createTabData(WARLORDS_TAB.WIZARD, LangManager.Instance.GetTranslation("yishi.datas.consant.JobType.Name04"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankWarlordsTabData);
        this.createTabData(WARLORDS_TAB.HUNTER, LangManager.Instance.GetTranslation("yishi.datas.consant.JobType.Name03"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankWarlordsTabData);
        this.tablist.numItems = this.rankWarlordsTabData.length;
        if(ThaneInfoHelper.getJob(ArmyManager.Instance.thane.job) - 1 == 0){
            this.tablist.selectedIndex = 0;
        }
        else if(ThaneInfoHelper.getJob(ArmyManager.Instance.thane.job) - 1 == 1)
        {
            this.tablist.selectedIndex = 2;
        }
        else
        {
            this.tablist.selectedIndex = 1;
        }
    }

    /**设置列表数据 */
    private currContentData = [];
    private setTabData() {
        var totalList = this.smodel.getListData(WarlordsModel.LAST_RANK, this._curSelectedJob);
        let temp = [];
        if (totalList) {
            for (const key in totalList) {
                if (Object.prototype.hasOwnProperty.call(totalList, key)) {
                    let element = totalList[key];
                    temp.push(element);
                }
            }
            this.currContentData = temp;
            this.contentList.numItems = temp.length;
        } else {
            this.currContentData = null;
            this.contentList.numItems = 0;
        }
    }

    private createTabData(index: number, text: string, iconstr: string, selectedIconstr: string, targetArray: Array<any> = null): any {
        let icon = FUIHelper.getItemURL('Base', iconstr);
        let selectedIcon = FUIHelper.getItemURL('Base', selectedIconstr);
        let obj = {
            index: index,
            title: "[color=#d1b186][size=24]" + text + "[/size][/color]",
            selectedTitle: "[color=#fffad6][size=24]" + text + "[/size][/color]",
            icon: icon,
            selectedIcon: selectedIcon
        };
        targetArray && targetArray.push(obj);
        return obj;
    }

    private __playerInfoUpdateHandler(evt) {
        this.para2.setVar('value', this.playerInfo.fightingCapacity.toString()).flushVars();
    }

    private __warlordsInfoUpdateHandler(evt) {
        this.refresh();
        this.setTabData();
    }

    private get smodel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    public refresh() {
        this.para1.setVar('text', LangManager.Instance.GetTranslation('PetChallengeInfoView.rankingLabel')).flushVars();
        this.time.setVar('text', LangManager.Instance.GetTranslation('sort.view.SortRightView.lastUpdateTime')).flushVars();
        if (this.smodel.lastSelfRank >= 1 && this.smodel.lastSelfRank <= WarlordsModel.DIVIDING_RANK) {
            this.para1.setVar('value', this.smodel.lastSelfRank.toString()).flushVars();
        } else {
            this.para1.setVar('value', LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople")).flushVars();
        }
        if (this.smodel.rankListCreateDate) {
            this.time.setVar('time', DateFormatter.format(this.smodel.rankListCreateDate, "MM-DD hh:mm")).flushVars();
        } else {
            this.time.setVar('time', "00-00 00:00").flushVars();
        }
        this.para2.setVar('text', LangManager.Instance.GetTranslation('warlords.WarlordsBetSelectFrame.ap') + ": ").flushVars();
        this.para2.setVar('value', this.playerInfo.fightingCapacity.toString()).flushVars();
    }

    private __onSelectedChangeHandler() {
        this.contentList.numItems = 0;
        let tabIndex: number = this.tablist.selectedIndex;
        switch (tabIndex) {
            case WARLORDS_TAB.WARRIOR:
                this._curSelectedJob = JobType.WARRIOR;
                break;
            case WARLORDS_TAB.WIZARD:
                this._curSelectedJob = JobType.WIZARD;
                break;
            case WARLORDS_TAB.HUNTER:
                this._curSelectedJob = JobType.HUNTER;
                break;
        }
        if (this.smodel.isExistData(WarlordsModel.LAST_RANK, this._curSelectedJob)) {
            this.refresh();
            this.setTabData();
        } else {
            WarlordsManager.Instance.loadLastRankList(this._curSelectedJob);
        }
    }


    private layout() {
        var titles: Array<string> = [
            LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
            LangManager.Instance.GetTranslation("warlords.WarlordsBetSelectFrame.name"),
            LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
            LangManager.Instance.GetTranslation("warlords.WarlordsBetSelectFrame.ap"),
            LangManager.Instance.GetTranslation("warlords.room.WarlordsFinalRoomRightView.winTitle")
        ];
        var str: string = "200,200,160,300,160";
        if (!titles || !str) return;
        var arr: Array<string> = str.split(",");
        var i: number = 0;
        var xx: number = 9;
        for (let index = 0; index < 7; index++) {
            var txt: fgui.GTextField = this.rankTitle.getChild('title' + index).asTextField;
            txt.text = "";
        }
        for (const key in arr) {
            if (Object.prototype.hasOwnProperty.call(arr, key)) {
                var w: string = arr[key];
                var numW: number = Number(w);
                var txt: fgui.GTextField = this.rankTitle.getChild('title' + i).asTextField;
                var title: string = titles[i];
                txt.text = title;
                txt.width = numW;
                txt.x = xx;
                xx += numW;
                i++;
            }
        }
    }

}