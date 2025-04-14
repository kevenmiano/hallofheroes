import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { SharedManager } from "../../manager/SharedManager";
import LangManager from "../../../core/lang/LangManager";

export class MultiFailedAlertAction extends MapBaseAction {
  constructor() {
    super();
  }

  public update() {
    if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE) {
      return;
    }
    this.showAlert(this.startAlertBack);
    this.actionOver();
  }

  private showAlert(callBack: Function = null): boolean {
    var preDate: Date = SharedManager.Instance.multiFaildedCheckDate;
    var now: Date = new Date();
    var outdate: boolean = false;
    var check: boolean = SharedManager.Instance.multiFailded;
    if (
      !check ||
      (preDate.getMonth() <= preDate.getMonth() &&
        preDate.getDate() < now.getDate())
    ) {
      outdate = true;
    }
    if (outdate) {
      // var frame:TodayNotAlertFrame = ComponentFactory.Instance.creatComponentByStylename("battle.multiFailedAlertFrame");
      // var content:string = LangManager.Instance.GetTranslation("Campaign.MultiFailedAlert");
      // var checkTxt:string = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.text");
      // frame.show(content, checkTxt, this.startAlertBack);
    }
    return outdate;
  }

  private startAlertBack(check: boolean) {
    SharedManager.Instance.multiFailded = check;
    SharedManager.Instance.multiFaildedCheckDate = new Date();
    SharedManager.Instance.saveMultiFailedCheck();
  }
}
