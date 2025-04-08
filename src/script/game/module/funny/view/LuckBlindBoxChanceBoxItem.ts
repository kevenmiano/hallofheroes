import FUI_LuckBlindBox_ChanceBoxItem from "../../../../../fui/Funny/FUI_LuckBlindBox_ChanceBoxItem";

import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";

/**幸运盲盒响应对象 */
import LuckBlindBoxMessage = com.road.yishi.proto.active.ChargePointLotteryMsg;
/**幸运盲盒物品项响应对象 */
import LuckBlindBoxRewardItemMessage = com.road.yishi.proto.active.LotteryItemMsg;

/**
 * 幸运盲盒概率项
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年7月5日14:16:39
 */
export class LuckBlindBoxChanceBoxItem extends FUI_LuckBlindBox_ChanceBoxItem {
	/**
	 * 特殊物品动画控制器(0:不显示动画;1显示动画)
	 */
	public effect: fgui.Controller;
	/**
	 * 物品项(覆盖属性)
	 */
	public propItem: BaseItem;

	/**
	 * 幸运盲盒响应对象
	 */
	private _info: LuckBlindBoxRewardItemMessage;
	/**
	 * 物品类型(1为普通掉落物品, 2为增加一次抽取稀有物品次数的物品,3为稀有物品)
	 */
	private _templateType: number;

	/**
	 * 物品位置
	 */
	public pos: number;

	/**
	 * 构造函数
	 */
	constructor() {
		super();
	}

	/**
	 * 初始化(伪构造函数)
	 */
	protected onConstruct() {
		super.onConstruct();
	}

	/**
	 * 设置物品信息
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年7月5日14:29:59
	 */
	public set info(value: LuckBlindBoxRewardItemMessage) {
		this._info = value;
		if (value) {
			let gInfo: GoodsInfo;

			gInfo = new GoodsInfo();
			gInfo.templateId = value.templateId;
			gInfo.count = value.count;

			this.propItem.info = gInfo;
			this.templateType = value.templateType;
			this.chanceItem.text = value.randomShow.toString() + "%";
			this.pos = value.pos;
		}
	}

	/**
	 * 设置物品类型
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年7月5日14:30:05
	 */
	public set templateType(value: number) {
		this._templateType = value;
		if (value == 1) {
			this.effect.selectedIndex = 1;
		} else {
			this.effect.selectedIndex = 0;
		}
	}

	/**
	 * 释放
	 * @author zhongjyuan
	 * @email zhongjyuan@outlook.com
	 * @datetime 2023年7月5日14:30:41
	 */
	public dispose() {
		super.dispose();
		this._info = null;
		this._templateType = null;
	}
}
