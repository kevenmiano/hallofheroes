import FUI_Pin from "../../../fui/BaseCommon/FUI_Pin";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { DateFormatter } from "../../core/utils/DateFormatter";
import Utils from "../../core/utils/Utils";
import { NativeEvent } from "../constant/event/NotificationEvent";
import { PlayerEvent } from "../constant/event/PlayerEvent";
import GameManager from "../manager/GameManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";

/**
 * 游戏wifi 服务器时间
 */
export default class Pin extends FUI_Pin {
  onConstruct() {
    super.onConstruct();
    this.pinBox.visible = false;
    this.addEvent();
    this.setWifiState(3);
    this.onSysTimeUpdate();
  }

  private addEvent() {
    GameManager.Instance.addEventListener(
      PlayerEvent.SYSTIME_UPGRADE_MINUTE,
      this.onSysTimeUpdate,
      this,
    );
    NotificationManager.Instance.addEventListener(
      NativeEvent.WIFI_STATE_UPDATE,
      this.onWifiStateUpdate,
      this,
    );
  }

  private offEvent() {
    GameManager.Instance.removeEventListener(
      PlayerEvent.SYSTIME_UPGRADE_MINUTE,
      this.onSysTimeUpdate,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      NativeEvent.WIFI_STATE_UPDATE,
      this.onWifiStateUpdate,
      this,
    );
  }

  /**更新系统时间 */
  onSysTimeUpdate() {
    let sysTime = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    let timeStr = LangManager.Instance.GetTranslation("Pin.serverTime");
    Logger.yyz(
      "当前服务器时间: ",
      DateFormatter.format(sysTime, "YYYY-MM-DD hh:mm:ss"),
    );
    let hours: number = sysTime.getHours();
    let minutes: number = sysTime.getMinutes();
    let hourstr: string;
    let minutestr: string;
    hourstr =
      hours < 10
        ? "0" + sysTime.getHours().toString()
        : sysTime.getHours().toString();
    minutestr =
      minutes < 10
        ? "0" + sysTime.getMinutes().toString()
        : sysTime.getMinutes().toString();
    let dateStr: string = timeStr + hourstr + ":" + minutestr;
    this.setGameTime(dateStr);
  }

  /**更新wifi状态 */
  onWifiStateUpdate(value: number) {
    if (value >= 1) {
      //1
      this.setWifiState(3);
    } else if (value > 0.5 && value < 1) {
      //0.75,0.5,0.25
      this.setWifiState(2);
    } else if (value > 0 && value <= 0.5) {
      this.setWifiState(1);
    } else {
      //0
      this.setWifiState(0);
    }
  }

  /**
   * 设置wifi状态  0-3
   * @param value wifi状态
   */
  setWifiState(value: number) {
    // this.wifiActive.selectedIndex = Utils.isApp() ? 1 : 0;
    this.wifiActive.selectedIndex = 0;
    this.wifiState.selectedIndex = value;
  }

  /**
   * 设置游戏服务器时间
   * @param value 服务器时间
   */
  setGameTime(value: string = "") {
    this.gameTime.text = value;
    this.pinBox.visible = value != "";
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
