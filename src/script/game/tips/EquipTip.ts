import { TipsEvent } from "../constant/event/NotificationEvent";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { NotificationManager } from "../manager/NotificationManager";
import BaseTips from "./BaseTips";
import { EquipTipView } from "./EquipTipView";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/17 15:11
 * @ver 1.0
 *
 */
export class EquipTip extends BaseTips {
  public equipTipView: EquipTipView;

  private _info: GoodsInfo;
  private _canOperate: boolean;
  public static EQUIPED: number = 1;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.addEvent();

    this.equipTipView.canOperate = this._canOperate;
    this.equipTipView.info = this._info;
    this.ensureBoundsCorrect();
  }

  public ensureBoundsCorrect() {
    this.equipTipView.totalBox.ensureBoundsCorrect();
    this.equipTipView.width = this.equipTipView.totalBox.width;
    this.equipTipView.height = this.equipTipView.totalBox.height;
    // this.contentPane.updateBounds();
    // FIXME contentPane 与 equipTipView 宽高不一样
    this.contentPane.width = this.equipTipView.width;
    this.contentPane.height = this.equipTipView.height;
  }

  private initData() {
    this._info = this.params[0];
    this._canOperate = this.params[1];
  }

  private initView() {}

  private addEvent() {
    NotificationManager.Instance.addEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this
    );
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private removeEvent() {
    NotificationManager.Instance.removeEventListener(
      TipsEvent.EQUIP_TIPS_HIDE,
      this.OnBtnClose,
      this
    );
  }

  public OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  protected OnClickModal() {
    super.OnClickModal();
  }

  dispose(dispose?: boolean) {
    this._info = null;
    super.dispose(dispose);
  }
}
