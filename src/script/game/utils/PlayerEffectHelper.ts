import {PlayerEffectInfo} from "../datas/playerinfo/PlayerEffectInfo";

export class PlayerEffectHelper
{
    public static updatePlayerEffect(index:number, value:number, effInfo:PlayerEffectInfo)
    {
        switch(index)
        {
            case 6: //建筑建造时间加成
                effInfo.buildTimeAdditionRace = value;
                break;
            case 7: //研究科技消耗资源
                effInfo.tecResoueceAdditionRace = value;
                break;
            case 8: //仓库最大容量
                effInfo.storeLimitAdditionRace = value;
                break;
            case 14: //招募消耗资源
                effInfo.recruitPawnResourceAdditionRace = value;
                break;
            case 18: //兵种升级所需战魂
                effInfo.pawnUpgradeSoulAdditionRace = value;
                break;
            case 33: //传送阵能量上限
                effInfo.transferPowerLimitAdditionRace = value;
                break;
            case 34: //传送阵冷却时间
                effInfo.transferCoolTimeAdditionRace = value;
                break;


            case 106: //建筑建造时间加成
                effInfo.buildTimeAddition = value;
                break;
            case 107: //研究科技消耗资源
                effInfo.tecResoueceAddition = value;
                break;
            case 108: //仓库最大容量
                effInfo.storeLimitAddition = value;
                break;
            case 114: //招募消耗资源
                effInfo.recruitPawnResourceAddition = value;
                break;
            case 118: //兵种升级所需战魂
                effInfo.pawnUpgradeSoulAddition = value;
                break;
            case 133: //传送阵能量上限
                effInfo.transferPowerLimitAddition = value;
                break;
            case 134: //传送阵冷却时间
                effInfo.transferCoolTimeAddition = value;
                break;

        }
    }
}