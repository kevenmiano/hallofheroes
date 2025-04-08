import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import FarmInfo from "../data/FarmInfo";
import LangManager from '../../../../core/lang/LangManager';
import { FarmModel } from "../data/FarmModel";
import { TempleteManager } from "../../../manager/TempleteManager";
import ConfigInfosTempInfo from "../../../datas/ConfigInfosTempInfo";
import { FarmManager } from "../../../manager/FarmManager";
import UIButton from '../../../../core/ui/UIButton';
import { FarmEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import FarmWnd from "./FarmWnd";
import FarmCtrl from "../control/FarmCtrl";
/**
 * 农场土地升级
 */
export default class FarmLandUpWnd extends BaseWindow {
    public currentLevelTxt: fgui.GTextField;
    public nextLevelTxt: fgui.GTextField;
    public descTxt: fgui.GTextField;
    public descTxt0: fgui.GTextField;//当前等级描述
    public costGoldTxt: fgui.GTextField;
    public landUpBtn: UIButton;
    private _farmInfo: FarmInfo;
    private _currentLevel: number = 0;
    private _outputUpPercent: number;
    private _timeDownPercent: number;
    private _limitCtrl: fgui.Controller;
    public OnInitWind() {
        super.OnInitWind();
        if (this.frameData) {
            this._farmInfo = this.frameData.farmInfo;
        }
        let outPutUpConfigTemp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("FarmCrop_Gains_Percent");
        if (outPutUpConfigTemp) {
            this._outputUpPercent = parseInt(outPutUpConfigTemp.ConfigValue);
        }
        let timeDownConfigTemp: ConfigInfosTempInfo = TempleteManager.Instance.getConfigInfoByConfigName("FarmCrop_Mature_Percent");
        if (timeDownConfigTemp) {
            this._timeDownPercent = parseInt(timeDownConfigTemp.ConfigValue);
        }
        this.initEvent();
        this.initData();
        this.setCenter();
    }

    private initData() {
        this._limitCtrl = this.getController("limitCtrl");
        let cfgValue = 1;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Land_Up_Mulriple");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        if (this._farmInfo) {
            this._currentLevel = this._farmInfo.landGrade;
            this.currentLevelTxt.text = LangManager.Instance.GetTranslation("buildings.casern.view.RecruitPawnCell.command06", this._currentLevel);
            if (this._currentLevel >= FarmModel.MAX_LAND_LEVEL) {//最高等级了
                this.nextLevelTxt.text = LangManager.Instance.GetTranslation("buildings.BaseBuildFrame.maxGrade");
                this.descTxt0.text = LangManager.Instance.GetTranslation("yishi.view.tips.LandUpTip.buff", FarmModel.MAX_LAND_LEVEL * this._outputUpPercent);
                this.costGoldTxt.text = "";
                this._limitCtrl.selectedIndex = 1;
            } else {
                this.nextLevelTxt.text = LangManager.Instance.GetTranslation("public.level4_space2", this._currentLevel + 1);
                this.descTxt0.text = LangManager.Instance.GetTranslation("yishi.view.tips.LandUpTip.buff", (this._currentLevel) * this._outputUpPercent);
                this.descTxt.text = LangManager.Instance.GetTranslation("yishi.view.tips.LandUpTip.buff", (this._currentLevel + 1) * this._outputUpPercent);
                this.costGoldTxt.text = ((this._currentLevel * (this._currentLevel + 1) * (this._currentLevel + 2) / 2 + 15) * cfgValue).toString();
                this._limitCtrl.selectedIndex = 0;
            }
        }
    }

    private initEvent() {
        this._farmInfo.addEventListener(FarmEvent.LAND_GRADE_CHANGE, this.__landUp, this)
    }

    private removeEvent() {
        this._farmInfo.removeEventListener(FarmEvent.LAND_GRADE_CHANGE, this.__landUp, this)
    }

    private landUpBtnClick() {
        if (this._currentLevel >= FarmModel.MAX_LAND_LEVEL) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("farm.view.FarmBuildLayer.maxLandLevelTip"));
            return
        }
        FarmManager.sendLandUp(this._currentLevel);
    }

    private __landUp() {
        this.initData()
        let ctrl = FrameCtrlManager.Instance.getCtrl(EmWindow.Farm) as FarmCtrl
		let wnd = ctrl.view as FarmWnd
		if (wnd){
            wnd.updateFarmLandLevel();
        }
    }

    OnShowWind() {
        super.OnShowWind();
        this.setCenter();
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose() {
        super.dispose()
    }
}