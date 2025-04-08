/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-23 15:17:31
 * @LastEditTime: 2024-02-23 16:57:36
 * @LastEditors: jeremy.xu
 * @Description: 单人竞技, 竞技场, 多人副本公用玩家展示Item
 */

import FUI_RoomPlayerItem from "../../../../fui/BaseRoom/FUI_RoomPlayerItem";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import UIButton from "../../../core/ui/UIButton";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { ShowAvatar } from "../../avatar/view/ShowAvatar";
import { BattleManager } from "../../battle/BattleManager";
import { FilterFrameText, eFilterFrameText } from "../../component/FilterFrameText";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { PhysicsEvent} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { RoomEvent, RoomPlayerState, RoomInviteType, RoomPlayerItemType } from "../../constant/RoomDefine";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import RechargeAlertMannager from "../../manager/RechargeAlertMannager";
import { RoomManager } from "../../manager/RoomManager";
import { PetAvatarView } from "../../map/avatar/view/PetAvatarView";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import BuildingManager from "../../map/castle/BuildingManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { RoomInfo } from "../../mvc/model/room/RoomInfo";
import RoomHallCtrl from "../../room/room/roomHall/RoomHallCtrl";
import FUIHelper from "../../utils/FUIHelper";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import ChatPopView from "../chat/ChatPopView";
import ChatData from "../chat/data/ChatData";
import { PetData } from "../pet/data/PetData";
import { RoomState } from "../../constant/RoomState";
import RankStarItem from "../../room/room/roomList/item/RankStarItem";
import RoomPlayerItemMenu from "./RoomPlayerItemMenu";
import ColosseumCtrl from "../pvp/colosseum/ColosseumCtrl";


export default class RoomPlayerItem extends FUI_RoomPlayerItem {
    public index: number;
    private _type: RoomPlayerItemType = RoomPlayerItemType.PveHall;
    public set type(value: RoomPlayerItemType) {
        this._type = value
        this.gChallenge.visible = value == RoomPlayerItemType.PvpChallenge
        this.imgState.visible = value != RoomPlayerItemType.PvpChallenge
        this.btnInvite.visible = value != RoomPlayerItemType.PvpChallenge
        this.btnOwnerOpt.visible = value != RoomPlayerItemType.PvpChallenge
        if (this._heroFigure) {
            this._heroFigure.showPet = value != RoomPlayerItemType.PvpChallenge
        }
    }
    public get type(): RoomPlayerItemType {
        return this._type
    }
    private _info: CampaignArmy;
    private _heroFigure: ShowAvatar;
    private _heroFigureCon: fgui.GComponent;
    private _currentHero: ThaneInfo;
    private _petNameTxt: FilterFrameText;
    private _petNameShadowTxt: FilterFrameText;
    private _uBtnChallenge: UIButton;
    private _starCom: fgui.GComponent;
    public bShowOptView: boolean = false;

    protected onConstruct() {
        super.onConstruct()

        this._heroFigureCon = new fgui.GComponent()
        this.addChild(this._heroFigureCon)
        this._heroFigure = new ShowAvatar(false, this.__onCompleteHandler.bind(this), true);
        this._heroFigureCon.displayObject.addChild(this._heroFigure);
        this._heroFigure.pos(-35, 160);

        this._petNameShadowTxt = new FilterFrameText(240, 20, undefined, 16, "#000000", undefined, undefined, undefined, undefined, false);
        this._heroFigureCon.displayObject.addChild(this._petNameShadowTxt);
        this._petNameTxt = new FilterFrameText(240, 20, undefined, 16, undefined, undefined, undefined, undefined, undefined, false);
        this._heroFigureCon.displayObject.addChild(this._petNameTxt);

        this.setChildIndex(this._heroFigureCon, -1)
        this.setChildIndex(this.imgStage, -2)

        this.resetItem();
    }

    public addBtnEvent() {
        if (this._type != RoomPlayerItemType.PvpChallenge) {
            this.btnOwnerOpt.onClick(this, this.btnOwnerOpClick.bind(this))
            this.btnInvite.onClick(this, this.btnInviteClick.bind(this))
        } else {
            this._uBtnChallenge = new UIButton(this.btnChallenge)
            this._uBtnChallenge.btnInternal = 1000
            this._uBtnChallenge.onClick(this, this.btnChallengeClick.bind(this))
        }
    }

