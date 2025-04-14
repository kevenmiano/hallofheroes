//@ts-expect-error: External dependencies
import FUI_SFashionSwitchView from "../../../../../fui/SBag/FUI_SFashionSwitchView";
import Logger from "../../../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { FashionEvent } from "../../../constant/event/NotificationEvent";
import { FashionManager } from "../../../manager/FashionManager";
import { SharedManager } from "../../../manager/SharedManager";
import { FashionModel } from "../../bag/model/FashionModel";
import { SFashionSwitchItem } from "./SFashionSwitchItem";

/**
 * 新版背包
 * @description 时装图鉴界面
 * @author zhihua.zhou
 * @date 2022/12/13
 * @ver
 */
export class SFashionSwitchView extends FUI_SFashionSwitchView {
  private pageSize: number = 6;
  private _data: t_s_itemtemplateData[];
  private isInited: boolean = false;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.list_tab.selectedIndex = -1;
  }

  public initView() {
    if (this.isInited) {
      FashionManager.Instance.getFashionBook();
      this.updateView();
      this.list.selectedIndex = -1;
      return;
    }
    this.isInited = true;
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.list.setVirtual();
    // this.list.numItems = this.pageSize;

    // this.refreshTips();
    this.initEvent();
    FashionManager.Instance.getFashionBook();
    this.updateView();
    this.list_tab.selectedIndex = 0;
    // this.list.scrollPane.scrollLeft(0,true)
    // let num = this.list.scrollPane.currentPageX;
    // for (let i = 0; i < num; i++) {
    //     this.list.scrollPane.scrollLeft(0)
    // }
    // this.list.selectedIndex = -1;
    // Laya.timer.once(3000,this,function(){

    // });
  }

  private initEvent() {
    this.list_tab.on(fgui.Events.CLICK_ITEM, this, this.__btnChangeHandler);
    // this.list.on(fgui.Events.SCROLL_END, this, this.updateBagPage);
    FashionManager.Instance.addEventListener(
      FashionEvent.FASHION_BOOK_RECEIVE,
      this.__receivedBookHandler,
      this,
    );
  }

  /**
   * 时装图鉴的视图刷新
   * */
  private updateView() {
    this._data = this.getCurrentFashionList(this.list_tab.selectedIndex);
    this.list.numItems = this._data.length;
    // this.updateBagPage();
    this.checkRedDot();
  }

  private renderListItem(index: number, item: SFashionSwitchItem) {
    let temp: t_s_itemtemplateData = this._data[index];
    item.data = temp;

    if (temp && this.fashionModel.isInSaveList(temp.TemplateId)) {
      // _itemList[i].setFrame(2);
    } else {
      // _itemList[i].setFrame(1);
    }
  }
  /**
   * 对应时装部位的分页, 以及对应时装的鉴定按钮上增加红点
   */
  checkRedDot() {
    this.fashionModel.checkRedDot(true);
    for (let i = 0; i < 4; i++) {
      this.list_tab.getChildAt(i).asButton.getChild("redDot").visible =
        this.fashionModel.redPointArr[i];
    }
  }

  /**
   * of GoodsInfoTemplate
   * @param index
   * @return
   *
   */
  private getCurrentFashionList(index: number): t_s_itemtemplateData[] {
    let arr: t_s_itemtemplateData[];
    let tempData: t_s_itemtemplateData[] = [];
    switch (index) {
      case 0:
        arr = this.fashionModel.weaponTems;
        break;
      case 1:
        arr = this.fashionModel.clothesTems;
        break;
      case 2:
        arr = this.fashionModel.hatTems;
        break;
      case 3:
        arr = this.fashionModel.wingTems;
        break;
      default:
        arr = [];
        break;
    }
    let count = arr.length;
    let element = null;
    let isActive = false;
    for (let index = 0; index < count; index++) {
      element = arr[index];
      isActive =
        element.Activation == 1
          ? this.fashionModel.bookList.has(element.TemplateId)
          : true;
      if (isActive) tempData.push(element);
    }

    // tempData = ArrayUtils.sortOn(tempData, "Property2", ArrayConstant.NUMERIC);
    tempData.sort((a, b) => {
      let valA_1 = a.Property2;
      let valB_1 = b.Property2;

      let valA_2 = 0;
      let valB_2 = 0;
      if (a.TemplateId in this.fashionModel.bookList) {
        if (this.fashionModel.hasIdentityedBook(a.TemplateId)) {
          //鉴定过
          valA_2 = 50;
        } else {
          valA_2 = 10;
        }
      } else {
        //不可鉴定
        valA_2 = 100;
      }

      if (b.TemplateId in this.fashionModel.bookList) {
        if (this.fashionModel.hasIdentityedBook(b.TemplateId)) {
          //鉴定过
          valB_2 = 50;
        } else {
          valB_2 = 10;
        }
      } else {
        //不可鉴定
        valB_2 = 100;
      }

      return valA_1 + valA_2 - (valB_1 + valB_2);
    });
    return tempData;
  }

  private __btnChangeHandler(item: fgui.GObject) {
    this.fashionModel.tapNum = this.list_tab.selectedIndex;
    this.list.scrollToView(0);
    this.updateView();
    this.list.selectedIndex = -1;
  }

  /**
   * 小红点数字
   * @private
   */
  // private refreshTips() {
  // if(this.fashionModel.newFashionDic["weapon"] > 0)
  // {
  //     _weaponTip.text = this.fashionModel.newFashionDic["weapon"] + "";
  //     _weaponTip.visible = true;
  // }
  // else
  // {
  //     _weaponTip.visible = false;
  // }
  // if(this.fashionModel.newFashionDic["clothes"] > 0)
  // {
  //     _clothesTip.text = this.fashionModel.newFashionDic["clothes"] + "";
  //     _clothesTip.visible = true;
  // }
  // else
  // {
  //     _clothesTip.visible = false;
  // }
  // if(this.fashionModel.newFashionDic["hat"] > 0)
  // {
  //     _hatTip.text = this.fashionModel.newFashionDic["hat"] + "";
  //     _hatTip.visible = true;
  // }
  // else
  // {
  //     _hatTip.visible = false;
  // }
  // if(this.fashionModel.newFashionDic["wing"] > 0)
  // {
  //     _wingTip.text = this.fashionModel.newFashionDic["wing"] + "";
  //     _wingTip.visible = true;
  // }
  // else
  // {
  //     _wingTip.visible = false;
  // }
  // }

  private __receivedBookHandler() {
    if (FashionManager.Instance.fashionIdentityProgress <= 3) {
      SharedManager.Instance.fashionIdentityProgress = 4;
    }
    //可鉴定时装, 完成鉴定操作后, 不更新排序, 直至下次打开界面
    // this.updateView();
    // this.refreshTips();
    // let curItem:SFashionSwitchItem = this.list.getChildAt(this.list.selectedIndex - this.list.scrollPane.currentPageX*6) as SFashionSwitchItem;
    // if(curItem){
    //     let temp: t_s_itemtemplateData = this._data[this.list.selectedIndex];
    //     curItem.data = temp;
    //     // if(this.list.selectedIndex > 5){
    //     //     this.updateView();
    //     // }
    // }else{
    this.updateView();
    // }
  }

  public get fashionModel(): FashionModel {
    return FashionManager.Instance.fashionModel;
  }

  removeEvent() {
    this.isInited = false;
    this.list_tab.off(fgui.Events.CLICK_ITEM, this, this.__btnChangeHandler);
    // this.list.off(fgui.Events.SCROLL_END, this, this.updateBagPage);
    FashionManager.Instance.removeEventListener(
      FashionEvent.FASHION_BOOK_RECEIVE,
      this.__receivedBookHandler,
      this,
    );
  }

  /**
   * 切换主页签后, 重置试穿状态
   */
  public resetTryWearState() {
    for (const key in this.fashionModel.saveList) {
      if (this.fashionModel.saveList.hasOwnProperty(key)) {
        this.fashionModel.saveList[key] = null;
        delete this.fashionModel.saveList[key];
      }
    }
  }

  dispose() {
    this.resetTryWearState();
    super.dispose();
  }
}
