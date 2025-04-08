import { EmPetItem, EmPetItemState, PetItem } from "../item/PetItem";
import { PetData } from "../../data/PetData";
import FUI_PetSelectItem from "../../../../../../fui/Pet/FUI_PetSelectItem";
import { NotificationManager } from "../../../../manager/NotificationManager";

/**
 * 英灵选择项信息
 * @author zhongjyuan
 * @email zhognjyuan@outlook.com
 * @website http://zhongjyuan.club
 * @date 2023年7月26日15:51:11
 */
export class PetSelectItem extends FUI_PetSelectItem {
	/**英灵图标 */
	//@ts-ignore
	public petitem: PetItem;
	/**英灵数据 */
	private _info: PetData;

	/**伪构造函数 */
	protected onConstruct() {
		super.onConstruct();
		this.addEvent();
	}

	private addEvent() {
		this.btn_putin.onClick(this, this.onSelectPet);
		this.btn_takeout.onClick(this, this.onAbandonPet);
	}

	/**获取英灵数据 */
	public get info(): PetData {
		return this._info;
	}

	/**设置英灵数据 */
	public set info(value: PetData) {
		this._info = value;
		this.txt_petname.text = value.name;
		this.txt_petname.color = PetData.getQualityColor(this._info.quality - 1);
		this.txt_petsword.text = value.fightPower.toString();

		this.petitem.enabled = true;
		this.petitem.infoShowIcon(value);
		this.petitem.type = EmPetItem.PetSelectWnd;
		this.petitem.state = EmPetItemState.ItemUsing;
		this.petitem.cSelected.selectedIndex = 0;
	}

	/**选择目标英灵 */
	private onSelectPet() {
		NotificationManager.Instance.sendNotification("PET_SELEXCT", this._info);
	}

	/**放弃目标英灵 */
	private onAbandonPet() {
		NotificationManager.Instance.sendNotification("PET_ABANDON", this._info);
	}

	/**释放 */
	public dispose() {
		super.dispose();
		this._info = null;
		this.petitem = null;
	}
}
