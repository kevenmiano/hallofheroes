/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-05 17:43:45
 * @LastEditTime: 2024-02-02 14:38:45
 * @LastEditors: jeremy.xu
 * @Description: 战斗界面角色信息显示UI(头像/血槽等)
 */
import Logger from "../../../../core/logger/Logger";
import { PackageIn } from "../../../../core/net/PackageIn";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import Dictionary from "../../../../core/utils/Dictionary";
import { Int64Utils } from "../../../../core/utils/Int64Utils";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { BattleType, RoleType } from "../../../constant/BattleDefine";
import {
  BattleEvent,
  BattleNotic,
} from "../../../constant/event/NotificationEvent";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import BattleWnd from "../BattleWnd";
import { BossInfoView } from "./BossInfoView";
import { BossBufferContainer } from "./buffer/BossBufferContainer";

//@ts-expect-error: External dependencies
import BossHpMsg = com.road.yishi.proto.battle.BossHpMsg;
//@ts-expect-error: External dependencies
import WorldBossInfoMsg = com.road.yishi.proto.simple.WorldBossInfoMsg;
//@ts-expect-error: External dependencies
import SyncRoomBossHPMsg = com.road.yishi.proto.simple.SyncRoomBossHPMsg;
//@ts-expect-error: External dependencies
import RoomBossInfoMsg = com.road.yishi.proto.simple.RoomBossInfoMsg;
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
export class RoleShowViewII extends Laya.Sprite implements IEnterFrame {
  /**
   * 是否有boss
   */
  private _rightIsBoss: boolean;
  /**
   * boss信息视图
   */
  public _bossView: BossInfoView;
  private _boss: HeroRoleInfo;
  public get bossInfo(): HeroRoleInfo {
    return this._boss;
  }

  private _nextWaveCame: boolean = true;

  protected wnd: BattleWnd;
  constructor(wnd: BattleWnd) {
    super();
    this.wnd = wnd;

    // this.inittest();
    this.createRightView();
    this.addEvent();
  }

  private inittest() {
    // 测试 HeroRoleInfo
    this._boss = new HeroRoleInfo();
    this._boss.heroInfo.grades = 12;
    this._boss.heroInfo.nickName = "我是大Boss";
    this._boss.heroInfo.templateId = 5055;
    this._bossView = BossInfoView.createInstance() as BossInfoView;
    this._bossView.setParent(this.wnd.getContentPane());
    this._bossView.setInfo(this._boss);
    this._bossView.setTotalHp(1000);
    this._bossView.setCurrentHp(1000);
  }

  private createRightView() {
    this._rightIsBoss = this.isBoss(this.battleModel.armyInfoRight.getHeros);
    // this._rightIsBoss = true
    if (this._rightIsBoss) {
      //如果右边是BOSS
      this._bossView = BossInfoView.createInstance() as BossInfoView;
      this._bossView.setParent(this.wnd.getContentPane());
      this._bossView.roleShowInfo2.visible = this._rightIsBoss;
      this._bossView.setInfo(this._boss);
      this._bossView.setTotalHp(
        this.battleModel.armyInfoRight.getBossesTotalHp(),
      );
      this._bossView.setCurrentHp(
        this.battleModel.armyInfoRight.getBossesLeftHp(),
      );
    }
  }

  /**
   * bossbuffer视图
   */
  public get bossBufferContainer(): BossBufferContainer {
    if (this._bossView) return this._bossView.bossBufferContainer;
    return null;
  }

  /**
   * boss增援 设置boss信息中血量值
   * boss血量计算由所有角色血量相加
   * boss增援时, 需要更新bossbuffer列表
   * @param members
   *
   */
  public bossReinforce(members: any[]) {
    var role: HeroRoleInfo;
    var totalHp: number = 0;

    for (var i: number = 0; i < members.length; i++) {
      if (!role) role = members[i];
      totalHp += members[i].totalBloodA;
      if (role && role.heroInfo.grades <= members[i].heroInfo.grades) {
        role = members[i];
      }
    }
    this._boss = role;

    if (!this._rightIsBoss) {
      this._rightIsBoss = true;
      this.createRightView();
    }

    Logger.battle("[RoleShowViewII]bossReinforce", members, this._boss);

    this._bossView.setInfo(this._boss);
    this._bossView.setTotalHp(totalHp);
    this._bossView.setCurrentHp(
      this.battleModel.armyInfoRight.getBossesLeftHp(),
    );
    if (this.bossBufferContainer) {
      this.bossBufferContainer.removeEvent();
      this.bossBufferContainer.initEvent(this._boss);
      this.bossBufferContainer.reFreshBuffer(null);
    }
  }
  /**
   * 查看是否是BOSS. 并设置代表性boss
   * 由所有boss中等级最大的代表
   * @param heroList
   * @return
   *
   */
  private isBoss(heroList: Dictionary): boolean {
    for (const key in heroList) {
      if (Object.prototype.hasOwnProperty.call(heroList, key)) {
        const hero: HeroRoleInfo = heroList[key];
        if (hero.type == RoleType.T_NPC_BOSS) {
          if (!this._boss) this._boss = hero;
          if (this._boss && this._boss.heroInfo.grades < hero.heroInfo.grades)
            this._boss = hero;
        }
      }
    }
    return this._boss != null;
  }

