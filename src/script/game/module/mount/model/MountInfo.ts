// @ts-nocheck

import GameEventDispatcher from '../../../../core/event/GameEventDispatcher';
import Dictionary from '../../../../core/utils/Dictionary';
import { t_s_upgradetemplateData } from '../../../config/t_s_upgradetemplate';
import { MountsEvent } from '../../../constant/event/NotificationEvent';
import { TempleteManager } from '../../../manager/TempleteManager';
import { MountType } from './MountType';
import { PropertyInfo } from './PropertyInfo';
import { ArrayUtils, ArrayConstant } from '../../../../core/utils/ArrayUtils';
import { t_s_mounttemplateData } from '../../../config/t_s_mounttemplate';
	/**
	 * 当前坐骑的信息 
	 * 
	 */	
	export class MountInfo extends GameEventDispatcher
	{
		private _properties:Dictionary = new Dictionary();
		
		public soulScore:number = 0;
		
		public discount:number = 0;

		/** 移动速度百分比加成 */
		public get speedAdd():number {
			var speed:number = 20 + Math.ceil(this.grade / 2) * 10;
			if (this.template && this.template.MountType == MountType.MAGIC) {
				speed += this.template.Speed;
			}
			return speed;
		}
		/** 属性的最大等级 */
		public propertyGradeMax:number = 0;
		
		private _templateId:number = 0;
		public get templateId():number { return this._templateId; }
		
		public set templateId(value:number) {
			this._templateId = value;
		}
		
		
		private _upgradeTemplate:t_s_upgradetemplateData;
		/**
		 * 当前的升级模板 
		 * @return 
		 * 
		 */		
		public get upgradeTemplate():t_s_upgradetemplateData {
			return this._upgradeTemplate;
		}
		
		private _growExp:number = 0;
		public get growExp():number { return this._growExp; }
		/** 成长经验 服务器发送过来的坐骑的总经验(从1级开始) */
		public set growExp(value:number) {
			this._growExp = value;
			var arr:any[] = TempleteManager.Instance.getTemplatesByType(19);//坐骑升级的所有模板
			arr = ArrayUtils.sortOn(arr,["Data"],[ArrayConstant.NUMERIC]);
			for (var i:number=0, len:number=arr.length; i < len; i++) {
				if (this.growExp >= arr[i].Data && 
					(i + 1 == len || this.growExp < arr[i + 1].Data) ) {
					if (this._upgradeTemplate && this._upgradeTemplate.Grades <  arr[i].Grades) {
						this.dispatchEvent(MountsEvent.MOUNT_LEVEL_UP, this._upgradeTemplate.Grades);
					}
					this._upgradeTemplate = arr[i];
					this._currentGrowExp = this.growExp - this._upgradeTemplate.Data;
					if (len == 1) {//只有一个等级
						this._growExpMax = arr[0].Data;
					} else if (i + 1 == len) {//满级
						this._isMaxGrade = true;
						this._growExpMax = arr[i].Data - arr[i - 1].Data;
						this._currentGrowExp = this._growExpMax;
					} else {
						this._growExpMax = arr[i + 1].Data - arr[i].Data;
					}
					this._currentGrowExp = Math.min(this._currentGrowExp, this._growExpMax);
					break;
				}
			}
		}
		private _isMaxGrade:boolean = false;
		/** 是否为满级 */
		public get isMaxGrade():boolean {
			return this._isMaxGrade;
		}
		private _growExpMax:number = 0;
		private _currentGrowExp:number = 0;
		/** 当前等级升级需要的总经验 */
		public get growExpMax():number {
			return this._growExpMax;
		}
		
		/** 当前等级的经验  */		
		public get currentGrowExp():number {
			return this._currentGrowExp;
		}
		/** 当前等级 */
		public get grade():number {
			return (this.upgradeTemplate != null ? this.upgradeTemplate.Grades : 1);
		}
		
		constructor() {
            super();
			this.addProperty(PropertyInfo.STRENGTH);
			this.addProperty(PropertyInfo.INTELLECT);
			this.addProperty(PropertyInfo.STAMINA);
			this.addProperty(PropertyInfo.ARMOR);
		}
		
		/** 得到相应的属性信息 */
		public getProperty(name:string):PropertyInfo {
			return this._properties[name];
		}
		
		/** 添加一条属性 */
		private addProperty(name:string) {
			var info:PropertyInfo = new PropertyInfo();
			info.name = name;
			info.mountInfo = this;
			this._properties[name] = info;
		}
		
		public get template():t_s_mounttemplateData {
			return TempleteManager.Instance.getMountTemplateById(this.templateId);
		}
		
		/** 坐骑信息更改 */
		public dispatchChangeEvent() {
			this.dispatchEvent(MountsEvent.MOUNT_INFO_CHANGE, this);
		}
		
		/** 属性升级 */
		public dispatchPropLevelupEvent(data:any=null) {
			this.dispatchEvent(MountsEvent.PROP_LEVEL_UP, data);
		}

		/** 坐骑炼化升级 */
		public dispatchStatInfoEvent(data:any=null) {
			this.dispatchEvent(MountsEvent.MOUNT_STAR_UP, data);
		}
		
	}