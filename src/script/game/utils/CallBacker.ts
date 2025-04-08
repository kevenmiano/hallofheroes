export class CallBacker
{
    private _listeners = [];
    private _singleListeners = [];
    private _target:Object;

    private _data:any;
    
    public constructor(target:Object = null)
    {
        this._target = target||this;
    }
    public addListener(listener:Function)
    {
        if(this._listeners.indexOf(listener)<0)
            this._listeners.push(listener);
    }
    public removeListener(listener:Function)
    {
        if(this._listeners){
            var index:number = this._listeners.indexOf(listener);
            if(index<0) return;
            this._listeners.splice(index,1);
        }
    }
    public dispatch(data?:any)
    {
        this._data = data;
        let callBacks = this._listeners.slice() //安全起见, clone一份, 不然回调时涉及到增减监听器会有问题;
        callBacks.forEach(i => {
            if(i != null){
                if(i.length>0)
                    i(this);
                else
                    i();
            }
            
            if(this._singleListeners){
                var index:number = this._singleListeners.indexOf(i);
                if(index>0)
                {
                    this.removeListener(i);
                    this._singleListeners.splice(index,1);
                }
            }
        });
    }
    /**
     * 触发一次的监听, 触发后自动remove; 
     * @param listener
     * 
     */		
    public addSingleListener(listener:Function)
    {
        if(this._singleListeners.indexOf(listener)<0)
        {
            this._singleListeners.push(listener);
            this.addListener(listener);
        }
    }
    public removeAllListeners()
    {
        this._listeners = [];
        this._singleListeners = [];
    }
    public get target():Object
    {
        return this._target;
    }
    public get listenerLength():number
    {
        return this._listeners.length;
    }
    public get data():any
    {
        return this._data;
    }
}