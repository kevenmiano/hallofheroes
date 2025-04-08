// @ts-nocheck
import GameEventDispatcher from "../event/GameEventDispatcher";

export class ServerDataManager extends GameEventDispatcher {
    /**单帧消息派发超时时间*/
    public timeout: number = 10;
    /** 消息锁 */
    protected _isBlock: boolean = false;
    /** 消息队列 */
    protected _msgs: Array<any> = [];

    protected hasReceiveData: boolean = false;//是否收到数据

    constructor() {
        super();
    }

    private static _instance: ServerDataManager;


    public static get Instance(): ServerDataManager {
        return ServerDataManager._instance || (ServerDataManager._instance = new ServerDataManager());
    }

    public add(msgCode: number, data: any) {
        this.hasReceiveData = false;
        this._msgs.push(String(msgCode), data);
        !this._isBlock && this.dispatchMsg();
    }

    public set(msgCode: number, data: any) {
        this._msgs.push(String(msgCode), data);
    }

    /**
     * 直接派发数据更新事件, 功能同event
     * @param    type 事件类型
     * @param    data 数据
     */
    public notify(type: number, data: any = null) {
        this.dispatchEvent(String(type), data);
    }

    /**
     * 监听消息
     * @param id 协议号
     * @param caller 执行域
     * @param fun 回调函数
     * @param params 参数
     */
    public static listen(id: number, caller: Object, fun: Function, params: Array<any> = null) {
        ServerDataManager.Instance.addEventListener(String(id), fun, caller);
    }

    /**
     * 取消监听
     * @param id 协议号
     * @param caller 执行域
     * @param fun 回调函数
     */
    public static cancel(id: number, caller: Object, fun: Function) {
        ServerDataManager.Instance.removeEventListener(String(id), fun, caller);
    }

    public static asyncListen(id: number): any {
        return new Promise((resolve, reject) => {
            ServerDataManager.listen(id, ServerDataManager, (data) => {
                resolve(data);
            });
        })
    }

    private dispatchMsg(): any {
        this._isBlock = true;
        while (this._msgs.length) {
            let code: string = this._msgs.shift();
            let data: any = this._msgs.shift();
            this.dispatchEvent(code, data);
            if (Laya.stage.getTimeFromFrameStart() > this.timeout) {
                Laya.timer.frameOnce(1, this, this.dispatchMsg);
                return;
            }
        }
        this._isBlock = false;
    }

    public clearAll() {
        this.offAll();
    }
}