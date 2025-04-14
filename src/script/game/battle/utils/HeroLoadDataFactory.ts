/**
 * author : jeremy.xu
 * @data: 2020-11-20 18:00
 * description : 英雄角色加载数据工厂类.
 * 该类主要用于创建英雄角色的加载数据(从而实现角色各个部分的资源的加载).
 **/

import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { PathManager } from "../../manager/PathManager";
import { GameLoadNeedData } from "../data/GameLoadNeedData";

export class HeroLoadDataFactory {
  /**
   * 头发/披风/身体.
   * 常量从上往下顺序与实际人物各部分叠加顺利一致(上面的会挡住下面的);
   */
  public static PART_HAIR1: string = "hair1";
  public static PART_ARMS: string = "arms";
  public static PART_HAIR2: string = "hair2";
  public static PART_CLOAK1: string = "cloak1";
  public static PART_BODY: string = "body";
  public static PART_HAIR3: string = "hair3";
  public static PART_CLOAK2: string = "cloak2";
  public static PART_HAIR4: string = "hair4";
  public static PART_ARMS_BACK: string = "arms2";

  public static PART_PET_BODY: string = "pet_body";
  public static PART_PET_FOLLOW: string = "pet_follow";
  public static LEVEL: string = "level";

  public static Part_List = [
    HeroLoadDataFactory.PART_CLOAK2,
    HeroLoadDataFactory.PART_ARMS_BACK,
    HeroLoadDataFactory.PART_HAIR4,
    HeroLoadDataFactory.PART_HAIR3,
    HeroLoadDataFactory.PART_BODY,
    HeroLoadDataFactory.PART_HAIR2,
    HeroLoadDataFactory.PART_ARMS,
    HeroLoadDataFactory.PART_HAIR1,
    HeroLoadDataFactory.PART_CLOAK1,
  ];

  /**
   * 创建相应的加载数据.
   * @param heroInfo 英雄信息.
   * @param part 身体部件字符串,用于说明是角色哪一部分的资源.如:Body表示身体;Arms表示武器.
   * @return 返回需要加载的数据.
   */
  public static create(heroInfo: ThaneInfo, part: string): GameLoadNeedData {
    let gameLoadData: GameLoadNeedData;
    let path: string;
    let level: number = 0;
    let levelFlag: string;
    let srcPart: string = part;
    let sPart: string = part;
    let reg: RegExp = /\d/;
    let numIndex: number = part.search(reg);
    if (numIndex > -1) {
      sPart = part.substring(0, numIndex);
      level = Number(part.substring(numIndex));
    }
    switch (sPart) {
      case "pet_follow":
        let key: string = heroInfo.petTemplate.PetAvatar + "_follow";
        path = PathManager.solveHeroAvatarPath(key, 2);
        break;
      case "pet_body":
        if (heroInfo.petTemplate) {
          path = PathManager.solveHeroAvatarPath(
            heroInfo.petTemplate.PetAvatar,
            2,
          );
        } else {
          path = "";
        }
        break;
      case "body":
        if (heroInfo.templateId == 100) {
          //神秘人
          path = PathManager.getDefaultJobBattleAvatar();
        } else if (heroInfo.bodyFashionAvata) {
          path = PathManager.solveWingAvatarPath(
            heroInfo.bodyFashionAvata,
            heroInfo.templateInfo.Job,
            heroInfo.templateInfo.Sexs,
          );
        } else if (heroInfo.bodyAvata) {
          path = PathManager.solveHeroAvatarPath(
            heroInfo.bodyAvata,
            heroInfo.templateInfo.Sexs,
          );
        } else {
          path = PathManager.solveRoleDefaultPath(
            heroInfo.templateInfo.Job,
            "body",
            heroInfo.templateInfo.Sexs,
          );
        }
        break;
      case "arms":
        if (heroInfo.armsFashionAvata) {
          path = PathManager.solveWingAvatarPath(
            heroInfo.armsFashionAvata,
            heroInfo.templateInfo.Job,
            heroInfo.templateInfo.Sexs,
          );
        } else if (heroInfo.armsAvata) {
          path = PathManager.solveHeroAvatarPath(
            heroInfo.armsAvata,
            heroInfo.templateInfo.Sexs,
          );
        } else {
          path = PathManager.solveRoleDefaultPath(
            heroInfo.templateInfo.Job,
            "arms",
            heroInfo.templateInfo.Sexs,
          );
        }
        break;
      case "hair":
        if (heroInfo.hairFashionAvata) {
          path = PathManager.solveWingAvatarPath(
            heroInfo.hairFashionAvata,
            heroInfo.templateInfo.Job,
            heroInfo.templateInfo.Sexs,
          );
        } else if (heroInfo.hairAvata) {
          path = PathManager.solveHeroAvatarPath(
            heroInfo.hairAvata,
            heroInfo.templateInfo.Sexs,
          );
        } else {
          path = PathManager.solveRoleDefaultPath(
            heroInfo.templateInfo.Job,
            "hair",
            heroInfo.templateInfo.Sexs,
          );
        }
        break;
      case "cloak":
        if (heroInfo.wingAvata) {
          path = PathManager.solveWingAvatarPath(
            heroInfo.wingAvata,
            heroInfo.templateInfo.Job,
            heroInfo.templateInfo.Sexs,
          );
        } else {
          if (heroInfo.bodyAvata) {
            path = PathManager.solveHeroAvatarPath(
              heroInfo.bodyAvata + "_cloak",
              heroInfo.templateInfo.Sexs,
            );
          } else {
            path = PathManager.solveRoleDefaultPath(
              heroInfo.templateInfo.Job,
              "body",
              heroInfo.templateInfo.Sexs,
              "_cloak",
            );
          }
        }
        break;
    }

    levelFlag = level ? this.LEVEL + level : this.LEVEL;
    gameLoadData = new GameLoadNeedData(
      path,
      undefined,
      levelFlag,
      level,
      srcPart,
    );
    return gameLoadData;
  }

  public static createAll(thaneInfo: ThaneInfo) {
    let info: GameLoadNeedData;
    let tempArr: GameLoadNeedData[] = [];
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_CLOAK2,
    );
    tempArr.push(info);
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_ARMS_BACK,
    );
    tempArr.push(info);
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_HAIR4,
    );
    tempArr.push(info);
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_HAIR3,
    );
    tempArr.push(info);
    info = HeroLoadDataFactory.create(thaneInfo, HeroLoadDataFactory.PART_BODY);
    tempArr.push(info);
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_HAIR2,
    );
    tempArr.push(info);
    info = HeroLoadDataFactory.create(thaneInfo, HeroLoadDataFactory.PART_ARMS);
    tempArr.push(info);
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_HAIR1,
    );
    tempArr.push(info);
    info = HeroLoadDataFactory.create(
      thaneInfo,
      HeroLoadDataFactory.PART_CLOAK1,
    );
    tempArr.push(info);
    return tempArr;
  }
}
