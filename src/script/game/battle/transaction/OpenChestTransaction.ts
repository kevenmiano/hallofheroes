// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-15 20:40:35
 * @LastEditTime: 2023-09-22 16:55:33
 * @LastEditors: jeremy.xu
 * @Description: 翻牌事务 战役翻牌 和 挑战翻牌用的是同一个  
 * 2.1 去掉挑战翻牌
 */
import { PackageIn } from "../../../core/net/PackageIn";
import { BattleType } from "../../constant/BattleDefine";
import { S2CProtocol } from '../../constant/protocol/S2CProtocol';
import { EmWindow } from "../../constant/UIDefine";
import { BaseManager } from '../../manager/BaseManager';
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { TransactionBase } from "./TransactionBase";

import CampaignCardsMsg = com.road.yishi.proto.item.CampaignCardsMsg;
export class OpenChestTransaction extends TransactionBase {
    private _msg: CampaignCardsMsg;
    constructor() {
        super();
    }
    public handlePackage() {
        this._msg = this.pkg.readBody(CampaignCardsMsg) as CampaignCardsMsg;
        let bModel: BattleModel = BattleManager.Instance.battleModel;
        let curBattleType: number = (bModel ? bModel.battleType : -1);
        if (BaseManager.Instance.isSelect) {
            this.gotoChest();
        } else {
            this.showCardView(curBattleType);
        }
    }

    get pkg(): PackageIn {
        return this._pkg;
    }

    /**
     * 显示翻牌 
     * @param curBattleType 战役翻牌 和 挑战翻牌
     */
    private showCardView(curBattleType: number) {
        let curScene = SceneManager.Instance.currentType;
        if (curScene == SceneType.BATTLE_SCENE && curBattleType == BattleType.BATTLE_CHALLENGE) {
            // let frameData = {msg:this._msg, showWash:true}
            // FrameCtrlManager.Instance.open(EmWindow.ChestFrame, frameData)
        } else if (curScene == SceneType.CAMPAIGN_MAP_SCENE) {
            let frameData = { msg: this._msg }
            FrameCtrlManager.Instance.open(EmWindow.ChestFrame, frameData)
        }
        this._msg = null;
    }

    public getCode(): number {
        return S2CProtocol.U_C_CAMPAIGN_CARDS;
    }

    /**
     * 回到内城 
     * 
     */
    private gotoChest() {
        let curScene: string = SceneManager.Instance.currentType;
        let bModel: BattleModel = BattleManager.Instance.battleModel;
        let curBattleType: number = (bModel ? bModel.battleType : -1);
        if (curScene == SceneType.CAMPAIGN_MAP_SCENE) {
            CampaignSocketOutManager.Instance.sendCampaignFinish(1);
        }
        else if (curScene == SceneType.BATTLE_SCENE && curBattleType == BattleType.BATTLE_CHALLENGE) {
            // SwitchPageHelp.returnToSpace(null, false, true);
            BattleManager.preScene = "";
        }
        else if (bModel && bModel.battleType == BattleType.CAMPAIGN_BATTLE) {
            CampaignSocketOutManager.Instance.sendCampaignFinish(1);
        }
    }
}