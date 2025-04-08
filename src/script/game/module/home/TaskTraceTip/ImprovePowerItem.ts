// @ts-nocheck

import FightingType from "../../../constant/FightingType";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import FightIngModel from "../../../mvc/model/FightIngModel";
import FUIHelper from "../../../utils/FUIHelper";
import LangManager from '../../../../core/lang/LangManager';
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import FUI_ImprovePowerItem from "../../../../../fui/Home/FUI_ImprovePowerItem";
import { SwitchPageHelp } from "../../../utils/SwitchPageHelp";
import GTabIndex from "../../../constant/GTabIndex";
import { BuildInfo } from "../../../map/castle/data/BuildInfo";
import BuildingManager from "../../../map/castle/BuildingManager";
import BuildingType from "../../../map/castle/consant/BuildingType";
import UIManager from "../../../../core/ui/UIManager";

export default class ImprovePowerItem extends FUI_ImprovePowerItem {
    private _info: FightIngModel;
    protected onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.upBtn.title = LangManager.Instance.GetTranslation('pass.text08');
    }

    private addEvent() {
        this.upBtn.onClick(this, this.upBtnHandler);
    }

    private removeEvent() {
        this.upBtn.offClick(this, this.upBtnHandler);
    }

    /**
     * 提升
     */
    private upBtnHandler() {
        FrameCtrlManager.Instance.exit(EmWindow.ImprovePowerWnd);
        switch (this._info.type) {
            case FightingType.F_EQUIP://装备
                SwitchPageHelp.gotoStoreFrame(GTabIndex.Forge_QH);
                break;
            case FightingType.F_PAWN: //
                SwitchPageHelp.gotoCasernFrame();
                break;
            case FightingType.F_TECHNOLOGY: //
                let bInfo: BuildInfo = BuildingManager.Instance.getBuildingInfoBySonType(BuildingType.SEMINARY);
                UIManager.Instance.ShowWind(EmWindow.SeminaryWnd, bInfo);
                break;
            case FightingType.F_CONSORTIATETECHNOLOGY: //
                FrameCtrlManager.Instance.open(EmWindow.ConsortiaSkillTower);
                break;
            case FightingType.F_START: //星运
                SwitchPageHelp.gotoStarFrame();
                break;
            case FightingType.F_CHARGE: //首充
                UIManager.Instance.ShowWind(EmWindow.FirstPayWnd);
                break;
        }
    }

    get info(): FightIngModel {
        return this._info;
    }

    set info(value: FightIngModel) {
        this._info = value;
        if (this._info) {
            this.typeIcon.url = this.getTypeIconUrl(this._info.type);
        }
    }

    private getTypeIconUrl(type: number): string {
        this.typeIcon.x = 28;
        switch (type) {
            case FightingType.F_EQUIP://装备
                this.nameTxt.text = LangManager.Instance.GetTranslation("tasktracetip.view.IntensifyTipView.text");
                return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Blacksmith");
            case FightingType.F_PAWN:
                this.nameTxt.text = LangManager.Instance.GetTranslation("ImprovePawn");
                return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Troops");
            case FightingType.F_TECHNOLOGY:
                this.nameTxt.text = LangManager.Instance.GetTranslation("tasktracetip.view.MilitaryTecTipView.text");
                return FUIHelper.getItemURL(EmPackName.Home, "Img_Pre_Academy");
            case FightingType.F_CONSORTIATETECHNOLOGY:
                this.nameTxt.text = LangManager.Instance.GetTranslation("StudyGuildSkill");
                return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Guild");
            case FightingType.F_START:
                this.nameTxt.text = LangManager.Instance.GetTranslation("ImproveStarLevel");
                this.typeIcon.x = 42;
                return FUIHelper.getItemURL(EmPackName.Home, "Btn_Main_Astro");
            case FightingType.F_CHARGE:
                this.nameTxt.text = LangManager.Instance.GetTranslation("mainBar.TopToolsBar.firstPayBtnIipData");
                this.typeIcon.x = 42;
                return FUIHelper.getItemURL(EmPackName.Home, "Btn_Eve_Recharge");
        }
        return "";
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}