import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PackageIn } from "../../core/net/PackageIn";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import NodeMsg = com.road.yishi.proto.campaign.NodeMsg
import RollDiceMsg = com.road.yishi.proto.campaign.RollDiceMsg
import CampaignNodeInfoMsg = com.road.yishi.proto.campaign.CampaignNodeInfoMsg
import TriggerEventMsg = com.road.yishi.proto.campaign.TriggerEventMsg
import SceneType from "../map/scene/SceneType";
import { ChatEvent, GemMazeEvent, MonopolyEvent } from "../constant/event/NotificationEvent";
import MonopolyModel from "../module/monopoly/model/MonopolyModel";
import { MonopolyNodeInfo } from "../module/monopoly/model/MonopolyNodeInfo";
import { CampaignNode } from "../map/space/data/CampaignNode";
import { SocketSceneBufferManager } from "./SocketSceneBufferManager";
import { NodeState } from "../map/space/constant/NodeState";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from "../../core/lang/LangManager";
import { NotificationManager } from "./NotificationManager";
import { ChatChannel } from "../datas/ChatChannel";
import ChatData from "../module/chat/data/ChatData";
import { TempleteManager } from "./TempleteManager";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { MonopolyItemInfo } from "../module/monopoly/model/MonopolyItemInfo";
import { CampaignManager } from "./CampaignManager";
import { CampaignArmy } from "../map/campaign/data/CampaignArmy";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";


/**
 * 云端历险类、持有Model的引用, 负责收发协议, 处理协议更新数据到Model, 并抛出事件
 * 
 */
export class MonopolyManager extends GameEventDispatcher {
    private static _instance: MonopolyManager;
    private _model:MonopolyModel;  
    private isInited:boolean=false;
    public iswalking:boolean=false;

    public static get Instance(): MonopolyManager {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }

    public get model():MonopolyModel
    {
        return this._model;
    }
    
    constructor() {
        super();
        this._model = new MonopolyModel();
    }

