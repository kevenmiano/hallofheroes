// @ts-nocheck
import SoundManager from "../../../../core/audio/SoundManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import StringHelper from "../../../../core/utils/StringHelper";
import { SoundIds } from "../../../constant/SoundIds";
import ConsortiaPrizeAllotItem from "./component/ConsortiaPrizeAllotItem";
import LangManager from '../../../../core/lang/LangManager';
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { ConsortiaSocketOutManager } from "../../../manager/ConsortiaSocketOutManager";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import Utils from "../../../../core/utils/Utils";

/**
 * 公会宝箱分配
 */
export default class ConsortiaPrizeAllotWnd extends BaseWindow {
    public txt_search: fgui.GTextInput;
    public btnSearch: fgui.GButton;
    public listTitleTxt: fgui.GTextField;
    public boxNum: fgui.GTextField;
    public itemlist: fgui.GList;
    public prizeAllotBtn: fgui.GButton;//确认分配
    public resetBtn: fgui.GButton;//返回列表
    private searchFlag: boolean = false;
    private _prizeList: Array<ThaneInfo>;
    private _contorller: ConsortiaControler;
    private _model: ConsortiaModel;
    private _listData: Array<ThaneInfo>
    private _currentPrizeListCount: number = 0;
    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initData();
        this.initEvent();
        this.search(false);
        this.refreshData();
        this.refreshView();
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._model = this._contorller.model;
        this._currentPrizeListCount = this._model.currentPrizeListCount;
        this.boxNum.text = this._currentPrizeListCount.toString();
        this.prizeAllotBtn.enabled = false;
    }

    private initEvent() {
        this.prizeAllotBtn.onClick(this, this.prizeAllotBtnHandler);
        this.btnSearch.onClick(this, this.onSerachHandler);
        this.resetBtn.onClick(this, this.resetBtnHandler);
        this.itemlist.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this._model.addEventListener(ConsortiaEvent.PRIZE_LIST_COUNT_UPDATE, this.__prizeListCountUpdateHandler, this);
    }

    private removeEvent() {
        this.prizeAllotBtn.offClick(this, this.prizeAllotBtnHandler);
        this.btnSearch.offClick(this, this.onSerachHandler);
        this.resetBtn.offClick(this, this.resetBtnHandler);
        // this.itemlist.itemRenderer.recover();
        Utils.clearGListHandle(this.itemlist);
        this._model.removeEventListener(ConsortiaEvent.PRIZE_LIST_COUNT_UPDATE, this.__prizeListCountUpdateHandler, this);
    }

    private prizeAllotBtnHandler() {
        var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        var content: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaPrizeAllotFrame.allotConfirmContent");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.allotConfirm.bind(this));
    }

    private allotConfirm(b: boolean, flag: boolean) {
        if (!b) {
            return;
        }
        let infos: Array<any> = new Array();
        for (let i = 0; i < this._prizeList.length; i++) {
            let info: ThaneInfo = this._prizeList[i];
            if (info.receivedCount <= 0) {
                continue;
            }
            var obj: Object = { userId: info.userId, count: info.receivedCount };
            infos.push(obj);
        }
        ConsortiaSocketOutManager.consortiaPrizeAllotConfirm(this._model.currentPrizeTemplateId, infos);
        this.OnBtnClose();
    }

    private resetBtnHandler() {
        this.search(false);
        this.refreshData();
        this.refreshView();
    }

    private onSerachHandler() {
        SoundManager.Instance.play(SoundIds.CONFIRM_SOUND);
        if (StringHelper.isNullOrEmpty(this.txt_search.text)) {
            var str: string = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaPrizeAllotFrame.searchTip");
            MessageTipManager.Instance.show(str);
            return;
        }
        this.search();
        this.refreshData();
        this.refreshView();
    }

    private __prizeListCountUpdateHandler() {
        this.boxNum.text = this._model.currentPrizeListCount.toString();
        if (this._currentPrizeListCount == this._model.currentPrizeListCount) {
            this.prizeAllotBtn.enabled = false;
        }
        else {
            this.prizeAllotBtn.enabled = true;
        }
        this.refreshData();
        this.refreshView();
    }

    private search(value: boolean = true) {
        this.resetBtn.visible = value;
        this.searchFlag = value;
    }

    private refreshData() {
        this._prizeList = this._model.prizeMemberList.getList();
        this._prizeList = ArrayUtils.sortOn(this._prizeList, ["fightingCapacity", "nickName"], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING, ArrayConstant.CASEINSENSITIVE]);
        let index: number = this._prizeList.indexOf(this._model.prizeMemberList[this._model.consortiaInfo.chairmanID]);
        this._prizeList.splice(index, 1);
        this._prizeList.unshift(this._model.prizeMemberList[this._model.consortiaInfo.chairmanID]);
    }

    refreshView() {
        if (this.searchFlag) {
            let dataArray: Array<ThaneInfo> = [];
            for (let i = 0; i < this._prizeList.length; i++) {
                let info: ThaneInfo = this._prizeList[i];
                if (info.nickName.indexOf(StringHelper.trim(this.txt_search.text)) == -1) {
                    continue;
                }
                dataArray.push(info);
            }
            this._listData = dataArray;
        }
        else {
            this._listData = this._prizeList;
        }
        this.itemlist.numItems = this._listData.length;
    }

    renderListItem(index: number, item: ConsortiaPrizeAllotItem) {
        let itemData: ThaneInfo = this._listData[index];
        item.info = itemData;
        let notEnough: boolean = (this._model.currentPrizeListCount == 0);
        if (itemData && itemData.receivedCount <= 0) {
            item.refresh(notEnough);
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