// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-05-26 17:40:39
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-08-23 17:03:00
 * @Description: 
 */
import AudioManager from '../../../../core/audio/AudioManager';
import { UIFilter } from '../../../../core/ui/UIFilter';
import ObjectUtils from '../../../../core/utils/ObjectUtils';
import Utils from '../../../../core/utils/Utils';
import { DisplayObject, Disposeable } from '../../../component/DisplayObject';
import { SoundIds } from '../../../constant/SoundIds';
import { EmPackName } from '../../../constant/UIDefine';
import NewbieUtils from '../utils/NewbieUtils';

export default class NoviceFrame4 extends DisplayObject implements Disposeable {
	private _view: fgui.GButton;
	public get view(): fgui.GButton {
		return this._view;
	}
	private _targetObj: DisplayObject;
	private _callback: Function;
	private _callArgs: any;
	private btnConfirm: fgui.GButton;

	constructor(content: string, callback: Function = null, callArgs) {
		super();
		this._callback = callback;
		this._callArgs = callArgs;
		this._view = fgui.UIPackage.createObject(EmPackName.Newbie, "NoviceFrame4") as fgui.GButton
		this.addChild(this._view.displayObject);
		this._view.title = content;
		this.btnConfirm = this._view.getChild("btnConfirm").asButton;

		this.btnConfirm.on(Laya.Event.CLICK, this, this.onBtnConfirmClick);
	}

	private onBtnConfirmClick() {
		this.btnConfirm.off(Laya.Event.CLICK, this, this.onBtnConfirmClick);
		AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
		if (this._callback) {
			NewbieUtils.execFunc(this._callback, this._callArgs);
		}
	}

	public btnEffect(targetObj: DisplayObject) {
		this._targetObj = targetObj
		Utils.flashTarget(targetObj, UIFilter.yellowFilter);
	}

	public get width(): number {
		return this._view.width
	}

	public get height(): number {
		return this._view.height
	}

	dispose() {
		if (this._targetObj) {
			Utils.clearflashTarget(this._targetObj);
			this._targetObj = null;
		}
		ObjectUtils.disposeObject(this._view); this._view = null;
	}
}