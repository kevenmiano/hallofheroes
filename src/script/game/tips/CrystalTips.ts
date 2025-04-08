// @ts-nocheck
import ConfigMgr from "../../core/config/ConfigMgr";
import LangManager from "../../core/lang/LangManager";
import UIManager from '../../core/ui/UIManager';
import { DateFormatter } from "../../core/utils/DateFormatter";
import { BaseItem } from "../component/item/BaseItem";
import SimpleAlertHelper from "../component/SimpleAlertHelper";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { ConfigType } from "../constant/ConfigDefine";
import { NotificationEvent } from "../constant/event/NotificationEvent";
import GoodsSonType from "../constant/GoodsSonType";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { MopupManager } from "../manager/MopupManager";
import { MountsManager } from "../manager/MountsManager";
import { NotificationManager } from "../manager/NotificationManager";
import OfferRewardManager from "../manager/OfferRewardManager";
import { PlayerBufferManager } from "../manager/PlayerBufferManager";
import { PlayerManager } from "../manager/PlayerManager";
import { ResourceManager } from "../manager/ResourceManager";
import { SocketSendManager } from "../manager/SocketSendManager";
import TreasureMapManager from "../manager/TreasureMapManager";
import { RoleModel } from "../module/bag/model/RoleModel";
import { BagHelper } from "../module/bag/utils/BagHelper";
import { PetData } from "../module/pet/data/PetData";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { OfferRewardModel } from "../mvc/model/OfferRewardModel";
import { GoodsCheck } from "../utils/GoodsCheck";
import BaseTips from "./BaseTips";

/**
 * @description 战斗守护水晶Tips
 * @author yuanzhan.yu
 * @date 2021/5/13 15:56
 * @ver 1.0
 */
export class CrystalTips extends BaseTips {
    public bg: fgui.GLoader;
    public item: BaseItem;
    public txt_name: fgui.GTextField;
    public txt_useLevel: fgui.GTextField;
    public txt_type: fgui.GTextField;
    public txt_bind: fgui.GTextField;
    public subBox1: fgui.GGroup;
    public txt_desc: fgui.GTextField;
    public txt_price: fgui.GTextField;
    public group_price: fgui.GGroup;
    public txt_time: fgui.GTextField;
    public btn_use: fgui.GButton;
    public subBox2: fgui.GGroup;
    public totalBox: fgui.GGroup;

    private _info: GoodsInfo;
    private _canOperate: boolean;
    private _extraData: any;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.addEvent()

