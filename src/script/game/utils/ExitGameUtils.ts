import { ArmyManager } from "../manager/ArmyManager";
import { CampaignManager } from "../manager/CampaignManager";
import { PlayerManager } from "../manager/PlayerManager";
import BuildingManager from "../map/castle/BuildingManager";
import BuildingType from "../map/castle/consant/BuildingType";
import { BuildInfo } from "../map/castle/data/BuildInfo";
import LangManager from "../../core/lang/LangManager";
import DayGuideManager from "../manager/DayGuideManager";

export default class ExitGameUtils {
  public setup() {
    // if (ExternalInterface.available) {
    // 	ExternalInterface.addCallback("getUnfinishedInfo", getUnfinishedInfo);
    // }
  }
  public getUnfinishedInfo(): string {
    var infoArr: any[] = [];
    var str: string = "";
    var buildInfo: BuildInfo =
      BuildingManager.Instance.getBuildingInfoBySonType(
        BuildingType.OFFICEAFFAIRS,
      );
    var num: number = buildInfo ? buildInfo.property2 - buildInfo.property1 : 0;
    var grade: number = ArmyManager.Instance.thane.grades;
    if (num > 0 && grade >= 14) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary06",
        num,
      );
      infoArr.push(str);
    }
    num = BuildingManager.Instance.model.colosseumOrderList[0].remainCount;
    if (num > 0 && grade >= 13) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary02",
        num,
      );
      infoArr.push(str);
    }
    num =
      PlayerManager.Instance.currentPlayerModel.towerInfo1.maxEnterCount -
      PlayerManager.Instance.currentPlayerModel.towerInfo1.enterCount;
    if (num > 0 && grade >= 23) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary03",
        num,
      );
      infoArr.push(str);
    }
    num = PlayerManager.Instance.currentPlayerModel.playerInfo.multiCopyCount;
    if (num > 0 && grade >= 20) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary04",
        num,
      );
      infoArr.push(str);
    }
    num = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
    if (num > 0) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary01",
        num,
      );
      infoArr.push(str);
    }
    num = DayGuideManager.Instance.remainRewardCount;
    if (num > 0 && grade >= 17) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary05",
        num,
      );
      infoArr.push(str);
    }
    num = CampaignManager.Instance.mapModel
      ? CampaignManager.Instance.mapModel.hookleftWeay
      : 0;
    if (num > 0 && grade >= 21) {
      str = LangManager.Instance.GetTranslation(
        "yishi.utils.ExitGameUtils.weary08",
        num,
      );
      infoArr.push(str);
    }
    var info: string = "";
    if (infoArr.length > 0) {
      info = infoArr.join("\r\n");
    }
    return info;
  }
}
