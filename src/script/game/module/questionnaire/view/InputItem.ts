import FUI_inputItem from '../../../../../fui/QuestionNaire/FUI_inputItem';
import { QuestionEvent } from '../../../constant/event/NotificationEvent';
import { NotificationManager } from '../../../manager/NotificationManager';

/**
 * 输入框
 */
export default class InputItem extends FUI_inputItem {


    protected onConstruct(): void {
        super.onConstruct();
        this.addEvent();
    }

    addEvent() {
       
    }

    offEvent() {
        
    }

    dispose(): void {
        this.offEvent();
        super.dispose();
    }
}