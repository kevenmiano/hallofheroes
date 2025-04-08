// @ts-nocheck
import FUI_DeleteFileLevelView from "../../../../../fui/Funny/FUI_DeleteFileLevelView";
import FunnyManager from "../../../manager/FunnyManager";
import FunnyData from "../model/FunnyData";
import FunnyType from "../model/FunnyType";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import FunnyConditionType from "../model/FunnyConditionType";
import FunnyBagData from "../model/FunnyBagData";
import { DeleteFileLevelItem } from "./DeleteFileLevelItem";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import AudioManager from "../../../../core/audio/AudioManager";
import { SoundIds } from "../../../constant/SoundIds";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FunnyContent } from "./FunnyContent";
import Utils from "../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/5/31 15:20
 * @ver 1.0
 */
export class DeleteFileLevelView extends FUI_DeleteFileLevelView implements FunnyContent{
    private _infoData: FunnyData = null;
    private _remainTime: number = 0;
    private awardLists: Array<any> = [];

    protected onConstruct(): void {
        super.onConstruct();
        this.list.setVirtual();
    }

    onShow() {
        let showID = FunnyManager.Instance.selectedId;
        let showData = FunnyManager.Instance.getShowData(showID);
        if (showID && showData) {
            this._infoData = showData;
        }
        this.initEvent();
        this.initView();
    }

    onUpdate() {
        let showID = FunnyManager.Instance.selectedId;
        let showData = FunnyManager.Instance.getShowData(showID);
        if (showID && showData) {
            this._infoData = showData;
        }
        this.initView();
    }

    onHide() {
        this.removeEvent();
    }

    initView() {
        this.btn_join.enabled = this._infoData.state != 0;
        if (this._infoData.describe) {
            this.txt_desc.text = this._infoData.describe;
        }
        else {
            this.txt_desc.text = "";
        }
        this._remainTime = this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
        if (this._remainTime > 0) {
            this.__updateTimeHandler();
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        }
        this.setTimeText();
        let _itemList = [];
        for (let j: number = 0, b: boolean = false; j < this._infoData.bagList.length; j++) {
            _itemList.push(this._infoData.bagList[j]);
            if (this._infoData.bagList[j].conditionList[0].id != FunnyConditionType.ON_LINE) {
                continue;
            }
            for (let k: number = 0; k < this._infoData.bagList[j].conditionList.length; k++) {
                if (b || this._infoData.bagList[j].status == 1) {
                    b = true;
                    break;
                }
                if (this._infoData.bagList[j].conditionList[k].id == FunnyConditionType.ON_LINE && this._infoData.bagList[j].status == 3) {
                    b = true;
                }
            }
        }
        _itemList.sort(this.sortFunc)
        this.awardLists = _itemList;
        this.list.numItems = _itemList.length;
    }

    /**
     * 兑换排序
     * 优先可兑换,有兑换次数靠前
     **/
    sortFunc(a: FunnyBagData, b: FunnyBagData): number {
        if (a.canAward == b.canAward) {
            if (a.hasExchageTimes == b.hasExchageTimes) {//
                if (a.order > b.order) {
                    return 1;
                }
                else if (a.order < b.order) {
                    return -1
                }
                else {
                    return 0;
                }
            }
            else if (a.hasExchageTimes && !b.hasExchageTimes) {
                return -1;
            }
            else {
                return 1;
            }
        }
        else if (a.canAward == true && b.canAward == false) {
            return -1;
        }
        else {
            return 1;
        }
    }

    initEvent() {
        this.btn_help.onClick(this, this.onBtnHelpClick);
        this.btn_join.onClick(this, this.onBtnJoinClick);
        this.list.itemRenderer = Laya.Handler.create(this, this.onItemRender, null, false);
    }

    onItemRender(index: number, item: DeleteFileLevelItem) {
        if (!item || item.isDisposed) {
            return;
        }
        item.info = this.awardLists[index] as FunnyBagData;
    }

    removeEvent() {
        this.btn_help.offClick(this, this.onBtnHelpClick);
        this.btn_join.offClick(this, this.onBtnJoinClick);
        // this.list && this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
    }

    __updateTimeHandler() {
        this.setRemainTime();
    }

    /**
     * 活动时间
     * */
    private setTimeText() {
        this.txt_remainTime.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.timeText", DateFormatter.getMonthDayString(this._infoData.startTime), DateFormatter.getMonthDayString(this._infoData.endTime));
        this.setRemainTime();
    }

    /**
     * 剩余时间（若还没开始, 则不显示）
     * */
    public setRemainTime() {
        if (!this._infoData || this._infoData.type == FunnyType.REDEEMING_TYPE) {
            return;
        }
        let remainTime: number = this._infoData.endTime / 1000 - this.playerModel.sysCurTimeBySecond;
        if (remainTime >= 60) {
            this.txt_remainTime.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.remainTime", DateFormatter.getFullTimeString(remainTime));
        }
        else if (remainTime > 0) {
            this.txt_remainTime.text = LangManager.Instance.GetTranslation("funny.FunnyRightView.active.remainTime", DateFormatter.getFullDateString(remainTime));
        }
        else {
            this.txt_remainTime.text = LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate");
        }

        if (this._infoData.startTime > this.playerModel.nowDate) {
            this.txt_remainTime.text = LangManager.Instance.GetTranslation("public.unopen") + LangManager.Instance.GetTranslation("funny.FunnyRightView.active.timeText", DateFormatter.getMonthDayString(this._infoData.startTime), DateFormatter.getMonthDayString(this._infoData.endTime));
        }
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    private onBtnHelpClick() {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        let title = LangManager.Instance.GetTranslation("public.help");
        let content = LangManager.Instance.GetTranslation("DeleteChargeView.helpTips");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private onBtnJoinClick() {
        if (FunnyManager.Instance.selectedFunnyData.endTime <= PlayerManager.Instance.currentPlayerModel.nowDate) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("feedback.FeedBackItem.outDate"));
            return;
        }
        // state:number = 0;//活动状态 0: 正常、激活 -1:未激活 -2: 不可激活 -3:不可参与
        if (this._infoData.state == -3) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed5"));
            return;
        }
        if (this._infoData.state == -2) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("funny.datas.FunnyBagData.joinfailed6"));
            return;
        }
        FunnyManager.Instance.sendGetBag(3);
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}