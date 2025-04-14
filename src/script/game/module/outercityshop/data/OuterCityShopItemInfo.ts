import { t_s_outcityshopData } from "../../../config/t_s_outcityshop";
import { TempleteManager } from "../../../manager/TempleteManager";

export class OuterCityShopItemInfo {
  private _itemId: number;
  private _costIds: Array<any> = [];
  public index: number = 0;
  public isBuy: boolean = false;
  public count: number = 0;

  private _itemTemInfo: t_s_outcityshopData;

  private _costInfos: Array<any> = [];

  public set costInfos(value: Array<any>) {
    this._costInfos = value;
  }

  public get costInfos(): Array<any> {
    return this._costInfos;
  }

  public get costIds(): Array<any> {
    return this._costIds;
  }

  public set costIds(value: Array<any>) {
    this._costIds = value;
  }

  public get itemId(): number {
    return this._itemId;
  }

  public set itemId(value: number) {
    this._itemId = value;
    this._itemTemInfo =
      TempleteManager.Instance.getouterCityShopRandomByMapShopId(value);
    if (this._itemTemInfo.Point > 0)
      //钻石
      this._costInfos.push([-400, this._itemTemInfo.Point]);
    if (this._itemTemInfo.Score > 0)
      //积分
      this._costInfos.push(["Score", this._itemTemInfo.Score]);
    if (this._itemTemInfo.SecretStone > 0)
      //神秘石
      this._costInfos.push([2131057, this._itemTemInfo.SecretStone]);
    if (this._itemTemInfo.Strategy > 0)
      //战魂
      this._costInfos.push([-300, this._itemTemInfo.Strategy]);
    if (this._itemTemInfo.Crystal > 0)
      //光晶
      this._costInfos.push([-600, this._itemTemInfo.Crystal]);
  }

  public get itemTemInfo(): t_s_outcityshopData {
    return this._itemTemInfo;
  }

  public set itemTemInfo(value: t_s_outcityshopData) {
    this._itemTemInfo = value;
  }
}
