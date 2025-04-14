import { IconFactory } from "../../core/utils/IconFactory";
import { SkillResLoaderVO } from "../battle/skillsys/loader/SkillResLoaderVO";
import { SkillResourceLoader } from "../battle/skillsys/loader/SkillResourceLoader";
import { HeroLoadDataFactory } from "../battle/utils/HeroLoadDataFactory";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "./ArmyManager";
import { PathManager } from "./PathManager";
import { TempleteManager } from "./TempleteManager";
import { t_s_herotemplateData } from "../config/t_s_herotemplate";
import ConfigMgr from "../../core/config/ConfigMgr";
import { ConfigType } from "../constant/ConfigDefine";
import { t_s_heroaiData } from "../config/t_s_heroai";
import { t_s_pawntemplateData } from "../config/t_s_pawntemplate";
import ResMgr from "../../core/res/ResMgr";
import Logger from "../../core/logger/Logger";
import { ResourceModel } from "../battle/data/ResourceModel";
import { AnimationManager } from "./AnimationManager";
import { ArrayUtils } from "../../core/utils/ArrayUtils";
import ResPreLoader from "../task/ResPreLoader";
import { Func } from "../../core/comps/Func";

/**
 * 战斗资源预加载器
 */
export class BattleResPreloadManager {
  private static _mapPath: string;
  private static _resLoadCount: number = 0;
  private static _resLoadPaths: string[] = [];
  private static _resPublicLoadCnt: number = 0;
  private static _resPublicLoadPaths: any[] = [];
  /**
   * 加载战斗资源,可重复调用,不会重复加载.
   * @param pawnIds 士兵或怪物id数据.
   * @param bossIds BOSS id数组.
   * @param mapId 战斗地图ID(非副本地图ID),为-1时不进行地图的加载.
   *
   */
  public static load(pawnIds: any[], bossIds: any[], mapId: number = -1) {
    let mapPath: string = BattleResPreloadManager.getMapPath(mapId);
    ResMgr.Instance.loadRes(mapPath, null, null, Laya.Loader.IMAGE);

    let paths: any[] = BattleResPreloadManager.getPaths(pawnIds, bossIds);

    this._mapPath = mapPath;
    this._resLoadPaths = paths;

    this.startLoadRes();
    this.startLoadPublicRes();
  }

  private static resLoader: ResPreLoader;
  public static startLoadRes() {
    Logger.info(
      "[BattleResPreloadManager]开始预加载副本资源",
      this._resLoadPaths,
    );
    // Laya.timer.loop(20, this, this.__loadRes);
    let count = this._resLoadPaths.length;
    let resources = [];
    let path = "";
    let type = Laya.Loader.ATLAS;
    for (let index: number = 0; index < count; index++) {
      path = this._resLoadPaths[index];
      resources.push({ resUrl: path, resType: type });
    }
    this.resLoader = new ResPreLoader(resources);
    this.resLoader.startLoad();
  }

  public static __loadRes() {
    let path = this._resLoadPaths[this._resLoadCount];

    // Logger.xjy("[BattleResPreloadManager]__loadRes", path, this._resLoadCount + "/" + this._resLoadPaths.length)
    if (path) {
      ResMgr.Instance.loadResItem({ url: path, type: Laya.Loader.ATLAS });
    }
    this._resLoadCount++;

    if (this._resLoadCount >= this._resLoadPaths.length) {
      Laya.timer.clear(this, this.__loadRes);
    }
  }

  public static startLoadPublicRes() {
    this._resPublicLoadPaths = this._resPublicLoadPaths.concat(
      ResourceModel.PublicSkill,
      ResourceModel.Resist_Sheld,
      SkillResourceLoader.skillNames,
    );
    this._resPublicLoadCnt = 0;
    this.loadPublicOne();
  }

  private static loadPublicOne() {
    let item = this._resPublicLoadPaths[this._resPublicLoadCnt];
    ResMgr.Instance.loadResItem(item, (res) => {
      let asset = ResMgr.Instance.getRes(item.url);
      if (asset && asset.meta && asset.meta.prefix) {
        this.cachePublicSkillAni(asset.meta.prefix.toLocaleLowerCase());
        this.cacheResistSheldAni(asset.meta.prefix.toLocaleLowerCase());
      }

      this._resPublicLoadCnt++;
      if (this._resPublicLoadCnt < this._resPublicLoadPaths.length) {
        this.loadPublicOne();
      } else {
      }
    });
  }

  public static cachePublicSkillAni(cacheName: string) {
    let exist = false;
    for (let key in ResourceModel.PublicSkill_Names) {
      let ele = ResourceModel.PublicSkill_Names[key];
      if (cacheName.indexOf(ele)) {
        exist = true;
        break;
      }
    }
    if (exist) {
      let cacheJson = AnimationManager.Instance.getCache(cacheName);
      let success;
      if (!cacheJson) {
        success = AnimationManager.Instance.createAnimation(
          cacheName,
          "",
          undefined,
          "",
          AnimationManager.BattleEffectFormatLen,
        );
        // Logger.xjy("[BattleResPreloadManager]PublicComplete cacheName ", cacheName, success)
      }
      if (!success) {
        // Logger.warn("[BattleResPreloadManager]PublicComplete cache animation failed! cacheName=", cacheName)
      }
    }
    return exist;
  }

