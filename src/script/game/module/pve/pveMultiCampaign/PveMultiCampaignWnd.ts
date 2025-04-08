// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-02-27 15:31:03
 * @LastEditors: jeremy.xu
 * @Description: 英雄之门 选择战役
 */

import AudioManager from "../../../../core/audio/AudioManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { UIFilter } from "../../../../core/ui/UIFilter";
import Utils from "../../../../core/utils/Utils";
import { BaseItem } from "../../../component/item/BaseItem";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { CampaignMapDifficulty } from "../../../constant/CampaignMapDifficulty";
import { CampaignMapStatus } from "../../../constant/CampaignMapStatus";
import { RoomSceneType } from "../../../constant/RoomDefine";
import { SoundIds } from "../../../constant/SoundIds";
import { EmWindow, EmPackName } from "../../../constant/UIDefine";
import { RoomHallEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignTemplateManager } from "../../../manager/CampaignTemplateManager";
import { KingTowerManager } from "../../../manager/KingTowerManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { RoomManager } from "../../../manager/RoomManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import ComponentSetting from "../../../utils/ComponentSetting";
import { eSelectCampaignItemType } from "../pveCampaign/PveCampaignData";
import { CampaignAreaInfo } from "../pveCampaign/model/CampaignAreaInfo";
import { CampaignChapterInfo } from "../pveCampaign/model/CampaignChapterInfo";
import { SelectCampaignItemData } from "../pveCampaign/model/SelectCampaignItemData";
import PveMultiCampaignData from "./PveMultiCampaignData";

export default class PveMultiCampaignWnd extends BaseWindow {
	private tree: fgui.GTree;
	private itemList: fgui.GList;
	private modeList: fgui.GList;
	private txtFbName: fgui.GLabel;
	private txtEnterCount: fgui.GLabel;
	private txtEnterCountDesc: fgui.GLabel;
	private txtLevelTip: fgui.GLabel; // 推荐入场等级
	private imgEvaluate: fgui.GLoader; // 评分
	private cBtnState: fgui.Controller;
	private _fTreeNodeList: fgui.GTreeNode[] = [];
	private _sTreeNodeList: fgui.GTreeNode[] = [];
	private _sTreeNodeMap = {};
	private _mayFallItemList: GoodsInfo[] = [];
	private _lastModeIndex = -1;
	private _isChangeCampaign: boolean = false;
	private _strEnterCount: string = "";
	private _strTailaEnterCount: string = "";
	private btnCreateRoom: fgui.GButton;
	private btnChangeFB: fgui.GButton;
	private descTxt1: fgui.GTextField;
	private descTxt2: fgui.GTextField;
	private noModeBtn: boolean = false;
	public pass: fgui.Controller;
	public OnInitWind() {
		super.OnInitWind();
		this.setCenter();

		this._strEnterCount = LangManager.Instance.GetTranslation("PveSelectCampaignWnd.enterCountTxt");
		this._strTailaEnterCount = LangManager.Instance.GetTranslation("PveSelectCampaignWnd.tailaWeekEnterCountTxt");
		this.pass = this.contentPane.getController("pass");
	}

	/**界面打开 */
	OnShowWind() {
		super.OnShowWind();

		this.initView();
		this.defaultView();
	}

	/**关闭界面 */
	OnHideWind() {
		super.OnHideWind();
		this.modeList.on(fgui.Events.CLICK_ITEM, this, this.__clickModeItem);
		this.tree.off(fgui.Events.CLICK_ITEM, this, this.__clickTreeItem);
	}

	private initView() {
		this.modeList.on(fgui.Events.CLICK_ITEM, this, this.__clickModeItem);
		this.tree.on(fgui.Events.CLICK_ITEM, this, this.__clickTreeItem);
		this.tree.treeNodeRender = Laya.Handler.create(this, this.__renderTreeNode, null, false);
		Utils.setDrawCallOptimize(this.itemList);
		this.itemList.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);
		this.modeList.draggable = false;

		let treeData = this.model.getTreeData();
		this.refreshTreeData(treeData[0], treeData[1]);

