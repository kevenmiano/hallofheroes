/*
 * @Author: jeremy.xu
 * @Date: 2021-07-22 14:54:17
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-22 15:13:12
 * @Description:
 */

import FUI_ConsortiaEventItem from "../../../../../../fui/Consortia/FUI_ConsortiaEventItem";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { ConsortiaEventInfo } from "../../data/ConsortiaEventInfo";

export class ConsortiaEventItem extends FUI_ConsortiaEventItem {
  private _info: ConsortiaEventInfo;
  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: ConsortiaEventInfo) {
    this._info = <ConsortiaEventInfo>value;
    if (this._info) {
      if (this._info.remark.indexOf("|") >= 0) {
        this.tfEvent.text =
          "<font color='#ffffff'>" +
          DateFormatter.timeFormat1(this._info.createDate) +
          " </font>" +
          this.decode(this._info.remark);
        return;
      }
      this.tfEvent.text =
        "<font color='#ffffff'>" +
        DateFormatter.timeFormat1(this._info.createDate) +
        " </font>" +
        this._info.remark;
    } else {
      this.tfEvent.text = "";
    }
  }

  public get info(): ConsortiaEventInfo {
    return this._info;
  }

  private decode(str: string): string {
    var arr: any[] = str.split("|");
    switch (this._info.types) {
      case ConsortiaEventInfo.JOIN_CONSORTIA:
      case ConsortiaEventInfo.KICK:
        return (
          "<font color='#fc7d00'>" +
          arr[0] +
          "</font>" +
          arr[1] +
          "<font color='#fc7d00'>" +
          arr[2] +
          "</font>" +
          arr[3]
        );
      case ConsortiaEventInfo.QUIT:
        return "<font color='#fc7d00'>" + arr[0] + "</font>" + arr[1];
      case ConsortiaEventInfo.CONSORTIA_UPGRADE:
        return "<font color='#f1c143'>" + arr[0] + "</font>" + arr[1];
      case ConsortiaEventInfo.SKILL_UPGRADE:
      case ConsortiaEventInfo.BUILDING_UPGRADE:
        return arr[0] + "<font color='#f1c143'>" + arr[1] + "</font>" + arr[2];
      case ConsortiaEventInfo.CHANGE:
        return arr[0] + "<font color='#f1c143'>" + arr[1] + "</font>" + arr[2];
      case ConsortiaEventInfo.DEDUCT:
        return "<font color='#fc7d00'>" + arr[0] + "</font> ";
      case ConsortiaEventInfo.EVENT:
        if (arr.length == 3) {
          return (
            arr[0] + "<font color='#fc7d00'>" + arr[1] + "</font>" + arr[2]
          );
        }
        return arr[0];
      case ConsortiaEventInfo.SPEED:
        return "<font color='#fc7d00'>" + arr[0] + "</font>" + arr[1];
      case ConsortiaEventInfo.CONSORTIA_PICK_FRUIT:
        return arr[0];
      case ConsortiaEventInfo.CHAIRMAN_SEND:
        return (
          "<font color='#fc7d00'>" +
          arr[0] +
          "</font>" +
          arr[1] +
          "<font color='#fc7d00'>" +
          arr[2] +
          "</font>" +
          arr[3] +
          "<font color='#fc7d00'>" +
          arr[4] +
          "</font> "
        );
      default:
        return arr[0];
    }
  }
}
