/*
 * @Author: jeremy.xu
 * @Date: 2021-06-25 17:47:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-05-31 14:16:07
 * @Description: 农场模块数据的存储、处理类, 提供数据操作的API
 */

import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { SimpleDictionary } from "../../../../core/utils/SimpleDictionary";
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import { UpgradeType } from "../../../constant/UpgradeType";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FarmManager } from "../../../manager/FarmManager";
import { FriendManager } from "../../../manager/FriendManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { WaterManager } from "../../../manager/WaterManager";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import FarmInfo from "./FarmInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import FriendFarmStateInfo from "./FriendFarmStateInfo";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PetData } from "../../pet/data/PetData";
import Logger from "../../../../core/logger/Logger";

export class FarmModel extends GameEventDispatcher {
  public static STEP: number = 9999999;
  /**
   *农场开关
   */
  public static OPEN: boolean = true;
  /**
   *土地数量
   */
  public static LAND_NUM: number = 9;
  /**
   *默认开放土地数量
   */
  public static DEFAULT_OPEN_LAND: number = 3;
  /**
   *最大开放土地数量
   */
  public static MAX_OPEN_LAND: number = 9;
  /**
   *土地升级功能开放等级
   */
  public static LANDUP_OPEN_LEVEL: number = 30;
  /**
   *最高土地等级
   */
  public static MAX_LAND_LEVEL: number = 10;
  /**
   *最大被偷次数
   */
  public static MAX_STOLEN_COUNT: number = 3;
  /**
   *最大每日浇水次数
   */
  public static MAX_DAY_WATER_COUNT: number = 3;
  /**
   *加速需要支付钻石数
   */
  public acceleratePay: number = 0;
  /**
   *最大每日偷取他人次数
   */
  public maxDayStealCount: number = 0;
  /**
   *单次除草经验
   */
  private _expWeed: number = 0;
  /**
   *单次除虫经验
   */
  private _expWorm: number = 0;
  /**
   *单次复活经验
   */
  private _expRevive: number = 0;
  /**
   *单次充能经验
   */
  private _expGivePower: number = 1;
  /**
   *单次神树收获经验
   */
  private _expTreePick: number = 1;
  /**
   *每日可从好友获取的最大经验
   */
  private _maxDayGpFromFriend: number = 0;
  /**
   *上一个场景
   */
  public preMapId: number = 0;
  /**
   * 是否需要返回天空之城（针对英灵岛, 紫晶矿场直接进入农场的情况特殊处理）
   */
  public needReturnSpace: boolean = false;

  private _fullExpType: number = 0;
  private _farmList: SimpleDictionary;
  private _farmStateList: SimpleDictionary;
  private _curSelectedFarmInfo: FarmInfo;
  private _curSelectedUserInfo: ThaneInfo;
  private _curSelectedGoodInfo: GoodsInfo;

  constructor() {
    super();
    this._farmList = new SimpleDictionary();
    this._farmStateList = new SimpleDictionary();

    let cfgTemp = null;
    let cfgTempValue = 0;
    cfgTemp = TempleteManager.Instance.getConfigInfoByConfigName(
      "FarmCrop_Operate_GP",
    );
    if (cfgTemp) {
      cfgTempValue = Number(cfgTemp.ConfigValue);
    }
    this._expWeed = this._expWorm = this._expRevive = cfgTempValue;

    cfgTemp = TempleteManager.Instance.getConfigInfoByConfigName(
      "Farm_TodayFromFriend_GP",
    );
    if (cfgTemp) {
      cfgTempValue = Number(cfgTemp.ConfigValue);
    }
    this._maxDayGpFromFriend = cfgTempValue;

    cfgTemp = TempleteManager.Instance.getConfigInfoByConfigName(
      "Farm_TodayStolen_Count",
    );
    if (cfgTemp) {
      cfgTempValue = Number(cfgTemp.ConfigValue);
    }
    this.maxDayStealCount = cfgTempValue;

    cfgTemp = TempleteManager.Instance.getConfigInfoByConfigName(
      "Farm_Accelerate_Point",
    );
    if (cfgTemp) {
      cfgTempValue = Number(cfgTemp.ConfigValue);
    }
    this.acceleratePay = cfgTempValue;
  }

  /**
   * 我的农场信息
   */
  public get myFarm(): FarmInfo {
    return this.getFarmInfo(this.thane.userId);
  }

  /**
   * 获得玩家农场信息, 没有返回null
   */
  public getFarmInfo(userId: number): FarmInfo {
    return this._farmList[userId];
  }

  /**
   * 添加玩家农场信息
   */
  public addFarmInfo(info: FarmInfo) {
    if (info) {
      this._farmList.add(info.userId, info);
    }
  }

  /**
   * 删除玩家农场信息
   */
  public delFarmInfo(userId: number) {
    this._farmList.del(userId);
  }

