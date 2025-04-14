import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import { RuneEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { BagHelper } from "../../bag/utils/BagHelper";
import RuneGemDrawCom from "../runeGem/RuneGemDrawCom";
import SkillWndCtrl from "../SkillWndCtrl";
/**
 * 符文石面板
 */
export default class RuneGemWnd extends BaseWindow {
  setOptimize = false;
  rune_draw: RuneGemDrawCom;
  runehole_spot_use: string;
  spot: string = "10";
  maxPoint: number = 200;

  closeGem = true;

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.rune_draw.btn_bag.onClick(this, this.onBag);
  }

  public OnShowWind(): void {
    super.OnShowWind();
    this.runehole_spot_use =
      TempleteManager.Instance.getConfigInfoByConfigName(
        "runehole_spot_use",
      ).ConfigValue;
    this.controler.reqRuneGemLottery(1);
    let cfg =
      TempleteManager.Instance.getConfigInfoByConfigName("runehole_spot");
    if (cfg && cfg.ConfigValue) {
      let arr = cfg.ConfigValue.split(",");
      this.spot = arr[0];
      this.maxPoint = parseInt(arr[2]);
    }
    (this.rune_draw as RuneGemDrawCom).updateView(this.runehole_spot_use);
  }

  private get controler(): SkillWndCtrl {
    return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
  }

  helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("runeGem.title");
    let content = LangManager.Instance.GetTranslation(
      "runeGem.help0",
      this.runehole_spot_use,
      this.maxPoint,
    );
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  /**
   * PS: 关闭“获取符石”弹窗时, 判断返回 符石背包 or 符孔详情 or 符石升级
   */
  public OnHideWind(): void {
    this.rune_draw.btn_bag.offClick(this, this.onBag);
    if (this.params && this.params.openFromRuneBag) {
      FrameCtrlManager.Instance.open(
        EmWindow.RuneHoldEquipWnd,
        this.params.data,
      );
    } else {
      this.closeGem &&
        NotificationManager.Instance.dispatchEvent(RuneEvent.CLOSE_GEM);
    }
    super.OnHideWind();
  }

  private onBag() {
    //不关闭
    this.closeGem = false;
    FrameCtrlManager.Instance.open(EmWindow.RuneHoldEquipWnd);
    this.hide();
  }

  dispose(): void {
    BagHelper.OPEN_RUNE_BAG_TYPE = -1;
    (this.rune_draw as RuneGemDrawCom).dispose();
    super.dispose();
  }
}
