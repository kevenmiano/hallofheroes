//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 19:52:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-22 14:16:02
 * @Description: 防守建筑界面
 */

import LangManager from "../../../core/lang/LangManager";
import Logger from "../../../core/logger/Logger";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { EmOuterCityWarBuildSortType } from "../../constant/OuterCityWarDefine";
import ColorConstant from "../../constant/ColorConstant";
import { OuterCityWarEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityWarManager } from "./control/OuterCityWarManager";
import { OuterCityWarBuildInfo } from "./model/OuterCityWarBuildInfo";
import { OuterCityWarModel } from "./model/OuterCityWarModel";
import { CampType } from "../../constant/Const";
import { t_s_castlebattlebuildingskillData } from "../../config/t_s_castlebattlebuildingskill";
import FUIHelper from "../../utils/FUIHelper";
import { EmWindow } from "../../constant/UIDefine";
import OuterCityWarBuildSiteItem from "./view/item/OuterCityWarBuildSiteItem";
import { IconFactory } from "../../../core/utils/IconFactory";
import { TipsShowType } from "../../tips/ITipedDisplay";
import UIButton, { UIButtonChangeType } from "../../../core/ui/UIButton";
import { JobType } from "../../constant/JobType";
import { PetData } from "../pet/data/PetData";
import { CommonTips2Data } from "../../tips/CommonTips2";

export default class OuterCityWarDefencerBuildWnd extends BaseWindow {
  protected resizeContent: boolean = true;
  protected setScenterValue: boolean = true;
  private list: fgui.GList;
  private txtCompleteOccupyScore: fgui.GTextField;
  private txtCompleteOccupyScoreVal: fgui.GTextField;
  private tfAttackTipCond: fgui.GRichTextField;
  private txtOccupyScore: fgui.GTextField;
  private txtDefenceForce: fgui.GTextField;
  private txtGuild: fgui.GTextField;
  private txtNickName: fgui.GTextField;
  private txtEnterBattlePet: fgui.GTextField;
  private txtPetTotalCapaity: fgui.GTextField;
  private txtCapaity: fgui.GTextField;
  private txtJob: fgui.GTextField;
  private txtPawn: fgui.GTextField;
  private skillItem: fgui.GComponent;
  private btnSkillItemTip: UIButton;
  private gSkill: fgui.GGroup;
  private cIsPet: fgui.Controller;

  private buildInfo: OuterCityWarBuildInfo;
  private buildSkillTemp: t_s_castlebattlebuildingskillData;

  public OnInitWind() {
    super.OnInitWind();
  }

