import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseFguiCom from "../../../core/ui/Base/BaseFguiCom";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import Utils from "../../../core/utils/Utils";
import { CampaignEvent } from "../../constant/event/NotificationEvent";
import { UIAlignType } from "../../constant/UIAlignType";
import { EmWindow } from "../../constant/UIDefine";
import { CampaignManager } from "../../manager/CampaignManager";
import { MsgMan } from "../../manager/MsgMan";
import { isOversea } from "../login/manager/SiteZoneCtrl";
import PetBossModel from "./PetBossModel";
/**
 * 保卫英灵岛提示信息界面
 */
export default class PetGuardTipWnd extends BaseWindow {
    protected resizeContent = true;
    comPetGuardTip: fgui.GComponent;
    btnHelp:fairygui.GButton;
    inOutBtn: fgui.GButton;
    txt_time:fairygui.GTextField;
    txt_bar:fairygui.GTextField;
    CampaignNameTxt:fairygui.GTextField;
    txt01:fairygui.GTextField;
    txt02:fairygui.GTextField;
    txt03:fairygui.GTextField;
    bar:fairygui.GProgressBar;
    //距离平息结束时间: 
    private leftTimeNum:number;
    isMoving:boolean = false;

    public isOversea: fgui.Controller;

    private get petBossModel():PetBossModel
    {
        return CampaignManager.Instance.petBossModel;
    }

    public OnInitWind() {
        super.OnInitWind();
        BaseFguiCom.autoGenerate(this.comPetGuardTip, this);
        
        Resolution.addWidget(this.comPetGuardTip.displayObject, UIAlignType.RIGHT);
        if (Utils.isWxMiniGame()) {
            this.comPetGuardTip.displayObject.y = 320;
            this.comPetGuardTip.displayObject.scaleX = 0.8;
            this.comPetGuardTip.displayObject.scaleY = 0.8;
        }
        this.CampaignNameTxt.text = LangManager.Instance.GetTranslation("petIsland");
        this.txt01.text = LangManager.Instance.GetTranslation("PetBossInfoView.str2");
        this.txt02.text = LangManager.Instance.GetTranslation("PetBossInfoView.str1");
        this.txt03.text = LangManager.Instance.GetTranslation("PetBossInfoView.str3");
        this.bar = this.comPetGuardTip.getChild("bar") as fgui.GProgressBar;
        this.addEvent();
        this.refreshView();
        this.isOversea = this.getController("isOversea");
        if (this.isOversea)
            this.isOversea.selectedIndex = isOversea() ? 1 : 0;
    }

    private addEvent():void
    {
        MsgMan.addObserver(CampaignEvent.PET_BOSS_SWITCH,this,this.__petBossSwitchHandler);
        Laya.timer.loop(1000,this,this.onTimer);
    }

    private removeEvent():void
    {
        MsgMan.removeObserver(CampaignEvent.PET_BOSS_SWITCH,this,this.__petBossSwitchHandler);
        Laya.timer.clear(this,this.onTimer);
    }

    private __petBossSwitchHandler(msg:String,obj:Object):void
    {
        if(!this.petBossModel.isOpen)
        {
            this.hide();
            return;
        }
        this.refreshView();
    }

    private refreshView():void
    {
        for(let i:number = 0;i<3;i++)
        {
            let currentCount:number = this.petBossModel.countArr[i];
            let maxCount:number = parseInt(this.petBossModel.maxCountArr[i]);
            (this["txt"+i] as fairygui.GTextField).text = LangManager.Instance.GetTranslation("PetBossInfoView.monsterText" +i,currentCount,maxCount);
            if(currentCount >= maxCount)
            {
                (this["txt"+i] as fairygui.GTextField).color = '#ff2e2e';
            }else
            {
                (this["txt"+i] as fairygui.GTextField).color = '#71f000';
            }
        }
        let currentFrame:number = Math.max(1, Math.min(100, Math.floor(this.petBossModel.currentRagePoint*100/this.petBossModel.maxRagePoint)));
        this.txt_bar.text = this.petBossModel.currentRagePoint + "/" + this.petBossModel.maxRagePoint;
        this.bar.value = this.petBossModel.currentRagePoint / this.petBossModel.maxRagePoint * 100;
        this.leftTimeNum = Math.floor(this.petBossModel.leftTime/1000);
    }

    onTimer(){
        if(this.leftTimeNum > 0)
        {
            this.leftTimeNum -- ;
            this.txt_time.text = DateFormatter.getConsortiaCountDate(this.leftTimeNum);
        }else
        {
            this.txt_time.text = "00:00:00";
            Laya.timer.clear(this,this.onTimer);
        }
    }

    OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    private btnHelpClick() {
        let title = LangManager.Instance.GetTranslation("PetBossInfoView.helpBtn.tipdata");;
        let content = LangManager.Instance.GetTranslation("PetBossInfoView.boss.helpFrame.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }
}