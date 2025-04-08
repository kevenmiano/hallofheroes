// @ts-nocheck
import { SocketManager } from "../../core/net/SocketManager";
import { C2SProtocol } from "../constant/protocol/C2SProtocol";
import EmailInfo from "../module/mail/EmailInfo";
import EmailType from "../module/mail/EmailType";

import ItemInfoReqMsg = com.road.yishi.proto.item.ItemInfoReqMsg;
import MailDelReqMsg = com.road.yishi.proto.mail.MailDelReqMsg;
import MailListReqMsg = com.road.yishi.proto.mail.MailListReqMsg;
import MailMsg = com.road.yishi.proto.mail.MailMsg;
import MailSendReqMsg = com.road.yishi.proto.mail.MailSendReqMsg;

/**
* @author:pzlricky
* @data: 2021-04-14 15:04
* @description *** 
*/
export default class EmailSocketOutManager {

    public static sendProtoBuffer(code: number, message) {
        SocketManager.Instance.send(code, message);
    }

    /**
     * @param typeArray //id列表、type列表, reqType =0 时 对应Id列表领取位置
     * @param reqType 0:按ID领取邮件附件 1:按ID读 2:按类型读 3:按类型 一键查收 4:排除战报邮件 一键查收
     */
    public static getAttached(typeArray:Array<number>,reqType:number = 0) {
        var msg: MailMsg = new MailMsg();
        msg.reqType = reqType;
        msg.mailsIdArray = typeArray;
        this.sendProtoBuffer(C2SProtocol.U_C_MAILITEM_MOVE, msg);
    }

    /**
     * 查收所有邮件 
     * @param typeArray 查收的邮件类型数组
     */
    public static getAttachAll(typeArray:Array<number>) {
        EmailSocketOutManager.getAttached(typeArray, 3);
    }

    /**
     * 领取一封邮件附件
     * @param idArray 邮件id列表
     */
    public static getAttachedOne(idArray: Array<number>) {
        EmailSocketOutManager.getAttached(idArray, 0);
    }

    /**
     * 读一封邮件
     * @param idArray 邮件id列表
     */
    public static readOneEmail(idArray: Array<number>){
        EmailSocketOutManager.getAttached(idArray, 1);
    }
   
    /**
     * 删除邮件
     * @param req_type 0:按ID删除 1:按类型列表删除 
     * @param list  //ID列表、类型列表
     * 说明:如果req_type传0,则list里面就是要删除的邮件id的列表
     * 如果如果req_type传1,则list里面就是要删除的邮件类型列表
     */
    public static deleteMail(list: Array<number>,reqType: number = 0) {
        var msg: MailDelReqMsg = new MailDelReqMsg;
        msg.delList = list;
        msg.reqType = reqType;
        this.sendProtoBuffer(C2SProtocol.U_C_MAIL_DEL, msg);
    }

    /**删除一封邮件 */
    public static deleteEmail(email: EmailInfo) {
        EmailSocketOutManager.deleteMail([email.Id], 0);
    }

    /**一键 删除普通邮件**/
    public static delNormals() {
        EmailSocketOutManager.deleteMail([EmailType.NORMAL_MAIL], 1);
    }

    /**一键 删除系统邮件**/
    public static delSystems() {
        EmailSocketOutManager.deleteMail([EmailType.SYStem_MAIL, EmailType.STAR_MAIL, EmailType.PET_MAIL], 1);
    }

    /**一键 删除战报邮件**/
    public static delBattleReports() {
        EmailSocketOutManager.deleteMail([EmailType.BATTLE_REPORT], 1);
    }

    /**
     * 发送邮件
     * @param  idList 接收邮件的玩家ID列表
     * @param  title  邮件标题
     * @param  content 邮件内容
     * @param  type  邮件类型
     */
    public static sendEmail(idList: Array<number>, title: string, content: string, type: number, useBind: boolean = true) {
        var msg: MailSendReqMsg = new MailSendReqMsg;
        msg.receiverUserId = idList;
        msg.title = title;
        msg.contents = content;
        msg.sendType = type;
        msg.payType = 0;
        if (!useBind) {
            msg.payType = 1;
        }
        this.sendProtoBuffer(C2SProtocol.U_C_MAIL_SEND, msg);
    }

    //获取邮件列表
    public static getEmailList(req_type: number = 0) {
        let msg: MailListReqMsg = new MailListReqMsg();
        msg.reqType = req_type;
        this.sendProtoBuffer(C2SProtocol.C_MAIL_LIST, msg);
    }
}