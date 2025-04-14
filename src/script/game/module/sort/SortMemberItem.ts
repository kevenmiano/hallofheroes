//@ts-expect-error: External dependencies
import FUI_SortRankItemCell from "../../../../fui/Sort/FUI_SortRankItemCell";
import LangManager from "../../../core/lang/LangManager";
import { JobType } from "../../constant/JobType";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import WarlordsPlayerInfo from "../warlords/WarlordsPlayerInfo";
import SortController from "./SortController";
import SortModel from "./SortModel";
import FUIHelper from "../../utils/FUIHelper";
import { PetData } from "../pet/data/PetData";
import SortData from "./SortData";
import { ConsortiaControler } from "../consortia/control/ConsortiaControler";
import { ConsortiaDutyInfo } from "../consortia/data/ConsortiaDutyInfo";
import { PlayerManager } from "../../manager/PlayerManager";
import { t_s_honorequipData } from "../../config/t_s_honorequip";
import { TempleteManager } from "../../manager/TempleteManager";
import UIManager from "../../../core/ui/UIManager";
import { isOversea } from "../login/manager/SiteZoneCtrl";

/**
 * @author:pzlricky
 * @data: 2021-08-24 19:42
 * @description 排行榜单元格
 */
export default class SortMemberItem extends FUI_SortRankItemCell {
  private cellData: any = null;
  public iswarlords: boolean = false;
  public issuperwarlords: boolean = false;

  onConstruct() {
    super.onConstruct();
    let autoKey = 3;
    //默认全部自动收缩
    if (isOversea()) {
      autoKey = 3;
    } else {
      autoKey = 0;
    }
    this.para0.autoSize = autoKey;
    this.para1.autoSize = autoKey;
    this.para2.autoSize = autoKey;
    this.para3.autoSize = autoKey;
    this.para4.autoSize = autoKey;
    this.para5.autoSize = autoKey;
    this.para6.autoSize = autoKey;
  }

