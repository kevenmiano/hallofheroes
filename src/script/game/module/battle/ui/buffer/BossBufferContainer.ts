// @ts-nocheck

import ConfigMgr from "../../../../../core/config/ConfigMgr";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { BattleManager } from "../../../../battle/BattleManager";
import { BufferDamageData } from "../../../../battle/data/BufferDamageData";
import { HeroRoleInfo } from "../../../../battle/data/objects/HeroRoleInfo";
import BuffItemCell from "../../../../battle/view/buffer/BuffItemCell";
import t_s_skillbuffertemplate, { t_s_skillbuffertemplateData } from "../../../../config/t_s_skillbuffertemplate";
import { ConfigType } from "../../../../constant/ConfigDefine";
import { NotificationEvent, RoleEvent } from "../../../../constant/event/NotificationEvent";
import FUIHelper from '../../../../utils/FUIHelper';
import { EmPackName, EmWindow } from '../../../../constant/UIDefine';
import { TempleteManager } from '../../../../manager/TempleteManager';
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { BattleModel } from "../../../../battle/BattleModel";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { ConsortiaModel } from "../../../consortia/model/ConsortiaModel";
import LayerMgr from "../../../../../core/layer/LayerMgr";
import { EmLayer } from "../../../../../core/ui/ViewInterface";
import FUI_CommonTips from "../../../../../../fui/Base/FUI_CommonTips";
import UnExistRes from "../../../../../core/res/UnExistRes";
import { BattleType } from "../../../../constant/BattleDefine";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";

/**
 * boss的buffer列表视图 
 * @author alan
 * 
 */
export class BossBufferContainer extends Laya.Sprite {
	/**
	 * 免疫buff列表 
	 */
	private _immuneBuffer: any[] = [];
	/**
	 * 动态buffer列表 
	 */
	private _buffers: BufferDamageData[] = [];
	private _boss: HeroRoleInfo;
	private _bufferViews: BuffItemCell[] = [];
	private bufferContainer: fgui.GComponent;
	private view;
	private _flag: boolean = false;
	private _showTip: boolean = false;
	private _commonTip: FUI_CommonTips;
	private _type: number = 0;//type等于1代表双生BOSS的第一个buffer容器
	private _doubleBossList: Array<t_s_skillbuffertemplateData> = [];
	private _specialSkillId: number = 65998;
	constructor(view, type: number = 0, boss: HeroRoleInfo = null) {
		super();
		this.view = view;
		this._type = type;
		if (BattleManager.Instance.batterModel && BattleManager.Instance.battleModel.battleType == BattleType.DOUBLE_BOSS_BATTLE) {
			this.bufferContainer = this.view["bossBufferCom" + type];
		}
		else {
			this.bufferContainer = this.view["bossBufferCom"];
		}
		if (BattleManager.Instance.battleModel) {
			if (BattleManager.Instance.battleModel.battleType == BattleType.DOUBLE_BOSS_BATTLE) {
				this.initEvent(boss);
			}
			else {
				this.initEvent(BattleManager.Instance.battleModel.armyInfoRight.boss);
			}
			this.resetImmuneBuffer();
			this.showBuffer();
		}
		else if (CampaignManager.Instance.mapModel && WorldBossHelper.checkConsortiaBoss(CampaignManager.Instance.mapModel.mapId)) {
			this.resetImmuneBuffer();
			this.refreshConsortiaBossBuffer();
			NotificationManager.Instance.addEventListener(NotificationEvent.CONSORTIA_BOSS_BUFFERIDS, this.refreshConsortiaBossBuffer, this);
		}
	}

	public initEvent(boss: HeroRoleInfo) {
		if (boss) {
			this._boss = boss;
			this._boss.addEventListener(RoleEvent.REFRESH_BUFFER, this.__reFreshBuffer, this);
			this._boss.addEventListener(RoleEvent.REFRESH_BUFFER_TURN, this.__reFreshBufferTurn, this);
			if (this._boss.heroInfo && this._boss.heroInfo.templateId == ConsortiaModel.CONSORTIA_BOSS_TEMPLATEID) {
				this._flag = true;
				this.refreshConsortiaBossBuffer();
			}
			if (this._boss) this._boss.addEventListener(RoleEvent.IS_LIVING, this._isLivingHandler, this);
		}
	}

