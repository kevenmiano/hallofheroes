// @ts-nocheck
/**
 * 游戏中的基础信息, 登陆, 物品使用, 移动, 基本设置, 传送等模块, 与服务器交互
 *
 */
import { Message } from "../../../../protobuf/library/protobuf-library";
import { GameSocket } from "../../core/net/GameSocket";
import { SocketManager } from "../../core/net/SocketManager";
import { BattleManager } from "../battle/BattleManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { SpaceNode } from "../map/space/data/SpaceNode";
import { ArmyManager } from "./ArmyManager";
import { PlayerManager } from "./PlayerManager";
import PlayerDataMsg = com.road.yishi.proto.player.PlayerDataMsg;
import PlayerSettingMsg = com.road.yishi.proto.player.PlayerSettingMsg;
import LoginStateMsg = com.road.yishi.proto.player.LoginStateMsg;
import BatterLastInfoMsg = com.road.yishi.proto.campaign.BatterLastInfoMsg;
import CastleReqMsg = com.road.yishi.proto.castle.CastleReqMsg;
import ItemReqMsg = com.road.yishi.proto.item.ItemReqMsg;
import StoreReqMsg = com.road.yishi.proto.store.StoreReqMsg;
import ItemUseMsg = com.road.yishi.proto.item.ItemUseMsg;
import UseSkillMsg = com.road.yishi.proto.battle.UseSkillMsg;
import BattleItemMsg = com.road.yishi.proto.battle.BattleItemMsg;
import ItemRemoveMsg = com.road.yishi.proto.item.ItemRemoveMsg;
import CallBackReqMsg = com.road.yishi.proto.campaign.CallBackReqMsg;
import PayTypeMsg = com.road.yishi.proto.player.PayTypeMsg;
import TowerInfoReqMsg = com.road.yishi.proto.campaign.TowerInfoReqMsg;
import PlayerRenameReqMsg = com.road.yishi.proto.player.PlayerRenameReqMsg;
import CaptainSpeakMsg = com.road.yishi.proto.campaign.CaptainSpeakMsg;
import RebateOpMsg = com.road.yishi.proto.rebate.RebateOpMsg;
import CampaignReqMsg = com.road.yishi.proto.campaign.CampaignReqMsg;
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
import QuestInfo = com.road.yishi.proto.quest.QuestInfo;
import BattleReqMsg = com.road.yishi.proto.battle.BattleReqMsg;
import LoadOverMsg = com.road.yishi.proto.battle.LoadOverMsg;
import AttackModeMsg = com.road.yishi.proto.battle.AttackModeMsg;
import ItemMoveReqMsg = com.road.yishi.proto.item.ItemMoveReqMsg;
import SelledItemInfo = com.road.yishi.proto.item.SelledItemInfo;
import Logger from "../../core/logger/Logger";
import LangManager from "../../core/lang/LangManager";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { GoodsManager } from "./GoodsManager";
import { BagType } from "../constant/BagDefine";

export class SocketSendManager {
    private static _instance: SocketSendManager;
    public static get Instance(): SocketSendManager {
        if (!SocketSendManager._instance) {
            SocketSendManager._instance = new SocketSendManager();
        }
        return SocketSendManager._instance;
    }

    private _chatSocket: GameSocket;

    constructor() {
        this._chatSocket = SocketManager.Instance.socket;
    }

    /**
     * 请求登陆时进入的场景
     *
     */
    public loginState() {
        SocketManager.Instance.send(C2SProtocol.U_C_PLAYER_LOGINSTATE);
        Logger.log("login state !!!");
    }

    /**
     *
     * 暂停完成继续战斗
     */
    public sendBattlePlotComplete() {
        if (BattleManager.Instance.battleModel) {
            let msg: BattleReqMsg = new BattleReqMsg();
            msg.battleId = BattleManager.Instance.battleModel.battleId;
            Logger.info("[SocketSendManager]sendBattlePlotComplete", msg)
            SocketManager.Instance.send(C2SProtocol.B_PAUSE_FINISHED, msg);
        }
    }
    /**
     * 发送玩家客户端状态
     * @param state（详见ClientStateType.as）
     * CLIENT_INCASTLE : number = 0;
     * CLIENT_ROOMLIST : number = 1;
     * CLIENT_GAMEROOM : number = 2;
     * CLIENT_WORLDMAP : number = 3;
     * CLIENT_CAMPAIGN : number = 4;
     * CLIENT_BATTLE   : number = 5;
     * CLIENT_PVP_ROOM : number = 6;
     *
     */
    public sendCurrentClientState(state: number = 1) {
        let msg: LoginStateMsg = new LoginStateMsg;
        msg.state = state;
        SocketManager.Instance.send(C2SProtocol.U_PLAYER_CLIENT_STATE, msg);
    }

