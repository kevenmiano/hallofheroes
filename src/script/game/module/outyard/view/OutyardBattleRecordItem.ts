// @ts-nocheck
import FUI_OutyardBattleRecordtem from "../../../../../fui/OutYard/FUI_OutyardBattleRecordtem";
import LangManager from "../../../../core/lang/LangManager";
import OutyardManager from "../../../manager/OutyardManager";
import OutyardReportInfo from "../data/OutyardReportInfo";

export default class OutyardBattleRecordItem extends FUI_OutyardBattleRecordtem {
    private _info: OutyardReportInfo;
    private _type: number = 0;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public get info(): OutyardReportInfo {
        return this._info;
    }

    public set type(type: number) {
        this._type = type;
    }

    public set info(value: OutyardReportInfo) {
        this._info = value;
        if (this._info) {
            let timeTxt = "[color=#FFECC6][" + this._info.reportTime + "][/color]&nbsp;&nbsp;";
            let attackUserName: string;//攻击者
            let underAttackConsortia: string;//被攻击公会
            let underAttackUserName: string;//被攻击人
            let changeScore: number = 0;//积分加成
            let defencePower: number = 0;//剩余守备力量
            let attackConsortia: string;//攻击公会
            let defenceUserName; String;//防守者
            if (this._type == 1) {//进攻项
                attackUserName = this._info.sourceUserNickName;
                underAttackConsortia = this._info.rivalGuildName;
                underAttackUserName = this._info.rivalUserNickName;
                if (this._info.isWin) {//进攻胜利
                    changeScore = this._info.changeScore
                    this.descTxt.text = timeTxt + LangManager.Instance.GetTranslation("OutyardBattleRecordItem.attackDescTxt1", attackUserName, underAttackConsortia, underAttackUserName, changeScore);
                }
                else {//进攻失败
                    defencePower = 100 - OutyardManager.Instance.defenceDebuffArr[0] * this._info.defenceDebuffLevel;
                    this.descTxt.text = timeTxt + LangManager.Instance.GetTranslation("OutyardBattleRecordItem.attackDescTxt2", attackUserName, underAttackConsortia, underAttackUserName, defencePower);
                }
            }
            else {//防守项
                attackConsortia = this._info.sourceGuildName;
                attackUserName = this._info.sourceUserNickName;
                defenceUserName = this._info.rivalUserNickName
                if (this._info.isWin) {//防守成功
                    defencePower = 100 - OutyardManager.Instance.defenceDebuffArr[0] * this._info.defenceDebuffLevel;
                    this.descTxt.text = timeTxt + LangManager.Instance.GetTranslation("OutyardBattleRecordItem.defenceDescTxt1", attackConsortia, attackUserName, defenceUserName, defenceUserName, defencePower);
                } else {
                    changeScore = this._info.changeScore
                    this.descTxt.text = timeTxt + LangManager.Instance.GetTranslation("OutyardBattleRecordItem.defenceDescTxt2", attackConsortia, attackUserName, defenceUserName, changeScore);
                }
            }

        } else {
            this.descTxt.text = "";
        }

    }

    public dispose() {
        super.dispose();
    }
}