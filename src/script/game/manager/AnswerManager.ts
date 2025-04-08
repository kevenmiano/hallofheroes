import GameEventDispatcher from '../../core/event/GameEventDispatcher';
import { ServerDataManager } from '../../core/net/ServerDataManager';
import { AnswerEvent } from '../constant/event/NotificationEvent';
import { S2CProtocol } from '../constant/protocol/S2CProtocol';
import { ArmyManager } from './ArmyManager';
import { ConfigManager } from './ConfigManager';
/**
* @author:pzlricky
* @data: 2021-06-07 11:45
* @description *** 
*/
export default class AnswerManager extends GameEventDispatcher {

    private _operationType: number;
    private _operationValue: number;
    /** 最低分*/
    private static SCORE_MIN: number = 1;
    /** 开启等级*/
    private static OPEN_GRADE: number = 30;

    /** 是否已初始化*/
    private _isInit: boolean = false;

    private _isUseEyes: boolean = false;

    private _isUseHeart: boolean = false;

    private _isUseDouble: boolean = false;

    private _isShowRes: boolean = false;
    /** 增加的积分*/
    private _addSocre: number = 1;
    private _isHasUseHeart: boolean = false;
    private _isShowReward: boolean = false;

    public constructor() {
        super();
    }
    /** 初始化*/
    private init() {
        this._isInit = this._isUseEyes = this._isUseHeart = this._isUseDouble = false;
        this.model.curExp = 0;
        this.model.totalSocre = 0;
    }
    private static _instance: AnswerManager;
    public static get Instance(): AnswerManager {
        if (!AnswerManager._instance) AnswerManager._instance = new AnswerManager();
        return AnswerManager._instance;
    }
    /** 启动*/
    public setup() {
        // this.model = new AnswerModel;
        this.initEvent();
    }
    /** 是否开启*/
    public isOpen(): boolean {
        if (this.model.state > 0 && ArmyManager.Instance.thane.grades >= AnswerManager.OPEN_GRADE) {
            return true;
        }
        return false;
    }
    /** 窗口是否打开*/
    private _frameIsOpen: boolean;
    /** 窗口是否打开*/
    public get frameIsOpen(): boolean {
        return this._frameIsOpen;
    }
    private _model: any;
    /**
     * 数据模型 
     * @return 
     * 
     */
    public get model(): any {
        return this._model;
    }

    public set model(value: any) {
        this._model = value;
    }

