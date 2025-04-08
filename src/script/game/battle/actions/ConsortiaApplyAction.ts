import {MapBaseAction} from "./MapBaseAction";
import {NotificationManager} from "../../manager/NotificationManager";
import {SceneEvent} from "../../constant/event/NotificationEvent";
import LangManager from "../../../core/lang/LangManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import MainToolBar from "../../module/home/MainToolBar";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { EmWindow } from "../../constant/UIDefine";
import { ConsortiaControler } from "../../module/consortia/control/ConsortiaControler";

/**
 * @author yuanzhan.yu
 */
export class ConsortiaApplyAction extends MapBaseAction
{
    private _isPop:boolean;
    private _id:number;
    private _msg:string;

    constructor(id:number, $msg:string)
    {
        super();

        this._id = id;
        this._msg = $msg;
    }

    public prepare()
    {
        NotificationManager.Instance.dispatchEvent(SceneEvent.LOCK_SCENE, false);
        // SceneManager.Instance.lockScene = false;
    }

    public update()
    {
        if(!this._isPop)
        {
            this.createApplyFrame(this._msg);
            this._isPop = true;
        }
    }

    private createApplyFrame(msg:string)
    {
        var prompt:string = LangManager.Instance.GetTranslation("public.prompt");
        var confirm1:string = LangManager.Instance.GetTranslation("public.confirm");
        var cancel1:string = LangManager.Instance.GetTranslation("public.cancel");
        SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, msg, confirm1, cancel1, this.__requestFrameCloseHandler.bind(this));
    }

    private __requestFrameCloseHandler(b:boolean, flag:boolean)
    {
        if(b){//关闭和取消不是拒绝
            (FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler).operateConsortiaApply(this._id, b);
        }
        this.actionOver();
    }
}