import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { EmWindow } from "../../../constant/UIDefine";
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { ConsortiaManager } from "../../../manager/ConsortiaManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ConsortiaControler } from "../control/ConsortiaControler";
import { ConsortiaModel } from "../model/ConsortiaModel";
import { ConsortiaActivityPage } from "./component/ConsortiaActivityPage";
import ConsortiaMethodView from "./component/ConsortiaMethodView";
import ConsortiaPlayerMenu from "./component/ConsortiaPlayerMenu";
/**
 * 公会主界面
 */
export default class ConsortiaNewWnd extends BaseWindow {
  public c1: fgui.Controller;
  public frame: fgui.GLabel;
  public pActivity: ConsortiaActivityPage; //公会成员
  public pMethod: ConsortiaMethodView; //公会玩法
  protected resizeContent: boolean = true;
  protected resizeFullContent: boolean = true;
  private _contorller: ConsortiaControler;
  private _consortiaModel: ConsortiaModel;
  private _timeId: any = 0;
  public playInfoBtn: UIButton;
  private _type: number = 0;
  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.initData();
    this.initEvent();
    if (this.frameData) {
      this._type = this.frameData;
    }
    this.initView(this._type);
    this.frame.title = LangManager.Instance.GetTranslation("public.consortia");
    this.resetConsortiaName();
    this.setRedStatus();
  }

  private resetConsortiaName(): boolean {
    var consortiaName: string =
      PlayerManager.Instance.currentPlayerModel.playerInfo.consortiaName;
    if (
      this._consortiaModel.consortiaInfo.chairmanID !=
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    )
      return false;
    if (consortiaName.indexOf("!") > 0) {
      FrameCtrlManager.Instance.open(EmWindow.ConsortiaRename, { type: 2 });
      return true;
    }
    return false;
  }

  private initData() {
    this._contorller = FrameCtrlManager.Instance.getCtrl(
      EmWindow.Consortia,
    ) as ConsortiaControler;
    this._consortiaModel = this._contorller.model;

    this._contorller.sendGetConsortiaApplyInfos();
    this.c1 = this.contentPane.getController("c1");
  }

  private initEvent() {
    this._consortiaModel.addEventListener(
      ConsortiaEvent.RECRUITNUM_CHANGED,
      this.__recruitNumHandler,
      this,
    );
    this._consortiaModel.addEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdata,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ConsortiaEvent.GET_ALTAR_GOODS,
      this.setRedStatus,
      this,
    );
    NotificationManager.Instance.addEventListener(
      ConsortiaEvent.TASK_INFO,
      this.setRedStatus,
      this,
    );
    ConsortiaManager.Instance.model.secretInfo.addEventListener(
      ConsortiaEvent.TREE_STATE_UPDATE,
      this.setRedStatus,
      this,
    );
  }

  private removeEvent() {
    this._consortiaModel.removeEventListener(
      ConsortiaEvent.RECRUITNUM_CHANGED,
      this.__recruitNumHandler,
      this,
    );
    this._consortiaModel.removeEventListener(
      ConsortiaEvent.UPDA_CONSORTIA_INFO,
      this.__onConsortiaInfoUpdata,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ConsortiaEvent.GET_ALTAR_GOODS,
      this.setRedStatus,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      ConsortiaEvent.TASK_INFO,
      this.setRedStatus,
      this,
    );
    ConsortiaManager.Instance.model.secretInfo.removeEventListener(
      ConsortiaEvent.TREE_STATE_UPDATE,
      this.setRedStatus,
      this,
    );
  }

  private setRedStatus() {
    let view = this.playInfoBtn.getView();
    let dot = view.getChild("redDot");
    let flag: boolean = false;
    if (!ConsortiaManager.Instance.model) return;
    if (
      ConsortiaManager.Instance.model.checkPrayHasLeftCount() ||
      ConsortiaManager.Instance.model.checkHasTaskComplete() ||
      ConsortiaManager.Instance.model.checkSecretRedDot() ||
      ConsortiaManager.Instance.model.checkHasTaskWeekReward()
    ) {
      flag = true;
    }
    dot.visible = flag;
  }

  private initView(index: number = 0) {
    this.c1.selectedIndex = index;
    this.setCooldownTime();
  }

  public OnShowWind() {
    super.OnShowWind();
    if (this.frameData && !Number.isNaN(this.frameData)) {
      this.c1.selectedIndex = Number(this.frameData);
    } else {
      this.c1.selectedIndex = 0;
    }
  }

  private __recruitNumHandler() {
    UIButton.setRedDot(
      this.pActivity.member.recruitBtn,
      this._consortiaModel.recruitNum,
      1,
    );
  }

  private __onConsortiaInfoUpdata() {
    this.frame.title = LangManager.Instance.GetTranslation("public.consortia");
    this.setCooldownTime();
  }

  /**
   * 公会升级冷却倒计时
   */
  private setCooldownTime() {
    if (
      this._consortiaModel &&
      this._consortiaModel.consortiaInfo &&
      this._consortiaModel.consortiaInfo.currentDate
    ) {
      let time =
        ((this._consortiaModel.consortiaInfo.currentDate as Date).getTime() -
          (
            this._consortiaModel.consortiaInfo.codeBeginDate as Date
          ).getTime()) /
        1000;
      this.timeLeft = this._consortiaModel.consortiaInfo.codeNeedDate - time;
    }
  }

  public get timeLeft(): number {
    return this._consortiaModel.timeLeft;
  }

  public set timeLeft(value: number) {
    this._consortiaModel.timeLeft = value;
    if (this._consortiaModel.timeLeft <= 0) {
      this._consortiaModel.timeLeft = 0;
    } else {
      clearTimeout(this._timeId);
      this._timeId = 0;
      this._timeId = setTimeout(this.refreshTime.bind(this), 1000);
    }
  }

  private refreshTime() {
    if (!this._consortiaModel) {
      return;
    }
    this.timeLeft = this.timeLeft - 1;
  }

  private helpBtnClick() {
    FrameCtrlManager.Instance.open(EmWindow.ConsortiaPermission);
  }

  public OnHideWind() {
    super.OnHideWind();
    ConsortiaPlayerMenu.Hide();
    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    this._contorller = null;
    clearTimeout(this._timeId);
    this._timeId = 0;
    this.pMethod.OnHideWind();
    super.dispose(dispose);
  }
}
