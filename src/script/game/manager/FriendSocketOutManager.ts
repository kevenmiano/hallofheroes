import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { BaseSnsInfo } from "../datas/BaseSnsInfo";
import RecentContractsStateReqMsg = com.road.yishi.proto.chat.RecentContractsStateReqMsg;
import FriendRelationMsg = com.road.yishi.proto.friend.FriendRelationMsg;
import MoveFriendReqMsg = com.road.yishi.proto.friend.MoveFriendReqMsg;
import FriendGroupMsg = com.road.yishi.proto.simple.FriendGroupMsg;
import FriendSearchConditionReqMsg = com.road.yishi.proto.simple.FriendSearchConditionReqMsg;
import FriendSearchNickNameReqMsg = com.road.yishi.proto.simple.FriendSearchNickNameReqMsg;
import FriendAddedMsgAct = com.road.yishi.proto.friend.FriendAddedMsgAct;
import BatchFriendRelationMsg = com.road.yishi.proto.friend.BatchFriendRelationMsg;


/**
 *好友信息及操作与服务器的相关交互
 */
export class FriendSocketOutManager {
    /**
     * 添加好友
     * @param name  玩家昵称
     * @param relation   玩家关系
     */
    public static sendAddAllFriend(otherId: number[], relation: number) {
        let msg: BatchFriendRelationMsg = new BatchFriendRelationMsg();
        msg.relation = relation;
        msg.otherId = otherId;
        SocketManager.Instance.send(C2SProtocol.CH_BATCHADD_RELATIONSHIP, msg);
    }

    /**
     * 添加好友
     * @param name  玩家昵称
     * @param relation   玩家关系
     */
    public static sendAddFriendRequest(name: string, relation: number, reqId: string = "") {
        let msg: FriendRelationMsg = new FriendRelationMsg();
        msg.nickName = name;
        msg.relation = relation;
        msg.reqId = reqId;
        SocketManager.Instance.send(C2SProtocol.U_CH_ADD_RELATIONSHIP, msg);
    }

    /**
     * 添加好友验证
     * @param name  玩家昵称
     * U_FRIENDADD_CONFIRM
     */
    public static sendFriendAddConfirm(name: string) {
        let msg: FriendRelationMsg = new FriendRelationMsg();
        msg.nickName = name;
        SocketManager.Instance.send(C2SProtocol.U_CH_FRIENDADD_CONFIRM, msg);
    }

    /**
     * 删除好友
     * @param fid  好友ID
     *
     */
    public static sendRemoveFriendRequest(fid: number) {
        let msg: FriendRelationMsg = new FriendRelationMsg();
        msg.otherId = fid;
        SocketManager.Instance.send(C2SProtocol.U_CH_REMOVE_RELATIONSHIP, msg);
    }

    /**
     *请求好友推荐列表
     * @param userID
     *
     */
    public static sendRecommendFriend() {
        SocketManager.Instance.send(C2SProtocol.U_CH_RECOMMENDLIST);
    }

    /**
     *发送添加好友分组
     * @param name  分组名
     */
    public static sendAddGroup(name: string) {
        let msg: FriendGroupMsg = new FriendGroupMsg();
        msg.groupName = name;
        SocketManager.Instance.send(C2SProtocol.CH_ADD_GROUP, msg);
    }

    /**
     *发送删除好友分组
     * @param id  分组ID
     *
     */
    public static sendDelGroup(id: number) {
        let msg: FriendGroupMsg = new FriendGroupMsg();
        msg.groupId = id;
        SocketManager.Instance.send(C2SProtocol.CH_DEL_GROUP, msg);
    }

    /**
     *发送重命名好友分组
     * @param id  分组ID
     * @param name  新分组名
     *
     */
    public static sendRenameGroup(id: number, name: string) {
        let msg: FriendGroupMsg = new FriendGroupMsg();
        msg.groupId = id;
        msg.groupName = name;
        SocketManager.Instance.send(C2SProtocol.CH_RENAME_GROUP, msg);
    }

    /**
     *发送移动分组好友
     * @param userId  好友ID
     * @param groupId  目标分组ID
     *
     */
    public static sendMoveFriend(userId: number, groupId: number) {
        let msg: MoveFriendReqMsg = new MoveFriendReqMsg();
        msg.firendId = userId;
        msg.groupId = groupId;
        SocketManager.Instance.send(C2SProtocol.CH_FRIEND_MOVE, msg);
    }

    /**
     *发送请求最近联系人状态
     */
    public static sendReqChatState(list: any[]) {
        let msg: RecentContractsStateReqMsg = new RecentContractsStateReqMsg();
        msg.userId = list;
        SocketManager.Instance.send(C2SProtocol.CH_CHAT_STATE, msg);
    }

    /**
     *好友请求列表操作
     */
    public static sendReqFriendMsgList(op: number = 0, reqId: string = "") {
        let msg: FriendAddedMsgAct = new FriendAddedMsgAct();
        msg.op = op;
        msg.reqId = reqId;
        SocketManager.Instance.send(C2SProtocol.CH_FRIEND_REQMSG_ACT, msg);
    }

    /**
     *发送查找好友
     * @param findInfo  查找条件信息
     * @param page  查找页
     *
     */
    public static sendFindFriend(findInfo: BaseSnsInfo, page: number) {
        if (findInfo) {
            let msg: FriendSearchConditionReqMsg = new FriendSearchConditionReqMsg();
            msg.sex = findInfo.sex;
            msg.birthMonth = findInfo.birthMonth;
            msg.birthDay = findInfo.birthDay;
            msg.starId = findInfo.horoscope;
            msg.bloodType = findInfo.bloodType;
            msg.country = findInfo.country;
            msg.province = findInfo.province;
            msg.city = findInfo.city;
            msg.pageIndex = page;
            SocketManager.Instance.send(C2SProtocol.CH_FRIEND_SEARCH, msg);
        }
    }

    /**
     *发送查找好友
     * @param name  昵称
     */
    public static sendFindFriendByName(name: string) {
        if (name) {
            let msg: FriendSearchNickNameReqMsg = new FriendSearchNickNameReqMsg();
            msg.nickName = name;
            SocketManager.Instance.send(C2SProtocol.CH_FRIEND_SEARCH_NICKNAME, msg);
        }
    }
}