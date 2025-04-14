/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-05 17:09:43
 * @LastEditTime: 2024-04-28 17:28:12
 * @LastEditors: jeremy.xu
 * @Description:
 */
import Logger from "../../../core/logger/Logger";
import { ArrayUtils } from "../../../core/utils/ArrayUtils";
import { InheritRoleType } from "../../constant/BattleDefine";
import { PathManager } from "../../manager/PathManager";
import { HeroLoadDataFactory } from "../utils/HeroLoadDataFactory";
import { GameLoadNeedData } from "./GameLoadNeedData";
import { HeroRoleInfo } from "./objects/HeroRoleInfo";
import { PetRoleInfo } from "./objects/PetRoleInfo";

export class RoleFigureModel {
  public static loadList = [];

  public static initRoleFigure(roleList: Map<number, any>) {
    roleList.forEach((roleInfo) => {
      if (roleInfo.inheritType == InheritRoleType.Hero) {
        if (roleInfo.type != 3) {
          //type是3的为boss, 其它是英雄  正常的情况下是null  即继续执行

          let pet: PetRoleInfo = (roleInfo as HeroRoleInfo).petRoleInfo;
          if (pet && pet.livingId != roleInfo.livingId) {
            // this._needLoad++;
            // this._rolePart = new RoleUnit(false);
            // this._rolePart.onComplete = this.onPetPartComplete.bind(this);
            // this._rolePart.data = HeroLoadDataFactory.create((roleInfo as HeroRoleInfo).heroInfo, HeroLoadDataFactory.PART_PET_BODY);
          }

          if (pet && pet.livingId == roleInfo.livingId) {
            // this._rolePart = new RoleUnit(false);
            // this._rolePart.onComplete = this.onPetPartComplete2.bind(this);
            // this._rolePart.data = HeroLoadDataFactory.create((roleInfo as HeroRoleInfo).heroInfo, HeroLoadDataFactory.PART_PET_BODY);
          } else {
            // this._heroMovie = new HeroMovieClip(this.info as HeroRoleInfo);
            // this._heroMovie.onComplete = this.bossLoadComplete.bind(this);
            // this._heroMovie.startLoad();
            if (roleInfo.templateId == 100) {
              //神秘人
              let data: GameLoadNeedData = HeroLoadDataFactory.create(
                (roleInfo as HeroRoleInfo).heroInfo,
                HeroLoadDataFactory.PART_BODY,
              );
              RoleFigureModel.loadList.push({
                url: data.urlPath,
                type: Laya.Loader.ATLAS,
              });
            } else {
              HeroLoadDataFactory.Part_List.forEach((part) => {
                let data: GameLoadNeedData = HeroLoadDataFactory.create(
                  (roleInfo as HeroRoleInfo).heroInfo,
                  part,
                );
                RoleFigureModel.loadList.push({
                  url: data.urlPath,
                  type: Laya.Loader.ATLAS,
                });
              });
            }
          }
        } else {
          //boss
          let path = PathManager.solveRolePath(
            (roleInfo as HeroRoleInfo).resPath,
          );
          RoleFigureModel.loadList.push({ url: path, type: Laya.Loader.ATLAS });
        }
      } else if (roleInfo.inheritType == InheritRoleType.Pawn) {
        let path = PathManager.solveRolePath(roleInfo.effectId);
        RoleFigureModel.loadList.push({ url: path, type: Laya.Loader.ATLAS });
      } else if (roleInfo.inheritType == InheritRoleType.Pet) {
        //TODO
      }
    });
    RoleFigureModel.loadList = ArrayUtils.unique(
      RoleFigureModel.loadList,
      "url",
    );
    // Logger.info("[RoleFigureModel]战斗资源列表初始化", RoleFigureModel.loadList, roleList)
  }

  public static clear() {
    this.loadList = [];
  }
}