        this.updateView();
        //note 调用ensureBoundsCorrect立即重排
        this.totalBox.ensureBoundsCorrect();
    }

    private initData() {
        [this._info, this._canOperate, this._extraData] = this.params;
    }

    private initView() {
        this.subBox2.visible = true;
    }

    private addEvent() {
        this.btn_use.onClick(this, this.onBtnUseClick.bind(this));
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private updateView() {
        if (this._info) {
            let equipOnStr = LangManager.Instance.GetTranslation("Forge.TabTitle.Inlay");//镶嵌
            let equipOffStr = LangManager.Instance.GetTranslation("public.unEquip");
            this.item.info = this._info;
            this.item.text = "";
            this.txt_name.text = this._info.templateInfo.TemplateNameLang;
            this.txt_name.color = GoodsSonType.getColorByProfile(this._info.templateInfo.Profile);
            this.txt_type.text = this.getGoodsTypeName(this._info.templateInfo);
            // if (this._info.isBinds) {
            //     this.txt_bind.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind1");
            //     this.txt_bind.color = "#ee1a38";
            // }
            // else {
            //     this.txt_bind.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind2");
            //     this.txt_bind.color = "#8eea17";
            // }
            this.txt_desc.text = this._info.templateInfo.DescriptionLang;
            this.group_price.visible = this._info.templateInfo.SellGold > 0;
            let str: string = "" + this._info.templateInfo.SellGold * (1 + this._info.strengthenGrade * 2);
            this.txt_price.text = this._info.templateInfo.SellGold == 0 ? "" : str;

            if (this._info.templateInfo.NeedGrades > 1) {
                this.txt_useLevel.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.grade", this._info.templateInfo.NeedGrades);
                if (!GoodsCheck.isGradeFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
                    this.txt_useLevel.color = "#FF0000";
                }
            } else {
                this.txt_useLevel.text = "";
            }

            // if (this._info.id != 0) {
            //     this.txt_bind.visible = true;
            // } else {
            //     this.txt_bind.visible = false;
            // }
            this.txt_bind.visible = false;
            if (this._info.validDate > 0)//加上时效性
            {
                this.txt_time.visible = true;
            } else {
                this.txt_time.visible = false;
            }

            let timeStr: string;
            if (this._info.leftTime == -1) {
                timeStr = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.timeStr01");
            } else if (this._info.leftTime < 0) {
                timeStr = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.timeStr02");
            } else {
                timeStr = DateFormatter.getFullDateString(this._info.leftTime);
            }
            this.txt_time.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.time.text") + ":" + timeStr;
            let isUsed = this._info.isUsed;
            if (this.isOpenBattleGuardWnd && BagHelper.checkCanUseGoods(this._info.templateInfo.SonType) && !this.isOtherPlayer) {
                this.btn_use.title = isUsed ? equipOffStr : equipOnStr;
                this.btn_use.visible = true;
            } else {
                this.btn_use.visible = false;
            }
            if (BagHelper.isOpenConsortiaStorageWnd()) {
                this.btn_use.title = BagHelper.getText(this._info);
                this.btn_use.visible = true;
            }
        }
    }

    private confirmRemoveGem(type: number, pos: number, socketPos: number) {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("wanttoremove");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [type, pos, socketPos], prompt, content, confirm, cancel, this.confirmRemoveGemBack.bind(this));
    }

    private confirmRemoveGemBack(b: boolean, flag: boolean, data: any[]) {
        if (b) {
            let type: number = data[0], pos: number = data[1], socketPos: number = data[2];
            PlayerManager.Instance.sendRemoveBattleGem(type, pos, socketPos);
        }
    }

    private get isOpenBattleGuardWnd(): boolean {
        return UIManager.Instance.isShowing(EmWindow.SRoleWnd)
    }

    private get isOtherPlayer(): boolean {
        // let wnd:SRoleWnd = UIManager.Instance.FindWind(EmWindow.SRoleWnd);
        // if(wnd && wnd.isShowing && wnd.isOpenBattleGuard()&& wnd.openFromPlayerInfo()){
        //     return true;
        // }
        return false;
    }

    /**守护水晶是否镶嵌 */
    private get isEquiped(): boolean {
        // 如果是镶嵌
        let thane = ArmyManager.Instance.thane;
        let battleGuardInfo = thane.selectGuardSocketInfo;
        if (battleGuardInfo) {
            return battleGuardInfo.existGoods(this._info.templateId);
        }
        return false;
    }

    private getGoodsTypeName(temp: t_s_itemtemplateData): string {
        switch (temp.SonType) {
            case GoodsSonType.SONTYPE_TASK:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.SONTYPE_TASK");
            case GoodsSonType.SONTYPE_COMPOSE_MATERIAL:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.COMPOSE_MATERIAL");
        }
        return "";
    }

    private showBatchUseBtn(): boolean {
        let b: boolean = this._info.templateInfo.IsCanBatch == 1;
        if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BOX) {
            let num: number;
            switch (this._info.templateInfo.Property2) {
                case -800:
                    num = Math.floor(ArmyManager.Instance.thane.gloryPoint / this._info.templateInfo.Property3);
                    break;
                case -700:
                    num = Math.floor(ResourceManager.Instance.gold.count / this._info.templateInfo.Property3);
                    break;
                case -600:
                    num = Math.floor(ResourceManager.Instance.waterCrystal.count / this._info.templateInfo.Property3);
                    break;
                case -500:
                    num = Math.floor(this.playerInfo.giftToken / this._info.templateInfo.Property3);
                    break;
                case -400:
                    num = Math.floor(this.playerInfo.point / this._info.templateInfo.Property3);
                    break;
                case -300:
                    num = Math.floor(ResourceManager.Instance.gold.count / this._info.templateInfo.Property3);
                    break;
                case -200:
                    num = Math.floor(this.playerInfo.mineral / this._info.templateInfo.Property3);
                    break;
                case -100:
                    num = Math.floor(ResourceManager.Instance.gold.count / this._info.templateInfo.Property3)
                    break;
                default:
                    num = Math.floor(GoodsManager.Instance.getGoodsNumByTempId(this._info.templateInfo.Property2) / this._info.templateInfo.Property3);
                    break;

            }
            let num2: number = Math.min(num, this._info.count);
            if (num2 > 1) {
                b = true;
            }
        }
        return b;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private onBtnUseClick() {
        if (BagHelper.isOpenConsortiaStorageWnd()) {
            BagHelper.consortiaStorageOperate(this._info);
            this.hide();
        }
        else {
            this.onBtnUseClick2();
        }
    }

    private onBtnUseClick2() {
        if (this._info) {
            let str: string = "";
            if (this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX && !GoodsCheck.isGradeFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
                let str: string = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command01");
                MessageTipManager.Instance.show(str);
                this.hide();
                return
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BLOOD) {
                SocketSendManager.Instance.sendUseItem(this._info.pos);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_TREASURE_MAP) {
                // SimpleAlertHelper.Instance.Show(undefined, null, "", "功能开发中。。。");
                TreasureMapManager.Instance.useTreasureMap(this._info);

                FrameCtrlManager.Instance.exit(EmWindow.BagWnd);
                FrameCtrlManager.Instance.exit(EmWindow.RoleWnd);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_NOVICE_BOX) {//等级宝箱
                SocketSendManager.Instance.sendUseItem(this._info.pos);
                // FrameControllerManager.Instance.openControllerByInfo(UIModuleTypes.NOVICE_GRADE_BOX,null,this._info);
                return;
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_BOX) { //消耗道具使用宝箱
                switch (this._info.templateInfo.Property2) {
                    case -800: //荣耀水晶
                        if (ArmyManager.Instance.thane.gloryPoint < this._info.templateInfo.Property3) {
                            //荣耀水晶不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -700: //经验
                        if (ResourceManager.Instance.gold.count < this._info.templateInfo.Property3) {
                            //经验不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -600: //光晶
                        if (ResourceManager.Instance.waterCrystal.count < this._info.templateInfo.Property3) {
                            //光晶不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -500: //绑定钻石
                        if (this.playerInfo.giftToken < this._info.templateInfo.Property3) {
                            //绑定钻石不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -400: //钻石
                        if (this.playerInfo.point < this._info.templateInfo.Property3) {
                            //钻石不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -300: //战魂
                        if (ResourceManager.Instance.gold.count < this._info.templateInfo.Property3) {
                            //战魂不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -200: //紫晶
                        if (this.playerInfo.mineral < this._info.templateInfo.Property3) {
                            //紫晶不足
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    case -100: //黄金
                        if (ResourceManager.Instance.gold.count < this._info.templateInfo.Property3) {
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08");
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                    default:
                        if (GoodsManager.Instance.getGoodsNumByTempId(this._info.templateInfo.Property2) < this._info.templateInfo.Property3) {
                            str = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command08"); //开启宝箱需要消耗的物品不足, 不能开启
                            MessageTipManager.Instance.show(str);
                        }
                        else {
                            this.checkForUseBox(this._info, 1);
                        }
                        break;
                }
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_VIP_BOX) {
                if (MopupManager.Instance.model.isMopup) {
                    str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                    MessageTipManager.Instance.show(str);
                    return;
                }
                // MaskUtils.Instance.maskShow(0);
                SocketSendManager.Instance.sendUseVipMoney();
                this.hide();
                return;
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_ROSE) {
                //todo 送花界面,  和好友里的送花界面略有不同,  可以送多种花
                // UIManager.Instance.ShowWind(EmWindow.SendFlowersWnd, "")
                FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
                this.hide();
                return;
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_RENAME_CARD) {
                //todo 改名界面,  略有不同,  可能
                UIManager.Instance.ShowWind(EmWindow.RenameWnd, RoleModel.TYPE_RENAME_CARD);
                this.hide();
                return;
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_MOUNT_CARD) {
                MountsManager.Instance.sendUseGoods(this._info);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_SEX_CHANGE_CARD) {//使用变性卡
                SocketSendManager.Instance.sendUseSexChangeCard(this._info.pos);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL) {
                SimpleAlertHelper.Instance.Show(undefined, null, "", "功能开发中。。。");
                // FrameControllerManager.Instance.armyController.startFrameByType(ArmyPanelEnum.SKILL_PANEL, 1);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_EXP_BOOK) {
                this.checkForUsePetExpBook(this._info);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_LAND_TRANSFER) {
                SimpleAlertHelper.Instance.Show(undefined, null, "", "功能开发中。。。");
                // checkForUsePetLandTransfer(this._info);
            } else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_SINGLE_PASS_BUGLE) {
                UIManager.Instance.ShowWind(EmWindow.SinglePassBugleWnd);
            } else if (this._info.templateInfo.SonType == GoodsSonType.RESIST_GEM) {//守护水晶
                //已装备
                let isUsed = this._info.isUsed;
                if (!isUsed && this.isEquiped) {
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("PlayerManager.sendAddBattleGemTip01"));
                    return;
                }
                if (isUsed) {//已装备
                    let extData = this._extraData;
                    if (extData) {
                        let tempArr: any[] = extData.split("_");
                        let type: number = Number(tempArr[1]);
                        let battleguradPos: number = Number(tempArr[2]);
                        let socketPos: number = Number(tempArr[3]);
                        this.confirmRemoveGem(type, battleguradPos, socketPos);
                    }
                } else {//当前已经打开守护获取第一个空格子
                    NotificationManager.Instance.sendNotification(NotificationEvent.DOUBLE_CLICK, this._info);
                }
            } else if (this.check()) {
                let itemBuffer: PlayerBufferInfo = PlayerBufferManager.Instance.getItemBufferInfo(this._info.templateInfo.Property1);
                if (itemBuffer) {
                    if (this._info.templateInfo.Property3 < itemBuffer.grade) {
                        str = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command02");
                        MessageTipManager.Instance.show(str);
                        this.hide();
                        return;
                    }
                    SocketSendManager.Instance.sendUseItem(this._info.pos);
                } else {
                    if (this._info.templateInfo.Property1 == 5 && this._info.templateInfo.Property2 > 0) {
                        let wearyGet: number = this._info.templateInfo.Property2;
                        let pos: number = this._info.pos;
                        let itemCount: number = 1;
                        if (!this.checkWearyCanGet(wearyGet, pos, itemCount)) {
                            this.hide();
                            return;
                        } else {
                            if (!this.checkWearyTodayCanGet(wearyGet, pos, itemCount)) {
                                this.hide();
                                return;
                            }
                        }
                    }
                    SocketSendManager.Instance.sendUseItem(this._info.pos);
                }
            }
        }
        this.hide();
    }

    private checkForUseBox(item: GoodsInfo, num: number) {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let itemconfig: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_itemtemplate, item.templateInfo.Property2);
        let costName: string = itemconfig.TemplateNameLang;
        let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command09", 1, item.templateInfo.TemplateNameLang, 1 * item.templateInfo.Property3, costName);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [item, num], prompt, content, confirm, cancel, this.useBoxCallBack.bind(this));
    }

    private useBoxCallBack(b: boolean, flag: boolean, data: any[]) {
        if (b) {
            let item: GoodsInfo = data[0];
            let num: number = data[1];
            SocketSendManager.Instance.sendUseItem(item.pos, num);
        }
    }

    /** 使用英灵经验书时 弹出确认框 */
    private checkForUsePetExpBook(item: GoodsInfo): void {
        let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        let content: string = LangManager.Instance.GetTranslation("checkForUsePetExpBook.content02", item.templateInfo.Property2);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [item], prompt, content, confirm, cancel, this.checkForUsePetExpBookBack.bind(this));
    }

    private checkForUsePetExpBookBack(result: boolean, flag: boolean, data: any[]): void {
        if (!result) {
            return;
        }
        let item: GoodsInfo = data[0];
        if (!item) {
            return;
        }
        let curPet: PetData = this.playerInfo.enterWarPet;
        let msg: string;
        if (!curPet) {
            msg = LangManager.Instance.GetTranslation("this.checkForUsePetExpBook.content01");
            MessageTipManager.Instance.show(msg);
            return;
        }
        if (curPet.isFullExp()) {
            msg = LangManager.Instance.GetTranslation("PetSwallowView.fullExp");
            MessageTipManager.Instance.show(msg);
            return;
        }
        SocketSendManager.Instance.sendUseItem(item.pos);
    }

    private check(): boolean {
        let str: string = "";
        if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_CONSORTIATIME_CARD && ((PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond - this.playerInfo.lastOutConsortia) >= 24 * 3600 || !this.playerInfo.isAuto))//盟约之证
        {
            str = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command07");
            MessageTipManager.Instance.show(str);
            return false;
        }
        if (this._info.templateInfo.Property1 == 8 && this.playerInfo.consortiaID == 0) {
            str = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command03");
            MessageTipManager.Instance.show(str);
            this.hide();
            return false;
        }
        if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_COMPOSE && this.playerInfo.composeList.indexOf(this._info.templateInfo.Property1) >= 0) {
            str = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command04");
            MessageTipManager.Instance.show(str);
            return false;
        }
        if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_REWARD_CARD) {
            if (MopupManager.Instance.model.isMopup) {
                str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData01");
                MessageTipManager.Instance.show(str);
                return false;
            }
            if (this.rewardModel.baseRewardDic.getList().length >= 1) {
                str = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command05");
                MessageTipManager.Instance.show(str);
                return false;
            }
            if (this.rewardModel.remainRewardCount <= 0) {
                str = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command06");
                MessageTipManager.Instance.show(str);
                return false;
            }
        }
        if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PET_CARD) {
            //英灵达上限
            let petNum: number = this.playerInfo.petList.length;
            if (petNum >= this.playerInfo.petMaxCount) {
                str = LangManager.Instance.GetTranslation("usePetCard.MaxNumber");
                MessageTipManager.Instance.show(str);
                return false;
            }
        }
        return true;
    }

    private checkWearyCanGet(wearyGet: number, pos: number, count: number = 1): boolean {
        // let wearyCanGet: number = PlayerInfo.WEARY_MAX - this.playerInfo.weary;
        // if (wearyGet > wearyCanGet) {
        //     let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        //     let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        //     let prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
        //     let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command07", PlayerInfo.WEARY_MAX, wearyCanGet);
        //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [wearyGet, pos, count], prompt, content, confirm, cancel, this.wearyCanGetCallBack.bind(this));
        //     return false;
        // }
        return true;
    }

    private checkWearyTodayCanGet(wearyGet: number, pos: number, count: number = 1): boolean {
        let wearyTodayCanGet: number = PlayerInfo.WEARY_GET_MAX - this.playerInfo.wearyLimit;
        if (wearyGet > wearyTodayCanGet) {
            let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
            let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
            let prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
            let content: string = LangManager.Instance.GetTranslation("cell.mediator.playerbag.PlayerBagCellClickMediator.command06", PlayerInfo.WEARY_GET_MAX, wearyTodayCanGet);
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, [wearyGet, pos, count, true], prompt, content, confirm, cancel, this.wearyTodayCanGetCallBack.bind(this));
            return false;
        }
        return true;
    }

    private wearyCanGetCallBack(b: boolean, flag: boolean, data: any[]) {
        if (b) {
            let wearyGet: number = data[0], pos: number = data[1], count: number = data[2];
            if (this.checkWearyTodayCanGet(wearyGet, pos, count)) {
                SocketSendManager.Instance.sendUseItem(pos, count);
            }
        }
    }

    private wearyTodayCanGetCallBack(b: boolean, flag: boolean, data: any[]) {
        if (b) {
            let wearyGet: number = data[0], pos: number = data[1], count: number = data[2], today: boolean = data[3];
            SocketSendManager.Instance.sendUseItem(pos, count);
        }
    }

    private get rewardModel(): OfferRewardModel {
        return OfferRewardManager.Instance.model;
    }

    private removeEvent() {
        this.btn_use.offClick(this, this.onBtnUseClick.bind(this));
    }

    protected OnClickModal() {
        this.hide();
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}