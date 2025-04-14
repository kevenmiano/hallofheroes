import FUI_CastleBuildInfoItem from "../../../../fui/Castle/FUI_CastleBuildInfoItem";
import LangManager from "../../../core/lang/LangManager";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import BuildingType from "../../map/castle/consant/BuildingType";
import { BuildInfo } from "../../map/castle/data/BuildInfo";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";

export default class CastleBuildInfoItem extends FUI_CastleBuildInfoItem {
  private _buildInfo: BuildInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  private addEvent() {
    this.lookInfoBtn.onClick(this, this.lookBtnHandler);
  }

  private removeEvent() {
    this.lookInfoBtn.offClick(this, this.lookBtnHandler);
  }

  public set info(value: BuildInfo) {
    this._buildInfo = value;
    if (this._buildInfo) {
      this.buildNameTxt.text = this._buildInfo.templeteInfo.BuildingNameLang;
      this.levelTxt.text = LangManager.Instance.GetTranslation(
        "public.level2",
        this._buildInfo.level,
      );
    }
  }

  private lookBtnHandler() {
    FrameCtrlManager.Instance.exit(EmWindow.CastleBuildInfoWnd);
    switch (this._buildInfo.templeteInfo.SonType) {
      case BuildingType.CASERN:
        FrameCtrlManager.Instance.open(EmWindow.CasernWnd, this._buildInfo);
        break;
      case BuildingType.HOUSES:
        UIManager.Instance.ShowWind(
          EmWindow.ResidenceFrameWnd,
          this._buildInfo,
        );
        break;
      case BuildingType.OFFICEAFFAIRS:
        UIManager.Instance.ShowWind(EmWindow.PoliticsFrameWnd, this._buildInfo);
        break;
      case BuildingType.WAREHOUSE:
        UIManager.Instance.ShowWind(EmWindow.DepotWnd, this._buildInfo);
        break;
      case BuildingType.CRYSTALFURNACE:
        UIManager.Instance.ShowWind(EmWindow.CrystalWnd, this._buildInfo);
        break;
      case BuildingType.SEMINARY:
        UIManager.Instance.ShowWind(EmWindow.SeminaryWnd, this._buildInfo);
        break;
    }
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
