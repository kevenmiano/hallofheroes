//@ts-expect-error: External dependencies
import { RemotePetEvent } from "../../../core/event/RemotePetEvent";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { GoodsManager } from "../../manager/GoodsManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { RemotePetManager } from "../../manager/RemotePetManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";
import { RemotePetModel } from "../../mvc/model/remotepet/RemotePetModel";
import { ShopGoodsInfo } from "../shop/model/ShopGoodsInfo";
import { RemotePetFormationView } from "./view/RemotePetFormationView";
import { RemotePetFriendItemView } from "./view/RemotePetFriendItemView";
import { RemotePetFriendView } from "./view/RemotePetFriendView";
import { RemotePetHeadItemView } from "./view/RemotePetHeadItemView";
import { RemotePetHeadSelectView } from "./view/RemotePetHeadSelectView";
import { RemotePetListView } from "./view/RemotePetListView";
import { RemoteSkillView } from "./view/RemoteSkillView";

export class RemotePetReadyWnd extends BaseWindow {
  protected setOptimize = false;
  public _skillView: RemoteSkillView;
  public _petInfoView: RemotePetListView;
  public _formationView: RemotePetFormationView;
  public _selectPetView: RemotePetHeadSelectView;
  public _selectFriendView: RemotePetFriendView;
  public _stateText: fgui.GTextField;
  public _curLvText: fgui.GTextField;
  public _maxLvText: fgui.GTextField;
  public _curLvNum: fgui.GTextField;
  public _maxLvNum: fgui.GTextField;
  public _btnRank: fgui.GButton;
  public _startBtn: fgui.GButton;
  // public _sylph2: fgui.GTextField;
  // public _sylph1: fgui.GTextField;
  public helpBtn: fgui.GButton;

  public resizeContent = true;

  public OnInitWind() {
    // this.setCenter();
    this.addEvent();
    RemotePetManager.sendRemotePetInfo();
    RemotePetManager.Instance.model.fristRst = false;
    this._startBtn.enabled = false;
  }

  public OnHideWind() {
    this.removeEvent();
    RemotePetManager.Instance.saveRemotePetInfo();
  }

  private addEvent() {
    this.model.addEventListener(
      RemotePetEvent.COMMIT,
      this.__commitHandler,
      this,
    );
    this._startBtn.onClick(this, this.onStartClick);
    this._btnRank.onClick(this, this.onRankClick);
    this.helpBtn.onClick(this, this.onHelpTap);
    this.contentPane.displayObject.on(
      Laya.Event.CLICK,
      this,
      this.onStageClick,
    );
  }

  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.COMMIT,
      this.__commitHandler,
      this,
    );
    this._startBtn.offClick(this, this.onStartClick);
    this._btnRank.offClick(this, this.onRankClick);
    this.helpBtn.offClick(this, this.onHelpTap);
  }

  private onStageClick(evt: Laya.Event) {
    if (evt.target.parent && evt.target.parent["$owner"]) {
      let sourceTarget = evt.target.parent["$owner"];
      if (
        sourceTarget instanceof RemotePetHeadItemView ||
        sourceTarget instanceof RemotePetFriendItemView
      ) {
        return;
      }
    }

    if (
      this._selectPetView.visible == true ||
      this._selectFriendView.visible == true
    ) {
      this._selectPetView.hide();
      this._selectFriendView.hide();
      evt.stopPropagation();
    }
  }

  private __commitHandler() {
    this.updateView();
    this._petInfoView.init(this._selectPetView, this._selectFriendView);
    this._skillView.init();
    this._startBtn.enabled = true;
  }

  private updateView() {
    let model = this.model;
    // if (model.isFrist) {
    //     this._stateText.text = "开始\n远征"
    // } else {
    //     this._stateText.text = "继续\n远征"
    // }

    let now = model.turnInfo.currTurn;
    if (now >= 100) {
      now = 100;
    }
    this._curLvNum.text = now + "";
    this._maxLvNum.text = model.turnInfo.maxTurn + "";

    // let count = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.REMOTEPET_TEMPID);
    // let count2 = GoodsManager.Instance.getGoodsNumByTempId(ShopGoodsInfo.REMOTEPET_TEMPID2);
    // this._sylph1.text = count + "";
    // this._sylph2.text = count2 + "";
  }

  private onStartClick() {
    if (this.model.enterWarNum < 3) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "remotepet.views.RemotePetInfoView.tip",
        ),
      );
      return;
    }
    UIManager.Instance.ShowWind(EmWindow.RemotePetTurnWnd);
    UIManager.Instance.HideWind(EmWindow.RemotePetReadyWnd);
  }

  private onRankClick() {
    FrameCtrlManager.Instance.open(EmWindow.RemotePetOrderWnd);
  }

  private onHelpTap() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation("remotepet.help");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  public get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  public dispose(dispose?: boolean): void {
    super.dispose();
    this.removeEvent();
    this._skillView.dispose();
    this._petInfoView.dispose();
    this._formationView.dispose();
    this._selectFriendView.dispose();
  }
}
