/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_VoiceMsgCell extends fgui.GComponent {

	public chatControl:fgui.Controller;
	public headIcon:fgui.GButton;
	public chatCahnnelImg0:fgui.GLoader;
	public appellIcon:fgui.GLoader;
	public appellTxt:fgui.GTextField;
	public vipImg0:fgui.GLoader;
	public userName0:fgui.GRichTextField;
	public infoSelf:fgui.GGroup;
	public chatCahnnelImg1:fgui.GLoader;
	public vipImg1:fgui.GLoader;
	public userName1:fgui.GRichTextField;
	public infoGroup1:fgui.GGroup;
	public levelbg:fgui.GImage;
	public userLevel:fgui.GTextField;
	public levelGroup:fgui.GGroup;
	public txt_curTime:fgui.GRichTextField;
	public msgbgelse:fgui.GImage;
	public img_voicebgL:fgui.GImage;
	public clickRectL:fgui.GComponent;
	public txt_secL:fgui.GRichTextField;
	public groupL:fgui.GGroup;
	public msgbgself:fgui.GImage;
	public img_voicebgR:fgui.GImage;
	public clickRectR:fgui.GComponent;
	public txt_secR:fgui.GRichTextField;
	public groupR:fgui.GGroup;
	public redpoint:fgui.GImage;
	public static URL:string = "ui://5w3rpk77ueyl1cj";

	public static createInstance():FUI_VoiceMsgCell {
		return <FUI_VoiceMsgCell>(fgui.UIPackage.createObject("Chat", "VoiceMsgCell"));
	}

	protected onConstruct():void {
		this.chatControl = this.getController("chatControl");
		this.headIcon = <fgui.GButton>(this.getChild("headIcon"));
		this.chatCahnnelImg0 = <fgui.GLoader>(this.getChild("chatCahnnelImg0"));
		this.appellIcon = <fgui.GLoader>(this.getChild("appellIcon"));
		this.appellTxt = <fgui.GTextField>(this.getChild("appellTxt"));
		this.vipImg0 = <fgui.GLoader>(this.getChild("vipImg0"));
		this.userName0 = <fgui.GRichTextField>(this.getChild("userName0"));
		this.infoSelf = <fgui.GGroup>(this.getChild("infoSelf"));
		this.chatCahnnelImg1 = <fgui.GLoader>(this.getChild("chatCahnnelImg1"));
		this.vipImg1 = <fgui.GLoader>(this.getChild("vipImg1"));
		this.userName1 = <fgui.GRichTextField>(this.getChild("userName1"));
		this.infoGroup1 = <fgui.GGroup>(this.getChild("infoGroup1"));
		this.levelbg = <fgui.GImage>(this.getChild("levelbg"));
		this.userLevel = <fgui.GTextField>(this.getChild("userLevel"));
		this.levelGroup = <fgui.GGroup>(this.getChild("levelGroup"));
		this.txt_curTime = <fgui.GRichTextField>(this.getChild("txt_curTime"));
		this.msgbgelse = <fgui.GImage>(this.getChild("msgbgelse"));
		this.img_voicebgL = <fgui.GImage>(this.getChild("img_voicebgL"));
		this.clickRectL = <fgui.GComponent>(this.getChild("clickRectL"));
		this.txt_secL = <fgui.GRichTextField>(this.getChild("txt_secL"));
		this.groupL = <fgui.GGroup>(this.getChild("groupL"));
		this.msgbgself = <fgui.GImage>(this.getChild("msgbgself"));
		this.img_voicebgR = <fgui.GImage>(this.getChild("img_voicebgR"));
		this.clickRectR = <fgui.GComponent>(this.getChild("clickRectR"));
		this.txt_secR = <fgui.GRichTextField>(this.getChild("txt_secR"));
		this.groupR = <fgui.GGroup>(this.getChild("groupR"));
		this.redpoint = <fgui.GImage>(this.getChild("redpoint"));
	}
}