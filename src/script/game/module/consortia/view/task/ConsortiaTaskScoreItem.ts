/*
 * @Author: jeremy.xu
 * @Date: 2024-03-29 11:54:41
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-04-09 11:05:46
 * @Description:
 */

import FUI_ConsortiaTaskScoreItem from "../../../../../../fui/Consortia/FUI_ConsortiaTaskScoreItem";
import LangManager from "../../../../../core/lang/LangManager";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../../tips/ITipedDisplay";
import { ConsortiaTaskScoreRewardInfo } from "../../data/ConsortiaTaskScoreRewardInfo";

export default class ConsortiaTaskScoreItem
  extends FUI_ConsortiaTaskScoreItem
  implements ITipedDisplay
{
  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any;
  showType?: TipsShowType = TipsShowType.onClick;
  startPoint?: Laya.Point = new Laya.Point(0, 0);

  public index: number;
  private _info: ConsortiaTaskScoreRewardInfo;

  onConstruct() {
    super.onConstruct();
    ToolTipsManager.Instance.register(this);
  }

  get info(): ConsortiaTaskScoreRewardInfo {
    return this._info;
  }

  set info(value: ConsortiaTaskScoreRewardInfo) {
    this._info = value;
    this.filters = value.recevied ? [UIFilter.grayFilter] : [];
    if (value) {
      this.icon = value.icon;
      this.txtCount.text = value.score.toString();
      this.tipData = this.getTipsStr(value.itemList);
      this.shine(value.canRecevie);
    } else {
      this.shine(false);
    }
  }

  private getTipsStr(arr: GoodsInfo[]): string {
    let str: string =
      LangManager.Instance.GetTranslation(
        "dayguide.LimitedSellView.ActiveBoxItemTips",
      ) + "<br>";
    if (arr != null) {
      for (let i: number = 0; i < arr.length; i++) {
        let gInfo = arr[i];
        let name = gInfo.templateInfo.TemplateNameLang;
        if (i == arr.length - 1) {
          str += name + " x" + gInfo.count;
        } else {
          str += name + " x" + gInfo.count + "<br>";
        }
      }
    }
    return str;
  }

  shine(b: boolean) {
    this.effect.setSelectedIndex(b ? 1 : 0);
  }

  dispose() {
    super.dispose();
  }
}
