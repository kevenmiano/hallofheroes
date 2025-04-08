// TODO FIX
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ChatTranslateBtn from "./FUI_ChatTranslateBtn";

export default class FUI_ChatMsgCell extends fgui.GComponent {
  public chatControl: fgui.Controller;
  public headIcon: fgui.GComponent;
  public img_textbg_R: fgui.GImage;
  public img_textbg_L: fgui.GImage;
  public tr_btn_R: FUI_ChatTranslateBtn;
  public tr_btn_L: FUI_ChatTranslateBtn;
  public img_ttrbg_R: fgui.GImage;
  public img_ttrbg_L: fgui.GImage;
  public consortiaName0: fgui.GTextField;
  public appellTxt0: fgui.GTextField;
  public userName0: fgui.GRichTextField;
  public infoSelf: fgui.GGroup;
  public consortiaName1: fgui.GTextField;
  public appellTxt1: fgui.GTextField;
  public userName1: fgui.GRichTextField;
  public infoGroup1: fgui.GGroup;
  public levelbg: fgui.GImage;
  public userLevel: fgui.GTextField;
  public levelGroup: fgui.GGroup;
  public txt_msg_L: fgui.GRichTextField;
  public txt_msg_R: fgui.GRichTextField;
  public txt_curTime: fgui.GRichTextField;
  public tr_msg_L: fgui.GRichTextField;
  public tr_msg_R: fgui.GRichTextField;
  public static URL: string = "ui://5w3rpk77v66n3l";

  public static createInstance(): FUI_ChatMsgCell {
    return <FUI_ChatMsgCell>fgui.UIPackage.createObject("Chat", "ChatMsgCell");
  }

  protected onConstruct(): void {
    this.chatControl = this.getController("chatControl");
    this.headIcon = <fgui.GComponent>this.getChild("headIcon");
    this.img_textbg_R = <fgui.GImage>this.getChild("img_textbg_R");
    this.img_textbg_L = <fgui.GImage>this.getChild("img_textbg_L");
    this.tr_btn_R = <FUI_ChatTranslateBtn>this.getChild("tr_btn_R");
    this.tr_btn_L = <FUI_ChatTranslateBtn>this.getChild("tr_btn_L");
    this.img_ttrbg_R = <fgui.GImage>this.getChild("img_ttrbg_R");
    this.img_ttrbg_L = <fgui.GImage>this.getChild("img_ttrbg_L");
    this.consortiaName0 = <fgui.GTextField>this.getChild("consortiaName0");
    this.appellTxt0 = <fgui.GTextField>this.getChild("appellTxt0");
    this.userName0 = <fgui.GRichTextField>this.getChild("userName0");
    this.infoSelf = <fgui.GGroup>this.getChild("infoSelf");
    this.consortiaName1 = <fgui.GTextField>this.getChild("consortiaName1");
    this.appellTxt1 = <fgui.GTextField>this.getChild("appellTxt1");
    this.userName1 = <fgui.GRichTextField>this.getChild("userName1");
    this.infoGroup1 = <fgui.GGroup>this.getChild("infoGroup1");
    this.levelbg = <fgui.GImage>this.getChild("levelbg");
    this.userLevel = <fgui.GTextField>this.getChild("userLevel");
    this.levelGroup = <fgui.GGroup>this.getChild("levelGroup");
    this.txt_msg_L = <fgui.GRichTextField>this.getChild("txt_msg_L");
    this.txt_msg_R = <fgui.GRichTextField>this.getChild("txt_msg_R");
    this.txt_curTime = <fgui.GRichTextField>this.getChild("txt_curTime");
    this.tr_msg_L = <fgui.GRichTextField>this.getChild("tr_msg_L");
    this.tr_msg_R = <fgui.GRichTextField>this.getChild("tr_msg_R");
  }
}