    private initEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_ANSWER_PLAYER_INFO, this, this.__recievePlayerInfoHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ANSWER_RANK_LIST, this, this.__recieveRankListHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ANSWER_SINGLER_QUESTION, this, this.__recieveSinglerQuestionHandler);
        ServerDataManager.listen(S2CProtocol.U_C_ANSWER_SYSTEM_STATE, this, this.__recieveSystemStateHandler);

        this.model.addEventListener(AnswerEvent.SELECT_ANSWER, this.__onSelectAnswerHandler);
        this.model.addEventListener(AnswerEvent.SELECT_ITEM, this.__onSelectItemHandler);
    }
    /** 
     * 选择答案</br>
     * 进行操作: 1.获得答案实际索引, 并且 改变选项状态（已选择或不可选）</br>
     * 2.智慧之心与抉择之眼 变灰
     * 3.更新道具信息
     * 4.发送更新题目信息事件
     * */
    private __onSelectAnswerHandler(evt: AnswerEvent) {
        // this._operationType = AnswerOperationTypeEnums.OPERATION_TYPE_ANSWER;
        // this._operationValue = this.model.getIndexByTmp(evt.data);
        // this.model.selectAnswer(evt.data);
        // this._isUseEyes = true;
        // this._isUseHeart = true;
        // this.updateItem();
        // this.sendRequestMsg();
        // this.model.dispatchEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData);
    }
    /** 
     * 选择道具</br>
     * 1.未正式开始, 提示错误信息。</br>
     * 2.判断状态是否正确,判断道具数量是否足够.</br>
     * 3.满足条件发送信息
     */
    private __onSelectItemHandler(evt: AnswerEvent) {
        // if (this.model.state <= 1 || this.model.state >= 5) {
        //     let str: string = "";
        //     str = this.model.state >= 5 ? LangManager.Instance.GetTranslation("answer.errinfo.end") : LangManager.Instance.GetTranslation("answer.errinfo.unstart");
        //     MessageTipManager.instance().show(str);
        //     return;
        // }
        // this._operationType = AnswerOperationTypeEnums.OPERATION_TYPE_ITEM;
        // var _curV: number = -1;
        // switch (evt.data) {
        //     case AnswerItemIDEnums.ANSWER_ITEM_DOUBLE:
        //         if (this.model.state == AnswerStateEnums.ANSWER_STATE_ASK || this.model.state == AnswerStateEnums.ANSWER_STATE_READ) {
        //             if (this.model.doubleCount > 0) {
        //                 _curV = evt.data;
        //                 this._isUseDouble = true;
        //             }
        //         }
        //         break;
        //     case AnswerItemIDEnums.ANSWER_ITEM_HEART:
        //         if (this.model.state == AnswerStateEnums.ANSWER_STATE_ASK) {
        //             if (this.model.heartCount > 0) {
        //                 _curV = evt.data;
        //                 this._isUseHeart = true;
        //             }
        //         }
        //         break;
        //     case AnswerItemIDEnums.ANSWER_ITEM_EYE:
        //         if (this.model.state == AnswerStateEnums.ANSWER_STATE_ASK) {
        //             if (this.model.eyeCount > 0) {
        //                 _curV = evt.data;
        //                 this._isUseEyes = true;
        //             }
        //         }
        //         break;
        //     default:
        //         _curV = evt.data;
        //         break;
        // }
        // if (_curV == -1) return;

        // this._operationValue = evt.data;
        this.sendRequestMsg();
    }
    /** 
     * 接收玩家信息</br>
     * 
     */
    private __recievePlayerInfoHandler(evt) {
        // trace("答题系统  >>> 玩家信息");
        // var pkg: PackageIn = evt.data as PackageIn;
        // var playerMsg: playeranswerquestionMsg = new playeranswerquestionMsg();
        // playerMsg = pkg.readBody(playerMsg) as playeranswerquestionMsg;

        // var needupdateRank: boolean = false;

        // this.model.ranKing = playerMsg.curOrder;
        // this.model.curExp = playerMsg.getEXP;
        // this.model.sucCount = playerMsg.playerAnswerSucCount;
        // this.model.extraExp = playerMsg.extraEXP;
        // var needUpdateItem: boolean = false;
        // //第一次 为初始化时的信息, 
        // if (this._isInit) {
        //     if (this.model.eyeCount > playerMsg.choiceEyesCount) {
        //         this._isUseEyes = true;
        //     }
        //     if (this.model.heartCount > playerMsg.wisdomHeartCount) {//使用智慧之心
        //         this._isUseHeart = true;
        //         this._isUseEyes = true;
        //         this._isHasUseHeart = true;
        //         this.useHeart();
        //         this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));
        //     }
        //     if (this.model.doubleCount > playerMsg.doubleBlessCount) {
        //         this._isUseDouble = true;
        //     }
        // }
        // this.model.doubleCount = playerMsg.doubleBlessCount;
        // this.model.eyeCount = playerMsg.choiceEyesCount;
        // this.model.heartCount = playerMsg.wisdomHeartCount;
        // this.updateItem();
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_ANSWER && this._addSocre == AnswerManager.SCORE_MIN) {
        //     var getsocre: number = playerMsg.currentScore - this.model.totalSocre
        //     this._addSocre = getsocre > 0 ? getsocre : this._addSocre;
        //     this.model.totalSocre = playerMsg.currentScore;
        // }
        // if (!this._isInit) {
        //     this.model.totalSocre = playerMsg.currentScore;
        // }
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_SELF_RANK, null));
        // //结束活动
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_END && this._isShowReward) {
        //     this.endActive();
        //     this._isShowReward = false;
        // }
        // this._isInit = true;
    }
    /** 接收排行榜信息*/
    private __recieveRankListHandler(evt) {
        // trace("答题系统  >>> 前十排行");
        // var pkg: PackageIn = evt.data as PackageIn;
        // var playerMsg: TenAnswerQuestionOrderMsg = new TenAnswerQuestionOrderMsg();
        // playerMsg = pkg.readBody(playerMsg) as TenAnswerQuestionOrderMsg;

        // var len: number = playerMsg.tenAQ_Info.length;
        // var tmp: Object = {};
        // var arr: Array = [];
        // for (var a: number = 0; a < len; a++) {
        //     tmp = {};
        //     tmp.rank = (playerMsg.tenAQ_Info[a] as answerquestionorderMsg).curOrder;
        //     tmp.nick = (playerMsg.tenAQ_Info[a] as answerquestionorderMsg).nickName;
        //     tmp.score = (playerMsg.tenAQ_Info[a] as answerquestionorderMsg).currentScore;
        //     arr[a] = tmp;
        // }
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_RANK, arr));
    }
    /** 接收问题信息*/
    private __recieveSinglerQuestionHandler(evt) {
        // trace("答题系统  >>> 单个问题");
        // var pkg: PackageIn = evt.data as PackageIn;
        // var playerMsg: singleranswerquestionMsg = new singleranswerquestionMsg();
        // playerMsg = pkg.readBody(playerMsg) as singleranswerquestionMsg;
        // var curID: number = this.model.curData.index;
        // trace("curID >>  " + curID);
        // trace("playerMsg.id >>  " + playerMsg.id);
        // if (curID == playerMsg.id) {
        //     this.model.curData.answer = playerMsg.answer;
        //     if (this.model.state == AnswerStateEnums.ANSWER_STATE_READ || this.model.state == AnswerStateEnums.ANSWER_STATE_ASK) {
        //         if (this.model.curData.answer > 10 && this._isUseEyes) {//答案大于10 则为2个错误答案  则说明 使用抉择之眼
        //             this.useEyes();
        //         } else if (this.model.curData.answer < 10 && this._isUseHeart) {//答案小于10 则为正确答案  则说明 使用智慧之心
        //             this.useHeart();
        //         }
        //         this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));
        //     } else if (this.model.state == AnswerStateEnums.ANSWER_STATE_ANSWER) {
        //         //公布答案阶段 收到题目信息  收到正确答案
        //         this.model.curData.answer = playerMsg.answer;
        //         this.model.rightAnswer(this.model.curData.answer);
        //         if (this.model.verAnswerRes() || this._isHasUseHeart) {
        //             this.updateRes(AnswerResultEnums.ANSWER_RESULT_RIGHT, this._addSocre);
        //         } else {
        //             this.updateRes(AnswerResultEnums.ANSWER_RESULT_ERROR, this._addSocre);
        //         }
        //         this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));
        //         this._isShowRes = true;
        //     }
        //     return;
        // }

        // var state: number = 0;
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_READ) {
        //     state = AnswerAnswerStateEnums.STATE_NOSELECT;
        //     this._isHasUseHeart = this._isUseEyes = this._isUseHeart = this._isUseDouble = false;
        // }
        // var arr: Array = [0, 1, 2, 3];
        // var curIndex: number = 0;
        // this.model.curData.index = playerMsg.id;
        // this.model.curData.topic = playerMsg.question;
        // this.model.curData.answerVec = new Vector.<AnswerData>(4);

        // curIndex = number(arr.length * Math.random());
        // this.model.curData.answerVec[arr[curIndex]] = new AnswerData;
        // this.model.curData.answerVec[arr[curIndex]].tmpIndex = arr[curIndex];
        // this.model.curData.answerVec[arr[curIndex]].index = 1;
        // this.model.curData.answerVec[arr[curIndex]].info = playerMsg.option1;
        // this.model.curData.answerVec[arr[curIndex]].state = state;
        // arr.splice(curIndex, 1);

        // curIndex = number(arr.length * Math.random());
        // this.model.curData.answerVec[arr[curIndex]] = new AnswerData;
        // this.model.curData.answerVec[arr[curIndex]].tmpIndex = arr[curIndex];
        // this.model.curData.answerVec[arr[curIndex]].index = 2;
        // this.model.curData.answerVec[arr[curIndex]].info = playerMsg.option2;
        // this.model.curData.answerVec[arr[curIndex]].state = state;
        // arr.splice(curIndex, 1);

        // curIndex = number(arr.length * Math.random());
        // this.model.curData.answerVec[arr[curIndex]] = new AnswerData;
        // this.model.curData.answerVec[arr[curIndex]].tmpIndex = arr[curIndex];
        // this.model.curData.answerVec[arr[curIndex]].index = 3;
        // this.model.curData.answerVec[arr[curIndex]].info = playerMsg.option3;
        // this.model.curData.answerVec[arr[curIndex]].state = state;
        // arr.splice(curIndex, 1);

        // curIndex = number(arr.length * Math.random());
        // this.model.curData.answerVec[arr[curIndex]] = new AnswerData;
        // this.model.curData.answerVec[arr[curIndex]].tmpIndex = arr[curIndex];
        // this.model.curData.answerVec[arr[curIndex]].index = 4;
        // this.model.curData.answerVec[arr[curIndex]].info = playerMsg.option4;
        // this.model.curData.answerVec[arr[curIndex]].state = state;
        // arr.splice(curIndex, 1);

        // this.model.curData.answer = playerMsg.answer;

        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));
        // this.updateItem();
    }
    /** 接收系统状态信息*/
    private __recieveSystemStateHandler(evt) {
        // trace("答题系统  >>> 系统状态信息");
        // var pkg: PackageIn = evt.data as PackageIn;
        // var playerMsg: SysAnswerQuestionStateMsg = new SysAnswerQuestionStateMsg();
        // playerMsg = pkg.readBody(playerMsg) as SysAnswerQuestionStateMsg;
        // var ischange: boolean = false;
        // this.model.systemTotalNum = playerMsg.sysAnswerCount;
        // this.model.systemLastNum = playerMsg.leftCount;
        // //读题状态切换到答题状态时 选项灰掉
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_READ && playerMsg.sysState == AnswerStateEnums.ANSWER_STATE_ASK) {
        //     this.model.askAnswerState();
        //     this.model.state = playerMsg.sysState;
        //     this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));

        //     this.model.selectedAnswer = -1;
        //     this._addSocre = AnswerManager.SCORE_MIN;
        // }
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_ASK && playerMsg.sysState == AnswerStateEnums.ANSWER_STATE_ANSWER) {
        //     this.model.unSelectedAnswer();
        //     this.model.state = playerMsg.sysState;
        //     this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));
        // }
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_ANSWER && playerMsg.sysState == AnswerStateEnums.ANSWER_STATE_END) {
        //     this._isShowReward = true;
        // }
        // //结束
        // if (playerMsg.sysState == AnswerStateEnums.ANSWER_STATE_END) {
        //     this.init();
        // }
        // if (playerMsg.sysState == 0 || this.model.state == 0) {
        //     this.model.state = playerMsg.sysState;
        //     NotificationManager.instance.sendNotification(NotificationEvent.ANSWER_SWITCH);
        // }
        // this.model.state = playerMsg.sysState;
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_READ) {
        //     this._isShowRes = false;
        // }
        // this.model.time = number(playerMsg.lastDate) / 1000 >> 0;
        // this.model.startTime = number(playerMsg.beginDate);
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_STATE, { state: this.model.state, time: this.model.time }));
        // trace("答题系统  >>> 状态 " + this.model.state);
    }
    /** 答题活动结束*/
    private endActive() {
        //FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.ANSWER);
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.SHOW_REWARDS, null));
    }
    /**
     * 更新结果 
     * @param result
     * @param addScore
     * 
     */
    public updateRes(result: number, addScore: number) {
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_ANSWER) {
        //     this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_RESULT, { result: result, score: addScore }));
        // }
    }
    /** 更新道具*/
    private updateItem() {
        // var arr: Array = [];
        // arr[0] = { id: 21, count: this.model.doubleCount, enble: !this._isUseDouble && this.model.doubleCount > 0 };
        // arr[1] = { id: 22, count: this.model.heartCount, enble: !this._isUseHeart && this.model.heartCount > 0 };
        // arr[2] = { id: 23, count: this.model.eyeCount, enble: !this._isUseEyes && this.model.eyeCount > 0 };
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ITEM, arr));
    }
    /** 更新排行榜*/
    private updateRank() {
        // var arr: Array = [];
        // for (var a: number = 0; a < 10; a++) {
        //     var tmp: Object = { rank: a + 1, nick: "test" + (a + 1), score: 1000 - a * 10 };
        //     arr[a] = tmp;
        // }
        // var evt: AnswerEvent = new AnswerEvent(AnswerEvent.UPDATE_RANK, arr);
        // this.model.dispatchEvent(evt);
    }
    /** 更新答题信息*/
    private updateAnswerItem() {
        // var item: AnswerItemData = new AnswerItemData;
        // item.topic = "测试! 能看到几个答案!";
        // var answer: AnswerData;
        // var arr: Array = ["A", "B", "C", "D"];
        // var index: number = 0;
        // for (var a: number = 0; a < 4; a++) {
        //     answer = new AnswerData;
        //     index = arr.length * Math.random();
        //     answer.index = arr[index];
        //     arr.splice(index, 1);
        //     answer.info = "第" + (a + 1) + "个答案!!!!!!";
        //     answer.tmpIndex = a;
        //     answer.state = Math.random() * 5;
        //     item.answerVec[a] = answer;
        // }
        // this.model.curData = item;
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, item));
    }
    /** 使用智慧之心</br>*/
    private useHeart() {
        this._isUseEyes = true;
        this.model.useHeart();
        this.updateItem();
    }
    /**
     * 使用抉择之眼</br> 
     * 去掉两个错误答案
     */
    private useEyes() {
        this.model.delErrorAnswer();
        this.updateItem();
    }
    /** 打开界面 发送进入答题系统消息*/
    public sendRequestOpenUI() {
        // this._operationType = AnswerOperationTypeEnums.OPERATION_TYPE_SYSTEM;
        // this._operationValue = 11;
        // this._frameIsOpen = true;
        // if (this.model.state == AnswerStateEnums.ANSWER_STATE_ANSWER && this._isShowRes) {
        //     if (this.model.verAnswerRes() || this._isUseHeart) {
        //         this.updateRes(AnswerResultEnums.ANSWER_RESULT_RIGHT, this._addSocre);
        //     } else {
        //         this.updateRes(AnswerResultEnums.ANSWER_RESULT_ERROR, this._addSocre);
        //     }
        //     this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_ANSWER, this.model.curData));
        // }
        // this.model.dispatchEvent(new AnswerEvent(AnswerEvent.UPDATE_SELF_RANK, null));
        // this.sendRequestMsg();
    }
    /** 关闭界面 发送退出答题系统消息*/
    public sendRequestCloseUI() {
        // this._isInit = false;
        // this._frameIsOpen = false;
        // this._operationType = AnswerOperationTypeEnums.OPERATION_TYPE_SYSTEM;
        // this._operationValue = 12;
        // this.sendRequestMsg();
    }
    /** 发送请求消息*/
    public sendRequestMsg() {
        // var pkg: PackageOut = new PackageOut(ProtocolType.C_ANSWER_REQUEST_OPTION);
        // var msg: AnswerquestionReqMsg = new AnswerquestionReqMsg();
        // msg.type = this._operationType;
        // msg.count = this._operationValue;
        // SocketSendManager.instance.sendProtoBuffer(pkg, msg);
    }

}