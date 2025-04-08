/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GvgAddMembersItem extends fgui.GComponent {
  public state: fgui.Controller;
  public _jobIcon: fgui.GLoader;
  public _vipIcon: fgui.GImage;
  public txt_name: fgui.GTextField;
  public txt_lv: fgui.GTextField;
  public txt_power: fgui.GTextField;
  public _addBtn: fgui.GButton;
  public static URL: string = "ui://8w3m5duwnbpgi8z";

  public static createInstance(): FUI_GvgAddMembersItem {
    return <FUI_GvgAddMembersItem>(
      fgui.UIPackage.createObject("Consortia", "GvgAddMembersItem")
    );
  }

  protected onConstruct(): void {
    this.state = this.getController("state");
    this._jobIcon = <fgui.GLoader>this.getChild("_jobIcon");
    this._vipIcon = <fgui.GImage>this.getChild("_vipIcon");
    this.txt_name = <fgui.GTextField>this.getChild("txt_name");
    this.txt_lv = <fgui.GTextField>this.getChild("txt_lv");
    this.txt_power = <fgui.GTextField>this.getChild("txt_power");
    this._addBtn = <fgui.GButton>this.getChild("_addBtn");
  }
}
