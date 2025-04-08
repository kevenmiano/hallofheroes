// TODO FIX
import { PlayerModel } from "../datas/playerinfo/PlayerModel";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { PlayerManager } from "../manager/PlayerManager";
import EmailInfo from "../module/mail/EmailInfo";
import LangManager from "../../core/lang/LangManager";

import MailInfoMsg = com.road.yishi.proto.mail.MailInfoMsg;
import { StarManager } from "../manager/StarManager";
import { StarBagType } from "../constant/StarDefine";

export default class EmailHelp {
  public static BagNewCount: number;
  public EmailHelp() {}
  public static checkCanGetGoods(): number {
    EmailHelp.BagNewCount = GoodsManager.Instance.getEmputyPosCount();
    if (!EmailHelp.BagNewCount) {
      var str: string = LangManager.Instance.GetTranslation(
        "emailII.help.EmailHelp.command01"
      );
      MessageTipManager.Instance.show(str);
      return -1;
    }
    return EmailHelp.BagNewCount;
  }

  public static checkCanGetStart(): number {
    var playerStarNum: number = StarManager.Instance.getPlayerStarListNum();
    var starBagCount: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.starBagCount;
    var count: number =
      PlayerModel.ORIGINAL_OPEN_BAG_COUNT + starBagCount - playerStarNum;
    if (!count) {
      var str: string = LangManager.Instance.GetTranslation(
        "emailII.help.EmailHelp.command02"
      );
      MessageTipManager.Instance.show(str);
      return -1;
    }
    return count;
  }

  public static transferToMailInfo(info: MailInfoMsg): EmailInfo {
    var mail: EmailInfo;
    if (info) {
      mail = new EmailInfo();
      mail.Id = info.id;
      mail.MailType = info.mailType;
      mail.SendId = info.sendId;
      mail.SendNickName = info.sendNickName;
      mail.SendPlayerGrade = info.sendPlayerGrades;
      mail.ReceiveId = info.receiveId;
      mail.ReceiveNickName = info.receiveNickName;
      mail.SendDate = info.sendDate;
      mail.ReadDate = info.readDate;
      mail.Title = info.title;
      mail.Contents = info.contents;
      mail.RemoveDate = info.removeDate;
      mail.ValidityDate = info.validityDate;
      mail.Annex1 = info.annex1;
      mail.Annex1Name = info.annex1Name;
      mail.Annex1Count = info.annex1Count;
      mail.Annex1Grade = info.annex1Grade;
      mail.IsAnnex1 = info.isAnnex1;
      mail.Annex2 = info.annex2;
      mail.Annex2Name = info.annex2Name;
      mail.Annex2Count = info.annex2Count;
      mail.Annex2Grade = info.annex2Grade;
      mail.IsAnnex2 = info.isAnnex2;
      mail.Annex3 = info.annex3;
      mail.Annex3Name = info.annex3Name;
      mail.Annex3Count = info.annex3Count;
      mail.Annex3Grade = info.annex3Grade;
      mail.IsAnnex3 = info.isAnnex3;
      mail.Annex4 = info.annex4;
      mail.Annex4Name = info.annex4Name;
      mail.Annex4Count = info.annex4Count;
      mail.Annex4Grade = info.annex4Grade;
      mail.IsAnnex4 = info.isAnnex4;
      mail.Annex5 = info.annex5;
      mail.Annex5Name = info.annex5Name;
      mail.Annex5Count = info.annex5Count;
      mail.Annex5Grade = info.annex5Grade;
      mail.IsAnnex5 = info.isAnnex5;
      mail.IsExist = info.isExist;
      mail.Params = info.params;
    }
    return mail;
  }
}
