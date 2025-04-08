import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { ConsortiaUpgradeType } from "../constant/ConsortiaUpgradeType";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import LangManager from "../../core/lang/LangManager";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { EmWindow } from "../constant/UIDefine";

/**
 * ConsortiaSkillHelper
 * @author yuanzhan.yu
 */
export class ConsortiaSkillHelper {
  constructor() {}

  /**
   * @deprecated
   * @param type
   * @param pInfo
   */
  public static getLevelByType(type: number, pInfo: PlayerInfo): number {
    let para: string = "";
    switch (type) {
      case ConsortiaUpgradeType.ATTACK:
        para = "consortiaPower";
        break;
      case ConsortiaUpgradeType.AGILITY:
        para = "consortiaAgility";
        break;
      case ConsortiaUpgradeType.ABILITY:
        para = "consortiaIntellect";
        break;
      case ConsortiaUpgradeType.CAPTAIN:
        para = "consortiaCaptain";
        break;
      case ConsortiaUpgradeType.GOLD:
        para = "consortiaGold";
        break;
      case ConsortiaUpgradeType.PHYSIQUE:
        para = "consortiaPhysique";
        break;
    }
    if (para != "" && pInfo.hasOwnProperty(para)) {
      return pInfo[para];
    }
    return 0;
  }

  public static addOffer() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "consortia.helper.ConsortiaAltarHelper.content02"
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.__addOfferCallBack.bind(this)
    );
  }

  public static addWealth() {
    let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let content: string = LangManager.Instance.GetTranslation(
      "consortia.helper.ConsortiaUpgradeHelper.content"
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.__addOfferCallBack.bind(this)
    );
  }

  private static __addOfferCallBack(b: boolean, flag: boolean) {
    if (b) {
      FrameCtrlManager.Instance.open(EmWindow.ConsortiaContribute);
    }
  }

  private static openContributeCall() {
    // FrameControllerManager.instance.consortiaController.closeSkillFrame();
    // FrameControllerManager.instance.consortiaController.closeBuildingFrame(false);
    // FrameControllerManager.instance.consortiaController.showContributeFrame();
  }
}
