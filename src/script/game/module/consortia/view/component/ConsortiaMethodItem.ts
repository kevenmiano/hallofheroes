// @ts-nocheck

import FUI_ConsortiaMethodItem from "../../../../../../fui/Consortia/FUI_ConsortiaMethodItem";
import LangManager from "../../../../../core/lang/LangManager";
import { getdefaultLangageCfg } from "../../../../../core/lang/LanguageDefine";
import StringHelper from "../../../../../core/utils/StringHelper";
import Utils from "../../../../../core/utils/Utils";
import { EmWindow } from "../../../../constant/UIDefine";
import ConfigInfoManager from "../../../../manager/ConfigInfoManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { SceneManager } from "../../../../map/scene/SceneManager";
import SceneType from "../../../../map/scene/SceneType";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { isOversea } from "../../../login/manager/SiteZoneCtrl";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaActivityInfo } from "../../data/ConsortiaActivityInfo";
import { ConsortiaInfo } from "../../data/ConsortiaInfo";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import ColorConstant from "../../../../constant/ColorConstant";
import { PlayerModel } from "../../../../datas/playerinfo/PlayerModel";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { OuterCityModel } from "../../../../map/outercity/OuterCityModel";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
export default class ConsortiaMethodItem extends FUI_ConsortiaMethodItem {
    private _data: ConsortiaActivityInfo;
    onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.openDescTxt.text = LangManager.Instance.GetTranslation("CastleBuildingView.clickHookBuild");
        Utils.setDrawCallOptimize(this);
    }

    public set info(value: ConsortiaActivityInfo) {
        this._data = value;
        if (this._data) {
            this.refreshView();
        }
    }

    public get info(): ConsortiaActivityInfo {
        return this._data;
    }

    private addEvent() {
        this.enterBtn.onClick(this, this.__gotoTxtBtnClickHandler);
        this.operationBtn.onClick(this, this.__operatingBtnClickHandler);
    }

    private removeEvent() {
        this.enterBtn.offClick(this, this.__gotoTxtBtnClickHandler);
        this.operationBtn.offClick(this, this.__operatingBtnClickHandler);
    }

    public __gotoTxtBtnClickHandler() {
        if (this._data.id != 0) {
            let currentType = SceneManager.Instance.currentType
            if (currentType && (currentType == SceneType.PVP_ROOM_SCENE || currentType == SceneType.PVE_ROOM_SCENE || currentType == SceneType.WARLORDS_ROOM)) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("dayGuide.DayGuideManager.command03"));
                return;
            }
        }
        if (this._data.gotoFunction != null) {
            this._data.gotoFunction();
        }
    }

    private __operatingBtnClickHandler(evt: MouseEvent) {
        if (this._data.operatingFun != null) {
            this._data.operatingFun();
        }
    }

    private refreshView() {
        let langCfg = getdefaultLangageCfg();
        this.typeCtr.selectedIndex = this._data.type;
        this.enterBtn.enabled = this._data.isEnabled;
        this.descTxt.color = ColorConstant.RED_COLOR;
        this.descTxt.text = this._data.promptTxt;
        switch (this._data.id) {
            case ConsortiaModel.ACTIVITY_INFO_TYPE1://公会秘境
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_method01");
                this.methodNameTxt.text = LangManager.Instance.GetTranslation("ConsortiaActivityItem.activityName2");
                if (this.descTxt.text == LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt1")) {
                    this.descTxt.color = ColorConstant.GREEN_COLOR;
                }
                this.redCtr.selectedIndex = ConsortiaManager.Instance.model.checkSecretRedDot()?1:0;
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE2://勇者之战
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_method02");
                this.methodNameTxt.text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.title");
                this.operationBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Icon_Guildboss");
                let openTimeArr: Array<number> = ConfigInfoManager.Instance.getConsortiabossOpeningdate();
                let value: number;
                let openStr: string;
                let str: string;
                if (this.descTxt.text == LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.bossPromptTxt1")) {
                    this.descTxt.color = ColorConstant.GREEN_COLOR;
                }
                if (openTimeArr) {
                    for (let i: number = 0; i < openTimeArr.length; i++) {
                        value = parseInt(openTimeArr[i].toString());
                        if (value == 7) {
                            if (isOversea()) {
                                str = Utils.getWeekStr(value, langCfg.key);
                            } else {
                                str = LangManager.Instance.GetTranslation("consortBoss.openTxt", LangManager.Instance.GetTranslation("public.daily"));
                            }
                        } else {
                            str = LangManager.Instance.GetTranslation("consortBoss.openTxt", Utils.getWeekStr(value, langCfg.key));
                        }
                        if (StringHelper.isNullOrEmpty(openStr)) {
                            openStr = str;
                        } else {
                            openStr += " " + str;
                        }
                    }
                    this.openTimeTxt.text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.openTime", openStr);
                }
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE3://公会战
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_method03");
                this.methodNameTxt.text = LangManager.Instance.GetTranslation("ConsortiaActivityItem.activityName3");
                if (this.descTxt.text != LangManager.Instance.GetTranslation("consortia.view.myConsortia.activity.ConsortiaActivityListView.notInList")) {
                    this.descTxt.color = ColorConstant.GREEN_COLOR;
                }
                let dayValue: number;
                let dayStr: string = "";
                let openDayStr: string;
                let openDayArr: Array<number> = ConfigInfoManager.Instance.getOutyardOpenDay();
                if (openDayArr) {
                    for (let i: number = 0; i < openDayArr.length; i++) {
                        dayValue = parseInt(openDayArr[i].toString());
                        if (dayValue == 7) {
                            if (isOversea()) {
                                dayStr = Utils.getWeekStr(dayValue, langCfg.key);
                            } else {
                                dayStr = LangManager.Instance.GetTranslation("consortBoss.openTxt", LangManager.Instance.GetTranslation("public.daily"));
                            }
                        }
                        if (StringHelper.isNullOrEmpty(openDayStr)) {
                            openDayStr = LangManager.Instance.GetTranslation("consortBoss.openTxt", Utils.getWeekStr(dayValue, langCfg.key));;
                        } else {
                            if (dayValue == 7) {
                                if (isOversea()) {
                                    openDayStr += " " + Utils.getWeekStr(dayValue, langCfg.key);
                                } else {
                                    openDayStr += " " + LangManager.Instance.GetTranslation("public.daily");
                                }
                            } else {
                                openDayStr += " " + Utils.getWeekStr(dayValue, langCfg.key);
                            }
                        }
                    }
                }
                this.openTimeTxt.text = LangManager.Instance.GetTranslation("ConsortiaBossWnd.openTime", openDayStr);
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE4://宝藏矿脉
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_method04");
                this.operationBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Icon_ore");
                this.methodNameTxt.text = LangManager.Instance.GetTranslation("ConsortiaTreasure.title");
                if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE1) {
                    this.descTxt.color = ColorConstant.BLUE_COLOR;
                } else if (this.playerModel.treasureState == OuterCityModel.TREASURE_STATE2) {
                    this.descTxt.color = ColorConstant.GREEN_COLOR;
                } else {
                    this.descTxt.color = ColorConstant.RED_COLOR;
                }
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE14://公会任务
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_function05");
                this.functionNameTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaCaseFrame.titleText", this.consortiaInfo.storeLevel);
                this.redCtr.selectedIndex = ConsortiaManager.Instance.model.checkHasTaskComplete() || ConsortiaManager.Instance.model.checkHasTaskWeekReward()?1:0;
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE13://祭坛
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_function02");
                this.functionNameTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaAltarFrame.titleText", this.consortiaInfo.altarLevel);
                this.redCtr.selectedIndex = ConsortiaManager.Instance.model.checkPrayHasLeftCount()?1:0;
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE11://商城
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_function03");
                this.functionNameTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.building.ConsortiaShopFrame.titleText", this.consortiaInfo.shopLevel);
                break;
            case ConsortiaModel.ACTIVITY_INFO_TYPE12://技能
                this.enterBtn.selectedIcon = this.enterBtn.icon = fgui.UIPackage.getItemURL("Consortia", "Img_function04");
                this.functionNameTxt.text = LangManager.Instance.GetTranslation("consortia.view.myConsortia.skill.ConsortiaResearchSkillFrame.title", this.consortiaInfo.schoolLevel);
                break;


        }
    }

    private get consortiaInfo(): ConsortiaInfo {
        return (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).model.consortiaInfo;
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel
    }

    public dispose() {
        this.removeEvent();
        super.dispose();
    }
}