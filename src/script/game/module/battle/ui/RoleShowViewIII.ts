import Dictionary from "../../../../core/utils/Dictionary";
import { BattleManager } from "../../../battle/BattleManager";
import { BattleModel } from "../../../battle/BattleModel";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { RoleType } from "../../../constant/BattleDefine";
import { BattleNotic } from "../../../constant/event/NotificationEvent";
// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import BattleWnd from "../BattleWnd";
import { BossBufferContainer } from "./buffer/BossBufferContainer";
import { DoubleBossInfoView } from "./DoubleBossInfoView";

export class RoleShowViewIII extends Laya.Sprite implements IEnterFrame {
  public _bossView: DoubleBossInfoView;
  private _boss1: HeroRoleInfo;
  private _boss2: HeroRoleInfo;
  protected view: BattleWnd;
  constructor(view: BattleWnd) {
    super();
    this.view = view;
    this.createRightView();
    this.addEvent();
  }

  private createRightView() {
    this.setBossInfo(this.battleModel.armyInfoRight.getHeros);
    this._bossView = DoubleBossInfoView.createInstance() as DoubleBossInfoView;
    if (this.needExchange) {
      this._bossView.bossBufferContainer1 = new BossBufferContainer(
        this._bossView,
        2,
        this._boss2
      );
      this._bossView.bossBufferContainer2 = new BossBufferContainer(
        this._bossView,
        1,
        this._boss1
      );
      this._bossView.setParent(this.view.getContentPane());
      this._bossView.setInfo(this._boss2, this._boss1);
      this._bossView.setTotalHp(
        this.battleModel.armyInfoRight.getBossesTotalHpByInfo(this._boss2),
        this.battleModel.armyInfoRight.getBossesTotalHpByInfo(this._boss1)
      );
      this._bossView.setCurrentHp(
        this.battleModel.armyInfoRight.getBossesLeftHpByInfo(this._boss2),
        this.battleModel.armyInfoRight.getBossesLeftHpByInfo(this._boss1)
      );
    } else {
      this._bossView.bossBufferContainer1 = new BossBufferContainer(
        this._bossView,
        1,
        this._boss1
      );
      this._bossView.bossBufferContainer2 = new BossBufferContainer(
        this._bossView,
        2,
        this._boss2
      );
      this._bossView.setParent(this.view.getContentPane());
      this._bossView.setInfo(this._boss1, this._boss2);
      this._bossView.setTotalHp(
        this.battleModel.armyInfoRight.getBossesTotalHpByInfo(this._boss1),
        this.battleModel.armyInfoRight.getBossesTotalHpByInfo(this._boss2)
      );
      this._bossView.setCurrentHp(
        this.battleModel.armyInfoRight.getBossesLeftHpByInfo(this._boss1),
        this.battleModel.armyInfoRight.getBossesLeftHpByInfo(this._boss2)
      );
    }
  }

  private addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  enterFrame() {
    var leftBlood: number = this.battleModel.getMyHeroLeftHp();
    var rightBlood: number = this.battleModel.armyInfoRight.getLeftHp();
    var maxBoold: number = this.battleModel.selfHero.totalBloodA;
    var rightBlood: number = this.battleModel.armyInfoRight.getLeftHp();
    var precent: number = leftBlood / maxBoold;
    if (this.view.bottomBar && this.view.bottomBar.selfBloodView) {
      this.view.bottomBar.selfBloodView.updateHeroHp(
        precent,
        leftBlood,
        maxBoold
      );
    }
    var bossHp1: number;
    var bossHp2: number;
    if (this.needExchange) {
      bossHp1 = this.battleModel.armyInfoRight.getBossesLeftHpByInfo(
        this._boss2
      );
      bossHp2 = this.battleModel.armyInfoRight.getBossesLeftHpByInfo(
        this._boss1
      );
    } else {
      bossHp1 = this.battleModel.armyInfoRight.getBossesLeftHpByInfo(
        this._boss1
      );
      bossHp2 = this.battleModel.armyInfoRight.getBossesLeftHpByInfo(
        this._boss2
      );
    }
    this._bossView.setCurrentHp(bossHp1, bossHp2);
    if (leftBlood <= 0 || rightBlood <= 0) {
      //自己死亡或者对方全部死亡, 让自己的技能不可用
      BattleManager.Instance.battleModel.isOver = true;
      NotificationManager.Instance.sendNotification(
        BattleNotic.FORCE_SKILL_ENABLE,
        false
      );
    }
  }

  /**
   * 查看是否是BOSS. 并设置代表性boss
   * 由所有boss中等级最大的代表
   * @param heroList
   * @return
   *
   */
  private setBossInfo(heroList: Dictionary) {
    for (const key in heroList) {
      if (Object.prototype.hasOwnProperty.call(heroList, key)) {
        const hero: HeroRoleInfo = heroList[key];
        if (hero.type == RoleType.T_NPC_BOSS) {
          if (!this._boss2) {
            this._boss2 = hero;
          } else {
            if (!this._boss1) this._boss1 = hero;
          }
        }
      }
    }
  }

  private get needExchange(): boolean {
    return this._boss1 && this._boss2 && this._boss1.pos > this._boss2.pos;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  /**
   * bossbuffer视图
   */
  public get bossBufferContainer1(): BossBufferContainer {
    if (this._bossView) return this._bossView.bossBufferContainer1;
    return null;
  }

  public get bossBufferContainer2(): BossBufferContainer {
    if (this._bossView) return this._bossView.bossBufferContainer2;
    return null;
  }

  public dispose() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
    if (this.bossBufferContainer1) this.bossBufferContainer1.dispose();
    if (this.bossBufferContainer2) this.bossBufferContainer2.dispose();
    if (this._bossView) this._bossView.dispose();
    this._bossView = null;
  }
}
