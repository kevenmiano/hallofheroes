/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_AccountItem from "./FUI_AccountItem";

export default class FUI_RecordList extends fgui.GComponent {
  public recentLoginTxt: fgui.GRichTextField;

  //@ts-expect-error: External dependencies
  public group: fgui.GGroup;
  public N8: fgui.GImage;
  public allLoginTxt: fgui.GRichTextField;
  public groupAll: fgui.GGroup;
  public allAccountList: fgui.GList;
  public lastLoginItem: FUI_AccountItem;
  public static URL: string = "ui://2ydb9fb2hdht46";

  public static createInstance(): FUI_RecordList {
    return <FUI_RecordList>fgui.UIPackage.createObject("Login", "RecordList");
  }

  protected onConstruct(): void {
    this.recentLoginTxt = <fgui.GRichTextField>this.getChild("recentLoginTxt");
    this.group = <fgui.GGroup>this.getChild("group");
    this.N8 = <fgui.GImage>this.getChild("N8");
    this.allLoginTxt = <fgui.GRichTextField>this.getChild("allLoginTxt");
    this.groupAll = <fgui.GGroup>this.getChild("groupAll");
    this.allAccountList = <fgui.GList>this.getChild("allAccountList");
    this.lastLoginItem = <FUI_AccountItem>this.getChild("lastLoginItem");
  }
}
