import SDKManager from "../../../core/sdk/SDKManager";
import Utils from "../../../core/utils/Utils";
import { NativeChannel } from "../../../core/sdk/native/NativeChannel";
import Logger from "../../../core/logger/Logger";
import {isOversea} from "../login/manager/SiteZoneCtrl";
import FUI_YTextInput from "../../../../fui/BaseInit/FUI_YTextInput";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/2/20 17:35
 * @ver 1.0
 */
export class YTextInput extends FUI_YTextInput {
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();

        Laya.timer.callLater(this, this.callLater);
        if (this.isIOSNewVersion()) {
            this.isMobile.selectedIndex = 1;
        } else {
            this.isMobile.selectedIndex = 0;
        }

        this.addEvent();
    }

    private callLater() {
        this.ensureBoundsCorrect();
        this.txt_web.setSize(this.width, this.height);
        this.txt_mobile.setSize(this.width, this.height);
        this.hit.setSize(this.width, this.height);
    }

    private addEvent() {
        this.hit.onClick(this, this.onTxtInputClick);
        this.txt_web.on(Laya.Event.ENTER, this, this.onEnterTxt);
    }

    private onEnterTxt() {
        this.displayObject.event(Laya.Event.ENTER);
    }

    private onTxtInputClick() {
        NativeChannel.textinput = this;
        SDKManager.Instance.getChannel().showKeyboard(this.txt_mobile.text);
    }

    private removeEvent() {
        this.hit.offClick(this, this.onTxtInputClick);
        this.txt_web.off(Laya.Event.ENTER, this, this.onEnterTxt);
    }

    //@ts-ignore
    public get text(): string {
        let text: string = "";
        if (this.isIOSNewVersion()) {
            text = this.txt_mobile.text;
        } else {
            text = this.txt_web.text;
        }
        return text;
    }

    public set text(value: string) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.text = value;
        } else {
            this.txt_web.text = value;
        }
    }

    public set promptText(value: string) {
        if (this.isIOSNewVersion()) {
            // this.txt_mobile.promptText = value;
        } else {
            this.txt_web.promptText = value;
        }
    }

    public set fontSize(value: number) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.fontSize = value;
        } else {
            this.txt_web.fontSize = value;
        }
    }

    public set color(value: string) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.color = value;
        } else {
            this.txt_web.color = value;
        }
    }

    public set stroke(value: number) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.stroke = value;
        } else {
            this.txt_web.stroke = value;
        }
    }

    public set strokeColor(value: string) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.strokeColor = value;
        } else {
            this.txt_web.strokeColor = value;
        }
    }

    public set singleLine(value: boolean) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.singleLine = value;
        } else {
            this.txt_web.singleLine = value;
        }
    }

    /**
     * align:left|right|center;                水平对齐方式
     * @param value
     */
    public set align(value: string) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.align = value;
        } else {
            this.txt_web.align = value;
        }
    }

    /**
     * vertical-align:top|bottom|middle;    垂直对齐方式
     * @param value
     */
    public set valign(value: string) {
        if (this.isIOSNewVersion()) {
            this.txt_mobile.valign = value;
        } else {
            this.txt_web.valign = value;
        }
    }

    public set focus(b: boolean) {
        if (this.isIOSNewVersion()) {
            if (b)
                this.txt_mobile.requestFocus()
            else
                (this.txt_mobile.displayObject as Laya.Input).focus = false;
        } else {
            if (b)
                this.txt_web.requestFocus()
            else
                (this.txt_web.displayObject as Laya.Input).focus = false;
        }
    }

    on(type: string, thisObject: any, listener: Function, args?: any[]): void {
        if (type == Laya.Event.INPUT) {
            if (this.isIOSNewVersion()) {
                this.txt_web.on(Laya.Event.CHANGE, thisObject, listener, args);
            } else {
                this.txt_web.on(Laya.Event.INPUT, thisObject, listener, args);
            }
        }
    }

    off(type: string, thisObject: any, listener: Function): void {
        if (type == Laya.Event.INPUT) {
            if (this.isIOSNewVersion()) {
                this.txt_web.off(Laya.Event.CHANGE, thisObject, listener);
            } else {
                this.txt_web.off(Laya.Event.INPUT, thisObject, listener);
            }
        }
    }

    /**
     * 兼容iOS旧版本, 1.1.5版本开始生效
     * @private
     */
    private isIOSNewVersion(): boolean {
        if (Utils.isIOS()) {
            if(isOversea())
            {
                return false;
            }
            let versionName: string = Laya.Browser.window.conchConfig && Laya.Browser.window.conchConfig.getAppVersion();
            Logger.yyz("当前App版本号: " + versionName + "   数字号:" + Utils.getAppNumByName(versionName));
            return Utils.getAppNumByName(versionName) >= Utils.getAppNumByName("1.1.5");
        } else {
            return false;
        }
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}
