// @ts-nocheck
/**
* @author:pzlricky
* @data: 2020-11-24 20:45
* @description *** 
*/
export class DisplayObject extends Laya.Sprite {

}

export class SpriteObject extends Laya.Sprite {
    private _data: any
    public set data(value: any) {
        this._data = value;
    }

    public get data(): any {
        return this._data;
    }
}

/**
* @author:pzlricky
* @data: 2020-11-24 20:45
* @description *** 
*/
export class DisplayObjectContainer extends Laya.Sprite {

    /**存储对象均为Sprite对象 */
    getChildAt(index: number): Laya.Sprite {
        let node = super.getChildAt(index) as Laya.Sprite;
        return node;
    }

    removeChildAt(index: number): Laya.Sprite {
        let node = super.removeChildAt(index) as Laya.Sprite;
        return node;
    }
}

export interface Disposeable {
    /**
     * 执行清除操作,  方便内存回收
     */
    dispose();
}