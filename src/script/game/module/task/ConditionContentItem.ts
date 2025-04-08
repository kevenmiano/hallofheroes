import FUI_ConditionContentItem from "../../../../fui/Task/FUI_ConditionContentItem";

export default class ConditionContentItem extends FUI_ConditionContentItem
{
    private _info: any;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set info(value: any) {
        this._info = value;
        this.refreshView();
    }

    private refreshView() {
        if (this._info) {
            this.ConditionContentTxt.text = this._info.contentTxt + " [color=#FEF500]" + this._info.contentTxt2 + "[/color]";
        }
    }

    dispose() {
        super.dispose();
    }
}