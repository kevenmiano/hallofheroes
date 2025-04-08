import FUI_WorldBossRankItem from "../../../../../fui/WorldBoss/FUI_WorldBossRankItem";
import { WoundInfo } from "../../../mvc/model/worldboss/WoundInfo";
import LangManager from '../../../../core/lang/LangManager';

export default class WorldBossRankItem extends FUI_WorldBossRankItem {
    private _woundInfo: WoundInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public get woundInfo(): WoundInfo {
        return this._woundInfo;
    }

    public set woundInfo(value: WoundInfo) {
        this._woundInfo = value;
        if(this._woundInfo)
        {
            this.updateView();
        }
    }

    private updateView() {
        if (this._woundInfo.index == -1) {
            this.userNameTxt.text = LangManager.Instance.GetTranslation("worldboss.view.WoundInfoItemView.nickName01");
        }
        else {
            this.scoreTxt.text = this._woundInfo.wound.toString();
            this.rankTxt.text = (this._woundInfo.index + 1) + ".";
            this.userNameTxt.text = this._woundInfo.nickName;
        }
    }

    public dispose() {
        super.dispose();
    }
}