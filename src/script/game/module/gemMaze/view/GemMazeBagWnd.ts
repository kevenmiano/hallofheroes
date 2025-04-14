import FUI_CommonFrame3 from "../../../../../fui/Base/FUI_CommonFrame3";
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BagSortType, BagType } from "../../../constant/BagDefine";
import {
  BagEvent,
  GemMazeEvent,
} from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { SharedManager } from "../../../manager/SharedManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

/**
 * @author:zhihua.zhou
 * @description 奖励宝库
 */
export default class GemMazeBagWnd extends BaseWindow {
  private btn_adjust: fairygui.GButton;
  private btn_claim: fairygui.GButton;
  private list: fairygui.GList;

  private _sortByType: number = BagSortType.Default;
  private _bagDic: any;
  private _itemList: GoodsInfo[]; //按背包格子顺序存的物品信息,  有可能中间有空数据

  frame: FUI_CommonFrame3;

  public state: fgui.Controller;
  protected resizeContent: boolean = true;

  /**初始化 */
  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.state = this.getController("state");
    this.addEvent();
    this.updateItemlist();
    this.initLanguage();
  }

  initLanguage() {
    this.frame.getChild("title").text =
      LangManager.Instance.GetTranslation("gemMaze.str1");
    this.btn_claim.title = LangManager.Instance.GetTranslation(
      "gemMaze.GemMazeBagView.getAll",
    );
    this.btn_adjust.title =
      LangManager.Instance.GetTranslation("GemMazeWnd.tidyTxt");
  }

  private addEvent() {
    this.btn_adjust.onClick(this, this.onAdjust);
    this.btn_claim.onClick(this, this.onClaim);
    Utils.setDrawCallOptimize(this.list);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderList,
      null,
      false,
    );

    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.updateItemlist,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.updateItemlist,
      this,
    );
  }

  private removeEvent() {
    this.btn_adjust.offClick(this, this.onAdjust);
    this.btn_claim.offClick(this, this.onClaim);
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.updateItemlist,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.updateItemlist,
      this,
    );
  }

  constructor() {
    super();
    this.resizeContent = true;
  }

  private onRenderList(index: number, item: BaseItem) {
    if (item) {
      if (this._itemList[index]) {
        item.info = this._itemList[index];
      } else {
        item.info = null;
      }
    }
  }

  updateItemlist() {
    this.refreshStorageInfo();
    this._itemList = [];
    this._bagDic = GoodsManager.Instance.getMazeBagList();
    for (const key in this._bagDic) {
      if (this._bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
        let info: GoodsInfo = this._bagDic[key];
        this._itemList[info.pos] = info;
      }
    }
    this.list.numItems = this._itemList.length;
    if (this.list.numItems > 0) {
      this.state.selectedIndex = 1;
    } else {
      this.state.selectedIndex = 0;
    }
  }

  private refreshStorageInfo(): void {
    if (GoodsManager.Instance.getMazeBagList().getList().length > 0) {
      this.btn_adjust.enabled = this.btn_claim.enabled = true;
    } else {
      this.btn_adjust.enabled = this.btn_claim.enabled = false;
    }
  }

  /**
   * 整理背包
   */
  onAdjust() {
    let needAlert: boolean = true;
    let lastSaveDate: Date = new Date(
      SharedManager.Instance.domesticateAlertDate,
    );
    if (lastSaveDate) {
      let today: Date = new Date();
      if (
        today.getFullYear() == lastSaveDate.getFullYear() &&
        today.getMonth() == lastSaveDate.getMonth() &&
        today.getDate() == lastSaveDate.getDate()
      ) {
        needAlert = false;
      }
    }

    if (needAlert) {
      let content: string = LangManager.Instance.GetTranslation(
        "bag.helper.BagHelper.content02",
      );
      let checkTxt: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.text",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        { checkRickText: checkTxt },
        null,
        content,
        null,
        null,
        this.callback.bind(this),
      );
    } else {
      this.sortBag(true, this._sortByType);
    }
  }

  private callback(issure: boolean, notAlert: boolean) {
    if (notAlert) {
      SharedManager.Instance.domesticateAlertDate = new Date();
      SharedManager.Instance.saveDomesticateAlert();
    }
    if (issure) {
      this.sortBag(true, this._sortByType);
    }
  }

  sortBag(isOverlay: boolean, sortType: number) {
    let send_pos_old: number[] = [];
    let send_pos_new: number[] = [];
    let sort_arr: GoodsInfo[] = [];
    let temp: GoodsInfo;
    sort_arr = sort_arr.concat(this._itemList);

    // this._sortByType = sortType;
    sort_arr.sort(this.sortFun.bind(this));
    if (temp) {
      sort_arr.unshift(temp);
    }
    let isChange: boolean = false;
    let t_old_pos: number;
    for (let i: number = 0; i < sort_arr.length; i++) {
      if (sort_arr[i]) {
        t_old_pos = sort_arr[i].pos;
      }
      if (t_old_pos != i) {
        isChange = true;
      }
      send_pos_old.push(t_old_pos);
      send_pos_new.push(i);
    }

    if (isChange || isOverlay) {
      GoodsManager.Instance.fixBagItem(
        send_pos_old,
        send_pos_new,
        BagType.Maze,
        isOverlay,
      );
    }
  }

  protected sortFun(a: GoodsInfo, b: GoodsInfo): number {
    let index_a: number = a.templateInfo.SonType;
    let index_b: number = b.templateInfo.SonType;
    if (
      GoodsManager.Instance.isType(a, this._sortByType) &&
      !GoodsManager.Instance.isType(b, this._sortByType)
    ) {
      return -1;
    } else if (
      !GoodsManager.Instance.isType(a, this._sortByType) &&
      GoodsManager.Instance.isType(b, this._sortByType)
    ) {
      return 1;
    } else {
      if (index_a < index_b) {
        return -1;
      } else if (index_a > index_b) {
        return 1;
      } else {
        if (a.templateId < b.templateId) {
          return 1;
        } else if (a.templateId > b.templateId) {
          return -1;
        } else {
          if (a.strengthenGrade < b.strengthenGrade) {
            return 1;
          } else if (a.strengthenGrade > b.strengthenGrade) {
            return -1;
          } else {
            if (!a.isBinds && b.isBinds) {
              return -1;
            } else if (a.isBinds && !b.isBinds) {
              return 1;
            } else {
              return 0;
            }
          }
        }
      }
    }
    return 0;
  }

  onClaim() {
    GemMazeManager.Instance.sendOpenInfo(); //全部拾取
  }

  OnShowWind() {
    super.OnShowWind();
  }

  /**关闭 */
  OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
