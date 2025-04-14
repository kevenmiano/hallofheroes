//@ts-expect-error: External dependencies
import FUI_BoxItem from "../../../../../../fui/Welfare/FUI_BoxItem";
import LangManager from "../../../../../core/lang/LangManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../../tips/ITipedDisplay";
import LevelGiftItemInfo from "../../data/LevelGiftItemInfo";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import StringHelper from "../../../../../core/utils/StringHelper";

export default class BoxItem extends FUI_BoxItem implements ITipedDisplay {
  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any;
  showType?: TipsShowType = TipsShowType.onClick;
  canOperate?: boolean;
  extData?: any;
  startPoint?: Laya.Point = new Laya.Point(0, 0);
  tipDirctions?: string;
  tipGapV?: number;
  tipGapH?: number;

  private _info: LevelGiftItemInfo;
  constructor(container?: fgui.GComponent) {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.onEvent();
  }

  onEvent() {
    ToolTipsManager.Instance.register(this);
  }

  offEvent() {
    ToolTipsManager.Instance.unRegister(this);
  }

  public set info(vInfo: LevelGiftItemInfo) {
    this._info = vInfo;
    this.tipData = this.getTipsStr();
  }

  private getTipsStr(): string {
    let strArr: Array<string> = this._info.diamondStr.split("|");
    var goodsArr: Array<GoodsInfo> = [];
    var tipsStr: string = "";
    if (strArr) {
      let len = strArr.length;
      let goods: GoodsInfo;
      let strItem: string;
      for (let i = 0; i < len; i++) {
        strItem = strArr[i];
        if (!StringHelper.isNullOrEmpty(strItem)) {
          goods = new GoodsInfo();
          goods.templateId = Number(strItem.split(",")[0]);
          goods.count = Number(strItem.split(",")[1]);
          goodsArr.push(goods);
        }
      }
    }
    if (goodsArr != null) {
      for (var i: number = 0; i < goodsArr.length; i++) {
        if (i == goodsArr.length - 1) {
          tipsStr +=
            this.getGoodsName(goodsArr[i].templateId) + "*" + goodsArr[i].count;
        } else {
          tipsStr +=
            this.getGoodsName(goodsArr[i].templateId) +
            "*" +
            goodsArr[i].count +
            "<br>";
        }
      }
    }
    return tipsStr;
  }

  private getGoodsName(itemId: number): string {
    if (TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId))
      return TempleteManager.Instance.getGoodsTemplatesByTempleteId(itemId)
        .TemplateNameLang;
    else return "";
  }

  public dispose() {
    this.offEvent();
    super.dispose();
  }
}