    public set info(value: CampaignArmy) {
        Logger.xjy("[RoomPlayerItem] info", value)
        this.removeArmyEvent();
        this._info = value;
        this.addArmyEvent()
        this.refreshView();
    }

    public get info(): CampaignArmy {
        return this._info
    }

    private __onCompleteHandler() {
        // if (this._heroFigure.data && this._heroFigure.width == 0 || this._heroFigure.height == 0) return;
        // this.gName.y = this._heroFigure.content.height

        this.imgOwner.visible = this.isOwnerItem
        // this.imgOwner.x = this.txtPlayerName.x - this.txtPlayerName.textWidth / 2 - this.imgOwner.width / 2;


        this.setPetName();
        this.setHonerName();
        // if (this.isVip) {
        // this.setVipIcon();
        // // this._info.baseHero.vipType == 1 ? this._vipIcon.setFrame(1) : this._vipIcon.setFrame(2);
        // var vWidth: number = this._vipIcon.width + this.txtPlayerName.width + 20;
        // var dx: number = (this.txtPlayerName.width - this.txtPlayerName.width) >> 1;
        // this._vipIcon.y = this.txtPlayerName.y - (this._vipIcon.height - this.txtPlayerName.height);
        // this._vipIcon.x = -vWidth >> 1;
        // this.txtPlayerName.x = this._vipIcon.x + this._vipIcon.width - dx + 6;

        // this._vipIcon.y = this.txtPlayerName.y - 2;
        // this._vipText.x = this.txtPlayerName.x;
        // this._vipText.y = this.txtPlayerName.y;
        // this.imgOwner.x = this._vipIcon.x - this.imgOwner.width;
        // this._vipText.text = this.txtPlayerName.text;
        // }
        // if (this._info && this._info.userId == ArmyManager.Instance.army.userId) {
        //     if (this._vipText) this._vipText.visible = false;
        //     this.txtPlayerName.visible = true;
        // } else if (this._info && this._info.baseHero.consortiaID != 0 && this._info.baseHero.consortiaID == this.playerInfo.consortiaID) {
        //     if (this._vipText) this._vipText.visible = false;
        //     this.txtPlayerName.visible = true;
        // } else if (this.isVip) {
        //     if (this._vipText) this._vipText.visible = true;
        //     this.txtPlayerName.visible = false;
        // }
        // else {
        //     if (this._vipText) this._vipText.visible = false;
        //     this.txtPlayerName.visible = true;
        // }
    }

    private setPetName(petNameString: string = "") {
        if (!this._info || !this._info.baseHero) return
        if (!this._heroFigure.petAvatar) return;
        if (!this._info.baseHero.petTemplate) {
            this.removePetInfo();
            return;
        }

        var petName: string = this._info.baseHero.petName ? this._info.baseHero.petName : "";
        if (petNameString != "") {
            petName = petNameString;
        }

        this._petNameTxt.text = petName;
        this._petNameShadowTxt.text = petName;
        // TODO
        let offX = 0
        let offY = 0
        if (this._info.baseHero.petTemplate.PetAvatar.indexOf("pet_rainbow") != -1) {
            offX += 10
            offY -= 10
        }
        if (this._info.baseHero.petTemplate.PetAvatar.indexOf("pet_yifu") != -1) {
            offX += 10
        }
        // this._petNameTxt.pos(this._heroFigure.petAvatar.x, this._heroFigure.petAvatar.y + this._heroFigure.petHeadY);
        this._petNameTxt.pos(this._heroFigure.petAvatar.x - 40 + offX, this._heroFigure.petAvatar.y + 60 + offY);
        this._petNameShadowTxt.pos(this._heroFigure.petAvatar.x - 40 + offX + 1, this._heroFigure.petAvatar.y + 60 + offY + 1);

        if (this._info.baseHero.petQuaity > 0) {
            this._petNameTxt.color = PetData.getQualityColor(this._info.baseHero.petQuaity - 1);
        }
        this.showStar(this._info.baseHero.temQuality);
    }

