import FUI_WarlordsPlayerItem from "../../../../../../fui/Warlords/FUI_WarlordsPlayerItem";
import { ShowAvatar } from "../../../../avatar/view/ShowAvatar";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import LangManager from "../../../../../core/lang/LangManager";
import { AppellView } from "../../../../avatar/view/AppellView";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { t_s_appellData } from "../../../../config/t_s_appell";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";

export default class WarlordsPlayerItem extends FUI_WarlordsPlayerItem {
  private _heroFigure: ShowAvatar;
  private _heroFigureCon: fgui.GComponent;
  private _info: ThaneInfo;
  private _index: number;
  private _honerView: AppellView;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this._heroFigureCon = new fgui.GComponent();
    this.addChild(this._heroFigureCon);
    this._heroFigure = new ShowAvatar(false);
    this._heroFigureCon.displayObject.addChild(this._heroFigure);
    this._heroFigure.pos(35, 20);
    this.setChildIndex(this._heroFigureCon, -1);
  }

  public set index(value: number) {
    this._index = value;
    var appellIds: Array<number> = [42, 40, 41];
    var appellId: number = appellIds[this._index - 1];
    var appellInfo: t_s_appellData =
      TempleteManager.Instance.getAppellTemplateByID(appellId);
    if (appellInfo) {
      this._honerView = new AppellView(
        appellInfo.ImgWidth,
        appellInfo.ImgHeight,
        appellId,
      );
      this._honerView.pos(this._heroFigure.x + 135, this._heroFigure.y + 210);
    }
  }

  public set info(vInfo: ThaneInfo) {
    this._info = vInfo;
    if (this._info) {
      this.c1.selectedIndex = 3;
      this._heroFigure.data = this._info;
      this.nameTxt.text = this._info.serviceName + " " + this._info.nickName;
      if (this._honerView)
        this._heroFigureCon.displayObject.addChild(this._honerView);
    } else {
      this.c1.selectedIndex = this._index - 1;
      this._heroFigure.data = null;
      this.nameTxt.text = LangManager.Instance.GetTranslation(
        "Warlords.WarlordsPlayerItem.nameTxt",
      );
      if (this._honerView && this._honerView.parent)
        this._honerView.parent.removeChild(this._honerView);
    }
  }

  public get info(): ThaneInfo {
    return this._info;
  }

  dispose() {
    ObjectUtils.disposeObject(this._heroFigure);
    super.dispose();
  }
}
