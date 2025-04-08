// @ts-nocheck
import FUI_WarlordsRewardItem from "../../../../../../fui/Warlords/FUI_WarlordsRewardItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { EmWindow } from "../../../../constant/UIDefine";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../../tips/ITipedDisplay";
import WarlordsModel from "../../WarlordsModel";
import WarlordsRewardInfo from "../data/WarlordsRewardInfo";
export default class WarlordsRewardItem extends FUI_WarlordsRewardItem implements ITipedDisplay {
    tipData: any;
    tipType: EmWindow;
    canOperate: boolean = false;
    showType: TipsShowType = TipsShowType.onClick;
    startPoint: Laya.Point = new Laya.Point(-40, -20);
    protected _info: WarlordsRewardInfo;
    constructor() {
        super();
    }

    public set info(info: WarlordsRewardInfo) {
        this._info = info;
        this.clean();
        if (!info) {
            return;
        }
        ToolTipsManager.Instance.register(this);
        if (info.type == WarlordsModel.REWARD_TYPE_TWO)//物品
        {
            this.picLoader.url = IconFactory.getGoodsIconByTID(info.goodsInfo.templateInfo.TemplateId);
        }
        else {
            this.picLoader.url = info.picUrl;
        }
        this.nameTxt.text = this._info.nameStr;
        this.setTipStyle(info);
    }

    private setTipStyle(info: WarlordsRewardInfo) {
        this.tipData = info.tipData;
        switch (info.type) {
            case WarlordsModel.REWARD_TYPE_ONE:
                this.tipType = EmWindow.MountTips;
                break;
            case WarlordsModel.REWARD_TYPE_TWO:
                this.tipType = EmWindow.PropTips;
                break;
            case WarlordsModel.REWARD_TYPE_THREE:
            case WarlordsModel.REWARD_TYPE_FOUR:
                this.tipType = EmWindow.CommonTips;
                break;
        }
    }

    protected clean() {
        this.picLoader.url = null;
        this.nameTxt.text = "";
        this.tipData = null;
        this.tipType = null;
    }

    dispose() {
        this.clean();
        ToolTipsManager.Instance.unRegister(this);
        this._info = null;
        this.startPoint = null;
        super.dispose();
    }
}