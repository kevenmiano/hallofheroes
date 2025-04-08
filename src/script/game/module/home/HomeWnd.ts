import Resolution from '../../../core/comps/Resolution';
import LangManager from '../../../core/lang/LangManager';
import LayerMgr from '../../../core/layer/LayerMgr';
import Logger from '../../../core/logger/Logger';
import { FUIPoolMgr } from '../../../core/res/FUIPoolMgr';
import WXAdapt from '../../../core/sdk/wx/adapt/WXAdapt';
import BaseFguiCom from '../../../core/ui/Base/BaseFguiCom';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import { UIFilter } from '../../../core/ui/UIFilter';
import UIManager from '../../../core/ui/UIManager';
import { EmLayer } from '../../../core/ui/ViewInterface';
import { IconFactory } from '../../../core/utils/IconFactory';
import Utils from '../../../core/utils/Utils';
import HeroFightingUpdateAction from '../../action/hero/HeroFightingUpdateAction';
import Pin from '../../component/Pin';
import { IconType } from '../../constant/IconType';
import OpenGrades from '../../constant/OpenGrades';
import TemplateIDConstant from '../../constant/TemplateIDConstant';
import { UIAlignType } from '../../constant/UIAlignType';
import { EmWindow } from "../../constant/UIDefine";
import { ChatEvent, NotificationEvent, PetEvent, SNSEvent, SpaceEvent } from '../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../constant/event/PlayerEvent';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { PlayerModel } from '../../datas/playerinfo/PlayerModel';
import { SimplePlayerInfo } from '../../datas/playerinfo/SimplePlayerInfo';
import { ThaneInfo } from '../../datas/playerinfo/ThaneInfo';
import { ArmyManager } from "../../manager/ArmyManager";
import { CampaignManager } from '../../manager/CampaignManager';
import { ChatManager } from '../../manager/ChatManager';
import FunOpenManager from '../../manager/FunOpenManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from "../../manager/PlayerManager";
import { SNSManager } from '../../manager/SNSManager';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import { BaseArmy } from '../../map/space/data/BaseArmy';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import { MapCameraMediator } from '../../mvc/mediator/MapCameraMediator';
import { OuterCityMapCameraMediator } from '../../mvc/mediator/OuterCityMapCameraMediator';
import { SpaceMapCameraMediator } from '../../mvc/mediator/SpaceMapCameraMediator';
import ComponentSetting from '../../utils/ComponentSetting';
import { DelayActionsUtils } from '../../utils/DelayActionsUtils';
import FUIHelper from '../../utils/FUIHelper';
import { WorldBossHelper } from '../../utils/WorldBossHelper';
import { RoleModel } from '../bag/model/RoleModel';
import ChatModel from '../chat/ChatModel';
import WelfareCtrl from '../welfare/WelfareCtrl';
import WelfareData from '../welfare/WelfareData';
import ChatBugleView from './ChatBugleView';
import GoldenSheepView from './GoldenSheepView';
import HomeBugleNoticeWnd from './HomeBugleNoticeWnd';
import HomeChatMsgView from './HomeChatMsgView';
import HomePrivate from './HomePrivate';
import MainToolBar from './MainToolBar';
import MineralView from './MineralView';
import OtherRoleCom from './OtherRoleCom';
import PetRoleCom from './PetRoleCom';
import RoleCom from './RoleCom';
import SmallMapBar from './SmallMapBar';
import SystemNoticeWnd from './SystemNoticeWnd';
import TopToolBar from './TopToolBar';

/**
* @author:pzlricky
* @data: 2020-12-23 17:06
* @description *** 
*/
export default class HomeWnd extends BaseWindow {
    public static MODE_DEFAULT: number = 0;
    public static MODE_NORMAL_SCENE: number = 1;
    public static MODE_MINERAL_SCENE: number = 2;
    public static MODE_PETLAND_SCENE: number = 3;
    public static MODE_CONSORTIA_SECRETINFO_SCENE: number = 4;
    public static MODE_NONE_TOP_SCENE: number = 5;
    private static inst: HomeWnd = null;

