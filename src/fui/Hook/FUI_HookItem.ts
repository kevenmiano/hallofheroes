/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_HookItem extends fgui.GComponent {

	public state:fgui.Controller;
	public itemBg:fgui.GImage;
	public tipItem:fgui.GButton;
	public receiveBtn:fgui.GButton;
	public getRewardBtn:fgui.GButton;
	public txt_time:fgui.GTextField;
	public txt_stamina:fgui.GTextField;
	public txt_unstart:fgui.GTextField;
	public txt_outime:fgui.GTextField;
	public static URL:string = "ui://rhq9ywvijpjk3";

	public static createInstance():FUI_HookItem {
		return <FUI_HookItem>(fgui.UIPackage.createObject("Hook", "HookItem"));
	}

	protected onConstruct():void {
		this.state = this.getController("state");
		this.itemBg = <fgui.GImage>(this.getChild("itemBg"));
		this.tipItem = <fgui.GButton>(this.getChild("tipItem"));
		this.receiveBtn = <fgui.GButton>(this.getChild("receiveBtn"));
		this.getRewardBtn = <fgui.GButton>(this.getChild("getRewardBtn"));
		this.txt_time = <fgui.GTextField>(this.getChild("txt_time"));
		this.txt_stamina = <fgui.GTextField>(this.getChild("txt_stamina"));
		this.txt_unstart = <fgui.GTextField>(this.getChild("txt_unstart"));
		this.txt_outime = <fgui.GTextField>(this.getChild("txt_outime"));
	}
}