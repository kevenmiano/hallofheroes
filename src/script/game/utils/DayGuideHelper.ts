import { DateFormatter } from "../../core/utils/DateFormatter";
import LeedInfo from "../module/welfare/data/LeedInfo";

/**
 * @author:pzlricky
 * @data: 2021-06-24 17:37
 * @description ***
 */
export default class DayGuideHelper {
  public static readLeedInfo(info): LeedInfo {
    var temp: LeedInfo = new LeedInfo();
    temp.templateId = info.templateId;
    temp.userId = info.userId;
    temp.currentCount = info.currentCount;
    temp.beginDate = DateFormatter.parse(info.beginDate, "YYYY-MM-DD hh:mm:ss");
    temp.isComplete = info.isComplete;
    return temp;
  }
}
