import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { t_s_dropitemData } from "../../../config/t_s_dropitem";
import {
  MultiBoxSelectEvent,
  QuestionEvent,
} from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SocketSendManager } from "../../../manager/SocketSendManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import MulitBoxSelectItem from "./component/MultiBoxSelectItem";

/**
 * 多选宝箱
 */
export default class MultiBoxSelectWnd extends BaseWindow {
  public frame: fgui.GComponent;
  public btn_cancel: UIButton;
  public btn_sure: UIButton;
  public list: fgui.GList;
  public selectText: fgui.GRichTextField; //选择
  public selectedText: fgui.GRichTextField; //已选

  private _info: GoodsInfo = null; //当前物品信息
  private _openCount: number = 1; //打开多选宝箱数量,单选最大数量
  private _canSelectCount: number = 0; //可选数量
  private _selectMaxCount: number = 0; //最大选择数量
  private _itemListData: t_s_dropitemData[] = [];
  private _countHandler: Laya.Handler = null;
  private _selectBoxValue: Map<number, object> = null;

  public OnInitWind(): void {
    super.OnInitWind();
    this.setCenter();
    this.addEvent();
    this.initParams();
    this.initView();
  }

  /**传递参数 */
  private initParams() {
    [this._info, this._openCount] = this.params;
  }

