//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 21:31:47
 * @LastEditTime: 2023-09-21 12:09:43
 * @LastEditors: jeremy.xu
 * @Description:
 */

import { BuildingOrderInfo } from "../../datas/playerinfo/BuildingOrderInfo";
import FrameDataBase from "../../mvc/FrameDataBase";
import { NotificationManager } from "../../manager/NotificationManager";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import { ArrayUtils, ArrayConstant } from "../../../core/utils/ArrayUtils";
import { PetChallengeRewardTemplate } from "./data/PetChallengeRewardTemplate";
import {
  PetChallengeEvent,
  PetChallengeRewardType,
  PetChallengeTimeRewardType,
} from "../../constant/PetDefine";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_dropconditionData } from "../../config/t_s_dropcondition";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_dropitemData } from "../../config/t_s_dropitem";
import { PetChallengeObjectData } from "./data/PetChallengeObjectData";
import { ShowPetAvatar } from "../../avatar/view/ShowPetAvatar";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { t_s_appellData } from "../../config/t_s_appell";
import { GoodsManager } from "../../manager/GoodsManager";
import ItemID from "../../constant/ItemID";

export default class PetChallengeData extends FrameDataBase {
  public static CHALLENGE_CNT: number = 4;
  public static CARRY_PET_CNT: number = 3;
  public static CARRY_SKILL_CNT: number = 3;
  public isInitRewardData: boolean = false;

  public challengeList: any[]; //of PetChallengeObjectData
  public challengeTopList: any[]; //of PetChallengeObjectData
  public challengeEventList: any[];
  public score: number; //积分
  public ranking: number = 0; //排名
  public totalFightPower: number = 0; //总战力
  public mineChallengeTeam: any[];
  public buildingOrder: BuildingOrderInfo;

  public formationString: string;

  private _dayRewards: PetChallengeRewardTemplate[];
  private _weekGoodRewards: PetChallengeRewardTemplate[];
  private _weekBuffRewards: PetChallengeRewardTemplate[];
  private _weekAppellRewards: PetChallengeRewardTemplate[];

  constructor() {
    super();
    this.challengeList = [];
    this.challengeTopList = [];
    this.challengeEventList = [];
    this.buildingOrder = new BuildingOrderInfo();
  }

  public commitInfoChange() {
    NotificationManager.Instance.dispatchEvent(
      PetChallengeEvent.CHALLENGE_INFO_CHAGNE,
    );
  }

  public commitTimeChange() {
    NotificationManager.Instance.dispatchEvent(
      PetChallengeEvent.CHALLENGE_TIME_CHANGE,
    );
  }

  public commitEventChange() {
    NotificationManager.Instance.dispatchEvent(
      PetChallengeEvent.CHALLENGE_EVENT_CHANGE,
    );
  }

  public get petChallengeFormationOfArray(): any[] {
    if (this.formationString) {
      return this.formationString.split(",");
    }
    return [];
  }

  private initRewardData(): void {
    if (this.isInitRewardData) return;

    let valueArr: any[] = LangManager.Instance.GetTranslation(
      "PetChallengeRewardTemplate.allAddValue",
    ).split(",");
    let appellArr: any[] = LangManager.Instance.GetTranslation(
      "PetChallengeRewardTemplate.allAppellValue",
    ).split(",");

    /**
     * 写死的奖励
     */
    for (let i: number = 1; i <= 3; i++) {
      let temp = new PetChallengeRewardTemplate();
      temp.RewardType = PetChallengeRewardType.BUFF; //buff
      temp.isExtraReward = true;
      temp.Type = PetChallengeTimeRewardType.WeekReward; //周奖励
      temp.rankIdx = i;
      temp.rewardName = "+" + valueArr[i];
      let key =
        temp.RewardType.toString() + temp.Type.toString() + temp.rankIdx;
      this.rewardCate[key] = temp;

      temp = new PetChallengeRewardTemplate();
      temp.RewardType = PetChallengeRewardType.APPELL; //称号
      temp.isExtraReward = true;
      temp.Type = PetChallengeTimeRewardType.WeekReward; //周奖励
      temp.rankIdx = i;
      var appell: t_s_appellData = ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_appell,
        appellArr[i],
      );
      if (appell) {
        temp.rewardName = appell.TitleLang;
      }

      key = temp.RewardType.toString() + temp.Type.toString() + temp.rankIdx;
      this.rewardCate[key] = temp;
    }

