// @ts-nocheck
import { t_s_buildingtemplateData } from "../../../config/t_s_buildingtemplate";
import { TempleteManager } from "../../../manager/TempleteManager";
import BuildingType from "../consant/BuildingType";

export class BuildInfo {
	public templateId: number = 0;
	private _sonType: number = 0;
	public payImpose: number = 0;// 已付费征收次数

	public get sonType(): number {
		if (this.templeteInfo)
			return this.templeteInfo.SonType;
		return 0;
	}

	public set sonType(value: number) {
		this._sonType = value;
	}
	public buildingId: number = 0;
	public property1: number = 0;
	public property2: number = 0;
	public loadTime: number = 0;

	public result: boolean;
	public template: t_s_buildingtemplateData;
	private _nextTemplate: t_s_buildingtemplateData;

	public get sort(): number {
		if (this.templeteInfo) {
			if (this.templeteInfo.SonType == BuildingType.OFFICEAFFAIRS) {//内政厅
				return 1;
			} else if (this.templeteInfo.SonType == BuildingType.CASERN) {//兵营
				return 3;
			} else if (this.templeteInfo.SonType == BuildingType.SEMINARY) {//神学院
				return 5;
			} else if (this.templeteInfo.SonType == BuildingType.CRYSTALFURNACE) {//精炼炉
				return 7;
			} else if (this.templeteInfo.SonType == BuildingType.WAREHOUSE) {//仓库
				return 9;
			} else if (this.templeteInfo.SonType == BuildingType.HOUSES) {//民居
				return 11;
			}
		}
		return 0;
	}

	public get level(): number {
		if (this.templeteInfo) {
			return this.templeteInfo.BuildingGrade;
		}
		return 0;
	}

	public get templeteInfo(): t_s_buildingtemplateData {
		// let data: t_s_buildingtemplate = ConfigMgr.Instance.getSync(ConfigType.t_s_buildingtemplate)
		let item: t_s_buildingtemplateData = TempleteManager.Instance.getBuildTemplateByID(this.templateId);
		// let mDataList= data.mDataList;
		// for(let element of mDataList){
		// 	if (this.templateId == element.TemplateId) {
		// 		item = element;
		// 		break;
		// 	}
		// }


		if (!item) {
			this.template = null;
		} else if (item) {
			if ((!this.template) || (this.template && this.template.TemplateId != this.templateId)) {
				this.template = item;
			}
		}
		return this.template;
	}

	public get nextTemplateInfo(): t_s_buildingtemplateData {
		// let data: t_s_buildingtemplate = ConfigMgr.Instance.getSync(ConfigType.t_s_buildingtemplate);
		let item: t_s_buildingtemplateData = TempleteManager.Instance.getBuildTemplateByID(this.templeteInfo.NextGradeTemplateId);
		// let mDataList= data.mDataList;
		// for(let element of mDataList){
		// 	if (this.templeteInfo.NextGradeTemplateId == element.TemplateId) {
		// 		item = element;
		// 		break;
		// 	}
		// }
		if (!item) {
			this._nextTemplate = null;
		}
		else if (item) {
			if ((!this._nextTemplate) || (this._nextTemplate && this._nextTemplate.TemplateId != item.TemplateId)) {
				this._nextTemplate = item;
			}
		}
		return this._nextTemplate;
	}

	public synchronization(info: BuildInfo) {
		this.templateId = info.templateId;
		this.property1 = info.property1;
		this.property2 = info.property2;
	}

	public getNextNeedResource(temp: t_s_buildingtemplateData): Map<string, number> {
		var dic: Map<string, number> = new Map()
		// dic["CrystalsConsume"] = temp.CrystalsConsume;
		dic["GoldConsume"] = temp.GoldConsume;
		return dic;
	}
}
