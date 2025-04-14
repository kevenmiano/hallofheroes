//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-28 16:33:47
 * @Description: 设置防守界面成员列表Item
 */

import FUI_OuterCityWarEnterWarSettingItem from "../../../../../../fui/OuterCityWar/FUI_OuterCityWarEnterWarSettingItem";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import ColorConstant from "../../../../constant/ColorConstant";
import { BooleanType } from "../../../../constant/Const";
import { JobType } from "../../../../constant/JobType";
import { EmWindow } from "../../../../constant/UIDefine";
import { OuterCityWarEvent } from "../../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { OuterCityWarManager } from "../../control/OuterCityWarManager";
import { OuterCityWarModel } from "../../model/OuterCityWarModel";
import { OuterCityWarPlayerInfo } from "../../model/OuterCityWarPlayerInfo";

export default class OuterCityWarEnterWarSettingItem extends FUI_OuterCityWarEnterWarSettingItem {
  private _info: OuterCityWarPlayerInfo;

  protected onConstruct(): void {
    super.onConstruct();
    this.addEvent();
  }

  public set info(value: OuterCityWarPlayerInfo) {
    this._info = value;
    this.refreshView();
  }

  public get info(): OuterCityWarPlayerInfo {
    return this._info;
  }

  public addEvent() {
    NotificationManager.Instance.addEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
    this.btnTick.onClick(this, this.btnTickClick);
  }

  public removeEvent() {
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.ALL_BUILD_INFO,
      this.__allBuildInfo,
      this,
    );
    this.btnTick.offClick(this, this.btnTickClick);
  }

  private __allBuildInfo() {
    this.refreshView();
  }

  public refreshView() {
    if (this._info) {
      // this.imgJob.icon = JobType.getJobIcon(this._info.job)
      this.btnTick.selected = this._info.enterWar == BooleanType.TRUE;
      this.cJob.setSelectedIndex(this._info.job);
      this.txtNickName.text = this._info.userName;
      this.txtGrade.text = this._info.userGrade.toString();
      this.txtCapaity.text = this._info.heroCapaity.toString();
      this.txtPetCapaity.text = this._info.getTotalPetCapaity().toString();
      this.txtDefenceCastle.text = this.fightModel.getCastleName(
        this._info.enterWarCastleNodeId,
      );

      switch (this._info.enterWar) {
        case BooleanType.FALSE:
          this.cState.setSelectedIndex(0);
          break;
        case BooleanType.TRUE:
          if (
            this.fightModel.checkInCurCastleJoinBattleList(this._info.userId)
          ) {
            this.cState.setSelectedIndex(1);
          } else {
            this.cState.setSelectedIndex(2);
          }
          break;
      }
      this.setNormal(this._info.online);
    } else {
      this.setNormal(true);
    }
  }

  private btnTickClick() {
    if (this.fightModel.isCastleFighting) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation("outerCityWar.cannotSetEnterWar01"),
      );
      FrameCtrlManager.Instance.exit(EmWindow.OuterCityWarEnterWarSettingWnd);
      return;
    }
    if (this._info.enterWar == BooleanType.FALSE) {
      let isDefenceGuild = this.fightModel.checkDefenceGuild(
        this.fightModel.selfGuildId,
      );
      let curEnterCnt = this.fightModel.getGuildPlayerCnt(
        this.fightModel.selfGuildId,
        false,
        BooleanType.TRUE,
      );
      let limitEnterCnt = isDefenceGuild
        ? OuterCityWarModel.MaxDefenceCnt
        : OuterCityWarModel.MaxAttackCnt;

      if (curEnterCnt >= limitEnterCnt) {
        this.btnTick.selected = false;
        let totalGuildCnt = this.fightModel.getGuildPlayerCnt(
          this.fightModel.selfGuildId,
          false,
        );
        let showCnt = Math.min(limitEnterCnt, totalGuildCnt);
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "outerCityWar.enterWarMax",
            showCnt,
          ),
        );
      } else {
        if (this._info.getTotalPetCapaity() == 0) {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation("outerCityWar.notHavePetTeam"),
          );
        }
        OuterCityWarManager.Instance.sendJoinWar(
          this._info.userId,
          BooleanType.TRUE,
        );
      }
    } else {
      OuterCityWarManager.Instance.sendJoinWar(
        this._info.userId,
        BooleanType.FALSE,
      );
    }
  }

  private setNormal(b: boolean) {
    this.imgBg.filters = b ? [] : [UIFilter.grayFilter];
    this.imgJob1.filters = b ? [] : [UIFilter.grayFilter];
    this.imgJob2.filters = b ? [] : [UIFilter.grayFilter];
    this.imgJob3.filters = b ? [] : [UIFilter.grayFilter];
    this.imgPetFlag.filters = b ? [] : [UIFilter.grayFilter];
    this.imgHeroFlag.filters = b ? [] : [UIFilter.grayFilter];
    this.imgTick.filters = b ? [] : [UIFilter.grayFilter];
    let color = b ? ColorConstant.LIGHT_TEXT_COLOR : "#DDDDDD";
    this.txtNickName.color = color;
    this.txtGrade.color = color;
    this.txtCapaity.color = color;
    this.txtPetCapaity.color = color;
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }

  dispose() {
    this.removeEvent();
  }
}
