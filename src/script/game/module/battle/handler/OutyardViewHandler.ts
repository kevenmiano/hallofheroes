import { EmPackName } from "../../../constant/UIDefine";
import FUIHelper from "../../../utils/FUIHelper";
import BattleWnd from "../BattleWnd";
import OutyardShowView from "../ui/OutyardShowView";

export class OutyardViewHandler {
  private wnd: BattleWnd;
  private view: OutyardShowView;
  private outyardShowPos: fgui.GGraph;
  constructor(wnd: BattleWnd) {
    this.wnd = wnd;
    this.initView();
  }

  private initView() {
    this.outyardShowPos = this.wnd["outyardShowPos"];
    this.view = FUIHelper.createFUIInstance(
      EmPackName.Battle,
      "OutyardShowView",
    );
    this.wnd.getContentPane().addChild(this.view);
    this.view.setXY(this.outyardShowPos.x, this.outyardShowPos.y);
  }

  public dispose() {
    if (this.outyardShowPos) {
      this.outyardShowPos.dispose();
      this.outyardShowPos = null;
    }
    if (this.view) {
      this.view.dispose();
      this.view = null;
    }
  }
}
