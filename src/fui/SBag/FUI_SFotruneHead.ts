/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_SFotruneHead extends fgui.GButton {

	public expanded:fgui.Controller;
	public progress:fgui.GProgressBar;
	public skillIcon:fgui.GLoader;
	public txt_bar:fgui.GTextField;
	public fotruneName:fgui.GTextField;
	public levelLab:fgui.GTextField;
	public headGroup:fgui.GGroup;
	public tipItem:fgui.GButton;
	public peiYbtn:fgui.GButton;
	public buffDesc:fgui.GRichTextField;
	public nextBuffDesc:fgui.GRichTextField;
	public costTxt:fgui.GTextField;
	public costInput:fgui.GTextField;
	public fl:fgui.GImage;
	public maxTxt:fgui.GTextField;
	public fr:fgui.GImage;
	public maxTitle:fgui.GGroup;
	public newSkillLight:fgui.GTextField;
	public contentGroup:fgui.GGroup;
	public static URL:string = "ui://6fvk31suexm6hicj";

	public static createInstance():FUI_SFotruneHead {
		return <FUI_SFotruneHead>(fgui.UIPackage.createObject("SBag", "SFotruneHead"));
	}

	protected onConstruct():void {
		this.expanded = this.getController("expanded");
		this.progress = <fgui.GProgressBar>(this.getChild("progress"));
		this.skillIcon = <fgui.GLoader>(this.getChild("skillIcon"));
		this.txt_bar = <fgui.GTextField>(this.getChild("txt_bar"));
		this.fotruneName = <fgui.GTextField>(this.getChild("fotruneName"));
		this.levelLab = <fgui.GTextField>(this.getChild("levelLab"));
		this.headGroup = <fgui.GGroup>(this.getChild("headGroup"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.peiYbtn = <fgui.GButton>(this.getChild("peiYbtn"));
		this.buffDesc = <fgui.GRichTextField>(this.getChild("buffDesc"));
		this.nextBuffDesc = <fgui.GRichTextField>(this.getChild("nextBuffDesc"));
		this.costTxt = <fgui.GTextField>(this.getChild("costTxt"));
		this.costInput = <fgui.GTextField>(this.getChild("costInput"));
		this.fl = <fgui.GImage>(this.getChild("fl"));
		this.maxTxt = <fgui.GTextField>(this.getChild("maxTxt"));
		this.fr = <fgui.GImage>(this.getChild("fr"));
		this.maxTitle = <fgui.GGroup>(this.getChild("maxTitle"));
		this.newSkillLight = <fgui.GTextField>(this.getChild("newSkillLight"));
		this.contentGroup = <fgui.GGroup>(this.getChild("contentGroup"));
	}
}