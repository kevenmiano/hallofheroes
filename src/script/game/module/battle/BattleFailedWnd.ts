//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-01-21 12:31:40
 * @LastEditTime: 2022-04-27 16:40:33
 * @LastEditors: jeremy.xu
 * @Description: 失败详情
 */
import Resolution from "../../../core/comps/Resolution";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import { BattleManager } from "../../battle/BattleManager";
import { BattleModel } from "../../battle/BattleModel";
import { BattleType } from "../../constant/BattleDefine";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";

export default class BattleFailedWnd extends BaseWindow {
  private static inst: BattleFailedWnd = null;
  protected data: any[];
  public autoCloseFun: Function;
  public c1: fgui.Controller;
  public progressTxt: fgui.GRichTextField;
  public progress: fgui.GProgressBar;
  public petIcon: fgui.GLoader;
  public petIconBg: fgui.GImage;
  public PetExpPic: fgui.GImage;
  public PlayExpTxt: fgui.GTextField;
  public PetExpTxt: fgui.GTextField;

  public static get Instance(): BattleFailedWnd {
    if (!this.inst) {
      this.inst = new BattleFailedWnd();
    }
    return this.inst;
  }

  public OnShowWind() {
    this.x = Resolution.gameWidth * 0.5;
    this.y = Resolution.gameHeight * 0.5;
    this.c1 = this.getController("c1");
    if (this.data) {
      this.PlayExpTxt.text = this.data[0] ? "+" + this.data[0] : "+0";
      this.PetExpTxt.text = this.data[1] ? "+" + this.data[1] : "+0";
    }
    if (this.playerInfo.enterWarPet) {
      this.initPetIcon();
    } else {
      this.petIcon.visible = this.petIconBg.visible = false;
      this.PetExpPic.visible = this.PetExpTxt.visible = false;
    }
    if (this.battleModel.battleType == BattleType.OUTYARD_BATLE) {
      this.c1.selectedIndex = 1;
      this.progressTxt.text = this.data[3] + "%";
      this.progress.value = this.data[3];
    } else {
      this.c1.selectedIndex = 0;
    }
  }

  private initPetIcon() {
    this.petIcon.visible = this.petIconBg.visible = true;
    this.PetExpPic.visible = this.PetExpTxt.visible = true;
    this.petIcon.icon = IconFactory.getPetHeadSmallIcon(
      this.playerInfo.enterWarPet.templateId,
    );
  }

  async Show() {
    await UIManager.Instance.ShowWind(EmWindow.BattleFailed);
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
  }

  public setData(data: any[]) {
    this.data = data;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  protected get modelAlpha() {
    return 0;
  }

  private get battleModel(): BattleModel {
    return BattleManager.Instance.battleModel;
  }

  public dispose() {
    super.dispose();
    Laya.timer.clearAll(this);
    this.tryCallback();
    BattleFailedWnd.inst = null;
  }
}
