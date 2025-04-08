/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 17:03:13
 * @LastEditTime: 2024-02-02 14:39:59
 * @LastEditors: jeremy.xu
 * @Description:  战斗UI控制器
 */

import { SocketManager } from "../../../core/net/SocketManager";
import { PlayerManager } from "../../manager/PlayerManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import { C2SProtocol } from '../../constant/protocol/C2SProtocol';

import AttackModeMsg = com.road.yishi.proto.battle.AttackModeMsg;
import BattleReqMsg = com.road.yishi.proto.battle.BattleReqMsg;
import QteMsg = com.road.yishi.proto.battle.QteMsg;

export default class BattleCtrl extends FrameCtrlBase {
    show() {
        super.show()

    }

    hide() {
        super.hide()
    }

    /**
     * 发送使用qte技能协议 
     * @param battleId 战斗在内存中的id/BattleManager.getInstance().battleModel.battleId
     */
    public static sendQTE(battleId: string): void {
        var msg: QteMsg = new QteMsg();
        msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
        msg.battleId = battleId;
        SocketManager.Instance.send(C2SProtocol.U_B_QTE, msg);
    }
    /**
     * 发送攻击模式设置协议 
     * @param battleId  战斗Id BattleManager.getInstance().battleModel.battleId
     * @param mode  模式（0: 正常模式, 1: 防御模式, 2: 攻击模式）
     */
    public static sendFightMode(battleId: string, mode: number): void {
        var msg: AttackModeMsg = new AttackModeMsg();
        msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
        msg.battleId = battleId;
        msg.mode = mode;
        SocketManager.Instance.send(C2SProtocol.U_B_FIGHT_MODE, msg);
    }

    /**
     * 英灵挑战, 英灵远征, 立即结束战斗 
     * @param battleId 战斗id
     */
    public static sendEndBattle(battleId: string): void {
        var msg: BattleReqMsg = new BattleReqMsg();
        msg.battleId = battleId;
        SocketManager.Instance.send(C2SProtocol.C_PET_CHALLENGE_END_BATTLE, msg);
    }

}