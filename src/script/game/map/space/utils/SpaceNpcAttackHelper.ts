// @ts-nocheck
import SpaceNodeType from "../constant/SpaceNodeType";
import Tiles from "../constant/Tiles";
import { SpaceNode } from "../data/SpaceNode";
import SpaceManager from "../SpaceManager";
import StringHelper from "../../../../core/utils/StringHelper";


/**
 *  
 * 攻击NPC帮助类
 * 
 */
export default class SpaceNpcAttackHelper {
	/**
	 * 得到节点的攻击站位点 人物移动到此点
	 * @param info
	 * @param star
	 * @param end
	 * @return 
	 * 
	 */
	public static getAttackPoint(info: SpaceNode, star: Laya.Point, end: Laya.Point): Laya.Point {
		var attack: number = info.handlerRange;
		attack = (attack) * Tiles.WIDTH;
		var leng: number = star.distance(end.x, end.y);
		var tar: Laya.Point;
		for (var i: number = attack; i >= 0; i) {
			tar = StringHelper.interpolate(star, end, i / leng);
			var b: boolean = SpaceManager.Instance.model.getWalkable(Number(tar.x / 20), Number(tar.y / 20));
			if (b) {
				break;
			}
			i -= Tiles.WIDTH;
			if (i <= 0) {
				tar = null;
				break;
			}
		}
		if (tar) return tar;
		return SpaceNpcAttackHelper.getAttackPointImp(info, end);
	}

	private static getAttackPointImp(info: any, attackPoint: Laya.Point): Laya.Point {
		if (info instanceof SpaceNode && (<SpaceNode>info).param1 != SpaceNodeType.PARAM_TRANSFER) {
			var attack: number = (<SpaceNode>info).handlerRange;
			var count: number = 0;
			var isWalk: boolean = false;
			if (attack > 0) {
				while (!isWalk && count < 20) {
					count++;
					var offX: number = SpaceNpcAttackHelper.getRandomByValue(attack);
					var offY: number = SpaceNpcAttackHelper.getRandomByValue(attack);
					var b: boolean = SpaceManager.Instance.model.getWalkable(Number(attackPoint.x / 20) + offX, Number(attackPoint.y / 20) + offY);
					if (b) {
						attackPoint.x += offX * Tiles.WIDTH;
						attackPoint.y += offY * Tiles.HEIGHT;
						isWalk = true;
					}
				}
			}
		}
		return attackPoint;
	}

	private static getRandomByValue(value: number): number {
		var off: number = Math.round(Math.random() * value);
		return Number(Math.random() * 1000) % 2 == 0 ? - off : off;
	}

}