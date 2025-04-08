import FUI_SkillItemCom from "../../../fui/Skill/FUI_SkillItemCom";
import FUI_scollText from "../../../fui/Skill/FUI_scollText";
import LangManager from "../../core/lang/LangManager";
import Logger from "../../core/logger/Logger";
import { IconFactory } from "../../core/utils/IconFactory";
import { BaseIcon } from "../component/BaseIcon";
import { NumericStepper } from "../component/NumericStepper";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_runetemplateData } from "../config/t_s_runetemplate";
import { t_s_skilltemplateData } from "../config/t_s_skilltemplate";
import GoodsSonType from "../constant/GoodsSonType";
import { IconType } from "../constant/IconType";
import { EmWindow } from "../constant/UIDefine";
import { RuneEvent } from "../constant/event/NotificationEvent";
import { RuneInfo } from "../datas/RuneInfo";
import { SkillInfo } from "../datas/SkillInfo";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { TempleteManager } from "../manager/TempleteManager";
import ScrollTextField from "../module/common/ScrollTextField";
import NewbieUtils from "../module/guide/utils/NewbieUtils";
import { ShopGoodsInfo } from "../module/shop/model/ShopGoodsInfo";
import RunesUpgradeWnd from "../module/skill/RunesUpgradeWnd";
import SkillWnd from "../module/skill/SkillWnd";
import SkillWndCtrl from "../module/skill/SkillWndCtrl";
import RunesPanel from "../module/skill/content/RunesPanel";
import FastRuneItem from "../module/skill/item/FastRuneItem";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import BaseTips from "./BaseTips";

/**
 * 符文TIP 符文能信息调整为用TIPS的形式表现, 符文下一等级效果预览拆分在另外一个小TIPS中显示
 * 符文升级弹窗整合到符文TIPS中
 */
export class RuneItemTips extends BaseTips {

    private runeEffect: fgui.GComponent;
    private skillEffectRichText: ScrollTextField;//当前技能效果
    private runeCold: fgui.GTextField;//当前技能冷却时间
    private runeCost: fgui.GTextField;//当前技能消耗怒气

    private nextSkillCold: fgui.GTextField;//当前技能冷却时间
    private nextSkillCost: fgui.GTextField;//当前技能消耗怒气

    public nextSkillEffect: FUI_scollText;
    public maxSkillEffect: FUI_scollText;

    //下一级技能效果
    private runeEffect2: fgui.GComponent;
    private nextSkillEffectRichText: ScrollTextField;//下一级技能效果
    private maxSkillEffectRichText: ScrollTextField;//下一级技能效果

    private runeName: fgui.GTextField;//技能名称z
    private skillName2: fgui.GTextField;//技能名称
    private runeLevel: fgui.GTextField;//技能等级
    private selectSkillItem: BaseIcon;//当前右侧选中技能
    private item2: BaseIcon;//当前右侧选中技能
    private item3: BaseIcon;//当前右侧选中技能
    private bePassiveSkillLabel: fgui.GTextField;//被动
    private bePassiveSkillLabel2: fgui.GTextField;//被动
    private bePassiveSkillLabel3: fgui.GTextField;//被动

    private txt1: fgui.GTextField;
    private txt_lv1: fgui.GTextField;
    private txt_lv2: fgui.GTextField;
    private txt_active_tip: fgui.GTextField;
    private txt_coldmax: fgui.GTextField;
    private txt_costmax: fgui.GTextField;
    private txt_max: fgui.GTextField;
    private skillName3: fgui.GTextField;


    private nextBox: fgui.GGroup;
    private maxBox: fgui.GGroup;
    private nextSubBox: fgui.GGroup;
    private totalBox: fgui.GGroup;
    private box1: fgui.GGroup;
    private box3: fgui.GGroup;
    private levelupBox: fgui.GGroup;
    img_bg: fgui.GComponent;

    public list: fgui.GList;

    private studyBtn: fgui.GButton;//学习
    private upgradeBtn: fgui.GButton;

