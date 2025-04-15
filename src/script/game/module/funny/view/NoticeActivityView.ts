import FUI_NoticeActivityView from "../../../../../fui/Funny/FUI_NoticeActivityView";
import FunnyManager from "../../../manager/FunnyManager";
import FunnyData from "../model/FunnyData";
// import { FunnyContent } from "@/script/game/module/funny/view/FunnyContent";

interface FunnyContent {
  onUpdate(): void;
  onShow(): void;
  onHide(): void;
  dispose(): void;
}

export default class NoticeActivityView
  extends FUI_NoticeActivityView
  implements FunnyContent
{
  private _infoData: FunnyData = null;

  initView() {
    this.nameTitle.text = this._infoData.title;
    if (this._infoData.describe) {
      this.describeText.text = this._infoData.describe;
    } else {
      this.describeText.text = "";
    }
  }

  onShow() {
    let showID = FunnyManager.Instance.selectedId;
    let showData = FunnyManager.Instance.getShowData(showID);
    if (showID && showData) {
      this._infoData = showData;
    }
    this.initView();
  }

  onUpdate() {
    let showID = FunnyManager.Instance.selectedId;
    let showData = FunnyManager.Instance.getShowData(showID);
    if (showID && showData) {
      this._infoData = showData;
    }
    this.initView();
  }

  onHide() {}

  dispose() {
    super.dispose();
  }
}
