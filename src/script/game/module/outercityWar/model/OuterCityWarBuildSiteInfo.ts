/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 15:04:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-29 12:28:31
 * @Description: 建筑驻防点信息
 * 
操作显示条件：
1、按钮: 防守设置
    显示条件: 非争夺期间(包括保护期、和平期、宣战期、备战期)，守城方公会会长、副会长显示这个操作按钮，争夺期不显示
2、提示文字: 你无法参加城战
    显示条件: (1)未宣战公会，所有玩家 (2)宣战公会，但公会全员被击退的玩家(3)防守公会和宣战公会，不在参战列表中的玩家
3、提示文字: 同公会无法攻击
    显示条件: 该位置防守玩家为同公会玩家
4、按钮
    战斗中：
    占领: 当前没有NPC或玩家占领的驻防点，受是否可攻击该建筑限制(浮动提示: 当前无法攻击这个建筑)
    放弃: 自己占领的驻防点，点击放弃+二次确认 (弹窗提示内容: 确认放弃当前占领点? )
    攻击: 在参战列表中的玩家，且当前无其他状态，受是否可攻击该建筑限制(浮动提示: 当前无法攻击这个建筑)
 */

import Logger from "../../../../core/logger/Logger"
import { EmOuterCityWarBuildSiteOptType, EmOuterCityWarBuildSiteState } from "../../../constant/OuterCityWarDefine"
import { OuterCityWarManager } from "../control/OuterCityWarManager"
import { OuterCityWarBuildInfo } from "./OuterCityWarBuildInfo"
import { OuterCityWarModel } from "./OuterCityWarModel"
import { OuterCityWarPlayerInfo } from "./OuterCityWarPlayerInfo"

export class OuterCityWarBuildSiteInfo {
    /** 占领玩家 */
    public get playerInfo(): OuterCityWarPlayerInfo {
        return this.model.getPlayerInfo(this.occupyUserId, this.occupyHeroType)
    }
    /** 占领玩家id */
    occupyUserId: number = 0;
    /** 占领玩家类型1英雄，2npc */
    occupyHeroType: number = 0;
    /** 占领积分 */
    occupyScore: number = 0;
    /** 建筑驻防点状态  */
    state = EmOuterCityWarBuildSiteState.DEFANCE;
    /** 建筑驻防点排序  */
    orderId = 0;

    buildInfo: OuterCityWarBuildInfo
    constructor(buildInfo: OuterCityWarBuildInfo) {
        this.buildInfo = buildInfo
    }

    // public commit() {
    //     NotificationManager.Instance.dispatchEvent(OuterCityWarEvent.BUILD_SITE_INFO, this)
    // }

    public setOccupy(userId: number, heroType: number) {
        this.occupyUserId = userId
        this.occupyHeroType = heroType
    }

    /** 获取某个玩家对驻防点的可操作类型 
     * uid  只能是玩家ID，不能是怪物ID
    */
    public getOptType(uid: number): EmOuterCityWarBuildSiteOptType {
        let type: EmOuterCityWarBuildSiteOptType
        if (this.model.checkCanSettingDefence(uid)) {
            type = EmOuterCityWarBuildSiteOptType.CAN_SETTING_DEFENCE
        } else if (!this.model.checkJoin(uid) || !this.model.checkInCurCastleJoinBattleList(uid) || this.model.checkPlayerGuildOut(uid) || this.model.checkPlayerOut(uid)) {
            type = EmOuterCityWarBuildSiteOptType.CANNOT_OPT
        }
        else if (this.model.checkFighting(this)) {
            type = EmOuterCityWarBuildSiteOptType.FIGHTING
        }
        else if(this.model.checkCanBeOccupied(uid, this)) {
            type = EmOuterCityWarBuildSiteOptType.CAN_OCCUPY
        }
        else if (this.model.checkSameGuild(uid, this.playerInfo)) {
            type = EmOuterCityWarBuildSiteOptType.CANNOT_ATTACK_SAME_GUILD
        }
        else if (this.model.checkIsDefencePlayer(uid, this.playerInfo)) {
            // Logger.outcityWar("驻防点可操作 放弃", this.orderId, uid, this.playerInfo.userId)
            type = EmOuterCityWarBuildSiteOptType.CAN_GIVEUP
        }
        else if (this.model.checkInCurCastleJoinBattleList(uid)) {
            type = EmOuterCityWarBuildSiteOptType.CAN_ATTACK
        }

        // Logger.outcityWar("设置驻防点可操作类型", this.orderId, type, this.playerInfo && this.playerInfo.userName)
        return type
    }

    public get noOccupyState() {
        return this.state == EmOuterCityWarBuildSiteState.NOCCUPIED;
    }

    public get fightingState() {
        return this.state == EmOuterCityWarBuildSiteState.FIGHTING;
    }

    public get defanceState() {
        return this.state == EmOuterCityWarBuildSiteState.DEFANCE;
    }

    private get model(): OuterCityWarModel {
        return OuterCityWarManager.Instance.model;
    }
}