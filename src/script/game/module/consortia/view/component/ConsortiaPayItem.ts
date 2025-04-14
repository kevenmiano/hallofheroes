//@ts-expect-error: External dependencies
import FUI_ConsortiaPayItem from "../../../../../../fui/Consortia/FUI_ConsortiaPayItem";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { CommonConstant } from "../../../../constant/CommonConstant";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../../../tips/ITipedDisplay";
import { isOversea } from "../../../login/manager/SiteZoneCtrl";
import ConsortiaPrayInfo from "../../data/ConsortiaPrayInfo";

export default class ConsortiaPayItem
  extends FUI_ConsortiaPayItem
  implements ITipedDisplay
{
  private _info: ConsortiaPrayInfo;
  tipType: EmWindow;
  tipData: any;
  canOperate: boolean = false;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  protected onConstruct() {
    super.onConstruct();
    this.tipType = EmWindow.PropTips;
  }

  public set info(value: ConsortiaPrayInfo) {
    this._info = value;
    if (this._info) {
      ToolTipsManager.Instance.register(this);
      this.tipData = value.goodsInfo;
      this.goodsIcon.url = IconFactory.getGoodsIconByTID(
        value.goodsInfo.templateId,
      );
      let res =
        CommonConstant.QUALITY_RES[value.goodsInfo.templateInfo.Profile - 1];
      this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
      this.countTxt.text = this.getCountStr(value.goodsInfo);
      this.hasGet.selectedIndex = value.status;
    } else {
      this.goodsIcon.url = "";
      this.profile.icon = "";
      this.countTxt.text = "";
      this.hasGet.selectedIndex = 0;
    }
  }

  public getCountStr(value: GoodsInfo): string {
    if (
      !value.templateInfo ||
      value.templateInfo.MaxCount <= 1 ||
      value.count <= 0
    ) {
      return "";
    }
    if (isOversea()) {
      //北美钻石跟绑钻显示具体数量
      if (value.templateId == -400 || value.templateId == -500) {
        return value.count + "";
      }
    }
    let countStr = value.count + "";
    return countStr;
  }

  public get info(): ConsortiaPrayInfo {
    return this._info;
  }

  dispose() {
    ToolTipsManager.Instance.unRegister(this);
    super.dispose();
  }
}
