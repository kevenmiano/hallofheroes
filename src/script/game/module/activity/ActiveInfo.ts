import { getMultiLangList, getMultiLangValue } from "../../../core/lang/LanguageDefine";

export default class ActiveInfo {
    public activeId: string;
    public awardContent: string;
    public grades: number;
    public consortia: number;
    public sort: number;
    public endDate: number;
    public startDate: number;
    public actionTimeContent: string;

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
	private _multiLanContents: Map<string, string> = new Map();

	public set contents(value: string) {
		this._content = value;
	}

	public get contents(): string {
		if (this._isServerContents) {
			let value = getMultiLangValue(this._multiLanContents);
			return value;
		}
		return this._content;
	}

	public set multiLangContents(value: string) {
		this._isServerContents = true;
		this._multiLanContents = getMultiLangList(value, this._multiLanContents);
	}


	//活动描述
	private _description: string = "";
    private _isServerDescription: boolean = false;//是否为服务器传用描述
	private _multiLanDescription: Map<string, string> = new Map();

	public set description(value: string) {
		this._content = value;
	}

	public get description(): string {
		if (this._isServerDescription) {
			let value = getMultiLangValue(this._multiLanDescription);
			return value;
		}
		return this._description;
	}

	public set multiLangDescription(value: string) {
		this._isServerDescription = true;
		this._multiLanDescription = getMultiLangList(value, this._multiLanDescription);
	}


}