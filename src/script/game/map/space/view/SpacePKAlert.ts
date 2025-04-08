// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import { AlertBtnType } from "../../../component/SimpleAlertHelper";
import { EmWindow } from "../../../constant/UIDefine";


/**
 * @author:pzlricky
 * @data: 2022-05-10 11:39
 * @description 天空之城PK弹窗
 */
export default class SpacePKAlert extends BaseWindow {

    public content: fgui.GRichTextField;//文本内容
    private title: fgui.GTextField;//标题
    private checkRickText: fgui.GRichTextField;//checkBox文本

    public group0: fgui.GGroup;
    public group1: fgui.GGroup;
    public group2: fgui.GGroup;
    public group3: fgui.GGroup;

    public cancelBtn: UIButton;
    public confirmBtn: UIButton;
    private checkBtn: UIButton;
    public closeBtn: UIButton;

    private checkContainer: fgui.GGroup;

    private static inst: SpacePKAlert;

    public static get Instance(): SpacePKAlert {
        if (!this.inst) {
            this.inst = new SpacePKAlert();
        }
        return this.inst;
    }

    private _data: Array<any>;
    /**
     *
     * 数组参数: 
     * 0: 回调方法
     * 后面均为回调参数
     */
    public set data(value: Array<any>) {
        this._data = value;
    }

    private get checked(): boolean {
        return this.checkBtn.selected
    }

    protected OnClickModal() {
    }

    OnShowWind() {
        super.OnShowWind();
        this.title.text = this.params.title;
        this.content.text = this.params.text;
        this.confirmBtn.view.text = this.params.confirmText;
        this.cancelBtn.view.text = this.params.cancelText;
        if (this.params.data) {
            if (this.params.data.checkRickText) {
                this.checkRickText.setVar("text1", this.params.data.checkRickText).flushVars();
            }
            if (this.params.data.checkRickText2) {
                this.checkRickText.setVar("text2", this.params.data.checkRickText2).flushVars();
            }
            else {
                this.checkRickText.setVar("text2", "").flushVars();
            }
            if (this.params.data.check) {
                this.checkContainer.visible = true; 
            } else {
                this.checkContainer.visible = false;  
            }
            if (!this.params.data.checkDefault) {
                this.checkBtn.selected = false;
            }
            else {
                this.checkBtn.selected = true;
            }
        }
        if (this.params.btnType == AlertBtnType.NULL) {
            this.confirmBtn.visible = false;
            this.cancelBtn.visible = false;
        } else {
            this.confirmBtn.visible = this.params.btnType != AlertBtnType.C;
            this.cancelBtn.visible = this.params.btnType != AlertBtnType.O;
        }

        this.setCenter();
        for (let index = 3; index >= 0; index--) {
            let group: fgui.GGroup = this["group" + index];
            if (group) {
                group.ensureSizeCorrect();
            }
        }
    }

    /**关闭点击 */
    protected OnBtnClose() {
        this.params && this.params.callback && this.params.callback(false, this.checked, this.params.data);
        if (this.params.autoClose)
            this.hide();
    }


    /**确定点击回调 */
    confirmBtnClick() {
        this.params && this.params.callback && this.params.callback(true, this.checked, this.params.data);
        if (this.params.autoClose)
            this.hide();
    }

    /**取消回调 */
    cancelBtnClick() {
        this.params && this.params.callback && this.params.callback(false, this.checked, this.params.data);
        this.hide();
    }


    /**
     * 弹窗
     * @param type 类型
     * @param dataObj 其他数据
     * @param title 标题
     * @param text 文本内容
     * @param confirmTxt 确定文本
     * @param cancelTxt 取消文本
     * @param callback 关闭回调
     */
    async Show(dataObj: any, title: string, text: string, confirmTxt?: string, cancelTxt?: string, callback?: Function, btnType: AlertBtnType = AlertBtnType.OC, autoClose: boolean = true): Promise<SpacePKAlert> {
        if (!dataObj) {
            dataObj = null
        }
        if (!title) {
            title = LangManager.Instance.GetTranslation("public.prompt")
        }
        if (!text) {
            text = ""
        }
        if (!confirmTxt) {
            confirmTxt = LangManager.Instance.GetTranslation("public.confirm")
        }
        if (!cancelTxt) {
            cancelTxt = LangManager.Instance.GetTranslation("public.cancel")
        }

        let alertwnd = await UIManager.Instance.ShowWind(EmWindow.PKAlert, {
            title: title,
            text: text,
            confirmText: confirmTxt,
            cancelText: cancelTxt,
            callback: callback,
            data: dataObj,
            btnType: btnType,
            autoClose: autoClose,
        })
        return alertwnd;
    }

    Hide() {
        UIManager.Instance.HideWind(EmWindow.PKAlert);
    }


}