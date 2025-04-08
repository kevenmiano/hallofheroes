// @ts-nocheck
import FUI_LevelGiftView from "../../../../../fui/Welfare/FUI_LevelGiftView";
import { ArrayUtils, ArrayConstant } from "../../../../core/utils/ArrayUtils";
import Utils from "../../../../core/utils/Utils";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import LevelGiftItemInfo from "../data/LevelGiftItemInfo";
import WelfareCtrl from "../WelfareCtrl";
import WelfareData from "../WelfareData";
import { LevelGiftItem1 } from "./component/LevelGiftItem1";
import { LevelGiftItem2 } from './component/LevelGiftItem2';
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/23 16:01
 * @ver 1.0
 * 等级礼包
 */

export class LevelGiftView extends FUI_LevelGiftView {
    private list2Data: Array<LevelGiftItemInfo> = [];
    private _maxPage: number = 0;
    private _currentPage: number = 0;
    private _defaultIndex: number = 0;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.list1.setVirtual();
        this.list2.setVirtual();
        this.initEvent();
        this.refreshView();
        this._defaultIndex = this.getDefaultIndex();
        this.list2.scrollPane.setCurrentPageX(this._defaultIndex);
        this.updateBtnStatus();
    }

    initEvent() {
        this.list1.itemRenderer = Laya.Handler.create(this, this.renderListItem1, null, false);
        this.list2.itemRenderer = Laya.Handler.create(this, this.renderListItem2, null, false);
        NotificationManager.Instance.addEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.refreshView, this);
        this.list2.on(fgui.Events.SCROLL_END, this, this.updateBtnStatus);
        this.preBtn.onClick(this, this.preBtnHandler);
        this.nextBtn.onClick(this, this.nextBtnHandler);
    }

    removeEvent() {
        NotificationManager.Instance.removeEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.refreshView, this);
        // this.list1.itemRenderer.recover();
        // this.list2.itemRenderer.recover();
        Utils.clearGListHandle(this.list1);
        Utils.clearGListHandle(this.list2);
        this.list2.off(fgui.Events.SCROLL_END, this, this.updateBtnStatus);
        this.preBtn.offClick(this, this.preBtnHandler);
        this.nextBtn.offClick(this, this.nextBtnHandler);
    }

    private getDefaultIndex(): number {
        let index: number = 0;
        let grade: number = ArmyManager.Instance.thane.grades
        if (grade > 69) {
            index = 3;
        } else if (grade > 49 && grade <= 69) {
            index = 2;
        } else if (grade > 30 && grade <= 49) {
            index = 1;
        }
        return index;
    }

    private preBtnHandler() {
        let value: number = this.list2.scrollPane.currentPageX;
        this.list2.scrollPane.setCurrentPageX(value - 1);
        this.updateBtnStatus();
    }

    private nextBtnHandler() {
        let value: number = this.list2.scrollPane.currentPageX;
        this.list2.scrollPane.setCurrentPageX(value + 1);
        this.updateBtnStatus();
    }

    private updateBtnStatus() {
        this._currentPage = (this.list2.scrollPane.currentPageX + 1);
        this.preBtn.enabled = this._currentPage == 1 ? false : true;
        this.nextBtn.enabled = this._currentPage == this._maxPage ? false : true;
    }

    private renderListItem1(index: number, item: LevelGiftItem1) {
        if (!item) return;
        item.info = this.model.levelPackageArr[index];
    }

    private renderListItem2(index: number, item: LevelGiftItem2) {
        if (!item) return;
        item.info = this.list2Data[index];
    }

    private refreshView() {
        this.list1.numItems = this.model.levelPackageArr.length;
        this.list2Data = this.model.levelPackageArr;
        this.list2Data = ArrayUtils.sortOn(this.list2Data, ["id"], [ArrayConstant.NUMERIC]);
        this.list2.numItems = this.list2Data.length;
        this._maxPage = this.list2Data.length / 2;
        if (this.list2Data.length == 0) {
            this.diamondBg.visible = false;
            this.diamondTxt.visible = false;
        } else {
            this.diamondBg.visible = true;
            this.diamondTxt.visible = true;
        }
    }

    private get model(): WelfareData {
        return this.control.data;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}