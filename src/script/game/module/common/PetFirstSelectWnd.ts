/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 20:16:46
 * @LastEditTime: 2023-03-03 15:06:11
 * @LastEditors: jeremy.xu
 * @Description:
 */

import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { TaskManage } from "../../manager/TaskManage";
import { TaskSocketManager } from "../../manager/TaskSocketManager";
import { PetData } from "../pet/data/PetData";
import { TeamFormationPetFigureItem } from "../petChallenge/item/TeamFormationPetFigureItem";

export default class PetFirstSelectWnd extends BaseWindow {
  // private imgSelect: fgui.GImage;
  private imgSelect: fgui.GMovieClip;
  private _selIndex = 0;

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
    this.refresh();
    this.refreshSelect();

    for (let i = 0; i < 4; i++) {
      let petData: PetData = new PetData();
      petData.templateId = PetData.FIRST_SELECT_PETLIST[i];
      petData.name = petData.template.TemplateNameLang;
      petData.quality = 1;
      // petData.temQuality = 1;
      // petData.grade = 1;
      // petData.curExp = 0;
      let item = this["item" + i] as TeamFormationPetFigureItem;
      item.info = petData;
      item.imgBg.visible = false;
      item.txtCapacity.visible = false;
      item.onClick(this, this.onClickItem, [i]);
    }
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }

  private onClickItem(idx: number) {
    this._selIndex = idx;
    this.refreshSelect();
  }

  private refresh() {}

  private refreshSelect() {
    let item = this["item" + this._selIndex] as TeamFormationPetFigureItem;
    this.imgSelect.setXY(item.x, item.y);
  }

  private btnConfirmClick() {
    TaskSocketManager.sendGetTaskReward(
      TaskManage.PET_SYSTEM_OPEN_TASK02,
      PetData.FIRST_SELECT_PETLIST[this._selIndex],
      false,
    );
    this.hide();
  }
}
