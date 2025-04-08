import { EmWindow } from "../../../../constant/UIDefine";
import FUIHelper from "../../../../utils/FUIHelper";
import MemoryCardData from "./MemoryCardData";

/**
 * 记忆翻牌 
 */
export default class MemoryCardModel {
    /**操作  // 1:开始游戏  2:翻牌 3:自动翻牌 4:揭牌  5:关闭界面*/
    public op: number = 0;
    public curTurn: number = 0;
    public score: number = 0;
    /**翻一次牌得到的积分积分*/
    public addScore: number = 0;
    /**连续翻同一种牌得到的积分*/
    public addScore2: number = 0;
    /**[自动]翻的第一张牌*/
    public cIndex1: number = 0;
    /**[自动]翻的第二张牌*/
    public cIndex2: number = 0;
    /**翻牌或自动翻牌结果*/
    public result: boolean = false;
    /**剩余自动翻牌次数*/
    public leftAutoChance: number = 0;
    /**剩余揭牌次数*/
    public leftCheckChance: number = 0;
    /**游戏总时长*/
    public duration: number = 0;
    /**卡牌*/
    public cards: Map<number, MemoryCardData> = new Map();

    /**记录每次主动操作开启的卡牌*/
    public openCardIdxs: Array<number> = [];

    /**用来做揭牌展示的卡组*/
    public cardShow: Map<number, MemoryCardData> = new Map();

    public getCardIcon(iconIndex: number): string {
        return FUIHelper.getItemURL(EmWindow.Carnival, "asset.AirGardenGame.icon" + iconIndex)
    }

    public clear() {
        this.openCardIdxs = [];
        this.cards.clear();
        this.cardShow.clear();
    }
}