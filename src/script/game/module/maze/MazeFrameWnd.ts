// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-07-31 09:57:52
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-03-06 15:13:11
 * @Description: 
 */
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from '../../../core/ui/UIButton';
import { TowerInfo } from "../../datas/playerinfo/TowerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import UIManager from '../../../core/ui/UIManager';
import Utils from "../../../core/utils/Utils";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import MazeItem from "./com/MazeItem";

import TowerInfoMsg = com.road.yishi.proto.campaign.TowerInfoMsg;
import { EmMazeType } from "./MazeModel";
export default class MazeFrameWnd extends BaseWindow {
    protected setScenterValue = true; 
    private mazeItem:MazeItem
    private maze2Item:MazeItem

    private Btn_Order: UIButton;//排行榜
    private Btn_Shop: UIButton;//商店

    OnShowWind() {
        super.OnShowWind();
        this.initView();
        this.addEvent();
        this.reqData();
    }

    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

    private initView() {
        Utils.setDrawCallOptimize(this);
        this.mazeItem.type = EmMazeType.GroundMaze;
        this.maze2Item.type = EmMazeType.AbyssMaze;
    }

    private reqData() {
        SocketSendManager.Instance.requestTowerInfo(EmMazeType.GroundMaze);
        SocketSendManager.Instance.requestTowerInfo(EmMazeType.AbyssMaze);
    }

    private addEvent() {
        this.Btn_Order.onClick(this, this.__openOrderHandler.bind(this));
        this.Btn_Shop.onClick(this, this.__onShopClick.bind(this));
        PlayerManager.Instance.addEventListener(PlayerEvent.UPDATE_TOWER_INFO, this.__updateTowerInfoHandler, this);
    }

    private removeEvent() {
        this.Btn_Order.offClick(this, this.__openOrderHandler.bind(this));
        this.Btn_Shop.onClick(this, this.__onShopClick.bind(this));
        PlayerManager.Instance.removeEventListener(PlayerEvent.UPDATE_TOWER_INFO, this.__updateTowerInfoHandler, this);
    }

    private __openOrderHandler() {
        UIManager.Instance.ShowWind(EmWindow.MazeRankWnd);
    }

    private __onShopClick() {
        FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 3, returnToWin: EmWindow.MazeFrameWnd }, null, EmWindow.MazeFrameWnd);
    }

    private __updateTowerInfoHandler(msg: TowerInfoMsg) {
        if (WorldBossHelper.checkMaze(msg.campaignId)) {
            this.mazeItem.vdata = this.towerInfo1
        } else if (WorldBossHelper.checkMaze2(msg.campaignId)) {
            this.maze2Item.vdata = this.towerInfo2
        }
    }

    private get towerInfo1(): TowerInfo {
        return PlayerManager.Instance.currentPlayerModel.towerInfo1;
    }
    
    private get towerInfo2(): TowerInfo {
        return PlayerManager.Instance.currentPlayerModel.towerInfo2;
    }
}