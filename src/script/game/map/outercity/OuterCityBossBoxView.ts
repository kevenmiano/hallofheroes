import {OuterCityManager} from "../../manager/OuterCityManager";
import {BoxMsgInfo} from "./BoxMsgInfo";
import Sprite = Laya.Sprite;
import BoxMsg = com.road.yishi.proto.army.BoxMsg;
import {EmWindow} from "../../constant/UIDefine";

/**
 * @description    外城怪物掉落宝箱视图类
 * @author yuanzhan.yu
 * @date 2021/11/17 20:05
 * @ver 1.0
 */
export class OuterCityBossBoxView extends Sprite
{
    private _box:fgui.GMovieClip;
    private data:BoxMsgInfo;

    constructor()
    {
        super();
        this.autoSize = true;
        this.on(Laya.Event.CLICK, this, this.onClick);
    }

    public setData(_data:BoxMsgInfo):void
    {
        this.data = _data;
        this._box = fgui.UIPackage.createObject(EmWindow.OuterCity, `ComBossBox${this.data.type}`).asMovieClip;
        this.addChild(this._box.displayObject);
        this.x = this.data.x * 20;
        this.y = this.data.y * 20;
    }

    private onClick(evt:Laya.Event):void
    {
        let msg:BoxMsg = new BoxMsg();
        msg.boxId = this.data.boxId;
        msg.userId = this.data.userId;
        msg.grade = this.data.grade;
        msg.mapId = this.data.mapId;
        msg.x = this.data.x;
        msg.y = this.data.y;
        msg.type = this.data.type;

        OuterCityManager.Instance.getBossBox(msg);
        TweenMax.to(this, 1, {alpha:0, onComplete:this.onComplete.bind(this)});
    }

    public onComplete():void
    {
        this.dispose();
    }

    public dispose():void
    {
        this.off(Laya.Event.CLICK, this, this.onClick);
        if(this.parent)
        {
            this.parent.removeChild(this);
        }
        this._box.displayObject.removeSelf();
        this._box.dispose();
        this._box = null;
    }
}