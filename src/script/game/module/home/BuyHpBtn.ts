import { UIFilter } from "../../../core/ui/UIFilter";
import Utils from "../../../core/utils/Utils";
import { EmWindow } from "../../constant/UIDefine";
import { ITipedDisplay, TipsShowType } from "../../tips/ITipedDisplay";
import FUI_BuyHpBtn from "../../../../fui/Home/FUI_BuyHpBtn";

/**
 * @author:pzlricky
 * @data: 2021-07-15 15:57
 * @description 人物头像购买血条按钮
 */
export default class BuyHpBtn extends FUI_BuyHpBtn implements ITipedDisplay {
  tipType: EmWindow = EmWindow.CommonTips;
  tipData: any = null;
  showType: TipsShowType = TipsShowType.onLongPress;
  startPoint: Laya.Point = new Laya.Point(0, 0);
  callBack: Function; //

  onConstruct() {
    super.onConstruct();
  }

  public set percent(value: number) {
    this.hpIcon.fillAmount = value;
  }

  /**是否闪烁 */
  flash(b: boolean) {
    if (b) {
      this.isNullPic.visible = true;
      this.getTransition("t1").play();
    } else {
      this.isNullPic.visible = false;
      this.getTransition("t1").stop();
    }
  }
}
