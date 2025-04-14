import BaseTips from "./BaseTips";

/**
 * 属性对比提示
 */
export class PropertyCompareTips extends BaseTips {
  private pGroup: fgui.GGroup;
  private p1: fgui.GComponent; //其他人
  private p2: fgui.GComponent; //自己

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    let tipsData = this.params[0];
    if (!tipsData) return;
    if (tipsData instanceof Array) {
      if (tipsData[0]) {
        this.p1.getChild("txt_content").text = tipsData[0].toString();
        this.p1.ensureBoundsCorrect();
      }
      if (tipsData[1]) {
        this.p2.getChild("txt_content").text = tipsData[1].toString();
        this.p2.ensureBoundsCorrect();
        this.p2.visible = true;
      } else {
        this.p2.visible = false;
      }
    } else {
      this.p1.getChild("txt_content").text = tipsData.toString();
      this.p1.ensureBoundsCorrect();
      this.p2.visible = false;
    }
    this.pGroup.ensureBoundsCorrect();
    this.contentPane.ensureBoundsCorrect();
  }

  protected onClickEvent() {
    this.onInitClick();
  }

  createModel() {
    super.createModel();
    this.modelMask.alpha = 0;
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  protected OnClickModal() {
    super.OnClickModal();
  }

  public OnHideWind() {
    super.OnHideWind();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
