import {t_s_mapData} from "../../config/t_s_map";

/**
 *  初始化地图用到的数据
 *  在SceneManager中setScene中有用
 *  @author yuanzhan.yu
 */
export class MapInitData
{
    constructor()
    {
    }

    public targetPoint:Laya.Point;
    public mapTempInfo:t_s_mapData;
    public showMapName:boolean = true;
    public isShowLoading: boolean = false;
    public isOpenColosseum: boolean = false;
    public isOpenOutCityWar: boolean = false;

}