  public OnShowWind() {
    super.OnShowWind();
    if (this.frameData) {
      this.buildInfo = this.frameData.buildInfo;
    }
    OuterCityWarManager.Instance.sendReqBuildInfo(this.buildInfo.sonType);
    /** 更新自己的信息 来刷新自己最新的buff */
    OuterCityWarManager.Instance.sendSelfPlayInfo();
    this.initView();
    this.addEvent();
    this.refreshView();
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.BUILD_INFO,
      this.__buildInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.BUILD_PRE_COMPLETE_OCCUPY_STATE,
      this.__preCompleteOccupyState,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.BUILD_INFO,
      this.__buildInfo,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.BUILD_PRE_COMPLETE_OCCUPY_STATE,
      this.__preCompleteOccupyState,
      this,
    );
  }

  private initView() {
    Logger.outcityWar(
      "打开界面:" + this.buildInfo.buildName + this.buildInfo.sonType,
    );
    this.cIsPet = this.getController("cIsPet");
    this.cIsPet.setSelectedIndex(this.buildInfo.isPetBuild ? 1 : 0);
    this.txtFrameTitle.text = this.buildInfo.buildName;
    this.txtCompleteOccupyScore.text = LangManager.Instance.GetTranslation(
      "outerCityWar.completeOccupyScore",
    );
    this.txtCompleteOccupyScoreVal.text = LangManager.Instance.GetTranslation(
      "public.addMark",
      this.buildInfo.completeOccupyScore,
    );
    // 列表的标题
    this.txtDefenceForce.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.defanceForce",
    );
    this.txtGuild.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.guild",
    );
    this.txtOccupyScore.text = LangManager.Instance.GetTranslation(
      "outerCityWar.occupyScore",
    );
    this.txtNickName.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.nickName",
    );
    this.txtEnterBattlePet.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.enterBattlePet",
    );
    this.txtPetTotalCapaity.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.petTotalCapaity",
    );
    this.txtCapaity.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.capaity2",
    );
    this.txtJob.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.job",
    );
    this.txtPawn.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.pawn",
    );

    for (let index = 0; index < OuterCityWarModel.BuildSiteCount; index++) {
      let item = this.list.addItemFromPool() as OuterCityWarBuildSiteItem;
      item.buidType = Number(
        this.buildInfo.isPetBuild
          ? EmOuterCityWarBuildSortType.Pet
          : EmOuterCityWarBuildSortType.Hero,
      );
    }

    this.btnSkillItemTip.changeType = UIButtonChangeType.Light;
  }

  private initBuildBuffView() {
    // 测试
    // this.buildSkillTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_castlebattlebuildingskill, 40201)
    this.buildSkillTemp = this.fightModel.getBuildBuffByUserId(
      this.fightModel.playerInfo.userId,
      this.buildInfo.sonType,
    );
    if (!this.buildSkillTemp) {
      this.buildSkillTemp = this.fightModel.getBuildBuffTemplateBySontype(
        this.buildInfo.sonType,
      );
      Logger.outcityWar("获取默认建筑buff", this.buildSkillTemp);
    }
    if (this.buildSkillTemp) {
      let buildBuffDesc = "";
      switch (this.buildInfo.buffType) {
        case 101:
          let pawnTemplete = this.fightModel.getPawnTemplateByMastType(
            this.buildInfo.buffCondition,
          );
          buildBuffDesc = LangManager.Instance.GetTranslation(
            "outerCityWar.buildBuff01",
            pawnTemplete && pawnTemplete.PawnNameLang,
          );
          break;
        case 102:
          let jobName = JobType.getJobName(this.buildInfo.buffCondition);
          buildBuffDesc = LangManager.Instance.GetTranslation(
            "outerCityWar.buildBuff02",
            jobName,
          );
          break;
        case 201:
          let petTypeName = PetData.getPetTypeLanguage(
            this.buildInfo.buffCondition,
          );
          buildBuffDesc = LangManager.Instance.GetTranslation(
            "outerCityWar.buildBuff03",
            petTypeName,
          );
          break;
      }

      this.gSkill.visible = true;
      this.skillItem.getChild("txtTitle").text =
        LangManager.Instance.GetTranslation(
          "public.level3",
          this.buildSkillTemp.ActiveSkillLevel,
        );
      let skillTemp = this.buildSkillTemp.getActiveSkillTemplate();
      if (skillTemp) {
        this.skillItem.getChild("imgIcon").asLoader.url =
          IconFactory.getCommonIconPath(skillTemp.Icons);
        let tipData = new CommonTips2Data(
          skillTemp.SkillTemplateName,
          skillTemp.SkillDescription,
          buildBuffDesc,
        );
        FUIHelper.setTipData(
          this.btnSkillItemTip.view,
          EmWindow.CommonTips2,
          tipData,
          new Laya.Point(-54, -54),
          TipsShowType.onClick,
        );
      } else {
        Logger.outcityWar(
          "配置技能模板不存在",
          this.buildSkillTemp.ActiveSkillTemplate,
        );
      }
    } else {
      this.gSkill.visible = false;
    }
  }

  private refreshView() {
    this.__buildInfo();
    this.__preCompleteOccupyState();
  }

  private __preCompleteOccupyState() {
    //不在参战公会的人，红显进攻方前置建筑说明
    let color = ColorConstant.RED_COLOR;
    let str = this.buildInfo.strAttackerAttackBuildTip;
    let guildInfo = this.fightModel.getGuildInfo(this.fightModel.selfGuildId);
    if (guildInfo) {
      if (guildInfo.camp == CampType.Attack) {
        str = this.buildInfo.strAttackerAttackBuildTip;
        color = this.buildInfo.preOneCompleteOccupyByAttacker
          ? ColorConstant.GREEN_COLOR
          : ColorConstant.RED_COLOR;
      } else if (guildInfo.camp == CampType.Defence) {
        str = this.buildInfo.strDefencerAttackBuildTip;
        color = this.buildInfo.preOneCompleteOccupyByDefencer
          ? ColorConstant.GREEN_COLOR
          : ColorConstant.RED_COLOR;
      } else {
        Logger.outcityWar("公会的阵营出错", guildInfo);
      }
    }
    if (str) {
      this.tfAttackTipCond.text = LangManager.Instance.GetTranslation(
        "outerCityWar.attackBuildTipCond",
        color,
        str,
      );
    } else {
      this.tfAttackTipCond.text = "";
    }
  }

  private __allBuildInfo() {
    this.initBuildBuffView();
    this.refreshAllSiteView();
  }

  private __buildInfo() {
    this.initBuildBuffView();
    this.refreshAllSiteView();
  }

  private refreshAllSiteView() {
    for (
      let orderId = 1;
      orderId <= OuterCityWarModel.BuildSiteCount;
      orderId++
    ) {
      this.refreshOneSiteView(this.buildInfo.sonType, orderId);
    }
  }

  private refreshOneSiteView(buildSontype: number, orderId: number) {
    if (this.buildInfo.sonType != buildSontype) return;

    let item = this.list.getChildAt(orderId - 1) as OuterCityWarBuildSiteItem;
    if (item) {
      let siteInfo = this.buildInfo.siteInfoList[orderId - 1];
      item.info = siteInfo;
      item.refreshView();
    } else {
      Logger.outcityWar("找不到驻防点item视图", orderId);
    }
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
