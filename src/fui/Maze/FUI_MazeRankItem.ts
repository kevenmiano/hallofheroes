/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MazeRankItem extends fgui.GComponent {
  public Img_first: fgui.GImage;
  public Img_third: fgui.GImage;
  public Img_second: fgui.GImage;
  public RankValueTxt: fgui.GTextField;
  public UserNameTxt: fgui.GTextField;
  public LayerNumTxt: fgui.GTextField;
  public static URL: string = "ui://rzs7ldxjpxdei";

  public static createInstance(): FUI_MazeRankItem {
    return <FUI_MazeRankItem>(
      fgui.UIPackage.createObject("Maze", "MazeRankItem")
    );
  }

  protected onConstruct(): void {
    this.Img_first = <fgui.GImage>this.getChild("Img_first");
    this.Img_third = <fgui.GImage>this.getChild("Img_third");
    this.Img_second = <fgui.GImage>this.getChild("Img_second");
    this.RankValueTxt = <fgui.GTextField>this.getChild("RankValueTxt");
    this.UserNameTxt = <fgui.GTextField>this.getChild("UserNameTxt");
    this.LayerNumTxt = <fgui.GTextField>this.getChild("LayerNumTxt");
  }
}
