//@ts-expect-error: External dependencies
import FUI_SmallMapVehicleItem from "../../../../../fui/OuterCity/FUI_SmallMapVehicleItem";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { WildLand } from "../../../map/data/WildLand";
import { TipsShowType } from "../../../tips/ITipedDisplay";

export default class SmallMapVehicleItem extends FUI_SmallMapVehicleItem {
  private _info: WildLand;
  tipData: any;
  tipType: EmWindow;
  alphaTest: boolean = true;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 30);

  protected onConstruct() {
    super.onConstruct();
    Utils.setDrawCallOptimize(this);
  }

  public set info(value: WildLand) {
    if (value) {
      this._info = value;
      ToolTipsManager.Instance.register(this);
      if (value.info.occupyLeagueConsortiaId == 0) {
        //中立的
        this.btn.icon = fgui.UIPackage.getItemURL(
          "OuterCity",
          "Img_Material_vehicle1_S",
        );
      } else if (
        value.info.occupyLeagueConsortiaId ==
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID
      ) {
        //自己一方的
        this.btn.icon = fgui.UIPackage.getItemURL(
          "OuterCity",
          "Img_Material_vehicle2_S",
        );
      } else {
        //其他公会的
        this.btn.icon = fgui.UIPackage.getItemURL(
          "OuterCity",
          "Img_Material_vehicle3_S",
        );
      }
      this.tipType = EmWindow.OuterCityVehicleTips;
      this.tipData = this._info;
    } else {
      ToolTipsManager.Instance.unRegister(this);
      this.tipData = null;
    }
  }

  dispose() {
    ToolTipsManager.Instance.unRegister(this);
    super.dispose();
  }
}
