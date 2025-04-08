import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import LangManager from '../../../core/lang/LangManager';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { CampaignManager } from '../../manager/CampaignManager';
import { TowerInfo } from '../../datas/playerinfo/TowerInfo';
import { PlayerManager } from '../../manager/PlayerManager';
import { ArmyManager } from '../../manager/ArmyManager';
import { CampaignSocketOutManager } from '../../manager/CampaignSocketOutManager';
import { SocketSendManager } from '../../manager/SocketSendManager';
import { CampaignMapEvent } from '../../constant/event/NotificationEvent';
import { NotificationManager } from '../../manager/NotificationManager';
import Resolution from '../../../core/comps/Resolution';
import { TempleteManager } from '../../manager/TempleteManager';
/**
 * 迷宫玩家复活
 */
export default class MazeRiverWnd extends BaseWindow {
    private static _riverCount: number = 0;
    private _cost: number = 0;
    private descTxt: fgui.GLabel;
    private cancelBtn: UIButton;
    private riverBtn: UIButton;
    public OnInitWind() {
        this.descTxt.text = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.txt");
        this.x = (Resolution.gameWidth - this.contentPane.sourceWidth) / 2;
        this.y = Resolution.gameHeight - 150;
        MazeRiverWnd.addRiverCount();
        if (this.params) {
            this._cost = this.params.cost;
        }
    }

    cancelBtnClick() {
        let content: string;
        if (this.towerInfo.enterCount == 0) {
            content = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content05");
        } else {
            content = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content02");
        }
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this._cannelCall.bind(this));
    }

    private _cannelCall(b: boolean, flag: boolean) {
        if (b) {
            CampaignSocketOutManager.Instance.sendReturnCampaignRoom(ArmyManager.Instance.army.id);
        }
    }

    riverBtnClick() {
        if (this._cost == 0) {
            SocketSendManager.Instance.sendTowerRiver(true);
        }
        else if (MazeRiverWnd._riverCount > 2) {
            this.__riverCall();
        }
        else {
            let cfgValue = 5;
            let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Tower_Live");
            if (cfgItem) {
                cfgValue = Number(cfgItem.ConfigValue);
            }
            var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
            var content: string = LangManager.Instance.GetTranslation("map.campaign.view.ui.MazeRiverView.content01", cfgValue);
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { point: this._cost, checkDefault: true }, prompt, content, confirm, cancel, this.__riverCall.bind(this));
        }
    }

    private __riverCall(b: boolean = true, flag: boolean = true) {
        if (!b) return;
        SocketSendManager.Instance.sendTowerRiver(flag);
    }

    private get towerInfo(): TowerInfo {
        return PlayerManager.Instance.currentPlayerModel.towerInfo;
    }

    public static addRiverCount() {
        MazeRiverWnd._riverCount++;
    }

    public dispose() {
        super.dispose();
    }
}