  private isNeedShowRightView(): boolean {
    if (
      this.battleModel.battleType == BattleType.CASTLE_BATTLE ||
      this.battleModel.battleType == BattleType.BATTLE_DEBUG_BOSS ||
      this.battleModel.battleType == BattleType.WILD_QUEUE_BATTLE ||
      this.battleModel.battleType == BattleType.BATTLE_MATCHING ||
      this.battleModel.battleType == BattleType.BATTLE_DEBUG_MODE
    ) {
      return true;
    }
    return false;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  private addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
    this.battleModel.addEventListener(
      BattleEvent.REDUCE_WORLD_BOSS_BLOOD,
      this.onReduceWorldBossBlood,
      this,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SYNC_BOSS_HP,
      this,
      this.__syncBossHpHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ADD_BOSS_HP,
      this,
      this.__addBossHpHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_SYNC_ROOM_BOSS_HP,
      this,
      this.__roomBossHPSyncHandler,
    );
  }

  private tailaPreHp: number = 0;
  private __roomBossHPSyncHandler(pkg: PackageIn) {
    var bossInfo: HeroRoleInfo = this.battleModel.armyInfoRight.boss; //当前队伍对战的boss
    var msg = pkg.readBody(SyncRoomBossHPMsg) as SyncRoomBossHPMsg;
    var bosses: Array<any> = msg.roomBossInfoList.roomBoss;
    var boss: RoomBossInfoMsg;
    if (bosses && bosses.length > 0) {
      boss = bosses[0] as RoomBossInfoMsg;
    }
    if (bossInfo != null) {
      if (this.battleModel.battleType == BattleType.ROOM_BOSS_BATTLE) {
        let tempCurHp = boss.curHp as any;
        let syncHp: number;
        if (tempCurHp.high) {
          syncHp = Int64Utils.int64ToNumber(tempCurHp);
        } else {
          syncHp = Number(tempCurHp);
        }

        // 初始化||有变化
        if (
          this.tailaPreHp == 0 ||
          (this.tailaPreHp != 0 && Math.abs(this.tailaPreHp - syncHp) > 0)
        ) {
          let deltaHp = syncHp - bossInfo.bloodA;
          Logger.battle(
            "多人本房间共享血量boss变化",
            syncHp,
            bossInfo.bloodA,
            deltaHp,
          );
          this._bossView.setCurrentHp(syncHp);
          bossInfo.updateBloodSecurity(deltaHp);
        }
        this.tailaPreHp = syncHp;
      }
    }
  }

  /**
   * boss血量增加 , 图腾加血, 或者给boss加血
   * @param event
   *
   */
  protected __addBossHpHandler(pkg: PackageIn) {
    var msg = pkg.readBody(BossHpMsg) as BossHpMsg;
    Logger.battle("[RoleShowViewII]boss血量增加", hpValue);
    var hpValue: number = msg.value;
    if (msg.livingId && this._boss.livingId == msg.livingId) {
      this._bossView.updateWorldBossHp(Math.abs(hpValue));
    }
  }
  /**
   * 同步boss血量 , 主要用于世界boss
   * @param evt
   *
   */
  private __syncBossHpHandler(pkg: PackageIn) {
    var msg = pkg.readBody(WorldBossInfoMsg) as WorldBossInfoMsg;
    Logger.battle(
      "[RoleShowViewII]世界BOSS血量服务器接收==",
      msg.curHp,
      msg.currentMillis,
    );
    var time = Int64Utils.int64ToNumber(msg.currentMillis as any);
    this.battleModel.updateWorldBossBlood(msg.curHp, time);
  }
  /**
   * 减少世界boss血量
   * @param event
   */
  private onReduceWorldBossBlood(hpValue: any) {
    Logger.battle("[RoleShowViewII]减少世界boss血量 ", hpValue);
    this._bossView.updateWorldBossHp(Number(hpValue));
  }

  public enterFrame() {
    if (!this.battleModel) return;

    var leftBlood: number = this.battleModel.getMyHeroLeftHp();
    var maxBoold: number = this.battleModel.selfHero.totalBloodA;
    var rightBlood: number = this.battleModel.armyInfoRight.getLeftHp();
    var precent: number = leftBlood / maxBoold;
    if (this.wnd.bottomBar && this.wnd.bottomBar.selfBloodView) {
      this.wnd.bottomBar.selfBloodView.updateHeroHp(
        precent,
        leftBlood,
        maxBoold,
      );
    }
    if (this._rightIsBoss) {
      var bossHp: number = this.battleModel.armyInfoRight.getBossesLeftHp();
      this._bossView.setCurrentHp(bossHp);
    }

    if (leftBlood <= 0 || rightBlood <= 0) {
      //自己死亡或者对方全部死亡, 让自己的技能不可用
      this.battleModel.isOver = true;
      NotificationManager.Instance.sendNotification(
        BattleNotic.FORCE_SKILL_ENABLE,
        false,
      );
    }
    if (rightBlood > 0) {
      this._nextWaveCame = true;
    }
    if (rightBlood <= 0) {
      if (this._nextWaveCame) {
        this.wnd.reinforceViewHandler.updateReinforceWave();
        this._nextWaveCame = false;
      }
    }
  }
  public dispose() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    if (this._bossView) this._bossView.dispose();
    this._bossView = null;
    if (this.bossBufferContainer) this.bossBufferContainer.dispose();

    if (this.battleModel) {
      this.battleModel.removeEventListener(
        BattleEvent.REDUCE_WORLD_BOSS_BLOOD,
        this.onReduceWorldBossBlood,
        this,
      );
    }
    ServerDataManager.cancel(
      S2CProtocol.U_C_SYNC_BOSS_HP,
      this,
      this.__syncBossHpHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_ADD_BOSS_HP,
      this,
      this.__addBossHpHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_SYNC_ROOM_BOSS_HP,
      this,
      this.__roomBossHPSyncHandler,
    );
  }
}
