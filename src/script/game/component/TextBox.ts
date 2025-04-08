// @ts-nocheck
import FUI_TextBox from "../../../fui/Base/FUI_TextBox";
import LangManager from "../../core/lang/LangManager";
import {YTextInput} from "../module/common/YTextInput";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/31 17:02
 * @ver 1.0
 */
export class TextBox extends FUI_TextBox
{
    public userName:YTextInput;

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();

        this.userName.fontSize = 24;
        this.userName.singleLine = true;
        this.userName.valign = "middle";
        this.userName.stroke = 1;
        this.userName.strokeColor = "#000000";
        this.userName.promptText = LangManager.Instance.GetTranslation("ConsortiaEmailWnd.receiveInput.text");
    }

    dispose()
    {
        super.dispose();
    }
}