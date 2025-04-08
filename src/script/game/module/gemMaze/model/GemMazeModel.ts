import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { ConfigType } from "../../../constant/ConfigDefine";
import { GemMazeEvent } from "../../../constant/event/NotificationEvent";
import { TempleteManager } from "../../../manager/TempleteManager";
import GemInfoUpdateInfoVO from "./GemInfoUpdateInfoVO";
import GemMazeGemInfoVO from "./GemMazeGemInfoVO";
import GemMazeInfoVO from "./GemMazeInfoVO";
import GemMazeOrderInfo from "./GemMazeOrderInfo";
import GemInfoMsg = com.road.yishi.proto.minigame.GemInfoMsg;
import GemInfoUpdateMsg = com.road.yishi.proto.minigame.GemInfoUpdateMsg;
import GemMazeInfoMsg = com.road.yishi.proto.minigame.GemMazeInfoMsg;

/**
 * 宝石迷阵Model
 */
export default class GemMazeModel extends GameEventDispatcher {

    private _gemMazeInfo: GemMazeInfoVO; //保存宝石迷阵信息, 包括25个宝石信息
    private _gemUpdateArr: any = [];
    // public  invideByPlayerId:number; //邀请协助的好友Id
    // public  invideRemoveGemCount:number; //协助对方移除宝石的数量
    // private  _invideLeftTimes:number; //协助好友剩余次数

    public canMoveGemByUser: boolean = true; //玩家是否可以点击移动宝石(移动后等待服务器通知才可以继续移动)

    private _orderList: Array<GemMazeOrderInfo>;
    public boxTempleteIdArr: any = []; //积分宝箱Id数组		

    // public  invideByFriendIsOpen:boolean = false; //被邀请协助窗口是否打开
    public createDate: Date;
    buySteps: number = 10;
    priceStep: number = 10;
    maxStep: number = 10;
    openDay: Array<string>

    constructor() {
        super();
        this._gemMazeInfo = new GemMazeInfoVO();
        this._orderList = [];

        //一次买多少步数, 一步的价格, 最大步数上限
        let day: string = TempleteManager.Instance.getConfigInfoByConfigName("Gem_Maze_Day").ConfigValue;
        if (day) {
            this.openDay = day.split(',');
        }
        let cfgValue = "";
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Gem_Maze_BuyInfo");
        if (cfgItem) {
            cfgValue = cfgItem.ConfigValue;
        }
        if (cfgValue) {
            let arr: any[] = cfgValue.split(",");
            this.buySteps = arr[0];
            this.priceStep = arr[1];
            this.maxStep = arr[2];
        }

    }


    /**
     * 宝石移动后服务器推送的更新数据
     * @return 
     * 
     */
    public get gemUpdateArr(): Array<any> {
        return this._gemUpdateArr;
    }

    public set gemUpdateArr(value: Array<any>) {
        this._gemUpdateArr = value;
    }

    public get gemMazeInfo(): GemMazeInfoVO {
        return this._gemMazeInfo;
    }

    public set gemMazeInfo(value: GemMazeInfoVO) {
        this._gemMazeInfo = value;
    }

    //获取服务器返回的  GemMazeInfo 后更新 _gemMazeInfo
    public updateGemMazeInfo(info: GemMazeInfoMsg): void {
        this.gemMazeInfo.score = info.score;
        this.gemMazeInfo.sort = info.scoreOrder;
        this.gemMazeInfo.timesLeft = info.timesLeft;
        this.gemMazeInfo.buyTimesLeft = info.buyTimesLeft;
        this.gemMazeInfo.helpTimesLeft = info.helpTimesLeft;
        this.gemMazeInfo.gemLevel = info.gemLevel;
        this.gemMazeInfo.curExp = info.curExp;
        this.gemMazeInfo.maxExp = info.maxExp;
        this.gemMazeInfo.boxMark = info.boxMark;
        this.gemMazeInfo.weekScore = info.weekScore;

        this.gemMazeInfo.gemArr = [];
        for (let i = 0; i < info.allGems.length; i++) {
            let gemInfo: any = info.allGems[i];
            let gemInfoVO: GemMazeGemInfoVO = new GemMazeGemInfoVO();
            gemInfoVO.type = gemInfo.color;
            gemInfoVO.index = gemInfo.mark;
            this.gemMazeInfo.gemArr.push(gemInfoVO);
        }
        this.boxTempleteIdArr = info.boxesId;
    }

