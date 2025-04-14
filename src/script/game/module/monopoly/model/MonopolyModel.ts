import ConfigMgr from "../../../../core/config/ConfigMgr";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { ConfigType } from "../../../constant/ConfigDefine";
import { MonopolyEvent } from "../../../constant/event/NotificationEvent";
import { TempleteManager } from "../../../manager/TempleteManager";
import { MonopolyNodeInfo } from "./MonopolyNodeInfo";

/**
 * 云端历险Model
 */
export default class MonopolyModel extends GameEventDispatcher {
  /** 骰子道具模板id */
  public static DICE_TEMPID: number = 2200001;
  /**
   *  无类型
   */
  public static NORMAL_TYPE: number = 0;
  /**
   * 普通战斗类型
   */
  public static NORMAL_BATTLE_TYPE: number = 1;
  /**
   * 增援战斗类型
   */
  public static REINFROCE_BATTLE_TYPE: number = 2;
  /**
   * BOSS战斗类型
   */
  public static BOSS_BATTLE_TYPE: number = 3;
  /**
   * 随机奖励类型
   */
  public static RANDOM_REWARD_TYPE: number = 4;
  /**
   * 陷阱类型
   */
  public static TRAP_TYPE: number = 5;
  /**
   * 宝箱类型
   */
  public static TREASURE_BOX_TYPE: number = 6;
  /**
   * 战斗胜利类型
   */
  public static END_REWARD_TYPE: number = 7;
  /**
   * 战斗失败类型
   */
  public static BATTLE_FAIL_TYPE: number = 8;
  /**
   * 起点类型
   */
  public static BEGIN_TYPE: number = 9;
  /**
   * 终点类型
   */
  public static END_TYPE: number = 10;
  /**
   * 上缴资源类型
   */
  public static RESOURCE_TYPE: number = 11;
  /**
   * 游戏类型
   */
  public static GAME_TYPE: number = 12;
  /**
   * 结束事件类型
   */
  public static EVENT_END_TYPE: number = 100;
  /**
   * 夺宝奇兵达标分值
   */
  public static GEM_MAZE_TARGET: number = 300;
  /**
   * 当前普通色子的剩余投掷次数
   */
  public normalPoint: number;
  /**
   * 当前魔力色子的剩余投掷次数
   */
  //    public  specialPoint : number;
  /**
   * 当前战争旗帜的个数
   */
  public warFlag: number;
  /**
   * 服务器返回的当前格子数
   */
  public position: number;
  /**
   * 服务器给出的点数
   */
  public resultPoint: number;
  /**
   * 可购买魔力色子的剩余次数
   */
  //    public  lastBuySpecialPoint : number;
  /**
   * 可购买战争旗帜的剩余个数
   */
  //    public  lastBuyWarFlag : number;
  /**
   * 节点信息
   */
  public nodeInfos: Array<MonopolyNodeInfo>;
  /**
   * 普通色子抽奖剩余次数
   */
  public normalTimes: number;
  /**
   * 魔力色子抽奖剩余次数
   */
  //    public  magicTimes : number;
  /**
   * 老虎机抽奖剩余次数
   */
  public slotMachineTimes: number;
  /**
   * 中奖列表
   */
  public itemInfos: Array<any>;
  /**
   * 中奖物品是否走邮件
   */
  public isMail: boolean;
  /**
   * 上一个位置
   */
  public lastPosition: number = 0;
  /**
   * 剩余副本次数
   */
  public campaignCount: number;
  /**
   * 战争旗帜最大购买数量
   */
  //    public  warFlagMax : number = 5;
  /**
   * 战争旗帜购买价格
   */
  //    public  warFlagPrice : number = 10;
  /**
   * 魔力骰子最大购买数量
   */
  //    public  magicDiceMax : number = 5;
  /**
   * 魔力骰子购买价格
   */
  //    public  magicDicePrice : number = 50;

