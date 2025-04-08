import LangManager from '../../../core/lang/LangManager';
import Logger from "../../../core/logger/Logger";
import BaseFguiCom from '../../../core/ui/Base/BaseFguiCom';
import UIButton from '../../../core/ui/UIButton';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { BagEvent, CampaignEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { SoundIds } from '../../constant/SoundIds';
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from '../../manager/CampaignManager';
import { CampaignSocketOutManager } from "../../manager/CampaignSocketOutManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from "../../manager/PlayerManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { WorldBossHelper } from '../../utils/WorldBossHelper';
import NewbieUtils from '../guide/utils/NewbieUtils';
import WarlordsManager from '../../manager/WarlordsManager';
import { RoomManager } from '../../manager/RoomManager';
import { SwitchPageHelp } from '../../utils/SwitchPageHelp';
import { PlayerModel } from '../../datas/playerinfo/PlayerModel';
import { RoomState } from '../../constant/RoomState';
import { MessageTipManager } from '../../manager/MessageTipManager';
import SDKManager from '../../../core/sdk/SDKManager';
import { RPT_EVENT } from '../../../core/thirdlib/RptEvent';
import { MainToolBarData } from './mainToolBar/MainToolBarData';
import { MainToolBarButtonData } from './mainToolBar/MainToolBarButtonData';
import FUIHelper from '../../utils/FUIHelper';
import { MainToolBarBtnActionHandler } from './mainToolBar/MainToolBarBtnActionHandler';
import { MainToolBarRedDotHandler } from './mainToolBar/MainToolBarRedDotHandler';
import { ArrayConstant, ArrayUtils } from '../../../core/utils/ArrayUtils';
import { EmMainToolBarBtnLocationType } from './mainToolBar/EmMainToolBarBtnLocationType';
import { EmMainToolBarBtnType } from './mainToolBar/EmMainToolBarBtnType';
import { HintCampaignGetType } from '../../constant/HintDefine';
import { MapBattleMovieMediater } from '../../mvc/mediator/MapBattleMovieMediater';

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2021-01-04 15:34
 */
export default class MainToolBar extends BaseFguiCom {
    public static PVP_ROOM_START: number = 1;
    public static PVP_ROOM_READY: number = 2;
    public static PVE_ROOM_START: number = 3;
    public static PVE_ROOM_READY: number = 4;

    public model = new MainToolBarData();
    /** 收缩动画处理 */
    public btnActionHandler = new MainToolBarBtnActionHandler();
    /** 红点处理 */
    public redDotHandler = new MainToolBarRedDotHandler();
    public bFold: boolean = false;
    public btnExtend: UIButton;
    private container: fgui.GComponent;
    private _allUIBtns: Map<EmMainToolBarBtnType, UIButton> = new Map();

    /** 动画：获得物品飘到背包 */
    public static FLASH_NEW_GOODS: boolean = true;
    /** 主工具条是否实例化完毕, 新手用到 */
    public static ISINIT = false
    constructor(container?: fgui.GComponent) {
        super(container);

        this.container = container;
        this.model.initConfig();
        this.addEvent();
        this.model.initReq();
        this.btnActionHandler.target = this
        this.redDotHandler.target = this
        MainToolBar.ISINIT = true
    }

    public OnShowWind() {
        if (this.bFold) {
            this.playAction(0)
        }
        this.refreshBtnView();
    }

    addEvent() {
        this.redDotHandler.addEvent()
        this.btnExtend.onClick(this, this.btnExtendClick);
        GoodsManager.Instance.addEventListener(BagEvent.NEW_GOODS, this.__newGoodsHandler, this);
        Laya.timer.loop(1000, this, this.onTimer);
    }

    removeEvent() {
        this.redDotHandler.removeEvent()
        Laya.timer.clear(this, this.onTimer);
        GoodsManager.Instance.removeEventListener(BagEvent.NEW_GOODS, this.__newGoodsHandler, this);
        this.btnExtend.offClick(this, this.btnExtendClick)
    }

    private __newGoodsHandler(data: Array<GoodsInfo>) {
        this.model.newGoodsHandler(data)
    }

    private onTimer() {
        this.redDotHandler.updateBagRedPoint();
    }

    private btnExtendClick() {
        this.playAction();
    }

    private onBtnListClick(target: fgui.GButton, e: Laya.Event, params: any[]) {
        // let clickItem: fgui.GButton = e.currentTarget["$owner"];
        let clickItem: fgui.GButton = target
        Logger.log("点击了" + clickItem["_title"] + "按钮");
        let buttonType = params[0]
        switch (buttonType) {
            case EmMainToolBarBtnType.BAG:
                FrameCtrlManager.Instance.open(EmWindow.SRoleWnd);
                break;
            case EmMainToolBarBtnType.PET:
                FrameCtrlManager.Instance.open(EmWindow.Pet);
                break;
            case EmMainToolBarBtnType.STORE:
                FrameCtrlManager.Instance.open(EmWindow.Forge);
                break;
            case EmMainToolBarBtnType.STAR:
                if (PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess == GlobalConfig.NEWBIE_43000) {
                    SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_ASTROLOGY);
                }
                FrameCtrlManager.Instance.open(EmWindow.Star);
                break;
            case EmMainToolBarBtnType.SKILL:
                FrameCtrlManager.Instance.open(EmWindow.Skill);
                break;
            case EmMainToolBarBtnType.ARMY:
                FrameCtrlManager.Instance.open(EmWindow.AllocateWnd);
                break;
            case EmMainToolBarBtnType.FRIEND:
                FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
                break;
            case EmMainToolBarBtnType.CONSORTIA:
                if (PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaID == 0) {
                    FrameCtrlManager.Instance.open(EmWindow.ConsortiaApply);
                } else {
                    FrameCtrlManager.Instance.open(EmWindow.Consortia);
                }
                break;
            case EmMainToolBarBtnType.MOUNT:
                FrameCtrlManager.Instance.open(EmWindow.MountsWnd);
                break;
            case EmMainToolBarBtnType.FARM:
                FrameCtrlManager.Instance.open(EmWindow.Farm);
                break;
            case EmMainToolBarBtnType.RANK:
                FrameCtrlManager.Instance.open(EmWindow.Sort);
                break;
            case EmMainToolBarBtnType.MAIL:
                target.getController('c1').selectedIndex = 0;
                FrameCtrlManager.Instance.open(EmWindow.MailWnd);
                break;
            case EmMainToolBarBtnType.SETTING:
                FrameCtrlManager.Instance.open(EmWindow.PersonalCenter);
                break;
            case EmMainToolBarBtnType.PVE:
                // SingWarSocketSendManager.sendStartCampaignScene(1104, 1);
                if(ArmyManager.Instance.army.onVehicle){
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                    return;
                }
                FrameCtrlManager.Instance.open(EmWindow.PveGate);
                break;
            case EmMainToolBarBtnType.SHOP:
                FrameCtrlManager.Instance.open(EmWindow.ShopWnd, { page: 0 });
                break;
            case EmMainToolBarBtnType.RETURN:
                switch (SceneManager.Instance.currentType) {
                    case SceneType.PVP_ROOM_SCENE:
                        let roomInfo = RoomManager.Instance.roomInfo
                        if (roomInfo && roomInfo.roomState == RoomState.STATE_COMPETEING) {
                            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("ui.maintoolbar.exitPvpRoomCompeteing"))
                            return;
                        }
                        break;
                    case SceneType.WARLORDS_ROOM:
                        let str: string = LangManager.Instance.GetTranslation("ui.maintoolbar.MainToolBar.exitWarlordsRoom");
                        let prompt: string = LangManager.Instance.GetTranslation("mainBar.MainToolBar.prompt");
                        SimpleAlertHelper.Instance.Show(null, null, prompt, str, null, null, (b: boolean) => {
                            if (b) {
                                WarlordsManager.Instance.exitWarlordsRoom();
                            }
                        });
                        return;
                }
                if (CampaignManager.CampaignOverState) {
                    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
                        SwitchPageHelp.returnToSpace();
                    }
                    Logger.info("[MainToolBar]副本已经结束")
                    return;
                }

                NotificationManager.Instance.dispatchEvent(NotificationEvent.QUIT_CAMPAIGN);
                let mapModel = CampaignManager.Instance.mapModel
                if (mapModel && SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE && !WorldBossHelper.checkMineral(mapModel.mapId)) {
                    let content = this.model.getExitCampaignMessage();
                    if (content) {
                        let prompt: string = LangManager.Instance.GetTranslation("mainBar.MainToolBar.prompt");
                        SimpleAlertHelper.Instance.Show(null, null, prompt, content, null, null, (b: boolean) => {
                            if (CampaignManager.CampaignOverState) {
                                Logger.info("[MainToolBar]副本已经结束2")
                                return;
                            }
                            if (b) {
                                if (SceneManager.Instance.currentType == SceneType.BATTLE_SCENE
                                    && WorldBossHelper.checkPvp(mapModel.mapId)) {//战场在战斗场景不强制退出
                                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mainToolBar.return.Tips"));
                                    return;
                                }
                                CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.currentArmyId);
                                if (this.playerModel.getAutoWalkFlag() == PlayerModel.AUTO_WALK) {
                                    PlayerManager.Instance.currentPlayerModel.setAutoWalk(PlayerModel.CANCAL_AUTO_WALK);
                                }
                                if (this.playerModel.getWolrdBossAutoFightFlag() == PlayerModel.WORLDBOSS_AUTO_FIGHT) {
                                    PlayerManager.Instance.currentPlayerModel.setAutoWalk(PlayerModel.WORLDBOSS_CANCAL_AUTO_FIGHT);
                                }
                            } else {
                                PlayerManager.Instance.currentPlayerModel.dispatchEvent(CampaignEvent.AUTO_WALK_CHANGED);
                            }
                        });
                    }
                    else {
                        CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.currentArmyId);
                    }
                } else {
                    CampaignSocketOutManager.Instance.sendReturnCampaignRoom(this.currentArmyId);
                }
                break;
        }
    }

    switchToolsBarState(state: number) { }

    updateBagRedPoint() {
        this.redDotHandler.updateBagRedPoint()
    }

    updateFarmRedPoint(b: boolean) {
        this.redDotHandler.updateFarmRedPoint(b)
    }

    playAction(anitime: number = 0.34) {
        this.btnActionHandler.play(anitime)
    }


    /** 刷新按钮 创建/删除按钮 */
    refreshBtnView() {
        let btnDataList = this.model.getBtnDataListByLocaltionType()
        for (let index = 0; index < btnDataList.length; index++) {
            const btnData = btnDataList[index];
            if (btnData.getVisible()) {
                this.createButtonByType(btnData.buttonType)
            } else {
                this.removeButtonByType(btnData.buttonType)
            }
        }

        this.redDotHandler.updateRedPoint()
    }

    refreshBtnPos() {
        let pos;
        let basePos = new Laya.Point(this.btnExtend.x, this.btnExtend.y)
        let showRow1Btns = this.getBtnListByLocaltionType(EmMainToolBarBtnLocationType.Row1)
        let showRow2Btns = this.getBtnListByLocaltionType(EmMainToolBarBtnLocationType.Row2)
        let showCowBtns = this.getBtnListByLocaltionType(EmMainToolBarBtnLocationType.Cow)
        for (let index = 0; index < showRow1Btns.length; index++) {
            let btn = showRow1Btns[index] as UIButton;
            let btnData = btn.view.data as MainToolBarButtonData;
            // pos = basePos;
            pos = this.model.getBtnPos(basePos, btnData.locationType, index)
            btn.x = pos.x
            btn.y = pos.y
        }
        for (let index = 0; index < showRow2Btns.length; index++) {
            let btn = showRow2Btns[index] as UIButton;
            let btnData = btn.view.data as MainToolBarButtonData;
            // pos = basePos;
            pos = this.model.getBtnPos(basePos, btnData.locationType, index)
            btn.x = pos.x
            btn.y = pos.y
        }
        for (let index = 0; index < showCowBtns.length; index++) {
            let btn = showCowBtns[index] as UIButton;
            let btnData = btn.view.data as MainToolBarButtonData;
            // pos = basePos;
            pos = this.model.getBtnPos(basePos, btnData.locationType, index)
            btn.x = pos.x
            btn.y = pos.y
        }

        // this._allUIBtns.forEach((btn: UIButton) => {
        //     if (btn.view && btn.view.data) {
        //         let btnData = btn.view.data as MainToolBarButtonData
        //         switch (btnData.locationType) {
        //             case EmMainToolBarBtnLocationType.Row1:
        //                 pos = this.model.getBtnPos(basePos, btnData.locationType, countRow1)
        //                 countRow1++
        //                 break;
        //             case EmMainToolBarBtnLocationType.Row2:
        //                 pos = this.model.getBtnPos(basePos, btnData.locationType, countRow2)
        //                 countRow2++
        //                 break;
        //             case EmMainToolBarBtnLocationType.Cow:
        //                 pos = this.model.getBtnPos(basePos, btnData.locationType, countCow)
        //                 countCow++
        //                 break;
        //         }
        //         btn.x = pos.x
        //         btn.y = pos.y
        //     }
        // });
    }

    getBtnByType(buttonType: EmMainToolBarBtnType): fgui.GButton {
        let uiButton = this.getUIBtnByType(buttonType)
        return uiButton && uiButton.view as fgui.GButton
    }

    getUIBtnByType(buttonType: EmMainToolBarBtnType): UIButton {
        let uiButton = this._allUIBtns.get(buttonType)
        return uiButton
    }

    createButtonByType(buttonType: EmMainToolBarBtnType): UIButton {
        let uiButton = this._allUIBtns.get(buttonType)
        if (uiButton) {
            return uiButton
        }

        let btnData = this.model.getBtnDataByButtonType(buttonType) as MainToolBarButtonData
        let btnView = FUIHelper.createFUIInstance(EmPackName.Home, btnData.prefabName) as fgui.GButton
        this.container.addChild(btnView)
        this.container.swapChildren(this.btnExtend.view, btnView)
        btnView.icon = btnData.url
        btnView.title = btnData.name
        btnView.data = btnData
        if (btnData.locationType == EmMainToolBarBtnLocationType.Row2) {
            btnView.setScale(1.2, 1.2)
        }


        uiButton = new UIButton(btnView)
        this._allUIBtns.set(buttonType, uiButton)
        uiButton.onClick(this, this.onBtnListClick, [buttonType]);
        if (buttonType == EmMainToolBarBtnType.STORE) {
            uiButton.soundRes = SoundIds.STORE_CLICK_SOUND;
        }
        return uiButton
    }

    removeButtonByType(buttonType: EmMainToolBarBtnType) {
        let uiButton = this._allUIBtns.get(buttonType)
        if (uiButton) {
            uiButton.view.data = null
            uiButton.view.removeFromParent()

            uiButton.offClick(this, this.onBtnListClick)
            this._allUIBtns.delete(buttonType)
        }
    }

    /**
     *按钮位移
    * @param addTarget  添加新按钮
    * @param tweenShow 是否执行tween动画
    * @param callFun  执行完后回调
    * @param params  回调参数
    */
    public doMoveBtn(addTarget: UIButton = null, tweenShow: boolean = false, callFun: Function = null, params: any[] = null) {
        if (!tweenShow) {
            this.refreshBtnPos()
            NewbieUtils.execFunc(callFun, params)
            return
        }

        let basePos = new Laya.Point(this.btnExtend.x, this.btnExtend.y)
        let addBtnData = addTarget.view.data as MainToolBarButtonData
        let uiBtnList = this.getBtnListByLocaltionType(addBtnData.locationType)
        let targetIdx = uiBtnList.indexOf(addTarget)
        if (targetIdx < 0) { return };

        let tweenList = [];
        for (let i: number = 0; i < uiBtnList.length; i++) {
            let btn = uiBtnList[i];
            if (i > targetIdx) {
                tweenList.push(btn);
            } else if (i < targetIdx) {
                let pos = this.model.getBtnPos(basePos, addBtnData.locationType, i)
                this.adjustBtnPos(addTarget, pos);
            }
        }

        if (tweenList.length > 0) {
            this.btnExtend.touchable = false
            let gap = this.model.getGapByLocaltionType(addBtnData.locationType);
            let targetPos = this.model.getBtnPos(basePos, addBtnData.locationType, targetIdx)
            for (let index = 0; index < tweenList.length; index++) {
                let btn = tweenList[index];
                let btnData = btn.view.data as MainToolBarButtonData;
                let isVBtn = btnData.locationType == EmMainToolBarBtnLocationType.Cow
                let vx = isVBtn ? btn.x : (btn.x - gap)
                let vy = isVBtn ? (btn.y - gap) : btn.y
                Laya.Tween.to(btn, { x: vx, y: vy, alpha: 1 }, 1, null, Laya.Handler.create(this, () => {
                    if (addBtnData.getVisible()) {
                        addTarget.alpha = 1;
                        addTarget.visible = true;
                        this.adjustBtnPos(addTarget, targetPos);
                        this.btnExtend.touchable = true
                        NewbieUtils.execFunc(callFun, params)
                    }
                }));
            }
        } else {
            NewbieUtils.execFunc(callFun, params)
        }
    }

    public getBtnListByLocaltionType(locationType: EmMainToolBarBtnLocationType): UIButton[] {
        let temp = []
        this._allUIBtns.forEach((uiBtn: UIButton, btnType: EmMainToolBarBtnType) => {
            let btnData = uiBtn.view && uiBtn.view.data as MainToolBarButtonData
            if (btnData && locationType == btnData.locationType) {
                temp.push(uiBtn)
            }
        })
        temp.sort((uiBtn1, uiBtn2) => {
            let btnData1 = uiBtn1.view.data as MainToolBarButtonData
            let btnData2 = uiBtn2.view.data as MainToolBarButtonData
            return btnData1.sort - btnData2.sort
        })
        return temp
    }

    private adjustBtnPos(btn: UIButton, pos: any) {
        if (!pos) {
            Logger.warn("MainToolBar[adjustBtnPos]没找到合适的目标位置")
            return;
        }

        btn.x = pos.x;
        btn.y = pos.y;
    }

    public set enable(v: boolean) {
        this.container.displayObject.mouseEnabled = v
    }

    public get enable(): boolean {
        return this.container.displayObject.mouseEnabled
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    private get currentArmyId(): number {
        var bArmy: any = ArmyManager.Instance.army;
        if (bArmy) {
            return bArmy.id;
        }
        return 0;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}