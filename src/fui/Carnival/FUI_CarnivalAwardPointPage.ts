/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_CarnivalInfoItem from "./FUI_CarnivalInfoItem";

export default class FUI_CarnivalAwardPointPage extends fgui.GComponent {
  public position: fgui.Controller;
  public list: fgui.GList;
  public list2: fgui.GList;
  public split_line: fgui.GGraph;
  public carnival_point: FUI_CarnivalInfoItem;
  public txt_describe: fgui.GRichTextField;
  public static URL: string = "ui://qvbm8hnzpf9kgm";

  public static createInstance(): FUI_CarnivalAwardPointPage {
    return <FUI_CarnivalAwardPointPage>(
      fgui.UIPackage.createObject("Carnival", "CarnivalAwardPointPage")
    );
  }

  protected onConstruct(): void {
    this.position = this.getController("position");
    this.list = <fgui.GList>this.getChild("list");
    this.list2 = <fgui.GList>this.getChild("list2");
    this.split_line = <fgui.GGraph>this.getChild("split_line");
    this.carnival_point = <FUI_CarnivalInfoItem>this.getChild("carnival_point");
    this.txt_describe = <fgui.GRichTextField>this.getChild("txt_describe");
  }
}
