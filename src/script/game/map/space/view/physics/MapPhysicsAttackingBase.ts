import {MapPhysicsBase} from "./MapPhysicsBase";
import {EmWindow} from "../../../../constant/UIDefine";

export class MapPhysicsAttackingBase extends MapPhysicsBase
{
    protected _attacking:fgui.GMovieClip;
    constructor()
    {
        super();
    }

    protected setFireView()
    {
        super.setFireView();
        this.setFireViewImp();
    }

    private setFireViewImp()
    {
        if(!this._attacking)
        {
            this._attacking = fgui.UIPackage.createObject(EmWindow.OuterCity, "asset.outercity.AttackingAsset").asMovieClip;
        }
        if(this._isPlaying)
        {
            this.addChild(this._attacking.displayObject);
        }
        this._attacking.y = -70;
        this._attacking.playing = true;
    }

    protected setNomalView()
    {
        super.setNomalView();
        this.clearAttackMovie();
    }

    private clearAttackMovie()
    {
        if(this._attacking)
        {
            this._attacking.displayObject.removeSelf();
            this._attacking.playing = false;
            this._attacking.dispose();
            this._attacking = null;
        }
    }

    public dispose()
    {
        this.clearAttackMovie();
        super.dispose();
    }

    public set isPlaying(value:boolean)
    {
        super.isPlaying = value;
        if(!this._attacking)
        {
            return;
        }
        if(value)
        {
            this.addChild(this._attacking.displayObject);
            this._attacking.playing = true
        }
        else
        {
            this._attacking.displayObject.removeSelf();
            this._attacking.playing = false;
        }
    }
}
