import {SocketManager} from "../../core/net/SocketManager";
import {C2SProtocol} from "../constant/protocol/C2SProtocol";
import BuildingOptionReqMsg = com.road.yishi.proto.building.BuildingOptionReqMsg;
import BuildingReqMsg = com.road.yishi.proto.building.BuildingReqMsg;
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;

/**
 *建筑物的相关操作及信息与服务器的交互
 * @author
 *
 */
export class BuildingSocketOutManager
{
    constructor()
    {
    }

    /**
     *激活神学院的一个新科技
     * @param sontype 科技类型
     *
     */
    public static sendCreateBuild(sontype:number)
    {
        let msg:BuildingOptionReqMsg = new BuildingOptionReqMsg();
        msg.sonType = sontype
        SocketManager.Instance.send(C2SProtocol.C_BUILDING_CREATE, msg);
    }

    /**
     *升级建筑
     * @param tid 建筑ID
     *
     */
    public static sendUpgradeBuild(tid:number)
    {
        let msg:BuildingOptionReqMsg = new BuildingOptionReqMsg();
        msg.buildingId = tid;
        SocketManager.Instance.send(C2SProtocol.C_BUILDING_UPGRADE, msg);
    }

    /**
     *加载建筑队列
     *
     */
    public static upgradeOrderList()
    {
        SocketManager.Instance.send(C2SProtocol.C_LOAD_BUILD_ORDER);
    }

    /**
     *冷却建筑队列
     * @param id 建筑队列id
     * @param payTpe 1为钻石  2为礼金
     *
     */
    public static sendCoolOrder(id:number, payTpe:number, useBind:boolean = true)
    {
        let msg:BuildingReqMsg = new BuildingReqMsg();
        msg.orderId = id;
        msg.index = payTpe;
        if(payTpe != 0)
        {
            if(!useBind)
            {
                msg.index = 1;
            }
            else
            {
                msg.index = 2;
            }
        }
        SocketManager.Instance.send(C2SProtocol.U_C_BUILDING_ORDER_QUICK, msg);
    }

    /**
     *购买队列
     * @param type(队列类型,默认值为0, 目前只有一种类型)
     *
     */
    public static sendBuyOrder(type:boolean)
    {
        let msg:PayTypeMsg = new PayTypeMsg();
        if(type)
        {
            msg.payType = 0;
        }
        else
        {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.U_C_BUILDING_ORDERADD, msg);
    }


    /**
     * 快速冷却传送阵
     * @type  支付类型
     */
    public static sendCoolTransferTime(type:number)
    {
        let msg:PayTypeMsg = new PayTypeMsg();
        msg.payType = type;
        SocketManager.Instance.send(C2SProtocol.U_C_BUIDLING_TRANS_COOL, msg);
    }

    /**
     *增加传送阵能量
     * @param type（默认值为0, 目前只有一种类型）
     *
     */
    public static sendAddTransferPower(type:number)
    {
        let msg:PayTypeMsg = new PayTypeMsg();
        msg.payType = type;
        SocketManager.Instance.send(C2SProtocol.U_C_BUILDING_UPENERGY, msg);
    }

    /**
     *删除一个野地
     * @param pos (来源于FieldData.pos)
     *
     */
    public static unoccupy(pos:string)
    {
        let msg:BuildingReqMsg = new BuildingReqMsg();
        msg.position = pos;
        SocketManager.Instance.send(C2SProtocol.U_C_UNOCCPWILDLAND, msg);
    }

    public static removeTreasure(id:number){
        let msg:BuildingReqMsg = new BuildingReqMsg();
        msg.orderId = id;
        SocketManager.Instance.send(C2SProtocol.C_TREASURE_MINE_UNOCCP, msg);
    }
    /**
     * 收获神树
     * @param index(值为0, 目前只有一种)
     *
     */
    public static pickFruits(index:number)
    {
        let msg:BuildingReqMsg = new BuildingReqMsg();
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.U_C_TREE_PICK, msg);
    }

    /**
     * 神树充能
     * @param userId（用户ID）
     *
     */
    public static water(userId:number)
    {
        let msg:BuildingReqMsg = new BuildingReqMsg();
        msg.userId = userId;
        SocketManager.Instance.send(C2SProtocol.CH_TREE_WATER, msg);
    }
}