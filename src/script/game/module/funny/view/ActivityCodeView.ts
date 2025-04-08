import FUI_ActivityCodeView from "../../../../../fui/Funny/FUI_ActivityCodeView";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import ActivityManager from "../../../manager/ActivityManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from '../../../../core/lang/LangManager';
import UIButton from '../../../../core/ui/UIButton';
import { FunnyContent } from "./FunnyContent";

/**
 * 激活码
 */
export default class ActivityCodeView extends FUI_ActivityCodeView implements FunnyContent{
    


    private _clickBoo: boolean;
    private _clickTiemCount: any = 0;
    private btnAward: UIButton;

    onShow() {
        this.initView();
        this.initEvent();
    }

    onUpdate() {
        this.initView();
    }
    
    onHide() {
        this.removeEvent();
        this.clickTime();
    }

    private initView() {
        this.btnAward = new UIButton(this.Btn_receive);
        this.title.text = LangManager.Instance.GetTranslation("activity.view.ActivityItem.input");
        // this.TextBox.getChild("userName").asTextInput.promptText = LangManager.Instance.GetTranslation("activity.view.ActivityItem.content");
    }

    private initEvent() {
        this.btnAward.onClick(this, this.__onClick);
        this.TextBox.getChild("userName").asTextInput.on(Laya.Event.KEY_DOWN, this, this.__keyDownHandler);
        this.TextBox.getChild("userName").asTextInput.on(Laya.Event.FOCUS, this, this.__InputClick);
        this.TextBox.getChild("userName").asTextInput.on(Laya.Event.BLUR, this, this.__blurClick);
    }

    private __InputClick(event: Laya.Event) {
        // if (this.TextBox.getChild("userName").asTextInput.text == LangManager.Instance.GetTranslation("activity.view.ActivityItem.content")) {
        this.TextBox.getChild("userName").asTextInput.text = "";
        // }
    }

    private __blurClick(event: Laya.Event) {
        if (this.TextBox.getChild("userName").asTextInput.text == "") {
            // this.TextBox.getChild("userName").asTextInput.text = LangManager.Instance.GetTranslation("activity.view.ActivityItem.content")
        }
    }

    private __keyDownHandler(event: KeyboardEvent) {
        if (Number(event.code) == Laya.Keyboard.ENTER)
            this.__onClick(null);
        event.stopPropagation();
    }

    private removeEvent() {
        clearTimeout(this._clickTiemCount);
        this.btnAward.offClick(this, this.__onClick);
        this.TextBox.getChild("userName").asTextInput.off(Laya.Event.KEY_DOWN, this, this.__keyDownHandler);
        this.TextBox.getChild("userName").asTextInput.off(Laya.Event.FOCUS, this, this.__InputClick);
        this.TextBox.getChild("userName").asTextInput.off(Laya.Event.BLUR, this, this.__blurClick);
    }

    private __onClick(evt) {
        var str: string = "";
        var code: string = this.TextBox.getChild("userName").asTextInput.text;
        code = code.replace(/^\s*/g, "")   //去掉前面的空格
        code = code.replace(/\s*$/g, "")    //去掉后面的空格 
        if (code == "") {
            str = LangManager.Instance.GetTranslation("activity.ActivityManager.command09");
            MessageTipManager.Instance.show(str);
            return;
        }

        if (this._clickBoo) {
            str = LangManager.Instance.GetTranslation("activity.view.ActivityItem.command01");
            MessageTipManager.Instance.show(str);
            return;
        }
        this.clickTime();
        this._clickBoo = true;
        this._clickTiemCount = setTimeout(this.clickTime.bind(this), 5000);
        ActivityManager.Instance.senActivityCode(code, "0");
    }

    private clickTime() {
        clearTimeout(this._clickTiemCount);
        this._clickTiemCount = 0
        this._clickBoo = false;
    }

    public dispose() {
        this.removeEvent();
        this.clickTime();
        ObjectUtils.disposeAllChildren(this);
        super.dispose();
    }
}