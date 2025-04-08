/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ConsortiaMethodItem extends fgui.GComponent {
  public typeCtr: fgui.Controller;
  public redCtr: fgui.Controller;
  public enterBtn: fgui.GButton;
  public functionNameTxt: fgui.GRichTextField;
  public methodNameTxt: fgui.GRichTextField;
  public openTimeTxt: fgui.GRichTextField;
  public descTxt: fgui.GRichTextField;
  public operationBtn: fgui.GButton;
  public openDescTxt: fgui.GTextField;
  public redDot: fgui.GLoader;
  public static URL: string = "ui://8w3m5duwtib7idl";

  public static createInstance(): FUI_ConsortiaMethodItem {
    return <FUI_ConsortiaMethodItem>(
      fgui.UIPackage.createObject("Consortia", "ConsortiaMethodItem")
    );
  }

  protected onConstruct(): void {
    this.typeCtr = this.getController("typeCtr");
    this.redCtr = this.getController("redCtr");
    this.enterBtn = <fgui.GButton>this.getChild("enterBtn");
    this.functionNameTxt = <fgui.GRichTextField>(
      this.getChild("functionNameTxt")
    );
    this.methodNameTxt = <fgui.GRichTextField>this.getChild("methodNameTxt");
    this.openTimeTxt = <fgui.GRichTextField>this.getChild("openTimeTxt");
    this.descTxt = <fgui.GRichTextField>this.getChild("descTxt");
    this.operationBtn = <fgui.GButton>this.getChild("operationBtn");
    this.openDescTxt = <fgui.GTextField>this.getChild("openDescTxt");
    this.redDot = <fgui.GLoader>this.getChild("redDot");
  }
}
