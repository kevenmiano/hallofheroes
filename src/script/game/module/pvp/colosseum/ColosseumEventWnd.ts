//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:16:46
 * @LastEditTime: 2021-09-15 14:14:34
 * @LastEditors: jeremy.xu
 * @Description: 历史记录
 */

import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ColosseumData from "./ColosseumData";

export default class ColosseumEventWnd extends BaseWindow {
  public itemList: fgui.GList;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    this.itemList.numItems = this.model.eventsList.length;
    this.refresh();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  private refresh() {}

  private renderListItem(index: number, item: fgui.GComponent) {
    let data = this.model.eventsList[index];
    let str = "";
    //多语言 不能使用拼接
    if (data.isAttack) {
      str = LangManager.Instance.GetTranslation(
        data.forward > 0
          ? "colosseum.challenge.attacked.txt1"
          : "colosseum.challenge.attacked.txt2",
        data.tarNickName,
        Math.abs(data.forward),
      );
    } else {
      str = LangManager.Instance.GetTranslation(
        data.forward > 0
          ? "colosseum.challenge.beAttacked.txt1"
          : "colosseum.challenge.beAttacked.txt2",
        data.tarNickName,
        Math.abs(data.forward),
      );
    }
    item.text = str;
  }

  public get model() {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Colosseum)
      .data as ColosseumData;
  }
}
