export default class LogicObject {

    public data: any;

    public callBackFunction(fun: Function) {
        if (fun == null) return;
        if (fun.length > 0)
            fun(this);
        else
            fun();
    }

    public dispose() {
        this.data = null;
    }
    
}