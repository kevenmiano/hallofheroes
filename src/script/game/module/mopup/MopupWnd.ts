/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-04-13 10:47:57
 * @LastEditTime: 2024-02-22 12:18:59
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import ConfigMgr from '../../../core/config/ConfigMgr';
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import { DateFormatter } from '../../../core/utils/DateFormatter';
import SimpleAlertHelper from '../../component/SimpleAlertHelper';
import { t_s_campaignData } from '../../config/t_s_campaign';
import { ConfigType } from '../../constant/ConfigDefine';
import { KingContractEvents } from '../../constant/event/NotificationEvent';
import { EmWindow } from '../../constant/UIDefine';
import { GoodsInfo } from '../../datas/goods/GoodsInfo';
import { TowerInfo } from '../../datas/playerinfo/TowerInfo';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { ResourceManager } from '../../manager/ResourceManager';
import { TempleteManager } from '../../manager/TempleteManager';
import { SceneManager } from '../../map/scene/SceneManager';
import SceneType from '../../map/scene/SceneType';
import { TimerTicker } from '../../utils/TimerTicker';
import MopupItem from './item/MopupItem';
import MopupData, { eMopupItemType, eMopupOptType, eMopupState, eMopupType } from './MopupData';
import { StringUtil } from '../../utils/StringUtil';
import { VIPManager } from '../../manager/VIPManager';
import { VipPrivilegeType } from '../../constant/VipPrivilegeType';
import { t_s_uiplaylevelData } from '../../config/t_s_uiplaylevel';
import { GoodsManager } from '../../manager/GoodsManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { t_s_uiplaybaseData } from '../../config/t_s_uiplaybase';
import { NumericStepper } from '../../component/NumericStepper';
import { PetCampaignManager } from '../../manager/PetCampaignManager';
import BaseTipItem from '../../component/item/BaseTipItem';
import TemplateIDConstant from '../../constant/TemplateIDConstant';

export default class MopupWnd extends BaseWindow {
    private list: fgui.GList
    private tfCount: fgui.GComponent
    private txtCountDesc: fgui.GLabel
    private txtCostTimeDesc: fgui.GLabel
    private txtCostTime: fgui.GLabel
    private txtCostGold: fgui.GLabel
    private txtCostPower: fgui.GLabel
    private txtCostAssetsDesc: fgui.GLabel
    private txt_rewardCount: fgui.GLabel
    private txtLeftTime: fgui.GLabel
    private gCost: fgui.GGroup
    private gOpenBox: fgui.GGroup
    private gGold: fgui.GGroup
    private gPower: fgui.GGroup
    private gMopupPre: fgui.GGroup
    private gMopuping: fgui.GGroup
    private btnTickSilverBox: UIButton
    private btnTickMysteryBox: UIButton
    private btnOpenKing: UIButton
    private btnSpeed: UIButton

    private _campaignTemp: t_s_campaignData
    private _campaignId: number = 0
    private _maxMopupCount: number = 0
    private _costTime: number = 0  //每次扫荡扣除的时间
    private _costGold: number = 0
    private _remainTimeCnt: number = 0  //剩余时间
    private _accumCount: number = 1     //第几次扫荡

    private _tickTimer: TimerTicker;      //单次时间
    private _totalTickTimer: TimerTicker; //总时间
    // private txtTotalExp: fgui.GLabel; //累积经验

