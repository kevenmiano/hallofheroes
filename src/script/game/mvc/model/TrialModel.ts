import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import { TrailPropInfo } from '../../datas/TrailPropInfo';
/**
* @author:shujin.ou
* @email:1009865728@qq.com
* @data: 2020-12-02 20:22
*/
export default class TrialModel extends GameEventDispatcher {

    constructor() {
        super();
    }

    public shopList: Array<TrailPropInfo> = [];
    public currentLayer: number = 0;
    public rewardExp: number = 0;
    public rewardBox: number = 0;
    public TrialModel() {
    }

    public addShopItem(value: TrailPropInfo) {
        this.shopList.push(value);
    }

    public getShopItemByIndex(itemIndex: number): TrailPropInfo {
        for (let index = 0; index < this.shopList.length; index++) {
            let item = this.shopList[index];
            if (item.index == itemIndex) return item;
        }
        return null;
    }

}