  //    public get gameIsOver():boolean
  //     {
  //         if(this.normalPoint == 0 && this.lastBuySpecialPoint == 0)
  //         {
  //             return true;
  //         }
  //         return false;
  //     }
  //普通骰子
  private diceCount: number = 0;
  //倍数抽奖消耗
  // private cost:number=0;
  //终点抽奖消耗
  public endCost: number = 0;
  /** 购买次数越高，价钱越贵 */
  public buyMagicDiceCount: number = 0;
  public maxbuyTimes: number = 0;
  // 如配置：“30,50,70,90,120,150”，代表第1次购买30钻，第2次50...第6次150
  public dicePriceArr: any = [];
  openDay: Array<string>;

  constructor() {
    super();
    this.nodeInfos = [];

    //一次买多少步数, 一步的价格, 最大步数上限
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("Monopoly_Day");
    if (cfg) {
      let day: string = cfg.ConfigValue;
      if (day) {
        this.openDay = day.split(",");
      }
    }

    //Dice_Monopoly 云端历险普通骰子, 倍数抽奖消耗, 终点抽奖消耗 10,2,2
    cfg = TempleteManager.Instance.getConfigInfoByConfigName("Dice_Monopoly");
    if (cfg) {
      let str: string = cfg.ConfigValue;
      if (str) {
        let flagConfig = str.split(",");
        this.diceCount = parseInt(flagConfig[0]);
        this.endCost = parseInt(flagConfig[1]);
        // this.warFlagMax = parseInt(flagConfig[0]);
        // this.warFlagPrice =  parseInt(flagConfig[1]);
      }
    }
    //云端历险魔力骰子购买信息
    cfg = TempleteManager.Instance.getConfigInfoByConfigName(
      "Monopoly_Dice_BuyInfo",
    );
    if (cfg) {
      let str: string = cfg.ConfigValue;
      if (str) {
        this.dicePriceArr = str.split(",");
        this.maxbuyTimes = this.dicePriceArr.length;
      }
    }
    // str = TempleteManager.Instance.getConfigInfoByConfigName("Flag_Monopoly").ConfigValue;
    // if(str){
    //     let diceConfig = str.split(',');
    //     this.magicDiceMax =  parseInt(diceConfig[2]);
    // 	this.magicDicePrice =  parseInt(diceConfig[3]);
    // }
  }

  public get needDiamond(): number {
    return this.dicePriceArr[this.buyMagicDiceCount];
  }

  public get leftBuyTimes(): number {
    return this.maxbuyTimes - this.buyMagicDiceCount;
  }

  public getPath(): Array<any> {
    var path: Array<any> = [];
    var nodeInfo: MonopolyNodeInfo;
    var startPosition: number = this.lastPosition;
    var endPosition: number = this.position;
    var i: number;
    if (startPosition < endPosition) {
      for (i = 0; i < this.nodeInfos.length; i++) {
        nodeInfo = this.nodeInfos[i] as MonopolyNodeInfo;
        if (!nodeInfo) {
          continue;
        }
        if (nodeInfo.position < startPosition) {
          continue;
        } else if (nodeInfo.position <= endPosition) {
          path.push(new Laya.Point(nodeInfo.x, nodeInfo.y));
        } else {
          break;
        }
      }
    } else if (startPosition > endPosition) {
      for (i = this.nodeInfos.length - 1; i >= 0; i--) {
        nodeInfo = this.nodeInfos[i] as MonopolyNodeInfo;
        if (!nodeInfo) {
          continue;
        }
        if (
          nodeInfo.position <= startPosition &&
          nodeInfo.position >= endPosition
        ) {
          path.push(new Laya.Point(nodeInfo.x, nodeInfo.y));
        }
      }
    }
    return path;
  }

  public commit(isBuyMagic = false): void {
    this.dispatchEvent(MonopolyEvent.MONOPOLY_INFO_CHANGE, isBuyMagic);
  }
}
