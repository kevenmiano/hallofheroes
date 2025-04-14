import ByteArray from "../../../../core/net/ByteArray";
import BitArray from "../../../../core/utils/BitArray";
/**
 * 公会职务（权限）数据
 * @author yuanzhan.yu
 */
export class ConsortiaDutyInfo {
  /**
   * levels
   */
  public levels: number = 0;

  /**
   * dutyName
   */
  public dutyName: string;
  public rights: BitArray = new BitArray();

  public static TRANSFER = 1; // 转让会长
  public static UPDATESKILL = 2; // 升级技能
  public static UPDATEBUILDING = 3; // 升级建筑
  public static MOIDIFYBBS = 4; // 修改公告BBS
  public static KICKMEMBER = 5; // 删除成员
  public static LOOKLOG = 6; // 查看日志
  public static DUTYEDIT = 7; // 职位名称编辑
  public static INVITEMEMBER = 8; // 公会邀请
  public static PASSINVITE = 9; //成员审核
  public static PURSE = 10; // 捐献
  public static OPTATIVE = 11; // 祈福
  public static LOOKBBS = 12; // 查看公告
  public static USESKILL = 13; // 使用技能
  public static USESTORE = 14; // 使用保管箱
  public static USESHOP = 15; // 使用公会商城
  public static QUIT = 16; // 退出公会
  public static LEVEL = 17; // 公会升级
  public static RENAME = 18; // 公会改名
  public static CHANGEDUTY = 19; // 公会职位调整
  public static STACKHEAD_SIGNIN = 20; // 外域公会战报名
  public static STACKHEAD_SENIORGENERAL = 21; // 外域公会战设置大将
  public static STACKHEAD_EDITNOTICE = 22; // 外域公会战修改公告
  public static VIEWMEMBER = 23; // 查看成员信息
  public static INVITELIST = 28; // 查看招聘
  public static MODIFYDESC = 30; // 修改公会描述
  public static INVITEDEL = 31; // 删除申请信息
  public static DISBAND = 32; // 公会解散
  public static OPENAPP = 33; // 公会是否开放
  public static SPEAK = 34; // 公会广播(公会招收)
  public static VOTING = 35; // 公会投票
  public static MOIDIFYGROUPPLACARD = 36; // 修改群公告
  public static EDITWARMEMBER = 37; // 修改公会战成员
  public static OPENALTAR = 38; // 开启魔神祭坛
  public static ALTARBUYSCENE = 39; // 魔神祭坛购买场景
  public static UPGRADE_BOSS = 40; // 升级BOSS
  public static CALL_BOSS = 41; // 召唤BOSS
  public static CALL_TREE = 42; // 召唤神树

  /**
   * 是否拥有该权限
   * @param duty 权限  ConsortiaDutyInfo
   * @returns boolean
   */
  getRightsByIndex(duty: number): boolean {
    if (this.rights) {
      return this.rights.getBit(duty - 1);
    }
    return false;
  }

  constructor() {}
}
