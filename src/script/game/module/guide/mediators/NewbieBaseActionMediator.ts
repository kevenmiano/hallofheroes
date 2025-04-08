// @ts-nocheck
import LangManager from '../../../../core/lang/LangManager';
import LayerMgr from '../../../../core/layer/LayerMgr';
import Logger from "../../../../core/logger/Logger";
import { EmLayer } from '../../../../core/ui/ViewInterface';
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { Avatar } from "../../../avatar/view/Avatar";
import { MapBaseAction } from "../../../battle/actions/MapBaseAction";
import { DisplayObject } from "../../../component/DisplayObject";
import NewbieEvent, { NotificationEvent, ObjectsEvent } from "../../../constant/event/NotificationEvent";
import { JobType } from "../../../constant/JobType";
import { IAction } from "../../../interfaces/IAction";
import { CampaignManager } from "../../../manager/CampaignManager";
import { GameBaseQueueManager } from "../../../manager/GameBaseQueueManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import SpaceManager from "../../../map/space/SpaceManager";
import { CampaignMapModel } from "../../../mvc/model/CampaignMapModel";
import { SwitchPageHelp } from "../../../utils/SwitchPageHelp";
import DialogManager from "../../dialog/DialogManager";
import HomeWnd from '../../home/HomeWnd';
import NewbieUtils from "../utils/NewbieUtils";
import { UIBarEvent } from '../../../constant/UIBarEvent';
import { NotificationManager } from '../../../manager/NotificationManager';
import Resolution from '../../../../core/comps/Resolution';
import { BattleManager } from '../../../battle/BattleManager';
import BuildingManager from '../../../map/castle/BuildingManager';
import { BuildInfo } from '../../../map/castle/data/BuildInfo';
import NewbieResizeUtils from '../utils/NewbieResizeUtils';
import { EmPackName, EmWindow } from '../../../constant/UIDefine';
import UIManager from '../../../../core/ui/UIManager';
import CasernWnd from '../../allocate/CasernWnd';
import SeminaryWnd from '../../castle/SeminaryWnd';
import StarWnd from '../../star/StarWnd';
import CastleScene from '../../../scene/CastleScene';
import CastleBuildingView from '../../../map/castle/view/layer/CastleBuildingView';
import SpaceTaskInfoWnd from '../../home/SpaceTaskInfoWnd';
import SmallMapWnd from '../../home/SmallMapWnd';
import SkillWnd from '../../skill/SkillWnd';
import OfferRewardWnd from '../../offerReward/OfferRewardWnd';
import { t_s_skilltemplateData } from '../../../config/t_s_skilltemplate';
import ConfigMgr from '../../../../core/config/ConfigMgr';
import { ConfigType } from '../../../constant/ConfigDefine';
import { ArmyManager } from '../../../manager/ArmyManager';
import { TempleteManager } from '../../../manager/TempleteManager';
import { BattleSkillItemII } from '../../battle/ui/skill/BattleSkillItemII';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import SkillWndCtrl from '../../skill/SkillWndCtrl';
import { StageReferance } from '../../../roadComponent/pickgliss/toplevel/StageReferance';
import { IconFactory } from '../../../../core/utils/IconFactory';
import { NoviceArrowView } from '../views/NoviceArrowView';
import NoviceFameCampaign from '../views/NoviceFameCampaign';
import NoviceFrame1 from '../views/NoviceFrame1';
import NoviceFrame4 from '../views/NoviceFrame4';
import { PlayerManager } from '../../../manager/PlayerManager';
import IBaseMouseEvent from '../../../map/space/interfaces/IBaseMouseEvent';
import { EquipContrastTips } from '../../../tips/EquipContrastTips';
import UIButton from '../../../../core/ui/UIButton';
import NewbieConfig from '../data/NewbieConfig';
import AllocateWnd from '../../allocate/AllocateWnd';
import AllocateItem from '../../allocate/AllocateItem';
import { SpaceDialogWnd } from '../../dialog/SpaceDialogWnd';
import UIHelper from '../../../utils/UIHelper';
import ForgeWnd from '../../forge/ForgeWnd';
import { WorldMapWnd } from '../../outercity/view/WorldMapWnd';
// import FarmScene from '../../../scene/FarmScene';
import FarmWnd from '../../farm/view/FarmWnd';
import PetWnd from '../../pet/view/PetWnd';
import { OuterCityManager } from '../../../manager/OuterCityManager';
import { OuterCityFieldTips } from '../../outercity/view/OuterCityFieldTips';
import { OuterCityOperateMenu } from '../../outercity/view/OuterCityOperateMenu';
import { OuterCityCastleInfoWnd } from '../../outercity/view/OuterCityCastleInfoWnd';
import { OuterCityFieldInfoWnd } from '../../outercity/view/OuterCityFieldInfoWnd';
import { CampaignArmyView } from '../../../map/campaign/view/physics/CampaignArmyView';
import { FriendWnd } from '../../friend/view/FriendWnd';
import { AddFriendsWnd } from '../../friend/view/AddFriendsWnd';
import { SRoleWnd } from '../../sbag/SRoleWnd';
import { CampaignSocketOutManager } from '../../../manager/CampaignSocketOutManager';
import NewbieModule, { NewbieZorder } from '../NewbieModule';
import { EmMainToolBarBtnLocationType } from '../../home/mainToolBar/EmMainToolBarBtnLocationType';
import ColosseumWnd from '../../pvp/colosseum/ColosseumWnd';


/**
 * 新手指引基本动作集
 */
export default class NewbieBaseActionMediator {
	private static _mask: DisplayObject;
	private static _guideContainer: DisplayObject;
	private static _interactionArea: DisplayObject;

	private static _guildFrameList: Array<any>;
	private static _guildArrowList: Array<any>;
	private static _moveEventArgs: Array<any>;
	private static _drawClickEventArgs: Array<any>;
	private static _colorEffect;
	private static _colorEventArgs: Array<any>;

	private static _drawContainer: DisplayObject;
	private static _createTarget: DisplayObject;
	private static _copyTarget: DisplayObject;

	/**
	 * 空指引
	 */
	public static emptyAction() {
		// Logger.warn("++新手: 执行了空指引");
	}

	/**
	 * 发送进入场景
	 * @param sceneId  场景id
	 * @param campaignId  地图id, 默认为0
	 */
	public static sendEnterScene(sceneId: number, campaignId: number = 0) {
		sceneId = Number(sceneId)
		campaignId = Number(campaignId)

		let type: string = SceneType.getSceneTypeById(sceneId);
		if (type == SceneManager.Instance.currentType) return;
		switch (type) {
			case SceneType.CASTLE_SCENE:
				SceneManager.Instance.setScene(type);
				break;
			case SceneType.SPACE_SCENE:
				SwitchPageHelp.enterToSpace();
				break;
			case SceneType.CAMPAIGN_MAP_SCENE:
				NewbieModule.Instance.sendEnterCampaign(campaignId);
				break;
			default:
				throw new Error("无此类型场景, type: " + type);
		}
	}

	/**
	 * 显示新手遮罩
	 * @param alpha  遮罩透明度
	 */
	public static showMask(alpha: number = 0.6) {
		alpha = Number(alpha)
		Logger.xjy("[NewbieBaseActionMediator]showMask  显示新手遮罩")
		// setKeyboardState(null, null, "0", 0);
		// ShowTipManager.Instance.removeAllTip();
		NotificationManager.Instance.dispatchEvent(UIBarEvent.HIDE_TASK_TRACE);
		if (!NewbieBaseActionMediator._guideContainer) {
			NewbieBaseActionMediator._guideContainer = new Laya.Sprite();
			NewbieBaseActionMediator._guideContainer.mouseEnabled = true;
			NewbieBaseActionMediator._guideContainer.mouseThrough = false;
			NewbieBaseActionMediator._guideContainer.cacheAs = "bitmap";
			LayerMgr.Instance.addToLayer(NewbieBaseActionMediator._guideContainer, EmLayer.NOVICE_LAYER);

			//绘制遮罩区, 含透明度, 可见游戏背景
			NewbieBaseActionMediator._mask = new Laya.Sprite();
			NewbieBaseActionMediator._mask.width = Resolution.gameWidth;
			NewbieBaseActionMediator._mask.height = Resolution.gameHeight;
			NewbieBaseActionMediator._mask.mouseEnabled = true;
			NewbieBaseActionMediator._mask.graphics.drawRect(0, 0, Resolution.gameWidth, Resolution.gameHeight, '#000000');
			NewbieBaseActionMediator._guideContainer.addChild(NewbieBaseActionMediator._mask);

			//绘制一个区域, 利用叠加模式, 从遮罩区域抠出可交互区
			NewbieBaseActionMediator._interactionArea = new Laya.Sprite();
			NewbieBaseActionMediator._interactionArea.blendMode = "destination-out";
			NewbieBaseActionMediator._guideContainer.addChild(NewbieBaseActionMediator._interactionArea);
			//临时放这里, 放其它地方, 会造成循环引用
			Laya.stage.off(Laya.Event.RESIZE, NewbieBaseActionMediator, NewbieBaseActionMediator.resize);
			Laya.stage.on(Laya.Event.RESIZE, NewbieBaseActionMediator, NewbieBaseActionMediator.resize);
		}
		NewbieBaseActionMediator._guideContainer.alpha = alpha;
		NewbieBaseActionMediator._guideContainer.hitArea = new Laya.Rectangle(0, 0, 1, 1);

		NewbieBaseActionMediator._guideContainer.visible = true
		PlayerManager.Instance.isExistNewbieMask = true;

		// 在任务界面升级导致的卡死问题 
		UIHelper.closeWindow(EmWindow.TaskWnd);
	}

	public static resize() {
		if (NewbieBaseActionMediator._guideContainer && NewbieBaseActionMediator._mask) {
			NewbieBaseActionMediator._mask.graphics.clear();
			NewbieBaseActionMediator._mask.width = Resolution.gameWidth;
			NewbieBaseActionMediator._mask.height = Resolution.gameHeight;
			NewbieBaseActionMediator._mask.mouseEnabled = true;
			NewbieBaseActionMediator._mask.graphics.drawRect(0, 0, Resolution.gameWidth, Resolution.gameHeight, '#000000');
		}
		this.resetMask();
	}

