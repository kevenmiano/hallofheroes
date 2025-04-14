import { TempleteManager } from "../manager/TempleteManager";
import CarnivalModel from "../module/carnival/model/CarnivalModel";
import { GoodsCheck } from "../utils/GoodsCheck";
import t_s_baseConfigData from "./t_s_baseConfigData";
import { t_s_itemtemplateData } from "./t_s_itemtemplate";

/*
 * t_s_carnivalpointexchange
 */
export default class t_s_carnivalpointexchange {
  public mDataList: t_s_carnivalpointexchangeData[];

  public constructor(list: object[]) {
    this.mDataList = [];
    for (let i in list) {
      this.mDataList.push(new t_s_carnivalpointexchangeData(list[i]));
    }
  }
}

export class t_s_carnivalpointexchangeData extends t_s_baseConfigData {
  public Id: number = 0;
  public Item1: number = 0;
  public Item2: number = 0;
  public Item3: number = 0;
  public Item4: number = 0;
  public ItemNum1: number = 0;
  public ItemNum2: number = 0;
  public ItemNum3: number = 0;
  public ItemNum4: number = 0;
  public Price: number = 0;
  public Sort: number = 0;
  public Target: number = 0;
  public Type: number = 0;

  private _specialType: number = 0; //物品 显示类型

  constructor(data?: object) {
    super();
    if (data) {
      for (let i in data) {
        this[i] = data[i];
      }
    }
  }

  public get specialType(): number {
    if (this._specialType != 0) {
      return this._specialType;
    }
    var g: t_s_itemtemplateData =
      TempleteManager.Instance.getGoodsTemplatesByTempleteId(this.Item1);
    if (g) {
      if (GoodsCheck.isFashion(g)) {
        this._specialType = CarnivalModel.FASHION;
      } else if (GoodsCheck.isMount(g)) {
        this._specialType = CarnivalModel.MOUNTS;
      } else if (GoodsCheck.isPet(g)) {
        this._specialType = CarnivalModel.PET;
      }
    }
    return this._specialType;
  }
}
