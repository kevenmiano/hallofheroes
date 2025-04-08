/**
* @author:pzlricky
* @data: 2021-05-25 12:27
* @description 新手节点信息类
*/
export default class NewbieSubNodeInfo {

    /**
     * 节点id
     */
    public nodeId: number;
    public actionType: string;
    /**
     * 触发条件
     */
    public conditions: Array<any>;
    /**
     * 触发条件参数
     */
    public conditionParams: Array<any>;
    /**
     * 触发条件取反（1取反, 0正常）
     */
    public conditionInverted: Array<any>;
    /**
     * 触发条件符号（0并且, 1或）
     */
    public conditionSymbol: number;
    /**
     * 跳过条件
     */
    public skipConditions: Array<any>;
    /**
     * 跳过条件参数
     */
    public skipConditionParams: Array<any>;
    /**
     * 跳过条件取反（1取反, 0正常）
     */
    public skipConditionInverted: Array<any>;
    /**
     * 跳过条件符号（0并且, 1或）
     */
    public skipConditionSymbol: number;
    /**
     * 回退条件
     */
    public backConditions: Array<any>;
    /**
     * 回退条件参数
     */
    public backConditionParams: Array<any>;
    /**
     * 回退条件取反（1取反, 0正常）
     */
    public backConditionInverted: Array<any>;
    /**
     * 回退条件符号（0并且, 1或）
     */
    public backConditionSymbol: number;
    /**
     * 回退id
     */
    public backId: number;
    /**
     * 延迟执行时间（毫秒）
     */
    public delayTime: number = -1;
    /**
     * 是否需要等待才能完成
     */
    public needWaitForComplete: boolean;
    /**
     * 保存节点id
     */
    public saveId: number;
    /**
     * 节点此步可记录完成
     */
    public recordFinish: number;
    /**
     * 节点描述
     */
    public desc: string;


    private _actionFunc: Function;
    /**
     * 指引动作函数
     */
    public get actionFunc(): Function {
        return this._actionFunc;
    }
    public set actionFunc(value: Function) {
        this._actionFunc = value;
        if (this._actionFunc == null) {
            throw new Error("请为nodeId=" + this.nodeId + "的节点配置actionFunc");
            return;
        }
    }

    private _actionParams: Array<any>;
    /**
     * 指引动作参数
     */
    public get actionParams(): Array<any> {
        return this._actionParams;
    }
    public set actionParams(value: Array<any>) {
        this._actionParams = value;
    }

    private _nextId: number;
    /**
     * 下一节点id
     */
    public get nextId(): number {
        return this._nextId;
    }
    public set nextId(value: number) {
        this._nextId = value;
        if (this._nextId == 0) {
            throw new Error("请为nodeId=" + this.nodeId + "的节点配置nextId");
            return;
        }
    }

    public clear() {
        this._actionFunc = null;
        if (this._actionParams) this._actionParams.length = 0; this._actionParams = null;
        if (this.conditions) this.conditions.length = 0; this.conditions = null;
        if (this.conditionParams) this.conditionParams.length = 0; this.conditionParams = null;
        if (this.conditionInverted) this.conditionInverted.length = 0; this.conditionInverted = null;
        if (this.skipConditions) this.skipConditions.length = 0; this.skipConditions = null;
        if (this.skipConditionParams) this.skipConditionParams.length = 0; this.skipConditionParams = null;
        if (this.skipConditionInverted) this.skipConditionInverted.length = 0; this.skipConditionInverted = null;
        if (this.backConditions) this.backConditions.length = 0; this.backConditions = null;
        if (this.backConditionParams) this.backConditionParams.length = 0; this.backConditionParams = null;
        if (this.backConditionInverted) this.backConditionInverted.length = 0; this.backConditionInverted = null;
        this.desc = null;
    }

}