// @ts-nocheck
import FUI_ConsortiaMemberView from "../../../../../../fui/Consortia/FUI_ConsortiaMemberView";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { SoundIds } from "../../../../constant/SoundIds";
import AudioManager from "../../../../../core/audio/AudioManager";
import { ConsortiaMemberItem } from "./ConsortiaMemberItem";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ArrayConstant, ArrayUtils } from "../../../../../core/utils/ArrayUtils";
import Utils from "../../../../../core/utils/Utils";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/22 10:44
 * @ver 1.0
 *
 */
export class ConsortiaMemberView extends FUI_ConsortiaMemberView {
    private _model: ConsortiaModel;
    private _lastSort: string = "grades";
    private _isDes: boolean = true;
    private isFirst: boolean = true;
    private _members: ThaneInfo[];

    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);
        this.initData();
        this.initView();
        this.addEvent();
    }

    private initData() {
        this._model = (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).model;
        ConsortiaManager.Instance.getConsortiaUserInfos();
    }

    private initView() {
        this.memberList.setVirtual();
        this.memberList.itemRenderer = Laya.Handler.create(this, this.onListItemRender, null, false);
    }

    private addEvent() {
        this.memberBtn.onClick(this, this.__sortOnHandler);
        this.dutyBtn.onClick(this, this.__sortOnHandler);
        this.apBtn.onClick(this, this.__sortOnHandler);
        this.offlineTimeBtn.onClick(this, this.__sortOnHandler);

        this._model.addEventListener(ConsortiaEvent.UPDATA_CONSORTIA_MEMBER, this.__onMemberListUpdata, this);
    }

    private onListItemRender(index: number, item: ConsortiaMemberItem) {
        if (item) item.info = this._members[index];
    }

    private __onMemberListUpdata() {
        this._members = this._model.consortiaMemberList.getList();
        this.refreshMemberList(this._lastSort);
        this.memberList.numItems = this._members.length;
    }

    public refreshMemberList(str: string, des: boolean = false) {
        this.sortList(des);
    }

    private sortList(des: boolean) {
        if (this.isFirst) {
            this._members.sort(this.sortByValue.bind(this));
            return;
        }
        this.sortOnItem(this._lastSort, des);
    }

    private sortByValue(sInfo1: ThaneInfo, sInfo2: ThaneInfo): number {
        if (sInfo1.userId == this.playerInfo.userId) {
            return -1;
        }
        else if (sInfo2.userId == this.playerInfo.userId) {
            return 1;
        }
        else if (sInfo1.dutyId < sInfo2.dutyId) {
            return -1;
        }
        else if (sInfo1.dutyId > sInfo2.dutyId) {
            return 1;
        }
        return 0;
    }

    private sortOnItem(field: string, des: boolean = false) {
        if (field == "nickName") {
            this._members = ArrayUtils.sortOn(this._members, field, ArrayConstant.CASEINSENSITIVE);
        }
        else if (field == "job") {
            this._members.sort((a, b) => a.templateInfo.Job - b.templateInfo.Job);
        }
        else {
            this._members = ArrayUtils.sortOn(this._members, field, ArrayConstant.DESCENDING | ArrayConstant.CASEINSENSITIVE | ArrayConstant.NUMERIC);
        }
        if (field == "dutyId") {
            this._members.reverse();
        }
        if (des) {
            this._members.reverse();
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo
    }

    private __sortOnHandler(evt: Laya.Event) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        this.isFirst = false;
        if (evt.currentTarget == this.memberBtn.displayObject) {
            this._lastSort = "nickName";
        }
        else if (evt.currentTarget == this.dutyBtn.displayObject) {
            this._lastSort = "dutyId";
        }
        else if (evt.currentTarget == this.apBtn.displayObject) {
            this._lastSort = "fightingCapacity";
        }
        else if (evt.currentTarget == this.offlineTimeBtn.displayObject) {
            this._lastSort = "LogOutTimeMs";
        }
        this.refreshMemberList(this._lastSort, this._isDes);
        this._isDes = (!this._isDes);
        this.memberList.numItems = this._members.length;
    }

    private removeEvent() {
        this.memberBtn.offClick(this, this.__sortOnHandler);
        this.dutyBtn.offClick(this, this.__sortOnHandler);
        this.apBtn.offClick(this, this.__sortOnHandler);
        this.offlineTimeBtn.offClick(this, this.__sortOnHandler);
        this._model.removeEventListener(ConsortiaEvent.UPDATA_CONSORTIA_MEMBER, this.__onMemberListUpdata, this);
    }

    dispose() {
        this.removeEvent();
        Utils.clearGListHandle(this.memberList);
        this._model = null;
        this._members = null;
        super.dispose();
    }
}