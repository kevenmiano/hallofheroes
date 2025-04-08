
export default class MaskLockOper {

    private static _ins: MaskLockOper;

    private _target: any;

    private _callBack: Function;

    public static get Instance(): MaskLockOper {
        if (this._ins == null) this._ins = new MaskLockOper();
        return this._ins;
    }

    public regist(target: any, $callBack: Function) {
        this._target = target;
        this._callBack = $callBack;
    }

    public unRegist() {
        this._callBack = null;
    }

    public doCall(...arg) {
        if (this._callBack != null) this._callBack.apply(this._target, arg);
    }

}