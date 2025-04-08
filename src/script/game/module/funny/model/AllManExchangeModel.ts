// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { TempleteManager } from "../../../manager/TempleteManager";
import AllExchangeMsg = com.road.yishi.proto.active.AllExchangeMsg;
import AllExchangeItemInfoMsg = com.road.yishi.proto.active.AllExchangeItemInfoMsg;
/**
 * 全民兑换
 */
export default class AllManExchangeModel {
    public id: string;
    public begin: string;
    public end: string;
    public isopen: boolean = false;
    private _allPoint: number = 0;//全服积分;
    public boxChangeCount: string[];//分别可兑换次数;  				后面的10  0,0,0
    public allChangeCount: number;//总共兑换次数; 						上面的后面的100
    public changeItemCount: number;//总已兑换次数 ; 						上面的后面的100
    public changeNeedPoint: string[];//总共兑换次数;					后面的20 0,0,0
    public point: string[];//当前积分;									上面12	0,0,0
    public exchangeCount: string[];//每日兑换次数;						前面的10  0,0,0
    public totalExchangeCount: string;//总兑换次数;					没用的
    public allPointAward: string[];//全服奖励;							100,200,300,400,500
    public serverAwardState: string[];//全服奖励领取状态;

    public boxAward: any;//宝箱奖励;
    public serverAward: any;//服务器奖励;	
    public changeItem: number;//兑换用道具Id;

    constructor() {

    }

    public update(msg: AllExchangeMsg): void {
        this.id = msg.id;
        this.begin = msg.begin;
        this.end = msg.end;

        if (this.isopen != msg.isopen) {
            //有变化则派发
            this.isopen = msg.isopen;
            // TopToolsBar.instance.allManExchangeState = msg.isopen ? 1:0;
        }

        this.allPoint = msg.allPoint;
        this.boxChangeCount = msg.boxChangeCount.split(",");
        this.allChangeCount = msg.allChangeCount;
        this.point = msg.point.split(",");
        this.exchangeCount = msg.exchangeCount.split(",");
        this.totalExchangeCount = msg.totalExchangeCount;
        this.allPointAward = msg.allPointAward.split(",");
        this.boxAward = msg.boxAward;
        this.serverAward = msg.serverAward;
        this.changeItem = msg.changeItem;
        this.changeNeedPoint = msg.changeNeedPoint.split(",");
        this.serverAwardState = msg.serverAwardState.split(",");
        this.changeItemCount = msg.changeItemCount;
    }

    /**
     * 首句: 开启后
        类型1: 必定获得以下道具: 
        类型4: 随机获得以下道具之一: 
        类型3: 且可能额外获得以下道具: 
     * @param index 
     * @returns 
     */
    public getBigBoxTip(index: number): string {
        var tempMsg: AllExchangeItemInfoMsg;
        var str1: string = "";
        var str2: string = "";
        var str3: string = "";
        var itemTemp: t_s_itemtemplateData;
        for (var i: number = 0; i < this.boxAward.length; i++) {
            tempMsg = this.boxAward[i] as AllExchangeItemInfoMsg;
            if (tempMsg.index == index) {
                itemTemp = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tempMsg.itemId);
                if (tempMsg.randomType == 1) {
                    //必定获得
                    if (str1 == "") {
                        str1 += LangManager.Instance.GetTranslation("allmainexchange.str13") + "<br>";
                    }
                    str1 += itemTemp.TemplateNameLang + " x " + tempMsg.itemCount + "<br>";
                } else if (tempMsg.randomType == 4) {
                    //随机获得以下道具之一: 
                    if (str2 == "") {
                        str2 += LangManager.Instance.GetTranslation("allmainexchange.str19") + "<br>";
                    }
                    str2 += itemTemp.TemplateNameLang + " x " + tempMsg.itemCount + "<br>";
                } else {
                    //且可能额外获得以下道具: 
                    if (str3 == "") {
                        str3 += LangManager.Instance.GetTranslation("allmainexchange.str20") + "<br>";
                    }
                    str3 += itemTemp.TemplateNameLang + " x " + tempMsg.itemCount + "<br>";
                }
            }
        }
        return LangManager.Instance.GetTranslation("allmainexchange.str18") + "<br>" + str1 + str2 + str3;
    }

    public getSmallBoxTip(index: number): string {
        var tempMsg: AllExchangeItemInfoMsg;
        var str1: string = "";
        var itemTemp: t_s_itemtemplateData;
        for (var i: number = 0; i < this.serverAward.length; i++) {
            tempMsg = this.serverAward[i] as AllExchangeItemInfoMsg;
            if (tempMsg.index == index) {
                itemTemp = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tempMsg.itemId);
                str1 += itemTemp.TemplateNameLang + " x" + tempMsg.itemCount + "<br>";
            }
        }
        return str1;
    }

    /**
     * 是否可以领奖
     * @returns 
     */
    checkHasReward(): boolean {
        for (let i = 0; i < this.point.length; i++) {
            if (this.point[i] >= this.changeNeedPoint[i]) {
                return true;
            }

        }
        for (let j = 0; j < this.allPointAward.length; j++) {
            if (this._allPoint >= Number(this.allPointAward[j])) {
                if (Number(this.serverAwardState[j]) == 1) {

                } else {
                    return true;
                }
            }
        }
        return false;
    }

    public set allPoint(value: number) {
        this._allPoint = value;
    }

    public get allPoint(): number {
        let count = this.allPointAward.length;
        let maxPoint = this._allPoint;
        if (count > 0) {
            let tempPoint = Number(this.allPointAward[count - 1]);
            maxPoint = maxPoint >= tempPoint ? tempPoint : maxPoint;
        }
        return maxPoint;
    }

}