import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import Logger from "../../../core/logger/Logger";
import ResMgr from "../../../core/res/ResMgr";
import StringHelper from "../../../core/utils/StringHelper";
import { BattleEvent } from "../../constant/event/NotificationEvent";
import { EmPackName } from "../../constant/UIDefine";
import { AnimationManager } from "../../manager/AnimationManager";
import { BattleResPreloadManager } from "../../manager/BattleResPreloadManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PathManager } from "../../manager/PathManager";
import { BattleManager } from "../BattleManager";
import { BattleModel } from "../BattleModel";
import { SkillResourceLoader } from "../skillsys/loader/SkillResourceLoader";
import { RoleFigureModel } from "./RoleFigureModel";
import Utils from "../../../core/utils/Utils";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignManager } from "../../manager/CampaignManager";
import {
  ActionsExecutionMode,
  SequenceList,
} from "../../../core/task/SequenceList";
import {
  BattleLoadFUITask,
  BattleLoadItemTask,
  BattleLoadFigureTask,
} from "./BattleLoadTask";

export class ResourceModel extends GameEventDispatcher {
  public static Skill_Effect = "skilleffect/";
  /**
   * 公共技能相关
   */
  public static PublicSkill_Prefix = PathManager.solveSkillPublicResPath();
  public static PublicSkill_GroupKey = "PublicSkill";
  public static PublicSkill_Names = [
    "awaken_awakenappeareffect",
    "battle_resource_passiveeffectasset",
    "", //"profound_executereffectasset",
    "", //"slg_resource_collectgasasset",
    "", // "profound_disperseasset"
  ];
  public static PublicSkill = [
    {
      url: PathManager.solveSkillPublicResPath(
        ResourceModel.PublicSkill_Names[0],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "PublicSkill_0",
    },
    {
      url: PathManager.solveSkillPublicResPath(
        ResourceModel.PublicSkill_Names[1],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "PublicSkill_1",
    },
    // { url: PathManager.solveSkillPublicResPath(ResourceModel.PublicSkill_Names[2]), type: Laya.Loader.ATLAS, priority: 1 },
    // { url: PathManager.solveSkillPublicResPath(ResourceModel.PublicSkill_Names[3]), type: Laya.Loader.ATLAS, priority: 1 },
    // { url: PathManager.solveSkillPublicResPath(ResourceModel.PublicSkill_Names[4]), type: Laya.Loader.ATLAS, priority: 1 },
  ];

  /**
   * 抗性
   */
  public static Resist_Sheld_Prefix = PathManager.solveResistSheldResPath();
  public static Resist_Sheld_GroupKey = "Resist_Sheld_GroupKey";
  public static Resist_Sheld_Names = [
    "resist.sheld.an",
    "resist.sheld.dian",
    "resist.sheld.feng",
    "resist.sheld.guang",
    "resist.sheld.huo",
    "resist.sheld.shui",
  ];
  public static Resist_Sheld = [
    {
      url: PathManager.solveResistSheldResPath(
        ResourceModel.Resist_Sheld_Names[0],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "ResistSheld_0",
    },
    {
      url: PathManager.solveResistSheldResPath(
        ResourceModel.Resist_Sheld_Names[1],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "ResistSheld_1",
    },
    {
      url: PathManager.solveResistSheldResPath(
        ResourceModel.Resist_Sheld_Names[2],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "ResistSheld_2",
    },
    {
      url: PathManager.solveResistSheldResPath(
        ResourceModel.Resist_Sheld_Names[3],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "ResistSheld_3",
    },
    {
      url: PathManager.solveResistSheldResPath(
        ResourceModel.Resist_Sheld_Names[4],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "ResistSheld_4",
    },
    {
      url: PathManager.solveResistSheldResPath(
        ResourceModel.Resist_Sheld_Names[5],
      ),
      type: Laya.Loader.ATLAS,
      priority: 1,
      key: "ResistSheld_5",
    },
  ];

  /**
   * 技能特效
   */
  public static SkillEffect_GroupKey = "SkillEffect_GroupKey";
  public static SkillSound_GroupKey = "SkillSound_GroupKey";

  /**
   * 战斗地图
   */
  public static BattleMap_GroupKey = "BattleMap_GroupKey";
  public battleMapRes: string = "";

  /**
   * 战斗UI
   */
  public static BattleCommonUI_GroupKey = "BattleCommonUI_GroupKey";

  /**
   * 记录getEffectMC创建的所有动画缓存名称
   */
  public static effectAniNameCache = new Map<string, boolean>();

  /**
   * 记录角色动作的动画缓存名称ActionLabesType
   */
  public static roleActionAniNameCache = new Map<string, boolean>();

  /** 加载管理器 */
  private _loadTaskMgr = new SequenceList(ActionsExecutionMode.RunInParallel);
  private _loadFigureTaskMgr = new SequenceList(
    ActionsExecutionMode.RunInSequence,
  );
  public get loadFigureTaskMgr(): SequenceList {
    return this._loadFigureTaskMgr;
  }

  /**
   * 记录加载的模块的进度
   */
  private _totalModuleProgMap = new Map<string, number>();
  private _totalNeedCountMap = new Map<string, number>();
  private _totalLoadedCountMap = new Map<string, number>();
  private _totalNeedLoadCount: number = 0;

  private _step: number = 0;
  public startLoad(first: boolean = true) {
    Logger.battle("---------------enter battle ui load start----------------");

    if (first) {
      this._totalNeedCountMap.set(ResourceModel.BattleMap_GroupKey, 1);
      this._totalNeedCountMap.set(ResourceModel.BattleCommonUI_GroupKey, 1);
      this._totalNeedCountMap.set(
        ResourceModel.SkillEffect_GroupKey,
        SkillResourceLoader.loadList.length,
      );
      this._totalNeedCountMap.set(
        ResourceModel.SkillSound_GroupKey,
        SkillResourceLoader.soundLoadList.length,
      );
      this._totalNeedLoadCount = 0;
      this._totalNeedCountMap.forEach((cnt: number, key: string) => {
        this._totalNeedLoadCount += cnt;
      });
    }

    switch (this._step) {
      case 0: //BattleCommonUI
        this.loadBattleCommonUI();
        break;
      case 1: //BattleMap
        this.loadBattleMap();
        break;
      case 2: //SkillEffect
        Logger.battle(
          "[ResourceModel]loadSkillEffect:",
          SkillResourceLoader.loadList,
        );
        this.loadSkillEffect();
        break;
      case 3: //
        Logger.battle(
          "[ResourceModel]loadSkillSound:",
          SkillResourceLoader.soundLoadList,
        );
        this.loadSkillSound();
        break;
      case 4: //加载完成
        this.complete();
        break;
    }
  }

  /**
   * 战斗公共UI资源
   */
  private loadBattleCommonUI() {
    ResMgr.Instance.loadFairyGui(
      EmPackName.Battle,
      this.onComplete.bind(this),
      this.onProgress.bind(this),
    );
  }

  /**
   * 战斗地图
   */
  private loadBattleMap() {
    let path = PathManager.getBattleMapPath(
      BattleManager.Instance.battleModel.mapResId,
    );
    ResMgr.Instance.loadRes(
      path,
      this.onComplete.bind(this),
      this.onProgress.bind(this),
      Laya.Loader.IMAGE,
    );
  }

  /**
   * 技能资源
   */
  private loadSkillEffect() {
    ResMgr.Instance.loadGroup(
      SkillResourceLoader.loadList,
      this.onComplete.bind(this),
      this.onProgress.bind(this),
      undefined,
      undefined,
      undefined,
      ResourceModel.SkillEffect_GroupKey,
    );
  }

  /**
   * 技能音效
   */
  private loadSkillSound() {
    if (SkillResourceLoader.soundLoadList.length == 0) {
      this.onProgress(1);
      this.onComplete(null, null);
      return;
    }
    ResMgr.Instance.loadGroup(
      SkillResourceLoader.soundLoadList,
      this.onComplete.bind(this),
      this.onProgress.bind(this),
      undefined,
      undefined,
      undefined,
      ResourceModel.SkillSound_GroupKey,
    );
  }

  private onProgress(prog: number) {
    // Logger.battle("[ResourceModel]onProgress step=" + this._step + ", prog=" + prog)
    let loadedCnt;
    switch (this._step) {
      case 0: //BattleCommonUI
        this._totalModuleProgMap.set(
          ResourceModel.BattleCommonUI_GroupKey,
          prog,
        );
        this._totalLoadedCountMap.set(ResourceModel.BattleCommonUI_GroupKey, 1);
        break;
      case 1: //BattleMap
        this._totalModuleProgMap.set(ResourceModel.BattleMap_GroupKey, prog);
        this._totalLoadedCountMap.set(ResourceModel.BattleCommonUI_GroupKey, 1);
        break;
      case 2: //SkillEffect
        this._totalModuleProgMap.set(ResourceModel.SkillEffect_GroupKey, prog);
        loadedCnt =
          this._totalNeedCountMap.get(ResourceModel.SkillEffect_GroupKey) *
          prog;
        this._totalLoadedCountMap.set(
          ResourceModel.BattleCommonUI_GroupKey,
          loadedCnt,
        );
        break;
      case 3: //
        this._totalModuleProgMap.set(ResourceModel.SkillSound_GroupKey, prog);
        loadedCnt =
          this._totalNeedCountMap.get(ResourceModel.SkillSound_GroupKey) * prog;
        this._totalLoadedCountMap.set(
          ResourceModel.SkillSound_GroupKey,
          loadedCnt,
        );
        break;
      case 4: //加载完成
        break;
    }
  }

  private onComplete(res, args) {
    switch (this._step) {
      case 0: //BattleCommonUI
        break;
      case 1: //BattleMap
        let path = PathManager.getBattleMapPath(
          BattleManager.Instance.battleModel.mapResId,
        );
        this.battleMapRes = path;
        break;
      case 2: //SkillEffect
        break;
      case 3:
        break;
      case 4:
        break;
    }
    this._step++;
    this.startLoad(false);
  }

  private complete() {
    BattleModel.battleUILoaded = true;
    NotificationManager.Instance.dispatchEvent(BattleEvent.BATTLE_UI_LOADED);

    this.startSilentlyLoad();
  }

  public progress(): number {
    let total: number = 0;
    this._totalModuleProgMap.forEach((pro, index) => {
      total += pro;
    });

    return (total / 4) * 100;
  }

  public progressString(): string {
    let totalLoadedCnt = 0;
    this._totalLoadedCountMap.forEach((cnt: number, key: string) => {
      totalLoadedCnt += cnt;
    });
    return Math.floor(totalLoadedCnt) + "/" + this._totalNeedLoadCount;
  }

  public checkInSilenceFigureLoadList(url: string): boolean {
    for (const key in RoleFigureModel.loadList) {
      const element = RoleFigureModel.loadList[key];
      if (element.url == url) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取特效动画
   * @param effectName 动画配置名称
   */
  public getEffectMC(effectName: string): object {
    let prefix = StringHelper.replaceStr(effectName, ".", "_") + "/";
    prefix = ResourceModel.Skill_Effect + prefix.toLocaleLowerCase();
    let cacheName;
    let cacheJson = AnimationManager.Instance.getCache(prefix);
    if (!cacheJson) {
      let success = AnimationManager.Instance.createAnimation(
        prefix,
        "",
        0,
        "",
        AnimationManager.BattleEffectFormatLen,
      );
      if (success) {
        cacheName = prefix;
      } else {
        // Logger.info("[ResourceModel]getEffectMC failed effectName=", effectName)
      }
    } else {
      cacheName = prefix;
    }
    if (cacheName) {
      let fullUrl = PathManager.solveSkillResPath(effectName, true, true);

      let resJson = ResMgr.Instance.getRes(fullUrl);
      let pos_leg = new Laya.Point(0, 0);
      if (resJson && resJson.offset) {
        if (Utils.isNumber(resJson.offset.footX)) {
          pos_leg.x = Math.floor(resJson.offset.footX);
        }
        if (Utils.isNumber(resJson.offset.footY)) {
          pos_leg.y = Math.floor(resJson.offset.footY);
        }
      }
      // Logger.warn("[ResourceModel]getEffectMC sucess effectName=", cacheName, fullUrl)
      // 记录动画
      ResourceModel.effectAniNameCache.set(cacheName, true);
      return { cacheName: cacheName, pos_leg: pos_leg };
    } else {
      Logger.warn("[ResourceModel]getEffectMC failed effectName=", effectName);
      return null;
    }
  }

  skillPublicRes: Laya.loadItem[] = [];
  public startSilentlyLoad() {
    let seq1 = new SequenceList(ActionsExecutionMode.RunInSequence);
    let seq2 = new SequenceList(ActionsExecutionMode.RunInSequence);
    let seq3 = new SequenceList(ActionsExecutionMode.RunInSequence);
    seq1.addTask(new BattleLoadFUITask(EmPackName.BattleDynamic));
    seq2.addTask(new BattleLoadFUITask(EmPackName.BattleBgAni));
    this.skillPublicRes = this.skillPublicRes.concat([
      {
        url: ResourceModel.PublicSkill_Prefix,
        type: Laya.Loader.ATLAS,
        key: ResourceModel.PublicSkill_GroupKey,
      },
      {
        url: ResourceModel.Resist_Sheld_Prefix,
        type: Laya.Loader.ATLAS,
        key: ResourceModel.Resist_Sheld_GroupKey,
      },
    ] as unknown as Laya.loadItem[]);
    for (let index = 0; index < this.skillPublicRes.length; index++) {
      const loadItem = this.skillPublicRes[index];
      seq3.addTask(new BattleLoadItemTask(loadItem));
    }
    seq3.setComplete(
      Laya.Handler.create(this, () => {
        Logger.battle(">>> 加载战斗LoadItem资源任务完成");
      }),
    );

    this._loadTaskMgr
      .addTask(seq1)
      .addTask(seq2)
      .addTask(seq3)
      .setComplete(
        Laya.Handler.create(this, () => {
          Logger.battle(">>> 加载所有战斗动态资源任务完成！！！");
        }),
      )
      .execute(this);
  }

  public startSilentlyLoadFigure() {
    for (let index = 0; index < RoleFigureModel.loadList.length; index++) {
      const loadItem = RoleFigureModel.loadList[index];
      this._loadFigureTaskMgr.addTask(new BattleLoadFigureTask(loadItem));
    }
    this._loadFigureTaskMgr
      .setComplete(
        Laya.Handler.create(this, () => {
          Logger.battle(">>> 加载战斗形象任务完成");
        }),
      )
      .execute(this);
  }

  public checkFigureInSilenceLoadList(url: string): boolean {
    for (let index = 0; index < RoleFigureModel.loadList.length; index++) {
      const element = RoleFigureModel.loadList[index];
      if (element.url == url) {
        return true;
      }
    }
    return false;
  }

  private clearBattleRes(returnToCampaign: boolean) {
    // 清理：形象
    ResourceModel.roleActionAniNameCache.forEach((exist, cacheName) => {
      AnimationManager.Instance.clearAnimationByName(cacheName);
    });
    RoleFigureModel.loadList.forEach((element) => {
      ResMgr.Instance.cancelLoadByUrl(element.url);
      ResMgr.Instance.releaseRes(element.url);
    });

    if (!returnToCampaign) {
      // 清理：静默加载的资源
      BattleResPreloadManager.clearPublicSkillAni();
      BattleResPreloadManager.clearResistSheldAni();
      this.skillPublicRes.forEach((element) => {
        ResMgr.Instance.cancelLoadByUrl(element.url);
        ResMgr.Instance.releaseRes(element.url);
      });
      ResMgr.Instance.releaseFairyGui(EmPackName.BattleDynamic);
      ResMgr.Instance.releaseFairyGui(EmPackName.BattleBgAni);
    }

    if (!returnToCampaign) {
      if (this.battleMapRes) {
        ResMgr.Instance.releaseRes(this.battleMapRes);
      }
      // 清理: 技能产生的相关特效动画
      ResourceModel.effectAniNameCache.forEach((element, cacheName) => {
        AnimationManager.Instance.clearAnimationByName(cacheName);
      });
      // 清理: 技能产生的相关特效纹理  不能用group？会少挺多资源的
      // ResMgr.Instance.releaseGroupRes(ResourceModel.SkillEffect_GroupKey)
      SkillResourceLoader.loadList.forEach((item) => {
        ResMgr.Instance.releaseRes(item.url);
      });
      SkillResourceLoader.soundLoadList.forEach((url) => {
        ResMgr.Instance.releaseRes(url);
      });
    }
  }

  public dispose(returnToCampaign: boolean = true) {
    this._loadTaskMgr.clear();

    this._totalModuleProgMap.clear();
    this._totalNeedCountMap.clear();
    this._totalLoadedCountMap.clear();

    /**
     * 英灵岛、紫金矿场、战场、公会战、秘境副本战斗
     * 出战斗就要释放战斗资源而不是出副本才释放, 不然内存一直增长
     */
    let mapModel = CampaignManager.Instance.mapModel;
    if (mapModel) {
      if (
        WorldBossHelper.checkPetLand(mapModel.mapId) ||
        WorldBossHelper.checkMineral(mapModel.mapId) ||
        WorldBossHelper.checkPvp(mapModel.mapId) ||
        WorldBossHelper.checkGvg(mapModel.mapId) ||
        WorldBossHelper.checkSecretFb(mapModel.mapId)
      ) {
        returnToCampaign = false;
      }
    }

    this.clearBattleRes(returnToCampaign);
  }
}
