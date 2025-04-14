/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 19:52:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-15 16:51:15
 * @Description: 防守方 防守设置界面
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { OuterCityWarManager } from "./control/OuterCityWarManager";
import { OuterCityWarModel } from "./model/OuterCityWarModel";
import ColorConstant from "../../constant/ColorConstant";
import OuterCityWarDefenceSettingItem from "./view/item/OuterCityWarDefenceSettingItem";
import { OuterCityWarBuildInfo } from "./model/OuterCityWarBuildInfo";
import { PetData } from "../pet/data/PetData";
import { BooleanType } from "../../constant/Const";
import { EmOuterCityWarPlayerState } from "../../constant/OuterCityWarDefine";
import { OuterCityWarEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityWarPlayerInfo } from "./model/OuterCityWarPlayerInfo";

export default class OuterCityWarDefenceSettingWnd extends BaseWindow {
  protected resizeContent: boolean = true;
  protected setScenterValue: boolean = true;
  private list: fgui.GList;
  private cIsPet: fgui.Controller;
  private txtDesc: fgui.GTextField;
  private tfBattleCnt: fgui.GRichTextField;
  private txtNickName: fgui.GRichTextField;
  private txtDefenceBuild: fgui.GRichTextField;
  private txtJob: fgui.GRichTextField;
  private txtPawn: fgui.GRichTextField;
  private txtCapaity: fgui.GRichTextField;
  private txtPetCapaity: fgui.GTextField;
  private txtPetTotalCapaity: fgui.GTextField;
  private playerInfoList: OuterCityWarPlayerInfo[];

  private buildInfo: OuterCityWarBuildInfo;
  private orderId: number;

  public OnInitWind() {
    super.OnInitWind();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();
    if (this.frameData) {
      this.buildInfo = this.frameData.buildInfo;
      this.orderId = this.frameData.orderId;
    }
    this.addEvent();
    this.refreshView();
  }

