import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";

export default class WarlordsRewardInfo
{
    public picUrl:string = ""
    public goodsInfo:GoodsInfo;
    public nameStr:string = "";
    public type:number = 0;//1时效坐骑、2物品、3绚丽称号、4战神神像
    public tipData:any;
}