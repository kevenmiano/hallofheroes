import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

export class TreasureMapTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    let text = LangManager.Instance.GetTranslation(
      "tasktracetip.view.TreasureMapTipView.btnTxt",
    );
    this.setContentText(text);
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.TreasureMapTipView.btnTxt",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    TaskTraceTipManager.Instance.cleanByType(this.data.type);
    FrameCtrlManager.Instance.open(EmWindow.RoleWnd);
    FrameCtrlManager.Instance.open(EmWindow.BagWnd);
    // if (!_data || !_data.goods) {
    // 	dispose();
    // 	return;
    // }
    // FrameControllerManager.Instance.armyController.model.currentPage = number(_data.goods.pos / 56) + 1;
    // goods = GoodsManager.Instance.getGoodsByGoodsIdFromGeneralBag(_data.goods.id);
    // if (goods == null) {
    // 	var str: string = LangManager.Instance.GetTranslation("tasktracetip.view.BetterGoodsTipsView.command01");
    // 	MessageTipManager.Instance.show(str);
    // 	TaskTraceTipManager.Instance.cleanByType(data.type);
    // 	return;
    // }
    // else {
    // 	var armyFrame: Frame = FrameControllerManager.Instance.armyController.frame;
    // 	if (!armyFrame) {
    // 		FrameControllerManager.Instance.armyController.startFrameByType(ArmyPanelEnum.EQUIP_PANEL, callBack);
    // 		if (data) {
    //
    // 		}
    // 	}
    // 	else {
    // 		armyFrame["equipBag"]["showEffectByPos"](goods.pos);
    // 	}
    // }
  }

  private callBack() {
    // var armyFrame: Frame = FrameControllerManager.Instance.armyController.frame;
    // if (armyFrame) {
    // 	armyFrame = FrameControllerManager.Instance.armyController.frame;
    // 	armyFrame["show"]();
    // }
    // if (goods) {
    // 	armyFrame["equipBag"]["showEffectByPos"](goods.pos);
    // }
  }

  public dispose() {
    // if (_icon) _icon.dispose(); _icon = null;
    // if (_contentTxt) _contentTxt.dispose(); _contentTxt = null;
    // super.dispose();
    // if (parent) parent.removeChild(this);
  }
}