  /**
   * 得到玩家农场状态信息
   */
  public getFarmStateInfo(userId: number): FriendFarmStateInfo {
    let info: FriendFarmStateInfo = this._farmStateList[userId];
    if (!info) {
      info = new FriendFarmStateInfo();
      info.userId = userId;
      this._farmStateList.add(userId, info);
    }
    // Logger.xjy("[FarmModel]getFarmStateInfo ", userId, info.canGivePower, info )
    return info;
  }

  public set curSelectedGoodInfo(value: GoodsInfo) {
    this._curSelectedGoodInfo = value;
  }

  public get curSelectedGoodInfo(): GoodsInfo {
    return this._curSelectedGoodInfo;
  }

  public get farmStateList(): SimpleDictionary {
    return this._farmStateList;
  }

  /**
   * 当前选中农场信息
   */
  public get curSelectedFarmInfo(): FarmInfo {
    return this._curSelectedFarmInfo;
  }

  /**
   * 当前选中玩家信息
   */
  public get curSelectedUserInfo(): ThaneInfo {
    return this._curSelectedUserInfo;
  }

  public set curSelectedUserInfo(info: ThaneInfo) {
    if (!info || this._curSelectedUserInfo == info) {
      return;
    }
    this._curSelectedUserInfo = info;
    if (this.checkIsSelf(this._curSelectedUserInfo.userId) && this.myFarm) {
      this._curSelectedFarmInfo = this.myFarm;
    } else {
      this._curSelectedFarmInfo = new FarmInfo();
      this._curSelectedFarmInfo.userId = this._curSelectedUserInfo.userId;
      this._curSelectedFarmInfo.nickName = this._curSelectedUserInfo.nickName;
      this._curSelectedFarmInfo.frameId = this._curSelectedUserInfo.frameId;
      this.addFarmInfo(this._curSelectedFarmInfo);
    }
    WaterManager.Instance.model.currentSelectedUser = info;
    this.commitSelected();
    FarmManager.Instance.sendReqFarmInfo(this._curSelectedUserInfo.userId);
  }

  /**
   * 默认选中玩家信息
   */
  public set defaultSelectedUserInfo(value: ThaneInfo) {
    if (this._curSelectedUserInfo == value) {
      this.commitSelected();
    } else {
      this.curSelectedUserInfo = value;
    }
  }

  private commitSelected() {
    this.dispatchEvent(
      FarmEvent.SELECTED_CHANGE,
      this._curSelectedFarmInfo,
      this._curSelectedUserInfo,
    );
  }

  /**
   * 获得农场某次操作的经验值
   * @param oper: 操作类型
   * @return : 经验值
   *
   */
  public expByOper(oper: number): number {
    if (!this.curSelectedFarmInfo) {
      return 0;
    }
    let exp: number = 0;
    let upGrade: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        this.myFarm.grade + 1,
        UpgradeType.UPGRADE_TYPE_FARM,
      );

    switch (oper) {
      case FarmOperateType.WORM:
        exp = this._expWorm;
        break;
      case FarmOperateType.WEED:
        exp = this._expWeed;
        break;
      case FarmOperateType.REVIVE:
        exp = this._expRevive;
        break;
      case FarmOperateType.GIVE_POWER:
        let fInfo: ThaneInfo = FriendManager.getInstance().getFriendById(
          this.curSelectedFarmInfo.userId,
        );
        if (fInfo) {
          exp = this._expGivePower * fInfo.friendGrade;
        } else {
          exp = this._expGivePower;
        }
        break;
      case FarmOperateType.TREE_PICK:
        exp = this._expTreePick;
        break;
    }

    if (this.myFarm.grade >= this.thane.grades) {
      if (!upGrade) {
        this._fullExpType = 1;
        return 0;
      }
      if (upGrade && this.myFarm.gp + exp > upGrade.Data) {
        exp = upGrade.Data - this.myFarm.gp;
        if (exp <= 0) {
          this._fullExpType = 1;
        }
        return exp;
      }
    }
    if (
      this.curSelectedFarmInfo.userId != this.myFarm.userId &&
      this.myFarm.dayGpFromFriend + exp > this._maxDayGpFromFriend
    ) {
      exp = this._maxDayGpFromFriend - this.myFarm.dayGpFromFriend;
      if (exp <= 0) {
        this._fullExpType = 2;
      }
      return exp;
    }
    return exp;
  }

  /**
   * 获得经验达到上限类型（1:农场经验达到上限 2:每日从好友获得经验达到上限）
   */
  public get fullExpType(): number {
    return this._fullExpType;
  }

  public static getPetData(exceptPetId: number = 0): PetData[] {
    var petList: any[] =
      PlayerManager.Instance.currentPlayerModel.playerInfo.petList;
    let pets = [];
    for (let index = 0; index < petList.length; index++) {
      const pet = petList[index] as PetData;
      if (pet.isEnterWar || pet.petId == exceptPetId || pet.isPractice) {
        continue;
      }
      pets.push(pet);
    }
    return pets;
  }

  private checkIsSelf(userId: number): boolean {
    return userId == this.thane.userId;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
