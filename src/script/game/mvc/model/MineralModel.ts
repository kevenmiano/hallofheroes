import GameEventDispatcher from '../../../core/event/GameEventDispatcher';
import Dictionary from '../../../core/utils/Dictionary';
import { CampaignEvent } from '../../constant/event/NotificationEvent';
import { PlayerInfo } from '../../datas/playerinfo/PlayerInfo';
import { PlayerManager } from '../../manager/PlayerManager';
import { CampaignArmy } from '../../map/campaign/data/CampaignArmy';
import { MineralCarInfo } from '../../map/campaign/data/MineralCarInfo';
/**
* @author:shujin.ou
* @email:1009865728@qq.com
* @data: 2020-12-02 20:23
*/
export default class MineralModel extends GameEventDispatcher {

    public activeTime: number = 0;
    /**
     * 可领车次数, 从服务器接收 
     */
    public maxCount: number = 0;
    /**
     * 活动时间的收益倍数 , 从服务器接收
     */
    public multiple: number = 0;
    private _carInfos: Dictionary;
    constructor() {
        super();
        this._carInfos = new Dictionary();
    }
    /**
     * 矿车信息列表 
     */
    public get carInfos(): Dictionary {
        return this._carInfos;
    }

    public resetCarInfos() {
        for (const key in this._carInfos) {
            if (Object.prototype.hasOwnProperty.call(this._carInfos, key)) {
                var mcar: MineralCarInfo = this._carInfos[key];
                mcar.isUpdate = false;
            }
        }
    }

    /**
     * 加入矿车信息 
     * @return 
     */
    public addCarInfo(mcar: MineralCarInfo) {
        this._carInfos[mcar.ownerId] = mcar;
    }

    public getCarInfoById(uId: number): MineralCarInfo {
        return this._carInfos[uId] as MineralCarInfo;
    }

    /**
     * 自身矿车信息 
     * @return 
     */
    public get selfCarInfo(): MineralCarInfo {
        return this.carInfos[this.playerInfo.userId];
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    public updateCar(army: CampaignArmy) {
        this.dispatchEvent(CampaignEvent.UPDATE_MINERAL_CAR, army);
    }

    public commit() {
        for (const key in this._carInfos) {
            if (Object.prototype.hasOwnProperty.call(this._carInfos, key)) {
                var mcar: MineralCarInfo = this._carInfos[key];
                if (!mcar.isUpdate) delete this._carInfos[mcar.ownerId];
            }
        }
        this.dispatchEvent(CampaignEvent.UPDATE_MINERAL_INFO, null);
    }
}