import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { RoomEvent } from "../../../constant/RoomDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import PvpPreviewItem from "./item/PvpPreviewItem";

//@ts-expect-error: External dependencies
import HeroMsg = com.road.yishi.proto.battle.HeroMsg;
import { BattleModel } from "../../../battle/BattleModel";
import { BattleManager } from "../../../battle/BattleManager";
import { ArmyManager } from "../../../manager/ArmyManager";

export default class PvpPreviewWnd extends BaseWindow {
  public txtMy: fgui.GTextField;
  public txtOp: fgui.GTextField;
  public item0: PvpPreviewItem;
  public item1: PvpPreviewItem;
  public item2: PvpPreviewItem;
  public item3: PvpPreviewItem;
  public item4: PvpPreviewItem;
  public item5: PvpPreviewItem;
  rewardList: any;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initText();

    this.renderListItem();
  }

  initText() {
    // this.txtMy.text = LangManager.Instance.GetTranslation('RoomList.pvp.preview.txt1');
    // this.txtOp.text = LangManager.Instance.GetTranslation('RoomList.pvp.preview.txt2');
  }

  renderListItem() {
    if (this.frameData) {
      NotificationManager.Instance.dispatchEvent(
        RoomEvent.HIDE_PVP_ROOM_LEFT_TIME,
      );
      let selfIdx: number = 0;
      let list: HeroMsg[] = this.frameData;
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        if (element.userId == ArmyManager.Instance.thane.userId) {
          selfIdx = index;
          break;
        }
      }
      if (selfIdx < 3) {
        //我方固定显示在左边
        for (let i = 0; i < list.length; i++) {
          let item = this["item" + i];
          if (item) {
            item.setInfo(list[i], i);
          }
        }
      } else {
        this.item0.setInfo(list[3], 3);
        this.item1.setInfo(list[4], 4);
        this.item2.setInfo(list[5], 5);
        this.item3.setInfo(list[0], 0);
        this.item4.setInfo(list[1], 1);
        this.item5.setInfo(list[2], 2);
      }
    }
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
  }
}
