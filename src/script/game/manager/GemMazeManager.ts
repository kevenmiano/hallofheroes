import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import GemMazeInfoMsg = com.road.yishi.proto.minigame.GemMazeInfoMsg;
import GemInfoUpdateMsg = com.road.yishi.proto.minigame.GemInfoUpdateMsg;
import GemInviteOpMsg = com.road.yishi.proto.minigame.GemInviteOpMsg;
import GetRewardBoxRspMsg = com.road.yishi.proto.minigame.GetRewardBoxRspMsg;
import GetRewardBoxMsg = com.road.yishi.proto.minigame.GetRewardBoxMsg;
import GemMazeBuyTimesMsg = com.road.yishi.proto.minigame.GemMazeBuyTimesMsg;
import GemMoveInviteReqMsg = com.road.yishi.proto.minigame.GemMoveInviteReqMsg;
import GemMoveInviteMsg = com.road.yishi.proto.minigame.GemMoveInviteMsg;
import GemMazeBuyTimesRspMsg = com.road.yishi.proto.minigame.GemMazeBuyTimesRspMsg;
import GemMoveMsg = com.road.yishi.proto.minigame.GemMoveMsg;
import GemMazeModel from "../module/gemMaze/model/GemMazeModel";
import { GemMazeEvent } from "../constant/event/NotificationEvent";
import { PathManager } from "./PathManager";
import ResMgr from "../../core/res/ResMgr";
import ByteArray from "../../core/net/ByteArray";
import Logger from "../../core/logger/Logger";
import XmlMgr from "../../core/xlsx/XmlMgr";
import GemMazeOrderInfo from "../module/gemMaze/model/GemMazeOrderInfo";
import { DateFormatter } from "../../core/utils/DateFormatter";


/**
 * 宝石迷阵管理类、持有Model的引用, 负责收发协议, 处理协议更新数据到Model, 并抛出事件
 * 
 */
export class GemMazeManager extends GameEventDispatcher {
    private static _instance: GemMazeManager;
    private _model:GemMazeModel;
    private hasLinstener:Boolean = false;
  

    public static get Instance(): GemMazeManager {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }

    public get model():GemMazeModel
    {
        return this._model;
    }
    

    constructor() {
        super();
        this._model = new GemMazeModel();
    }

    //获取夺宝奇兵初始化信息
    public getInitInfo():void
    {
        if(!this.hasLinstener)
        {
            this.initEvent();
        }			
        //发送请求到服务器, 拉去初始化数据
        SocketManager.Instance.send(C2SProtocol.C_GET_GEMMAZE_INFO);
        GemMazeManager.Instance.loadRankData();
    }

    public setup() {
        // ServerDataManager.listen(S2CProtocol.U_GEMMAZE_INVIDE_NOTICE, this, this.__invideNoticeHandler);
    }

    loadRankData(){
        ResMgr.Instance.loadRes(PathManager.gemMazeOrderPath, (info) => {
            let contentStr: string = "";
            let dataObj = null;
            if (info) {
                try {
                    let content: ByteArray = new ByteArray();
                    content.writeArrayBuffer(info);
                    if (content && content.length) {
                        content.position = 0;
                        content.uncompress();
                        contentStr = content.readUTFBytes(content.bytesAvailable);
                        content.clear();
                    }
                } catch (error) {
                    Logger.error('GemMazeManager loadRankData Error');
                    return;
                }
                // dataObj = XmlMgr.Instance.decode(contentStr);
                dataObj = JSON.parse(contentStr);
                if (dataObj) {
                    let list = dataObj.GemMazeScores;
                    this._model.createDate = DateFormatter.parse(list.info.createDate, "YYYY-MM-DD hh:mm:ss");
                    this._model.createDate.setHours(4, 0, 0, 0);
                    this.model.orderList.length = 0;
                    if (list.GemMazeScore) {
                        if (list.GemMazeScore instanceof Array) {
                            list.GemMazeScore.forEach(item => {
                                let orderInfo: GemMazeOrderInfo = new GemMazeOrderInfo();
                                orderInfo.userId = parseInt(item.UserId);
                                orderInfo.job = parseInt(item.Job);
                                orderInfo.nickName = item.NickName;
                                orderInfo.score = item.Score;
                                orderInfo.consortiaName = item.ConsortiaName;
                                orderInfo.grades = parseInt(item.Grades);
                                orderInfo.gemMazeGrades = parseInt(item.GemMazeGrades);
                                orderInfo.order = parseInt(item.Order);
                                orderInfo.index = parseInt(item.Index);
                                orderInfo.fightingCapacity = parseInt(item.FightingCapacity);
                                orderInfo.isVip = item.IsVip == "true";
                                orderInfo.vipType = parseInt(item.VipType);
                                this.model.orderList.push(orderInfo);
                            });
                        } else {
                            let item = list.GemMazeScore;
                            let orderInfo: GemMazeOrderInfo = new GemMazeOrderInfo();
                            orderInfo.userId = parseInt(item.UserId);
                            orderInfo.job = parseInt(item.Job);
                            orderInfo.nickName = item.NickName;
                            orderInfo.score = item.Score;
                            orderInfo.consortiaName = item.ConsortiaName;
                            orderInfo.grades = parseInt(item.Grades);
                            orderInfo.gemMazeGrades = parseInt(item.GemMazeGrades);
                            orderInfo.order = parseInt(item.Order);
                            orderInfo.index = parseInt(item.Index);
                            orderInfo.fightingCapacity = parseInt(item.FightingCapacity);
                            orderInfo.isVip = item.IsVip == "true";
                            orderInfo.vipType = parseInt(item.VipType);
                            this.model.orderList.push(orderInfo);
                        }
                    }
                }
            }
        }, null, Laya.Loader.BUFFER);
    }

