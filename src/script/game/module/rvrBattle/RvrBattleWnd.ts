//@ts-expect-error: External dependencies
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton from "../../../core/ui/UIButton";
import UIManager from "../../../core/ui/UIManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { t_s_campaignData } from "../../config/t_s_campaign";
import ItemID from "../../constant/ItemID";
import { RankIndex } from "../../constant/RankDefine";
import { EmWindow } from "../../constant/UIDefine";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { SingWarSocketSendManager } from "../../manager/SingWarSocketSendManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ComponentSetting from "../../utils/ComponentSetting";
import { TimerTicker } from "../../utils/TimerTicker";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
/**
 * 战场入口
 */
export default class RvrBattleWnd extends BaseWindow {
  protected setSceneVisibleOpen: boolean = true;
  public firstOpenTimeTxt: fgui.GTextField;
  public secondOpenTimeTxt: fgui.GTextField;
  public exitTimeTxt: fgui.GTextField;
  public descTxt: fgui.GTextField;
  public leftCountTxt: fgui.GTextField;
  public cExitTime: fgui.Controller;
  public startBtn: fgui.GButton;
  public rankBtn: fgui.GButton;
  public backBtn: fgui.GButton;
  public helpBtn: fgui.GButton;
  public quickUseExpBtn: UIButton;
  private _dataList: Array<t_s_campaignData> = [];
  private _currentData: t_s_campaignData;
  private _exitTimer: TimerTicker;
  private _bInitExitTime: boolean = false;

  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.rankBtn.visible = ComponentSetting.RVR_CROSS;
    this.cExitTime = this.getController("cExitTime");
    this.startBtn.title = LangManager.Instance.GetTranslation("monopoly.start");
    this.initEvent();
    this.initData();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  private initData() {
    PlayerManager.Instance.synchronizedSystime();
    let total: number = 2;
    let curCount: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.warFieldCount;
    let count: number = Math.max(curCount, 0);
    this.leftCountTxt.text = count + " / " + total;
    this.startBtn.enabled = false;
    let pvpWarFightDic = ConfigMgr.Instance.pvpWarFightDic;
    let nearId: number = this.findCurOpenCampaignId();
    Logger.xjy("[RvrBattleWnd]nearId", nearId);
    if (nearId == 0) {
      nearId = this.findNearlyCampaignId();
    } else {
      // this.showExitTime(nearId);
    }

    if (pvpWarFightDic[nearId]) {
      this._dataList.push(pvpWarFightDic[nearId]);
      this._currentData = pvpWarFightDic[nearId];
      this.firstOpenTimeTxt.text =
        pvpWarFightDic[nearId].OpenTime + "-" + pvpWarFightDic[nearId].StopTime;
    }
    if (pvpWarFightDic[nearId + 1]) {
      this._dataList.push(pvpWarFightDic[nearId + 1]);
      this.secondOpenTimeTxt.text =
        pvpWarFightDic[nearId + 1].OpenTime +
        "-" +
        pvpWarFightDic[nearId + 1].StopTime;
    }
    for (let i = 0; i < this._dataList.length; i++) {
      let item: t_s_campaignData = this._dataList[i];
      if (item.state == 0) {
        this.startBtn.enabled = true;
        break;
      }
    }
  }

  private initEvent() {
    this.backBtn.onClick(this, this.backHandler);
    this.helpBtn.onClick(this, this.helpHandler);
    this.rankBtn.onClick(this, this.rankHandler);
    this.startBtn.onClick(this, this.startHandler);
    if (this.playerModel)
      this.playerModel.addEventListener(
        NotificationEvent.UPDATE_SYSTEM_TIME,
        this.updateSystemTime,
        this,
      );
  }

  private removeEvent() {
    this.backBtn.offClick(this, this.backHandler);
    this.helpBtn.offClick(this, this.helpHandler);
    this.rankBtn.offClick(this, this.rankHandler);
    this.startBtn.offClick(this, this.startHandler);
  }

  backHandler() {
    this.hide();
  }

  private updateSystemTime() {
    if (!this._bInitExitTime) {
      this._bInitExitTime = true;
      if (this.playerModel)
        this.playerModel.addEventListener(
          NotificationEvent.UPDATE_SYSTEM_TIME,
          this.updateSystemTime,
          this,
        );

      let nearId: number = this.findCurOpenCampaignId();
      Logger.xjy("[RvrBattleWnd]updateSystemTimenearId", nearId);
      if (nearId != 0) {
        this.showExitTime(nearId);
      }
    }
  }

