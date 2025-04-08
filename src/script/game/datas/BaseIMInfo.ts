import ChatData from "../module/chat/data/ChatData";

/**
 * 
 */
export default class BaseIMInfo {
    /**称号Id**/
    public appellId = 0;
    /**
     *信息发送者ID 
     */
    public userId: number = 0;
    /**
     *信息发送者昵称 
     */
    public nickName: string;
    /**
     *发送对象ID 
     */
    public toId: number = 0;
    /**
     *信息内容 
     */
    public msg: string;
    /**
     *发送时间 
     */
    public date: Date;
    public sendTime: string = '';
    /**
     *发送结果（自己给他人发送信息时用到, 0表示成功） 
     */
    public sendResult: number = 0;

    /**玩家登陆 */
    public userLevel: number = 0;

    /**玩家头像 */
    public headId: number = 0;

    /**玩家职业 */
    public job: number = 0;
    public voiceTime: number = 0;
    public receiveId: number = 0;
    public isRead: boolean = false;//是否已读

    public bubbleId: number = 0;//气泡ID

    public consortiaName = "";//公会名字

    public consortiaId = 0;//公会Id

    public fight: number = 0;

    serverId: string = '';

    //翻译后的语言
    private _translateMsg: string = "";

    public translateLangKey = "";

    public hashCode: number = -1;

    public frameId:number = 0;
    public constructor() {
        this.hashCode = ++ChatData.hashCode;
    }


    public get translateMsg() {
        return this._translateMsg;
    }

    public set translateMsg(v: string) {
        this._translateMsg = v;
    }

}