    private selectSkillData: SkillInfo = null;
    public selectRuneItem: BaseIcon;
    private _selectRuneData: RuneInfo = null;//当前选择符文信息
    private _runeGInfo: GoodsInfo;
    private _requireGoodsList: Array<any> = [];//升级所需物品信息
    public studyBox: fgui.GGroup;//所需物品Group

    public img_barbg0: fgui.GImage;
    public img_barbg1: fgui.GImage;
    public txt_progress: fgui.GTextField;

    public costGoldIcon: fgui.GLoader;
    public costRuneIcon: fgui.GLoader;
    public CostGoldNumTxt: fgui.GTextField;
    public upCostLabel: fgui.GTextField;
    public txt_look: fgui.GTextField;
    public upProgressLabel: fgui.GTextField;

    public stepper: NumericStepper;
    public upCostRuneTick: fgui.GButton;
    public upCostGoldTick: fgui.GButton;

    public static LOW_RUNE_TEMPID: number = 3020010;
    private _chcekcIndex: number = 0;
    private addExp: number = 50;
    private isStudy: boolean = false;

    constructor() {
        super();
    }

    protected onConstruct() {

    }

    public OnInitWind() {
        super.OnInitWind();
        this.studyBtn.title = LangManager.Instance.GetTranslation('armyII.viewII.skill.btnStudy');
        this.upgradeBtn.title = LangManager.Instance.GetTranslation('armyII.viewII.skill.btnUpgrade');
        this.upProgressLabel.text = LangManager.Instance.GetTranslation('armyII.viewII.rune.RuneUpgradeView.ProgressTxt');
        this.upCostLabel.text = LangManager.Instance.GetTranslation('ExchangeRandom.costTxt');
        this.txt_look.text = '[' + LangManager.Instance.GetTranslation('shop.GoodsItem.lookBtnTxt') + ']';
        this.skillEffectRichText = new ScrollTextField(this.runeEffect);
        this.nextSkillEffectRichText = new ScrollTextField(this.nextSkillEffect);
        this.maxSkillEffectRichText = new ScrollTextField(this.maxSkillEffect);
        this.img_barbg0.width = 0;
        this.upCostRuneTick.selected = true;//默认选择符文
        this.upCostGoldTick.selected = false;//默认选择符文
        this._chcekcIndex = 0;
        // this.RecruitNumTxt.text = '0';

        this.addEvent();
        this.setRuneInfo(this.params[0], true);
        this.totalBox.ensureBoundsCorrect();
    }


    /**更新钻石消耗数量 */
    private updateCost() {
        if (this.stepper.value == 0) return;
        var goodsTemplate: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(RunesUpgradeWnd.LOW_RUNE_TEMPID);
        this.addExp = goodsTemplate.Property2;
        let cfgValue = 2;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("UpRune_Price");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        var index: number = PlayerManager.Instance.currentPlayerModel.playerInfo.diamondIndex;
        let _diamondCount = cfgValue * (index + 1);
        this.costRuneIcon.icon = IconFactory.getCommonIconPath(goodsTemplate.Icon);
        this.CostGoldNumTxt.text = _diamondCount + "";
    }

    private getMaxLevel(runeInfo: RuneInfo): number {
        let maxGrade: number = 10;
        if (runeInfo) {
            if (runeInfo.templateInfo) {
                let runeType: number = runeInfo.templateInfo.RuneType;
                maxGrade = TempleteManager.Instance.getRuneMaxLevel(runeType)
            }
        }
        return maxGrade;
    }

