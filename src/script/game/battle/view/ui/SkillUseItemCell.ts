/*
 * @Author: jeremy.xu
 * @Date: 2023-05-04 09:47:57
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 12:09:19
 * @Description: 
 */
import FUIHelper from "../../../utils/FUIHelper";
import { EmPackName } from "../../../constant/UIDefine";

/**
* @author:pzlricky
* @data: 2021-05-14 15:56
* @description 使用技能时在任务头顶上显示的技能图标类 
*/
export default class SkillUseItemCell extends Laya.Sprite {
    private _icon: fgui.GLoader;
    private _movie: fgui.GMovieClip;
    private _com: fgui.GComponent;
    private _data: string;
    constructor() {
        super();
        this.initView();
    }

    private initView() {
        this._com = FUIHelper.createFUIInstance(EmPackName.Battle, "AssetBattleSkillGlowAsset") as fgui.GComponent;
        this._movie = this._com.getChild('movieIcon') as fgui.GMovieClip;
        this._icon = this._com.getChild('skillIcon') as fgui.GLoader;

        this._movie.setPlaySettings(1, 10, 1, 7, Laya.Handler.create(this, this.onPlayComplete))
        this._movie.playing = false; //切换播放和停止状态
        // this._movie.frame = 1; //如果动画处于停止状态, 可以设置停止在第几帧
        this.mouseEnabled = false;
        this.mouseThrough = false;
        this._com.setChildIndex(this._movie, 0)
        this._com.setChildIndex(this._icon, 1)
        this.addChild(this._com.displayObject);
    }

    /**播放完成 */
    onPlayComplete() {
        if (this.destroyed || !this._movie || this._movie.isDisposed) return;
        this._movie.playing = false;
    }

    public setScaleX(x:number) {
        this._icon.scaleX = x
    }

    public flash() {
        if (this.destroyed || !this._movie || this._movie.isDisposed) return;
        this._movie.playing = true; //切换播放和停止状态
        this._com.visible = true;
    }

    public tweenEffect(isRight: boolean) {
        if (this.destroyed || !this._movie || this._movie.isDisposed) return;
        this._movie.playing = false; //切换播放和停止状态
        this._movie.frame = 7; //如果动画处于停止状态, 可以设置停止在第几帧
    }

    public get data() {
        return this._data;
    }

    public set data(value) {
        this._data = value;
        if (value) {
            this.visible = true;
            this._icon.url = this._data;
            if (value != "")
                this._com.visible = true;
        } else {
            this.visible = false;
            this._com.visible = false;
        }
    }

    public hideBorder() {
        this._com.visible = false;
    }

    public dispose() {
        this._data = null;
        this._com.dispose();
    }

}