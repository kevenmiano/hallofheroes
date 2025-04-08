
import FUI_TabBrown3 from "../../../../fui/Base/FUI_TabBrown3";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { SimpleDictionary } from "../../../core/utils/SimpleDictionary";
import Utils from "../../../core/utils/Utils";
import { ShowAvatar } from "../../avatar/view/ShowAvatar";
import { PlayerBagCell } from "../../component/item/PlayerBagCell";
import { PlayerEquipCell } from "../../component/item/PlayerEquipCell";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { BagType } from "../../constant/BagDefine";
import GoodsSonType from "../../constant/GoodsSonType";
import OpenGrades from "../../constant/OpenGrades";
import { EmWindow } from "../../constant/UIDefine";
import { UpgradeType } from "../../constant/UpgradeType";
import { ArmyEvent, BAG_EVENT, BagEvent, ExtraJobEvent, FashionEvent, NativeEvent, NotificationEvent, ResourceEvent } from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import ConfigInfosTempInfo from "../../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../../datas/goods/GoodsInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { SimplePlayerInfo } from "../../datas/playerinfo/SimplePlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import { ArmySocketOutManager } from "../../manager/ArmySocketOutManager";
import { FashionManager } from "../../manager/FashionManager";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { ResourceManager } from "../../manager/ResourceManager";
import { SharedManager } from "../../manager/SharedManager";
import { SocketSendManager } from "../../manager/SocketSendManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { VIPManager } from "../../manager/VIPManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import ComponentSetting from "../../utils/ComponentSetting";
import FUIHelper from "../../utils/FUIHelper";
import { SwitchPageHelp } from "../../utils/SwitchPageHelp";
import { ThaneEquipShowHelper } from "../../utils/ThaneEquipShowHelper";
import { RoleCtrl } from "../bag/control/RoleCtrl";
import ExtraJobModel from "../bag/model/ExtraJobModel";
import { FashionModel } from "../bag/model/FashionModel";
import { BagHelper } from "../bag/utils/BagHelper";
import { AccountCom } from "../common/AccountCom";
import NewbieModule from "../guide/NewbieModule";
import NewbieConfig from "../guide/data/NewbieConfig";
import HomeWnd from "../home/HomeWnd";
import { SJewelCom } from "./SJewelCom";
import { SRolePropertyCom } from "./SRolePropertyCom";
import { SAppellCom } from "./appell/SAppellCom";
import { SBagCom } from "./bag/SBagCom";
import { SFashionCom } from "./fashion/SFashionCom";
import { SFortuneGuardCom } from "./guard/SFortuneGuardCom";
import { HonorCom } from "./honor/HonorCom";
import { MasteryCom } from "./mastery/MasteryCom";
import { TattooCom } from "./tattoo/TattooCom";

/**
 * 新版背包
 * @description 角色界面
 * @author zhihua.zhou
 * @date 2022/12/1
 * @ver 1.0
 */
export class SRoleWnd extends BaseWindow {
    protected setSceneVisibleOpen: boolean = true
    protected resizeContent: boolean = true;
    protected resizeFullContent: boolean = true;
    private contentGroup: fgui.GGroup;
    private account: AccountCom;
    private bag_com: SBagCom;
    private property_com: SRolePropertyCom;
    private jewel_com: SJewelCom;
    // private guard_com: SBattleGuardCom;
    private fortune_com: SFortuneGuardCom;
    private tattoo_com: TattooCom;
    private appell_com: SAppellCom;
    private honor_com: HonorCom;
    private fashion_com: SFashionCom;
    private mastery_com: MasteryCom;
    role_group: fairygui.GGroup;
    //左侧的tab
    public tab0: fgui.GList;
    //右侧的tab
    public tab1: fgui.GList;
    private tab1Data: Array<string>;

    public page: fgui.Controller;
    public pageCtrl: fgui.Controller;
    public frame: fgui.GLabel;
    public bgcom: fgui.GComponent;
    public txt_name: fgui.GTextField;
    public txt_level: fgui.GTextField;
    public txt_fighting: fgui.GTextField;
    public btn_vip: fgui.GButton;
    public txt_progress: fgui.GTextField;
    public progress: fgui.GProgressBar;
    public checkbox_fashion: fgui.GButton;
    public hide_0: fgui.GButton;
    public hide_1: fgui.GButton;
    public hide_2: fgui.GButton;
    public hide_3: fgui.GButton;
    public btn_save: fgui.GButton;
    // public btn_fashionCompose: fgui.GButton;
    // public btn_fashionSwitch: fgui.GButton;
    public closeBtn: fgui.GButton;
    public detailBtn: fgui.GButton;
    private _figure: ShowAvatar;
    private avatarCom: fgui.GComponent;

    public headdress: PlayerEquipCell;
    public necklace: PlayerEquipCell;
    public clothes: PlayerEquipCell;
    public weapon: PlayerEquipCell;
    public ring1: PlayerEquipCell;
    public ring2: PlayerEquipCell;
    public trinket1: PlayerEquipCell;
    public trinket2: PlayerEquipCell;

    public headdressFashion: PlayerEquipCell;
    public clothesFashion: PlayerEquipCell;
    public weaponFashion: PlayerEquipCell;
    public wing: PlayerEquipCell;
    public honor1: PlayerEquipCell;
    public heraldry: PlayerEquipCell;
    public halidom: PlayerEquipCell;


    private _equipList: PlayerEquipCell[];
    private _fashionList: PlayerEquipCell[];
    private _equipViewList: SimpleDictionary;
    private _fashionViewList: SimpleDictionary;
    private _honerViewList: SimpleDictionary;
    private _simpleInfo: SimplePlayerInfo;
    public changeBagWnd: boolean = true;//用于角色和背包的切换关联


    private _showThane: ThaneInfo;
    /** 记录上次选中的tab0索引 */
    private _lastSelectIndex0: number = 0;
    /** 记录上次选中的tab1索引 */
    private _curSelectIndex1: number = 0;
    /** 【荣誉装备】开启等级 */
    private honoropenlevel: number = 20;
    /** 【龙纹】开启等级 */
    private tattooopenlevel: number = 55;

    private _canSave: boolean = false;//是否可保存试穿的时装
    private openFashionSwallFlag: boolean = false;//默认打开时装吞噬界面
    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    openFromPlayerInfo() {
        return false;
    }


    constructor() {
        super();
    }


    public OnInitWind() {
        super.OnInitWind();
        this.tab0.getChildAt(0).asButton.title = LangManager.Instance.GetTranslation('answer.view.rank.name');
        this.tab0.getChildAt(1).asButton.title = LangManager.Instance.GetTranslation('FarmWnd.bagTxt');
        this.tab0.getChildAt(2).asButton.title = LangManager.Instance.GetTranslation('fashion.identity.title');
        this.tab0.getChildAt(3).asButton.title = LangManager.Instance.GetTranslation('HigherGradeOpenTipView.content18');
        this.tab0.getChildAt(4).asButton.title = LangManager.Instance.GetTranslation('Bag.mastery');
        this.tab0.getChildAt(4).visible = ArmyManager.Instance.thane.grades >= OpenGrades.MASTERY;
        this.page = this.contentPane.getController("page");
        this.pageCtrl = this.contentPane.getController("pageCtrl");
        this.detailBtn = this.contentPane.getChild("detailBtn").asButton;
        this.detailBtn.title = LangManager.Instance.GetTranslation("fashion.identify.tip");
        let cfg: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName('honoropenlevel');
        if (cfg) {
            let cfgVal = cfg.ConfigValue
            this.honoropenlevel = parseInt(cfgVal);
        }
        this.updateNewFeature();
        this.initData();
        this.createEquip();
        this.initFigureView();
        this.frame.getChild('helpBtn').visible = false;
        this.closeBtn = this.frame.getChild('closeBtn') as fgui.GButton;
        this.btn_save.tooltips = LangManager.Instance.GetTranslation("fashion.FashionSwitchView.saveBtn.tipData03");
        this.btn_save.grayed = true;
        this.btn_save.enabled = false;
        Utils.strokeColor(this.btn_save, false);
        this.addEvent();

    }

