// @ts-nocheck
import { MapBaseAction } from '../../battle/actions/MapBaseAction';
import { FogGridType } from '../../constant/FogGridType';
import { CampaignManager } from '../../manager/CampaignManager';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import Tiles from '../../map/space/constant/Tiles';
import { MouseData } from '../../map/space/data/MouseData';
import LangManager from '../../../core/lang/LangManager';
import PlayerMoveMsg = com.road.yishi.proto.campaign.PlayerMoveMsg;
import { CampaignArmy } from '../../map/campaign/data/CampaignArmy';
import { EmLayer } from '../../../core/ui/ViewInterface';
import LayerMgr from '../../../core/layer/LayerMgr';
import SceneMaskView from '../../component/SceneMaskView';
/**
* @author:pzlricky
* @data: 2021-06-21 19:46
* @description *** 
*/
export default class PlayerMoveAction extends MapBaseAction {

    private _msg: PlayerMoveMsg;
    private _playerView: any;
    private _tarPos: Laya.Point;
    private _sceneMask: SceneMaskView;

    constructor($msg: PlayerMoveMsg) {
        super();
        this._msg = $msg;
    }

    prepare() {
        if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) return;
        super.prepare();
        if (CampaignManager.Instance.mapModel.selfMemberData.id == this._msg.userId) {
            MouseData.Instance.curState = MouseData.LOCK;
            if (this._msg.ismoveCamera) {
                CampaignManager.Instance.mapView.moveCenterPoint(new Laya.Point(this._msg.tarX * Tiles.WIDTH, this._msg.tarY * Tiles.HEIGHT));
                CampaignManager.Instance.mapModel.updateFog(this._msg.tarX * Tiles.WIDTH, this._msg.tarY * Tiles.HEIGHT, FogGridType.OPEN_TWO);
                MouseData.Instance.curState = MouseData.LOCK;
            }
            CampaignManager.Instance.controller.moveArmyByPos(this._msg.tarX * Tiles.WIDTH - 10, this._msg.tarY * Tiles.HEIGHT - 10);
        }
        else {
            var prepareErrorTip: string = LangManager.Instance.GetTranslation("yishi.actions.map.PlayerMoveAction.prepareErrorTip");
            throw new Error(prepareErrorTip);
        }
        var aInfo: CampaignArmy = CampaignManager.Instance.mapModel.getBaseArmyByArmyId(this._msg.userId);
        var armyView: Object = CampaignManager.Instance.controller.getArmyView(aInfo);

        if (aInfo) this._playerView = armyView;
        this._sceneMask = new SceneMaskView();
        LayerMgr.Instance.addToLayer(this._sceneMask, EmLayer.GAME_DYNAMIC_LAYER);
        this._sceneMask.x = 0;
        this._sceneMask.y = 0;
    }
    update() {
        if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE || !this._playerView || this._playerView.aiInfo.pathInfo.length == 0) {
            if (this._sceneMask) this._sceneMask.dispose();
            this._sceneMask = null;
            this.actionOver();
        }
    }

    actionOver() {
        super.actionOver();
        MouseData.Instance.curState = MouseData.NORMAL;
    }

}