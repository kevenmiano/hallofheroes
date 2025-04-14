//@ts-expect-error: External dependencies
import FUI_ShortCutItem from "../../../../../fui/Battle/FUI_ShortCutItem";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { ChatChannel } from "../../../datas/ChatChannel";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ChatManager } from "../../../manager/ChatManager";

export default class ShortCutItem extends FUI_ShortCutItem {
  private chatStr: string = "";
  private type: number = 0;

  onConstruct() {
    super.onConstruct();
    this.btn_send.onClick(this, this.onSend);
  }

  setData(index: number, msg: string, type: number) {
    this.chatStr = msg;
    this.type = type;
    this.txt_name.text = index + 1 + "." + msg;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  /**
   * 发送聊天消息
   */
  onSend() {
    let livingId = this.battleModel.selfHero.livingId;
    let fight = ArmyManager.Instance.thane.fightingCapacity;
    ChatManager.Instance.sendBattleChat(
      ChatChannel.BATTLE_CHAT,
      this.chatStr,
      this.type,
      livingId,
      this.battleModel.battleId,
      fight,
    );
  }

  dispose(): void {
    this.btn_send.offClick(this, this.onSend);

    super.dispose();
  }
}
