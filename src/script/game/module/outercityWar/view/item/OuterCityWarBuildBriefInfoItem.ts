//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-28 11:48:36
 * @Description: 场景中建筑信息简化显示Item
 */

import FUI_OuterCityWarBuildBriefInfoItem from "../../../../../../fui/OuterCityWar/FUI_OuterCityWarBuildBriefInfoItem";
import Logger from "../../../../../core/logger/Logger";
import ColorConstant from "../../../../constant/ColorConstant";
import { CampType } from "../../../../constant/Const";
import {
  EmOuterCityWarBuildSortType,
  EmOuterCityWarBuildSiteState,
  EmOuterCityWarCastlePeriodType,
} from "../../../../constant/OuterCityWarDefine";
import { OuterCityWarManager } from "../../control/OuterCityWarManager";
import { OuterCityWarBuildInfo } from "../../model/OuterCityWarBuildInfo";
import { OuterCityWarModel } from "../../model/OuterCityWarModel";

export default class OuterCityWarBuildBriefInfoItem extends FUI_OuterCityWarBuildBriefInfoItem {
  protected initedBuildStyle: boolean;

  public _sonType: number;
  public set sonType(v: number) {
    this._sonType = v;
  }
  public get sonType(): number {
    return this._sonType;
  }

  private _info: OuterCityWarBuildInfo;
  public set info(value: OuterCityWarBuildInfo) {
    this._info = value;
    this.refreshView();
  }

  public get info(): OuterCityWarBuildInfo {
    return this._info;
  }

  public setName(str: string) {
    this.txtName.text = str;
    this.imgNameBg.visible = Boolean(str);
  }

  public refreshView() {
    if (this._info) {
      if (this._info.sonType == 1514) {
        Logger.info("测试");
      }

      this.refreshBuildStyle();
      this.setName(this._info.buildName);
      if (this._info.isAttackSite) {
        let color = this._info.isRepulsed
          ? ColorConstant.RED_COLOR
          : ColorConstant.LIGHT_TEXT_COLOR;
        if (
          this.fightModel.castleState ==
            EmOuterCityWarCastlePeriodType.Fighting &&
          this._info.attackGuildId <= 0
        ) {
          color = ColorConstant.RED_COLOR;
        }
        this.txtName.color = color;
      } else {
        for (let index = 0; index < OuterCityWarModel.BuildSiteCount; index++) {
          let siteInfo = this._info.siteInfoList[index];
          if (!siteInfo) continue;
          let item = this["item" + index];
          if (!item) continue;

          item.visible = true;
          let c = item.getController("cOccupyState") as fgui.Controller;
          if (siteInfo.playerInfo) {
            if (siteInfo.playerInfo.camp == CampType.Defence) {
              c.setSelectedIndex(2);
            } else if (siteInfo.playerInfo.camp == CampType.Attack) {
              c.setSelectedIndex(1);
            }
          } else {
            c.setSelectedIndex(0);
          }
        }
      }
    } else {
      this.setName("");
    }
  }

  /** 建筑类型是不变的 只初始化一次信息显示样式 */
  private refreshBuildStyle() {
    if (!this.sonType) {
      return;
    }
    if (this.initedBuildStyle) {
      return;
    }

    let type = this._info.buildSortType;
    let isAttackSite = this.info.isAttackSite;
    this.imgNameBg.alpha = isAttackSite ? 0.7 : 1;
    this.gOppcState.visible = !isAttackSite;
    if (!isAttackSite) {
      for (let index = 0; index < OuterCityWarModel.BuildSiteCount; index++) {
        const element = this["item" + index];
        let c = element.getController("cType") as fgui.Controller;
        if (type == EmOuterCityWarBuildSortType.Hero) {
          c.setSelectedIndex(0);
        } else if (type == EmOuterCityWarBuildSortType.Pet) {
          c.setSelectedIndex(1);
        }
      }
    }
    this.initedBuildStyle = true;
  }

  private get fightModel(): OuterCityWarModel {
    return OuterCityWarManager.Instance.model;
  }
}
