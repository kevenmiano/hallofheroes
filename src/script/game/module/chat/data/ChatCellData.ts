// @ts-nocheck
import UserType from "../../../constant/UserType";
import ChatCellType from "./ChatCellType";

/**
* @author:pzlricky
* @data: 2021-03-15 12:26
* @description *** 
*/
export default class ChatCellData {

    private _cellData: any;
    private _emojiUrl: string = ''
    private _msgcontent: string = '';

    public channel: number;
    public userId: number;
    public nickName: string = "";  //发送者昵称
    public serverName: string;
    public consortiaId: number;
    public appellId: number = 0;
    public vipGrade: number;
    public userType: number;
    public cellType: number;
    public text: string = "";
    public data: any;
    public faceLink: string = "";
    public receiverName: string;  //接收者昵称
    public fight:number = 0;
    public consortName:string = "";
    public userLevel:number = 0;
    public point:Laya.Point;
    public headId:number = 0;
    public frameId:number = 0;
    public job:number = 0;
    public cellContentElement() {
        switch (this.cellType) {
            case ChatCellType.GM:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.GUIDER:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.APPELL:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.VIP:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.FIRST_PLAYER:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.POPULAR_PLAYER:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.FIRST_CONSORTIA:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.GENERAL:
                this._msgcontent = this.text;
                break;
            case ChatCellType.Player:
                this._emojiUrl = this.faceLink;
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.CHANNEL:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.CONSORTIA:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.ROOM:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.STAR:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.MAGIC_CARD:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.EQUIP:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.PROP:
                this._msgcontent = this.createLinkTxt();
                break
            case ChatCellType.VipLink:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.EXPRESSION:
                this._emojiUrl = this.faceLink;
                break;
            case ChatCellType.APPELL_LINK:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.ROSE_BACK:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.WEB_LINK:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.REINFORCE:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.FISH:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.SEEK_LINK:
                this._msgcontent = this.createLinkTxt();
                break;
            case ChatCellType.OUTERCITY_ATTACK_BOSS:
                this._msgcontent = this.createLinkTxt();
                break;
        }
    }

    public get msgcontent(): string {
        return this._msgcontent;
    }

    private createLinkTxt(): string {
        (this.cellType != ChatCellType.Player && this.cellType != ChatCellType.CHANNEL);
        if ((this.userType != UserType.GM) && (this.vipGrade >= 0)) {
            this.text = "[url='event:']" + this.text + "[/url]";
        }
        return this._msgcontent;
    }


    /**单条数据(包括表情以及) */
    public set cellData(value: ChatCellData) {
        this._cellData = value;
        if (!this._cellData) return;
        this.channel = value.channel;
        this.userId = value.userId;
        this.nickName = value.nickName;  //发送者昵称
        this.serverName = value.serverName;
        this.consortiaId = value.consortiaId;
        this.vipGrade = value.vipGrade;
        this.userType = value.userType;
        this.cellType = value.cellType;
        this.text = value.text;
        this.faceLink = value.faceLink;
        this.receiverName = value.receiverName;  //接收者昵称
        this.cellContentElement();
    }

    /**单条数据(包括表情以及) */
    public get cellData(): ChatCellData {
        return this._cellData;
    }

    public dispose() {
        this.channel = 0;
        this.userId = 0;
        this.serverName = "";
        this.text = "";
        this.faceLink = "";
        this.consortiaId = 0;
        this.vipGrade = 0;
        this.cellType = 0;
        this.userType = 0;
        this.data = null;
    }

}