import FUI_SuperGiftITitleItemCell from "../../../../../fui/Funny/FUI_SuperGiftITitleItemCell";

import { NumericStepper } from "../../../component/NumericStepper";

import LangManager from "../../../../core/lang/LangManager";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";

import Utils from "../../../../core/utils/Utils";
import FUI_Prog_CDLine from "../../../../../fui/Base/FUI_Prog_CDLine";
import FUI_SuperGiftDiaCom from "../../../../../fui/Funny/FUI_SuperGiftDiaCom";

import SuperGiftOfGroupGiftMsg = com.road.yishi.proto.active.GiftMsg;
import SuperGiftOfGroupGiftGoodsMsg = com.road.yishi.proto.active.ItemMsg;
import SuperGiftOfGroupGiftDiamondsMsg = com.road.yishi.proto.active.LevelMsg;
import { SuperGiftOfGroupManager } from "../../../manager/SuperGiftOfGroupManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import MaskLockOper from "../../../component/MaskLockOper";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

/**
 * 超值团购礼包项对象
 * @author zhongjyuan
 * @email zhongjyuan@outlook.com
 * @datetime 2023年11月29日14:52:23
 */
export class SuperGiftOfGroupItem extends FUI_SuperGiftITitleItemCell {
  public stepper: NumericStepper;

  public progressBar: FUI_Prog_CDLine;

  public diamondList: fgui.GList;

  /**开启数量变更处理 */
  private _openNumberChangeHandler: Laya.Handler;

  /**礼包详情对象 */
  private _info: SuperGiftOfGroupGiftMsg;
  /**礼包ID */
  private _giftId: string;
  /**礼包限购数 */
  private _quota: number;
  /**全服礼包已购数量 */
  private _sale: number;
  /**礼包原价 */
  private _costPrice: number;
  /**礼包折扣价 */
  private _discountPrice: number;
  /**个人礼包已购数量 */
  private _purchased: number;
  /**礼包购买数量 */
  private _purchase: number;
  private _diamondTotal: number;

  /**是否更新边界 */
  private _updateBounds: boolean = true;
  /**原始礼包ID */
  private _originGiftId: string;
  /**原始礼包返还档位数 */
  private _originDiamondCount: number;

  /**礼包礼物集合 */
  private _giftList: SuperGiftOfGroupGiftGoodsMsg[];
  /**礼包返还集合 */
  private _diamondList: SuperGiftOfGroupGiftDiamondsMsg[];

  /**返还集合暂时模式:1:动态间距;2:动态宽度 */
  private _diamondListMode: number = 1;
  /**返还集合动态间距数组 */
  private _diamondColumnGap: number[] = [
    0, 84, 33, 7, -8, -18, -25, -30, -35, -39, -42, -44, -46, -48,
  ];

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

    this.diamondList = this.compDiamond.getChild("diamondList") as fgui.GList;
    this.progressBar = this.compDiamond.getChild(
      "progressBar",
    ) as FUI_Prog_CDLine;

