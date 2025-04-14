//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2024-03-22 14:12:30
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-06-21 17:23:55
 * @DemandLink:
 * @Description:
 */
import FUI_MasterySkillPanel from "../../../../../fui/Skill/FUI_MasterySkillPanel";
import {
  ExtraJobEvent,
  SkillEvent,
} from "../../../constant/event/NotificationEvent";
import DragManager from "../../../manager/DragManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { ExtraJobItemInfo } from "../../bag/model/ExtraJobItemInfo";
import ExtraJobModel from "../../bag/model/ExtraJobModel";
import MasterySkillItem from "../item/MasterySkillItem";
import SkillItemCom from "../item/SkillItemCom";

export default class MasterySkillPanel extends FUI_MasterySkillPanel {
  private activeListData: ExtraJobItemInfo[];

  protected onConstruct(): void {
    super.onConstruct();
    this.masteryList.itemRenderer = Laya.Handler.create(
      this,
      this.onItemRender,
      null,
      false,
    );
  }

  public init() {
    this.initData();
  }

  private initData() {
    this.refreshData();
    NotificationManager.Instance.addEventListener(
      ExtraJobEvent.LEVEL_UP,
      this.refreshData,
      this,
    );
    DragManager.Instance.addEventListener(
      SkillEvent.DRAGING,
      this.onDraging,
      this,
    );
  }

  private onDraging(isDraging: boolean) {
    this.masteryList.scrollPane.touchEffect = !isDraging;
  }

  private onItemRender(index: number, item: MasterySkillItem) {
    item.info = this.activeListData[index];
  }

  public refreshData() {
    this.activeListData = ExtraJobModel.instance.activeList;
    if (!this.activeListData) return;
    this.masteryList.numItems = this.activeListData.length;
  }

  public updateEditMode(isSetting) {
    let array = this.activeListData;
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      this.masteryList;
    }

    for (let i = 0; i < this.masteryList.numChildren; i++) {
      const masteryItem: MasterySkillItem = this.masteryList.getChildAt(
        i,
      ) as MasterySkillItem;
      if (masteryItem) {
        for (let j = 0; j < 6; j++) {
          let skillItemCom = masteryItem.getChild("skill" + j) as SkillItemCom;
          if (skillItemCom) {
            skillItemCom.setDragState(isSetting);
            skillItemCom.switchEditMode(isSetting);
          }
        }
      }
    }
  }

  public dispose() {
    DragManager.Instance.removeEventListener(
      SkillEvent.DRAGING,
      this.onDraging,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ExtraJobEvent.LEVEL_UP,
      this.refreshData,
      this,
    );
    super.dispose();
  }
}
