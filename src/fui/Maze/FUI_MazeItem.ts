/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MazeItem extends fgui.GComponent {
  public cMazeOpt: fgui.Controller;
  public cOpen: fgui.Controller;
  public bg: fgui.GImage;
  public TitleTxt: fgui.GTextField;
  public SweepTipTxt: fgui.GTextField;
  public AbyssOpenTipTxt: fgui.GTextField;
  public MyRecordTxt: fgui.GTextField;
  public MyRecordValue: fgui.GTextField;
  public rg: fgui.GGroup;
  public DoubleProfit: fgui.GButton;
  public DoubleProfitTxt: fgui.GTextField;
  public groundDoubleProfitG: fgui.GGroup;
  public CurrentFloorTxt: fgui.GTextField;
  public CurrentFloorValue: fgui.GTextField;
  public cfg: fgui.GGroup;
  public TotalExpTxt: fgui.GTextField;
  public TotalExpValue: fgui.GTextField;
  public teg: fgui.GGroup;
  public Btn_Start: fgui.GButton;
  public Btn_MopupStart: fgui.GButton;
  public Btn_Continue: fgui.GButton;
  public Btn_MopupContinue: fgui.GButton;
  public Btn_Reset: fgui.GButton;
  public btng: fgui.GGroup;
  public bb: fgui.GImage;
  public TodayFreeCountTxt: fgui.GTextField;
  public TodayFreeCountValue: fgui.GTextField;
  public tfcg: fgui.GGroup;
  public static URL: string = "ui://rzs7ldxjeqhmo";

  public static createInstance(): FUI_MazeItem {
    return <FUI_MazeItem>fgui.UIPackage.createObject("Maze", "MazeItem");
  }

  protected onConstruct(): void {
    this.cMazeOpt = this.getController("cMazeOpt");
    this.cOpen = this.getController("cOpen");
    this.bg = <fgui.GImage>this.getChild("bg");
    this.TitleTxt = <fgui.GTextField>this.getChild("TitleTxt");
    this.SweepTipTxt = <fgui.GTextField>this.getChild("SweepTipTxt");
    this.AbyssOpenTipTxt = <fgui.GTextField>this.getChild("AbyssOpenTipTxt");
    this.MyRecordTxt = <fgui.GTextField>this.getChild("MyRecordTxt");
    this.MyRecordValue = <fgui.GTextField>this.getChild("MyRecordValue");
    this.rg = <fgui.GGroup>this.getChild("rg");
    this.DoubleProfit = <fgui.GButton>this.getChild("DoubleProfit");
    this.DoubleProfitTxt = <fgui.GTextField>this.getChild("DoubleProfitTxt");
    this.groundDoubleProfitG = <fgui.GGroup>(
      this.getChild("groundDoubleProfitG")
    );
    this.CurrentFloorTxt = <fgui.GTextField>this.getChild("CurrentFloorTxt");
    this.CurrentFloorValue = <fgui.GTextField>(
      this.getChild("CurrentFloorValue")
    );
    this.cfg = <fgui.GGroup>this.getChild("cfg");
    this.TotalExpTxt = <fgui.GTextField>this.getChild("TotalExpTxt");
    this.TotalExpValue = <fgui.GTextField>this.getChild("TotalExpValue");
    this.teg = <fgui.GGroup>this.getChild("teg");
    this.Btn_Start = <fgui.GButton>this.getChild("Btn_Start");
    this.Btn_MopupStart = <fgui.GButton>this.getChild("Btn_MopupStart");
    this.Btn_Continue = <fgui.GButton>this.getChild("Btn_Continue");
    this.Btn_MopupContinue = <fgui.GButton>this.getChild("Btn_MopupContinue");
    this.Btn_Reset = <fgui.GButton>this.getChild("Btn_Reset");
    this.btng = <fgui.GGroup>this.getChild("btng");
    this.bb = <fgui.GImage>this.getChild("bb");
    this.TodayFreeCountTxt = <fgui.GTextField>(
      this.getChild("TodayFreeCountTxt")
    );
    this.TodayFreeCountValue = <fgui.GTextField>(
      this.getChild("TodayFreeCountValue")
    );
    this.tfcg = <fgui.GGroup>this.getChild("tfcg");
  }
}
