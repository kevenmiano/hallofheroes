import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { TimerEvent, TimerTicker } from "../../utils/TimerTicker";
import { PlayerBufferType } from "../../constant/PlayerBufferType";
import LangManager from "../../../core/lang/LangManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { KingContractInfo } from "../../module/kingcontract/KingContractInfo";
import { KingContractManager } from "../../manager/KingContractManager";
import { t_s_effecttemplateData } from "../../config/t_s_effecttemplate";
import { t_s_campaignbufferData } from "../../config/t_s_campaignbuffer";

export class PlayerBufferInfo extends GameEventDispatcher {
	public templateId: number = 0;
	private _name: string = "";
	private _description: string = "";
	/**
	 * Buffer类型 
	 */
	public bufferType: number = 0;
	public masterType: number = 0;
	/**
	 * 持续时间 
	 */
	private _leftTime: number = 0;
	/**
	 * 持续回合 
	 */
	public lastCount: number = 0;
	public rateCount: number = 0;
	public grade: number = 0;
	public goodsTemplateId: number = 0;

	private _time: TimerTicker;
	constructor() {
		super();

		this._time = new TimerTicker(1000);
		this._time.addEventListener(TimerEvent.TIMER, this.__timerHandler, this);
	}

	private __timerHandler(e: TimerEvent) {
		--this._leftTime;
		this.dispatchEvent(Laya.Event.CHANGE, this);
		if (this._leftTime == 0) {
			this.dispatchEvent(Laya.Event.COMPLETE, this);
			this._time.stop();
		}
	}

	public set leftTime(value: number) {
		this._leftTime = value;
		if (this._leftTime > 0)
			this._time.start();
		else
			this._time.stop();
	}

	public get leftTime(): number {
		return this._leftTime;
	}

	public get icon(): string {
		if (this.bufferType == PlayerBufferType.EXP_RATE) {
			return "/serverEXP.png";
		}
		else if (this.bufferType == PlayerBufferType.LORDS_BUFFER) {
			return "/LordBless.png";
		}
		else if (this.bufferType == PlayerBufferType.KINGCONTRACT) {
			return "/exclusiveBuff.png";
		}
		else if (this.bufferType == PlayerBufferType.OTHER_BUFFER) {
			return this.getGoodsTemplate().Icon;
		}
		else if (this.bufferType == PlayerBufferType.BASE_PROPERTY_BUFFER) {
			return "/petfight0" + this.masterType + ".png";
		}
		return this.template.Icon;
	}

	public get name(): string {
		if (this.bufferType == PlayerBufferType.EXP_RATE) {
			return LangManager.Instance.GetTranslation("yishi.datas.playerinfo.PlayerBufferInfo.name", this.rateCount / 100);
		}
		else if (this.bufferType == PlayerBufferType.LORDS_BUFFER) {
			return this._name;//LanguageMgr.GetTranslation("yishi.datas.playerinfo.PlayerBufferInfo.name2");
		}
		else if (this.bufferType == PlayerBufferType.KINGCONTRACT) {
			return this.KingTemplate.template.NameLang;
		}
		else if (this.bufferType == PlayerBufferType.OTHER_BUFFER) {
			return this.getGoodsTemplate().TemplateNameLang;
		}
		else if (this.bufferType == PlayerBufferType.BASE_PROPERTY_BUFFER) {
			return LangManager.Instance.GetTranslation("yishi.datas.playerinfo.PlayerBufferInfo.BasePropertyName" + this.masterType);
		}
		return this.template.TemplateNameLang;
	}

	public set name(value: string) {
		this._name = value;
	}

	public get description(): string {
		if (this.bufferType == PlayerBufferType.EXP_RATE) {
			return LangManager.Instance.GetTranslation("yishi.datas.playerinfo.PlayerBufferInfo.description", this.rateCount);
		}
		else if (this.bufferType == PlayerBufferType.LORDS_BUFFER || this.bufferType == PlayerBufferType.BASE_PROPERTY_BUFFER) {
			return this._description;
		}
		else if (this.bufferType == PlayerBufferType.KINGCONTRACT) {
			return this.KingTemplate.template.DescriptionLang;
		} else if (this.bufferType == PlayerBufferType.OTHER_BUFFER) {
			var des: string = (this.template as t_s_effecttemplateData).DescriptionLang;
			des = des.replace("{Grades}", this.grade.toString());
			return des;
		}
		return this.template.DescriptionLang;
	}

	public set description(value: string) {
		this._description = value;
	}

	public get template(): any {
		if (this.bufferType == PlayerBufferType.OTHER_BUFFER) {
			return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_effecttemplate, this.templateId.toString()) as t_s_effecttemplateData;
		}
		return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaignbuffer, this.templateId.toString()) as t_s_campaignbufferData;
	}

	public getGoodsTemplate(): t_s_itemtemplateData//GoodsTemplateInfo
	{
		return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, this.goodsTemplateId.toString());
	}

	public get KingTemplate(): KingContractInfo {
		return KingContractManager.Instance.model.getInfoById(7);
	}
}