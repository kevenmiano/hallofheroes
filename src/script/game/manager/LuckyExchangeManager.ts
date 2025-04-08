// @ts-nocheck
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { NotificationManager } from "./NotificationManager";
import { PlayerManager } from "./PlayerManager";
import LuckExchangeInfoListMsg = com.road.yishi.proto.active.LuckExchangeInfoListMsg;
import LuckExchangeOpMsg = com.road.yishi.proto.active.LuckExchangeOpMsg;
import LuckExchangeTempListMsg = com.road.yishi.proto.active.LuckExchangeTempListMsg;
import LuckExchangeTempMsg = com.road.yishi.proto.active.LuckExchangeTempMsg;
import LuckExchangeItemTempMsg = com.road.yishi.proto.active.LuckExchangeItemTempMsg;
export default class LuckyExchangeManager {
    private static _instance: LuckyExchangeManager;
    private _tempList: LuckExchangeTempListMsg;
    private _dataList: LuckExchangeInfoListMsg;
    public static  SURE:number = 1;
    public static  PERCENT:number = 3;
    public static  RANDOM:number = 4;
    public idMap:Map<string,boolean>;//记录按钮的点击状态
    public needSpecialTxt:boolean = false;//类型等于4的掉落类型的标题需要特殊显示
    public static get Instance(): LuckyExchangeManager {
        if (!this._instance) this._instance = new LuckyExchangeManager();
        return this._instance;
    }

    public setup() {
        this.initEvent();
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_LUCK_EXCHANGE_TEMP_MSG, this, this.__luckyTempHandler);
        ServerDataManager.listen(S2CProtocol.U_C_LUCK_EXCHANGE_DATA_MSG, this, this.__luckyDataHandler);
    }

    private __luckyTempHandler(pkg: PackageIn) {
        let msg: LuckExchangeTempListMsg = pkg.readBody(LuckExchangeTempListMsg) as LuckExchangeTempListMsg;
        this._tempList = msg;
        this.idMap = new Map();
        let arr: Array<LuckExchangeTempMsg> = this.showData;
        for(let i:number = 0;i<arr.length;i++){
            this.idMap.set(arr[i].id,true);
        }
        NotificationManager.Instance.dispatchEvent(NotificationEvent.LUCKY_TEMP_CHANGE);
    }

    private __luckyDataHandler(pkg: PackageIn) {
        let msg: LuckExchangeInfoListMsg = pkg.readBody(LuckExchangeInfoListMsg) as LuckExchangeInfoListMsg;
        this._dataList = msg;
        NotificationManager.Instance.dispatchEvent(NotificationEvent.LUCKY_INFO_CHANGE);
    }

    public get showData(): Array<LuckExchangeTempMsg> {
        var _showData: Array<LuckExchangeTempMsg> = [];
        var startTime: Date;
        var endTime: Date;
        var remainTime: number;
        var tempArr: Array<LuckExchangeTempMsg> = LuckyExchangeManager.Instance.tempList;
        for (var i: number = 0; i < tempArr.length; i++) {
            startTime = DateFormatter.parse(tempArr[i].startTime, "YYYY-MM-DD hh:mm:ss");
            remainTime = startTime.getTime() / 1000 - PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
            if (remainTime > 0) continue;
            endTime = DateFormatter.parse(tempArr[i].endTime, "YYYY-MM-DD hh:mm:ss");
            remainTime = endTime.getTime() / 1000 - PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
            if (remainTime < 0) continue;
            _showData.push(tempArr[i]);
        }
        
        return _showData;
    }

    public get tempList(): Array<any> {
        if (this._tempList) {
            return this._tempList.luckExchange;
        }
        else {
            return [];
        }
    }

    public getGoodsByRare(temp: LuckExchangeTempMsg): Array<LuckExchangeItemTempMsg> {
        var arr: Array<LuckExchangeItemTempMsg> = [];
        for (var i: number = 0; i < temp.dropItems.length; i++) {
            if (temp.dropItems[i].rare) {
                arr.push(temp.dropItems[i] as LuckExchangeItemTempMsg);
            }
        }
        return arr;
    }

    public getGoodsByDropType(temp: LuckExchangeTempMsg, type: number): Array<LuckExchangeItemTempMsg> {
        var arr: Array<any> = [];
        for (var i: number = 0; i < temp.dropItems.length; i++) {
            if (temp.dropItems[i].dropType == type) {
                arr.push(temp.dropItems[i]);
            }
        }
        return arr;
    }

    public getLuckyValueById(id: string): number {
        for (var i: number = 0; i < this._dataList.luckExchangeInfo.length; i++) {
            if (this._dataList.luckExchangeInfo[i].exchangeId == id) {
                return this._dataList.luckExchangeInfo[i].currentLuckValue;
            }
        }
        return 0;
    }

    public set getLuckExchangeInfoListMsg(value: LuckExchangeInfoListMsg) {
        this._dataList = value;
    }

    public OperateLuckyExchange(id: string, count: number = 0) {
        var msg: LuckExchangeOpMsg = new LuckExchangeOpMsg();
        msg.exchangeId = id;
        msg.exchangeCount = count;
        SocketManager.Instance.send(C2SProtocol.C_LUCK_EXCHANGE, msg);
    }
}