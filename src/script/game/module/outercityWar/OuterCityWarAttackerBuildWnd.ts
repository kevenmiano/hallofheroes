/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 19:52:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-15 16:51:39
 * @Description: 进攻建筑界面
 * 守城方玩家可以对随时营地发起进攻（没有建筑占领前置条件）
 * 多个进攻方公会之间，也可以互相攻打营地（没有建筑占领前置条件）
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIButton, { UIButtonChangeType } from "../../../core/ui/UIButton";
import { OuterCityWarManager } from "./control/OuterCityWarManager";
import { OuterCityWarModel } from "./model/OuterCityWarModel";
import ColorConstant from "../../constant/ColorConstant";
import OuterCityWarAttackerBuildItem from "./view/item/OuterCityWarAttackerBuildItem";
import { OuterCityWarBuildInfo } from "./model/OuterCityWarBuildInfo";
import Logger from "../../../core/logger/Logger";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { OuterCityWarPlayerInfo } from "./model/OuterCityWarPlayerInfo";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { OuterCityWarEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { EmWindow } from "../../constant/UIDefine";
import { CommonTips2Data } from "../../tips/CommonTips2";
import { TipsShowType } from "../../tips/ITipedDisplay";
import FUIHelper from "../../utils/FUIHelper";

export default class OuterCityWarAttackerBuildWnd extends BaseWindow {
  protected resizeContent: boolean = true;
  protected setScenterValue: boolean = true;
  private list: fgui.GList;
  private txtDesc: fgui.GTextField;
  private tfBattleCnt: fgui.GRichTextField;
  private txtJob: fgui.GTextField;
  private txtNickName: fgui.GTextField;
  private txtGrade: fgui.GTextField;
  private txtCapaity: fgui.GTextField;
  private txtDefenceForce: fgui.GTextField;
  private txtState: fgui.GTextField;
  private skillItem: fgui.GComponent;
  private btnSkillItemTip: UIButton;
  private btnAttack: UIButton;
  private gSkill: fgui.GGroup;

  private guildId: number;
  private buildInfo: OuterCityWarBuildInfo;
  public OnInitWind() {
    super.OnInitWind();
    this.initView();
  }

  public OnShowWind() {
    super.OnShowWind();
    if (this.frameData) {
      this.buildInfo = this.frameData.buildInfo;
      this.guildId = this.fightModel.getAttackGuildId(this.buildInfo.sonType);
      Logger.outcityWar("打开攻击阵营", this.buildInfo.buildName, this.guildId);
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
      "public.battle.enterBattleList",
    );
    this.btnAttack.title = LangManager.Instance.GetTranslation("public.attack");

    this.txtDesc.text = LangManager.Instance.GetTranslation(
      "outerCityWar.attackerBuildWndDesc",
    );
    this.txtJob.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.job",
    );
    this.txtNickName.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.nickName",
    );
    this.txtGrade.text = LangManager.Instance.GetTranslation("public.level6");
    this.txtCapaity.text = LangManager.Instance.GetTranslation(
      "OuterCityWarAccacker.capaity",
    );
    this.txtDefenceForce.text = LangManager.Instance.GetTranslation(
      "public.playerInfo.defanceForce",
    );
    this.txtState.text = LangManager.Instance.GetTranslation("public.state");

    this.btnSkillItemTip.changeType = UIButtonChangeType.Light;
  }

  private __allBuildInfo() {
    this.refreshView();
  }

  private onRenderListItem(index: number, item: OuterCityWarAttackerBuildItem) {
    item.info = this.playerInfoList[index];
  }

  private refreshView() {
    let b =
      this.fightModel.isCastleFighting &&
      this.fightModel.checkJoin(this.fightModel.selfUserId) &&
      this.guildId != this.fightModel.selfGuildId;
    this.btnAttack.visible = b;

    // 公会参战未被击退/公会参战人数
    let str = LangManager.Instance.GetTranslation(
      "public.diagonalSign",
      this.buildInfo.attackGuildCurCnt,
      this.buildInfo.attackGuildTotalCnt,
    );
    this.tfBattleCnt.text = LangManager.Instance.GetTranslation(
      "public.battle.enterWarCnt",
      ColorConstant.LIGHT_TEXT_COLOR,
      str,
    );
    let playerList = this.playerInfoList;
    this.list.numItems = playerList.length;
    this.btnAttack.enabled = playerList.length > 0;

    this.refreshBuildBuffView();
  }

  private refreshBuildBuffView() {
    let buildSkillTemp = this.fightModel.getBuildBuffTemplateByPlayerCnt(
      this.buildInfo.attackGuildCurCnt,
    );
    if (buildSkillTemp) {
      let buildBuffDesc = LangManager.Instance.GetTranslation(
        "outerCityWar.buildBuff00",
      );

      this.gSkill.visible = true;
      this.skillItem.getChild("txtTitle").text =
        LangManager.Instance.GetTranslation(
          "public.level3",
          buildSkillTemp.ActiveSkillLevel,
        );
      let skillTemp = buildSkillTemp.getActiveSkillTemplate();
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
          buildSkillTemp.ActiveSkillTemplate,
        );
      }
    } else {
      this.gSkill.visible = false;
    }
  }

  private btnAttackClick() {
    if (this.fightModel.checkGuildOut(this.buildInfo.attackGuildId)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "outerCityWar.guildRepulse",
          this.buildInfo.attackGuildName,
        ),
      );
      return;
    }
    if (this.fightModel.checkPlayerOut(this.fightModel.playerInfo.userId)) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("outerCityWar.playerRepulse"),
      );
      return;
    }
    OuterCityWarManager.Instance.sendAttackAttackerBuild(
      this.buildInfo.attackGuildId,
    );
  }

  private get playerInfoList(): OuterCityWarPlayerInfo[] {
    let temp = this.fightModel.getCurCastleJoinWarGuildPlayerList(this.guildId);
    temp = ArrayUtils.sortOn(
      temp,
      ["heroCapaity"],
      [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING],
    );
    return temp;
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }

  public OnHideWind() {
    this.removeEvent();
    super.OnHideWind();
  }
}
