/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MessageCellInfo extends fgui.GComponent {

	public hasEmoji:fgui.Controller;
	public hasContent:fgui.Controller;
	public emojiIcon:fgui.GLoader;
	public content:fgui.GRichTextField;
	public group:fgui.GGroup;
	public static URL:string = "ui://og5jeos3n9eii3q";

	public static createInstance():FUI_MessageCellInfo {
		return <FUI_MessageCellInfo>(fgui.UIPackage.createObject("Base", "MessageCellInfo"));
	}

	protected onConstruct():void {
		this.hasEmoji = this.getController("hasEmoji");
		this.hasContent = this.getController("hasContent");
		this.emojiIcon = <fgui.GLoader>(this.getChild("emojiIcon"));
		this.content = <fgui.GRichTextField>(this.getChild("content"));
		this.group = <fgui.GGroup>(this.getChild("group"));
	}
}