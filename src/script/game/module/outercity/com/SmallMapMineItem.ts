import FUI_SmallMapMineItem from "../../../../../fui/OuterCity/FUI_SmallMapMineItem";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { PathManager } from "../../../manager/PathManager";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import { TipsShowType } from "../../../tips/ITipedDisplay";
import MineCircleItem from "./MineCircleItem";

export default class SmallMapMineItem extends FUI_SmallMapMineItem {
  private _info: WildLand;
  tipData: any;
  tipType: EmWindow;
  alphaTest: boolean = true;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 30);
  private _hasOccupyCount: number = 0; //玩家在这个节点已经占领的金矿数量
  protected onConstruct() {
    super.onConstruct();
    this.initEvent();
    Utils.setDrawCallOptimize(this);
  }

  private initEvent() {
    this.countList.itemRenderer = Laya.Handler.create(
      this,
      this.renderCountList,
      null,
      false,
    );
  }

  private removeEvent() {
    if (this.countList.itemRenderer instanceof Laya.Handler) {
      this.countList.itemRenderer.clear();
    }

    this.countList.itemRenderer = null;
  }

  private renderCountList(index: number, item: MineCircleItem) {
    if (!item || item.isDisposed) return;
    if (index < this._hasOccupyCount) {
      item.hasOccupy = true;
    } else {
      item.hasOccupy = false;
    }
  }

  public set info(value: WildLand) {
    if (value) {
      this._info = value;
      this.refreshView();
      ToolTipsManager.Instance.register(this);
      this.tipType = EmWindow.OuterCityMapMineTips;
      this.tipData = this._info;
    } else {
      this.countList.numItems = 0;
      ToolTipsManager.Instance.unRegister(this);
      this.tipData = null;
      this.levelTxt.text = "";
    }
  }

  private refreshView() {
    if (this._info) {
      if (this._info.tempInfo) {
        this.levelTxt.text = LangManager.Instance.GetTranslation(
          "fish.FishFrame.levelText",
          this._info.tempInfo.Grade,
        );
        this.picLoader.url = PathManager.solveMapPngBySonType(
          this._info.tempInfo.SonType,
        );
        this._hasOccupyCount = this.outerCityModel.occupyCount(this._info);
        this.countList.numItems = this._info.tempInfo.Property1; //property1配置了在这个节点最多可以占领多少个金矿;
        this.countList.visible = this._hasOccupyCount > 0 ? true : false;
      }
    }
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
    ToolTipsManager.Instance.unRegister(this);
    super.dispose();
  }
}
