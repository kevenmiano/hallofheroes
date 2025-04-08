import LangManager from "../../core/lang/LangManager";
import ForgeData from "../module/forge/ForgeData";

export class GoodsHelp {
  public static WHITE: number = 1;
  public static GREEN: number = 2;
  public static BLUE: number = 3;
  public static PURPLE: number = 4;
  public static ORANGE: number = 5;
  public static RED: number = 6;

  public static getGoodQualityName(id: number): string {
    var str: string;
    switch (id) {
      case GoodsHelp.WHITE:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName01"
        );
        break;
      case GoodsHelp.GREEN:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName02"
        );
        break;
      case GoodsHelp.BLUE:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName03"
        );
        break;
      case GoodsHelp.PURPLE:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName04"
        );
        break;
      case GoodsHelp.ORANGE:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName05"
        );
        break;
      case GoodsHelp.RED:
        str = LangManager.Instance.GetTranslation(
          "yishi.utils.GoodsHelp.getGoodQualityName06"
        );
    }
    return str;
  }

  public static getGoodColorString(value: number): string {
    var str: string;
    switch (value) {
      case GoodsHelp.WHITE:
        str = "#ffffff";
        break;
      case GoodsHelp.GREEN:
        str = "#59cd41";
        break;
      case GoodsHelp.BLUE:
        str = "#32a2f8";
        break;
      case GoodsHelp.PURPLE:
        str = "#a838f7";
        break;
      case GoodsHelp.ORANGE:
        str = "#eb9504";
        break;
      case GoodsHelp.RED:
        str = "#ce0f0f";
    }
    return str;
  }

  public static getJewelEffecyByGrade(value: number): number {
    if (value <= 50) {
      return value * 2;
    } else if (value <= 70) {
      return (value - 50) * 3 + 100;
    } else if (value <= 80) {
      return (value - 70) * 4 + 160;
    }
    return 0;
  }

  public static getMouldAddition(value: number, grade: number): number {
    if (value == 0) {
      return 0;
    }
    if (grade <= 80) {
      return Math.floor(value * grade * 0.3);
    } else if (
      grade > ForgeData.MOULD_MAX_GRADE &&
      grade <= ForgeData.MOULD_MAX_GRADE_SENIOR
    ) {
      return (
        Math.ceil(value * ForgeData.MOULD_MAX_GRADE * 0.3) +
        Math.ceil(value * (grade - ForgeData.MOULD_MAX_GRADE) * 0.4)
      );
    } //9.2需求。161级以后属性提升系数改为0.1
    else
      return (
        Math.ceil(value * ForgeData.MOULD_MAX_GRADE * 0.3) +
        Math.ceil(value * ForgeData.MOULD_MAX_GRADE * 0.4) +
        Math.ceil(value * (grade - ForgeData.MOULD_MAX_GRADE_SENIOR) * 0.25)
      );
  }

  public static getConciseValue(value: number, grade: number): number {
    return Math.ceil((value * grade * 5) / 100);
  }
}
