// @ts-nocheck
import { MapBaseAction } from "../../battle/actions/MapBaseAction";
import { CampaignManager } from "../../manager/CampaignManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import WarMovieMsg = com.road.yishi.proto.campaign.WarMovieMsg;

/**
* @author:pzlricky
* @data: 2021-06-21 20:09
* @description *  战场获得荣誉或积分
*  在收到消息, 延迟一段时间, 以便人物在副本中显示获取
*/
export default class ScoreOrGesteAction extends MapBaseAction {

    private _addScoreTime: number = 0;
    private _addScoreValue: number = 0;
    private _addGesteValue: number = 0;
    private _msg: WarMovieMsg;
    constructor($msg: WarMovieMsg) {
        super()
        this._msg = $msg;
    }

    prepare() {

    }

    update() {
        this._count++;

        if (!CampaignManager.Instance.mapModel || SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
            if (this._count > 400) this.actionOver();
            return;
        }
        this._addScoreTime++;
        var cArmy: CampaignArmy;
        if (this._addScoreTime == 30) {
            cArmy = CampaignManager.Instance.mapModel.getBaseArmyByUserId(this._msg.userId, this._msg.serverName);
            if (cArmy) cArmy.score = (this._msg.isAdd ? this._msg.score : -this._msg.score);
            this._addScoreTime = 10000;
        }
        else if (this._addScoreTime == 10030) {
            cArmy = CampaignManager.Instance.mapModel.getBaseArmyByUserId(this._msg.userId, this._msg.serverName);
            if (cArmy) cArmy.geste = (this._msg.isAdd ? this._msg.geste : -this._msg.geste);
            this.actionOver();
        }

    }

}