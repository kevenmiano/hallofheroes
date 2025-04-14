/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-11 14:44:04
 * @LastEditTime: 2024-01-03 18:11:42
 * @LastEditors: jeremy.xu
 * @Description: 使用技能时, 播放技能名称的容器
 */

import { BattleModel } from "../../../battle/BattleModel";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { BattleNotic } from "../../../constant/event/NotificationEvent";
import { EmPackName } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUIHelper from "../../../utils/FUIHelper";
import AppellModel from "../../appell/AppellModel";
import BattleWnd from "../BattleWnd";

export class SkillNameHandler {
  private _skillNameMC: fgui.GMovieClip;

  private wnd: BattleWnd;
  constructor(wnd: BattleWnd) {
    this.wnd = wnd;
    NotificationManager.Instance.addEventListener(
      BattleNotic.SHOW_SKILL_NAME,
      this.showSkill.bind(this),
      this,
    );
  }

  private showSkill(data: any) {
    var skillTemp: t_s_skilltemplateData =
      TempleteManager.Instance.getSkillTemplateInfoById(data);
    if (skillTemp) {
      if (!this._skillNameMC) {
        this._skillNameMC = FUIHelper.createFUIInstance(
          EmPackName.Battle,
          "AssetBattleSkillNameCom",
        );
      } else {
        if (this._skillNameMC.parent) {
          this._skillNameMC.displayObject.removeSelf();
        }
        this._skillNameMC.dispose();
        this._skillNameMC = null;
        this._skillNameMC = FUIHelper.createFUIInstance(
          EmPackName.Battle,
          "AssetBattleSkillNameCom",
        );
      }
      let skillNameMovie: fairygui.Transition = this._skillNameMC.asCom
        .getChild("movieClip")
        .asCom.getTransition("tranAssetBattleSkillNameMC");
      //使用文字模式
      let skillName: fgui.GTextField =
        this._skillNameMC.asCom.getChild("skillNameText").asTextField;
      skillName.text = skillTemp.SkillTemplateName;
      skillName.color = AppellModel.getTextColorAB(15);
      skillNameMovie.play(Laya.Handler.create(this, this.endFrameFun), 1, 0, 0);
      this.wnd.addChildAt(
        this._skillNameMC.displayObject,
        BattleModel.ZIndex_Bottom,
      );
      this._skillNameMC.x = (this.wnd.width - this._skillNameMC.width) / 2;
      this._skillNameMC.y =
        (this.wnd.height - this._skillNameMC.height) / 2 - 120;
    }
  }

  private endFrameFun() {
    if (this._skillNameMC) {
      let skillName: fgui.GTextField =
        this._skillNameMC.asCom.getChild("skillNameText").asTextField;
      Laya.Tween.to(
        skillName,
        { scaleX: 1.2, scaleY: 1.2, alpha: 0 },
        250,
        undefined,
        Laya.Handler.create(this, () => {
          if (this._skillNameMC) {
            if (this._skillNameMC.parent) {
              this._skillNameMC.displayObject.removeSelf();
            }
            this._skillNameMC.dispose();
            this._skillNameMC = null;
          }
        }),
      );
    }
  }

  public dispose() {
    this.endFrameFun();
    NotificationManager.Instance.removeEventListener(
      BattleNotic.SHOW_SKILL_NAME,
      this.showSkill,
      this,
    );
  }
}
