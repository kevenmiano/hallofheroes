//@ts-expect-error: External dependencies
import FUI_HoleBalance from "../../../../../fui/Skill/FUI_HoleBalance";
import { CommonConstant } from "../../../constant/CommonConstant";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";

export class HoleBalance extends FUI_HoleBalance {
  public tipItem1: BaseTipItem;

  public tipItem2: BaseTipItem;
  onConstruct() {
    super.onConstruct();
  }

  public initView() {
    this.addEvent();
    this.__bagItemUpdate();
    this._runeNumUpdate();
    this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_FUSHI_SUIPIAN);
    this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_FUKONG);
  }

  private addEvent() {
    PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this._runeNumUpdate,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemUpdate,
      this,
    );
  }

  private removeEvent() {
    GoodsManager.Instance.removeEventListener(
      BagEvent.UPDATE_BAG,
      this.__bagItemUpdate,
      this,
    );
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_BAG,
      this.__bagItemUpdate,
      this,
    );
    PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this._runeNumUpdate,
      this,
    );
  }

  private __bagItemUpdate() {
    let tempMax = GoodsManager.Instance.getGoodsNumByTempId(
      CommonConstant.RUNE_HOLE_CARVE,
    );
    this.txt_rune.text = tempMax.toString();
  }

  private _runeNumUpdate() {
    let num = PlayerManager.Instance.currentPlayerModel.playerInfo.runeNum;
    this.giftTxt.text = num.toString();
  }

  onHide() {
    this.removeEvent();
  }
  dispose(): void {
    super.dispose();
  }
}
