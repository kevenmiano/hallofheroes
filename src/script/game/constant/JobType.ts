/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2020-12-22 15:47:08
 * @LastEditTime: 2024-01-09 11:37:41
 * @LastEditors: jeremy.xu
 * @Description:
 */
import LangManager from "../../core/lang/LangManager";
import { EmPackName } from "./UIDefine";

export class JobType {
  public static NEWCOMER: number = 100; //没选职业的新手
  public static WARRIOR: number = 1; //战士
  public static HUNTER: number = 2; //弓手
  public static WIZARD: number = 3; //法师

  public static getJobMasterType(job: number): number {
    switch (job) {
      case 0:
        break;
      case 1:
      case 4:
        job = 1;
        break;
      case 2:
      case 5:
        job = 2;
        break;
      case 3:
      case 6:
        job = 3;
        break;
    }
    return job;
  }

  public static getJobName(job: number): string {
    switch (job) {
      case 0:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name01",
        );
        break;
      case 1:
      case 4:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name02",
        );
        break;
      case 2:
      case 5:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name03",
        );
        break;
      case 3:
      case 6:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name04",
        );
      case 100:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name06",
        );
        break;
    }
    // throw new Error(LangManager.Instance.GetTranslation("yishi.datas.consant.JobType.Name05"));
    return "";
  }

  /**
   * 1:男战
   * 2:男弓
   * 3:男法
   * 4:女战
   * 5:女弓
   * 6:女法
   */
  public static getJobIcon(job: number): string {
    let url: string = "";
    switch (job) {
      case 0:
        url = "";
        break;
      case 1:
      case 4:
        url = "Icon_Unit_Soldier";
        break;
      case 2:
      case 5:
        url = "Icon_Unit_Archer";
        break;
      case 3:
      case 6:
        url = "Icon_Unit_Master";
        break;
      case 100:
        url = "MysteryMen"; //神秘人
        break;
    }
    return fgui.UIPackage.getItemURL(EmPackName.Base, url);
  }

  public static getDefaultCloakEquipNameByJob(job: number): string {
    if (job == 100) {
      return "";
    }
    return JobType.getDefaultBodyEquipNameByJob(job) + "_cloak";
  }

  public static getDefaultBodyEquipNameByJob(job: number): string {
    if (job == 100) {
      return "swf/avatar/mystery_default_body/2/2.json";
    }
    return JobType.getDefaultJobNameByJob(job) + "body";
  }

  public static getDefaultArmysEquipNameByJob(job: number): string {
    if (job == 100) {
      return "";
    }
    return JobType.getDefaultJobNameByJob(job) + "arms";
  }

  public static getDefaultHairUpByJob(job: number): string {
    if (job == 100) {
      return "";
    }
    return JobType.getDefaultJobNameByJob(job) + "hairup";
  }

  public static getDefaultHairDownByJob(job: number): string {
    if (job == 100) {
      return "";
    }
    return JobType.getDefaultJobNameByJob(job) + "hairdown";
  }

  public static getDefaultMount(): string {
    return "/mount_default";
  }

  public static getDefaultWing(): string {
    return "/wing_default";
  }

  /**
   * 得到对应的坐骑装备
   * @param normal 正常的
   * @return
   *
   */
  public static getMapMountEquipment(normal: string): string {
    if (normal) {
      return normal + "_mount";
    }
    return normal;
  }

  public static getCloakEquipNameByBodyEquip(body: string): string {
    return body + "_cloak";
  }

  private static getDefaultJobNameByJob(job: number): string {
    switch (job) {
      //測試
      // case 0:
      // case 1:
      // case 2:
      // case 3:
      // case 4:
      // case 5:
      // case 6:
      // case 100:
      //     return "/wizard_default_";
      //     break;
      // 正式的
      case 0:
        return LangManager.Instance.GetTranslation(
          "yishi.datas.consant.JobType.Name01",
        );
        break;
      case 1:
      case 4:
        return "/warrior_default_";
        break;
      case 2:
      case 5:
        return "/hunter_default_";
        break;
      case 3:
      case 6:
        return "/wizard_default_";
        break;
      case 100:
        return "/wizard_default_";
        break;
    }
    return "";
  }
}
