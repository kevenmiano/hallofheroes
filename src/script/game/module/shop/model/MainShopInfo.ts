//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-03-08 10:45:03
 * @LastEditTime: 2021-03-08 11:05:52
 * @LastEditors: jeremy.xu
 * @Description: 促销物品数据
 */
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ShopGoodsInfo } from "./ShopGoodsInfo";

export class MainShopInfo {
  public id: number = 0;
  private _type: number = 0;
  private _payType: number = 1;
  //位置
  public site: number = 0;
  public isGift: boolean = false;
  public shopId: number = 0;
  public templateId: number = 0;
  public counts: number = 0;
  public needVIPGrade: number = 0;
  public sortName: string = "";

  public shopId1: number = 0;
  public templateId1: number = 0;
  public count1: number = 0;

  public shopId2: number = 0;
  public templateId2: number = 0;
  public count2: number = 0;

  public shopId3: number = 0;
  public templateId3: number = 0;
  public count3: number = 0;

  public shopId4: number = 0;
  public templateId4: number = 0;
  public count4: number = 0;

  public shopId5: number = 0;
  public templateId5: number = 0;
  public count5: number = 0;

  public shopId6: number = 0;
  public templateId6: number = 0;
  public count6: number = 0;

  public shopId7: number = 0;
  public templateId7: number = 0;
  public count7: number = 0;

  public shopId8: number = 0;
  public templateId8: number = 0;
  public count8: number = 0;

  public sortId: number = 0;
  public discount: number = 0;
  public beginDate: number = 0;
  public endDate: number = 0;
  public currentCount: number = 0; //当前数量

  public oneDayCount: number = 0; //一天限购数量/人
  public oneCurrentCount: number = 0; //一人当前已购买的数量
  public maxCount: number = 0; //限量
  public maxCurrentDate: number = 0; //当前限购日期
  //周限购次数(当周已购买)
  private _weekCount: number = 0;
  public url: string = "";
  public names: string = "";

  public isDiscount: number;

  private _content: string = "";
  private _price: number = 0;

  private _count: number = 0; //type为2(限时抢购)时已经购买的个数
  public limitCount: number = 0; //type为2(限时抢购)是在这段时间内能购买的个数

  public get weekCount(): number {
    return this._weekCount;
  }
  public set weekCount(v: number) {
    this._weekCount = v;
  }

  /**
   * 今天大家还能购买的数量
   *
   * */
  public get canTotalCount(): number {
    if (this.maxCount == -1) return -1;

    if (this._type != 2) {
      var day: number = Math.floor(this.maxCurrentDate / (3600 * 24));
      var currDay: number = Math.floor(
        this.playerModel.sysCurTimeBySecond / (3600 * 24),
      );
      if (day == currDay) {
        if (this.maxCount - this.currentCount < 0) return 0;
        else return this.maxCount - this.currentCount;
      } else {
        return this.maxCount;
      }
    } else {
      if (this.maxCount - this.currentCount < 0) return 0;
      else return this.maxCount - this.currentCount;
    }
  }

  /**
   * 今天自己还能购买的数量
   *
   * */
  public get canOneCount(): number {
    if (this.type == 1) {
      if (this.oneDayCount == -1) return -1;

      if (this.oneDayCount - this.oneCurrentCount > 0)
        return this.oneDayCount - this.oneCurrentCount;
      else return 0;
    } else if (this.type == 2) {
      return this.oneDayCount - this.count;
    } else {
      return 0;
    }
  }

  /**
   * 能购买的数量
   *
   * */
  public get canBuyNum(): number {
    return Math.min(this.canOneCount, this.canTotalCount);
  }

  /**
   *距离剩余时间
   * @return time（秒）
   *
   */
  public get remainTime(): number {
    if (this.beginDate < this.playerModel.sysCurTimeBySecond) {
      var time: number = this.endDate - this.playerModel.sysCurTimeBySecond;
      if (time > 0) {
        return time;
      } else {
        return 0;
      }
    }
    return 0;
  }

  //		public get PayType():number
  //		{
  //			return _payType;
  //		}

  public setPrice(price: number) {
    if (price > 0) {
      this._price = price;
      //				_payType = 1;
    } else {
      this._price = 0;
      var shopInfo: ShopGoodsInfo =
        TempleteManager.Instance.getShopMainInfoByItemId(this.shopId);
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.counts;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.counts;
          //						_payType = 1;
        } else if (shopInfo.GiftToken > 0) {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.counts;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.counts;
          //						_payType = 2;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId1,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count1;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count1;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count1;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count1;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId2,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count2;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count2;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count2;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count2;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId3,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count3;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count3;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count3;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count3;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId4,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count4;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count4;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count4;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count4;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId5,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count5;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count5;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count5;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count5;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId6,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count6;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count6;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count6;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count6;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId7,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count7;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count7;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count7;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count7;
        }
      }

      shopInfo = TempleteManager.Instance.getShopMainTempInfoByItemId(
        this.templateId8,
      );
      if (shopInfo) {
        if (shopInfo.Point > 0) {
          if (Number(shopInfo.Point * this.discount) < 1)
            this._price += this.count8;
          else
            this._price += Number(shopInfo.Point * this.discount) * this.count8;
        } else {
          if (Number(shopInfo.GiftToken * this.discount) < 1)
            this._price += this.count8;
          else
            this._price +=
              Number(shopInfo.GiftToken * this.discount) * this.count8;
        }
      }
    }
  }

  public setContent() {
    this._content = "";
    let goodsTempInfo: t_s_itemtemplateData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_itemtemplate,
        this.templateId,
      );

    if (goodsTempInfo) {
      this._content += goodsTempInfo.TemplateNameLang;
      if (this.counts > 0) this._content += "x" + this.counts;
    }
    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId2,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count1 > 0) this._content += "x" + this.count1;
    }
    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId2,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count2 > 0) this._content += "x" + this.count2;
    }

    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId3,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count3 > 0) this._content += "x" + this.count3;
    }

    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId4,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count4 > 0) this._content += "x" + this.count4;
    }

    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId5,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count5 > 0) this._content += "x" + this.count5;
    }

    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId6,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count6 > 0) this._content += "x" + this.count6;
    }

    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId7,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count7 > 0) this._content += "x" + this.count7;
    }

    goodsTempInfo = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      this.templateId8,
    );
    if (goodsTempInfo) {
      this._content += ", " + goodsTempInfo.TemplateNameLang;
      if (this.count8 > 0) this._content += "x" + this.count8;
    }
  }

  public get content(): string {
    return this._content;
  }

  public get price(): number {
    if (this.isGift) return this._price;
    else {
      if (this._price > 0) {
        return this._price;
      }
      var shopInfo: ShopGoodsInfo =
        TempleteManager.Instance.getShopMainInfoByItemId(this.shopId);
      if (shopInfo.Point <= 0) {
        if (shopInfo.GiftToken > 0) {
          var cost: number = Number(shopInfo.GiftToken * this.discount);
          if (cost > 0) {
            return cost;
          } else {
            return this._price;
          }
        } else {
          return this._price;
        }
      } else {
        return Number(shopInfo.Point * this.discount);
      }
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  public get type(): number {
    return this._type;
  }

  public set type(value: number) {
    this._type = value;
  }

  public get count(): number {
    return this._count;
  }

  public set count(value: number) {
    this._count = value;
  }
}
