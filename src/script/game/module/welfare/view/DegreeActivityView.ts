// @ts-nocheck

import FUI_DegreeActivityView from '../../../../../fui/Welfare/FUI_DegreeActivityView';
import { DayGuideEvent } from '../../../constant/event/NotificationEvent';
import DayGuideManager from '../../../manager/DayGuideManager';
import DayGuideCatecory from '../data/DayGuideCatecory';
import LeedInfo from '../data/LeedInfo';
import DegreeActivityBox from './component/DegreeActivityBox';
import DegreeActivityListCell from './component/DegreeActivityListCell';
import { ArrayConstant, ArrayUtils } from '../../../../core/utils/ArrayUtils';
import WelfareData from '../WelfareData';
import { EmWindow } from '../../../constant/UIDefine';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import WelfareCtrl from '../WelfareCtrl';
import { PlayerManager } from '../../../manager/PlayerManager';
import ProgressHelp from '../../../../core/utils/ProgressHelp';
import Utils from '../../../../core/utils/Utils';
import LangManager from '../../../../core/lang/LangManager';

/**
* @author:pzlricky
* @data: 2021-06-24 12:01
* @description 活跃度 
*/
export default class DegreeActivityView extends FUI_DegreeActivityView {

    private activityTasks: Array<LeedInfo> = [];
    private _count: number;
    private _integralValueArr: Array<number> = [];
    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.initEvent();
        this.activityBar.getChild("title").visible = false;
        this.dayResetTime.text = LangManager.Instance.GetTranslation("DegreeActivityView.dayRestTxt");
        this.weekResetTime.text = LangManager.Instance.GetTranslation("DegreeActivityView.weekResetTxt");
        this.initFetchItem();
        this.refreshView();
    }

    /***
     * 领取Item初始化, 全部为默认状态
     * */
    private initFetchItem() {
        this.dayBoxlist.numItems = this.ctrlData.dayDegreeBoxs.length;
        this.weekBoxlist.numItems = this.ctrlData.weekDegreeBoxs.length;
        for (let i = 0; i < this.dayBoxlist.numItems; i++) {
            if (this.ctrlData.dayDegreeBoxs[i].type == 0)
                this._integralValueArr.push(this.ctrlData.dayDegreeBoxs[i].point);
        }
        //活跃度任务列表
        for (const key in this.cate.allList) {
            if (Object.prototype.hasOwnProperty.call(this.cate.allList, key)) {
                let taskItem = this.cate.allList[key];
                let taskTemp = taskItem.templateInfo;
                if(taskTemp)
                    this.activityTasks.push(taskItem);
            }
        }
        this.refreshList();
    }

    /**
     * 已完成的排在后面
     */
    private refreshList() {
        this.activityTasks = ArrayUtils.sortOn(this.activityTasks, ["isComplete", "sort"], ArrayConstant.DESCENDING | ArrayConstant.NUMERIC);
        let activityCount = this.activityTasks.length;
        this.listCell.numItems = activityCount;
    }

    private initEvent() {
        this.cate.addEventListener(DayGuideEvent.ACTIVE_CHANGE, this.__onUpdataHandler, this);
        this.cate.addEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.__onUpdataHandler, this);
        this.cate.addEventListener(DayGuideEvent.WEEK_ACTIVE_CHANGE, this.__onUpdataHandler, this);
        this.dayBoxlist.itemRenderer = Laya.Handler.create(this, this.renderDaydHandler, null, false);
        this.weekBoxlist.itemRenderer = Laya.Handler.create(this, this.renderWeekdHandler, null, false);
        this.listCell.setVirtual();
        this.listCell.itemRenderer = Laya.Handler.create(this, this.renderListdHandler, null, false);
    }

    private removeEvent() {
        this.cate.removeEventListener(DayGuideEvent.ACTIVE_CHANGE, this.__onUpdataHandler, this);
        this.cate.removeEventListener(DayGuideEvent.LEED_PROGRESS_CHANGE, this.__onUpdataHandler, this);
        this.cate.removeEventListener(DayGuideEvent.WEEK_ACTIVE_CHANGE, this.__onUpdataHandler, this);
        // this.dayBoxlist.itemRenderer.recover();
        // this.weekBoxlist.itemRenderer.recover();
        // this.listCell.itemRenderer.recover();
        Utils.clearGListHandle(this.dayBoxlist);
        Utils.clearGListHandle(this.weekBoxlist);
        Utils.clearGListHandle(this.listCell);
    }

    /**每日宝箱 */
    renderDaydHandler(index: number, item: DegreeActivityBox) {
        if (!item) return;
        item.index = index;
        item.boxdata = this.ctrlData.dayDegreeBoxs[index];
        let value = this.ctrlData.dayDegreeBoxs[index].point;
        if (this.cate.hasPick(index + 1))
            item.state = DegreeActivityBox.CLOSE;
        else if (this.cate.canPick(value))//判断活跃度值是否满足
            item.state = DegreeActivityBox.OPEN;
        else
            item.state = DegreeActivityBox.DEFAULT;
    }

    /**周宝箱 */
    renderWeekdHandler(index: number, item: DegreeActivityBox) {
        if (!item) return;
        item.index = index;
        item.boxdata = this.ctrlData.weekDegreeBoxs[index];
        let value = this.ctrlData.weekDegreeBoxs[index].point;
        if (this.cate.hasPick(index + 6))
            item.state = DegreeActivityBox.CLOSE;
        else if (this.cate.canPickWeek(value))
            item.state = DegreeActivityBox.OPEN;
        else
            item.state = DegreeActivityBox.DEFAULT;
    }

    /**每日任务 */
    renderListdHandler(index: number, item: DegreeActivityListCell) {
        if (!item) return;
        item.index = index;
        item.cellData = this.activityTasks[index];
    }

    /**
     * 侦听用户每日引导信息的更新
     * */
    private __onUpdataHandler(e: DayGuideEvent) {
        this.refreshView();
    }

    /**
     * 刷新视图（包括已完成项目、未完成项目、进度条、领取Item）
     * */
    private refreshView() {
        this.point.text = this.cate.active.toString();//每日活跃度
        this.weekPoint.text = this.cate.weekActive.toString();
        //本周活跃度
        this.dayBoxlist.numItems = this.ctrlData.dayDegreeBoxs.length;
        this.weekBoxlist.numItems = this.ctrlData.weekDegreeBoxs.length;
        this.refreshList();
        this.activityBar.max = this.ctrlData.dayMaxDegreePoint;
        this.activityBar.min = 0;
        this.activityBar.value = ProgressHelp.getCurrentValue(this.cate.active, this.ctrlData.dayMaxDegreePoint, this._integralValueArr);
    }

    private get cate(): DayGuideCatecory {
        return DayGuideManager.Instance.cate;
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }
    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose() {
        this.removeEvent();
        this.activityTasks = [];
        super.dispose();
    }

}