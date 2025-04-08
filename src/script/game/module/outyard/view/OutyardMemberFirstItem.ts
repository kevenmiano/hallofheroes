// @ts-nocheck
import FUI_OutyardMemberFirstItem from "../../../../../fui/OutYard/FUI_OutyardMemberFirstItem";
import LangManager from "../../../../core/lang/LangManager";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { JobType } from "../../../constant/JobType";
import { EmWindow } from "../../../constant/UIDefine";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import OutyardManager from "../../../manager/OutyardManager";
import FUIHelper from "../../../utils/FUIHelper";
import OutyardUserInfo from "../data/OutyardUserInfo";

export default class OutyardMemberFirstItem extends FUI_OutyardMemberFirstItem {
    private _info: OutyardUserInfo;
    private _thaneInfo: ThaneInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public get info(): OutyardUserInfo {
        return this._info;
    }

    public set info(value: OutyardUserInfo) {
        if (value) {
            this._info = value;
            this._thaneInfo = this._info.thane;
            this.jobIcon.icon = JobType.getJobIcon(this._info.job);
            let str:string = "asset.outyard.bing" +  this._info.index;
            this.indexIcon.icon = FUIHelper.getItemURL("OutYard",str);
            this.countTxt.text = this._info.defenceDebuffLevel.toString();
            this.precentTxt.text = (100 - OutyardManager.Instance.defenceDebuffArr[0] * this._info.defenceDebuffLevel).toString() +"%";
            this.userNameTxt.text = this._thaneInfo.nickName ? this._thaneInfo.nickName : "";
            this.levelTxt.text = this._thaneInfo.grades.toString();
            this.fightValueTxt.text = this._thaneInfo.fightingCapacity.toString();
            var stateTxtNone: string = LangManager.Instance.GetTranslation("outyard.OutyardMemberItem.DefenceHandler");
            var stateTxtEnter: string = LangManager.Instance.GetTranslation("outyard.OutyardMemberItem.DefeatedHandler");
            this.statusTxt.text = this._info.defenceAlive ? stateTxtNone : stateTxtEnter;
            if (this._info.defenceAlive) {
                UIFilter.normal(this);
                this.enabled = true;
            }
            else {
                UIFilter.gray(this);
                this.enabled = false;
            }
        } else {
            this.enabled = true;
            UIFilter.normal(this);
            this.jobIcon.icon = "";
            this.userNameTxt.text = "";
            this.levelTxt.text = "";
            this.fightValueTxt.text = "";
            this.statusTxt.text = "";
        }
    }

    public dispose() {
        super.dispose();
    }
}