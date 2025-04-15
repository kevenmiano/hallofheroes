/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-24 17:48:40
 * @LastEditTime: 2024-03-21 18:21:07
 * @LastEditors: jeremy.xu
 * @Description: 单人战役 选择副本
 */

import AudioManager from "../../../../core/audio/AudioManager";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton, { UIButtonChangeType } from "../../../../core/ui/UIButton";
import { UIFilter } from "../../../../core/ui/UIFilter";
import Utils from "../../../../core/utils/Utils";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { BaseItem } from "../../../component/item/BaseItem";
import BaseTipItem from "../../../component/item/BaseTipItem";
import { t_s_campaignData } from "../../../config/t_s_campaign";
import { t_s_configData } from "../../../config/t_s_config";
import { CampaignMapDifficulty } from "../../../constant/CampaignMapDifficulty";
import { CampaignMapStatus } from "../../../constant/CampaignMapStatus";
import ItemID from "../../../constant/ItemID";
import { PawnType } from "../../../constant/PawnType";
import { SoundIds } from "../../../constant/SoundIds";
import TemplateIDConstant from "../../../constant/TemplateIDConstant";
import { EmWindow, EmPackName } from "../../../constant/UIDefine";
import { ArmyPawn } from "../../../datas/ArmyPawn";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { RankInfo } from "../../../datas/playerinfo/RankInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { CampaignRankManager } from "../../../manager/CampaignRankManager";
import FreedomTeamManager from "../../../manager/FreedomTeamManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { SharedManager } from "../../../manager/SharedManager";
import { SingWarSocketSendManager } from "../../../manager/SingWarSocketSendManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import NewbieModule from "../../guide/NewbieModule";
import NewbieConfig from "../../guide/data/NewbieConfig";
import { eMopupType, eMopupState } from "../../mopup/MopupData";
import { ShopGoodsInfo } from "../../shop/model/ShopGoodsInfo";
import PveCampaignData, { eSelectCampaignItemType } from "./PveCampaignData";
import { CampaignAreaInfo } from "./model/CampaignAreaInfo";
import { CampaignChapterInfo } from "./model/CampaignChapterInfo";
import { SelectCampaignItemData } from "./model/SelectCampaignItemData";

export default class PveCampaignWnd extends BaseWindow {
  private tree: fgui.GTree;
  private itemList: fgui.GList;
  private txtTip: fgui.GLabel;
  private txtFbName: fgui.GLabel;
  private txtLevelTip: fgui.GLabel; // 推荐入场等级
  private txtSweepCost: fgui.GLabel; // 扫荡消耗
  private txtChallengeCost: fgui.GLabel; // 挑战消耗
  private imgEvaluate: fgui.GLoader; // 评分
  private imgCanpaignBg: fgui.GLoader;
  private btnModePT: UIButton; // 普通级
  private btnModeYX: UIButton; // 英雄级
  private btnChallenge: UIButton;
  private btnSweep: UIButton;
  private _fTreeNodeList: fgui.GTreeNode[] = [];
  private _sTreeNodeList: fgui.GTreeNode[] = [];
  private _mayFallItemList: GoodsInfo[] = [];
  private descTxt: fgui.GTextField;
  private txtSweepTip: fgui.GTextField;
  private tipItem: BaseTipItem;

  public pass: fgui.Controller;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.btnModePT.changeType = UIButtonChangeType.Light;
    this.btnModeYX.changeType = UIButtonChangeType.Light;
    this.btnModeYX.enabled = false;

    this.btnModePT.title = LangManager.Instance.GetTranslation(
      "selectcampaign.view.CampaignPointView.state02",
    );
    this.btnModeYX.title = LangManager.Instance.GetTranslation(
      "selectcampaign.view.CampaignPointView.state01",
    );
    this.txtTip.title = LangManager.Instance.GetTranslation(
      "selectcampaign.view.mayFall",
    );
    this.txtSweepTip.text =
      LangManager.Instance.GetTranslation("MopupWnd.Sweep.Tip");
    this.tipItem.setInfo(TemplateIDConstant.TEMP_ID_POWER);

