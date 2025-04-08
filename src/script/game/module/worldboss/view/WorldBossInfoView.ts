import { CampaignManager } from '../../../manager/CampaignManager';
import { ConsortiaManager } from '../../../manager/ConsortiaManager';
import { WorldBossHelper } from '../../../utils/WorldBossHelper';
import { BossInfoView } from '../../battle/ui/BossInfoView';

/**
* @author:pzlricky
* @data: 2021-07-20 10:41
* @description 世界Boss信息 
*/
export default class WorldBossInfoView extends BossInfoView {

    constructor() {
        super();
    }

    protected initView() {
        super.initView();
        this.hpProgress.visible = true;
        this.hpProgress.text = "";
        if (CampaignManager.Instance.mapModel && WorldBossHelper.checkConsortiaBoss(CampaignManager.Instance.mapModel.mapId)) {
            this.txtRBossGrade.text = ConsortiaManager.Instance.model.bossInfo.callGrade.toString();
        }
    }

    public setCurrentHp(value: number) {
        super.setCurrentHp(value);
        //避免偶现小数
        value = parseInt(value.toString());
        this.hpProgress.text = value + " / " + this._hpStrip.maxValue;

        if (CampaignManager.Instance.worldBossModel) {
            CampaignManager.Instance.worldBossModel.curHp = value;
        }
    }

}