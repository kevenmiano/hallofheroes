import FUI_SortRankItemTitle from '../../../../fui/Sort/FUI_SortRankItemTitle';
import AudioManager from '../../../core/audio/AudioManager';
import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import { SortEvent } from '../../constant/event/NotificationEvent';
import { JobType } from '../../constant/JobType';
import { SoundIds } from '../../constant/SoundIds';
import { EmWindow } from '../../constant/UIDefine';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { ConsortiaManager } from '../../manager/ConsortiaManager';
import { MountsManager } from '../../manager/MountsManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import FUIHelper from '../../utils/FUIHelper';
import { ConsortiaInfo } from '../consortia/data/ConsortiaInfo';
import SortController from './SortController';
import SortData from './SortData';
import SortMemberItem from './SortMemberItem';
import SortModel from './SortModel';
import UIManager from '../../../core/ui/UIManager';
import { PetData } from '../pet/data/PetData';
import ComponentSetting from '../../utils/ComponentSetting';
import Utils from '../../../core/utils/Utils';
import { ConfigManager } from '../../manager/ConfigManager';

export enum SORT_TAB {
    LEVLE,
    POW,
    CONSORTIA_LEVEL,
    CONSORTIA_POW,
    HONOUR,
    CHARMS,
    SOUL,
    PETPOWER,
    WARLORDS
}

export enum ZONE_TAB {
    LOCAL = 0,//本区
    ALL,//全区
}

export enum DATE_TAB {
    DAY = 0,//日增
    WEEK,//周增
    ALL,//积累
}

export enum WARLORDS_TAB {
    WARRIOR = 0,//战士
    WIZARD,//法师
    HUNTER,//射手
}

/**
* @author:pzlricky
* @data: 2021-08-20 10:55
* @description 全部排行榜
*/
export default class SortWnd extends BaseWindow {
    public modelEnable: boolean = false;
    public tabState: fgui.Controller;
    public rankTablist: fgui.GList;
    public zoneTablist: fgui.GList;
    public dateTablist: fgui.GList;
    public contentList: fgui.GList;
    public warLordsTablist: fgui.GList;
    public warlordsContentList: fgui.GList;
    public rankTitle: FUI_SortRankItemTitle;
    public warlordsRankTitle: FUI_SortRankItemTitle;
    public warloardsTitle: fgui.GRichTextField;
    public searchBtn: UIButton;

    public time: fgui.GRichTextField;
    public para1: fgui.GRichTextField;
    public para2: fgui.GRichTextField;
    public para3: fgui.GRichTextField;

    private unDateTab: number = 2;//个人等级累计经验不显示

    public OnInitWind() {
        super.OnInitWind();
        Utils.setDrawCallOptimize(this.contentPane);
        this.setCenter();
        this.addEvent();
        this.initView();
    }

    public get groups(): Array<any> {
        return [];
    }

    private initView() {
        this.tabState = this.getController('tabState');
        this.tabState.selectedIndex = 0;
        var titleText = LangManager.Instance.GetTranslation("mainBar.SmallMapBar.rankingBtnTipData");
        this.contentList.setVirtual();
        this.warlordsContentList.setVirtual();
        this.initTabList();
        this.initAreaTabList();
        this.initDateTabList();
        this.initWarsTabList();
        //初始选择等级排行榜
        this.scontroller.setSelectType(SortModel.SELF_LEVEL);
    }

