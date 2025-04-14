//@ts-expect-error: External dependencies
import FUI_SmallMapCityItem from "../../../../../fui/OuterCity/FUI_SmallMapCityItem";
import StringHelper from "../../../../core/utils/StringHelper";
import Utils from "../../../../core/utils/Utils";
import ColorConstant from "../../../constant/ColorConstant";
import { EmOuterCityWarCastlePeriodType } from "../../../constant/OuterCityWarDefine";
import { EmWindow } from "../../../constant/UIDefine";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { BaseCastle } from "../../../datas/template/BaseCastle";
import { PathManager } from "../../../manager/PathManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { TipsShowType } from "../../../tips/ITipedDisplay";
/**
 * 小地图上面的城堡显示
 */
export default class SmallMapCityItem extends FUI_SmallMapCityItem {
  private _info: BaseCastle;
  tipData: any;
  tipType: EmWindow;
  alphaTest: boolean = true;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);

  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
    Utils.setDrawCallOptimize(this);
  }

  private initEvent() {
    this.onClick(this, this.infoHandler);
  }

  private removeEvent() {
    this.offClick(this, this.infoHandler);
  }

  private infoHandler() {}

  public set info(value: BaseCastle) {
    if (value) {
      this._info = value;
      this.refreshView();
      ToolTipsManager.Instance.register(this);
      this.tipType = EmWindow.OuterCityMapCastleTips;
      this.tipData = this._info;
    } else {
      this.status.selectedIndex = 0;
      this.consortiaNameTxt.text = "";
      ToolTipsManager.Instance.unRegister(this);
      this.tipData = null;
    }
  }

  private refreshView() {
    this.setFlag(false);
    if (this._info) {
      if (!this._info.uncontestable) {
        let hasGuild = !StringHelper.isNullOrEmpty(
          this._info.defencerGuildName,
        );
        if (hasGuild) {
          this.consortiaNameTxt.text = "<" + this._info.defencerGuildName + ">";
          let pModel: PlayerInfo =
            PlayerManager.Instance.currentPlayerModel.playerInfo;
          if (
            pModel.consortiaID > 0 &&
            pModel.consortiaName == this._info.defencerGuildName
          ) {
            this.consortiaNameTxt.color = ColorConstant.GREEN_COLOR;
          } else {
            this.consortiaNameTxt.color = ColorConstant.RED_COLOR;
          }
        }
        switch (this._info.state) {
          case EmOuterCityWarCastlePeriodType.DeclaringWar:
          case EmOuterCityWarCastlePeriodType.Fighting:
            this.status.selectedIndex = 1;
            break;
          case EmOuterCityWarCastlePeriodType.Protected:
            this.status.selectedIndex = 2;
            break;
          default:
            this.status.selectedIndex = 0;
            break;
        }
        let flag: boolean = this.status.selectedIndex != 0;
        this.setFlag(flag, hasGuild);
      }

      this.cityLoader.url = PathManager.getCityPngBySonType(
        this._info.tempInfo.SonType,
      );
      if (this._info.tempInfo) {
        this.cityNameTxt.text = this._info.tempInfo.NameLang;
      }
    }
  }

  private setFlag(visible: boolean, hasGuild?: boolean) {
    if (!visible) {
      this.imgFlag2.visible = false;
      this.imgFlag.visible = false;
    } else {
      this.imgFlag2.visible = !hasGuild;
      this.imgFlag.visible = hasGuild;
    }
  }

  dispose() {
    this.removeEvent();
    ToolTipsManager.Instance.unRegister(this);
    super.dispose();
  }
}
