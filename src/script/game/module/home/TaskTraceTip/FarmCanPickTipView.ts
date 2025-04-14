import LangManager from "../../../../core/lang/LangManager";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FarmManager } from "../../../manager/FarmManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MopupManager } from "../../../manager/MopupManager";
import { TaskTraceTipManager } from "../../../manager/TaskTraceTipManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { BaseArmy } from "../../../map/space/data/BaseArmy";
import FUIHelper from "../../../utils/FUIHelper";
import TaskTraceTipWnd from "./TaskTraceTipWnd";

/**
 *
 * @author kbin.liu
 *
 */
export class FarmCanPickTipView extends TaskTraceTipWnd {
  constructor() {
    super();
  }

  initView() {
    super.initView();
    this.setContentText(this.data.content);
    this.setContentIcon(
      FUIHelper.getItemURL("Base", "asset.taskTraceTips.FarmIcon"),
    );
    this.setBtnTitle(
      LangManager.Instance.GetTranslation(
        "tasktracetip.view.CanPickTipView.text",
      ),
    );
  }

  protected __btnHandler(e: Event) {
    super.__btnHandler(e);
    if (MopupManager.Instance.model.isMopup) {
      var str: string = LangManager.Instance.GetTranslation(
        "mopup.MopupManager.mopupTipData01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      var str = LangManager.Instance.GetTranslation(
        "worldboss.helper.WorldBossHelper.tip06",
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    FarmManager.Instance.enterFarm();
    TaskTraceTipManager.Instance.cleanByType(this.data.type);
  }
}
