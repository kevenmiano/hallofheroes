/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  战斗阵营信息  战斗中的某一方, 包括英雄和士兵
 **/
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import Dictionary from "../../../../core/utils/Dictionary";
import { RoleType, BattleModelNotic } from "../../../constant/BattleDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { HeroRoleInfo } from "./HeroRoleInfo";
import { PawnRoleInfo } from "./PawnRoleInfo";
import { PetRoleInfo } from "./PetRoleInfo";

export class BattleArmyInfo extends GameEventDispatcher {
  private _site: number = 0;
  private _face: number = 0;
  private _heroList: Dictionary;
  private _pawnList: Dictionary;
  private _petList: Dictionary;
  private _roles: Dictionary;
  /**
   * 士兵血量和英雄血量之和
   */
  public maxTotalHp: number = 0;

  public constructor() {
    super();
    this._heroList = new Dictionary();
    this._pawnList = new Dictionary();
    this._petList = new Dictionary();
    this._roles = new Dictionary();
  }

  /**
   * 返回该方部队的朝向
   * @return
   *
   */
  public get face(): number {
    return this._face;
  }

  public set face(value: number) {
    this._face = value;
    for (let key in this._roles) {
      //info BaseRoleInfo
      let info = this._roles.get(key);
      info.face = this._face;
    }
  }
  /**
   * 获得当前部队血量
   * @return
   *
   */
  public get currentArmyHp(): number {
    let i: number = 0;
    for (const key in this._pawnList) {
      let info = this._pawnList.get(key);
      i += info.bloodCalculate;
    }
    for (const key in this._heroList) {
      let info = this._heroList.get(key);
      i += info.bloodCalculate;
    }
    return i;
  }

  /**
   * 获得兵的总血量.
   * @return
   *
   */
  public getPawnTotalHp(): number {
    let i: number = 0;
    for (const key in this._pawnList) {
      let info = this._pawnList.get(key);
      i += info.totalBloodA;
    }
    return i;
  }

  /**
   * 获得剩余的兵的血量总和.
   * @return
   *
   */
  public getArmyLeftHp(): number {
    let i: number = 0;
    for (const key in this._pawnList) {
      let info = this._pawnList.get(key);
      i += info.bloodA;
    }
    return i;
  }
  /**
   * 返回该方部队的剩余血量
   * @return
   *
   */
  public getLeftHp(): number {
    let i: number = 0;
    for (const key in this._pawnList) {
      let info = this._pawnList.get(key);
      i += info.bloodA;
    }
    for (const key in this._heroList) {
      let info = this._heroList.get(key);
      i += info.bloodA;
    }
    return i;
  }
  /**
   * 返回世界boss总学血量
   * @return
   *
   */
  public getBossesTotalHp(): number {
    let i: number = 0;
    for (const key in this._heroList) {
      let info = this._heroList.get(key);
      if (info.type == RoleType.T_NPC_BOSS) {
        i += info.totalBloodA;
      }
    }
    return i;
  }

  /**
   * 返回某个boss总血量
   * @return
   */
  public getBossesTotalHpByInfo($role: HeroRoleInfo): number {
    var i: number = 0;
    for (const key in this._heroList) {
      let hRole = this._heroList.get(key);
      if (hRole == $role) {
        return hRole.totalBloodA;
      }
    }
    return i;
  }

  /**
   * 返回某个boss剩余血量
   * @return
   */
  public getBossesLeftHpByInfo($role: HeroRoleInfo): number {
    var i: number = 0;
    for (const key in this._heroList) {
      let hRole = this._heroList.get(key);
      if (hRole == $role) {
        return hRole.bloodA;
      }
    }
    return i;
  }

  /**
   *  返回世界boss剩余血量
   * @return
   *
   */
  public getBossesLeftHp(): number {
    let i: number = 0;
    for (const key in this._heroList) {
      let info = this._heroList.get(key);
      if (info.type == RoleType.T_NPC_BOSS) {
        i += info.bloodA;
      }
    }
    return i;
  }
  /**
   * 根据livingid查找角色
   * @param $id
   * @return
   *
   */
  public getRoleById($id: number): any {
    for (const key in this._heroList) {
      let info = this._heroList.get(key);
      if (info.livingId == $id) return info;
    }
    for (const key in this._pawnList) {
      let info = this._pawnList.get(key);
      if (info.livingId == $id) return info;
    }
    return null;
  }
  /**
   * 在部队中移除角色
   * @param role
   *
   */
  public removeRole(role) {
    role && role.dispose();
    if (this._heroList.get(role.livingId)) {
      this._heroList.delete(role.livingId);
    }
    // role = null;
  }
  /**
   * 在战斗部队中添加英雄角色
   * @param $hero
   */
  public addHero($hero: HeroRoleInfo) {
    let oldInfo = null;
    if (this._heroList.get($hero.livingId)) {
      oldInfo = this._heroList.get($hero.livingId);
    }
    let newInfo = $hero;
    this._heroList.set($hero.livingId, $hero);
    this._roles.set($hero.livingId, $hero);
    this.maxTotalHp += $hero.blood;
    NotificationManager.Instance.sendNotification(BattleModelNotic.ADD_ROLE, {
      oldInfo: oldInfo,
      newInfo: newInfo,
    });
  }
  /**
   * 根据livingid获取英雄角色
   * @param $id
   * @return
   *
   */
  public getHeroByID($id: number): HeroRoleInfo {
    return this._heroList.get($id) as HeroRoleInfo;
  }
  public get getHeros(): Dictionary {
    return this._heroList;
  }
  /**
   * 添加士兵
   * @param $pawn
   *
   */
  public addPawn($pawn: PawnRoleInfo) {
    let oldInfo = null;
    if (this._pawnList.get($pawn.livingId)) {
      oldInfo = this._pawnList.get($pawn.livingId);
    }
    let newInfo = $pawn;

    this._pawnList.set($pawn.livingId, $pawn);
    this._roles.set($pawn.livingId, $pawn);
    this.maxTotalHp += $pawn.blood;
    NotificationManager.Instance.sendNotification(BattleModelNotic.ADD_ROLE, {
      oldInfo: oldInfo,
      newInfo: newInfo,
    });
  }
  /**
   * 根据livingid取得士兵角色
   * @param $id
   * @return
   *
   */
  public getPawnById($id: number): PawnRoleInfo {
    return this._pawnList.get($id) as PawnRoleInfo;
  }
  public get getPawns(): Dictionary {
    return this._pawnList;
  }
  /**
   * 取得该方所有角色
   * @return
   *
   */
  public get roles(): Dictionary {
    return this._roles;
  }
  /**
   * 取得该方的boss
   * @return
   *
   */
  public get boss(): HeroRoleInfo {
    for (const key in this._heroList) {
      let info = this._heroList.get(key);
      if (info.type == RoleType.T_NPC_BOSS) return info;
    }
    return null;
  }
  public get site(): number {
    return this._site;
  }

  public set site(value: number) {
    this._site = value;
  }

  public addPet($pet: PetRoleInfo) {
    let oldInfo = this._petList.get($pet.livingId);
    let newInfo = $pet;
    this._petList.set($pet.livingId, $pet);
    this._roles.set($pet.livingId, $pet);

    NotificationManager.Instance.sendNotification(BattleModelNotic.ADD_ROLE, {
      oldInfo: oldInfo,
      newInfo: newInfo,
    });
  }

  public get getPets(): Dictionary {
    return this._petList;
  }
}
