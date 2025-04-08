// @ts-nocheck
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Dictionary from "../../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { ItemBuyInfo } from "./ItemBuyInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ShopGoodsInfo } from "./ShopGoodsInfo";
import GoodsSonType from "../../../constant/GoodsSonType";
import { FashionModel } from "../../bag/model/FashionModel";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { ShopEvent } from "../../../constant/event/NotificationEvent";
import { MainShopInfo } from "./MainShopInfo";
import { TempleteManager } from "../../../manager/TempleteManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import MainDiscountInfo = com.road.yishi.proto.shop.MainDiscountInfo;
import TemplateIDConstant from "../../../constant/TemplateIDConstant";

export class ShopModel extends GameEventDispatcher {
	public mainTabIndex: number = 0;

	private _allGoodsList: object = {};
	private _mainDiscountList: any[];
	private _mainNewList: any[];
	private _mainUrlList: any[];
	private _recommendGoodsList: any[];

	private _fashionWeaponList: ShopGoodsInfo[] = []; //时装武器列表
	private _fashionClothList: ShopGoodsInfo[] = []; //时装衣服列表
	private _fashionHairList: ShopGoodsInfo[] = []; //时装帽子列表
	private _fashionWingList: ShopGoodsInfo[] = []; //时装翅膀列表
	private _fashionList: ShopGoodsInfo[] = []; //时装列表

	public homeItemList: ShopGoodsInfo[] = []; //主页物品
	public homeItemList1: ShopGoodsInfo[] = []; //主页物品 （钻石）
	public homeItemList2: ShopGoodsInfo[] = []; //主页物品（绑定钻石）
	public hotGoodsList: ShopGoodsInfo[] = []; //热销
	public hotGoodsList1: ShopGoodsInfo[] = []; //热销（钻石）
	public hotGoodsList2: ShopGoodsInfo[] = []; //热销（绑定钻石）
	public propGoodsList: ShopGoodsInfo[] = []; //道具
	public propGoodsList1: ShopGoodsInfo[] = []; //道具(钻石)
	public propGoodsList2: ShopGoodsInfo[] = []; //道具(绑定钻石)
	public giftGoodsList: ShopGoodsInfo[] = []; //礼金商品
	public giftGoodsList1: ShopGoodsInfo[] = []; //礼金商品(钻石)
	public giftGoodsList2: ShopGoodsInfo[] = []; //礼金商品(绑定钻石)
	public gemstoneGoodsList: ShopGoodsInfo[] = []; //宝石
	public gemstoneGoodsList1: ShopGoodsInfo[] = []; //宝石(钻石)
	public gemstoneGoodsList2: ShopGoodsInfo[] = []; //宝石(绑定钻石)
	public cardReelList: ShopGoodsInfo[] = []; //卡片卷轴
	public cardReelList1: ShopGoodsInfo[] = []; //卡片卷轴(钻石)
	public cardReelList2: ShopGoodsInfo[] = []; //卡片卷轴(绑定钻石)
	public petGoodsList: ShopGoodsInfo[] = []; //英灵
	public petGoodsList1: ShopGoodsInfo[] = []; //英灵(钻石)
	public petGoodsList2: ShopGoodsInfo[] = []; //英灵(绑定钻石)
	public backPlayerList: ShopGoodsInfo[] = []; //老玩家回归
	public backPlayerList1: ShopGoodsInfo[] = []; //老玩家回归（钻石）
	public backPlayerList2: ShopGoodsInfo[] = []; //老玩家回归（绑定钻石）
	public hideGoodsList: ShopGoodsInfo[] = []; //

	private _loopItemList: any[]; //限时抢购(每隔一段时间购买的N个物品)
	private _timeBuyList: any[]; //商城限时物品列表
	private _petExchangeList: any[]; //英灵兑换
	private _petSkillBookDic: Dictionary;
	private _curSelectedTab: string;

	//农场商店模板列表
	private _farmShopTempArr: ShopGoodsInfo[];

