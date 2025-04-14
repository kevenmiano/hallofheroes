import FUI_ChatAirBubbleItemCell from "../../../../fui/ChatAirBubble/FUI_ChatAirBubbleItemCell";
import LangManager from "../../../core/lang/LangManager";
import { t_s_chatbubbleData } from "../../config/t_s_chatbubble";
import ChatAirBubbleManager from "../../manager/ChatAirBubbleManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import ChatAirBubbleData from "../chat/data/ChatAirBubbleData";

/**
 *聊天气泡单元格
 **/
export default class ChatAirBubbleItemCell extends FUI_ChatAirBubbleItemCell {
  private _itemData: t_s_chatbubbleData;

  protected onConstruct() {
    super.onConstruct();
    this.state.selectedIndex = 3;
    this.isEquiped.selectedIndex = 0;
    this.onEvent();
  }

  private onEvent() {
    this.btn_watch.onClick(this, this.onWatchBubbles.bind(this));
    this.btn_use.onClick(this, this.onUserBubble.bind(this));
    this.btn_buy.onClick(this, this.onBuyBubble.bind(this));
  }

  private offEvent() {
    this.btn_watch.offClick(this, this.onWatchBubbles.bind(this));
    this.btn_use.offClick(this, this.onUserBubble.bind(this));
    this.btn_buy.offClick(this, this.onBuyBubble.bind(this));
  }

  public set itemData(value: t_s_chatbubbleData) {
    this._itemData = value;
    this.clearData();
    if (value) {
      this.txt_bubble_name.text = value.ChatBubbleTitle;

      this.txt_Des.text = value.ChatBubbleDes;
      this.txt_getDes.text = value.ChatBubbleDes;
      this.txt_price.text = value.Para1.toString();
      this.onSetData(value.Id);
    }
  }

  private onSetData(id: number) {
    if (id != this._itemData.Id) return;
    let bubbleData = this.getBubbleData(id);
    if (bubbleData) {
      if (bubbleData.isUse == 1) {
        this.state.selectedIndex = 0;
        this.isEquiped.selectedIndex = 1;
      } else if (bubbleData.isUse == 2) {
        this.state.selectedIndex = 1;
        this.isEquiped.selectedIndex = 0;
      }
    } else {
      //未获得
      if (this._itemData.GetType == 1 || this._itemData.GetType == 3) {
        this.state.selectedIndex = 3;
      } else if (this._itemData.GetType == 2) {
        this.state.selectedIndex = 2;
      }
      this.isEquiped.selectedIndex = 0;
    }
  }

  private getBubbleData(id: number): ChatAirBubbleData {
    let data = ChatAirBubbleManager.Instance.getBubbleData(id);
    return data;
  }

  private onBuyBubble() {
    let costCount = PlayerManager.Instance.currentPlayerModel.playerInfo.point;
    if (costCount < this._itemData.Para1) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("Auction.ResultAlert11"),
      );
      return;
    }
    ChatAirBubbleManager.Instance.reqChangeBubble(this._itemData.Id, 2);
  }

  private onUserBubble() {
    ChatAirBubbleManager.Instance.reqChangeBubble(this._itemData.Id, 1);
  }

  private onWatchBubbles() {}

  private clearData() {
    this.offEvent();
    this.txt_Des.text = "";
    this.txt_getDes.text = "";
    this.txt_price.text = "";
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
