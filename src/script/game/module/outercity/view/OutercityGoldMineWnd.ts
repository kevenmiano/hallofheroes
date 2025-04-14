//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import {
  NotificationEvent,
  OuterCityEvent,
} from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { WildLand } from "../../../map/data/WildLand";
import OutCityMineNode from "../../../map/outercity/OutCityMineNode";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import GoldMineInfoView from "../com/GoldMineInfoView";
import MineItem from "../com/MineItem";
import MyGoldInfoView from "../com/MyGoldInfoView";

export default class OutercityGoldMineWnd extends BaseWindow {
  public type: fgui.Controller;
  public frame: fgui.GLabel;
  public mineList: fgui.GList;
  public consortiaNameTxt: fgui.GRichTextField;
  private _minListData: Array<OutCityMineNode> = [];
  public goldMineInfoView: GoldMineInfoView; //金矿某一个子节点占领情况
  public myGoldInfoView: MyGoldInfoView; //我的金矿
  private _nodeInfo: WildLand;
  private _curSelectedItem: MineItem;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initEvent();
    this.initData();
    this.initViewBySelecteIndex(0);
    this.setCenter();
  }

  private initData() {
    if (this.params) {
      this.type = this.getController("type");
      this._nodeInfo = this.params.frameData;
      this.initView(this._nodeInfo);
    }
  }

  private initView(wild: WildLand) {
    this.outerCityModel.currentSelectMine = wild;
    this._minListData = wild.allNodeInfo;
    this.mineList.numItems = this._minListData.length;
    this.frame.getChild("title").text = wild.tempInfo.NameLang;
    if (wild.info.occupyLeagueName == "") {
      this.consortiaNameTxt.text = LangManager.Instance.GetTranslation(
        "maze.MazeFrame.Order",
      );
    } else {
      this.consortiaNameTxt.text = wild.info.occupyLeagueName;
    }
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private initEvent() {
    this.mineList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.mineList.on(fgui.Events.CLICK_ITEM, this, this.onMineListItemClick);
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.INIT_SECOND_NODE_DATA,
      this.updateSelectItemView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.UPDATE_SECOND_NODE_DATA,
      this.updateView,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.OUTERCITY_SELECTE_CANCEL,
      this.resetView,
      this,
    );
  }

  private removeEvent() {
    if (this.mineList) {
      this.mineList.off(fgui.Events.CLICK_ITEM, this, this.onMineListItemClick);
      this.mineList.itemRenderer.recover();
      this.mineList.itemRenderer = null;
    }
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.INIT_SECOND_NODE_DATA,
      this.updateSelectItemView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.UPDATE_SECOND_NODE_DATA,
      this.updateView,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityEvent.OUTERCITY_SELECTE_CANCEL,
      this.resetView,
      this,
    );
  }

  private resetView() {
    this.initViewBySelecteIndex(0);
    let len: number = this.mineList.numItems;
    let item: MineItem;
    this._curSelectedItem = null;
    for (let i: number = 0; i < len; i++) {
      item = this.mineList.getChildAt(i) as MineItem;
      if (item) {
        item.selected = false;
      }
    }
  }

  private updateSelectItemView(info: OutCityMineNode) {
    if (this._curSelectedItem) {
      this.goldMineInfoView.updateView(info);
    }
  }
  /**
   * 当前节点信息更新的时候,更新的是自己当前的节点
   */
  private updateView(arr: Array<any>) {
    let posId = arr[0];
    if (posId == this._nodeInfo.templateId) {
      for (let i: number = 0; i < this.outerCityModel.allMinNode.length; i++) {
        let itemData = this.outerCityModel.allMinNode[i];
        if (itemData.templateId == posId) {
          this._nodeInfo = itemData;
        }
      }
      this.initView(this._nodeInfo);
      this.initViewBySelecteIndex(this.type.selectedIndex);
    }
  }

  private onMineListItemClick(selectedItem: MineItem, evt: Laya.Event) {
    let len: number = this.mineList.numItems;
    let item: MineItem;
    if (this._curSelectedItem) {
      //如果有选中的
      if (this._curSelectedItem.info.nodeId == selectedItem.info.nodeId) {
        //这次点击的是同一个, 则取消选中状态
      } else {
        this.initViewBySelecteIndex(1);
        this._curSelectedItem = selectedItem;
        for (let i: number = 0; i < len; i++) {
          item = this.mineList.getChildAt(i) as MineItem;
          if (
            item &&
            item.info &&
            item.info.nodeId == selectedItem.info.nodeId
          ) {
            item.selected = true;
          } else {
            item.selected = false;
          }
        }
      }
    } else {
      this.initViewBySelecteIndex(1);
      this._curSelectedItem = selectedItem;
      for (let i: number = 0; i < len; i++) {
        item = this.mineList.getChildAt(i) as MineItem;
        if (item && item.info && item.info.nodeId == selectedItem.info.nodeId) {
          item.selected = true;
        } else {
          item.selected = false;
        }
      }
    }
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.OUTERCITY_SELECTE_MINEITEM,
      this._curSelectedItem,
    );
  }

  private renderListItem(index: number, item: MineItem) {
    if (item && !item.isDisposed) {
      item.wildLand = this._nodeInfo;
      item.info = this._minListData[index];
    }
  }

  public initViewBySelecteIndex(index: number) {
    this.type.selectedIndex = index;
    if (index == 0) {
      this.myGoldInfoView.refreshView(this._nodeInfo);
    } else {
      if (this._curSelectedItem) {
        let info = this.outerCityModel.findSecondNodeById(
          this._nodeInfo,
          this._curSelectedItem.info.nodeId,
        );
        this.goldMineInfoView.updateView(info);
      }
      this.goldMineInfoView.refrehView(this._nodeInfo);
    }
  }

  private get outerCityModel(): OuterCityModel {
    return OuterCityManager.Instance.model;
  }

  public OnHideWind() {
    this.outerCityModel.currentSelectMine = null;
    this.removeEvent();
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    this.goldMineInfoView.dispose();
    this.myGoldInfoView.dispose();
    super.dispose(dispose);
  }
}
