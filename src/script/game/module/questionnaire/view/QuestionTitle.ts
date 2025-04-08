// @ts-nocheck
import FUI_QuestionTitle from '../../../../../fui/QuestionNaire/FUI_QuestionTitle';
import QuestionData from '../QuestionData';

/**
 * 问卷调查标题
 */
export default class QuestionTitle extends FUI_QuestionTitle {

    private _itemdata = null;

    onConsturctor() {
        super.onConstruct();
    }

    public set itemData(value: QuestionData) {
        this._itemdata = value;
        this.questionTitle.text = value.Subject;
    }

    public get questionId():number {
        return this._itemdata.Id;
   }

    public get answerData(): string {
        return "";
    }


}