    /**
     *更新玩家连击数
     * @param count
     *
     */
    public sendBattleCount(count: number) {
        let msg: BatterLastInfoMsg = new BatterLastInfoMsg();
        msg.count = count;
        SocketManager.Instance.send(C2SProtocol.C_BATTER_COUNT, msg);
    }


    /**
     *传送城堡
     * @param mapId（目标地图ID）
     * @param posX（目标位置X）
     * @param posY（目标位置Y）
     * @param payType（支付类型）
     *
     */
    public sendMoveCastle(mapId: number, posX: number, posY: number, payType: number) {
        let msg: CastleReqMsg = new CastleReqMsg();
        msg.magId = mapId;
        msg.posX = posX;
        msg.posY = posY;
        msg.payType = payType;
        SocketManager.Instance.send(C2SProtocol.U_C_BUILDING_TRANSCASTLE, msg);
    }

    /**
     * 移动物品
     * @param beginBagType(移动前所处背包类型)（背包类型详见BagType.as）
     * @param beginObjectId（移动前物品ID）
     * @param beginPos（移动前位置）
     * @param endBagType（移动后所处背包类型）
     * @param endObjectId（移动后物品ID）
     * @param endPos（移动后位置）
     * @param count（移动的数量）
     * @param objectId 所属英灵id
     *
     */
    public sendMoveBagToBag(beginBagType: number, beginObjectId: number, beginPos: number, endBagType: number, endObjectId: number, endPos: number, count: number, isTakeOff: boolean = false) {
        let msg: ItemReqMsg = new ItemReqMsg();
        msg.beginBagType = beginBagType;
        msg.beginObjId = beginObjectId;
        msg.beginPos = beginPos;
        msg.endBagType = endBagType;
        msg.endPos = endPos;
        msg.endObjId = endObjectId;
        msg.count = count;
        msg.objectId = beginObjectId;
        msg.isTakeOff = isTakeOff;
        SocketManager.Instance.send(C2SProtocol.U_C_BAG_MOVE, msg);
    }

    /**
     * 使用物品
     * @param pos 物品的位置
     * @param count 物品的数量
     * @param bagType 背包类型（背包类型详见BagType.as）
     * @param battleId 为了提供战斗中使用符文, 赠送玫瑰为自定义内容
     * @param objectId 使用对象ID
     * @param itemInfos 多选宝箱选择物品及数量  SelledItemInfo  int32 pos = 1;//掉落选项ID 对应 t_s_dropitem.id   int32 count = 2; //数量
	
     */
    public sendUseItem(pos: number, count: number = 1, bagType: number = 1, battleId: string = "", objectId: number = 0, itemInfos: any = null) {
        let msg: ItemUseMsg = new ItemUseMsg();
        msg.pos = pos;
        msg.count = count;
        msg.bagType = bagType;
        msg.battleId = battleId;
        msg.friendId = objectId;
        if (itemInfos)
            msg.selectItemInfos = itemInfos;
        SocketManager.Instance.send(C2SProtocol.U_C_BAG_USEITEM, msg);
    }

    /**
     * 使用VIP币
     *
     */
    public sendUseVipMoney() {
        SocketManager.Instance.send(C2SProtocol.C_VIP_COIN_OPEN);
    }

    /**
     * 发送使用技能命令
     * @param battleId（战斗ID编号）
     * @param heroId（英雄ID）
     * @param skillId（技能ID）
     * @param target（技能目标）
     *
     */
    public gameCommand(battleId: string, heroId: number, skillId: number, target: any[] = null) {
        let msg: UseSkillMsg = new UseSkillMsg();
        msg.battleId = battleId;
        msg.heroId = heroId;
        msg.skillId = skillId;
        SocketManager.Instance.send(C2SProtocol.U_B_HERO_ORDER, msg);
    }

    /**
     * 发送使用试练技能命令
     * @param battleId（战斗ID编号）
     * @param skillId（技能ID）
     * @param heroId（英雄ID）
     * @param serverName(英雄所在服务器名)
     *
     */
    public sendUseBattleTrialProp(battleId: string, skillId: number, heroId: number) {
        let msg: BattleItemMsg = new BattleItemMsg();
        msg.userId = heroId;
        msg.battleId = battleId;
        msg.skillTempId = skillId;
        SocketManager.Instance.send(C2SProtocol.B_USE_TRIAL, msg);
    }

