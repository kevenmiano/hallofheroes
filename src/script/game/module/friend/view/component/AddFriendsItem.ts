import FUI_AddFriendsItem from "../../../../../../fui/Friend/FUI_AddFriendsItem";
import { RecommendInfo } from "../../../../datas/RecommendInfo";
import LangManager from "../../../../../core/lang/LangManager";
import { FriendManager } from "../../../../manager/FriendManager";
import RelationType from "../../../../constant/RelationType";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { IconType } from "../../../../constant/IconType";
import Utils from "../../../../../core/utils/Utils";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/29 15:57
 * @ver 1.0
 *
 */
export class AddFriendsItem extends FUI_AddFriendsItem {
    private _info: RecommendInfo;
    //@ts-ignore
    public icon_head: IconAvatarFrame;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        Utils.setDrawCallOptimize(this);
        this.initEvent();
    }

    get info(): RecommendInfo {
        return this._info;
    }

    set info(value: RecommendInfo) {
        this._info = value;
        this.c1.selectedIndex = 0;

        if (this._info) {
            this.icon_head.headId = this._info.headId;
            if (this._info.frameId > 0) {
                let itemData: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(this._info.frameId);
                if (itemData) {
                    this.icon_head.headFrame = itemData.Avata;
                    this.icon_head.headEffect = (Number(itemData.Property1) == 1) ? itemData.Avata : "";
                }
            }else{
                this.icon_head.headFrame = "";
                this.icon_head.headEffect = "";
            }
            this.txt_level.text = this._info.level.toString();
            this.txt_name.text = this._info.name;
            this.txt_fight.text = LangManager.Instance.GetTranslation("yishi.view.PlayerMenu.ap",this._info.attack);
        } else {
            this.icon_head.headId = 0;
            this.icon_head.headFrame = "";
            this.icon_head.headEffect = "";
            this.txt_level.text = "";
            this.txt_name.text = "";
            this.txt_fight.text = "";
        }
    }

    private initEvent() {
        this.bbtn_add.onClick(this, this.onBtnAddClick);
    }

    private onBtnAddClick(e: Laya.Event) {
        if (!this._info) return;
        FriendManager.getInstance().sendAddFriendRequest(this._info.name, RelationType.FRIEND);
    }

    private removeEvent() {
        this.bbtn_add.offClick(this, this.onBtnAddClick);
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}