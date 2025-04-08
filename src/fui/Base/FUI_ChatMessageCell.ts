/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_ChatMessageCell extends fgui.GButton {

	public emoji:fgui.Controller;
	public messagebg:fgui.GImage;
	public channelIcon:fgui.GLoader;
	public textTxt:fgui.GRichTextField;
	public img_voicebgR:fgui.GImage;
	public txt_secR:fgui.GRichTextField;
	public voice:fgui.GGroup;
	public static URL:string = "ui://og5jeos3v66n5z";

	public static createInstance():FUI_ChatMessageCell {
		return <FUI_ChatMessageCell>(fgui.UIPackage.createObject("Base", "ChatMessageCell"));
	}

	protected onConstruct():void {
		this.emoji = this.getController("emoji");
		this.messagebg = <fgui.GImage>(this.getChild("messagebg"));
		this.channelIcon = <fgui.GLoader>(this.getChild("channelIcon"));
		this.textTxt = <fgui.GRichTextField>(this.getChild("textTxt"));
		this.img_voicebgR = <fgui.GImage>(this.getChild("img_voicebgR"));
		this.txt_secR = <fgui.GRichTextField>(this.getChild("txt_secR"));
		this.voice = <fgui.GGroup>(this.getChild("voice"));
	}
}