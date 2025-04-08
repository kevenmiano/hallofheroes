import FUI_GvgManageView from "../../../../../../fui/Consortia/FUI_GvgManageView";
import AudioManager from "../../../../../core/audio/AudioManager";
import { ConsortiaSocketOutManager } from "../../../../manager/ConsortiaSocketOutManager";
import { SoundIds } from "../../../../constant/SoundIds";
import UIManager from "../../../../../core/ui/UIManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { CampaignEvent } from "../../../../constant/event/NotificationEvent";
import Dictionary from "../../../../../core/utils/Dictionary";
import { GvgWarBufferInfo } from "../../data/gvg/GvgWarBufferInfo";
import { GvgBufferIcon } from "./GvgBufferIcon";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/27 20:51
 * @ver 1.0
 */
export class GvgManageView extends FUI_GvgManageView {
  private _buffList: GvgWarBufferInfo[];

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.addEvent();
  }

  private addEvent() {
    this.list.itemRenderer = Laya.Handler.create(
      this,
      this.onListItemRender,
      null,
      false
    );
    this._manageBtn.onClick(this, this.__openManagerHandler);

    CampaignManager.Instance.gvgModel.addEventListener(
      CampaignEvent.UPDATE_GVG_INFO,
      this.__updateGvgInfoHandler,
      this
    );
  }

  public initView() {
    this.__updateGvgInfoHandler();
  }

  private onListItemRender(index: number, item: GvgBufferIcon) {
    if (item && !item.isDisposed) item.info = this._buffList[index];
  }

  private __updateGvgInfoHandler(): void {
    let dic: Dictionary = CampaignManager.Instance.gvgModel.gvgBufferList;
    this._buffList = dic.values;
    this.list.numItems = this._buffList.length;
  }

  private __openManagerHandler() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    ConsortiaSocketOutManager.getConsortiaUserInfos();
    UIManager.Instance.ShowWind(EmWindow.GvgEnterWarWnd);
  }

  private removeEvent() {
    this.list.itemRenderer.recover();
    this._manageBtn.offClick(this, this.__openManagerHandler);

    CampaignManager.Instance.gvgModel.removeEventListener(
      CampaignEvent.UPDATE_GVG_INFO,
      this.__updateGvgInfoHandler,
      this
    );
  }

  dispose() {
    this.removeEvent();
    super.dispose();
  }
}
