// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-05-26 17:40:39
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-09-07 16:07:51
 * @Description: 
 */
import { UIFilter } from '../../../../core/ui/UIFilter';
import ObjectUtils from '../../../../core/utils/ObjectUtils';
import Utils from '../../../../core/utils/Utils';
import { DisplayObject, Disposeable } from '../../../component/DisplayObject';
import { EmPackName } from '../../../constant/UIDefine';

export default class NoviceFrame1 extends DisplayObject implements Disposeable {
	private _view: fgui.GButton;
	private _targetObj: DisplayObject;
	private txtAutoClickTip: fgui.GTextField;
	
	constructor(content: string, arrowDirection: number = 0) {
		super();

		this._view = fgui.UIPackage.createObject(EmPackName.Newbie, "NoviceFrame1") as fgui.GButton
		this.addChild(this._view.displayObject);

		this._view.title = content;
		this.txtAutoClickTip = this._view.getChild("txtAutoClickTip").asTextField;
	}

	public showTween(time: number = 0.25) {
		this.alpha = 0.5;
		this.scaleX = this.scaleY = 0.5;
		TweenLite.to(this, time, { scaleX: 1, scaleY: 1, alpha: 1, ease:Quad.easeOut });
	}

	public btnEffect(targetObj: DisplayObject){
		this._targetObj = targetObj
		Utils.flashTarget(targetObj, UIFilter.yellowFilter);
	}

	dispose() {
		if(this._targetObj){
			Utils.clearflashTarget(this._targetObj);
			this._targetObj = null;
		}
		ObjectUtils.disposeObject(this._view); this._view = null;
	}

}