    private _mopupItemList: any[] = []; //扫荡获得物品列表
    private btnStop: UIButton
    private gGoods: fgui.GGroup;
    private _levelData: t_s_uiplaylevelData;
    public txtCostGoods: fgui.GTextField;
    public costIcon: fgui.GLoader;
    public stepper: NumericStepper;
    private _handler: Laya.Handler;
    private tipItem1:BaseTipItem;
    private tipItem2:BaseTipItem;
    private tipItem3:BaseTipItem;
    public OnInitWind() {
        this.setCenter();
    }

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        if (!this.frameData) {
            this.frameData = { type: eMopupType.CampaignMopup, state: eMopupState.CampaignMopupPre }
        }
        if (!this.isMopuping) {
            if (SceneManager.Instance.currentType != SceneType.CASTLE_SCENE
                && SceneManager.Instance.currentType != SceneType.SPACE_SCENE) {
                //【【副本战斗】外城点击深渊气息副本扫荡, 直接闪退到内城】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001040396
                // SceneManager.Instance.setScene(SceneType.CASTLE_SCENE)
            }
        }
        this.tipItem1.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_POWER);
        Logger.xjy("[MopupWnd]OnShowWind", this.frameData, this.model.towerInfo, this.model)

        this.gPower.visible = this.frameData.type == eMopupType.CampaignMopup
        this.gOpenBox.visible = this.frameData.type == eMopupType.CampaignMopup
        this.gGoods.visible = this.frameData.type == eMopupType.PetCampaignMopup
        if (this.frameData.type != eMopupType.CampaignMopup && this.frameData.type != eMopupType.PetCampaignMopup) {
            this.txtCountDesc.text = LangManager.Instance.GetTranslation("MopupWnd.SweepLayer")
        }
        if (this.frameData.type == eMopupType.PetCampaignMopup) {
            if (this.frameData.state == eMopupState.PetCampaignMopupping) {
                this._levelData = this.getUIPlayLevelListByUiLevelId(this.frameData.UiLevelId)
            } else {
                this._levelData = this.frameData.levelData;
            }
            if (this._levelData.ConsumeType != 0) {//不是消耗体力
                this.tipItem3.setInfo(this._levelData.ConsumeType);
            }
            else {
                this.tipItem3.setInfo(TemplateIDConstant.TEMP_ID_POWER);
            }
        }
        // this._iTxtCount = this.tfCount.getChild('userName').asTextInput;
        // this._iTxtCount.on(Laya.Event.INPUT, this, this.__onTxtChange)

        this._handler && this._handler.recover();
        this._handler = Laya.Handler.create(this, this.__onTxtChange, null, false);

        this.addEvent()
        this.initData()
        this.setPage(this.isMopuping)
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
        this.removeEvent()
    }

    private addEvent() {
        this.model.addEventListener(MopupData.MOPUP_LIST_REFRESH, this.__refreshMopupingList, this);
        this.model.addEventListener(MopupData.MOPUP_END, this.__mopupEnd, this);
        NotificationManager.Instance.addEventListener(KingContractEvents.UPDATE_KINGCONTRACT, this.__updateKingContract, this);
    }

    private removeEvent() {
        this.model.removeEventListener(MopupData.MOPUP_LIST_REFRESH, this.__refreshMopupingList, this);
        this.model.removeEventListener(MopupData.MOPUP_END, this.__mopupEnd, this);
        NotificationManager.Instance.removeEventListener(KingContractEvents.UPDATE_KINGCONTRACT, this.__updateKingContract, this);
    }

    // 添加提示Item
    private addTipItem(type: eMopupItemType = eMopupItemType.Mopuping): MopupItem {
        // Logger.xjy("[MopupWnd]addTipItem", type)
        let item = this.list.addItemFromPool() as MopupItem;
        item.itemType = type
        item.setTitle(String(this._accumCount), this.frameData.type)
        item.txtStateDesc.y = item.txtGetExp.text == "" ? 70 : 90
        return item
    }

    /**
     * 这段逻辑搞这么乱是因为 副本或迷宫扫荡 单次、连续扫荡, 单次、连续扫荡中途重连, 单次、连续扫荡结束重连 发的数据都不一样啊
     * @returns 
     */
    private __refreshMopupingList() {
        if (!this.isShowing || !this.isMopuping || this.destroyed || !this.list || this.list.isDisposed) return

        let resultInfoList = this.model.resultInfoList;
        if (!resultInfoList || resultInfoList.length <= 0) {
            this.addTipItem()
            return
        }

        let allEnd = false
        for (let index = 0; index < resultInfoList.length; index++) {
            const itemData = resultInfoList[index];

            let item = this.list.addItemFromPool() as MopupItem;
            item.info = itemData
            item.itemType = itemData.type == 2 ? eMopupItemType.Mopuping : eMopupItemType.Mopuped
            Logger.xjy("[MopupWnd]__refreshMopupingList", this._accumCount, itemData.items)
            item.setTitle(String(this._accumCount), this.frameData.type)

            let perItems = itemData.items
            if (itemData.type == 1) {
                if (perItems.length > 0) {
                    let itemList: GoodsInfo[] = []
                    for (let j = 0; j < perItems.length; j++) {
                        let templateId = perItems[j].templateId;
                        let goodsInfo = new GoodsInfo();
                        goodsInfo.templateId = templateId;
                        goodsInfo.count = perItems[j].count;
                        // this._mopupItemList.push(goodsInfo);
                        itemList.push(goodsInfo)
                    }
                    item.setItemList(itemList)
                }
            }

            let maxCount = itemData.count
            let curCount = itemData.finishCount
            if (this.frameData.state == eMopupState.MazeMopuping) {
                maxCount = itemData.eIndex
                curCount = itemData.cIndex
            }

            if (curCount > 0) {
                if (curCount == maxCount) {
                    this._accumCount = maxCount
                } else {
                    if (index == resultInfoList.length - 1 && itemData.type == 2) {
                        this._accumCount = curCount
                        if (!maxCount) {
                            this._accumCount = curCount + 1
                        }
                    } else {
                        this._accumCount = curCount + 1
                    }
                }
            }
            if ((curCount > 0 && curCount == maxCount && itemData.type != 2) || this.model.mopupEnd == true) {
                allEnd = true;
            }
        }

        if (this.list.numChildren > 0) {
            for (let index = this.list.numChildren - 1; index >= 0; index--) {
                const item = this.list.getChildAt(index) as MopupItem;
                if (item.itemType != eMopupItemType.Mopuped) {
                    this.list.removeChildToPoolAt(index)
                }
            }
        }

        // this.addTipItem(allEnd ? eMopupItemType.MopupEnd : eMopupItemType.Mopuping)
        // this.list.scrollToView(this.list.numItems - 1, true)
    }

    private __mopupEnd() {
        this.model.mopupEnd = true;
        this.btnSpeed.enabled = false;
        this.btnStop.enabled = true;
        this._remainTimeCnt = 0;
        this._tickTimer && this._tickTimer.stop()
        this._totalTickTimer && this._totalTickTimer.stop()
        this.txtLeftTime.text = ""
    }

    /** 点击蒙版区域 (可重写) */
    protected OnClickModal() {
        //点击空白地方不关闭窗口
    }

    private initData() {
        if (this.frameData.type == eMopupType.CampaignMopup) {//战役扫荡
            this.btnTickMysteryBox.selected = false;
            this.dealCampaignData()
        } else if (this.frameData.type == eMopupType.PetCampaignMopup) {//英灵战役扫荡
            this.dealPetCampaignData();
        }else {
            this.btnTickMysteryBox.selected = true;
            this.dealMazeData()
        }

        // 下线上线获取的物品列表
        // if (this.model.mopupGoods) {
        //     for (let i = 0; i < this.model.mopupGoods.length; i++) {
        //         let templateId = this.model.mopupGoods[i].templateId;
        //         let goodsInfo = new GoodsInfo();
        //         goodsInfo.templateId = templateId;
        //         goodsInfo.count = this.model.mopupGoods[i].count;
        //         this._mopupItemList.push(goodsInfo);
        //     }
        // }

        // TODO
        // let str1:string = LangManager.Instance.GetTranslation("mopup.view.CampaignMopupPrepareFrame.CampaignMopupPrepareFrame.kingFreeTip");
        // let str2:string = "<font color='#06ff00'><a href='event:clickLink'><u>" + LangManager.Instance.GetTranslation("mainBar.view.ChoosePayTypeFrame.openVipTxt") + "</u></a></font>"
        // let str3:string = LangManager.Instance.GetTranslation("public.parentheses1",str2);
        // this.rTxtKingFree.text = str1 + str3;
    }

    private __totalTimer() {
        this._remainTimeCnt -= 1
        if (this._remainTimeCnt < 0) {
            this._remainTimeCnt = 0
        }
        this.txtLeftTime.text = DateFormatter.getConsortiaCountDate(this._remainTimeCnt);
    }

    private __totalTimerComplete() {
        this._remainTimeCnt = 0
        this.txtLeftTime.text = ""
    }

    private __timer() {
        // Logger.xjy("[MopupWnd]__timer", this._tickTimer.currentCount, this._tickTimer.repeatCount)
        // Logger.xjy("[MopupWnd]__timer delta", this._tickTimer.repeatCount - this._tickTimer.currentCount)
        // this.txtLeftTime.text = DateFormatter.getConsortiaCountDate(this._tickTimer.repeatCount - this._tickTimer.currentCount);
        this.txtLeftTime.text = DateFormatter.getConsortiaCountDate(this._remainTimeCnt);
    }

    private __timerComplete() {
        if (!this || !this.frameData) return

        // this.txtLeftTime.text = ""

        if (this.model.mopupEnd) return

        if (this.frameData.state == eMopupState.CampaignMopuping) {
            this.ctrl.sendMopupInfo(eMopupType.CampaignMopup, eMopupOptType.GetResult, this._campaignTemp.CampaignId);
        } else if (this.frameData.state == eMopupState.MazeMopuping) {
            this.ctrl.sendMopupInfo(eMopupType.MazeMopup, eMopupOptType.GetResult);
        } else if (this.frameData.state == eMopupState.PetCampaignMopupping) {
            this.ctrl.sendMopupInfo(eMopupType.PetCampaignMopup, eMopupOptType.GetResult, this._levelData.UiPlayId);
        }

        // Logger.xjy("[MopupWnd]__timerComplete")
        this._tickTimer.repeatCount = this._costTime
        this._tickTimer.start()
    }

    private dealCampaignData() {
        this._campaignId = this.model.campaignId;
        this._campaignTemp = ConfigMgr.Instance.getTemplateByID(ConfigType.t_s_campaign, this._campaignId);
        if (this._campaignTemp) this.txtFrameTitle.text = this._campaignTemp.CampaignNameLang;
        this._costTime = Number(TempleteManager.Instance.getConfigInfoByConfigName("Campaign_Sweep_Time").ConfigValue);
        this._costGold = Number(TempleteManager.Instance.getConfigInfoByConfigName("Campaign_Sweep_Gold").ConfigValue);

        this._maxMopupCount = Math.floor(this.model.weary / MopupData.WEARY);
        this.stepper.show(0, 1, 1, this._maxMopupCount, this.mopupCount, 1, this._handler);
        this.__onTxtChange(null)
    }

    private dealMazeData() {
        let towerInfo = this.model.towerInfo
        if (towerInfo.campaignId == 8101 || this.model.campaignId == 8101) {
            this.txtFrameTitle.text = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.AbyssTitleText");
        } else if (towerInfo.campaignId == 8001 || this.model.campaignId == 8001) {
            this.txtFrameTitle.text = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.titleText");
        }

        this._costTime = Number(TempleteManager.Instance.getConfigInfoByConfigName("Tower_Sweep_Time").ConfigValue);
        this._costGold = Number(TempleteManager.Instance.getConfigInfoByConfigName("Tower_Sweep_Gold").ConfigValue);
        let index = 0
        if (this.model.towerInfo.maxIndex)
            index = this.model.towerInfo.maxIndex;

        this._maxMopupCount = index;
        this.stepper.show(0, this._maxMopupCount, 1, this._maxMopupCount, this._maxMopupCount, 1, this._handler);
        this.__onTxtChange(null)
        //迷宫:  towerPassIndex 通关层次, 弃用towerindex当前所在层次；避免怪物被打死, 没有走入下一层。
        if (towerInfo.towerPassIndex > 0) {
            this._accumCount = towerInfo.towerPassIndex;
        }
    }

    private dealPetCampaignData() {
        let str: string;
        let baseDic: Map<number, t_s_uiplaybaseData> = ConfigMgr.Instance.getDicSync(ConfigType.t_s_uiplaybase);
        for (const key in baseDic) {
            if (Object.prototype.hasOwnProperty.call(baseDic, key)) {
                let data: t_s_uiplaybaseData = baseDic[key];
                if (data && data.UiPlayId == this._levelData.UiPlayId) {
                    str = data.UiPlayNameLang;
                }
            }
        }
        this.txtFrameTitle.text = str + "-" + LangManager.Instance.GetTranslation("petCampaign.Level", this._levelData.UiLevelSort);
        this._costTime = Number(TempleteManager.Instance.getConfigInfoByConfigName("Campaign_Sweep_Time").ConfigValue);
        this._costGold = Number(TempleteManager.Instance.getConfigInfoByConfigName("Campaign_Sweep_Gold").ConfigValue);
        let totalCount: number = 0;
        //根据黄金来计算最大的扫荡次数
        let goldMaxCount1: number = Math.floor(ResourceManager.Instance.gold.count / this._levelData.ContinuityGold);
        let maxCount2: number = 0;
        if (this._levelData.ConsumeType == 0) {//额外消耗体力
            totalCount = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
            maxCount2 = Math.floor(totalCount / this._levelData.ConsumeNum);
        }
        else {//额外消耗物品
            totalCount = GoodsManager.Instance.getGoodsNumByTempId(this._levelData.ConsumeType);
            maxCount2 = Math.floor(totalCount / this._levelData.ConsumeNum);//根据物品计算可以扫荡的最大次数
        }
        this._maxMopupCount = goldMaxCount1 > maxCount2 ? maxCount2 : goldMaxCount1;
        if(this._maxMopupCount > PetCampaignManager.Instance.model.leftRewardCount){
            this._maxMopupCount  = PetCampaignManager.Instance.model.leftRewardCount;
        }
        this.stepper.show(0, 1, 1, this._maxMopupCount, this.mopupCount, 1, this._handler);
        this.__onTxtChange(null);
    }

    private __onTxtChange(evt: Event) {
        let count = this.mopupCount;
        this.txtCostGold.text = this.hasMopupBuff ? "0" : String(count * this._costGold);
        this.txtCostTime.text = DateFormatter.getConsortiaCountDate(count * this._costTime);
        this.txt_rewardCount.visible = false;
        switch (this.frameData.type) {
            case eMopupType.MazeMopup:
                if (this._costGold == 0) {
                    this.txtCostAssetsDesc.text = '';
                    this.gGold.visible = false;
                    // 隐藏加速按钮, 停止按钮居中
                    this.btnSpeed.visible = false;
                    this.txtLeftTime.x = 585;
                    this.btnStop.x = 575;
                }
                break;
            case eMopupType.CampaignMopup:
                this.txtCostPower.text = String(count * MopupData.WEARY);
                if (this._costGold == 0) {
                    this.gPower.x = 581;
                    this.gGold.visible = false;
                    // 隐藏加速按钮, 停止按钮居中
                    this.btnSpeed.visible = false;
                    this.txtLeftTime.x = 585;
                    this.btnStop.x = 575;
                }
                break;
            case eMopupType.PetCampaignMopup:
                let cost: number = this._levelData.ConsumeNum;
                this.txtCostGoods.text = (count * cost).toString();
                if (this._levelData.ContinuityGold == 0) {
                    this.gGoods.x = 581;
                    this.gGold.visible = false;
                    // 隐藏加速按钮, 停止按钮居中
                    this.btnSpeed.visible = false;
                    this.txtLeftTime.x = 585;
                    this.btnStop.x = 575;
                }
                this.txt_rewardCount.text = LangManager.Instance.GetTranslation('PetCampaignCostRewardTimes',count);
                this.txt_rewardCount.visible = true;
                break;
            default:
                break;
        }
    }

    private lastCountValue: number = 1;
    /**
     * 需要扫荡的次数或层数
     */
    private get mopupCount(): number {
        let count = this.stepper.value;
        if (!StringUtil.isNumber(count.toString())) {
            this.stepper.resetStepper(this.lastCountValue);
            return this.lastCountValue;
        }
        this.lastCountValue = count;
        if (this.frameData.type == eMopupType.CampaignMopup) {
            count = count > this._maxMopupCount ? this._maxMopupCount : count;
            this.stepper.resetStepper(count);
        } else if (this.frameData.type == eMopupType.PetCampaignMopup) {
            count = count > this._maxMopupCount ? this._maxMopupCount : count;
            this.stepper.resetStepper(count);
        }
        else {
            let towerInfo = this.model.towerInfo as TowerInfo
            if (towerInfo.campaignId == 8001) {
                count = count > 100 ? 100 : count;
            } else if (towerInfo.campaignId == 8101) {
                count = count > 30 ? 30 : count;
            }
            this.stepper.resetStepper(count);

            if (towerInfo.towerIndex) {
                count = count - towerInfo.towerIndex + 1;
            }
        }
        Logger.xjy("[MopupWnd]mopupCount", count, this._maxMopupCount)
        return count < 0 ? 0 : count
    }

    private __updateKingContract() {
        if (this.hasMopupBuff) {
            this.txtCostGold.text = "0";
        }
    }

    private btnStartClick() {
        if (this.isMopuping) return

        if (this.frameData.type == eMopupType.CampaignMopup) {
            this.dealCampaignClick();
        } else if (this.frameData.type == eMopupType.PetCampaignMopup) {
            this.dealPetCampaignClick();
        }
        else {
            this.dealMazeClick();
        }
        // this.btnStop.enabled = false;
    }

    private dealPetCampaignClick() {
        let count = this.stepper.value
        if (count <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("MopupWnd.SweepLayerTip"));
            this.stepper.resetStepper(1);
            this.__onTxtChange(null);
        }
        if (this._levelData.ConsumeType == 0) {//消耗体力
            let hasEnergy: number = PlayerManager.Instance.currentPlayerModel.playerInfo.weary;
            if (hasEnergy < this._levelData.ConsumeNum * count) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.challengeTips1"));
                return;
            }
        }
        else {
            let hasGoodsCount: number = GoodsManager.Instance.getGoodsNumByTempId(this._levelData.ConsumeType);
            if (hasGoodsCount < this._levelData.ConsumeNum * count) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("petCampaign.challengeTips2"));
                return;
            }
        }
        this.model.mopupCount = count;
        this.ctrl.sendMopupInfo(eMopupType.PetCampaignMopup, eMopupOptType.Mopup,
            this._levelData.UiPlayId, this.model.mopupCount, this._levelData.UiLevelId, 1);
        return false;
    }

    private dealCampaignClick(): boolean {
        let count = this.stepper.value;
        if (count <= 0) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("MopupWnd.SweepLayerTip"));
            this.stepper.resetStepper(1)
            this.__onTxtChange(null);
        }
        if (this.model.weary < count * MopupData.WEARY) {
            let str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData03");
            MessageTipManager.Instance.show(str);
            this.stepper.resetStepper(1)
            this.__onTxtChange(null);
            return true;
        }

        if (Number(this.txtCostGold) > ResourceManager.Instance.gold.count) {
            let str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData02");
            MessageTipManager.Instance.show(str);
            return true;
        }
        this.model.mopupCount = count;

        this.ctrl.sendMopupInfo(eMopupType.CampaignMopup, eMopupOptType.Mopup,
            this._campaignTemp.CampaignId, this.model.mopupCount, 0, 1, this.btnTickSilverBox.selected, this.btnTickMysteryBox.selected);

        return false
    }

    private dealMazeClick(): boolean {
        let count = this.stepper.value;
        if (count <= 0) {
            let str = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.layerTipData1");
            MessageTipManager.Instance.show(str);
            this.stepper.resetStepper(1);
            this.__onTxtChange(null);
            return true
        } else if (count < this.model.towerInfo.towerIndex) {
            let str = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.layerTipData2");
            MessageTipManager.Instance.show(str);
            this.stepper.resetStepper(this._maxMopupCount);
            this.__onTxtChange(null);
            return true;
        } else if (count > this._maxMopupCount) {
            let str = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.layerTipData3");
            MessageTipManager.Instance.show(str);
            this.stepper.resetStepper(this._maxMopupCount);
            this.__onTxtChange(null);
            return true;
        }

        if (Number(this.txtCostGold.text) > ResourceManager.Instance.gold.count) {
            let str = LangManager.Instance.GetTranslation("mopup.MopupManager.mopupTipData02");
            MessageTipManager.Instance.show(str);
            return true;
        }

        this.model.mopupCount = this.mopupCount;
        this.model.mopupLayer =this.stepper.value
        this.ctrl.sendMopupInfo(eMopupType.MazeMopup, eMopupOptType.Mopup, this.model.towerInfo.campaignId, 0, this.model.mopupLayer, this.model.isDoubleProfit);

        return false
    }

    private setPage(mopuping: boolean = false) {
        this.model.isMopup = mopuping
        this.gMopuping.visible = mopuping
        this.gMopupPre.visible = !mopuping

        if (this.frameData.type == eMopupType.CampaignMopup) {
            this.frameData.state = mopuping ? eMopupState.CampaignMopuping : eMopupState.CampaignMopupPre
        } else if (this.frameData.type == eMopupType.PetCampaignMopup) {
            this.frameData.state = mopuping ? eMopupState.PetCampaignMopupping : eMopupState.PetCampaignMopupPre
        } else {
            this.frameData.state = mopuping ? eMopupState.MazeMopuping : eMopupState.MazeMopupPre
        }

        if (mopuping) {
            // if (this.model.mopupRemainTime > 0) {
            //     this._remainTimeCnt = this.model.mopupRemainTime;
            // } else if (this.model.mopupEnd) {
            //     this._remainTimeCnt = 0;
            // } else {
            //     this._remainTimeCnt = this.model.mopupCount * this._costTime
            // }

            // if (!this.model.mopupEnd) {
            //     // 该次扫荡计时器
            //     let costTime = this._costTime
            //     if (this.model.mopupRemainTime > 0) {
            //         costTime = this.model.mopupRemainTime - Math.floor(this.model.mopupRemainTime / this._costTime) * this._costTime;
            //     }
            //     this._tickTimer = new TimerTicker(1000, costTime, this.__timer.bind(this), this.__timerComplete.bind(this));
            //     this._tickTimer.start();
            //     this._totalTickTimer = new TimerTicker(1000, this._remainTimeCnt, this.__totalTimer.bind(this), this.__totalTimerComplete.bind(this));
            //     this._totalTickTimer.start();
            // } else {
            //     this.btnSpeed.enabled = false
            // }

            // 改为立即扫荡完成 无论是否有vip权限
            this.speedImmediately()

            this.__refreshMopupingList()
        }
    }

    public speedImmediately() {
        if (this.model.mopupEnd) {
            let str: string = LangManager.Instance.GetTranslation("mopup.view.MazeMopupIngFrame.mopupEnd");
            MessageTipManager.Instance.show(str);
        } else {
            if (this.frameData.state == eMopupState.CampaignMopuping) {
                this.ctrl.sendMopupInfo(eMopupType.CampaignMopup, eMopupOptType.GetResult, this._campaignTemp.CampaignId);
            } else if (this.frameData.state == eMopupState.MazeMopuping) {
                this.ctrl.sendMopupInfo(eMopupType.MazeMopup, eMopupOptType.GetResult);
            } else if (this.frameData.state == eMopupState.PetCampaignMopupping) {
                this.ctrl.sendMopupInfo(eMopupType.PetCampaignMopup, eMopupOptType.GetResult, this._levelData.UiPlayId);
            }
        }
    
    }

    private btnSpeedClick() {
        if (!this.isMopuping) return

        if (VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.SPEEDUP_SWEEP)) {
            this.__btnSpeedClick(true, true)
            return
        }

        let cfgSpeedUpValue = 1;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("FastSweep_Price");
        if (cfgItem) {
            cfgSpeedUpValue = Number(cfgItem.ConfigValue);
        }
        let acceleratePoint = cfgSpeedUpValue * Math.ceil(this._remainTimeCnt / 60);
        let content = LangManager.Instance.GetTranslation("mopup.view.MazeMopupIngFrame.AccelerateTip", acceleratePoint);
        let checkStr = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.useBind");
        let checkStr2 = LangManager.Instance.GetTranslation("mainBar.view.VipCoolDownFrame.promptTxt");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.USEBINDPOINT_ALERT, { checkRickText: checkStr, checkRickText2: checkStr2, checkDefault: true }, null, content, null, null, this.__btnSpeedClick.bind(this));
    }

    private __btnSpeedClick(b: boolean, check: boolean) {
        if (!b) return

        if (this.model.mopupEnd) {
            let str: string = LangManager.Instance.GetTranslation("mopup.view.MazeMopupIngFrame.mopupEnd");
            MessageTipManager.Instance.show(str);
        } else {
            let campaignId = 0;
            let endIndex: number = 0;
            let payType: number;
            if (this.frameData.state == eMopupState.CampaignMopuping) {
                campaignId = this._campaignTemp.CampaignId;
            } else if (this.frameData.state == eMopupState.PetCampaignMopupping) {
                campaignId = this._levelData.UiPlayId;
                endIndex = this._levelData.UiLevelId;
            }
            if (this.frameData.state == eMopupState.CampaignMopuping
                || this.frameData.state == eMopupState.PetCampaignMopupping) {
                payType = 0;
            }
            else {
                payType = 2;
            }
            if (!check) {
                payType = 1;
            }
            if (this.frameData.state == eMopupState.PetCampaignMopupping) {
                this.ctrl.sendMopupInfo(eMopupType.CampaignMopup, eMopupOptType.Speed, campaignId, 0, endIndex, 1, false, false, payType);
            }
            else {
                this.ctrl.sendMopupInfo(eMopupType.CampaignMopup, eMopupOptType.Speed, campaignId, 0, 0, 1, false, false, payType);
            }
        }
    }

    private btnCloseClick() {
        this.exit(true)
    }

    private btnStopClick() {
        if (!this.isMopuping) return

        if (!this.model.mopupEnd) {
            // let content: string = LangManager.Instance.GetTranslation("mopup.view.MazeMopupIngFrame.alertContent");
            // SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, null, content, null, null, this.exit.bind(this));
        } else {
            this.exit(true);
        }
    }


    private exit(b: boolean) {
        if (!b) return
        if (this.frameData.type == eMopupType.CampaignMopup) {
            this.ctrl.sendMopupInfo(eMopupType.CampaignMopup, eMopupOptType.Cancel, this._campaignTemp.CampaignId);
        } else if (this.frameData.type == eMopupType.PetCampaignMopup) {
            this.ctrl.sendMopupInfo(eMopupType.PetCampaignMopup, eMopupOptType.Cancel);
        } else {
            this.ctrl.sendMopupInfo(eMopupType.MazeMopup, eMopupOptType.Cancel);
        }

        this.OnBtnClose()
    }

    private btnOpenKingClick() {
        // TODO by jeremy.xu 精灵盟约
        // FrameCtrlManager.Instance.open(EmWindow.KingContract);
    }

    private btnHelpClick() {
        let content = LangManager.Instance.GetTranslation("mopup.view.MazeMopupPrepareFrame.mopupTipTxt");
        UIManager.Instance.ShowWind(EmWindow.Help, { content: content });
    }

    private getUIPlayLevelListByUiLevelId(UiLevelId: number): t_s_uiplaylevelData {
        let levelDic = ConfigMgr.Instance.getDicSync(ConfigType.t_s_uiplaylevel)
        for (const key in levelDic) {
            if (Object.prototype.hasOwnProperty.call(levelDic, key)) {
                const element = levelDic[key];
                if (element.UiLevelId == UiLevelId) {
                    return element;
                }
            }
        }
        return null;
    }
    private get hasMopupBuff(): boolean {
        // TODO by jeremy.xu 精灵盟约
        // return KingContractManager.Instance.checkHasBuffById(KingContractModel.MOPUP_BUFF) && ConfigManager.info.KING_CONTRACT;
        return false
    }

    private get isMopuping(): boolean {
        return this.frameData && (this.frameData.state == eMopupState.CampaignMopuping || this.frameData.state == eMopupState.MazeMopuping || this.frameData.state == eMopupState.PetCampaignMopupping)
    }

    dispose() {
        this.removeEvent();
        this._tickTimer && this._tickTimer.stop()
        this._tickTimer = null;
        this._totalTickTimer && this._totalTickTimer.stop()
        this._totalTickTimer = null;
        try {
            this.list.removeChildrenToPool();
        } catch (error) {
            Logger.error(error);
        }
        super.dispose();
    }
}