    //当有时装可进行鉴定时, 背包处需给红点提示
    private tagArr = ['armyII.viewII.pawnupgrade.property','armyII.viewII.equip.JewelFrame.JewelNameTxt'];// 'battleGuard.NewGuildFrame.titleText'// ,'tattoo.frame.titleText'
    /**
     * 每次进入界面需要判断等级变化后是否开启新功能
     */
    private updateNewFeature() {
       
        // if (this.checkBattleGuardOpen() && ComponentSetting.BATTLE_GUARD) {
        //     arr.push('battleGuard.NewGuildFrame.titleText');
        // }

        if(this.thane.grades >= OpenGrades.FORTUNE_GUARD &&ComponentSetting.FortuneGuard){
            this.tagArr.push('HigherGradeOpenTipView.content25');
        }
        if (this.thane.grades >= this.tattooopenlevel && ComponentSetting.TATTOO) {
            this.tagArr.push('tattoo.frame.titleText');
        }
        if (this.thane.grades >= this.honoropenlevel) {
            this.tagArr.push('RvrBattleResultWnd.roleHonorTxt');
        }
        this.tab1Data = [];
        for (let i = 0; i < this.tagArr.length; i++) {
            let str = this.tagArr[i];
            this.tab1Data.push(LangManager.Instance.GetTranslation(str));
        }
        this.tab1.itemRenderer = Laya.Handler.create(this, this.onRenderTab1, null, false);
        this.tab1.numItems = this.tab1Data.length;
    }

    public OnShowWind() {
        super.OnShowWind();
        // this.decetiveEquip();
        this.fashionModel.scene = FashionModel.FASHION_STORE_SCENE;
        this.updatePersonalInfo();
        this.updateHideFashionBtnState();
        this.updateFight();
        this.updateEquip();
        this.refreshHeroFigure();
        this.updatePlayerExp();
        this.account.switchIcon(0);
        this.property_com.onShow(this.thane);
        this.changeView(this.page);
        this.updateRedPoint();
        this.updateFashionRedPoint();
        this.checkHonorRedDot();
        this.checkJewelRedDot();
        this.checkRoleRedDot();
        this.checkFortuneRedDot();
        this.updateMasteryRedPoint();
        PlayerManager.Instance.currentPlayerModel.sRoleBagIsOpen = true;
        this.updateDetailTips();
        //跳转到时装
        if (this.frameData && this.frameData.tabIndex && this.frameData.tabIndex == 2) {
            this.tab0.selectedIndex = 2;
            this.onSelectTab0(null);
            return;
        }
        //专精
        if (this.frameData && this.frameData.tabIndex && this.frameData.tabIndex == 4) {
            this.tab0.selectedIndex = 4;
            this.onSelectTab0(null);
            return;
        }
        if (this.frameData && this.frameData.appellID) {
            this.tab0.selectedIndex = 3;
            this.tab1.selectedIndex = BAG_INDEX.ATTR;
            this.onSelectTab0(null);
        } else if (this.frameData && this.frameData.openJewel) {
            //跳转到灵魂刻印
            this.tab0.selectedIndex = 0;
            this.onSelectTab0(null);
            this.tab1.selectedIndex = BAG_INDEX.JEWEL;
            this.onSelectTab1(null);
        } else if (this.frameData && this.frameData.openHonor) {
            //跳转到荣誉
            this.tab0.selectedIndex = 0;
            this.onSelectTab0(null);
            if(this.tab1.getChildAt(2).asButton.title == LangManager.Instance.GetTranslation('RvrBattleResultWnd.roleHonorTxt')){
                this.tab1.selectedIndex = 2;
                this.onHonor();
                this.account.switchIcon(4);
            }else{
                this.tab1.selectedIndex = BAG_INDEX.HONOR;
                this.onSelectTab1(null);
            }
        } else if (this.frameData && this.frameData.openTattoo) {
            //跳转到龙纹
            this.tab0.selectedIndex = 0;
            this.onSelectTab0(null);
            this.tab1.selectedIndex = BAG_INDEX.TATTOO;
            this.onSelectTab1(this.tab1.getChildAt(BAG_INDEX.TATTOO) as fairygui.GButton);
        } else if (this.frameData && this.frameData.openFortune) {
            //跳转到命运守护
            this.tab0.selectedIndex = 0;
            this.onSelectTab0(null);
            this.tab1.selectedIndex = BAG_INDEX.FORTUNE;
            this.onSelectTab1(null);
        } 
        else if (this.frameData && this.frameData.openFashionSwall) {
            this.openFashionSwallFlag = true;
            this.tab0.selectedIndex = 2;
            this.onSelectTab0(null);
            return;
        }
        else {
            this.tab0.selectedIndex = 1;
            this.onSelectTab0(null);
            this.tab1.selectedIndex = BAG_INDEX.ATTR;
        }
    }

    private initData() {
        this._equipViewList = new SimpleDictionary();
        this._fashionViewList = new SimpleDictionary();
        this._honerViewList = new SimpleDictionary();
        this._equipList = [];
        this._fashionList = [];
        let str = fgui.UIPackage.getItemURL('SBag', VIPManager.Instance.model.vipInfo.VipGrade.toString());
        this.btn_vip.icon = str;
        // this.btn_luck.visible = ComponentSetting.BATTLE_GUARD
    }

    private initFigureView() {
        this._figure = new ShowAvatar(true);
        this._figure.pos(110, 200);
        this.avatarCom.displayObject.addChild(this._figure);
    }

    /**
     * 切换主页签后, 重置试穿状态
     */
    public resetTryWearState() {
        for (const key in this.fashionModel.saveList) {
            if (this.fashionModel.saveList.hasOwnProperty(key)) {
                this.fashionModel.saveList[key] = null;
                delete this.fashionModel.saveList[key];
            }
        }
        this._showThane = null;
    }

    onSelectTab0(item: fgui.GObject) {
        let index = this.tab0.selectedIndex;
        if (this._lastSelectIndex0 == 2 && index != 2) {//从外观切换到其他页签
            this.resetTryWearState();
        }
        if (index != 3) {
            if (index == 2 && this.thane.grades < 10) {
            } else {
                this._lastSelectIndex0 = index;
            }
        }
        this.account.switchIcon(0);
        switch (index) {
            //角色
            case 0:
                if (FashionManager.Instance.isopenFashion) {
                    this.refreshHeroFigure();
                }
                this.tab1.selectedIndex = BAG_INDEX.ATTR;
                FashionManager.Instance.isopenFashion = false;
                this.page.selectedIndex = 0;
                this.pageCtrl.selectedIndex = 0;
                this.role_group.visible = this._figure.visible = true;
                break;
            //背包
            case 1:
                if (!this.role_group.visible) {
                    this.role_group.visible = this._figure.visible = true
                }
                if (FashionManager.Instance.isopenFashion) {
                    this.refreshHeroFigure();
                }
                FashionManager.Instance.isopenFashion = false;
                this.page.selectedIndex = 0;
                this.bag_com.onShow();
                this.pageCtrl.selectedIndex = 6;
                this.bag_com.selectAll();
                HomeWnd.Instance.getMainToolBar().redDotHandler.setAllBatchGoodesSeened();
                break;
            //时装
            case 2:
                if (this.thane.grades < 10) {
                    let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", 10);
                    MessageTipManager.Instance.show(str);
                    if (this._lastSelectIndex0 != 2) {
                        this.tab0.selectedIndex = this._lastSelectIndex0;
                    }
                    return;
                }

                if (!this.role_group.visible) {
                    this.role_group.visible = this._figure.visible = true
                }
                this.page.selectedIndex = 1;
                if (this.openFashionSwallFlag) {
                    this.onBtnFashionClick(0);
                }
                else {
                    this.onBtnFashionClick(1);
                }
                this.pageCtrl.selectedIndex = 7;
                //
                break;
            //称号
            case 3:
                FashionManager.Instance.isopenFashion = false;
                this.onBtnTitleClick();
                break;
            //专精
            case 4:
                FashionManager.Instance.isopenFashion = false;
                this.onClickMastery();
                break;

            default:
                break;
        }

    }

