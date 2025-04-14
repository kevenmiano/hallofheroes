/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

//@ts-expect-error: External dependencies
import FUI_bgcom from "./FUI_bgcom";

//@ts-expect-error: External dependencies
import FUI_arrowCom from "./FUI_arrowCom";

//@ts-expect-error: External dependencies
import FUI_VoiceCom from "./FUI_VoiceCom";

export default class FUI_ChatBubbleTip extends fgui.GComponent {
  public c1: fgui.Controller;
  public img_bg: FUI_bgcom;
  public arrow: FUI_arrowCom;
  public txt_content: fgui.GRichTextField;
  public voiceCom: FUI_VoiceCom;
  public static URL: string = "ui://og5jeos3ofptidb";
  public static createInstance(): FUI_ChatBubbleTip {
    return <FUI_ChatBubbleTip>(
      fgui.UIPackage.createObject("Base", "ChatBubbleTip")
    );
  }

  protected onConstruct(): void {
    this.c1 = this.getController("c1");
    this.img_bg = <FUI_bgcom>this.getChild("img_bg");
    this.arrow = <FUI_arrowCom>this.getChild("arrow");
    this.txt_content = <fgui.GRichTextField>this.getChild("txt_content");
    this.voiceCom = <FUI_VoiceCom>this.getChild("voiceCom");
  }
}
