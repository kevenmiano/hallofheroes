import FUI_AirGardenGameLLKItem from "../../../../../fui/Carnival/FUI_AirGardenGameLLKItem";
import FUIHelper from "../../../utils/FUIHelper";
import LlkNodeData from "../model/llk/LlkNodeData";

/**
 * 连连看节点Item
 */
export default class AirGardenGameLLKItem extends FUI_AirGardenGameLLKItem {
  private _nodeData: LlkNodeData;
  public static WIDTH: number = 44;
  public static HEIGHT: number = 44;

  protected onConstruct() {
    super.onConstruct();
    this.mcType.selectedIndex = 0;
    this.initView();
  }

  private initView() {
    this.refresh();
  }

  /**
   *播放消除动画
   */
  public play() {
    if (this._nodeData && this._nodeData.mcType > 0) {
      this.mcType.selectedIndex = this._nodeData.mcType;
      let mc: fgui.GMovieClip;
      switch (this._nodeData.mcType) {
        case 1: //横向
        case 2: //纵向
          mc = this.mc_2;
          break;
        case 3:
        case 4:
          mc = this.mc_0;
          break;
        case 5: //左下角
        case 6: //左上角
        case 7: //右上角
        case 8: //右下角
          mc = this.mc_1;
          break;
      }
      mc.playing = false;
      mc.setPlaySettings(
        0,
        -1,
        1,
        -1,
        Laya.Handler.create(this, () => {
          mc.playing = false;
          this.mcType.selectedIndex = 0;
        }),
      );
      mc.playing = true;
      this._nodeData.mcType = 0;
    }
  }

  private refresh() {
    if (this._nodeData) {
      this.nodeBg.visible = this._nodeData.val > 0;
      this.goodIcon.visible = this._nodeData.val > 0;
    } else {
      this.nodeBg.visible = false;
      this.goodIcon.visible = false;
    }
  }

  public get NodeData(): LlkNodeData {
    return this._nodeData;
  }

  public set NodeData(value: LlkNodeData) {
    if (!value) return;
    this._nodeData = value;
    this.txt_mcType.text = this._nodeData.mcType.toString();
    if (this._nodeData.val > 0) {
      this.goodIcon.url = FUIHelper.getItemURL(
        "Carnival",
        "asset.llk.nodeIcon_" + this._nodeData.val,
      );
    } else {
      this.goodIcon.url = null;
    }
    this.nodeBg.visible = true;
    this.refresh();
  }

  public set selected(value: boolean) {
    if (value) {
      this.selectCtrl.selectedIndex = 1;
    } else {
      this.selectCtrl.selectedIndex = 0;
    }
  }
}