    onSelectTab1(item: fairygui.GButton) {
        let index = this.tab1.selectedIndex;
        switch (index) {
            //属性
            case 0:
                if (!this.role_group.visible) {
                    this.role_group.visible = this._figure.visible = true
                }
                this.pageCtrl.selectedIndex = 0;
                this.property_com.onShow(this.thane);
                this.account.switchIcon(0);
                this._curSelectIndex1 = index;
                break;
            //灵魂刻印
            case 1:
                if (this.thane.grades >= 35) {
                    this.pageCtrl.selectedIndex = 1;
                    this.jewel_com.onShow();
                    this.account.switchIcon(1);
                    this._curSelectIndex1 = index;

                    if (!this.role_group.visible) {
                        this.role_group.visible = this._figure.visible = true
                    }
                } else {
                    let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", 35);
                    MessageTipManager.Instance.show(str);
                    this.tab1.selectedIndex = this._curSelectIndex1;
                }
                break;
            case BAG_INDEX.HONOR:
                if(!item){
                    this.onHonor();
                    this.account.switchIcon(4);
                }
                break;
            case BAG_INDEX.FORTUNE:
                if(!item){
                    this.onFortune();
                }
                break;
                
        }
        //----------------------------下面几个的位置是不确定的
        //龙纹
        if (item && item.title == LangManager.Instance.GetTranslation('tattoo.frame.titleText')) {
            this.onTattoo();
            this.account.switchIcon(5);
        } //荣誉
        else if (item && item.title == LangManager.Instance.GetTranslation('RvrBattleResultWnd.roleHonorTxt')) {
            this.onHonor();
            this.account.switchIcon(4);
        } //命运守护
        else if (item && item.title == LangManager.Instance.GetTranslation('HigherGradeOpenTipView.content25')) {
            this.onFortune();
        }
    }

    private createEquip() {
        //装备
        this.headdress.item.canOperate = true;
        this.necklace.item.canOperate = true;
        this.clothes.item.canOperate = true;
        this.weapon.item.canOperate = true;
        this.ring1.item.canOperate = true;
        this.ring2.item.canOperate = true;
        this.trinket1.item.canOperate = true;
        this.trinket2.item.canOperate = true;
        this.headdressFashion.item.canOperate = true;
        this.clothesFashion.item.canOperate = true;
        this.weaponFashion.item.canOperate = true;
        this.wing.item.canOperate = true;
        this.honor1.item.canOperate = true;

        this.weapon.item.pos = Number(this.weapon.data);
        this.headdress.item.pos = Number(this.headdress.data);
        this.clothes.item.pos = Number(this.clothes.data);
        this.necklace.item.pos = Number(this.necklace.data);
        this.ring1.item.pos = Number(this.ring1.data);
        this.ring2.item.pos = Number(this.ring2.data);
        this.trinket1.item.pos = Number(this.trinket1.data);
        this.trinket2.item.pos = Number(this.trinket2.data);

        this.weapon.sonType = GoodsSonType.SONTYPE_WEAPON;
        this.headdress.sonType = GoodsSonType.SONTYPE_HEADDRESS;
        this.clothes.sonType = GoodsSonType.SONTYPE_CLOTHES;
        this.necklace.sonType = GoodsSonType.SONTYPE_NECKLACE;
        this.ring1.sonType = GoodsSonType.SONTYPE_RING;
        this.ring2.sonType = GoodsSonType.SONTYPE_RING;
        this.trinket1.sonType = GoodsSonType.SONTYPE_TRINKET;
        this.trinket2.sonType = GoodsSonType.SONTYPE_TRINKET;

        this._equipList.push(this.weapon);
        this._equipList.push(this.headdress);
        this._equipList.push(this.clothes);
        this._equipList.push(this.necklace);
        this._equipList.push(this.ring1);
        this._equipList.push(this.ring2);
        this._equipList.push(this.trinket1);
        this._equipList.push(this.trinket2);

        //时装
        this.headdressFashion.item.pos = Number(this.headdressFashion.data);
        this.clothesFashion.item.pos = Number(this.clothesFashion.data);
        this.weaponFashion.item.pos = Number(this.weaponFashion.data);
        this.wing.item.pos = Number(this.wing.data);

        this.headdressFashion.sonType = GoodsSonType.FASHION_HEADDRESS;
        this.clothesFashion.sonType = GoodsSonType.FASHION_CLOTHES;
        this.weaponFashion.sonType = GoodsSonType.FASHION_WEAPON;
        this.wing.sonType = GoodsSonType.SONTYPE_WING;

        this._fashionList.push(this.headdressFashion);
        this._fashionList.push(this.clothesFashion);
        this._fashionList.push(this.weaponFashion);
        this._fashionList.push(this.wing);

        //荣誉
        this.honor1.item.pos = Number(this.honor1.data);
        this.honor1.sonType = GoodsSonType.SONTYPE_HONER;
        this.honor1.acceptDrop = true;

        //纹章圣物
        this.heraldry.item.canOperate = true;
        this.halidom.item.canOperate = true;
        this.heraldry.item.pos = Number(this.heraldry.data);
        this.halidom.item.pos = Number(this.halidom.data);
        this.heraldry.sonType = GoodsSonType.SONTYPE_HERALDRY;
        this.halidom.sonType = GoodsSonType.SONTYPE_RELIC;
        this.heraldry.acceptDrop = true;
        this.halidom.acceptDrop = true;
        if (ComponentSetting.WENZHANG_SHENGWU) {
            this._equipList.push(this.heraldry);
            this._equipList.push(this.halidom);
        }
        this.heraldry.visible = this.halidom.visible = ComponentSetting.WENZHANG_SHENGWU;
    }

