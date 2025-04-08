/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalOnlinePageItem extends fgui.GComponent {
  public state: fgui.Controller;
  public ImgState: fgui.Controller;
  public Img_Bubble: fgui.GLoader;
  public Img_Bubble1: fgui.GImage;
  public Img_Title07: fgui.GLoader;
  public icon_fruit: fgui.GLoader;
  public btn_receive: fgui.GButton;
  public btn_unlock: fgui.GButton;
  public title: fgui.GRichTextField;
  public goodsList: fgui.GList;
  public static URL: string = "ui://qvbm8hnzpf9kgl";

  public static createInstance(): FUI_CarnivalOnlinePageItem {
    return <FUI_CarnivalOnlinePageItem>(
      fgui.UIPackage.createObject("Carnival", "CarnivalOnlinePageItem")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this.ImgState = this.getController("ImgState");
    this.Img_Bubble = <fgui.GLoader>this.getChild("Img_Bubble");
    this.Img_Bubble1 = <fgui.GImage>this.getChild("Img_Bubble1");
    this.Img_Title07 = <fgui.GLoader>this.getChild("Img_Title07");
    this.icon_fruit = <fgui.GLoader>this.getChild("icon_fruit");
    this.btn_receive = <fgui.GButton>this.getChild("btn_receive");
    this.btn_unlock = <fgui.GButton>this.getChild("btn_unlock");
    this.title = <fgui.GRichTextField>this.getChild("title");
    this.goodsList = <fgui.GList>this.getChild("goodsList");
  }
}