    public setup() {
        if(this.isInited) return;
        this.initEvent();
        this.isInited = true;
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_ENTER_MONOPOLY_CAMPAIGN, this, this.__enterMonopolyCampaignResHandler);
        ServerDataManager.listen(S2CProtocol.U_C_MONOPOLY_CAMPAIGN_OVER, this, this.__monopolyCampaignOverHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ROLL_DICE, this, this.__rollDiceResHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ROLL_DICE_CONFIRM, this, this.__rollDiceConfirmHandler);
        ServerDataManager.listen(S2CProtocol.U_C_BUY_ROLL_DICE, this, this.__buyRollDiceHandler);
        ServerDataManager.listen(S2CProtocol.U_C_SLOT_MACHINE, this, this.__slotMachineHandler);
        ServerDataManager.listen(S2CProtocol.U_C_MONOFIGHT_GOBACK, this, this.onFightLoss);
        ServerDataManager.listen(S2CProtocol.U_C_BUY_MAGIC_DICE, this, this.__buyMagicRollDiceHandler);
    }

    private removeEvent() {
        ServerDataManager.cancel(S2CProtocol.U_C_ENTER_MONOPOLY_CAMPAIGN, this, this.__enterMonopolyCampaignResHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_MONOPOLY_CAMPAIGN_OVER, this, this.__monopolyCampaignOverHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ROLL_DICE, this, this.__rollDiceResHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_ROLL_DICE_CONFIRM, this, this.__rollDiceConfirmHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_BUY_ROLL_DICE, this, this.__buyRollDiceHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_SLOT_MACHINE, this, this.__slotMachineHandler);
        ServerDataManager.cancel(S2CProtocol.U_C_MONOFIGHT_GOBACK, this, this.onFightLoss);
        ServerDataManager.cancel(S2CProtocol.U_C_BUY_MAGIC_DICE, this, this.__buyMagicRollDiceHandler);
    }

    private __monopolyCampaignOverHandler(pkg: PackageIn)
    {
        SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, SceneType.SPACE_SCENE, this.monopolyCampaignOverCallBack.bind(this));
    }

    private onFightLoss(pkg: PackageIn)
    {
        var rtnScene:string = SceneType.CAMPAIGN_MAP_SCENE;
        SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, rtnScene, this.__onRollDiceResHandler.bind(this));
    }

    private __onRollDiceResHandler(pkg:PackageIn)
    {
        let msg = pkg.readBody(RollDiceMsg) as RollDiceMsg;
        this.readRollDiceMsg(msg);
        this._model.commit();
        // if(msg.type == 0)
        // {
        //     // _monopolyDiceRollView = new MonopolyDiceRollView(diceRollCallBack);
        //     // _monopolyDiceRollView.show();
        // }else
        // {
        //     this.diceRollCallBack();
        // }
        if(CampaignManager.Instance.controller) 
        {
            let path:any = this._model.getPath();
            CampaignManager.Instance.controller.moveArmyByPath(path);
        }
    }

    // private __sysDiceHandler(pkg: PackageIn)
    // {
    //     let msg:RollDiceMsg = pkg.readBody(RollDiceMsg) as RollDiceMsg;
    //     this.readRollDiceMsg(msg);
    //     this._model.commit();
    // }

    private __slotMachineHandler(pkg: PackageIn)
    {
        let msg = pkg.readBody(CampaignNodeInfoMsg) as CampaignNodeInfoMsg;
        this.readCampaignNodeInfoMsg(msg);
        this._model.itemInfos = [];
        var itemInfo:MonopolyItemInfo;
        msg.nodeInfo.forEach(tempMsg => {
            itemInfo = new MonopolyItemInfo();
            itemInfo.templateId = tempMsg.templateId;
            itemInfo.count = tempMsg.count;
            this._model.itemInfos.push(itemInfo);
        });
        // for each(var tempMsg:TempMsg in msg.nodeInfo)
        // {
            
        // }
        this._model.commit();
    }

    private __buyMagicRollDiceHandler(pkg: PackageIn)
    {
        let msg = pkg.readBody(RollDiceMsg) as RollDiceMsg;
        this._model.buyMagicDiceCount = msg.buyMagicDiceCount;
        this._model.commit(true);
    }

    private __buyRollDiceHandler(pkg: PackageIn)
    {
        let msg = pkg.readBody(RollDiceMsg) as RollDiceMsg;
        
        this.readRollDiceMsg(msg);
        this._model.commit();
    }
    

    /**
     * 请求进入副本
     */	
    public sendEnterCampaign() : void
    {
        SocketManager.Instance.send(C2SProtocol.C_MONOPOLY_CAMPAIGN_ENTER); 
    }

    /**
     * 进入副本返回
     * @param pkg 
     */
    private __enterMonopolyCampaignResHandler(pkg: PackageIn) 
    {        
        let msg = pkg.readBody(RollDiceMsg) as RollDiceMsg;
        this._model.buyMagicDiceCount = msg.buyMagicDiceCount;
        this.readRollDiceMsg(msg);
        if(CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapNodesData && msg.nodeInfo.length > 0)
        {
            this._model.nodeInfos = [];
            let mapNodes:any = CampaignManager.Instance.mapModel.mapNodesData;
            mapNodes.sort(this.sortMapNodes);
            let armyInfo:CampaignArmy;
            let campaignNode:CampaignNode;
            let nodeInfo:MonopolyNodeInfo;
            let nodeMsg:NodeMsg;
            let nodeCount:number = msg.nodeInfo.length;
            msg.nodeInfo.sort(this.sortNodeInfos);
            for(let i:number = 0; i < nodeCount; i++) 
            {
                nodeMsg = msg.nodeInfo[i] as NodeMsg;
                campaignNode = mapNodes[i] as CampaignNode;
                if(nodeMsg && campaignNode)
                {
                    nodeInfo = new MonopolyNodeInfo();
                    nodeInfo.position = nodeMsg.position;
                    nodeInfo.type = nodeMsg.type;
                    nodeInfo.templateId = nodeMsg.templateId;
                    nodeInfo.x = campaignNode.curPosX;
                    nodeInfo.y = campaignNode.curPosY;
                    nodeInfo.nodeId = campaignNode.nodeId;
                    
                    campaignNode.info.id = nodeMsg.position;
                    campaignNode.info.names = "";
//						campaignNode.info.state = NodeState.EXIST;
                    /*
                    if(nodeInfo.isBoss)
                    {
                        campaignNode.sonType = nodeInfo.sonType;
                        campaignNode.toward = 45;
                    }
                    */
                    nodeInfo.campaignNode = campaignNode;
                    
                    this._model.nodeInfos.push(nodeInfo);
                    if(nodeInfo.position == this._model.position)
                    {
                        armyInfo = CampaignManager.Instance.mapModel.selfMemberData;
                        armyInfo.curPosX = campaignNode.curPosX;
                        armyInfo.curPosY = campaignNode.curPosY;
                    }
                    else if(nodeInfo.position - 1 == this._model.position)
                    {
                        CampaignManager.Instance.mapModel.currentDieNodeId = campaignNode.info.id;
                    }
                }
            }
        }
        this._model.commit();
    }

    private readRollDiceMsg(msg:RollDiceMsg):void
    {
        this._model.normalPoint = msg.normalPoint;
        this._model.warFlag = msg.warFlag;
        this._model.resultPoint = msg.resultPoint;
        this._model.lastPosition = this._model.position;
        this._model.position = msg.position;
        if(this._model.lastPosition == 0)
        {
            this._model.lastPosition = this._model.position;

        }
        if(msg.freeSlotmachineCount)
        {
            this._model.slotMachineTimes = msg.freeSlotmachineCount;
        }
        // if(msg.lastBuySpecialPoint)
        // {
        //     this._model.lastBuySpecialPoint = msg.lastBuySpecialPoint;
        // }
        // if(msg.lastBuyWarFlag)
        // {
        //     this._model.lastBuyWarFlag = msg.lastBuyWarFlag;
        // }
        // if(msg.campaignCount)
        // {
        //     this._model.campaignCount = msg.campaignCount;
        // }
    }

    /**
     * 
     * @param pkg 
     */
    private  monopolyCampaignOverCallBack(pkg:PackageIn):void
    {
        let msg: CampaignNodeInfoMsg = pkg.readBody(CampaignNodeInfoMsg) as CampaignNodeInfoMsg;
        // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MONOPOLY, MonopolyController.GAME_OVER, msg);
        FrameCtrlManager.Instance.open(EmWindow.MonopolyResultWnd,msg);
    }

    /**
     * 丢骰子
     * @param type	0.普通掷色子1.魔力色子
     * @param point	如果type为1,则表示选择的点数
     * 
     */		
    public sendRollDice(type:number = 0, point:number = 0) : void
    {
        var msg : RollDiceMsg = new RollDiceMsg();
        msg.type = type;
        msg.point = point;
        SocketManager.Instance.send(C2SProtocol.C_MONOPOLY_CAMPAIGN_ROLL_DICE,msg); 
    }

    /**
     * 丢骰子返回 
     * @param pkg
     */
    private __rollDiceResHandler(pkg: PackageIn) {
        let msg = pkg.readBody(RollDiceMsg) as RollDiceMsg;
        this.readRollDiceMsg(msg);
        this._model.commit();
        NotificationManager.Instance.dispatchEvent(MonopolyEvent.ROLL_DICE,msg.type);
    }



    //--------------------------------------------------------------------------请求

    public sendOpenInfo():void
    {
        SocketManager.Instance.send(C2SProtocol.C_GEMMAZE_GETALL); 
    }

    private __rollDiceConfirmHandler(pkg: PackageIn)
    {
        SocketSceneBufferManager.Instance.addPkgToBuffer(pkg, SceneType.CAMPAIGN_MAP_SCENE, this.rollDiceConfirmCallBack.bind(this));
        
    }

    private rollDiceConfirmCallBack(pkg:PackageIn)
    {
        let msg = pkg.readBody(CampaignNodeInfoMsg) as CampaignNodeInfoMsg;
        if(msg.type == MonopolyModel.EVENT_END_TYPE)
        {
            // FrameControllerManager.instance.closeControllerByInfo(UIModuleTypes.MONOPOLY);
        }else if(msg.type == MonopolyModel.END_TYPE)
        {
            this.readCampaignNodeInfoMsg(msg);
            FrameCtrlManager.Instance.open(EmWindow.MonopolyFinishWnd,msg)
        }else if(msg.type == MonopolyModel.BATTLE_FAIL_TYPE)
        {
            // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MONOPOLY, MonopolyController.BATTLE_FAILURE, msg);
        }else if(msg.type == MonopolyModel.END_REWARD_TYPE)
        {
            if(msg.nodeInfo.length > 0)
            {
                this.showBattleRewardMsg(msg.nodeInfo);
            }
            this.hideBoss();
        }
        // else if(msg.type == MonopolyModel.GAME_TYPE)
        // {
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("MonopolyManager.GameTip01"));
        //      if(msg.gameType == 1)
        //     {
        //         // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MONOPOLY, MonopolyController.GAME_GEMMAZE);
        //     }else
        //     {
        //         // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MONOPOLY, MonopolyController.GAME_LLK);
        //     }
        // }else
        // {
        //     // FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.MONOPOLY, MonopolyController.ALERT, msg);
        // }
    }

    showBattleRewardMsg(rewards:Array<any>)
    {
        var content:string = "";
        var str:string = "";
        var chatData:ChatData;
        var goodsTempInfo:t_s_itemtemplateData;
        rewards.forEach(tempMsg => {
            goodsTempInfo = TempleteManager.Instance.getGoodsTemplatesByTempleteId(tempMsg.templateId);
            if(goodsTempInfo)
            {
                content += LangManager.Instance.GetTranslation("MonopolyManager.BattleGetTip02", goodsTempInfo.TemplateNameLang, tempMsg.count);
            }
        });
        // for each(var tempMsg:TempMsg in rewards)
        // {
           
        // }
        if(content != "")
        {
            content = content.substring(0, content.length - 1);
        }
        str = LangManager.Instance.GetTranslation("MonopolyManager.BattleGetTip01", content);
        // chatData = ObjectPool.get(ChatData) as ChatData;
        if(chatData)
        {
            chatData.channel = ChatChannel.INFO;
            chatData.msg = str;
            chatData.commit();
            NotificationManager.Instance.sendNotification(ChatEvent.ADD_CHAT,chatData);
            MessageTipManager.Instance.show(str);
        }
    }
		
    public hideBoss()
    {
        var nodeInfo:MonopolyNodeInfo =	this._model.nodeInfos[this._model.position - 1] as MonopolyNodeInfo;
        if(nodeInfo && nodeInfo.campaignNode && nodeInfo.campaignNode.info)
        {
            nodeInfo.campaignNode.info.state = NodeState.DESTROYED;
        }
    }

    private readCampaignNodeInfoMsg(msg:CampaignNodeInfoMsg):void
    {
        if(msg.normalTimes)
        {
            this._model.normalTimes = msg.normalTimes;
        }
        // if(msg.magicTimes)
        // {
        //     this._model.magicTimes = msg.magicTimes;
        // }
 
        this._model.slotMachineTimes = msg.freeSlotmachineCount;
        if(msg.isMail)
        {
            this._model.isMail = msg.isMail;
        }
    }

    public hideChest():void
    {
        var nodeInfo:MonopolyNodeInfo =	this._model.nodeInfos[this._model.position - 1] as MonopolyNodeInfo;
        if(nodeInfo && nodeInfo.campaignNode && nodeInfo.campaignNode.info)
        {
            nodeInfo.campaignNode.info.state = NodeState.DESTROYED;
            nodeInfo.campaignNode.commit();
        }
    }

    private sortMapNodes(node1:CampaignNode, node2:CampaignNode):number
    {
        if(node1.nodeId < node2.nodeId)
        {
            return -1
        }
        else if(node1.nodeId > node2.nodeId)
        {
            return  1;
        }
        return 0;
    }

    private sortNodeInfos(node1:NodeMsg, node2:NodeMsg):number
    {
        if(node1.position < node2.position)
        {
            return -1
        }
        else if(node1.position > node2.position)
        {
            return  1;
        }
        return 0;
    }

    /* 
        离开副本
    * @param normal	0: 重置退出1: 非重置退出
    * 
    */		
   public sendLeaveCampaign(normal:number = 1) : void
   {
       var msg:TriggerEventMsg = new TriggerEventMsg();
       msg.param1 = normal;
       SocketManager.Instance.send(C2SProtocol.C_MONOPOLY_CAMPAIGN_LEAVE,msg); 
   }

   /**
     * 老虎机抽奖
     */		
    public sendSlotMachine() : void
    {
        SocketManager.Instance.send(C2SProtocol.C_MONOPOLY_SLOT_MACHINE); 
    }

    /**
     * 到达节点, 触发事件
     * 
     */		
    public sendTriggerEvent() : void
    {
        this.iswalking = false;
        SocketManager.Instance.send(C2SProtocol.C_MONOPOLY_CAMPAIGN_TRIGGER_EVENT); 
    }

 	/**
     * 购买
     * @param buyType 1魔力骰子 2战争旗帜
     * 
     */		
    public sendMonopolyBuy(buyType:number = 1, useBind:boolean = false) : void
    {
        let msg : TriggerEventMsg = new TriggerEventMsg();
        if(useBind)
        {
            msg.param1 = 0;
        }else
        {
            msg.param1 = 1;
        }
        if(buyType == 1){
            SocketManager.Instance.send(C2SProtocol. C_MONOPOLY_CAMPAIGN_BUY_MAGIC_DICE,msg); 
        }else{
            SocketManager.Instance.send(C2SProtocol.C_MONOPOLY_CAMPAIGN_BUY_EVENT); 
        }
        
    }
}