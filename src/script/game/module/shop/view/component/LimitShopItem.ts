//@ts-expect-error: External dependencies
import FUI_LimitShopItem from "../../../../../../fui/Shop/FUI_LimitShopItem";
import LangManager from "../../../../../core/lang/LangManager";
import {
  getMultiLangList,
  getMultiLangValue,
} from "../../../../../core/lang/LanguageDefine";
import ResMgr from "../../../../../core/res/ResMgr";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { BaseItem } from "../../../../component/item/BaseItem";
import { t_s_itemtemplateData } from "../../../../config/t_s_itemtemplate";
import TemplateIDConstant from "../../../../constant/TemplateIDConstant";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { PathManager } from "../../../../manager/PathManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { MainShopInfo } from "../../model/MainShopInfo";

/**
 * @description  限时商店Item
 * @author yuanzhan.yu
 * @date 2021/4/26 11:52
 * @ver 1.0
 *
 */
export class LimitShopItem extends FUI_LimitShopItem {
  public item: BaseItem;
  public tipData: any;
  public extData: any;
  public tipType: EmWindow;
  canOperate: boolean = false;

  private _info: MainShopInfo;
  private _cacheName: string;
  private _realPath: string;

  public tipBtn: BaseTipItem;
  constructor() {
    super();
  }

  //名称多语言
  private _multiLanNames: Map<string, string> = new Map();

  public set nameLang(value: string) {
    this._multiLanNames = getMultiLangList(value, this._multiLanNames);
  }

  public get nameLang(): string {
    let value = getMultiLangValue(this._multiLanNames);
    return value;
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public get info(): MainShopInfo {
    return this._info;
  }

  public set info(value: MainShopInfo) {
    this._info = value;
    if (value) {
      this.isGift.selectedIndex = this._info.isGift ? 1 : 0;
      if (this._info.isGift) {
        this.item_gift.url = PathManager.info.REQUEST_PATH + this._info.url;
        this.nameLang = this._info.names;
        this.txt_name.text = this.nameLang;
      } else {
        var goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = this._info.templateId;
        goodsInfo.count = this._info["counts"];
        var goodsTempInfo: t_s_itemtemplateData =
          TempleteManager.Instance.getGoodsTemplatesByTempleteId(
            this._info.templateId,
          );
        // var shopInfo: ShopGoodsInfo = TempleteManager.Instance.getShopMainInfoByItemId(this._info.shopId);
        if (!goodsTempInfo) {
          this.item.info = null;
        } else {
          this.item.info = goodsInfo;
        }
        this.item_gift.url = "";
        if (goodsTempInfo) this.txt_name.text = goodsTempInfo.TemplateNameLang;
      }
      //商品均为钻石购买
      // let url = fgui.UIPackage.getItemURL(EmPackName.Base, ShopManager.Instance.model.payTypeRes[1]);
      // this.setMoneyType(url);
      this.tipBtn.setInfo(TemplateIDConstant.TEMP_ID_DIAMOND, false);
      this.tipBtn.visible = true;
      this.txt_price.text = this._info.price + "";
      if (this._info.isDiscount <= 0) {
        //免费
        this.setDiscount(0);
      } else {
        this.setDiscount(Number(this._info.discount));
      }
      this.setTimeText(this._info.remainTime);
    }
  }

  public setTimeText(value: number) {
    if (this._info.type == 1) {
      //促销商品
      if (value > 60 * 60 * 24 * 30) {
        //超出1个月则设置为永久
        this.txt_timelimit.text = LangManager.Instance.GetTranslation(
          "yishi.view.tips.goods.EquipTip.timeStr01",
        );
      } else {
        this.txt_timelimit.text = DateFormatter.getStopDateString(value);
      }
    } else if (this._info.type == 2) {
      //限时抢购
      this.txt_timelimit.text = DateFormatter.getConsortiaCountDate(value);
    }
  }

  /**折扣 */
  private setDiscount(value: number = 0) {
    if (value == 1) {
      //不打折
      this.isFree.selectedIndex = 0;
    } else if (value == 0) {
      this.isFree.selectedIndex = 1;
    } else {
      this.isFree.selectedIndex = 2;
    }
    if (value == 0) {
      this.txt_discount.text =
        LangManager.Instance.GetTranslation("public.free");
    } else {
      let discount = 100 - value * 100;
      this.txt_discount.text = "[b]-" + discount + "%[/b]";
    }
  }

  // public setMoneyType(url: string) {
  //     this.moneyType.url = url;
  //     this.moneyType.visible = true;
  // }

  dispose() {
    this._info = null;
    AnimationManager.Instance.clearAnimationByName(this._cacheName);
    ResMgr.Instance.releaseRes(this._realPath);
    super.dispose();
  }
}
