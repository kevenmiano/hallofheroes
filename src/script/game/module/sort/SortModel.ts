import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import LangManager from "../../../core/lang/LangManager";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";
import Dictionary from "../../../core/utils/Dictionary";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { SortEvent } from "../../constant/event/NotificationEvent";
import { UpgradeType } from "../../constant/UpgradeType";
import { TempleteManager } from "../../manager/TempleteManager";
import SortData from "./SortData";
/**
 * @author:pzlricky
 * @data: 2021-08-20 10:58
 * @description 排行榜数据模型
 */
export default class SortModel extends GameEventDispatcher {
  private _currentSelected: number = 0;
  private _currentPage: number = 1;
  private _totalPage: number = 1;
  private _addType: number = 0;
  private _currentShowList: Array<SortData>;

  public createDate: Date;
  public isFirstOpen: boolean = true;

  /** 加载过的url表示为true key url*/
  public loaded: Map<string, boolean> = new Map();

  public dayAddList: Array<any>;
  public weekAddList: Array<any>;
  public accumulationAddList: Array<any>;
  public playerFightList: Array<any>;
  public consortiaLevelList: Array<any>;
  public consortiaFightList: Array<any>;
  public playerHonourList: Array<any>;
  public charmsDayAddList: Array<any>;
  public charmsWeekAddList: Array<any>;
  public charmsTotalAddList: Array<any>;
  public soulScoreTotalAddList: Array<any>;
  public petPowerList: Array<any>;

  //跨服
  public dayAddList2: Array<any>;
  public weekAddList2: Array<any>;
  public accumulationAddList2: Array<any>;
  public playerFightList2: Array<any>;
  public consortiaLevelList2: Array<any>;
  public consortiaFightList2: Array<any>;
  public playerHonourList2: Array<any>;
  public charmsDayAddList2: Array<any>;
  public charmsWeekAddList2: Array<any>;
  public charmsTotalAddList2: Array<any>;
  public soulScoreTotalAddList2: Array<any>;
  public petPowerList2: Array<any>;
  public warlordsDic: SimpleDictionary;

  public changList: Dictionary;

  public static PAGE_NUM: number = 8;

  public static SELF_LEVEL: number = 1;
  public static SELF_POW: number = 2;
  public static CONSORTIA_LEVEL: number = 3;
  public static CONSORTIA_POW: number = 4;
  public static SELF_HONOUR: number = 5;
  public static SELF_CHARMS: number = 6;
  public static SELF_SOULSCORE: number = 7;
  public static WARLORDS: number = 8;
  public static PET_POWER: number = 9;

  public static DAY_ADD: number = 1;
  public static WEEK_ADD: number = 2;
  public static ACCUMULAT_ADD: number = 3;

  private _isCross: boolean = false;

  private _widthConfig: Dictionary = new Dictionary();
  private _languageConfig: Dictionary = new Dictionary();

  public petRanking: SortData; //我的英灵排名
  public petRankingCross: SortData; //我的英灵跨服排名

  public dayAddOrder: number = 0; //每日经验排名
  public weekAddOrder: number = 0; //每周经验排名

  constructor() {
    super();
    this.initArrs();
  }

  initArrs() {
    this._currentShowList = [];

    this.dayAddList = [];
    this.weekAddList = [];
    this.accumulationAddList = [];
    this.playerFightList = [];
    this.consortiaLevelList = [];
    this.consortiaFightList = [];
    this.playerHonourList = [];
    this.charmsDayAddList = [];
    this.charmsWeekAddList = [];
    this.charmsTotalAddList = [];
    this.soulScoreTotalAddList = [];
    this.petPowerList = [];

    this.dayAddList2 = [];
    this.weekAddList2 = [];
    this.accumulationAddList2 = [];
    this.playerFightList2 = [];
    this.consortiaLevelList2 = [];
    this.consortiaFightList2 = [];
    this.playerHonourList2 = [];
    this.charmsDayAddList2 = [];
    this.charmsWeekAddList2 = [];
    this.charmsTotalAddList2 = [];
    this.soulScoreTotalAddList2 = [];
    this.petPowerList2 = [];
    this.warlordsDic = new SimpleDictionary();

    this.changList = new Dictionary();
  }

