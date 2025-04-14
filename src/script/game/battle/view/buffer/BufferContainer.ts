/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-18 11:05:48
 * @LastEditTime: 2024-02-02 11:28:12
 * @LastEditors: jeremy.xu
 * @Description: 人物身上的buff
 */

import { BufferDamageData } from "../../data/BufferDamageData";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { RoleEvent } from "../../../constant/event/NotificationEvent";
import FUIHelper from "../../../utils/FUIHelper";
import BuffItemCell from "./BuffItemCell";
import { EmPackName } from "../../../constant/UIDefine";

export default class BufferContainer extends Laya.Sprite {
  private _info: BaseRoleInfo;
  private _buffDatas: BufferDamageData[] = [];
  private _deBuffDatas: BufferDamageData[] = [];
  private _allBuffDatas: BufferDamageData[] = [];
  private static SHOW_ROW_BUFFCNT: number = 4;
  private static SHOW_BUFFCNT: number = 4;
  private static OFFSETX: number = 32;
  private static OFFSETY: number = 32;
  private static ITEM_SIZE: number = 30;

  private _buffItemList: fgui.GComponent[] = [];
  private _deBuffItemList: fgui.GComponent[] = [];
  private _itemList: BuffItemCell[] = [];

  private gBuffTip: fgui.GComponent;
  private cgBuffTip: fgui.Controller;

  private gBuffIconTip: fgui.GComponent;

  constructor(info: BaseRoleInfo) {
    super();
    this._info = info;
    this.initView();
    this.addEvent();
  }

  private initView() {
    // this.gBuffTip = FUIHelper.createFUIInstance(EmPackName.Battle, "Com_RoleBuffTip")
    // this.gBuffTip.visible = false
    // this.addChild(this.gBuffTip.displayObject)
    // this.cgBuffTip = this.gBuffTip.getController("cState")
    // this.gBuffIconTip = FUIHelper.createFUIInstance(EmPackName.Battle, "Com_RoleBuffIconTip")
    // this.addChild(this.gBuffIconTip.displayObject)
    // for (let index = 1; index <= BufferContainer.SHOW_BUFFCNT; index++) {
    //     let element = this.gBuffIconTip.getChild("buffItem" + Utils.numFormat(index, 2)) as BuffItemCell;
    //     element.visible = false
    //     this._buffItemList.push(element)
    //     element = this.gBuffIconTip.getChild("deBuffItem" + Utils.numFormat(index, 2)) as BuffItemCell;
    //     element.visible = false
    //     this._deBuffItemList.push(element)
    // }
  }

  private addEvent() {
    if (this._info) {
      this._info.addEventListener(
        RoleEvent.REFRESH_BUFFER,
        this.__reFreshBuffer,
        this,
      );
      this._info.addEventListener(
        RoleEvent.REFRESH_BUFFER_TURN,
        this.__reFreshBufferTurn,
        this,
      );
    }
  }

  private removeEvent() {
    if (this._info) {
      this._info.removeEventListener(
        RoleEvent.REFRESH_BUFFER,
        this.__reFreshBuffer,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.REFRESH_BUFFER_TURN,
        this.__reFreshBufferTurn,
        this,
      );
    }
  }

  private __reFreshBuffer(data: Array<BufferDamageData>) {
    let needIconBuffers: BufferDamageData[] = [];
    data.forEach((buffer: BufferDamageData) => {
      if (
        buffer.currentTurn > 0 &&
        buffer.Icon &&
        (buffer.AttackData == 1 || buffer.AttackData == 2)
      ) {
        needIconBuffers.push(buffer);
      }
    });
    this._allBuffDatas = needIconBuffers.reverse();
    // this.getSplitBuffList(needIconBuffers);
    this.refreshItems();

    // Logger.battle("[BufferContainer]reFreshBuffer", this._info.roleName, this._info.livingId, this._buffDatas, this._deBuffDatas)
  }

  private __reFreshBufferTurn(data: Array<BufferDamageData>) {
    this.refreshItems();
  }

