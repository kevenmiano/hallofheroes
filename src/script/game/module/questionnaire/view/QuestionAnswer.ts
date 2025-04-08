// @ts-nocheck
import FUI_QuestionAnswer from "../../../../../fui/QuestionNaire/FUI_QuestionAnswer";
import LangManager from '../../../../core/lang/LangManager';
import LTextInput from "../../../component/laya/LTextInput";
import { QuestionEvent } from '../../../constant/event/NotificationEvent';
import { NotificationManager } from '../../../manager/NotificationManager';
import QuestionData from "../QuestionData";


export default class QuestionAnswer extends FUI_QuestionAnswer {

    private _itemData: QuestionData;
    private content: LTextInput;

    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    public set itemData(value: any) {
        this._itemData = value;
        this.QuestTitle.text = value.Subject + LangManager.Instance.GetTranslation("questionnaire.QuestionnaireFrame.maxWordCount", this._itemData.MaxChoose);
        this.answerGroup.ensureSizeCorrect();
        this.content = LTextInput.create(this.displayObject, "", 20, '#FFECC6', this.inputBg.width - 20, this.inputBg.height - 20, this.inputBg.x + 10, this.inputBg.y + 10, 10);
        this.content.register(this, this.__onContentChange, this.onContentFocusIn, this.onContentFocusOut);
        this.content.on(Laya.Event.FOCUS, this, this.onFocusTarget);
        this.content.on(Laya.Event.BLUR, this, this.onBlurTarget);
    }

    addEvent() {
    }

    offEvent() {
        this.content.unRegister();
        this.content.off(Laya.Event.FOCUS, this, this.onFocusTarget);
        this.content.off(Laya.Event.BLUR, this, this.onBlurTarget);
    }

    /** */
    onFocusTarget() {
        NotificationManager.Instance.dispatchEvent(QuestionEvent.FOCUS)
    }

    /** */
    onBlurTarget() {
        NotificationManager.Instance.dispatchEvent(QuestionEvent.BLUR)
    }

    /**文本内容变化 */
    private contentWords: string = '';
    private __onContentChange(evt: Event) {
        // this.content.text = ChatHelper.parasMsgs(this.content.text);
        let input: string = this.content.text;
        if (input.length > this._itemData.MaxChoose) {
            this.content.text = this.contentWords;
            return;
        }
        this.contentWords = input;
        this.content.text = this.contentWords;
    }

    private onContentFocusIn() {

    }

    private onContentFocusOut() {

    }

    public get questionId(): number {
        return this._itemData.Id;
    }

    public get answerData(): string {
        var answerStr: string = "";
        answerStr += this.content.text + "|";
        return answerStr;
    }

    dispose(): void {
        this.offEvent();
        super.dispose();
    }

}