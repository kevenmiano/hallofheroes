//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import BitArray from "../../../../core/utils/BitArray";
import Dictionary from "../../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { ConsortiaUpgradeType } from "../../../constant/ConsortiaUpgradeType";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ConsortiaInfo } from "../data/ConsortiaInfo";
import { ConsortiaTempleteInfo } from "../data/ConsortiaTempleteInfo";
import { ConsortiaVotingUserInfo } from "../data/ConsortiaVotingUserInfo";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { ConsortiaSecretInfo } from "../data/ConsortiaSecretInfo";
import { ConsortiaDemonInfo } from "../data/ConsortiaDemonInfo";
import { ConsortiaInviteInfo } from "../data/ConsortiaInviteInfo";
import { ConsortiaUserInfo } from "../data/ConsortiaUserInfo";
import { ConsortiaEventInfo } from "../data/ConsortiaEventInfo";
import ConsortiaAltarBlessInfo from "../data/ConsortiaAltarBlessInfo";
import ConsortiaBossInfo from "../data/ConsortiaBossInfo";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { ConsortiaControler } from "../control/ConsortiaControler";
import ConsortiaPrayInfo from "../data/ConsortiaPrayInfo";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_consortiataskData } from "../../../config/t_s_consortiatask";
import { t_s_consortiataskrewardData } from "../../../config/t_s_consortiataskreward";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import FUIHelper from "../../../utils/FUIHelper";
import { ConsortiaTaskInfo } from "../data/ConsortiaTaskInfo";
import { ConsortiaTaskScoreRewardInfo } from "../data/ConsortiaTaskScoreRewardInfo";
import { ConsortiaTaskType } from "../data/ConsortiaTaskType";
import { FinishStatus } from "../../../constant/Const";
import { NotificationManager } from "../../../manager/NotificationManager";

/**
 * 公会模型
 * @author yuanzhan.yu
 */
export class ConsortiaModel extends GameEventDispatcher {
  private _inviteList: ConsortiaInviteInfo[] = [];
  private _applyList: ConsortiaInviteInfo[] = [];
  private _consortiaList: ConsortiaInfo[] = [];
  private _consortiaContributionList: ConsortiaUserInfo[] = [];
  /**
   * 服务器每次推的数据
   */
  private _applyConsortiaList: ThaneInfo[] = [];
  /***
   * 客户端保存每一次推的数据 也是用来显示的数据
   */
  public applyConsortiaMap: Map<number, ThaneInfo[]> = new Map();
  /**
   *公会Boss信息
   */
  public bossInfo: ConsortiaBossInfo;
  public static CONSORTIA_BOSS_TEMPLATEID = 2007;
  public get applyConsortiaMapList(): ThaneInfo[] {
    let tmp: ThaneInfo[] = [];
    this.applyConsortiaMap.forEach((value, key) => {
      tmp = tmp.concat(value);
    });
    return tmp;
  }
  private _recruitCurrentPage: number = 1;
  private _recruitListTotalPage: number = 1;

  private _openEffectDic: Dictionary;
  private _setTotalRows: number = 1;
  private _contributeListCurrentPage: number = 1;
  private _contributeListTotalPage: number = 1;
  private _alTarBlessLeftTime: number = 0;
  private _consortiaMemberList: SimpleDictionary;
  private _baseSkillList: SimpleDictionary;
  private _highSkillList: SimpleDictionary;
  private _consortiaInfo: ConsortiaInfo;
  private _timeLeft: number = 0;
  private _consortiaDutyList: Dictionary;
  private _usrRights: BitArray;
  private _consortiaEventList: ConsortiaEventInfo[];
  private _altarGoods: GoodsInfo;
  private _lastaltarGoods: GoodsInfo;
  public isCaseHasGoods: boolean = false;
  public bagView: any;
  public todayOffer: number = 0;
  public totalOffer: number = 0;
  public selfOrder: number = 0;
  public nickName: string = "";
  /**
   * 捐献Frame中选中的是否是历史捐献。
   */
  public isHistory: boolean = false;
  /**
   * 祭坛转盘光圈移动的延时时间
   */
  public delayTime: number = 0;
  public recruitOperateNum: number = 0;
  public recruitOperateList: any[] = [];
  public blessInfo: ConsortiaAltarBlessInfo;
  public isBlessing: boolean = false;
  public caseBag: any;
  //候选信息
  private _votingUsers: ConsortiaVotingUserInfo[];
  //是否已经投票
  private _hasVoted: boolean = false;
  private _recruitNum: number = 0;
  private _atcitityList: any[] = [];
  protected _changeObj: SimpleDictionary;

