import { EmWindow } from "../../constant/UIDefine";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { FrameCtrlManager } from "../FrameCtrlManager";

export default class ConsortiaBossUIMediator implements IMediator {
  public register(target: any) {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaBossTaskView);
  }

  public unregister(target: any) {
    FrameCtrlManager.Instance.exit(EmWindow.ConsortiaBossTaskView);
  }
}
