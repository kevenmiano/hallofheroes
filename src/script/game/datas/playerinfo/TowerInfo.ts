// @ts-nocheck
/**
 * 玩家地下迷宫数据
 *
 */
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { PlayerEvent } from "../../constant/event/PlayerEvent";

export class TowerInfo extends GameEventDispatcher {
    public campaignId: number = 0;//当前副本的id
    public enterCount: number = 0;// 当前进入次数
    public maxIndex: number = 0;// 我的最高层（进入该层可能还未打过）
    public order: number = 0;// 我的排名
    public totalGp: number = 0;// 累计经验
    public towerIndex: number = 0;// 当前层次
    public itemTempIds: string;
    public maxEnterCount: number = 0;//最大进入次数
    public freeEnterCount: number = 0;//免费进入次数
    public index: number = 0;
    public firstBloodId: number = 0;
    public firstBloodName: string;
    public towerPassIndex = 0;//通关层次
    public pass = 0;//是否已通关

    constructor() {
        super();
    }

    public commit() {
        this.dispatchEvent(PlayerEvent.UPDATE_TOWER_INFO, null);
    }
}