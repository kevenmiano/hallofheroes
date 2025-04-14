/*
 * @Author: jeremy.xu
 * @Date: 2021-07-22 14:54:17
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:15:04
 * @Description:
 */

import FUI_ConsortiaContributeRankItem from "../../../../../../fui/Consortia/FUI_ConsortiaContributeRankItem";
import { EmPackName } from "../../../../constant/UIDefine";
import RankData from "../../../rank/RankData";
import { ConsortiaUserInfo } from "../../data/ConsortiaUserInfo";

export class ConsortiaContributeRankItem extends FUI_ConsortiaContributeRankItem {
  private _info: ConsortiaUserInfo;
  public isHistory: boolean;
  public index: number = 0;

  public set info(value: ConsortiaUserInfo) {
    this._info = <ConsortiaUserInfo>value;
    if (this._info) {
      this.txt1.text = this.index <= 3 ? "" : String(this.index);
      this.txt2.text = String(this._info.nickName);
      this.txt3.text = String(
        this.isHistory ? this._info.totalOffer : this._info.todayOffer,
      );
      this.imgRank.url =
        this.index <= 3
          ? fgui.UIPackage.getItemURL(
              EmPackName.Base,
              RankData.RankRes[this.index - 1],
            )
          : "";
    } else {
      this.txt1.text = "";
      this.txt2.text = "";
      this.txt3.text = "";
      this.imgRank.url = "";
    }
  }

  public setdata(
    index: number,
    value: ConsortiaUserInfo,
    isHistory: boolean = true,
  ) {
    this.index = index;
    this.isHistory = isHistory;
    this.info = value;
  }

  public get info(): ConsortiaUserInfo {
    return this._info;
  }
}