    private roleCom: fgui.GComponent;//任务信息容器
    private otherRole: OtherRoleCom;//其他玩家头像信息
    private smallMap: fgui.GComponent;//任务信息容器
    private topTool: fgui.GComponent;//任务信息容器
    private mainTool: fgui.GComponent;//任务信息容器
    private mineral: fgui.GComponent;//紫晶
    private chatCom: fgui.GComponent;
    private rightTopCom: fgui.GComponent;
    private msgGroup: fgui.GGroup;
    private leftCom: fgui.GComponent;//
    private goldenSheepBtn: fgui.GComponent;//好运红包
    private goldenSheepShine: fgui.Controller;
    private picIcon: fgui.GLoader;
    private leftTimeTxt: fgui.GTextField;
    public static STEP: number = 9999999;
    public static STEP_ONE: number = 99999;
    private rolePart: RoleCom;
    private smallMapBar: SmallMapBar;
    private topToolBar: TopToolBar;
    private mainToolBar: MainToolBar;
    private homeBugleNotice: fgui.GComponent;
    private systemNotice: fgui.GComponent;
    private mineralView: MineralView;
    private goldenSheepView: GoldenSheepView;
    private showChatInfo: fgui.Controller;//主界面聊天控制器
    private homeBugble: ChatBugleView;//主界面公告
    private messageView: HomeChatMsgView;//主界面聊天展示信息
    private wifi: Pin;
    private homePrivate: HomePrivate;//私聊头像
    // private MailBtn: UIButton;

    private ChatBtn: UIButton;
    private mineralMapBtn: UIButton;//地图按钮
    private UnlockMapCameraBtn: UIButton;//恢复镜头跟随人物按钮

    private LevelGiftTipBtn: UIButton;//等级礼包提示按钮
    public showMapCtrl: fgui.Controller;

    public showUserInfoCtrl: fgui.Controller;
    private cIsIOS: fgui.Controller;
    private _levelUpTipClickOut: number = 0;//上线后差一级可领取按钮闪提示后点击的次数
    private barGroupOriginX: number = 0;
    private petRoleCom: PetRoleCom;//英灵信息
    private powerBtn: UIButton;
    public static get Instance(): HomeWnd {
        if (!this.inst) {
            this.inst = new HomeWnd();
            this.inst.resizeContent = true;
        }
        return this.inst;
    }

    public OnInitWind() {
        super.OnInitWind();
        FUIPoolMgr.Instance.setup()
        BaseFguiCom.autoGenerate(this.rightTopCom, this)
        BaseFguiCom.autoGenerate(this.chatCom, this)
        BaseFguiCom.autoGenerate(this.leftCom, this)

        this.rolePart = new RoleCom(this.roleCom, this);
        this.smallMapBar = new SmallMapBar(this.smallMap);
        this.topToolBar = new TopToolBar(this.topTool);
        this.mainToolBar = new MainToolBar(this.mainTool);
        this.mineralView = new MineralView(this.mineral);
        this.goldenSheepShine = this.leftCom.getController("goldenSheepShine");
        this.picIcon = this.leftCom.getChild("picIcon") as fgui.GLoader;
        this.goldenSheepView = new GoldenSheepView(this.goldenSheepBtn, this.goldenSheepShine, this.picIcon, this.leftTimeTxt, this.leftCom);
        this.otherRole = this.roleCom.getChild("otherRole") as OtherRoleCom;
        this.petRoleCom = this.roleCom.getChild("petRoleCom") as PetRoleCom
        this.showMapCtrl = this.rightTopCom.getController("showMapCtrl");
        this.showUserInfoCtrl = this.getController("showUserInfoCtrl");
        this.cIsIOS = this.getController("cIsIOS");
        this.cIsIOS.selectedIndex = Utils.isIOS() ? 1 : 0;
        this.control.sendLevelGiftReward(1);
        if (this.msgGroup)
            this.msgGroup.visible = !ComponentSetting.IOS_VERSION;//IOS提审版本不展示
        //添加公告
        this.createBugleNotice();
        this.checkNickName();
        let goodsInfo: GoodsInfo = new GoodsInfo();
        goodsInfo.templateId = TemplateIDConstant.TEMP_ID_POWER;
        this.powerBtn.scaleParas.paraScale = 1;
        FUIHelper.setTipData(this.powerBtn.view,
            EmWindow.WearyTips,
            goodsInfo
        )

        Resolution.addWidget(this.roleCom.displayObject);
        Resolution.addWidget(this.chatCom.displayObject);

        if (Utils.isApp()) {
            Resolution.addWidget(this.mainTool.displayObject, UIAlignType.RIGHT);
            Resolution.addWidget(this.rightTopCom.displayObject, UIAlignType.RIGHT);
        }

        Resolution.addWidget(this.leftCom.displayObject);
        this.setChatBtnVisible();
    }

