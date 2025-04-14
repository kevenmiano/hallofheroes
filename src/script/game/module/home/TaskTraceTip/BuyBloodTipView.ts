import LangManager from "../../../../core/lang/LangManager";
import GoodsSonType from "../../../constant/GoodsSonType";
import { GoodsManager } from "../../../manager/GoodsManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import UIManager from "../../../../core/ui/UIManager";

export class BuyBloodTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    let contentText: string = "";
    if (
      GoodsManager.Instance.getGoodsNumBySonType(GoodsSonType.SONTYPE_BLOOD) ==
      0
    ) {
      contentText = LangManager.Instance.GetTranslation(
        "tasktracetip.view.BuyBloodTipView.content01",
      );
      this.setBtnTitle(
        LangManager.Instance.GetTranslation(
          "tasktracetip.view.BuyBloodTipView.text01",
        ),
      );
    } else {
      contentText = LangManager.Instance.GetTranslation(
        "tasktracetip.view.BuyBloodTipView.content02",
      );
      this.setBtnTitle(
        LangManager.Instance.GetTranslation(
          "tasktracetip.view.BuyBloodTipView.text02",
        ),
      );
    }
    this.setContentText(contentText);
  }

  protected __btnHandler(evt) {
    super.__btnHandler(evt);
    if (
      GoodsManager.Instance.getGoodsNumBySonType(GoodsSonType.SONTYPE_BLOOD) ==
      0
    ) {
      UIManager.Instance.ShowWind(EmWindow.BuyHpWnd);
      TaskTraceTipManager.Instance.cleanByType(this.data.type);
    } else {
      var info: GoodsInfo = GoodsManager.Instance.getGeneralBagGoodsBySonType(
        GoodsSonType.SONTYPE_BLOOD,
      )[0];
      if (info) {
        FrameCtrlManager.Instance.open(EmWindow.RoleWnd);
        FrameCtrlManager.Instance.open(EmWindow.BagWnd);
        TaskTraceTipManager.Instance.cleanByType(this.data.type);
      } else {
        UIManager.Instance.ShowWind(EmWindow.BuyHpWnd);
        TaskTraceTipManager.Instance.cleanByType(this.data.type);
      }
    }
  }

  protected check(): boolean {
    return false;
  }
}