    /**是否最高等级 */
    private get isMax(): boolean {
        if (!this._selectRuneData) return false;
        if (this._selectRuneData.grade < this.getMaxLevel(this._selectRuneData)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 检查是否能够学习符文技能
     * 1, 等级是否达到
     * 2, 背包中是否有对应的符文石
     * 
     */
    private get canStudy(): boolean {
        var arr: Array<GoodsInfo> = GoodsManager.Instance.getGeneralBagGoodsBySonType(GoodsSonType.SONTYPE_PASSIVE_SKILL);
        var gInfo: GoodsInfo = null;
        this._runeGInfo = null;
        for (var i: number = 0; i < arr.length; i++) {
            gInfo = arr[i] as GoodsInfo;
            if (gInfo.templateInfo.Property1 == this._selectRuneData.templateInfo.RuneType) {
                // if (gInfo.isBinds) {
                this._runeGInfo = gInfo;
                return true;
            }
        }
        if (this._runeGInfo) {
            return true;
        }
        return false;
    }
    private runeSkillInfo: t_s_skilltemplateData = null;
    protected ownNum: number = 0;

    /**选中某个技能 */
    /**选择符文详细信息 */
    private setRuneInfo(runeData: RuneInfo, isinit: boolean = false) {
        if (!runeData) {
            this._selectRuneData = null;
            return;
        }


        let nextRuneSkillInfo: t_s_skilltemplateData = null;
        this._selectRuneData = runeData;
        RunesPanel.curRuneId = this._selectRuneData.runeId;
        this.runeSkillInfo = TempleteManager.Instance.getSkillTemplateInfoById(runeData.templateInfo.SkillTemplateId);
        var nextTemp: t_s_runetemplateData = runeData.nextTemplateInfo;
        if (nextTemp) {
            nextRuneSkillInfo = TempleteManager.Instance.getSkillTemplateInfoById(nextTemp.SkillTemplateId);
        }
        this.runeName.text = this.skillName2.text = this.runeSkillInfo.TemplateNameLang;//名称
        this.bePassiveSkillLabel.text = this.bePassiveSkillLabel2.text = this.bePassiveSkillLabel3.text = this.getSkillType(this.runeSkillInfo);//被动效果
        this.selectRuneItem.icon = IconFactory.getTecIconByIcon(runeData.templateInfo.Icon);//图标
        //当前等级效果
        this.runeLevel.text = LangManager.Instance.GetTranslation("public.level3", runeData.templateInfo.RuneGrade.toString());//等级
        // this.needGradeTxt.text = "";
        //按钮状态
        if (runeData.grade == 0) {
            this.studyBtn.visible = true;
            this.upgradeBtn.visible = false;
            this.nextBox.visible = false;
            this.studyBtn.enabled = this.isStudy = this.canStudy;
            this.studyBox.visible = true;
            this.txt_active_tip.visible = false;
            if (nextRuneSkillInfo && nextRuneSkillInfo.PropCoolDown > 0) {
                this.runeCold.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(this.runeSkillInfo.PropCoolDown * 0.001));
            }
            if (nextTemp && nextTemp.UseCount > 0) {
                this.runeCost.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.RuneTips.userCount", nextTemp.UseCount);
            }
            this.txt1.text = LangManager.Instance.GetTranslation('ConsortiaSkillTowerWnd.n70');
            this.runeEffect.getChild('content').text = nextRuneSkillInfo.DescriptionLang;
            this.nextBox.visible = true;
            this.nextSubBox.visible = false;
            this.showMax();
        } else if (runeData.grade > 0) {
            this.isStudy = false;
            this.upgradeBtn.visible = !this.isMax;
            if (this.runeSkillInfo.PropCoolDown > 0) {
                this.runeCold.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(this.runeSkillInfo.PropCoolDown * 0.001));
            }
            if (runeData.templateInfo.UseCount > 0) {
                this.runeCost.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.RuneTips.userCount", runeData.templateInfo.UseCount);
            }
            this.runeEffect.getChild('content').text = this.runeSkillInfo.DescriptionLang;
            if (nextRuneSkillInfo) {
                if (nextRuneSkillInfo.PropCoolDown > 0) {
                    this.nextSkillCold.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(nextRuneSkillInfo.PropCoolDown * 0.001));
                }
                if (nextTemp.UseCount > 0) {
                    this.nextSkillCost.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.RuneTips.userCount", nextTemp.UseCount);
                }
                this.nextSkillEffect.getChild('content').text = nextRuneSkillInfo.DescriptionLang;

                this.item2.icon = IconFactory.getTecIconByIcon(runeData.templateInfo.Icon);//图标
                this.txt_lv1.text = LangManager.Instance.GetTranslation("public.level3", runeData.templateInfo.RuneGrade.toString());//等级
                this.txt_lv2.text = LangManager.Instance.GetTranslation("public.level3", (runeData.templateInfo.RuneGrade + 1));//等级
                this.nextSubBox.visible = true;
                this.nextBox.visible = true;
                this.showMax();
            }
            this.txt_active_tip.visible = true && runeData.grade >= 10;
            //检查是否可升级
            if (!this.isMax && runeData.nextTemplateInfo && ArmyManager.Instance.thane.grades >= runeData.nextTemplateInfo.NeedGrade) {
                this.levelupBox.visible = true;
                this.studyBox.visible = false;
                this.nextBox.visible = true;
                this.txt_active_tip.visible = true && runeData.grade >= 10;
            } else {
                if (runeData.nextTemplateInfo) {
                    // this.needGradeTxt.text = LangManager.Instance.GetTranslation("buildings.BaseBuildFrame.gradeValue",runeData.nextTemplateInfo.NeedGrade);
                    this.studyBox.visible = true;
                    this.box3.visible = false;
                    this.txt1.text = LangManager.Instance.GetTranslation('yishi.view.tips.goods.SkillTips.need') + ':';
                    this.studyBtn.enabled = false;
                    this._requireGoodsList.push(runeData.nextTemplateInfo.NeedGrade);
                    this.list.numItems = this._requireGoodsList.length;
                    this.studyBtn.title = LangManager.Instance.GetTranslation('armyII.viewII.skill.btnUpgrade');
                }
                this.nextBox.visible = !this.isMax;
                this.txt_active_tip.visible = true;
                let text = LangManager.Instance.GetTranslation('consortia.view.myConsortia.skill.ConsortiaSkillItem.tip.title2');
                if (!this.isMax && runeData.nextTemplateInfo && ArmyManager.Instance.thane.grades < runeData.nextTemplateInfo.NeedGrade) {
                    text = LangManager.Instance.GetTranslation('SeminaryFrameRightView.command10', runeData.nextTemplateInfo.NeedGrade);
                }
            }
            // let runesPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).runesPanel;
            //检查是否已经装备
            // let isEquip = runesPanel.checkRuneEquip(runeData.runeId);
            if (this.isMax) {
                this.studyBox.visible = this.levelupBox.visible = false;
                this.box3.visible = true;
                this.img_bg.height = 415;
            }
        }
        // this.box2.visible = runeData.grade == 0;
        if (runeData.grade == 0)
            this.setRuneGoodsInfo(runeData);

