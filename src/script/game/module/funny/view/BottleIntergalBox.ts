import FUI_BottleIntergalBox from "../../../../../fui/Funny/FUI_BottleIntergalBox";
import { BottleIntergalBoxView } from "./BottleIntergalBoxView";
import { BottleUserInfo } from "../model/BottleUserInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { BottleModel } from "../model/BottleModel";
import { BottleManager } from "../../../manager/BottleManager";
import { FunnyContent } from "./FunnyContent";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/4/7 12:36
 * @ver 1.0
 */
export class BottleIntergalBox
  extends FUI_BottleIntergalBox
  implements FunnyContent
{
  public box: BottleIntergalBoxView;
  private _index: number = -1; //0--4

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  onShow() {}

  onUpdate() {}

  onHide() {}

  private addEvent() {
    this.g_click.onClick(this, this.onReceiveItemClick);
  }

  private onReceiveItemClick() {
    let packData = this.bottleModel.floorRewardArr[this._index];
    if (packData) {
      BottleManager.Instance.sendOpenInfo(6, packData.param);
    }
  }

  private removeEvent() {
    this.g_click.offClick(this, this.onReceiveItemClick);
  }

  public set boxIndex(index: number) {
    this._index = index;
    this.box.boxIndex = index;
  }

  public refreshStatus(): void {
    this.box.refreshStatus();
    let userInfo: BottleUserInfo = this.bottleModel.userArray[this._index];
    if (
      userInfo &&
      userInfo.userId > 0 &&
      userInfo.state == 0 &&
      userInfo.userName == this.playerInfo.nickName
    ) {
      //可领取
      this.state.selectedIndex = 0;
    } else {
      this.state.selectedIndex = 1;
    }
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get bottleModel(): BottleModel {
    return BottleManager.Instance.model;
  }

  dispose() {
    this.removeEvent();

    super.dispose();
  }
}
