
import LangManager from '../../core/lang/LangManager';
import UIButton from '../../core/ui/UIButton';
import UIManager from "../../core/ui/UIManager";
import { t_s_extrajobequipData } from "../config/t_s_extrajobequip";
import { t_s_extrajobequipstrengthenData } from "../config/t_s_extrajobequipstrengthen";
import { ExtraJobEvent } from "../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../constant/UIDefine";
import { ArmyManager } from "../manager/ArmyManager";
import { NotificationManager } from "../manager/NotificationManager";
import { PlayerManager } from "../manager/PlayerManager";
import { TempleteManager } from "../manager/TempleteManager";
import { ExtraJobEquipItemInfo } from "../module/bag/model/ExtraJobEquipItemInfo ";
import ExtraJobModel from "../module/bag/model/ExtraJobModel";
import BaseTips from "./BaseTips";
import { GoodAttributeItem } from "./GoodAttributeItem";
import { InlayItem } from "./InlayItem";

/**
 * 魂器tip
 */
export class SoulEquipTip extends BaseTips {
    public btn_use: UIButton;
    private txt_name: fgui.GTextField;
    private txt_stren: fgui.GTextField;
    private txt_stage: fgui.GTextField;
    private txt_condition: fgui.GTextField;
    private totalBox: fgui.GGroup;
    private inlayBox: fgui.GGroup;
    private unlockBox: fgui.GGroup;
    private iconLoader: fgui.GLoader;
    private _info: ExtraJobEquipItemInfo;
    private attack: GoodAttributeItem;
    private magicAttack: GoodAttributeItem;
    private defence: GoodAttributeItem;
    private magicDefence: GoodAttributeItem;
    private live: GoodAttributeItem;
    private inlayItem1: InlayItem;
    private inlayItem2: InlayItem;
    private inlayItem3: InlayItem;
    private inlayItem4: InlayItem;
    canOperate: boolean = true;
    public OnInitWind() {
        super.OnInitWind();

        let arr = this.params[0]
        if (arr.length == 2) {
            this._info = arr[0];
            this.canOperate = false;
        } else {
            this.canOperate = true;
            this._info = arr;
        }
        this.initView();
        this.addEvent();
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    private addEvent() {
        NotificationManager.Instance.addEventListener(ExtraJobEvent.STAGE_UP, this.onStageUp, this);
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(ExtraJobEvent.STAGE_UP, this.onStageUp, this);
    }

    private onStageUp(info: ExtraJobEquipItemInfo) {
        this._info = info;
        this.initView();
    }

    private initView() {
        this.txt_name.text = LangManager.Instance.GetTranslation('Mastery.soulEquip' + this._info.equipType);

        if (!this.isLocked) {
            this.btn_use.title = LangManager.Instance.GetTranslation("Mastery.active");
        }

        if (this._info.equipLevel > 0) {
            this.txt_stage.text = LangManager.Instance.GetTranslation('Mastery.stageNum', this._info.equipLevel);
        }
        if (this._info.strengthenLevel > 0) {
            this.txt_stren.text = LangManager.Instance.GetTranslation('Mastery.strenLevel', this._info.strengthenLevel);
        }

        let url = "Icon_Mastery_Horcrux_" + this._info.equipType;
        this.iconLoader.url = fgui.UIPackage.getItemURL(EmPackName.Base, url);

        if (this._info.equipLevel == 0) {//未激活
            let cfg = TempleteManager.Instance.getExtrajobEquipCfg(this._info.equipType, 1);
            if (cfg) {
                this.initAttribute(cfg);
                //是否可以解锁
                if (ExtraJobModel.instance.totalLevel >= cfg.NeedTotalJobLevel) {
                    this.unlockBox.visible = false;
                    this.btn_use.visible = true;
                } else {
                    //显示解锁条件
                    this.txt_condition.text = LangManager.Instance.GetTranslation('Mastery.unlock', cfg.NeedTotalJobLevel)
                    this.btn_use.visible = false;
                    this.unlockBox.visible = true;
                }
                this.inlayBox.visible = false;
            }
        } else {
            let cfg = TempleteManager.Instance.getExtrajobEquipCfg(this._info.equipType, this._info.equipLevel);
            if (cfg) {
                this.initAttribute(cfg);
                this.initInlay(this._info);
            }
        }
        if (!this.canOperate) {
            this.btn_use.visible = false;
        }
    }

    private initInlay(info: ExtraJobEquipItemInfo) {
        for (let index = 1; index <= 4; index++) {
            let item = this["inlayItem" + index] as InlayItem
            if (item) {
                let joinIdx = info["join" + index]
                item.setData(joinIdx, ArmyManager.Instance.thane.id);
                if (joinIdx != -1) {
                    item.visible = true;
                } else {
                    item.visible = false;
                }
            }
        }
    }

    private initAttribute(cfg: t_s_extrajobequipData) {
        let strenLevel = this._info.strengthenLevel;
        let curStrenCfg: t_s_extrajobequipstrengthenData = TempleteManager.Instance.getExtrajobEquipStrenthenCfg(strenLevel);
        let str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip13");
        this.updateAttributeTxt(this.attack, str, cfg.Attack, this.getAdd(cfg.Attack, curStrenCfg));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip14");
        this.updateAttributeTxt(this.defence, str, cfg.Defence, this.getAdd(cfg.Defence, curStrenCfg));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip15");
        this.updateAttributeTxt(this.magicAttack, str, cfg.MagicAttack, this.getAdd(cfg.MagicAttack, curStrenCfg));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip16");
        this.updateAttributeTxt(this.magicDefence, str, cfg.MagicDefence, this.getAdd(cfg.MagicDefence, curStrenCfg));
        str = LangManager.Instance.GetTranslation("armyII.ThaneAttributeView.Tip11");
        this.updateAttributeTxt(this.live, str, cfg.Live, this.getAdd(cfg.Live, curStrenCfg));
    }

    private updateAttributeTxt(item: GoodAttributeItem, property: string, value: number, addValue: number) {
        if (value != 0) {
            item.visible = true;
            item.updateText(property, value, addValue);
        } else {
            item.visible = false;
        }
    }

    private getAdd(preValue: number, strenCfg: any): number {
        let addValue = strenCfg ? strenCfg.ExtraPropertyPercent / 100 * preValue : 0;
        return Math.floor(addValue);
    }


    private btn_useClick() {
        if (this._info.equipLevel == 0) {
            //激活
            PlayerManager.Instance.reqExtraJobEquip(1, this._info.equipType, 0, 0, 0)
        } else {
            UIManager.Instance.ShowWind(EmWindow.MasterySoulWnd, this._info);
            this.OnBtnClose();
        }
        this.hide();
    }


    private get isLocked(): boolean {
        return this._info && this._info.equipLevel > 0
    }

    protected OnClickModal() {
        super.OnClickModal();
        this.hide();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}