// @ts-nocheck
import FUI_ConsortiaApplyCell from "../../../../../../fui/Consortia/FUI_ConsortiaApplyCell";
import LangManager from "../../../../../core/lang/LangManager";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { ConsortiaInfo } from "../../data/ConsortiaInfo";
export default class ConsortiaApplyCell extends FUI_ConsortiaApplyCell {
    private _info: ConsortiaInfo;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set info(vInfo: ConsortiaInfo) {
        if (!vInfo) return;
        this._info = vInfo;
        this.refreshView();
    }

    public get info(): ConsortiaInfo {
        return this._info
    }
    private refreshView() {
        this.title1.text = this._info.consortiaName;
        this.title2.text = this._info.chairmanName;
        
        this.title3.text = LangManager.Instance.GetTranslation("public.level3", this._info.levels);
        this.title4.text = this._info.currentCount + " / " + this._info.SortiaMaxMembers;
        this.cApplyed.setSelectedIndex(this._info.hasApplyed ? 1 : 0);
    }

    dispose() {
        super.dispose();
    }
}