    private showStar(temQuality: number) {
        if (!this._starCom) {
            this._starCom = FUIHelper.createFUIInstance(EmPackName.BaseCommon, PetAvatarView.STAR_QUALITY_RES);
            if (this._starCom) {
                this.addChild(this._starCom);
                this._starCom.setScale(0.5, 0.5);
            }
        }
        if (temQuality > 0) {
            let mod: number = 0;
            if (temQuality > 20) {
                mod = 0;
            } else if (temQuality % 5 == 0) {
                mod = 5;
            }
            else {
                mod = temQuality % 5;
            }
            for (let j: number = 0; j < 5; j++) {
                this._starCom.getChild("star" + (j + 1)).visible = j < mod
            }
            this._starCom.x = this._petNameTxt.x;
            this._starCom.y = this._petNameTxt.y - 10;
        }
    }

    private setHonerName() {
        if (!this._info) return
        // if (_appellId == this._info.baseHero.appellId && (_honerView && _honerView.parent || _honerTxt && _honerTxt.parent)) {
        //     return;
        // }
        // _appellId = this._info.baseHero.appellId;
        // if (_honerTxt && _honerTxt.parent) _honerTxt.parent.removeChild(_honerTxt);
        // ObjectUtils.disposeObject(_honerTxt);
        // _honerTxt = null;
        // if (_honerView && _honerView.parent) _honerView.parent.removeChild(_honerView);
        // ObjectUtils.disposeObject(_honerView);
        // _honerView = null;
        // if (this.isHoner) {
        //     _honerTxt = ComponentFactory.Instance.creatComponentByStylename(this.honerStyle);
        //     _honerTxt.text = this.honerName;
        //     _honerTxt.x = -_honerTxt.width / 2;
        //     _honerTxt.y = this._info.baseHero.consortiaName ? txtPlayerName.y - 40 : txtPlayerName.y - 20;
        //     _honerView = new AppellView(this._info.baseHero.appellInfo.ImgWidth, this._info.baseHero.appellInfo.ImgHeight, his._info.baseHero.appellId);
        //     _honerView.x = -_honerView.width / 2;
        //     _honerView.y = this._info.baseHero.consortiaName ? txtPlayerName.y - this._info.baseHero.appellInfo.ImgHeight - 20 : txtPlayerName.y - this._info.baseHero.appellInfo.ImgHeight;
        //     _honerView.drawFrame = this._info.baseHero.appellInfo.ImgFrame;
        //     this.showHoner();
        // }
    }

    private showHoner() {
        // if (ConfigManager.info.APPELL) {
        //     if (_honerTxt && _honerTxt.parent) _honerTxt.parent.removeChild(_honerTxt);
        //     this.addChild(_honerView);
        // }
        // else {
        //     this.addChild(_honerTxt);
        //     if (_honerView && _honerView.parent) _honerView.parent.removeChild(_honerView);
        // }
    }

    // private get honerStyle(): string {
    //     if (ConfigManager.info.APPELL) {
    //         return "map.campaign.HonerText" + this._info.baseHero.appellInfo.Quality;
    //     }
    //     else {
    //         return "map.campaign.HonerText";
    //     }
    // }

    // private get honerName(): string {
    //     if (ConfigManager.info.APPELL) {
    //         return this._info.baseHero.appellInfo.Title;
    //     }
    //     else {
    //         return this._info.baseHero.honerTemp.TemplateName;
    //     }
    // }

    // private get isHoner(): boolean {
    //     if (ConfigManager.info.APPELL) {
    //         return this._info.baseHero.appellId != 0;
    //     }
    //     else {
    //         return this._info.baseHero.honer >= this._info.baseHero.firstHonerTemp.Data;
    //     }
    // }

    private setVipIcon() {
        // _vipIcon||(_vipIcon = ComponentFactory.Instance.creatComponentByStylename("core.vipIcon"));
        // addChild(_vipIcon);
        // _vipIcon.scaleX = _vipIcon.scaleY = 1.25;
        // _vipText || (_vipText = ComponentFactory.Instance.creatComponentByStylename("room.anterRoom.nameGradientText"));
        // addChild(_vipText);
    }

