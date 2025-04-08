// @ts-nocheck
import IBuildingFilter from "../../../space/interfaces/IBuildingFilter";
import BuildingType from "../../consant/BuildingType";
import BuildingBase from "./BuildingBase";
import CastleBuildingLoader from "../../CastleBuildingLoader";
import BuildingManager from "../../BuildingManager";
import { Func } from "../../../../../core/comps/Func";
import StringHelper from "../../../../../core/utils/StringHelper";
import { BuildingEvent } from "../../event/BuildingEvent";
import HitTestUtils from '../../../../utils/HitTestUtils';
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import Logger from "../../../../../core/logger/Logger";
import { MovieClip } from "../../../../component/MovieClip";
import { EmWindow } from "../../../../constant/UIDefine";
import UIManager from "../../../../../core/ui/UIManager";
import { FrameCtrlManager } from '../../../../mvc/FrameCtrlManager';
import NewbieBaseActionMediator from "../../../../module/guide/mediators/NewbieBaseActionMediator";
import { t_s_buildingtemplateData } from "../../../../config/t_s_buildingtemplate";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import { PlayerManager } from "../../../../manager/PlayerManager";
import SDKManager from "../../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../../core/thirdlib/RptEvent";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import CastleConfigUtil from "../../utils/CastleConfigUtil";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { MarketHalo } from "../MarketHalo";
import LangManager from "../../../../../core/lang/LangManager";
import OpenGrades from "../../../../constant/OpenGrades";
import { ArmyManager } from "../../../../manager/ArmyManager";

/**
 * 内城建筑视图类<br/>
 * 根据不同的类型显示提示样式、内容，处理鼠标事件
 */
export default class CastleBuildingView extends BuildingBase {
	private _buildingFilter: IBuildingFilter;
	private _newBuilding: boolean = false;
	public isLoaded: boolean;
	private _marketHalo: MarketHalo;
	constructor(buildingFilter: IBuildingFilter) {
		super();
		this._buildingFilter = buildingFilter;
	}

	initClickEvent() {
		if (!this._curView || this._buildingInfo.templeteInfo.SonType == BuildingType.TREE) return
		this._curView.on(Laya.Event.MOUSE_OVER, this, this.mouseOverHandler);
		this._curView.on(Laya.Event.MOUSE_OUT, this, this.mouseOutHandler);
		this._curView.on(Laya.Event.CLICK, this, this.mouseClickHandler);
		this._curView.on(Laya.Event.MOUSE_MOVE, this, this.mouseMoveHandler);
	}

	removeClickEvent() {
		if (!this._curView) return
		this._curView.off(Laya.Event.MOUSE_OVER, this, this.mouseOverHandler);
		this._curView.off(Laya.Event.MOUSE_OUT, this, this.mouseOutHandler);
		this._curView.off(Laya.Event.CLICK, this, this.mouseClickHandler);
		this._curView.off(Laya.Event.MOUSE_MOVE, this, this.mouseMoveHandler);
	}

	protected get isAdornment(): boolean {
		if (!this._buildingInfo || !this._buildingInfo.templeteInfo) return false;
		switch (this._buildingInfo.templeteInfo.SonType) {
			case BuildingType.STORE_BUILD:
			case BuildingType.PVP_BUILD:
			case BuildingType.HERODOOR_BUILD:
			// case BuildingType.MAKET_BUILD:
			case BuildingType.XUANSHANG_BUILD:
			case BuildingType.HOME_BUILD:
			case BuildingType.STARTOWER_BUILD:
			case BuildingType.GATE_BUILD:
			case BuildingType.FORTRESS_BUILD:
			case BuildingType.TRAINING_GROUND_BUILD:
			case BuildingType.ATTACK_CAMP_SITE1:
			case BuildingType.ATTACK_CAMP_SITE2:
			case BuildingType.ATTACK_CAMP_SITE4:
			case BuildingType.ATTACK_CAMP_SITE3:
				return true;
			default:
				return false;
		}
	}

	public mouseOverHandler(evt): boolean {
		let point = new Laya.Point(evt.stageX, evt.stageY);
		let isOver = true
		if (this._curView) {
			this._curView.globalToLocal(point);
			isOver = HitTestUtils.hitTest(this._curView, point);
		}
		if (!isOver) {
			return;
		}
		if (this.isAdornment) {
			return true;
		}
		if (this._curView && this._buildingInfo.templeteInfo.SonType != BuildingType.TREE) {
			this._buildingFilter.setBuildingOverFilter(this._curView);
		}
		return true;
	}

