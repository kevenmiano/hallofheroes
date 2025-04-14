//@ts-expect-error: External dependencies
import FUI_RemotePetFriendView from "../../../../../fui/RemotePet/FUI_RemotePetFriendView";
import { RemotePetEvent } from "../../../../core/event/RemotePetEvent";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { RemotePetManager } from "../../../manager/RemotePetManager";
import { RemotePetFriendInfo } from "../../../mvc/model/remotepet/RemotePetFriendInfo";
import { RemotePetModel } from "../../../mvc/model/remotepet/RemotePetModel";
import { RemotePetFriendItemView } from "./RemotePetFriendItemView";

export class RemotePetFriendView extends FUI_RemotePetFriendView {
  private selectItem: RemotePetFriendItemView = null;
  private friendList: RemotePetFriendInfo[];
  private _callBack: Function;

  protected onConstruct(): void {
    super.onConstruct();
    this.initView();
    this.petList.setVirtual();
    this.petList.itemRenderer = Laya.Handler.create(
      this,
      this.onItemRender,
      null,
      false,
    );
    this.petList.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
    this.addEvent();
  }

  private initView() {
    this.emptyLab.text = LangManager.Instance.GetTranslation(
      "remotepet.friend.empty",
    );
    this.titleLab.text = LangManager.Instance.GetTranslation(
      "remotepet.friend.title",
    );
  }

  private addEvent() {
    this.model.addEventListener(
      RemotePetEvent.FRIEND_LIST,
      this.__listHandler,
      this,
    );
  }
  private removeEvent() {
    this.model.removeEventListener(
      RemotePetEvent.FRIEND_LIST,
      this.__listHandler,
      this,
    );
  }

  private get model(): RemotePetModel {
    return RemotePetManager.Instance.model;
  }

  private __listHandler() {
    this.refreshList();
  }

  private refreshList() {
    if (!this.model.friendList) return;
    let friendList = this.model.friendList;
    this.friendList = friendList;
    this.petList.numItems = this.friendList.length;
    this.petList.visible = this.friendList.length > 0;
    this.emptyLab.visible = !this.petList.visible;
  }

  private onItemRender(index: number, box: RemotePetFriendItemView) {
    box.info = this.friendList[index];
  }

  private onClickItem(item: RemotePetFriendItemView) {
    this.selectItem = item;
    let info = this.selectItem.info;
    var confirm = LangManager.Instance.GetTranslation("public.confirm");
    var cancel = LangManager.Instance.GetTranslation("public.cancel");
    var prompt = LangManager.Instance.GetTranslation("public.prompt");
    var content = LangManager.Instance.GetTranslation(
      "remotepet.RemotePetFriendFrame.content",
      info.friendName,
      info.petName,
      info.petFight,
    );
    SimpleAlertHelper.Instance.popAlerFrame(prompt, content, confirm, cancel, {
      callback: this.alertBack.bind(this),
    });
  }

  private alertBack(b: boolean, flag: boolean) {
    if (b && this._callBack && this.selectItem) {
      this._callBack(this.selectItem.info);
    }

    if (b) {
      this.hide();
    }
  }

  public show(callBack: Function) {
    RemotePetManager.sendFriendPetList();
    this._callBack = callBack;
    this.visible = true;
  }

  public hide() {
    this.selectItem = null;
    this.visible = false;
    if (this._callBack) {
      this._callBack(null);
    }
    this._callBack = null;
  }

  public dispose() {
    this.removeEvent();
  }
}
