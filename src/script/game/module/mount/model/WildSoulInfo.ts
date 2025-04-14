//@ts-expect-error: External dependencies
import { t_s_mounttemplateData } from "../../../config/t_s_mounttemplate";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";

export class WildSoulInfo {
  public templateId: number = 0;
  public isExist: boolean = false;
  public expairDate: Date;
  public activeDate: Date;
  public param1: number = 0;
  public param2: number = 0;
  public mountType: number = 0;
  public starLevel: number = 0; //最新星级
  public blessing: number = 0; //祝福值
  public static millisecondsPerDay: number = 1000 * 60 * 60 * 24;
  public oldStarLevel: number = 0; //老的星级
  /**
   * 剩余有效天数
   * @return
   *
   */
  public get validity(): number {
    if (this.expairDate.getFullYear() == 2000) return -1;
    var sysDate: Date = PlayerManager.Instance.currentPlayerModel.sysCurtime;
    var day: number = Math.ceil(
      (this.expairDate.getTime() - sysDate.getTime()) /
        WildSoulInfo.millisecondsPerDay,
    );
    return day;
  }

  public get template(): t_s_mounttemplateData {
    return TempleteManager.Instance.getMountTemplateById(this.templateId);
  }
}
