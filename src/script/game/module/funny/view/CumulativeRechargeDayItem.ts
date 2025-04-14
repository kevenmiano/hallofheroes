import FUI_CumulativeRechargeDayItem from "../../../../../fui/Funny/FUI_CumulativeRechargeDayItem";
import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import FunnyBagData from "../model/FunnyBagData";

/**
 * @author:pzlricky
 * @data: 2022-03-04 11:18
 * @description 累计充值天数Item
 */
export default class CumulativeRechargeDayItem extends FUI_CumulativeRechargeDayItem {
  private _selectedIndex: number = 0;

  private _index: number = 0;

  private _info: FunnyBagData;
  private _goodsArr: Array<any>;

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  private initEvent() {}

  private removeEvent() {}

  /**
   * 设置领取状态
   * */
  public setState() {
    if (this._info == null) return;
    this.rewardState.selectedIndex = 0;
    switch (this._info.status) {
      case 1: //可领取
        this.state.selectedIndex = 1;
        break;
      case 2: //已领取
        this.state.selectedIndex = 2;
        this.rewardState.selectedIndex = 1;
        break;
      case 3: //未到条件领取
        this.state.selectedIndex = 0;
        break;
      default:
        this.state.selectedIndex = 0;
        break;
    }
  }

  public set selectedIndex(value: number) {
    this._selectedIndex = value;
  }

  public set index(value: number) {
    this._index = value;
  }

  public set info(value) {
    this._info = value;
    this.refreshView();
  }

  public get info(): FunnyBagData {
    return this._info;
  }

  public set selectItemState(value: boolean) {
    this.selectedState.selectedIndex = value ? 1 : 0;
  }

  private refreshView() {
    if (this._info) {
      this.iconBox.url = FUIHelper.getItemURL(
        EmWindow.Funny,
        "Icon_Box_Dev" + (this._index + 1),
      );
      let finishValue = this._info.finishValue;
      let countValue = this._info.conditionList[0].bak;
      this.tipsState.selectedIndex = this._selectedIndex;
      if (finishValue >= countValue) {
        //如果已经超出则不展示
        this.tipsState.selectedIndex = 0;
      } else {
        this.countText.text = LangManager.Instance.GetTranslation(
          "CumulativeRechargeDayItem.countText",
          finishValue,
          countValue - finishValue,
        );
      }
      this.selectValue.selectedIndex = this._index;
      this.daytext.setVar("day", (this._index + 1).toString()).flushVars(); //第几天
      this.setState();
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
