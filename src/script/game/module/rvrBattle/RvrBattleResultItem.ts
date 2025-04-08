import FUI_RvrBattleResultItem from "../../../../fui/RvRBattle/FUI_RvrBattleResultItem";
import { eFilterFrameText, FilterFrameText } from "../../component/FilterFrameText";
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerManager } from "../../manager/PlayerManager";
import WarFightOrderInfo from "./data/WarFightOrderInfo";

export default class RvrBattleResultItem extends FUI_RvrBattleResultItem {
    private _info: WarFightOrderInfo;
    private _type: number;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set type(value: number) {
        this._type = value;
    }

    public set info(vInfo: WarFightOrderInfo) {
        this._info = vInfo;
        if (this._info) {
            var gester: string = (this._info.geste > 0 ? "+" + this._info.geste : "" + this._info.geste);
            this.gesteTxt.text = gester;
            this.scoreTxt.text = this._info.score + "";
            this.killTxt.text = this._info.hitCount + "";
            this.serverNameTxt.text = this._info.serverName + "";
            let nameColor = this._info.teamId == 1 ? 2 : 3;
            this.nickNameTxt.color = FilterFrameText.Colors[eFilterFrameText.Normal][nameColor - 1];
            this.nickNameTxt.text = this._info.nickName;
            this.c1.selectedIndex = 0;
            if (this._type == 2) {
                if (this._info.isMvp) {
                    this.c1.selectedIndex = 1;
                }
            }
        }
    }

    private get selfTeamId(): number {
        var data: Array<WarFightOrderInfo> = CampaignManager.Instance.pvpWarFightModel.warFightOrderList;
        for (var i = 0; i < data.length; i++) {
            let info: WarFightOrderInfo = data[i];
            if (info && info.userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
                return info.teamId;
            }
        }
        return 1;
    }

    public dispose() {
        super.dispose();
    }

}