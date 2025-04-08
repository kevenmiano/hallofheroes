// @ts-nocheck
import FUI_WarlordsBetSelectItem from "../../../../../../fui/Warlords/FUI_WarlordsBetSelectItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { IconType } from "../../../../constant/IconType";
import WarlordsManager from "../../../../manager/WarlordsManager";
import WarlordsModel from "../../WarlordsModel";
import WarlordsPlayerInfo from "../../WarlordsPlayerInfo";

export default class WarlordsBetSelectItem extends FUI_WarlordsBetSelectItem {
    private _info: WarlordsPlayerInfo;
    private _rank: number;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set flag(value: boolean) {
        this.selecteBtn.selected = value;
    }

    private get warlordsModel(): WarlordsModel {
        return WarlordsManager.Instance.model;
    }

    public set info(value: WarlordsPlayerInfo) {
        this._info = value;
        if (this._info) {
            this.updateView();
        }
        else {
            this.icon_head.url = "";
            this.txt_level.text = "";
            this.txt_name.text = "";
            this.txt_fight.text = "";
        }
    }
    public get info(): WarlordsPlayerInfo
    {
        return this._info;
    }

    public set rank(value: number) {
        this._rank = value;
    }

    private updateView() {
        let _headId: number = this._info.headId;
        if (_headId == 0) {//说明没修改过头像, 使用默认头像
            _headId = this._info.job;
        }
        this.icon_head.url = IconFactory.getHeadIcon(_headId, IconType.SMALL_HEAD_ICON, ".jpg");
        this.txt_level.text = this._info.grade.toString();
        this.txt_name.text = this._info.nickname;
        this.txt_fight.text = this._info.fightingCapacity.toString();
    }

    public dispose() {
        super.dispose();
    }
}