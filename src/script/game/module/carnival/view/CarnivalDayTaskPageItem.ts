// @ts-nocheck
import FUI_CarnivalDayTaskPageItem from "../../../../../fui/Carnival/FUI_CarnivalDayTaskPageItem";
import LangManager from "../../../../core/lang/LangManager";
import UIButton from "../../../../core/ui/UIButton";
import { t_s_carnivaldailychallengeData } from "../../../config/t_s_carnivaldailychallenge";
import CarnivalManager from "../../../manager/CarnivalManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel, { CARNIVAL_THEME } from "../model/CarnivalModel";
import CarnivalTaskInfo from "../model/CarnivalTaskInfo";

/**
 * 嘉年华---每日挑战-item
 */
export default class CarnivalDayTaskPageItem extends FUI_CarnivalDayTaskPageItem {

    private _data: CarnivalTaskInfo = null;
    private _tempInfo: t_s_carnivaldailychallengeData = null;
    private btnReceive: UIButton;

    protected onConstruct(): void {
        super.onConstruct();
        this.btnReceive = new UIButton(this.btn_receive);
        let themeType = this.model.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            this.isSummer.selectedIndex = 1;
        } else {
            this.isSummer.selectedIndex = 0;
        }
        this.addEvent();
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    private addEvent() {
        this.btnReceive.onClick(this, this.onReward);
    }

    private offEvent() {
        this.btnReceive.offClick(this, this.onReward);
    }

    private onReward() {
        if (this._tempInfo) CarnivalManager.Instance.opRequest(CarnivalManager.OP_TASK_REWARD, this._tempInfo.Id);
    }

    /**任务信息 */
    public set info(value: CarnivalTaskInfo) {
        this._data = value;
        if (this._data) {
            let _tempInfo: t_s_carnivaldailychallengeData = TempleteManager.Instance.getCarnivalDailyChallengeTempInfo(value.taskId);
            if (_tempInfo) {
                this._tempInfo = _tempInfo;
                this.taskTitle.text = _tempInfo.TitleLang + " (" + this._data.data + "/" + _tempInfo.Para1 + ")";
                this.taskDes.text = _tempInfo.DescriptionLang;
                this.taskPoint.setVar("point", "+" + _tempInfo.Points.toString()).flushVars();
                if (this._data.isReward) {
                    this.c1.selectedIndex = 2;
                } else {
                    this.c1.selectedIndex = 1;
                    if (_tempInfo.Para1 <= this._data.data) {
                        this.btn_receive.enabled = CarnivalManager.Instance.isRewardTime && true;                       
                    } else {
                        this.btn_receive.enabled = false;
                    }
                    !CarnivalManager.Instance.isRewardTime && (this.btn_receive.title = LangManager.Instance.GetTranslation("carnival.active.timeover"));
                }
            }
        }
    }

    dispose(): void {
        this.offEvent();
        super.dispose();
    }

}