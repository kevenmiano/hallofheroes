import FUI_ActivityScheduleItem from "../../../../../../fui/Welfare/FUI_ActivityScheduleItem";
import LangManager from "../../../../../core/lang/LangManager";
import SDKManager from "../../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../../core/thirdlib/RptEvent";
import UIManager from "../../../../../core/ui/UIManager";
import StringHelper from "../../../../../core/utils/StringHelper";
import { t_s_activityscheduleData } from "../../../../config/t_s_activityschedule";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import { EmWindow } from "../../../../constant/UIDefine";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { DataCommonManager } from "../../../../manager/DataCommonManager";
import { HookManager } from "../../../../manager/HookManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { MopupManager } from "../../../../manager/MopupManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { SpaceSocketOutManager } from "../../../../map/space/SpaceSocketOutManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import PetBossModel from "../../../petguard/PetBossModel";
import WelfareCtrl from "../../WelfareCtrl";
import WelfareData from "../../WelfareData";

export default class ActivityScheduleItem extends FUI_ActivityScheduleItem {
  private _info: t_s_activityscheduleData;
  protected onConstruct() {
    super.onConstruct();
    this.activityStatusTxt.text = LangManager.Instance.GetTranslation(
      "activity.ActivityManager.command03",
    );
    this.addEvent();
  }

  private addEvent() {
    this.gotoBtn.onClick(this, this.gotoBtnHandler);
    this.lookBtn.onClick(this, this.gotoBtnHandler);
  }

  private removeEvent() {
    this.gotoBtn.offClick(this, this.gotoBtnHandler);
    this.lookBtn.offClick(this, this.gotoBtnHandler);
  }

  public get info() {
    return this._info;
  }

  public set info(value: t_s_activityscheduleData) {
    this._info = value;
    this.refreshView();
  }

  private refreshView() {
    this.nameTxt.text = this._info.TitleLang;
    this.timeDescTxt.text = this._info.DescriptionLang;
    this.status.selectedIndex = this.getStatus(this._info);
  }

  private getStatus(info: t_s_activityscheduleData): number {
    let status: number = 0;
    switch (info.Type) {
      case 1: //世界BOSS
        if (this.playerInfo.worldbossState) {
          status = 1;
        }
        break;
      case 2: //修行神殿
        status = this.getGetHookStatus();
        break;
      case 3: //紫晶矿场
        status = this.isMineralDouble ? 1 : 0;
        break;
      case 4: //战场
        status = DataCommonManager.playerInfo.isOpenPvpWar ? 1 : 0;
        break;
      case 5: //多人竞技
        status = this.getPvpStatus();
        break;
      case 6: //保卫英灵岛
        status = this.petBossModel.isOpen ? 1 : 0;
        break;
      case 7: //保卫英灵岛
        status = 2;
        break;
    }
    return status;
  }

  private getGetHookStatus(): number {
    let value: number = 0;
    let systemTime = PlayerManager.Instance.currentPlayerModel.sysCurtime; //当前系统时间
    for (
      let index = 0;
      index < HookManager.Instance.hookInfolist.length;
      index++
    ) {
      let item = HookManager.Instance.hookInfolist[index];
      let time = item.time;
      let startHour = time.split("-")[0].split(":")[0];
      let startMinutes = time.split("-")[0].split(":")[1];
      let endHour = time.split("-")[1].split(":")[0];
      let endMinutes = time.split("-")[1].split(":")[1];
      let startDate = new Date();
      startDate.setHours(Number(startHour));
      startDate.setMinutes(Number(startMinutes));
      let endDate = new Date();
      endDate.setHours(Number(endHour));
      endDate.setMinutes(Number(endMinutes));
      if (
        (systemTime.getHours() == startDate.getHours() &&
          systemTime.getMinutes() == startDate.getMinutes()) ||
        (systemTime.getHours() == endDate.getHours() &&
          systemTime.getMinutes() == endDate.getMinutes())
      ) {
        value = 1;
        break;
      }
    }
    return value;
  }

  private getPvpStatus(): number {
    let value: number = 0;
    let curDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    let curTimeMin = curDate.getHours() * 60 + curDate.getMinutes();
    for (let index = 0; index < this.ctrlData.pvpOpenTimeArr.length; index++) {
      const element = this.ctrlData.pvpOpenTimeArr[index];
      if (
        curTimeMin >= element.startTimeMin - 15 &&
        curTimeMin <= element.endTimeMin
      ) {
        value = 1;
        break;
      }
    }
    return value;
  }

  //前往
  private gotoBtnHandler() {
    switch (this._info.Type) {
      case 1: //世界BOSS
        if (MopupManager.Instance.model.isMopup) {
          var str: string = LangManager.Instance.GetTranslation(
            "mopup.MopupManager.mopupTipData01",
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        if (ArmyManager.Instance.army.onVehicle) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips",
            ),
          );
          return;
        }
        this.exitWelfareWnd();
        FrameCtrlManager.Instance.open(EmWindow.WorldBossWnd);
        break;
      case 2: //修行神殿
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess ==
          GlobalConfig.NEWBIE_40000
        ) {
          SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_TEMPLE);
        }
        this.exitWelfareWnd();
        FrameCtrlManager.Instance.open(EmWindow.Hook);
        break;
      case 3: //紫晶矿场
        if (StringHelper.isNullOrEmpty(WorldBossHelper.getCampaignTips())) {
          this.exitWelfareWnd();
          SpaceSocketOutManager.Instance.nodeMineral();
        } else {
          MessageTipManager.Instance.show(WorldBossHelper.getCampaignTips());
        }
        break;
      case 4: //战场
        if (MopupManager.Instance.model.isMopup) {
          var str: string = LangManager.Instance.GetTranslation(
            "mopup.MopupManager.mopupTipData01",
          );
          MessageTipManager.Instance.show(str);
          return;
        }
        if (ArmyManager.Instance.army.onVehicle) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "OuterCityCastleTips.gotoBtnTips",
            ),
          );
          return;
        }
        this.exitWelfareWnd();
        FrameCtrlManager.Instance.open(EmWindow.RvrBattleWnd);
        break;
      case 5: //多人竞技
        this.exitWelfareWnd();
        FrameCtrlManager.Instance.open(EmWindow.PvpGate);
        break;
      case 6: //保卫英灵岛
        this.exitWelfareWnd();
        UIManager.Instance.ShowWind(EmWindow.PetGuardWnd);
        break;
      case 7: //公会
        if (
          PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0
        ) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "friends.im.IMFrame.consortia.TipTxt",
            ),
          );
          return;
        } else {
          this.exitWelfareWnd();
          FrameCtrlManager.Instance.open(EmWindow.Consortia, 1);
        }
        break;
    }
  }

  private exitWelfareWnd() {
    FrameCtrlManager.Instance.exit(EmWindow.Welfare);
  }

  private get isMineralDouble(): boolean {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.mineralIsOpen;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get control(): WelfareCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
  }

  private get ctrlData(): WelfareData {
    return this.control.data;
  }

  private get petBossModel(): PetBossModel {
    return CampaignManager.Instance.petBossModel;
  }

  dispose() {
    this.removeEvent();
  }
}
