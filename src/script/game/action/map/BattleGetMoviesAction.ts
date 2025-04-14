/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-02 12:23:50
 * @LastEditTime: 2021-04-06 14:37:50
 * @LastEditors: jeremy.xu
 * @Description: 战斗获得*动画
 */

import Logger from "../../../core/logger/Logger";
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { BaseArmy } from "../../map/space/data/BaseArmy";

//@ts-expect-error: External dependencies
import FightOverMoiveMsg = com.road.yishi.proto.simple.FightOverMoiveMsg;

export class BattleGetMoviesAction extends MapBaseAction {
  private _msg: FightOverMoiveMsg;
  private _total: number = 0;
  private _baseArmy: BaseArmy;

  constructor($baseArmy: BaseArmy, $msg: FightOverMoiveMsg) {
    super();
    this._msg = $msg;

    // this._msg.gold = 200
    // this._msg.gp = 300
    // this._msg.strategy = 400

    this._baseArmy = $baseArmy;
    if (this._msg.gold > 0) this._total++;
    if (this._msg.gp > 0) this._total++;
    if (this._msg.strategy > 0) this._total++;
    Logger.xjy("战斗获得信息:" + this._total, this._msg);
  }
  public prepare() {}

  public update() {
    this._count++;
    var currentScene: string = SceneManager.Instance.currentType;
    if (
      currentScene != SceneType.CAMPAIGN_MAP_SCENE &&
      currentScene != SceneType.OUTER_CITY_SCENE
    ) {
      if (this._count > 400) {
        this.actionOver();
      }
      return;
    }
    if (this._count < 400) this._count = 400;
    if (this._count >= 410 && (this._count - 410) % 10 == 0) this.run();
    if (this._count > 500) this.actionOver();
  }
  private run() {
    Logger.xjy("战斗获得信息 run", this._count);
    if (this._msg.gold > 0) {
      this._baseArmy.battleGold = this._msg.gold;
      this._msg.gold = 0;
    } else if (this._msg.gp > 0) {
      Logger.xjy("战斗获得信息 gp", this._msg.gp);
      this._baseArmy.battleGp = this._msg.gp;
      this._msg.gp = 0;
    } else if (this._msg.strategy > 0) {
      this._baseArmy.battleStrategy = this._msg.strategy;
      this._msg.strategy = 0;
    }
    this._total--;
    Logger.xjy("战斗获得信息_total:" + this._total);
    if (this._total <= 0) this.actionOver();
  }

  protected actionOver() {
    super.actionOver();
    this._baseArmy = null;
    this._msg = null;
  }
}
