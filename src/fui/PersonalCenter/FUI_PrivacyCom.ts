/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_PrivacyCom extends fgui.GComponent {
  public privateLInk: fgui.Controller;
  public list: fgui.GList;
  public btn_link0: fgui.GRichTextField;
  public btn_link1: fgui.GRichTextField;
  public btn_authorize: fgui.GButton;
  public tXt: fgui.GTextField;
  public static URL: string = "ui://6watmcoibkwq10";

  public static createInstance(): FUI_PrivacyCom {
    return <FUI_PrivacyCom>(
      fgui.UIPackage.createObject("PersonalCenter", "PrivacyCom")
    );
  }

  protected onConstruct(): void {
    this.privateLInk = this.getController("privateLInk");
    this.list = <fgui.GList>this.getChild("list");
    this.btn_link0 = <fgui.GRichTextField>this.getChild("btn_link0");
    this.btn_link1 = <fgui.GRichTextField>this.getChild("btn_link1");
    this.btn_authorize = <fgui.GButton>this.getChild("btn_authorize");
    this.tXt = <fgui.GTextField>this.getChild("tXt");
  }
}
