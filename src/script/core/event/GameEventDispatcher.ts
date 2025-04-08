// @ts-nocheck

export default class GameEventDispatcher {
    protected static claName: string = 'GameEventDispatcher';

    protected eventsMap: Object;

    private notifyLevel = 0;

    constructor() {
        this.eventsMap = {};
    }

    public on(type: string | number , listener: Function, thisObject: any) {
        this.$on(type, listener, thisObject);
    }

    private $on(type: string | number, listener: Function, thisObject: any) {
        let list: EventBin[] = this.eventsMap[type];
        if (!list) {
            list = this.eventsMap[type] = [];
        }
        else if (this.notifyLevel !== 0) {
            //这里 1、是为了防止外部修改数据, 2、是事件派发比事件监听使用的更多, 这样concat操作会少很多。
            this.eventsMap[type] = list = list.concat();
        }

        this.$insertEventBin(list, type, listener, thisObject);
    }

    //如果事件有优先级, 可以在这里增加逻辑
    private $insertEventBin(list: any[], type: string | number, listener: Function, thisObject: any): boolean {

        // let insertIndex = -1;
        let length = list.length;

        for (let i = 0; i < length; i++) {
            let bin = list[i];
            //已经存在
            if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                return false;
            }

            // if (insertIndex == -1) {
            //     insertIndex = i;
            // }
        }

        let eventBin: EventBin = {
            type: type, listener: listener,
            thisObject: thisObject,
            target: this,
        };

        list.push(eventBin);

        return true;
    }


    public removeEventListener(type: string | number, listener: Function, thisObject: any) {
        let list: EventBin[] = this.eventsMap[type];
        if (!list) {
            return;
        }
        //这里 1、是为了防止外部修改数据, 2、是事件派发比事件移除使用的更多, 这样concat操作会少很多。同事件监听一样。
        if (this.notifyLevel !== 0) {
            this.eventsMap[type] = list = list.concat();
        }

        this.$removeEventBin(list, listener, thisObject);

        if (list.length == 0) {
            this.eventsMap[type] = null;
        }
    }

    private $removeEventBin(list: any[], listener: Function, thisObject: any): boolean {
        let length = list.length;
        for (let i = 0; i < length; i++) {
            let bin = list[i];
            if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                list.splice(i, 1);
                return true;
            }
        }

        return false;
    }

    private $notifyListener(type: string | number, ...args) {

        let eventMap = this.eventsMap;
        let list: EventBin[] = eventMap[type];
        if (!list) {
            return true;
        }
        let length = list.length;
        if (length == 0) {
            return;
        }

        //做个标记, 防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为dispatch()方法调用通常比on()等方法频繁。
        this.notifyLevel++;
        for (let i = 0; i < length; i++) {
            let eventBin = list[i];
            eventBin.listener.call(eventBin.thisObject, ...args);
        }
        this.notifyLevel--;
    }

    public hasEventListener(type: string | number): boolean {
        let values = this.eventsMap;
        return !!(values[type]);
    }

    // 没必要去判断具体的事件, 相同的监听事件, 在监听的时候就已经过滤掉了。
    public has(eventName: string | number, callback, target): boolean {
        return this.hasEventListener(eventName);
    }

    public off(eventName: string | number, callback: Function, target: Object) {
        this.removeEventListener(eventName, callback, target);
    }

    public emit(eventName: string | number, ...args) {
        this.$notifyListener(eventName, ...args)
    }

    public offAll() {
        this.eventsMap = {};
    }

    public offByName(type: string | number) {
        let list = this.eventsMap[type];
        if (list) {
            this.eventsMap[type] = null;
        }
    }

    public addEventListener(type: string | number, listener: Function, thisObject: any) {
        this.$on(type, listener, thisObject);
    }


    public dispatchEvent(eventName: string | number, ...args) {
        this.$notifyListener(eventName, ...args)
    }

    public sendEvent(ename: string | number, ...args) {
        this.$notifyListener(ename, ...args)
    }
}
//使用字面类型, 比new更快,更精简... 等好处
export interface EventBin {

    type: string | number;

    listener: Function;

    thisObject: any;

    target: GameEventDispatcher;
}