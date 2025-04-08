import { FogGridType } from '../../constant/FogGridType';
import { CampaignManager } from '../../manager/CampaignManager';
import { CampaignArmy } from '../../map/campaign/data/CampaignArmy';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import { MapBaseAction } from './MapBaseAction';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';

export class SceneMoveAction extends MapBaseAction {
    private _isRun: boolean = false;
    private _posX: number = 0;
    private _posY: number = 0;
    private _timeId: any = 0;

    constructor($posX: number, $posY: number) {
        super();
        this._posX = $posX;
        this._posY = $posY;
    }

    update() {
        if (SceneManager.Instance.currentType != SceneType.CAMPAIGN_MAP_SCENE) {
            this.over(); return;
        }

        if (!this._isRun) {
            var selfView: any;
            var aInfo: CampaignArmy = CampaignManager.Instance.mapModel.selfMemberData;
            if (aInfo) {
                selfView = CampaignManager.Instance.controller.getArmyView(aInfo);
            }
            if (!selfView) return;
            selfView.aiInfo.pathInfo = [];
            var posX: number = (this._posX != 0 ? this._posX : selfView.x / 20);
            var posY: number = (this._posY != 0 ? this._posY : selfView.y / 20);
            CampaignManager.Instance.mapView.moveCenterPoint(new Laya.Point(posX * 20, posY * 20));
            CampaignManager.Instance.mapModel.updateFog(posX * 20, posY * 20, FogGridType.OPEN_TWO);
            this._timeId = setInterval(this.over.bind(this), 200);
            this._isRun = true;
            // var taskFrame: Frame = FrameCtrlManager.Instance.taskControler.frame;
            // if (taskFrame && taskFrame.parent) taskFrame.dispose();
        }
    }

    private over() {
        clearInterval(this._timeId); this._timeId = 0;
        this.actionOver();
    }

}