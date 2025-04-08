// @ts-nocheck
import FrameDataBase from "../../../mvc/FrameDataBase";
import {Enum_BagState} from "./Enum_BagState";
import {BagSortType} from "../../../constant/BagDefine";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/2/23 18:05
 * @ver 1.0
 *
 */
export class BagModel extends FrameDataBase
{
    public static bag_state:number = Enum_BagState.Default;
    public static lastBagSortType:number = BagSortType.Default;
    public static MaxGridNum:number = 999;

    constructor()
    {
        super();
    }
}