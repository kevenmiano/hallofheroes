// @ts-nocheck
import LangManager from '../../../core/lang/LangManager';
import Logger from '../../../core/logger/Logger';
import BaseWindow from '../../../core/ui/Base/BaseWindow';
import UIButton from '../../../core/ui/UIButton';
import UIManager from '../../../core/ui/UIManager';
import { IconFactory } from '../../../core/utils/IconFactory';
import { t_s_itemtemplateData } from '../../config/t_s_itemtemplate';
import { RuneEvent } from '../../constant/event/NotificationEvent';
import { EmWindow } from '../../constant/UIDefine';
import { RuneInfo } from '../../datas/RuneInfo';
import { ArmyManager } from '../../manager/ArmyManager';
import { GoodsManager } from '../../manager/GoodsManager';
import { MessageTipManager } from '../../manager/MessageTipManager';
import { NotificationManager } from '../../manager/NotificationManager';
import { PlayerManager } from '../../manager/PlayerManager';
import { TempleteManager } from '../../manager/TempleteManager';
import { FrameCtrlManager } from '../../mvc/FrameCtrlManager';
import RuneItem from './item/RuneItem';
import SkillWndCtrl from './SkillWndCtrl';
/**
* @author:pzlricky
* @data: 2021-04-21 21:19
* @description 符文升级窗口
*/
export default class RunesUpgradeWnd extends BaseWindow {

    public frame: fgui.GComponent;
    public runeItem: RuneItem;
    public runeNameTxt: fgui.GTextField;
    public upProgressBar: fgui.GProgressBar;
    public costGoldIcon: fgui.GLoader;
    public costRuneIcon: fgui.GLoader;
    public CostGoldNumTxt: fgui.GTextField;
    public upCostLabel: fgui.GTextField;
    public upProgressLabel: fgui.GTextField;
    public RecruitNumTxt: fgui.GTextInput;
    public simMaxBtn: UIButton;
    public simMinBtn: UIButton;
    public upCostRuneTick: fgui.GButton;
    public upCostGoldTick: fgui.GButton;
    public upgradeBtn: UIButton;
    public btnHelp: UIButton;

    //Data
    private currRuneData: RuneInfo;
    private _runeCarryTwoLevel: number = 40;
    private _runeOpenLevel: number = 35;
    public static LOW_RUNE_TEMPID: number = 3020010;
    private _chcekcIndex: number = 0;

