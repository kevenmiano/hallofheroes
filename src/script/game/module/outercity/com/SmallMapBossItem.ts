import FUI_SmallMapBossItem from "../../../../../fui/OuterCity/FUI_SmallMapBossItem";
import Utils from "../../../../core/utils/Utils";
import { EmWindow } from "../../../constant/UIDefine";
import { ToolTipsManager } from "../../../manager/ToolTipsManager";
import { WildLand } from "../../../map/data/WildLand";
import { TipsShowType } from "../../../tips/ITipedDisplay";
/**
 * 小地图上面的BOSS显示
 */
export default class SmallMapBossItem extends FUI_SmallMapBossItem {
  private _info: WildLand;
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

  public set info(value: WildLand) {
    if (value) {
      this._info = value;
      this.refreshView();
      ToolTipsManager.Instance.register(this);
      this.tipType = EmWindow.OuterCityMapBossTips;
      this.tipData = this._info;
    } else {
      this.bossLevel.text = "";
      ToolTipsManager.Instance.unRegister(this);
      this.tipData = null;
    }
  }

  private refreshView() {
    if (this._info && this._info.tempInfo) {
      this.bossLevel.text = this._info.tempInfo.Grade.toString();
    }
  }

  dispose() {
    ToolTipsManager.Instance.unRegister(this);
    this.tipData = null;
    this.removeEvent();
    super.dispose();
  }
}