	private _tabList: SimpleDictionary;
	private _currentGoodsList: any[];
	private _farmShopList: any[];
	private _showGoodsList: any[];
	private _currentTab: number = 1;
	private _currentPage: number = 1;
	private _totalPage: number = 1;

	private _randomCount: number;
	public giftInfo: ItemBuyInfo; //赠送给其它玩家的物品

	public static PAGE_NUM: number = 8;
	public static PAGE_NUM_8: number = 8;
	public static PAGE_NUM_6: number = 6;
	public static SEEDS_PER_PAGE: number = 6;
	public static STARS_PER_PAGE: number = 6;
	public static MAX_VIP_LEVEL: number = 6;
	public static TAB1: number = 1;
	public static TAB2: number = 2;
	public static TAB3: number = 3;
	public static TAB4: number = 4;

	public static STAR_SHOP: number = 1;
	/** 迷宫硬币模板id */
	public static SHOP_MAZE_COIN_TEMPID: number = 208009;

	public currentPageNum: number = ShopModel.PAGE_NUM;
	/** 已购买的限购次数的商品 */
	private _hasBuyList: any[];

	public payTypeRes: string[] = [
		"",
		"Icon_Unit_Diam_S", //钻石
		"Icon_Unit_Diam2_S", //绑定钻石
		"Icon_Unit_Coin_S", //黄金
		"Icon_Unit_Contribution", //贡献文字
		"Icon_Unit_Insignia", //勋章文字
		"asset.core.MazeCoinlImg", //迷宫硬币文字
		"Icon_Unit_ryshuijing", //荣耀水晶
		"asset.core.BackPLayer", //蓝色礼金
		"Icon_Unit_consortia", //恐惧之牙
		"Icon_Unit_Titan", //泰坦水晶
	];

	constructor() {
		super();

		this._mainDiscountList = [];
		this._mainUrlList = [];
		this._mainNewList = [];
		this._recommendGoodsList = [];
		this._showGoodsList = [];
		this._farmShopTempArr = [];

		this._petExchangeList = [];
		this._hasBuyList = [];
		this._tabList = new SimpleDictionary();
		this._farmShopList = [];

		this.init();
	}

