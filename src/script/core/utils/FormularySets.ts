// @ts-nocheck
import { isOversea } from '../../game/module/login/manager/SiteZoneCtrl';
import LangManager from '../lang/LangManager';

export class FormularySets {
	/**
	 * 计算带兵数 
	 * @param captain
	 * @param level
	 * @return 
	 * 
	 */
	public static calcPawnCountByCaptainAndLevel(captain: number, level: number): number {
		return captain + level * 2;
	}
	/**
	 * 计算生命之 
	 * @param level
	 * @param physique
	 * @return 
	 * 
	 */
	public static calcHPByLevelAndPhysique(level: number, physique: number): number {
		return 100 + level * 10 + physique * 5;
	}
	/**
	 * 通过护甲和等级计算暴击值 
	 * @param value
	 * @return 
	 * 
	 */
	public static calcCritByAgility(aglity: number, level: number): number {
		return Math.floor(FormularySets.calcCritValueByAgility(aglity) / level * 0.005);
	}
	/**
	 * 通过护甲计算暴击值 
	 * @param value
	 * @return 
	 * 
	 */
	public static calcCritValueByAgility(aglity: number): number {
		return aglity;
	}


	/**
	 * 通过力量护甲计算物理攻击  
	 * @param value
	 * @return 
	 * 
	 */
	public static calcPhysicalAttackByStrength(strength: number, agility: number): number {
		return Math.floor(strength * 2 + agility);
	}
	/**
	 * 通过力量体质计算物理防御
	 * @param value
	 * @return 
	 * 
	 */
	public static calcPhysicalDefenceByStrengthAndPhysique(strength: number, physique: number): number {
		return strength + physique;
	}
	/**
	 * 通过智力和护甲计算魔法攻击 
	 * @param value1
	 * @param value2
	 * @return 
	 * 
	 */
	public static calcMagicAttackByAbility(ability: number, agility: number): number {
		return ability * 2 + agility;
	}
	/**
	 * 通过智力计算魔法防御 
	 * @param value
	 * @return 
	 * 
	 */
	public static calcMagicDefenceByAbilityAndPhysiqe(ability: number): number {
		return ability;
	}
	/**
	 * 数量单位转换 
	 * @param value
	 * @param step
	 * @return 
	 * 
	 */
	public static toStringSelf(value: number, step: number): string {
		var str: string = "";
		if (isOversea()) {
			if (value > step) {
				value = Math.floor(value / 1000);
				str = value + LangManager.Instance.GetTranslation("public.tenThousands");
			} else
				str = Math.floor(value).toString();
			return str;
		} else {
			if (value > step) {
				value = Math.floor(value / 10000);
				str = value + LangManager.Instance.GetTranslation("public.tenThousands");
			} else
				str = Math.floor(value).toString();
			return str;
		}
	}
}