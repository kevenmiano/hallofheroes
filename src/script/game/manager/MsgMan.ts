/**
 * 通信工具,  支持传参, 采用回调方式, 效率高, 使用方便
 * fixme 先移植, 后期再更改废弃
 */
export class MsgMan
{
    protected static observerMap:any[] = [];

    /**
     * @param msg消息常量
     * @param context监听该消息的类
     * @param 回调
     */
    public static addObserver(msg:string, context:Object, fun:Function)
    {
        var observers:any[] = MsgMan.observerMap[msg];
        if(observers != null && observers.length > 0)
        {
            for(var i:number = 0; i < observers.length; i++)
            {
                if(fun == (observers[i].fun as Function))
                {
                    return;
                }
            }
            observers.push({context:context, fun:fun});
        }
        else
        {
            MsgMan.observerMap[msg] = [{context:context, fun:fun}];
        }
    }

    /**
     * @param msg消息常量
     * @param context监听该消息的类
     * @param 回调
     */
    public static removeObserver(msg:string, context:Object, fun:Function)
    {
        var observers:any[] = MsgMan.observerMap[msg];
        if(observers != null && observers.length > 0)
        {
            for(var i:number = 0; i < observers.length; i++)
            {
                if(context == observers[i].context && fun == (observers[i].fun as Function))
                {
                    observers.splice(i, 1);
                    MsgMan.observerMap[msg] = observers;
                    if(observers.length < 1)
                    {
                        MsgMan.observerMap[msg] = null;
                    }
                    return;
                }
            }
        }
    }

    /**
     * @param msg消息常量
     * @param body 传递的消息
     */
    public static notifyObserver(msg:string, body:Object = null)
    {
        if(MsgMan.observerMap[msg] != null)
        {
            var observers:any[] = MsgMan.observerMap[msg];
            var tmpArr:any[] = [];
            tmpArr = tmpArr.concat(observers);
            for(var obj of tmpArr)
            {
                (obj.fun as Function).apply(obj.context, [msg, body]);
            }
        }
    }
}