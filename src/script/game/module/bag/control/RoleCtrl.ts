import FrameCtrlBase from "../../../mvc/FrameCtrlBase";
import {TattooModel} from "../../sbag/tattoo/model/TattooModel";
import {SocketManager} from "../../../../core/net/SocketManager";
import {C2SProtocol} from "../../../constant/protocol/C2SProtocol";
import TattooHoleReqMsg = com.road.yishi.proto.player.TattooHoleReqMsg;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/2/23 18:00
 * @ver 1.0
 *
 */
export class RoleCtrl extends FrameCtrlBase
{
    private readonly _tattooModel:TattooModel;
    public static OP_INFO:number = 1;//请求纹身信息
    public static OP_REFRESH:number = 2;//升级
    public static OP_ADVANCE_REFRESH:number = 6;//高级升级
    public static OP_UPDATE_CORE:number = 4;//升级龙纹核心
    public static OP_DELETE:number = 5;//删除未替换的属性
    public static OP_BAPTIZE:number = 7;//洗炼属性
    public static OP_REPLACE:number = 3;//替换属性

    constructor()
    {
        super();
        this._tattooModel = new TattooModel();
    }

    get tattooModel():TattooModel
    {
        return this._tattooModel;
    }

    /**
     * 获取龙纹信息
     */
    public sendReqTattooInfo():void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_INFO;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }

    /**
     * 升级
     * @param holeIndex     1-8
     */
    public sendUpgrade(holeIndex:number):void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_REFRESH;
        msg.param2 = holeIndex;// + 1;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }

    /**
     * 高级升级
     * @param holeIndex     1-8
     */
    public sendSeniorUpgrade(holeIndex:number):void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_ADVANCE_REFRESH;
        msg.param2 = holeIndex;// + 1;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }

    /**
     * 洗炼属性
     * @param holeIndex     1-8
     * @param materialPayType   材料支付类型 1:钻石   2：绑钻
     */
    public sendRefresh(holeIndex:number, materialPayType:number):void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_BAPTIZE;
        msg.param2 = holeIndex;// + 1;
        msg.materialPayType = materialPayType;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }

    /**
     * 替换属性
     * @param holeIndex     1-8
     */
    public sendReplace(holeIndex:number):void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_REPLACE;
        msg.param2 = holeIndex;// + 1;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }

    /**
     * 删除属性
     * @param holeIndex     1-8
     */
    public sendDelete(holeIndex:number):void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_DELETE;
        msg.param2 = holeIndex;// + 1;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }

    /**
     * 升级龙纹核心
     */
    public sendUpdateCore():void
    {
        let msg:TattooHoleReqMsg = new TattooHoleReqMsg();
        msg.opType = RoleCtrl.OP_UPDATE_CORE;
        SocketManager.Instance.send(C2SProtocol.C_TATTOO_REQ, msg);
    }


}