    this.initEvent();
  }

  /**
   * 初始化事件
   */
  private initEvent() {
    /**购买按钮 */
    this.btn_buy.onClick(this, this.onBuyButton);

    this.giftList.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderGiftGoodItem,
      null,
      false,
    );
    this.diamondList.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderGiftDiamondItem,
      null,
      false,
    );
  }

  /**
   * 移除事件
   */
  private removeEvent() {
    MaskLockOper.Instance.doCall(false);

    this.btn_buy.offClick(this, this.onBuyButton);

    Utils.clearGListHandle(this.giftList);
    Utils.clearGListHandle(this.diamondList);
  }

  /**
   * 遍历读取礼包物品项
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月30日09:54:55
   * @param index 下标
   * @param item 物品对象
   */
  private onRenderGiftGoodItem(index: number, item: BaseItem) {
    let goodInfo: GoodsInfo = new GoodsInfo();
    goodInfo.templateId = this._giftList[index].itemId;
    goodInfo.count = this._giftList[index].count;
    item.info = goodInfo;
  }

  /**
   * 遍历读取礼包返还项
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月30日09:55:17
   * @param index 下标
   * @param item 返还对象
   */
  private onRenderGiftDiamondItem(index: number, item: FUI_SuperGiftDiaCom) {
    item.getChild("txt_goal").text =
      this._diamondList[index].sellCount.toString();
    item.getChild("txt_number").text =
      this._diamondList[index].backCount.toString();
    item.getController("finish").selectedIndex =
      this._sale >= this._diamondList[index].sellCount ? 1 : 0;
    if (index > 2 && this._updateBounds && this._diamondListMode === 2) {
      this.diamondList.width =
        this.diamondList.width + this.diamondList.columnGap + item.width;
      this.diamondList.ensureBoundsCorrect();
    }
  }

  private showAlter(): boolean {
    let result: boolean = true;

    if (result) {
      let content: string = LangManager.Instance.GetTranslation(
        "yishi.SuperGiftOfGroupManager.open.tips",
        this._discountPrice * this._purchase,
        this._purchase,
      );

      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        null,
        content,
        null,
        null,
        this.alterCallback.bind(this),
      );
    }

    return result;
  }

  private alterCallback(decision: boolean, check: boolean) {
    if (!decision) {
      MaskLockOper.Instance.doCall(false);
      return;
    }

    this.buyGift();
  }

  private buyGift(): void {
    this.btn_buy.enabled = false;

    if (this._diamondTotal < this._discountPrice * this._purchase) {
      MaskLockOper.Instance.doCall(false);
      RechargeAlertMannager.Instance.show();
      this.btn_buy.enabled = true;
      return;
    }

    if (this._purchase + this._purchased > this._quota) {
      MaskLockOper.Instance.doCall(false);
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.SuperGiftOfGroupManager.gift.quota.tip",
          this._quota,
        ),
      );
      this.btn_buy.enabled = true;
      return;
    }

    if (!SuperGiftOfGroupManager.Instance.open) {
      MaskLockOper.Instance.doCall(false);
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "yishi.SuperGiftOfGroupManager.open.exist",
        ),
      );
      this.btn_buy.enabled = true;
      return;
    }

    SuperGiftOfGroupManager.Instance.buyGift(this._giftId, this._purchase);
  }

  /**
   * 购买礼包按钮
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月30日09:55:47
   */
  private onBuyButton(): void {
    MaskLockOper.Instance.doCall(true);

    if (this.showAlter()) return;

    this.buyGift();
  }

  /**
   * 设置礼包信息
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日15:38:50
   */
  public info(
    index: number,
    diamondTotal: number,
    value: SuperGiftOfGroupGiftMsg,
  ) {
    MaskLockOper.Instance.doCall(false);
    // this.btn_buy.enabled = false;
    // this.stepper.enabled = true;
    // this.buy.selectedIndex = 0;

    this._info = value;
    this._diamondTotal = diamondTotal;
    this._giftList = this._info.itemMsg as SuperGiftOfGroupGiftGoodsMsg[];

    this._diamondList = this._info
      .levelMsg as SuperGiftOfGroupGiftDiamondsMsg[];
    this._diamondList = ArrayUtils.sortOn(
      this._diamondList,
      "level",
      ArrayConstant.NUMERIC,
    );

    this._giftId = value.giftId;
    this._quota = value.limitCount;
    this._sale = value.count;
    this._purchased = value.seflCount;
    this._costPrice = value.price;
    this._discountPrice = value.discountPrice;

    this._updateBounds = true;
    if (
      (this._originGiftId && this._originGiftId === this._giftId) ||
      (this._originDiamondCount &&
        this._originDiamondCount === this._diamondList.length)
    ) {
      this._updateBounds = false;
    }
    this._originGiftId = this._giftId;
    this._originDiamondCount = this._diamondList.length;

    this._diamondListMode = this._diamondList.length <= 14 ? 1 : 2;
    if (this._diamondListMode === 1) {
      this.diamondList.columnGap =
        this._diamondColumnGap[this._diamondList.length - 1];
    }

    this.giftList.numItems = this._giftList.length;
    this.diamondList.numItems = this._diamondList.length;

    // 礼包名称
    this.title.text = LangManager.Instance.GetTranslation(
      "yishi.SuperGiftOfGroupManager.gift.title",
      value.sort,
    ); // value.giftName;
    // 礼包原价
    this.txt_lastPrice_value.text = this._costPrice.toString();
    this.txt_lastPrice_value.displayObject.cacheAs = "bitmap";
    // 礼包现价
    this.txt_nowPrice_value.text = this._discountPrice.toString();
    // 每人限购数
    this.txt_limit.text = LangManager.Instance.GetTranslation(
      "yishi.SuperGiftOfGroupManager.gift.quota",
      this._quota - this._purchased,
      this._quota,
    );
    // 全服销售量
    this.txt_server_buy.text = LangManager.Instance.GetTranslation(
      "yishi.SuperGiftOfGroupManager.gift.sale",
      this._sale,
    );

    // 进度
    let progress = 0; // 总进度
    let split = 1 / this._diamondList.length; // 每一个档位所占比例
    for (var i = 0; i < this._diamondList.length; i++) {
      let sellCount = this._diamondList[i].sellCount; // 档位返还触发值
      if (this._sale >= sellCount) {
        progress += split;
      } else {
        if (i == 0) {
          progress += this._sale * (split / sellCount);
        }

        if (i > 0 && this._sale > this._diamondList[i - 1].sellCount) {
          progress +=
            (this._sale - this._diamondList[i - 1].sellCount) *
            (split / (sellCount - this._diamondList[i - 1].sellCount));
        }
      }
    }
    this.progressBar.value = Math.floor(progress * 100); // Math.floor((this._sale / this._diamondList[this._diamondList.length - 1].sellCount) * 100);

    let buyFlag: boolean = this._quota - this._purchased > 0;
    buyFlag = buyFlag && SuperGiftOfGroupManager.Instance.open;

    this.btn_buy.enabled = buyFlag;
    this.stepper.enabled = buyFlag;
    this.buy.selectedIndex = buyFlag ? 1 : 0;

    this._purchase = buyFlag ? 1 : 1;
    this._openNumberChangeHandler && this._openNumberChangeHandler.recover();
    this._openNumberChangeHandler = Laya.Handler.create(
      this,
      this.onOpenNumberChangeHandler,
      null,
      false,
    );
    this.stepper.show(
      0,
      1,
      this._purchase,
      buyFlag ? this._quota - this._purchased : 0,
      buyFlag ? this._quota - this._purchased : 0,
      1,
      this._openNumberChangeHandler,
    );
  }

  /**
   * 购买礼包数量变更处理
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日15:52:38
   * @param value 购买数量
   */
  private onOpenNumberChangeHandler(value: number) {
    this._purchase = value;
  }

  /**
   * 释放
   * @author zhongjyuan
   * @email zhongjyuan@outlook.com
   * @datetime 2023年11月29日15:47:02
   */
  public dispose(): void {
    this._openNumberChangeHandler = null;

    this._info = null;
    this._giftId = null;
    this._quota = null;
    this._sale = null;
    this._costPrice = null;
    this._discountPrice = null;
    this._purchased = null;
    this._purchase = null;

    this._giftList = null;
    this._diamondList = null;

    this.removeEvent();

    super.dispose();
  }
}
