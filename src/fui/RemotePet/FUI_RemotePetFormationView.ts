// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RemotePetFormationItemView from "./FUI_RemotePetFormationItemView";

export default class FUI_RemotePetFormationView extends fgui.GComponent {

	public p0:FUI_RemotePetFormationItemView;
	public p1:FUI_RemotePetFormationItemView;
	public p2:FUI_RemotePetFormationItemView;
	public p3:FUI_RemotePetFormationItemView;
	public p4:FUI_RemotePetFormationItemView;
	public p5:FUI_RemotePetFormationItemView;
	public static URL:string = "ui://dq4xsyl36mxo1e";

	public static createInstance():FUI_RemotePetFormationView {
		return <FUI_RemotePetFormationView>(fgui.UIPackage.createObject("RemotePet", "RemotePetFormationView"));
	}

	protected onConstruct():void {
		this.p0 = <FUI_RemotePetFormationItemView>(this.getChild("p0"));
		this.p1 = <FUI_RemotePetFormationItemView>(this.getChild("p1"));
		this.p2 = <FUI_RemotePetFormationItemView>(this.getChild("p2"));
		this.p3 = <FUI_RemotePetFormationItemView>(this.getChild("p3"));
		this.p4 = <FUI_RemotePetFormationItemView>(this.getChild("p4"));
		this.p5 = <FUI_RemotePetFormationItemView>(this.getChild("p5"));
	}
}