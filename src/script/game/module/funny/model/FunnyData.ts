import { getMultiLangList, getMultiLangValue } from "../../../../core/lang/LanguageDefine";
import FunnyBagData from "./FunnyBagData";

/**
 * 活动总数据, 包含多个活动礼包数据
 * */
export default class FunnyData {
	public id: string;//活动Id
	public startTime: number;//活动开始时间
	public endTime: number;//活动结束时间
	public showStart: number;//开始显示时间
	public showEnd: number;//结束显示时间
	public condition: string;//条件描述
	public finishNum: number = -1;//活动时间内的进度值
	public canGet: number = -1;//还能领取多少次
	public type: number = -1;//活动类型, 老玩家回归活动(4)
	public bagList: Array<FunnyBagData> = [];//礼包数组
	public getWay: number;//领取方式（1.只能领一次、2.无限领取、3.每天领一次）
	public anyToGet: boolean;//是否有礼包可以领取
	public order: number;//自定义排序
	public state: number = 0;//活动状态 0: 正常、激活 -1:未激活 -2: 不可激活 -3:不可参与
	
	constructor() {
		this.bagList = [];
	}

	public dispose() {
		if (this.bagList == null) return;
		while (this.bagList.length) {
			this.bagList.pop();
		}
	}

	//活动标题
	private _title: string = "";
	private _isServerTitle: boolean = false;//是否为服务器传用标题
	private _multiLanTitles: Map<string, string> = new Map();

	public set title(value: string) {
		this._title = value;
	}

	public get title(): string {
		if (this._isServerTitle) {
			let value = getMultiLangValue(this._multiLanTitles);
			return value;
		}
		return this._title;
	}

	public set multiLangTitle(value: string) {
		this._isServerTitle = true;
		// value = `<zhcn>${value}111</zhcn><en>${value}222</en><pt>${value}333</pt><es>${value}444</es><de>${value}555</de>`;
		this._multiLanTitles = getMultiLangList(value, this._multiLanTitles);
	}

	//活动内容
	private _content: string = "";
	private _isServerContents: boolean = false;//是否为服务器传用内容
	private _multiLancontents: Map<string, string> = new Map();

	public set contents(value: string) {
		this._content = value;
	}

	public get contents(): string {
		if (this._isServerContents) {
			let value = getMultiLangValue(this._multiLancontents);
			return value;
		}
		return this._content;
	}
	
	public set multiLangcontents(value: string) {
		this._isServerContents = true;
		this._multiLancontents = getMultiLangList(value, this._multiLancontents);
	}



	//活动描述

	private _describe: string = "";
	private _isServerDescribe: boolean = false;//是否为服务器传用描述
	private _multiLandescribe: Map<string, string> = new Map();

	public set describe(value: string) {
		this._content = value;
	}

	public get describe(): string {
		if (this._isServerDescribe) {
			let value = getMultiLangValue(this._multiLandescribe);
			return value;
		}
		return this._describe;
	}

	public set multiLangdescribe(value: string) {
		this._isServerDescribe = true;
		this._multiLandescribe = getMultiLangList(value, this._multiLandescribe);
	}

}