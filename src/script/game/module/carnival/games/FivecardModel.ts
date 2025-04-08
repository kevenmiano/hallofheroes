import { FivecardData } from "./FivecardData";

export class FivecardModel {

    /**当前轮次*/
    public curTurn: number;
    /**当前积分*/
    public score: number;
    /**开牌得到的积分*/
    public addScore: number;
    /**当前卡牌*/
    public pokers: { [key: number]: FivecardData };
    /**本次操作保留的卡索引*/
    public holdList: Array<number>;


    /**更新卡组数据*/
    public updatePokers(arr: Array<any>) {
        this.pokers = {}
        let poke: FivecardData;
        for (let i = 0; i < arr.length; i++) {
            poke = new FivecardData(arr[i]);
            this.pokers[poke.index] = poke;
        }
    }

}