    //controller
    private helpCtrl: fgui.Controller;

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        if (this.params) {
            this.currRuneData = this.params;
        }
        this.onInitView();
        this.addEvent();
    }

    onInitView() {
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('armyII.viewII.rune.RuneUpgradeView.TitleTxt');
        this.upProgressLabel.text = LangManager.Instance.GetTranslation('armyII.viewII.rune.RuneUpgradeView.ProgressTxt');
        this.upCostLabel.text = LangManager.Instance.GetTranslation('armyII.viewII.rune.RuneUpgradeView.UpgradeCostTxt');

        this._runeCarryTwoLevel = Number(TempleteManager.Instance.getConfigInfoByConfigName("CarryTwoRune").ConfigValue);
        this._runeOpenLevel = Number(TempleteManager.Instance.getConfigInfoByConfigName("OpenRuneGrade").ConfigValue);
        this.upCostRuneTick.selected = true;//默认选择符文
        this.upCostGoldTick.selected = false;//默认选择符文
        this._chcekcIndex = 0;
        this.RecruitNumTxt.text = '0';
        this.btnHelp.visible = true;
        this.updateUpgradeBtn();
        //
        this.updateView();

        this.setRunInfo(this.currRuneData);
        this.__runeRefreshHandler(null);
    }

    addEvent() {
        this.upgradeBtn.onClick(this, this.__upgradeBtnClickHandler.bind(this));
        this.upCostRuneTick.onClick(this, this.onCheckRuneHandler.bind(this));
        this.upCostGoldTick.onClick(this, this.onCheckGoldHandler.bind(this));
        this.simMaxBtn.onClick(this, this.__onRequiredNumAdd.bind(this));
        this.simMinBtn.onClick(this, this.__onRequiredNumReduce.bind(this));
        this.btnHelp.onClick(this, this.onShowHelpTIps.bind(this));
        this.RecruitNumTxt.on(Laya.Event.INPUT, this, this.__textChangeHandler);
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_UPGRADE, this.__runeRefreshHandler, this);
    }

    offEvent() {
        this.upgradeBtn.offClick(this, null);
        this.upCostRuneTick.offClick(this, null);
        this.upCostGoldTick.offClick(this, null);
        this.simMaxBtn.offClick(this, null);
        this.simMinBtn.offClick(this, null);
        this.btnHelp.offClick(this, this.onShowHelpTIps.bind(this));
        this.RecruitNumTxt.off(Laya.Event.INPUT, this, this.__textChangeHandler)
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_UPGRADE, this.__runeRefreshHandler, this);
    }

    onShowHelpTIps() {
        let title = LangManager.Instance.GetTranslation('armyII.SkillFrame.HelpBtn.RuneTipdata');
        let content = LangManager.Instance.GetTranslation('armyII.RuneHelpFrame.helpContent');
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    private __onRequiredNumReduce() {
        this.currRuneNumber = 1;
        if (this.currRuneNumber > this._max) {
            this.currRuneNumber = 0;
        }
        this.refreshResource();
    }

    private __onRequiredNumAdd() {
        this.currRuneNumber = this._max;
        this.refreshResource();
    }

    private refreshResource() {
        this.RecruitNumTxt.text = this.currRuneNumber.toString();
        var value: number = parseInt(this.RecruitNumTxt.text);
        if (!value) value = 0;
        if (value == 0 && this._chcekcIndex == 0) {
            this.upgradeBtn.enabled = false;
        } else if (value > 0) {
            this.upgradeBtn.enabled = true;
        }
    }

    private currRuneNumber: number = 0;
    private _max: number = 0;
    private __textChangeHandler(e: Event) {
        var value: number = parseInt(this.RecruitNumTxt.text);
        if (!value) value = 0;
        if (value > this._max) {
            this.RecruitNumTxt.text = this._max.toString();
            value = this._max;
        } else {
            this.RecruitNumTxt.text = value.toString();
        }
        if (value == 0 && this._chcekcIndex == 0) {
            this.upgradeBtn.enabled = false;
        } else if (value > 0) {
            this.upgradeBtn.enabled = true;
        }
        this.updateView();
    }

    /**切换消耗符文,钻石勾选框 */
    onCheckRuneHandler() {
        let checkState = this.upCostRuneTick.selected;
        let checkGoldState = this.upCostGoldTick.selected;
        if (checkState) {
            this._chcekcIndex = 0;
            this.upCostGoldTick.selected = checkGoldState ? !checkGoldState : checkGoldState;
        } else {
            this._chcekcIndex = -1;
        }
        this.updateUpgradeBtn();
    }

    /**切换消耗符文,钻石勾选框 */
    onCheckGoldHandler() {
        let checkRuneState = this.upCostRuneTick.selected;
        let checkGoldState = this.upCostGoldTick.selected;
        if (checkGoldState) {
            this._chcekcIndex = 1;
            this.upCostRuneTick.selected = checkRuneState ? !checkRuneState : checkRuneState;
        } else {
            this._chcekcIndex = -1;
        }
        this.updateUpgradeBtn();
    }

    private updateUpgradeBtn() {
        if (this._chcekcIndex == 0) {
            var value: number = parseInt(this.RecruitNumTxt.text);
            if (!value) value = 0;
            if (value == 0) {
                this.upgradeBtn.enabled = false;
            } else {
                this.upgradeBtn.enabled = this.upCostRuneTick.selected;;
            }
        } else if (this._chcekcIndex == 1) {
            this.upgradeBtn.enabled = this.upCostGoldTick.selected;
        } else {
            this.upgradeBtn.enabled = false;
        }
    }

    private __upgradeBtnClickHandler(evt) {
        var str: string;
        if (this._chcekcIndex == 0) {
            var value: number = parseInt(this.RecruitNumTxt.text);
            if (!value || value == 0) return;
            if (this.currRuneData.nextTemplateInfo && this.currRuneData.grade < 10) {
                if (ArmyManager.Instance.thane.grades < this.currRuneData.nextTemplateInfo.NeedGrade && this.currRuneData.runeCurGp == this.currRuneData.nextTemplateInfo.NeedGp) {
                    str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt2");
                    MessageTipManager.Instance.show(str);
                } else {
                    this.controler.sendUpgradeRune(this.currRuneData.runeId, value);
                    this.upgradeBtn.enabled = false;
                }
            } else {
                str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt3");
                MessageTipManager.Instance.show(str);
            }

        } else {
            if (PlayerManager.Instance.currentPlayerModel.playerInfo.point < Number(this.CostGoldNumTxt.text)) {
                str = LangManager.Instance.GetTranslation("Auction.ResultAlert11");
                MessageTipManager.Instance.show(str);
                // RechargeAlertMannager.Instance.show();
                return;
            }
            var str: string;
            if (this.currRuneData.nextTemplateInfo && this.currRuneData.grade < 10) {
                if (ArmyManager.Instance.thane.grades < this.currRuneData.nextTemplateInfo.NeedGrade && this.currRuneData.runeCurGp == this.currRuneData.nextTemplateInfo.NeedGp) {
                    str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt2");
                    MessageTipManager.Instance.show(str);
                } else {
                    this.controler.sendUpgradeRune(this.currRuneData.runeId, 0);//0表示用钻石培养
                }
            } else {
                str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt3");
                MessageTipManager.Instance.show(str);
            }
        }
        this.updateView();
    }

    /**更新钻石消耗数量 */
    private updateView() {
        if (this.RecruitNumTxt.text == '') return;
        var goodsTemplate: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(RunesUpgradeWnd.LOW_RUNE_TEMPID);
        let cfgValue = 2;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("UpRune_Price");
        if(cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        var index: number = PlayerManager.Instance.currentPlayerModel.playerInfo.diamondIndex;
        let _diamondCount = cfgValue * (index + 1);
        this.costRuneIcon.icon = IconFactory.getCommonIconPath(goodsTemplate.Icon);
        // _diamondBtn.tipData = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.DiamondTipTxt", _diamondCount);
        this.CostGoldNumTxt.text = _diamondCount + "";
    }

    private __runeRefreshHandler(evt) {
        let tempMax = GoodsManager.Instance.goodsCountByTempId[RunesUpgradeWnd.LOW_RUNE_TEMPID];
        this._max = tempMax ? tempMax : 0;
        this.RecruitNumTxt.text = this._max.toString();
        var runeList: Array<any> = ArmyManager.Instance.thane.runeCate.allRuneList.getList();

        for (let key in runeList) {
            if (Object.prototype.hasOwnProperty.call(runeList, key)) {
                var index: number = Number(key);
                var info: RuneInfo = runeList[index];
                if (info && info.templateInfo.RuneType == this.currRuneData.templateInfo.RuneType) {
                    this.setRunInfo(info);
                    break;
                }
            }
        }
        if (this._max == 0 && this._chcekcIndex == 0) {
            this.upgradeBtn.enabled = false;
        } else {
            this.upgradeBtn.enabled = true;
        }
    }

    /**设置当前符文信息 */
    setRunInfo(value: RuneInfo) {
        this.runeItem.ItemData = value;
        this.runeItem.upgradeIndex = 0;//符文升级不展示升级标签
        this.runeNameTxt.text = value.templateInfo.TemplateNameLang + '  ' + LangManager.Instance.GetTranslation("public.level3",value.templateInfo.RuneGrade.toString());//名称
        if (value.nextTemplateInfo) {
            this.upProgressBar.value = (value.runeCurGp / value.nextTemplateInfo.NeedGp) * 100;
            this.upProgressBar.getChild('progress').text = value.runeCurGp + '/' + value.nextTemplateInfo.NeedGp;
        } else {
            this.upProgressBar.value = (value.templateInfo.NeedGp / value.templateInfo.NeedGp) * 100;
            this.upProgressBar.getChild('progress').text = value.templateInfo.NeedGp + '/' + value.templateInfo.NeedGp;
        }
        ArmyManager.Instance.thane.runeInfo = value;
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }

}