    private setChatBtnVisible() {
        if (ChatManager.Instance.model.showChatViewFlag) {
            this.ChatBtn.visible = false;
        } else {
            this.ChatBtn.visible = true;
        }
    }

    private checkNickName() {
        let nickName: String = PlayerManager.Instance.currentPlayerModel.playerInfo.nickName;
        if (nickName.indexOf("!") != -1) {
            UIManager.Instance.ShowWind(EmWindow.RenameWnd, RoleModel.TYPE_COMPOSE);
        }
    }
    private async createBugleNotice() {
        this.homeBugleNotice = await HomeBugleNoticeWnd.createInstance();
        LayerMgr.Instance.addToLayer(this.homeBugleNotice.displayObject, EmLayer.STAGE_TIP_LAYER);
        this.homeBugleNotice.x = (this.contentPane.width - this.homeBugleNotice.width) / 2;
        this.homeBugleNotice.y = 160;

        this.systemNotice = await SystemNoticeWnd.createInstance();
        LayerMgr.Instance.addToLayer(this.systemNotice.displayObject, EmLayer.STAGE_TIP_LAYER);

        this.systemNotice.x = (this.contentPane.width - this.systemNotice.width) / 2;
        this.systemNotice.y = 100;
    }

    public OnShowWind() {
        super.OnShowWind();
        this.initEvent();
        this.levelUpdate();
        this.refreshChat();
        this.updatePreFight()
        this.checkNickName();
        this.updateHeadImg();
        this.mainToolBar.OnShowWind();
        this.smallMapBar.OnShowWind();
        this.rolePart.initUserInfo();
        this.mineralView.onRefresh();
        this.topToolBar.fold = false;
        this.topToolBar.refreshBtnViews();//刷新顶部按钮
        FunOpenManager.Instance.refreshFunOpen();

        if (PlayerManager.Instance.currentPlayerModel.playerInfo.youmeToken == '') {
            let userId = PlayerManager.Instance.currentPlayerModel.userInfo.mainSite + '_' + PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
            PlayerManager.Instance.reqToken(userId);
        }
        let adjustCtrl = this.rightTopCom.getController("wxCtrl");
        adjustCtrl.selectedIndex = 0;
        if (Utils.isWxMiniGame()) {
            adjustCtrl.selectedIndex = 1;
            Laya.Resource.destroyUnusedResources();
        }

        let innerGroup = this.rightTopCom.getChild("innerGroup").asGroup;
        innerGroup.ensureSizeCorrect();


        this._updatePetHander();
    }

