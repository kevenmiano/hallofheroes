// @ts-nocheck
import FUI_ActivityTimeView from "../../../../../fui/Welfare/FUI_ActivityTimeView";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import Utils from "../../../../core/utils/Utils";
import { t_s_activityscheduleData } from "../../../config/t_s_activityschedule";
import { ConfigType } from "../../../constant/ConfigDefine";
import OpenGrades from "../../../constant/OpenGrades";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import AcivityTypeCom from "./component/AcivityTypeCom";
/**
 * 活动日程
 */
export default class ActivityTimeView extends FUI_ActivityTimeView {
    private _timeListData: Array<t_s_activityscheduleData> = [];
    private _consortiaListData: Array<t_s_activityscheduleData> = [];
    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
        this.initView();
    }

    private initView() {
        this._timeListData = [];
        this._consortiaListData = [];
        let activitysTemplateDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_activityschedule)
        if (activitysTemplateDic) {
            for (const key in activitysTemplateDic) {
                if (activitysTemplateDic.hasOwnProperty(key)) {
                    let info: t_s_activityscheduleData = activitysTemplateDic[key];
                    if (info.Area == 1) {
                        if (info.Type == 1) {//世界BOSS
                            if (this.thane.grades >= OpenGrades.WORLD_BOSS) {
                                this._timeListData.push(info);
                            }
                        } else if (info.Type == 2) {//修行神殿
                            if (this.thane.grades >= OpenGrades.HOOK) {
                                this._timeListData.push(info);
                            }
                        } else if (info.Type == 3) {//紫晶矿场
                            if (this.thane.grades >= OpenGrades.STAR) {
                                this._timeListData.push(info);
                            }
                        } else if (info.Type == 4) {//战场
                            if (this.thane.grades >= OpenGrades.RVR) {
                                this._timeListData.push(info);
                            }
                        } else if (info.Type == 5) {//多人竞技场
                            if (this.thane.grades >= OpenGrades.CHALLENGE) {
                                this._timeListData.push(info);
                            }
                        } else if (info.Type == 6) {//保卫英灵岛
                            if (this.thane.grades >= OpenGrades.PET) {
                                this._timeListData.push(info);
                            }
                        }
                    } else if (info.Area == 2) {
                        this._consortiaListData.push(info);
                    }
                }
            }
        }
        this._timeListData.sort(this.sortByType);
        this._consortiaListData.sort(this.sortByType);
        this.typeList.numItems = 2;
    }

    private initEvent() {
        this.typeList.itemRenderer = Laya.Handler.create(this, this.onRenderTypeListItem, null, false);
    }

    private removeEvent() {
        Utils.clearGListHandle(this.typeList);
    }

    private onRenderTypeListItem(index: number, item: AcivityTypeCom) {
        if (index == 0) {
            item.area = 1;
            item.info = this._timeListData;
        } else {
            item.area = 2;
            item.info = this._consortiaListData;
        }
    }

    private sortByType(a: t_s_activityscheduleData, b: t_s_activityscheduleData): number {
        if (a.Type < b.Type) {
            return -1;
        } else if (a.Type > b.Type) {
            return 1;
        } else {
            return 0;
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}