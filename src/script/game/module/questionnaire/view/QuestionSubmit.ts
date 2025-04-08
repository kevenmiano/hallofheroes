// @ts-nocheck
import UIButton from '../../../../core/ui/UIButton';
import { NotificationManager } from '../../../manager/NotificationManager';
import { QuestionEvent } from '../../../constant/event/NotificationEvent';
import FUI_QuestionSubmit from "../../../../../fui/QuestionNaire/FUI_QuestionSubmit";


export default class QuestionSubmit extends FUI_QuestionSubmit {

    private btnConfirm: UIButton;

    onConstruct() {
        super.onConstruct();
        this.btnConfirm = new UIButton(this.Btn_Buy);
        this.addEvent();
    }

    public set itemData(value: any) {

    }

    addEvent() {
        this.btnConfirm.onClick(this, this.onConfirm);
    }

    offEvent() {
        this.btnConfirm.offClick(this, this.onConfirm);
    }

    /**
     * 点击确定按钮
     */
    onConfirm() {
        NotificationManager.Instance.dispatchEvent(QuestionEvent.FINISH_QUESTION);
    }

    public get questionId(): number {
        return 0;
    }

    public get answerData(): string {
        return "";
    }

    dispose() {
        this.offEvent();
        super.dispose();
    }

}