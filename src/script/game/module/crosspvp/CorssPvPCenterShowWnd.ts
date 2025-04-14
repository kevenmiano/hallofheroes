//@ts-expect-error: External dependencies
import Resolution from "../../../core/comps/Resolution";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import { PackageIn } from "../../../core/net/PackageIn";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { t_s_campaignData } from "../../config/t_s_campaign";
import { t_s_mapData } from "../../config/t_s_map";
import {
  NotificationEvent,
  CampaignEvent,
} from "../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import { RoomEvent } from "../../constant/RoomDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { RoomManager } from "../../manager/RoomManager";
import { RoomSocketOutManager } from "../../manager/RoomSocketOutManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { RoomInfo } from "../../mvc/model/room/RoomInfo";
import PropertyMsg = com.road.yishi.proto.simple.PropertyMsg;
/**副本中跨服多人本撮合和取消撮合按钮操作 */
export default class CorssPvPCenterShowWnd extends BaseWindow {
  public state: fgui.Controller; //状态控制器
  public startBtn: fgui.GButton; //开始撮合
  public cancelBtn: fgui.GButton; //取消撮合
  public leftTimeTxt: fgui.GRichTextField; //倒计时文本
  private _timeCount: number = 0; //撮合剩余的时间

  public OnInitWind() {
    super.OnInitWind();
    this.setLocation();
    this.state = this.getController("state");
    this.addEvent();
  }

  private setLocation() {
    this.width = Resolution.gameWidth; //显示宽度
    this.height = Resolution.gameHeight; //显示高度
    this.contentPane.setPivot(0, 0, true);
    this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
    this.y = (Resolution.gameHeight - this.contentPane.sourceHeight) / 2 + 180;
  }

  public OnShowWind() {
    super.OnShowWind();
    this.initView();
    Logger.xjy("CorssPvPCenterShowWnd 创建");
  }

  private initView() {
    ServerDataManager.listen(
      S2CProtocol.U_C_CAMPAIGN_MATCHSTATE,
      this,
      this.__updateCrossBtnHanlder,
    );
    this.initData();
  }

  private initData() {
    if (this.initShow()) {
      this.setCrossBtnState(1);
      this.visible = true;
    } else {
      this.visible = false;
    }
    Logger.xjy("CorssPvPCenterShowWnd visible= " + this.visible);
  }

  private __updateCrossBtnHanlder(pkg: PackageIn) {
    var msg: PropertyMsg = pkg.readBody(PropertyMsg) as PropertyMsg;
    this.setCrossBtnState(msg.param1);
  }

  private initShow(): boolean {
    let flag: boolean = false;
    if (
      this.roomInfo &&
      this.roomInfo.isCross &&
      this.roomInfo.playerCount < 4 &&
      this.roomInfo.houseOwnerId == this.thane.userId &&
      this.roomInfo.serverName == this.playerInfo.serviceName
    ) {
      var mapTemp: t_s_mapData = TempleteManager.Instance.getMapTemplateById(
        CampaignManager.Instance.mapId,
      );
      var campaignTemp: t_s_campaignData;
      if (mapTemp)
        campaignTemp =
          ConfigMgr.Instance.campaignTemplateDic[mapTemp.CampaignId];
      if (
        SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
        campaignTemp &&
        campaignTemp.Capacity == 4 &&
        (campaignTemp.DungeonId == 1 || campaignTemp.DungeonId == 2) &&
        campaignTemp.Types == 0
      ) {
        //多人本
        flag = true;
      }
    }
    return flag;
  }

  public setCrossBtnState(state: number) {
    if (state == 0) {
      this.state.selectedIndex = 0;
      this.startBtn.visible = true;
      this.startBtn.enabled = false;
      this._timeCount = 0;
    } else if (state == 1) {
      this.state.selectedIndex = 0;
      this.startBtn.visible = true;
      this.startBtn.enabled = true;
      this._timeCount = 0;
    } else if (state == 2) {
      //撮合中, 进行时间计算
      this.state.selectedIndex = 1;
      this._timeCount = 1;
      this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
        "roomHallwnd.cross.corssLeftTmeTxt",
        this._timeCount,
      );
      Laya.timer.loop(1000, this, this.updateTimeTxt);
    }
  }

  private updateTimeTxt() {
    this._timeCount++;
    this.leftTimeTxt.text = LangManager.Instance.GetTranslation(
      "roomHallwnd.cross.corssLeftTmeTxt",
      this._timeCount,
    );
  }

  private addEvent() {
    this.startBtn.onClick(this, this.startBtnHandler);
    this.cancelBtn.onClick(this, this.cancelBtnHandler);
    NotificationManager.Instance.addEventListener(
      NotificationEvent.CROSS_ADD_GOONBTN,
      this.initData,
      this,
    );
    NotificationManager.Instance.addEventListener(
      CampaignEvent.CAMPAIGN_OVER,
      this.initData,
      this,
    );
    this.roomInfo.addEventListener(
      RoomEvent.UPDATE_ROOM_BASE_DATA,
      this.initData,
      this,
    );
  }

  private offEvent() {
    this.startBtn.offClick(this, this.startBtnHandler);
    this.cancelBtn.offClick(this, this.cancelBtnHandler);
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.CROSS_ADD_GOONBTN,
      this.initData,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      CampaignEvent.CAMPAIGN_OVER,
      this.initData,
      this,
    );
    this.roomInfo.removeEventListener(
      RoomEvent.UPDATE_ROOM_BASE_DATA,
      this.initData,
      this,
    );
  }

  /**
   * 开始撮合
   */
  startBtnHandler() {
    RoomSocketOutManager.sendCrossGoOn(
      1,
      this.playerInfo.userId,
      this.playerInfo.serviceName,
    );
  }

  /**
   * 取消撮合
   */
  cancelBtnHandler() {
    RoomSocketOutManager.sendCrossGoOn(
      0,
      this.playerInfo.userId,
      this.playerInfo.serviceName,
    );
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  public OnHideWind() {
    this.offEvent();
    Laya.timer.clear(this, this.updateTimeTxt);
    ServerDataManager.cancel(
      S2CProtocol.U_C_CAMPAIGN_MATCHSTATE,
      this,
      this.__updateCrossBtnHanlder,
    );
    super.OnHideWind();
    Logger.xjy("CorssPvPCenterShowWnd 销毁");
  }

  private get roomInfo(): RoomInfo {
    return RoomManager.Instance.roomInfo;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
