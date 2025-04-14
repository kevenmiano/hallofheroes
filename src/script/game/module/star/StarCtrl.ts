/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-21 10:43:29
 * @LastEditTime: 2024-01-02 17:55:53
 * @LastEditors: jeremy.xu
 * @Description:
 */
import { DictionaryEvent } from "../../constant/DictionaryEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { StarEvent } from "../../constant/StarDefine";
import { NotificationManager } from "../../manager/NotificationManager";
import { StarManager } from "../../manager/StarManager";
import FrameCtrlBase from "../../mvc/FrameCtrlBase";
import StarInfo from "../mail/StarInfo";
import { DataCommonManager } from "../../manager/DataCommonManager";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { PackageIn } from "../../../core/net/PackageIn";

//@ts-expect-error: External dependencies
import StarShopMsg = com.road.yishi.proto.star.StarShopMsg;
import { ChatEvent } from "../../constant/event/NotificationEvent";
import { ChatChannel } from "../../datas/ChatChannel";
import { MessageTipManager } from "../../manager/MessageTipManager";
import ChatData from "../chat/data/ChatData";
import LangManager from "../../../core/lang/LangManager";
import { t_s_startemplateData } from "../../config/t_s_startemplate";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";

export default class StarCtrl extends FrameCtrlBase {
  show() {
    super.show();
  }

  hide() {
    super.hide();
  }

  dispose() {
    super.dispose();
    StarManager.Instance.starModel.dispose();
  }

  protected addEventListener() {
    super.addEventListener();
    StarManager.Instance.tempStarList.addEventListener(
      DictionaryEvent.ADD,
      this.__addDisplayStar,
      this,
    );
    StarManager.Instance.tempStarList.addEventListener(
      DictionaryEvent.DELETE,
      this.__delDisplayStar,
      this,
    );
    NotificationManager.Instance.addEventListener(
      StarEvent.COMPOSE_STAR,
      this.__starComposeHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      StarEvent.RANDOMPOS_CHANGE,
      this.__randomPosHandler,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_STARSHOP_BUY,
      this,
      this.__exchangeStarHandler,
    );
    // DataCommonManager.playerInfo.addEventListener(PlayerEvent.STAR_FREECOUNT_CHANGE, this.__starFreeCountChangeHandler, this);
    DataCommonManager.playerInfo.addEventListener(
      PlayerEvent.STAR_POINT_UPDATE,
      this.__starPointUpdateHandler,
      this,
    );
  }

  protected delEventListener() {
    super.delEventListener();
    StarManager.Instance.tempStarList.removeEventListener(
      DictionaryEvent.ADD,
      this.__addDisplayStar,
      this,
    );
    StarManager.Instance.tempStarList.removeEventListener(
      DictionaryEvent.DELETE,
      this.__delDisplayStar,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      StarEvent.COMPOSE_STAR,
      this.__starComposeHandler,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      StarEvent.RANDOMPOS_CHANGE,
      this.__randomPosHandler,
      this,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_STARSHOP_BUY,
      this,
      this.__exchangeStarHandler,
    );
    // DataCommonManager.playerInfo.removeEventListener(PlayerEvent.STAR_FREECOUNT_CHANGE, this.__starFreeCountChangeHandler, this);
    DataCommonManager.playerInfo.removeEventListener(
      PlayerEvent.STAR_POINT_UPDATE,
      this.__starPointUpdateHandler,
      this,
    );
  }

  private __addDisplayStar(data: any) {
    this.view.__addDisplayStar(data);
  }

  private __delDisplayStar(data: any) {
    this.view.__delDisplayStar(data);
  }

  private __starComposeHandler(data: StarInfo) {
    this.view.__starComposeHandler(data);
  }

  private __randomPosHandler() {
    this.view.__randomPosHandler();
  }
  private __uddatePickFinish() {
    this.view.__uddatePickFinish();
  }

  // private __starFreeCountChangeHandler() {
  //     this.view.__starFreeCountChangeHandler()

  // }
  private __starPointUpdateHandler() {
    this.view.__starPointUpdateHandler();
  }

  private __exchangeStarHandler(pkg: PackageIn) {
    let msg = pkg.readBody(StarShopMsg) as StarShopMsg;
    if (msg.result == 1) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.StarShopFrame.command01"),
      );
      var temp: t_s_startemplateData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_startemplate,
        msg.goodId,
      );
      if (temp) {
        var chatData: ChatData = new ChatData();
        chatData.channel = ChatChannel.INFO;
        chatData.msg = LangManager.Instance.GetTranslation(
          "star.StarShopFrame.chatData",
          temp.TemplateNameLang,
        );
        chatData.commit();
        NotificationManager.Instance.sendNotification(
          ChatEvent.ADD_CHAT,
          chatData,
        );
      }
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("star.StarShopFrame.command02"),
      );
    }
  }
}
