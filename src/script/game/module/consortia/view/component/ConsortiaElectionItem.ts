// @ts-nocheck
import FUI_ConsortiaElectionItem from "../../../../../../fui/Consortia/FUI_ConsortiaElectionItem";
import { ConsortiaVotingUserInfo } from "../../data/ConsortiaVotingUserInfo";

export default class ConsortiaElectionItem extends FUI_ConsortiaElectionItem {
    private _info: ConsortiaVotingUserInfo;
    constructor() {
        super();
    }

    public set flag(value: boolean) {
        this.selecteBtn.selected = value;
    }

    public set enable(value: boolean) {
        this.selecteBtn.enabled = value;
    }

    public get enable(): boolean {
        return  this.selecteBtn.enabled;
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set info(vInfo: ConsortiaVotingUserInfo) {
        this._info = vInfo;
        this.refreshView();
    }

    public get info(): ConsortiaVotingUserInfo {
        return this._info
    }

    private refreshView() {
        if (this._info) {
            this.nameTxt.text = this._info.nickName;
            this.countTxt.text = this._info.votingData.toString();
        }
        else {
            this.nameTxt.text = "";
            this.countTxt.text = "";
        }
    }

    dispose() {
        super.dispose();
    }
}