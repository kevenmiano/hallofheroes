import LangManager from '../../core/lang/LangManager';
import { GameUIConfig } from './GameUIConfig';

/**
 *  军队的状态
 *  标识当前军队的行为
 */
export class ArmyState {

	/**
	 * 闲置中
	 */
	public static STATE_WAITING: number = 0;

	/**
	 * 移动
	 */
	public static STATE_MOVING: number = 1;

	/**
	 * 攻占战斗中
	 */
	public static STATE_FIGHT: number = 2;

	/**
	 * 排队等待中
	 */
	public static BATTLE_PENDING: number = 3;
	/**
	 * 召回中
	 */
	public static RECALLING: number = 4;
	/**
	 *部队阵亡 
	 */
	public static DEAD: number = 5;
	/**
	 * 战役中 
	 */
	public static CAMPAIGN: number = 6;


	//副本中攻击
	public static checkCampaignAttack(state: number): boolean {
		if (state == ArmyState.BATTLE_PENDING || state == ArmyState.STATE_FIGHT) return false;
		return true;
	}

	//传回城堡
	public static returnHome(state: number): boolean {
		if (state == ArmyState.RECALLING || state == ArmyState.STATE_WAITING) {
			return true;
		}
		return false;
	}
	//检查部队是否在移动中
	public static moveState(state: number): boolean {
		if (state == ArmyState.RECALLING || state == ArmyState.STATE_MOVING) return true;
		return false;
	}

	//攻击范围
	public static checkAttackRange(p1: Laya.Point, p2: Laya.Point): boolean {
		if (p1.distance(p2.x, p2.y) > GameUIConfig.ATTACK_RANGE) {
			var str: string = LangManager.Instance.GetTranslation("map.internals.constant.ArmyState.command03");
			// MessageTipManager.Instance.show(str);
			return false;
		}
		return true;
	}

}