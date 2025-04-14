import FUI_FriendInviteItem from "../../../../../../fui/Friend/FUI_FriendInviteItem";
import ToolInviteInfo from "../../../../datas/ToolInviteInfo";
import UIButton from "../../../../../core/ui/UIButton";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import LangManager from "../../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../../manager/MessageTipManager";
import { FriendManager } from "../../../../manager/FriendManager";
import RelationType from "../../../../constant/RelationType";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/7/19 17:54
 * @ver 1.0
 *
 */

export class FriendInviteItem extends FUI_FriendInviteItem {
  public btnAgree: UIButton;
  public btnIgnore: UIButton;

  private _info: ToolInviteInfo;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();

    this.btnAgree = new UIButton(this.btn_agree);
    this.btnIgnore = new UIButton(this.btn_ignore);

    this.initEvent();
  }

  private initEvent() {
    this.btnAgree.onClick(this, this.onBtnAgreeClick);
    this.btnIgnore.onClick(this, this.onBtnIgnoreClick);
  }

  get info(): ToolInviteInfo {
    return this._info;
  }

  set info(value: ToolInviteInfo) {
    if (this._info == value) {
      return;
    }
    this._info = value;
    this.updateView();
  }

  private updateView() {
    this.c1.selectedIndex = this._info.sex;
    this.txt_name.text = this._info.nickName;
    this.txt_lv.text = LangManager.Instance.GetTranslation(
      "public.level3",
      this._info.grades,
    );
  }

  private onBtnAgreeClick() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    if (
      FriendManager.getInstance().countFriend >=
      FriendManager.getInstance().maxFriendCount
    ) {
      let str: string = LangManager.Instance.GetTranslation(
        "yishi.manager.FriendManager.command02",
      );
      MessageTipManager.Instance.show(str);
      return;
    } else if (
      FriendManager.getInstance().countFriend <
      FriendManager.getInstance().maxFriendCount
    ) {
      FriendManager.getInstance().sendAddFriendRequest(
        this._info.nickName,
        RelationType.FRIEND,
        this._info.reqId,
      );
    }
  }

  private onBtnIgnoreClick() {
    AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
    FriendManager.getInstance().removeToolInviteFriend(this._info);
    let str: string = LangManager.Instance.GetTranslation(
      "friends.view.ToolInviteFriendItem.command01",
    );
    MessageTipManager.Instance.show(str);
  }

  private removeEvent() {
    this.btnAgree.offClick(this, this.onBtnAgreeClick);
    this.btnIgnore.offClick(this, this.onBtnIgnoreClick);
  }

  dispose() {
    this.removeEvent();
    this._info = null;

    super.dispose();
  }
}
