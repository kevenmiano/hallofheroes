import LangManager from "../../core/lang/LangManager";
import UIManager from "../../core/ui/UIManager";
import { DateFormatter } from "../../core/utils/DateFormatter";
import { BaseItem } from "../component/item/BaseItem";
import { t_s_itemtemplateData } from "../config/t_s_itemtemplate";
import { t_s_runegemData } from "../config/t_s_runegem";
import { BagType } from "../constant/BagDefine";
import { RuneEvent } from "../constant/event/NotificationEvent";
import GoodsSonType from "../constant/GoodsSonType";
import TemplateIDConstant from "../constant/TemplateIDConstant";
import { EmWindow } from "../constant/UIDefine";
import { GoodsInfo } from "../datas/goods/GoodsInfo";
import { PlayerInfo } from "../datas/playerinfo/PlayerInfo";
import { ArmyManager } from "../manager/ArmyManager";
import { GoodsManager } from "../manager/GoodsManager";
import { MessageTipManager } from "../manager/MessageTipManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { TempleteManager } from "../manager/TempleteManager";
import { BagHelper } from "../module/bag/utils/BagHelper";
import RuneHoleGem from "../module/skill/runeGem/RuneHoleGem";
import SkillWndCtrl from "../module/skill/SkillWndCtrl";
import { FrameCtrlManager } from "../mvc/FrameCtrlManager";
import { GoodsCheck } from "../utils/GoodsCheck";
import { SwitchPageHelp } from "../utils/SwitchPageHelp";
import BaseTips from "./BaseTips";

/**
 * @description 符文石tips
 * @author yuanzhan.yu
 * @date 2021/8/11 15:14
 * @ver 1.0
 */
export class RuneTip extends BaseTips {
    public bg: fgui.GLoader;
    public item: BaseItem;
    public txt_name: fgui.GTextField;
    public txt_needJob: fgui.GTextField;
    public txt_useLevel: fgui.GTextField;
    public txt_type: fgui.GTextField;
    public txt_bind: fgui.GTextField;
    public subBox1: fgui.GGroup;
    public txt_desc: fgui.GRichTextField;
    public txt_price: fgui.GTextField;
    public group_price: fgui.GGroup;
    public txt_time: fgui.GTextField;
    public btn_use: fgui.GButton;
    public btn_batchUse: fgui.GButton;
    public group_oprate: fgui.GGroup;
    public subBox2: fgui.GGroup;
    public totalBox: fgui.GGroup;
    public txt_owned: fgui.GTextField;


    private _info: GoodsInfo;
    private _canOperate: boolean;
    private isRuneGem: boolean = false;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.addEvent()