    //服务器推送的回合更新数据
    public updateGemUpdateInfo(info: GemInfoUpdateMsg): void {
        let gemInfoUpdate: GemInfoUpdateMsg = info;
        let gemInfoUpdateInfoVO: GemInfoUpdateInfoVO = new GemInfoUpdateInfoVO();
        gemInfoUpdateInfoVO.scoreAdd = gemInfoUpdate.score;
        gemInfoUpdateInfoVO.curExp = gemInfoUpdate.curExp;
        gemInfoUpdateInfoVO.maxExp = gemInfoUpdate.maxExp;
        gemInfoUpdateInfoVO.addIntergal = info.score;
        for (let i: number = 0; i < gemInfoUpdate.score.length; i++) {
            this._gemMazeInfo.score += gemInfoUpdate.score[i];
        }

        this._gemMazeInfo.curExp = gemInfoUpdate.curExp;
        this._gemMazeInfo.maxExp = gemInfoUpdate.maxExp;
        this._gemMazeInfo.gemLevel = gemInfoUpdate.gemLevel;
        gemInfoUpdateInfoVO.rewardInfo.rewardIdArr = gemInfoUpdate.rewardInfo;

        let gemInfo: any;
        let gemInfoVO: GemMazeGemInfoVO;
        for (let j: number = 0; j < gemInfoUpdate.gemAdd.length; j++) {
            gemInfo = gemInfoUpdate.gemAdd[j];
            gemInfoVO = new GemMazeGemInfoVO();
            gemInfoVO.type = gemInfo.color;
            gemInfoVO.index = gemInfo.mark;
            gemInfoUpdateInfoVO.gemAddArr.push(gemInfoVO);
        }
        for (let k = 0; k < gemInfoUpdate.gemDel.length; k++) {
            gemInfo = gemInfoUpdate.gemDel[k];
            gemInfoVO = new GemMazeGemInfoVO();
            gemInfoVO.type = gemInfo.color;
            gemInfoVO.index = gemInfo.mark;
            gemInfoUpdateInfoVO.gemDelArr.push(gemInfoVO);
        }

        this.gemUpdateArr.push(gemInfoUpdateInfoVO);
    }

    /**
     *更新单条更新宝石数据 
    */
    public updateSignUpdateData(): GemInfoUpdateInfoVO {
        if (this.gemUpdateArr.length == 0) return null;
        let gemInfoUpdateInfoVO: GemInfoUpdateInfoVO = this.gemUpdateArr[0];
        this.gemMazeInfo.curExp = gemInfoUpdateInfoVO.curExp;
        this.gemMazeInfo.maxExp = gemInfoUpdateInfoVO.maxExp;
        this.gemUpdateArr.splice(0, 1);
        return gemInfoUpdateInfoVO;
    }

    public setAllGemStatus(): void {
        for (let i = 0; i < this.gemMazeInfo.gemArr.length; i++) {
            this.gemMazeInfo.gemArr[i].isMove = this.gemMazeInfo.gemArr[i].isRemove = this.gemMazeInfo.gemArr[i].isAdd = false;
            this.gemMazeInfo.gemArr[i].nextIndex = 0;
        }
    }

    /**
     * 关闭界面后重置
     */
    reset() {
        this.gemUpdateArr.length = 0;
        this.gemMazeInfo.gemArr.length = 0;
        this.gemMazeInfo = null;
    }

    /**
    * 更新所有的更新宝石数据 
    */
    public updateAllUpdateData(): void {
        this._gemMazeInfo = new GemMazeInfoVO();
        this.canMoveGemByUser = true;
    }

    // public get invideLeftTimes():number
    // {
    //     return this._invideLeftTimes;
    // }

    // public set invideLeftTimes(value:number)
    // {
    //     this._invideLeftTimes = value;
    //     if(this._invideLeftTimes <= 0)
    //     {
    //         this._invideLeftTimes = 0;
    //     }
    // }
    public get orderList(): Array<GemMazeOrderInfo> {
        return this._orderList;
    }

    /**
     *更新排行榜数据 
        */
    public updateOrderList(): void {
        this.dispatchEvent(GemMazeEvent.ORDERDATA_LOAD_COMPLETE);
    }


}