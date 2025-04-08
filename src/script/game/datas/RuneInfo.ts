// @ts-nocheck
/**
	 * 玩家符文信息
	 * @author alan
	 *
	 */
import ConfigMgr from "../../core/config/ConfigMgr";
import GameEventDispatcher from "../../core/event/GameEventDispatcher";
import LangManager from "../../core/lang/LangManager";
import { t_s_runetemplateData } from "../config/t_s_runetemplate";
import { BagType } from "../constant/BagDefine";
import { ConfigType } from "../constant/ConfigDefine";
import { RuneEvent } from "../constant/event/NotificationEvent";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";
import { ThaneInfo } from "./playerinfo/ThaneInfo";

export class RuneInfo extends GameEventDispatcher {
	public userId: number;
	/**
	 * 符文ID 
	 */
	private _runeId: number;
	/**
	 * 符文当前经验 
	 */
	public runeCurGp: number;
	/**
	 * 符文等级 
	 */
	public grade: number;
	/**
	 * 当天吞噬的符文书数量 
	 */
	public swallowCount: number;

	public runeHole:string;       // id1,id2,id3|s1,s2,s3,s4 符文孔id|形状id  1002,1004,1001|2,4,1
	public tempHole:string;       // 雕刻出临时符文孔

	//以下为符文开孔镶嵌后属性加成、技能替换
	newSkillTempId:number; // >0有效 为符文新的技能模版ID
	baseProperties:any;	//基本属性加成 

	public islock:boolean = true;

	public templateInfo: t_s_runetemplateData;
	constructor() {
		super();
	}

	public get runeId(): number {
		return this._runeId;
	}

	public set runeId(value: number) {
		this._runeId = value;
		this.templateInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, this._runeId.toString());
	}

	public get nextTemplateInfo(): t_s_runetemplateData {
		if (this.grade == 0) return this.templateInfo;
		return ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_runetemplate, this.templateInfo.NextRuneId.toString());
	}

	public checkUpgradeCondition(info: t_s_runetemplateData): any[] {
		var arr: any[] = [];
		if (info.NeedGrade > this.thane.grades) {
			arr.push(LangManager.Instance.GetTranslation("buildings.BaseBuildFrame.gradeValue", info.NeedGrade));
		}
		return arr;
	}

	private get thane(): ThaneInfo {
		return ArmyManager.Instance.thane;
	}

	public commit() {
		this.dispatchEvent(RuneEvent.RUNE_UPGRADE, this);
	}

}