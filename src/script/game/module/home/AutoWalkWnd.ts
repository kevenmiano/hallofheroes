import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { CampaignEvent } from "../../constant/event/NotificationEvent";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import { CampaignManager } from "../../manager/CampaignManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { CampaignArmyView } from "../../map/campaign/view/physics/CampaignArmyView";
import { CampaignMapModel } from "../../mvc/model/CampaignMapModel";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import AssetAutoAnimation from "../../component/AssetAutoAnimation";

export default class AutoWalkWnd extends BaseWindow {
  public autoWalkAni: AssetAutoAnimation;
  public autoBtn: fgui.GButton;
  protected resizeContent: boolean = true;
  public OnInitWind() {
    super.OnInitWind();
    this.offEvent();
    this.addEvent();
    let autoWalkTxt = LangManager.Instance.GetTranslation(
      "AutoWalkView.autoBtn.title3",
    );
    this.autoWalkAni.initText(autoWalkTxt);
    this.autoWalkAni.visible = false;
    this.autoBtn.visible = false;
    this.updateAutoWalkBtn();
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  private addEvent() {
    this.autoBtn.onClick(this, this.autoBtnHandler);
    if (this.playerModel)
      this.playerModel.addEventListener(
        CampaignEvent.AUTO_WALK_CHANGED,
        this.updateAutoWalkBtn,
        this,
      );
  }

  private offEvent() {
    this.autoBtn.offClick(this, this.autoBtnHandler);
    if (this.playerModel)
      this.playerModel.removeEventListener(
        CampaignEvent.AUTO_WALK_CHANGED,
        this.updateAutoWalkBtn,
        this,
      );
  }

  private autoBtnHandler() {
    if (!this.playerModel) return;
    if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
      this.playerModel.setAutoWalk(PlayerModel.CANCAL_AUTO_WALK);
    } else {
      this.playerModel.setAutoWalk(PlayerModel.AUTO_WALK);
    }
  }

  private updateAutoWalkBtn() {
    if (!this.playerModel) {
      this.autoWalkAni.visible = false;
      this.autoBtn.visible = false;
      return;
    }
    this.autoBtn.visible = true;
    if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
      this.autoBtn.title = LangManager.Instance.GetTranslation(
        "AutoWalkView.autoBtn.title4",
      );
      if (this.campaignModel.campaignTemplate) {
        let campaignId: number = this.campaignModel.campaignTemplate.CampaignId;
        SwitchPageHelp.gotoCampaignById(campaignId);
      }
      this.autoWalkAni.visible = true;
      this.autoWalkAni.start();
    } else {
      this.autoBtn.title = LangManager.Instance.GetTranslation(
        "AutoWalkView.autoBtn.title2",
      );
      this.autoWalkAni.visible = false;
      this.autoWalkAni.stop();
      if (CampaignManager.Instance.controller) {
        let armyView: CampaignArmyView =
          CampaignManager.Instance.controller.getArmyView(
            this.campaignModel.selfMemberData,
          );
        if (armyView && armyView.info) {
          armyView.info.pathInfo = [];
        }
      }
    }
  }

  private get campaignModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  dispose() {
    this.offEvent();
    super.dispose();
  }
}
