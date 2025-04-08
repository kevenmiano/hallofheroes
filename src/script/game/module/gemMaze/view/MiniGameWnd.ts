// @ts-nocheck
import ConfigMgr from "../../../../core/config/ConfigMgr";
import LangManager from "../../../../core/lang/LangManager";
import { getdefaultLangageCfg } from "../../../../core/lang/LanguageDefine";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import Utils from "../../../../core/utils/Utils";
import { ConfigType } from "../../../constant/ConfigDefine";
import OpenGrades from "../../../constant/OpenGrades";
import { EmWindow } from "../../../constant/UIDefine";
import { SwitchInfo } from "../../../datas/SwitchInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import { ConfigManager } from "../../../manager/ConfigManager";
import { GemMazeManager } from "../../../manager/GemMazeManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { MonopolyManager } from "../../../manager/MonopolyManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";

/**
* @author:zhihua.zhou
* @data: 2022-05-18 18:40
* @description 游戏盒子主界面
*/
export default class MiniGameWnd extends BaseWindow {
    private btn_enter: fairygui.GButton;
    private btn_enter1: fairygui.GButton;
    private btn_bag: fairygui.GButton;
    txt_open: fairygui.GTextField;
    txt_open1: fairygui.GTextField;
    setSceneVisibleOpen = true;

    private GEMMAZE: fgui.Controller;
    private MONOPOLY: fgui.Controller;

    /**初始化 */
    public OnInitWind() {
        super.OnInitWind();
        // this.setCenter();
        this.GEMMAZE = this.getController("GEMMAZE");
        this.MONOPOLY = this.getController("MONOPOLY");
        this.initLanguage();
        this.addEvent();
        this.checkMiniGame();
        this.checkMonopoly();
    }

    initLanguage() {
        this.txt_open.text = LangManager.Instance.GetTranslation('MiniGameWnd.openTxt');
        // this.btn_enter.title = LangManager.Instance.GetTranslation('enterGame');//xml
        this.btn_bag.title = LangManager.Instance.GetTranslation('gemMaze.str1');
    }

    checkMiniGame(): boolean {
        //中控开关
        this.GEMMAZE.selectedIndex = ConfigManager.info.GEMMAZE ? 1 : 0;
        if (ConfigManager.info.GEMMAZE) {
            if (ArmyManager.Instance.thane.grades >= OpenGrades.GEM_MAZE) {
                let curDay = PlayerManager.Instance.currentPlayerModel.sysCurtime.getDay();
                if (curDay == 0) {
                    curDay = 7;
                }
                let day: string = TempleteManager.Instance.getConfigInfoByConfigName("Gem_Maze_Day").ConfigValue;
                if (day) {
                    day = this.getWeekString(day);
                    this.txt_open.text = LangManager.Instance.GetTranslation('miniGame.openDay', day);
                }

                if (GemMazeManager.Instance.model.openDay.indexOf(curDay.toString()) != -1) {
                    this.btn_enter.visible = true;
                    return;
                }
            }
        } else {
            this.txt_open.text = LangManager.Instance.GetTranslation('yishi.view.tips.goods.InlayItem.value01');
        }
        this.btn_enter.visible = false;
    }

    checkMonopoly(): boolean {
        this.MONOPOLY.selectedIndex = ConfigManager.info.MONOPOLY ? 1 : 0;
        if (ConfigManager.info.MONOPOLY) {
            if (ArmyManager.Instance.thane.grades >= OpenGrades.GEM_MAZE) {
                let curDay = PlayerManager.Instance.currentPlayerModel.sysCurtime.getDay();
                if (curDay == 0) {
                    curDay = 7;
                }
                let day: string = TempleteManager.Instance.getConfigInfoByConfigName("Monopoly_Day").ConfigValue;
                if (day) {
                    day = this.getWeekString(day);
                    this.txt_open1.text = LangManager.Instance.GetTranslation('miniGame.openDay', day);
                }
                if (MonopolyManager.Instance.model.openDay.indexOf(curDay.toString()) != -1) {
                    this.btn_enter1.visible = true;
                    return;
                }
            }
        } else {
            this.txt_open1.text = LangManager.Instance.GetTranslation('yishi.view.tips.goods.InlayItem.value01');
        }
        this.btn_enter1.visible = false;
    }

    private getWeekString(day: string): string {
        let langCfg = getdefaultLangageCfg();
        day = day.replace('1', Utils.getWeekStr(1, langCfg.key));
        day = day.replace('2', Utils.getWeekStr(2, langCfg.key));
        day = day.replace('3', Utils.getWeekStr(3, langCfg.key));
        day = day.replace('4', Utils.getWeekStr(4, langCfg.key));
        day = day.replace('5', Utils.getWeekStr(5, langCfg.key));
        day = day.replace('6', Utils.getWeekStr(6, langCfg.key));
        day = day.replace('7', Utils.getWeekStr(7, langCfg.key));
        return day;
    }

    private addEvent() {
        this.btn_enter.onClick(this, this.onEnter);
        this.btn_enter1.onClick(this, this.onEnter1);
        this.btn_bag.onClick(this, this.onBag);
    }

    private removeEvent() {
        this.btn_enter.offClick(this, this.onEnter);
        this.btn_enter1.offClick(this, this.onEnter1);
        this.btn_bag.offClick(this, this.onBag);
    }

    constructor() {
        super();
        this.resizeContent = true;
    }


    onEnter() {
        this.hide();
        FrameCtrlManager.Instance.open(EmWindow.GemMazeWnd);
    }

    /**
     * 云端历险
     */
    onEnter1() {
        this.hide();
        if(ArmyManager.Instance.army.onVehicle){
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
            return;
        }
        MonopolyManager.Instance.sendEnterCampaign();
    }

    onBag() {
        UIManager.Instance.ShowWind(EmWindow.GemMazeBagWnd);
    }


    OnShowWind() {
        super.OnShowWind();
    }

    /**关闭 */
    OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }
}