import FUI_CarnivalGameGoodsItem from "../../../../../fui/Carnival/FUI_CarnivalGameGoodsItem";
import FUI_CarnivalGamePageItem from "../../../../../fui/Carnival/FUI_CarnivalGamePageItem";
import LangManager from "../../../../core/lang/LangManager";
import UIButton from "../../../../core/ui/UIButton";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import CarnivalManager from "../../../manager/CarnivalManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel, { CARNIVAL_THEME } from "../model/CarnivalModel";

/**
 * 嘉年华---欢乐游戏-item
 */
export default class CarnivalGamePageItem extends FUI_CarnivalGamePageItem {
  private _tempInfo: t_s_carnivalpointexchangeData;
  private _itemList: Array<GoodsInfo> = [];
  private _startBtn: UIButton;
  private _moveOver: boolean = false;

  protected onConstruct(): void {
    super.onConstruct();
    Utils.setDrawCallOptimize(this);
    this._startBtn = new UIButton(this.btn_start);
    this.iconCtrl.selectedIndex = 0;
    let themeType = this.model.themeType;
    if (themeType == CARNIVAL_THEME.SUMMER) {
      this.isSummer.selectedIndex = 1;
    } else {
      this.isSummer.selectedIndex = 0;
    }

    this._startBtn.enabled = CarnivalManager.Instance.isRewardTime;
    !CarnivalManager.Instance.isRewardTime &&
      (this._startBtn.title = LangManager.Instance.GetTranslation(
        "carnival.active.timeover",
      ));

    this.addEvent();
  }

  public set moveOver(value: boolean) {
    this._moveOver = value;
  }

  public get moveOver(): boolean {
    return this._moveOver;
  }

  private addEvent() {
    this._startBtn.onClick(this, this.startHandler);
    this.rewardList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  private offEvent() {
    this._startBtn.offClick(this, this.startHandler);
    Utils.clearGListHandle(this.rewardList);
  }

  private _index: number = 0;
  public set index(value: number) {
    this._index = value;
    if (value == 0) {
      this.rewardList.enabled = true;
      this._startBtn.enabled = CarnivalManager.Instance.isRewardTime && true;
      !CarnivalManager.Instance.isRewardTime &&
        (this._startBtn.title = LangManager.Instance.GetTranslation(
          "carnival.active.timeover",
        ));
    } else {
      this.rewardList.enabled = false;
      this._startBtn.enabled = false;
    }
  }

  public get index(): number {
    return this._index;
  }

  public set Enabled(value: boolean) {
    // this._startBtn.enabled = value;
  }

  private renderListItem(index: number, item: FUI_CarnivalGameGoodsItem) {
    if (item && !item.isDisposed) {
      (item.getChild("goodsItem") as BaseItem).info = this._itemList[index];
    }
  }

  /** */
  public set info(value: t_s_carnivalpointexchangeData) {
    if (!value) return;
    this._tempInfo = value;
    if (this._tempInfo) {
      this.iconCtrl.selectedIndex = this._tempInfo.Type - CarnivalModel.TypeAdd;
      switch (this._tempInfo.Type) {
        case CarnivalModel.GAME_TYPE_1:
          this.txt_title.text = LangManager.Instance.GetTranslation(
            "AirGardenGame.llk.title",
          );
          break;
        case CarnivalModel.GAME_TYPE_2:
          this.txt_title.text = LangManager.Instance.GetTranslation(
            "NewMemoryCardFrame.titleText.text",
          );
          break;
        case CarnivalModel.GAME_TYPE_3:
          this.txt_title.text = LangManager.Instance.GetTranslation(
            "AirGardenGame.sudoku.title",
          );
          break;
        default:
          this.txt_title.text = "";
          break;
      }
      this.createGoodItem(this._tempInfo.Item1, this._tempInfo.ItemNum1);
      this.createGoodItem(this._tempInfo.Item2, this._tempInfo.ItemNum2);
      this.createGoodItem(this._tempInfo.Item3, this._tempInfo.ItemNum3);
      this.createGoodItem(this._tempInfo.Item4, this._tempInfo.ItemNum4);
      this.rewardList.numItems = this._itemList.length;
    }
  }

  private createGoodItem(itemId: number, itemCount: number) {
    if (itemId == 0) return;
    var g: GoodsInfo = new GoodsInfo();
    g.templateId = itemId;
    g.count = itemCount;
    this._itemList.push(g);
  }

  public refreshView(gameInfo: string) {
    if (this._tempInfo == null) return;
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("CarnivalGameCount");
    if (!cfg) return;
    let countsValue: Array<string> = cfg.ConfigValue.split(",");
    let selectType = this._tempInfo.Type - CarnivalModel.TypeAdd;
    if (gameInfo != "") {
      var list: Array<string> = gameInfo.split("|");
      var arr: Array<string>;
      var isFind: boolean = false;
      for (let key in list) {
        if (Object.prototype.hasOwnProperty.call(list, key)) {
          let str = list[key];
          arr = str.split(",");
          if (Number(arr[0]) == this._tempInfo.Type) {
            var leftNum: number =
              Number(countsValue[selectType - 1]) - Number(arr[1]);
            if (leftNum < 0) leftNum = 0;

            this.txt_reward.text = LangManager.Instance.GetTranslation(
              "carnival.game.time",
              leftNum,
            );
            isFind = true;
            break;
          }
        }
      }
      if (!isFind)
        this.txt_reward.text = LangManager.Instance.GetTranslation(
          "carnival.game.time",
          countsValue[selectType - 1],
        );
    } else {
      this.txt_reward.text = LangManager.Instance.GetTranslation(
        "carnival.game.time",
        countsValue[selectType - 1],
      );
    }
  }

  private get model(): CarnivalModel {
    return CarnivalManager.Instance.model;
  }

  private startHandler() {
    if (!this._tempInfo) return;
    CarnivalManager.Instance.opRequest(
      CarnivalManager.OP_GAME,
      this._tempInfo.Type,
    );
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
