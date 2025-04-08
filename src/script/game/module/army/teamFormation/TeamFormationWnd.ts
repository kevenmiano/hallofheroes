// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-26 10:06:10
 * @LastEditTime: 2023-06-29 18:10:31
 * @LastEditors: jeremy.xu
 * @Description: 队形调整界面 【对应v2.46-模块teammanager】
 */
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { RoomEvent } from "../../../constant/RoomDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { RoomManager } from "../../../manager/RoomManager";
import { CampaignArmy } from "../../../map/campaign/data/CampaignArmy";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import TeamFormationItemDrag from "./item/TeamFormationItemDrag";

import ArmyFightPosEditMsg = com.road.yishi.proto.army.ArmyFightPosEditMsg;
import MemberFightPos = com.road.yishi.proto.team.MemberFightPos;
export default class TeamFormationWnd extends BaseWindow {
    protected setOptimize: boolean = false;
    private itemList: fgui.GList;
    private _posList: number[] = [3, 2, 1, 6, 5, 4, 9, 8, 7];
    private _legitPosList: number[] = [0, 1, 3, 4, 6, 7];
    private _itemList: SimpleDictionary = new SimpleDictionary();
    private _isHouseOwner: boolean = false;
    private openType: number = 0;
    private param: any;
    public get isHouseOwner() {
        if (this.roomInfo && this.roomInfo.id != 0) {
            return this.roomInfo.houseOwnerId == this.selfArmy.userId
        } else {
            return this._isHouseOwner;
        }
    }

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.param = this.params.frameData;
        if (this.param) {
            this._isHouseOwner = this.param.isHouseOwner;
            this.openType = this.param.openType;
        }
        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("teammanager.pve.TeamSortFrame.title");
        // this.itemList.ensureBoundsCorrect();
        for (let i: number = 0; i < 9; i++) {
            if (this._legitPosList.indexOf(i) == -1) {
                continue;
            }
            let item = this.itemList.addItemFromPool() as fgui.GButton

            if (i % 3 == 0) {
                // item.backTxt.setFrame(3);
                item.getChild("title").text = LangManager.Instance.GetTranslation("TeamFormationWnd.title1");
            }
            if (i % 3 == 1) {
                // item.backTxt.setFrame(2);
                item.getChild("title").text = LangManager.Instance.GetTranslation("TeamFormationWnd.title3");
                // item.getChild("title").text = LangManager.Instance.GetTranslation("TeamFormationWnd.title2");
            }
            if (i % 3 == 2) {
                // item.backTxt.setFrame(1);
                item.getChild("title").text = LangManager.Instance.GetTranslation("TeamFormationWnd.title3");
            }

            let itemDrag = item.getChild("itemDrag") as TeamFormationItemDrag
            itemDrag.pos = this._posList[i];
            if (this.isHouseOwner) {
                itemDrag.registerDrag()
            }
            this._itemList.add(itemDrag.pos, itemDrag);
        }
        if (this.openType == 1) {
            this.ctrl.sendRequestTeamPosInSpace();
        }
        else {
            if (this.roomInfo.isCross) {
                this.ctrl.crossSendRequestTeamPos(this.playerInfo.serviceName);
            } else {
                this.ctrl.sendRequestTeamPos();
            }
        }
        NotificationManager.Instance.on(RoomEvent.EDIT_TEAM_FIGHT_POS, this.__editTeamFightPos, this);
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
        NotificationManager.Instance.off(RoomEvent.EDIT_TEAM_FIGHT_POS, this.__editTeamFightPos, this);
    }

    private __updateView(armyFightPosList: ArmyFightPosEditMsg[]) {
        for (let i = 0; i < this._itemList.keys.length; i++) {
            let change = false
            const posIdx = this._itemList.keys[i];
            for (let index = 0; index < armyFightPosList.length; index++) {
                const msg = armyFightPosList[index] as ArmyFightPosEditMsg;
                let armyInfo: CampaignArmy;
                if (this.roomInfo.isCross) {
                    armyInfo = this.roomInfo.getPlayerByUserId(msg.userId, msg.serverName);
                    this._itemList[posIdx].serverName = msg.serverName;
                }
                else {
                    armyInfo = this.roomInfo.getPlayerByUserId(msg.userId);
                }
                if (armyInfo && posIdx == msg.heroPos) {
                    this._itemList[posIdx].hero = armyInfo.baseHero;
                    change = true
                    break;
                }
            }
            if (!change) {
                this._itemList[posIdx].hero = null;
            }
        }
    }

    private __teamInfoUpdateHandler() {
        if (FreedomTeamManager.Instance.hasTeam) {
            this.clean();
            var armyFightPosList: Array<any> = FreedomTeamManager.Instance.model.armyFightPos;
            for (let i: number = 0; i < armyFightPosList.length; i++) {
                var msg: MemberFightPos = armyFightPosList[i];
                var armyInfo: BaseArmy = FreedomTeamManager.Instance.model.getMemberByUserId(msg.memberId);
                if (armyInfo && this._itemList[msg.pos]) {
                    this._itemList[msg.pos].hero = armyInfo.baseHero;
                }
            }
        }
        else {
            this.dispose();
        }
    }

    private clean() {

        this._itemList.forEach((item: TeamFormationItemDrag) => {
            if (item.hero) {
                item.hero = null;
            }
        });
    }

    private __editTeamFightPos() {
        let msgList = new Array();
        this._itemList.forEach((item: TeamFormationItemDrag) => {
            if (item.hero) {
                msgList.push({ userId: item.hero.userId, heroPos: item.pos, serverName: item.serverName });
            }
        });
        if (this.openType == 1) {
            this.ctrl.sendRequestTeamPosInSpace(false, msgList);
        }
        else {
            this.ctrl.sendEditTeamPos(msgList, this.playerInfo.serviceName);
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public get roomInfo() {
        return RoomManager.Instance.roomInfo;
    }

    private get selfArmy(): BaseArmy {
        return ArmyManager.Instance.army;
    }
}