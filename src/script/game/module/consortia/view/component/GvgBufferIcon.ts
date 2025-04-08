import FUI_GvgBufferIcon from "../../../../../../fui/Consortia/FUI_GvgBufferIcon";
import {GvgReadyController} from "../../control/GvgReadyController";
import {FrameCtrlManager} from "../../../../mvc/FrameCtrlManager";
import {EmWindow} from "../../../../constant/UIDefine";
import {GvgWarBufferInfo} from "../../data/gvg/GvgWarBufferInfo";
import {PathManager} from "../../../../manager/PathManager";
import {GvgEvent} from "../../../../constant/event/NotificationEvent";
import AudioManager from "../../../../../core/audio/AudioManager";
import {SoundIds} from "../../../../constant/SoundIds";
import {PlayerManager} from "../../../../manager/PlayerManager";
import {ConsortiaManager} from "../../../../manager/ConsortiaManager";
import {ThaneInfo} from "../../../../datas/playerinfo/ThaneInfo";
import LangManager from "../../../../../core/lang/LangManager";
import {MessageTipManager} from "../../../../manager/MessageTipManager";
import {ConsortiaSkillHelper} from "../../../../utils/ConsortiaSkillHelper";
import SimpleAlertHelper from "../../../../component/SimpleAlertHelper";
import {ITipedDisplay, TipsShowType} from "../../../../tips/ITipedDisplay";
import FUI_BaseItem from "../../../../../../fui/Base/FUI_BaseItem";
import {ToolTipsManager} from "../../../../manager/ToolTipsManager";
import EaseType = fgui.EaseType;

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/27 21:04
 * @ver 1.0
 */
export class GvgBufferIcon extends FUI_GvgBufferIcon implements ITipedDisplay
{
    private _controller:GvgReadyController;
    private _info:GvgWarBufferInfo;
    private titleObject:fgui.GObject;

    tipData:GvgWarBufferInfo;
    tipType:EmWindow = EmWindow.GvgBufferTips;
    showType:TipsShowType = TipsShowType.onLongPress;
    startPoint:Laya.Point = new Laya.Point(0, 0);

    constructor()
    {
        super();

        this._controller = FrameCtrlManager.Instance.getCtrl(EmWindow.GvgRankListWnd) as GvgReadyController;
    }

    protected onConstruct()
    {
        super.onConstruct();

        this.titleObject = this.getChild("title");
        this.addEvent();
    }

    private addEvent()
    {
        this.bufferIcon.onClick(this, this.__iconClick);
    }

    get info():GvgWarBufferInfo
    {
        return this._info;
    }

    set info(value:GvgWarBufferInfo)
    {
        this._info = value;
        this.tipData = this._info;
        if(this._info)
        {
            ToolTipsManager.Instance.register(this);
            this._info.addEventListener(GvgEvent.UPDATE_CURRENT_COUNT, this.__playCdEffectHandler, this);

            this.bufferIcon.icon = this.getIconPath(value.templateId);
            this.txt_num.text = this._info.curreCount + "";
            this.min = 0;
            this.max = this._info.maxCdTimer;
            this.value = this._info.lefTime;
            this.tweenValue(0, this._info.lefTime).onStart(this.startCd, this).onComplete(this.cdCompleteHandler, this);
            // fgui.GTween.to(this._info.lefTime, 0, this._info.lefTime).setTarget(this, "value").onStart(this.startCd, this).onComplete(this.cdCompleteHandler, this);
        }
    }

    protected __iconClick():void
    {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
        if(this._info == null)
        {
            return;
        }
        let userId:number = PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
        let member:ThaneInfo = ConsortiaManager.Instance.model.consortiaMemberList[userId];
        let isManager:boolean = false;
        if(member.dutyId == 1 || member.dutyId == 2)
        {
            isManager = true;
        }
        if(!isManager)
        {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("public.Gvgbuffericon.manager"));
            return;
        }
        if(this._info.needPay > ConsortiaManager.Instance.model.consortiaInfo.offer)
        {
            ConsortiaSkillHelper.addWealth();
            return;
        }
        if(this.isCding)
        {
            return;
        }

        let confirm:string = LangManager.Instance.GetTranslation("public.confirm");
        let cancel:string = LangManager.Instance.GetTranslation("public.cancel");
        let prompt:string = LangManager.Instance.GetTranslation("public.prompt");
        let content:string = LangManager.Instance.GetTranslation("map.campaign.view.ui.gvg.GvgBufferIcon.useMessage", this._info.needPay, this._info.bufferNameLang);
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.__useBufferMessage.bind(this));
    }

    private __useBufferMessage(b:boolean, flag:boolean):void
    {
        if(!b)
        {
            return;
        }
        this._controller.payGvgBuffer(this._info.templateId);
    }

    private __playCdEffectHandler()
    {
        this.min = 0;
        this.max = this._info.maxCdTimer;
        this.value = this._info.maxCdTimer;
        fgui.GTween.to(this._info.maxCdTimer, 0, this._info.maxCdTimer).setTarget(this, "value").onStart(this.startCd, this).onComplete(this.cdCompleteHandler, this).setEase(fgui.EaseType.Linear);
        // this.tweenValue(0, this._info.maxCdTimer).onStart(this.startCd, this).onComplete(this.cdCompleteHandler, this);
    }

    private startCd()
    {
        this.txt_num.text = this._info.curreCount + "";
        this.titleObject.visible = true;
    }

    protected cdCompleteHandler():void
    {
        this.txt_num.text = this._info.curreCount + "";
        this.titleObject.visible = false;
    }

    protected getIconPath(tempId:number):string
    {
        return PathManager.getGvgBufferIconPath(tempId);
    }

    public get isCding():boolean
    {
        return this.titleObject.visible;
    }

    private removeEvent()
    {
        this._info && this._info.removeEventListener(GvgEvent.UPDATE_CURRENT_COUNT, this.__playCdEffectHandler, this);
        this.bufferIcon.offClick(this, this.__iconClick);
    }

    dispose()
    {
        ToolTipsManager.Instance.unRegister(this);
        this.removeEvent();
        this._controller = null;
        this._info = null;
        super.dispose();
    }
}