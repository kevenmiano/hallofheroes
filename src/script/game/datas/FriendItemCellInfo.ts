import { FriendUpdateEvent } from "../constant/event/NotificationEvent";
import { FriendManager } from "../manager/FriendManager";
import IMManager from "../manager/IMManager";
import BaseIMInfo from "./BaseIMInfo";
import FriendModel from "./model/FriendModel";
import { ThaneInfo } from "./playerinfo/ThaneInfo";

/**
 * @author:pzlricky
 * @data: 2020-12-29 11:14
 * @description ***
 */
export default class FriendItemCellInfo extends ThaneInfo {
  public static GROUP: string = "GROUP";

  /**
   * item类型, 参看FriendModel
   */
  public type: number = 0;
  /**
   *分组标题
   */
  public title: string;

  /**FriendGroupId*/
  private _groupId: number = 0;

  constructor() {
    super();
  }

  /**
   * 分组ID
   */
  public get groupId(): number {
    return this._groupId;
  }

  public set groupId(value: number) {
    if (this._groupId == value) {
      return;
    }
    this._groupId = value;
    this._changeObj[FriendItemCellInfo.GROUP] = true;
  }

  private _selected: boolean;
  public set selected(value: boolean) {
    this._selected = value;
    this.dispatchEvent(Laya.Event.CHANGE);
  }

  public get selected(): boolean {
    return this._selected;
  }

  /**
   * 是否闪动
   */
  public get isShine(): boolean {
    let msgList: Array<BaseIMInfo> =
      IMManager.Instance.model.unreadMsgDic[this.userId];
    if (msgList && msgList.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  commit() {
    if (this._changeObj[FriendItemCellInfo.GROUP]) {
      FriendManager.getInstance().dispatchEvent(
        FriendUpdateEvent.FRIEND_UPDATE,
        null,
      );
    }
    FriendManager.getInstance().dispatchEvent(
      FriendUpdateEvent.FRIEND_UPDATE,
      null,
    );
    super.commit();
  }

  public getCellHeight(): number {
    switch (this.type) {
      case FriendModel.ITEMTYPE_GROUP:
        return 23;
        break;
      default:
        return 50;
    }
  }
}