    private updateRankTime() {
        //最后更新时间 
        let text = LangManager.Instance.GetTranslation("sort.view.SortRightView.lastUpdateTime");
        let time = this.smodel.createDate ? DateFormatter.format(this.smodel.createDate, "MM-DD hh:mm") : "";
        this.time.setVar('text', text).flushVars();
        this.time.setVar('time', time).flushVars();
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get consortiaInfo(): ConsortiaInfo {
        return ConsortiaManager.Instance.model.consortiaInfo;
    }

    private __onSelectedChangeHandler() {
        this.para1.visible = true;
        this.para2.visible = true;
        this.para3.visible = true;
        this.para1.setVar('text', LangManager.Instance.GetTranslation('PetChallengeInfoView.rankingLabel')).flushVars();
        let str: string = LangManager.Instance.GetTranslation("PetChallengeInfoView.rankingLabel");
        let str2: string = LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        this.para3.setVar('text', str + ": ").flushVars();
        this.para3.setVar('value', str2).flushVars();
        switch (this.smodel.currentSelected) {
            case SortModel.SELF_LEVEL:
                let myOrder = this.playerInfo.playerOrdeInfo.getGpOrder();
                if (this.smodel.addType == SortModel.DAY_ADD) {
                    myOrder = this.playerInfo.playerOrdeInfo.getGpDayOrder();
                } else if (this.smodel.addType == SortModel.WEEK_ADD) {
                    myOrder = this.playerInfo.playerOrdeInfo.getGpWeekOrder();
                }

                this.para1.setVar('value', myOrder).flushVars();
                this.para2.setVar('text', LangManager.Instance.GetTranslation('public.grade')).flushVars();
                str = LangManager.Instance.GetTranslation('task.view.TaskRewardItem.iconTips01');
                this.para2.setVar('value', this.thane.grades.toString()).flushVars();
                // if (this.scontroller.isHideTabCell) {
                this.para3.text = "";
                // } else {
                //     this.para3.text = str + ": " + this.playerInfo.totalGP.toString();
                // }
                break;
            case SortModel.SELF_POW:
                this.para1.setVar('value', this.playerInfo.playerOrdeInfo.getFightCapacityOrder()).flushVars();
                this.para2.visible = false;
                str = LangManager.Instance.GetTranslation('public.playerInfo.ap');
                this.para3.text = str + ": " + this.playerInfo.fightingCapacity.toString();
                break;
            case SortModel.CONSORTIA_LEVEL:
                this.para1.setVar('text', LangManager.Instance.GetTranslation('consortia.view.myConsortia.ConsortiaActivityPage.consortiaRank')).flushVars();
                this.para2.setVar('text', LangManager.Instance.GetTranslation('public.grade')).flushVars();
                str = LangManager.Instance.GetTranslation('sort.view.MemberTitleView.buildValue');
                if (this.playerInfo.consortiaID == 0) {
                    this.para1.setVar('value', "0").flushVars();
                    this.para2.setVar('value', "0").flushVars();
                    this.para3.text = str + ": " + 0;
                } else {
                    this.para1.setVar('value', this.consortiaInfo.orderInfo ? this.consortiaInfo.orderInfo.gradeOrder.toString() : "0").flushVars();
                    this.para2.setVar('value', this.consortiaInfo.levels.toString()).flushVars();
                    this.para3.text = str + ": " + this.consortiaInfo.offer.toString();
                }
                break;
            case SortModel.CONSORTIA_POW:
                this.para1.setVar('text', LangManager.Instance.GetTranslation('consortia.view.myConsortia.ConsortiaActivityPage.consortiaRank')).flushVars();
                str = LangManager.Instance.GetTranslation('public.playerInfo.ap');
                if (this.playerInfo.consortiaID == 0) {
                    this.para1.setVar('value', "0").flushVars();
                    this.para3.setVar('value', "0").flushVars();
                    this.para3.text = str + ": " + 0;
                    this.para2.visible = false;
                } else {
                    this.para1.setVar('value', this.consortiaInfo.orderInfo ? this.consortiaInfo.orderInfo.fightPowerOrder.toString() : "0").flushVars();
                    this.para3.text = str + ": " + this.consortiaInfo.fightPower.toString();
                    this.para2.visible = false;
                }
                break;
            case SortModel.SELF_HONOUR:
                this.para1.setVar('value', this.playerInfo.playerOrdeInfo.getHonourOrder()).flushVars();
                this.para2.visible = false;
                str = LangManager.Instance.GetTranslation('sort.view.MemberTitleView.honour');
                this.para3.text = str + ": " + this.thane.honer.toString();
                break;
            case SortModel.SELF_CHARMS:
                let myCharmsOrder = this.playerInfo.playerOrdeInfo.getCharmsOrder();
                if (this.smodel.addType == SortModel.DAY_ADD) {
                    myCharmsOrder = this.playerInfo.playerOrdeInfo.getCharmsDayOrder();
                } else if (this.smodel.addType == SortModel.WEEK_ADD) {
                    myCharmsOrder = this.playerInfo.playerOrdeInfo.getCharmsWeekOrder();
                }
                this.para1.setVar('value', myCharmsOrder).flushVars();
                str = LangManager.Instance.GetTranslation('sort.view.MemberTitleView.charms');
                this.para3.text = str + ": " + this.thane.charms.toString();
                this.para2.visible = false;
                break;
            case SortModel.SELF_SOULSCORE:
                this.para1.setVar('value', this.playerInfo.playerOrdeInfo.getSoulScoreOrder()).flushVars();
                str = LangManager.Instance.GetTranslation('sort.view.MemberTitleView.soulScore');
                this.para3.text = str + ": " + MountsManager.Instance.mountInfo.soulScore.toString();
                this.para2.visible = false;
                break;
            case SortModel.PET_POWER:
                this.para2.visible = false;
                var sortData: SortData = this.smodel.isCross ? this.smodel.petRankingCross : this.smodel.petRanking;

                if (sortData) {
                    this.para1.setVar('value', sortData.orderId + "").flushVars();
                    str = sortData.petData.name;
                    this.para3.text = str + ": " + sortData.petData.fightPower;
                } else {
                    var arr: Array<any> = this.playerInfo.petList;
                    var find: PetData;
                    for (const key in arr) {
                        if (Object.prototype.hasOwnProperty.call(arr, key)) {
                            var p: PetData = arr[key];
                            if (!find || p.fightPower > find.fightPower) {
                                find = p;
                            }
                        }
                    }
                    this.para1.setVar('value', "").flushVars();
                    if (find) {
                        str = find.name;
                        this.para3.text = str + ": " + find.fightPower;
                        this.para1.setVar('value', LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople")).flushVars();
                    } else {
                        this.para3.text = "";
                        this.para1.setVar('value', LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople")).flushVars();
                    }

                }
                break;
        }
        if (this.smodel.isCross && this.para1.visible) {
            this.para1.setVar('value', this.getPlayerCrossOrder()).flushVars();
        }
        this.updateRankTitle();
        this.updateRankContentData();
        this.updateRankTime();
        this.updateTabBtn();
    }

    /**更新排行榜列表数据 */
    private updateRankContentData() {
        //当前展示列表
        this.contentList.numItems = this.smodel.currentShowList.length;
        if (this.contentList && this.contentList.scrollPane)
            this.contentList.scrollPane.scrollTop();
    }

    /**更新排行榜标题 */
    private updateRankTitle() {
        if (this.smodel.isCross) {
            this.layout("C" + this.smodel.currentSelected);
        } else {
            this.layout("" + this.smodel.currentSelected);
        }
    }

    private layout(type: string) {
        var titles: Array<string> = this.smodel.languageConfig[type];
        var str: string = this.smodel.widthConfig[type];
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
                let isHide = this.scontroller.isHideTabCell;
                var numW: number = Number(w) + (isHide ? 50 : 0);
                var txt: fgui.GTextField = this.rankTitle.getChild('title' + i).asTextField;
                var title: string = titles[i];
                if (isHide && i == this.scontroller.isHideTabIndex) {
                    txt.text = "";
                } else {
                    txt.text = title;
                }
                txt.width = numW;
                txt.x = xx;
                xx += numW;
                i++;
            }
        }
    }

    /**更新右侧Tab按钮显示状态 */
    private updateTabBtn() {
        if (ConfigManager.info.CROSSSORT) {
            this.zoneTablist.getChildAt(1).visible = true;
        } else {
            this.zoneTablist.getChildAt(1).visible = false;
        }
        switch (this.smodel.currentSelected) {
            case SortModel.SELF_LEVEL:
            case SortModel.SELF_CHARMS:
                this.dateTablist.getChildAt(0).visible = true;
                this.dateTablist.getChildAt(1).visible = true;
                break;
            case SortModel.PET_POWER:
                this.zoneTablist.getChildAt(1).visible = false;
                this.dateTablist.getChildAt(0).visible = false;
                this.dateTablist.getChildAt(1).visible = false;
                this.dateTablist.selectedIndex = 2;
                break;
            default:
                this.dateTablist.getChildAt(0).visible = false;
                this.dateTablist.getChildAt(1).visible = false;
                this.dateTablist.selectedIndex = 2;
                break;
        }
        let selectIndex = this.dateTablist.selectedIndex;
        var type: number = SortModel.ACCUMULAT_ADD;
        switch (selectIndex) {
            case 0:
                type = SortModel.DAY_ADD;
                break;
            case 1:
                type = SortModel.WEEK_ADD;
                break;
            case 2:
                type = SortModel.ACCUMULAT_ADD;
                break
        }
        this.scontroller.setAddType(type);
    }

    private getPlayerCrossOrder(): string {
        var userId: number = this.playerInfo.userId;
        var nickName: string = this.playerInfo.nickName;
        var serverName: string = this.playerInfo.serviceName;
        var sourceData: Array<any> = this.smodel.currentShowList;
        var order: string = LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        for (const key in sourceData) {
            if (Object.prototype.hasOwnProperty.call(sourceData, key)) {
                var item: SortData = sourceData[key];
                if (item.serverName == serverName &&
                    item.army.baseHero.userId == userId &&
                    item.nickName == nickName) {
                    order = item.orderId.toString();
                }
            }
        }
        return order;
    }

    private get scontroller(): SortController {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Sort) as SortController;
    }

