// @ts-nocheck
import { EmPackName } from "../../constant/UIDefine";
import FUIHelper from "../../utils/FUIHelper";

/**
 * 花瓣飘落效果 
 */
 export default class FlyPetal extends Laya.Sprite{
    private  _petal : fgui.GMovieClip;
    private  _xSpeed : number;
    private  _ySpeed : number;
    private  _rotation : number;
    private  _type : number;  //1: 粉红花瓣, 2: 红色花瓣, 3: 颁奖礼花

    constructor( type:number = 1){
        super();
        this.mouseEnabled = false;
        this._type = type;
			switch(this._type)
			{
				case 1:
					this._petal = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "asset.core.PetalPink") as fgui.GMovieClip;
					break;
				case 2:
                    this._petal = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "asset.core.Petal") as fgui.GMovieClip;
					break;
				case 4:
                    this._petal = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "asset.warlords.Star") as fgui.GMovieClip;
					break;
				case 3://彩带
                    this._petal = FUIHelper.createFUIInstance(EmPackName.BaseCommon, "asset.core.ribbon") as fgui.GMovieClip;
					break;
				default:
					this._petal = new fgui.GMovieClip();
			}
            this._petal.frame = Math.round((Math.random()*90))+1;
            this._petal.playing = true;
			this.addChild(this._petal.displayObject);
			this.scaleX = this.scaleY = Math.random()*0.3 + 0.8;
			this._xSpeed = Math.random()*4 - 2;
			this._ySpeed = Math.random()*2 + 5;
			this._rotation = Math.random()*10 - 5;
    }

    public drop():void
    {
        this.x += this._xSpeed;
        this.y += this._ySpeed;
        this.rotation += this._rotation;
    }
		
    public play():void
    {
        if (this._petal) this._petal.playing = true;
    }

    public stop():void
    {
        if (this._petal) this._petal.playing = false;
    }
    
    public dispose():void
    {
        if (this._petal) 
        {
            this. _petal.playing = false;
            if (this._petal.parent) this._petal.parent.removeChild(this._petal);this._petal = null;
        }
        if(this.parent) this.parent.removeChild(this);
    }
		
 }