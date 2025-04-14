import FUI_WarlordRoomRankItem from "../../../../../../fui/Warlords/FUI_WarlordRoomRankItem";
import WarlordsPlayerInfo from "../../WarlordsPlayerInfo";

export default class WarlordRoomRankItem extends FUI_WarlordRoomRankItem {
  private _info: WarlordsPlayerInfo;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  public set info(value: WarlordsPlayerInfo) {
    this._info = value;
    if (this._info) {
      this.updateView();
    } else {
      this.rankTxt.text = "";
      this.userNameTxt.text = "";
      this.scoreTxt.text = "";
    }
  }

  private updateView() {
    this.rankTxt.text = this._info.displaySort.toString();
    this.userNameTxt.text = this._info.nickname;
    this.scoreTxt.text = this._info.winCount.toString();
  }

  public dispose() {
    super.dispose();
  }
}