    private get smodel(): SortModel {
        if (this.scontroller) {
            return this.scontroller.model;
        } else {
            return null;
        }
    }

    /**初始化左侧Tab按钮列表 */
    private rankTabData: Array<any> = [];
    private initTabList() {
        this.rankTabData = [];
        this.createTabData(SORT_TAB.LEVLE, LangManager.Instance.GetTranslation("Sort.Role.Grade"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.POW, LangManager.Instance.GetTranslation("Sort.Role.Battle"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.CONSORTIA_LEVEL, LangManager.Instance.GetTranslation("Sort.Role.LaborGrade"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.CONSORTIA_POW, LangManager.Instance.GetTranslation("Sort.Role.LaborPow"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.HONOUR, LangManager.Instance.GetTranslation("Sort.Role.Honor"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.CHARMS, LangManager.Instance.GetTranslation("Sort.Role.Charm"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.SOUL, LangManager.Instance.GetTranslation("Sort.Role.Soul"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        this.createTabData(SORT_TAB.PETPOWER, LangManager.Instance.GetTranslation("Sort.Role.PetPow"), "Tab_Dia2Y_Nor", "Tab_Dia2Y_Sel", this.rankTabData);
        if (ComponentSetting.WARLORD) {
            this.createTabData(SORT_TAB.WARLORDS, LangManager.Instance.GetTranslation("Sort.Role.Warlords"), "Tab_Dia2Y2_Nor", "Tab_Dia2Y2_Sel", this.rankTabData);
        }
        this.rankTablist.numItems = this.rankTabData.length;
        this.rankTablist.selectedIndex = 0;
    }

    /**初始化区域Tab */
    private rankZoneTabData: Array<any> = [];
    private initAreaTabList() {
        this.rankZoneTabData = [];
        this.createTabData(ZONE_TAB.LOCAL, LangManager.Instance.GetTranslation("SortWnd.currentServerTxt"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankZoneTabData);
        this.createTabData(ZONE_TAB.ALL, LangManager.Instance.GetTranslation("SortWnd.allServerTxt"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankZoneTabData);
        this.zoneTablist.numItems = this.rankZoneTabData.length;
        this.zoneTablist.selectedIndex = 0;
    }

    /**初始化区域Tab */
    private rankDateTabData: Array<any> = [];
    private initDateTabList() {
        this.rankDateTabData = [];
        this.createTabData(DATE_TAB.DAY, LangManager.Instance.GetTranslation("Sort.Role.DailyGain"), "Tab_Menu1_Nor", "Tab_Menu1__Sel", this.rankDateTabData);
        this.createTabData(DATE_TAB.WEEK, LangManager.Instance.GetTranslation("Sort.Role.WeeklyGain"), "Tab_Menu1_Nor", "Tab_Menu1__Sel", this.rankDateTabData);
        this.createTabData(DATE_TAB.ALL, LangManager.Instance.GetTranslation("Sort.Role.SumGain"), "Tab_Menu1_Nor", "Tab_Menu1__Sel", this.rankDateTabData);
        this.dateTablist.numItems = this.rankDateTabData.length;
        this.dateTablist.selectedIndex = 2;//默认选择积累
        this.scontroller.setAddType(SortModel.ACCUMULAT_ADD)
    }

    /**初始化众神战Tab */
    private rankWarlordsTabData: Array<any> = [];
    private initWarsTabList() {
        this.rankWarlordsTabData = [];
        this.createTabData(WARLORDS_TAB.WARRIOR, LangManager.Instance.GetTranslation("Sort.Role.Warrior"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankWarlordsTabData);
        this.createTabData(WARLORDS_TAB.WIZARD, LangManager.Instance.GetTranslation("Sort.Role.Wizard"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankWarlordsTabData);
        this.createTabData(WARLORDS_TAB.HUNTER, LangManager.Instance.GetTranslation("Sort.Role.Archer"), "Tab_Dia2_Nor", "Tab_Dia2_Sel", this.rankWarlordsTabData);
        this.warLordsTablist.numItems = this.rankWarlordsTabData.length;
        this.warLordsTablist.selectedIndex = 0;//默认选择积累
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

    private addEvent() {
        this.searchBtn.onClick(this, this.onSearBtnHandler);
        this.rankTablist.on(Laya.Event.CLICK, this, this.__onChangeHandler.bind(this));
        this.rankTablist.itemRenderer = Laya.Handler.create(this, this._rankTabRender, null, false);
        this.zoneTablist.on(Laya.Event.CLICK, this, this.__onzoneTabHandler.bind(this));
        this.zoneTablist.itemRenderer = Laya.Handler.create(this, this._zoneTabRender, null, false);
        this.dateTablist.on(Laya.Event.CLICK, this, this.__onDateTabHandler.bind(this));
        this.dateTablist.itemRenderer = Laya.Handler.create(this, this._dateTabRender, null, false);
        this.contentList.on(Laya.Event.CLICK, this, this.__onContentCellHandler.bind(this));
        this.contentList.itemRenderer = Laya.Handler.create(this, this._contentCellabRender, null, false);
        this.warLordsTablist.on(Laya.Event.CLICK, this, this.__onWarlordsTabHandler.bind(this));
        this.warLordsTablist.itemRenderer = Laya.Handler.create(this, this.__onWarlordsTabRender, null, false);
        this.warlordsContentList.on(Laya.Event.CLICK, this, this.__onWarlordsContentHandler.bind(this));
        this.warlordsContentList.itemRenderer = Laya.Handler.create(this, this.__onWarlordsContentRender, null, false);
        if (this.smodel) this.smodel.addEventListener(SortEvent.SELECTE_LIST_CHANG, this.__onSelectedChangeHandler, this);
        if (this.smodel) this.smodel.addEventListener(SortEvent.WARLORD_RANK_DATA_UPDATE, this.refresh, this);
    }

    private removeEvent() {
        this.searchBtn.offClick(this, this.onSearBtnHandler);
        this.rankTablist.off(Laya.Event.CLICK, this, this.__onChangeHandler.bind(this));
        // this.rankTablist.itemRenderer.recover();
        Utils.clearGListHandle(this.rankTablist);
        this.zoneTablist.off(Laya.Event.CLICK, this, this.__onzoneTabHandler.bind(this));
        // this.zoneTablist.itemRenderer.recover();
        Utils.clearGListHandle(this.zoneTablist);
        this.dateTablist.off(Laya.Event.CLICK, this, this.__onDateTabHandler.bind(this));
        // this.dateTablist.itemRenderer.recover();
        Utils.clearGListHandle(this.dateTablist);
        this.contentList.off(Laya.Event.CLICK, this, this.__onContentCellHandler.bind(this));
        // this.contentList.itemRenderer.recover();
        Utils.clearGListHandle(this.contentList);
        this.warLordsTablist.off(Laya.Event.CLICK, this, this.__onWarlordsTabHandler.bind(this));
        // this.warLordsTablist.itemRenderer.recover();
        Utils.clearGListHandle(this.warLordsTablist);
        this.warlordsContentList.off(Laya.Event.CLICK, this, this.__onWarlordsContentHandler.bind(this));
        // this.warlordsContentList.itemRenderer.recover();
        Utils.clearGListHandle(this.warlordsContentList);
        if (this.smodel) this.smodel.removeEventListener(SortEvent.SELECTE_LIST_CHANG, this.__onSelectedChangeHandler, this);
        if (this.smodel) this.smodel.removeEventListener(SortEvent.WARLORD_RANK_DATA_UPDATE, this.refreshListView, this);
    }


    OnHideWind() {
        super.OnHideWind();
        this.scontroller && this.scontroller.setSelectType(0);
        this.removeEvent();
    }

    /**众神榜列表渲染 */
    private __onWarlordsContentRender(index: number, cellItem: SortMemberItem) {
        let cellData = this.curWarlordsListData[index];
        cellItem.iswarlords = true;
        cellItem.vdata = cellData;
    }

    /**众神榜菜单Tab渲染 */
    private __onWarlordsTabRender(index: number, btnItem: fgui.GButton) {
        let btnData = this.rankWarlordsTabData[index];
        if (btnData) {
            btnItem.data = btnData;
            btnItem.title = btnData.title;
            btnItem.selectedTitle = btnData.selectedTitle;
            btnItem.icon = btnData.icon;
            btnItem.selectedIcon = btnData.selectedIcon;
        }
    }

    /**具体排行信息渲染 */
    private _contentCellabRender(index: number, cellItem: SortMemberItem) {
        let cellData = this.smodel.currentShowList[index];
        cellItem.iswarlords = false;
        cellItem.vdata = cellData;
    }

    /**周期Tab渲染 */
    private _dateTabRender(index: number, btnItem: fgui.GButton) {
        let btnData = this.rankDateTabData[index];
        if (btnData) {
            btnItem.data = btnData;
            btnItem.title = btnData.title;
            btnItem.selectedTitle = btnData.selectedTitle;
            btnItem.icon = btnData.icon;
            btnItem.selectedIcon = btnData.selectedIcon;
        }
    }


    /**渲染顶部区域Tab */
    private _zoneTabRender(index: number, btnItem: fgui.GButton) {
        let btnData = this.rankZoneTabData[index];
        if (btnData) {
            btnItem.data = btnData;
            btnItem.title = btnData.title;
            btnItem.selectedTitle = btnData.selectedTitle;
            btnItem.icon = btnData.icon;
            btnItem.selectedIcon = btnData.selectedIcon;
        }
    }

    /**渲染左侧Tab列表 */
    private _rankTabRender(index: number, btnItem: fgui.GButton) {
        let btnData = this.rankTabData[index];
        if (btnData) {
            btnItem.data = btnData;
            btnItem.title = btnData.title;
            btnItem.selectedTitle = btnData.selectedTitle;
            btnItem.icon = btnData.icon;
            btnItem.selectedIcon = btnData.selectedIcon;
        }
    }

    __onWarlordsContentHandler(cellItem: SortMemberItem) {
        if (cellItem && cellItem.vdata) {
            this._curSelectedInfo = cellItem.vdata;
            this.refreshAvatarView();
        }
    }

    /**选择众神榜菜单 */
    private __onWarlordsTabHandler() {
        var btnIndex = this.warLordsTablist.selectedIndex;
        switch (btnIndex) {
            case WARLORDS_TAB.WARRIOR:
                this.smodel.currentSelectedJob = JobType.WARRIOR;
                break;
            case WARLORDS_TAB.WIZARD:
                this.smodel.currentSelectedJob = JobType.WIZARD;
                break;
            case WARLORDS_TAB.HUNTER:
                this.smodel.currentSelectedJob = JobType.HUNTER;
                break;
        }
        this.refresh();
    }

    public refresh() {
        this.refreshwarlordsTitle();
        this.refreshListView();
        this.refreshAvatarView();
    }

    /**刷新标题 */
    private refreshwarlordsTitle() {
        var titles: Array<string> = [
            LangManager.Instance.GetTranslation("sort.WarlordsSortRightView.str01"),
            LangManager.Instance.GetTranslation("sort.WarlordsSortRightView.str02"),
        ];
        var str: string = "240,425";
        if (!titles || !str) return;
        var arr: Array<string> = str.split(",");
        var i: number = 0;
        var xx: number = 9;
        for (let index = 0; index < 7; index++) {
            var txt: fgui.GTextField = this.warlordsRankTitle.getChild('title' + index).asTextField;
            txt.text = "";
        }
        for (const key in arr) {
            if (Object.prototype.hasOwnProperty.call(arr, key)) {
                var w: string = arr[key];
                var numW: number = Number(w);
                var txt: fgui.GTextField = this.warlordsRankTitle.getChild('title' + i).asTextField;
                var title: string = titles[i];
                txt.text = title;
                txt.width = numW;
                txt.x = xx;
                xx += numW;
                i++;
            }
        }
    }

    private _curSelectedInfo: any;
    private refreshAvatarView() {
        if (this._curSelectedInfo) {
            this.warloardsTitle.text = this._curSelectedInfo.army.baseHero.serviceName + this._curSelectedInfo.army.baseHero.nickName;
        } else {
            this.warloardsTitle.text = "";
        }
    }

    /**刷新众神榜列表 */
    private curWarlordsListData = [];
    private refreshListView() {
        var totalList: Array<any> = this.smodel.warlordsDic[this.smodel.currentSelectedJob];
        let temp = [];
        for (const key in totalList) {
            if (Object.prototype.hasOwnProperty.call(totalList, key)) {
                let item = totalList[key];
                temp.push(item);
            }
        }
        this.curWarlordsListData = temp;
        if (temp && temp.length) {
            this.warlordsContentList.numItems = temp.length;
            this._curSelectedInfo = temp[temp.length - 1];
            this.warlordsContentList.selectedIndex = 0;
        } else {
            this._curSelectedInfo = null;
            this.warlordsContentList.numItems = 0;
        }
    }

    private __onContentCellHandler(selectItem: SortMemberItem) {

    }

    /**周期Tab选择 */
    private __onDateTabHandler() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        let selectIndex = this.dateTablist.selectedIndex;
        var type: number = SortModel.ACCUMULAT_ADD;
        switch (selectIndex) {
            case 0:
                type = SortModel.DAY_ADD;
                break;
            case 1:
                type = SortModel.WEEK_ADD;
                break;
            case 2:
                type = SortModel.ACCUMULAT_ADD;
                break
        }
        this.scontroller.setAddType(type);
    }

    /**区块Tab选择 */
    private __onzoneTabHandler() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        var btnIndex = this.zoneTablist.selectedIndex;
        switch (btnIndex) {
            case ZONE_TAB.LOCAL:
                this.scontroller.setCross(false);
                break;
            case ZONE_TAB.ALL:
                this.scontroller.setCross(true);
                break;
        }
    }

    /**最新届 */
    onSearBtnHandler() {
        UIManager.Instance.ShowWind(EmWindow.WarlordsRank);
    }

    /**左侧Tab切换 */
    private __onChangeHandler(evt) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        let selectItem = this.rankTablist.getChildAt(this.rankTablist.selectedIndex).asButton;
        var btn: fgui.GButton = selectItem;
        let data: any = btn.data;
        if (!data) return;
        var type: number = 0;
        this.tabState.selectedIndex = 0;
        switch (data.index) {
            case SORT_TAB.LEVLE:
                type = SortModel.SELF_LEVEL;
                break;
            case SORT_TAB.POW:
                type = SortModel.SELF_POW;
                break;
            case SORT_TAB.CONSORTIA_LEVEL:
                type = SortModel.CONSORTIA_LEVEL;
                break;
            case SORT_TAB.CONSORTIA_POW:
                type = SortModel.CONSORTIA_POW;
                break;
            case SORT_TAB.HONOUR:
                type = SortModel.SELF_HONOUR;
                break;
            case SORT_TAB.CHARMS:
                type = SortModel.SELF_CHARMS;
                break;
            case SORT_TAB.SOUL:
                type = SortModel.SELF_SOULSCORE;
                break;
            case SORT_TAB.WARLORDS:
                type = SortModel.WARLORDS;
                this.tabState.selectedIndex = 1;
                this.warLordsTablist.selectedIndex = 0;
                this.smodel.currentSelectedJob = JobType.WARRIOR
                break;
            case SORT_TAB.PETPOWER:
                type = SortModel.PET_POWER;
                break;
        }
        this.scontroller.setSelectType(type);
    }



}