    private clearVipName() {
        // _vipIcon && _vipIcon.parent && _vipIcon.parent.removeChild(_vipIcon);
        // ObjectUtils.disposeObject(_vipIcon);
        // _vipIcon = null;
        // _vipText && _vipText.parent && _vipText.parent.removeChild(_vipText);
        // ObjectUtils.disposeObject(_vipText);
        // _vipText = null;
    }

    private removeArmyEvent() {
        if (this._info) {
            this._info.removeEventListener(PhysicsEvent.CHAT_DATA, this.__chatHandler, this);
            this._info.removeEventListener(RoomEvent.UPDATE_ROOM_PLAYER_DATA, this.__updatePlayerInfoHandler, this);
            this._info.baseHero.removeEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroInfoChange, this);
            this._info.baseHero.removeEventListener(PlayerEvent.APPELL_CHANGE, this.__heroInfoChange, this);
        }
        if (this.roomInfo) {
            this.roomInfo.removeEventListener(RoomEvent.UPDATE_ROOM_BASE_DATA, this.__updateRoomInfoHanlder, this);
        }
    }
    private addArmyEvent() {
        if (this._info) {
            this._info.addEventListener(PhysicsEvent.CHAT_DATA, this.__chatHandler, this);
            this._info.addEventListener(RoomEvent.UPDATE_ROOM_PLAYER_DATA, this.__updatePlayerInfoHandler, this);
            this._info.baseHero.addEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroInfoChange, this);
            this._info.baseHero.addEventListener(PlayerEvent.APPELL_CHANGE, this.__heroInfoChange, this);
            // this._info.baseHero.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__updateInfoHandler, this);
        }
        if (this.roomInfo) {
            this.roomInfo.addEventListener(RoomEvent.UPDATE_ROOM_BASE_DATA, this.__updateRoomInfoHanlder, this);
        }
    }

    private __updateRoomInfoHanlder() {
        if (this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
            FrameCtrlManager.Instance.exit(EmWindow.Invite);
        }
        this.refreshOptBtn()
    }

    private _chatPopView: ChatPopView;
    private __chatHandler(chatData: ChatData) {
        // <a t="6" id="1" name="多人副本【月魔部落（普通）】房间[1], 期待你的加入" campaignId="9008" islock="1" position="1"/>

        if (chatData.htmlText.indexOf('<a') > -1 && chatData.htmlText.indexOf('/>') > -1) {
            return;
        }
        if (chatData.encodemsg.indexOf('<a') > -1 && chatData.encodemsg.indexOf('/>') > -1) {
            return;
        }
        if (chatData.serverId) {
            return;
        }
        if (!PlayerManager.Instance.currentPlayerModel.playerInfo.isOpenSettingType10 || chatData.uid == 0) {
            return;
        }
        if (!this._chatPopView) {
            this._chatPopView = FUIHelper.createFUIInstance(EmPackName.Base, "ChatBubbleTip");
        }
        if (this.name == 'item1') {
            this._chatPopView.updateContent(chatData.htmlText, chatData.encodemsg, this.__chatBackCall.bind(this), 0, chatData.channel);
            this._chatPopView.y = 90;
        } else {
            this._chatPopView.updateContent(chatData.htmlText, chatData.encodemsg, this.__chatBackCall.bind(this), 0, chatData.channel);
            this._chatPopView.y = 60;
        }
        // this._chatPopView.x = 50;
        this._chatPopView.x = this.width / 2;
        this.addChild(this._chatPopView);
        this.setChildIndex(this._chatPopView, 0);
        // this.addChild(this.);  //保持玩家名在聊天泡泡上层
    }

    private __chatBackCall() {
        if (this._chatPopView && this._chatPopView.parent) {
            this._chatPopView.parent.removeChild(this._chatPopView);
        }
        this._chatPopView = null;
    }

    private __heroInfoChange() {
        Logger.xjy("[RoomPlayerItem]__heroInfoChange英雄信息改变", this._info.baseHero)
        this._heroFigure.data = this._info.baseHero;
        this.setHonerName();
        this.setPetName();
    }

    private __updatePlayerInfoHandler(info: CampaignArmy) {
        this.updateRoomPlayerState(info)
    }

    private refreshView() {
        this.__updatePlayerInfoHandler(this._info);

        this._heroFigure.visible = Boolean(this._info)
        if (this._info) {
            this.gName.visible = true
            this.setNickName();
            this.setConsortiaName();
            this.setMiniRank();
            this._currentHero = this._info.baseHero;
            this._heroFigure.data = this._currentHero;
            this.updateOwnerState();
            if (this._type == RoomPlayerItemType.PvpChallenge) {
                this.updateRank();
            }
        } else {
            this.resetItem()
        }
    }

    private setNickName() {
        if (this._info.userId == ArmyManager.Instance.army.userId) {//自己
            this.txtRank.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][2];
        } else if (this._info.baseHero.consortiaID != 0 && this._info.baseHero.consortiaID == this.playerInfo.consortiaID) {//同工会
            this.txtRank.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][1];
        } else {
            this.txtRank.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][0];
        }
        if (this._type == RoomPlayerItemType.PvpChallenge) {
            this.txtRank.text = this._info.baseHero.nickName
        } else {
            let level = this._info.baseHero.grades
            this.txtRank.text = LangManager.Instance.GetTranslation("public.level2", level) + " " + this._info.baseHero.nickName;
        }

        this.txtPlayerName.color = this.txtRank.color;
        this.txtPlayerName.text = this.txtRank.text;
        this.txtPlayerNameShadow.text = this.txtRank.text;
    }

    private setConsortiaName() {
        if (this._info.userId == ArmyManager.Instance.army.userId) {
            this.txtGuildName.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][2];
        } else if (this._info.baseHero.consortiaName && this._info.baseHero.consortiaName == this.playerInfo.consortiaName) {
            this.txtGuildName.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][1];
        } else {
            this.txtGuildName.color = FilterFrameText.Colors[eFilterFrameText.AvatarName][0];
        }
        this.txtGuildName.text = this._info.baseHero.consortiaName ? "<" + this._info.baseHero.consortiaName + ">" : "";
        this.txtGuildNameShadow.text = this.txtGuildName.text;
    }

    /** 新版多人竞技显示段位图标 */
    private setMiniRank() {
        if (!this.miniRank) {
            return;
        }
        if (SceneManager.Instance.currentType == SceneType.PVP_ROOM_SCENE) {
            let rankItem = this.miniRank as RankStarItem;
            rankItem.setInfo(this._info.baseHero.segmentId, true);
            this.miniRank.displayObject.visible = true;
        } else {
            this.miniRank.displayObject.visible = false;
        }
    }

    /**
     * 更新房主显示
     */
    public updateOwnerState() {
        this.__onCompleteHandler();
    }


    /**
     * 更新玩家状态
     */
    public updateRoomPlayerState(info: CampaignArmy) {
        if (this.type == RoomPlayerItemType.PvpChallenge) return

        let res = ""
        if (info) {
            // if (this._info.baseHero.userId == info.baseHero.userId) {
            if (info.roomState == RoomPlayerState.PLAYER_STATE_WAITE) {
                res = "Btn_Sim_More"
            } else if (info.roomState == RoomPlayerState.PLAYER_STATE_READY || info.roomState == RoomPlayerState.PLAYER_STATE_HOST) {
                res = "Btn_Sim_TickG"
            }
            // }
        }
        this.btnInvite.visible = !Boolean(res)
        this.btnOwnerOpt.visible = Boolean(res)

        this.imgState.url = fgui.UIPackage.getItemURL(EmPackName.BaseRoom, res)

        this.refreshOptBtn()
    }

    public set state(value: number) {

    }

    public set placeState(value: number) {
    }

    private btnOwnerOpClick(evt: Laya.Event) {
        if (this.isSelf) return;
        let pos = this.displayObject.localToGlobal(new Laya.Point(this.width / 2, this.height / 2), true, Laya.stage)
        evt.stopPropagation()
        RoomPlayerItemMenu.Instance.Show(this._type, this._info, pos)

    }

    private refreshOptBtn() {
        RoomPlayerItemMenu.Instance.Hide()
    }

    private btnInviteClick() {
        if (this.roomInfo && this.roomInfo.roomState == RoomState.STATE_COMPETEING) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("roomplayerItem.btnClick.tips"));
            return;
        }
        FrameCtrlManager.Instance.open(EmWindow.Invite, { type: RoomInviteType.RoomInvite });
    }

    // ---------------------单人竞技场挑战---------------------------//
    private btnChallengeClick() {
        if (this._type != RoomPlayerItemType.PvpChallenge) return
        if (this._currentHero) {
            var str: string = "";
            if (!BuildingManager.Instance.model.checkHasIdleColosseumOrder()) {
                str = LangManager.Instance.GetTranslation("colosseum.view.ColosseumListView.command02");
                MessageTipManager.Instance.show(str);
                return;
            }
            if (!SwitchPageHelp.checkScene()) return;
            if (this.ctrl.data.remainFreeCount <= 0) {
                if (this.ctrl.data.remainBuyCount > 0) {
                    var payNum: number = this.ctrl.data.buyCountNeedPay;
                    str = LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.buyCountTip", payNum);
                    SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { payNum: payNum }, null, str, null, null, this.__btnChallengeClick.bind(this));
                }
                else {
                    str = LangManager.Instance.GetTranslation("colosseum.view.ColosseumListView.command01");
                    MessageTipManager.Instance.show(str);
                }
                return;
            }
            this.__btnChallengeClick(true, true);
        }
    }
    private __btnChallengeClick(b: boolean, flag: boolean, data?: any) {
        if (b && this._currentHero) {
            var pointNum: number = (flag ? this.playerInfo.point + this.playerInfo.giftToken : this.playerInfo.point);
            if (data && pointNum < data.payNum) {
                RechargeAlertMannager.Instance.show();
                return;
            }

            let curSceneType = SceneManager.Instance.currentType
            switch (curSceneType) {
                case SceneType.CASTLE_SCENE:
                case SceneType.SPACE_SCENE:
                case SceneType.OUTER_CITY_SCENE:
                    BattleManager.preScene = curSceneType;
                    break;
                default:
                    BattleManager.preScene = SwitchPageHelp.returnScene;
                    break;
            }

            // BattleManager.preScene = SwitchPageHelp.returnScene;
            ColosseumCtrl.sendChallengeById(this._currentHero.userId, (flag ? 0 : 1));
        }
    }
    private updateRank() {

        this.gName.visible = false;
        this.gScore.visible = true;


        this.txtPower.text = LangManager.Instance.GetTranslation('RoomList.pvp.colosseum.player.txt2', this._currentHero.fightingCapacity);
        this.txtScore.text = LangManager.Instance.GetTranslation('RoomList.pvp.colosseum.player.txt1', this._currentHero.challengeScore);
    }


    private get isOwnerItem(): boolean {
        return this._info && this.roomInfo && this._info.baseHero.userId == this.roomInfo.houseOwnerId
    }

    private get isSelf(): boolean {
        return this._info && this._info.baseHero.userId == this.playerInfo.userId
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get isVip(): boolean {
        return this._info && this._info.baseHero.IsVipAndNoExpirt;
    }

    private get roomInfo(): RoomInfo {
        return RoomManager.Instance.roomInfo;
    }

    private get ctrl(): any {
        switch (this._type) {
            case RoomPlayerItemType.PveHall:
            case RoomPlayerItemType.PvpHall:
                return FrameCtrlManager.Instance.getCtrl(EmWindow.RoomHall) as RoomHallCtrl
                break;
            case RoomPlayerItemType.PvpChallenge:
                return FrameCtrlManager.Instance.getCtrl(EmWindow.Colosseum) as ColosseumCtrl
                break;
            default:
                break;
        }

    }

    private resetItem() {
        // if (this._chatPopView)
        //     this._chatPopView.dispose();
        //     this._chatPopView = null;

        this._currentHero = null;
        this._heroFigure.data = null;
        this.txtRank.text = ""
        this.updateOwnerState();
        if (this.roomInfo) {
            this.state = this.roomInfo.placesState[this.index] == -1 ? -1 : 0;
        }
        this.removePetInfo();

        this.bShowOptView = false
        this.gName.visible = false
    }

    public removePetInfo() {
        if (this._starCom) {
            ObjectUtils.disposeObject(this._starCom);
            this._starCom = null;
        }
        this._petNameTxt.text = "";
        this._petNameShadowTxt.text = "";
    }

    public dispose() {
        this.removeArmyEvent();
        ObjectUtils.disposeObject(this._heroFigure);
        this._heroFigure = null;
    }
}