  private addEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onRenderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
  }

  private initView() {
    this.txtFrameTitle.text = LangManager.Instance.GetTranslation(
      "outerCityWar.defenceSetting",
    );
    this.txtNickName.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.nickName",
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
    this.txtDefenceBuild.text = LangManager.Instance.GetTranslation(
      "outerCityWar.defanceBuild",
    );
    this.txtPetTotalCapaity.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.petTotalCapaity",
    );
  }

  private __allBuildInfo() {
    this.refreshView();
  }

  private refreshView() {
    this.cIsPet = this.getController("cIsPet");
    this.cIsPet.setSelectedIndex(this.buildInfo.isPetBuild ? 1 : 0);
    this.txtPetCapaity.text = LangManager.Instance.GetTranslation(
      "outerCityWar.petCapaity",
      PetData.getPetTypeLanguage(this.buildInfo.petType),
    );
    // let buildSkillTemp = this.fightModel.getBuildBuffByUserId(this.fightModel.playerInfo.userId, this.buildInfo.sonType);
    // if (!buildSkillTemp) {
    //     buildSkillTemp = this.fightModel.getBuildBuffTemplateBySontype(this.buildInfo.sonType)
    // }
    // if (buildSkillTemp) {
    //     let skillTemp = buildSkillTemp.getActiveSkillTemplate();
    //     if (skillTemp) {
    //         this.txtDesc.text = StringHelper.replace(skillTemp.SkillDescription,"<br>","");
    //     }
    // }

    // 已布防人数/总参战人数（ps：已布防人数需要区分英雄和英灵）
    let cur = this.fightModel.getGuildPlayerCnt(
      this.fightModel.selfGuildId,
      this.buildInfo.isPetBuild,
      BooleanType.TRUE,
      [EmOuterCityWarPlayerState.DEFANCE],
    );
    let total = this.fightModel.getGuildPlayerCnt(
      this.fightModel.selfGuildId,
      false,
      BooleanType.TRUE,
    );
    let str = LangManager.Instance.GetTranslation(
      "public.diagonalSign",
      cur,
      total,
    );
    this.tfBattleCnt.text = LangManager.Instance.GetTranslation(
      "public.battle.enterWarCnt",
      ColorConstant.LIGHT_TEXT_COLOR,
      str,
    );

    this.refreshPlayerInfoList();
    if (this.playerInfoList) {
      this.list.numItems = this.playerInfoList.length;
    }
  }

  private onRenderListItem(
    index: number,
    item: OuterCityWarDefenceSettingItem,
  ) {
    let playerList = this.playerInfoList;
    item.cIsPet.setSelectedIndex(this.buildInfo.isPetBuild ? 1 : 0);
    item.buildInfo = this.buildInfo;
    item.orderId = this.orderId;
    item.info = playerList[index];
  }

  private refreshPlayerInfoList() {
    this.playerInfoList = this.fightModel.getCurCastleJoinWarGuildPlayerList(
      this.fightModel.selfGuildId,
    );

    // 英雄建筑101：（1）需求士兵等级（2）英雄战力
    // 英雄建筑102：（1）需求职业   （2）英雄战力
    // 英灵建筑201：（1）需求英灵战力（2）总英灵战力
    if (this.buildInfo.isPetBuild) {
      this.playerInfoList.sort((pInfo1, pInfo2) => {
        let capA = pInfo1.getPetCapaityByType(this.buildInfo.buffCondition);
        let capB = pInfo2.getPetCapaityByType(this.buildInfo.buffCondition);
        let b1 = capA > capB;
        let sumA1 = b1 ? 100 : 0;
        let sumB1 = b1 ? 0 : 100;
        // 没携英灵或上阵的没有对应系的英灵
        if (capA == 0 && capB == 0) {
          sumA1 = sumB1 = 0;
        }

        let b2 = pInfo1.getTotalPetCapaity() > pInfo2.getTotalPetCapaity();
        let sumA2 = b2 ? 10 : 0;
        let sumB2 = b2 ? 0 : 10;

        let totalSumA = sumA1 + sumA2;
        let totalSumB = sumB1 + sumB2;
        return totalSumB - totalSumA;
      });
    } else if (this.buildInfo.isHeroBuild) {
      if (this.buildInfo.buffType == 101) {
        this.playerInfoList.sort((pInfo1, pInfo2) => {
          let capA = pInfo1.getPawnLevelByMasterType(
            this.buildInfo.buffCondition,
          );
          let capB = pInfo2.getPawnLevelByMasterType(
            this.buildInfo.buffCondition,
          );
          let b1 = capA > capB;
          let sumA1 = b1 ? 100 : 0;
          let sumB1 = b1 ? 0 : 100;
          // 没携带兵或上阵的不是对应的兵种
          if (capA == 0 && capB == 0) {
            sumA1 = sumB1 = 0;
          }

          let b2 = pInfo1.heroCapaity > pInfo2.heroCapaity;
          let sumA2 = b2 ? 10 : 0;
          let sumB2 = b2 ? 0 : 10;

          let totalSumA = sumA1 + sumA2;
          let totalSumB = sumB1 + sumB2;
          return totalSumB - totalSumA;
        });
      } else if (this.buildInfo.buffType == 102) {
        this.playerInfoList.sort((pInfo1, pInfo2) => {
          let sameJobA = pInfo1.jobMasterType == this.buildInfo.buffCondition;
          let sameJobB = pInfo2.jobMasterType == this.buildInfo.buffCondition;
          let sumA1 = 0;
          let sumB1 = 0;
          // 职业都不附和或者是相同职业
          if (sameJobA == sameJobB) {
            // sumA1 = sumB1 = 0
          } else if (sameJobA) {
            sumA1 = 100;
          } else if (sameJobB) {
            sumB1 = 100;
          }

          let b2 = pInfo1.heroCapaity > pInfo2.heroCapaity;
          let sumA2 = b2 ? 10 : 0;
          let sumB2 = b2 ? 0 : 10;

          let totalSumA = sumA1 + sumA2;
          let totalSumB = sumB1 + sumB2;
          return totalSumB - totalSumA;
        });
      }
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
