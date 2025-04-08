// @ts-nocheck
import { CampaignManager } from "../../../manager/CampaignManager";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import NewbieUtils from "../utils/NewbieUtils";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import Logger from "../../../../core/logger/Logger";
import { EmPackName, EmWindow } from '../../../constant/UIDefine';
import ForgeWnd from '../../forge/ForgeWnd';
import AllocateWnd from "../../allocate/AllocateWnd";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import LangManager from "../../../../core/lang/LangManager";
import ResMgr from '../../../../core/res/ResMgr';
import { AnimationEffectName, AnimationHelper, AnimationBaseData } from '../../../manager/AnimationHelper';
import { MovieClip } from "../../../component/MovieClip";
import { DisplayObject } from '../../../component/DisplayObject';
import { FogGridType } from "../../../constant/FogGridType";
import { JobType } from "../../../constant/JobType";
import FUIHelper from "../../../utils/FUIHelper";
import GoodsSonType from "../../../constant/GoodsSonType";
import { BagWnd } from '../../bag/view/BagWnd';
import { PlayerBagCell } from '../../../component/item/PlayerBagCell';
import AllocateItem from "../../allocate/AllocateItem";
import { StoreBagCell } from "../../../component/item/StoreBagCell";
import NewbieBaseActionMediator from "./NewbieBaseActionMediator";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { OuterCityManager } from "../../../manager/OuterCityManager";

/**
 * 新手指引特殊动作集
 */
export default class NewbieSpecialActionMediator {

	/**
	 * 播放蒂娜治疗效果
	 */
	public static tinaTreatEffect(callback: Function, callArgs: Array<any>) {
		Logger.xjy("[NewbieBaseConditionMediator]播放蒂娜治疗效果")
		var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!mapModel) {
			NewbieSpecialActionMediator.completeCallback()
			return;
		}
		var tinaView = mapModel.getNodeByNodeId(1000107);
		var armyView = mapModel.selfMemberData ? CampaignManager.Instance.controller.getArmyView(mapModel.selfMemberData) : null;
		if (!tinaView || !armyView) {
			NewbieSpecialActionMediator.completeCallback()
			return;
		}


