import ConfigInfosTempInfo from "../../datas/ConfigInfosTempInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * 英灵岛BOSS数据
 */
export default class PetBossModel {
    public isOpen: boolean;// 是否开启
    public mapId: number;//地图ID
    public nodeId: number = 0;//寻路用
    public heroId: number;
    public leftTime: number;
    //数组存储各种次数, 方便界面使用[中级次数, 高级次数, boss次数]
    public countArr: Array<number> = [0, 0, 0];
    public maxCountArr: Array<string> = ["20", "10", "1"];

    public currentRagePoint: number;			//当前怒气值
    public maxRagePoint: number = 100;				//最大怒气值

    public openTimeArr: Array<string> = [];			//开放时间数组

    private configCountInfo: ConfigInfosTempInfo;
    private ragePointInfo: ConfigInfosTempInfo;
    private openTimeInfo: ConfigInfosTempInfo;

    constructor() {
        this.configCountInfo = TempleteManager.Instance.getConfigInfoByConfigName("pet_island_defend_reward_count");
        this.ragePointInfo = TempleteManager.Instance.getConfigInfoByConfigName("pet_island_defend_boss_rage");
        this.openTimeInfo = TempleteManager.Instance.getConfigInfoByConfigName("pet_island_defend_hour");
        if (this.configCountInfo) this.maxCountArr = this.configCountInfo.ConfigValue.split(",");
        if (this.ragePointInfo) this.maxRagePoint = parseInt(this.ragePointInfo.ConfigValue);
        if (this.openTimeInfo) this.openTimeArr = this.openTimeInfo.ConfigValue.split(",");
    }

    public get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    public getNearlyOpenTimeSecond(): number {
        let currentHour: number = this.playerModel.sysCurtime.getHours();
        let currentTime: number = this.playerModel.sysCurTimeBySecond;
        let index: number = 0;
        let nearlyHour: number;
        let intervalTime: number;
        let curToday: number;
        if (this.openTimeArr) {
            let len: number = this.openTimeArr.length;
            for (let i: number = 0; i < len; i++) {
                if (currentHour >= parseInt(this.openTimeArr[i])) {
                    continue;
                } else {
                    index = i;
                    break;
                }
            }
            nearlyHour = parseInt(this.openTimeArr[index]);
        }
        if (currentHour >= parseInt(this.openTimeArr[this.openTimeArr.length - 1])) {
            curToday = this.playerModel.sysCurtime.getDate() + 1;
        }
        else {
            curToday = this.playerModel.sysCurtime.getDate();
        }
        let todayDate: Date = new Date(this.playerModel.sysCurtime.getFullYear(), this.playerModel.sysCurtime.getMonth(), curToday, nearlyHour);
        intervalTime = todayDate.getTime() / 1000 - currentTime;
        return intervalTime;
    }



    public getNextOpenTime() {
        if (!this.openTimeArr) {
            return null;
        }
        let currentHour: number = this.playerModel.sysCurtime.getHours();
        for (let h of this.openTimeArr) {
            if (currentHour >= +h) {
                continue
            } else {
                return h;
            }
        }
        return null;
    }

}