import Dictionary from "../../../../core/utils/Dictionary";

/**
 * 显示对象Resize工具类
 */
export default class NewbieResizeUtils {
	public static INTERVAL_TIME: number = 200;  //计时器间隔
	private static _autoRemoveList: Dictionary;  //自动移除列表（显示对象不在舞台会自动移除）
	private static _manualRemoveList: Dictionary;  //手动移除列表（需调用removeTarget移除）
	private static _offsetList: Dictionary;  //对象偏移点列表
	private static _tempDisObj01: any;  //非String作key, 遍历key只能用Object类型
	private static _tempDisObj02: any;
	private static _tempP: Laya.Point;
	private static _tempOffsetPoint: Laya.Point;

	/**
	 * 添加对象
	 * @param	targetObj  目标显示对象
	 * @param	relativeTarget  关联显示对象
	 * @param	offsetPoint  偏移点
	 * @param	isAutoRemove  是否自动移除（显示对象不在舞台会自动移除）
	 */
	public static addTarget(targetObj, relativeTarget, offsetPoint: Laya.Point = null, isAutoRemove: boolean = true) {
		// if (DisObjResizeUtils.getListLen(DisObjResizeUtils._autoRemoveList) == 0 && DisObjResizeUtils.getListLen(DisObjResizeUtils._manualRemoveList) == 0) {
		// 	Laya.timer.loop(this.INTERVAL_TIME,this,this.__timerUpdateHandler)
		// }
		// if (!DisObjResizeUtils._autoRemoveList) DisObjResizeUtils._autoRemoveList = new Dictionary();
		// if (!DisObjResizeUtils._manualRemoveList) DisObjResizeUtils._manualRemoveList = new Dictionary();
		// if (!DisObjResizeUtils._offsetList) DisObjResizeUtils._offsetList = new Dictionary();
		// if (isAutoRemove) {
		// 	DisObjResizeUtils._autoRemoveList[targetObj] = relativeTarget;
		// }
		// else {
		// 	DisObjResizeUtils._manualRemoveList[targetObj] = relativeTarget;
		// }
		// if (offsetPoint) {
		// 	DisObjResizeUtils._offsetList[targetObj] = offsetPoint;
		// }
		// else {//targetObj可能已被添加过, 并设有offsetPoint, 如再次添加且不需要offsetPoint, 需将之前添加的清掉
		// 	DisObjResizeUtils._offsetList[targetObj] = null;
		// 	delete DisObjResizeUtils._offsetList[targetObj];
		// }
		// this.__timerUpdateHandler();
	}

	/**
	 * 移除对象
	 * @param	targetObj  目标显示对象
	 */
	public static removeTarget(targetObj) {
		if (NewbieResizeUtils._autoRemoveList) {
			NewbieResizeUtils._autoRemoveList[targetObj] = null;
			delete NewbieResizeUtils._autoRemoveList[targetObj];
		}
		if (NewbieResizeUtils._manualRemoveList) {
			NewbieResizeUtils._manualRemoveList[targetObj] = null;
			delete NewbieResizeUtils._manualRemoveList[targetObj];
		}
		if (NewbieResizeUtils._offsetList) {
			NewbieResizeUtils._offsetList[targetObj] = null;
			delete NewbieResizeUtils._offsetList[targetObj];
		}
	}

	/**
	 * 全部清除
	 */
	public static clear() {
		Laya.timer.clearAll(this);
		NewbieResizeUtils._autoRemoveList = null;
		NewbieResizeUtils._manualRemoveList = null;
		NewbieResizeUtils._offsetList = null;
		NewbieResizeUtils._tempDisObj01 = null;
		NewbieResizeUtils._tempDisObj02 = null;
		NewbieResizeUtils._tempP = null;
		NewbieResizeUtils._tempOffsetPoint = null;
	}