  private _currentSelectedJob: number;
  /**
   * 当前选中职业
   */
  public get currentSelectedJob(): number {
    return this._currentSelectedJob;
  }
  public set currentSelectedJob(value: number) {
    this._currentSelectedJob = value;
  }

  public get currentSelected(): number {
    return this._currentSelected;
  }

  public set currentSelected(value: number) {
    if (this._currentSelected == value) return;
    this._currentSelected = value;
    this.changList[SortEvent.SELECTE_CHANGE] = true;
  }
  public get currentPage(): number {
    return this._currentPage;
  }

  public set currentPage(value: number) {
    value = value <= 0 ? 1 : value;
    if (this._currentPage == value) return;
    this._currentPage = value;
    this.changList[SortEvent.PAGE_UPDATE] = true;
  }

  public get totalPage(): number {
    return this._totalPage;
  }

  public set totalPage(value: number) {
    value = value <= this._currentPage ? this._currentPage : value;
    if (this._totalPage == value) return;
    this._totalPage = value;
    this.changList[SortEvent.PAGE_UPDATE] = true;
  }

  public get currentShowList(): Array<SortData> {
    return this._currentShowList;
  }

  public set currentShowList(value: Array<SortData>) {
    this._currentShowList = value;
    this.totalPage = Math.ceil(
      this._currentShowList.length / SortModel.PAGE_NUM,
    );
    this.changList[SortEvent.SELECTE_LIST_CHANG] = true;
  }

  public commitChange() {
    if (this.changList[SortEvent.SELECTE_LIST_CHANG])
      this.dispatchEvent(SortEvent.SELECTE_LIST_CHANG);
    if (this.changList[SortEvent.PAGE_UPDATE])
      this.dispatchEvent(SortEvent.PAGE_UPDATE);
    if (this.changList[SortEvent.SELECTE_CHANGE])
      this.dispatchEvent(SortEvent.SELECTE_CHANGE);
    this.resetChangList();
  }

  private resetChangList() {
    for (var i in this.changList) {
      this.changList[i] = false;
    }
  }

  public get addType(): number {
    return this._addType;
  }

  public set addType(value: number) {
    this._addType = value;
  }
  public getHonourName(honour: number): string {
    var tempList: Array<t_s_upgradetemplateData> =
      TempleteManager.Instance.getTemplatesByType(
        UpgradeType.UPGRADE_TYPE_HONER,
      );
    tempList = ArrayUtils.sortOn(
      tempList,
      ["Data"],
      [ArrayConstant.DESCENDING],
    );
    var honourName: string = "";
    for (var i: number = 0; i < tempList.length; i++) {
      var temp: t_s_upgradetemplateData = tempList[
        i
      ] as t_s_upgradetemplateData;
      if (honour >= temp.Data) {
        honourName = temp.TemplateNameLang;
        break;
      }
    }
    return honourName;
  }

  /**
   * 是否为跨服
   */
  public get isCross(): boolean {
    return this._isCross;
  }

  /**
   * @private
   */
  public set isCross(value: boolean) {
    this._isCross = value;
    this.changList[SortEvent.SELECTE_CHANGE] = true;
  }

  public get widthConfig(): Dictionary {
    return this._widthConfig;
  }

  public get languageConfig(): Dictionary {
    return this._languageConfig;
  }

