//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { ShopManager } from "../../../manager/ShopManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { ShopGoodsInfo } from "../model/ShopGoodsInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { ConfigType } from "../../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import GoodsSonType from "../../../constant/GoodsSonType";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { t_s_composeData } from "../../../config/t_s_compose";
import { TempleteManager } from "../../../manager/TempleteManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import StringHelper from "../../../../core/utils/StringHelper";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { C2SProtocol } from "../../../constant/protocol/C2SProtocol";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { MainShopInfo } from "../model/MainShopInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ResourceManager } from "../../../manager/ResourceManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import MazeModel from "../../maze/MazeModel";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { PackageIn } from "../../../../core/net/PackageIn";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../component/FilterFrameText";
import ShopMsg = com.road.yishi.proto.shop.ShopMsg;
import { BaseItem } from "../../../component/item/BaseItem";
import { MountsManager } from "../../../manager/MountsManager";
import { NumericStepper } from "../../../component/NumericStepper";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { CommonConstant } from "../../../constant/CommonConstant";
import BaseTipItem from "../../../component/item/BaseTipItem";

/**
 * @description 快捷购买
 * @author yuanzhan.yu
 * @date 2021/4/23 14:10
 * @ver 1.0
 *
 */
export class BuyFrameI extends BaseWindow {
  public c1: fgui.Controller;
  public c2: fgui.Controller;
  public frame: fgui.GComponent;
  public closeBtn: fgui.GButton;
  public item: BaseItem;
  public txt_name: fgui.GTextField;
  public txt_count: fgui.GTextField;
  public txt_canTotal: fgui.GTextField;
  public txt_canTotalValue: fgui.GTextField;
  public txt_canOne: fgui.GTextField;
  public txt_desc: fgui.GComponent;
  public stepper: NumericStepper;
  // public loader_moneyType: fgui.GLoader;
  public txt_price: fgui.GTextField;
  public checkbox_useBind: fgui.GButton;
  public btn_buy: fgui.GButton;
  public btn_give: fgui.GButton;
  public btn_pageGive: fgui.GButton;
  public btn_pageBuy: fgui.GButton;

  protected _callBack: Function;
  protected _data: any; //类型为ShopGoodsInfo或者MainShopInfo
  protected _isUseBindPoint: boolean = false;
  protected _count: number = 1;
  private showPrompt: number = 0;
  private _parm: object;
  private _handler: Laya.Handler;
  private tipItem: BaseTipItem;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.c1 = this.getController("c1");
    this.c2 = this.getController("c2");

