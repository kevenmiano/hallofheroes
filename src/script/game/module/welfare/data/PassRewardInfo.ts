import ByteArray from "../../../../core/net/ByteArray";
import BitArray from "../../../../core/utils/BitArray";
import { PassCheckEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";


/**
 * 通行证数据
 */
 export default class PassRewardInfo {

    //通行证所处的阶段 1持续期 2结算期
    private _state:number = 0 
    //活动剩余时间 单位秒
    private _leftTime:number = 0 
    //基础版 奖励领取状态 位运算
    private _baseReward: ByteArray = new ByteArray();
    //进阶版 奖励领取状态 位运算
    private _advancedReward: ByteArray = new ByteArray();
    //是否开通了进阶版, true 开通 false 未开通
    public isPay: boolean = false;
    /** 二进制保存的基础版奖励领取状态 */
    private _baseByteArr: BitArray;
    /** 二进制保存的进阶版奖励领取状态 */
    private _advanceByteArr: BitArray;

    private _passIndex = 0;// 期数,第xx期
    private _rewardGrade = 0; //溢出奖励, 已领取等级
    
    public get leftTime() : number {
        return this._leftTime;
    }

    constructor(){
        this._baseByteArr = new BitArray();
        this._advanceByteArr = new BitArray();
    }
    
    public set leftTime(v : number) {
        this._leftTime = v;
        if (this._leftTime > 0) {
            Laya.timer.clear( this, this.__updateTimeHandler);
            Laya.timer.loop(1000, this, this.__updateTimeHandler);
        }
    }
    
    /**
     * 解析服务器传过来的字节数据
     * @param v 
     */
    public setBaseReward(v : Uint8Array) {
        this._baseReward = new ByteArray();
        this._baseReward.writeArrayBuffer(v);
        this._baseReward.position = 0;
        this._baseByteArr.clear();
        for (var i: number = 0; i < this._baseReward.length; i++) {
            this._baseByteArr.writeByte(this._baseReward.readByte());
        }
    }

    public get rewardGrade(): number {
        return this._rewardGrade;
    }
    public set rewardGrade(value: number) {
        this._rewardGrade = value;
    }

    public get passIndex(): number {
        return this._passIndex;
    }
    public set passIndex(value: number) {
        this._passIndex = value;
    }

    public get state(): number {
        return this._state;
    }
    public set state(value: number) {
        this._state = value;
    }

    public get baseReward(): ByteArray {
        return this._baseReward;
    }
    public set baseReward(value: ByteArray) {
        this._baseReward = value;
    }

    /**
     * 解析服务器传过来的字节数据
     * @param v 
     */
    public setAdvanceReward(v : Uint8Array) {
        this._advancedReward = new ByteArray();
        this._advancedReward.writeArrayBuffer(v);
        this._advancedReward.position = 0;

        this._advanceByteArr.clear();
        for (var i: number = 0; i < this._advancedReward.length; i++) {
            this._advanceByteArr.writeByte(this._advancedReward.readByte());
        }
    }
    public get advancedReward(): ByteArray {
        return this._advancedReward;
    }

    public set advancedReward(value: ByteArray) {
        this._advancedReward = value;
    }
    
    
    /**
     * 指定等级的基础奖励是否已领取
     * @param grade 
     * @returns true 已领取
     */
    public isReceivedBase(grade: number): boolean {
        if (!this._baseByteArr) {
            return false;
        }
        if (grade > this._baseByteArr.length * 8 || grade < 1) {
            return false;
        }
        grade--;
        let index: number = Math.floor(grade / 8);
        let offset: number = grade % 8;
        let tmp: any = this._baseByteArr.__get(index)
        let result: number = tmp & (0x01 << offset);
        return result != 0;
    }

    /**
     * 指定等级的进阶奖励是否已领取
     * @param grade 
     * @returns 
     */
    public isReceivedAdvance(grade: number): boolean {
        if (!this._advanceByteArr) {
            return false;
        }
        if (grade > this._advanceByteArr.length * 8 || grade < 1) {
            return false;
        }
        grade--;
        let index: number = Math.floor(grade / 8);
        let offset: number = grade % 8;
        let tmp: any = this._advanceByteArr.__get(index)
        let result: number = tmp & (0x01 << offset);
        return result != 0;
    }

    __updateTimeHandler() {
        this._leftTime--;
        if(this._leftTime <= 0){
            Laya.timer.clear( this, this.__updateTimeHandler);
            NotificationManager.Instance.dispatchEvent(PassCheckEvent.PASS_TIME_VOER);
            FrameCtrlManager.Instance.exit(EmWindow.Welfare);
        }
    }
    
    

}