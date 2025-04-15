import FUI_LuckyExchangeItem from "../../../../../fui/Funny/FUI_LuckyExchangeItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FunnyManager from "../../../manager/FunnyManager";
import LuckyExchangeManager from "../../../manager/LuckyExchangeManager";
//@ts-expect-error: External dependencies
import LuckExchangeItemTempMsg = com.road.yishi.proto.active.LuckExchangeItemTempMsg;
//@ts-expect-error: External dependencies
import LuckExchangeTempMsg = com.road.yishi.proto.active.LuckExchangeTempMsg;
export default class LuckyExchangeItem extends FUI_LuckyExchangeItem {
  private _info: Array<LuckExchangeItemTempMsg>;
  private _flag: boolean = false;
  private _type: number = 0;
  private _rareInfoDataList: Array<GoodsInfo> = [];
  protected onConstruct() {
    super.onConstruct();
    Utils.setDrawCallOptimize(this.iconList);
    this.iconList.itemRenderer = Laya.Handler.create(
      this,
      this.renderIconList,
      null,
      false,
    );
  }

  private renderIconList(index: number, item: BaseItem) {
    if (!item || item.isDisposed) return;
    item.info = this._rareInfoDataList[index];
  }

  public set info(value: Array<LuckExchangeItemTempMsg>) {
    this._info = value;
    if (this._info && this._info.length > 0) {
      this.refreshView();
    } else {
      this.clearView();
    }
  }

  public get info(): Array<LuckExchangeItemTempMsg> {
    return this._info;
  }

  public set flag(value: boolean) {
    this._flag = value;
  }

  public get flag(): boolean {
    return this._flag;
  }

  public set type(value: number) {
    this._type = value;
  }

  public get type(): number {
    return this._type;
  }

  private clearView() {
    this.iconList.numItems = 0;
    this.titleTxt.text = "";
    this.bg.visible = false;
  }

  private refreshView() {
    this.bg.visible = true;
    let showID = FunnyManager.Instance.selectedId;
    let infoData: LuckExchangeTempMsg =
      FunnyManager.Instance.getLuckExchangeShowData(showID);
    let value: number = 0;
    if (this._type == 0) {
      value = LuckyExchangeManager.SURE;
    } else if (this._type == 1) {
      value = LuckyExchangeManager.PERCENT;
    } else if (this._type == 2) {
      value = LuckyExchangeManager.RANDOM;
    }
    let list: Array<LuckExchangeItemTempMsg> =
      LuckyExchangeManager.Instance.getGoodsByDropType(infoData, value);
    this._rareInfoDataList = this.getDataList(list);
    this.iconList.numItems = this._rareInfoDataList.length;

    if (this._type == 0) {
      //一定获得以下物品
      this.titleTxt.text = LangManager.Instance.GetTranslation(
        "LuckyExchangeItem.titleTxt2",
      );
    } else if (this._type == 1) {
      //有几率获得以下物品
      this.titleTxt.text = LangManager.Instance.GetTranslation(
        "LuckyExchangeItem.titleTxt3",
      );
    } else if (this._type == 2) {
      if (LuckyExchangeManager.Instance.needSpecialTxt) {
        //并随机获得以下一个物品
        this.titleTxt.text = LangManager.Instance.GetTranslation(
          "LuckyExchangeItem.titleTxt1",
        );
      } else {
        //随机获得以下一个物品
        this.titleTxt.text = LangManager.Instance.GetTranslation(
          "LuckyExchangeItem.titleTxt4",
        );
      }
    }
  }

  private getDataList(array: Array<LuckExchangeItemTempMsg>): Array<GoodsInfo> {
    let arr: Array<GoodsInfo> = [];
    if (!array || array.length == 0) return arr;
    let len: number = array.length;
    let goodsInfo: GoodsInfo;
    let item: LuckExchangeItemTempMsg;
    for (let i: number = 0; i < len; i++) {
      item = array[i];
      if (item) {
        goodsInfo = new GoodsInfo();
        goodsInfo.templateId = item.itemId;
        goodsInfo.count = item.itemCount;
        arr.push(goodsInfo);
      }
    }
    return arr;
  }

  public dispose() {
    if (this.iconList instanceof Laya.Handler) {
      this.iconList.recover();
    }
    // this.iconList.itemRenderer.recover();
    Utils.clearGListHandle(this.iconList);
    super.dispose();
  }
}
