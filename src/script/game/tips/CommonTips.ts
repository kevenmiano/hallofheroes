import BaseTips from "./BaseTips";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/13 21:27
 * @ver 1.0
 *
 */
export class CommonTips extends BaseTips {
  public img_bg: fgui.GImage;
  public txt_content_copy: fgui.GRichTextField;
  public txt_content: fgui.GRichTextField;

  private _content: string = "";

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this._content = this.params[0];
    this.txt_content_copy.text = this._content;
    if (this.txt_content_copy.width >= this.txt_content.maxWidth) {
      //超出最大宽度, 更改适配方式
      this.txt_content.autoSize = 2;
      this.txt_content.width = this.txt_content.maxWidth;
    } else {
      this.txt_content.autoSize = 1;
    }
    this.txt_content.text = this._content;
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
