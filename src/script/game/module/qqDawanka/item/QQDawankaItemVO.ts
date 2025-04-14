//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import { t_s_qqgradeprivilegeData } from "../../../config/t_s_qqgradeprivilege";
import QQDawankaManager from "../../../manager/QQDawankaManager";

export default class QQDawankaItemVO {
  public data: t_s_qqgradeprivilegeData = null;
  //Privilegename(名字)
  public Privilegename: string = "";
  //Grade(特权等级)
  //Privilegetype(特权种类)
  public Privilegetype: number;
  //Para1(参数1)
  public Para1: number;
  public Para2: number;
  public Grade: number = 0;

  public rewards: string = "";

  public code: number = 0;

  btnGetVisible: boolean = true;
  btnJumpVisible: boolean = true;
  btnGrayVisible: boolean;

  constructor(type: number, name: string, parm1?: number, parm2?: number) {
    this.Privilegetype = type;
    this.Privilegename = name;
    this.Para1 = parm1;
    this.Para2 = parm2;
  }

  // 1	充值加赠特权
  // 2	游券礼包特权
  // 3	生日特权
  // 4	专属客服
  // 5	充值共享特权
  // 6	玩咖交流圈子特权
  // 7    高阶玩咖特权
  // 8    绝版专享特权
  // 9    专属周礼特权

  getStr() {
    let str1 = "";
    let str2 = "";
    switch (this.Privilegetype) {
      case 1:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.level1"); //'充值加赠特权';
        str2 = LangManager.Instance.GetTranslation(
          "QQ.Hall.Dawanka.voStr1",
          this.Para1,
        ); //'充值加赠钻石{0}%';  //Para1
        if (this.Para2 > 0) {
          str2 += LangManager.Instance.GetTranslation(
            "QQ.Hall.Dawanka.voStr2",
            this.Para2,
          ); //',每月可用优惠{0}次';  //Para2
        }
        break;
      case 2:
        str1 = LangManager.Instance.GetTranslation(
          "QQ.Hall.Dawanka.voStr3",
          this.Para1,
        ); //'每月可领{0}次'; //Para1
        str2 = LangManager.Instance.GetTranslation(
          "QQ.Hall.Dawanka.voStr4",
          10,
          100,
          1,
        ); //'{0}元游券, 满{1}元可用*{2}';
        break;
      case 3:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr5"); //'每年可领1次';
        str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr6"); //'生日当天解锁特权, 领取您的专属礼包';
        break;
      case 4:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr7"); //'获取专属服务特权';
        str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr8"); //'优先解答您的疑问\n为您解决游戏问题';
        break;
      case 5:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr9"); //'绑定好友账号';
        str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr10"); //'共享充值加赠{0}%特权';
        break;
      case 6:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr11"); //'获取专属服务特权';
        str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr12"); //'可在圈子交流专区反馈';
        if (this.Para2 == 1) {
          str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr13"); //'1V1专属客服进行解答';
        }
        break;
      case 7:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr14"); //'抢先体验等级权益';
        str2 = LangManager.Instance.GetTranslation(
          "QQ.Hall.Dawanka.voStr15",
          1,
        ); //'可领取特权卡*{0},体验下一等级权益';
        break;
      case 8:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.level8"); //'绝版专享特权';
        str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr16"); //'首次达到条件即可点击领取';
        break;
      case 9:
        str1 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr17"); //'每周可领1次';
        str2 = LangManager.Instance.GetTranslation("QQ.Hall.Dawanka.voStr18"); //'礼包涵盖游戏内各类道具';
        break;
      default:
        break;
    }
    return [str1, str2];
  }

  // 1001	游券礼包特权
  // 1002	高阶玩咖特权
  // 1003	生日专属特权
  // 1004	专属服务特权
  // 1005	充值共享特权
  // 1006	特权获取说明

  getCode() {
    switch (this.Privilegetype) {
      case 2:
        return 1001;
      case 7:
        return 1002;
      case 3:
        return 1003;
      case 4:
        return 1004;
      case 6:
        return 1004;
      case 5:
        return 1005;
      default:
        break;
    }
  }

  getType() {
    if (this.Privilegetype == 8) {
      return 1;
    } else {
      return 0;
    }
  }

  // getBtnState() {
  //     if (!QQDawankaManager.Instance.model.getUnlock()) {
  //         this.btnGetVisible = false;
  //         this.btnJumpVisible = false;
  //         this.btnGrayVisible = false;
  //         return;
  //     }
  //     if (this.Privilegetype == 8 || this.Privilegetype == 9) {
  //         // this.btnGetVisible = true;
  //         this.btnJumpVisible = false;
  //         let type = 0;
  //         if (this.Privilegetype == 8) {
  //             type = 1;
  //         }
  //         let gray = QQDawankaManager.Instance.model.getGiftState(type);
  //         this.btnGrayVisible = gray;
  //         this.btnGetVisible = !gray;
  //     } else {
  //         this.btnJumpVisible = true;
  //         this.btnGetVisible = false;
  //         this.btnGrayVisible = false;
  //     }
  // }
}
