// @ts-nocheck
export default class SinglePassBugleInfo {
	/**
	 * 下次开启需要的钻石数量
	 */
	public needPoint: number = 0;
	/**
	 * 当前开启已的次数
	 */
	public openCount: number = 0;
	/**
	 * 牌位置(1-8)
	 */
	public openIndex: Array<number>;
	/**
	 * 物品列表
	 */
	public itemList: Array<any>;
}