  helpHandler() {
    let title = LangManager.Instance.GetTranslation(
      "worldboss.WorldBossFrame.title02",
    );
    let content = LangManager.Instance.GetTranslation(
      "worldboss.view.BaseHelpFrame.BattleHelpContent",
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  rankHandler() {
    FrameCtrlManager.Instance.open(EmWindow.Rank, {
      rankIndex: RankIndex.RankItemR5_001,
    });
  }

  startHandler() {
    if (this._currentData) {
      let curCount: number =
        PlayerManager.Instance.currentPlayerModel.playerInfo.warFieldCount;
      if (curCount <= 0) {
        SingWarSocketSendManager.sendRequestPvpRemainNumber(
          this._currentData.CampaignId,
        );
        return;
      }
      SingWarSocketSendManager.enterWarfield(this._currentData.CampaignId);
    }
  }

  quickUseExpBtnClick() {
    let pos = -1;
    let bagDic = GoodsManager.Instance.getGeneralBagList();
    for (const key in bagDic) {
      if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
        let info: GoodsInfo = bagDic[key];
        if (info.templateId == ItemID.DOUBLE_HORNOR_PROP) {
          pos = info.pos;
          break;
        }
      }
    }
    if (pos == -1) {
      let content: string = LangManager.Instance.GetTranslation(
        "bag.datas.doubleHornorNotEnoughTip",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        null,
        content,
        null,
        null,
        (b) => {
          if (!b) return;
          let info: ShopGoodsInfo =
            TempleteManager.Instance.getShopTempInfoByItemId(
              ItemID.DOUBLE_HORNOR_PROP,
            );
          if (!info) {
            let str: string = LangManager.Instance.GetTranslation(
              "bag.datas.notHaveItem",
            );
            MessageTipManager.Instance.show(str);
          } else {
            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, {
              info: info,
              count: 1,
            });
          }
        },
      );
    } else {
      let content: string = LangManager.Instance.GetTranslation(
        "bag.datas.doubleHornorUseTip",
      );
      let num: number = GoodsManager.Instance.getGoodsNumByTempId(
        ItemID.DOUBLE_HORNOR_PROP,
      );
      let goodsCount: string =
        LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
      UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
        content: content,
        goodsId: ItemID.DOUBLE_HORNOR_PROP,
        goodsCount: goodsCount,
        callback: () => {
          SocketSendManager.Instance.sendUseItem(pos);
        },
      });
    }
  }

  private findCurOpenCampaignId(): number {
    let pvpWarFightDic = ConfigMgr.Instance.pvpWarFightDic;
    let startId: number = 0;
    for (const key in pvpWarFightDic) {
      if (Object.prototype.hasOwnProperty.call(pvpWarFightDic, key)) {
        let temp: t_s_campaignData = pvpWarFightDic[key] as t_s_campaignData;
        if (temp.Types != 5) continue;
        if (temp.state == 0) startId = parseInt(key);
      }
    }
    return startId;
  }

  private findNearlyCampaignId(): number {
    let startId: number = 4001;
    let endId: number = 4010;
    let now: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    let dict = ConfigMgr.Instance.pvpWarFightDic;
    for (; startId < endId; startId++) {
      //前提 id小的开放早
      let temp: t_s_campaignData = dict[startId];
      if (temp) {
        let arr: Array<any> = temp.StopTime.split(":");
        if (
          now.getHours() < parseInt(arr[0]) ||
          (now.getHours() == parseInt(arr[0]) &&
            now.getMinutes() <= parseInt(arr[1]))
        ) {
          return startId;
        }
      }
    }
    return 4009;
  }

  private showExitTime(nearId: number) {
    let temp: t_s_campaignData = ConfigMgr.Instance.pvpWarFightDic[nearId];
    if (temp) {
      let arr: Array<any> = temp.StopTime.split(":");
      let stopHour = parseInt(arr[0]);
      let stopMin = parseInt(arr[1]);
      let nowDate: Date = new Date(
        PlayerManager.Instance.currentPlayerModel.sysCurtime,
      );
      let nowHour: number = nowDate.getHours();
      let nowMin: number = nowDate.getMinutes();
      let nowSec: number = nowDate.getSeconds();

      let deltaMin = (stopHour - nowHour) * 60 + stopMin - nowMin;
      let tmpSec = 0;
      if (nowSec > 0) {
        deltaMin -= 1;
        tmpSec = 60 - nowSec;
      }
      let deltaSec = deltaMin * 60 + tmpSec;
      Logger.xjy(
        "[RvrBattleWnd]showExitTime nowHour:" +
          nowHour +
          ",nowMin:" +
          nowMin +
          ",nowSec:" +
          nowSec +
          ",stopHour:" +
          stopHour +
          ",stopMin:" +
          stopMin,
      );
      if (deltaSec > 0) {
        this.cExitTime.selectedIndex = 1;
        this._exitTimer = new TimerTicker(
          1000,
          deltaSec,
          () => {
            let sec =
              this._exitTimer.repeatCount - this._exitTimer.currentCount;
            this.exitTimeTxt.text = DateFormatter.getConsortiaCountDate(sec);
          },
          () => {
            this.exitTimeTxt.text = "";
            this.cExitTime.selectedIndex = 0;
          },
        );
        let sec = this._exitTimer.repeatCount - this._exitTimer.currentCount;
        this.exitTimeTxt.text = DateFormatter.getConsortiaCountDate(sec);
        this._exitTimer.start();
      } else {
        this.cExitTime.selectedIndex = 0;
      }
    }
  }

  public OnHideWind() {
    this._exitTimer && this._exitTimer.stop();
    this.removeEvent();
    super.OnHideWind();
  }

  public get playerModel() {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
