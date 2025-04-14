import FUI_GoldenSheepItem from "../../../../fui/GoldenSheep/FUI_GoldenSheepItem";
import { BaseItem } from "../../component/item/BaseItem";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import GoldenSheepManager from "../../manager/GoldenSheepManager";
import { PlayerManager } from "../../manager/PlayerManager";
import GoldenSheepModel from "./GoldenSheepModel";
import GoldenSheepRecordInfo from "./GoldenSheepRecordInfo";

export default class GoldenSheepItem extends FUI_GoldenSheepItem {
  private _info: GoldenSheepRecordInfo;
  private _model: GoldenSheepModel;
  private _index: number = 0;
  protected onConstruct() {
    super.onConstruct();
    this._model = GoldenSheepManager.Instance.model;
  }

  public set info(value: GoldenSheepRecordInfo) {
    this._info = value;
    if (this._info) {
      this.refreshView();
    } else {
      this.clear();
    }
  }

  public set index(value: number) {
    this._index = value;
  }

  private clear() {
    this.nameTxt.text = "";
    this.goodsNameTxt.text = "";
    (this.baseItem as BaseItem).info = null;
  }

  private refreshView() {
    let tempInfo: GoodsInfo = new GoodsInfo();
    tempInfo.templateId = this._model.rewardId;
    (this.baseItem as BaseItem).info = tempInfo;
    this.nameTxt.text = this._info.nickName;
    this.goodsNameTxt.text = "*" + this._info.money;
    if (this._index % 2 == 0) {
      this.luck.selectedIndex = 1;
    } else {
      this.luck.selectedIndex = 0;
    }
    if (this._info.isBest) {
      this.luckImg.visible = true;
    } else {
      this.luckImg.visible = false;
    }
    if (
      this._info.userId ==
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    ) {
      this.luck.selectedIndex = 2;
    }
  }

  dispose() {
    super.dispose();
  }
}