	public mouseOutHandler(evt): boolean {
		if (this.isAdornment) {
			return true;
		}
		if (this._curView) {
			this._buildingFilter.setBuildingOutFilter(this._curView);
		}
		return true;
	}

	public mouseClickHandler(evt: Laya.Event): boolean {
		AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
		evt.stopPropagation();
		if (this.isAdornment) {
			return true;
		}

		let globalPoint = new Laya.Point(evt.stageX, evt.stageY);
		let localPoint = this._curView.globalToLocal(globalPoint);
		let isInArea = HitTestUtils.hitTest(this._curView, localPoint);
		if (!isInArea && !NewbieBaseActionMediator.isExistNewbieMask) return;
		Logger.xjy("mouseClickHandler", this._buildingInfo.templeteInfo.SonType);
		switch (this._buildingInfo.templeteInfo.SonType) {
			case BuildingType.STORE_BUILD:
				break;
			case BuildingType.PVP_BUILD:
				break;
			case BuildingType.HERODOOR_BUILD:
				break;
			case BuildingType.XUANSHANG_BUILD:
				break;
			case BuildingType.HOOK_BUILD:
				if (PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess == GlobalConfig.NEWBIE_40000) {
					SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_TEMPLE);
				}
				FrameCtrlManager.Instance.open(EmWindow.Hook);
				// MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("CastleBuildingView.clickHookBuild"));
				break;
			case BuildingType.WUXIANTA_BUILD:
				if (PlayerManager.Instance.currentPlayerModel.playerInfo.noviceProcess == GlobalConfig.NEWBIE_41000) {
					SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.CLICK_MAZE);
				}
				FrameCtrlManager.Instance.open(EmWindow.MazeFrameWnd);
				break;
			case BuildingType.VEHICLE_BUILD:
				break;
			case BuildingType.TREE:
				// FarmManager.Instance.enterFarm();
				break;
			case BuildingType.HOME_BUILD:
				break;
			case BuildingType.MAKET_BUILD:
				if (ArmyManager.Instance.thane.grades < OpenGrades.MARKET) {
					MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("market.tips.openLevel", OpenGrades.MARKET));
					return;
				}
				FrameCtrlManager.Instance.open(EmWindow.MarketWnd);
				break;
			case BuildingType.CASERN:
				FrameCtrlManager.Instance.open(EmWindow.CasernWnd, this._buildingInfo);
				break;
			case BuildingType.HOUSES:
				UIManager.Instance.ShowWind(EmWindow.ResidenceFrameWnd, this._buildingInfo);
				break;
			case BuildingType.OFFICEAFFAIRS:
				UIManager.Instance.ShowWind(EmWindow.PoliticsFrameWnd, this._buildingInfo);
				break;
			case BuildingType.WAREHOUSE:
				UIManager.Instance.ShowWind(EmWindow.DepotWnd, this._buildingInfo);
				break;
			case BuildingType.CRYSTALFURNACE:
				UIManager.Instance.ShowWind(EmWindow.CrystalWnd, this._buildingInfo);
				break;
			case BuildingType.SEMINARY:
				UIManager.Instance.ShowWind(EmWindow.SeminaryWnd, this._buildingInfo);
				break;
			case BuildingType.TRANSFER_BUILD:
				UIManager.Instance.ShowWind(EmWindow.TransferBuildWnd, this._buildingInfo);
				break;
			default:
				break;
		}
		return true;
	}

	private mouseMoveHandler(evt: Laya.Event) {
		evt.stopPropagation();
		if (this.isAdornment) {
			return true;
		}
		let point = new Laya.Point(evt.stageX, evt.stageY);

		let isOver = true
		if (this._curView) {
			this._curView.globalToLocal(point);
			isOver = HitTestUtils.hitTest(this._curView, point);
		}
		if (!isOver) {
			if (this._curView) {
				this._buildingFilter.setBuildingOutFilter(this._curView);
			}
			return;
		}
		if (this._curView && this._buildingInfo.templeteInfo.SonType != BuildingType.TREE) {
			this._buildingFilter.setBuildingOverFilter(this._curView);
		}
	}

	protected clean() {
		this.isLoaded = false;
		if (this._curView && this._curView.parent) this._curView.parent.removeChild(this._curView);
		this._curView = null;
		if (this._effectView) {
			this._effectView.forEach((effectMC: MovieClip) => {
				effectMC.stop();
				ObjectUtils.disposeObject(effectMC);
			})
			this._effectView.clear();
			this._effectView = null;
		}
	}

	/**
	 * 刷新视图时，先设置当前状态，如建筑资源未加载，则加载建筑资源，再执行相应的操作
	 * 
	 */

	private buildingLoader: CastleBuildingLoader;
	refreshView() {
		if (!this._buildingInfo) return;
		super.refreshView();
		let templete: t_s_buildingtemplateData = this._buildingInfo.templeteInfo;
		let view: Laya.Sprite = templete.view;
		this.setCurView(view);
		if (view == null && !this._curView) {
			if (StringHelper.isNullOrEmpty(templete.PicPath) == false) {
				this.buildingLoader = new CastleBuildingLoader(this._buildingInfo, new Func(this, this.loadViewCallBack));
			}
		}
		this.initMarketHalo();
	}

	/**
	 * 加载完建筑资源之后判断是否有异常数据，或新建筑<br/>
	 * 如没有，则设置当前的显示状态
	 * @param tempId
	 * 
	 */
	private loadViewCallBack(tempId: number) {
		if (!this._buildingInfo || this._buildingInfo.templateId != tempId) return;
		let templete: t_s_buildingtemplateData = this._buildingInfo.templeteInfo;
		let view: Laya.Sprite = templete.view;
		if (view == null) {

		}
		else if (this._newBuilding) {
			this.newBuildingFocus();
		}
		else
			this.setCurView(view);
		this.isLoaded = true;
		BuildingManager.Instance.dispatchEvent(BuildingEvent.BUILDING_LOAD_COMPLETE, this._buildingInfo);

		if (this.isAdornment) {
			this.showName = false;
			this.removeClickEvent();
		}
	}

	/**
	 * 设置当前的显示状态 
	 * @param view
	 */
	private setCurView(view: Laya.Sprite) {
		if (this._isUpgrade) {
			this.setBuildingFinishView();
			this.addChildByScale(this._scale);
		}
		if (view == null || this._curView)
			return;
		this._curView = view;

		this.initClickEvent()

		this._curViewContainer.addChild(this._curView);
		this._effectView = this._buildingInfo.templeteInfo.effect;
		let sonyType = this._buildingInfo.templeteInfo.SonType;
		if (this._effectView) {
			let index = 0;
			this._effectView.forEach((effectMC: MovieClip) => {
				let pos: Laya.Point = CastleConfigUtil.Instance.getBuildEffectPos(sonyType, index);
				if (pos) effectMC.pos(pos.x, pos.y);
				effectMC.gotoAndPlay(0, true);
				this._curViewContainer.addChild(effectMC);
				index++;
			})

		}

		Logger.info("加载完成", sonyType, this._buildingInfo.templeteInfo.BuildingNameLang)
		this.mouseEnabled = true;
	}

	public set newBuilding(value: boolean) {
		this._newBuilding = value;
		this.newBuildingFocus();
	}

	private newBuildingFocus() {
		this._newBuilding = false;
		this._curView = this._buildingInfo.templeteInfo.view;
		if (this._curView) {
			this._curViewContainer.addChild(this._curView);
		}
		else {
			this.refreshView();
		}
	}

	private _isUpgrade: boolean = false;
	private _scale: number = 0;
	/**
	 * 刷新建筑 
	 * 
	 */
	public buildingLevelUpdated(scale: number) {
		this._isUpgrade = true;
		this._scale = scale;
	}

	/**
	 * 建造完成以后的处理,加特效 
	 * 
	 */
	public setBuildingFinishView() {
		if (!this._curView) return;
	}

	private initMarketHalo() {
		if (this._buildingInfo.templeteInfo.SonType != BuildingType.MAKET_BUILD) return;
		if (!this._marketHalo) {
			this._marketHalo = new MarketHalo();
			this._marketHalo.x = 100;
			this._marketHalo.y = 20;
			this._marketHalo.init();
		}
		this.addChild(this._marketHalo);
	}

	public dispose() {
		super.dispose();
		this.removeClickEvent()
		this._buildingFilter = null;
		ObjectUtils.disposeObject(this._curViewContainer); this._curViewContainer = null;
		this._curView = null;
		if (this.parent) this.parent.removeChild(this);
		this.buildingLoader && this.buildingLoader.dispose();
		if (this._marketHalo) this._marketHalo.clearn();
		this._marketHalo = null;
	}
}
