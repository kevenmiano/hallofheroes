import FUI_ConsortiaBuildPage from "../../../../../../fui/Consortia/FUI_ConsortiaBuildPage";
import { ConsortiaInfo } from "../../data/ConsortiaInfo";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import UIManager from "../../../../../core/ui/UIManager";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { ConsortiaEvent } from "../../../../constant/event/NotificationEvent";
import { ShopGoodsInfo } from "../../../shop/model/ShopGoodsInfo";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/20 17:18
 * @ver 1.0
 *
 */
export class ConsortiaBuildPage extends FUI_ConsortiaBuildPage {
  private _model: ConsortiaModel;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.initData();
    this.initView();
    this.addEvent();
  }

  private initData() {
    this._model = (
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.Consortia,
      ) as ConsortiaControler
    ).model;
  }

  private initView() {
    if (this.consortiaInfo.altarLevel > 0) {
      this.altarNum.visible = true;
      this.altarBtn.visible = true;
      this.altarNum
        .setVar("level", this.consortiaInfo.altarLevel.toString())
        .flushVars();
    } else {
      this.altarNum.visible = false;
      this.altarBtn.visible = false;
    }

    if (this.consortiaInfo.shopLevel > 0) {
      this.shopNum.visible = true;
      this.shopBtn.visible = true;
      this.shopNum
        .setVar("level", this.consortiaInfo.shopLevel.toString())
        .flushVars();
    } else {
      this.shopNum.visible = false;
      this.shopBtn.visible = false;
    }

    if (this.consortiaInfo.storeLevel > 0) {
      this.storeNum.visible = true;
      this.storeBtn.visible = true;
      this.storeNum
        .setVar("level", this.consortiaInfo.storeLevel.toString())
        .flushVars();
    } else {
      this.storeNum.visible = false;
      this.storeBtn.visible = false;
    }

    if (this.consortiaInfo.schoolLevel > 0) {
      this.skillNum.visible = true;
      this.skillBtn.visible = true;
      this.skillNum
        .setVar("level", this.consortiaInfo.schoolLevel.toString())
        .flushVars();
    } else {
      this.skillNum.visible = false;
      this.skillBtn.visible = false;
    }
  }

  private addEvent() {
    this.storeBtn.onClick(this, this.onStoreBtnClick);
    this.altarBtn.onClick(this, this.onAltarBtnClick);
    this.skillBtn.onClick(this, this.onSkillBtnClick);
    this.shopBtn.onClick(this, this.onShopBtnClick);

    this._model.addEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.initView,
      this,
    );
  }

  private get consortiaInfo(): ConsortiaInfo {
    return (
      FrameCtrlManager.Instance.getCtrl(
        EmWindow.Consortia,
      ) as ConsortiaControler
    ).model.consortiaInfo;
  }

  private onStoreBtnClick() {
    FrameCtrlManager.Instance.open(
      EmWindow.ConsortiaStorageWnd,
      { returnToWin: EmWindow.Consortia, returnToWinFrameData: 2 },
      null,
      EmWindow.Consortia,
    );
  }

  private onAltarBtnClick() {
    FrameCtrlManager.Instance.open(
      EmWindow.ConsortiaAltarWnd,
      { returnToWin: EmWindow.Consortia, returnToWinFrameData: 2 },
      null,
      EmWindow.Consortia,
    );
  }

  private onSkillBtnClick() {
    FrameCtrlManager.Instance.open(
      EmWindow.ConsortiaSkillTower,
      { returnToWin: EmWindow.Consortia, returnToWinFrameData: 2 },
      null,
      EmWindow.Consortia,
    );
  }

  private onShopBtnClick() {
    // FrameCtrlManager.Instance.open(EmWindow.ShopCommWnd, { returnToWin: EmWindow.Consortia, shopType: ShopGoodsInfo.CONSORTIA_SHOP, returnToWinFrameData: 2 }, null, EmWindow.Consortia);
    FrameCtrlManager.Instance.open(
      EmWindow.ShopWnd,
      { page: 1, returnToWin: EmWindow.Consortia, returnToWinFrameData: 2 },
      null,
      EmWindow.Consortia,
    );
  }

  private removeEvent() {
    this.storeBtn.offClick(this, this.onStoreBtnClick);
    this.altarBtn.offClick(this, this.onAltarBtnClick);
    this.skillBtn.offClick(this, this.onSkillBtnClick);
    this.shopBtn.offClick(this, this.onShopBtnClick);

    this._model.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.initView,
      this,
    );
  }

  dispose() {
    this.removeEvent();

    super.dispose();
  }
}
