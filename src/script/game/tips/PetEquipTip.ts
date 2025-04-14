import { TipsEvent } from "../constant/event/NotificationEvent";
import { NotificationManager } from "../manager/NotificationManager";
import BaseTips from "./BaseTips";
import { PetEquipTipView } from "./PetEquipTipView";

/**
 * 英灵装备TIPS
 */
export class PetEquipTip extends BaseTips {
  public equipTipView: PetEquipTipView;

  public OnInitWind() {
    super.OnInitWind();
    this.addEvent();
    if (this.params[0].length == 2) {
      this.equipTipView.canOperate = this.params[0][1];
      this.equipTipView.info = this.params[0][0];
    } else {
      this.equipTipView.canOperate = true;
      this.equipTipView.info = this.params[0];
    }
    this.equipTipView.ensureBoundsCorrect();
    // this.ensureBoundsCorrect();
  }

  public ensureBoundsCorrect() {
    this.getContentPane().ensureSizeCorrect();
    // this.equipTipView.width = this.equipTipView.totalBox.width
    // this.equipTipView.height = this.equipTipView.totalBox.height
    // // this.equipTipView.getChild().totalBox.ensureBoundsCorrect();
    // // FIXME contentPane 与 equipTipView 宽高不一样
    // this.contentPane.width = this.totalBox.width
    // this.contentPane.height = this.totalBox.height
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this,
    );
  }

  protected OnClickModal() {
    super.OnClickModal();
    this.hide();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