  public static cacheResistSheldAni(cacheName: string) {
    let exist = false;
    for (let key in ResourceModel.Resist_Sheld) {
      let ele = ResourceModel.Resist_Sheld_Names[key];
      if (cacheName.indexOf(ele)) {
        exist = true;
        break;
      }
    }
    if (exist) {
      let cacheJson = AnimationManager.Instance.getCache(cacheName);
      let success;
      if (!cacheJson) {
        success = AnimationManager.Instance.createAnimation(
          cacheName,
          "",
          undefined,
          "",
          AnimationManager.BattleEffectFormatLen,
        );
        // Logger.xjy("[ResourceModel]ResistComplete cacheName ", cacheName, success)
      }
      if (!success) {
        // Logger.warn("[ResourceModel]ResistComplete cache animation failed! cacheName=", cacheName)
      }
    }
  }

  /**
   *
   * @param mapId 加载战斗背景
   * @returns
   */
  public static getMapPath(mapId): string {
    let str: string;
    if (mapId > 0) {
      str = PathManager.getBattleMapPath(mapId);
    }

    // Logger.xjy("[PreLoadNextCampaign]战斗地图背景", str)
    return str;
  }
  /**
   * 加载技能资源
   * @param pawnIds 需要加载的士兵技能id列表
   * @param bossIds 需要加载的boss技能id列表
   * @return
   *
   */
  public static getPaths(pawnIds: any[], bossIds: any[]): any[] {
    // Logger.xjy("[BattleResPreloadManager]getPaths", pawnIds, bossIds)
    let arr: any[] = [];
    let skillIds: any[] = [];
    let skillVos: any[] = [];
    let rolePaths: any[] = [];
    let pawnSkillIds: any[] = [];
    let i: number;
    let heroDefSkillIds: any[] = [];
    let heroTempInfo: t_s_herotemplateData;
    let heroAisTemp: t_s_heroaiData;
    if (bossIds && bossIds.length > 0) {
      for (i = 0; i < bossIds.length; i++) {
        heroTempInfo = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_herotemplate,
          bossIds[i],
        );
        if (heroTempInfo) {
          heroAisTemp = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_heroai,
            heroTempInfo.AI,
          );
          let defaultSkill: number = heroTempInfo.DefaultSkill;
          if (skillIds.indexOf(defaultSkill) == -1) {
            skillIds.push(defaultSkill);
            heroDefSkillIds.push(defaultSkill);
          }
          if (heroAisTemp) {
            skillIds = skillIds.concat(heroAisTemp.getSkills());
          }
          if (heroTempInfo.HeroType == 3) {
            rolePaths.push(PathManager.solveRolePath(heroTempInfo.ResPath));
          }
          // BattleResPreloadManager.loadBossIconById(bossIds[i]);
        }
      }
    }
    skillIds = skillIds.concat(
      SkillResourceLoader.getHeroFullSkillIds(heroDefSkillIds),
    );

    let pawnTemp: t_s_pawntemplateData;
    if (pawnIds && pawnIds.length > 0) {
      for (i = 0; i < pawnIds.length; i++) {
        //将兵的技能放入技能数组.
        pawnSkillIds = pawnSkillIds.concat(
          SkillResourceLoader.getPawnSkillIds(pawnIds[i]),
        );
        pawnTemp = TempleteManager.Instance.getPawnTemplateById(pawnIds[i]);
        for (let i: number = 0; i < pawnSkillIds.length; i++) {
          let pId: number = pawnSkillIds[i];
          if (pId != 0 && skillIds.indexOf(pId) == -1) {
            skillIds.push(pId);
          }
        }
        if (pawnTemp) {
          let heroAisTemp: t_s_heroaiData = ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_heroai,
            pawnTemp.AI,
          );
          if (heroAisTemp) {
            skillIds = skillIds.concat(heroAisTemp.getSkills());
          }
          rolePaths.push(PathManager.solveRolePath(pawnTemp.Swf));
        }
      }
    }

    //添加士兵和怪的技能资源
    for (const key in skillIds) {
      if (Object.prototype.hasOwnProperty.call(skillIds, key)) {
        let skillId = skillIds[key];
        skillVos.push(new SkillResLoaderVO(skillId, 2));
      }
    }

    let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
    let selfHeroInfo: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      thaneInfo.templateId,
    );
    let selfSkillIds: any[] =
      ArmyManager.Instance.thane.skillCate.skillScript.split(",");
    selfSkillIds = selfSkillIds.concat(
      SkillResourceLoader.getHeroFullSkillIds(selfSkillIds),
    );
    if (selfHeroInfo) {
      selfSkillIds.push(selfHeroInfo.DefaultSkill);
      for (const key in selfSkillIds) {
        if (Object.prototype.hasOwnProperty.call(selfSkillIds, key)) {
          let skillId = selfSkillIds[key];
          skillVos.push(new SkillResLoaderVO(skillId, selfHeroInfo.Sexs));
        }
      }
    }
    rolePaths.push(
      HeroLoadDataFactory.create(thaneInfo, HeroLoadDataFactory.PART_ARMS_BACK)
        .urlPath,
    );
    rolePaths.push(
      HeroLoadDataFactory.create(thaneInfo, HeroLoadDataFactory.PART_HAIR4)
        .urlPath,
    );
    rolePaths.push(
      HeroLoadDataFactory.create(thaneInfo, HeroLoadDataFactory.PART_BODY)
        .urlPath,
    );
    rolePaths.push(
      HeroLoadDataFactory.create(thaneInfo, HeroLoadDataFactory.PART_CLOAK2)
        .urlPath,
    );
    skillIds = skillIds.concat(selfSkillIds); //自己的技能

    //技能相关资源
    skillVos = ArrayUtils.unique(skillVos, "skillId");
    let skillPaths = SkillResourceLoader.getSkillResPaths(skillVos);
    for (let index = 0; index < skillPaths.length; index++) {
      const url = skillPaths[index];
      if (arr.indexOf(url) == -1) {
        arr.push(url);
      }
    }
    //角色资源
    arr = arr.concat(rolePaths);

    SkillResourceLoader.addSkillNameIds(selfSkillIds);
    return arr;
  }

  /**
   * 加载boss头像
   * @param id
   *
   */
  public static loadBossIconById(id: number) {
    let skillIconPath: string;
    let bossTemp: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      id,
    );
    if (bossTemp) {
      skillIconPath = IconFactory.getHeroIconByPics(bossTemp.Icon);
      ResMgr.Instance.loadRes(skillIconPath);
    }
  }
  /**
   * 加载自己的技能 , 新手预加载使用到
   * @param needLoad
   * @return
   *
   */
  public static loadSelfSkill(needLoad: boolean = true): any[] {
    let arr: any[] = [];

    let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
    let selfHeroInfo: t_s_herotemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_herotemplate,
      thaneInfo.templateId,
    );
    let selfSkillIds: any[] =
      ArmyManager.Instance.thane.skillCate.skillScript.split(",");
    let skillVos: any[] = [];
    selfSkillIds = selfSkillIds.concat(
      SkillResourceLoader.getHeroFullSkillIds(selfSkillIds),
    );
    if (selfHeroInfo) {
      selfSkillIds.push(selfHeroInfo.DefaultSkill);
    }
    for (const key in selfSkillIds) {
      if (Object.prototype.hasOwnProperty.call(selfSkillIds, key)) {
        let skillId: number = selfSkillIds[key];
        skillVos.push(new SkillResLoaderVO(skillId, selfHeroInfo.Sexs));
      }
    }
    arr = SkillResourceLoader.getSkillResPaths(skillVos);
    if (needLoad) {
      BattleResPreloadManager.loadPaths(arr);
    }
    return arr;
  }
  public static loadPaths(paths: any[]) {
    for (const key in paths) {
      if (Object.prototype.hasOwnProperty.call(paths, key)) {
        let path: string = paths[key];
        ResMgr.Instance.loadResItem({ url: path, type: Laya.Loader.ATLAS });
      }
    }
  }

  public static clearPublicSkillAni() {
    // 清理PublicSkill
    ResourceModel.PublicSkill_Names.forEach((effectname) => {
      let cacheName = ResourceModel.PublicSkill_Prefix + effectname + "/";
      AnimationManager.Instance.clearAnimationByName(cacheName);
    });
  }

  public static clearResistSheldAni() {
    // 清理Resist_Sheld
    ResourceModel.Resist_Sheld_Names.forEach((effectname) => {
      let cacheName = ResourceModel.Resist_Sheld_Prefix + effectname + "/";
      AnimationManager.Instance.clearAnimationByName(cacheName);
    });
  }

  public static clear() {
    Logger.info("[BattleResPreloadManager]clear");
    // Laya.timer.clear(this, this.__loadRes);
    ResMgr.Instance.releaseRes(this._mapPath);

    this.clearPublicSkillAni();
    this.clearResistSheldAni();

    // 这两个有重复
    this._resLoadPaths.forEach((element) => {
      // Logger.xjy("[BattleResPreloadManager]clear _resLoadPaths", element)
      ResMgr.Instance.cancelLoadByUrl(element);
      ResMgr.Instance.releaseRes(element);
    });
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

    this._resPublicLoadPaths.forEach((element) => {
      ResMgr.Instance.cancelLoadByUrl(element.url);
      ResMgr.Instance.releaseRes(element.url);
    });

    this.resLoader && this.resLoader.dispose();

    this._resLoadPaths = [];
    this._resPublicLoadPaths = [];
    SkillResourceLoader.clear();

    this._mapPath = "";
    this._resLoadCount = 0;
    this._resPublicLoadCnt = 0;
  }
}
