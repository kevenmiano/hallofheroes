//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-08-31 20:58:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-04-27 16:40:37
 * @Description: 失败
 */

import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { BattleType } from "../../constant/BattleDefine";
import { EmWindow } from "../../constant/UIDefine";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from "../../manager/CampaignManager";
import FightingManager from "../../manager/FightingManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { WorldBossHelper } from "../../utils/WorldBossHelper";

export default class BattleFailedSimpleWnd extends BaseWindow {
  private static inst: BattleFailedSimpleWnd = null;
  public autoCloseFun: Function;
  private _hasCallback: boolean;
  private _disposed: boolean;
  private battleType: any;
  public static get Instance(): BattleFailedSimpleWnd {
    if (!this.inst) {
      this.inst = new BattleFailedSimpleWnd();
    }
    return this.inst;
  }

  public OnInitWind() {
    this.x = Resolution.gameWidth * 0.5;
    this.y = Resolution.gameHeight * 0.5;
  }

  async Show(battleType) {
    this.battleType = battleType;
    await UIManager.Instance.ShowWind(EmWindow.BattleFailedSimple);
    this.startTimer();
  }

  private startTimer() {
    Laya.timer.once(2000, this, this.onTimerComplete);
  }

  onTimerComplete() {
    this.tryCallback();
  }

  private tryCallback() {
    this.autoCloseFun && this.autoCloseFun();
    this.autoCloseFun = null;
    if (this.battleType == BattleType.CAMPAIGN_BATTLE) {
      //仅在单人副本和地下迷宫内有效
      Laya.timer.once(1000, this, function () {
        //失败后在屏幕中间弹个提示, 内有变强建议和快捷跳转按钮, 最多3条 战败提示仅在玩家低于40级时会弹出 若无建议可提示, 则不弹战败提示
        let data = FightingManager.Instance.dataList;
        if (data.length > 0 && ArmyManager.Instance.thane.grades < 40) {
          FrameCtrlManager.Instance.open(EmWindow.ImprovePowerWnd, data);
        }
      });
    }
    // else{
    //     Laya.timer.once(1000,this,function(){
    //         if(CampaignManager.Instance.mapModel){
    //             let mapId: number = CampaignManager.Instance.mapModel.mapId;
    //             if (WorldBossHelper.checkMaze(mapId)) {
    //                 //失败后在屏幕中间弹个提示, 内有变强建议和快捷跳转按钮, 最多3条 战败提示仅在玩家低于40级时会弹出 若无建议可提示, 则不弹战败提示
    //                 let data = FightingManager.Instance.dataList;
    //                 if(data.length>0 && ArmyManager.Instance.thane.grades <40)
    //                 {
    //                     FrameCtrlManager.Instance.open(EmWindow.ImprovePowerWnd,data);
    //                 }
    //             }
    //         }
    //     });
    // }
  }

  public setData(data: any[]) {
    // this.data = data;
  }

  protected get modelAlpha() {
    return 0;
  }

  public dispose() {
    super.dispose();
    Laya.timer.clearAll(this);
    this.tryCallback();
    BattleFailedSimpleWnd.inst = null;
  }
}
