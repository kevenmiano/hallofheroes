import Resolution from "../../core/comps/Resolution";
import LangManager from "../../core/lang/LangManager";
import { FormularySets } from "../../core/utils/FormularySets";
import BaseTipItem from "../component/item/BaseTipItem";
import { t_s_extrajobData } from "../config/t_s_extrajob";
import { BagType } from "../constant/BagDefine";
import { ExtraJobEvent } from "../constant/event/NotificationEvent";
import TemplateIDConstant from "../constant/TemplateIDConstant";
import { EmPackName } from "../constant/UIDefine";
import { ThaneInfo } from "../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { ResourceManager } from "../manager/ResourceManager";
import { TempleteManager } from "../manager/TempleteManager";
import { ExtraJobItemInfo } from "../module/bag/model/ExtraJobItemInfo";
import ExtraJobModel from "../module/bag/model/ExtraJobModel";
import GeniusPanel from "../module/skill/content/GeniusPanel";
import BaseTips from "./BaseTips";

/**
 * 秘典TIP
 */
export class SecretBookTips extends BaseTips {
    private txt_name: fgui.GTextField;//技能名称z
    private txt_level: fgui.GTextField;//技能等级
    private subox: fgui.GGroup;
    private totalBox: fgui.GGroup;
    private levelupBox: fgui.GGroup;
    private maxbox: fgui.GGroup;
    img_bg: fgui.GComponent;
    private btn_active: fgui.GButton;//学习
    private upgradeBtn: fgui.GButton;
    private iconLoader: fgui.GLoader;
    private _nextLevelNeedCoin: number = 0;
    private upCostGoldNumber: fgui.GTextField;//升级所需金币
    private needProp: fgui.GTextField;//升级所需经验
    private txt_desc: fgui.GTextField;
    private txt_cost: fgui.GTextField;
    private txt_condition: fgui.GTextField;
    //升级条件
    private upgradeLimit: fgui.GTextField;//升级所需条件
    private tipItem1: BaseTipItem//残页
    private tipItem2: BaseTipItem//黄金
    private _info: ExtraJobItemInfo;
    constructor() {
        super();
    }

    protected onConstruct() {

    }

    public OnInitWind() {
        super.OnInitWind();
        // this.upgradeBtn.title = LangManager.Instance.GetTranslation('armyII.viewII.skill.btnUpgrade');
        this.txt_condition.text = LangManager.Instance.GetTranslation('Mastery.activeCount', 1);
        this.txt_condition.text = LangManager.Instance.GetTranslation('Mastery.activeCount', 1);
        this.txt_desc.text = LangManager.Instance.GetTranslation('Mastery.jobtypeDesc');
        this.addEvent();
        this._info = this.params;
        this.refreshView(this._info);
        this.totalBox.ensureBoundsCorrect();
        this.setPos();
        this.tipItem2.setInfo(TemplateIDConstant.TEMP_ID_GOLD);
    }


    /**
     *刷新数据 
     */
    private refreshView(info: ExtraJobItemInfo) {
        if (info) {
            this.iconLoader.url = this.getJobIcon(info.jobType);
            this.txt_name.text = LangManager.Instance.GetTranslation('Mastery.jobtype' + info.jobType);
            this.txt_level.text = LangManager.Instance.GetTranslation('public.level3', info.jobLevel);

            //是否已激活
            let isActived = info.jobLevel > 0;
            if (isActived) {//判断玩家是否满足下一等级的升级条件
                var nextInfo: t_s_extrajobData = TempleteManager.Instance.getExtrajobCfg(info.jobType, info.jobLevel + 1);
                if (nextInfo) {
                    //玩家未满足升级条件时，显示升级条件，
                    let canLevelUp = this.checkCondition();
                    this.levelupBox.visible = canLevelUp;
                    this.upgradeBtn.enabled = canLevelUp;
                    if (canLevelUp) {

                        this._nextLevelNeedCoin = nextInfo.CostGold;
                        let ownProp = GoodsManager.Instance.getBagCountByTempId(BagType.Player, nextInfo.CostItemId)
                        let ownStr = ownProp.toString();
                        if (ownProp < nextInfo.CostItemCount) {
                            ownStr = `[color=#ff2e2e]${ownProp}[/color]`;
                            this.upgradeBtn.enabled = false;
                        }
                        this.tipItem1.setInfo(nextInfo.CostItemId);

                        //升级所需消耗：秘典残页图标、玩家拥有秘典残页数量（数量不足时为红色字体）/升级所需秘典残页数量、黄金、升级所需黄金数量
                        this.needProp.text = LangManager.Instance.GetTranslation('fish.FishFrame.countText', ownStr, nextInfo.CostItemCount);
                        this.upCostGoldNumber.text = FormularySets.toStringSelf(this._nextLevelNeedCoin, GeniusPanel.STEP);
                        if (ResourceManager.Instance.gold.count >= this._nextLevelNeedCoin) {
                            this.upCostGoldNumber.color = '#FFECC6';
                        } else {
                            this.upCostGoldNumber.color = '#FF2E2E';
                            this.upgradeBtn.enabled = false;
                        }
                        this.txt_condition.visible = false;
                    }
                } else {
                    //已满级：显示文本提示“已达到最高等级”
                    this.txt_condition.visible = true;
                    this.levelupBox.visible = false;
                    this.txt_condition.text = LangManager.Instance.GetTranslation('buildings.water.view.PlayerTreeExpView.msg01');
                }
                this.btn_active.visible = false;
            } else {
                //是否可激活
                let canActive = ExtraJobModel.instance.leftNum > 0;
                if (canActive) {
                    this.txt_condition.visible = false;
                    this.btn_active.visible = canActive;
                    this.levelupBox.visible = !canActive;
                } else {

                    this.txt_condition.visible = true;
                    this.levelupBox.visible = this.btn_active.visible = false;
                }
                this.txt_level.text = '';
            }
        }
        this.subox.ensureBoundsCorrect();
    }