	public removeEvent() {
		if (this._boss) {
			this._boss.removeEventListener(RoleEvent.REFRESH_BUFFER, this.__reFreshBuffer, this);
			this._boss.removeEventListener(RoleEvent.REFRESH_BUFFER_TURN, this.__reFreshBufferTurn, this);
		}
		this._flag = false;
		NotificationManager.Instance.removeEventListener(NotificationEvent.CONSORTIA_BOSS_BUFFERIDS, this.refreshConsortiaBossBuffer, this);
		if (this._boss) this._boss.removeEventListener(RoleEvent.IS_LIVING, this._isLivingHandler, this);
	}

	private _isLivingHandler() {
		if (this._boss && this._boss.isLiving == false) this._boss.cleanBuffers(false);
		this.reFreshBuffer(null);
	}

	private refreshConsortiaBossBuffer() {
		this.resetImmuneBuffer();
		this._buffers = [];
		let bufferTempInfo: t_s_skillbuffertemplateData;
		var str: string = ConsortiaManager.Instance.model.bossInfo.BufferIds;
		if (str) {
			var arr: Array<any> = str.split(",");
			bufferTempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, arr[0]) as t_s_skillbuffertemplateData;
			if (bufferTempInfo && bufferTempInfo.Icon && bufferTempInfo.Icon.length > 0) {
				if (bufferTempInfo && bufferTempInfo.Icon) {
					let buffer: BufferDamageData = new BufferDamageData();
					buffer.templateId = bufferTempInfo.Id;
					this._buffers.push(buffer);
				}
			}
		}
		if (this._buffers.length > 0 || this._immuneBuffer.length > 0) {
			this.showBuffer();
		} else {
			this.removePreBuffer();
		}
	}

	private __reFreshBuffer(data: Array<BufferDamageData>) {
		this.reFreshBuffer(data);
	}

	private __reFreshBufferTurn(data: Array<BufferDamageData>) {
		this.refreshTurn();
	}

	public reFreshBuffer(buffers: Array<BufferDamageData>) {
		this.resetImmuneBuffer();
		this._buffers = [];
		let bufferTempInfo: t_s_skillbuffertemplateData;
		if (buffers) {
			for (let i: number = 0; i < buffers.length; i++) {
				bufferTempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, buffers[i].templateId.toString()) as t_s_skillbuffertemplateData
				if (bufferTempInfo && bufferTempInfo.Icon) {
					this._buffers.push(buffers[i]);
				}
			}
		}
		if (this._flag) {
			var str: string = ConsortiaManager.Instance.model.bossInfo.BufferIds;
			if (str) {
				var arr: Array<any> = str.split(",");
				bufferTempInfo = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, arr[0]) as t_s_skillbuffertemplateData;
				if (bufferTempInfo && bufferTempInfo.Icon && bufferTempInfo.Icon.length > 0) {
					if (bufferTempInfo && bufferTempInfo.Icon) {
						let buffer: BufferDamageData = new BufferDamageData();
						buffer.templateId = bufferTempInfo.Id;
						this._buffers.push(buffer);
					}
				}
			}
		}

		if (this._buffers.length > 0 || this._immuneBuffer.length > 0
			|| (this._doubleBossList && this._doubleBossList.length > 0)) {
			this.showBuffer();
		} else {
			this.removePreBuffer();
		}
	}

	private showBuffer() {
		this.removePreBuffer();
		let itemView: BuffItemCell;
		let battleModel = BattleManager.Instance.battleModel
		if (!battleModel) return;

		if (battleModel.battleType == BattleType.DOUBLE_BOSS_BATTLE) {
			for (let j: number = 0; j < this._doubleBossList.length; j++) {
				let bufferTempInfo: t_s_skillbuffertemplateData = this._doubleBossList[j];
				if (bufferTempInfo && bufferTempInfo.Icon && bufferTempInfo.Icon.length > 0) {
					let buffer: BufferDamageData = new BufferDamageData();
					buffer.templateId = bufferTempInfo.Id;
					this._buffers.push(buffer);
				}
			}
		}
		// let cnt: number = this._buffers.length;
		if (this.bufferIconNum) {
			for (let i = 0; i < this._buffers.length; i++) {
				itemView = this.getBufferView(this._buffers[i]);
				this._bufferViews.push(itemView);
			}
		}
		// let indexj: number = 0;
		// 去除 免疫晕眩、免疫减速。
		// if (this._immuneBuffer) {
		// 	for (let j: number = 0; j < this._immuneBuffer.length; j++) {
		// 		if (this._immuneBuffer[j] != 13 && this._immuneBuffer[j] != 19)// 13免疫减速、19免疫晕眩 
		// 		{
		// 			continue;
		// 		}
		// 		itemView = this.getImmuneBufferView(this._immuneBuffer[j]);
		// 		if (!itemView) {
		// 			continue;
		// 		}
		// 		if (this._type == 1) {
		// 			itemView.x = (cnt + indexj) * (BuffItemCell.ItemWidth + 6);
		// 		}
		// 		else {
		// 			itemView.x = -(cnt + indexj) * (BuffItemCell.ItemWidth + 6);
		// 		}
		// 		itemView.onClick(this, this.__clickItem, [cnt + indexj])
		// 		this.bufferContainer.addChild(itemView);
		// 		this._bufferViews.push(itemView);
		// 		indexj++;
		// 	}
		// }

		if (battleModel.battleType == BattleType.DOUBLE_BOSS_BATTLE) {
			let specialTempInfoData: t_s_skilltemplateData = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skilltemplate, this._specialSkillId) as t_s_skilltemplateData;
			if (specialTempInfoData) {
				let itemView = this.specialBufferView(specialTempInfoData);
				this._bufferViews.push(itemView);
			}
		}

		//最新的Buffer 优先显示
		let reverseBuffViews = this._bufferViews.reverse();
		let length = reverseBuffViews.length;

		for (let i = 0; i < length; i++) {
			itemView = reverseBuffViews[i];
			itemView.onClick(this, this.__clickItem, [i])
			if (this._type == 1) {
				itemView.x = i * (BuffItemCell.ItemWidth + 6);
			}
			else {
				itemView.x = -(i) * (BuffItemCell.ItemWidth + 6);
			}
			this.bufferContainer.addChild(itemView);
		}


	}

	/**
	 * 【ID1018438】【公会Boss】完成一次收集 熔火之心 任务后 Boss反伤未减少20%
	 * 上面问题使用ToolTipsManager注册的提示显示有问题, 换种方式
	 * @param idx 
	 * @returns 
	 */
	private __clickItem(idx: number) {
		if (!this._commonTip) {
			this._commonTip = FUIHelper.createFUIInstance(EmPackName.Base, "CommonTips");
			LayerMgr.Instance.addToLayer(this._commonTip, EmLayer.STAGE_TIP_LAYER);
			this._commonTip.visible = false;
		}

		if (this._showTip) return

		let item = this._bufferViews[idx]
		if (item) {
			this._showTip = true
			this._commonTip.visible = true
			let gPt: Laya.Point = item.displayObject.localToGlobal(new Laya.Point(0, 0), false, Laya.stage);

			let txt_content = this._commonTip.getChild("txt_content").asTextField;
			txt_content.autoSize = 1;
			txt_content.text = item.tipData;
			if (txt_content.textWidth >= txt_content.maxWidth) {//超出最大宽度, 更改适配方式
				txt_content.autoSize = 2;
			} else {
				txt_content.autoSize = 1;
			}
			this._commonTip.ensureBoundsCorrect();
			this._commonTip.setXY(gPt.x - this._commonTip.width, gPt.y - this._commonTip.height)
			Laya.timer.frameOnce(2, this, this.addStageClick)
		}
	}

	private addStageClick() {
		Laya.stage.on(Laya.Event.CLICK, this, this.onStageClick);
	}

	private onStageClick(evt?: any) {
		if (this._commonTip) {
			this._showTip = false
			this._commonTip.visible = false
			Laya.stage.off(Laya.Event.CLICK, this, this.onStageClick);
		}
	}

	/**
	 * 取得动态buffer图标 
	 * @param temp
	 */
	private getBufferView(temp: BufferDamageData): BuffItemCell {
		let item = FUIHelper.createFUIInstance(EmPackName.Battle, "BufferItemCell") as BuffItemCell;
		item.cellData = temp;
		ToolTipsManager.Instance.unRegister(item);
		return item;
	}
	/**
	 * 取得免疫buffer图标 
	 * @param type
	 */
	private getImmuneBufferView(type: number): BuffItemCell {
		let iconURL = "/immune/" + type + ".png";
		iconURL = IconFactory.getCommonIconPath(iconURL);
		if (iconURL == UnExistRes.BlankURL) {
			return null;
		}
		let item = FUIHelper.createFUIInstance(EmPackName.Battle, "BufferItemCell") as BuffItemCell;
		item.bufferIcon.icon = iconURL;
		item.txtLayerCount.text = "";

		let name = ""
		if (type == BattleModel.ImmuneSlowType) {
			name = BattleModel.ImmuneSlow
		} else if (type == BattleModel.ImmuneFaintType) {
			name = BattleModel.ImmuneFaint
		}
		let cfg = TempleteManager.Instance.getConfigInfoByConfigName(name)
		if (cfg) {
			item.tipData = cfg.Description;
			// ToolTipsManager.Instance.register(item);
		}
		return item;
	}

	/**共生BOSS图标 */
	private specialBufferView(specialTempInfoData: t_s_skilltemplateData) {
		let iconURL = IconFactory.getCommonIconPath(specialTempInfoData.Icons);
		if (UnExistRes.isExist(iconURL)) {
			iconURL = UnExistRes.BlankURL;
		}
		let item = FUIHelper.createFUIInstance(EmPackName.Battle, "BufferItemCell") as BuffItemCell;
		item.bufferIcon.icon = iconURL;
		item.txtLayerCount.text = "";
		item.tipData = specialTempInfoData.SkillTemplateName + "<br>" + specialTempInfoData.SkillDescription;
		return item;
	}

	private removePreBuffer() {
		this._bufferViews.forEach(itemView => {
			if (itemView && !itemView.isDisposed) {
				itemView.dispose();
			}
		});
		this._bufferViews = [];
		this.onStageClick();
	}

	private get bufferIconNum(): number {
		let icons: any[] = [];
		for (let i: number = 0; i < this._buffers.length; i++) {
			let member: BufferDamageData = this._buffers[i];
			if (icons.indexOf(member.templateId) == -1) {
				icons.push(member.templateId);
			}
		}
		return icons.length;
	}

	private resetImmuneBuffer() {
		if (this._boss) {
			this._immuneBuffer = this._boss.heroInfo.templateInfo.RejectType;
		}
		let battleModel = BattleManager.Instance.battleModel
		if (battleModel && battleModel.battleType == BattleType.DOUBLE_BOSS_BATTLE) {
			var str2: string = this._boss.getPermanentBuffers();
			var bufferTemp: t_s_skillbuffertemplateData;
			if (str2) {
				this._doubleBossList = [];
				var arr2: Array<any> = str2.split(",");
				for (var j: number = 0; j < arr2.length; j++) {
					bufferTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_skillbuffertemplate, arr2[j].toString()) as t_s_skillbuffertemplateData;
					if (bufferTemp && bufferTemp.Icon && bufferTemp.Icon.length > 0) {
						this._doubleBossList.push(bufferTemp);
					}
				}
			}
		}
	}

	/**
	 * 刷新buffer回合数 
	 */
	public refreshTurn() {
		this._bufferViews.forEach(itemView => {
			itemView.refreshTurn();
		});
	}

	public dispose(info: HeroRoleInfo = null) {
		if (!info || !this._boss || info.livingId == this._boss.livingId) {
			this.removeEvent();
			this.removePreBuffer();
			if (this._commonTip) {
				this.onStageClick();
				LayerMgr.Instance.removeByLayer(this._commonTip, EmLayer.STAGE_TIP_LAYER);
				this._commonTip = null;
			}
		}
	}
}
