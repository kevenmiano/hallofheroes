// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-04-15 20:05:48
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-06-02 11:46:36
 * @Description: 称号
 */

import ResMgr from "../../../core/res/ResMgr";
import { Disposeable } from "../../component/DisplayObject";
import { FilterFrameText } from "../../component/FilterFrameText";
import { MovieClip } from "../../component/MovieClip";
import { t_s_appellData } from "../../config/t_s_appell";
import { PathManager } from '../../manager/PathManager';
import { TempleteManager } from "../../manager/TempleteManager";
import AppellModel from "../../module/appell/AppellModel";

export class AppellView extends Laya.Sprite implements Disposeable {
    private _appellID: number;
    public get appellID(): number {
        return this._appellID
    }
    public url: string = ""
    private _unitWidth: number = 0;
    private _unitHeight: number = 0;
    public get unitWidth(): number {
        return this._unitWidth;
    }
    public get unitHeight(): number {
        return this._unitHeight;
    }

    /** 称号锚点在中间  当外部用于定位称号的节点锚点在左上角时候 使用此接口做位置修正 */
    public fixOffset(height?: number) {
        if (this._appellInfo) {
            if (this._appellInfo.ImgBgId != 0) {
                this.x += (this._unitWidth - this._text.textWidth) / 2;
            } else {
                this.x += (this._text.textWidth) / 2;
                this.y += (height ? height : this._text.textHeight) / 2;
            }
        }
    }

    public prefix: string = "";
    public textY: number = 0;

    private _content = new MovieClip();
    public get content(): MovieClip {
        return this._content;
    }
    private _debugbg = new Laya.Sprite();
    private _debugbg2 = new Laya.Sprite();
    private _bg = new Laya.Sprite();
    public get bg(): Laya.Sprite {
        return this._bg;
    }

    private _text: FilterFrameText = null;
    public get textField(): FilterFrameText {
        return this._text;
    }

    private _appellInfo: t_s_appellData = null;

    /**
     * 
     * @param w 动画宽度 
     * @param h 动画高度 
     * @param appellID 
     */
    constructor(w: number, h: number, appellID: number) {
        super()
        this._appellID = appellID;
        this._unitWidth = w;
        this._unitHeight = h;

        this._appellInfo = TempleteManager.Instance.getAppellInfoTemplateByID(appellID);
        this.textY = this._appellInfo ? this._appellInfo.TextY : 0;
        let imgBgId = this._appellInfo ? this._appellInfo.ImgBgId : 0;
        // let imgBgId = 46

        this._text = new FilterFrameText(240, 24, undefined, this._appellInfo ? this._appellInfo.TextFontSize : 20);
        if (this._appellInfo) {
            this._text.text = this._appellInfo ? this._appellInfo.TitleLang : "";
            this._text.color = AppellModel.getTextColorAB(this._appellInfo.TextColorIdx);
        }
        this.addChild(this._text);
        if (imgBgId != 0) {
            this._text.pivotY = 0;
            this._text.y = this.textY - h / 2;
        } else {
            this._text.pivotY = this._text.height / 2;
            this._text.y = 0;
        }
        this._text.visible = this._appellInfo ? (this._appellInfo.IsHide == 1 ? false : true) : true;

        // this._debugbg = new Laya.Sprite();
        // this._debugbg.graphics.drawRect(0, 0, w, h, "#FF0000");
        // this._debugbg.alpha = 0.3;
        // this._debugbg.pivot(w / 2, h / 2);
        // this.addChild(this._debugbg);
        // this._debugbg2 = new Laya.Sprite();
        // this._debugbg2.graphics.drawCircle(0, 0, 5, "#00FF00");
        // this.addChild(this._debugbg2);

        if (imgBgId != 0) {
            this.url = PathManager.getAppellBgPath(imgBgId);
            ResMgr.Instance.loadRes(this.url, (res) => {
                if (!res) return
                this._bg = new Laya.Image();
                this._bg.texture = res;
                this._bg.pivot(this._unitWidth / 2, this._unitHeight / 2);
                this.addChildAt(this._bg, 0);
            }, null, Laya.Loader.IMAGE)
        }
    }

    private _data: any
    public set data(value: any) {
        this._data = value;
    }

    public get data(): any {
        return this._data;
    }

    public dispose() {
        this.removeSelf()
    }
}