import Logger from "../../../../core/logger/Logger";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import NewbieBaseConditionMediator from "../mediators/NewbieBaseConditionMediator";
import BaseWindow from '../../../../core/ui/Base/BaseWindow';
import LangManager from "../../../../core/lang/LangManager";
import NewbieConfig from "../data/NewbieConfig";

/**
 * 新手通用API类
 */
export default class NewbieUtils {

	/**
	 * 执行函数
	 * @param func  执行函数对象
	 * @param args  执行参数
	 * @param callback  传入回调
	 * @param callArgs  传入回调参数
	 * @return 执行函数返回布尔值
	 * 
	 */
	public static execFunc(func: Function, args: Array<any> = null, callback: Function = null, callArgs: Array<any> = null): boolean {
		if (!func) return false;
		var bo: boolean;
		var hasCallback: boolean = (callback != null);

		// Logger.info("[NewbieUtils]execFunc", func, args, hasCallback)
		if (args) {
			var len: number = args.length;
			switch (len) {
				case 0:
					bo = hasCallback ? Boolean(func(callback, callArgs)) : Boolean(func());
					break;
				case 1:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0])) : Boolean(func(args[0]));
					break;
				case 2:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1])) : Boolean(func(args[0], args[1]));
					break;
				case 3:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2])) : Boolean(func(args[0], args[1], args[2]));
					break;
				case 4:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3])) : Boolean(func(args[0], args[1], args[2], args[3]));
					break;
				case 5:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3], args[4])) : Boolean(func(args[0], args[1], args[2], args[3], args[4]));
					break;
				case 6:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3], args[4], args[5])) : Boolean(func(args[0], args[1], args[2], args[3], args[4], args[5]));
					break;
				case 7:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3], args[4], args[5], args[6])) : Boolean(func(args[0], args[1], args[2], args[3], args[4], args[5], args[6]));
					break;
				case 8:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7])) : Boolean(func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]));
					break;
				case 9:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8])) : Boolean(func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]));
					break;
				case 10:
					bo = hasCallback ? Boolean(func(callback, callArgs, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9])) : Boolean(func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]));
					break;
				default:
					throw new Error("目前限制最多支持10个参数, 可增加");
			}
		}
		else {
			bo = hasCallback ? Boolean(func(callback, callArgs)) : Boolean(func());
		}
		return bo;
	}

	/**
	 * 执行函数
	 * @param func  执行函数对象
	 * @param args  执行参数
	 * @return  执行返回结果
	 */
	public static execFuncSimple(func: Function, args: Array<any> = null): Object {
		if (func == null) return null;
		if (args) {
			var len: number = args.length;
			switch (len) {
				case 0:
					return func();
				case 1:
					return func(args[0]);
				case 2:
					return func(args[0], args[1]);
				case 3:
					return func(args[0], args[1], args[2]);
				case 4:
					return func(args[0], args[1], args[2], args[3]);
				case 5:
					return func(args[0], args[1], args[2], args[3], args[4]);
				case 6:
					return func(args[0], args[1], args[2], args[3], args[4], args[5]);
				case 7:
					return func(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
				case 8:
					return func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
				case 9:
					return func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8]);
				case 10:
					return func(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);
				default:
					throw new Error("目前限制最多支持10个参数, 可增加");
			}
		}
		else {
			return func();
		}
	}

	/**
	 * 字符串转换成对象
	 * @param $str  字符串, 格式如"{x:100_y:100_yoyo:true}"
	 */
	public static stringToObject($str: string): Object {
		var obj: Object = {};
		var str: string = $str.slice(1, $str.length - 1);
		var arr: Array<string> = str.split("_");
		var subArr: Array<string>;
		var key: string;
		var value: string;
		for (let key in arr) {
			if (Object.prototype.hasOwnProperty.call(arr, key)) {
				let property = arr[key];
				subArr = property.split(":");
				key = subArr[0];
				value = subArr[1];
				if (value == "true") {
					obj[key] = true;
				}
				else if (value == "false") {
					obj[key] = false;
				}
				else if (value.indexOf("'") == -1) {
					obj[key] = Number(value);
				}
				else {
					obj[key] = value;
				}
			}
		}
		return obj;
	}

	/**
	 * 检查模块窗口是否打开 
	 * @param emWindow  EmWindow
	 */
	public static checkFrame(emWindow: string):boolean {
		return NewbieBaseConditionMediator.checkFrame(emWindow)
	}

	/**
	 * 检查模块窗口是否打开 
	 * @param type  NewbieConfig.Type2EmWindow
	 */
	public static checkFrameByType(type: string):boolean {
		return NewbieBaseConditionMediator.checkFrameByType(type)
	}

	/**
	 * 获得界面
	 * @param $emWindow 
	 * @returns 
	 */
	public static getFrame($emWindow: string): BaseWindow {
		let view = UIManager.Instance.FindWind($emWindow)
		if (!view) {
			let ctrl = FrameCtrlManager.Instance.getCtrl(($emWindow) as EmWindow)
			if(ctrl){
				view = ctrl.view
			}
		}
		return view;
	}

	/**
	 * 获得界面
	 * @param type  NewbieConfig.Type2EmWindow
	 */
	public static getFrameByType(type: string):BaseWindow {
		let emWindow: EmWindow = NewbieConfig.Type2EmWindow[type]
		if (!emWindow) return

		return NewbieUtils.getFrame(emWindow)
	}


	/**
	 * 获得帮助内容
	 * @param type 
	 */
	public static getHelpByType(type:number){
		let titleStr = ""
		let tipStr = ""
		switch (type) {
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
				titleStr = "store.view.StoreHelpFrame.title0" + type
				tipStr = "store.StoreControler.helpContent0" + type
				break;
			default:
				break;
		}
		let title: string = LangManager.Instance.GetTranslation(titleStr);
		let content: string = LangManager.Instance.GetTranslation(tipStr);
		return { title: title, content: content }
	}
}