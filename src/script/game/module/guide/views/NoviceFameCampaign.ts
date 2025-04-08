// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-05-26 17:40:39
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-07 16:07:37
 * @Description: 
 */
import LayerMgr from "../../../../core/layer/LayerMgr";
import Logger from "../../../../core/logger/Logger";
import { UIFilter } from "../../../../core/ui/UIFilter";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import Utils from "../../../../core/utils/Utils";
import { DisplayObject, Disposeable } from "../../../component/DisplayObject";
import { EmPackName } from "../../../constant/UIDefine";

export default class NoviceFameCampaign extends DisplayObject implements Disposeable {
	private _callback: Function;
	private _view: fgui.GButton;
	private txtAutoClickTip: fgui.GTextField;
	private btnClick: fgui.GButton;

	constructor() {
		super();
		this._view = fgui.UIPackage.createObject(EmPackName.Newbie, "NoviceFameCampaign") as fgui.GButton
		this.addChild(this._view.displayObject);
		this.txtAutoClickTip = this._view.getChild("txtAutoClickTip").asTextField;
		this.btnClick = this._view.getChild("btnClick").asButton;
	}

	public setText(txt: string) {
		this._view.title = txt
	}

	private _disEffect: DisplayObject;
	public btnEffect(dis: DisplayObject) {
		Utils.flashTarget(dis, UIFilter.yellowFilter);
		this._disEffect = dis;
	}

	public set callback($callback: Function) {
		this._callback = $callback;
	}

	public showTween(time: number = 0.3) {
		this.alpha = 0;
		this.scaleX = this.scaleY = 0.1;
		TweenMax.to(this, time, { scaleX: 1, scaleY: 1, alpha: 1 });
	}

	public setAutoClose(time: number) {
		time = time * 1000;
		Laya.timer.once(time, this, this.__autoClose);
	}

	// mark by jeremy 不能同时触发两个层叠的按钮
	public setClickTargetCloseBtn(dis: DisplayObject, pos: Laya.Point) {
		this.btnClick.width = dis.width
		this.btnClick.height = dis.height
		this.btnClick.setXY(pos.x, pos.y)

		this.btnClick.onClick(this, this.__autoClose)
		this._view.displayObject.mouseThrough = true
		this._view.displayObject.mouseEnabled = true
	}

	private __autoClose() {
		LayerMgr.Instance.removeByLayer(this, EmLayer.NOVICE_LAYER);
	}

	public dispose() {
		if (this._disEffect) {
			Utils.clearflashTarget(this._disEffect);
			this._disEffect = null;
		}
		this._callback = null;
		Laya.timer.clear(this, this.__autoClose);
	}
}
