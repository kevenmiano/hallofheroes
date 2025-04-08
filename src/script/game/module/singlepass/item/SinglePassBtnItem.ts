import FUI_SinglePassBtnItem from "../../../../../fui/SinglePass/FUI_SinglePassBtnItem";
import FUIHelper from "../../../utils/FUIHelper";
import SinglePassCardInfo from "../model/SinglePassCardInfo";
import SinglePassModel from "../SinglePassModel";

export default class SinglePassBtnItem extends FUI_SinglePassBtnItem {
    private _info: SinglePassCardInfo;
    private _index: number;
    private _clickFunction: Function;
    private _enable: boolean;

    constructor() {
        super();
    }

    public set index(value: number) {
        this._index = value;
        this.tollgateBtn.title = this._index.toString();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
    }

    public set clickFunction(value: Function) {
        this._clickFunction = value;
    }

    public set enable(value: boolean) {
        this._enable = value;
        this.tollgateBtn.enabled = this._enable;
    }

    private get showJudge(): boolean {
        if (this._info && this._info.judge == SinglePassModel.JUDGE_MAX) {
            return true;
        }
        return false;
    }

    public get info(): SinglePassCardInfo {
        return this._info;
    }

    public set selectedType(value: number) {
        this.selectedBtn.selectedIndex = value;
    }

    public set info(value: SinglePassCardInfo) {
        this._info = value;
        if (this._info) {
            this.judge.url = this.getJudgeUrl(this._info.judge);
        }
    }

    private initEvent() {
        this.onClick(this, this.tollgateBtnHandler);
    }

    private removeEvent() {
        this.offClick(this, this.tollgateBtnHandler);
    }

    private tollgateBtnHandler() {
        if (this._clickFunction != null && this._info) {
            this._clickFunction(this._info.tollgate);
        }
    }

    private getJudgeUrl(judge: number): string {
        let urlStr: string="";
        switch (judge) {
            case 1:
                urlStr = FUIHelper.getItemURL("Base", "Lab_D");
                break;
            case 2:
                urlStr = FUIHelper.getItemURL("Base", "Lab_C");
                break;
            case 3:
                urlStr = FUIHelper.getItemURL("Base", "Lab_B");
                break;
            case 4:
                urlStr = FUIHelper.getItemURL("Base", "Lab_A");
                break;
            case 5:
                urlStr = FUIHelper.getItemURL("Base", "Lab_S");
                break;
        }
        return urlStr;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}