// @ts-nocheck
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import { RuneBagCell } from "../../../component/item/RuneBagCell";
import { t_s_runegemData } from "../../../config/t_s_runegem";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { BagEvent } from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { GoodsManager } from "../../../manager/GoodsManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { Enum_BagGridState } from "../../bag/model/Enum_BagState";
import RunesPanel from "../content/RunesPanel";
import SkillWndCtrl from "../SkillWndCtrl";

/**
* @author:pzlricky
* @data: 2021-04-21 21:19
* @description 符文石升级窗口
*/
export default class RuneGemUpgradeWnd extends BaseWindow {

    public frame: fgui.GComponent;
    public runeItem: RuneBagCell;
    public runeNameTxt: fgui.GTextField;
    // public upProgressBar: fgui.GProgressBar;
    public txt_cost_coin: fgui.GTextField;
    // public txt_own_key: fgui.GTextField;
    public txt_own: fgui.GTextField;
    // public upProgressLabel: fgui.GTextField;

    public txt1: fgui.GTextField;
    public txt_max: fgui.GTextField;

    public txt2: fgui.GTextField;
    public txt_level0: fgui.GTextField;
    public txt_level1: fgui.GTextField;

    public txt_attri: fgui.GTextField;
    public txt_attri_val0: fgui.GTextField;
    public txt_attri_val1: fgui.GTextField;
    public txt_add: fgui.GTextField;

    public txt_attri2: fgui.GTextField;
    public txt_attri_val02: fgui.GTextField;
    public txt_attri_val12: fgui.GTextField;
    public txt_add2: fgui.GTextField;

    // public upCostLabel: fgui.GTextInput;
    public RecruitNumTxt: fgui.GTextField;
    // public simMaxBtn: UIButton;
    // public simMinBtn: UIButton;
    public upgradeBtn: UIButton;
    public btnHelp: UIButton;

    //Data
    private currRuneData: GoodsInfo;
    public static LOW_RUNE_TEMPID: number = 4000000;

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
        this.frame.getChild('title').text = LangManager.Instance.GetTranslation('runeGem.str15');
        this.txt1.text = LangManager.Instance.GetTranslation('runeGem.str16');
        this.txt2.text = LangManager.Instance.GetTranslation('public.grade');


        let arr = TempleteManager.Instance.getTemplatesByTypeAndId(200, this.currRuneData.templateInfo.SonType);
        this.txt_max.text = arr.length + '';

