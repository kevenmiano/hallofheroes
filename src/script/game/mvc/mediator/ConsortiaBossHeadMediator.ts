import { EmWindow } from "../../constant/UIDefine";
import IMediator from "../../interfaces/IMediator";
import { FrameCtrlManager } from "../FrameCtrlManager";

export default class ConsortiaBossHeadMediator implements IMediator{
    public register(target: any) {
        FrameCtrlManager.Instance.open(EmWindow.ConsortiaBossSceneWnd);
    }

    public unregister(target: any) {
        FrameCtrlManager.Instance.exit(EmWindow.ConsortiaBossSceneWnd);
    }
}