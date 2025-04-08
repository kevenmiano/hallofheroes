// @ts-nocheck
export class MouseData {
	public static ON_DRAG: string = "ON_DRAG";//正在拖 动
	public static BACK_DRAG: string = "BACK_DRAG";//拖动处理中
	public static CLICK: string = "CLICK";
	public static NORMAL: string = "Normal";//普通状态
	public static LOCK: string = "Lock";

	public curState: string;

	constructor() {
		this.curState = MouseData.NORMAL;
	}

	private static _instance: MouseData
	public static get Instance(): MouseData {
		if (!MouseData._instance) MouseData._instance = new MouseData();
		return MouseData._instance;
	}
}