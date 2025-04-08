import LangManager from '../../../core/lang/LangManager';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import AppellModel from './AppellModel';
import AppellManager from '../../manager/AppellManager';
import { AppellEvent, NotificationEvent } from '../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { t_s_appellData } from '../../config/t_s_appell';
import { TempleteManager } from '../../manager/TempleteManager';
import AppellSocketOutManager from '../../manager/AppellSocketOutManager';
import AppellCellItem from './AppellCellItem';
import FUIHelper from '../../utils/FUIHelper';
import { EmWindow } from '../../constant/UIDefine';

/**
 * 称号
 */
export default class AppellWnd extends BaseWindow {


    private frame: fgui.GComponent;
    private list_tab: fgui.GList;//左侧Tab列表
    private appellList: fgui.GList;//右侧称号列表
    private title: fgui.GTextField;//称号名称
    private comAppellPower: fgui.GComponent;

    private _firstIn: boolean = true;
    private _lookAppellId: number = 0;
    private _appellList: Array<t_s_appellData> = [];

    public OnInitWind() {
        super.OnInitWind();
        if (this.params) {
            if (this.params.appellID) {
                this._lookAppellId = this.params.appellID;
            }
        } else {
            this._lookAppellId = 0;
        }
        this.setCenter();
        this.addEvent();
        this.initView();
        AppellSocketOutManager.lookAppellInfos();
    }

    private addEvent() {
        this.appellList.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list_tab.on(fairygui.Events.CLICK_ITEM, this, this.__onTabChange);
        this.appellList.on(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
        this.appellmodel.addEventListener(AppellEvent.APPELL_DATA_UPDATA, this.__updateAppellDataHandler, this);
        this.thane.addEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__updateThaneInfoHandler, this);
        this.thane.addEventListener(PlayerEvent.APPELL_CHANGE, this.onAppellChange, this);
    }

    private offEvent() {
        this.appellList.itemRenderer.recover();
        this.appellList.itemRenderer = null;
        this.list_tab.off(fairygui.Events.CLICK_ITEM, this, this.__onTabChange);
        this.appellList.off(fairygui.Events.CLICK_ITEM, this, this.onListItemClick);
        this.appellmodel.removeEventListener(AppellEvent.APPELL_DATA_UPDATA, this.__updateAppellDataHandler, this);
        this.thane.removeEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__updateThaneInfoHandler, this);
        this.thane.removeEventListener(PlayerEvent.APPELL_CHANGE, this.onAppellChange, this);
    }

    private initView() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation("appell.AppellFrame.Title");
        this.__updateAppellPowerInfoHandler();
    }


    /**渲染称号Item */
    renderListItem(index: number, item: AppellCellItem) {
        var data: t_s_appellData = this._appellList[index] as t_s_appellData;
        if (data.TemplateId == ArmyManager.Instance.thane.appellId) {
            data.isEquiped = true;
        } else {
            data.isEquiped = false;
        }
        item.itemData = data;
    }

    private __updateThaneInfoHandler(evt) {
        this._lookAppellId = this.thane.appellId;
        if (this._lookAppellId > 0) {
            this.refreshView(true);
        } else {
            this.refreshView();
        }
    }

    /**称号更新 */
    private onAppellChange() {
        this._lookAppellId = this.thane.appellId;
        if (this._lookAppellId > 0) {
            this.refreshView(true);
        } else {
            this.refreshView();
        }
    }

    private __updateAppellDataHandler(e: AppellEvent) {
        if (this._firstIn) {
            if (this._lookAppellId == 0) {
                if (AppellManager.Instance.model.getAcquiredList().length > 0) {
                    this.appellmodel.currentPage = AppellModel.TYPE_GET;
                    this.list_tab.selectedIndex = AppellModel.TYPE_GET;
                } else {
                    this.appellmodel.currentPage = AppellModel.TYPE_SELF;
                    this.list_tab.selectedIndex = AppellModel.TYPE_SELF;
                }
            } else {
                var appellInfo: t_s_appellData = TempleteManager.Instance.getAppellInfoTemplateByID(this._lookAppellId);
                if (appellInfo) {
                    this.appellmodel.currentPage = appellInfo.Type;
                    this.list_tab.selectedIndex = appellInfo.Type;
                } else {
                    this.appellmodel.currentPage = AppellModel.TYPE_GET;
                    this.list_tab.selectedIndex = AppellModel.TYPE_GET;
                }
            }
            this._firstIn = false;
            this.refreshView(true);
        } else {
            this.refreshView();
        }
    }

    private __onTabChange() {
        switch (this.list_tab.selectedIndex) {
            case 0:
                this.appellmodel.currentPage = AppellModel.TYPE_GET;
                break;
            case 1:
                this.appellmodel.currentPage = AppellModel.TYPE_SELF;
                break;
            case 2:
                this.appellmodel.currentPage = AppellModel.TYPE_PVP;
                break;
            case 3:
                this.appellmodel.currentPage = AppellModel.TYPE_PVE;
                break;
            case 4:
                this.appellmodel.currentPage = AppellModel.TYPE_OTHER;
                break;
            default:
                break;
        }
        this.hideDetial();
        this.refreshView();
    }

    private onListItemClick(item, evt) {
        // Logger.log(this.appellList.selectedIndex);
        let evtTarget = evt.target;
        let target = fgui.GObject.cast(evtTarget)
        if (evtTarget && !(target instanceof AppellCellItem)) {
            return;
        }
        for (let i = 0; i < this._appellList.length; i++) {
            let item = this.appellList.getChildAt(i) as AppellCellItem;
            if (this.appellList.selectedIndex == i)
                item.onShowDetail(!item.isShowDetail);
            else
                item.onShowDetail(false);
        }

        if (this.appellList.selectedIndex == this._appellList.length - 1) {
            this.appellList.scrollPane.scrollBottom();
        }
    }

    private hideDetial() {
        for (let i = 0; i < this._appellList.length; i++) {
            let item = this.appellList.getChildAt(i) as AppellCellItem;
            item.onShowDetail(false);
        }
    }

    private refreshView(look: boolean = false) {
        this._appellList = this.appellmodel.getCurrentList();
        var appellLength: number = this._appellList.length;
        this.appellList.numItems = appellLength;
        this.appellList.ensureBoundsCorrect();
        let appellIndex: number = 0;
        for (let index = 0; index < this._appellList.length; index++) {
            let dataitem = this._appellList[index];
            if (dataitem.TemplateId == this._lookAppellId) {
                appellIndex = index;
            }
        }

        if (look) {
            if (appellLength > 0) {
                this.appellList.selectedIndex = appellIndex;
                // this.appellList.scrollToView(appellIndex, true);
            }
        } else {
            // if (appellLength > 0) {
            //     this.appellList.selectedIndex = 0;
            //     this.appellList.scrollToView(0);
            // }
        }
        let text = "";
        if (this.thane.appellId != 0) {
            text = ArmyManager.Instance.thane.appellInfo.TitleLang
        } else {
            text = LangManager.Instance.GetTranslation("armyII.viewII.attribute.PlayerAttributeView.Not");
        }
        this.title.setVar('name', text).flushVars();
    }

    private __updateAppellPowerInfoHandler() {
        FUIHelper.setTipData(
            this.comAppellPower,
            EmWindow.AppellPowerTip,
            this.appellmodel.getAppellPowerInfo(),
            new Laya.Point(-35, 80)
        )
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get appellmodel(): AppellModel {
        return AppellManager.Instance.model;
    }

    OnShowWind() {
        super.OnShowWind();
    }

    OnHideWind() {
        this.offEvent();
        super.OnHideWind();
    }
}