import XmlMgr from "../../core/xlsx/XmlMgr";
import BattleInfo from "../module/mail/BattleInfo";

/**
 * @author:pzlricky
 * @data: 2021-04-13 16:16
 * @description ***
 */
export default class BattleReportHelp {
  constructor() {}

  public static covertToBattleInfo(battleInfo: string): BattleInfo {
    let dataObject = XmlMgr.Instance.decode(battleInfo);
    var battleReport: BattleInfo = new BattleInfo();
    let info = dataObject.infos.info;
    let me = dataObject.infos.me;
    let he = dataObject.infos.he;
    battleReport.type = info.type;
    battleReport.time = info.time;
    if (battleReport.type == 2) {
      battleReport.content = info.content;
    } else {
      battleReport.camp = info.camp;
      battleReport.result = info.result;
      battleReport.playerName = info.playerName;
      battleReport.siteName = info.siteName;
      battleReport.pos = info.pos;
      battleReport.mapId = info.mapId;
      battleReport.selfHeroId = Number(me.heroId);
      battleReport.selfSite1Name = me.site1Name;
      battleReport.selfSite1Count = me.site1Count;
      battleReport.selfSite2Name = me.site2Name;
      battleReport.selfSite2Count = me.site2Count;
      battleReport.selfStrengry = me.strategy;
      battleReport.selfGold = Number(me.gold);
      battleReport.selfFight = me.fight;
      battleReport.selfGrade = me.grade;
      battleReport.selfCrystal = Number(me.crystal);
      battleReport.enemyHeroId = he.heroId;
      battleReport.enemySite1Name = he.site1Name;
      battleReport.enemySite1Count = he.site1Count;
      battleReport.enemySite2Name = he.site2Name;
      battleReport.enemySite2Count = he.site2Count;
      battleReport.enemyStrengry = he.strategy;
      battleReport.enemyGold = Number(he.gold);
      battleReport.enemyFight = he.fight;
      battleReport.enemyGrade = he.grade;
      battleReport.enemyCrystal = Number(he.crystal);
    }
    return battleReport;
  }
}