	/**
	 * 在遮罩上绘制显示目标对象
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param $targetArgs  目标对象参数
	 * @param $needWaitOper  绘完后是否需要等待玩家点击: 0不需要  1需要单击  2需要双击
	 * @param $showLayer  显示层, 默认为-1, 遮罩层
	 * @param $offsetX  绘制对象的偏移X, 默认为0
	 * @param $offsetY  绘制对象的偏移Y, 默认为0
	 * @param $eventTarget  事件对象参数, 默认取目标对象$targetArgs
	 */
	public static drawTargetOnMask(callback: Function, callArgs, $targetArgs: string, $needWaitOper: string, $showLayer: number = -1, $offsetX: number = 0, $offsetY: number = 0, $eventTarget: string = null, $targetObj: DisplayObject = null) {
		Logger.xjy("[NewbieBaseActionMediator]drawTargetOnMask  在遮罩上绘制显示目标对象")
		$showLayer = Number($showLayer)
		$offsetX = Number($offsetX)
		$offsetY = Number($offsetY)

		if (!NewbieBaseActionMediator._mask) {
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}
		let targetObj: DisplayObject;
		if ($targetObj) {
			targetObj = $targetObj;
		}
		else {
			targetObj = NewbieBaseActionMediator.getGuildTarget($targetArgs);
		}
		if (!targetObj) {
			Logger.xjy("[NewbieBaseActionMediator]drawTargetOnMask  对象获取错误 $targetArgs=", $targetArgs, "$needWaitOper=", $needWaitOper)
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}
		if (!NewbieBaseActionMediator._drawContainer) {
			NewbieBaseActionMediator._drawContainer = new DisplayObject();
			NewbieBaseActionMediator._drawContainer.name = "NewbieBaseActionMediator._drawContainer"
			NewbieBaseActionMediator._drawContainer.mouseEnabled = true;
			NewbieBaseActionMediator._drawContainer.mouseThrough = false;

			LayerMgr.Instance.addToLayer(NewbieBaseActionMediator._drawContainer, EmLayer.NOVICE_LAYER);
		} else {
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.CLICK, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.DOUBLE_CLICK, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.ROLL_OVER, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.ROLL_OUT, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.MOUSE_OVER, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.MOUSE_OUT, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.MOUSE_DOWN, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.off(Laya.Event.MOUSE_UP, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawClickEventArgs = null;
			NewbieBaseActionMediator.cleanDrawContainer();
		}
		// switch ($showLayer) {
		// 	case EmLayer.NOVICE_LAYER:
		// 		LayerMgr.Instance.addToLayer(NewbieBaseActionMediator._drawContainer, EmLayer.NOVICE_LAYER);
		// 		break;
		// 	default:
		// 		if (!NewbieBaseActionMediator._drawContainer.parent || NewbieBaseActionMediator._drawContainer.parent != NewbieBaseActionMediator._mask) {
		// 			NewbieBaseActionMediator._mask.addChild(NewbieBaseActionMediator._drawContainer);
		// 		}
		// }
		let needWaitOper: boolean = ($needWaitOper == "1") || ($needWaitOper == "2");
		let needWaitDoubleClick: boolean = ($needWaitOper == "2");
		let targetSize: any = NewbieBaseActionMediator.getTargetObjSize(targetObj);

		let gPt = NewbieBaseActionMediator.localToGlobal(targetObj, new Laya.Point(0, 0))
		gPt.x += $offsetX
		gPt.y += $offsetY

		NewbieBaseActionMediator._drawContainer.zOrder = NewbieZorder.DrawContainer;
		NewbieBaseActionMediator._drawContainer.pos(gPt.x, gPt.y)
		NewbieBaseActionMediator._drawContainer.width = targetSize.w
		NewbieBaseActionMediator._drawContainer.height = targetSize.h
		// NewbieBaseActionMediator._drawContainer.graphics.clear();
		// NewbieBaseActionMediator._drawContainer.graphics.drawRect(0, 0, targetSize.w, targetSize.h, "#ff0000");

		NewbieBaseActionMediator._interactionArea.graphics.clear();
		NewbieBaseActionMediator._interactionArea.graphics.drawRect(gPt.x, gPt.y, targetSize.w, targetSize.h, "#000000");

		// NewbieBaseActionMediator._hitArea.unHit.clear();
		// NewbieBaseActionMediator._hitArea.unHit.drawRect(gPt.x, gPt.y, targetSize.w, targetSize.h, "#000000");
		NewbieBaseActionMediator._guideContainer.hitArea = new Laya.Rectangle(gPt.x, gPt.y, targetSize.w, targetSize.h);


		if ($offsetX == 0 && $offsetY == 0) {
			NewbieResizeUtils.addTarget(NewbieBaseActionMediator._drawContainer, targetObj);
		}
		else {
			NewbieResizeUtils.addTarget(NewbieBaseActionMediator._drawContainer, targetObj, new Laya.Point($offsetX, $offsetY));
		}

		// 给遮罩添加点击
		if (needWaitOper) {
			if ($eventTarget != null && $eventTarget != "") {
				let eventTarget: DisplayObject = NewbieBaseActionMediator.getGuildTarget($eventTarget);
				NewbieBaseActionMediator._drawClickEventArgs = [eventTarget, callback, callArgs];
			}
			else {
				NewbieBaseActionMediator._drawClickEventArgs = [targetObj, callback, callArgs];
			}
			if (needWaitDoubleClick) {
				NewbieBaseActionMediator._drawContainer.on(Laya.Event.DOUBLE_CLICK, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			} else {
				NewbieBaseActionMediator._drawContainer.on(Laya.Event.CLICK, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			}
			NewbieBaseActionMediator._drawContainer.on(Laya.Event.ROLL_OVER, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.on(Laya.Event.ROLL_OUT, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.on(Laya.Event.MOUSE_OVER, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.on(Laya.Event.MOUSE_OUT, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.on(Laya.Event.MOUSE_DOWN, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
			NewbieBaseActionMediator._drawContainer.on(Laya.Event.MOUSE_UP, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
		}
		else {
			NewbieUtils.execFunc(callback, callArgs);
		}
	}

	private static __onDrawTargetMouseEvent(e: Laya.Event) {
		if (!e) return;
		switch (e.type) {
			case Laya.Event.CLICK:
				if (NewbieBaseActionMediator._drawContainer) NewbieBaseActionMediator._drawContainer.off(Laya.Event.CLICK, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
				if (NewbieBaseActionMediator._drawClickEventArgs) {
					NewbieBaseActionMediator.dispatchAllChildEvent(NewbieBaseActionMediator._drawClickEventArgs[0], e);
					NewbieUtils.execFunc(NewbieBaseActionMediator._drawClickEventArgs[1], NewbieBaseActionMediator._drawClickEventArgs[2]);
					NewbieBaseActionMediator._drawClickEventArgs = null;

					NewbieBaseActionMediator.resetMask();
				}
				break;
			case Laya.Event.DOUBLE_CLICK:
				if (NewbieBaseActionMediator._drawContainer) NewbieBaseActionMediator._drawContainer.off(Laya.Event.DOUBLE_CLICK, NewbieBaseActionMediator, NewbieBaseActionMediator.__onDrawTargetMouseEvent);
				if (NewbieBaseActionMediator._drawClickEventArgs) {
					NewbieBaseActionMediator.dispatchAllChildEvent(NewbieBaseActionMediator._drawClickEventArgs[0], e);
					NewbieUtils.execFunc(NewbieBaseActionMediator._drawClickEventArgs[1], NewbieBaseActionMediator._drawClickEventArgs[2]);
					NewbieBaseActionMediator._drawClickEventArgs = null;

					NewbieBaseActionMediator.resetMask();
				}
			default:
				if (NewbieBaseActionMediator._drawClickEventArgs) {
					NewbieBaseActionMediator.dispatchAllChildEvent(NewbieBaseActionMediator._drawClickEventArgs[0], e);
				}
		}
	}

	private static dispatchAllChildEvent(disObj: any, e: Laya.Event) {
		if (disObj == null) return;

		if (disObj['IBaseMouseEvent']) {
			e.currentTarget = disObj
			if (e.type == Laya.Event.CLICK) {
				(disObj as IBaseMouseEvent).mouseClickHandler(e);
			}
			if (disObj.hasListener(e.type)) {
				disObj.event(e.type, e);
			}
			return;
		}

		if (disObj instanceof fgui.GObject) {
			if (!disObj.displayObject) return;
			e.currentTarget = disObj.displayObject
			if (disObj.displayObject.hasListener(e.type)) {
				disObj.displayObject.event(e.type, e);
				return;
			}
		} else {
			if (disObj.hasListener(e.type)) {
				disObj.event(e.type, e);
				return;
			}
		}

		if (disObj instanceof DisplayObject) {
			let disContainer: DisplayObject = disObj as DisplayObject;
			let childNum: number = disContainer.numChildren;
			for (let i: number = 0; i < childNum; i++) {
				NewbieBaseActionMediator.dispatchAllChildEvent(disContainer.getChildAt(i) as DisplayObject, e);
			}
		}
	}

	/**
	 * 隐藏新手遮罩
	 */
	public static hideMask() {
		NewbieBaseActionMediator.resetMask()
		NotificationManager.Instance.dispatchEvent(UIBarEvent.SHOW_TASK_TRACE);
		// NewbieBaseActionMediator.setKeyboardState(null, null, "1", 0);
		if (NewbieBaseActionMediator._guideContainer) {
			NewbieBaseActionMediator._guideContainer.visible = false
		}
		// if (NewbieBaseActionMediator._mask && NewbieBaseActionMediator._mask.parent) NewbieBaseActionMediator._mask.parent.removeChild(NewbieBaseActionMediator._mask);
		PlayerManager.Instance.isExistNewbieMask = false;
	}

	/**
	 * 清除遮罩上的绘制
	 */
	public static cleanDrawContainer() {
		if (!NewbieBaseActionMediator._drawContainer) return;
		Logger.xjy("[NewbieBaseActionMediator]cleanDrawContainer")
		NewbieBaseActionMediator._drawContainer.width = 0
		NewbieBaseActionMediator._drawContainer.height = 0
		ObjectUtils.disposeAllChildren(NewbieBaseActionMediator._drawContainer)
		NewbieBaseActionMediator._drawContainer.removeChildren()
	}

	/**
	 * 存在新手遮罩
	 */
	public static get isExistNewbieMask() {
		Logger.xjy("[NewbieBaseActionMediator]isExistNewbieMask", PlayerManager.Instance.isExistNewbieMask)
		return PlayerManager.Instance.isExistNewbieMask;
	}

	/**
	 * 清除抠出来的可见区域
	 */
	public static resetMask() {
		if (!NewbieBaseActionMediator._drawContainer) return;
		Logger.xjy("[NewbieBaseActionMediator]resetMask")
		NewbieBaseActionMediator._interactionArea.graphics.clear();
		NewbieBaseActionMediator._guideContainer.hitArea = new Laya.Rectangle(0, 0, Resolution.gameWidth, Resolution.gameHeight);
	}

	/**
	 * 显示对话
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param id  对话id
	 */
	public static showDialog(callback: Function, callArgs, id: string) {
		DialogManager.showDialog(callback, id);
	}

	/**
	 * 播放地图名动画
	 * @param callback  回调
	 * @param callArgs  回调参数
	 */
	public static showMapName(callback: Function, callArgs) {
		// TODO Newbie jeremy.xu  播放地图名动画
		Logger.xjy("[NewbieBaseActionMediator]TODO  播放地图名动画")
		// let mapTemp: MapTemplate = CampaignManager.Instance.mapModel ? CampaignManager.Instance.mapModel.mapTempInfo : null;
		// if (mapTemp) {
		// 	new MapNameMovie(callback).loadIcon(mapTemp.MapFileId);
		// }
	}

	/**
	 * 移动NPC（寻路）
	 * @param $npcId  npcId（0为自己）
	 * @param $beginX  起始X（-1为当前位置）
	 * @param $beginY  起始Y（-1为当前位置）
	 * @param $endX  终点X
	 * @param $endY  终点Y
	 * @param $completeWhenWalkOver  是否走完才完成此动作
	 */
	public static moveNPC(callback: Function, callArgs, $npcId: number, $beginX: number, $beginY: number, $endX: number, $endY: number, $completeWhenWalkOver: string = "0") {
		$npcId = Number($npcId);
		$beginX = Number($beginX);
		$beginY = Number($beginY);
		$endX = Number($endX);
		$endY = Number($endY);

		let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!mapModel) {
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}
		let npcView;
		if ($npcId <= 0) {
			npcView = CampaignManager.Instance.controller.getArmyView(mapModel.selfMemberData);
		}
		else {
			npcView = mapModel.getNodeByNodeId($npcId);
		}
		if (!npcView) {
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}

		// 都传-1表示停止npc
		let beginX: number = Math.floor(($beginX == -1 ? npcView.x / 20 : $beginX));
		let beginY: number = Math.floor(($beginY == -1 ? npcView.y / 20 : $beginY));
		let endX: number = Math.floor(($endX == -1 ? npcView.x / 20 : $endX));
		let endY: number = Math.floor(($endY == -1 ? npcView.y / 20 : $endY));

		let paths: Array<any> = CampaignManager.Instance.controller.findPath.find(new Laya.Point(beginX, beginY), new Laya.Point(endX, endY));
		let completeWhenWalkOver: boolean = ($completeWhenWalkOver == "1");
		if (completeWhenWalkOver) {
			NewbieBaseActionMediator._moveEventArgs = [callback, callArgs];
			npcView.on(ObjectsEvent.WALK_OVER, NewbieBaseActionMediator, NewbieBaseActionMediator.__armyWalkOverHandler);
			npcView["info"].pathInfo = paths;
		}
		else {
			npcView["info"].pathInfo = paths;
			NewbieUtils.execFunc(callback, callArgs);
		}
	}

	private static __armyWalkOverHandler(target: any) {
		(target as Laya.Sprite).off(ObjectsEvent.WALK_OVER, NewbieBaseActionMediator, NewbieBaseActionMediator.__armyWalkOverHandler);
		if (NewbieBaseActionMediator._moveEventArgs) {
			NewbieUtils.execFunc(NewbieBaseActionMediator._moveEventArgs[0], NewbieBaseActionMediator._moveEventArgs[1]);
			NewbieBaseActionMediator._moveEventArgs = null;
		}
	}

	/**
	 * 任务追踪闪烁
	 * @param callback  回调
	 * @param callArgs  回调参数
	 */
	public static taskTraceItemShine(callback: Function, callArgs) {
		Logger.xjy("[NewbieBaseActionMediator]taskTraceItemShine 任务追踪闪烁")
		let taskTraceView = NewbieUtils.getFrame(EmWindow.SpaceTaskInfoWnd) as SpaceTaskInfoWnd;
		if (!taskTraceView) {
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}

		taskTraceView.novicShine(callback, callArgs);
	}


	/**
	 * 设置任务追踪箭头指引
	 * @param state  状态（1显示, 0隐藏）
	 * @param tip  指引内容
	 * @param taskTempId  任务模板id, 如有配置会滚动到该任务
	 */
	public static setTaskArrowGuild(callback: Function, callArgs, $state: number, value: number = 0, taskTempId: number = 0) {
		Logger.xjy("[NewbieBaseActionMediator]setTaskArrowGuild 设置任务追踪箭头指引")
		$state = Number($state)
		value = Number(value)
		taskTempId = Number(taskTempId)
		let tip: string = NewbieBaseActionMediator.getContentByValue(value);
		let taskTraceView = NewbieUtils.getFrame(EmWindow.SpaceTaskInfoWnd) as SpaceTaskInfoWnd;
		NotificationManager.Instance.sendNotification(NewbieEvent.ARROW_STATE, { type: $state, tip: tip, callback: callback, callArgs: callArgs });
		if (taskTempId > 0 && taskTraceView) {
			taskTraceView.scrollToItemByTaskTempId(taskTempId);
			taskTraceView.setArrowPosByTaskTempId(taskTempId);
		}
	}

	/**
	 * 任务栏收缩
	 * @param state  状态（1显示, 0隐藏）
	 */
	public static showTaskWnd(callback: Function, callArgs, $state: number) {
		$state = Number($state)
		NotificationManager.Instance.sendNotification(NotificationEvent.TASKWND_VISIBLE, { visible: Boolean($state), callback: callback, callArgs: callArgs });
	}

	/**
	 * 移动焦点到农场建筑
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param buildType  建筑sontype
	 * @param isTween    是否缓动
	 * @param tweenTime  移动时间
	 */
	public static moveFocusToFarmBuild(callback: Function, callArgs, buildType: number, isTween: string = "1", tweenTime: number = 500) {
		buildType = Number(buildType)
		tweenTime = Number(tweenTime)
		// let curScene = SceneManager.Instance.currentScene as FarmScene  TODO
		// if (curScene.view) {
		// 	curScene.view.moveBuildToCenter(buildType, isTween == "1", tweenTime, callback, callArgs)
		// } else {
		// 	NewbieUtils.execFunc(callback, callArgs);
		// }
	}

	/**
	 * 移动焦点到内城建筑
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param buildType  建筑sontype
	 * @param isTween    是否缓动
	 * @param tweenTime  移动时间
	 */
	public static moveFocusToCastleBuild(callback: Function, callArgs, buildType: number, isTween: string = "1", tweenTime: number = 500) {
		buildType = Number(buildType)
		tweenTime = Number(tweenTime)
		let curScene = SceneManager.Instance.currentScene as CastleScene
		if (curScene.castleMap) {
			curScene.castleMap.moveBuildToCenter(buildType, isTween == "1", tweenTime, callback, callArgs)
		} else {
			NewbieUtils.execFunc(callback, callArgs);
		}
	}

	/**
	 * 内城建筑闪烁
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param buildType  建筑sontype
	 */
	public static castleBuildShine(callback: Function, callArgs, buildType: number) {
		if (NewbieBaseActionMediator._colorEventArgs) {
			NewbieUtils.execFunc(callback, callArgs);
			NewbieBaseActionMediator._colorEventArgs = null;
		}
		// TODO Newbie jeremy.xu  内城建筑闪烁
		Logger.xjy("[NewbieBaseActionMediator]TODO  内城建筑闪烁")

		buildType = Number(buildType)
		// NewbieBaseActionMediator._colorEventArgs = [callback, callArgs];
		// let bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(buildType);

		// let bView: CastleBuildingView 
		// let curScene = SceneManager.Instance.currentScene as CastleScene
		// if (curScene.castleMap) {
		// 	bView = curScene.castleMap.buildingsDic.get(bInfo.buildingId);
		// }
		// if(!bView){
		// 	return null
		// }

		// if (NewbieBaseActionMediator._colorEffect) {
		// 	NewbieBaseActionMediator._colorEffect.removeEventListener(Laya.Event.COMPLETE, NewbieBaseActionMediator.__colorEffectCompleteHandler);
		// 	NewbieBaseActionMediator._colorEffect = null;
		// }
		// NewbieBaseActionMediator._colorEffect = new ColorManager(bView.curView);
		// NewbieBaseActionMediator._colorEffect.addEventListener(Laya.Event.COMPLETE, NewbieBaseActionMediator.__colorEffectCompleteHandler);
	}

	private static __colorEffectCompleteHandler(e: Event) {
		if (NewbieBaseActionMediator._colorEffect) {
			NewbieBaseActionMediator._colorEffect.removeEventListener(Laya.Event.COMPLETE, NewbieBaseActionMediator.__colorEffectCompleteHandler);
			NewbieBaseActionMediator._colorEffect = null;
		}
		if (NewbieBaseActionMediator._colorEventArgs) {
			NewbieUtils.execFunc(NewbieBaseActionMediator._colorEventArgs[0], NewbieBaseActionMediator._colorEventArgs[1]);
			NewbieBaseActionMediator._colorEventArgs = null;
		}
	}

	/**
	 * 创建指引对话框1（带蒂娜头像, tragetObj会发光）
	 * @param targetArgs  目标对象参数
	 * @param relativeX  相对targetObj的X坐标
	 * @param relativeY  相对targetObj的Y坐标
	 * @param content  对话框内容
	 * @param isShineTarget  目标对象是否闪烁
	 * @param arrowDirection  箭头方向（0为不带箭头）
	 */
	public static Frame1Width = 480
	public static Frame1Height = 200
	public static createGuildFrame1(targetArgs: string, relativeX: number, relativeY: number, value: number = 0, isShineTarget: string = "1", arrowDirection: number = 0, $targetObj: DisplayObject = null) {
		relativeX = Number(relativeX)
		relativeY = Number(relativeY)
		value = Number(value)
		arrowDirection = Number(arrowDirection)

		let targetObj: DisplayObject;
		let content: string = NewbieBaseActionMediator.getContentByValue(value);
		if ($targetObj) {
			targetObj = $targetObj;
		}
		else {
			targetObj = NewbieBaseActionMediator.getGuildTarget(targetArgs);
		}
		if (!targetObj) {
			Logger.error("[NewbieBaseActionMediator]createGuildFrame1 目标对象获取错误", targetArgs)
			return;
		}

		let frame: NoviceFrame1 = new NoviceFrame1(content, arrowDirection);
		if (isShineTarget == "1") {
			frame.btnEffect(targetObj);
		}
		NewbieBaseActionMediator.addToGuildFrameList(frame);
		LayerMgr.Instance.addToLayer(frame, EmLayer.NOVICE_LAYER);
		NewbieResizeUtils.addTarget(frame, targetObj, new Laya.Point(relativeX, relativeY));
		frame.showTween();

		// 新手配置的位置是以左上角来算的, 锚点换了所以做一下转换
		let anchorOffsetX = NewbieBaseActionMediator.Frame1Width * 0.1
		let anchorOffsetY = NewbieBaseActionMediator.Frame1Height * 0.2

		let pos = NewbieBaseActionMediator.localToGlobal(targetObj, new Laya.Point(0, 0))
		frame.pos(pos.x + relativeX + anchorOffsetX, pos.y + relativeY + anchorOffsetY, true)
		return frame
	}

	/**
	 * 创建指引对话框2（不带蒂娜头像）
	 * @param targetArgs  目标对象参数
	 * @param relativeX  相对targetObj的X坐标
	 * @param relativeY  相对targetObj的Y坐标
	 * @param content  对话框内容
	 * @param isShineTarget  目标对象是否闪烁
	 */
	public static createGuildFrame2(targetArgs: string, relativeX: number, relativeY: number, value: number = 0, type: number = 0, isShineTarget: string = "0", appendFuncTargetArgs: string = "", autoCloseTime: number = 0) {
		relativeX = Number(relativeX)
		relativeY = Number(relativeY)
		value = Number(value)
		type = Number(type)
		autoCloseTime = Number(autoCloseTime)

		let targetObj: DisplayObject = NewbieBaseActionMediator.getGuildTarget(targetArgs);
		if (!targetObj) {
			Logger.error("[NewbieBaseActionMediator]createGuildFrame2 目标对象获取错误", targetArgs)
			return;
		}

		if (Resolution.scaleFixWidth) {
			relativeY *= Resolution.screenScaleH;
		}

		let frame: NoviceFameCampaign = new NoviceFameCampaign();
		let tempSkillName: string = NewbieBaseActionMediator.getJobSkillTempName(ArmyManager.Instance.thane.templateInfo.Job);

		let content: string = NewbieBaseActionMediator.getContentByValue(value);
		if (type == 1) {
			content = LangManager.Instance.GetTranslation("newbie.newbieBaseActionMediator.getSkill", tempSkillName)
		}
		if (type == 2) {
			content = LangManager.Instance.GetTranslation("newbie.newbieBaseActionMediator.clickUseSkill", tempSkillName);
		}
		let pos = NewbieBaseActionMediator.localToGlobal(targetObj, new Laya.Point(0, 0))
		frame.pos(pos.x + relativeX, pos.y + relativeY, true)
		frame.setText(content);
		frame.showTween();
		NewbieBaseActionMediator.addToGuildFrameList(frame);
		LayerMgr.Instance.addToLayer(frame, EmLayer.NOVICE_LAYER);
		NewbieResizeUtils.addTarget(frame, targetObj, new Laya.Point(relativeX, relativeY));

		if (autoCloseTime > 0) {
			frame.setAutoClose(autoCloseTime)
		}
		if (isShineTarget == "1") {
			frame.btnEffect(targetObj)
		}
		if (appendFuncTargetArgs) {
			let appendFuncTargetObj = NewbieBaseActionMediator.getAppendFuncTarget(appendFuncTargetArgs);
			if (appendFuncTargetObj) {
				appendFuncTargetObj.noviceFunc = () => {
					LayerMgr.Instance.removeByLayer(frame, EmLayer.NOVICE_LAYER);
					appendFuncTargetObj.noviceFunc = null;
				}
			} else {
				Logger.error("[NewbieBaseActionMediator]createGuildFrame2 目标对象2获取错误", appendFuncTargetArgs)
			}
		}

		// if (isClickTargetClose == "1") {
		// 	pos.x -= frame.x
		// 	pos.y -= frame.y
		// 	frame.setClickTargetCloseBtn(targetObj, pos);
		// }
	}

	public static createGuildFrame2CallBack(frame: NoviceFameCampaign) {
		LayerMgr.Instance.removeByLayer(frame, EmLayer.NOVICE_LAYER);
	}

	/**
	 * 创建指引对话框4（内城建筑说明框）锚点设置在中间
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param relativeX  相对targetObj的X坐标
	 * @param relativeY  相对targetObj的Y坐标
	 * @param value  对话框内容
	 */
	public static createGuildFrame4(callback: Function, callArgs, targetArgs: string, relativeX: number, relativeY: number, value: number, isShineTarget: string = "0") {
		relativeX = Number(relativeX)
		relativeY = Number(relativeY)
		value = Number(value)

		let content = NewbieBaseActionMediator.getIntroduceByValue(value)
		let frame: NoviceFrame4 = new NoviceFrame4(content, callback, callArgs);
		frame.zOrder = NewbieZorder.Frame4;
		NewbieBaseActionMediator.addToGuildFrameList(frame);
		LayerMgr.Instance.addToLayer(frame, EmLayer.NOVICE_LAYER);


		let needScale = 1
		if (Resolution.scaleFixWidth) {
			needScale = 0.95
			frame.scale(needScale, needScale);
		}
		let frameW = frame.view.width * needScale
		let frameH = frame.view.height * needScale

		let pos = new Laya.Point(Resolution.gameWidth / 2, Resolution.gameHeight / 2);
		let targetObj: DisplayObject = NewbieBaseActionMediator.getGuildTarget(targetArgs);
		if (targetObj) {
			if (isShineTarget == "1") {
				frame.btnEffect(targetObj);
			}
			pos = NewbieBaseActionMediator.localToGlobal(targetObj, new Laya.Point(0, 0));
			let posX = pos.x + relativeX * needScale;
			let posY = pos.y + relativeY * needScale;
			if (posY + frameH / 2 > Resolution.gameHeight) {
				posY = Resolution.gameHeight - frameH / 2;
			}
			if (posX - frameW / 2 < 0) {
				posX = frameW / 2;
			}
			frame.pos(posX, posY, true);
		} else {
			frame.pos(pos.x, pos.y, true);
		}
	}

	/**
	 * 创建指引箭头1
	 * @param targetArgs  目标对象参数
	 * @param relativeX  相对targetObj的X坐标
	 * @param relativeY  相对targetObj的Y坐标
	 * @param direction  箭头方向
	 * @param content  箭头内容
	 */
	public static createGuildArrow1(targetArgs: string, relativeX: number, relativeY: number, direction: number, value: number = 0, addToTarget: number = 0) {
		relativeX = Number(relativeX)
		relativeY = Number(relativeY)
		direction = Number(direction)
		addToTarget = Number(addToTarget)

		let targetObj: DisplayObject = NewbieBaseActionMediator.getGuildTarget(targetArgs);
		if (!targetObj) {
			Logger.error("[NewbieBaseActionMediator]createGuildArrow1 目标对象获取错误", targetArgs)
			return;
		}

		let content: string = NewbieBaseActionMediator.getContentByValue(value);

		let arrow: NoviceArrowView = new NoviceArrowView(direction, content, true, null);
		NewbieBaseActionMediator.addToGuildArrowList(arrow);
		let pos: Laya.Point = new Laya.Point(0, 0);
		if (addToTarget) {
			targetObj.addChild(arrow);
		} else {
			pos = NewbieBaseActionMediator.localToGlobal(targetObj, new Laya.Point(0, 0))
			LayerMgr.Instance.addToLayer(arrow, EmLayer.NOVICE_LAYER);
		}
		arrow.showTween();
		arrow.pos(pos.x + relativeX, pos.y + relativeY, true)
		return arrow
	}

	/**
	 * 转换到全局坐标系
	 */
	public static localToGlobal(targetObj: DisplayObject | fgui.GComponent, srcPos: Laya.Point): Laya.Point {
		let gPt: Laya.Point
		if (targetObj instanceof fgui.GObject) {
			gPt = (targetObj as fgui.GObject).displayObject.localToGlobal(new Laya.Point(0, 0), false, Laya.stage)
		} else {
			gPt = targetObj.localToGlobal(new Laya.Point(0, 0), false, Laya.stage)
		}
		return gPt
	}

	/**
	 * 清除所有（遮罩、遮罩上的绘制、指引对话框等）
	 */
	public static cleanAll() {
		NewbieBaseActionMediator.cleanCreateTarget();
		NewbieBaseActionMediator.cleanDrawContainer();
		NewbieBaseActionMediator.cleanGuildArrow();
		NewbieBaseActionMediator.cleanGuildFrame();
		NewbieBaseActionMediator.hideMask();
	}

	/**
	 * 清除指引箭头
	 */
	public static cleanGuildArrow() {
		if (NewbieBaseActionMediator._guildArrowList) {
			NewbieBaseActionMediator._guildArrowList.forEach(disObj => {
				disObj.dispose();
				LayerMgr.Instance.removeByLayer(disObj, EmLayer.NOVICE_LAYER)
			});
			NewbieBaseActionMediator._guildArrowList.length = 0;
		}
	}

	/**
	 * 清除指引对话框
	 */
	public static cleanGuildFrame() {
		if (NewbieBaseActionMediator._guildFrameList) {
			NewbieBaseActionMediator._guildFrameList.forEach(disObj => {
				disObj.dispose();
				LayerMgr.Instance.removeByLayer(disObj, EmLayer.NOVICE_LAYER)
			});
			NewbieBaseActionMediator._guildFrameList.length = 0;
		}
	}

	public static addToGuildFrameList($frame: DisplayObject) {
		if (!NewbieBaseActionMediator._guildFrameList) {
			NewbieBaseActionMediator._guildFrameList = [];
		}
		NewbieBaseActionMediator._guildFrameList.push($frame);
	}

	private static addToGuildArrowList($arrow: DisplayObject) {
		if (!NewbieBaseActionMediator._guildArrowList) {
			NewbieBaseActionMediator._guildArrowList = [];
		}
		NewbieBaseActionMediator._guildArrowList.push($arrow);
	}

	/**
	 * 对目标执行tween动画
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param targetArgs  目标对象参数
	 * @param duration  持续时间（秒）
	 * @param args  动画参数
	 * @param isFrom  是否反转动画
	 * @param referTargetArgs  参照对象参数, 默认为空
	 * @param relativeX  相对参照对象的X坐标, 默认为0
	 * @param relativeY  相对参照对象的Y坐标, 默认为0
	 */
	public static tweenTarget(callback: Function, callArgs, targetArgs: string, duration: number, args: string, isFrom: string = "0", referTargetArgs: string = "", relativeX: number = 0, relativeY: number = 0) {
		relativeX = Number(relativeX)
		relativeY = Number(relativeY)
		duration = Number(duration)

		let targetObj: DisplayObject = NewbieBaseActionMediator.getGuildTarget(targetArgs);
		let referTarget: DisplayObject = NewbieBaseActionMediator.getGuildTarget(referTargetArgs);
		let argsObj: any = NewbieUtils.stringToObject(args);
		argsObj["onComplete"] = NewbieBaseActionMediator.tweenCompleteCall;
		argsObj["onCompleteParams"] = [targetObj, false, callback, callArgs];
		if (referTarget && referTarget.parent) {
			let p = (referTarget.parent as DisplayObject).localToGlobal(new Laya.Point(referTarget.x, referTarget.y));
			p = (targetObj.parent as DisplayObject).globalToLocal(p);
			if (argsObj.x) argsObj.x = p.x + relativeX;
			if (argsObj.y) argsObj.y = p.y + relativeY;
		}
		if (isFrom == "1") {
			TweenMax.from(targetObj, duration, argsObj);
		}
		else {
			let targetArgs = { x: targetObj.x, y: targetObj.y }
			Logger.xjy("[NewbieBaseActionMediator]tweenTarget", targetArgs.x, targetArgs.y)
			TweenMax.to(targetObj, duration, argsObj);
		}
	}

	public static tweenCompleteCall(targetObj: Object, disposeTarget: boolean, callback: Function, callArgs: Array<any>) {
		TweenMax.killTweensOf(targetObj);
		if (disposeTarget) {
			ObjectUtils.disposeObject(targetObj); targetObj = null;
		}
		NewbieUtils.execFunc(callback, callArgs);
	}

	/**
	 * 控制当前战斗状态
	 * @param isPause  是否暂停当前战斗
	 */
	public static controlBattleState($isPause: string) {
		let isPause: boolean = ($isPause == "1");
		if (isPause) {
			NewbieModule.Instance.sendBattlePause();
		}
		else {
			NewbieModule.Instance.sendBattleContinue();
		}
	}

	/**
	 * 设置主工具条按钮
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param $showArgs  初始显示的按钮, 参数格式如"1_2_3"
	 * @param $addShow  需添加显示的按钮, 参数格式如"4"
	 * @param $aniType  功能开启动画类型 0不做动画 1移动
	 */
	public static setMainToolBarBtn(callback: Function, callArgs: Array<any>, $showArgs: string = null, $addShow: number = 0, $aniType: number = 1) {
		$addShow = Number($addShow);
		$aniType = Number($aniType);
		let mainToolBar = HomeWnd.Instance.getMainToolBar();
		let showArgs: any[] = ($showArgs && $showArgs != "" ? $showArgs.split("_") : null);
		if (!showArgs) return;

		let btnDataList = mainToolBar.model.getBtnDataListByLocaltionType()
		for (let index = 0; index < btnDataList.length; index++) {
			let btnData = btnDataList[index];
			btnData.open = showArgs.indexOf(String(btnData.buttonType)) != -1;
		}
		mainToolBar.refreshBtnView()
		
		if ($addShow <= 0) {
			mainToolBar.refreshBtnPos();
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}
		
		if (mainToolBar.bFold) {
			mainToolBar.playAction(0)
		}
		// mark by jeremy 竖行暂时不支持做动画
		let addBtnData = mainToolBar.model.getBtnDataByButtonType($addShow)
		if (addBtnData.locationType != EmMainToolBarBtnLocationType.Cow) {
			mainToolBar.refreshBtnPos();
			let btn = mainToolBar.createButtonByType($addShow);
			addBtnData.open = true;
			mainToolBar.doMoveBtn(btn, true, NewbieBaseActionMediator.playBtnEffect, [btn.view, callback, callArgs]);
		} else {
			let btn = mainToolBar.createButtonByType($addShow);
			addBtnData.open = true;
			// 把新加入的直接创建并显示
			mainToolBar.refreshBtnView();
			mainToolBar.refreshBtnPos();
			NewbieUtils.execFunc(callback, callArgs);
		}
	}

	private static playBtnEffect(comp, callback: Function, callArgs: Array<any>) {
		// MaskUtils.Instance.addShowMovie(args[0], args[1]);
		// Utils.flashTarget(comp, UIFilter.yellowFilter);
		NewbieUtils.execFunc(callback, callArgs);
	}

	/**
	 * 外城移动地图
	 * 添加迷雾信息
	 */
	public static moveOuterCityMap(posX: number, posY: number, isFog: number = 0) {
		Logger.xjy("[NewbieBaseActionMediator]外城移动地图 添加迷雾信息")

		OuterCityManager.Instance.mapView.novimotionTo(new Laya.Point(posX - StageReferance.stageWidth / 2, posY - StageReferance.stageHeight / 2));
		// let _fogView: NoviceFogView;
		// if (OuterCityManager.Instance.mapView) {
		// 	let myCity: BaseCastle = PlayerMgr.Instance.currentPlayerModel.mapNodeInfo;
		// 	let physics: * = OuterCityManager.Instance.model.getPhysicsByXY(posX, posY);
		// 	if (isFog == 1) {
		// 		_fogView = new NoviceFogView(OuterCityManager.Instance.mapView.width, OuterCityManager.Instance.mapView.height);
		// 		OuterCityManager.Instance.mapView.addChild(_fogView);
		// 		_fogView.updatePos(physics.x, physics.y, 3);
		// 		_fogView.updatePos(myCity.x, myCity.y, 3);
		// 	}
		// }
	}

	/**
	 * 自动寻路并攻击 unuse
	 */
	public static autoMoveAndAttack(callback: Function, callArgs: Array<any>, posX: number, posY: number) {
		// TODO Newbie jeremy.xu 自动寻路并攻击
		Logger.xjy("[NewbieBaseActionMediator]TODO 自动寻路并攻击")
		// let physics: any = OuterCityManager.Instance.model.getPhysicsByXY(posX, posY);
		// CampaignManager.Instance.controller.moveArmyByPos(physics.x, physics, true, true);
		// NewbieUtils.execFunc(callback, callArgs);
	}

	public static showMapBtn(callback: Function, callArgs: Array<any>) {
		HomeWnd.Instance.showMapBtn();
	}

	/**
	 * 发送保存节点
	 * @param nodeId  节点id
	 */
	public static sendSaveNode(nodeId: number) {
		NewbieModule.Instance.sendSaveProcess(nodeId);
	}

	/**
	 * 发送初始化内城建筑和队列
	 */
	public static sendInitBuildAndQueue() {
		NewbieModule.Instance.sendInitBuildAndQueue();
	}

	/**
	 * 发送初始化内城建筑和队列
	 */
	public static sendOuterCityBattleAndQueue() {
		let str: string = LangManager.Instance.GetTranslation("newbie.newbieBaseActionMediator.groupSoldiersJoin");
		MessageTipManager.Instance.show(str);
		NewbieModule.Instance.sendOuterCityBattle();
	}

	/**
	 * 创建选择角色界面
	 * @param callback  回调
	 * @param callArgs  回调参数
	 */
	public static createSelectRoleView(callback: Function, callArgs: Array<any>) {//此方法已无用
		NewbieUtils.execFunc(callback, callArgs);
	}

	/**
	 * 访问天空之城NPC
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param npcId  npcId
	 * @param isPopFrame  是否触发弹窗
	 */
	public static visitSpaceNPC(callback: Function, callArgs: Array<any>, npcId: number, isPopFrame: string = "1") {
		let isPop: boolean = (isPopFrame == "1");
		SpaceManager.Instance.visitSpaceNPC(npcId, isPop, callback);
	}

	/**
	 * 发送执行副本中回调
	 * @param mapId  地图id
	 * @param nodeId  节点id
	 * @param cmd  指令id
	 */
	public static sendCallInCampaign(mapId: number, nodeId: number, cmd: number) {
		NewbieModule.Instance.sendCallInCampaign(mapId, nodeId, cmd);
	}

	/**
	 * 发送退出副本
	 */
	public static sendFinishCampaign(type: number) {
		CampaignSocketOutManager.Instance.sendCampaignFinish(-1);
	}

	/**
	 * 关闭窗口
	 * @param emWindow  EmWindow
	 */
	public static closeFrame(emWindow: string) {
		let ctrl = FrameCtrlManager.Instance.getCtrl(emWindow as EmWindow)
		if (ctrl) {
			FrameCtrlManager.Instance.exit(emWindow as EmWindow)
		} else {
			UIManager.Instance.HideWind(emWindow as EmWindow)
		}
	}

	/**
	 * 关闭窗口 配置表
	 * @param type  NewbieConfig.Type2EmWindow
	 */
	public static closeFrameByType(type: string) {
		let emWindow: EmWindow = NewbieConfig.Type2EmWindow[type]
		if (!emWindow) return

		NewbieBaseActionMediator.closeFrame(emWindow)
	}

	/**
	 * 
	 * @param args 窗口集 NewbieConfig.Type2EmWindow[]
	 * @param reverse 关闭的是窗口集还是其他
	 * @param dispose 销毁
	 * @returns 
	 */
	public static closeWindowsByTypes(args: string, reverse: string = "1", dispose: string = "1") {
		let emWindows: EmWindow[] = []
		if (args) {
			let types = args.split("_")
			types.forEach(type => {
				let emWindow: EmWindow = NewbieConfig.Type2EmWindow[type]
				if (emWindow) {
					emWindows.push(emWindow);
				}
			});
		}

		UIHelper.closeWindows(emWindows, reverse == "1", dispose == "1")
	}

	/**
	 * 创建指引对象
	 * @param $args  参数, 格式"type_params", 如"2_1110101"
	 */
	public static createGuildTarget($args: string) {
		NewbieBaseActionMediator.cleanCreateTarget();
		let tempSkillTemp: number;
		let args: any[] = $args.split("_");
		let type: number = Number(args.shift());
		switch (type) {
			case 1:  //技能图标(param: 技能模板id)
				if (Number(args[0]) == 202) {
					tempSkillTemp = NewbieBaseActionMediator.getJobSkillTempId(ArmyManager.Instance.thane.templateInfo.Job);
				}
				let skillTemp: t_s_skilltemplateData = TempleteManager.Instance.getSkillTemplateInfoById(tempSkillTemp);
				let skillItem = fgui.UIPackage.createObject(EmPackName.Battle, "BattleSkillItemCircle") as fgui.GComponent;
				let skillIcon = skillItem.getChild("item").asCom.getChild("Img_Icon").asLoader;
				skillIcon.url = IconFactory.getTecIconByIcon(skillTemp.Icons);
				NewbieBaseActionMediator._createTarget = skillIcon.displayObject;
				NewbieBaseActionMediator._createTarget.mouseEnabled = false;
				NewbieBaseActionMediator._createTarget.visible = false;
				NewbieBaseActionMediator._createTarget.pivot(43, 43);
				break;
		}
		LayerMgr.Instance.addToLayer(NewbieBaseActionMediator._createTarget, EmLayer.NOVICE_LAYER);
	}

	/**
	 * 清除创建的指引对象
	 */
	public static cleanCreateTarget() {
		Logger.xjy("[NewbieBaseActionMediator]cleanCreateTarget")
		if (!NewbieBaseActionMediator._createTarget) return;

		if (NewbieBaseActionMediator._createTarget.destroyed) return;

		TweenMax.killTweensOf(NewbieBaseActionMediator._createTarget);
		let gObj = fgui.GObject.cast(NewbieBaseActionMediator._createTarget);
		if (gObj) {
			ObjectUtils.disposeObject(gObj); NewbieBaseActionMediator._createTarget = null;
		} else {
			ObjectUtils.disposeObject(NewbieBaseActionMediator._createTarget); NewbieBaseActionMediator._createTarget = null;
		}
	}

	/**
	 * 设置目标对象位置和缩放 TODO
	 * @param $targetArgs  目标对象参数
	 * @param $x  坐标X（reference为参照物坐标, middle为居中）
	 * @param $y  坐标Y（reference为参照物坐标, middle为居中）
	 * @param $scaleX  缩放X（reference为参照物缩放）
	 * @param $scaleY  缩放Y（reference为参照物缩放）
	 * @param $referTargetArgs  参照对象参数, 默认为空
	 */
	public static setTargetPosAndScale($targetArgs: string, $x: string = "0", $y: string = "0", $scaleX: string = "1", $scaleY: string = "1", $referTargetArgs: string = "") {
		let targetObj: DisplayObject = NewbieBaseActionMediator.getGuildTarget($targetArgs);
		let targetSize: any = NewbieBaseActionMediator.getTargetObjSize(targetObj);
		let referTarget: DisplayObject = NewbieBaseActionMediator.getGuildTarget($referTargetArgs);
		if (($x == "reference" || $y == "reference") && referTarget && referTarget.parent) {
			let p = (referTarget.parent as DisplayObject).localToGlobal(new Laya.Point(referTarget.x, referTarget.y));
			p = (targetObj.parent as DisplayObject).globalToLocal(p);
			targetObj.x = p.x;
			targetObj.y = p.y;
		}
		switch ($x) {
			case "middle":
				targetObj.x = (StageReferance.stageWidth - targetSize.w) / 2;
				break;
			default:
				targetObj.x = Number($x);
		}
		switch ($y) {
			case "middle":
				targetObj.y = (StageReferance.stageHeight - targetSize.h) / 2;
				break;
			default:
				targetObj.y = Number($y);
		}
		switch ($scaleX) {
			case "reference":
				if (referTarget) targetObj.scaleX = referTarget.scaleX;
				break;
			default:
				targetObj.scaleX = Number($scaleX);
		}
		switch ($scaleY) {
			case "reference":
				if (referTarget) targetObj.scaleY = referTarget.scaleY;
				break;
			default:
				targetObj.scaleY = Number($scaleY);
		}
	}

	/**
	 * 发送设置技能快捷键
	 * @param value  如"107_108_-1_-1_-1"
	 */
	public static sendSetSkillFastKey($value: string) {
		let arr: any[] = NewbieBaseActionMediator.getSkillTempsSontypeString(ArmyManager.Instance.thane.templateInfo.Job).split("_");
		let value: string = "";
		for (let key in arr) {
			if (Object.prototype.hasOwnProperty.call(arr, key)) {
				let str = arr[key];
				value += (str + ",");
			}
		};
		(FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl).sendSetFastKey(value);
	}

	/**
	 * 
	 * @param itemIdx
	 * @param skillTempId
	 */
	public static getSkillTempsSontypeString(value: number): string {
		switch (value) {
			case JobType.WARRIOR://战士
				return "107_108_-1_-1_-1";
			case JobType.HUNTER://弓手
				return "207_208_-1_-1_-1";
			case JobType.WIZARD://法师
				return "307_308_-1_-1_-1";
		}
		return "";
	}

	/**
	 * 在战斗中显示技能
	 * @param itemIdx  显示item位置
	 * @param skillTempId  技能模板id, -1为空
	 */
	public static showNewSkillInBattle(itemIdx: number, skillTempId: number) {
		itemIdx = Number(itemIdx)
		skillTempId = Number(skillTempId)
		Logger.xjy("[NewbieBaseActionMediator]showNewSkillInBattle itemIdx:", itemIdx, "skillTempId:", skillTempId)

		let temSkillTempId: number;
		let item: BattleSkillItemII = BattleManager.Instance.battleUIView.bottomBar.skillList.skillItemViews[itemIdx];
		if (skillTempId == -1) {
			item.data = null;
		}
		else {
			if (skillTempId == 202) {
				temSkillTempId = NewbieBaseActionMediator.getJobSkillTempId(ArmyManager.Instance.thane.templateInfo.Job);
			}
			let skillTemp = TempleteManager.Instance.getSkillTemplateInfoById(temSkillTempId) as t_s_skilltemplateData;
			item.data = skillTemp;
			item.enabled = true;
		}
	}

	/**
	 * 根据职业获得玩家第二个技能模板ID；
	 */
	public static getJobSkillTempId(value: number): number {
		switch (value) {
			case JobType.WARRIOR://战士
				return 10811;
			case JobType.HUNTER://弓手
				return 20811;
			case JobType.WIZARD://法师
				return 30811;
		}
		return -1;
	}

	/**
	 * 根据职业获得玩家第二个技能模板名；
	 */
	public static getJobSkillTempName(value: number): string {
		let skillTemp: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, NewbieBaseActionMediator.getJobSkillTempId(value));
		return skillTemp.SkillTemplateName;
	}


	/**
	 * 设置目标对象显示层次
	 * @param $targetArgs  目标对象参数
	 * @param $idx  层次索引, 默认为-1不设置
	 * @param $showLayer  重新添加到显示层, 默认为-1不添加
	 * @param $isCenter  是否居中, 默认为0, 即false
	 * @param $isAutoCenter  是否自动居中, 默认为0, 即false
	 * @param $maskType  添加蒙板类型（非新手蒙板）, 默认为0不添加
	 */
	public static setTargetDisplayIndex($targetArgs: string, $idx: number = -1, $showLayer: number = -1, $isCenter: string = "0", $isAutoCenter: string = "0", $maskType: number = 0) {
		$idx = Number($idx)
		$showLayer = Number($showLayer)
		$maskType = Number($maskType)

		let targetObj: DisplayObject = NewbieBaseActionMediator.getGuildTarget($targetArgs);
		if ($showLayer > -1 && targetObj) {
			LayerMgr.Instance.addToLayer(targetObj, $showLayer);
		}
		if ($idx > -1 && targetObj && targetObj.parent) {
			// targetObj.parent.setChildIndex(targetObj, $idx);
			targetObj.zOrder = $idx
		}
	}

	/**
	 * 打开帮助窗口
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param type  类型
	 */
	public static openHelpFrame(callback: Function, callArgs: Array<any>, type: number) {
		type = Number(type)

		let temp = NewbieUtils.getHelpByType(type)
		temp["callback"] = callback
		temp["callArgs"] = callArgs
		UIManager.Instance.ShowWind(EmWindow.Help, temp);
	}

	/**
	 * 移动NPC（非寻路）
	 * @param $npcId  npcId（0为自己）
	 * @param $beginX  起始X（-1为当前位置）
	 * @param $beginY  起始Y（-1为当前位置）
	 * @param $endX  终点X
	 * @param $endY  终点Y
	 * @param $angle  角度
	 * @param $moveTime  移动时间（秒）
	 * @param $completeWhenWalkOver  是否走完才完成此动作
	 */
	public static moveNPCByTween(callback: Function, callArgs: Array<any>, $npcId: number, $beginX: number, $beginY: number, $endX: number, $endY: number, $angle: number, $moveTime: number, $completeWhenWalkOver: string = "0") {
		Logger.xjy("[NewbieBaseActionMediator]moveNPCByTween 移动NPC（非寻路）")
		$npcId = Number($npcId)
		$beginX = Number($beginX)
		$beginY = Number($beginY)
		$endX = Number($endX)
		$endY = Number($endY)
		$angle = Number($angle)
		$moveTime = Number($moveTime)

		let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!mapModel) {
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}
		let npcView: DisplayObject;
		if ($npcId <= 0) {
			npcView = CampaignManager.Instance.controller.getArmyView(mapModel.selfMemberData);
			(npcView as CampaignArmyView).visible = true;
		}
		else {
			npcView = mapModel.getNodeByNodeId($npcId);
		}
		if (!npcView) {
			NewbieUtils.execFunc(callback, callArgs);
			return;
		}
		let completeWhenWalkOver: boolean = ($completeWhenWalkOver == "1");
		if ($beginX != -1) npcView.x = $beginX;
		if ($beginY != -1) npcView.y = $beginY;
		npcView["avatarView"]["angle"] = $angle;
		npcView["avatarView"]["state"] = Avatar.WALK;
		if (completeWhenWalkOver) {
			TweenMax.to(npcView, $moveTime, { x: $endX, y: $endY, onComplete: NewbieBaseActionMediator.moveByTweenCompleteCall, onCompleteParams: [npcView, callback, callArgs], ease: Linear.easeNone });
		}
		else {
			TweenMax.to(npcView, $moveTime, { x: $endX, y: $endY, ease: Linear.easeNone });
			NewbieUtils.execFunc(callback, callArgs);
		}
	}

	private static moveByTweenCompleteCall(armyView, callback: Function, callArgs: Array<any>) {
		TweenMax.killTweensOf(armyView);
		armyView["avatarView"]["state"] = Avatar.STAND;
		NewbieUtils.execFunc(callback, callArgs);
	}

	/**
	 * 发送进入采集战斗
	 */
	public static sendEnterCollectionBattle() {
		NewbieModule.Instance.sendEnterCollectionBattle();
	}

	/**
	 * 设置键盘状态
	 * @param callback  回调
	 * @param callArgs  回调参数
	 * @param isEnabled  是否启用
	 * @param setCanEnable  设置能否启用（0不设置, 1不能启用, 2可启用）, 默认0
	 */
	public static setKeyboardState(callback: Function, callArgs: Array<any>, isEnabled: string = "0", setCanEnable: number = 0) {
		// switch (setCanEnable) {
		// 	case 1:
		// 		_canEnableKeyboard = false;
		// 		break;
		// 	case 2:
		// 		_canEnableKeyboard = true;
		// 		break;
		// }
		// if (isEnabled == "1") {
		// 	let curNodeInfo: NewbieNodeInfo = (callArgs ? callArgs[0] : null);
		// 	if (curNodeInfo && (curNodeInfo.nodeId == 11617 || curNodeInfo.nodeId == 13082)) {//指引使用技能时, 即使有新手遮罩也要能使用技能快捷键, 此作特殊处理
		// 		NewbieUtils.execFunc(callback, callArgs);
		// 		return;
		// 	}
		// 	if (_canEnableKeyboard) {
		// 		StageReferance.keyBoardEnable = true;
		// 		StageReferance.stage.removeEventListener(KeyboardEvent.KEY_DOWN, __keyDownHandler, false);
		// 	}
		// }
		// else {
		// 	StageReferance.keyBoardEnable = false;
		// 	StageReferance.stage.addEventListener(KeyboardEvent.KEY_DOWN, __keyDownHandler, false, 100);
		// }
		// NewbieUtils.execFunc(callback, callArgs);
	}

	private static __keyDownHandler(e: KeyboardEvent) {
		// let curNodeInfo: NewbieNodeInfo = (_drawClickEventArgs && _drawClickEventArgs[2] ? _drawClickEventArgs[2][0] : null);
		// let isSkillGuide1: boolean = (curNodeInfo && curNodeInfo.nodeId == 11620 && (e.keyCode == Keyboard.NUMBER_1 || e.keyCode == Keyboard.NUMPAD_1));
		// let isSkillGuide2: boolean = (curNodeInfo && curNodeInfo.nodeId == 13085 && (e.keyCode == Keyboard.NUMBER_2 || e.keyCode == Keyboard.NUMPAD_2));
		// if (isSkillGuide1 || isSkillGuide2) {//指引使用技能时, 即使有新手遮罩也要能使用技能快捷键, 此作特殊处理
		// 	NewbieUtils.execFunc(_drawClickEventArgs[1], _drawClickEventArgs[2]);
		// 	return;
		// }
		// e.stopImmediatePropagation();
	}

	/**
	 * 清除游戏中当前action
	 */
	public static clearCurrentGameAction() {
		let curAction: IAction = GameBaseQueueManager.Instance.actionsQueue.current;
		if (curAction) {
			if (curAction instanceof MapBaseAction) (curAction as MapBaseAction).finished = true;
			curAction.dispose();
		}
	}

	/**
	 * 清理游戏层
	 * @param type  层类型
	 */
	public static cleanGameLayer(type: number = EmLayer.GAME_DYNAMIC_LAYER) {
		type = Number(type)
		LayerMgr.Instance.cleanLayerByType(type);


		// LayerMgr.Instance.removeByLayer(disObj, EmLayer.NOVICE_LAYER)
	}

	/**
	 * 设置NPC
	 * @param npcId  npcId（0为自己）
	 * @param posX  X坐标（-1为不设置）
	 * @param posY  Y坐标（-1为不设置）
	 * @param angle  角度（-1为不设置）
	 */
	public static setNPC(npcId: number, posX: number, posY: number, angle: number) {
		npcId = Number(npcId)
		posX = Number(posX)
		posY = Number(posY)
		angle = Number(angle)

		let mapModel: CampaignMapModel = CampaignManager.Instance.mapModel;
		if (!mapModel) return;
		let npcView: DisplayObject;
		if (npcId <= 0) {
			npcView = CampaignManager.Instance.controller.getArmyView(mapModel.selfMemberData);
		}
		else {
			npcView = mapModel.getNodeByNodeId(npcId);
		}
		if (!npcView) return;
		if (posX != -1) npcView.x = posX;
		if (posY != -1) npcView.y = posY;
		if (angle != -1) npcView["avatarView"]["angle"] = angle;
	}

	/**
	 * 得到目标显示对象的宽高
	 * @param targetObj  目标显示对象
	 * @return obj, 如"{w:100,h:100}"
	 */
	private static getTargetObjSize(targetObj: DisplayObject): any {
		if (!targetObj || (targetObj.width <= 0 && targetObj.height <= 0)) {
			return { w: 100, h: 100 };
		}

		// 一些平台UI窗口缩放过
		let UIscaleX = 1
		let UIscaleY = 1
		let tar = UIHelper.searchBaseWindow(targetObj)
		if (tar) {
			UIscaleX = tar.scaleX
			UIscaleY = tar.scaleY
		}

		let targetW = targetObj.width * targetObj.scaleX * UIscaleX;
		let targetH = targetObj.height * targetObj.scaleY * UIscaleY;
		return { w: targetW, h: targetH };
	}

	public static showFarmFriend(show: number) {
		show = Number(show)
		let frame = NewbieUtils.getFrame(EmWindow.Farm) as FarmWnd;
		if (!frame) return
		frame.showFriend(show ? 1 : 0);
	}

	/**
	 * 获取新手指引对象
	 * @param $args  参数, 格式"type_params", 如"2_1"
	 */
	public static getGuildTarget($args: string): any {
		let args: any[] = $args.split("_");
		let type: number = Number(args.shift());
		let frame: any
		let btn: any
		let cell: any
		let item: any
		let param1: any
		let param2: any
		let attr: any
		let curScene: any
		let spacsDialog: SpaceDialogWnd;
		switch (type) {
			case 1:  //复制的目标显示对象
				return NewbieBaseActionMediator._copyTarget;
			case 2:  //主工具条按钮
				return HomeWnd.Instance.getMainToolBar().getBtnByType(Number(args[0]));
			case 3:  //内城建筑(param: 建筑sontype)
				curScene = SceneManager.Instance.currentScene as CastleScene
				if (curScene.castleMap) {
					let bInfoII: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(Number(args[0]));
					return (curScene.castleMap.buildingsDic.get(bInfoII.buildingId) as CastleBuildingView);
				}
				return null
			case 5:  //战斗界面技能item(param1: item位置, param2: 配"icon"表示取图标)
				item = BattleManager.Instance.battleUIView.bottomBar.skillList.skillItemViews[Number(args[0])]
				if (args.length >= 2)
					return (item[args[1]] as fgui.GLoader).displayObject;
				else
					return item.value.displayObject;
			case 6:  //装备格子(格子位置)
				return (NewbieUtils.getFrame(EmWindow.SRoleWnd) as SRoleWnd).getItemViewByPos(Number(args[0]));
			case 7:  //背包格子(格子位置)
				return ((NewbieUtils.getFrame(EmWindow.SRoleWnd) as SRoleWnd).getBaseBagItemByPos(Number(args[0]))).item;
			case 8:  //背包格子(SonType)
				return ((NewbieUtils.getFrame(EmWindow.SRoleWnd) as SRoleWnd).getBaseBagItemByType(Number(args[0]))).item;
			case 9:  //技能学习按钮
				attr = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).skillPanel[String(args[0])]
				if (attr instanceof UIButton) {
					return attr.view
				} else {
					return attr;
				}
			case 10:  //技能加点按钮(param: 技能位置)
				return (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).skillPanel.getSkillItemByIndex(Number(args[0]));
			case 11:  //右上角工具条按钮(param: 按钮类型)
				return HomeWnd.Instance.getSmallMapBar().getButtonByType(Number(args[0]));
			case 12:  //冷却队列item(param: 队列类型)
				return (NewbieUtils.getFrame(EmWindow.SpaceTaskInfoWnd) as SpaceTaskInfoWnd).getQueueItemByType(Number(args[0]));
			case 13:  //挑战对象item(param1: item位置, param1: item属性)
				item = (NewbieUtils.getFrame(EmWindow.Colosseum) as ColosseumWnd).getItemByIndex(Number(args[0]));
				switch (args.length) {
					case 2:
						return item[String(args[1])];
					default:
						return item;
				}
			case 14:  //社交界面
				switch (Number(args[0])) {
					case 1:
						return (NewbieUtils.getFrame(EmWindow.FriendWnd) as FriendWnd).btn_addFriend.view;
					default:
						return NewbieUtils.getFrame(EmWindow.FriendWnd);
				}
			// return MainToolBar.Instance.recommendBtn;
			case 15:  //推荐好友
				return (NewbieUtils.getFrame(EmWindow.AddFriendsWnd) as AddFriendsWnd).getAddBtnByIndex(Number(args[0]));
			case 18:  //悬赏窗口接受按钮(param: item位置)
				return (NewbieUtils.getFrame(EmWindow.OfferRewardWnd) as OfferRewardWnd).getOfferTaskItemByIndex(Number(args[0])).Btn_accept;
			case 19:  //神学院窗口科技升级按钮(param: item位置)
				return (NewbieUtils.getFrame(EmWindow.SeminaryWnd) as SeminaryWnd).getItemByIndex(Number(args[0])).Btn_upgrade;
			case 25:  //占星窗口水晶球按钮(param: 水晶球位置)
				let StarWnd = (NewbieUtils.getFrame(EmWindow.Star) as StarWnd)
				return StarWnd ? StarWnd.getCrystalByIndex(Number(args[0])) : null;
			case 26:  //天空之城对话框item(param: item位置)
				spacsDialog = (NewbieUtils.getFrame(EmWindow.SpaceDialogWnd) as SpaceDialogWnd)
				item = spacsDialog.list.getChildAt(Number(args[0]));
				item.setSize(285, 90);
				return item;
			case 27:  //当前任务完成提示
				// TODO Newbie jeremy.xu 当前任务完成提示 
				Logger.xjy("[NewbieBaseActionMediator]TODO 当前任务完成提示")
				return null
			case 28:  //天空之城对话框item(param: item位置)
				spacsDialog = (NewbieUtils.getFrame(EmWindow.SpaceDialogWnd) as SpaceDialogWnd)
				item = spacsDialog.list1.getChildAt(Number(args[0]));
				item.setSize(251, 51);
				return item;
			// return GameBaseQueueManager.Instance.actionsQueue.current["taskTip"]["commitText"];
			case 29:  //内城建筑effect_area(param: 建筑sontype)
				curScene = SceneManager.Instance.currentScene as CastleScene
				if (curScene.castleMap) {
					let bInfoII: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(Number(args[0]));
					return (curScene.castleMap.buildingsDic.get(bInfoII.buildingId) as CastleBuildingView).curView; //["effect_area"];
				}
				return null
			case 30:  //副本中节点视图(param: 节点id)
				switch (args.length) {
					case 2:
						return CampaignManager.Instance.mapModel.getNodeByNodeId(Number(args[0]))[args[1]];
					case 3:
						return CampaignManager.Instance.mapModel.getNodeByNodeId(Number(args[0]))[args[1]][args[2]];
					default:
						return CampaignManager.Instance.mapModel.getNodeByNodeId(Number(args[0]));
				}
			case 31:  //任务追踪item(param: 任务模板id)
				Logger.xjy("[NewbieBaseActionMediator]任务追踪item")
				return (NewbieUtils.getFrame(EmWindow.SpaceTaskInfoWnd) as SpaceTaskInfoWnd).getTraceItemByTaskTempId(Number(args[0]));
			case 311:  //测试 任务栏点击
				Logger.xjy("[NewbieBaseActionMediator]测试 任务栏点击")
				return (NewbieUtils.getFrame(EmWindow.SpaceTaskInfoWnd) as SpaceTaskInfoWnd).getTaskItemByIndex(Number(args[0]));
			case 32:  //创建的指引对象
				let createTarget = NewbieBaseActionMediator._createTarget
				if (createTarget) {
					createTarget.visible = true;
				}
				return createTarget;
			case 34:  //天空之城地图窗口item(param: npcId)
				Logger.xjy("[NewbieBaseActionMediator]天空之城地图窗口item")
				let smalMapRightItem = (NewbieUtils.getFrame(EmWindow.SmallMapWnd) as SmallMapWnd).getMapNodeItemByNodeId(Number(args[0]))
				switch (args.length) {
					case 2:
						let disObj: DisplayObject = smalMapRightItem[args[1]];
						if (args[1] == "selectedBg") disObj.visible = true;
						return smalMapRightItem;
					default:
						return smalMapRightItem;
				}
			case 35:  //修行神殿窗口房间item(param: 副本id)
				// TODO Newbie jeremy.xu 修行神殿窗口房间item 
				Logger.xjy("[NewbieBaseActionMediator]TODO 修行神殿窗口房间item")
				return null
			// return NewbieUtils.getFrame(EmWindow.Hook)["getRoomItem"](Number(args[0]));
			case 36:  //市场窗口拍卖行进入按钮
				// TODO Newbie jeremy.xu 市场窗口拍卖行进入按钮 
				Logger.xjy("[NewbieBaseActionMediator]TODO 市场窗口拍卖行进入按钮")
				return null
			// return NewbieUtils.supermarketController["auctionShopView"]["enterBtn"];
			case 37:  //天空之城地图按钮
				/**
				 * actionType="a14" actionParams="37  TODO: 每步都要加一个清理界面的, 为方便在此统一处理一下
				 */
				UIHelper.closeWindows();
				return HomeWnd.Instance.getSmallMapBar().mapBtn.view;
			case 38:  //英灵窗口参战按钮
				frame = NewbieUtils.getFrame(EmWindow.Pet) as PetWnd;
				if (!frame) return
				return (frame as PetWnd).uiAttrCommon.btnJoinWar.view;
			case 39:  //技能窗口
				switch (args.length) {
					case 1:
						return NewbieUtils.getFrame(EmWindow.Skill)[args[0]];
					default:
						return NewbieUtils.getFrame(EmWindow.Skill);
				}
			case 40:  //战斗中觉醒按钮
				return BattleManager.Instance.battleUIView.bottomBar.leftAwakenFigure.awakenItem;
			case 41:  //战斗中自动战斗按钮
				return BattleManager.Instance.battleUIView.autoFightBtn.view;
			case 70:
				// TODO Newbie jeremy.xu equipView.magicCardBtn 
				Logger.xjy("[NewbieBaseActionMediator]TODO equipView.magicCardBtn")
				return null
			// return NewbieUtils.armyController["equipView"]["magicCardBtn"];
			case 71:
				// TODO Newbie jeremy.xu magicCardSlotView.treasureBtn 
				Logger.xjy("[NewbieBaseActionMediator]TODO magicCardSlotView.treasureBtn")
				return null
			// return NewbieUtils.magicCardControler["magicCardSlotView"]["treasureBtn"];
			case 80://外城中的金矿和城堡
				Logger.xjy("[NewbieBaseActionMediator]TODO 外城中的金矿和城堡")
				switch (Number(args[0])) {
					case 1:
						return OuterCityManager.Instance.model.getPhysicsByXY(320, 680);
					case 2:
						return OuterCityManager.Instance.model.getPhysicsByXY(720, 680);
					case 3://外城掠夺城堡
						return OuterCityManager.Instance.model.getPhysicsByXY(880, 440);
					default:
						return null;
				}
			case 82://获取传送阵中世界地图11-20
				frame = NewbieUtils.getFrameByType(EmWindow.OuterCityMapWnd) as WorldMapWnd;
				if (!frame) return
				return frame.btn_map1.view;
			case 83://获取外城打矿界面攻击按钮
				frame = NewbieUtils.getFrame(EmWindow.OuterCityFieldTips);
				if (!frame) return
				return (frame as OuterCityFieldTips).btn_attack.view;
			case 84://获取外城城堡信息界面攻击按钮
				frame = NewbieUtils.getFrame(EmWindow.OuterCityCastleInfoWnd);
				if (!frame) return
				return (frame as OuterCityCastleInfoWnd).btn_attack.view;
			case 85://获取外城金矿信息界面攻击按钮
				frame = NewbieUtils.getFrame(EmWindow.OuterCityFieldInfoWnd);
				if (!frame) return
				return (frame as OuterCityFieldInfoWnd).btn_operate.view;
			case 86://获取外城城堡界面攻击按钮
				frame = NewbieUtils.getFrame(EmWindow.OuterCityCastleTips);
				if (!frame) return
				param1 = Number(args[0])
				if (param1) {
					if (param1 == 1) {
						// return (frame as OuterCityCastleTips).btn_enterCastle.view;
					}
					if (param1 == 2) {
						// return (frame as OuterCityCastleTips).btn_attack.view;
					}
				}
			case 87://获取外城操作城堡按钮
				frame = NewbieUtils.getFrame(EmWindow.OuterCityOperateMenu);
				if (!frame) return
				return (frame as OuterCityOperateMenu).list.getChildAt(Number(args[0]));
			case 88://外城城堡攻击信息攻击按钮
				frame = NewbieUtils.getFrame(EmWindow.OuterCityAttackAlertWnd);
				if (!frame) return
			// return (frame as OuterCityAttackAlertWnd).btn_sure.view;
			case 91://装备界面tip的使用按钮
				btn = (NewbieUtils.getFrame(EmWindow.EquipContrastTips) as EquipContrastTips).goodstip1.btn_use
				return btn;
			case 100:  //兵营CasernWnd招募按钮(param: 兵种sontype)
				return (NewbieUtils.getFrame(EmWindow.CasernWnd) as CasernWnd).getRecruitPawnBtn(Number(args[0]));
			case 103:  //部队中item(param: item位置)
				let allocateFrame = (NewbieUtils.getFrame(EmWindow.AllocateWnd) as AllocateWnd)
				let allocateItem = allocateFrame.SoliderList.getChildAt(0) as AllocateItem
				if (args.length > 0) {
					allocateItem = allocateFrame.SoliderList.getChildAt(Number(args[0])) as AllocateItem
				}
				return allocateItem;
			case 104:
				frame = NewbieUtils.getFrame(EmWindow.Forge) as ForgeWnd;
				param1 = Number(args[0])
				if (param1) {
					if (param1 == 1) {
						let wepapon = frame.getWeaponItem()
						return wepapon && wepapon.item;
					}
					if (param1 == 2) {
						return frame.uiQiangHua.btnComp.view;
					}
				}
				return null;
			case 105:
				frame = NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd;
				if (!frame) return
				return (frame as SkillWnd).skillPanel.getSkillItemByIndex(Number(args[0]));
			case 110:  //农场土地(param: 土地位置)  TODO
				// curScene = SceneManager.Instance.currentScene as FarmScene
				// if (curScene.SceneName == SceneType.FARM) {
				// 	return (curScene as FarmScene).view.landLayer.getLandItemByPos(Number(args[0]));
				// }
				return null
			case 111:  //农场土地(param: 土地位置 点击位置)
				// curScene = SceneManager.Instance.currentScene as FarmScene
				// if (curScene.SceneName == SceneType.FARM) {
				// 	return (curScene as FarmScene).view.landLayer.getLandItemByPos(Number(args[0])).btnClickItem;
				// }
				return null
			case 112:  //农场仓库(param: 仓库列表位置)
				frame = NewbieUtils.getFrame(EmWindow.Farm);
				if (!frame) return
				return (frame as FarmWnd).bagListView.getBagItemByPos(Number(args[0]));
			case 113:  //农场神树
				// curScene = SceneManager.Instance.currentScene as FarmScene
				// if (curScene.SceneName == SceneType.FARM) {
				// 	return (curScene as FarmScene).view.waterLayer.view;
				// }
				return null
			case 114:  //农场商店
				// curScene = SceneManager.Instance.currentScene as FarmScene
				// if (curScene.SceneName == SceneType.FARM) {
				// 	return (curScene as FarmScene).view.buildLayer.shopBtn;
				// }
				return null
			case 120://领取藏宝图界面的一键刷新按钮
				// TODO Newbie jeremy.xu 领取藏宝图界面的一键刷新按钮 
				Logger.xjy("[NewbieBaseActionMediator]TODO 领取藏宝图界面的一键刷新按钮")
				return null
			// return NewbieUtils.treasureMapFrameController["quicklyRefreshBtn"];
			case 121://背包锁
				// TODO Newbie jeremy.xu 背包锁 策划 已经去掉 
				Logger.xjy("[NewbieBaseActionMediator]TODO 背包锁 策划 已经去掉")
				return null
			// return NewbieUtils.armyController["btnVpLock"];
			case 122://
				param1 = Number(args[0])
				if (param1) {
					if (param1 == 1) {
						return HomeWnd.Instance.getRolePart().Btn_Buy_Hp.displayObject;
					}
					if (param1 == 2) {
						return HomeWnd.Instance.getRolePart().Btn_Buy_Hp;
					}
					if (param1 == 3) {
						return HomeWnd.Instance.getRolePart().powerValueTxt.displayObject;
					}
				}
			case 123://主界面工具栏(param: 按钮类型)
				param1 = Number(args[0])
				param2 = Number(args[1])
				if (param1) {
					btn = HomeWnd.Instance.getTopToolBar().getBtn(param1);
					if (param2) {
						return btn && btn.view && btn.view.displayObject;
					} else {
						return btn;
					}
				}
			case 300:  //某个界面的某个属性
				let emType = String(args[0])
				frame = NewbieUtils.getFrameByType(emType)
				if (!frame) return
				attr = frame[String(args[1])]
				if (attr instanceof UIButton) {
					let getUIBtn = Number(args[2])
					if (getUIBtn) {
						return attr;
					} else {
						return attr.view
					}
				} else {
					return attr;
				}
		}
		return null;
	}

	public static getAppendFuncTarget($args: string): any {
		let args: any[] = $args.split("_");
		let type: number = Number(args.shift());
		let frame: any
		let btn: any
		let item: any
		let param1: any
		let param2: any
		switch (type) {
			case 5:  //战斗界面技能item
				item = BattleManager.Instance.battleUIView.bottomBar.skillList.skillItemViews[Number(args[0])]
				return item;
			default:
				return null;
		}
	}

	public static getContentByValue(value: number = 0): string {
		value = Number(value)
		if (value != 0) {
			return LangManager.Instance.GetTranslation("newbie.action.content" + value);
		} else {
			return "";
		}
	}

	public static getIntroduceByValue(value: number = 0): string {
		value = Number(value)
		if (value != 0) {
			return LangManager.Instance.GetTranslation("newbie.introduce" + value);
		} else {
			return "";
		}
	}
}
