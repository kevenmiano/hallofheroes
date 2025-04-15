/* eslint-disable @typescript-eslint/no-this-alias */
import FUI_HomeBigBugble from "../../../../fui/Home/FUI_HomeBigBugble";
import { ChatManager } from "../../manager/ChatManager";
import ChatData from "../chat/data/ChatData";
import { ChatChannel } from "../../datas/ChatChannel";
import ChatItemMenu from "../chat/ChatItemMenu";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../consortia/data/ConsortiaDutyInfo";
import { ChatEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";

/**
 * @author:pzlricky
 * @data: 2021-05-10 15:09
 * @description 主界面喇叭
 */
export default class ChatBugleView extends FUI_HomeBigBugble {
  private _preTime: number = 0;

  onConstruct() {
    super.onConstruct();
    this.visible = false;
    this.initEvent();
    this.initData();
  }

  private initData() {
    if (ChatManager.Instance.model.currentBigBugleData) {
      var chatData1: ChatData = ChatManager.Instance.model.currentBigBugleData;
      let elementText: string = "";
      let elements = chatData1.getAllElements();
      for (let index = 0; index < elements.length; index++) {
        let element = elements[index];
        elementText += element.text;
      }
      this.content.text = elementText;
      if (this._preTime == 0) {
        this._preTime = 1;
      }
    }
  }

  private initEvent() {
    Laya.timer.loop(1000, this, this.__timeUpdateHandler);
    this.clickRect.onClick(this, this.onClickName);
  }

  private removeEvent() {
    Laya.timer.clear(this, this.__timeUpdateHandler);
    Laya.timer.clear(this, this.autoHide);
    this.clickRect.offClick(this, this.onClickName);
  }

  onClickName() {
    let chatData: ChatData = ChatManager.Instance.model.currentBigBugleData;
    if (!chatData) return;
    if (
      chatData.uid ==
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    ) {
      return;
    }
    let showConsortia: boolean;
    if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0) {
      showConsortia = (
        FrameCtrlManager.Instance.getCtrl(
          EmWindow.Consortia,
        ) as ConsortiaControler
      ).getRightsByIndex(ConsortiaDutyInfo.PASSINVITE);
      showConsortia = showConsortia && chatData.consortiaId <= 0;
    }
    this.showUseMenu(
      Laya.stage.mouseX,
      Laya.stage.mouseY,
      chatData.senderName,
      chatData.uid,
      showConsortia,
    );
  }

  private showUseMenu(
    menuX: number,
    menuY: number,
    name: string,
    id: number,
    showConsortia: boolean,
    servername: string = null,
  ) {
    let point: Laya.Point = new Laya.Point(menuX, menuY);
    ChatItemMenu.Show(
      name,
      id,
      showConsortia,
      servername,
      false,
      false,
      true,
      point,
    );
  }

  private get bigBugleBuffer(): Array<ChatData> {
    return (
      ChatManager.Instance.model && ChatManager.Instance.model.bigBugleList
    );
  }

  private __timeUpdateHandler(evt) {
    if (this.bigBugleBuffer && this.bigBugleBuffer.length > 0) {
      if (Laya.timer.delta == 0) {
        this.showBugle();
      } else if (Laya.timer.delta >= 5) {
        this.showBugle();
      }
    }
  }

  private showBugle(): void {
    var chatData: ChatData = this.bigBugleBuffer.shift();
    if (chatData.bigBugleType != 0 && chatData.bigBugleType != 4) return; //不显示特殊大喇叭
    let elementText: string = "";
    let elements = chatData.getAllElements();
    for (let index = 0; index < elements.length; index++) {
      let element = elements[index];
      elementText += element.text;
    }
    let txtColor = ChatChannel.getChatChannelColor(chatData.channel);
    this.content.color = txtColor;
    let nameStr = "[color=#F6ED00]" + chatData.senderName + "[/color]";
    //在faryui编辑器里转义用\就可以, 在laya环境中需要\\才能准确的转义[
    var text: string = "\\[" + nameStr + "] " + elementText;
    this.content.valign = "middle";
    this.content.text = text;
    ChatManager.Instance.model.currentBigBugleData = chatData;

    this.visible = true;

    let defaultX = this.x;
    this.x = -this.width;
    Laya.Tween.to(this, { x: defaultX }, 250, undefined);

    this.update();
    Laya.timer.clear(this, this.autoHide);
    Laya.timer.once(120000, this, this.autoHide); //一条喇叭最长显示2分钟
  }

  autoHide() {
    let self = this;
    Laya.Tween.to(
      this,
      { alpha: 0 },
      150,
      undefined,
      Laya.Handler.create(this, () => {
        self.visible = false;
        self.alpha = 1;
        self.update();
      }),
    );
  }

  private update() {
    ChatManager.Instance.model.showChatBugleViewFlag = this.visible;
    NotificationManager.Instance.dispatchEvent(
      ChatEvent.UPDATE_CHAT_BUGLE_VIEW_VISIBLE,
    );
  }

  public dispose() {
    ChatManager.Instance.model.showChatBugleViewFlag = false;
    this.removeEvent();
  }

  public stop() {
    Laya.timer.pause();
  }

  public start() {
    Laya.timer.resume();
  }

  public activate() {
    Laya.timer.resume();
    this.initData();
  }

  public inactive() {
    Laya.timer.pause();
  }
}
