import LangManager from "../../../../core/lang/LangManager";
import { ServiceReplyInfo } from "../../../../core/utils/ServiceReplyInfo";
import { CustomerServiceEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import FrameDataBase from "../../../mvc/FrameDataBase";
import Dictionary from "../../../../core/utils/Dictionary";
/**
* @author:zhihua.zhou
* @data: 2021-12-13 16:28
* @description 客服建议反馈
*/
export default class CustomerServiceModel extends FrameDataBase {

    /**
     * 问题类型列表
     */
    public problemList: Array<any> = [];

    /**
     *接收到的回复 
    */
    public receiveMessageList: Array<any> = [];

    /**
     *客服回复时间 
    */
    private _lastReplyTime: number = 0;
    /**
     *是否已经提交过问题 
        */
    private _hasSubmit: boolean = false;

    /**
     *当前正在查看的回复信息 
    */
    private _currentReplyInfo: ServiceReplyInfo;

    public sendData: any = {};
    /**
     *图片名称 
        */
    private _fileName: string;
    /** 图片数据 */
    public picData: string = '';
    public get fileName(): string {
        return this._fileName;
    }
    public set fileName(value: string) {
        if(!value){
            this.sendData.pic_url = '';
        }
        this._fileName = value;
        NotificationManager.Instance.dispatchEvent(CustomerServiceEvent.UPLOAD_SUCCESS, value);
    }

    public get currentReplyInfo(): ServiceReplyInfo {
        return this._currentReplyInfo;
    }

    public get currentMessageId(): string {
        if (this._currentReplyInfo) {
            return this._currentReplyInfo.questionId;
        }
        return "0";
    }

    public get currentQuestionType(): number {
        if (this._currentReplyInfo) {
            return this._currentReplyInfo.type;
        }
        return 0;
    }

    public get stopReply(): number {
        if (this._currentReplyInfo) {
            return parseInt(this._currentReplyInfo.stopReply);
        }
        return 0;
    }

    public getMessage(): ServiceReplyInfo {
        if (this.receiveMessageList.length) {
            this._currentReplyInfo = this.receiveMessageList.pop() as ServiceReplyInfo;
            return this._currentReplyInfo;
        }
        return null;
    }

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        this.problemList.push(
            { id: 5, name: LangManager.Instance.GetTranslation("customerservice.CustomerServiceModel.content06") },
            { id: 7, name: LangManager.Instance.GetTranslation("customerservice.CustomerServiceModel.content08") },
            { id: 10, name: LangManager.Instance.GetTranslation("customerservice.CustomerServiceModel.content11") });

    }

    public set lashReplyTime(value: number) {
        this._lastReplyTime = value;
        this._hasSubmit = false;
    }


    /**
     * 设置提交数据
     * @param title 标题
     * @param desc 描述
     * @param date 日期
     * @param typeIdx 问题类型
     */
    setData(title: string, desc: string, date: any, typeIdx: number) {
        this.sendData.question_title = title;
        this.sendData.question_content = desc;
        this.sendData.occur_time = date;
        let type = this.problemList[typeIdx].id;
        this.sendData.question_type = type;
    }

    /**
     * 设置充值提交数据
     * @param charge_order_id 充值订单号
     * @param charge_method 充值方式
     * @param charge_moneys 充值金额
     */
    setRechargeData(charge_order_id: string, charge_method: string, charge_moneys: string) {
        this.sendData.charge_order_id = charge_order_id;
        this.sendData.charge_method = charge_method;
        this.sendData.charge_moneys = charge_moneys;
    }

    public set hasSubmit(value: boolean) {
        this._hasSubmit = value;
    }

    public get today(): Date {
        return PlayerManager.Instance.currentPlayerModel.sysCurtime;
    }

    public addReceiveMessage(dic: Dictionary): void {
        for (const key in dic) {
            if (Object.prototype.hasOwnProperty.call(dic, key)) {
                const info: ServiceReplyInfo = dic[key];
                this.receiveMessageList.push(info);
            }
        }
    }


}