        this.updateView();
        //note 调用ensureBoundsCorrect立即重排
        this.totalBox.ensureBoundsCorrect();
    }

    private initData() {
        [this._info, this._canOperate] = this.params;
    }

    private initView() {
    }

    private addEvent() {
        this.btn_use.onClick(this, this.onBtnUseClick.bind(this));
        this.btn_batchUse.onClick(this, this.onBtnBatchUseClick.bind(this));
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    private updateView() {
        if (this._info) {
            this.item.info = this._info;
            this.item.text = "";
            this.txt_name.text = this._info.templateInfo.TemplateNameLang;
            this.txt_name.color = GoodsSonType.getColorByProfile(this._info.templateInfo.Profile);
            this.txt_type.text = this.getGoodsTypeName(this._info.templateInfo);
            // if (this._info.isBinds) {
            //     this.txt_bind.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind1");
            //     this.txt_bind.color = "#ee1a38";
            // }
            // else {
            //     this.txt_bind.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.bind2");
            //     this.txt_bind.color = "#8eea17";
            // }

            let count = BagHelper.Instance.getUserCount(this._info.templateId);
            if (this._info.templateId == TemplateIDConstant.TEMP_ID_VIP_EXP) {//vip经验不显示数量
                this.txt_owned.text = "";
                this.txt_owned.visible = false;
            } else {
                this.txt_owned.setVar("count", count + "").flushVars();
                this.txt_owned.visible = true;
            }

            this.group_price.visible = this._info.templateInfo.SellGold > 0;
            let str: string = "" + this._info.templateInfo.SellGold * (1 + this._info.strengthenGrade * 2);
            this.txt_price.text = this._info.templateInfo.SellGold == 0 ? "" : str;

            this.isRuneGem = (this._info.templateInfo.SonType >= 400 && this._info.templateInfo.SonType < 500);
            this.txt_desc.text = this._info.templateInfo.DescriptionLang;
            if (this.isRuneGem) {

                let skillCtrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Skill) as SkillWndCtrl;
                this.txt_desc.text = skillCtrl.addPropertyTxt(this._info)

                let arr = TempleteManager.Instance.getTemplatesByTypeAndId(200, this._info.templateInfo.SonType);
                //所需职业: 不限, 调整为显示: 等级: 0/40左为当前等级, 右为等级上限
                str = this._info.strengthenGrade + '/' + arr.length;
                this.txt_needJob.text = LangManager.Instance.GetTranslation("ConsortiaInfoWnd.n7Txt.title") + str;
            } else {
                str = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.vocation.text") + this._info.templateInfo.jobName;
                this.txt_needJob.text = str;
                if (!GoodsCheck.isJobFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
                    this.txt_needJob.color = "#ee1a38";
                }
                else {
                    this.txt_needJob.color = "#FFECC6";
                }

            }



            if (this._info.templateInfo.NeedGrades > 1) {
                this.txt_useLevel.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTipsContent.grade", this._info.templateInfo.NeedGrades);
                if (!GoodsCheck.isGradeFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
                    this.txt_useLevel.color = "#FF0000";
                }
            }
            else {
                this.txt_useLevel.text = "";
            }

            // if (this._info.id != 0) {
            //     this.txt_bind.visible = true;
            // }
            // else {
            //     this.txt_bind.visible = false;
            // }
            this.txt_bind.visible = false;
            if (this._info.validDate > 0)//加上时效性
            {
                this.txt_time.visible = true;
            }
            else {
                this.txt_time.visible = false;
            }

            let timeStr: string;
            if (this._info.leftTime == -1) {
                timeStr = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.timeStr01");
            }
            else if (this._info.leftTime < 0) {
                timeStr = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.timeStr02");
            }
            else {
                timeStr = DateFormatter.getFullDateString(this._info.leftTime);
            }
            this.txt_time.text = LangManager.Instance.GetTranslation("yishi.view.tips.goods.EquipTip.time.text") + ":" + timeStr;

            if (this._canOperate && BagHelper.checkCanUseGoods(this._info.templateInfo.SonType)) {
                this.group_oprate.visible = true;
                this.btn_batchUse.visible = this.showBatchUseBtn()
            }
            else {
                if (this.isRuneGem) {//符石
                    if (BagHelper.OPEN_RUNE_BAG_TYPE == 1) {
                        this.btn_batchUse.title = LangManager.Instance.GetTranslation("armyII.viewII.allocate.upgrade");
                        this.btn_use.title = LangManager.Instance.GetTranslation("Forge.TabTitle.Resolve");
                    } else if (BagHelper.OPEN_RUNE_BAG_TYPE == 0) {
                        //镶嵌还是卸下
                        if (this.isEuiped()) {
                            this.btn_use.title = LangManager.Instance.GetTranslation("public.unEquip");
                            this.btn_batchUse.title = LangManager.Instance.GetTranslation("armyII.viewII.allocate.upgrade");
                        } else {
                            if (RuneHoleGem.selectRuneGem) {
                                this.btn_use.title = LangManager.Instance.GetTranslation("tasktracetip.view.OpenBagTipView.btnTxt");
                            } else {
                                this.btn_use.title = LangManager.Instance.GetTranslation("HigherGradeOpenTipView.content8");
                            }
                            this.btn_batchUse.title = LangManager.Instance.GetTranslation("armyII.viewII.allocate.upgrade");
                        }
                    } else if (BagHelper.OPEN_RUNE_BAG_TYPE == -1) {
                        if (this.isEuiped()) {
                            //显示替换和升级
                            this.btn_use.title = LangManager.Instance.GetTranslation("tasktracetip.view.OpenBagTipView.btnTxt");
                            this.btn_batchUse.title = LangManager.Instance.GetTranslation("armyII.viewII.allocate.upgrade");
                        } else {
                            this.btn_use.title = LangManager.Instance.GetTranslation("HigherGradeOpenTipView.content8");
                            this.btn_batchUse.title = LangManager.Instance.GetTranslation("armyII.viewII.allocate.upgrade");
                        }
                    }
                    else {
                        this.group_oprate.visible = false;
                    }
                } else {
                    this.group_oprate.visible = false;
                }
            }
            if (BagHelper.isOpenConsortiaStorageWnd()) {
                this.btn_batchUse.visible = false;
                this.btn_use.title = BagHelper.getText(this._info);
                this.group_oprate.visible = true;
            }

        }
    }

    private getGoodsTypeName(temp: t_s_itemtemplateData): string {
        switch (temp.SonType) {
            case GoodsSonType.SONTYPE_TASK:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.SONTYPE_TASK");
            case GoodsSonType.SONTYPE_COMPOSE_MATERIAL:
                return LangManager.Instance.GetTranslation("yishi.view.tips.goods.PropTips.COMPOSE_MATERIAL");
        }
        return "";
    }

    private showBatchUseBtn(): boolean {
        let b: boolean = this._info.templateInfo.IsCanBatch == 1;
        return b;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private onBtnUseClick() {
        if (BagHelper.isOpenConsortiaStorageWnd()) {
            BagHelper.consortiaStorageOperate(this._info);
            this.hide();
        }
        if (this.isRuneGem) {
            if (BagHelper.OPEN_RUNE_BAG_TYPE == 1) {
                BagHelper.operateRuneGem(this._info);
                this.hide();
            } else if (BagHelper.OPEN_RUNE_BAG_TYPE == 0 || BagHelper.OPEN_RUNE_BAG_TYPE == -1) {
                if (this.isEuiped()) {
                    if (this.btn_use.title == LangManager.Instance.GetTranslation("public.unEquip")) {
                        NotificationManager.Instance.sendNotification(RuneEvent.PUTOFF_RUNE_GEM, this._info);
                    } else {
                        NotificationManager.Instance.sendNotification(RuneEvent.SHOW_REPLACE_RUNE_GEM, this._info);
                    }
                } else {
                    if (this.btn_use.title == LangManager.Instance.GetTranslation("tasktracetip.view.OpenBagTipView.btnTxt")) {
                        NotificationManager.Instance.sendNotification(RuneEvent.REPLACE_RUNE_GEM, this._info);
                    } else {
                        NotificationManager.Instance.sendNotification(RuneEvent.INLAY_RUNE_GEM, this._info);
                    }
                }
                this.hide();
            }
        }
        else {
            this.onBtnUseClick2();
        }
    }

    private onBtnUseClick2() {
        if (this._info) {
            let str: string = "";
            if (this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX && !GoodsCheck.isGradeFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
                let str: string = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command01");
                MessageTipManager.Instance.show(str);
                this.hide();
                return
            }
            else if (this._info.templateInfo.SonType == GoodsSonType.SONTYPE_PASSIVE_SKILL) {
                SwitchPageHelp.gotoRunnesSkill();
            }
        }
        this.hide();
    }

    private onBtnBatchUseClick() {
        if (BagHelper.OPEN_RUNE_BAG_TYPE == 1) {
            BagHelper.operateRuneGem(this._info, 1);
            this.hide();
            return;
        } else if (BagHelper.OPEN_RUNE_BAG_TYPE < 1) {
            if (this.btn_batchUse.title == LangManager.Instance.GetTranslation("armyII.viewII.allocate.upgrade")) {
                NotificationManager.Instance.sendNotification(RuneEvent.RUNE_GEM_UPGRADE, this._info);
                this.hide();
                return;
            }

        }

        if (this._info.templateInfo.SonType != GoodsSonType.SONTYPE_NOVICE_BOX && !GoodsCheck.isGradeFix(ArmyManager.Instance.thane, this._info.templateInfo, false)) {
            let str: string = LangManager.Instance.GetTranslation("cell.view.GoodsItemMenu.command01");
            MessageTipManager.Instance.show(str);
            this.hide();
            return
        }
        if (!BagHelper.Instance.checkCanMulUse(this._info)) {
            this.hide();
            return;
        }

        UIManager.Instance.ShowWind(EmWindow.BatchUseConfirmWnd, [this._info])
        this.hide();
    }

    /**
     * 是否已装备
     */
    isEuiped() {
        let array = GoodsManager.Instance.getGoodsByBagType(BagType.RUNE_EQUIP);
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (this._info && this._info.id == element.id) {
                return true;
            }
        }
        return false;
    }


    protected addPropertyTxt(info: t_s_runegemData): string {
        switch (info.RuneGemTypes) {
            case 1:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01") + '+' + info.Power;
            case 2:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02") + '+' + info.Agility;
            case 3:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03") + '+' + info.Intellect;
            case 4:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04") + '+' + info.Physique;
            case 5:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05") + '+' + info.Captain;
        }
        return "";
    }

    protected addPropertyTxt1(type: number, info: GoodsInfo): string {
        switch (type) {
            case 1:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip01") + '+' + info.templateInfo.Power;
            case 2:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip02") + '+' + info.templateInfo.Agility;
            case 3:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip03") + '+' + info.templateInfo.Intellect;
            case 4:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip04") + '+' + info.templateInfo.Physique;
            case 5:
                return LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip05") + '+' + info.templateInfo.Captain;
        }
        return "";
    }


    private removeEvent() {
        this.btn_use.offClick(this, this.onBtnUseClick.bind(this));
        this.btn_batchUse.offClick(this, this.onBtnBatchUseClick.bind(this));
    }

    protected OnClickModal() {
        this.hide();
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._info = null;
        super.dispose(dispose);
    }
}