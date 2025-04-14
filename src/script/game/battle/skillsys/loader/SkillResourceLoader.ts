/**
 * @author:jeremy.xu
 * @data: 2020-11-23 10:00
 * @description   技能资源加载类.
 * 该类负责将技能相关的资源添加到加载列表中.
 **/

import ConfigMgr from "../../../../core/config/ConfigMgr";
import Logger from "../../../../core/logger/Logger";
import ResMgr from "../../../../core/res/ResMgr";
import StringHelper from "../../../../core/utils/StringHelper";
import { t_s_pawntemplateData } from "../../../config/t_s_pawntemplate";
import { t_s_skillbuffertemplateData } from "../../../config/t_s_skillbuffertemplate";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import { t_s_talenteffecttemplateData } from "../../../config/t_s_talenteffecttemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { PathManager } from "../../../manager/PathManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { SkillData } from "../../data/SkillData";
import { ActionTemplateData } from "../mode/ActionTemplateData";
import { SkillResLoaderVO } from "./SkillResLoaderVO";

export class SkillResourceLoader {
  private static _skillNameMap = new Map<number, string>();

  private static _ids: any[] = [];

  private static _notLoad: boolean;
  private static _paths: any[]; // 不立即加载的
  public static loadList: any[] = [];
  public static soundLoadList: string[] = [];
  public static skillNames: any[] = [];

  /**
   * 将技能Id数组相关的技能资源添加到加载队列中.
   * @param skillIds
   *
   */
  public static add(skillIds: any[]) {
    let len: number = skillIds.length;
    let id: number = 0;
    for (let i: number = 0; i < len; i++) {
      id = skillIds[i];
      if (this._ids.indexOf(id) == -1) {
        this._ids.push(id);
        this.addSkill(id, 2);
      }
    }
  }
  public static addSkillVOs(skills: any[]) {
    let len: number = skills.length;
    let vo: SkillResLoaderVO;
    for (let i: number = 0; i < len; i++) {
      vo = skills[i];
      this.addSkill(vo.skillId, vo.sex);
    }
  }

