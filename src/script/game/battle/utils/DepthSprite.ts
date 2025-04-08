 /**
 * @author jeremy.xu
 * @data: 2020-11-23 12:00
 * @description 含有深度变量的sprite类, 便于进行深度管理 
 */

export class DepthSprite extends Laya.Sprite
{
    private _pointZ:number = 0;
    private _pointY:number = 0;
    constructor()
    {
        super();
    }

    public get pointZ():number
    {
        return this._pointZ;
    }

    public set pointZ(value:number)
    {
        this._pointZ = value;
        this.zOrder = this._pointZ
    }

    public get pointY():number
    {
        return this._pointY;
    }

    public set pointY(value:number)
    {
        this._pointY = value;
        this.zOrder = this._pointY
    }

}