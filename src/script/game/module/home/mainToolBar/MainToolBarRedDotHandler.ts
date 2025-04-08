// @ts-nocheck
import UIButton from "../../../../core/ui/UIButton";
import { EmWindow } from "../../../constant/UIDefine";
import { BagEvent, FriendUpdateEvent, VIPEvent, RuneEvent, FashionEvent, MountsEvent, EmailEvent, ShopEvent, NotificationEvent, ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import EmailManager from "../../../manager/EmailManager";
import { FashionManager } from "../../../manager/FashionManager";
import { FriendManager } from "../../../manager/FriendManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MountsManager } from "../../../manager/MountsManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { VIPManager } from "../../../manager/VIPManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { RoleCtrl } from "../../bag/control/RoleCtrl";
import ExtraJobModel from "../../bag/model/ExtraJobModel";
import { BagHelper } from "../../bag/utils/BagHelper";
import { ConsortiaModel } from "../../consortia/model/ConsortiaModel";
import { DiscountShopManager } from "../../shop/control/DiscountShopManager";
import MainToolBar from "../MainToolBar";
import { BatchGoodsRedDotHandler } from "./BatchGoodsRedDotHandler";
import { EmMainToolBarBtnLocationType } from "./EmMainToolBarBtnLocationType";
import { EmMainToolBarBtnType } from "./EmMainToolBarBtnType";

/*
 * @Author: jeremy.xu
 * @Date: 2023-12-08 17:53:06
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-08 18:18:55
 * @Description: 
 */
export class MainToolBarRedDotHandler {

    target: MainToolBar;

    // 获得可批量使用道具红点
    private batchGoodsRedDotHandler: BatchGoodsRedDotHandler;
    public constructor() {
        this.batchGoodsRedDotHandler = new BatchGoodsRedDotHandler();
    }

    addEvent() {
        NotificationManager.Instance.addEventListener(FriendUpdateEvent.INVITE_UPDATE, this.__updateFriendReddot, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.UPDATE_RECOMONDLIST, this.__updateFriendReddot, this);
        VIPManager.Instance.addEventListener(VIPEvent.VIP_PRIVILEGE_UPDATE, this.__updateShopReddot, this);
        ArmyManager.Instance.thane.skillCate.addEventListener(PlayerEvent.THANE_SKILL_POINT, this.__skillPointUpdate, this);
        NotificationManager.Instance.addEventListener(BagEvent.NEW_EQUIP, this.__betterEquipUpdate, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.addEventListener(PlayerEvent.RUNE_GEM_ENERGY, this.__updateRuneReddot, this);
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_UPGRADE, this.__updateRuneReddot, this);

        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdateHandler, this);
        FashionManager.Instance.addEventListener(FashionEvent.FASHION_BOOK_RECEIVE, this.updateBagRedPoint, this);
        MountsManager.Instance.avatarList.addEventListener(MountsEvent.MOUNT_LIST_CHANGE, this.__mountRedPointUpdate, this);
        EmailManager.Instance.addEventListener(EmailEvent.DATA_EMAIL_NEW, this.__receiveNewEmail, this);
        NotificationManager.Instance.addEventListener(NotificationEvent.HONOR_EQUIP_LEVELUP, this.updateBagRedPoint, this);
        NotificationManager.Instance.addEventListener(ShopEvent.DISCOUNTSHOP_UPDATE, this.__updateShopReddot, this);
        NotificationManager.Instance.addEventListener(ShopEvent.DISCOUNTSHOP_OPENSTATE, this.__updateShopReddot, this);
        NotificationManager.Instance.addEventListener(ConsortiaEvent.GET_ALTAR_GOODS, this.updateConsortiaRedPoint, this);
        NotificationManager.Instance.addEventListener(ConsortiaEvent.TASK_INFO, this.updateConsortiaRedPoint, this);
        ConsortiaManager.Instance.model.secretInfo.addEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.updateConsortiaRedPoint, this);

        NotificationManager.Instance.addEventListener(ConsortiaEvent.SECRET_SEENED, this.updateConsortiaRedPoint, this);
    }

    removeEvent() {
        NotificationManager.Instance.removeEventListener(FriendUpdateEvent.INVITE_UPDATE, this.__updateFriendReddot, this);
        VIPManager.Instance.removeEventListener(VIPEvent.VIP_PRIVILEGE_UPDATE, this.__updateShopReddot, this);
        ArmyManager.Instance.thane.skillCate.removeEventListener(PlayerEvent.THANE_SKILL_POINT, this.__skillPointUpdate, this);
        NotificationManager.Instance.removeEventListener(BagEvent.NEW_EQUIP, this.__betterEquipUpdate, this);
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_UPGRADE, this.__updateRuneReddot, this);
        PlayerManager.Instance.currentPlayerModel.playerInfo.removeEventListener(PlayerEvent.RUNE_GEM_ENERGY, this.__updateRuneReddot, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemUpdateHandler, this);
        FashionManager.Instance.removeEventListener(FashionEvent.FASHION_BOOK_RECEIVE, this.updateBagRedPoint, this);
        MountsManager.Instance.avatarList.removeEventListener(MountsEvent.MOUNT_LIST_CHANGE, this.__mountRedPointUpdate, this);
        EmailManager.Instance.removeEventListener(EmailEvent.DATA_EMAIL_NEW, this.__receiveNewEmail, this);
        NotificationManager.Instance.removeEventListener(NotificationEvent.HONOR_EQUIP_LEVELUP, this.updateBagRedPoint, this);
        NotificationManager.Instance.removeEventListener(ShopEvent.DISCOUNTSHOP_UPDATE, this.__updateShopReddot, this);
        NotificationManager.Instance.removeEventListener(ShopEvent.DISCOUNTSHOP_OPENSTATE, this.__updateShopReddot, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.UPDATE_RECOMONDLIST, this.__updateFriendReddot, this);
        NotificationManager.Instance.removeEventListener(ConsortiaEvent.GET_ALTAR_GOODS, this.updateConsortiaRedPoint, this);
        NotificationManager.Instance.removeEventListener(ConsortiaEvent.TASK_INFO, this.updateConsortiaRedPoint, this);
        ConsortiaManager.Instance.model.secretInfo.removeEventListener(ConsortiaEvent.TREE_STATE_UPDATE, this.updateConsortiaRedPoint, this);
        NotificationManager.Instance.removeEventListener(ConsortiaEvent.SECRET_SEENED, this.updateConsortiaRedPoint, this);
    }

    updateRedPoint() {
        this.__updateShopReddot();
        this.__updateFriendReddot();
        this.__skillPointUpdate();
        this.__mountRedPointUpdate();
        this.__receiveNewEmail();
        this.__updateRuneReddot();
        this.updateBagRedPoint();
        this.updateConsortiaRedPoint();
    }


    private __bagItemUpdateHandler(goods: GoodsInfo[]) {
        this.updateBagRedPoint();
        this.__mountRedPointUpdate();
        this.__updateRuneReddot();
        let btnBag = this.target.getUIBtnByType(EmMainToolBarBtnType.BAG)
        this.setLevelState(btnBag, GoodsManager.Instance.checkHasBetterEquip(), true);
        this.batchGoodsRedDotHandler.updateBatchGoods(goods);
    }

    private __updateShopReddot() {
        //商城按钮
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.SHOP)
        let discountState = DiscountShopManager.Instance.model.open && DiscountShopManager.Instance.model.myDiscount <= 0;
        let state = VIPManager.Instance.vipGiftState || discountState;
        this.setBtnState(btn, state);
    }

    private __receiveNewEmail() {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.MAIL)
        if (!btn) return;
        let count: number = EmailManager.Instance.existUnreadMailCount();
        if (count > 0) {
            btn.view.getController('c1').selectedIndex = 1;
            count = count > 99 ? 99 : count;
            (btn.view.getChild('countTxt') as fgui.GTextField).text = count.toString();
        }
        else {
            btn.view.getController('c1').selectedIndex = 0;
        }
    }

    private _runeOpenLevel: number = 0;
    /**
     * 更新红点展示
     */
    private __updateRuneReddot() {
        // let info = ArmyManager.Instance.thane.runeCate.getMaxGradeRuneInfo();
        // if (ConfigManager.info.SYS_OPEN && info && info.grade >= 10) {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.SKILL)
        if (!btn) return
        if (this._runeOpenLevel == 0) {
            this._runeOpenLevel = Number(TempleteManager.Instance.getConfigInfoByConfigName("OpenRuneGrade").ConfigValue);
        }
        //技能按钮
        let state = PlayerManager.Instance.currentPlayerModel.playerInfo.runePowerPoint >= 100 && ArmyManager.Instance.thane.grades >= this._runeOpenLevel && ComponentSetting.RUNE_HOLE;
        state = state || this.thane.runeCate.hasActiveRune()
        this.setBtnState(btn, state);
        let view = btn.getView();
        let dot = view.getChild('redDot');
        let showArrow = this.thane.talentData.talentPoint > 0 || this.thane.talentData.checkUpgrade() || this.thane.skillCate.skillPoint > 0;
        dot.x = showArrow ? 23 : 73;
        // }
    }

    /**更新技能升级提示 */
    private __skillPointUpdate() {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.SKILL)
        let skillPoint = this.thane.skillCate.skillPoint;
        let talentPoint = this.thane.talentData.talentPoint;
        let extrajobskill = this.thane.skillCate.checkExtrajobRedDot();
        if (skillPoint > 0 || talentPoint > 0 || extrajobskill) {
            this.setLevelState(btn, true);
        } else {
            this.setLevelState(btn, false);
        }
    }

    /**更新技能升级提示 */
    private __betterEquipUpdate(state: boolean) {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.BAG)
        state = GoodsManager.Instance.checkHasBetterEquip();
        this.setLevelState(btn, state, true);
        // if (state) {
        //     SharedManager.Instance.betterEquipFlag = true;
        //     SharedManager.Instance.saveBetterEquipFlag();
        // }
    }

    /**更新坐骑激活提示**/
    private __mountRedPointUpdate() {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.MOUNT)
        let canActive = MountsManager.Instance.avatarList.checkRedPoint();
        this.setBtnState(btn, canActive);
    }

    private __updateFriendReddot() {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.FRIEND)
        let showRed: boolean = false;
        if (FriendManager.getInstance().toolInviteFriendList.length > 0 || (FriendManager.getInstance().recommendList.length > 0 && FriendManager.SHOW_RED_DOT)) {
            showRed = true
        }
        this.setBtnState(btn, showRed);
    }

    /**
     * 背包红点涉及多个功能
     */
    public updateBagRedPoint() {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.BAG)
        if (!btn) return;
        let showRed: boolean = false;
        let ctrl: RoleCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.SRoleWnd) as RoleCtrl;//背包按钮-角色-龙纹
        if (FashionManager.Instance.fashionModel.checkRedDot() || (ctrl.tattooModel.canTattoo()) || BagHelper.Instance.checkJewelRedDot()
            || BagHelper.Instance.checkFortuneRedDot()) {
            showRed = true;
        } else {
            //荣誉
            let cfg: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName('honoropenlevel');
            if (cfg) {
                let cfgVal = cfg.ConfigValue
                let honoropenlevel = parseInt(cfgVal);
                if (this.thane.grades >= honoropenlevel) {
                    if (BagHelper.Instance.checkHonorUpLevel(this.thane.honorEquipLevel) || BagHelper.Instance.checkHonorUpStage(this.thane.honorEquipStage)) {
                        showRed = true;
                    }
                }
            }
        }
        if (ExtraJobModel.instance.MasteryRedDot()) {
            showRed = true;
        }

        if (this.batchGoodsRedDotHandler.isShowRedDot) {
            showRed = true;
        }

        this.setBtnState(btn, showRed);
        if (GoodsManager.Instance.checkHasBetterEquip()) {
            this.setLevelState(btn, true, true);
        }
    }

    private updateConsortiaRedPoint() {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.CONSORTIA)
        if (!btn) return;
        let showRed: boolean = false;
        if (!ConsortiaManager.Instance.model) return;
        if (ConsortiaManager.Instance.model.checkPrayHasLeftCount()
            || ConsortiaManager.Instance.model.checkHasTaskComplete()
            || ConsortiaManager.Instance.model.checkSecretRedDot()
            || ConsortiaManager.Instance.model.checkHasTaskWeekReward()) {
            showRed = true;
        }
        this.setBtnState(btn, showRed);
    }

    public updateFarmRedPoint(b: boolean) {
        let btn = this.target.getUIBtnByType(EmMainToolBarBtnType.FARM)
        this.setBtnState(btn, b);
    }


    /**
     * 设置Tab按钮红点状态
     * @param tabIndex Tab索引
     * @param redPointState 是否展示红点
     */
    private setBtnState(uiButton: UIButton, redPointState: boolean, count: number = 0) {
        if (uiButton) {
            let view = uiButton.getView();
            let dot = view.getChild('redDot');
            let newDot = view.getChild("newRedDot");
            let redDotLabel = view.getChild('redDotLabel');

            if (view.data["locationType"] == EmMainToolBarBtnLocationType.Row2) {
                dot.setXY(52, 10);
            }

            if (count > 0 && redPointState) {
                newDot.visible = true;
                dot.visible = false;
                redDotLabel.visible = true;
                redDotLabel.text = count.toString();
            }
            else {
                newDot.visible = false;
                dot.visible = redPointState ? true : false;
                redDotLabel.visible = false;
                redDotLabel.text = "";
            }
        }
    }

    /**
     * 设置Tab按钮升级状态
     * @param tabIndex Tab索引
     * @param redPointState 是否展示红点
     */
    private setLevelState(btn: UIButton, levelState: boolean, isbag?: boolean) {
        let btnView = btn;
        if (btnView) {
            let view = btnView.getView();
            let levelUp = view.getController("levelUp")
            levelUp.selectedIndex = levelState ? 1 : 0;

            let dot = view.getChild('redDot');
            if (dot.visible && levelState) {
                let showArrow = this.thane.talentData.talentPoint > 0 || this.thane.skillCate.skillPoint > 0 || this.thane.skillCate.checkExtrajobRedDot();
                dot.x = showArrow ? 23 : 73;
            }
            if (dot.visible && isbag) {

                dot.x = levelState ? 23 : 73;
            }
        }
    }

    public setAllBatchGoodesSeened(){
        this.batchGoodsRedDotHandler.setAllSeened();
    }

    private get thane() {
        return ArmyManager.Instance.thane;
    }
}