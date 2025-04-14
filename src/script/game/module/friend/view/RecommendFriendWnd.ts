import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { AddFriendsItem } from "./component/AddFriendsItem";
import { FriendManager } from "../../../manager/FriendManager";
import {
  FindResultEvent,
  FriendUpdateEvent,
} from "../../../constant/event/NotificationEvent";
import { RecommendInfo } from "../../../datas/RecommendInfo";
import UIButton from "../../../../core/ui/UIButton";
import Utils from "../../../../core/utils/Utils";
import RelationType from "../../../constant/RelationType";
import { TimerEvent } from "../../../utils/TimerTicker";
/**
 *推荐好友
 */
export class RecommendFriendWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public btn_onekey: UIButton;
  public btn_refresh: UIButton;
  public list: fgui.GList;
  public txt_time: fgui.GTextField;
  // public second:number = 5;//5秒倒计时
  private _data: RecommendInfo[];

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.initView();
    this.initEvent();
    this.setCenter();
    if (FriendManager.COUNT_DOWN < 5) {
      this.onTimer();
    }
    // FriendManager.getInstance().sendRecommendFriendRequest()
  }

  private initData() {
    this._data = [];
  }

  private initView() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
  }

  private initEvent() {
    FriendManager.getInstance().addEventListener(
      TimerEvent.TIMER,
      this.onTimer,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FriendUpdateEvent.UPDATE_RECOMONDLIST,
      this.__updateListHandler,
      this,
    );
    FriendManager.getInstance().addEventListener(
      FindResultEvent.GET_FIND_RESULTS_BY_NAME,
      this.__updateFindListHandler,
      this,
    );
  }

  public OnShowWind() {
    super.OnShowWind();

    this.__updateListHandler();
  }

  private renderListItem(index: number, item: AddFriendsItem) {
    let infoData = this._data[index];
    if (infoData) item.info = this._data[index];
  }

  public getAddBtnByIndex(idx: number): fgui.GButton {
    for (let index = 0; index < this.list.numItems; index++) {
      if (idx == index) {
        const element = this.list.getChildAt(index) as AddFriendsItem;
        return element.bbtn_add;
      }
    }
  }

  private __updateListHandler() {
    this._data = FriendManager.getInstance().recommendList;
    this.list.numItems = this._data.length;
    this.btn_onekey.enabled = this.list.numItems > 0;
  }

  private __updateFindListHandler(list: RecommendInfo[]) {
    this._data = list;
    this.list.numItems = this._data.length;
    this.btn_onekey.enabled = this.list.numItems > 0;
  }

  private btn_onekeyClick() {
    let idArr: number[] = [];
    for (let i = 0; i < this._data.length; i++) {
      const element = this._data[i];
      idArr.push(element.id);
    }
    FriendManager.getInstance().sendAddAllFriend(idArr, RelationType.FRIEND);
    this.btn_onekey.enabled = false;
    for (let index = 0; index < this.list.numItems; index++) {
      const item = this.list.getChildAt(index) as AddFriendsItem;
      item.getControllerAt(0).selectedIndex = 1;
    }
  }

  private btn_refreshClick() {
    FriendManager.getInstance().sendRecommendFriendRequest();
    FriendManager.getInstance().startTimer();
    this.btn_refresh.enabled = false;
    this.txt_time.visible = true;
    this.txt_time.text = "00:0" + FriendManager.COUNT_DOWN;
    // Laya.timer.loop(1000,this,this.onTimer);
  }

  private onTimer() {
    if (this.txt_time) {
      this.txt_time.text = "00:0" + FriendManager.COUNT_DOWN;
      this.txt_time.visible = true;
      this.btn_refresh.enabled = false;
    }
    if (FriendManager.COUNT_DOWN == 0) {
      if (this.btn_refresh) {
        this.btn_refresh.enabled = true;
        this.txt_time.visible = false;
      }
    }
  }

  private removeEvent() {
    FriendManager.getInstance().removeEventListener(
      TimerEvent.TIMER,
      this.onTimer,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FriendUpdateEvent.UPDATE_RECOMONDLIST,
      this.__updateListHandler,
      this,
    );
    FriendManager.getInstance().removeEventListener(
      FindResultEvent.GET_FIND_RESULTS_BY_NAME,
      this.__updateFindListHandler,
      this,
    );
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._data = null;
    super.dispose(dispose);
  }
}