  //配置每列的宽度
  public initWidthConfig() {
    this._widthConfig[SortModel.SELF_LEVEL] = "200,200,200,120,300";
    this._widthConfig[SortModel.SELF_POW] = "200,250,200,460";
    this._widthConfig[SortModel.CONSORTIA_LEVEL] = "200,250,200,460";
    this._widthConfig[SortModel.CONSORTIA_POW] = "200,250,200,460";
    this._widthConfig[SortModel.SELF_HONOUR] = "200,200,160,240,300"; //"74,125,92,83,130";
    this._widthConfig[SortModel.SELF_CHARMS] = "200,250,200,460";
    this._widthConfig[SortModel.SELF_SOULSCORE] = "200,250,200,460";
    this._widthConfig[SortModel.PET_POWER] = "200,180,150,150,100,300";

    //跨服
    this._widthConfig["C" + SortModel.SELF_LEVEL] = "150,150,130,130,140,400";
    this._widthConfig["C" + SortModel.SELF_POW] = "150,150,200,200,420";
    this._widthConfig["C" + SortModel.CONSORTIA_LEVEL] = "150,150,200,200,420";
    this._widthConfig["C" + SortModel.CONSORTIA_POW] = "150,150,200,200,420";
    this._widthConfig["C" + SortModel.SELF_HONOUR] = "150,150,150,150,200,360";
    this._widthConfig["C" + SortModel.SELF_CHARMS] = "150,150,200,200,420";
    this._widthConfig["C" + SortModel.SELF_SOULSCORE] = "150,150,200,200,420";
    this._widthConfig["C" + SortModel.PET_POWER] =
      "150,150,200,200,140,140,140";
  }
  //配置列名
  public initLanguageConfig() {
    this._languageConfig[SortModel.SELF_LEVEL] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.empirical",
      ),
    ];
    this._languageConfig[SortModel.SELF_POW] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap"),
    ];
    this._languageConfig[SortModel.CONSORTIA_LEVEL] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.ConsortiaName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.buildValue",
      ),
    ];
    this._languageConfig[SortModel.CONSORTIA_POW] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.ConsortiaName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap"),
    ];
    this._languageConfig[SortModel.SELF_HONOUR] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.honourName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.honour"),
    ];
    this._languageConfig[SortModel.SELF_CHARMS] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.charms"),
    ];
    this._languageConfig[SortModel.SELF_SOULSCORE] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.soulScore",
      ),
    ];
    this._languageConfig[SortModel.PET_POWER] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.petname"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.property"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.master"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.petgrade"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap"),
    ];

    //跨服
    this._languageConfig["C" + SortModel.SELF_LEVEL] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.empirical",
      ),
    ];
    this._languageConfig["C" + SortModel.SELF_POW] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap"),
    ];
    this._languageConfig["C" + SortModel.CONSORTIA_LEVEL] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.ConsortiaName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.buildValue",
      ),
    ];
    this._languageConfig["C" + SortModel.CONSORTIA_POW] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.ConsortiaName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.level"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap"),
    ];
    this._languageConfig["C" + SortModel.SELF_HONOUR] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.honourName",
      ),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.honour"),
    ];
    this._languageConfig["C" + SortModel.SELF_CHARMS] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.charms"),
    ];
    this._languageConfig["C" + SortModel.SELF_SOULSCORE] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.name"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.Job"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.soulScore",
      ),
    ];
    this._languageConfig["C" + SortModel.PET_POWER] = [
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ranking"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.petname"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.property"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.master"),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.petgrade"),
      LangManager.Instance.GetTranslation(
        "sort.view.MemberTitleView.serverName",
      ),
      LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ap"),
    ];
  }

  /**
   * 退出模块时 清理数据 下次打开刷新
   *
   */
  public cleanData() {
    this.cleanSortList();
    this.cleanSortList2();
    this.petRanking = null;
    this.petRankingCross = null;
  }

  private cleanSortList() {
    let sortInfo: SortData;
    while ((sortInfo = this.dayAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.weekAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.accumulationAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.playerFightList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.consortiaLevelList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.consortiaFightList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.playerHonourList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.charmsDayAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.charmsWeekAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.charmsTotalAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.soulScoreTotalAddList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.petPowerList.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
  }

  private cleanSortList2() {
    let sortInfo: SortData;
    while ((sortInfo = this.dayAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.weekAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.accumulationAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.playerFightList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.consortiaLevelList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.consortiaFightList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.playerHonourList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.charmsDayAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.charmsWeekAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.charmsTotalAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.soulScoreTotalAddList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
    while ((sortInfo = this.petPowerList2.pop() as SortData)) {
      if (sortInfo) {
        sortInfo.army.dispose();
        sortInfo.army = null;
        sortInfo = null;
      }
    }
  }
}
