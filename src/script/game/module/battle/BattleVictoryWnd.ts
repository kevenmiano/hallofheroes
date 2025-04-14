//@ts-expect-error: External dependencies
import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { IconFactory } from "../../../core/utils/IconFactory";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { BattleManager } from "../../battle/BattleManager";
import { BattleModel } from "../../battle/BattleModel";
import { BattleType } from "../../constant/BattleDefine";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerManager } from "../../manager/PlayerManager";
//胜利详情
export default class BattleVictoryWnd extends BaseWindow {
  private static inst: BattleVictoryWnd = null;
  protected data: any[];
  public autoCloseFun: Function;
  public battleTypeCtr: fgui.Controller;
  public outyardTxt: fgui.GRichTextField;
  public petIcon: fgui.GLoader;
  public petIconBg: fgui.GImage;
  public PetExpPic: fgui.GImage;
  public PlayExpTxt: fgui.GTextField;
  public PetExpTxt: fgui.GTextField;

  public static get Instance(): BattleVictoryWnd {
    if (!this.inst) {
      this.inst = new BattleVictoryWnd();
    }
    return this.inst;
  }

  public OnShowWind() {
    this.x = Resolution.gameWidth * 0.5;
    this.y = Resolution.gameHeight * 0.5;
    this.battleTypeCtr = this.getController("battleTypeCtr");
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
      this.battleTypeCtr.selectedIndex = 1;
      this.outyardTxt.text = LangManager.Instance.GetTranslation(
        "BattleVictoryWnd.outyardTxt",
        this.data[2],
      );
    } else {
      this.battleTypeCtr.selectedIndex = 0;
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
    await UIManager.Instance.ShowWind(EmWindow.BattleVictory);
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
    BattleVictoryWnd.inst = null;
  }
}
