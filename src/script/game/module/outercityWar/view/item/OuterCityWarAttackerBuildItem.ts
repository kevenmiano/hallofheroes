//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-28 15:59:46
 * @Description: 进攻方建筑界面成员列表Item
 */

import LangManager from "../../../../../core/lang/LangManager";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import { EmOuterCityWarPlayerState } from "../../../../constant/OuterCityWarDefine";
import { JobType } from "../../../../constant/JobType";
import { OuterCityWarEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { OuterCityWarPlayerInfo } from "../../model/OuterCityWarPlayerInfo";
import FUI_OuterCityWarAttackerBuildItem from "../../../../../../fui/OuterCityWar/FUI_OuterCityWarAttackerBuildItem";
import ColorConstant from "../../../../constant/ColorConstant";

export default class OuterCityWarAttackerBuildItem extends FUI_OuterCityWarAttackerBuildItem {
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
      OuterCityWarEvent.PLAYER_INFO,
      this.__updatePlayinfo,
      this,
    );
  }

  public removeEvent() {
    NotificationManager.Instance.removeEventListener(
      OuterCityWarEvent.PLAYER_INFO,
      this.__updatePlayinfo,
      this,
    );
  }

  private __updatePlayinfo(playInfo: OuterCityWarPlayerInfo) {
    if (this.info.userId != playInfo.userId) return;
    this.refreshView();
  }

  public refreshView() {
    if (this._info) {
      this.cJob.setSelectedIndex(this._info.job);
      this.txtNickName.text = this._info.userName;
      this.txtGrade.text = this._info.userGrade.toString();
      this.txtCapaity.text = this._info.heroCapaity.toString();
      this.txtDefenceForce.text = this._info.defenseForce.toString();
      this.setNormal(true);
      switch (this._info.state) {
        case EmOuterCityWarPlayerState.FREE:
        case EmOuterCityWarPlayerState.DEFANCE:
          this.txtState.text = LangManager.Instance.GetTranslation(
            "public.playerInfo.defanceState",
          );
          break;
        case EmOuterCityWarPlayerState.REPULSED:
          this.setNormal(false);
          this.txtState.text = LangManager.Instance.GetTranslation(
            "public.playerInfo.repulsedState",
          );
          break;
      }
    } else {
    }
  }

  private setNormal(b: boolean) {
    this.filters = b ? [] : [UIFilter.grayFilter];
    let color = b ? ColorConstant.LIGHT_TEXT_COLOR : "#DDDDDD";
    this.txtNickName.color = color;
    this.txtGrade.color = color;
    this.txtCapaity.color = color;
    this.txtDefenceForce.color = color;
    this.txtState.color = color;
  }

  dispose() {
    this.removeEvent();
  }
}