	private init() {
		this._allGoodsList = ConfigMgr.Instance.shopTemplateDic; //TempleteManager.instance.getShopTempInfoList();
		let temp: t_s_itemtemplateData;
		let fashionSoul: ShopGoodsInfo = null;
		let fashionLuckyCharm: ShopGoodsInfo = null;
		for (const key in this._allGoodsList) {
			if (this._allGoodsList.hasOwnProperty(key)) {
				let goods: ShopGoodsInfo = this._allGoodsList[key];
				temp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, goods.ItemId);
				if (!temp) {
					continue;
				}

				if (goods.Area == ShopGoodsInfo.HOME_GOODS) {
					this.homeItemList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.homeItemList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.homeItemList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.HOT_GOODS) {
					this.hotGoodsList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.hotGoodsList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.hotGoodsList2.push(goods);
					}
				} else if (
					goods.Area == ShopGoodsInfo.PROP_GOODS &&
					temp.SonType != GoodsSonType.FASHION_CLOTHES &&
					temp.SonType != GoodsSonType.FASHION_HEADDRESS &&
					temp.SonType != GoodsSonType.FASHION_WEAPON &&
					temp.SonType != GoodsSonType.SONTYPE_WING
				) {
					this.propGoodsList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.propGoodsList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.propGoodsList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.GIFT_GOODS) {
					this.giftGoodsList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.giftGoodsList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.giftGoodsList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.GEMSTONE_GOODS) {
					this.gemstoneGoodsList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.gemstoneGoodsList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.gemstoneGoodsList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.CARDREEL_GOODS) {
					this.cardReelList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.cardReelList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.cardReelList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.PET_GOODS) {
					this.petGoodsList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.petGoodsList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.petGoodsList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.BACK_PLAYER) {
					this.backPlayerList.push(goods);
					if (goods.PayType == ShopGoodsInfo.PAY_BY_POINT) {
						this.backPlayerList1.push(goods);
					} else if (goods.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
						this.backPlayerList2.push(goods);
					}
				} else if (goods.Area == ShopGoodsInfo.NO_SEARCH_SHOP) {
					this.hideGoodsList.push(goods);
				}

				if (goods.IsHot) {
					this._recommendGoodsList.push(goods);
				}

				if (temp.SonType == GoodsSonType.FASHION_WEAPON) {
					this._fashionWeaponList.push(goods);
					this._fashionList.push(goods);
				} else if (temp.SonType == GoodsSonType.FASHION_CLOTHES) {
					this._fashionClothList.push(goods);
					this._fashionList.push(goods);
				} else if (temp.SonType == GoodsSonType.FASHION_HEADDRESS) {
					this._fashionHairList.push(goods);
					this._fashionList.push(goods);
				} else if (temp.SonType == GoodsSonType.SONTYPE_WING) {
					this._fashionWingList.push(goods);
					this._fashionList.push(goods);
				}

				if (goods.ItemId == FashionModel.FASHION_SOUL) {
					//时装之魂
					fashionSoul = goods;
				} else if (goods.ItemId == FashionModel.FASHION_LUCKYCHARM) {
					//幸运符
					fashionLuckyCharm = goods;
				}
			}
		}

		if (fashionSoul) {
			//时装之魂在时装栏内出现
			this._fashionWeaponList.push(fashionSoul);
			this._fashionList.push(fashionSoul);
			this._fashionClothList.push(fashionSoul);
			this._fashionList.push(fashionSoul);
			this._fashionHairList.push(fashionSoul);
			this._fashionList.push(fashionSoul);
			this._fashionWingList.push(fashionSoul);
			this._fashionList.push(fashionSoul);
		}
		if (fashionLuckyCharm) {
			//幸运符在时装栏内出现
			this._fashionWeaponList.push(fashionLuckyCharm);
			this._fashionList.push(fashionLuckyCharm);
			this._fashionClothList.push(fashionLuckyCharm);
			this._fashionList.push(fashionLuckyCharm);
			this._fashionHairList.push(fashionLuckyCharm);
			this._fashionList.push(fashionLuckyCharm);
			this._fashionWingList.push(fashionLuckyCharm);
			this._fashionList.push(fashionLuckyCharm);
		}

		this.hotGoodsList = ArrayUtils.sortOn(this.hotGoodsList, "Sort", ArrayConstant.NUMERIC);
		this.propGoodsList = ArrayUtils.sortOn(this.propGoodsList, "Sort", ArrayConstant.NUMERIC);
		this.gemstoneGoodsList = ArrayUtils.sortOn(this.gemstoneGoodsList, "Sort", ArrayConstant.NUMERIC);
		this.backPlayerList = ArrayUtils.sortOn(this.backPlayerList, "Sort", ArrayConstant.NUMERIC);
		this._recommendGoodsList = ArrayUtils.sortOn(this._recommendGoodsList, "Sort", ArrayConstant.NUMERIC);
		this.giftGoodsList = ArrayUtils.sortOn(this.giftGoodsList, "Sort", ArrayConstant.NUMERIC);
		this.cardReelList = ArrayUtils.sortOn(this.cardReelList, "Sort", ArrayConstant.NUMERIC);
		this.petGoodsList = ArrayUtils.sortOn(this.petGoodsList, "Sort", ArrayConstant.NUMERIC);

		let dic = ConfigMgr.Instance.farmShopTemplateDic;
		for (const key in dic) {
			if (dic.hasOwnProperty(key)) {
				let fstemp: ShopGoodsInfo = dic[key];
				this._farmShopTempArr.push(fstemp);
			}
		}
		this._farmShopTempArr = ArrayUtils.sortOn(this._farmShopTempArr, "NeedGrades", ArrayConstant.NUMERIC);
	}

	public get curSelectedTab(): string {
		return this._curSelectedTab;
	}

	public set curSelectedTab(value: string) {
		this._curSelectedTab = value;
		this.dispatchEvent(ShopEvent.CURSELECTED_TAB_CHANGE, this._curSelectedTab);
	}

	public get fashionClothList(): any[] {
		return this._fashionClothList;
	}

	public get fashionWeaponList(): any[] {
		return this._fashionWeaponList;
	}

	public get fashionHairList(): any[] {
		return this._fashionHairList;
	}

	public get fashionWingList(): any[] {
		return this._fashionWingList;
	}

	public get fashionList(): any[] {
		return this._fashionList;
	}

	public get farmShopTempArr(): ShopGoodsInfo[] {
		return this._farmShopTempArr;
	}

	public get mainDiscountList(): any[] {
		let arr: any[] = [];
		for (let i: number = 0; i < this._mainDiscountList.length; i++) {
			if (this._mainDiscountList[i].remainTime > 0) {
				arr.push(this._mainDiscountList[i]);
			}
		}
		return arr;
	}

	/**
	 * 获取限时热卖商品列表
	 * @param isNeedVIP  是否需要VIP才能购买的（-1为不限, 0为不需要, 1为需要）
	 */
	public getTimeBuyList(isNeedVIP: number = -1): any[] {
		let arr: any[] = [];
		if (this._timeBuyList) {
			let len: number = this._timeBuyList.length;
			let shopInfo: MainShopInfo;
			let b: boolean = false;
			for (let i: number = 0; i < len; i++) {
				shopInfo = this._timeBuyList[i];
				switch (isNeedVIP) {
					case -1:
						b = true;
						break;
					case 0:
						b = shopInfo.needVIPGrade == 0;
						break;
					case 1:
						b = shopInfo.needVIPGrade > 0;
						break;
				}
				if (b && shopInfo.remainTime > 0) {
					arr.push(shopInfo);
				}
			}
		}
		return arr;
	}

	public set mainDiscountList(value: any[]) {
		this._mainDiscountList = [];
		this._loopItemList = [];
		this._timeBuyList = [];
		let discountInfo: MainDiscountInfo;
		let mainShopInfo: MainShopInfo;
		let shopInfo: ShopGoodsInfo;
		let len: number = value.length;
		for (let i: number = 0; i < len; i++) {
			discountInfo = value[i];
			mainShopInfo = new MainShopInfo();
			mainShopInfo.id = discountInfo.id;
			mainShopInfo.site = discountInfo.site;
			mainShopInfo.isGift = discountInfo.isGift;
			mainShopInfo.type = discountInfo.type;
			mainShopInfo.limitCount = discountInfo.limitCount;
			mainShopInfo.needVIPGrade = discountInfo.vip;

			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId) && discountInfo.shopId > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId1);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId1) && discountInfo.shopId1 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId2);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId2) && discountInfo.shopId2 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId3);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId3) && discountInfo.shopId3 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId4);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId4) && discountInfo.shopId4 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId5);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId5) && discountInfo.shopId5 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId6);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId6) && discountInfo.shopId6 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId7);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId7) && discountInfo.shopId7 > 0) {
				continue;
			}
			shopInfo = TempleteManager.Instance.getShopMainInfoByItemId(discountInfo.shopId8);
			if ((!shopInfo || shopInfo.ItemId != discountInfo.templateId8) && discountInfo.shopId8 > 0) {
				continue;
			}
			mainShopInfo.shopId = discountInfo.shopId;
			mainShopInfo.templateId = discountInfo.templateId;
			mainShopInfo.counts = discountInfo.counts;

			mainShopInfo.shopId1 = discountInfo.shopId1;
			mainShopInfo.templateId1 = discountInfo.templateId1;
			mainShopInfo.count1 = discountInfo.count1;

			mainShopInfo.shopId2 = discountInfo.shopId2;
			mainShopInfo.templateId2 = discountInfo.templateId2;
			mainShopInfo.count2 = discountInfo.count2;

			mainShopInfo.shopId3 = discountInfo.shopId3;
			mainShopInfo.templateId3 = discountInfo.templateId3;
			mainShopInfo.count3 = discountInfo.count3;

			mainShopInfo.shopId4 = discountInfo.shopId4;
			mainShopInfo.templateId4 = discountInfo.templateId4;
			mainShopInfo.count4 = discountInfo.count4;

			mainShopInfo.shopId5 = discountInfo.shopId5;
			mainShopInfo.templateId5 = discountInfo.templateId5;
			mainShopInfo.count5 = discountInfo.count5;

			mainShopInfo.shopId6 = discountInfo.shopId6;
			mainShopInfo.templateId6 = discountInfo.templateId6;
			mainShopInfo.count6 = discountInfo.count6;

			mainShopInfo.shopId7 = discountInfo.shopId7;
			mainShopInfo.templateId7 = discountInfo.templateId7;
			mainShopInfo.count7 = discountInfo.count7;

			mainShopInfo.shopId8 = discountInfo.shopId8;
			mainShopInfo.templateId8 = discountInfo.templateId8;
			mainShopInfo.count8 = discountInfo.count8;

			mainShopInfo.currentCount = discountInfo.currentCount;
			mainShopInfo.sortId = discountInfo.sortId;
			mainShopInfo.discount = discountInfo.discount / 100;
			mainShopInfo.oneDayCount = discountInfo.oneDayCount;
			mainShopInfo.maxCount = discountInfo.maxCount;
			mainShopInfo.maxCurrentDate = DateFormatter.parse(discountInfo.maxCurrentDate, "YYYY-MM-DD hh:mm:ss").getTime() / 1000;
			mainShopInfo.url = discountInfo.url;
			mainShopInfo.names = discountInfo.names;
			mainShopInfo.beginDate = DateFormatter.parse(discountInfo.beginDate, "YYYY-MM-DD hh:mm:ss").getTime() / 1000;
			mainShopInfo.endDate = DateFormatter.parse(discountInfo.endDate, "YYYY-MM-DD hh:mm:ss").getTime() / 1000;

			if (mainShopInfo.isGift) {
				mainShopInfo.isDiscount = discountInfo.price;
				mainShopInfo.setContent();
				mainShopInfo.sortName = mainShopInfo.names;
			} else {
				let goodsInfo: GoodsInfo = new GoodsInfo();
				goodsInfo.templateId = mainShopInfo.templateId;
				let goodsTempInfo: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, mainShopInfo.templateId);
				if (goodsTempInfo) mainShopInfo.sortName = goodsTempInfo.TemplateNameLang;
				else mainShopInfo.sortName = "";
			}
			mainShopInfo.setPrice(discountInfo.price);
			if (mainShopInfo.type == 1) {
				this._mainDiscountList.push(mainShopInfo);
				this._timeBuyList.push(mainShopInfo);
			} else if (mainShopInfo.type == 2) {
				this._loopItemList.push(mainShopInfo);
				this._timeBuyList.push(mainShopInfo);
			}
		}
		this._mainDiscountList = ArrayUtils.sortOn(this._mainDiscountList, "sortName", ArrayConstant.NUMERIC);
		this._loopItemList = ArrayUtils.sortOn(this._loopItemList, "sortId", ArrayConstant.NUMERIC);
		this._timeBuyList = ArrayUtils.sortOn(this._timeBuyList, "type", ArrayConstant.DESCENDING);
	}

	public get mainUrlList(): any[] {
		return this._mainUrlList;
	}

	public set mainUrlList(value: any[]) {
		this._mainUrlList = value;
		this._mainUrlList = ArrayUtils.sortOn(this._mainUrlList, "site", ArrayConstant.NUMERIC);
	}

	public get mainNewList(): any[] {
		return this._mainNewList;
	}

	public set mainNewList(value: any[]) {
		this._mainNewList = value;
		this._mainNewList = ArrayUtils.sortOn(this._mainNewList, "sortId", ArrayConstant.NUMERIC);
	}

	public get recommendGoodsList(): any[] {
		return this._recommendGoodsList;
	}

	public set recommendGoodsList(value: any[]) {
		this._recommendGoodsList = value;
	}

	public get allGoodsList(): any {
		return this._allGoodsList;
	}

	public set allGoodsList(value: any) {
		this._allGoodsList = value;
	}

	public get showGoodsList(): any[] {
		return this._showGoodsList;
	}

	updateHasBuyList(info: any) {
		if (!info) return;
		let len = this._hasBuyList.length;
		if (len == 0) {
			this._hasBuyList.push(info);
		} else {
			for (let j: number = 0; j < len; j++) {
				let shopInfo = this._hasBuyList[j];
				if (info instanceof MainShopInfo) {
					if (shopInfo instanceof MainShopInfo) {
						if (info.id && info.id != shopInfo.id) {
							this._hasBuyList.push(info);
							break;
						}
					}
				} else {
					if (shopInfo instanceof ShopGoodsInfo) {
						if (info.Id && info.Id != shopInfo.Id) {
							this._hasBuyList.push(info);
							break;
						}
					}
				}
			}
		}
	}

	/**
	 * 0点后重置限购次数
	 */
	resetHasBuyList() {
		let len = this._hasBuyList.length;
		let shopInfo;
		for (let j: number = 0; j < len; j++) {
			shopInfo = this._hasBuyList[j];
			shopInfo.OneCurrentCount = 0;
			shopInfo.weekCount = 0;
		}
	}

	/**
	 * 0点后重置周限购次数
	 */
	resetWeekBuyList() {
		let len = this._hasBuyList.length;
		let shopInfo;
		for (let j: number = 0; j < len; j++) {
			shopInfo = this._hasBuyList[j];
			if(shopInfo.WeeklyLimit > -1){
				shopInfo.OneCurrentCount = 0;
				shopInfo.weekCount = 0;
			}
		}

		let petExchangeGoodsList = ConfigMgr.Instance.petExchangeShopTemplateDic;
		for (const key in petExchangeGoodsList) {
			if (petExchangeGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = petExchangeGoodsList[key];
				item.weekCount = 0;
			}
		}
	}

	public set showGoodsList(value: any[]) {
		this._showGoodsList = value;
		this.dispatchEvent(ShopEvent.GOODS_LIST_UPDATE);
	}

	public resetData(pageNum: number = ShopModel.PAGE_NUM, curTab: number = 1, curPage: number = 1) {
		this.currentPageNum = pageNum;
		this._currentTab = curTab;
		this._currentPage = curPage;
	}

	public set currentTab(value: number) {
		if (this._currentTab == value) {
			return;
		}
		this._currentTab = value;
		this.currentGoodsList = this._tabList[this._currentTab];
		if (this.currentGoodsList) {
			this.currentPage = 1;
			this.totalPage = Math.ceil(this.currentGoodsList.length / this.currentPageNum);
			let startIndex: number = (this.currentPage - 1) * this.currentPageNum;
			let endIndex: number = startIndex + this.currentPageNum;
			if (endIndex > this.currentGoodsList.length) {
				endIndex = this.currentGoodsList.length;
			}
			this.showGoodsList = this.currentGoodsList.slice(startIndex, endIndex);
		}
	}

	public get currentPage(): number {
		return this._currentPage;
	}

	public set currentPage(value: number) {
		value = value <= 0 ? 1 : value;
		this._currentPage = value;
		this.dispatchEvent(ShopEvent.PAGE_UPDATE);
	}

	public get totalPage(): number {
		return this._totalPage;
	}

	public set totalPage(value: number) {
		value = value <= this._currentPage ? this._currentPage : value;
		this._totalPage = value;
		this.dispatchEvent(ShopEvent.PAGE_UPDATE);
	}

	public get tabList(): SimpleDictionary {
		return this._tabList;
	}

	public get currentGoodsList(): any[] {
		return this._currentGoodsList;
	}

	public set currentGoodsList(value: any[]) {
		this._currentGoodsList = value;
	}

	public get farmShopList() : ShopGoodsInfo[]{
		return this._farmShopList;
	}
	public set farmShopList(value: ShopGoodsInfo[]){
		this._farmShopList = value;
	}

	public get randomCount(): number {
		if (this._randomCount == 0) {
			this._randomCount = Math.random();
		}
		return this._randomCount;
	}

	public set randomCount(value: number) {
		this._randomCount = value;
	}

	public getShopTempInfoById(id: number): ShopGoodsInfo {
		for (const key in this._allGoodsList) {
			if (this._allGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = this._allGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		//农场物品
		for (const key in this._farmShopTempArr) {
			if (this._farmShopTempArr.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = this._farmShopTempArr[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		let advConsortiaGoodsList = ConfigMgr.Instance.advConsortiaShopTemplateDic;
		for (const key in advConsortiaGoodsList) {
			if (advConsortiaGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = advConsortiaGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		let consortiaGoodsList = ConfigMgr.Instance.consortiaShopTemplateDic;
		for (const key in consortiaGoodsList) {
			if (consortiaGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = consortiaGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		let consortiaHighShopGoodsList = ConfigMgr.Instance.consortiaHighShopTemplateDic;
		for (const key in consortiaHighShopGoodsList) {
			if (consortiaHighShopGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = consortiaHighShopGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		let mazeGoodsList = ConfigMgr.Instance.mazeShopTemplateDic;
		for (const key in mazeGoodsList) {
			if (mazeGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = mazeGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		let athleticsGoodsList = ConfigMgr.Instance.athleticsShopTemplateDic;
		for (const key in athleticsGoodsList) {
			if (athleticsGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = athleticsGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}

		//英灵兑换
		let petExchangeGoodsList = ConfigMgr.Instance.petExchangeShopTemplateDic;
		for (const key in petExchangeGoodsList) {
			if (petExchangeGoodsList.hasOwnProperty(key)) {
				let item: ShopGoodsInfo = petExchangeGoodsList[key];
				if (item.Id == id) {
					return item;
				}
			}
		}
		return null;
	}

	/** 商城 切换到时装标签页 */
	public switchToFashionTab() {
		this.dispatchEvent(ShopEvent.SWITCH_FASHION_PANEL);
	}

	public get petExchangeList(): any[] {
		return this._petExchangeList;
	}

	public get petSkill(): Dictionary {
		if (!this._petSkillBookDic) {
			this._petSkillBookDic = new Dictionary();
			const types: number[] = [101, 102, 103, 104, 105, 106];
			const allSkill: any = ConfigMgr.Instance.getDicSync(ConfigType.t_s_skilltemplate);
			for (const type of types) {
				const s1: any[] = [];
				for (const skill of Object.values(allSkill)) {
					if (!skill) continue;
					if (skill["MasterType"] === type || skill["MasterType"] === 107) {
						skill["itemTemplate"] = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, "Property1" + skill["TemplateId"]);
						if (!skill["itemTemplate"]) continue;
						skill["itemTemplate"] = skill["itemTemplate"][0];
						s1.push(skill);
					}
				}
				this._petSkillBookDic[type] = s1;
			}
		}
		return this._petSkillBookDic;
	}

	public get petSkillBookDic(): Dictionary {
		if (!this._petSkillBookDic) {
			this._petSkillBookDic = new Dictionary();
			const types: number[] = [101, 102, 103, 104, 105, 106];
			const allBook: any = ConfigMgr.Instance.getDicSync(ConfigType.t_s_itemtemplate);
			const allSkill: any = ConfigMgr.Instance.getDicSync(ConfigType.t_s_skilltemplate);

			for (const type of types) {
				const s1: any[] = [];
				const s2: any[] = [];

				for (const skill of Object.values(allSkill)) {
					if (!skill) continue;

					for (const book of Object.values(allBook)) {
						if (book["Property1"] !== skill["TemplateId"]) continue;

						if (skill["MasterType"] === type || skill["MasterType"] === 107) {
							if (skill["UseWay"] === 1) {
								s1.push(book);
							} else {
								s2.push(book);
							}
						}

						break; // 提前终止循环, 因为已经找到匹配的书籍
					}
				}

				const result: any[] = [...s1, ...s2];
				this._petSkillBookDic[type] = result;
			}
		}

		return this._petSkillBookDic;
	}

	public get petSkillBookDic_old(): Dictionary {
		if (!this._petSkillBookDic) {
			this._petSkillBookDic = new Dictionary();

			let allbooks: any[] = this.hideGoodsList;
			let skill: t_s_skilltemplateData;
			let types: any[] = [101, 102, 103, 104, 105, 106];
			for (let i = 0; i < types.length; i++) {
				const type: number = types[i];
				let s1: any[] = [];
				let s2: any[] = [];
				for (let i = 0; i < allbooks.length; i++) {
					const shopBook: ShopGoodsInfo = allbooks[i];
					let book: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, shopBook.ItemId);
					if (!book) {
						continue;
					}
					skill = TempleteManager.Instance.getSkillTemplateInfoById(book.Property1);
					if (!skill) {
						continue;
					}
					if (skill.MasterType == type || skill.MasterType == 107) {
						if (skill.UseWay == 1) {
							s1.push(book);
						} else {
							s2.push(book);
						}
					}
				}
				let result: any[] = s1.concat(s2);
				this._petSkillBookDic[type] = result;
			}
		}
		return this._petSkillBookDic;
	}

	public getShopShowList(): Array<ShopGoodsInfo> {
		let startIndex: number = (this.currentPage - 1) * this.currentPageNum;
		let endIndex: number = startIndex + this.currentPageNum;
		if (endIndex > this.currentGoodsList.length) {
			endIndex = this.currentGoodsList.length;
		}
		return this.currentGoodsList.slice(startIndex, endIndex);
	}

	public static getIconPath(shopType: number): string {
		/**获取系统频道图标 */
		switch (shopType) {
			case ShopModel.STAR_SHOP:
				return "Icon_Unit_Astrals";
				break;
			case ShopGoodsInfo.CONSORTIA_SHOP:
				return "Icon_Unit_Contribution";
				break;
			case ShopGoodsInfo.WARLORDS_SHOP:
				return "Icon_Unit_ryshuijing";
				break;
			case ShopGoodsInfo.ADVCONSORTIA_SHOP:
				return "Icon_Unit_consortia";
				break;
		}
		return "";
	}

	public getTemplateId(type: number): number {
		let templateId: number = 0;
		switch (type) {
			case 1: //钻石
				templateId = TemplateIDConstant.TEMP_ID_DIAMOND;
				break;
			case 2: //绑定钻石
				templateId = TemplateIDConstant.TEMP_ID_GIFT;
				break;
			case 3: //黄金
				templateId = TemplateIDConstant.TEMP_ID_GOLD;
				break;
			case 4: //公会贡献
				templateId = TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE;
				break;
			case 5: //勋章
				templateId = TemplateIDConstant.TEMP_ID_XUNZHANG;
				break;
			case 6: //迷宫硬币
				// templateId = TemplateIDConstant.TEMP_ID_MAZE;
				break;
			case 7: //荣耀水晶
				templateId = TemplateIDConstant.TEMP_ID_RYSJ;
				break;
			case 8: //蓝色礼金
				// templateId = TemplateIDConstant.TEMP_ID_CONSORTIA_CONTRIBUTE;
				break;
			case 9: //恐惧之牙
				templateId = TemplateIDConstant.TEMP_ID_CONSORTIA;
				break;
			case 10: //泰坦水晶
				templateId = TemplateIDConstant.TEMP_ID_TITAN;
				break;
			case 14://建设值	
				templateId = ShopGoodsInfo.GUILD_CONTRIBUTION;
				break;
		}
		return templateId;
	}
}