    let dropArr: t_s_dropconditionData[] =
      TempleteManager.Instance.getDropConditionByType(38);
    for (let index = 0; index < dropArr.length; index++) {
      const element = dropArr[index];
      let Type = element.Para1[0];
      let RewardType = PetChallengeRewardType.GOODS;
      let ScoreScope = element.Para2.join(",");
      let key = RewardType + Type + ScoreScope;

      let temp: PetChallengeRewardTemplate;
      if (!this.rewardCate[key]) {
        temp = new PetChallengeRewardTemplate();
        temp.rankIdx = 0;
        temp.Type = Type;
        temp.RewardType = RewardType;
        temp.scoreScope = ScoreScope;

        let tempArr: any[];
        tempArr = ScoreScope.split(",");
        if (tempArr.length == 1) {
          temp.minScore = parseInt(tempArr[0]);
          temp.maxScore = parseInt(tempArr[0]);
        } else if (tempArr.length == 2) {
          temp.minScore = parseInt(tempArr[0]);
          temp.maxScore = parseInt(tempArr[1]);
        }
      } else {
        temp = this.rewardCate[key];
      }

      temp.goodList = this.getRewardInfosByDropId(element.DropId);
      this.rewardCate[key] = temp;
    }
    this.isInitRewardData = true;
  }

  private getRewardInfosByDropId(dropId: number): GoodsInfo[] {
    //优化标记 根据原逻辑修改
    let goodList = [];
    let infos = TempleteManager.Instance.getDropItemssByDropId(dropId);
    if (infos && infos.length > 0) {
      for (let index = 0; index < infos.length; index++) {
        const temp = infos[index];
        let gInfo = new GoodsInfo();
        gInfo.templateId = temp.ItemId;
        gInfo.count = temp.Data;
        goodList.push(gInfo);
      }
    }

    return goodList;
  }

  /**
   * @return 周排行物品奖励
   */
  public get weekGoodRewards(): PetChallengeRewardTemplate[] {
    if (!this._weekGoodRewards) {
      this._weekGoodRewards = [];
      let dic = this.rewardCate;
      for (const key in dic) {
        if (Object.prototype.hasOwnProperty.call(dic, key)) {
          const temp = dic[key] as PetChallengeRewardTemplate;
          if (
            temp.Type == PetChallengeTimeRewardType.WeekReward &&
            temp.RewardType == PetChallengeRewardType.GOODS
          ) {
            this._weekGoodRewards.push(temp);
          }
        }
      }
      ArrayUtils.sortOn(
        this._weekGoodRewards,
        ["RewardType", "TemplateId"],
        [
          ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
          ArrayConstant.NUMERIC,
        ],
      );
    }
    return this._weekGoodRewards;
  }

  /**
   * 根据积分查询周奖励
   * @param ranking
   * @return PetChallengeRewardTemplate列表
   */
  public getWeekRankingReward(score: number): PetChallengeRewardTemplate[] {
    let rewards = [];
    this.weekGoodRewards.forEach((temp: PetChallengeRewardTemplate) => {
      if (temp.minScore <= score && score <= temp.maxScore) {
        rewards.push(temp);
      }
    });
    return rewards;
  }

  private getChallengeListExceptSelf(): PetChallengeObjectData[] {
    let list: PetChallengeObjectData[] = [];
    for (let index = 0; index < this.challengeList.length; index++) {
      const temp = this.challengeList[index] as PetChallengeObjectData;
      if (temp) {
        if (!temp.isSelf) {
          list.push(temp);
        }
      }
    }
    return list;
  }

  public getOutLanderOrderPos() {
    let pos = -1;
    let bagDic = GoodsManager.Instance.getGeneralBagList();
    for (const key in bagDic) {
      if (bagDic.hasOwnProperty(key) && !key.startsWith("__")) {
        let info: GoodsInfo = bagDic[key];
        if (info.templateId == ItemID.OUTLANDER_ORDER) {
          pos = info.pos;
          break;
        }
      }
    }
    return pos;
  }

  /**
   * 成功返回正
   * 失败返加负
   */
  public static getResultScore(
    selfScore: number,
    defencerScore: number,
    win: boolean,
  ) {
    let reScore = 0;
    let dValue = selfScore - defencerScore;
    if (win) {
      let attackAdd = Number(
        TempleteManager.Instance.getConfigInfoByConfigName(
          "Pet_arena_reward_win",
        ).ConfigValue,
      );
      let res = this.getRevise(dValue, true);
      if (dValue < 0) {
        //比对手低分, 获胜得分=积分基础值+积分基础值*获胜修正值
        attackAdd = attackAdd + Math.floor((attackAdd * res) / 100);
      } else if (dValue > 0) {
        //比对手高分, 获胜得分=积分基础值-积分基础值*获胜修正值
        attackAdd = attackAdd - Math.floor((attackAdd * res) / 100);
      }
      reScore = attackAdd;
    } else {
      let attackReduce = Number(
        TempleteManager.Instance.getConfigInfoByConfigName(
          "Pet_arena_reward_lose",
        ).ConfigValue,
      );
      let res = this.getRevise(dValue, false);
      if (dValue < 0) {
        //比对手低分, 失败扣分=积分基础值-积分基础值*失败修正值
        attackReduce = attackReduce - Math.floor((attackReduce * res) / 100);
      } else if (dValue > 0) {
        //比对手高分
        attackReduce = attackReduce + Math.floor((attackReduce * res) / 100);
      }
      reScore = -attackReduce;
    }
    return reScore;
  }

  public static getRevise(dValue: number, isWin: boolean) {
    let attackRevise = 0;
    let defenceRevise = 0;
    let abs = Math.abs(dValue);
    if (isWin) {
      if (abs < 50) {
      } else if (abs < 100) {
        attackRevise = 10;
        defenceRevise = 5;
      } else if (abs < 200) {
        attackRevise = 20;
        defenceRevise = 10;
      } else if (abs < 400) {
        attackRevise = 40;
        defenceRevise = 15;
      } else if (abs < 600) {
        attackRevise = 60;
        defenceRevise = 20;
      } else {
        attackRevise = 80;
        defenceRevise = 25;
      }
    } else {
      if (abs < 50) {
      } else if (abs < 100) {
        attackRevise = 5;
        defenceRevise = 10;
      } else if (abs < 200) {
        attackRevise = 10;
        defenceRevise = 20;
      } else if (abs < 400) {
        attackRevise = 15;
        defenceRevise = 40;
      } else if (abs < 600) {
        attackRevise = 20;
        defenceRevise = 60;
      } else {
        attackRevise = 25;
        defenceRevise = 80;
      }
    }
    return attackRevise;
  }

  public get rewardCate(): any {
    return ConfigMgr.Instance.petChallengeRewardCate;
  }

  public show() {
    super.show();
    this.initRewardData();
  }

  public dispose() {
    super.dispose();
    ShowPetAvatar.releaseAllRes();
  }
}
