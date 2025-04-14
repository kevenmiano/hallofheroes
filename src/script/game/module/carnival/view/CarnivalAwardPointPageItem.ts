import FUI_CarnivalAwardPointPageItem from "../../../../../fui/Carnival/FUI_CarnivalAwardPointPageItem";
import LangManager from "../../../../core/lang/LangManager";
import UIButton from "../../../../core/ui/UIButton";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import CarnivalModel, { CARNIVAL_THEME } from "../model/CarnivalModel";

/**
 * 嘉年华---积分领奖-item
 */
export default class CarnivalAwardPointPageItem extends FUI_CarnivalAwardPointPageItem {
  private _itemList: Array<GoodsInfo> = [];
  private _itemList2: Array<GoodsInfo> = [];
  private _isDis: boolean;
  private _temp: t_s_carnivalpointexchangeData;

  private _btnUnlock: UIButton;
  private _btnReceive: UIButton;

  protected onConstruct(): void {
    super.onConstruct();
    Utils.setDrawCallOptimize(this);
    this._btnReceive = new UIButton(this.btn_receive);
    this._btnUnlock = new UIButton(this.btn_unlock);
    this._btnUnlock.enabled = false;
    let themeType = this.model.themeType;
    if (themeType == CARNIVAL_THEME.SUMMER) {
      this.isSummer.selectedIndex = 1;
    } else {
      this.isSummer.selectedIndex = 0;
    }
    this.addEvent();
  }

  private addEvent() {
    this._btnReceive.onClick(this, this.clickHandler);
    this.goodsList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.goodsList2.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem2,
      null,
      false,
    );
  }

  private offEvent() {
    this._btnReceive.offClick(this, this.clickHandler);
    Utils.clearGListHandle(this.goodsList);
    Utils.clearGListHandle(this.goodsList2);
  }

  renderListItem(index: number, item: BaseItem) {
    if (item && !item.isDisposed) {
      item.info = this._itemList[index];
    }
  }

  renderListItem2(index: number, item: BaseItem) {
    if (item && !item.isDisposed) {
      item.info = this._itemList2[index];
    }
  }

  private clickHandler(e: MouseEvent) {
    if (this._temp)
      CarnivalManager.Instance.opRequest(
        CarnivalManager.OP_SCORE_REWARD,
        this._temp.Id,
      );
  }

  private get model(): CarnivalModel {
    return CarnivalManager.Instance.model;
  }

  /** */
  public set info(value) {
    this._temp = value;
    if (this._temp) {
      this.txtTitle.text = LangManager.Instance.GetTranslation(
        "carnival.awardpointItem.title",
        this._temp.Target,
      );
      this.refreshView();
      this._itemList = [];
      this.createGoodItem(this._temp.Item1, this._temp.ItemNum1);
      this.createGoodItem(this._temp.Item2, this._temp.ItemNum2);
      this.createGoodItem(this._temp.Item3, this._temp.ItemNum3);
      this.createGoodItem(this._temp.Item4, this._temp.ItemNum4);
      this.goodsList.numItems = this._itemList.length;
      this.goodsList.ensureSizeCorrect();
    }
  }

  public get info(): t_s_carnivalpointexchangeData {
    return this._temp;
  }

  private createGoodItem(itemId: number, itemCount: number): void {
    if (itemId == 0) return;
    var g: GoodsInfo = new GoodsInfo();
    g.templateId = itemId;
    g.count = itemCount;
    this._itemList.push(g);
  }

  public refreshView() {
    var hasRewardStr: string = this.model.scoreRewardInfo;
    var hasRewardList: Array<string> = hasRewardStr.split(",");
    if (this._temp) {
      var findId: string = this._temp.Id.toString();
      if (hasRewardList.indexOf(findId) != -1) {
        this.awartState.selectedIndex = 2;
      } else {
        this.awartState.selectedIndex = 0;
        if (this._temp.Target <= this.model.score) {
          this.awartState.selectedIndex = 1;
        } else {
          this.awartState.selectedIndex = 0;
        }
      }
    }
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
