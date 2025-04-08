// @ts-nocheck
import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { PetData } from "../module/pet/data/PetData";
import { RemotePetFriendInfo } from "../mvc/model/remotepet/RemotePetFriendInfo";
import { RemotePetModel } from "../mvc/model/remotepet/RemotePetModel";
import { PlayerManager } from "./PlayerManager";
import RemotePetMsg = com.road.yishi.proto.remotepet.RemotePetMsg;
import RemoteFriendPetMsg = com.road.yishi.proto.remotepet.RemoteFriendPetMsg;
import FriendPetMsg = com.road.yishi.proto.remotepet.FriendPetMsg;
import RemoteItemMsg = com.road.yishi.proto.remotepet.RemoteItemMsg;
import RemotePetOpMsg = com.road.yishi.proto.remotepet.RemotePetOpMsg;
import PetSiteMsg = com.road.yishi.proto.remotepet.PetSiteMsg;
import RemoteFriendPetOpMsg = com.road.yishi.proto.remotepet.RemoteFriendPetOpMsg;
import PetInfoMsg = com.road.yishi.proto.pet.PetInfoMsg;
import Logger from "../../core/logger/Logger";
export class RemotePetManager {

    private _model: RemotePetModel;

    private static _instance: RemotePetManager;

    public constructor() {
        this._model = new RemotePetModel();
    }

    public static get Instance(): RemotePetManager {
        if (!this._instance) this._instance = new RemotePetManager();
        return this._instance;
    }

    public get model(): RemotePetModel {
        return this._model;
    }

    public setup() {
        ServerDataManager.listen(S2CProtocol.U_C_REMOTE_PET_MSG, this, this.__remotePetHandler);
        // ServerDataManager.listen(S2CProtocol.U_CH_REMOTE_FRIEND_PETLIST, this, this.__friendListHandler);
        // ServerDataManager.listen(S2CProtocol.U_C_REMOTE_FRIEND_PETINFO, this, this.__friendPetInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_REMOTE_REWARLD, this, this.__rewarldHandler);
    }

    /**
    *远征面板的信息返回 
    * @param e
    * 
    */
    private __remotePetHandler(pkg: PackageIn) {
        let msg = pkg.readBody(RemotePetMsg) as RemotePetMsg;
        let model = this.model;
        model.isGet = msg.isGet;
        model.isFrist = msg.isFirst;
        model.skillString = msg.skillStatus;
        model.skillStatus = msg.skillStatus;
        model.rank = msg.order;
        model.petListInfo.fight = msg.fight;
        model.petListInfo.formationString = msg.pos;
        model.petListInfo.petPos = msg.pets;
        model.petListInfo.petList = [];
        let petPost = msg.pets.split("|");
        for (let item of petPost) {
            let arr = item.split(",");
            if (arr[0] != "4" && arr[0] != "5" && arr[0] != "6") {//取消休息的概念
                model.petListInfo.petList[arr[0]] = this.playerInfo.getPet(+arr[1]);
            }
        }
        model.turnInfo.specialIndex = msg.specialIndex;
        model.turnInfo.currTurn = msg.nowIndex + 1;
        model.turnInfo.maxTurn = msg.MaxIndex;
        model.turnInfo.goodsList = msg.items;
        model.mopupCount = msg.sweepIndex;
        model.lastOrder = msg.lastOrder;
        model.commit();

    }

    /**
     *好友英灵的列表返回 
     * @param e
     * 
     */
    private __friendListHandler(pkg: PackageIn) {
        let msg = pkg.readBody(RemoteFriendPetMsg) as RemoteFriendPetMsg;
        this.model.friendList = [];
        var friendInfo: RemotePetFriendInfo;
        for (var item of msg.pets) {
            friendInfo = new RemotePetFriendInfo();
            friendInfo.friendId = item.friendId;
            friendInfo.petId = item.petId;
            friendInfo.petFight = item.petFight;
            friendInfo.petQuality = item.petQuality;
            friendInfo.petType = item.petType;
            friendInfo.petName = item.petName;
            friendInfo.friendName = item.friendName;
            friendInfo.petTempId = item.petTempId;
            this.model.friendList.push(friendInfo);
        }
        this.model.commitFriend();
    }
    /**
     *好友英灵的信息返回 
     * @param e
     * 
     */
    private __friendPetInfoHandler(pkg: PackageIn) {
        let msg = pkg.readBody(PetInfoMsg) as PetInfoMsg;
        let friendPet: PetData = PetData.createWithMsg(msg);
        this.model.petListInfo.petList[7] = friendPet;
        this.model.petChange([friendPet]);
        this.model.commit();
    }

