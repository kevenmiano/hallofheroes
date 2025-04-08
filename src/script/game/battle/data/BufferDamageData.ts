// @ts-nocheck
/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description
 **/

import { DamageData } from "./DamageData";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_skillbuffertemplateData } from "../../config/t_s_skillbuffertemplate";
import { IconFactory } from "../../../core/utils/IconFactory";
import StringHelper from "../../../core/utils/StringHelper";
import { BattleManager } from "../BattleManager";
import { BaseRoleInfo } from "./objects/BaseRoleInfo";

export class BufferDamageData {
	public id: number;
	private _buffName: string;
	/** 是否是常驻Buff */
	public isPermanent: boolean;
	public get buffName(): string {
		let name = this.getBufferName();
		return name ? name : this._buffName;
	}
	public set buffName(value: string) {
		this._buffName = value;
	}

	public getBuffUserRole(): BaseRoleInfo {
		let role = BattleManager.Instance.battleModel.getRoleById(this.bufferUser);
		return role;
	}

	public getBuffTargetRole(): BaseRoleInfo {
		let role = BattleManager.Instance.battleModel.getRoleById(this.target);
		return role;
	}

	public get fRoleName() {
		let role = this.getBuffUserRole();
		return role && role.roleName;
	}

	private _templateId: number;
	/**
	 * buffer的生效时机
	 */
	public attackWay: number;
	/**
	 * buffer 使用者 roleId
	 */
	public bufferUser: number;
	/**
	 * 剩余回合数
	 */
	public currentTurn: number;
	/**
	 * 最大回合数（受天赋影响改变后的最大回合）
	 */
	public curMaxTurn: number;
	/**
	 * 当前剩余作用次数
	 */
	public countWay: number;
	/**
	 * 目标的位置 1 - 10
	 */
	public target: number;
	/**
	 * 是否图标
	 */
	public isIcon: boolean;
	/**
	 * 伤害或治疗
	 */
	//		public isHarmful:boolean;
	/**
	 * 第几次受伤时生效
	 */
	public damageCount: number;
	/**
	 * 伤害类型, 决定了数据的处理方式,如加血或减血等.
	 */
	public AttackType: number;
	/**
	 * AttackData 增益1/减益2
	 */
	public AttackData: number;
	/**
	 * 图标ID,决定了加在人物身上的buffer视觉效果
	 */
	public Icon: string;
	public IconPath: string;
	/**
	 * 处理类型. 0  新增  1生效 2失效
	 */
	public processType: number;
	/**
	 *　生效类型. 详见BufferEffectiveType
	 */
	public effectiveType: number;
	/**
	 *　同类型buffer叠加层数
	 */
	public layerCount: number = 1;
	/**
	 *　伤害值列表
	 */
	public damages: Array<DamageData>;
	/**
	 *　buffer执行时间,一般为行动的时间
	 */
	public execFrameTime: number;

	/**
	 * 该buffer可以禁用的技能列表
	 */
	public unAblesSillIds: Array<any>;

	//覆盖类型, 用于Multiple判断
	public CoverType: number;
	// 允许共存, 0不允许, 1允许, 是否允许多个玩家给同一个目标添加效果, 详细规则: 
	// buff覆盖类型不同, 不覆盖
	// 若buff覆盖类型相同, 如果施加者相同, 则覆盖
	// 若buff覆盖类型相同, 且施加者不同, 如果能共存则不覆盖, 如果不能共存则覆盖
	// 覆盖定义: 重置buff的有效次数/持续回合, 如果buff可叠加, 则当前叠加层数+1
	public Multiple: number;

	public level = 1;//buffer等级，星运buf需计算等级

	public get templateId(): number {
		return this._templateId;
	}

	/**
	 * 返回对应次数伤害时的伤害值
	 * @param count
	 * @return
	 *
	 */
	public getDamageByDannyCount(count: number): DamageData {
		for (let index = 0; index < this.damages.length; index++) {
			const damage = this.damages[index];
			if (damage.damageCount == count) return damage;
		}
		return null;
	}

	public templateInfo: t_s_skillbuffertemplateData;

	public set templateId(value: number) {
		this._templateId = value;
		this.templateInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, this._templateId);
		if (this.templateInfo) {
			this.AttackType = this.templateInfo.AttackType;
			this.AttackData = this.templateInfo.AttackData;
			this.CoverType = this.templateInfo.CoverType;
			this.Multiple = this.templateInfo.Multiple;
			this.Icon = this.templateInfo.Icon;
			this.IconPath = IconFactory.getCommonIconPath(this.Icon);
			this.countWay = this.templateInfo.CountWay;
			this.attackWay = this.templateInfo.AttackWay;
		}
	}

	public getBufferName(bufferTemp?: t_s_skillbuffertemplateData): string {
		bufferTemp = bufferTemp ? bufferTemp : this.templateInfo;
		if (bufferTemp) {
			let bufferField: string = StringHelper.getSubStrBetweenTwoChar("{", "}", bufferTemp.BufferNameLang);
			if (StringHelper.isNullOrEmpty(bufferField)) {
				return bufferTemp.BufferNameLang;
			} else {
				let bufferValue: number = bufferTemp.hasOwnProperty(bufferField) ? Math.abs(bufferTemp[bufferField]) * this.layerCount * Math.max(1, this.level) : 0;
				return StringHelper.replaceStr(bufferTemp.BufferNameLang, "{" + bufferField + "}", String(bufferValue));
			}
		}
		return "";
	}
}