    public showMapBtn() {
        this.showUserInfoCtrl.selectedIndex = 1;
        switch (SceneManager.Instance.currentType) {
            case SceneType.CASTLE_SCENE:
                // 未达到天空之城进入等级不显示小地图
                if (ArmyManager.Instance.thane.grades < OpenGrades.ENTER_SPACE) {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_DEFAULT;
                } else {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_NORMAL_SCENE;
                }
                break;
            case SceneType.SPACE_SCENE:
            case SceneType.OUTER_CITY_SCENE:
                this.showMapCtrl.selectedIndex = HomeWnd.MODE_NORMAL_SCENE;
                break;
            case SceneType.VEHICLE_ROOM_SCENE:
            case SceneType.WARLORDS_ROOM:
            case SceneType.PVE_ROOM_SCENE:
            case SceneType.PVP_ROOM_SCENE:
                this.showMapCtrl.selectedIndex = HomeWnd.MODE_NONE_TOP_SCENE;
                break;
            case SceneType.CAMPAIGN_MAP_SCENE:
                let mapID = CampaignManager.Instance.mapModel && CampaignManager.Instance.mapModel.mapId;
                // 新手地图不显示右上角工具栏
                if (WorldBossHelper.checkIsNoviceMap(mapID)) {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_NONE_TOP_SCENE;
                }
                else if (WorldBossHelper.checkMineral(mapID)) {//紫晶矿产
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_MINERAL_SCENE;
                }
                else if (WorldBossHelper.checkPetLand(mapID)) {//英灵岛
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_PETLAND_SCENE;
                }
                else if (WorldBossHelper.checkConsortiaSecretLand(mapID)) {//公会秘境
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_CONSORTIA_SECRETINFO_SCENE;
                }
                else if (WorldBossHelper.checkTrailTower(mapID) || (WorldBossHelper.checkWorldBoss(mapID) || WorldBossHelper.checkPvp(mapID) || WorldBossHelper.checkGvg(mapID) || WorldBossHelper.checkConsortiaDemon(mapID))) {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_NONE_TOP_SCENE;
                }
                else if (WorldBossHelper.checkConsortiaBoss(mapID)) {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_NONE_TOP_SCENE;
                }
                else if (WorldBossHelper.checkSingleBgMap(mapID)) {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_NONE_TOP_SCENE;
                    this.showUserInfoCtrl.selectedIndex = 0;
                }
                else {
                    this.showMapCtrl.selectedIndex = HomeWnd.MODE_DEFAULT;
                }
                break;
            default:
                this.showMapCtrl.selectedIndex = HomeWnd.MODE_DEFAULT;
                break;
        }
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    async instShow() {
        await UIManager.Instance.ShowWind(EmWindow.Home)
        // Logger.xjy("HomeWnd instShow")
    }

    showCrossInfo() {
        FrameCtrlManager.Instance.open(EmWindow.CorssPvPCenterShowWnd);
    }

    hideCrossInfo() {
        FrameCtrlManager.Instance.exit(EmWindow.CorssPvPCenterShowWnd);
    }

    async instHide() {
        await UIManager.Instance.HideWind(EmWindow.Home)
        // Logger.xjy("HomeWnd instHide")
    }

    initEvent() {
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.levelUpdate, this);
        this.ChatBtn.onClick(this, this.onChatClick);
        this.mineralMapBtn.onClick(this, this.onCampaginMapClick);
        this.LevelGiftTipBtn.onClick(this, this.onLevelGiftTipClick);
        this.UnlockMapCameraBtn.onClick(this, this.onUnlockMapCameraClick);
        NotificationManager.Instance.addEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.levelGiftUpdate, this);
        // NotificationManager.Instance.addEventListener(SceneEvent.BLUR_MASK, this.mBlurMask, this);
        // IMManager.Instance.addEventListener(IMEvent.RECEIVE_MSG, this.__imFrameUpdateHandler, this);
        this.thane.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.playerModel.addEventListener(SpaceEvent.TARGET_CHANGE, this.__spaceTargetChangeHandler, this);
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.setChatBtnVisible, this);
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_BUGLE_VIEW_VISIBLE, this.setChatBtnVisible, this);
        NotificationManager.Instance.addEventListener(ChatEvent.UPDATE_CHAT_VIEW_VISIBLE, this.setChatBtnVisible, this);
        this.playerInfo.addEventListener(PetEvent.PET_ADD, this._updatePetHander, this);
        this.playerInfo.addEventListener(PetEvent.PET_REMOVE, this._updatePetHander, this);
        this.playerInfo.addEventListener(PetEvent.PET_UPDATE, this._updatePetHander, this);
        this.playerInfo.addEventListener(PetEvent.ENTERWAR_PET_CHANGE, this._updatePetHander, this);
        SNSManager.Instance.addEventListener(SNSEvent.SNSINFO_UPDATE, this.updateHeadImg, this);
    }

    private removeEvent() {
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_LEVEL_UPDATE, this.levelUpdate, this);
        // NotificationManager.Instance.removeEventListener(SceneEvent.BLUR_MASK, this.mBlurMask, this);
        // IMManager.Instance.removeEventListener(IMEvent.RECEIVE_MSG, this.__imFrameUpdateHandler, this);
        this.ChatBtn.offClick(this, this.onChatClick.bind(this));
        this.mineralMapBtn.offClick(this, this.onCampaginMapClick);
        this.LevelGiftTipBtn.offClick(this, this.onLevelGiftTipClick.bind(this));
        this.UnlockMapCameraBtn.onClick(this, this.onUnlockMapCameraClick.bind(this));
        this.thane.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.LEVEL_GIFT_UPDATE, this.levelGiftUpdate, this);
        this.playerModel.removeEventListener(SpaceEvent.TARGET_CHANGE, this.__spaceTargetChangeHandler, this);

        NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_VIEW, this.setChatBtnVisible, this);
        NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_BUGLE_VIEW_VISIBLE, this.setChatBtnVisible, this);
        NotificationManager.Instance.removeEventListener(ChatEvent.UPDATE_CHAT_VIEW_VISIBLE, this.setChatBtnVisible, this);

        this.barGroupOriginX = 0;
        this.playerInfo.removeEventListener(PetEvent.PET_ADD, this._updatePetHander, this);
        this.playerInfo.removeEventListener(PetEvent.PET_REMOVE, this._updatePetHander, this);
        this.playerInfo.removeEventListener(PetEvent.PET_UPDATE, this._updatePetHander, this);
        this.playerInfo.removeEventListener(PetEvent.ENTERWAR_PET_CHANGE, this._updatePetHander, this);
        SNSManager.Instance.removeEventListener(SNSEvent.SNSINFO_UPDATE, this.updateHeadImg, this);
    }

    private updateHeadImg() {
        this.UnlockMapCameraBtn.view.getChild("com").asCom.getChild("imgHead").icon = IconFactory.getPlayerIcon(ArmyManager.Instance.thane.snsInfo.headId, IconType.HEAD_ICON);
    }

    private updatePreFight() {
        this._preFighting = this.thane.fightingCapacity;
    }

    private get chatModel(): ChatModel {
        return ChatManager.Instance.model;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    /**
     * 天空之城选择目标事件处理
     * 
     */
    private __spaceTargetChangeHandler(armyInfo: BaseArmy): void {
        if (armyInfo) {
            this.otherRole.setRoleInfo(armyInfo);
            this.otherRole.visible = true;
        } else {
            this.otherRole.visible = false;
            // ChatItemMenu.Hide();
        }
    }


    private _updatePetHander() {
        if (this.playerInfo) {
            if (this.playerInfo.enterWarPet) {
                this.petRoleCom.setPetInfo(this.playerInfo.enterWarPet);
                this.petRoleCom.visible = true;
            } else {
                this.petRoleCom.visible = false;
                this.petRoleCom.setPetInfo(null);
            }
        }
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private _preFighting: number = 0;
    private __thaneInfoChangeHandler(target) {
        var simpleInfo: SimplePlayerInfo;

        if (target == null) {
            simpleInfo = this.thane;
        } else {
            simpleInfo = target as SimplePlayerInfo;
        }
        if (!simpleInfo) return;

        if (simpleInfo.fightingCapacity > this._preFighting && this._preFighting > 0 && !this.__checkFrameExist()) {
            Logger.info("[HomeWnd]战斗力提升动画", this._preFighting, simpleInfo.fightingCapacity)
            DelayActionsUtils.Instance.addAction(new HeroFightingUpdateAction(this._preFighting, simpleInfo));
        }
        this._preFighting = simpleInfo.fightingCapacity;
    }

    private __checkFrameExist(): boolean {
        return false;
    }

    private mBlurMask(data: any) {
        if (!data) return;

        if (UIManager.Instance.isShowingModelWin(data.type)) return;

        if (data.isBlur) {
            this.filters = [UIFilter.blurFilter]
        } else {
            this.filters = []
        }
    }

    private __imFrameUpdateHandler() {
        // var frameNum: number = IMManager.Instance.model.msgBoxList.length;
        // frameNum > IMModel.MAX_MSGBOX_ITEMNUM ? frameNum = IMModel.MAX_MSGBOX_ITEMNUM : frameNum;
        // this.ChatBtn.selfRedDot(SharedManager.Instance.privacyMsgCount > 0 ? 1 : 0);
    }

    private levelUpdate() {
        let selIndex = this.showMapCtrl.selectedIndex
        if (this.checkCondition()) {
            // this.LevelGiftTipBtn.visible = (selIndex == HomeWnd.MODE_NORMAL_SCENE);//这个礼包领取的提示取消
            if (this._levelUpTipClickOut == 0) {
                // Utils.flashTarget(this.LevelGiftTipBtn.view, UIFilter.redFilter);
            }
        } else {
            this.LevelGiftTipBtn.visible = false;
            // Utils.flashTarget(this.LevelGiftTipBtn.view, UIFilter.normalFilter);
            this._levelUpTipClickOut = 0;
        }
    }

    private levelGiftUpdate() {
        this.levelUpdate();
    }

    private checkCondition(): boolean {
        let flag: boolean = false;
        if (!this.welfModel) return flag;
        let arr: Array<number> = this.welfModel.levelArr;
        if (arr && arr.length > 0) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] == ArmyManager.Instance.thane.grades + 1) {
                    flag = true;
                    break;
                }
            }
        }
        return flag;
    }

    /**
     * 点击等级礼包提示按钮
     */
    onLevelGiftTipClick() {
        Utils.flashTarget(this.LevelGiftTipBtn.view, UIFilter.normalFilter);
        this._levelUpTipClickOut++;
        FrameCtrlManager.Instance.open(EmWindow.Welfare, { str: LangManager.Instance.GetTranslation('welfareWnd.tabTitle.LevelGift') });

    }

    /**副本地图*/
    onCampaginMapClick() {
        UIManager.Instance.ShowWind(EmWindow.CampaignMapWnd);
    }

    /**聊天 */
    onChatClick() {
        FrameCtrlManager.Instance.open(EmWindow.ChatWnd);
    }

    onUnlockMapCameraClick() {
        let currentType = SceneManager.Instance.currentType;
        if (currentType == SceneType.SPACE_SCENE) {
            SpaceMapCameraMediator.unlockMapCamera();
        } else if (currentType == SceneType.CAMPAIGN_MAP_SCENE) {
            MapCameraMediator.unlockMapCamera();
        } else if (currentType == SceneType.OUTER_CITY_SCENE) {
            OuterCityMapCameraMediator.unlockMapCamera();
            OuterCityMapCameraMediator.motion();
        }
    }

    /**刷新聊天 */
    private refreshChat() {
        this.messageView && this.messageView.refreshChatScene();
        this.homePrivate && this.homePrivate.getPrivatePerson();
    }

    public showUnlockMapCameraBtn(b: boolean) {
        this.UnlockMapCameraBtn && (this.UnlockMapCameraBtn.visible = b);
    }

    public getRolePart(): RoleCom {
        if (this.rolePart) return this.rolePart;
        return null;
    }

    public getSmallMapBar(): SmallMapBar {
        if (this.smallMapBar) return this.smallMapBar;
        return null;
    }

    public getTopToolBar(): TopToolBar {
        if (this.topToolBar) return this.topToolBar;
        return null;
    }

    public getMainToolBar(): MainToolBar {
        if (this.mainToolBar) return this.mainToolBar;
        return null;
    }

    public setSmallMapVisible(value: boolean) {
        if (this.smallMapBar) this.smallMapBar.visible = value;
    }

    public setTopToolBarVisible(value: boolean) {
        if (this.topToolBar) this.topToolBar.visible = value;
    }

    public setMainToolBarVisible(value: boolean) {
        if (this.mainToolBar) this.mainToolBar.visible = value;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    onReplyClick() {
        // this.MailBtn.view.getController('c1').selectedIndex = 0;
        // FrameCtrlManager.Instance.open(EmWindow.ServiceReplyWnd);
        UIManager.Instance.ShowWind(EmWindow.ServiceReplyWnd);
    }

    private get welfModel(): WelfareData {
        return this.control.data;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    /**
     * 如果需要移除该单例 需要重写dispose接口并调用HomeWnd.Instance.instHide(true)
     */
    public dispose() {
        if (this.mainToolBar) this.mainToolBar.dispose();
        if (this.topToolBar) this.topToolBar.dispose();
        if (this.smallMapBar) this.smallMapBar.dispose();
        if (this.rolePart) this.rolePart.dispose();
        if (this.otherRole) this.otherRole.dispose();
        if (this.petRoleCom) this.petRoleCom.dispose();
        if (this.messageView) this.messageView.dispose();
        if (this.goldenSheepView) this.goldenSheepView.dispose();
        if (this.homeBugleNotice && !this.homeBugleNotice.isDisposed) {
            LayerMgr.Instance.removeByLayer(this.homeBugleNotice.displayObject, EmLayer.STAGE_TIP_LAYER);
            this.homeBugleNotice.dispose();
        }
        if (this.systemNotice && !this.systemNotice.isDisposed) {
            LayerMgr.Instance.removeByLayer(this.systemNotice.displayObject, EmLayer.STAGE_TIP_LAYER);
            this.systemNotice.dispose();
        }
        HomeWnd.inst = null;
        super.dispose();
    }
}