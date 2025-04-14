import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import WarlordsManager from "../../../manager/WarlordsManager";
import WarlordsModel from "../WarlordsModel";
import WarlordsPlayerInfo from "../WarlordsPlayerInfo";
import WarlordsBetSelectItem from "./component/WarlordsBetSelectItem";
/**
 * 众神之战欢乐竞猜人员选择界面
 */
export default class WarlordsBetSelectWnd extends BaseWindow {
  private canBetList: Array<WarlordsPlayerInfo> = [];
  private selectedRank: number;
  public playerList: fgui.GList;
  public confirmBtn: fgui.GButton;
  private _selecteItem: WarlordsBetSelectItem;
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    if (this.frameData) {
      this.selectedRank = this.frameData;
    }
    this.initEvent();
    this.refreshView();
  }

  private initEvent() {
    this.playerList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.playerList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    this.confirmBtn.onClick(this, this.confirmBtnHandler);
  }

  private removeEvent() {
    this.confirmBtn.offClick(this, this.confirmBtnHandler);
    this.playerList.off(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
  }

  private onClickItem() {
    let selecteIndex: number = this.playerList.selectedIndex;
    for (let i: number = 0; i < this.playerList.numItems; i++) {
      let item: WarlordsBetSelectItem = this.playerList.getChildAt(
        i,
      ) as WarlordsBetSelectItem;
      if (selecteIndex == i) {
        item.flag = true;
        this._selecteItem = item;
      } else {
        item.flag = false;
      }
    }
  }

  confirmBtnHandler() {
    if (this._selecteItem) {
      this.warlordsModel.addListData(
        WarlordsModel.CUR_BETTING,
        this.selectedRank,
        this._selecteItem.info,
      );
    }
    this.OnBtnClose();
  }

  private renderListItem(index: number, item: WarlordsBetSelectItem) {
    item.flag = index == this.playerList.selectedIndex ? true : false;
    item.rank = this.selectedRank;
    item.info = this.canBetList[index];
  }

  private refreshView() {
    let betList: Array<WarlordsPlayerInfo> = this.warlordsModel.canBetList;
    if (betList) {
      this.canBetList = [];
      let len: number = betList.length;
      let warlordsPlayerInfo: WarlordsPlayerInfo;
      for (let i = 0; i < len; i++) {
        warlordsPlayerInfo = betList[i] as WarlordsPlayerInfo;
        if (
          warlordsPlayerInfo &&
          (warlordsPlayerInfo.betRank == 0 ||
            warlordsPlayerInfo.betRank != this.selectedRank)
        ) {
          this.canBetList.push(warlordsPlayerInfo);
        }
      }
    }
    this.playerList.numItems = this.canBetList.length;
    this.playerList.selectedIndex = 0;
    this.onClickItem();
  }

  private get warlordsModel(): WarlordsModel {
    return WarlordsManager.Instance.model;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
