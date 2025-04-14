/**
 * @author:jeremy.xu
 * @data: 2020-11-30 11:00
 * @description  射箭技能中的涟漪效果预先创建类.  好像从来没有使用到？？？
 * 该类根据使用到的技能预先将涟漪效果创建成位图影片.
 **/
import { BattleManager } from "../../BattleManager";
import { ActionTemplateData } from "../mode/ActionTemplateData";
import { SkillFrameData } from "../mode/framedata/SkillFrameData";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { MovieClip } from "../../../component/MovieClip";
import { ConfigType } from "../../../constant/ConfigDefine";
import { ActionPresentType } from "../../../constant/SkillSysDefine";

export class RipplePreCreater {
  private static resArr: any[] = [];

  /**
   * 创建位图影片.
   * @param skillIds
   * @param callback
   * @return
   *
   */
  public static create(skillIds: any[], callback: Function): any[] {
    if (!skillIds) {
      return [];
    }
    let len: number = skillIds.length;
    let id: number = 0;
    let skillTempInfo: t_s_skilltemplateData;
    let actionData: ActionTemplateData;
    let ripple: string;

    for (let i: number = 0; i < len; i++) {
      id = skillIds[i];
      if (id != 0 && id != -1) {
        skillTempInfo = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_skilltemplate,
          String(id),
        );
        if (skillTempInfo) {
          actionData =
            ConfigMgr.Instance.actionTemplate2[skillTempInfo.ActionId];
          if (
            actionData &&
            actionData.presentType == ActionPresentType.SHOOT_ACTION
          ) {
            actionData.frames.forEach((frame: SkillFrameData) => {
              if (frame.shootData) {
                ripple = frame.shootData.rippleRes;
                if (ripple && ripple != "") {
                  if (RipplePreCreater.resArr.indexOf(ripple) == -1) {
                    RipplePreCreater.resArr.push(ripple);
                    RipplePreCreater.createOne(ripple);
                  }
                }
              }
            });
          }
        }
      }
    }
    return RipplePreCreater.resArr;
  }
  public static addRippleId(linkName: string) {
    if (RipplePreCreater.resArr.indexOf(linkName) == -1) {
      RipplePreCreater.resArr.push(linkName);
    }
  }
  private static createOne(linkName: string) {
    let mc: MovieClip = BattleManager.Instance.resourceModel.getEffectMC(
      linkName,
    ) as MovieClip;
    // let bmMovie : SimpleBitmapMovieClip = new SimpleBitmapMovieClip(mc,linkName,true, false)
    // bmMovie.stop();
    // bmMovie.dispose();
  }
  /**
   * 清除(战斗结束时调用).
   */
  public static clear() {
    RipplePreCreater.resArr.forEach((ripple) => {
      // SimpleBitmapMovieClip.disposeBitmapMovieClip(ripple);
    });
    RipplePreCreater.resArr = [];
  }
}