    /**
     * 判断玩家是否满足下一等级的升级条件
     */
    private checkCondition(): boolean {
        let result = true;
        let str = '';
        var cfg: t_s_extrajobData = TempleteManager.Instance.getExtrajobCfg(this._info.jobType, this._info.jobLevel + 1);
        //升级条件：红色文本显示
        str = LangManager.Instance.GetTranslation('Mastery.needPlayerLevel', cfg.NeedPlayerLevel);
        if (this.thane.grades < cfg.NeedPlayerLevel) {
            result = false;
        }
        if (str.length > 0 && cfg.NeedTotalJobLevel > 0) {
            str += ('<br>' + LangManager.Instance.GetTranslation('Mastery.needTotalJobLevel', cfg.NeedTotalJobLevel));
        }
        if (ExtraJobModel.instance.totalLevel < cfg.NeedTotalJobLevel) {
            result = false;
        }
        if (str.length > 0) {
            str += ('<br>' + LangManager.Instance.GetTranslation('Mastery.openNext'));
            this.txt_condition.text = str;
        }
        return result;
    }

    public getJobIcon(job: number): string {
        let url: string = "";
        switch (job) {
            case 41:
                url = "Icon_Mastery_Knight";
                break;
            case 42:
                url = "Icon_Mastery_Archer";
                break;
            case 43:
                url = "Icon_Mastery_Mage";
                break;
            case 44:
                url = "Icon_Mastery_long";
                break;
        }
        return fgui.UIPackage.getItemURL(EmPackName.Base, url);
    }

    private addEvent() {
        this.btn_active.onClick(this, this.onActive);
        this.upgradeBtn.onClick(this, this.__upUpgrade);
        NotificationManager.Instance.addEventListener(ExtraJobEvent.LEVEL_UP, this.levelupGrade, this);
    }

    removeEvent() {
        this.btn_active.offClick(this, this.onActive);
        this.upgradeBtn.offClick(this, this.__upUpgrade);
        NotificationManager.Instance.removeEventListener(ExtraJobEvent.LEVEL_UP, this.levelupGrade, this);
        // NotificationManager.Instance.removeEventListener(TalentEvent.SELECT_TALENT, this.__talenSelectHanler, this);
    }

    private levelupGrade(info) {
        if (info && info.jobType == this._info.jobType) {
            this._info = info;
            this.refreshView(this._info);
        }
    }

    /**激活 */
    private onActive() {
        PlayerManager.Instance.reqExtraJobInfo(1, this._info.jobType);
    }

    /**
     * 升级
     * @returns 
     */
    private __upUpgrade() {
        PlayerManager.Instance.reqExtraJobInfo(2, this._info.jobType);
    }

    setPos() {
        this.getContentPane().x = (Resolution.gameWidth - this.getContentPane().width) / 2 - 72;
        this.getContentPane().y = (Resolution.gameHeight - this.getContentPane().height) / 2;
    }


    private get thane(): ThaneInfo {
        return ArmyManager.Instance.thane;
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }

}