    private updateEquip() {
        this._equipViewList.clear();
        this._fashionViewList.clear();

        for (let i = 0; i < this._equipList.length; i++) {
            const equipGrid = this._equipList[i];
            equipGrid.info = null;
            equipGrid.item.bagType = BagType.HeroEquipment;
            equipGrid.item.objectId = this.thane.id;
            equipGrid.acceptDrop = true;
            this._equipViewList.add(equipGrid.item.pos + "_" + this.thane.id + "_" + equipGrid.item.bagType, equipGrid);
        }

        for (let i = 0; i < this._fashionList.length; i++) {
            const equipGrid = this._fashionList[i];
            equipGrid.info = null;
            equipGrid.item.bagType = BagType.HeroEquipment;
            equipGrid.item.objectId = this.thane.id;
            equipGrid.acceptDrop = true;
            this._fashionViewList.add(equipGrid.item.pos + "_" + this.thane.id + "_" + equipGrid.item.bagType, equipGrid);
        }

        let dic: SimpleDictionary = GoodsManager.Instance.getHeroEquipmentGoodListByTypeAndId(this.thane.id);
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let info: GoodsInfo = dic[key];
                let grid: PlayerEquipCell = this.getItemViewByPos(info.pos) as PlayerEquipCell;
                if (!grid) {
                    continue;
                }
                // Logger.yyz("设置装备格子！！！", info);
                grid.info = info;
            }
        }

        this._honerViewList.clear();
        this.honor1.item.info = null;
        this.honor1.info = null;
        this.honor1.item.bagType = BagType.Honer;
        this.honor1.item.objectId = this.thane.id;
        this._honerViewList.add(this.honor1.item.pos + "_" + this.thane.id + "_" + this.honor1.item.bagType, this.honor1);
        dic = GoodsManager.Instance.getHeroHonerEquip(this.thane.id);
        for (const key in dic) {
            if (dic.hasOwnProperty(key)) {
                let info: GoodsInfo = dic[key];
                let grid: PlayerEquipCell = this.getItemViewByPos(info.pos, BagType.Honer) as PlayerEquipCell;
                if (!grid) {
                    continue;
                }
                // Logger.yyz("设置装备格子！！！", info);
                grid.info = info;
                if (PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond - info.beginDate.getTime() >= info.validDate * 60 * 1000) {
                    SocketSendManager.Instance.sendDeleteGoods(info.bagType, info.pos);
                }
            }
        }
    }

    private updatePersonalInfo() {
        let idx: number = this.thane.templateInfo.Job - 1;
        this.bgcom.getControllerAt(0).setSelectedIndex(idx);
        let nickName: string = "";
        let consortiaName: string = "";
        if (this.thane.nickName == PlayerManager.Instance.currentPlayerModel.userInfo.userId + "$") {
            nickName = LangManager.Instance.GetTranslation("public.nickName");
        } else {
            nickName = this.thane.nickName;
        }
        consortiaName = LangManager.Instance.GetTranslation("sort.view.MemberTitleView.ConsortiaName");
        consortiaName = this.thane.consortiaName ? ('<' + this.thane.consortiaName + '>') : "";
        this.txt_name.text = nickName + consortiaName;
        this.txt_level.text = LangManager.Instance.GetTranslation("public.level2", this.thane.grades);
        this.tab1.getChildAt(1).grayed = this.thane.grades < 35;
        // if(ComponentSetting.FortuneGuard){
        //     this.tab1.getChildAt(2).grayed = this.thane.grades < OpenGrades.FORTUNE_GUARD;
        // }
        this.tab0.getChildAt(3).grayed = this.thane.grades < 30;
        this.tab0.getChildAt(2).grayed = this.thane.grades < 10;
    }

    private checkBattleGuardOpen(showTips: boolean = false): boolean {
        let arr: t_s_upgradetemplateData[] = TempleteManager.Instance.getTemplatesByType(28);
        let find: t_s_upgradetemplateData;
        for (let i = 0; i < arr.length; i++) {
            const temp = arr[i];
            if (temp.ActiveObject == 1) {
                find = temp;
                break;
            }
        }
        let thaneInfo: ThaneInfo = ArmyManager.Instance.thane;
        if (showTips) {
            if (thaneInfo.grades < find.Grades) {
                let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", find.Grades);
                MessageTipManager.Instance.show(str);
            }
        }
        return thaneInfo.grades >= find.Grades;
    }

    private updateFight() {
        if (this._simpleInfo == null) {
            this.txt_fighting.text = this.thane.fightingCapacity.toString();
        } else {
            this.txt_fighting.text = this._simpleInfo.fightingCapacity.toString();
        }
    }

    private updatePlayerExp() {
        let upGrade: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevel(this.thane.grades + 1, UpgradeType.UPGRADE_TYPE_PLAYER);
        if (upGrade) {
            this.progress.min = 0;
            this.progress.max = upGrade.Data;
            this.progress.value = this.thane.gp;
            this.txt_progress.text = `${this.thane.gp}/${upGrade.Data}  (${(this.thane.gp * 100 / upGrade.Data).toFixed(2)}%)`;
        }
        else {
            this.progress.min = 0;
            this.progress.max = 100;
            this.progress.value = 100;
            this.txt_progress.text = LangManager.Instance.GetTranslation("mainBar.PlayerExperenceView.msg");
        }
    }

    public getItemViewByPos(pos: number, bagType: number = BagType.HeroEquipment): PlayerEquipCell {
        if (!this.thane) {
            return null;
        }
        let item: PlayerEquipCell = this._equipViewList[pos + "_" + this.thane.id + "_" + bagType] as PlayerEquipCell;
        if (!item) {
            item = this._fashionViewList[pos + "_" + this.thane.id + "_" + bagType] as PlayerEquipCell;
        }
        if (!item) {
            item = this._honerViewList[pos + "_" + this.thane.id + "_" + bagType];
        }
        return item;
    }

    private __bagItemUpdateHandler(infos: GoodsInfo[]) {
        let udp = false;
        for (let info of infos) {
            let item: PlayerEquipCell = this._equipViewList[info.pos + "_" + info.objectId + "_" + info.bagType];
            if (!item) {
                item = this._fashionViewList[info.pos + "_" + info.objectId + "_" + info.bagType];
            }
            if (!item) {
                item = this._honerViewList[info.pos + "_" + info.objectId + "_" + info.bagType];
            }
            if (item) {
                if (info.pos == 0) {
                    let isWeapon: boolean = item.sonType == GoodsSonType.SONTYPE_WEAPON;
                    if (isWeapon && (!item.info || item.preTemp != info.id)) {
                        NotificationManager.Instance.sendNotification(NotificationEvent.WEAPON_CHANGE, null);
                    }
                }
                item.info = info;
                udp = true;
            }
        }
        udp && this.refreshHeroFigure();
        this.updateRedPoint();
        this.checkFortuneRedDot();
        this.checkRoleRedDot();
        if(this.fortune_com){
            this.fortune_com.checkRedDot();
        }
        this.checkHonorRedDot();
        this.updateMasteryRedPoint();
    }

    private __bagItemDeleteHandler(infos: GoodsInfo[]) {
        let upd = false
        for (let info of infos) {
            let item: PlayerEquipCell = this._equipViewList[info.pos + "_" + info.objectId + "_" + info.bagType];
            if (!item) {
                item = this._fashionViewList[info.pos + "_" + info.objectId + "_" + info.bagType];
            }
            if (!item) {
                item = this._honerViewList[info.pos + "_" + info.objectId + "_" + info.bagType];
            }
            if (item) {
                item.info = null;
                upd = true;
            }
        }
        upd && this.refreshHeroFigure();
        this.updateRedPoint();
        this.checkFortuneRedDot();
        if(this.fortune_com){
            this.fortune_com.checkRedDot();
        }
        this.checkRoleRedDot();
        this.checkHonorRedDot();
        this.updateMasteryRedPoint();
    }

    private refreshHeroFigure() {
        // Logger.yyz("当前翅膀-------------****************>>>>>>>>>>>>>>>" + this.thane.wingAvata);
        this._figure.data = this.thane;
        this.__fashionMsgHandler();
    }


    private __thaneInfoChangeHandler(data: SimplePlayerInfo) {
        this._simpleInfo = data;
        this.updatePersonalInfo();
        this.updateFight();
        // this.updateEquip();
        // if(this.tab0.selectedIndex == 1){//	当玩家通过“背包”对背包内的时装进行“装备”或者“替换”操作时, 左侧分类列表将从“背包”自动跳转至“时装”, 并默认打开时装图鉴；
        //     this.tab0.selectedIndex = 2;
        //     this.onSelectTab0(null);
        // }
    }


    protected addEvent() {
        this.btn_save.onClick(this, this.__saveHandler);
        this.btn_vip.onClick(this, this.vipHander);
        // this.btn_fashionCompose.onClick(this, this.onBtnFashionClick.bind(this, 0));
        // this.btn_fashionSwitch.onClick(this, this.onBtnFashionClick.bind(this, 1));
        this.tab1.on(fairygui.Events.CLICK_ITEM, this, this.onSelectTab1);
        this.tab0.on(fairygui.Events.CLICK_ITEM, this, this.onSelectTab0);
        this.checkbox_fashion.on(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler, [-1]);
        this.hide_0.on(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler, [0]);
        this.hide_1.on(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler, [1]);
        this.hide_2.on(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler, [2]);
        this.hide_3.on(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler, [3]);
        this.page.on(fgui.Events.STATE_CHANGED, this, this.changeView);
        ResourceManager.Instance.gold.addEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
        this.thane.addEventListener(PlayerEvent.JEWELGP_UPDATE, this.updateJewel, this);
        this.thane.addEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__heroInfoChangeHandler, this);
        this.thane.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.thane.addEventListener(PlayerEvent.THANE_EXP_UPDATE, this.updatePlayerExp, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        this.thane.addEventListener(PlayerEvent.THANE_EXP_UPDATE, this.updatePlayerExp, this);
        this.fashionModel.addEventListener(FashionEvent.SWITCH_EQUIPVIEW, this.__panelHandler, this);//切换界面
        this.fashionModel.addEventListener(FashionEvent.CHANGE_SWITCH, this.__switchHandler, this);//时装合成与转换开关
        // FashionManager.Instance.addEventListener(FashionEvent.FASHION_BOOK_RECEIVE, this.__receivedBookHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.APPELL, this.__appellSwitchChange, this);
        NotificationManager.Instance.addEventListener(FashionEvent.FASHION_BOOK_WEAR, this.__wearHandler, this);
        NotificationManager.Instance.addEventListener(FashionEvent.SWITCH_FASION, this.onSwitchFash, this);
        NotificationManager.Instance.addEventListener(FashionEvent.SWALLOW, this.onSwallow, this);
        NotificationManager.Instance.addEventListener(BAG_EVENT.JEWEL, this.openJewel, this);
        this.thane.addEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroPropertyHandler, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.DOUBLE_CLICK, this.__doubleClickBagItemHandler, this);
        this.fashion_com.getChild('fashcompose_com').displayObject.on(FashionEvent.COMPOSE_SUCCEED, this, this.__onComposeCallback);
        NotificationManager.Instance.addEventListener(NotificationEvent.FASHION_SHOW_CHANGE, this.__fashionMsgHandler, this);
        FashionManager.Instance.addEventListener(FashionEvent.FASHION_BOOK_RECEIVE, this.updateFashionRedPoint, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.HONOR_EQUIP_LEVELUP, this.updateHonor, this);
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        NotificationManager.Instance.addEventListener(ArmyEvent.TATTOO_INFO, this.updateTattooInfo, this);
        if (this.thane.grades >= OpenGrades.MASTERY) {
            NotificationManager.Instance.addEventListener(ExtraJobEvent.LEVEL_UP, this.updateMasteryRedPoint, this);
            NotificationManager.Instance.addEventListener(ExtraJobEvent.STAGE_UP, this.updateMasteryRedPoint, this);
        }
    }

    protected removeEvent() {
        this.btn_save.offClick(this, this.__saveHandler);
        this.btn_vip.offClick(this, this.vipHander);
        // this.btn_fashionCompose.offClick(this, this.onBtnFashionClick.bind(this, 0));
        // this.btn_fashionSwitch.offClick(this, this.onBtnFashionClick.bind(this, 1));
        this.tab1.off(fairygui.Events.CLICK_ITEM, this, this.onSelectTab1);
        this.tab0.off(fairygui.Events.CLICK_ITEM, this, this.onSelectTab0);
        ResourceManager.Instance.gold.removeEventListener(ResourceEvent.RESOURCE_UPDATE, this.__refreshGold, this);
        this.checkbox_fashion.off(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler);
        this.hide_0.off(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler);
        this.hide_1.off(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler);
        this.hide_2.off(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler);
        this.hide_3.off(fgui.Events.STATE_CHANGED, this, this.__hideFashionHandler);
        this.page.off(fgui.Events.STATE_CHANGED, this, this.changeView);
        this.thane.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_INFO_UPDATE, this.__thaneInfoChangeHandler, this);
        this.thane.removeEventListener(PlayerEvent.THANE_EXP_UPDATE, this.updatePlayerExp, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        this.thane.removeEventListener(PlayerEvent.THANE_EXP_UPDATE, this.updatePlayerExp, this);
        // this.thane.removeEventListener(PlayerEvent.JEWELGP_UPDATE, this.updateSoulLevel, this);
        this.fashionModel.removeEventListener(FashionEvent.SWITCH_EQUIPVIEW, this.__panelHandler, this);//切换界面
        this.fashionModel.removeEventListener(FashionEvent.CHANGE_SWITCH, this.__switchHandler, this);//时装合成与转换开关
        FashionManager.Instance.removeEventListener(FashionEvent.FASHION_BOOK_RECEIVE, this.updateFashionRedPoint, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.APPELL, this.__appellSwitchChange, this);
        this.thane.removeEventListener(PlayerEvent.JEWELGP_UPDATE, this.updateJewel, this);
        this.thane.removeEventListener(PlayerEvent.THANE_INFO_UPDATE, this.__heroInfoChangeHandler, this);
        this.fashion_com.getChild('fashcompose_com').displayObject.off(FashionEvent.COMPOSE_SUCCEED, this, this.__onComposeCallback);
        NotificationManager.Instance.removeEventListener(FashionEvent.FASHION_BOOK_WEAR, this.__wearHandler, this);
        NotificationManager.Instance.removeEventListener(FashionEvent.SWITCH_FASION, this.onSwitchFash, this);
        NotificationManager.Instance.removeEventListener(FashionEvent.SWALLOW, this.onSwallow, this);
        NotificationManager.Instance.removeEventListener(BAG_EVENT.JEWEL, this.openJewel, this);
        this.thane.removeEventListener(PlayerEvent.PLAYER_AVATA_CHANGE, this.__heroPropertyHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.DOUBLE_CLICK, this.__doubleClickBagItemHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.FASHION_SHOW_CHANGE, this.__fashionMsgHandler, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.HONOR_EQUIP_LEVELUP, this.updateHonor, this);
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
        NotificationManager.Instance.removeEventListener(ArmyEvent.TATTOO_INFO, this.updateTattooInfo, this);
        if (this.thane.grades >= OpenGrades.MASTERY) {
            NotificationManager.Instance.removeEventListener(ExtraJobEvent.LEVEL_UP, this.updateMasteryRedPoint, this);
            NotificationManager.Instance.removeEventListener(ExtraJobEvent.STAGE_UP, this.updateMasteryRedPoint, this);
        }
    }

    private updateTattooInfo(){
        this.updateRedPoint();
        this.checkRoleRedDot();
    }

    private __refreshGold(){
        this.checkHonorRedDot();
        let fashionbtn = this.tab0.getChildAt(2).asButton;
        fashionbtn.getChild('redDot').visible = this.fashionModel.checkRedDot();
    }

    private updateJewel(){
        this.checkRoleRedDot();
    }

    private updateHonor(){
        if(this.honor_com){
            this.honor_com.onShow();
        }
        this.checkRoleRedDot();
    }

    private __fashionMsgHandler() {
        let _equipDic = ArmyManager.Instance.fashionList;
        let wingEquip = _equipDic[8];
        let hairFashion = _equipDic[9];
        let clothFashion = _equipDic[10];
        let armsFashion = _equipDic[11];
        if (this._showThane) {
            let equipObjectId = ArmyManager.Instance.thane.id;
            let weaponInfo: GoodsInfo;
            let clothesInfo: GoodsInfo;
            weaponInfo = GoodsManager.Instance.getItemByPOB(0, equipObjectId, BagType.HeroEquipment);
            clothesInfo = GoodsManager.Instance.getItemByPOB(2, equipObjectId, BagType.HeroEquipment);
            if (clothesInfo) {
                this._showThane.bodyEquipAvata = ThaneEquipShowHelper.getAvatarByEquipInfo(clothesInfo);
            }
            if (weaponInfo) {
                this._showThane.armsEquipAvata = ThaneEquipShowHelper.getAvatarByEquipInfo(weaponInfo);
            }
            this._showThane.wingAvata = ThaneEquipShowHelper.getAvatarByEquipInfo(wingEquip);
            this._showThane.armsFashionAvata = ThaneEquipShowHelper.getAvatarByEquipInfo(armsFashion);
            this._showThane.bodyFashionAvata = ThaneEquipShowHelper.getAvatarByEquipInfo(clothFashion);
            this._showThane.hairFashionAvata = ThaneEquipShowHelper.getAvatarByEquipInfo(hairFashion);
            // this._figure.data = this._showThane;
        }

        this.headdressFashion.info = hairFashion;
        this.clothesFashion.info = clothFashion;
        this.weaponFashion.info = armsFashion;
        this.wing.info = wingEquip;

        this.updateHideFashionBtnState();
    }
    /**
     * 保存装备按钮状态
     */
    private setSaveBtnState() {
        let b: boolean = false;
        for (let i = 0; i < this.fashionModel.fashionEquipList.length; i++) {
            const info: GoodsInfo = this.fashionModel.fashionEquipList[i];

            if (this.fashionModel.saveList[info.templateInfo.SonType] && this.fashionModel.saveList[info.templateInfo.SonType] != info.templateId) {
                b = true;
            }
        }

        if (b == false) {
            this.btn_save.tooltips = LangManager.Instance.GetTranslation("fashion.FashionSwitchView.saveBtn.tipData03");
        } else {
            this.btn_save.tooltips = "";
        }

        if ((this.fashionModel.saveList[GoodsSonType.FASHION_WEAPON] && this.fashionModel.bookList[this.fashionModel.saveList[GoodsSonType.FASHION_WEAPON]] == null)
            || (this.fashionModel.saveList[GoodsSonType.FASHION_CLOTHES] && this.fashionModel.bookList[this.fashionModel.saveList[GoodsSonType.FASHION_CLOTHES]] == null)
            || (this.fashionModel.saveList[GoodsSonType.FASHION_HEADDRESS] && this.fashionModel.bookList[this.fashionModel.saveList[GoodsSonType.FASHION_HEADDRESS]] == null)
            || (this.fashionModel.saveList[GoodsSonType.SONTYPE_WING] && this.fashionModel.bookList[this.fashionModel.saveList[GoodsSonType.SONTYPE_WING]] == null)) {
            b = false;
            this.btn_save.tooltips = LangManager.Instance.GetTranslation("fashion.FashionSwitchView.saveBtn.tipData02");
        }

        if ((this.fashionModel.saveList[GoodsSonType.FASHION_WEAPON] && !this.fashionModel.hasFashionAtSonType(GoodsSonType.FASHION_WEAPON))
            || (this.fashionModel.saveList[GoodsSonType.FASHION_CLOTHES] && !this.fashionModel.hasFashionAtSonType(GoodsSonType.FASHION_CLOTHES))
            || (this.fashionModel.saveList[GoodsSonType.FASHION_HEADDRESS] && !this.fashionModel.hasFashionAtSonType(GoodsSonType.FASHION_HEADDRESS))
            || (this.fashionModel.saveList[GoodsSonType.SONTYPE_WING] && !this.fashionModel.hasFashionAtSonType(GoodsSonType.SONTYPE_WING))) {
            b = false;
            this.btn_save.tooltips = LangManager.Instance.GetTranslation("fashion.FashionSwitchView.saveBtn.tipData01");
        }
        this._canSave = b;
        this.btn_save.grayed = !b;
        this.btn_save.enabled = b;
        Utils.strokeColor(this.btn_save, b);
    }

    private __saveHandler(e: Laya.Event) {
        if (!this._canSave) {
            MessageTipManager.Instance.show(this.btn_save.tooltips);
            return;
        }

        let fashionMsg = ArmyManager.Instance.fashionInfoMsg;

        if (this.fashionModel.saveList[GoodsSonType.FASHION_WEAPON]) {
            fashionMsg.armAvata = this.fashionModel.saveList[GoodsSonType.FASHION_WEAPON];
        }
        if (this.fashionModel.saveList[GoodsSonType.FASHION_CLOTHES]) {
            fashionMsg.clothAvata = this.fashionModel.saveList[GoodsSonType.FASHION_CLOTHES];
        }
        if (this.fashionModel.saveList[GoodsSonType.FASHION_HEADDRESS]) {
            fashionMsg.hatAvata = this.fashionModel.saveList[GoodsSonType.FASHION_HEADDRESS];
        }
        if (this.fashionModel.saveList[GoodsSonType.SONTYPE_WING]) {
            fashionMsg.wingAvata = this.fashionModel.saveList[GoodsSonType.SONTYPE_WING];
        }
        ArmyManager.Instance.sendFashionChange(fashionMsg);
        for (const key in this.fashionModel.saveList) {
            if (this.fashionModel.saveList.hasOwnProperty(key)) {
                this.fashionModel.saveList[key] = null;
                delete this.fashionModel.saveList[key];
            }
        }
        this.btn_save.grayed = true;
        this.btn_save.enabled = false;
        Utils.strokeColor(this.btn_save, false);
        this.btn_save.tooltips = LangManager.Instance.GetTranslation("fashion.FashionSwitchView.saveBtn.tipData03");
    }

    private __doubleClickBagItemHandler(info: GoodsInfo) {
        if (this.tab0.selectedIndex == 1) {
            this.tab0.selectedIndex = BAG_INDEX.ATTR;
            this.onSelectTab0(null);
            this.onSelectTab1(null);
        }
    }


    private openJewel() {
        this.tab0.selectedIndex = 0;
        this.tab1.selectedIndex = BAG_INDEX.JEWEL;
        this.onSelectTab1(null);
    }


    /**
     * 切换背包页签的事件处理
     * @param bagIndex 背包页签的索引
     */
    onSwitchFash(bagIndex: number) {
        //	当玩家选择“背包”——“时装”页时, 左侧玩家的展示形象区域由装备变更为当前装备的时装, 选择“非时装”页时, 复原成装备展示
        if (bagIndex == 1) {
            if (this.tab0.selectedIndex == 1) {//[背包]-【时装】隐藏“时装合成”“时装图鉴”按钮
                this.page.selectedIndex = 1;
                // this.btn_fashionCompose.visible = this.btn_fashionSwitch.visible = false;
            }
        } else {
            if (this.tab0.selectedIndex == 1) {
                this.page.selectedIndex = 0;
            } else if (this.tab0.selectedIndex == 2) {
                this.page.selectedIndex = 1;
            }
        }
    }
    /**
     * 在背包点击时装的吞噬按钮后, 需要快速跳转至时装吞噬功能中对应的时装类型分页.
     */
    private onSwallow(sontype: number) {
        if (this.tab0.selectedIndex == 1) {//	当玩家通过“背包”对背包内的时装进行“装备”或者“替换”操作时, 左侧分类列表将从“背包”自动跳转至“时装”, 并默认打开时装图鉴；
            this.tab0.selectedIndex = 2;
            this.onSelectTab0(null);
            this.fashion_com.onShow(0, sontype);
        }
    }

    private __heroPropertyHandler(e: NotificationEvent) {
        this.refreshHeroFigure();
    }

    private __wearHandler(book: boolean, info: t_s_itemtemplateData) {
        if (!info) {
            return;
        }

        // let _equipDic = ArmyManager.Instance.fashionList;
        let goodInfo = new GoodsInfo();
        switch (info.SonType) {
            case GoodsSonType.FASHION_CLOTHES:
                if (!this.checkbox_fashion.selected && !this.hide_1.selected) {//隐藏勾选则不显示
                    this._showThane.bodyFashionAvata = info.Avata;
                } else {
                    this._showThane.bodyFashionAvata = null;
                }
                goodInfo.templateId = info.TemplateId;
                this.clothesFashion.info = goodInfo;
                break;
            case GoodsSonType.FASHION_HEADDRESS:
                if (!this.checkbox_fashion.selected && !this.hide_0.selected) {//隐藏勾选则不显示
                    this._showThane.hairFashionAvata = info.Avata;
                } else {
                    this._showThane.hairFashionAvata = null;
                }
                goodInfo.templateId = info.TemplateId;
                this.headdressFashion.info = goodInfo;
                break;
            case GoodsSonType.FASHION_WEAPON:
                if (!this.checkbox_fashion.selected && !this.hide_2.selected) {//隐藏勾选则不显示
                    this._showThane.armsFashionAvata = info.Avata;
                } else {
                    this._showThane.armsFashionAvata = null;
                }
                goodInfo.templateId = info.TemplateId;
                this.weaponFashion.info = goodInfo;
                break;
            case GoodsSonType.SONTYPE_WING:
                if (!this.checkbox_fashion.selected && !this.hide_3.selected) {//隐藏勾选则不显示
                    this._showThane.wingAvata = info.Avata;
                } else {
                    this._showThane.wingAvata = null;
                }
                goodInfo.templateId = info.TemplateId;
                this.wing.info = goodInfo;
                break;
        }
        if (!this.checkbox_fashion.selected)//隐藏勾选则不显示
        {
            this._figure.data = this._showThane;
        }

        if (this.tab0.selectedIndex == 1) {//	当玩家通过“背包”对背包内的时装进行“装备”或者“替换”操作时, 左侧分类列表将从“背包”自动跳转至“时装”, 并默认打开时装图鉴；
            this.tab0.selectedIndex = 2;
        }

        let sonType: number = info.SonType;
        let temId: number = info.TemplateId;

        this.fashionModel.saveList[sonType] = book ? temId : 0;
        let hasBook = false;
        let saveList = this.fashionModel.saveList
        for (let fkey in this.fashionModel.saveList) {
            if (saveList[fkey] in this.fashionModel.bookList) {
                hasBook = true;
                break;
            }
        }
        //只有当玩家选中已激活的时装, 保存装扮才会亮起
        this._canSave = book;
        this.btn_save.enabled = book;
        Utils.strokeColor(this.btn_save, book);
    }

    /**
     * 合成成功后把新时装展示到左方形象上
     * */
    private __onComposeCallback(info: GoodsInfo) {
        if (!info) {
            return;
        }
        switch (info.templateInfo.SonType) {
            case GoodsSonType.FASHION_CLOTHES:
                this._showThane.bodyFashionAvata = info.templateInfo.Avata;
                break;
            case GoodsSonType.FASHION_HEADDRESS:
                this._showThane.hairFashionAvata = info.templateInfo.Avata;
                break;
            case GoodsSonType.FASHION_WEAPON:
                this._showThane.armsFashionAvata = info.templateInfo.Avata;
                break;
            case GoodsSonType.SONTYPE_WING:
                this._showThane.wingAvata = info.templateInfo.Avata;
                break;
        }
        this._figure.data = this._showThane;
    }

    protected __hideFashionHandler(type: number, event: Laya.Event) {
        this.thane.beginChanges();
        let fashionMsg = ArmyManager.Instance.fashionInfoMsg;
        switch (type) {
            case -1:
                // this.thane.hideFashion = this.checkbox_fashion.selected;
                // ArmySocketOutManager.sendHideFashion(this.checkbox_fashion.selected);

                fashionMsg.isHidenHatAvat = this.checkbox_fashion.selected;
                fashionMsg.isHidenClothAvata = this.checkbox_fashion.selected;
                fashionMsg.isHidenArmAvata = this.checkbox_fashion.selected;
                fashionMsg.isHidenWingAvata = this.checkbox_fashion.selected;
                break;
            case 0:
                fashionMsg.isHidenHatAvat = this.hide_0.selected;
                break;
            case 1:
                fashionMsg.isHidenClothAvata = this.hide_1.selected;
                break;
            case 2:
                fashionMsg.isHidenArmAvata = this.hide_2.selected;
                break;
            case 3:
                fashionMsg.isHidenWingAvata = this.hide_3.selected;
                break;
        }
        let statusStrs: string[] = fashionMsg.status.split(",");
        if (type == -1) {
            fashionMsg.status = this.checkbox_fashion.selected ? "0,0,0,0" : "1,1,1,1";
        }
        else {
            statusStrs[type] = this["hide_" + type].selected ? "0" : "1";
            fashionMsg.status = statusStrs.join();
        }
        ArmyManager.Instance.sendFashionChange(fashionMsg);
        // this.refreshHeroFigure();
        this.thane.commit();
    }

    private updateHideFashionBtnState() {
        let fashionMsg = ArmyManager.Instance.fashionInfoMsg;
        this.hide_0.selected = fashionMsg.status.split(",")[0] == "0";
        this.hide_1.selected = fashionMsg.status.split(",")[1] == "0";
        this.hide_2.selected = fashionMsg.status.split(",")[2] == "0";
        this.hide_3.selected = fashionMsg.status.split(",")[3] == "0";
        this.checkbox_fashion.selected = this.hide_0.selected && this.hide_1.selected && this.hide_2.selected && this.hide_3.selected;
    }

    /**
     * 领主信息更新（同步到左方展示面板）
     * */
    private __heroInfoChangeHandler(e: PlayerEvent) {
        this.updateFight();
    }

    private changeView(cc: fgui.Controller) {
        if (cc.selectedIndex == 0) {
            this.fashionModel.selectedPanel = FashionModel.EQUIP_PANEL;
        }
        else if (cc.selectedIndex == 1) {
            if (FashionManager.Instance.fashionIdentityProgress <= 1) {
                SharedManager.Instance.fashionIdentityProgress = 2;
            }
            this.fashionModel.selectedPanel = FashionModel.FASHION_PANEL;
        }

        if (!this.changeBagWnd) {
            this.changeBagWnd = true;
            return;
        }
        // let bagCtrl: BagCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.BagWnd) as BagCtrl;
        // let wnd: BagWnd = bagCtrl.view as BagWnd;
        // if (wnd && wnd.isShowing) {
        //     if (cc.selectedIndex == 1) {
        //         wnd.list_tab.selectedIndex = 1;
        //     }
        //     else {
        //         wnd.list_tab.selectedIndex = 0;
        //     }
        //     wnd.onTabClick(null, null);
        //     Logger.yyz("🏀触发背包面板切页！");
        // }
    }

    protected __panelHandler() {
        if (this.fashionModel.selectedPanel == FashionModel.EQUIP_PANEL) {
            this.page.selectedIndex = 0;
        }
        else if (this.fashionModel.selectedPanel == FashionModel.FASHION_PANEL) {
            this.page.selectedIndex = 1;
        }
    }

    private __appellSwitchChange(e: NotificationEvent) {
        // if (!ConfigManager.info.APPELL) {
        // this.btn_title.visible = ConfigManager.info.APPELL;
        // if (this.btn_title.visible) {
        //     this.soulCom.y = 317;
        // }
        // }
    }

    private __switchHandler() {
        // this.btn_fashionCompose.enabled = ConfigManager.info.FASHION_STORE;
        // this.btn_fashionSwitch.enabled = ConfigManager.info.FASHION_STORE;
    }

    onRenderTab1(index: number, item: FUI_TabBrown3) {
        if (item) {
            item.title = this.tab1Data[index];
            // let area = this.taskTypeArr[index];
            // item.getChild('redDot').visible = this.ctrlData.canReceivePassTaskByArea(area);
            //龙纹
            if (item.title == LangManager.Instance.GetTranslation('tattoo.frame.titleText')) {
                let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
                if (item.redDot) {
                    item.redDot.visible = ctrl.tattooModel.canTattoo();
                }
            }
        }
    }

    private vipHander() {
        SwitchPageHelp.gotoShopFrame(7)
    }


    private onPageChanged(selectedIndex: number = 0) {
        this.fashionModel.moveGoodsBack();
        this.fashionModel.to_pos = 0;
        this.refreshHeroFigure();

        if (selectedIndex == 0) {
            this.fashionModel.selectedPanel = FashionModel.FASHION_COMPOSE_PANEL;
            this.detailBtn.visible = false;
        }
        else {
            this.fashionModel.selectedPanel = FashionModel.FASHION_SWITCH_PANEL;
            this.detailBtn.visible = true;
        }
    }

    private onBtnFashionClick(type: number = 0) {
        // this.page.selectedIndex = 1;
        this.btn_save.grayed = true;
        this.btn_save.enabled = false;
        Utils.strokeColor(this.btn_save, false);
        this.__panelHandler();
        if (ArmyManager.Instance.thane.grades < 10) {
            let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", 10);
            MessageTipManager.Instance.show(str);
            this.tab0.selectedIndex = this._lastSelectIndex0;
            return;
        }
        GoodsManager.Instance.filterFlag = false;
        GoodsManager.Instance.filterGoodsInGeneralAndConsortiaBag();
        this.fashion_com.onShow(type,this.detailBtn);

        this.onPageChanged(type);
        FashionManager.Instance.isopenFashion = true;

        if (!this._showThane) {
            this._showThane = new ThaneInfo();
            this._showThane.templateId = this.thane.templateId;
            this._showThane.armsEquipAvata = this.thane.armsEquipAvata;
            this._showThane.bodyEquipAvata = this.thane.bodyEquipAvata;
            this._showThane.wingAvata = this.thane.wingEquipAvata;
            this._showThane.armsFashionAvata = this.thane.armsFashionAvata;
            this._showThane.bodyFashionAvata = this.thane.bodyFashionAvata;
            this._showThane.hairFashionAvata = this.thane.hairFashionAvata;
        }
    }

    /**
    * 打开专精
    * @param type
    */
    private onClickMastery(type: number = 0) {
        //等级判断
        if (this.thane.grades < OpenGrades.MASTERY) {
            let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.MASTERY);
            MessageTipManager.Instance.show(str);
            this.tab0.selectedIndex = this._lastSelectIndex0;
            return;
        }

        // FrameCtrlManager.Instance.open(EmWindow.Appell);
        this.role_group.visible = this._figure.visible = false;
        this.pageCtrl.selectedIndex = 10;
        this.mastery_com.initView();
        // let appellId = 0
        // if (this.frameData && this.frameData.appellID) {
        //     appellId = this.frameData.appellID;
        // }
        // this.appell_com.onShow(appellId);
    }

    /**
    * 打开称号
    * @param type
    */
    private onBtnTitleClick(type: number = 0) {
        //等级判断
        if (this.thane.grades < 30) {
            let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", 30);
            MessageTipManager.Instance.show(str);
            this.tab0.selectedIndex = this._lastSelectIndex0;
            return;
        }
        // FrameCtrlManager.Instance.open(EmWindow.Appell);
        this.role_group.visible = this._figure.visible = false;
        this.pageCtrl.selectedIndex = 5;
        let appellId = 0
        if (this.frameData && this.frameData.appellID) {
            appellId = this.frameData.appellID;
        }
        this.appell_com.onShow(appellId);
    }

    /**
     * 命运守护
     * @param type
     */
    private onFortune() {
        if (this.thane.grades >= OpenGrades.FORTUNE_GUARD) {
            this.pageCtrl.selectedIndex = 3;
            this.account.switchIcon(3);
            this.fortune_com.onShow();
            this._curSelectIndex1 = BAG_INDEX.FORTUNE;

            if (!this.role_group.visible) {
                this.role_group.visible = this._figure.visible = true
            }
        } else {
            let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", OpenGrades.FORTUNE_GUARD);
            MessageTipManager.Instance.show(str);
            this.tab1.selectedIndex = this._curSelectIndex1;
        }
    }

    /**
     * 龙纹
     * @param type
     */
    private onTattoo() {
        if (this.thane.grades >= this.tattooopenlevel) {
            this.pageCtrl.selectedIndex = 8;
            this.account.switchIcon(3);
            this.tattoo_com.initView();
            let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;
            ctrl.sendReqTattooInfo();
            this._curSelectIndex1 = this.tab1.selectedIndex;

            if (!this.role_group.visible) {
                this.role_group.visible = this._figure.visible = true
            }
            HomeWnd.Instance.getMainToolBar().updateBagRedPoint();
            this.updateRedPoint();
            this.checkRoleRedDot();

            NewbieModule.Instance.manualTrigger(NewbieConfig.NEWBIE_350)
        } else {
            let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", this.tattooopenlevel);
            MessageTipManager.Instance.show(str);
            this.tab1.selectedIndex = this._curSelectIndex1;
        }
    }

    /**
     * 荣誉
     * @param type
     */
    private onHonor() {
        // if (this.thane.grades >= this.honoropenlevel) {
            this.pageCtrl.selectedIndex = 9;
            this.account.switchIcon(3);
            this.honor_com.onShow();
            this._curSelectIndex1 = this.tab1.selectedIndex;

            if (!this.role_group.visible) {
                this.role_group.visible = this._figure.visible = true
            }
        // } 
        // else {
        //     let str: string = LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command02", this.honoropenlevel);
        //     MessageTipManager.Instance.show(str);
        //     this.tab1.selectedIndex = this._curSelectIndex1;
        // }
    }

    /**
     * 发送装备改变信息
     */
    public sendEquipChange() {
        var heroId: number = this.equipChange();
        if (heroId != 0)//让服务器通知房间里的其他玩家自己的装备改变
        {
            // 玩家还未进入过天空之城
            if (PlayerManager.Instance.currentPlayerModel.spaceMapId == 0) {
                return;
            }
            ArmySocketOutManager.sendChangeHeroInfo(heroId);
            this.thane.beginChanges();
            this.thane.commit();
        }
    }

    /**
     * 返回装备改变的英雄id
     */
    private equipChange(): number {
        if (!this.model || !this.model.uArmy) return 0;
        var heroId: number = this.model.uArmy.baseHero.id;
        var newEquip: SimpleDictionary = GoodsManager.Instance.getHeroEquipListById(heroId);
        var oldEquip: SimpleDictionary = this.model.oldEquip;
        if (!oldEquip || (newEquip.getList().length != oldEquip.getList().length)) return heroId;
        for (let index = 0; index < newEquip.getList().length; index++) {
            const info = newEquip.getList()[index];
            if (newEquip[info.id] != info) return heroId;
        }
        return 0;
    }

    public getBaseBagItemByPos(pos: number): PlayerBagCell {
        return this.bag_com.getBaseBagItemByPos(pos);
    }

    public getBaseBagItemByType(sontype: number = GoodsSonType.SONTYPE_WEAPON): PlayerBagCell {
        return this.bag_com.getBaseBagItemByType(sontype);
    }

    public OnHideWind() {
        this.removeEvent();
        PlayerManager.Instance.currentPlayerModel.sRoleBagIsOpen = false;
        if (this.property_com) {
            this.property_com.onHide();
        }
        if (this.jewel_com) {
            this.jewel_com.onHide();
        }
        if (this.fortune_com) {
            this.fortune_com.onHide();
        }

        if (this.fashion_com) {
            this.fashion_com.onHide();
        }
        if (this.appell_com) {
            this.appell_com.onHide();
        }
        if (this.bag_com) {
            this.bag_com.onHide();
        }
        if (this.honor_com) {
            this.honor_com.onHide();
        }
        if (this.mastery_com) {
            this.mastery_com.onHide();
        }
        FashionManager.Instance.isopenFashion = false;
        this.btn_save.enabled = true;
        this.sendEquipChange();
        // UIManager.Instance.HideWind(EmWindow.RolePropertyWnd);
        // UIManager.Instance.HideWind(EmWindow.RoleDetailsWnd);
        // FrameCtrlManager.Instance.exit(EmWindow.BagWnd);
        super.OnHideWind();
    }

    // private decetiveEquip() {
    //     // SharedManager.Instance.betterEquipFlag = false;
    //     // SharedManager.Instance.saveBetterEquipFlag();
    //     NotificationManager.Instance.dispatchEvent(BagEvent.NEW_EQUIP, false);
    // }

    private get fashionModel(): FashionModel {
        return FashionManager.Instance.fashionModel;
    }

    dispose(dispose?: boolean) {
        ObjectUtils.disposeObject(this._figure);
        this._figure = null;
        this._equipViewList = null;
        this._fashionViewList = null;
        this._honerViewList = null;
        this._equipList = null;
        this._fashionList = null;
        this._simpleInfo = null;
        this.changeBagWnd = true;
        super.dispose(dispose);
    }


    private updateRedPoint() {
        this.tab1.numItems = this.tab1Data.length;
    }

    private updateMasteryRedPoint() {  
        let btn = this.tab0.getChildAt(4).asButton;
        if(btn.visible){
            btn.getChild('redDot').visible = ExtraJobModel.instance.MasteryRedDot();
        }
    }

    private updateFashionRedPoint() {
        let fashionbtn = this.tab0.getChildAt(2).asButton;
        let showRed = this.fashionModel.checkRedDot();
        fashionbtn.getChild('redDot').visible = showRed
        this.fashion_com.updateRedDot(showRed);
        this.updateDetailTips();
    }

    private checkHonorRedDot():boolean {
        let idx = this.tagArr.indexOf('RvrBattleResultWnd.roleHonorTxt')
        if(idx >0){
            let honorTag = this.tab1.getChildAt(idx).asButton;
            let showHonor = BagHelper.Instance.checkHonorUpLevel(this.thane.honorEquipLevel) || BagHelper.Instance.checkHonorUpStage(this.thane.honorEquipStage);
            honorTag.getChild('redDot').visible = showHonor;
            return showHonor;
        }
        return false;
    }

    private checkJewelRedDot():boolean {
        let idx = this.tagArr.indexOf('armyII.viewII.equip.JewelFrame.JewelNameTxt')
        if(idx >0){
            let bool = BagHelper.Instance.checkJewelRedDot();
            this.tab1.getChildAt(idx).asButton.getChild('redDot').visible = bool;
            return bool;
        }
        return false;
    }

    private checkFortuneRedDot():boolean {
        let idx = this.tagArr.indexOf('HigherGradeOpenTipView.content25')
        if(idx >0){
            let bool = BagHelper.Instance.checkFortuneRedDot();
            this.tab1.getChildAt(idx).asButton.getChild('redDot').visible = bool;
            return bool;
        }
        return false;
    }

    private checkTatooRedDot():boolean{
        return this.ctrl.tattooModel.canTattoo() && !this.ctrl.tattooModel.isClicked;
    }
    /**
     * 角色关联了多页签红点
     */
    private checkRoleRedDot():boolean{
        let roleBtn = this.tab0.getChildAt(0).asButton;
        let showRoleRedDot = this.checkJewelRedDot() || this.checkHonorRedDot() || this.checkFortuneRedDot()||this.checkTatooRedDot();
        roleBtn.getChild('redDot').visible = showRoleRedDot;
        return showRoleRedDot;
    }

    private updateDetailTips() {
        let allProperty = this.fashionModel.getIdentityedProperties();
        let propertyStr = "[color=#FFC68F]" + LangManager.Instance.GetTranslation("fashion.identify.attr") + "[/color]";
        let haved = false;
        let attrArr = [LangManager.Instance.GetTranslation('PetPotencyWnd.powerTxt'),
        LangManager.Instance.GetTranslation('PetPotencyWnd.protectTxt'),
        LangManager.Instance.GetTranslation('PetPotencyWnd.illTxt'),
        LangManager.Instance.GetTranslation('PetPotencyWnd.vitTxt')];
        for (let i = 0; i < allProperty.length; i++) {
            const val = allProperty[i];
            propertyStr += "\n";
            propertyStr +=  `[color=#FFC68F]${attrArr[i]}[/color]${val}`;
            if(val>0){
                haved = true;
            }
        }
        if (!haved) {
            propertyStr ="[color=#FFC68F]" + LangManager.Instance.GetTranslation("RuneHold.notBonus")+"[/color]";
        }

        FUIHelper.setTipData(
            this.detailBtn,
            EmWindow.CommonTips,
            propertyStr,
            new Laya.Point(-60, -85)
        )

    }

}

export enum BAG_INDEX {
    ATTR = 0,
    JEWEL = 1,
    FORTUNE = 2,
    // BATTLE_GUARD = 3,
    TATTOO = 3,
    HONOR = 4,
}