    this.pass = this.contentPane.getController("pass");
    this.btnChallenge.setCommonClickInternal();
  }

  /**界面打开 */
  OnShowWind() {
    super.OnShowWind();
    this.addEvent();
    let treeData = this.model.getTreeData();
    this.refreshTreeData(treeData[0], treeData[1], treeData[2]);
    this.defaultView();
  }

  /**关闭界面 */
  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
  }

  private addEvent() {
    this.tree.on(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);
    this.tree.treeNodeRender = Laya.Handler.create(
      this,
      this.renderTreeNode,
      null,
      false,
    );
    this.itemList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.on(
      PveCampaignData.CancelUseWearySupply,
      this.onCancelUseWearySupply,
      this,
    );
  }

  private removeEvent() {
    this.tree &&
      this.tree.off(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);
    NotificationManager.Instance.off(
      PveCampaignData.CancelUseWearySupply,
      this.onCancelUseWearySupply,
      this,
    );
    // if (this.itemList) {
    //     this.itemList.itemRenderer && this.itemList.itemRenderer.recover();
    // }
    // if (this.tree) {
    //     this.tree.treeNodeRender && this.tree.treeNodeRender.recover();
    // }
    Utils.clearGListHandle(this.itemList);
    Utils.clearGListHandle(this.tree);
  }

  private onCancelUseWearySupply() {
    this.onEnter(true);
  }

  public defaultView() {
    for (let index = 0; index < this._sTreeNodeList.length; index++) {
      const sTreeNode = this._sTreeNodeList[index];
      let defSelectedArea: CampaignAreaInfo;
      if (this.model.taskCampaignTem) {
        defSelectedArea = this.model.recentChapter.getAreaByCampaignTem(
          this.model.taskCampaignTem,
        );
        //选择副本完成, 任务追踪标志置空
        // this.model.taskCampaignTem = null;
      } else {
        if (this.frameData && this.frameData.CampaignId) {
          let data: t_s_campaignData =
            ConfigMgr.Instance.campaignTemplateDic[this.frameData.CampaignId];
          defSelectedArea = this.model.recentChapter.getAreaByCampaignTem(data);
        } else {
          defSelectedArea =
            this.model.recentChapter.getMaxOpenArea() as CampaignAreaInfo;
        }
      }
      if (!defSelectedArea) continue;
      let defSelectCampaign = defSelectedArea.getMapByDifficult(
        CampaignMapDifficulty.General,
      );
      if (sTreeNode.data && sTreeNode.data.id == defSelectCampaign.AreaId) {
        this.tree.selectNode(sTreeNode);
        this.model.selectedChapter = this.model.recentChapter;
        this.model.selectedArea = defSelectedArea;
        this.refreshRight(this.model.selectedArea);
        this.tree.scrollToView(this.tree.getChildIndex(sTreeNode._cell));
        break;
      }
    }
  }

  private btnModePTClick() {
    this.refreshRight(this.model.selectedArea, CampaignMapDifficulty.General);
  }

  private btnModeYXClick() {
    this.refreshRight(this.model.selectedArea, CampaignMapDifficulty.Hero);
  }

  private btnSweepClick() {
    if (!this.model.selectCampaign) return;

    let weary = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
    let bSingleCp = this.model.selectCampaign.Capacity == 1;
    let template: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName(
        bSingleCp ? "SingleCampaign_Weary" : "MultiCampaign_Weary",
      );

    let flag = weary < Number(template.ConfigValue);
    if (flag) {
      if (this.model.hasWearyMedicine()) {
        //背包拥有体力药水时,弹出体力补充弹窗
        FrameCtrlManager.Instance.open(EmWindow.WearySupplyWnd, { type: 1 });
      } else if (!this.model.hasWearyMedicine()) {
        //背包无体力药水时
        if (this.model.todayCanBuyWearyMedicine()) {
          //今日还能购买, 弹出高级体力药水快捷购买弹窗
          let info: ShopGoodsInfo =
            TempleteManager.Instance.getShopTempInfoByItemId(
              ItemID.WEARY_MEDICINE3,
            );
          if (info) {
            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info });
          }
        } else {
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "selectcampaign.view.CampaignInfoView.noWeary",
            ),
          );
        }
      }
      return;
    }
    let MopupCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Mopup);
    MopupCtrl.data.campaignId = this.model.selectCampaign.CampaignId;

    FrameCtrlManager.Instance.open(EmWindow.Mopup, {
      type: eMopupType.CampaignMopup,
      state: eMopupState.CampaignMopupPre,
    });
  }

  private btnChallengeClick() {
    let str: string = "";
    if (this.model.selectedArea == null) {
      str = LangManager.Instance.GetTranslation(
        "room.view.pve.instance.InstanceRightView.command01",
      );
      MessageTipManager.Instance.show(str);
      return;
    }
    if (this.model.selectCampaign == null) {
      str = LangManager.Instance.GetTranslation(
        "room.view.pve.instance.InstanceRightView.command02",
      );
      MessageTipManager.Instance.show(str);
      return;
    }

    if (this.checkInTeam()) return;
    if (this.showThewAlert()) return;
    // if (this.showPawnLevel()) return

    this.onEnter(true);
  }

  /**
   * 体力不足
   */
  private showThewAlert(): boolean {
    let weary = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
    let bSingleCp = this.model.selectCampaign.Capacity == 1;
    let template: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName(
        bSingleCp ? "SingleCampaign_Weary" : "MultiCampaign_Weary",
      );

    let flag = weary < Number(template.ConfigValue);
    if (flag) {
      //体力不足
      if (this.model.hasWearyMedicine()) {
        //背包拥有体力药水时,弹出体力补充弹窗
        FrameCtrlManager.Instance.open(EmWindow.WearySupplyWnd);
        return true;
      } else if (!this.model.hasWearyMedicine()) {
        //背包无体力药水时
        if (this.model.todayCanBuyWearyMedicine()) {
          //今日还能购买, 弹出高级体力药水快捷购买弹窗
          let info: ShopGoodsInfo =
            TempleteManager.Instance.getShopTempInfoByItemId(
              ItemID.WEARY_MEDICINE3,
            );
          if (info) {
            FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info });
            return true;
          }
        }
        // else {
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData03"));
        //     return true;
        // }
      }
    }

    let outdate = false;
    let now: Date = new Date();
    let check = SharedManager.Instance.thewCheck;
    let preDate: Date = new Date(SharedManager.Instance.thewCheckDate);
    if (
      !check ||
      (preDate.getMonth() <= now.getMonth() &&
        preDate.getDate() < now.getDate())
    )
      outdate = true;
    if (flag && outdate) {
      let content: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.disclist02",
      );
      let checkStr: string = LangManager.Instance.GetTranslation(
        "yishi.view.base.ThewAlertFrame.text",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        { checkRickText: checkStr, checkDefault: false },
        null,
        content,
        null,
        null,
        this.thewAlertBack.bind(this),
      );
    }
    return flag && outdate;
  }

  private thewAlertBack(b: boolean, check: boolean) {
    if (b) {
      SharedManager.Instance.thewCheck = check;
      SharedManager.Instance.thewCheckDate = new Date();
      SharedManager.Instance.saveThewCheck();

      // if (this.showPawnLevel()) return; // note 2023年7月11日16:01:40 by zhongjyuan
      this.onEnter(true);
    } else {
    }
  }

  /**
   * 士兵等级不足
   */
  private showPawnLevel(): boolean {
    // test
    // let content: string = LangManager.Instance.GetTranslation("selectcampaign.view.CampaignInfoView.content", 3);
    // SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, this.onEnter.bind(this));

    let thane = ArmyManager.Instance.thane;
    if (thane.grades < 9) return false;
    if (
      CampaignRankManager.Instance.rankDic[this.model.selectCampaign.CampaignId]
    )
      return false;
    let armyPawn: ArmyPawn = ArmyManager.Instance.army.getPawnByIndex(0);

    let level: number =
      thane.grades < 20
        ? this.model.selectCampaign.MinLevel - 2
        : this.model.selectCampaign.MinLevel - 4;
    if (!armyPawn)
      armyPawn = ArmyManager.Instance.casernPawnList[PawnType.PAWN1];
    if (!armyPawn.templateInfo || armyPawn.templateInfo.Level >= level)
      return false;
    let content: string = LangManager.Instance.GetTranslation(
      "selectcampaign.view.CampaignInfoView.content",
      level,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      null,
      content,
      null,
      null,
      this.onEnter.bind(this),
    );
    return true;
  }

  private checkInTeam(): boolean {
    let thane = ArmyManager.Instance.thane;
    let model = FreedomTeamManager.Instance.model;
    let inTeam = model && Boolean(model.getMemberByUserId(thane.userId));
    if (inTeam) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "selectcampaign.data.CanNotBegainCampaignInTeam",
        ),
      );
    }
    return inTeam;
  }

  private onEnter(b: boolean, check: boolean = false) {
    if (b) {
      if (this && this.model) {
        let selectCampaign = this.model.selectCampaign;
        if (selectCampaign) {
          let campaignId = selectCampaign.CampaignId;
          let capacity = selectCampaign.Capacity;
          SingWarSocketSendManager.sendStartCampaignScene(campaignId, capacity);
        }
      }
    }
  }

  public refreshTreeData(
    firstData: SelectCampaignItemData[],
    secondData: SelectCampaignItemData[],
    rewardTipData: SelectCampaignItemData[],
  ) {
    if (!firstData) {
      return;
    }
    for (let index = 0; index < firstData.length; index++) {
      let topNode: fgui.GTreeNode = new fgui.GTreeNode(true);
      topNode._resURL = fgui.UIPackage.getItemURL(EmPackName.Base, "TabTree");
      topNode.data = firstData[index];
      this.tree.rootNode.addChild(topNode);
      this._fTreeNodeList.push(topNode);

      let tipRewardNode: fgui.GTreeNode = new fgui.GTreeNode(false);
      tipRewardNode._resURL = fgui.UIPackage.getItemURL(
        EmPackName.PveCampaign,
        "ItemRewardTip",
      );
      tipRewardNode.data = rewardTipData[index];
      topNode.addChild(tipRewardNode);

      let sData: SelectCampaignItemData = secondData[index];
      for (let i: number = 0; i < sData.itemData.length; i++) {
        let sNode: fgui.GTreeNode = new fgui.GTreeNode(false);
        sNode._resURL = fgui.UIPackage.getItemURL(
          EmPackName.PveCampaign,
          "ItemChapter",
        );
        sNode.data = sData.itemData[i];
        topNode.addChild(sNode);
        this._sTreeNodeList.push(sNode);
      }
    }
  }

  private onClickTreeItem(itemObject: fgui.GObject, evt: Laya.Event) {
    let treeNode: fgui.GTreeNode = itemObject.treeNode;
    let itemData = treeNode.data;
    Logger.log("[SelectCampaignWnd]onClickTreeItem", treeNode);

    let model = this.model;
    if (itemData.type == eSelectCampaignItemType.FirstItem) {
      for (let index = 0; index < this._fTreeNodeList.length; index++) {
        const element = this._fTreeNodeList[index];
        if (element != treeNode) {
          this.tree.collapseAll(element);
        }
      }
      let cpDataList =
        model.selectedLand.chapterDic.getList() as CampaignChapterInfo[];
      for (let index = 0; index < cpDataList.length; index++) {
        let cpData = cpDataList[index];
        if (itemData.id == cpData.chapterId) {
          model.selectedChapter = cpData;
          break;
        }
      }
    } else if (itemData.type == eSelectCampaignItemType.SecondItem) {
      let areaDataList =
        model.selectedChapter.areaDic.getList() as CampaignAreaInfo[];
      for (let index = 0; index < areaDataList.length; index++) {
        let areaData = areaDataList[index];
        if (itemData.id == areaData.areaId) {
          model.selectedArea = areaData;
          break;
        }
      }
      AudioManager.Instance.playSound(SoundIds.CAMPAIGN_CLICK_SOUND);
      this.refreshRight(model.selectedArea);
    } else {
    }
  }

  private renderTreeNode(node: fgui.GTreeNode, obj: fgui.GComponent) {
    // Logger.log("[SelectCampaignWnd]renderTreeNode", node.data)
    let itemData = node.data.itemData;
    if (node.data.type == eSelectCampaignItemType.FirstItem) {
      obj.text = itemData;
      obj.enabled = node.data.enabled;
      if (node.data.grayFilterFlag) {
        obj.filters = [UIFilter.grayFilter];
      } else {
        obj.filters = [UIFilter.normalFilter];
      }
      obj.getChild("imgLock").visible = !obj.enabled;
    } else if (node.data.type == eSelectCampaignItemType.RewardTipItem) {
      obj.getChild("title").text = itemData.text;
      obj.getChild("imgGot").visible = itemData.bComplete;
      let btnBox = obj.getChild("btnBox") as fgui.GButton;
      btnBox.filters = [
        itemData.bComplete ? UIFilter.lightFilter : UIFilter.darkFilter,
      ];
      btnBox.onClick(null, (evt: Laya.Event) => {
        let itemInfos = this.model.getChapterRewardDataList();
        FrameCtrlManager.Instance.open(EmWindow.DisplayItems, {
          itemInfos: itemInfos,
          title: itemData.bComplete
            ? LangManager.Instance.GetTranslation("selectcampaign.view.Awarded")
            : LangManager.Instance.GetTranslation(
                "selectcampaign.view.GetRewards",
              ),
        });
      });
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
      obj.getChild("imgTask").visible = itemData.bTask;
      obj.getChild("imgLock").visible = !obj.enabled;
    }
  }

  private renderListItem(index: number, item: BaseItem) {
    if (this._mayFallItemList.length == 0 || !item || item.isDisposed) return;
    let itemData = this._mayFallItemList[index];
    item.info = itemData ? itemData : null;
  }

  private refreshRight(
    campaignAreaInfo: CampaignAreaInfo,
    difficulty: CampaignMapDifficulty = CampaignMapDifficulty.General,
  ) {
    if (!campaignAreaInfo) return;

    this.model.selectCampaign = campaignAreaInfo.getMapByDifficult(difficulty);
    this.txtFbName.text = campaignAreaInfo.areaName;
    this.txtLevelTip.text = campaignAreaInfo.getRecommendLevel();

    this._mayFallItemList = [];
    let mayFallIdList = campaignAreaInfo.getMayFallItemList(difficulty);
    for (let index = 0; index < mayFallIdList.length; index++) {
      let info: GoodsInfo = new GoodsInfo();
      info.templateId = mayFallIdList[index];
      this._mayFallItemList.push(info);
    }
    this.itemList.numItems = mayFallIdList.length;

    this.refreshEvaluation(difficulty, campaignAreaInfo);

    this.btnModeYX.enabled =
      this.model.isHeroOpen() &&
      this.model.normalMap.state == CampaignMapStatus.OVER_CAMPAIGN;
    this.imgCanpaignBg.icon = campaignAreaInfo.getAreaImg();

    let bSingleCp = this.model.selectCampaign.Capacity == 1;
    let config: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName(
        bSingleCp ? "SingleCampaign_Weary" : "MultiCampaign_Weary",
      );
    this.txtChallengeCost.text = config.ConfigValue;

    let config2: t_s_configData =
      TempleteManager.Instance.getConfigInfoByConfigName("Campaign_Sweep_Gold");
    this.txtSweepCost.text = config2.ConfigValue;

    this.btnSweep.enabled =
      this.model.selectCampaign.state == CampaignMapStatus.OVER_CAMPAIGN;
    this.txtSweepTip.visible =
      this.model.selectCampaign.state != CampaignMapStatus.OVER_CAMPAIGN;
    this.btnChallenge.enabled =
      this.model.selectCampaign.state != CampaignMapStatus.NO_ACCEPT_CAMPAIGN;
    this.descTxt.visible = !this.btnChallenge.enabled;
    if (this.descTxt.visible) {
      this.descTxt.text = this.getDescTxt();
    }

    NewbieModule.Instance.manualTrigger(NewbieConfig.NEWBIE_212);
  }

  private getDescTxt(): string {
    let str: string = "";
    if (
      this.model.selectCampaign.MinLevel > ArmyManager.Instance.thane.grades
    ) {
      str = LangManager.Instance.GetTranslation(
        "fund.fundRewardView.NewbieTip",
      );
    } else if (
      this.model.selectCampaign.state == CampaignMapStatus.NO_ACCEPT_CAMPAIGN
    ) {
      str = LangManager.Instance.GetTranslation(
        "PveSelectCampaignWnd.descTxt.tip",
      );
    }
    return str;
  }

  private refreshEvaluation(
    difficulty: CampaignMapDifficulty = CampaignMapDifficulty.General,
    campaignAreaInfo?: CampaignAreaInfo,
  ) {
    if (!campaignAreaInfo) {
      campaignAreaInfo = this.model.selectedArea;
    }

    let campaignData = campaignAreaInfo.getMapByDifficult(difficulty);

    if (campaignData.isKingTower || campaignData.isTrailTower) {
      // this.imgEvaluate.icon = "";
      this.pass.selectedIndex = 2;
    } else {
      if (
        this.model.selectCampaign.state == CampaignMapStatus.NEW_CAMPAIGN ||
        this.model.selectCampaign.state == CampaignMapStatus.OPEN_CAMPAIGN
      ) {
        // this.imgEvaluate.icon = fgui.UIPackage.getItemURL(EmWindow.SelectCampaign, "Img_New")
        this.pass.selectedIndex = 0;
      } else {
        let rankInfo: RankInfo =
          CampaignRankManager.Instance.rankDic[campaignData.CampaignId];
        if (rankInfo) {
          this.pass.selectedIndex = 1;
          // this.imgEvaluate.icon = fgui.UIPackage.getItemURL(EmWindow.SelectCampaign, SelectCampaignData.EvaluateRes[rankInfo.rank - 1])
        } else {
          this.pass.selectedIndex = 0;
        }
      }
    }
  }

  public getSweepEnabled() {
    return this.btnSweep.enabled;
  }

  dispose() {
    this.tree.removeChildrenToPool();
    this.tree.off(fgui.Events.CLICK_ITEM, this, this.onClickTreeItem);

    if (this.tree.treeNodeRender instanceof Laya.Handler) {
      this.tree.treeNodeRender.recover();
    }

    this.tree.treeNodeRender = null;
    //当玩家通关副本开启该副本的扫荡功能后, 扫荡按钮上的文字颜色显示异常,界面缓存 保留的enabled=false的颜色
    this.btnSweep.enabled = true;
    super.dispose();
  }
}
