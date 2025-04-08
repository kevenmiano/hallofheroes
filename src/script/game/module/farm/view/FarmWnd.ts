/*
 * @Author: jeremy.xu
 * @Date: 2021-08-12 17:29:04
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-17 14:50:11
 * @Description: 
 */

import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { BagEvent, FarmEvent, FriendUpdateEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { FarmManager } from "../../../manager/FarmManager";
import { FriendManager } from "../../../manager/FriendManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import FarmInfo from "../data/FarmInfo";
import { FarmBagListView } from "./component/FarmBagListView";
import { FarmFriendListView } from "./component/FarmFriendListView";
import { FarmSelfInfoView } from "./component/FarmSelfInfoView";
import ObjectUtils from '../../../../core/utils/ObjectUtils';
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import UIButton from "../../../../core/ui/UIButton";
import { ServerDataManager } from "../../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../../constant/protocol/S2CProtocol";
import { PackageIn } from '../../../../core/net/PackageIn';
import FriendFarmStateInfo from "../data/FriendFarmStateInfo";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import LangManager from "../../../../core/lang/LangManager";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { UpgradeType } from "../../../constant/UpgradeType";
import { TempleteManager } from "../../../manager/TempleteManager";
import Logger from '../../../../core/logger/Logger';
import { FarmFriendInfoView } from "./component/FarmFriendInfoView";
import { VipPrivilegeType } from "../../../constant/VipPrivilegeType";
import { VIPManager } from "../../../manager/VIPManager";
// import FarmScene from "../../../scene/FarmScene";
import { FarmLandItem } from "./item/FarmLandItem";
import { FarmModel } from "../data/FarmModel";
import UIManager from "../../../../core/ui/UIManager";
import FriendFarmStateMsg = com.road.yishi.proto.farm.FriendFarmStateMsg;
import LoadFarmRsp = com.road.yishi.proto.farm.LoadFarmRsp;
import BaseFguiCom from "../../../../core/ui/Base/BaseFguiCom";
import Utils from "../../../../core/utils/Utils";
import { ResourceData } from "../../../datas/resource/ResourceData";
import { ResourceManager } from "../../../manager/ResourceManager";
import { isCNLanguage } from "../../../../core/lang/LanguageDefine";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import ItemID from "../../../constant/ItemID";
import { FarmOperateType } from "../../../constant/FarmOperateType";
import { FarmLandCom } from "./FarmLandCom";
import SimpleBuildingFilter from "../../../map/castle/filter/SimpleBuildingFilter";
import { FarmTree } from "./component/FarmTree";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";

export default class FarmWnd extends BaseWindow {
    public bFold: boolean = false;  //按钮折叠中

    public cIsOversea: fgui.Controller
    // public cShowBag: fgui.Controller
    public farmCtrl: fgui.Controller
    private comFriend: fgui.GComponent
    private comBag: fgui.GComponent
    private comRoleInfo: fgui.GComponent
    private comFriendRoleInfo: fgui.GComponent
    private _friendListView: FarmFriendListView
    private _bagListView: FarmBagListView
    public get bagListView(): FarmBagListView {
        return this._bagListView
    }
    private _farmSelfInfoView: FarmSelfInfoView
    private _farmFriendInfoView: FarmFriendInfoView
    private btn_myFarm: UIButton
    private btn_aKey: UIButton
    private btn_bag: UIButton;
    private expProgressBar: fgui.GProgressBar;//下部经验条
    private farmLand:FarmLandCom;
    private farmTree:FarmTree;
    /**
	 * 土地升级按钮 
	 */
	private landUpBtn: UIButton;
    
    public getFarmLand() : FarmLandCom {
        return this.farmLand;
    }

    public getFarmTree() : FarmTree {
        return this.farmTree;
    }

    constructor() {
        super();
        this.resizeContent = true;
    }

    public OnInitWind() {
        super.OnInitWind();
        BaseFguiCom.autoGenerate(this.comRoleInfo, this)
        this.setCenter();
        this.setWndOptimize();
    }

    private setWndOptimize() {
        this.setOptimize = false;
        Utils.setDrawCallOptimize(this.comRoleInfo);
        Utils.setDrawCallOptimize(this.comFriend);
    }

    OnShowWind() {
        super.OnShowWind();
       
        this.initView();
        this.addEvent();
        this.refreshExp()
        // if (FarmManager.Instance.showFriendList) {
        //     FarmManager.Instance.showFriendList = false;
        //     this.btn_friendListClick();
        // }
    }

    public getBtn_bag(): UIButton {
        return this.btn_bag;
    }

    OnHideWind() {
        FarmManager.Instance.showingBag = false;
        super.OnHideWind();
        this.delEvent();
    }

    private addEvent() {
        ServerDataManager.listen(S2CProtocol.U_C_CANWATER_USERS, this, this.__getFriendFarmStateHandler);
        ArmyManager.Instance.thane.addEventListener(PlayerEvent.THANE_EXP_UPDATE, this.__heroExpUpdate, this);
        FarmManager.Instance.model.addEventListener(FarmEvent.SELECTED_CHANGE, this.__selectedFarmChangeHandler, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.FRIEND_UPDATE, this.__friendUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.addEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        Laya.timer.loop(100, this, this.__checkHandleAKey)
    }

    private delEvent() {
        this.landUpBtn.view.off(Laya.Event.MOUSE_OVER, this, this.__onBuildingOver);
		this.landUpBtn.view.off(Laya.Event.MOUSE_OUT, this, this.__onBuildingOut);
		this.landUpBtn.view.offClick(this, this.__onLandUpClick);
        ServerDataManager.cancel(S2CProtocol.U_C_CANWATER_USERS, this, this.__getFriendFarmStateHandler);
        ArmyManager.Instance.thane.removeEventListener(PlayerEvent.THANE_EXP_UPDATE, this.__heroExpUpdate, this);
        FarmManager.Instance.model.removeEventListener(FarmEvent.SELECTED_CHANGE, this.__selectedFarmChangeHandler, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.FRIEND_UPDATE, this.__friendUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdateHandler, this);
        GoodsManager.Instance.removeEventListener(BagEvent.DELETE_BAG, this.__bagItemDeleteHandler, this);
        Laya.timer.clear(this, this.__checkHandleAKey)
    }

    /**
     * 收到农场好友状态信息
     * 包括摘取、充能、复活、除虫、除草。
     */
    private __getFriendFarmStateHandler(pkg: PackageIn) {
        let msg = pkg.readBody(LoadFarmRsp) as LoadFarmRsp;

        msg.friendFarmState.forEach((fsMsg: FriendFarmStateMsg) => {
            var fsInfo: FriendFarmStateInfo = FarmManager.Instance.model.getFarmStateInfo(fsMsg.userId);
            fsInfo.beginChanges();
            fsInfo.canSteal = fsMsg.isReap;
            fsInfo.canGivePower = fsMsg.isChargeEnergy;
            fsInfo.canRevive = fsMsg.isRevive;
            fsInfo.canWorm = fsMsg.isWorm;
            fsInfo.canWeed = fsMsg.isGrass;
            fsInfo.canFeed = fsMsg.isFeed;
            fsInfo.commitChanges();
            if (this.thane.userId == fsMsg.userId) {
                Logger.xjy("更新自己神树状态")
            }
            // Logger.xjy("[FarmWnd]__getFriendFarmStateHandler", this.thane.userId, fsMsg.userId, fsMsg.isChargeEnergy)
        });

        // 刷新农场好友信息
        this._friendListView.refreshList();
    }

    private initView() {
        this._friendListView = new FarmFriendListView(this.comFriend)
        this._bagListView = new FarmBagListView(this.comBag)
        this._farmSelfInfoView = new FarmSelfInfoView(this.comRoleInfo)
        this._farmFriendInfoView = new FarmFriendInfoView(this.comFriendRoleInfo)
        this.btn_aKey.visible = false;
        this.farmCtrl = this.contentPane.getController("farmCtrl")
        this.cIsOversea = this.comFriend.getController("cIsOversea")
        this.cIsOversea.selectedIndex = isCNLanguage() ? 0 : 1;

        this.landUpBtn.title = LangManager.Instance.GetTranslation("farm.view.FarmBuildLayer.landUp");
        this.landUpBtn.view.on(Laya.Event.MOUSE_OVER, this, this.__onBuildingOver);
		this.landUpBtn.view.on(Laya.Event.MOUSE_OUT, this, this.__onBuildingOut);
		this.landUpBtn.onClick(this, this.__onLandUpClick);
        this._buildingFilter = new SimpleBuildingFilter();
        // this.cShowBag = this.getUIController("cShowBag")
        // let newbieNode = NewbieModule.Instance.getNodeById(NewbieConfig.NEWBIE_230);
        this.farmLand.initView();
        FarmManager.Instance.model.defaultSelectedUserInfo = ArmyManager.Instance.thane;
        this.__selectedFarmChangeHandler(FarmManager.Instance.model.curSelectedFarmInfo);
        // this.__updateInvateView();
        this._bagListView.initView();
        this.farmTree.initView();
        this.updateFarmLandLevel();
    }

    public showBag(){
        this.bagListView.onBag();
    }

    updateFarmLandLevel(){
        this.landUpBtn.view.getChild("comTitle").asCom.getChild("txtLevel").text = this._curSelectedFarm.landGrade.toString();
    }

    /**
	 * 打开升级土地 
	 */
	private __onLandUpClick(e: Laya.Event) {
		if (this._curSelectedFarm) {
			// if (this._curSelectedFarm.grade < FarmModel.LANDUP_OPEN_LEVEL) {
			// 	MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("farm.view.FarmBuildLayer.landUpOpenTip", FarmModel.LANDUP_OPEN_LEVEL));
			// 	return;
			// }
			// if (this._curSelectedFarm.landGrade >= FarmModel.MAX_LAND_LEVEL) {
			// 	MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("farm.view.FarmBuildLayer.maxLandLevelTip"));
			// 	return;
			// }
            //点击地图上的小木牌弹出土地升级弹窗，取消等级限制，农场功能开放时一并开放此功能
			// if (FarmManager.Instance.model.curSelectedFarmInfo.grade < FarmModel.LANDUP_OPEN_LEVEL) {
			// 	MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("farm.view.FarmBuildLayer.landUpOpenTip", FarmModel.LANDUP_OPEN_LEVEL));
			// 	return;
			// }
			FrameCtrlManager.Instance.open(EmWindow.FarmLandUpWnd, { farmInfo: this._curSelectedFarm });
		}
	}

    /**
	 *  建筑物滤镜
	 */
	private _buildingFilter: SimpleBuildingFilter;

    private __onBuildingOver(e: Laya.Event) {
		let dst = (fgui.GObject.cast(e.currentTarget).asCom).getChild("icon")
		this._buildingFilter.setBuildingOverFilter(dst.displayObject);
	}

    private __onBuildingOut(e: Laya.Event) {
		let dst = (fgui.GObject.cast(e.currentTarget).asCom).getChild("icon")
		this._buildingFilter.setBuildingOutFilter(dst.displayObject);
	}

    private __checkHandleAKey() {
        this.btn_aKey.visible = this.checkHasLandEvent()
    }


    private __bagItemUpdateHandler(infos: GoodsInfo[]) {
        this._bagListView.__bagItemUpdateHandler(infos)
    }

    private __bagItemDeleteHandler(info: GoodsInfo[]) {
        this._bagListView.__bagItemDeleteHandler(info)
    }

    private __friendUpdateHandler() {
        this._friendListView.__friendUpdateHandler()
    }

    private _curSelectedFarm: FarmInfo;
    private __selectedFarmChangeHandler(data: FarmInfo) {
        if (!data) return;
        let isSelf = data.userId == this.thane.userId;
        this.farmCtrl.selectedIndex = isSelf ? 0 : 1;
        this.landUpBtn.view.getChild('comTitle').visible = this.landUpBtn.touchable = isSelf;
        if (isSelf) {
            this._farmSelfInfoView.data = data;  
        } else {
            this._farmFriendInfoView.data = data;
        }
        this._curSelectedFarm = data;
        this.farmLand.setData(this._curSelectedFarm);
    }

    private __heroExpUpdate() {
        this.refreshExp()
    }


    /**刷新经验 */
    public refreshExp() {
        if (!this.expProgressBar || this.expProgressBar.isDisposed || !this.isShowing) return;
        var _percent: number = 0;
        var _offlinePrecent: number = 0;
        var msg: string = "";
        var upGrade: t_s_upgradetemplateData = this.getNextGradeTemp(ArmyManager.Instance.thane.grades + 1, UpgradeType.UPGRADE_TYPE_PLAYER);
        if (upGrade) {
            _percent = Number(ArmyManager.Instance.thane.gp / upGrade.Data * 100);
            _offlinePrecent = Number((ArmyManager.Instance.thane.gp + ArmyManager.Instance.thane.offlineGp) * 100 / upGrade.Data);
            msg = LangManager.Instance.GetTranslation("mainBar.PlayerExperenceView.msg2", (ArmyManager.Instance.thane.gp + " / " + upGrade.Data), _percent, ArmyManager.Instance.thane.offlineGp);
        } else {
            _percent = 100;
            _offlinePrecent = 1;
            msg = LangManager.Instance.GetTranslation("mainBar.PlayerExperenceView.msg");
        }
        if (this.expProgressBar && !this.expProgressBar.isDisposed) {
            this.expProgressBar.value = (_percent);
            this.expProgressBar.getChild('expMsg').asTextField.text = '';//msg;//!隐藏经验条文字提示
        }
    }

    private checkHasLandEvent(): boolean {
        for (let i = 0; i < FarmModel.LAND_NUM; i++) {
            var item: FarmLandItem = this.farmLand.getLandItemByPos(i);
            if (item.canHandleOneKey) {
                return true;
            }
        }
        if (this.farmTree.checkCanWater()) {
            return true;
        }
        return false;
    }


    btn_myFarmClick() {
        FarmManager.Instance.model.curSelectedUserInfo = this.thane;
        this._friendListView.unSelectItem();
    }

    // 一键处理事件
    btn_aKeyClick() {
        let needClearLandPos = [];
        this.btn_aKey.visible = false;
        this.farmTree.doOneKey()
        let needTip = false
        for (let i = 0; i < FarmModel.LAND_NUM; i++) {
            let item: FarmLandItem = this.farmLand.getLandItemByPos(i);
            if (!item.info) continue;
            let cropTemp = item.info.cropTemp;
            if (!cropTemp) continue;
            // if (item.canHandleClear) {
            //     needClearLandPos.push(i);
            // }
            if (item.canHandleOneKey) {
                /**
                 * 黄金作物 黄金爆仓后无法 摘取/偷取
                 * TODO 未处理 摘取/偷取 后是否达到上限的判断
                 */
                if (cropTemp.Property2 == ItemID.GOLD_PROP) {
                    // 拾取/偷取  黄金作物
                    if ((item.info.curOper == FarmOperateType.PICK || item.info.curOper == FarmOperateType.STEAL) &&
                        this.gold.count >= this.gold.limit) {
                        needTip = true;
                    } else {
                        item.onItemClick();
                    }
                } else { // 非黄金作物
                    item.onItemClick();
                }
            }
        }

        if (needTip) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("farm.view.FarmLandItem.goldLimitTip"));
        }
        
        if (needClearLandPos.length > 0) {
            let msg = LangManager.Instance.GetTranslation("farm.FarmManager.clearAll")
            SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, msg, null, null, (b: boolean) => {
                if (b && !this.destroyed) {
                    needClearLandPos.forEach(pos => {
                        let item: FarmLandItem = this.farmLand.getLandItemByPos(pos)
                        FarmManager.Instance.sendFarmOper(item.info.userId, FarmOperateType.CLEAR, pos);
                    });
                }
            });
        }
    }

    btn_shopClick() {
        FrameCtrlManager.Instance.open(EmWindow.FarmShopWnd);
    }

    btn_eventClick() {
        FrameCtrlManager.Instance.open(EmWindow.FarmEventWnd);
    }

    btn_friendsClick() {
        FrameCtrlManager.Instance.open(EmWindow.FriendWnd);
    }

    btn_bagClick() {
        FrameCtrlManager.Instance.open(EmWindow.SRoleWnd);
    }

    btn_backClick() {
        FarmManager.Instance.exitFarm()
    }

   	private helpBtnClick() {
		let content: string = LangManager.Instance.GetTranslation("farm.view.FarmResourcesView.helpContent2");
		UIManager.Instance.ShowWind(EmWindow.Help, { content: content });
	}

    /** 新手用 */
    public showFriend(selIndex: number) {
        this.farmCtrl.selectedIndex = selIndex;
    }

    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    private get hasVipPrevilige() {
        return VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.FRAM, VIPManager.Instance.model.vipInfo.VipGrade);
    }

    private get gold(): ResourceData {
        return ResourceManager.Instance.gold;
    }

    private getNextGradeTemp(grade: number, type: number): t_s_upgradetemplateData {
        return TempleteManager.Instance.getTemplateByTypeAndLevel(grade, type);
    }

    dispose() {
        ObjectUtils.disposeObject(this._friendListView)
        ObjectUtils.disposeObject(this._bagListView)
        ObjectUtils.disposeObject(this._farmSelfInfoView)
        ObjectUtils.disposeObject(this._farmFriendInfoView)
        super.dispose()
    }
}