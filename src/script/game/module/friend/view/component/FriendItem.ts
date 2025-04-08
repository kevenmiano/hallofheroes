import FUI_FriendItem from "../../../../../../fui/Friend/FUI_FriendItem";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { IconType } from "../../../../constant/IconType";
import LangManager from "../../../../../core/lang/LangManager";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import { TempleteManager } from "../../../../manager/TempleteManager";
import UIManager from "../../../../../core/ui/UIManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import FreedomTeamManager from "../../../../manager/FreedomTeamManager";
import ChatItemMenu from "../../../chat/ChatItemMenu";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ConsortiaControler } from "../../../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../../../consortia/data/ConsortiaDutyInfo";
import Utils from "../../../../../core/utils/Utils";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import IconAvatarFrame from "../../../../map/space/view/physics/IconAvatarFrame";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/27 16:47
 * @ver 1.0
 *
 */
export class FriendItem extends FUI_FriendItem {
    private _info: ThaneInfo;

    declare public icon_head: IconAvatarFrame;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
        this.initEvent();
    }

    private initEvent() {
        this.btn_flower.onClick(this, this.onBtnFlowersClick);
        this.btn_chat.onClick(this, this.btnChatClick);
        this.btn_more.onClick(this, this.btnMoreClick);
        this.on(Laya.Event.CLICK, this, this.onChatWndClick);
        Utils.setDrawCallOptimize(this);
    }

    get info(): ThaneInfo {
        return this._info;
    }

    set info(value: ThaneInfo) {
        this._info = value;
        this.icon_head.grayed = !this._info.isOnline;
        this.icon_head.isGray = !this._info.isOnline;
        this.icon_head.headId = this._info.snsInfo.headId;
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
        this.txt_level.text = this._info.grades.toString();
        this.txt_name.text = this._info.nickName;
        this.txt_fight.text = LangManager.Instance.GetTranslation("yishi.view.PlayerMenu.ap", this._info.fightingCapacity);
        this.txt_grade.text = LangManager.Instance.GetTranslation("public.level2", this._info.friendGrade);

        let next_upGradeInfo: t_s_upgradetemplateData;
        if (this._info.friendGrade < 10) {
            next_upGradeInfo = TempleteManager.Instance.getTemplateByTypeAndLevelAndID(this._info.friendGrade + 1, 6, 0);
        }
        if (next_upGradeInfo) {
            if (this._info.friendGrade > 0) {
                this.progress.min = 0;
                this.progress.max = next_upGradeInfo.Data;
                this.progress.value = this._info.friendGp;
            }
            else {
                this.progress.min = 0;
                this.progress.max = 0;
                this.progress.value = 0;
                // this.progress.getChild("title").text = "--";
            }
        }
        else {
            this.progress.min = 0;
            this.progress.max = 9999;
            this.progress.value = 9999;
            this.progress.getChild("title").text = "Max";
        }
    }

    private onBtnFlowersClick(e: Laya.Event) {
        UIManager.Instance.ShowWind(EmWindow.SendFlowerWnd, this._info.nickName);
    }

    //私聊
    private btnChatClick() {
        FrameCtrlManager.Instance.exit(EmWindow.FriendWnd);
        if (!FrameCtrlManager.Instance.isOpen(EmWindow.ChatWnd)) {
            FrameCtrlManager.Instance.open(EmWindow.ChatWnd, { thaneInfo: this._info });
        }
    }

    private btnMoreClick() {
        let showConsortia: boolean;
        if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0) {
            showConsortia = (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).getRightsByIndex(ConsortiaDutyInfo.PASSINVITE)
            showConsortia = showConsortia && this._info.consortiaID <= 0;
        }
        // if (Laya.stage.mouseX + 318 > Resolution.gameWidth) {
        //     this.showUseMenu(Resolution.gameWidth - 318, Laya.stage.mouseY, this._info.nickName, this._info.userId, showConsortia);
        // }
        // else {
        //     this.showUseMenu(Laya.stage.mouseX, Laya.stage.mouseY, this._info.nickName, this._info.userId, showConsortia);
        // }
        let point: Laya.Point = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
        UIManager.Instance.ShowWind(EmWindow.OuterCityArmyTips, [this._info,point]);
    }

    private onChatWndClick() {
        if (UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
            UIManager.Instance.HideWind(EmWindow.ChatItemMenu);
        }
    }

    private showUseMenu(menuX: number, menuY: number, name: string, id: number, showConsortia: boolean, servername: string = null) {
        var showInvite: boolean = FreedomTeamManager.Instance.canInviteMember(id);
        let point: Laya.Point = new Laya.Point(menuX, menuY);
        ChatItemMenu.Show(name, id, showConsortia, servername, false, false, showInvite, point, this._info);
    }

    private removeEvent() {
        this.btn_flower.offClick(this, this.onBtnFlowersClick);
        this.btn_chat.offClick(this, this.btnChatClick);
        this.btn_more.offClick(this, this.btnMoreClick);
        this.off(Laya.Event.CLICK, this, this.onChatWndClick);
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}