//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../../manager/PlayerManager";
import TreasureInfo from "../../../map/data/TreasureInfo";
import ConsortiaTreasureItem from "./component/ConsortiaTreasureItem";
/**
 * 公会宝藏矿脉入口详情
 */
export default class ConsortiaTreasureWnd extends BaseWindow {
  public c1: fgui.Controller;
  public frame: fgui.GLabel;
  public consortiaList: fgui.GList;
  private _consortiaDataList: Array<TreasureInfo> = [];
  public OnInitWind() {
    super.OnInitWind();
    this.initEvent();
    this.c1 = this.getController("c1");
    this.consortDataUpdateHandler();
    this.setCenter();
  }

  private initEvent() {
    this.consortiaList.itemRenderer = Laya.Handler.create(
      this,
      this.renderConsortiaList,
      null,
      false,
    );
  }

  private removeEvent() {
    Utils.clearGListHandle(this.consortiaList);
  }
  private renderConsortiaList(index: number, item: ConsortiaTreasureItem) {
    if (!item || item.isDisposed) return;
    item.info = this._consortiaDataList[index];
  }

  private consortDataUpdateHandler() {
    this._consortiaDataList = this.playerModel.conosrtMinerals;
    this.consortiaList.numItems = this._consortiaDataList.length;
    if (this.consortiaList.numItems > 0) {
      this.c1.selectedIndex = 1;
    } else {
      this.c1.selectedIndex = 0;
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
    this.removeEvent();
  }
}
