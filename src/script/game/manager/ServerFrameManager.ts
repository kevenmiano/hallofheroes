import { PackageIn } from "../../core/net/PackageIn";
import { DialogModel } from "../module/dialog/DialogModel";
import { StageReferance } from "../roadComponent/pickgliss/toplevel/StageReferance";
import { MessageTipManager } from "./MessageTipManager";
import LangManager from '../../core/lang/LangManager';
import CampaignNotifyMsg = com.road.yishi.proto.campaign.CampaignNotifyMsg;
import { DialogControl } from "../module/dialog/DialogControl";
import Logger from '../../core/logger/Logger';
export class ServerFrameManager {
    private static _instance: ServerFrameManager;
    public static get Instance(): ServerFrameManager {
        if (!ServerFrameManager._instance) ServerFrameManager._instance = new ServerFrameManager();
        return ServerFrameManager._instance;
    }

    /**
     * 新手弹框
     */
    public static NOVICE_FRAME: number = 0;

    /**
     * 对话弹框
     */
    public static DIALOG_FRAME: number = 1;

    /**
     * 黄色系统字 
     * @param $pkg
     */
    public static SYSTEM_MESSAGETIPS: number = 2;

    public createFrame($pkg: PackageIn, $callBack: Function) {
        let msg: CampaignNotifyMsg = $pkg.readBody(CampaignNotifyMsg) as CampaignNotifyMsg;
        var type: number = msg.id;
        var scene: string = msg.scene;

        var content: any[] = [msg.body];

        Logger.info("[ServerFrameManager]createFrame", msg.id, msg)
        switch (type) {
            case ServerFrameManager.NOVICE_FRAME:
                {
                    $callBack();
                    break;
                }
            case ServerFrameManager.DIALOG_FRAME:
                {
                    throw new Error(LangManager.Instance.GetTranslation("yishi.manager.ServerFrameManager.Error"));
                    this.openDialogFrame(scene, null, $callBack);
                    break;
                }
            case ServerFrameManager.SYSTEM_MESSAGETIPS:
                {
                    MessageTipManager.Instance.show(content[0].toString(), $callBack);
                    break;
                }

        }
    }

    private openDialogFrame($scene: string, $model: DialogModel, $callBack: Function) {
        var dialogCon: DialogControl = new DialogControl($callBack);
        dialogCon.model = $model;
    }

}