//@ts-expect-error: External dependencies
import FUI_OuterCityVehicleRewardItem from "../../../../../fui/OuterCity/FUI_OuterCityVehicleRewardItem";
import { IconFactory } from "../../../../core/utils/IconFactory";
import { CommonConstant } from "../../../constant/CommonConstant";
import { EmPackName } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { isOversea } from "../../login/manager/SiteZoneCtrl";

export default class OuterCityVehicleRewardItem extends FUI_OuterCityVehicleRewardItem {
  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: GoodsInfo) {
    if (value) {
      this.goodsIcon.url = IconFactory.getGoodsIconByTID(value.templateId);
      let res = CommonConstant.QUALITY_RES[value.templateInfo.Profile - 1];
      this.profile.icon = fgui.UIPackage.getItemURL(EmPackName.Base, res);
      this.countTxt.text = this.getCountStr(value);
    } else {
      this.goodsIcon.url = "";
      this.profile.icon = "";
      this.countTxt.text = "";
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
    if (value.count > 100000) {
      countStr = ((value.count / 1000) >> 0) + "K";
    }
    return countStr;
  }
}
