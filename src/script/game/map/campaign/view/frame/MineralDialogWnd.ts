import PetLandDialogWnd from "./PetLandDialogWnd";
import AudioManager from '../../../../../core/audio/AudioManager';
import CampaignDialogOptionItem from "./CampaignDialogOptionItem";
import { SoundIds } from "../../../../constant/SoundIds";
import { MapSocketOuterManager } from "../../../../manager/MapSocketOuterManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import LangManager from '../../../../../core/lang/LangManager';
import MineralModel from "../../../../mvc/model/MineralModel";
import { MineralCarInfo } from "../../data/MineralCarInfo";
import TodayNotAlertWnd from '../../../../module/mount/TodayNotAlertWnd';
import { EmWindow } from "../../../../constant/UIDefine";
import UIManager from "../../../../../core/ui/UIManager";
import { OfferRewardModel } from "../../../../mvc/model/OfferRewardModel";


/**
* @author:pzlricky
* @data: 2021-11-04 19:22
* @description  紫晶矿场交矿对话框 
*/
export default class MineralDialogWnd extends PetLandDialogWnd {

    /**
     * 领车 
     */
    private static GET_CAR: number = 3000003;
    /**
     * 交矿 
     */
    private static HAND_IN: number = 3000004;

    public OnInitWind() {
        if (!this.selfCarInfo) {
            this.hide();
            return;
        }
        super.OnInitWind();
    }


    __onClickHandler(targetItem: CampaignDialogOptionItem) {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);

        if (this._nodeInfo) {
            if (targetItem == this.leaveItem) {
                MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, false);
                this.dispose();
            } else if (targetItem instanceof CampaignDialogOptionItem) {
                if (this.needAlert) {
                    var content: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.MineralDialogFrame.handInAlert");
                    UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { state: 2, content: content, backFunction: this.handInAlertBack.bind(this) });
                } else {
                    MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, true);
                    this.dispose();
                }
            }
        }
    }
    protected handInAlertBack(notAlert: boolean) {
        if (notAlert) {
            SharedManager.Instance.handInMineralDate = new Date;
            SharedManager.Instance.saveHandInMineralAlert();
        }
        MapSocketOuterManager.sendFrameCallBack(this._mapId, this._nodeInfo.nodeId, true);
        this.dispose();
    }

    protected get needAlert(): boolean {
        return this._nodeInfo.nodeId == MineralDialogWnd.HAND_IN &&
            this.selfCarInfo.minerals < 200 &&
            this.selfCarInfo.pick_count < 5 &&
            this.selfCarInfo.is_own == 1 &&
            SharedManager.Instance.checkIsExpired(SharedManager.Instance.handInMineralDate);
    }

    protected initOptions(options: Array<string>) {
        var tmapId: number = CampaignManager.Instance.mapId;
        if (WorldBossHelper.checkMineral(tmapId)) {
            var optionItem: CampaignDialogOptionItem;
            var str: string = "";
            for (var i: number = 0; i < options.length; i++) {
                var str: string = options[i] + LangManager.Instance.GetTranslation("public.parentheses1", this.count + " / " + this.mineralModel.maxCount);
                optionItem = new CampaignDialogOptionItem(this._mapId, this._nodeInfo.nodeId, str, i);
                this._itemList.push(optionItem);
                this.addToBox(optionItem);
            }
        }
    }


    private get count(): number {
        var result: number = 0;
        if (this._nodeInfo.nodeId == MineralDialogWnd.GET_CAR) {
            result = this.mineralModel.maxCount - this.selfCarInfo.get_count;
        } else if (this._nodeInfo.nodeId == MineralDialogWnd.HAND_IN) {
            result = this.mineralModel.maxCount - this.selfCarInfo.hand_count;
        }
        return result;
    }

    private get mineralModel(): MineralModel {
        return CampaignManager.Instance.mineralModel;
    }

    private get selfCarInfo(): MineralCarInfo {
        return CampaignManager.Instance.mineralModel.selfCarInfo;
    }


}