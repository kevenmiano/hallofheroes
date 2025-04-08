// @ts-nocheck
import FUI_WishPoolView from "../../../../../../fui/Shop/FUI_WishPoolView";
import ConfigMgr from "../../../../../core/config/ConfigMgr";
import LangManager from "../../../../../core/lang/LangManager";
import UIManager from "../../../../../core/ui/UIManager";
import { ArrayConstant, ArrayUtils } from "../../../../../core/utils/ArrayUtils";
import Utils from "../../../../../core/utils/Utils";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import { BaseItem } from "../../../../component/item/BaseItem";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import { t_s_mounttemplateData } from "../../../../config/t_s_mounttemplate";
import { t_s_wishingpoolData } from "../../../../config/t_s_wishingpool";
import { BagType } from "../../../../constant/BagDefine";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { EmWindow } from "../../../../constant/UIDefine";
import { NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { FashionManager } from "../../../../manager/FashionManager";
import { GoodsManager } from "../../../../manager/GoodsManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { MountsManager } from "../../../../manager/MountsManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../../manager/RechargeAlertMannager";
import RingTaskManager from "../../../../manager/RingTaskManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { ShopManager } from "../../../../manager/ShopManager";
import WishPoolManager from "../../../../manager/WishPoolManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import WishPoolInfo from "../../model/WishPoolInfo";
import WishPoolModel from "../../model/WishPoolModel";
import WishPoolItem from "./WishPoolItem";

export default class WishPoolView extends FUI_WishPoolView {
	private goodsArr: Array<GoodsInfo> = [];
	private _currentSelectInfo: t_s_wishingpoolData;
	private _currentSelectId: number = 0;
	private _count: number = 0; //道具数量
	private _needPointCount: number = 0; //需要消耗钻石数量
	private _fashionTips: string;
	private _mountTips: string;
	//@ts-ignore
	public tipItem: BaseTipItem;
	constructor() {
		super();
	}

	public init() {
		this.addEvent();
		this.typeList.numItems = this.wishPoolModel.allWishPoolArr.length;
		if (this.wishPoolModel.allWishPoolArr.length > 0) {
			this.onTypeListClick(this.typeList.getChildAt(0) as WishPoolItem);
		}
	}

	private addEvent() {
		this.typeList.setVirtual();
		this.goodsList.setVirtual();
		this.typeList.itemRenderer = Laya.Handler.create(this, this.renderTypeListItem, null, false);
		this.goodsList.itemRenderer = Laya.Handler.create(this, this.renderGoodListItem, null, false);
		this.wishBtn.onClick(this, this.wishBtnHander);
		this.luckWishBtn.onClick(this, this.luckWishBtnHander);
		this.typeList.on(fgui.Events.CLICK_ITEM, this, this.onTypeListClick);
		NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_WISHDATA, this.refreshView, this);
	}

	private removeEvent() {
		// if (this.typeList.itemRenderer) {
		//     this.typeList.itemRenderer.recover();
		// }
		// if (this.goodsList && this.goodsList.itemRenderer) {
		//     this.goodsList.itemRenderer.recover();
		// }
		Utils.clearGListHandle(this.typeList);
		Utils.clearGListHandle(this.goodsList);
		this.wishBtn.offClick(this, this.wishBtnHander);
		this.luckWishBtn.offClick(this, this.luckWishBtnHander);
		this.typeList.off(fgui.Events.CLICK_ITEM, this, this.onTypeListClick);
		NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_WISHDATA, this.refreshView, this);
	}

	private renderGoodListItem(index: number, item: BaseItem) {
		item.info = this.goodsArr[index];
	}

	private renderTypeListItem(index: number, item: WishPoolItem) {
		item.info = this.wishPoolModel.allWishPoolArr[index];
	}

	private onTypeListClick(item: WishPoolItem) {
		if (item && item.info && this._currentSelectId == item.info.Id) {
			return;
		}
		this._currentSelectInfo = item.info;
		this._currentSelectId = this._currentSelectInfo.Id;
		this.goodsList.scrollToView(0);
		this.refreshView();
	}

	/**许愿 */
	private wishBtnHander() {
		this.checkWish();
	}

	/**幸运许愿 */
	private luckWishBtnHander() {
		this.checkWish();
	}

	private checkWish() {
		if (ShopManager.Instance.isCannotUsePoint) {
			return;
		}

		let wishpoolInfo: WishPoolInfo = this.wishPoolModel.allDic.get(this._currentSelectId);
		if (wishpoolInfo) {
			if (this._currentSelectInfo.WeeklyLimit <= wishpoolInfo.WeekBuyCount && this.status.selectedIndex == 0) {
				//购买已达上限
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("wishpool.checkWish.tips"));
				return;
			}
			if (this._count < this._currentSelectInfo.CostItemNum) {
				//道具不足
				if (this._currentSelectInfo.UnitPrice == 0) {
					//不能够钻石替代
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("wishpoolView.descTxt12"));
					return;
				} else if (this._currentSelectInfo.UnitPrice > 0) {
					//可以钻石替代
					this._needPointCount = (this._currentSelectInfo.CostItemNum - this._count) * this._currentSelectInfo.UnitPrice;
					let needAlert: boolean = true;
					let today: Date = new Date();
					let lastSaveDate: Date = new Date(SharedManager.Instance.wishPoolAlertDate);
					if (lastSaveDate) {
						if (
							today.getFullYear() == lastSaveDate.getFullYear() &&
							today.getMonth() == lastSaveDate.getMonth() &&
							today.getDay() == lastSaveDate.getDay()
						) {
							needAlert = false;
						}
					}
					if (needAlert) {
						//需要提示
						let goods: GoodsInfo = new GoodsInfo();
						goods.templateId = this._currentSelectInfo.CostItemId;
						let goodStr: string = goods.templateInfo.TemplateNameLang;
						let needGoodsCount: number = this._currentSelectInfo.CostItemNum - this._count;
						let content: string = LangManager.Instance.GetTranslation(
							"wishpoolView.descTxt13",
							goodStr,
							this._needPointCount,
							needGoodsCount,
							goodStr
						);
						UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { content: content, backFunction: this.sendBuy.bind(this), state: 2 });
					} else {
						//不需要提示
						var hasMoney: number = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
						if (this._needPointCount <= hasMoney) {
							WishPoolManager.Instance.sendWishPool(this._currentSelectId);
						} else {
							RechargeAlertMannager.Instance.show();
						}
					}
				}
			} else {
				//道具够
				WishPoolManager.Instance.sendWishPool(this._currentSelectId);
			}
		}
	}

	private sendBuy(b: boolean, flag: boolean) {
		if (b) {
			//勾选了今日不再提示
			SharedManager.Instance.wishPoolAlertDate = new Date();
			SharedManager.Instance.saveWishPoolAlert();
		}
		var hasMoney: number = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
		if (this._needPointCount <= hasMoney) {
			WishPoolManager.Instance.sendWishPool(this._currentSelectId);
		} else {
			RechargeAlertMannager.Instance.show();
		}
	}

	private compare(a: GoodsInfo, b: GoodsInfo) {
		let aActive = 0,
			bActive = 0,
			sontypes = [218, 109, 110, 111, 112],
			booklist = FashionManager.Instance.fashionModel.bookList;
		if (sontypes.indexOf(a.templateInfo.SonType) >= 0) {
			if (a.templateInfo.TemplateId in booklist) {
				aActive = 1;
			}

			if (a.templateInfo.SonType == 218) {
				aActive = MountsManager.Instance.avatarList.isLightTemplate(a.templateInfo.Property1) ? 1 : 0;
			}
		}

		if (sontypes.indexOf(b.templateInfo.SonType) >= 0) {
			if (b.templateInfo.TemplateId in booklist) {
				bActive = 1;
			}

			if (b.templateInfo.SonType == 218) {
				bActive = MountsManager.Instance.avatarList.isLightTemplate(b.templateInfo.Property1) ? 1 : 0;
			}
		}

		return aActive - bActive;
	}

	private refreshView() {
		for (let i: number = 0; i < this.typeList.numItems; i++) {
			let item: WishPoolItem = this.typeList.getChildAt(i) as WishPoolItem;
			if (item && item.info && item.info.Id == this._currentSelectId) {
				item.selected = true;
			} else {
				item.selected = false;
			}
		}
		let arr1: Array<string> = this._currentSelectInfo.Rare1.split("|");
		let len1 = arr1.length;
		let str1: string;
		let strArr1: Array<string>;
		let maxValue1: number = 0;
		let minValue1: number = 555;

		let arr2: Array<string> = this._currentSelectInfo.LuckRare1.split("|");
		let len2 = arr2.length;
		let str2: string;
		let strArr2: Array<string>;
		let maxValue2: number = 555;
		let minValue2: number = 0;
		this.goodsArr = this.wishPoolModel.allGoodsDic.get(this._currentSelectId);
		this.goodsArr.sort(this.compare);
		if (this._currentSelectInfo.Type == WishPoolModel.FASHION_CLOTHES) {
			//时装
			for (let i: number = 0; i < len1; i++) {
				str1 = arr1[i];
				strArr1 = str1.split(",");
				if (parseInt(strArr1[0]) < minValue1) {
					minValue1 = parseInt(strArr1[0]);
				}
			}
			this.descTxt1.text = LangManager.Instance.GetTranslation("wishpoolView.descTxt1", this.getFashionGrade(minValue1));

			for (let i: number = 0; i < len2; i++) {
				str2 = arr2[i];
				strArr2 = str2.split(",");
				if (parseInt(strArr2[0]) > minValue2) {
					minValue2 = parseInt(strArr2[0]);
				}
			}
			this.descTxt2.text = LangManager.Instance.GetTranslation("wishpoolView.descTxt2", this.getFashionGrade(minValue2));
			this._fashionTips = this.getTipStr(WishPoolModel.FASHION_CLOTHES);
			FUIHelper.setTipData(this.wishPrecentBtn, EmWindow.CommonTips, this._fashionTips, undefined, TipsShowType.onClick);
		} else if (this._currentSelectInfo.Type == WishPoolModel.MOUNT) {
			//坐骑
			for (let i: number = 0; i < len1; i++) {
				str1 = arr1[i];
				strArr1 = str1.split(",");
				if (parseInt(strArr1[0]) > maxValue1) {
					maxValue1 = parseInt(strArr1[0]);
				}
			}
			this.descTxt1.text = LangManager.Instance.GetTranslation("wishpoolView.descTxt3", maxValue1);

			for (let i: number = 0; i < len2; i++) {
				str2 = arr2[i];
				strArr2 = str2.split(",");
				if (parseInt(strArr2[0]) < maxValue2) {
					maxValue2 = parseInt(strArr2[0]);
				}
			}
			this.descTxt2.text = LangManager.Instance.GetTranslation("wishpoolView.descTxt4", maxValue2);
			this._mountTips = this.getTipStr(WishPoolModel.MOUNT);
			FUIHelper.setTipData(this.wishPrecentBtn, EmWindow.CommonTips, this._mountTips, undefined, TipsShowType.onClick);
		}
		this.goodsList.numItems = this.goodsArr.length;
		this._count = GoodsManager.Instance.getBagCountByTempId(BagType.Player, this._currentSelectInfo.CostItemId);
		this.countTxt.text = this._currentSelectInfo.CostItemNum.toString();
		this.tipItem.setInfo(this._currentSelectInfo.CostItemId);
		let wishpoolInfo: WishPoolInfo = this.wishPoolModel.allDic.get(this._currentSelectId);
		let leftCount: number = 0;
		if (wishpoolInfo) {
			leftCount = this._currentSelectInfo.MaxLuckValue - wishpoolInfo.buyCount;
			if (this._currentSelectInfo.MaxLuckValue == wishpoolInfo.buyCount) {
				this.status.selectedIndex = 1;
			} else {
				this.status.selectedIndex = 0;
			}
		}
		this.wishDescTxt.text = LangManager.Instance.GetTranslation("wishpoolView.descTxt11", leftCount);
	}

	private getTipStr(type: number): string {
		let tipStr: string;
		if (!this._currentSelectInfo) return tipStr;
		let arr: Array<string>;
		let len: number;
		let str: string;
		let strArr: Array<string>;
		if (type == WishPoolModel.FASHION_CLOTHES) {
			tipStr = LangManager.Instance.GetTranslation("wishpoolView.descTxt5");
			arr = this._currentSelectInfo.Rare1.split("|");
			len = arr.length;
			for (let i: number = 0; i < len; i++) {
				str = arr[i];
				strArr = str.split(",");
				tipStr += LangManager.Instance.GetTranslation("wishpoolView.descTxt7", this.getFashionGrade(parseInt(strArr[0])), strArr[1]) + "<br>";
			}

			tipStr += LangManager.Instance.GetTranslation("wishpoolView.descTxt6");
			arr = this._currentSelectInfo.LuckRare1.split("|");
			len = arr.length;
			for (let i: number = 0; i < len; i++) {
				str = arr[i];
				strArr = str.split(",");
				tipStr += LangManager.Instance.GetTranslation("wishpoolView.descTxt7", this.getFashionGrade(parseInt(strArr[0])), strArr[1]) + "<br>";
			}
		} else if (type == WishPoolModel.MOUNT) {
			tipStr = LangManager.Instance.GetTranslation("wishpoolView.descTxt8");
			arr = this._currentSelectInfo.Rare1.split("|");
			len = arr.length;
			for (let i: number = 0; i < len; i++) {
				str = arr[i];
				strArr = str.split(",");
				if (Number(strArr[2]) !== 0) {
					tipStr += LangManager.Instance.GetTranslation("wishpoolView.descTxt10", strArr[0], strArr[1], strArr[2]) + "<br>";
				}
			}

			tipStr += LangManager.Instance.GetTranslation("wishpoolView.descTxt9");
			arr = this._currentSelectInfo.LuckRare1.split("|");
			len = arr.length;
			for (let i: number = 0; i < len; i++) {
				str = arr[i];
				strArr = str.split(",");
				if (Number(strArr[2]) !== 0) {
					tipStr += LangManager.Instance.GetTranslation("wishpoolView.descTxt10", strArr[0], strArr[1], strArr[2]) + "<br>";
				}
			}
		}
		return tipStr;
	}

	private getFashionGrade(value: number): string {
		let str: string;
		switch (value) {
			case 1:
				str = "S";
				break;
			case 2:
				str = "A";
				break;
			case 3:
				str = "B";
				break;
			case 4:
				str = "C";
				break;
		}
		return str;
	}

	private get wishPoolModel(): WishPoolModel {
		return WishPoolManager.Instance.wishPoolModel;
	}

	public dispose(destroy = true) {
		this.removeEvent();
		destroy && super.dispose();
	}
}