    /**
     * 发送使用英灵远征或者守卫通缉技能命令
     * @param battleId（战斗ID编号）
     * @param skillId（技能ID）
     * 
    */
    public sendUsePetBattleSkill(battleId: string, skillId: number) {
        let msg: UseSkillMsg = new UseSkillMsg();
        msg.battleId = battleId;
        msg.skillId = skillId;
        SocketManager.Instance.send(C2SProtocol.B_REMOTE_PET_ORDER, msg);
    }

    /**
     *战斗加载完成
     * @param battleId（战斗ID）
     * @param userId（用户ID）
     *
     */
    public sendLoadOver(battleId: string, userId: number) {
        this.sendLoadOverByType(C2SProtocol.U_B_USER_LOADOVER, battleId, userId);
    }

    /**
     *客户端增援加载完成
     * @param battleId（战斗ID）
     * @param userId（用户编号）
     *
     */
    public sendReinfoLoadOver(battleId: string, userId: number) {
        this.sendLoadOverByType(C2SProtocol.B_REINFORCE_LOADOVER, battleId, userId);
    }


    private sendLoadOverByType(type: number, battleId: string, userId: number) {
        let msg: LoadOverMsg = new LoadOverMsg();
        let armyId: number = ArmyManager.Instance.army.id;
        msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
        msg.armyId = armyId;
        msg.battleId = battleId
        SocketManager.Instance.send(type, msg);
    }
    /**
     * 开孔或拆除宝石
     * @param pos  开孔或拆除宝石位置
     * @param operate  true为开孔, false为拆除宝石
     *
     */
    public sendPunch(pos: number, operate: boolean) {
        let info: GoodsInfo = GoodsManager.Instance.getHideBagItemByPos(0);
        // if (!info.isBinds && operate) {
        //     let content: string = LangManager.Instance.GetTranslation("Store.IntensifyView.Tip");
        //     SimpleAlertHelper.Instance.Show(null, null, null, content, null, null, (b: boolean, check: boolean) => {
        //         this.PunchConfirm(b, check, pos, operate)
        //     });
        // } else {
        this.PunchConfirm(true, false, pos, operate);
        // }
    }
    /**
     *镶嵌孔操作
     * @param b
     * @param pos
     * @param operate
     *
     */
    private PunchConfirm(b: boolean, flag: boolean, pos: number, operate: boolean) {
        if (b) {
            let msg: StoreReqMsg = new StoreReqMsg();
            msg.holePos = pos;
            msg.operate = operate;
            SocketManager.Instance.send(C2SProtocol.U_C_ITEM_INLAYJOIN, msg);
        }
    }
    /**
     * 出售物品
     * @param pos 物品位置
     */
    public sendSellItem(pos: number) {
        let msg: ItemReqMsg = new ItemReqMsg();
        msg.beginPos = pos;
        SocketManager.Instance.send(C2SProtocol.U_C_BAG_SELL, msg);
    }

    /**
     *删除物品
     * @param bagType（背包类型）
     * @param pos（物品坐标）
     *
     */
    public sendDeleteGoods(bagType: number, pos: number) {
        let msg: ItemRemoveMsg = new ItemRemoveMsg();
        msg.bagType = bagType;
        msg.pos = pos;
        SocketManager.Instance.send(C2SProtocol.C_BAG_REMOVE, msg);
    }