        // this._runeCarryTwoLevel = Number(TempleteManager.Instance.getConfigInfoByConfigName("CarryTwoRune").ConfigValue);
        // this._runeOpenLevel = Number(TempleteManager.Instance.getConfigInfoByConfigName("OpenRuneGrade").ConfigValue);
        // this.RecruitNumTxt.text = '0';
        this.btnHelp.visible = true;        //
        this.setRunInfo(this.currRuneData);
        // this.updateView();
    }

    addEvent() {
        this.btnHelp.onClick(this, this.onShowHelpTIps);
        this.upgradeBtn.onClick(this, this.__upgradeBtnClickHandler)
        // this.RecruitNumTxt.on(Laya.Event.INPUT, this, this.__textChangeHandler);
        GoodsManager.Instance.addEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);

    }

    offEvent() {
        this.upgradeBtn.offClick(this, this.__upgradeBtnClickHandler);
        this.btnHelp.offClick(this, this.onShowHelpTIps);
        // this.RecruitNumTxt.off(Laya.Event.INPUT, this, this.__textChangeHandler)
        GoodsManager.Instance.removeEventListener(BagEvent.UPDATE_BAG, this.__bagItemUpdate, this);
    }

    onShowHelpTIps() {
        let title = LangManager.Instance.GetTranslation('armyII.SkillFrame.HelpBtn.RuneTipdata');
        let content = LangManager.Instance.GetTranslation('armyII.RuneHelpFrame.helpContent');
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    private get controler(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
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
    //     this.RecruitNumTxt.text = this.currRuneNumber.toString();
    //     var value: number = parseInt(this.RecruitNumTxt.text);
    //     if (!value) value = 0;
    //     if (value == 0) {
    //         this.upgradeBtn.enabled = false;
    //     } else if (value > 0) {
    //         this.upgradeBtn.enabled = true;
    //     }
    //     this.updateView();
    // }

    // private currRuneNumber: number = 0;
    private _max: number = 0;
    // private __textChangeHandler(e: Event) {
    //     var value: number = parseInt(this.RecruitNumTxt.text);
    //     if (!value) value = 0;
    //     if (value > this._max) {
    //         this.RecruitNumTxt.text = this._max.toString();
    //         value = this._max;
    //     } else {
    //         this.RecruitNumTxt.text = value.toString();
    //     }
    //    if (value > 0) {
    //         this.upgradeBtn.enabled = true;
    //     }
    //     this.updateView();
    // }

    private updateUpgradeBtn() {
        let value: number = parseInt(this.RecruitNumTxt.text);
        if (!value || isNaN(value)) value = 0;
        if (value == 0) {
            this.upgradeBtn.enabled = false;
        } else {
            this.upgradeBtn.enabled = true
        }
        if (this.isMax) {
            this.upgradeBtn.enabled = false;
        }

    }

    private get control(): SkillWndCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
    }

    private __upgradeBtnClickHandler(evt) {
        var value: number = parseInt(this.RecruitNumTxt.text);
        if (!value || value == 0) return;
        this.control.reqRuneGemUpgrade(this.currRuneData.pos, this.currRuneData.id, value, this.currRuneData.bagType, RunesPanel.curRuneId);
        // this.updateView();
    }

    /**更新钻石消耗数量 */
    private updateView() {
        // if (this.RecruitNumTxt.text == '') return;

        //符石升级消耗黄金比例（百分比）
        // let str = TempleteManager.Instance.getConfigInfoByConfigName("runehole_grade_gold").ConfigValue;
        // let num = Number(str) / 100;
        // let goodsTemplate: t_s_itemtemplateData = TempleteManager.Instance.getGoodsTemplatesByTempleteId(RuneGemUpgradeWnd.LOW_RUNE_TEMPID);
        // let count: number = parseInt(this.RecruitNumTxt.text);
        // let costCoin = goodsTemplate.Property2 * count * num;

        // this.txt_cost_coin.text = isNaN(costCoin) ? LangManager.Instance.GetTranslation('buildings.water.view.PlayerTreeExpView.msg01') : costCoin + "/" + ResourceManager.Instance.gold.count;
        // this.txt_cost_coin.color = ResourceManager.Instance.gold.count > costCoin ? '#FFECC6' : '#FF2E2E';
    }

    private __bagItemUpdate(goodInfos: GoodsInfo[]) {
        for (let goodInfo of goodInfos)
            if (this._ruenGemInfo.id == goodInfo.id) {
                this._ruenGemInfo = goodInfo;
                this.setRunInfo(this._ruenGemInfo);
            }
    }

    private _ruenGemInfo: GoodsInfo;
    /**设置当前符文信息 */
    setRunInfo(value: GoodsInfo) {
        this._ruenGemInfo = value;
        // let tempMax = GoodsManager.Instance.goodsCountByTempId[RuneGemUpgradeWnd.LOW_RUNE_TEMPID];
        // this._max = tempMax ? tempMax : 0;
        // let val = tempMax>0 ? 1 : 0;

        this.runeItem.info = value;
        this.runeItem.state = Enum_BagGridState.Item;
        // this.runeItem.upgradeIndex = 0;//符文升级不展示升级标签
        this.runeNameTxt.text = value.templateInfo.TemplateNameLang;//名称
        this.runeNameTxt.color = value.templateInfo.profileColor;

        let temp = new GoodsInfo();
        temp.templateId = value.templateId;
        temp.strengthenGrade = value.strengthenGrade;
        let cur = this.controler.parsePropertyByGoodsInfo(temp);
        temp.strengthenGrade += 1;
        let next = this.controler.parsePropertyByGoodsInfo(temp);


        // let curTemp: t_s_runegemData = TempleteManager.Instance.getRuneGemCfgByTypeAndLevel(value.templateInfo.SonType, value.strengthenGrade, value.templateInfo.Property1);
        // let nextTemp: t_s_runegemData = TempleteManager.Instance.getRuneGemCfgByTypeAndLevel(value.templateInfo.SonType, value.strengthenGrade + 1, value.templateInfo.Property1);
        // if (curTemp) {
        //     this.txt_attri.text = this.addPropertyTxt(curTemp, nextTemp);
        // } else {
        //     //等级为0
        //     this.txt_attri.text = this.addPropertyTxt(nextTemp, nextTemp);
        //     this.txt_attri_val0.text = this.addPropertyTxt1(value.templateInfo.Property1, value) + '';
        //     let num = Number(this.txt_attri_val1.text) - Number(this.txt_attri_val0.text)
        //     this.txt_add.text = '(+' + num + ')';
        // }

        let i = 0;
        for (let p in cur) {
            (i == 0 ? this.txt_attri : this.txt_attri2).text = p;
            (i == 0 ? this.txt_attri_val0 : this.txt_attri_val02).text = cur[p] + "";
            i++;
        }


        i = 0;
        if (next) {
            for (let p in next) {
                (i == 0 ? this.txt_attri_val1 : this.txt_attri_val12).text = next[p] + "";
                (i == 0 ? this.txt_add : this.txt_add2).text = `(+${i == 0 ? Number(this.txt_attri_val1.text) - Number(this.txt_attri_val0.text) : Number(this.txt_attri_val12.text) - Number(this.txt_attri_val02.text)})`;
                i++;
            }

        }


        this.txt_level0.text = value.strengthenGrade + '';

        let levlTmep: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevelAndSonType(value.strengthenGrade == 0 ? 1 : value.strengthenGrade, 200, value.templateInfo.SonType);
        let nextlevlTmep: t_s_upgradetemplateData = TempleteManager.Instance.getTemplateByTypeAndLevelAndSonType(value.strengthenGrade + 1, 200, value.templateInfo.SonType);
        if (nextlevlTmep) {

            this.txt_level1.text = (value.strengthenGrade + 1) + '';
            this.RecruitNumTxt.text = nextlevlTmep.Data - this.currRuneData.gp + "";
            // this.upProgressBar.value = (this.currRuneData.gp / nextlevlTmep.Data) * 100;
            // this.upProgressBar.getChild('progress').text = this.currRuneData.gp + '/' + nextlevlTmep.Data;
        } else {
            //最高级
            this.txt_level1.text = LangManager.Instance.GetTranslation('buildings.water.view.PlayerTreeExpView.msg01');
            // this.upProgressBar.value = 100;
            // this.upProgressBar.getChild('progress').text = levlTmep.Data + '/' + levlTmep.Data;
            this.RecruitNumTxt.text = this.txt_level1.text;
            this.isMax = true;
        }
        // this.updateView();
        this.updateUpgradeBtn();
        this.updateRuneNum();
    }

    private updateRuneNum() {
        this.txt_own.text = PlayerManager.Instance.currentPlayerModel.playerInfo.runeNum + "";
    }

    private isMax: boolean = false;

    protected addPropertyTxt(info: t_s_runegemData, next: t_s_runegemData): string {
        if (!next) {
            this.txt_attri_val1.text = '';
            this.txt_add.text = '';
        }

        switch (info.RuneGemTypes) {
            case 1:
                this.txt_attri_val0.text = info.Power + '';
                if (next) {
                    this.txt_attri_val1.text = next.Power + '';
                    this.txt_add.text = '(+' + (next.Power - info.Power) + ')';
                }
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01");
            case 2:
                this.txt_attri_val0.text = info.Agility + '';
                if (next) {
                    this.txt_attri_val1.text = next.Agility + '';
                    this.txt_add.text = '(+' + (next.Agility - info.Agility) + ')';
                }

                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02");
            case 3:
                this.txt_attri_val0.text = info.Intellect + '';
                if (next) {
                    this.txt_attri_val1.text = next.Intellect + '';
                    this.txt_add.text = '(+' + (next.Intellect - info.Intellect) + ')';
                }

                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03");
            case 4:
                this.txt_attri_val0.text = info.Physique + '';
                if (next) {
                    this.txt_attri_val1.text = next.Physique + '';
                    this.txt_add.text = '(+' + (next.Physique - info.Physique) + ')';
                }

                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04");
            case 5:
                this.txt_attri_val0.text = info.Captain + '';
                if (next) {
                    this.txt_attri_val1.text = next.Captain + '';
                    this.txt_add.text = '(+' + (next.Captain - info.Captain) + ')';
                }
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05");
        }
        return "";
    }

    protected addPropertyTxt1(type: number, info: GoodsInfo): number {
        switch (type) {
            case 1:
                return info.templateInfo.Power;
            case 2:
                return info.templateInfo.Agility;
            case 3:
                return info.templateInfo.Intellect;
            case 4:
                return info.templateInfo.Physique;
            case 5:
                return info.templateInfo.Captain;
        }
        return 0;
    }

    OnHideWind() {
        super.OnHideWind();
        this.offEvent();
    }

}