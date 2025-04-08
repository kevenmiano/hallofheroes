// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-06-03 15:21:40
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-06-21 16:45:46
 * @Description: 新手指引箭头类
 */

import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { Disposeable, DisplayObject } from '../../../component/DisplayObject';
import { EmPackName } from "../../../constant/UIDefine";


export class NoviceArrowView extends DisplayObject implements Disposeable {
	public static RIGHT: number = 1;
	public static DOWN: number = 2;
	public static LEFT: number = 3;
	public static UP: number = 4;

	private _view: fgui.GButton;
	private _direction: number;  //箭头方向
	private _tip: string;  		 //指引内容
	private mc: fgui.Transition;
	private txtAutoClickTip: fgui.GTextField;

	constructor(direction: number = NoviceArrowView.RIGHT, tip: string = "", showInLayer: boolean = true, callFun: Function = null) {
		super()
		this._direction = direction;
		this._tip = tip;
		this.initView();
		this.mouseEnabled = false;
		this.mouseThrough = true;
	}

	private initView() {
		this._view = fgui.UIPackage.createObject(EmPackName.Newbie, "NoviceArrowGuide") as fgui.GButton
		this.addChild(this._view.displayObject);

		this._view.title = this._tip;
		// let ctr = this._view.getController("dir")
		// ctr.selectedIndex = this._direction;

		let cArrow = this._view.getChild("arrow").asCom
		this.mc = cArrow.getTransition("arrowAni")
		this.txtAutoClickTip = this._view.getChild("txtAutoClickTip").asTextField
	}

	public setAutoClickTip(str:string) {
		this.txtAutoClickTip.text = str;
	}

	public showAutoClickTip(b:boolean) {
		this.txtAutoClickTip.visible = b;
	}

	public set visible(v:boolean) {
		super.visible = v;
	}

	public get visible():boolean {
		return super.visible;
	}

	public showTween(time: number = 0.3) {
		this.alpha = 0;
		this.scaleX = this.scaleY = 0.1;
		TweenMax.to(this, time, { scaleX: 1, scaleY: 1, alpha: 1 });
	}

	public playEffect() {
		this.mc.play(null, -1)
	}

	public stopEffect() {
		this.mc.stop()
	}

	public set tip(tip: string) {
		this._tip = tip;
		this._view.title = this._tip;
	}

	public dispose() {
		TweenMax.killTweensOf(this);
		ObjectUtils.disposeObject(this._view); this._view = null;
	}
}