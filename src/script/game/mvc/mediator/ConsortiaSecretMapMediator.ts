import { EmWindow } from "../../constant/UIDefine";
import IMediator from "../../interfaces/IMediator";
import { ConsortiaManager } from "../../manager/ConsortiaManager";
import { ConsortiaModel } from "../../module/consortia/model/ConsortiaModel";
import { FrameCtrlManager } from '../FrameCtrlManager';
import { TipMessageData } from "../../datas/TipMessageData";
import { TaskTraceTipManager } from "../../manager/TaskTraceTipManager";

export default class ConsortiaSecretMapMediator implements IMediator {

    public register(target: any) {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaSecretInfoWnd, this.model.secretInfo);
        TaskTraceTipManager.Instance.cleanByType(TipMessageData.CALL_SECRET_TREE);
    }

    public unregister(target: any) {
        FrameCtrlManager.Instance.exit(EmWindow.ConsortiaSecretInfoWnd);
    }

    private get model(): ConsortiaModel {
        return ConsortiaManager.Instance.model;
    }
}