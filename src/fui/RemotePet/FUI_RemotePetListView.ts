/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RemotePetHeadItemView from "./FUI_RemotePetHeadItemView";
import FUI_RemotePetSkillsView from "./FUI_RemotePetSkillsView";

export default class FUI_RemotePetListView extends fgui.GComponent {
  public bg: fgui.GImage;
  public h1: FUI_RemotePetHeadItemView;
  public h2: FUI_RemotePetHeadItemView;
  public h3: FUI_RemotePetHeadItemView;
  public s1: FUI_RemotePetSkillsView;
  public s2: FUI_RemotePetSkillsView;
  public s3: FUI_RemotePetSkillsView;
  public petText: fgui.GTextField;
  public petNum: fgui.GTextField;
  public static URL: string = "ui://dq4xsyl3tllou";

  public static createInstance(): FUI_RemotePetListView {
    return <FUI_RemotePetListView>(
      fgui.UIPackage.createObject("RemotePet", "RemotePetListView")
    );
  }

  protected onConstruct(): void {
    this.bg = <fgui.GImage>this.getChild("bg");
    this.h1 = <FUI_RemotePetHeadItemView>this.getChild("h1");
    this.h2 = <FUI_RemotePetHeadItemView>this.getChild("h2");
    this.h3 = <FUI_RemotePetHeadItemView>this.getChild("h3");
    this.s1 = <FUI_RemotePetSkillsView>this.getChild("s1");
    this.s2 = <FUI_RemotePetSkillsView>this.getChild("s2");
    this.s3 = <FUI_RemotePetSkillsView>this.getChild("s3");
    this.petText = <fgui.GTextField>this.getChild("petText");
    this.petNum = <fgui.GTextField>this.getChild("petNum");
  }
}