  private get scontroller(): SortController {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Sort) as SortController;
  }

  private get smodel(): SortModel {
    if (this.scontroller) {
      return this.scontroller.model;
    } else {
      return null;
    }
  }

  public set vdata(value) {
    this.cellData = value;
    if (!this.iswarlords) {
      this.updateRankCell();
      if (this.smodel.isCross) {
        this.refreshCrossView();
      } else {
        this.refreshView();
      }
    } else {
      if (this.issuperwarlords) {
        //众神榜
        this.refreshSuperWarlords();
      } else {
        this.refreshWarlords();
      }
    }
  }

  refreshSuperWarlords() {
    var str: string = "200,200,160,300,160";
    if (!str) return;
    var arr: Array<string> = str.split(",");
    var i: number = 0;
    var xx: number = 9;
    for (let index = 0; index < 7; index++) {
      var txt: fgui.GTextField = this.getChild("para" + index).asTextField;
      txt.text = "";
    }
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        var w: string = arr[key];
        var numW: number = Number(w);
        var txt: fgui.GTextField = this.getChild("para" + i).asTextField;
        txt.width = numW;
        txt.x = xx;
        xx += numW;
        i++;
      }
    }
    let playerInfo = this.cellData as WarlordsPlayerInfo;
    this.setRankValue(playerInfo.sort);
    this.para1.text = playerInfo.nickname.toString();
    this.para2.text = playerInfo.grade.toString();
    this.para3.text = playerInfo.fightingCapacity.toString();
    this.para4.text = playerInfo.winCount.toString();
  }

  /**设置排行值 */
  setRankValue(rank: number = 0) {
    if (rank > 0 && rank <= 3) {
      this.para0.text = "";
      let iconUrl = this.getIconName(rank);
      this.rankIcon.url = FUIHelper.getItemURL(EmPackName.Base, iconUrl);
      this.numIcon.selectedIndex = 1;
    } else {
      this.numIcon.selectedIndex = 0;
      this.para0.text = rank.toString();
    }
  }

  getIconName(rank: number): string {
    let value = "";
    switch (rank) {
      case 1:
        value = "Icon_1st_S";
        break;
      case 2:
        value = "Icon_2nd_S";
        break;
      case 3:
        value = "Icon_3rd_S";
        break;

      default:
        break;
    }
    return value;
  }

  /**刷新众神榜 */
  private refreshWarlords() {
    var str: string = "240,425";
    if (!str) return;
    var arr: Array<string> = str.split(",");
    var i: number = 0;
    var xx: number = 9;
    for (let index = 0; index < 7; index++) {
      var txt: fgui.GTextField = this.getChild("para" + index).asTextField;
      txt.text = "";
    }
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        var w: string = arr[key];
        var numW: number = Number(w);
        var txt: fgui.GTextField = this.getChild("para" + i).asTextField;
        txt.width = numW;
        txt.x = xx;
        xx += numW;
        i++;
      }
    }
    this.para0.text = LangManager.Instance.GetTranslation(
      "sort.SortGeneralListCell.str01",
      this.cellData.orderId.toString(),
    );
    this.para1.text =
      this.cellData.army.baseHero.nickName +
      " " +
      this.cellData.army.baseHero.serviceName;
  }

  private updateRankCell() {
    if (this.smodel.isCross) {
      this.layout("C" + this.smodel.currentSelected);
    } else {
      this.layout("" + this.smodel.currentSelected);
    }
  }

  private layout(type: string) {
    var str: string = this.smodel.widthConfig[type];
    if (!str) return;
    var arr: Array<string> = str.split(",");
    var i: number = 0;
    var xx: number = 9;
    for (let index = 0; index < 7; index++) {
      var txt: fgui.GTextField = this.getChild("para" + index).asTextField;
      txt.text = "";
    }
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        var w: string = arr[key];
        let isHide = this.scontroller.isHideTabCell;
        var numW: number = Number(w) + (isHide ? 50 : 0);
        var txt: fgui.GTextField = this.getChild("para" + i).asTextField;
        txt.width = numW;
        txt.x = xx;
        xx += numW;
        i++;
      }
    }
  }

  /**跨服 */
  private refreshCrossView() {
    if (this.cellData) {
      this.setRankValue(this.cellData.orderId);
      this.clickRect0.onClick(this, this.onClickName, [
        this.smodel.currentSelected,
      ]);
      this.clickRect1.onClick(this, this.onClickRect1, [
        this.smodel.currentSelected,
      ]);

      switch (this.smodel.currentSelected) {
        case SortModel.SELF_LEVEL:
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.grades.toString();
          this.para4.text = this.cellData.serverName.toString();
          if (this.scontroller.isHideTabCell) {
            this.para5.text = "";
          } else {
            this.para5.text = this.cellData.gp.toString();
          }
          break;
        case SortModel.SELF_POW:
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.serverName.toString();
          this.para4.text = this.cellData.fightCapacity.toString();
          break;
        case SortModel.CONSORTIA_POW:
          this.para1.text = this.cellData.consortiaName;
          this.para2.text = this.cellData.consortiaLevel.toString();
          this.para3.text = this.cellData.serverName.toString();
          this.para4.text = this.cellData.consortiaFightPower.toString();
          break;
        case SortModel.CONSORTIA_LEVEL:
          this.para1.text = this.cellData.consortiaName;
          this.para2.text = this.cellData.consortiaLevel.toString();
          this.para3.text = this.cellData.serverName.toString();
          this.para4.text = this.cellData.offer.toString();
          break;
        case SortModel.SELF_HONOUR:
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.smodel.getHonourName(this.cellData.selfHonour);
          this.para4.text = this.cellData.serverName.toString();
          this.para5.text = this.cellData.selfHonour.toString();
          break;
        case SortModel.SELF_CHARMS:
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.serverName.toString();
          this.para4.text = this.cellData.charms.toString();
          break;
        case SortModel.SELF_SOULSCORE:
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.serverName.toString();
          this.para4.text = this.cellData.soulScore.toString();
          break;
        case SortModel.PET_POWER:
          this.para1.text = this.cellData.nickName;
          this.para2.text = this.cellData.petData.grade + "";
          this.para3.text = this.cellData.petData.fightPower + "";
          this.para4.text = this.cellData.petData.petTypeLanguage;
          break;
      }
    } else {
      this.para0.text = "";
      this.para1.text = "";
      this.para2.text = "";
      this.para3.text = "";
      this.para4.text = "";
      this.para5.text = "";
      this.para6.text = "";
    }
  }

  /**
   * 点击玩家名字弹出操作框
   */
  private onClickName(type: number): void {
    if (type == SortModel.PET_POWER) {
      //玩家点击英灵名称下方的名称则弹出英灵对比框
      let ctrl: SortController = FrameCtrlManager.Instance.getCtrl(
        EmWindow.Sort,
      ) as SortController;
      let uid = (this.cellData as SortData).army.baseHero.userId;
      let petId = (this.cellData as SortData).petData.petId;
      ctrl.reqPetCompare(uid, petId);
    } else if (
      type != SortModel.CONSORTIA_LEVEL &&
      type != SortModel.CONSORTIA_POW
    ) {
      this.showUseMenu(
        Laya.stage.mouseX,
        Laya.stage.mouseY,
        this.cellData.nickName,
        this.cellData.userId,
        false,
      );
    }
  }
  /**
   * 点击玩家名字弹出操作框
   */
  private onClickRect1(type: number): void {
    if (type == SortModel.PET_POWER) {
      //玩家点击主人下方的名字依然弹出角色操作框
      let showConsortia: boolean;
      if (
        PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID > 0
      ) {
        showConsortia = (
          FrameCtrlManager.Instance.getCtrl(
            EmWindow.Consortia,
          ) as ConsortiaControler
        ).getRightsByIndex(ConsortiaDutyInfo.PASSINVITE);
        showConsortia =
          showConsortia &&
          (this.cellData as SortData).army.baseHero.consortiaID <= 0;
      }
      let point: Laya.Point = new Laya.Point(
        Laya.stage.mouseX,
        Laya.stage.mouseY,
      );
      this.cellData.point = point;
      UIManager.Instance.ShowWind(EmWindow.OuterCityArmyTips, [this.cellData]);
    }
  }

  private isSameZone(): boolean {
    if (this.cellData) {
      return (
        PlayerManager.Instance.currentPlayerModel.userInfo.mainSite ==
        this.cellData.mainSite
      );
    }
    return false;
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
    this.cellData.point = point;
    UIManager.Instance.ShowWind(EmWindow.OuterCityArmyTips, [this.cellData]);
  }

  public dispose() {
    this.clickRect0.offClick(this, this.onClickName);
    this.clickRect1.offClick(this, this.onClickRect1);
    super.dispose();
  }

  /**本服 */
  private refreshView() {
    if (this.cellData) {
      this.setRankValue(this.cellData.orderId);
      this.clickRect0.onClick(this, this.onClickName, [
        this.smodel.currentSelected,
      ]);
      this.clickRect1.onClick(this, this.onClickRect1, [
        this.smodel.currentSelected,
      ]);
      this.para3.color = "#FFC68F";

      switch (this.smodel.currentSelected) {
        case SortModel.SELF_LEVEL: //个人等级
          this.para1.text = this.cellData.nickName;
          this.para3.text = this.cellData.grades.toString();
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          if (this.scontroller.isHideTabCell) {
            this.para4.text = "";
          } else {
            this.para4.text = this.cellData.gp.toString();
          }
          this.para1.color = "#FFFFFF";
          break;
        case SortModel.SELF_POW: //个人战力
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.fightCapacity.toString();
          this.para1.color = "#FFFFFF";
          break;
        case SortModel.CONSORTIA_POW: //公会建设
          this.para1.text = this.cellData.consortiaName;
          this.para2.text = this.cellData.consortiaLevel.toString();
          this.para3.text = this.cellData.consortiaFightPower.toString();
          this.para1.color = "#FFC68F";
          break;
        case SortModel.CONSORTIA_LEVEL: //公会等级
          this.para1.text = this.cellData.consortiaName;
          this.para2.text = this.cellData.consortiaLevel.toString();
          this.para3.text = this.cellData.offer.toString();
          this.para1.color = "#FFC68F";
          break;
        case SortModel.SELF_HONOUR: //荣耀
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          //称号
          let cfg: t_s_honorequipData =
            TempleteManager.Instance.geHonorCfgByType(
              1,
              this.cellData.honorEquipStage,
            );
          if (cfg) {
            this.para3.text = cfg.HonorequipnameLang;
          }
          this.para4.text = this.cellData.selfHonour.toString();
          this.para1.color = "#FFFFFF";
          break;
        case SortModel.SELF_CHARMS: //个人魅力值
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.charms.toString();
          this.para1.color = "#FFFFFF";
          break;
        case SortModel.SELF_SOULSCORE: //兽魂值
          this.para1.text = this.cellData.nickName;
          this.para2.text = JobType.getJobName(
            this.cellData.army.baseHero.templateInfo.Job,
          );
          this.para3.text = this.cellData.soulScore.toString();
          this.para1.color = "#FFFFFF";
          break;
        case SortModel.PET_POWER: //英灵战斗力
          this.para1.text = this.cellData.petData.name;
          this.para2.text = this.cellData.petData.petTypeLanguage;
          this.para3.text = this.cellData.nickName;
          this.para4.text = this.cellData.petData.grade + "";
          this.para5.text = this.cellData.petData.fightPower + "";
          //英灵名称列跟随英灵品质的颜色, 主人列改为白色
          this.para3.color = "#ffffff";
          this.para1.color = PetData.getQualityColor(
            parseInt(this.cellData.petData.quality) - 1,
          );
          break;
      }
    } else {
      this.para0.text = "";
      this.para1.text = "";
      this.para2.text = "";
      this.para3.text = "";
      this.para4.text = "";
      this.para5.text = "";
      this.para6.text = "";
    }
  }
}