		let aniData = AnimationHelper.getSkillEffectAniData(AnimationEffectName.BUFF_ACTION_CURE)
		ResMgr.Instance.loadRes(aniData.fullUrl, (res) => {
			if (!res) {
				Logger.warn("[NewbieSpecialActionMediator]tinaTreatEffect 加载蒂娜治疗效果 失败")
				return
			}
			let success = AnimationHelper.getAniCache(aniData)
			if (success) {
				let tinaEffect: MovieClip = new MovieClip(aniData.cacheName);
				let armyEffect: MovieClip = new MovieClip(aniData.cacheName);
				tinaView.addChild(tinaEffect);
				armyView.addChild(armyEffect);
				tinaEffect.gotoAndPlay(0, true)
				armyEffect.gotoAndPlay(0, true)
				tinaEffect.pos(-78, -178)
				armyEffect.pos(-78, -178)
				TweenMax.to(tinaEffect, 1, { delay: 1, yoyo: true, repeat: 1, onComplete: NewbieSpecialActionMediator.tweenCompleteCall, onCompleteParams: [tinaEffect, true, aniData, true, null, null] });
				TweenMax.to(armyEffect, 1, { delay: 1, yoyo: true, repeat: 1, onComplete: NewbieSpecialActionMediator.tweenCompleteCall, onCompleteParams: [armyEffect, true, aniData, true, callback, callArgs] });
				MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("newbie.newbieBaseActionMediator.tinaUsehealed"));
			} else {
				Logger.warn("[NewbieSpecialActionMediator]tinaTreatEffect 播放蒂娜治疗效果 失败")
			}
		})
	}

	/**
	 * 播放外城战斗动画
	 * 1.创建myCity并且加上对应战斗动画
	 * 2.加上战争迷雾 暂时不加
	 */
	public static showOutCityBattleMovie(callback: Function, callArgs: Array<any>) {
		NewbieSpecialActionMediator.callback = callback
		NewbieSpecialActionMediator.callargs = callArgs
		let _myCity = OuterCityManager.Instance.model.getPhysicsByXY(520, 920);
		if (!_myCity) {
			NewbieSpecialActionMediator.completeCallback()
			return;
		}
		if (_myCity != null) {
			// _myCity.nameDefence.visible = false;
			let attackingMC: fgui.GMovieClip = fgui.UIPackage.createObject(EmWindow.OuterCity, "asset.outercity.AttackingAsset").asMovieClip;
			attackingMC.playing = true;
			attackingMC.x = 25;
			attackingMC.y = -30;
			_myCity.addChild(attackingMC.displayObject);

			OuterCityManager.Instance.model.addEventListener(OuterCityEvent.CURRENT_WILD_LAND, NewbieSpecialActionMediator.__initCurrentWildLandHandler, this);
			OuterCityManager.Instance.model.addEventListener(OuterCityEvent.CURRENT_CASTLES, NewbieSpecialActionMediator.__initCurrentWildLandHandler, this);
			NewbieSpecialActionMediator.__initCurrentWildLandHandler();
			
			// let _fogView: NoviceFogView;
			// if (OuterCityManager.Instance.mapView) {
			// 	_fogView = new NoviceFogView(OuterCityManager.Instance.mapView.width, OuterCityManager.Instance.mapView.height);
			// 	OuterCityManager.Instance.mapView.addChild(_fogView);
			// 	_fogView.updatePos(26 * 20, 46 * 20, 3);
			// 	_fogView.updatePos(16 * 20, 34 * 20, 3);
			// }
			NewbieSpecialActionMediator.completeCallback()
		}
	}

	private static __initCurrentWildLandHandler() {
		if (OuterCityManager.Instance.model.getPhysicsByXY(1080, 1280))
			OuterCityManager.Instance.model.getPhysicsByXY(1080, 1280).visible = false;
		if (OuterCityManager.Instance.model.getPhysicsByXY(1420, 1080))
			OuterCityManager.Instance.model.getPhysicsByXY(1420, 1080).visible = false;
		if (OuterCityManager.Instance.model.getPhysicsByXY(880, 440))
			OuterCityManager.Instance.model.getPhysicsByXY(880, 440).visible = false;
		if (OuterCityManager.Instance.model.getPhysicsByXY(1180, 1120))
			OuterCityManager.Instance.model.getPhysicsByXY(1180, 1120).visible = false;
		if (OuterCityManager.Instance.model.getPhysicsByXY(320, 680))
			OuterCityManager.Instance.model.getPhysicsByXY(320, 680).visible = false;
		if (OuterCityManager.Instance.model.getPhysicsByXY(720, 380))
			OuterCityManager.Instance.model.getPhysicsByXY(720, 380).visible = false;
	}

	/**
	 * 获得世界地图11-20那个movieimage
	 */
	public static getWorldMapMovie(callback: Function, callArgs: Array<any>) {
		// TODO Newbie jeremy.xu 获得世界地图11-20那个movieimage 
		Logger.xjy("[NewbieBaseConditionMediator]TODO 获得世界地图11-20那个movieimage")

		// var _worlEffec: MovieClip;
		// var _worlFrame: Frame = FrameControllerManager.Instance.worldMapController.frame;

		// _worlFrame['closeBtn'].enable = false;
		// var btn: SimpleButton = _worlFrame['mapAreaContainer'].movie["map1"];
		// _worlEffec = ComponentFactory.Instance.creatCustomObject("novice.NoviceWorld");
		// _worlEffec.x = 298;
		// _worlEffec.y = 438;
		// _worlFrame['addChild'](_worlEffec);
		// NewbieSpecialActionMediator.completeCallback()
	}

	/**
	 * 添加遗弃武器的动画
	 */
	public static addDropWeaponMovie() {
		Logger.xjy("[NewbieBaseConditionMediator]添加遗弃武器的动画")

		var mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!mapModel) return;
		var weaponNodeView = mapModel.getNodeByNodeId(1000202) as DisplayObject;
		if (!weaponNodeView) return;
		mapModel.updateFog(weaponNodeView.x, weaponNodeView.y, FogGridType.OPEN_THREE);

		var weaponMovie: fgui.GMovieClip;
		switch (ArmyManager.Instance.thane.templateInfo.Job) {
			case JobType.HUNTER:
				weaponMovie = FUIHelper.createFUIInstance(EmPackName.Newbie, "weaponMC2");
				break;
			case JobType.WIZARD:
				weaponMovie = FUIHelper.createFUIInstance(EmPackName.Newbie, "weaponMC3");
				break;
			default:
				weaponMovie = FUIHelper.createFUIInstance(EmPackName.Newbie, "weaponMC1");
		}
		weaponMovie.setPlaySettings(0, -1, 0, -1);
		weaponMovie.frame = 0;
		weaponMovie.playing = true;
		weaponMovie.x = -weaponMovie.initWidth / 2;
		weaponMovie.y = -weaponMovie.initHeight / 2;
		weaponNodeView.addChild(weaponMovie.displayObject);
	}

	//////////////////////////////装备武器指引/////////////////////////////////
	public static weaponEquipGuild(callback: Function, callArgs: Array<any>) {
		Logger.xjy("[NewbieBaseConditionMediator]装备武器指引")

		var bagFrame = NewbieUtils.getFrame(EmWindow.BagWnd) as BagWnd;
		bagFrame.showEffectBySontype(GoodsSonType.SONTYPE_VIP_BOX);  //如果有vip币, 则播放vip币所在格子的亮显特效

		NewbieSpecialActionMediator.flag = 0
		NewbieSpecialActionMediator.callback = callback
		NewbieSpecialActionMediator.callargs = callArgs

		var itemView = bagFrame.getBaseBagItemByType(GoodsSonType.SONTYPE_WEAPON) as PlayerBagCell;
		if (!itemView) {
			NewbieSpecialActionMediator.completeCallback()
			return;
		}

		NewbieBaseActionMediator.cleanAll();
		NewbieBaseActionMediator.showMask();
		NewbieBaseActionMediator.createGuildFrame1("", -150, 20, 4201, "1", 4, itemView.displayObject);
		NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, itemView.displayObject);

		// NewbieBaseActionMediator.setKeyboardState(null, null, "0", 1);
		// NewbieSpecialActionMediator.gotoGoodsItem();
	}

	public static weaponEquipGuild2(callback: Function, callArgs: Array<any>) {

		var bagFrame = NewbieUtils.getFrame(EmWindow.BagWnd) as BagWnd;

		NewbieBaseActionMediator.cleanAll();
		NewbieBaseActionMediator.showMask();
		NewbieBaseActionMediator.createGuildArrow1("", -58, 92, 4, 4203, bagFrame["closeButton"]);
		NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, bagFrame["closeButton"]);
	}

	// public static gotoGoodsItem() {
	// 	NewbieSpecialActionMediator.flag = 1;
	// 	var bagFrame = NewbieUtils.getFrame(EmWindow.BagWnd) as BagWnd;
	// 	var itemView = bagFrame.getBaseBagItemByType(GoodsSonType.SONTYPE_WEAPON) as PlayerBagCell;
	// 	if (!itemView) {
	// 		// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
	// 		NewbieSpecialActionMediator.completeCallback()
	// 		return;
	// 	}
	// 	// bagFrame["equipBag"].addChild(itemView);
	// 	NewbieBaseActionMediator.cleanAll();
	// 	NewbieBaseActionMediator.showMask();
	// 	NewbieBaseActionMediator.createGuildFrame1("", -150, 20, 4201, "1", 4, itemView.displayObject);
	// 	NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, itemView.displayObject);
	// 	Laya.timer.loop(1, NewbieSpecialActionMediator, NewbieSpecialActionMediator.pawnEnterFrame)
	// }
	// public static gotoPlayItem() {
	// 	var roleFrame = NewbieUtils.getFrame(EmWindow.RoleWnd) as RoleWnd;
	// 	var weaponItem: PlayerEquipCell = roleFrame.weapon;
	// 	NewbieSpecialActionMediator.flag = 2;
	// 	// if (bagFrame) bagFrame.escEnable = false;
	// 	NewbieBaseActionMediator.cleanAll();
	// 	NewbieBaseActionMediator.createGuildFrame1("", -170, 20, 4202, "0", 4, weaponItem.displayObject);
	// }
	// public static pawnEnterFrame(e: Event) {
	// 	var roleFrame = NewbieUtils.getFrame(EmWindow.RoleWnd) as RoleWnd;
	// 	var weaponItem: PlayerEquipCell = roleFrame.weapon;
	// 	if (weaponItem.data) {
	// 		var bagFrame = NewbieUtils.getFrame(EmWindow.BagWnd) as BagWnd;
	// 		Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.pawnEnterFrame)
	// 		NewbieBaseActionMediator.cleanAll();
	// 		NewbieBaseActionMediator.showMask();
	// 		NewbieBaseActionMediator.createGuildArrow1("", -58, 92, 4, 4203, bagFrame["closeButton"]);
	// 		NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, bagFrame["closeButton"]);
	// 		Laya.timer.loop(1, NewbieSpecialActionMediator, NewbieSpecialActionMediator.closeBagFrame)
	// 		return;
	// 	}
	// 	if (DragManager.Instance.isDraging && NewbieSpecialActionMediator.flag == 1) {
	// 		NewbieSpecialActionMediator.gotoPlayItem();
	// 	}
	// 	else if (DragManager.Instance.isDraging == false && NewbieSpecialActionMediator.flag == 1) {
	// 		var itemView = bagFrame.getBaseBagItemByType(GoodsSonType.SONTYPE_WEAPON) as PlayerBagCell;
	// 		if (itemView && !itemView.data) {
	// 			Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.pawnEnterFrame)
	// 			NewbieSpecialActionMediator.gotoGoodsItem();
	// 		}
	// 	}
	// 	else if (DragManager.Instance.isDraging == false && NewbieSpecialActionMediator.flag == 2) {
	// 		Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.pawnEnterFrame)
	// 		NewbieSpecialActionMediator.gotoGoodsItem();
	// 	}
	// }
	// public static closeBagFrame(e: Event) {
	// 	var bagFrame = NewbieUtils.getFrame(EmWindow.BagWnd) as BagWnd;
	// 	if (!bagFrame || !bagFrame["BtnClose"]) {
	// 		Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.closeBagFrame)
	// 		// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
	// 		NewbieBaseActionMediator.cleanAll();
	// 		NewbieSpecialActionMediator.completeCallback()
	// 	}
	// }

	////////////////////////////////// 配兵指引 ////////////////////////////////////
	public static pawnAllocateGuild(callback: Function, callArgs: Array<any>) {
		Logger.xjy("[NewbieBaseConditionMediator]配兵指引")

		NewbieSpecialActionMediator.flag = 0
		NewbieSpecialActionMediator.callback = callback
		NewbieSpecialActionMediator.callargs = callArgs

		var allocateFrame = NewbieUtils.getFrame(EmWindow.AllocateWnd) as AllocateWnd;
		var prevNumber: number = ArmyManager.Instance.army.countAllArmyPawnNmber();
		if (prevNumber > 0) {//如果带兵量已>0, 直接结束指引
			allocateFrame.hide();
			NewbieSpecialActionMediator.completeCallback()
			return;
		}

		let itemView: AllocateItem = allocateFrame.SoliderList.getChildAt(0) as AllocateItem

		NewbieBaseActionMediator.cleanAll();
		NewbieBaseActionMediator.showMask();
		NewbieBaseActionMediator.createGuildFrame1("", -150, 120, 4201, "1", 4, itemView.displayObject);
		NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, itemView.displayObject);


		// NewbieBaseActionMediator.setKeyboardState(null, null, "0", 1);
		Laya.timer.frameLoop(1, NewbieSpecialActionMediator, NewbieSpecialActionMediator.iconFrame)
	}

	private static iconFrame(e: Event) {
		var allocateFrame = NewbieUtils.getFrame(EmWindow.AllocateWnd) as AllocateWnd;
		if (allocateFrame == null || allocateFrame["allocateView"] == null) {
			// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
			NewbieSpecialActionMediator.completeCallback()
			return;
		}
		if (allocateFrame["allocateView"].getPawnDragCellByMasterType(1) == null || allocateFrame["allocateView"].getPawnDragCellByMasterType(1)["icon"] == null) {
			// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
			NewbieSpecialActionMediator.completeCallback()
			return;
		}
		// gongPawnCell = allocateFrame["allocateView"].getPawnDragCellByMasterType(1)["icon"];
		// if (gongPawnCell.displayWidth > 50 && gongPawnCell.stage) {//如果枪兵图标存在且正显示
		// 	soldierPawnCell = allocateFrame["allocateView"].SoldierPawn;

		// 	Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.iconFrame)
		// 	NewbieSpecialActionMediator.pawnBtnClick();
		// }
	}
	private static pawnBtnClick() {//指引点起枪兵图标
		// NewbieSpecialActionMediator.flag = 1;
		// NewbieBaseActionMediator.cleanAll();
		// NewbieBaseActionMediator.showMask();
		// NewbieBaseActionMediator.createGuildFrame1("", -200, 30, 4301, "1", 4, gongPawnCell);
		// NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, gongPawnCell);
		// StageReferance.stage.addEventListener(Event.ENTER_FRAME, NewbieSpecialActionMediator.pawnAllocateEnterFrame);
	}
	private static gotoSoldierPawn() {//指引拖动枪兵图标到带兵格子
		// NewbieSpecialActionMediator.flag = 2;
		// if (allocateFrame) allocateFrame.escEnable = false;
		// NewbieBaseActionMediator.cleanAll();
		// NewbieBaseActionMediator.createGuildFrame1("", -150, 80, 4302, "1", 4, soldierPawnCell);
	}
	private static pawnAllocateEnterFrame(e: Event) {
		// var prevNumber: int = ArmyManager.Instance.army.countAllArmyPawnNmber();
		// if (prevNumber > 0) {//如果带兵量>0, 结束指引
		// 	StageReferance.stage.removeEventListener(Event.ENTER_FRAME, NewbieSpecialActionMediator.pawnAllocateEnterFrame);
		// 	NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
		// 	NewbieBaseActionMediator.cleanAll();
		// 	allocateFrame.dispose();
		// 	NewbieSpecialActionMediator.completeCallback()
		// 	return;
		// }
		// if (DragManager.getInstance().isDraging && NewbieSpecialActionMediator.flag == 1) {//如果正拖起枪兵图标, 则指引将图标放到左边带兵格子
		// 	NewbieSpecialActionMediator.gotoSoldierPawn();
		// }
		// else if (DragManager.getInstance().isDraging == false && NewbieSpecialActionMediator.flag == 2) {//如果拖起的图标放下
		// 	if (!FrameControllerManager.Instance.armyController.isAdjustPawn) {//图标是否放入带兵格子, 否则重新指引拖起图标
		// 		StageReferance.stage.removeEventListener(Event.ENTER_FRAME, NewbieSpecialActionMediator.pawnAllocateEnterFrame);
		// 		if (!gongPawnCell || !gongPawnCell.stage) {//图标不存在的容错处理, 直接结束指引
		// 			NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
		// 			NewbieBaseActionMediator.cleanAll();
		// 			allocateFrame.dispose();
		// 			NewbieSpecialActionMediator.completeCallback()
		// 			return;
		// 		}
		// 		NewbieSpecialActionMediator.pawnBtnClick();
		// 	}
		// 	else {
		// 		NewbieBaseActionMediator.cleanAll();
		// 	}
		// }
	}
	//////////////////////////////////////////////////////////////////////


	/////////////////////////////// 强化武器指引 ///////////////////////////////////////
	public static weaponIntensifyGuild(callback: Function, callArgs: Array<any>) {
		Logger.xjy("[NewbieBaseConditionMediator]强化武器指引")

		NewbieSpecialActionMediator.flag = 0
		NewbieSpecialActionMediator.callback = callback
		NewbieSpecialActionMediator.callargs = callArgs

		// NewbieBaseActionMediator.setKeyboardState(null, null, "0", 1);
		Laya.timer.frameLoop(1, NewbieSpecialActionMediator, NewbieSpecialActionMediator.__storeFrame)
		NewbieSpecialActionMediator.__setFlag(1);
	}

	private static __setFlag(value: number) {
		if (NewbieSpecialActionMediator.flag == value) return;
		NewbieSpecialActionMediator.flag = value;

		switch (NewbieSpecialActionMediator.flag) {
			case 1:
				var storeFrame = NewbieUtils.getFrame(EmWindow.Forge) as ForgeWnd;
				var cell: StoreBagCell = storeFrame.getWeaponItem();
				if (cell == null) {
					NewbieSpecialActionMediator.flag = 0;
					Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.__storeFrame)
					// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
					NewbieBaseActionMediator.cleanAll();
					NewbieSpecialActionMediator.completeCallback()
					return;
				}
				NewbieSpecialActionMediator.__gotoOneItem(cell, 4401);
				break;
			// case 2:
			// 	NewbieSpecialActionMediator.__gotoEquip();
			// 	break;
			case 3:
				NewbieSpecialActionMediator.__gotoIntenBtn();
				break;
		}
	}
	private static __gotoOneItem(cell: StoreBagCell, value: number) {//指向铁匠铺背包中的一个item
		if (cell.info.strengthenGrade > 1) {
			Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.__storeFrame)
			// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
			NewbieBaseActionMediator.cleanAll();
			this.completeCallback()
			return;
		}
		NewbieBaseActionMediator.cleanAll();
		NewbieBaseActionMediator.showMask();
		NewbieBaseActionMediator.createGuildFrame1("", -170, 70, value, "1", 4, cell.displayObject); //双击装备
		NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "2", -1, 0, 0, null, cell.displayObject);
	}
	private static __gotoEquip() {//指向装备框
		// var storeFrame = NewbieUtils.getFrame(EmWindow.Forge) as ForgeWnd;

		// // if (storeFrame) storeFrame["escEnable"] = false;
		// var cell: StoreIntensifyCell = storeFrame["_uiQiangHua"]["equip1"];
		// NewbieBaseActionMediator.cleanAll();
		// NewbieBaseActionMediator.createGuildFrame1("", -160, 40, 4401, "0", 4, cell.displayObject);
	}
	private static __gotoIntenBtn() {//指向强化按钮
		var storeFrame = NewbieUtils.getFrame(EmWindow.Forge) as ForgeWnd;

		var btn: any = storeFrame["_uiQiangHua"]["btnComp"];
		btn.callBackEx = () => {
			// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
			NewbieBaseActionMediator.cleanAll();
			this.completeCallback()
		};
		NewbieBaseActionMediator.cleanAll();
		NewbieBaseActionMediator.showMask();
		NewbieBaseActionMediator.createGuildFrame1("", -470, -250, 4402, "1", 1, btn.view.displayObject);
		NewbieBaseActionMediator.drawTargetOnMask(null, null, "", "1", -1, 0, 0, null, btn.view.displayObject);
	}

	private static __storeFrame(e: Event) {
		var storeFrame = NewbieUtils.getFrame(EmWindow.Forge) as ForgeWnd;

		if (!storeFrame || !storeFrame["_uiQiangHua"]) {
			Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.__storeFrame)
			// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 2);
			this.completeCallback()
			return;
		}
		if (NewbieSpecialActionMediator.flag == 0) {
			NewbieSpecialActionMediator.__setFlag(1);
		}
		// if (NewbieSpecialActionMediator.flag == 1) {
		// 	NewbieSpecialActionMediator.__setFlag(2);
		// }
		// if (NewbieSpecialActionMediator.flag == 2 && !storeFrame["_uiQiangHua"]["equip1"].info) {
		// 	NewbieSpecialActionMediator.__setFlag(1);
		// }
		if (storeFrame["_uiQiangHua"]["equip1"].info) {
			Laya.timer.clear(NewbieSpecialActionMediator, NewbieSpecialActionMediator.__storeFrame)
			NewbieSpecialActionMediator.__setFlag(3);
		}
	}

	////////////////////////////////////////////////////////////////////////////

	/**
	 * 引导步骤完成与重置
	 */
	private static flag: number = 0
	private static callback: Function
	private static callargs: any[]
	private static completeCallback(callback?: Function, callargs?: any[]) {
		if (callback) {
			NewbieUtils.execFunc(callback, callargs);
		} else {
			NewbieUtils.execFunc(NewbieSpecialActionMediator.callback, NewbieSpecialActionMediator.callargs);
		}

		if (NewbieSpecialActionMediator.callback) {
			NewbieSpecialActionMediator.flag = 0
			NewbieSpecialActionMediator.callback = null
			NewbieSpecialActionMediator.callargs = []
		}
	}

	private static tweenCompleteCall(targetObj: Object, disposeTarget: boolean, aniData: AnimationBaseData, releaseAni: boolean, callback: Function, callArgs: Array<any>) {
		TweenMax.killTweensOf(targetObj);
		if (disposeTarget) {
			ObjectUtils.disposeObject(targetObj); targetObj = null;
		}
		if (aniData) {
			AnimationHelper.clearAniCache(aniData, releaseAni)
		}
		NewbieSpecialActionMediator.completeCallback(callback, callArgs)
	}
}