  /**
   * 添加buffer的效果资源
   * @param bufferTempInfo
   *
   */
  private static loadBufferResource(
    bufferTempInfo: t_s_skillbuffertemplateData,
  ) {
    let arr: any[];
    if (bufferTempInfo) {
      //添加buffer的效果
      arr = bufferTempInfo.getActionEffectArr();
      if (arr[0]) {
        this.addLoaderByLinkName(arr[0]);
        Logger.yyz("加载getActionEffectArr天赋资源: : : : " + arr[0]);
      }
      arr = bufferTempInfo.getAddEffectArr();
      if (arr[0]) {
        this.addLoaderByLinkName(arr[0]);
        Logger.yyz("加载getAddEffectArr天赋资源: : : : " + arr[0]);
      }
      arr = bufferTempInfo.getLastEffectArr();
      if (arr[0]) {
        this.addLoaderByLinkName(arr[0]);
      }
    }
  }
  /**
   * 加载buffer天赋效果资源
   * @param bufferTempInfo
   *
   */
  private static loadTalentBufferResource(
    bufferTempInfo: t_s_skillbuffertemplateData,
  ) {
    if (
      bufferTempInfo &&
      !StringHelper.isNullOrEmpty(bufferTempInfo.TalentEffIds) &&
      bufferTempInfo.TalentEffIds.length > 0
    ) {
      //添加buffer所带的天赋的效果
      let arr: any[];
      let talentIds: any[] = bufferTempInfo.TalentEffIds.split(",");
      talentIds.forEach((talentId) => {
        let effect: t_s_talenteffecttemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_talenteffecttemplate,
            String(talentId),
          );
        let effectBuffer: number[] = effect.EffBufferIds;
        for (let index = 0; index < effectBuffer.length; index++) {
          const effectBufferId = effectBuffer[index];
          if (effectBufferId == 0) continue;
          let bufferTempInfo: t_s_skillbuffertemplateData =
            ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_skillbuffertemplate,
              String(effectBufferId),
            );
          if (bufferTempInfo) {
            arr = bufferTempInfo.getActionEffectArr();
            if (arr[0]) {
              this.addLoaderByLinkName(arr[0]);
              Logger.yyz("加载getActionEffectArr天赋资源: : : : " + arr[0]);
            }
            arr = bufferTempInfo.getAddEffectArr();
            if (arr[0]) {
              this.addLoaderByLinkName(arr[0]);
              Logger.yyz("加载getAddEffectArr天赋资源: : : : " + arr[0]);
            }
            arr = bufferTempInfo.getLastEffectArr();
            if (arr[0]) {
              this.addLoaderByLinkName(arr[0]);
              Logger.yyz("加载getLastEffectArr天赋资源: : : : " + arr[0]);
            }
          }
        }
      });
    }
  }
  /**
   * 添加技能相关资源
   * @param skillId
   * @param sex
   *
   */
  private static addSkill(skillId: number, sex: number) {
    let linkNames: any[] = this.getLinkNamesBySkillId(skillId, sex);

    for (let i: number = 0; i < linkNames.length; i++) {
      this.addLoaderByLinkName(linkNames[i]);
    }
    let skillTemp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_skilltemplate,
      String(skillId),
    );
    if (skillTemp) {
      let actionTemplate: ActionTemplateData =
        ConfigMgr.Instance.actionTemplate2[skillTemp.ActionId];
      if (actionTemplate) {
        let totalSoundNames = actionTemplate.getSoundRes();
        if (totalSoundNames.length > 0) {
          for (let index = 0; index < totalSoundNames.length; index++) {
            SkillResourceLoader.soundLoadList.push(
              ComponentSetting.getSkillSoundSourcePath(totalSoundNames[index]),
            );
          }
        }
      }

      if (!StringHelper.isNullOrEmpty(skillTemp.BufferIds)) {
        let bufferIds: any[] = skillTemp.BufferIds.split(",");
        for (let j: number = 0; j < bufferIds.length; j++) {
          let bufferId: number = bufferIds[j];
          let bufferTempInfo: t_s_skillbuffertemplateData =
            ConfigMgr.Instance.getTemplateByID(
              ConfigType.t_s_skillbuffertemplate,
              String(bufferId),
            );
          this.loadBufferResource(bufferTempInfo);
          this.loadTalentBufferResource(bufferTempInfo);
        }
      }
    }
  }
  private static addLoaderByLinkName(linkName: string) {
    if (linkName) {
      this.addLoader(linkName);
    }
  }
  private static addLoader(linkName: string) {
    let path = PathManager.solveSkillResPath(linkName, true, true);
    if (this._notLoad) {
      this._paths.push(path);
    } else {
      Logger.yyz("添加技能资源:  :  :  : " + path);
      // 先保存起来
      let item = { url: path, type: Laya.Loader.ATLAS };
      if (SkillResourceLoader.loadList.indexOf(item) == -1) {
        SkillResourceLoader.loadList.push(item);
      }
    }
  }

  public static getLinkNamesBySkillId(skillId: number, sex: number): any[] {
    let arr: any[] = [];
    let actionId: number;

    if (skillId != -1 && skillId != 0) {
      let skillTempInfo = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        String(skillId),
      );
      if (skillTempInfo) actionId = skillTempInfo.ActionId;
    }

    if (actionId != 0) {
      let actionTemp: ActionTemplateData =
        ConfigMgr.Instance.actionTemplate2[actionId];
      if (actionTemp) {
        arr = actionTemp.getRes(sex);
      }
    }

    return arr;
  }

  /**
   * 加载技能名称资源
   * @param skillIds
   * @return
   */
  public static addSkillNameIds(skillIds: number[]): any[] {
    this.skillNames = [];
    // for (let i = 0; i < skillIds.length; i++) {
    //     let tempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, String(skillIds[i])) as t_s_skilltemplateData
    //     if (tempInfo) {
    //         if (tempInfo.SonType != 0 && tempInfo.SonType != 1 && tempInfo.UseWay == 1 && !this._skillNameMap.get(tempInfo.SonType)) {
    //             let path = PathManager.solveSkillNameResPath(tempInfo.SonType.toString())
    //             this.skillNames.push({ url: path, type: Laya.Loader.IMAGE })
    //             this._skillNameMap.set(tempInfo.SonType, path)
    //         }
    //     }
    // }
    return this.skillNames;
  }

  public static getSkillNameRes(sontype: number): any {
    let path = this._skillNameMap.get(sontype);
    return ResMgr.Instance.getRes(path);
  }

  /**
   * 获得指定的兵的Id对应的技能数组.
   * @param pawnId
   * @return
   *
   */
  public static getPawnSkillIds(pawnId: number): any[] {
    let arr: any[] = [];
    let tempInfo: t_s_pawntemplateData = ConfigMgr.Instance.getTemplateByID(
      ConfigType.t_s_pawntemplate,
      pawnId.toString(),
    );
    arr.push(tempInfo.DefaultSkill);

    if (!StringHelper.isNullOrEmpty(tempInfo.HighSkill)) {
      arr = arr.concat(tempInfo.HighSkill.split(","));
    }
    return arr;
  }

  /**
   * 根据英雄的技能Id获得全部的技能Id.
   * 即将QTE产生的技能也添加到数组中.
   * @param ids 只包含默认技能的Id数组.
   * @return 返回包含了QTE技能的Id数组.
   */
  public static getHeroFullSkillIds(ids: any[]): any[] {
    let tempInfo: t_s_skilltemplateData;
    let arr: any[] = ids.concat([]);
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      if (id <= 0) {
        continue;
      }
      tempInfo = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_skilltemplate,
        String(id),
      );
      if (
        tempInfo &&
        tempInfo.Parameter3 != 0 &&
        arr.indexOf(tempInfo.Parameter3) == -1
      ) {
        arr.push(tempInfo.Parameter3);
      }
    }
    return arr;
  }

  public static clear() {
    this._ids = [];
    this.loadList = [];
    this.skillNames = [];
    this.soundLoadList = [];
    this._skillNameMap.clear();
  }

  public static getSkillResPaths(skills: any[]): any[] {
    this._paths = [];
    this._notLoad = true;
    this.addSkillVOs(skills);
    this._notLoad = false;
    this.clear();
    return this._paths;
  }
}