  private getSplitBuffList(damageDatas: BufferDamageData[]) {
    this._buffDatas = [];
    this._deBuffDatas = [];
    damageDatas.forEach((bufData: BufferDamageData) => {
      if (bufData.AttackData == 1) {
        this._buffDatas.push(bufData);
      } else {
        this._deBuffDatas.push(bufData);
      }
    });
  }

  private refreshItems() {
    this.removeChildren();
    // let buffLen = this._buffDatas.length
    // let deBuffLen = this._deBuffDatas.length

    // let debuffStartRow: number
    // if (buffLen == 0) {
    //     debuffStartRow = 0  // 第一行
    // } else {
    //     let buffRowMaxRow = Math.floor(buffLen / BufferContainer.SHOW_ROW_BUFFCNT)
    //     debuffStartRow = buffRowMaxRow + 1
    // }

    let buffLen = this._allBuffDatas.length;

    if (buffLen > BufferContainer.SHOW_BUFFCNT) {
      buffLen = BufferContainer.SHOW_BUFFCNT;
    }

    for (let index = 0; index < buffLen; index++) {
      let item = FUIHelper.createFUIInstance(
        EmPackName.Battle,
        "BufferItemCell",
      ) as BuffItemCell;
      item.setPivot(0, 1, true);
      item.setSize(BufferContainer.ITEM_SIZE, BufferContainer.ITEM_SIZE);
      item.cellData = this._allBuffDatas[index];
      this.addChild(item.displayObject);
      let cow = index % BufferContainer.SHOW_ROW_BUFFCNT;
      let row = Math.floor(index / BufferContainer.SHOW_ROW_BUFFCNT);
      item.setXY(cow * BufferContainer.OFFSETX, -row * BufferContainer.OFFSETY);
      this._itemList.push(item);
    }

    // for (let index = 0; index < deBuffLen; index++) {
    //     let item = FUIHelper.createFUIInstance(EmPackName.Battle, "BufferItemCell") as BuffItemCell
    //     item.setPivot(0, 1, true)
    //     item.setSize(BufferContainer.ITEM_SIZE, BufferContainer.ITEM_SIZE)
    //     item.cellData = this._deBuffDatas[index]
    //     this.addChild(item.displayObject)
    //     let cow = index % BufferContainer.SHOW_ROW_BUFFCNT
    //     let row = Math.floor(index / BufferContainer.SHOW_ROW_BUFFCNT)
    //     item.setXY(cow * BufferContainer.OFFSETX, -(row + debuffStartRow) * BufferContainer.OFFSETY)
    //     this._itemList.push(item)
    // }

    // this._buffItemList.forEach((element: BuffItemCell, index: number) => {
    //     let buffData = this._buffDatas[index]
    //     element.visible = Boolean(buffData)
    //     if (buffData) {
    //         element.cellData = buffData
    //     }
    // });

    // this._deBuffItemList.forEach((element: BuffItemCell, index: number) => {
    //     let buffData = this._deBuffDatas[index]
    //     element.visible = Boolean(buffData)
    //     if (buffData) {
    //         element.cellData = buffData
    //     }
    // });

    // this.setArrowBuffTip(this._buffDatas.length, this._deBuffDatas.length)
  }

  // 箭头方式的buff提示
  private setArrowBuffTip(buffCnt: number = 0, deBuffCnt: number = 0) {
    if (deBuffCnt == 0 && buffCnt == 0) {
      this.gBuffTip.visible = false;
      return;
    }
    this.gBuffTip.visible = true;
    if (buffCnt > 0 && deBuffCnt > 0) {
      this.cgBuffTip.selectedIndex = 0;
    }

    if (deBuffCnt == 0 && buffCnt > 0) {
      this.cgBuffTip.selectedIndex = 1;
    }

    if (deBuffCnt > 0 && buffCnt == 0) {
      this.cgBuffTip.selectedIndex = 2;
    }

    this.gBuffTip.getChild("txtBuffCnt").text = buffCnt.toString();
    this.gBuffTip.getChild("txtDeBuffCnt").text = deBuffCnt.toString();
  }

  public removeChildren(beginIndex?: number, endIndex?: number): Laya.Node {
    return super.removeChildren(beginIndex, endIndex);
  }

  public dispose() {
    this.removeEvent();
  }
}
