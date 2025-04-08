
import FUI_RewardItem from "../../../../fui/Base/FUI_RewardItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { BaseItem } from "./BaseItem";

/**
 * 奖励Item带特效
 * @author xie.haibin
 * @date 2024.6.28
 */
export class RewardItem extends FUI_RewardItem {
    /**
     * 物品项(覆盖属性)
     */
    declare public item: BaseItem;

    constructor() {
		super();
	}

    protected onConstruct(): void {
        super.onConstruct();
    }

    /**
	 * 设置物品信息
	 */
	public set info(value: GoodsInfo) {
        if (!value) {
            return;
        }
	
		this.item.info = value;
        this.effectController.selectedIndex = value.displayEffect;
	}

    dispose() {
        super.dispose();
    }
}