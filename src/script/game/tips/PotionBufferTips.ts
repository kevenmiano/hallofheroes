import { PlayerBufferInfo } from "../datas/playerinfo/PlayerBufferInfo";
import BaseTips from "./BaseTips";
import PotionBufferItem from "./PotionBufferItem";

export default class PotionBufferTips extends BaseTips {
  public bg: fgui.GLoader;
  private _tipData: Array<PlayerBufferInfo>;
  public qualification0: PotionBufferItem;
  public qualification1: PotionBufferItem;
  public qualification2: PotionBufferItem;
  public qualification3: PotionBufferItem;
  public qualification4: PotionBufferItem;
  public qualification5: PotionBufferItem;
  public subBox: fgui.GGroup;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initData();
    this.updateView();
  }

  protected onClickEvent() {
    this.onInitClick();
  }

  private initData() {
    this._tipData = this.params[0];
  }

  private updateView() {
    if (this._tipData) {
      let playerBufferInfo: PlayerBufferInfo;
      for (let i = 0; i < 6; i++) {
        if (i < this._tipData.length) {
          playerBufferInfo = this._tipData[i];
          this["qualification" + i].visible = true;
          this["qualification" + i].info = playerBufferInfo;
        } else {
          this["qualification" + i].visible = false;
        }
      }
      this.bg.height = 76 + (this._tipData.length - 1) * 30;
    }
  }

  dispose(dispose?: boolean) {
    this._tipData = null;
    super.dispose(dispose);
  }
}