        let tempMax = this.ownNum = GoodsManager.Instance.getGoodsNumByTempId(RunesUpgradeWnd.LOW_RUNE_TEMPID);
        this._max = tempMax ? tempMax : 1;
        if (isinit) {
            this.stepper.show(2, this._max, 1, this._max, 0, 1, Laya.Handler.create(this, this.__textChangeHandler, null, false));
        } else {
            this.stepper.resetStepper(this._max);
        }

        if (this._selectRuneData.nextTemplateInfo) {
            // this.txt_progress.text = this._selectRuneData.runeCurGp +'/' + this._selectRuneData.nextTemplateInfo.NeedGp;
            this.img_barbg0.width = 0;
            let barValue = this._selectRuneData.runeCurGp / this._selectRuneData.nextTemplateInfo.NeedGp;
            barValue = Math.min(barValue, 1)
            this.img_barbg1.width = barValue * 346;

            this.txt_progress.text = this._selectRuneData.runeCurGp + '/' + this._selectRuneData.nextTemplateInfo.NeedGp;
        }
        // this.updateUpgradeBtn();
        this.updateCost();
        this.showProgress(this._max);

    }

    private showMax() {
        let maxLv = this.getMaxLevel(this._selectRuneData);
        let maxRune: t_s_runetemplateData = TempleteManager.Instance.getRuneTemplateInfoByRuneTypeAndLevel(this._selectRuneData.templateInfo.RuneType, maxLv);
        if (maxRune) {
            let maxInfo = TempleteManager.Instance.getSkillTemplateInfoById(maxRune.SkillTemplateId);
            if (maxInfo.PropCoolDown > 0) {
                this.txt_coldmax.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown01", Math.ceil(maxInfo.PropCoolDown * 0.001));
            }
            if (maxRune.UseCount > 0) {
                this.txt_costmax.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.RuneTips.userCount", maxRune.UseCount);
            }
            this.maxSkillEffect.getChild('content').text = maxInfo.DescriptionLang;
            this.item3.icon = IconFactory.getTecIconByIcon(maxInfo.Icons);//图标
            this.txt_max.text = 'MAX'//等级
            this.skillName3.text = maxInfo.TemplateNameLang;
        }
    }

    /**学习符文物品列表 */
    setRuneGoodsInfo(runeData: RuneInfo) {
        let listGoodsInfo = this.getRequireRuneGoodsInfo(runeData);
        let temp = []
        for (const key in listGoodsInfo) {
            if (Object.prototype.hasOwnProperty.call(listGoodsInfo, key)) {
                let itemInfo = listGoodsInfo[key];
                let goodsInfo = new GoodsInfo();
                goodsInfo.templateId = itemInfo.TemplateId;
                temp.push(goodsInfo);
            }
        }
        this._requireGoodsList = temp;
        this.list.numItems = temp.length;
    }

    /**获取学习符文所需物品 */
    private getRequireRuneGoodsInfo(runeData: RuneInfo): Array<t_s_itemtemplateData> {
        let templist = [];
        var goodTemplate: t_s_itemtemplateData;
        var goodTemplateslist = TempleteManager.Instance.getGoodsTemplatesBySonType(GoodsSonType.SONTYPE_PASSIVE_SKILL);
        for (const key in goodTemplateslist) {
            if (Object.prototype.hasOwnProperty.call(goodTemplateslist, key)) {
                goodTemplate = goodTemplateslist[key];
                if (goodTemplate.Property1 == runeData.templateInfo.RuneType) {
                    templist.push(goodTemplate);
                }
            }
        }
        return templist;
    }


    private addEvent() {
        this.upgradeBtn.onClick(this, this.__upgradeBtnClickHandler);
        this.upCostRuneTick.onClick(this, this.onCheckRuneHandler);
        this.upCostGoldTick.onClick(this, this.onCheckGoldHandler);
        // this.simMaxBtn.onClick(this, this.__onRequiredNumAdd);
        // this.simMinBtn.onClick(this, this.__onRequiredNumReduce);
        NotificationManager.Instance.addEventListener(RuneEvent.RUNE_UPGRADE, this.__runeRefreshHandler, this);
        this.studyBtn.onClick(this, this._onStudySkill);
        this.list.itemRenderer = Laya.Handler.create(this, this.onRender, null, false);
        this.txt_active_tip.text = LangManager.Instance.GetTranslation('runeGem.str18', 10);
    }

    removeEvent() {
        this.studyBtn.offClick(this, this._onStudySkill);
        this.upgradeBtn.offClick(this, this.__upgradeBtnClickHandler);
        this.upCostRuneTick.offClick(this, this.onCheckRuneHandler);
        this.upCostGoldTick.offClick(this, this.onCheckGoldHandler);
        // this.simMaxBtn.offClick(this, this.__onRequiredNumAdd);
        // this.simMinBtn.offClick(this, this.__onRequiredNumReduce);
        NotificationManager.Instance.removeEventListener(RuneEvent.RUNE_UPGRADE, this.__runeRefreshHandler, this);
    }
    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    onRender(index: number, item: FUI_SkillItemCom) {
        if (item) {
            let itemData: GoodsInfo = this._requireGoodsList[index];
            if (itemData instanceof GoodsInfo) {
                item.txt_name.text = itemData.templateInfo.TemplateNameLang;
                item.icon = IconFactory.getTecIconByIcon(itemData.templateInfo.Icon);
                item.skillLevelBox.visible = false;
            }
            else {
                item.icon = IconFactory.getPlayerIcon(ArmyManager.Instance.thane.snsInfo.headId, IconType.HEAD_ICON);
                item.txt_name.text = LangManager.Instance.GetTranslation("buildings.BaseBuildFrame.gradeValue", itemData)
                if (this.thane.grades < itemData) {
                    item.txt_name.color = '#ff0000';
                }
                item.num.autoSize = 1;
                item.num.text = this.thane.grades + "/" + itemData;
            }
            item.txt_name.fontSize = 18;
        }
    }

    /**学习符文 */
    private _onStudySkill() {
        Logger.warn('学习符文');
        // var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        // var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        // var prompt: string = LangManager.Instance.GetTranslation("map.campaign.view.frame.SubmitResourcesFrame.titleTextTip");
        // var content: string = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneStudyConfirmTxt", this.runeSkillInfo.TemplateNameLang);
        // SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, {}, prompt, content, confirm, cancel, this.confirmStudyRuneCall.bind(this));
        this.confirmStudyRuneCall(true);
        // this.hide();
    }

    /**确定学习符文回调 */
    private confirmStudyRuneCall(b: boolean) {
        if (b) {
            if (this._selectRuneData && this._runeGInfo)
                this.controler.sendStudyRune(this._selectRuneData.runeId, this._runeGInfo.pos);
        }
    }

    private get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    private getSkillType(temp: t_s_skilltemplateData): string {
        if (temp.UseWay == 2) return "[" + LangManager.Instance.GetTranslation("yishi.datas.templates.SkillTempInfo.UseWay02") + "]";
        switch (temp.AcceptObject) {
            case 1:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type01");
                break;
            case 2:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type02");
                break;
            case 3:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type03");
                break;
            case 4:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type04");
                break;
            case 5:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type05");
                break;
            case 6:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type06");
                break;
            case 7:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type07");
                break;
            case 8:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type08");
                break;
            case 9:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type09");
                break;
            case 10:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type10");
                break;
            case 11:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type11");
                break;
            case 12:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type12");
                break;
            case 13:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type13");
                break;
            case 14:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type14");
                break;
            case 15:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type15");
                break;
            case 16:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type16");
                break;
            case 17:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type17");
                break;
            case 18:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type18");
                break;
            case 19:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type19");
                break;
            case 20:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type20");
                break;
            case 21:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.Type21");
                break;
        }
        return "";
    }

    public getCoststring(isPetSkill: boolean, num: number): string {
        var str: string = "";
        num = Math.abs(num);
        if (isPetSkill) {
            //英灵技能觉醒值消耗
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown03", num);
        } else {
            str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.SkillTips.cooldown02", num);
        }
        return str;
    }

    // private currRuneNumber: number = 0;
    private _max: number = 0;
    private __textChangeHandler(e: Event) {
        var value: number = this.stepper.value;
        // if (value<0 || !value) value = 0;
        // if (value > this._max) {
        //     this.RecruitNumTxt.text = this._max.toString();
        //     value = this._max;
        // } else {
        //     this.RecruitNumTxt.text = value.toString();
        // }
        if (value == 0 && this._chcekcIndex == 0) {
            // this.upgradeBtn.enabled = false;
        } else if (value > 0) {
            this.upgradeBtn.enabled = true;
        }
        this.updateCost();
        this.showProgress(value);
    }

    private __runeRefreshHandler(runeInfo: RuneInfo) {
        if (!runeInfo) return;
        let isStudy = this.isStudy;
        this.setRuneInfo(runeInfo);
        //是否是学习
        if (isStudy) {
            let runesPanel = (NewbieUtils.getFrame(EmWindow.Skill) as SkillWnd).runesPanel;
            //检查是否有空槽
            let emptyItem: FastRuneItem = runesPanel.getEmputyItem();
            if (emptyItem) {
                runesPanel.studyEquip(emptyItem);
            }
        }
    }


    /**
     * 键入数值后在[升级进度]可预览消耗的数量可以提升到什么进度
     * 深色进度: 表示当前进度
     * 浅色进度: 代表输入数值后可以提升到的进度
     * 进度数值表示: 当前进度（+消耗键入值可提升的进度值）/当前等级进度
     */
    private showProgress(count: number) {
        if (this._selectRuneData.nextTemplateInfo) {
            let curExp = this._selectRuneData.runeCurGp + this.addExp * count
            this.img_barbg0.width = (curExp / this._selectRuneData.nextTemplateInfo.NeedGp) * 346;
            if (this.img_barbg0.width > 346) {
                this.img_barbg0.width = 346;
            }
            this.txt_progress.text = this._selectRuneData.runeCurGp + '[color=#ffa800](+' + this.addExp * count + ')[/color]/' + this._selectRuneData.nextTemplateInfo.NeedGp;
        }
    }

    private __upgradeBtnClickHandler(evt) {
        var str: string;
        if (this._chcekcIndex == 0) {
            var value: number = this.stepper.value;
            if (!value || value == 0 || this._max > this.ownNum) {
                let info: ShopGoodsInfo = TempleteManager.Instance.getShopTempInfoByItemId(RunesUpgradeWnd.LOW_RUNE_TEMPID);
                FrameCtrlManager.Instance.open(EmWindow.BuyFrameI, { info: info, count: 1 });
                this.hide();
                return;
            }
            if (this._selectRuneData && this._selectRuneData.nextTemplateInfo && this._selectRuneData.grade < 10) {
                if (ArmyManager.Instance.thane.grades < this._selectRuneData.nextTemplateInfo.NeedGrade && this._selectRuneData.runeCurGp == this._selectRuneData.nextTemplateInfo.NeedGp) {
                    str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt2");
                    MessageTipManager.Instance.show(str);
                } else {
                    this.controler.sendUpgradeRune(this._selectRuneData.runeId, value);
                    // this.upgradeBtn.enabled = false;
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
            if (this._selectRuneData && this._selectRuneData.nextTemplateInfo && this._selectRuneData.grade < 10) {
                if (ArmyManager.Instance.thane.grades < this._selectRuneData.nextTemplateInfo.NeedGrade && this._selectRuneData.runeCurGp == this._selectRuneData.nextTemplateInfo.NeedGp) {
                    str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt2");
                    MessageTipManager.Instance.show(str);
                } else {
                    this.controler.sendUpgradeRune(this._selectRuneData.runeId, 0);//0表示用钻石培养
                }
            } else {
                str = LangManager.Instance.GetTranslation("armyII.viewII.rune.RuneUpgradeView.UpgradeTipTxt3");
                MessageTipManager.Instance.show(str);
            }
        }
        this.updateCost();
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
        // this.updateUpgradeBtn();
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
        // this.updateUpgradeBtn();
    }

    // private __onRequiredNumReduce() {
    //     this.currRuneNumber = 1;
    //     if (this.currRuneNumber > this._max) {
    //         this.currRuneNumber = 0;
    //     }
    //     this.refreshResource();
    // }

    // private __onRequiredNumAdd() {
    //     this.currRuneNumber = this._max;
    //     this.refreshResource();
    // }

    // private refreshResource() {
    //     // this.RecruitNumTxt.text = this.currRuneNumber.toString();
    //     // var value: number = parseInt(this.RecruitNumTxt.text);
    //     // if (!value) value = 0;
    //     // // if (value == 0 && this._chcekcIndex == 0) {
    //     // //     this.upgradeBtn.enabled = false;
    //     // // } else if (value > 0) {
    //     // //     this.upgradeBtn.enabled = true;
    //     // // }
    //     this.showProgress(this.stepper.value);
    // }
    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

}