		this.cBtnState = this.getController("cBtnState");
		this._isChangeCampaign = this.frameData && this.frameData.isChangeCampaign;
		this.cBtnState.selectedIndex = this._isChangeCampaign ? 1 : 0;
	}

	public defaultView() {
		let cfgData: t_s_campaignData;
		if (this.frameData && this.frameData.CampaignId) {
			cfgData = ConfigMgr.Instance.campaignTemplateDic[this.frameData.CampaignId];
		} else {
			// 默认选中玩家当前等级可挑战的最高等级的副本 普通难度
			let openCampaignDataDic = this.model.openCampaignDataDic as t_s_campaignData[];
			for (const key in openCampaignDataDic) {
				if (Object.prototype.hasOwnProperty.call(openCampaignDataDic, key)) {
					let temp = openCampaignDataDic[key] as t_s_campaignData;
					if (this.model.thane.grades >= temp.MinLevel && !temp.isTaila) {
						if (!cfgData || cfgData.MinLevel < temp.MinLevel || (cfgData.MinLevel == temp.MinLevel && cfgData.CampaignId < temp.CampaignId)) {
							cfgData = temp;
						}
					}
				}
			}
		}

		// 第几章节
		let selChapterIndex = 1;
		// 没开活动本
		if (CampaignTemplateManager.Instance.getActiveCampaignList().length == 0) {
			selChapterIndex = 0;
		}
		if (cfgData) {
			for (let index = 0; index < this._fTreeNodeList.length; index++) {
				const fTreeNode = this._fTreeNodeList[index];
				if (fTreeNode.data.id == cfgData.DungeonId) {
					selChapterIndex = index;
					break;
				}
			}
		}

		// 第几章节第几个
		let sTreeNodeArr = this._sTreeNodeMap[selChapterIndex];
		let fTreeNodeTar = this._fTreeNodeList[selChapterIndex];
		let sTreeNodeTar = sTreeNodeArr[0];
		if (cfgData) {
			for (let i = 0; i < sTreeNodeArr.length; i++) {
				const sTreeNode: fairygui.GTreeNode = sTreeNodeArr[i];
				if (sTreeNode.data.id == cfgData.AreaId) {
					sTreeNodeTar = sTreeNode;
					break;
				}
			}
		}

		let defSelectedCp = this.model.selectedLand.getChapterById(fTreeNodeTar.data.id);
		this.model.selectedChapter = defSelectedCp as CampaignChapterInfo;
		let defSelectedArea = defSelectedCp.getAreaInfoById(sTreeNodeTar.data.id);
		this.model.selectedArea = defSelectedArea;
		this.tree.selectNode(sTreeNodeTar);
		this.refreshRight(this.model.selectedArea);
		//切换到指定难度
		if (this.frameData) {
			let targetIdx: number = 0;
			let nameStr = PveMultiCampaignData.getDifficultyById(this.frameData.difficult);
			for (let i = 0; i < this.modeList.numItems; i++) {
				const title = this.modeList.getChildAt(i).asButton.title;
				if (title == nameStr) {
					targetIdx = i;
					break;
				}
			}
			this.modeList.selectedIndex = targetIdx;
			this.__clickModeItem(this.modeList.getChildAt(targetIdx));
		}

		//滚动到当前选中的地方
		if (cfgData && fTreeNodeTar.expanded) {
			let idx = (cfgData.AreaId % 100) + selChapterIndex;
			this.tree.scrollToView(idx);
		}
	}

	private btnRoomListClick() {
		FrameCtrlManager.Instance.open(EmWindow.PveRoomList, { roomSceneType: RoomSceneType.PVE });
		this.OnBtnClose();
	}

	private btnSelectRoomClick() {
		FrameCtrlManager.Instance.open(EmWindow.FindRoom);
	}

	private btnChangeFBClick() {
		if (this.selectCampaignFilter()) return;
		let difficulty = this.selectedIndex + 1;
		let campaignId = this.model.selectedArea.getMapByDifficult(difficulty).CampaignId;
		NotificationManager.Instance.dispatchEvent(RoomHallEvent.CHANGE_CAMPAIGN, this.model.selectedChapter.chapterId, campaignId);
	}

	private selectCampaignFilter() {
		let difficulty = this.selectedIndex + 1;
		var str: string = "";
		if (!this.model.selectedArea) {
			str = LangManager.Instance.GetTranslation("room.view.pve.instance.InstanceRightView.command01");
			MessageTipManager.Instance.show(str);
			return true;
		}
		if (difficulty < 0) {
			str = LangManager.Instance.GetTranslation("room.view.pve.instance.InstanceRightView.command02");
			MessageTipManager.Instance.show(str);
			return true;
		}
		if (this.model.thane.grades < this.model.selectedArea.getMapByDifficult(difficulty).MinLevel) {
			str = LangManager.Instance.GetTranslation("room.view.pve.instance.InstanceRightView.command03");
			MessageTipManager.Instance.show(str);
			return true;
		}

		let camTemp: t_s_campaignData = this.model.selectedArea.getMapByDifficult(difficulty);
		if (camTemp.SonTypes != 0) {
			var isOver: boolean;
			if (camTemp.isKingTower) {
				//王者之塔次数判断
				isOver = KingTowerManager.Instance.kingTowerInfo.isKingTowerOverMaxCount;
				if (isOver) {
					str = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist06");
					MessageTipManager.Instance.show(str);
					return true;
				}
			} else if (camTemp.isTrailTower) {
				isOver = this.model.playerInfo.isTrailOverMaxCount;
				// if (isOver) { //没有收益次数时, 也允许进入
				//     str = LangManager.Instance.GetTranslation("yishi.view.base.ThewAlertFrame.disclist05");
				//     MessageTipManager.Instance.show(str);
				//     return true;
				// }
			}
		}
		return false;
	}

	private btnCreateRoomClick() {
		if (this.selectCampaignFilter()) return;
		let difficulty = this.selectedIndex + 1;
		if (difficulty >= 0) {
			Logger.xjy("选中副本", this.model.selectedArea, "难度: ", difficulty);
			RoomManager.selectAreaInfo = this.model.selectedArea;
			RoomManager.selectDiffculty = difficulty;
			this.ctrl.sendCreateRoom();
		}
	}

	public refreshTreeData(firstData: SelectCampaignItemData[], secondData: SelectCampaignItemData[]) {
		for (let index = 0; index < firstData.length; index++) {
			let topNode: fgui.GTreeNode = new fgui.GTreeNode(true);
			topNode._resURL = fgui.UIPackage.getItemURL(EmPackName.Base, "TabTree");
			topNode.data = firstData[index];
			this.tree.rootNode.addChild(topNode);
			this._fTreeNodeList.push(topNode);

			let sData: SelectCampaignItemData = secondData[index];
			this._sTreeNodeMap[index] = [];
			for (let i: number = 0; i < sData.itemData.length; i++) {
				let sNode: fgui.GTreeNode = new fgui.GTreeNode(false);
				sNode._resURL = fgui.UIPackage.getItemURL(EmPackName.PveCampaign, "ItemChapter");
				sNode.data = sData.itemData[i];
				topNode.addChild(sNode);
				this._sTreeNodeList.push(sNode);
				this._sTreeNodeMap[index].push(sNode);
			}
		}
	}

	private __clickTreeItem(itemObject: fgui.GObject) {
		let treeNode: fgui.GTreeNode = itemObject.treeNode;
		let itemData = treeNode.data;
		Logger.log("[PveSelectCampaignWnd]__clickTreeItem", treeNode);

		let model = this.model;
		if (itemData.type == eSelectCampaignItemType.FirstItem) {
			for (let index = 0; index < this._fTreeNodeList.length; index++) {
				const element = this._fTreeNodeList[index];
				if (element != treeNode) {
					this.tree.collapseAll(element);
					continue;
				}
			}
			let cpDataList = model.selectedLand.chapterDic.getList() as CampaignChapterInfo[];
			for (let index = 0; index < cpDataList.length; index++) {
				let cpData = cpDataList[index];
				if (itemData.id == cpData.chapterId) {
					model.selectedChapter = cpData;
					break;
				}
			}
		} else if (itemData.type == eSelectCampaignItemType.SecondItem) {
			let areaDataList = model.selectedChapter.areaDic.getList() as CampaignAreaInfo[];
			for (let index = 0; index < areaDataList.length; index++) {
				let areaData = areaDataList[index];
				if (itemData.id == areaData.areaId) {
					model.selectedArea = areaData;
					break;
				}
			}
			AudioManager.Instance.playSound(SoundIds.CAMPAIGN_CLICK_SOUND);
			this.refreshRight(model.selectedArea);
		}
	}

	private __renderTreeNode(node: fgui.GTreeNode, obj: fgui.GComponent) {
		// Logger.log("[PveSelectCampaignWnd]__renderTreeNode", node.data)
		let itemData = node.data.itemData;
		if (node.data.type == eSelectCampaignItemType.FirstItem) {
			obj.text = itemData;
			obj.enabled = node.data.enabled;
			// obj.getChild("imgLock").visible = !obj.enabled
		} else if (node.data.type == eSelectCampaignItemType.SecondItem) {
			let icon = itemData.icon;
			if (icon) {
				obj.icon = icon;
			}
			obj.text = itemData.text;
			obj.enabled = node.data.enabled;
			if (node.data.grayFilterFlag) {
				obj.filters = [UIFilter.grayFilter];
			} else {
				obj.filters = [UIFilter.normalFilter];
			}
			// obj.getChild("imgLock").visible = !obj.enabled
		}
	}

	private __renderListItem(index: number, item: BaseItem) {
		if (this._mayFallItemList.length == 0) return;
		let itemData = this._mayFallItemList[index];
		item.info = itemData ? itemData : null;
	}

	private refreshRight(campaignAreaInfo: CampaignAreaInfo, difficulty: CampaignMapDifficulty = CampaignMapDifficulty.General) {
		if (!campaignAreaInfo) return;

		this.modeList.removeChildrenToPool();
		let isKingTower = campaignAreaInfo.getMapByDifficult(CampaignMapDifficulty.General).isKingTower;
		let isYuanShu = campaignAreaInfo.getMapByDifficult(CampaignMapDifficulty.General).isYuanShu;
		let modeCnt = PveMultiCampaignData.NormalModeCnt;
		this.noModeBtn = false;
		if (isKingTower) {
			modeCnt = ComponentSetting.CAMPAIGN_PVE_KINGTOWER;
		} else if (isYuanShu) {
			modeCnt = ComponentSetting.CAMPAIGN_PVE_YUANSU;
		} else {
			// 没英雄副本的不显示英雄按钮
			let hasHeroMap = campaignAreaInfo.getMapByDifficult(CampaignMapDifficulty.Hero);
			if (!hasHeroMap) {
				modeCnt = 1;
				this.noModeBtn = true;
			}
		}

		if (!this.noModeBtn) {
			let kingTowerMaxIndex = KingTowerManager.Instance.kingTowerInfo.maxIndex;
			let notNeedFilterFlag: boolean = false; //所有的都需要置灰色
			for (let index = 0; index < modeCnt; index++) {
				const element = this.modeList.addItemFromPool().asButton;
				element.enabled = true;
				if (isKingTower) {
					element.title = PveMultiCampaignData.KinTowerModeName[index];
					notNeedFilterFlag = index <= kingTowerMaxIndex;
				} else if (isYuanShu) {
					element.title = PveMultiCampaignData.YuanShuModeName[index];
					if (index == 0) {
						notNeedFilterFlag = this.model.isNormalOpen();
					} else if (index == 1) {
						notNeedFilterFlag = this.model.isHeroOpen() && this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
					}
					if (index == 2) {
						notNeedFilterFlag = this.model.isHellOpen() && this.model.heroMap.state == CampaignMapStatus.OVER_CAMPAIGN;
					}
				} else {
					element.title = PveMultiCampaignData.NormalModeName[index];
					if (index == 0) {
						notNeedFilterFlag = this.model.isNormalOpen();
					} else if (index == PveMultiCampaignData.NormalModeCnt - 1) {
						notNeedFilterFlag = this.model.isHeroOpen() && this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
					}
				}
				notNeedFilterFlag = notNeedFilterFlag && campaignAreaInfo.minLevel <= ArmyManager.Instance.thane.grades;
				if (!notNeedFilterFlag) {
					element.filters = [UIFilter.grayFilter];
				} else {
					element.filters = [UIFilter.normalFilter];
				}
			}
			this.modeList.selectedIndex = 0;
			this._lastModeIndex = 0;
		}

		this.model.selectCampaign = campaignAreaInfo.getMapByDifficult(difficulty);
		this.txtFbName.text = campaignAreaInfo.areaName;
		this.txtLevelTip.text = campaignAreaInfo.getRecommendLevel();

		let strEnterCountDesc = this._strEnterCount;
		let temp = this.model.selectCampaign;
		let playerInfo = this.model.playerInfo;
		let max: number = playerInfo.multiCopyMaxCount;
		let current: number = playerInfo.multiCopyCount;
		if (temp && temp.SonTypes != 0) {
			let max_tower: number;
			let current_tower: number;
			if (temp.isKingTower) {
				//王者之塔
				max_tower = KingTowerManager.Instance.kingTowerInfo.maxKingCount;
				current_tower = KingTowerManager.Instance.kingTowerInfo.kingCount;
			} else if (temp.isTaila) {
				max_tower = playerInfo.tailaMaxCount;
				current_tower = max_tower - playerInfo.tailaCount;
				strEnterCountDesc = this._strTailaEnterCount;
			} else {
				max_tower = playerInfo.maxTrialCount;
				current_tower = playerInfo.trialCount;
			}
			current = max_tower - current_tower;
			if (current < 0) current = 0;
			this.txtEnterCount.text = current + " / " + max_tower;
		} else {
			if (current < 0) current = 0;
			this.txtEnterCount.text = current + " / " + max;
		}
		this.txtEnterCountDesc.text = strEnterCountDesc;

		this._mayFallItemList = [];
		let mayFallIdList = campaignAreaInfo.getMayFallItemList(difficulty);
		for (let index = 0; index < mayFallIdList.length; index++) {
			let info: GoodsInfo = new GoodsInfo();
			info.templateId = mayFallIdList[index];
			this._mayFallItemList.push(info);
		}
		this.itemList.numItems = mayFallIdList.length;
		this.refreshEvaluation(difficulty, campaignAreaInfo);
		this.updateBtnStatus(this.noModeBtn);
	}

	private updateBtnStatus(noModeBtn: boolean) {
		let isKingTower = this.model.selectedArea.getMapByDifficult(CampaignMapDifficulty.General).isKingTower;
		let isYuanShu = this.model.selectedArea.getMapByDifficult(CampaignMapDifficulty.General).isYuanShu;
		let kingTowerMaxIndex = KingTowerManager.Instance.kingTowerInfo.maxIndex;
		let flag: boolean = false;
		let difficulty = this.selectedIndex;
		if (this.cBtnState.selectedIndex == 0) {
			if (noModeBtn) {
				if (this.model.selectCampaign.MinLevel <= ArmyManager.Instance.thane.grades) {
					flag = true;
					this.btnCreateRoom.enabled = true;
					this.descTxt1.visible = false;
				} else {
					this.btnCreateRoom.enabled = false;
					this.descTxt1.visible = true;
					this.descTxt1.text = LangManager.Instance.GetTranslation("fund.fundRewardView.NewbieTip");
				}
			} else {
				//带难度选择的
				if (this.model.selectCampaign.MinLevel <= ArmyManager.Instance.thane.grades) {
					//等级符合
					if (isKingTower) {
						flag = difficulty <= kingTowerMaxIndex;
					} else if (isYuanShu) {
						if (difficulty == 0) {
							flag = this.model.isNormalOpen();
						} else if (difficulty == 1) {
							flag = this.model.isHeroOpen() && this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
						}
						if (difficulty == 2) {
							flag = this.model.isHellOpen() && this.model.heroMap.state == CampaignMapStatus.OVER_CAMPAIGN;
						}
					} else {
						if (difficulty == 0) {
							flag = this.model.isNormalOpen();
						} else if (difficulty == PveMultiCampaignData.NormalModeCnt - 1) {
							flag = this.model.isHeroOpen() && this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
						}
					}
					this.btnCreateRoom.enabled = flag;
					this.descTxt1.visible = !flag;
					if (this.descTxt1) {
						this.descTxt1.text = LangManager.Instance.GetTranslation("PveSelectCampaignWnd.descTxt.tip");
					}
				} else {
					//等级不符合
					this.btnCreateRoom.enabled = false;
					this.descTxt1.visible = true;
					this.descTxt1.text = LangManager.Instance.GetTranslation("fund.fundRewardView.NewbieTip");
				}
			}
		} else if (this.cBtnState.selectedIndex == 1) {
			if (noModeBtn) {
				if (this.model.selectCampaign.MinLevel <= ArmyManager.Instance.thane.grades) {
					flag = true;
					this.btnChangeFB.enabled = true;
					this.descTxt2.visible = false;
				} else {
					this.btnChangeFB.enabled = false;
					this.descTxt2.visible = true;
					this.descTxt2.text = LangManager.Instance.GetTranslation("fund.fundRewardView.NewbieTip");
				}
			} else {
				//带难度选择的
				if (this.model.selectCampaign.MinLevel <= ArmyManager.Instance.thane.grades) {
					//等级符合
					if (isKingTower) {
						flag = difficulty <= kingTowerMaxIndex;
					} else if (isYuanShu) {
						if (difficulty == 0) {
							flag = this.model.isNormalOpen();
						} else if (difficulty == 1) {
							flag = this.model.isHeroOpen() && this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
						}
						if (difficulty == 2) {
							flag = this.model.isHellOpen() && this.model.heroMap.state == CampaignMapStatus.OVER_CAMPAIGN;
						}
					} else {
						if (difficulty == 0) {
							flag = this.model.isNormalOpen();
						} else if (difficulty == PveMultiCampaignData.NormalModeCnt - 1) {
							flag = this.model.isHeroOpen() && this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
						}
					}
					this.btnChangeFB.enabled = flag;
					this.descTxt2.visible = !flag;
					if (this.descTxt2) {
						this.descTxt2.text = LangManager.Instance.GetTranslation("PveSelectCampaignWnd.descTxt.tip");
					}
				} else {
					//等级不符合
					this.btnChangeFB.enabled = false;
					this.descTxt2.visible = true;
					this.descTxt2.text = LangManager.Instance.GetTranslation("fund.fundRewardView.NewbieTip");
				}
			}
		}
	}

	private refreshEvaluation(difficulty: CampaignMapDifficulty = CampaignMapDifficulty.General, campaignAreaInfo?: CampaignAreaInfo) {
		if (!campaignAreaInfo) {
			campaignAreaInfo = this.model.selectedArea;
		}

		let campaignData = campaignAreaInfo.getMapByDifficult(difficulty);

		if (campaignData.isKingTower || campaignData.isTrailTower) {
			// this.imgEvaluate.icon = "";
			this.pass.selectedIndex = 2;
		} else {
			if (this.model.selectCampaign.state == CampaignMapStatus.NEW_CAMPAIGN || this.model.selectCampaign.state == CampaignMapStatus.OPEN_CAMPAIGN) {
				// this.imgEvaluate.icon = fgui.UIPackage.getItemURL(EmWindow.SelectCampaign, "Img_New")
				this.pass.selectedIndex = 0;
			} else {
				if (this.noModeBtn) {
					this.pass.selectedIndex = 1;
				} else {
					let difficulty = this.selectedIndex;
					if (difficulty == 0) {
						this.pass.selectedIndex = 1;
					} else if (
						difficulty == 1 &&
						(this.model.heroMap.state == CampaignMapStatus.NEW_CAMPAIGN || this.model.heroMap.state == CampaignMapStatus.OPEN_CAMPAIGN)
					) {
						this.pass.selectedIndex = 0;
					} else if (
						difficulty == 2 &&
						(this.model.hellMap.state == CampaignMapStatus.NEW_CAMPAIGN || this.model.hellMap.state == CampaignMapStatus.OPEN_CAMPAIGN)
					) {
						this.pass.selectedIndex = 0;
					}
				}
				// let rankInfo: RankInfo = CampaignRankManager.Instance.rankDic[campaignData.CampaignId];
				// if (rankInfo)
				// this.imgEvaluate.icon = fgui.UIPackage.getItemURL(EmWindow.SelectCampaign, SelectCampaignData.EvaluateRes[rankInfo.rank - 1])
			}
		}
	}

	private __clickModeItem(itemObject: fgui.GObject) {
		if (this._lastModeIndex == this.selectedIndex) return;
		this._lastModeIndex = this.selectedIndex;
		this.hardChange();
		this.updateBtnStatus(this.noModeBtn);
	}

	private hardChange() {
		let difficulty = this.selectedIndex + 1;
		this.refreshEvaluation(difficulty, this.model.selectedArea);

		this._mayFallItemList = [];
		let mayFallIdList = this.model.selectedArea.getMayFallItemList(difficulty);
		for (let index = 0; index < mayFallIdList.length; index++) {
			let info: GoodsInfo = new GoodsInfo();
			info.templateId = mayFallIdList[index];
			this._mayFallItemList.push(info);
		}
		this.itemList.numItems = mayFallIdList.length;
	}

	/**
	 * 没有选择难度列表表示只有一个普通难度
	 */
	public get selectedIndex(): number {
		if (this.modeList.numItems > 0) return this.modeList.selectedIndex;
		return 0;
	}
}