    //被邀请协助通知
    // private __invideNoticeHandler(pkg: PackageIn):void
    // {
    //     let msg:GemMoveInviteReqMsg = pkg.readBody(GemMoveInviteReqMsg) as GemMoveInviteReqMsg;
    //     this.model.invideByPlayerId = msg.friendId;
    //     this.model.invideRemoveGemCount = msg.helpNums;
    //     this.model.invideLeftTimes = msg.inviteTimes;
    //     if(SceneManager.Instance.currentType == SceneType.BATTLE_SCENE)
    //     {
    //         this.helpFriend(4);
    //         return;
    //     }
    //     if(this.model.invideByFriendIsOpen)
    //     {
    //         this.helpFriend(5);
    //         return;
    //     }
    //     // FrameControllerManager.instance.gemMazeController.startFrameByType(GemMazeFrameType.INVIDE_BY_FRAME);
    // }

    /**
     * 是否同意协助  
     * @param flag 1.协助   2.拒绝协助 , 3 超时不拉杆 ,  4 在战斗中,   5 被邀请窗口还没关闭  
     * 
     */		
    // public helpFriend(flag:number):void
    // {  
    //     var msg:GemInviteOpMsg = new GemInviteOpMsg();
    //     msg.playerId = this.model.invideByPlayerId;
    //     msg.opCode = flag;
    //     SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_INVITE_OP,msg);				
    // }
   

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_GEMMAZE_INFO, this, this.__gemMazeInfoBuffHandler);
        ServerDataManager.listen(S2CProtocol.U_C_GEMMAZE_UPDATE, this, this.__gemInfoUpdateHandler);
        ServerDataManager.listen(S2CProtocol.U_GEMMAZE_OPRST, this, this.__invideResultHandler);
        ServerDataManager.listen(S2CProtocol.U_GEMMAZE_BUYTIMES_RSP, this, this.__onBuyTimesHandler);
        ServerDataManager.listen(S2CProtocol.U_GEMMAZE_GETBOX_RSP, this, this.__onGetBoxGoodsHandler);
    }

    private removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_C_GEMMAZE_INFO, this, this.__gemMazeInfoBuffHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_GEMMAZE_UPDATE, this, this.__gemInfoUpdateHandler);
        ServerDataManager.cancel(S2CProtocol.U_GEMMAZE_OPRST, this, this.__invideResultHandler);
        ServerDataManager.cancel(S2CProtocol.U_GEMMAZE_BUYTIMES_RSP, this, this.__onBuyTimesHandler);
        ServerDataManager.cancel(S2CProtocol.U_GEMMAZE_GETBOX_RSP, this, this.__onGetBoxGoodsHandler);
        this.hasLinstener = false;
    }
    
    /**
     * 夺宝奇兵初始化信息返回
     * @param pkg
     */
    private __gemMazeInfoBuffHandler(pkg: PackageIn) {
        this.model.reset();
        this.model.updateAllUpdateData();

        let msg: GemMazeInfoMsg = pkg.readBody(GemMazeInfoMsg) as GemMazeInfoMsg;
        this.model.updateGemMazeInfo(msg);
        this.dispatchEvent(GemMazeEvent.GEMMAZE_GET_INIT_INFO);		
    }

    /**
     * 移动宝石返回
     * @param pkg
     */
    private __gemInfoUpdateHandler(pkg: PackageIn) {
        let msg: GemInfoUpdateMsg = pkg.readBody(GemInfoUpdateMsg) as GemInfoUpdateMsg;
        this.model.updateGemUpdateInfo(msg);

        this.dispatchEvent(GemMazeEvent.GEMMAZE_UPDATE_INFO);		
    }

    /**
     * 解除缩屏通知 (0操作不成功 1操作成功)
     * @param pkg
     */
    private __invideResultHandler(pkg: PackageIn) {
        let msg: GemInviteOpMsg = pkg.readBody(GemInviteOpMsg) as GemInviteOpMsg;
        this.model.canMoveGemByUser = true;
    }

    /**
     * 购买次数返回 
     * @param pkg
     */
    private __onBuyTimesHandler(pkg: PackageIn) {
        let msg: GemMazeBuyTimesRspMsg = pkg.readBody(GemMazeBuyTimesRspMsg) as GemMazeBuyTimesRspMsg;
        this.model.gemMazeInfo.timesLeft += 10;
        this.model.gemMazeInfo.buyTimesLeft = msg.buyTimesLeft;
        this.dispatchEvent(GemMazeEvent.GEMMAZE_GEM_UPDATE_FRAME);		
    }

    /**
     * 积分宝箱领取奖励返回 
     * @param pkg
     */
    private __onGetBoxGoodsHandler(pkg: PackageIn) {
        let msg: GetRewardBoxRspMsg = pkg.readBody(GetRewardBoxRspMsg) as GetRewardBoxRspMsg;
        this.model.gemMazeInfo.boxMark = msg.boxGetMark; 
        var i:number;
        var tmpArr:any = [];
        for(i = 0; i < msg.rewardInfo.length; i++)
        {
            tmpArr.push(msg.rewardInfo[i].rewardId);
        }
        this.dispatchEvent(GemMazeEvent.GEMMAZE_PLAYER_BOX_GOODS, tmpArr);
        this.dispatchEvent(GemMazeEvent.GEMMAZE_UPDATE_BOX_STATUS);
    }

    //--------------------------------------------------------------------------请求

    public sendOpenInfo():void
    {
        SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_GETALL); 
    }

    /**
     * 领取积分宝箱奖励 
     * @param boxIndex
     */		
    public getBoxGoods(boxIndex:number):void
    {
        var msg:GetRewardBoxMsg = new GetRewardBoxMsg();
        msg.boxId = boxIndex;
        SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_GETREWARDBOX,msg); 
    }

    /**
     * 购买次数 
     * @param useBind 1钻石, 2绑钻
     */
    public buyTimes(useBind:number = 2):void
    {
        var msg:GemMazeBuyTimesMsg = new GemMazeBuyTimesMsg();
        msg.buyTypes = useBind;
        SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_BUYTIMES,msg); 
    }

    /**
     * 邀请好友协助
     * @param invidePlayerId 
     */
    public invideFriendHelp(invidePlayerId:number):void
    {
        var msg:GemMoveInviteMsg = new GemMoveInviteMsg();
        msg.playerIdInvited = invidePlayerId;
        this.model.canMoveGemByUser = false;
        SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_INVITE,msg); 
    }

    /**
     * 移动宝石
     * @param beginMark 
     * @param endMark 
     */
    public moveGem(beginMark:number, endMark:number):void
    {			
        var msg:GemMoveMsg = new GemMoveMsg();
        msg.beginMark = beginMark;
        msg.endMark = endMark;
        SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_GEMMOVE,msg); 
        this.model.gemMazeInfo.timesLeft -= 1; //扣除剩余次数
        this.dispatchEvent(GemMazeEvent.GEMMAZE_UPDATE_TIMESLEFT);
        this.dispatchEvent(GemMazeEvent.GEMMAZE_GEM_UPDATE_FRAME);
    }

    public clearData():void
    {
        this.model.reset();
        this.removeEvent();
    }
    

}