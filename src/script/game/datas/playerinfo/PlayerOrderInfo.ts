// @ts-nocheck
import LangManager from "../../../core/lang/LangManager";

export class PlayerOrderInfo {
    /**
     * this.userId
     */
    public userId: number = 0;

    /**
     * this.gpOrder
     */
    public gpOrder: number = 0;

    /**
     * this.lastDayDate
     */
    public lastDayDate: Date = new Date();

    /**
     * this.lastDayGP
     */
    public lastDayGP: number = 0;

    /**
     * this.gpDayOrder
     */
    public gpDayOrder: number = 0;

    /**
     * this.lastWeekGP
     */
    public lastWeekGP: number = 0;

    /**
     * this.lastWeekDate
     */
    public lastWeekDate: Date = new Date();

    /**
     * this.gpWeekOrder
     */
    public gpWeekOrder: number = 0;

    /**
     * this.lastMonthGP
     */
    public lastMonthGP: number = 0;

    /**
     * this.lastMonthDate
     */
    public lastMonthDate: Date = new Date();

    /**
     * this.gpMonthOrder
     */
    public gpMonthOrder: number = 0;
    public fightCapacityOrder: number = 0;
    public honourOrder: number = 0;
    public charmsOrder: number = 0;
    public charmsDayOrder: number = 0;
    public charmsWeekOrder: number = 0;
    public soulScoreOrder: number = 0;
    /**
     * 跨服积分
     */
    public crossScore: number = 0;
    public static NEW_PLAYER_ORDER: number = 15000;//排名在15000及以上的玩家为新手

    constructor() {
    }

    public getGpOrder(): string {
        if (this.gpOrder == 0) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else if (this.gpOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.gpOrder.toString();
        }
    }

    public getGpDayOrder(): string {
        if (this.gpDayOrder == 0) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else if (this.gpDayOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.gpDayOrder.toString();
        }
    }

    public getGpWeekOrder(): string {
        if (this.gpWeekOrder == 0) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else if (this.gpWeekOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.gpWeekOrder.toString();
        }
    }

    public getFightCapacityOrder(): string {
        if (this.fightCapacityOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.fightCapacityOrder.toString();
        }
    }

    public getHonourOrder(): string {
        if (this.honourOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.honourOrder.toString();
        }
    }

    public getCharmsOrder(): string {
        if (this.charmsOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.charmsOrder.toString();
        }
    }

    public getCharmsDayOrder(): string {
        if (this.charmsDayOrder == 0 || this.charmsDayOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.charmsDayOrder.toString();
        }
    }

    public getCharmsWeekOrder(): string {
        if (this.charmsWeekOrder == 0 || this.charmsWeekOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.charmsWeekOrder.toString();
        }
    }

    public getSoulScoreOrder(): string {
        if (this.soulScoreOrder >= PlayerOrderInfo.NEW_PLAYER_ORDER) {
            return LangManager.Instance.GetTranslation("colosseum.view.ColosseumPlayerItem.newPeople");
        }
        else {
            return this.soulScoreOrder.toString();
        }
    }
}