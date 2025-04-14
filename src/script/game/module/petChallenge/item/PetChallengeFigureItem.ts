//@ts-expect-error: External dependencies
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-08 15:17:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-11-17 19:36:30
 * @Description: 主界面英灵Item
 */

import FUI_PetChallengeFigureItem from "../../../../../fui/PetChallenge/FUI_PetChallengeFigureItem";
import { PetChallengeObjectData } from "../data/PetChallengeObjectData";
import LangManager from "../../../../core/lang/LangManager";
import { EmWindow } from "../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { ShowPetAvatar } from "../../../avatar/view/ShowPetAvatar";
import { PlayerManager } from "../../../manager/PlayerManager";
import { PetData } from "../../pet/data/PetData";

export class PetChallengeFigureItem extends FUI_PetChallengeFigureItem {
  private _info: PetChallengeObjectData;
  private _avatar: ShowPetAvatar;

  public get info(): PetChallengeObjectData {
    return this._info;
  }

  public set info(value: PetChallengeObjectData) {
    this._info = value;
    if (value) {
      this.refresh();
    } else {
      this.resetView();
    }
  }

  protected onConstruct() {
    super.onConstruct();
    this.btnChanllenge.onClick(this, this.btnChanllengeClick);
    this._avatar = new ShowPetAvatar();
    this.container.displayObject.addChild(this._avatar);
    this._avatar.pos(20, 200);
  }

  private refresh() {
    if (this._info.isSelf) {
      this.txtName.color = "#00F0FF";
      this.txtName.text = LangManager.Instance.GetTranslation(
        "PetChallengeListItemView.self",
      );
    } else {
      this.txtName.color = "#00F0FF";
      this.txtName.text = LangManager.Instance.GetTranslation(
        "PetChallengePetListInfoView.Title",
        this._info.userName,
      );
    }
    this.txtScoreValue.text = this._info.score.toString();
    this.txtCapacity.text = this._info.totalFightPower.toString();
    this.txtRank.text = this._info.ranking.toString();

    var p: PetData = this._info.petData;
    if (!p && this._info.isSelf) {
      p = PlayerManager.Instance.currentPlayerModel.playerInfo.powerMaxPetData;
    }
    if (!p) return;
    // p.template.PetAvatar = "/pet_athena"
    this._avatar.data = p.template;
  }

  private btnChanllengeClick() {
    if (!this._info || this._info.isSelf) return;

    FrameCtrlManager.Instance.open(EmWindow.PetChallengeConfirm, this._info);
  }

  private resetView() {}
}
