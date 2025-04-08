import FUI_OtherRoleCom from "../../../../fui/Home/FUI_OtherRoleCom";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { IconType } from "../../constant/IconType";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { BaseArmy } from "../../map/space/data/BaseArmy";
import SpaceArmy from "../../map/space/data/SpaceArmy";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { TipsShowType } from "../../tips/ITipedDisplay";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import ChatItemMenu from "../chat/ChatItemMenu";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../consortia/data/ConsortiaDutyInfo";


/**
* @author:zhihua.zhou
* @date: 2021-11-18 16:59
* @description 点击其他玩家弹出的玩家头像信息框
*/
export default class OtherRoleCom extends FUI_OtherRoleCom {

    private _data: BaseArmy;
    tipData: any;
    // tipType: EmWindow.OuterCityArmyTips;
    // alphaTest: boolean = true;
    // showType: TipsShowType = TipsShowType.onClick;
    // startPoint: Laya.Point = new Laya.Point(-250, -75);
    onConstruct() {
        super.onConstruct();
        this.addEvent();
    }

    private addEvent(): void {
        this.dropbox.onClick(this, this.onDropdown);
    }

    private onDropdown(): void {

        var showConsortia: boolean = false;
        if (this.playerInfo.consortiaID > 0) {
            showConsortia = (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).getRightsByIndex(ConsortiaDutyInfo.PASSINVITE)
            showConsortia = showConsortia && this._data.baseHero.consortiaID <= 0;
        }
        var showAttack: boolean = this.canShowAttackBtn();
        var isRobot: boolean = false;
        if (this._data instanceof SpaceArmy) {
            isRobot = (this._data as SpaceArmy).isRobot;
        }
        var menuX: number = this.dropbox.x;
        var menuY: number = this.dropbox.y;
        var menuPos: Laya.Point = this.localToGlobal(menuX, menuY);
        this.showUseMenu(menuPos.x - 25, menuPos.y + 320, this._data.baseHero.nickName, this._data.baseHero.userId, showConsortia, null, showAttack, isRobot);
    }

    private showUseMenu(menuX: number, menuY: number, name: string, id: number, showConsortia: boolean, servername: string = null, showAttack: boolean = false, isRobot: boolean = false): void {
        var showInvite: boolean = FreedomTeamManager.Instance.canInviteMember(id);
        let point: Laya.Point = new Laya.Point(menuX, menuY);
        ChatItemMenu.Show(name, id, showConsortia, servername, true, false, showInvite, point);
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }


    /**
     * 设置玩家信息
     * @param data 
     */
    public setRoleInfo(data: BaseArmy): void {
        this._data = data;
        if (data) {
            (<fgui.GLoader>this.playerIcon.getChild("n0")).url = IconFactory.getPlayerIcon(data.baseHero.headId, IconType.HEAD_ICON);
            this.levelTxt.text = data.baseHero.grades.toString();
            this.userNameTxt.text = data.baseHero.nickName;
            this._data.addEventListener(CampaignMapEvent.ONLINE_STATE, this.__onlineStateHandler, this);
            this.tipData = this._data;
            this.showTip();
        }
    }

    private showTip() {
        //只在天空之城以及外城显示该提示
        let mapStr: string[] = [SceneType.OUTER_CITY_SCENE, SceneType.SPACE_SCENE];
        if (mapStr.includes(SceneManager.Instance.currentType))
            UIManager.Instance.ShowWind(EmWindow.OuterCityArmyTips, [this.tipData]);
    }

    private __onlineStateHandler(evt: CampaignMapEvent): void {
        if (!this._data || !(this._data instanceof CampaignArmy)) {
            PlayerManager.Instance.currentPlayerModel.selectTarget = null;
        } else if (!(this._data as CampaignArmy).online) {
            PlayerManager.Instance.currentPlayerModel.selectTarget = null;
        }
    }

    private isSelf(): boolean {
        if (!this._data) return false;
        return this.playerInfo.userId == this._data.userId && this.playerInfo.serviceName == this._data.baseHero.serviceName;
    }

    //英灵岛、紫晶矿场  显示发起攻击
    private canShowAttackBtn(): boolean {
        var attack: boolean = false;
        if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            var mapId: number = CampaignManager.Instance.mapId;
            if (!this.isSelf() && (WorldBossHelper.checkPetLand(mapId) || WorldBossHelper.checkMineral(mapId))) {
                attack = true;
            }
        }
        return attack;
    }

    public removeEvent(): void {
        this.dropbox.offClick(this, this.onDropdown);
        if (this._data) this._data.removeEventListener(CampaignMapEvent.ONLINE_STATE, this.__onlineStateHandler, this);
    }


}