    /**
     * 向服务器发送当前地图ID, 节点ID, 命令（包括触发战斗, 触发采集）
     * @param mapId（地图ID）
     * @param nodeId（节点ID）
     * @param command（操作指令）
     *
     */
    public sendSessionOverToBattle(mapId: number, nodeId: number, command: number) {
        Logger.base("[SocketSendManager]触发战斗|触发采集", mapId, nodeId, command)
        let msg: CallBackReqMsg = new CallBackReqMsg();
        msg.mapId = mapId;
        msg.nodeId = nodeId;
        msg.cmd = command;
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_CALLBACK, msg);
    }

    /**
     * 通知后端使用变性卡
     * @param pos
     *
     */
    public sendUseSexChangeCard(pos: number) {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("yishi.service.managers.SocketSendManager.sendUseSexChangeCard");
        SimpleAlertHelper.Instance.Show(undefined, null, prompt, content, confirm, cancel, (b: boolean, flag: boolean) => {
            if (b) {
                this.sendUseItem(pos);
            }
        });
    }

    /**
     *战斗时使用物品
     * @param battleId 战斗ID编号(BattleManager.Instance.battleModel.battleId)
     * @param livingId 角色在当前战斗中的id, 每场战斗不一样。由战斗服务器动态创建 （详见RoleInfo.as)
     * @param skillId 技能ID
     *
     */
    public sendUseItemInBattle(battleId: string, livingId: number, skillId: number) {
        let msg: BattleItemMsg = new BattleItemMsg();
        msg.userId = livingId;
        msg.skillTempId = skillId;
        msg.battleId = battleId;
        SocketManager.Instance.send(C2SProtocol.B_USE_ITEM, msg);
    }

    /**
     *设置自动攻击模式  战斗未结束发送至战斗服
     * @param battleId 战斗ID
     * @param mode 自动战斗标志（1: 开始自动战斗, 2: 取消自动战斗）
     *
     */
    public sendAutoAttack(battleId: string, mode: number) {
        let msg: AttackModeMsg = new AttackModeMsg();
        msg.serverName = PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
        msg.battleId = battleId;
        msg.armyId = ArmyManager.Instance.army.id;
        msg.mode = mode;//1自动;2取消
        SocketManager.Instance.send(C2SProtocol.B_SET_ATUO_ATTACK, msg);
    }
    
    /**
     *设置自动攻击模式  战斗已结束发送至逻辑服
     * @param mode 自动战斗标志（1: 开始自动战斗, 2: 取消自动战斗）
     */
    public sendAutoAttackBattleOver(mode: number) {
        let msg: AttackModeMsg = new AttackModeMsg();
        msg.mode = mode;//1自动;2取消
        SocketManager.Instance.send(C2SProtocol.C_SET_ATUO_ATTACK, msg);
    }

    /**
     *获取邀请大厅玩家列表
     *
     */
    public sendRefreshInviteHall() {
        SocketManager.Instance.send(C2SProtocol.U_C_CAMPAIGN_INVITE_PLAYER_LIST);
    }

    /**
     *冷却挑战时间
     * @param type（值为0  代表玩家竞技挑战冷却, 1  代表英灵竞技挑战冷却）
     *
     */
    public sendCoolColosseun(type: number = 0, useBind: boolean = true) {
        let msg: PayTypeMsg = new PayTypeMsg();
        if (!useBind) {
            msg.payType = 1;
        }
        else {
            msg.payType = 2;
        }
        msg.type = type;
        SocketManager.Instance.send(C2SProtocol.C_QUICKCOOL_CHALLENGE_TIME, msg);
    }

    /**
     *设置拒绝添加好友
     *
     */
    public sendFriendRefuse() {
        SocketManager.Instance.send(C2SProtocol.C_FRIEND_REFUSE);
    }

    /**
     *设置拒绝玩家邀请
     *
     */
    public sendRefuseInvite() {
        SocketManager.Instance.send(C2SProtocol.C_ROOM_REFUSE);
    }

    /**
     *设置拒绝玩家组队邀请
     *
     */
    public sendRefuseTeamInvite() {
        SocketManager.Instance.send(C2SProtocol.C_TEAM_REFUSE);
    }

    /**
     * 请求玩家设置
     * @param optType 
     * @param result 0可以 1 拒绝 
     */
    public reqPlayerSetting(optType: number, result: number, value?: string) {
        let msg: PlayerSettingMsg = new PlayerSettingMsg();
        msg.optType = optType;
        msg.result = result;
        msg.value = value;
        SocketManager.Instance.send(C2SProtocol.C_PLAYER_SETTING, msg);
    }

    /**
     *请求地下迷宫数据
     * @param index （1: 深渊迷宫, 0: 普通迷宫）
     *
     */
    public requestTowerInfo(index: number) {
        let msg: TowerInfoReqMsg = new TowerInfoReqMsg();
        msg.index = index;
        SocketManager.Instance.send(C2SProtocol.C_TOWER_INFO, msg);
        Logger.info("SocketSendManager requestTowerInfo index==",msg.index);
    }


    /**
     *发送迷宫玩家复活
     *
     */
    public sendTowerRiver(useBind: boolean = true) {
        let msg: PayTypeMsg = new PayTypeMsg();
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        SocketManager.Instance.send(C2SProtocol.C_TOWER_LIVE, msg);
    }

    /**
     *发送引导QTE完成
     *
     */
    public sendQteGuideComplete() {
        SocketManager.Instance.send(C2SProtocol.C_GUIDE_FINISHED);
    }

    /**
     * 发送改名
     * @param nick  新昵称
     * @param type  改名类型（1为改名卡改名, 2为合区改名）
     * @param pos  使用物品位置
     */
    public sendRename(nick: string, type: number, pos: number = 0) {
        let msg: PlayerRenameReqMsg = new PlayerRenameReqMsg();
        msg.nickName = nick;
        msg.type = type;
        msg.pos = pos;
        SocketManager.Instance.send(C2SProtocol.C_PLAYER_RENAME_REQ, msg);
    }

    /**
     * 发送副本世界邀请
     * @param inviteContent （发送的数据内容）
     *
     */
    public sendQuickInvite(inviteContent: string[]) {
        let msg: CaptainSpeakMsg = new CaptainSpeakMsg();
        msg.inviteContent = inviteContent;
        SocketManager.Instance.send(C2SProtocol.C_CAPTAIN_SPEAK, msg);
    }

    /**
     * 取消拉矿
     *
     */
    public sendCancelTransport() {
        SocketManager.Instance.send(C2SProtocol.C_CANCEL_TRANS);
    }

    /**
     * 领取充值回馈礼包、请求用户充值回馈信息
     * @param id 充值/消费活动ID
     * @param sonId 礼包id
     * @param type （1: 查询, 2: 领取）
     *
     */
    public sendGetFeedBack(id: string, sonId: string, type: number) {
        let msg: RebateOpMsg = new RebateOpMsg();
        msg.id = id;
        msg.packageid = sonId;
        msg.op = type;//1.查询 2.领取
        SocketManager.Instance.send(C2SProtocol.C_REBATE_DATA, msg);
    }

    // /**
    //  * 发送退出战斗（游戏中没用到）
    //  *
    //  */
    // public sendRemoveBattle()
    // {
    //     let msg:BattleReqMsg = new BattleReqMsg();
    //     msg.battleId = BattleManager.Instance.battleModel.battleId;
    //     SocketManager.Instance.send(C2SProtocol.B_REMOVE_BATTLE, msg);
    // }

    /**
     * 发送撤退战斗 //0=发起撤退  1=同意  2=拒绝
     *
     */
    public sendWithDrawBattle(widthDraw:number)
    {
        Logger.info("发送撤退", widthDraw)
        let msg:BattleReqMsg = new BattleReqMsg();
        msg.battleId = BattleManager.Instance.battleModel.battleId;
        msg.otherObj = widthDraw;
        SocketManager.Instance.send(C2SProtocol.B_WITHDRAW_BATTLE, msg);
    }

    /**
     * 农场
     * @param msg
     *
     */
    public sendMsg(msg: Message<any>) {
        SocketManager.Instance.send(C2SProtocol.C_CC, msg);
    }

    public enterPetLand(petLandId: number = 20000) {
        let msg: CampaignReqMsg = new CampaignReqMsg();
        msg.paraInt1 = petLandId;
        SocketManager.Instance.send(C2SProtocol.C_ENTER_PETISLAND, msg);
    }

    /** 天空之城 采集完成 */
    public sendSpaceCollectOver(node: SpaceNode) {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param1 = node.nodeId;
        SocketManager.Instance.send(C2SProtocol.C_SPACE_COLLECTION_FINISHED, msg);
    }

    public enterCastle(flag: boolean = false) {
        let msg: PropertyMsg = new PropertyMsg();
        msg.param7 = flag;
        SocketManager.Instance.send(C2SProtocol.C_ENTER_CASTLE, msg);
    }

    public challengeSelf(tid: number) {
        let msg: QuestInfo = new QuestInfo();
        msg.templateId = tid;
        SocketManager.Instance.send(C2SProtocol.C_CHALLENGE_SELF, msg);
    }

    public vipCustomAdd() {
        SocketManager.Instance.send(C2SProtocol.C_VIPCUSTOM_ADD);
    }

    /**批量移入公会宝箱 */
    public sendOneMoveBagToBag(arr: Array<GoodsInfo>, beginBagType: number = BagType.Player, endBagType: number = BagType.Storage) {
        let msg: ItemMoveReqMsg = new ItemMoveReqMsg();
        msg.beginBagType = beginBagType;
        msg.endBagType = endBagType;
        let selledItemInfo: SelledItemInfo;
        let selledItemInfoArr: Array<SelledItemInfo> = [];
        for (let i: number = 0; i < arr.length; i++) {
            selledItemInfo = new SelledItemInfo();
            selledItemInfo.count = arr[i].count;
            selledItemInfo.pos = arr[i].pos;
            selledItemInfoArr.push(selledItemInfo);
        }
        msg.moveItemInfos = selledItemInfoArr;
        SocketManager.Instance.send(C2SProtocol.C_BAG_BATCH_MOVE, msg);
    }
}