    this.initView();
    this.initData();
    this.initEvent();
    this.setCenter();
  }

  private initView() {
    ShopManager.Instance.isHandsel = 0;
  }

  private initData() {}

  private initEvent() {
    this.closeBtn.onClick(this, this.onClose.bind(this));
    this.btn_buy.onClick(this, this.__confirmHandler.bind(this));
    this.btn_give.onClick(this, this.__confirmHandler.bind(this));
    this.c1.on(fgui.Events.STATE_CHANGED, this, this.__selectedeChangehandler);
    this.checkbox_useBind.on(
      fgui.Events.STATE_CHANGED,
      this,
      this.__useBindPointHandler,
    );

    NotificationManager.Instance.addEventListener(
      NotificationEvent.SHOPHOMEPAGE_UPDATA,
      this.__updateHandler,
      this,
    );
  }

  /**
   * 参数结构
   * info:ShopGoodsInfo
   * count: number
   * callback:Function
   * params: any
   * */
  public OnShowWind() {
    super.OnShowWind();

    let frameData = this.params.frameData;
    if (frameData.callback) {
      this.callback = frameData.callback;
    }
    if (frameData.count) {
      this._count = frameData.count;
    }
    this.data(frameData.info, frameData.count, frameData.param);
  }

  private __updateHandler() {
    this.OnBtnClose();
  }

  public data(value: any, count: number = 1, parm: object = null) {
    this._data = value;
    if (this._data instanceof ShopGoodsInfo) {
      let itemid: number = (this._data as ShopGoodsInfo).ItemId;
      let good: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        itemid,
      );
      let sonType: number = good.SonType;
      if (sonType == 218) {
        //是坐骑
        this.c2.selectedIndex = 1;
      } else {
        //不是坐骑
        this.c2.selectedIndex = 0;
      }
    }
    this._parm = parm;
    this.refreshView();
    this.c1.selectedIndex = 0;
  }

  public set callback(call: Function) {
    this._callBack = call;
  }

  protected checkExist(tId: number): string {
    let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      tId,
    );
    if (goods.SonType != GoodsSonType.SONTYPE_MOUNT_CARD) {
      return "";
    }
    let exist; //:WildSoulInfo = MountsManager.instance.avatarList.getWildSoulInfo(goods.Property1);
    if (goods.Property2 > 0) {
      exist = null;
    }
    if (exist) {
      return LangManager.Instance.GetTranslation(
        "shop.view.frame.BuyFrameI.mopupexitst",
      );
    } else {
      return "";
    }
  }

  protected __useBindPointHandler(e: Laya.Event) {
    this.onUseBindDiamond();
  }

  protected __confirmHandler() {
    if (this._data) {
      // this.btn_buy.enabled = false;
      // this.btn_give.enabled = false;

      if (this._data instanceof ShopGoodsInfo) {
        let itemid: number = (this._data as ShopGoodsInfo).ItemId;
        let good: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          itemid,
        );
        let sonType: number = good.SonType;
        if (this.c1.selectedIndex == 0) {
          if (sonType == 218 && good.Property2 < 0) {
            if (
              MountsManager.Instance.avatarList.isLightTemplate(good.Property1)
            ) {
              let s: string = LangManager.Instance.GetTranslation(
                "shop.view.frame.BuyFrameI.mopupexitst",
              );
              MessageTipManager.Instance.show(s);
              return;
            }
          }

          if (sonType == 212 && good.TemplateId != 2120044) {
            //不是神兽之魂的坐骑碎片卡
            //优化标记 这个数据也不小
            let dic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_compose);
            let composeGoodsId: number = 0;
            for (const key in dic) {
              if (dic.hasOwnProperty(key)) {
                let item: t_s_composeData = dic[key];
                if (good.TemplateId == item.Material1) {
                  composeGoodsId = item.NewMaterial;
                  break;
                }
              }
            }
            let good2: t_s_itemtemplateData =
              ConfigMgr.Instance.getTemplateByID(
                ConfigType.t_s_itemtemplate,
                composeGoodsId,
              );
            if (good2) {
              if (
                MountsManager.Instance.avatarList.isLightTemplate(
                  good2.Property1,
                ) &&
                good2.Property2 < 0
              ) {
                MessageTipManager.Instance.show(
                  LangManager.Instance.GetTranslation(
                    "shop.view.frame.BuyFrameI.mopupexitst",
                  ),
                );
                return;
              }
            }
          }
        }
      }

      if (Number(this.txt_price.text) > this.PayMoney) {
        if (this._data.PayType == ShopGoodsInfo.PAY_BY_POINT) {
          this.OnBtnClose();
          RechargeAlertMannager.Instance.show();
          // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.MoneyLack"));
          return;
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
          this.OnBtnClose();
          RechargeAlertMannager.Instance.show();
          // MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("shop.view.frame.BuyFrameI.MoneyLack"));
          return;
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_GOLD) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "star.view.MakeStarView.command02",
            ),
          );
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_MAZE) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "shop.view.frame.BuyFrameI.MazeCoinLack",
            ),
          );
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_HONOR) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "shop.view.frame.BuyFrameI.MedalLack",
            ),
          );
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_OFFER) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "shop.view.frame.BuyFrameI.SociatyContribLack",
            ),
          );
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_GLORY) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "ui.resourcebar.view.quickbuy.QuickBuyFrame.gloryTip",
            ),
          );
        } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_BACKPLAYER) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "shop.view.frame.BuyFrameI.NotEnoughBackPlayer",
            ),
          );
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "shop.view.frame.BuyFrameI.MoneyLack",
            ),
          );
        }
        // this.OnBtnClose();
        return;
      }
      if (this.c1.selectedIndex == 0) {
        if (this._data.PayType == ShopGoodsInfo.PAY_BY_MAZE) {
          let info: ShopGoodsInfo =
            TempleteManager.Instance.getMazeShopTempInfoByItemId(
              this._data.ItemId,
            );
          let goods: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_itemtemplate,
            this._data.ItemId,
          );
          if (
            GoodsSonType.EQUIP_SONTYPE_LIST.indexOf(goods.SonType) >= 0 &&
            GoodsManager.Instance.checkExistGoodsByTempIdInAllBag(
              goods.TemplateId,
            )
          ) {
            this.alert(); //物品时装备 背包中已存在
            return;
          }
        }

        let msg: string = this.checkExist((<ShopGoodsInfo>this._data).ItemId);
        if (!StringHelper.isNullOrEmpty(msg)) {
          MessageTipManager.Instance.show(msg);
          this.OnBtnClose();
          return;
        }

        this.buy(this.checkbox_useBind.selected);
      } else {
        // let gift:GiftDonatioFrame = ComponentFactory.Instance.creatComponentByStylename("shop.GiftDonatioFrame");
        // gift.ShopId = (<ShopGoodsInfo> this._data).Id
        // gift.number = this._buyNum;
        // gift.show();
        // this.dispose();
        return;
      }
    } else {
      let str: string = LangManager.Instance.GetTranslation(
        "shop.view.frame.BuyFrameI.buyFailed",
      );
      MessageTipManager.Instance.show(str);
      this.OnBtnClose();
      return;
    }
  }

  private alert() {
    let result: Function = function (b: boolean, flag: boolean) {
      if (b) {
        this.buy();
      } else {
        this.OnBtnClose();
      }
    };
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      LangManager.Instance.GetTranslation("BuyFrameI.tip01"),
      LangManager.Instance.GetTranslation("BuyFrameI.tip02"),
      LangManager.Instance.GetTranslation("public.confirm"),
      LangManager.Instance.GetTranslation("public.cancel1"),
      result,
    );
  }

  private buy(useBind: boolean = true) {
    let temp: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this._data.ItemId,
    );
    if (this.isFashionGoods(temp)) {
      ShopManager.Instance.sendShoping(
        (<ShopGoodsInfo>this._data).Id,
        this.stepper.value,
        this.playerInfo.userId,
        false,
        C2SProtocol.C_FASHION_SHOP_BUY,
        useBind,
      );
    } else {
      ShopManager.Instance.sendShoping(
        (<ShopGoodsInfo>this._data).Id,
        this.stepper.value,
        this.playerInfo.userId,
        false,
        0x1422,
        useBind,
      );
    }
    if (this._callBack != null) {
      ServerDataManager.listen(
        S2CProtocol.U_C_SHOP_BUY,
        this,
        this.__shopResult,
      );
    } else {
      this.OnBtnClose();
    }
  }

  private isFashionGoods(temp: t_s_itemtemplateData): boolean {
    if (
      temp.SonType == GoodsSonType.FASHION_CLOTHES ||
      temp.SonType == GoodsSonType.FASHION_HEADDRESS ||
      temp.SonType == GoodsSonType.FASHION_WEAPON ||
      temp.SonType == GoodsSonType.SONTYPE_WING
    ) {
      return true;
    }
    return false;
  }

  private __selectedeChangehandler(cc: fgui.Controller) {
    if (cc.selectedIndex == 0) {
      let templateId: number = 0;
      if (this._data instanceof MainShopInfo) {
        templateId = ShopManager.Instance.model.getTemplateId(1);
        this.tipItem.setInfo(templateId);
      } else {
        if (this._data.PayType == 2) {
          templateId = ShopManager.Instance.model.getTemplateId(1);
          this.tipItem.setInfo(templateId);
        } else {
          templateId = ShopManager.Instance.model.getTemplateId(
            this._data.PayType,
          );
          this.tipItem.setInfo(templateId);
        }
      }
      this.showPrompt = 0;
      ShopManager.Instance.isHandsel = 0;
      this.frame.text = LangManager.Instance.GetTranslation(
        "campaign.TrailShop.BuyBtnTxt",
      );
      this.checkbox_useBind.visible = this.checkbox_useBind.selected =
        this._isUseBindPoint;
    } else if (cc.selectedIndex == 1) {
      this.showPrompt = 1;
      ShopManager.Instance.isHandsel = 1;
      this.checkbox_useBind.visible = this.checkbox_useBind.selected = false;
      this.frame.text = LangManager.Instance.GetTranslation(
        "yishi.view.frame.BuyFrameI.Presentation",
      );
    }
    this.updatePrompt();
  }

  protected refreshView() {
    if (!this._data) {
      return;
    }
    let shopGoodsInfo: ShopGoodsInfo = this._data as ShopGoodsInfo;
    let goodsInfo: GoodsInfo = new GoodsInfo();
    goodsInfo.templateId = shopGoodsInfo.ItemId;
    this.item.info = goodsInfo;
    this.txt_name.text = goodsInfo.templateInfo.TemplateNameLang;
    this.txt_name.color =
      FilterFrameText.Colors[eFilterFrameText.ItemQuality][
        goodsInfo.templateInfo.Profile - 1
      ];
    if (goodsInfo.templateId == CommonConstant.RUNE_GEM_ENERGY) {
      this.txt_count.text =
        PlayerManager.Instance.currentPlayerModel.playerInfo.runePowerPoint.toString();
    } else {
      this.txt_count.text =
        GoodsManager.Instance.getGoodsNumByTempId(goodsInfo.templateId) + "";
    }
    this.txt_desc.getChild("content").text =
      goodsInfo.templateInfo.DescriptionLang;
    if (
      shopGoodsInfo.PayType == ShopGoodsInfo.PAY_BY_POINT ||
      shopGoodsInfo.PayType == ShopGoodsInfo.PAY_BY_GIFT
    ) {
      if (shopGoodsInfo.PayType == ShopGoodsInfo.PAY_BY_POINT) {
        this._isUseBindPoint = false;
        this.checkbox_useBind.visible = this.checkbox_useBind.selected = false;
        this.onsetMoneyType(ShopGoodsInfo.PAY_BY_POINT);
      } else {
        this._isUseBindPoint = true;
        this.checkbox_useBind.visible = this.checkbox_useBind.selected = true;
        this.onsetMoneyType(ShopGoodsInfo.PAY_BY_GIFT);
      }
    } else {
      this._isUseBindPoint = false;
      this.onsetMoneyType(shopGoodsInfo.PayType);
      this.checkbox_useBind.visible = this.checkbox_useBind.selected = false;
    }
    if (
      (this._data.canBuyNum != -1 &&
        this._data.PayType == ShopGoodsInfo.PAY_BY_POINT) ||
      !FrameCtrlManager.Instance.isOpen(EmWindow.ShopWnd) ||
      // this.shopController.frame == null ||
      (this._data.PayType != ShopGoodsInfo.PAY_BY_GIFT &&
        this._data.PayType != ShopGoodsInfo.PAY_BY_POINT)
    ) {
      //购买和赠送选项都不在,  只能购买 ,  不能切换
      this.c1.selectedIndex = 0;
      this.btn_pageBuy.visible = this.btn_pageGive.visible = false;
    } else {
      //从商城界面打开  购买和赠送选项都在
      this.c1.selectedIndex = 0;
      this.btn_pageBuy.visible = this.btn_pageGive.visible = false; //赠送功能暂时没有
    }
    this._handler && this._handler.recover();
    this._handler = Laya.Handler.create(
      this,
      this.stepperChangeHandler,
      null,
      false,
    );

    let leftNum = 0;
    let maxCount = 999;
    if (
      Number(shopGoodsInfo.OneDayCount) != -1 &&
      shopGoodsInfo.OneDayCount != undefined
    ) {
      //日限购
      leftNum = shopGoodsInfo.OneDayCount - shopGoodsInfo.OneCurrentCount;
      maxCount = shopGoodsInfo.OneDayCount;
      leftNum = Math.min(this.currentCanCount, leftNum, maxCount);
      this.stepper.show(0, 1, 1, leftNum, leftNum, 1, this._handler);
      this.btn_buy.enabled = leftNum > 0;
    } else if (
      Number(shopGoodsInfo.WeeklyLimit) != -1 &&
      shopGoodsInfo.WeeklyLimit != undefined
    ) {
      //周限购
      leftNum = shopGoodsInfo.WeeklyLimit - shopGoodsInfo.weekCount;
      maxCount = shopGoodsInfo.WeeklyLimit;
      leftNum = Math.min(this.currentCanCount, leftNum, maxCount);
      this.stepper.show(0, 1, 1, leftNum, leftNum, 1, this._handler);
      this.btn_buy.enabled = leftNum > 0;
    } else {
      leftNum = Math.min(this.currentCanCount, maxCount);
      this.stepper.show(
        0,
        1,
        1,
        this.currentCanCount,
        leftNum,
        1,
        this._handler,
      );
      this.btn_buy.enabled = this.currentCanCount > 0;
    }
    if (shopGoodsInfo.ItemId == CommonConstant.PET_SOUL_STONE) {
      this.stepper.show(
        0,
        this._count,
        1,
        leftNum,
        this.currentCanCount,
        1,
        this._handler,
      );
    } else {
      this.stepper.show(
        0,
        this._count,
        this._count,
        leftNum,
        this.currentCanCount,
        1,
        this._handler,
      );
    }

    this.stepperChangeHandler(null);
  }

  private _currPayType: number = 0; //当前支付货币类型 1钻石  2绑定钻石
  private onsetMoneyType(value: number) {
    let templateId = ShopManager.Instance.model.getTemplateId(value);
    this.tipItem.setInfo(templateId);
    this._currPayType = value;
  }

  /**切换使用绑定钻石 */
  private onUseBindDiamond() {
    this._isUseBindPoint = true;
    if (this.checkbox_useBind.selected) {
      //绑钻
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_GIFT);
    } else {
      this.onsetMoneyType(ShopGoodsInfo.PAY_BY_POINT);
    }
  }

  private stepperChangeHandler(value: number) {
    this.txt_price.text = this._data.price * this.stepper.value + "";
    if (Number(this.txt_price.text) > this.PayMoney) {
      this.txt_price.color = "#CC0000";
    } else {
      this.txt_price.color = "#FFFFFF";
    }
    this.refreshLimitView();
  }

  private get currentCanCount(): number {
    let pointCount: number = Math.floor(this.PayMoney / this._data.price);

    if (this._data.canBuyNum == -1) {
      return pointCount;
    } else if (pointCount < 1) {
      return 1;
    } else {
      return Math.min(pointCount, this._data.canBuyNum);
    }
  }

  public get PayMoney(): number {
    if (
      this._data.PayType == ShopGoodsInfo.PAY_BY_POINT ||
      this._data instanceof MainShopInfo
    ) {
      return this.playerInfo.point;
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_GIFT) {
      if (this.c1.selectedIndex == 1) {
        return this.playerInfo.point;
      } else {
        if (this.checkbox_useBind.selected) {
          return this.playerInfo.giftToken + this.playerInfo.point;
        } else {
          return this.playerInfo.point;
        }
      }
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_GOLD) {
      return ResourceManager.Instance.gold.count;
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_OFFER) {
      return this.playerInfo.consortiaOffer;
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_HONOR) {
      return GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.MEDAL_TEMPID,
      );
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_MAZE) {
      return GoodsManager.Instance.getGoodsNumByTempId(
        MazeModel.SHOP_MAZE_COIN_TEMPID,
      );
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_GLORY) {
      return PlayerManager.Instance.currentPlayerModel.playerInfo.gloryPoint;
    } else if (this._data.PayType == ShopGoodsInfo.PAY_BY_BACKPLAYER) {
      return GoodsManager.Instance.getGoodsNumByTempId(
        ShopGoodsInfo.BACKPLAYER_TEMPID,
      );
    } else {
      return this.playerInfo.point;
    }
  }

  protected get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  // protected get shopController():ShopControler
  // {
  //     return FrameCtrlManager.Instance.getCtrl(EmWindow.BuyFrameI) as ShopControler;
  // }

  protected __shopResult(pkg: PackageIn) {
    ServerDataManager.cancel(S2CProtocol.U_C_SHOP_BUY, this, this.__shopResult);
    let msg: ShopMsg = pkg.readBody(ShopMsg) as ShopMsg;
    if (this._callBack != null) {
      if (msg.buyInfo.result == 1) {
        this._callBack(true, this._parm);
      } else {
        this._callBack(false, this._parm);
      }
    }
    this.OnBtnClose();
  }

  private refreshLimitView() {
    let totalFlag: boolean = false;
    let oneFlag: boolean = false;

    if (this._data.canTotalCount > 0) {
      this.txt_canTotal.color = "#FFFFFF";
      this.txt_canTotal.text = LangManager.Instance.GetTranslation(
        "shop.view.GoodsItem.limited03",
      ); //限量出售
      this.txt_canTotalValue.text = this._data.canTotalCount + "";
      totalFlag = true;
    } else if (this._data.canTotalCount == -1) {
      this.txt_canTotal.text = "";
      this.txt_canTotalValue.text = "";
    } else if (this._data.canTotalCount == 0) {
      this.txt_canTotal.color = "#CC0000";
      this.txt_canTotal.text = LangManager.Instance.GetTranslation(
        "shop.view.GoodsItem.limited",
      ); //售完
      this.txt_canTotalValue.text = "";
      totalFlag = true;
    }

    if (this._data.type == ShopGoodsInfo.PAY_BY_GIFT) {
      let num: number = this._data.limitCount - this._data.count;
      if (num > 0) {
        this.txt_canOne.color = "#FFFFFF";
        this.txt_canOne.text = LangManager.Instance.GetTranslation(
          "shop.view.GoodsItem.limited06",
          num,
        ); //每4小时限购{n}个
        oneFlag = true;
      } else {
        this.txt_canOne.color = "#CC0000";
        this.txt_canOne.text = LangManager.Instance.GetTranslation(
          "shop.view.GoodsItem.limited05",
        ); //购买量达到上限
        oneFlag = true;
      }
    } else {
      if (this._data.canOneCount >= 0) {
        this.txt_canOne.color = "#FFFFFF";
        let textValue = "";
        let showNum: number;
        if (!(this._data instanceof ShopGoodsInfo)) {
          showNum = this._data.oneDayCount - ShopManager.Instance.count;
        } else {
          showNum = this._data.canOneCount;
        }
        textValue = LangManager.Instance.GetTranslation(
          "shop.view.GoodsItem.limited04",
          showNum,
        ); //每人限购 + "";
        if (showNum <= 0) {
          this.txt_canOne.color = "#CC0000";
          textValue = LangManager.Instance.GetTranslation(
            "shop.view.GoodsItem.limited05",
          ); //购买量达到上限
        }
        oneFlag = true;
        this.txt_canOne.text = textValue;
      } else if (this._data.canOneCount == -1) {
        this.txt_canOne.text = "";
      }
      this.checkbox_useBind.visible =
        this._isUseBindPoint && this.c1.selectedIndex == 0;
    }
    this.updatePrompt();
  }

  private updatePrompt() {
    if (this.showPrompt == 0) {
      this.txt_canOne.visible = true;
    } else if (this.showPrompt == 1) {
      this.txt_canOne.visible = false;
    }
  }

  private onClose() {
    this.OnBtnClose();
  }

  private removeEvent() {
    this.closeBtn.offClick(this, this.onClose.bind(this));
    this.btn_buy.offClick(this, this.__confirmHandler.bind(this));
    this.btn_give.offClick(this, this.__confirmHandler.bind(this));
    this.c1.off(fgui.Events.STATE_CHANGED, this, this.__selectedeChangehandler);
    this.checkbox_useBind.off(
      fgui.Events.STATE_CHANGED,
      this,
      this.__useBindPointHandler,
    );

    NotificationManager.Instance.removeEventListener(
      NotificationEvent.SHOPHOMEPAGE_UPDATA,
      this.__updateHandler,
      this,
    );
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
    this._data = null;
    this._parm = null;
    this._callBack = null;
  }
}