  /**
   * 判断保管箱是否可用
   */
  public caseBagCanUse: boolean = false;
  /**
   * 每人能分配的最大数量
   */
  public currentPrizeListCountMax: number = 10;
  /**
   * 当前正在分配的宝箱id
   */
  public currentPrizeTemplateId: number = 0;
  /**
   * 当前正在分配的宝箱数量
   */
  protected _currentPrizeListCount: number = 0;

  private _isFlag: boolean = false;

  public static ACTIVITY_INFO_TYPE11: number = 11; //商城
  public static ACTIVITY_INFO_TYPE12: number = 12; //技能塔
  public static ACTIVITY_INFO_TYPE13: number = 13; //祭坛
  public static ACTIVITY_INFO_TYPE14: number = 14; //公会任务

  public static ACTIVITY_INFO_TYPE1: number = 1; //公会秘境
  public static ACTIVITY_INFO_TYPE2: number = 2; //公会BOSS
  public static ACTIVITY_INFO_TYPE3: number = 3; //公会战
  public static ACTIVITY_INFO_TYPE4: number = 4; //宝藏矿脉
  public static ACTIVITY_INFO_TYPE5: number = 5; //敬请期待

  public commPrayGoodsList: Dictionary; //普通祈福物品列表
  public highPrayGoodsList: Dictionary; //高级祈福物品列表
  public commAltarCount: number = 0; //公会祈福次数
  public commFreshCount: number = 0; //公会祈福刷新次数

  public highAltarCount: number = 0; //公会高级祈福次数
  public highFreshCount: number = 0; //公会高级祈福刷新次数
  //是否已查看
  private _commAltarSeened = false;
  private _hightAltarSeened = false;
  private _secretSeened = false;

  public static HIGH_SKILL_TYPE_MIN: number = 21;
  public static HIGH_SKILL_TYPE_MAX: number = 44;
  public get currentPrizeListCount(): number {
    return this._currentPrizeListCount;
  }

  public get commAltarSeened() {
    return this._commAltarSeened;
  }

  public set commAltarSeened(b: boolean) {
    let leftCommCount = this.totalCount - this.commAltarCount;
    if (leftCommCount > 0 && this._commAltarSeened == false) {
      this._commAltarSeened = b;
      NotificationManager.Instance.dispatchEvent(
        ConsortiaEvent.GET_ALTAR_GOODS,
      );
    }
  }

  public get hightAltarSeened() {
    return this._hightAltarSeened;
  }

  public set hightAltarSeened(b: boolean) {
    let leftHighCount = this.totalCount - this.highAltarCount;
    if (leftHighCount > 0 && this._hightAltarSeened == false) {
      this._hightAltarSeened = b;
      NotificationManager.Instance.dispatchEvent(
        ConsortiaEvent.GET_ALTAR_GOODS,
      );
    }
  }

  public get secretSeened() {
    return this._secretSeened;
  }

  public set secretSeened(b: boolean) {
    if (this.secretInfo && this.secretInfo.remainGainTime > 0) {
      this._secretSeened = b;
    }
  }

  public checkSecretRedDot() {
    return (
      this._secretSeened == false &&
      this.secretInfo &&
      this.secretInfo.remainGainTime > 0
    );
  }

  public set currentPrizeListCount(value: number) {
    this._currentPrizeListCount = value;
    this.dispatchEvent(ConsortiaEvent.PRIZE_LIST_COUNT_UPDATE);
  }

