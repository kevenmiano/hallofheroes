import AudioManager from '../../core/audio/AudioManager';
import { SocketManager } from '../../core/net/SocketManager';
import UIManager from '../../core/ui/UIManager';
import ObjectUtils from '../../core/utils/ObjectUtils';
import { SceneEvent } from '../constant/event/NotificationEvent';
import { C2SProtocol } from '../constant/protocol/C2SProtocol';
import { SoundIds } from '../constant/SoundIds';
import { EmWindow } from '../constant/UIDefine';
import { IBaseSceneView } from '../interfaces/IBaseSceneView';
import { NotificationManager } from '../manager/NotificationManager';
import { CastleMapViewII } from '../map/castle/view/CastleMapViewII';
import { BaseSceneView } from '../map/scene/BaseSceneView';
import SceneType from '../map/scene/SceneType';
import HomeWnd from '../module/home/HomeWnd';
import MainToolBar from '../module/home/MainToolBar';
import SmallMapBar from '../module/home/SmallMapBar';
import LoadingSceneWnd from '../module/loading/LoadingSceneWnd';
import FaceSlapManager from '../manager/FaceSlapManager';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import Resolution from '../../core/comps/Resolution';
import { PlayerManager } from '../manager/PlayerManager';
/**
* @author:pzlricky
* @data: 2020-11-10 14:59
* @description 内城
*/
export default class CastleScene extends BaseSceneView implements IBaseSceneView {
    public castleMap: CastleMapViewII;
    private _preSceneData: any;

    constructor() {
        super();
    }

    /**
     * 进入场景
     */
    public enter(preScene: BaseSceneView, data: Object = null): Promise<void> {
        return new Promise(async resolve => {
            this.castleMap = new CastleMapViewII();
            this.addChild(this.castleMap);
            this._preSceneData = data;
            this.fixScreen();
            AudioManager.Instance.playMusic(SoundIds.CASTLE, 0);
            resolve();
        });
    }

    resize() {
        super.resize()
        this.fixScreen()
    }

    private fixScreen() {
        let widthRatio: number = Resolution.gameWidth / this.castleMap.width;
        let heightratio: number = Resolution.gameHeight / this.castleMap.height;
        let scaleV = Math.max(heightratio, widthRatio);
        this.castleMap.scaleX = this.castleMap.scaleY = scaleV;
        this.castleMap.x = -(this.castleMap.getRealWidth() * CastleMapViewII.MAP_SHOW_ANCHOR_POINT.x - Resolution.gameWidth / 2);
        this.castleMap.y = -(this.castleMap.getRealHeight() * CastleMapViewII.MAP_SHOW_ANCHOR_POINT.y - Resolution.gameHeight / 2);
        this.castleMap.dragingCallBack();
    }

    public preLoadingStart(data: Object = null): Promise<void> {
        PlayerManager.Instance.currentPlayerModel.inOutCity = false;
        return super.preLoadingStart(data);
    }

    public enterOver(): Promise<void> {
        return new Promise(async resolve => {
            this.releaseScene();
            LoadingSceneWnd.Instance.Hide();
            SocketManager.Instance.send(C2SProtocol.C_BUILDING_INIT);
            if (!HomeWnd.Instance.isShowing) {
                await HomeWnd.Instance.instShow();
                HomeWnd.Instance.getSmallMapBar().switchSmallMapState(SmallMapBar.CASTLE_SMALL_MAP_STATE);
            }
            await UIManager.Instance.ShowWind(EmWindow.SpaceTaskInfoWnd);
            if (this._preSceneData) {
                if (this._preSceneData.isOutyardBattle) {
                    FrameCtrlManager.Instance.open(EmWindow.OutyardFigureWnd);
                }
                if (this._preSceneData.isOpenColosseum) {
                    FrameCtrlManager.Instance.open(EmWindow.Colosseum);
                }
            }
            FaceSlapManager.Instance.showNext();
            super.enterOver();
            resolve();
        });
    }

    public leaving(): Promise<void> {
        return new Promise(async resolve => {
            NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
            // SceneManager.Instance.lockScene = false;
            UIManager.Instance.HideWind(EmWindow.SpaceTaskInfoWnd);
            await HomeWnd.Instance.instHide();
            ObjectUtils.disposeObject(this.castleMap); this.castleMap = null;
            resolve();
        });
    }

    public get SceneName(): string {
        return SceneType.CASTLE_SCENE;
    }


    public getUIID() {
        return SceneType.CASTLE_SCENE;
    }
}