  private addEvent() {
    this.btn_sure.onClick(this, this.onComfirmHandler);
    this.btn_cancel.onClick(this, this.OnBtnClose);
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderChannelListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      MultiBoxSelectEvent.FOCUS,
      this.disableScroll,
      this,
    );
    NotificationManager.Instance.addEventListener(
      MultiBoxSelectEvent.BLUR,
      this.enableScroll,
      this,
    );
  }

  private offEvent() {
    this.btn_sure.offClick(this, this.onComfirmHandler);
    this.btn_cancel.offClick(this, this.OnBtnClose);
    if (this.list.itemRenderer instanceof Laya.Handler) {
      this.list.itemRenderer.recover();
      this.list.itemRenderer = null;
    }
    NotificationManager.Instance.removeEventListener(
      MultiBoxSelectEvent.FOCUS,
      this.disableScroll,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      MultiBoxSelectEvent.BLUR,
      this.enableScroll,
      this,
    );
  }

  enableScroll() {
    this.list.scrollPane.touchEffect = true;
    this.list.scrollPane.mouseWheelEnabled = true;
  }

  disableScroll() {
    this.list.scrollPane.touchEffect = false;
    this.list.scrollPane.mouseWheelEnabled = false;
  }

  /** */
  onFocusTarget() {
    NotificationManager.Instance.dispatchEvent(QuestionEvent.FOCUS);
  }

  /** */
  onBlurTarget() {
    NotificationManager.Instance.dispatchEvent(QuestionEvent.BLUR);
  }

  private initView() {
    // let title = LangManager.Instance.GetTranslation('');
    // this.frame.getChild('title').text = title;
    this._selectBoxValue = new Map();
    this._countHandler && this._countHandler.recover();
    this._countHandler = null;
    this._countHandler = Laya.Handler.create(
      this,
      this._countChangeHandler,
      null,
      false,
    );

    let dropId = Number(this._info.templateInfo.Property1);
    let selectCount = Number(this._info.templateInfo.Property2);
    this._canSelectCount = selectCount;
    this._selectMaxCount = this._openCount * selectCount; //开启总数
    this.selectText.setVar("count", this._openCount.toString()).flushVars(); //可选择多少个
    this.selectText.setVar("max", selectCount.toString()).flushVars(); //可选奖励个数
    this.selectedText.setVar("count", `[color=#FFEC6]${0}[/color]`).flushVars(); //已选择数量
    this.selectedText
      .setVar("max", this._selectMaxCount.toString())
      .flushVars(); //可选择多少个
    let itemlist: t_s_dropitemData[] =
      TempleteManager.Instance.getDropItemssByDropId(dropId);
    this._itemListData = itemlist;
    this.list.numItems = itemlist.length;
    this.updateSelectCount();
  }

  /**渲染列表 */
  private renderChannelListItem(index: number, item: MulitBoxSelectItem) {
    if (item && !item.isDisposed) {
      item.setItemData(
        index,
        this._itemListData[index],
        this._openCount,
        this._countHandler,
      );
    }
  }

  /**增加或减少*/
  private _countChangeHandler(
    item: MulitBoxSelectItem,
    Id: number,
    count: number,
  ) {
    Logger.warn("index:", item.index, "   count:", count);
    this._selectBoxValue.set(item.index, { count: count, Id: Id });
    this.updateItemsEnable();
    this.updateSelectCount();
  }

  /**更新列表状态 */
  private updateItemsEnable() {
    let countBoxNumber = 0; //所选宝箱
    let selectboxCount = 0; //选择宝箱种类数量
    this._selectBoxValue.forEach(function (value: any, key) {
      Logger.log(value, key);
      if (value.count > 0) {
        selectboxCount += 1;
      }
      countBoxNumber += value.count;
    });
    let itemsCount = this.list.numItems;
    let isMax = countBoxNumber >= this._selectMaxCount; //总数  ----
    let isMaxSelect = selectboxCount >= this._canSelectCount; //种类
    for (let index = 0; index < itemsCount; index++) {
      let cellitem: MulitBoxSelectItem = this.list.getChildAt(
        index,
      ) as MulitBoxSelectItem;
      let isItemMax = cellitem.selectCount >= this._openCount; //单个最大值  ----
      let isItemNone = cellitem.selectCount == 0; //单个
      let isBtnEnable = false; //
      if (isMax || isItemMax) {
        isBtnEnable = false;
      } else {
        if (isMaxSelect) isBtnEnable = !isItemNone;
        else isBtnEnable = true;
      }
      cellitem.stepper.btn_max.enabled = isBtnEnable;
      cellitem.stepper.btn_min.enabled = cellitem.selectCount > 0;
      cellitem.stepper.txt_num.enabled =
        isBtnEnable || cellitem.selectCount > 0; //两者
    }
  }

  /**更新已选宝箱 */
  private updateSelectCount() {
    let selectboxCount = 0; //选择宝箱种类数量
    let countBoxNumber = 0; //所选宝箱
    this._selectBoxValue.forEach(function (value: any, key) {
      Logger.log(value, key);
      if (value.count > 0) {
        selectboxCount += 1;
      }
      countBoxNumber += value.count;
    });
    if (countBoxNumber > this._selectMaxCount) {
      this.selectedText
        .setVar("count", `[color=#FF2E2E]${countBoxNumber}[/color]`)
        .flushVars(); //已选择数量
    } else {
      this.selectedText
        .setVar("count", `[color=#FFECC6]${countBoxNumber}[/color]`)
        .flushVars(); //已选择数量
    }
    this.btn_sure.enabled =
      countBoxNumber == this._selectMaxCount &&
      selectboxCount == this._canSelectCount;
  }

  /**开启宝箱 */
  private onComfirmHandler() {
    if (!this._selectBoxValue) {
      return;
    }
    let selectItemInfos = [];
    this._selectBoxValue.forEach(function (value: any, key) {
      Logger.log(value, key);
      let obj = {
        pos: Number(value.Id),
        count: Number(value.count),
      };
      selectItemInfos.push(obj);
    });
    let pos = this._info.pos;
    let count = this._openCount;
    SocketSendManager.Instance.sendUseItem(
      pos,
      count,
      1,
      "",
      0,
      selectItemInfos,
    );
    this.hide();
  }

  protected OnClickModal(): void {}

  public OnHideWind(): void {
    this.offEvent();
    this._selectBoxValue.clear();
    super.OnHideWind();
  }
}