  /**
   * 是否拥有该权限
   * @param duty 权限  ConsortiaDutyInfo
   * @returns boolean
   */
  getRightsByIndex(duty: number): boolean {
    let consortiaControler: ConsortiaControler =
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.ConsortiaSecretInfoWnd,
      ) as ConsortiaControler;
    if (consortiaControler) {
      return consortiaControler.getRightsByIndex(duty);
    }
    return false;
  }

  /**
   * 公会宝箱列表
   */
  protected _prizeList: SimpleDictionary;
  public get prizeList(): SimpleDictionary {
    return this._prizeList;
  }

  public set prizeList(value: SimpleDictionary) {
    this._prizeList = value;
    this.dispatchEvent(ConsortiaEvent.PRIZE_LIST_UPDATE);
  }

  /**
   * 公会宝箱领取成员列表
   */
  private _prizeMemberList: SimpleDictionary;
  public get prizeMemberList(): SimpleDictionary {
    return this._prizeMemberList;
  }

  public set prizeMemberList(value: SimpleDictionary) {
    this._prizeMemberList = value;
    this.dispatchEvent(ConsortiaEvent.PRIZE_MEMBER_LIST_UPDATE);
  }

  /**
   * 申请加入公会人数
   * @return
   *
   */
  public get recruitNum(): number {
    //			return 8;
    return this._recruitNum;
  }

  public set recruitNum(value: number) {
    if (this._recruitNum == value) {
      return;
    }
    this._recruitNum = value;
    this.dispatchEvent(ConsortiaEvent.RECRUITNUM_CHANGED);
  }

  public static CONSORTIA_SEARCH_PAGE_NUM: number = 8;
  /**
   *  成员列表最大显示条数
   */
  public static CONSORTIA_MEMBER_NUM: number = 12;

  /**
   *  创建公会所需等级
   */
  public static CREAT_NEEDED_GRADES: number = 13;
  /**
   * 捐献记录列表每页显示的条数
   */
  public static CONTRIBUTE_RECORD_PAGE_NUM: number = 8;
  /**
   * 事件列表显示条数
   */
  public static CONSORTIA_EVENT_LIST_NUM: number = 11;
  /**
   *  招收成员Frame中每页显示的条数
   */
  public static APPLY_CONSORTIA_PAGE_NUM: number = 8;
  /**
   * 公会保管箱, 每升一级打开5个格子, 升满全部打开
   */
  public static CASE_CELL_OPEN_BY_LEVEL: number = 5;
  /**
   *  公会保管箱最大格子数
   */
  public static CASE_CELL_MAX_NUM: number = 56;
  /**
   * 公会技能Frame至少显示数量
   */
  public static STUDY_SKILL_MIN_NUM: number = 6;
  /**
   * 公会研究技能Frame至少显示数量
   */
  public static RESEARCH_SKILL_MIN_NUM: number = 4;
  /**
   * 公会申请上限
   */
  public static APPLY_MAX: number = 10;
  public static CONSORTIA_RENAME_NEEDED_POINT: number = 1000;

  public currentPage: number = 1;
  public static OPEN_CELL_NEEDED_POINT: number = 100;
  public static BAG_PAGE_CELL_NUM: number = 56;

  /** 选举持续天数 */
  public static VOTING_DAY: number = 14;

  private static APPLAY_INFO: string = "applayInfo";

  constructor() {
    super();

    this.init();
  }

  public beginChanges() {
    this._changeObj.clear();
  }

  public static get renameCost(): number {
    let cfgTempValue = 1000;
    let cfgTemp =
      TempleteManager.Instance.getConfigInfoByConfigName("Consortia_Rename");
    if (cfgTemp) {
      cfgTempValue = Number(cfgTemp.ConfigValue);
    }
    return cfgTempValue;
  }

  // 从map中移除
  public removeFromApplyConsortiaMapList(sInfo: ThaneInfo) {
    this.applyConsortiaMap.forEach((list, key) => {
      let idx = list.indexOf(sInfo);
      if (idx >= 0) {
        list.splice(idx, 1);
        this._changeObj[ConsortiaModel.APPLAY_INFO] = true;
      }
    });
  }

  public commit() {
    if (this._changeObj[ConsortiaModel.APPLAY_INFO]) {
      this.dispatchEvent(ConsortiaEvent.UPDA_APPLY_CONSORTIA_INFO);
    }
  }

  private init() {
    this._consortiaInfo = new ConsortiaInfo();
    this._consortiaDutyList = new Dictionary();
    this._consortiaMemberList = new SimpleDictionary();
    this._baseSkillList = new SimpleDictionary();
    this._usrRights = new BitArray();
    this.blessInfo = new ConsortiaAltarBlessInfo();
    this._changeObj = new SimpleDictionary();
    this._prizeList = new SimpleDictionary();
    this._prizeMemberList = new SimpleDictionary();
    this.secretInfo = new ConsortiaSecretInfo();
    this.demonInfo = new ConsortiaDemonInfo();
    this.bossInfo = new ConsortiaBossInfo();
    this.taskInfo = new ConsortiaTaskInfo();
    this._highSkillList = new SimpleDictionary();
  }

  /**
   * 创建公会所需黄金
   */
  public static get CREAT_NEEDED_GOLD(): number {
    let value: number = 700000;
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("Consortia_Gold");
    if (cfg) {
      value = Number(cfg.ConfigValue);
    }
    return value;
  }

  public get applyList(): ConsortiaInviteInfo[] {
    return this._applyList;
  }

  public set applyList(value: ConsortiaInviteInfo[]) {
    // Logger.info("[ConsortiaModel]applyList", value)
    this._applyList = value;
    if (this._consortiaList.length > 0) {
      this.consortiaList = this._consortiaList;
    }
    this.dispatchEvent(ConsortiaEvent.UPDA_RECORD_LIST, { bInvite: false });
  }

  public get inviteList(): ConsortiaInviteInfo[] {
    return this._inviteList;
  }

  public set inviteList(value: ConsortiaInviteInfo[]) {
    this._inviteList = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_RECORD_LIST, { bInvite: true });
  }

  public get consortiaList(): ConsortiaInfo[] {
    return this._consortiaList;
  }

  public set consortiaList(value: ConsortiaInfo[]) {
    // Logger.info("[ConsortiaModel]consortiaList", value)
    this._consortiaList = value;

    for (let index = 0; index < this._consortiaList.length; index++) {
      const consortiaInfo = this._consortiaList[index];
      consortiaInfo.hasApplyed = false;
      if (this._applyList.length > 0) {
        for (let index = 0; index < this._applyList.length; index++) {
          const applyInfo = this._applyList[index];
          if (applyInfo.consortiaId == consortiaInfo.consortiaId) {
            consortiaInfo.hasApplyed = true;
            break;
          }
        }
      }
    }
    this.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_LIST);
  }

  public get robotConsortiaList(): ConsortiaInfo[] {
    let ary: ConsortiaInfo[] = [];
    let len: number = this.consortiaList.length;
    for (let i: number = 0; i < len; i++) {
      if (this.consortiaList[i].isRobot) {
        ary.push(this.consortiaList[i]);
      }
    }
    return ary;
  }

  public get noRobotConsortiaList(): ConsortiaInfo[] {
    let ary: ConsortiaInfo[] = [];
    let len: number = this.consortiaList.length;
    for (let i: number = 0; i < len; i++) {
      if (this.consortiaList[i].isRobot == false) {
        ary.push(this.consortiaList[i]);
      }
    }
    return ary;
  }

  /**
   * 公会成员
   */
  public get consortiaMemberList(): SimpleDictionary {
    return this._consortiaMemberList;
  }

  /**
   * 获取在线成员列表
   */
  public getOnlineConsortiaMembers(): ThaneInfo[] {
    let members: ThaneInfo[] = [];
    let list: ThaneInfo[] = this._consortiaMemberList.getList();
    for (let i = 0, len = list.length; i < len; i++) {
      const member = list[i];
      if (member.isOnline) {
        members.push(member);
      }
    }
    return members;
  }

  /**
   *得到指定排序的公会成员列表
   * @param field  排序字段
   * @param reverse
   */
  public getSortMemberList(
    field: string = "fightingCapacity",
    reverse: boolean = true,
  ): ThaneInfo[] {
    let arr: ThaneInfo[] = [];
    arr = this._consortiaMemberList.getList();
    if (field == "nickName") {
      if (reverse) {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [ArrayConstant.DESCENDING, ArrayConstant.DESCENDING],
        );
      } else {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [ArrayConstant.DESCENDING, ArrayConstant.CASEINSENSITIVE],
        );
      }
    } else {
      if (reverse) {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [
            ArrayConstant.DESCENDING,
            ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
          ],
        );
      } else {
        arr = ArrayUtils.sortOn(
          arr,
          ["isOnline", field],
          [ArrayConstant.DESCENDING, ArrayConstant.NUMERIC],
        );
      }
    }
    return arr;
  }

  /**
   * @private
   */
  public set consortiaMemberList(value: SimpleDictionary) {
    this._consortiaMemberList = value;
  }

  /**
   * 公会信息
   */
  public get consortiaInfo(): ConsortiaInfo {
    return this._consortiaInfo;
  }

  /**
   * @private
   */
  public set consortiaInfo(value: ConsortiaInfo) {
    this._consortiaInfo = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_INFO);
  }

  /**
   * 冷却剩余时间
   */
  public get timeLeft(): number {
    return this._timeLeft;
  }

  /**
   * @private
   */
  public set timeLeft(value: number) {
    if (this._timeLeft == value) {
      return;
    }
    this._timeLeft = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_COOLDOWN_TIME);
  }

  /**
   * 公会职责列表
   */
  public get consortiaDutyList(): Dictionary {
    return this._consortiaDutyList;
  }

  /**
   * @private
   */
  public set consortiaDutyList(value: Dictionary) {
    this._consortiaDutyList = value;
  }

  public get usrRights(): BitArray {
    return this._usrRights;
  }

  public set usrRights(value: BitArray) {
    this._usrRights = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_RIGHTS);
  }

  /**
   * 公会捐献列表
   */
  public get consortiaContributionList(): ConsortiaUserInfo[] {
    return this._consortiaContributionList;
  }

  public set consortiaContributionList(value: ConsortiaUserInfo[]) {
    this._consortiaContributionList = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_CONTRIBUTE_INFO);
  }

  public get contributeListCurrentPage(): number {
    return this._contributeListCurrentPage;
  }

  public set contributeListCurrentPage(value: number) {
    value = value == 0 ? 1 : value;
    this._contributeListCurrentPage = value;
  }

  public get contributeListTotalPage(): number {
    return this._contributeListTotalPage;
  }

  public set contributeListTotalPage(value: number) {
    value = value == 0 ? 1 : value;
    this._contributeListTotalPage = value;
    this.dispatchEvent(ConsortiaEvent.UPDE_CONTRIBUTION_SEARCH_PAGE);
  }

  public get setTotalRows(): number {
    return this._setTotalRows;
  }

  public set setTotalRows(value: number) {
    this._setTotalRows = value;
  }

  /**
   * 公会事件列表
   */
  public get consortiaEventList(): ConsortiaEventInfo[] {
    return this._consortiaEventList;
  }

  /**
   * @private
   */
  public set consortiaEventList(value: ConsortiaEventInfo[]) {
    this._consortiaEventList = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_CONSORTIA_EVENT_LIST);
  }

  public get recruitCurrentPage(): number {
    return this._recruitCurrentPage;
  }

  public set recruitCurrentPage(value: number) {
    value = value == 0 ? 1 : value;
    this._recruitCurrentPage = value;
  }

  public get recruitListTotalPage(): number {
    return this._recruitListTotalPage;
  }

  public set recruitListTotalPage(value: number) {
    value = value == 0 ? 1 : value;
    this._recruitListTotalPage = value;
    this.dispatchEvent(ConsortiaEvent.UPDE_RECRUIT_SEARCH_PAGE);
  }

  public get alTarBlessLeftTime(): number {
    return this._alTarBlessLeftTime;
  }

  public set alTarBlessLeftTime(value: number) {
    //更改为当天的祈福次数而不是剩余次数
    value = value < 0 ? 0 : value;
    this._alTarBlessLeftTime = value;
    this.dispatchEvent(ConsortiaEvent.UPDA_ALTAR_BLESS_LEFT_TIME);
  }

  public get altarGoods(): GoodsInfo {
    return this._altarGoods;
  }

  public set altarGoods(value: GoodsInfo) {
    this._altarGoods = value;
  }

  public get lastaltarGoods(): GoodsInfo {
    return this._lastaltarGoods;
  }

  public set lastaltarGoods(value: GoodsInfo) {
    this._lastaltarGoods = value;
    this.dispatchEvent(ConsortiaEvent.UPDE_ALTAR_GOODS);
  }

  public get currentCasecellNum(): number {
    let num: number = 0;
    if (this.consortiaInfo.storeLevel == 0) {
      num = 0;
    } else if (
      this.consortiaInfo.storeLevel == ConsortiaUpgradeType.MAX_LEVEL
    ) {
      num = ConsortiaModel.CASE_CELL_MAX_NUM;
    } else {
      num =
        this.consortiaInfo.storeLevel * ConsortiaModel.CASE_CELL_OPEN_BY_LEVEL;
    }
    return num;
  }

  public get baseSkillList(): SimpleDictionary {
    return this._baseSkillList;
  }

  public set baseSkillList(value: SimpleDictionary) {
    this._baseSkillList = value;
  }

  public get highSkillList(): SimpleDictionary {
    return this._highSkillList;
  }

  public set highSkillList(value: SimpleDictionary) {
    this._highSkillList = value;
  }

  /**
   * 更新公会信息时, 更新研究技能等级
   *
   */
  public updataResearchSkill() {
    let skills: ConsortiaTempleteInfo[] = this._baseSkillList.getList();
    for (let i = 0, len = skills.length; i < len; i++) {
      let item: ConsortiaTempleteInfo = skills[i];
      item.level = this.consortiaInfo.getLevelByUpgradeType(item.type);
    }
  }

  /**
   * 参与投票人员的信息
   */
  public get votingUsers(): ConsortiaVotingUserInfo[] {
    return this._votingUsers;
  }

  public set votingUsers(value: ConsortiaVotingUserInfo[]) {
    this._votingUsers = value.sort(this.compareFun);
    this.dispatchEvent(ConsortiaEvent.CONSORTIA_VOTINGLIST_CHANGE);
  }

  private compareFun(
    item1: ConsortiaVotingUserInfo,
    item2: ConsortiaVotingUserInfo,
  ): number {
    return item2.votingData - item1.votingData;
  }

  public get hasVoted(): boolean {
    return this._hasVoted;
  }

  public set hasVoted(value: boolean) {
    this._hasVoted = value;
  }

  /**
   * 是否有选举权
   * @return
   *
   */
  public get hasVotePermission(): boolean {
    let player: PlayerInfo =
      PlayerManager.Instance.currentPlayerModel.playerInfo;
    let offer: number = player.consortiaOffer;
    let totalOffer: number = player.consortiaTotalOffer;
    return totalOffer >= 100 || offer >= 100;
  }

  //////////////////////////////////////////  公会秘境、魔神祭坛
  /**
   *公会魔神祭坛Buff价格
   */
  public static demonBuffPrice: number = 0;
  /**
   *公会秘境信息
   */

  public secretInfo: ConsortiaSecretInfo;
  /**
   *公会魔神祭坛
   */
  public demonInfo: ConsortiaDemonInfo;
  public get openEffectDic(): Dictionary {
    if (!this._openEffectDic) {
      this._openEffectDic = new Dictionary();
    }
    return this._openEffectDic;
  }

  public getNeedByEffectKey(key: number): boolean {
    if (this.openEffectDic[key] == null) {
      this.openEffectDic[key] = true;
    }
    return this.openEffectDic[key];
  }

  public maxMave: number = 0;

  /**
   * 清理成员审核相关
   */
  public clearRecuit() {
    this.recruitCurrentPage = 1;
    this.recruitListTotalPage = 1;
  }

  public randomArraySort(pre: Array<any>, posLenght: number = 10): Array<any> {
    var result: Array<any> = [];
    var posList: Array<any> = this.getPosList(posLenght);
    var length: number = Math.min(pre.length, posLenght);
    for (var i: number = 0; i < length; i++) {
      var pos: number = Math.floor(Math.random() * posList.length);
      result.push(posList[pos]);
      posList.splice(pos, 1);
    }
    return result;
  }

  private getPosList(length: number): Array<any> {
    var arr: Array<any> = [];
    for (var i: number = 0; i < length; i++) {
      arr.push(i);
    }
    return arr;
  }

  public get SortiaMaxMembers(): number {
    let config =
      TempleteManager.Instance.getConfigInfoByConfigName("Consortia_Member");
    let levelAdd = 0;
    if (config) {
      let add = Number(config.ConfigValue);
      levelAdd = this.consortiaInfo.levels * add;
    }
    return 30 + levelAdd;
  }

  /*************************** 公会任务 begain**************************************/
  //
  TaskStarNum: number = 5;
  TaskMaxRewardStageNum: number = 5;
  TaskMaxRefreshNum: number = 5;
  // 本周公会所有人总任务积分
  taskWeekScore: number = 0;
  // 本周总任务积分限制
  taskWeekScoreMax: number = 0;
  // 今日已完成任务玩家人数
  taskFinishNum: number = 0;
  // 今日已用免费刷新次数
  taskRefreshNum: number = 0;
  // 上次免费次数刷新时间戳
  taskRefreshTime: number = 0;

  // 当前任务
  taskInfo: ConsortiaTaskInfo;
  // 升星价格配置
  upgradeStarPriceList: string[] = [];
  // 公会玩家任务完成的记录
  taskRecordList: string[] = [];
  // 下方进度条的固定积分奖励
  taskWeekScoreRewardList: ConsortiaTaskScoreRewardInfo[] = [];

  initTaskInfo() {
    let weekScoreList = [];
    this.taskWeekScoreRewardList = [];
    let cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "ConsortiaTask_TotalScore",
    );
    if (cfg && cfg.ConfigValue) {
      weekScoreList = cfg.ConfigValue.split(",");
      this.taskWeekScoreMax = Number(
        weekScoreList[this.TaskMaxRewardStageNum - 1],
      );
      for (let index = 0; index < this.TaskMaxRewardStageNum; index++) {
        let info = new ConsortiaTaskScoreRewardInfo();
        info.score = Number(weekScoreList[index]);
        info.icon = FUIHelper.getItemURL(
          EmPackName.Base,
          "Icon_Box_Dev" + (index + 1),
        );
        this.taskWeekScoreRewardList.push(info);

        // 11~15为下方进度条的固定积分奖励  默认取1星的奖励数量
        let site = index + 1 + 10;
        let rewardCfgList = this.getTaskWeekRewardCfgList(site);
        for (let index = 0; index < rewardCfgList.length; index++) {
          let rewardCfg = rewardCfgList[index] as t_s_consortiataskrewardData;
          let goodInfo = new GoodsInfo();
          goodInfo.templateId = rewardCfg.RewardItemId;
          goodInfo.count = rewardCfg.RewardNumStar1;
          info.itemList.push(goodInfo);
        }
      }
    }

    cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "ConsortiaTask_RefreshNum",
    );
    if (cfg && cfg.ConfigValue) {
      this.TaskMaxRefreshNum = Number(cfg.ConfigValue);
    }

    cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "ConsortiaTask_StarPrice",
    );
    if (cfg && cfg.ConfigValue) {
      this.upgradeStarPriceList = cfg.ConfigValue.split(",");
    }
  }

  getTaskWeekRewardCfgList(site: number): t_s_consortiataskrewardData[] {
    let list: t_s_consortiataskrewardData[] = [];
    let cfg = ConfigMgr.Instance.getDicSync(ConfigType.t_s_consortiataskreward);
    for (const key in cfg) {
      if (cfg.hasOwnProperty(key)) {
        let info: t_s_consortiataskrewardData = cfg[key];
        if (info.Site == site) {
          list.push(info);
        }
      }
    }
    return list;
  }

  /** 刷新是否达到领奖条件 */
  refreshScoreRewardReachStatus(weekScore: number) {
    let infoList = this.taskWeekScoreRewardList;
    for (let index = 0; index < infoList.length; index++) {
      const info = infoList[index];
      info.reachCond = weekScore >= info.score;
    }
  }
  /** 刷新是否已领奖 */
  refreshScoreRewardRecevieStatus(taskWeekReceviedStr: string) {
    let infoList = this.taskWeekScoreRewardList;
    let taskWeekReceviedArr = taskWeekReceviedStr.split(",");
    for (let index = 0; index < infoList.length; index++) {
      const info = infoList[index];
      info.recevied = Number(taskWeekReceviedArr[index]) == 1;
    }
  }

  getTaskTitleByType(type: ConsortiaTaskType): string {
    let titleArr = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.taskTitleStr",
    ).split(",");
    let title = titleArr[Number(type) - 1];
    return title;
  }

  // “获得/消耗/上缴XXX（所需数量）个XXXX（物品名）”
  getTaskContent(taskId: number, starNum: number): string {
    let taskCfg = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_consortiatask,
      taskId,
    ) as t_s_consortiataskData;
    let itemCfg = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_itemtemplate,
      taskCfg.NeedItemId,
    ) as t_s_itemtemplateData;
    if (!itemCfg) return "";
    let needItemNum = taskCfg["CountStar" + starNum];
    let needItemName = itemCfg.TemplateNameLang;
    // let taskActArr = LangManager.Instance.GetTranslation("ConsortiaTaskWnd.taskActStr").split(",")
    // let taskContent = LangManager.Instance.GetTranslation("ConsortiaTaskWnd.taskContent", taskActArr[Number(taskCfg.Type) - 1], needItemNum, needItemName)
    let taskContent = LangManager.Instance.GetTranslation(
      "ConsortiaTaskWnd.taskActStr" + Number(taskCfg.Type),
      needItemNum,
      needItemName,
    );
    return taskContent;
  }

  getTaskUpgradeStarPrice(curStar: number): number {
    return Number(this.upgradeStarPriceList[curStar - 1]);
  }

  /** 任务完成 */
  checkHasTaskComplete(): boolean {
    let flag: boolean = false;
    flag = this.taskInfo.status == FinishStatus.FINISHED;
    return flag;
  }

  /** 本周总任务积分可领取 */
  checkHasTaskWeekReward(): boolean {
    let flag: boolean = false;
    for (let index = 0; index < this.TaskMaxRewardStageNum; index++) {
      let info = this.taskWeekScoreRewardList[index];
      if (info.canRecevie) {
        flag = true;
        break;
      }
    }
    return flag;
  }
  /*************************** 公会任务 end**************************************/

  public checkPrayHasLeftCount(): boolean {
    let leftCommCount = this.totalCount - this.commAltarCount;
    let leftHighCount = this.totalCount - this.highAltarCount;
    return (
      (leftCommCount > 0 && !this._commAltarSeened) ||
      (leftHighCount > 0 && !this._hightAltarSeened)
    );
  }

  public checkHasReturnBackPlayer(): boolean {
    return this.secretInfo.isReturnedPlayer;
  }

  private get totalCount(): number {
    return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
      ConsortiaUpgradeType.CONSORTIA_ALTAR,
      this.consortiaInfo.altarLevel,
    ).Property2;
  }
}
