import FUI_SmalMapRightItem from "../../../../fui/Home/FUI_SmalMapRightItem";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { SpaceNode } from "../../map/space/data/SpaceNode";
import SpaceManager from "../../map/space/SpaceManager";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { CampaignManager } from "../../manager/CampaignManager";
import { ActionUtils } from "../../action/ActionUtils";
export default class SmalMapRightItem extends FUI_SmalMapRightItem {
  private _vData: SpaceNode | CampaignNode;
  onConstruct() {
    super.onConstruct();
    this.initEvent();
  }

  private initEvent() {
    this.onClick(this, this.__onClickHandler);
  }

  private removeEvent() {
    this.offClick(this, this.__onClickHandler);
  }

  private __onClickHandler() {
    var npcId: number = this._vData.nodeId;
    if (this._vData instanceof SpaceNode) {
      SpaceManager.Instance.visitSpaceNPC(npcId, true);
    } else if (this._vData instanceof CampaignNode) {
      CampaignManager.Instance.controller.moveArmyByPos(
        this._vData.curPosX * 20,
        this._vData.curPosY * 20,
        true,
      );
    }
    ActionUtils.cancelClollectActionDetection();
  }

  public set vData(value: SpaceNode | CampaignNode) {
    this._vData = value;
    if (this._vData) {
      this.initEvent();
      this.nameTxt.text = this._vData.info.names;
      if (value instanceof SpaceNode) {
        this.tyepTxt.text = (this._vData as SpaceNode).funcType;
      } else if (value instanceof CampaignNode) {
        this.tyepTxt.text = (this._vData as CampaignNode).param5;
      }
    } else {
      this.removeEvent();
      this.nameTxt.text = "";
      this.tyepTxt.text = "";
    }
  }

  public dispose() {
    this.removeEvent();
    this._vData = null;
    super.dispose();
  }
}