    private __rewarldHandler(pkg: PackageIn) {

        let msg = pkg.readBody(RemoteItemMsg) as RemoteItemMsg;
        if (msg.type == 2)//扫荡奖励
        {
            let obj = { count: msg.count, items: msg.items }
            this.model.mopupList.push(obj);
            this.model.updateMopup(obj);
        }
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }
    /**
     * 保存英灵远征界面设置信息
     * 
     */
    public saveRemotePetInfo(flag: boolean = false) {
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = 2;
        if (this.model.petListInfo.formationString == "") {
            this.model.petListInfo.formationString = "-1,-1,-1,-1,-1,-1,-1,-1";
        }
        msg.pos = this.model.petListInfo.formationString;
        let arr: PetSiteMsg[] = [];
        for (var i in this.model.petListInfo.petList) {
            if (this.model.petListInfo.petList[i]) {
                var petData: PetData = this.model.petListInfo.petList[i];
                var itemMsg: PetSiteMsg = new PetSiteMsg();
                itemMsg.petId = petData.petId;
                itemMsg.site = +(i);
                itemMsg.skills = petData.remotePetSkillsOfString;
                arr.push(itemMsg);
            }
        }
        msg.isFirst = flag;
        msg.pets = arr;
        Logger.info("保存英灵远征设置信息", msg)
        RemotePetManager.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }

    public sendFight(value: number, flag: boolean = false) {
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = 6;
        msg.index = value;
        msg.isSpecial = flag;
        RemotePetManager.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }
    /**
     * 请求英灵远征信息
     * 
     */
    public static sendRemotePetInfo() {
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = 1;
        this.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }
    /**
     * 技能升级
     * 
     */
    public static sendUpdateSkill(value: number) {
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = 5;
        msg.skillId = value;
        this.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }
    /**
     * 查询好友英灵
     * 
     */
    public static sendFriendPetList() {
        let msg: RemoteFriendPetOpMsg = new RemoteFriendPetOpMsg();
        msg.op = 1;
        this.sendProtoBuffer(C2SProtocol.CH_REMOTE_FRIEND_PET, msg);
    }
    /**
     * 选定英灵
     * 
     */
    public static sendFriendPetInfo(fID: number, pID: number) {
        let msg: RemoteFriendPetOpMsg = new RemoteFriendPetOpMsg();
        msg.op = 2;
        msg.friendId = fID;
        msg.petId = pID;
        this.sendProtoBuffer(C2SProtocol.CH_REMOTE_FRIEND_PET, msg);
    }
    /**
     * 扫荡
     * 
     */
    public static sendMopup(count: number) {
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = 7;
        msg.sweepIndex = count;
        this.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }
    /**
     * 扫荡加速或者取消
     * 
     */
    public static sendMopupOP(op: number, payType: number) {
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = op;
        msg.payType = payType;
        this.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }
    public static sendProtoBuffer(code: number, pkg: any) {
        SocketManager.Instance.send(code, pkg);
    }


    /**
     * 选择英灵技能
     * @param petId  英灵id
     * @param skills 
     * 
     */
    public static sendPetSkills(petId: number, skills: string) {
        
        let itemMsg: PetSiteMsg = new PetSiteMsg();
        itemMsg.petId = petId;
        itemMsg.skills = skills;
        let msg: RemotePetOpMsg = new RemotePetOpMsg();
        msg.op = 2;
        msg.pets = [itemMsg];

        Logger.info("保存英灵远征设置信息", msg)
        this.sendProtoBuffer(C2SProtocol.C_REMOTE_PET_OP, msg);
    }
}