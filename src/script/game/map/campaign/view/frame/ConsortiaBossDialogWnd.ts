// @ts-nocheck
import { CampaignManager } from "../../../../manager/CampaignManager";
import { MapSocketOuterManager } from "../../../../manager/MapSocketOuterManager";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import CampaignDialogOptionItem from "./CampaignDialogOptionItem";
import PetLandDialogWnd from "./PetLandDialogWnd";

export default class ConsortiaBossDialogWnd extends PetLandDialogWnd {
    public OnInitWind() {
        super.OnInitWind();
    }

    protected __onClickHandler(targetItem: CampaignDialogOptionItem) {
        if (this._nodeInfo) {
            if (targetItem == this.leaveItem) {
                MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, false);
            } else if (targetItem instanceof CampaignDialogOptionItem) {
                MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, true);
            }
        }
        this.hide();
    }

    protected initOptions(options: Array<string>) {
        var tmapId: number = CampaignManager.Instance.mapId;
        if (WorldBossHelper.checkConsortiaBoss(tmapId)) {
            var optionItem: CampaignDialogOptionItem;
            for (var i: number = 0; i < options.length; i++) {
                optionItem = new CampaignDialogOptionItem(this._mapId, this._nodeInfo.nodeId, options[i], i);
                this._itemList.push(optionItem);
                this.addToBox(optionItem);
            }
        }
    }
}
