import { NativeEvent, SceneEvent } from '../constant/event/NotificationEvent';
import { EmWindow } from '../constant/UIDefine';
import { IBaseSceneView } from '../interfaces/IBaseSceneView';
import { NotificationManager } from '../manager/NotificationManager';
import { BaseSceneView } from '../map/scene/BaseSceneView';
import SceneType from '../map/scene/SceneType';
import Utils from '../../core/utils/Utils';
import GameConfig from '../../../GameConfig';
import { PathManager } from '../manager/PathManager';
import DisplayLoader from '../utils/DisplayLoader';
import { FrameCtrlManager } from '../mvc/FrameCtrlManager';
import { getZoneCount, getZoneData, isOversea } from '../module/login/manager/SiteZoneCtrl';
import BaseChannel from "../../core/sdk/base/BaseChannel";
import SDKManager from "../../core/sdk/SDKManager";
import { NativeChannel } from "../../core/sdk/native/NativeChannel";

/**
* @author:pzlricky
* @data: 2020-11-10 14:59
* @description 登录
*/
export default class LoginScene extends BaseSceneView implements IBaseSceneView {

    constructor() {
        super();
    }

    public preLoadingStart(data: Object = null): Promise<void> {
        return super.preLoadingStart(data);
    }

    public enter(preScene: BaseSceneView, data = null): Promise<void> {
        return new Promise(async resolve => {
            NotificationManager.Instance.addEventListener(NativeEvent.GAME_ENTER_OVER, this.gameEnterOverBack, this);

            //有site的则为玩平台入口,玩平台不需要登录, 直接加载
            //有webView值的则为Android入口
            let zoneData = getZoneData();
            let zoneCount = getZoneCount();
            let checkSite:boolean = false;
            if(!isOversea()) {
                checkSite = zoneCount > 1 && !zoneData;//国内判断数量
            } else {
                checkSite = !zoneData;//海外判断是否选过区
            }
            if ((data && data.user) || Utils.isApp() || Utils.isWxMiniGame()) {
                if (data) {
                    data.isDebug = false;
                    data.isMobile = Utils.isApp();
                    data.isWan = Utils.isWebWan();
                    data.isFCC = Utils.isFCC();
                    data.isH5SDK = Utils.isH5SDK();
                    data.isWxMiniGame = Utils.isWxMiniGame();
                }
                if (checkSite) {//
                    FrameCtrlManager.Instance.open(EmWindow.SiteZone, data);
                } else {
                    SDKManager.Instance.getChannel().reportData({
                        area: zoneData.area,
                        user: data.user ? data.user.user : "",
                        time: new Date().getTime()
                    })
                    if(DisplayLoader.isDebug){
                        FrameCtrlManager.Instance.open(EmWindow.DebugLogin, data);
                    }else{
                        FrameCtrlManager.Instance.open(EmWindow.Login, data);
                    }
                    
                }
            } else if (GameConfig.stat || !PathManager.info.LOGIN_CHECK_NICK) {
                DisplayLoader.isDebug = true;
                if (checkSite) {//
                    FrameCtrlManager.Instance.open(EmWindow.SiteZone, data);
                } else {
                    SDKManager.Instance.getChannel().reportData({
                        area: zoneData.area,
                        user: data.user ? data.user.user : "",
                        time: new Date().getTime()
                    })
                    FrameCtrlManager.Instance.open(EmWindow.DebugLogin, data);
                }
            }
            resolve();
        });
    }

    public enterOver(): Promise<void> {
        return new Promise(resolve => {
            super.enterOver();
            resolve();
        });
    }

    private gameEnterOverBack() {
        let channel: BaseChannel = SDKManager.Instance.getChannel();
        if (channel instanceof NativeChannel) {
            let zoneData = getZoneData();
            zoneData && channel.selectSiteOver(JSON.stringify(zoneData));
        }
    }

    public leaving(): Promise<void> {
        return new Promise(resolve => {
            FrameCtrlManager.Instance.exit(EmWindow.Login);
            FrameCtrlManager.Instance.exit(EmWindow.DebugLogin);
            NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
            NotificationManager.Instance.removeEventListener(NativeEvent.GAME_ENTER_OVER, this.gameEnterOverBack, this);
            resolve();
        });
    }

    public get SceneName(): string {
        return SceneType.LOGIN_SCENE;
    }

    public getUIID(): string {
        return SceneType.LOGIN_SCENE;
    }
}