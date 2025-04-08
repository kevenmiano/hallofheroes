// @ts-nocheck
import Dictionary from "../../../core/utils/Dictionary";

/**
 * 外城某一个金矿节点的二级节点数据
 */
export default class OutCityMineNode{
    public posId:number = 0;//地图显示节点
    public nodeId:number = 0;//节点id mapmine id
    public occupyNum:number = 0;//自己在当前节点占领数量
    public allOccupyNum = 0//该节点已被占领的数量
    public sonNodeTotalNum:number = 0;//总节点数量
    public posX:number = 0;
    public posY:number = 0;
    public nodeAllMineInfoDic:Dictionary;//该节点所有的金矿信息
}