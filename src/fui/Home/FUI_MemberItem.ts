/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_MemberItem extends fgui.GButton {

	public member:fgui.GButton;
	public static URL:string = "ui://tny43dz1o249pr";

	public static createInstance():FUI_MemberItem {
		return <FUI_MemberItem>(fgui.UIPackage.createObject("Home", "MemberItem"));
	}

	protected onConstruct():void {
		this.member = <fgui.GButton>(this.getChild("member"));
	}
}