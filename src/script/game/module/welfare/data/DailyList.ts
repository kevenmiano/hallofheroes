//@ts-expect-error: External dependencies
import Dictionary from "../../../../core/utils/Dictionary";
import { ConfigManager } from "../../../manager/ConfigManager";
import DailyItemInfo from "./DailyItemInfo";
import LangManager from "../../../../core/lang/LangManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";

/**
 * 日常活动的数据列表（原始的列表）
 * */
export default class DailyList {
  private _infoList: Array<DailyItemInfo> = [];
  private _dic: Dictionary;

  public get infoList(): Array<DailyItemInfo> {
    this.getTemplateList();
    return this._infoList;
  }
  /***
   * 从模版取得日常活动的数据列表
   * */
  private getTemplateList() {
    this._infoList = [];
    this._dic = TempleteManager.Instance.getActiveTemplates();
    let itemInfo: DailyItemInfo;
    let info: DailyItemInfo;
    for (const key in this._dic) {
      if (Object.prototype.hasOwnProperty.call(this._dic, key)) {
        itemInfo = this._dic[key];
        info = new DailyItemInfo();
        info = itemInfo;
        if (info == null) continue;
        if (info.TemplateId == "7") continue; //祝福轮盘开关
        info.condition =
          LangManager.Instance.GetTranslation("public.grade") +
          "≥" +
          LangManager.Instance.GetTranslation(
            "public.level4_space2",
            info.Levels,
          );
        switch (info.TemplateId) {
          case "1": //赤眼狼王
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward01",
            );
            info.starCount = 5;
            break;
          case "2": //多人竞技1
          case "10": //多人竞技2
            info.condition =
              LangManager.Instance.GetTranslation("public.grade") +
              "≥" +
              LangManager.Instance.GetTranslation(
                "dayGuide.data.DailyList.level01",
                info.Levels,
              );
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward02",
            );
            info.starCount = 4;
            break;
          case "3": //狂暴魔虫
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward01",
            );
            info.starCount = 5;
            break;
          case "4": //战场
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward04",
            );
            info.starCount = 4;
            break;
          case "5": //幽冥骨龙
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward01",
            );
            info.starCount = 5;
            break;
          case "6": //英雄之门
            info.condition =
              LangManager.Instance.GetTranslation("public.grade") +
              "≥" +
              LangManager.Instance.GetTranslation(
                "dayGuide.data.DailyList.level02",
                info.Levels,
              );
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward06",
            );
            info.starCount = 5;
            break;
          case "7": //祝福轮盘
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward07",
            );
            info.starCount = 3;
            break;
          case "8": //个人挑战
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward08",
            );
            info.starCount = 3;
            break;
          case "9": //悬赏任务
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward09",
            );
            info.starCount = 4;
            break;
          case "11": //试练之塔
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward10",
            );
            info.starCount = 5;
            break;
          case "12": //魔灵试炼
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward11",
            );
            info.starCount = 4;
            break;
          case "13": //紫晶矿场
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward12",
            );
            info.starCount = 5;
            break;
          case "14": //英灵竞技
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward13",
            );
            info.starCount = 5;
            break;
          case "15": //环任务
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward14",
            );
            info.starCount = 5;
            break;
          case "16": //藏宝图
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward16",
            );
            info.starCount = 5;
            break;
          case "17": //天穹
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward17",
            );
            info.starCount = 5;
            break;
          case "18": //王者之塔
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward18",
            );
            info.starCount = 5;
            break;
          case "1000": //寻宝
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward1000",
            );
            info.starCount = 5;
            break;
          case "1001": //幽冥骨龙(数据表修改)
            info.reward = LangManager.Instance.GetTranslation(
              "dayGuide.data.DailyList.reward01",
            );
            info.starCount = 5;
          default:
            break;
        }
        this._infoList.push(info);
      }
    }

    this._infoList = ArrayUtils.sortOn(
      this._infoList,
      "Sort",
      ArrayConstant.NUMERIC,
    );
  }
}