	private static __timerUpdateHandler() {
		let count: number = 0;
		if (!NewbieResizeUtils._tempP) NewbieResizeUtils._tempP = new Laya.Point();
		for (NewbieResizeUtils._tempDisObj01 in NewbieResizeUtils._autoRemoveList) {
			count++;
			NewbieResizeUtils._tempDisObj02 = NewbieResizeUtils._autoRemoveList[NewbieResizeUtils._tempDisObj01];
			if (NewbieResizeUtils._tempDisObj01 && NewbieResizeUtils._tempDisObj01.stage && NewbieResizeUtils._tempDisObj02 && NewbieResizeUtils._tempDisObj02.stage) {
				NewbieResizeUtils._tempP.x = NewbieResizeUtils._tempDisObj02.x;
				NewbieResizeUtils._tempP.y = NewbieResizeUtils._tempDisObj02.y;
				NewbieResizeUtils._tempP = NewbieResizeUtils._tempDisObj02.parent.localToGlobal(NewbieResizeUtils._tempP);
				NewbieResizeUtils._tempP = NewbieResizeUtils._tempDisObj01.parent.globalToLocal(NewbieResizeUtils._tempP);
				NewbieResizeUtils._tempOffsetPoint = NewbieResizeUtils._offsetList[NewbieResizeUtils._tempDisObj01];
				if (NewbieResizeUtils._tempOffsetPoint) {
					NewbieResizeUtils._tempDisObj01.x = NewbieResizeUtils._tempP.x + NewbieResizeUtils._tempOffsetPoint.x;
					NewbieResizeUtils._tempDisObj01.y = NewbieResizeUtils._tempP.y + NewbieResizeUtils._tempOffsetPoint.y;
				}
				else {
					NewbieResizeUtils._tempDisObj01.x = NewbieResizeUtils._tempP.x;
					NewbieResizeUtils._tempDisObj01.y = NewbieResizeUtils._tempP.y;
				}
			}
			else {
				NewbieResizeUtils._autoRemoveList[NewbieResizeUtils._tempDisObj01] = null;
				delete NewbieResizeUtils._autoRemoveList[NewbieResizeUtils._tempDisObj01];
				NewbieResizeUtils._offsetList[NewbieResizeUtils._tempDisObj01] = null;
				delete NewbieResizeUtils._offsetList[NewbieResizeUtils._tempDisObj01];
			}
		}
		for (NewbieResizeUtils._tempDisObj01 in NewbieResizeUtils._manualRemoveList) {
			count++;
			NewbieResizeUtils._tempDisObj02 = NewbieResizeUtils._manualRemoveList[NewbieResizeUtils._tempDisObj01];
			if (NewbieResizeUtils._tempDisObj01 && NewbieResizeUtils._tempDisObj01.stage && NewbieResizeUtils._tempDisObj02 && NewbieResizeUtils._tempDisObj02.stage) {
				NewbieResizeUtils._tempP.x = NewbieResizeUtils._tempDisObj02.x;
				NewbieResizeUtils._tempP.y = NewbieResizeUtils._tempDisObj02.y;
				NewbieResizeUtils._tempP = NewbieResizeUtils._tempDisObj02.parent.localToGlobal(NewbieResizeUtils._tempP);
				NewbieResizeUtils._tempP = NewbieResizeUtils._tempDisObj01.parent.globalToLocal(NewbieResizeUtils._tempP);
				NewbieResizeUtils._tempOffsetPoint = NewbieResizeUtils._offsetList[NewbieResizeUtils._tempDisObj01];
				if (NewbieResizeUtils._tempOffsetPoint) {
					NewbieResizeUtils._tempDisObj01.x = NewbieResizeUtils._tempP.x + NewbieResizeUtils._tempOffsetPoint.x;
					NewbieResizeUtils._tempDisObj01.y = NewbieResizeUtils._tempP.y + NewbieResizeUtils._tempOffsetPoint.y;
				}
				else {
					NewbieResizeUtils._tempDisObj01.x = NewbieResizeUtils._tempP.x;
					NewbieResizeUtils._tempDisObj01.y = NewbieResizeUtils._tempP.y;
				}
			}
		}
		if (count == 0) {
			NewbieResizeUtils.clear();
		}
	}

	private static getListLen(list: Dictionary): number {
		let count: number = 0;
		for (let key in list) {
			if (Object.prototype.hasOwnProperty.call(list, key)) {
				let obj = list[key];
				count++;
			}
		}
		return count;
	}

}