import FUI_AirGardenGameFivecardScoreItem from "../../../../../fui/Carnival/FUI_AirGardenGameFivecardScoreItem";
import LangManager from "../../../../core/lang/LangManager";
export class AirGardenGameFivecardScoreItem extends FUI_AirGardenGameFivecardScoreItem {

    private index: number;
    /**各奖励的分数*/
    private static SCORE = [0, 20000, 10000, 5000, 2000, 1000, 500, 300, 200, 100];

    public score: number;

    onConstruct() {
        super.onConstruct();
    }

    public init(index: number) {
        this.index = index;
        this.score = AirGardenGameFivecardScoreItem.SCORE[index];
        this._txtFivecardScoreName.text = LangManager.Instance.GetTranslation("AirGardenGame.fivecard.result" + index);
        this._txtFivecardScoreValue.text = this.score + "";
    }

    public resetSet() {
        this.imgShine.visible = false;
    }

    public shine() {
        this.imgShine.visible = true;
    }
}