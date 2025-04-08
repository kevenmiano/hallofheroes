import FUI_ShortCutInput from "../../../../../fui/Battle/FUI_ShortCutInput";
import { TempleteManager } from "../../../manager/TempleteManager";
/**
 * 战斗中的输入框
 */
export default class ShortCutInput extends FUI_ShortCutInput {

    /**已输入未发送的 */
    static NOT_SEND_MSG:string='';

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        // this.inputmsg.text = "";
        this.inputmsg.on(Laya.Event.INPUT, this, this.__onContentChange);
    }

    /**文本内容变化 */
    private contentWords: string = '';
    private __onContentChange(evt: Event) {
        let mailContent: string = this.inputmsg.text;
        if (mailContent.length > 38) {
            this.inputmsg.text = this.contentWords;
            return;
        }
        this.contentWords = mailContent;
        this.inputmsg.text = this.contentWords;
    }

    public getInputText(): string {
        return this.contentWords;
    }

    public setInputText(value: string) {
        this.inputmsg.text = value;
        this.contentWords = this.inputmsg.text;
        this.checkLength();
    }

    public clearText() {
        this.inputmsg.text = '';
        this.contentWords = '';
        ShortCutInput.NOT_SEND_MSG = '';
    }

    private checkLength() {
        var len: number = this.contentWords.length;
        let count = TempleteManager.Instance.CfgMaxWordCount;
        if (len > count){
            this.contentWords = (this.inputmsg.text.substring(0, count));
            this.inputmsg.text = this.contentWords;
        }
    }

    dispose(): void {
        if(this.inputmsg){
            this.inputmsg.off(Laya.Event.INPUT, this, this.__onContentChange);
        }
        super.dispose();
    }

}