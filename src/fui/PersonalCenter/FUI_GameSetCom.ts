/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_ButtonSwitch from "./FUI_ButtonSwitch";

export default class FUI_GameSetCom extends fgui.GComponent {
  public img0: fgui.GImage;
  public img1: fgui.GImage;
  public img2: fgui.GImage;
  public btn_frame: FUI_ButtonSwitch;
  public t0: fgui.GTextField;
  public t2: fgui.GRichTextField;
  public picsetting: fgui.GGroup;
  public img3: fgui.GImage;
  public img4: fgui.GImage;
  public img5: fgui.GImage;
  public t1: fgui.GTextField;
  public supertitle: fgui.GGroup;
  public list: fgui.GList;
  public supersetting: fgui.GGroup;
  public t3: fgui.GTextField;
  public pushtitle: fgui.GGroup;
  public list1: fgui.GList;
  public pushsetting: fgui.GGroup;
  public mainGroup: fgui.GGroup;
  public static URL: string = "ui://6watmcoibkwqx";

  public static createInstance(): FUI_GameSetCom {
    return <FUI_GameSetCom>(
      fgui.UIPackage.createObject("PersonalCenter", "GameSetCom")
    );
  }

  protected onConstruct(): void {
    this.img0 = <fgui.GImage>this.getChild("img0");
    this.img1 = <fgui.GImage>this.getChild("img1");
    this.img2 = <fgui.GImage>this.getChild("img2");
    this.btn_frame = <FUI_ButtonSwitch>this.getChild("btn_frame");
    this.t0 = <fgui.GTextField>this.getChild("t0");
    this.t2 = <fgui.GRichTextField>this.getChild("t2");
    this.picsetting = <fgui.GGroup>this.getChild("picsetting");
    this.img3 = <fgui.GImage>this.getChild("img3");
    this.img4 = <fgui.GImage>this.getChild("img4");
    this.img5 = <fgui.GImage>this.getChild("img5");
    this.t1 = <fgui.GTextField>this.getChild("t1");
    this.supertitle = <fgui.GGroup>this.getChild("supertitle");
    this.list = <fgui.GList>this.getChild("list");
    this.supersetting = <fgui.GGroup>this.getChild("supersetting");
    this.t3 = <fgui.GTextField>this.getChild("t3");
    this.pushtitle = <fgui.GGroup>this.getChild("pushtitle");
    this.list1 = <fgui.GList>this.getChild("list1");
    this.pushsetting = <fgui.GGroup>this.getChild("pushsetting");
    this.mainGroup = <fgui.GGroup>this.getChild("mainGroup");
  }
}
