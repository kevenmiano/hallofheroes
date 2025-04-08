// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RemotePetSkillItemView from "./FUI_RemotePetSkillItemView";
import FUI_PetDeleteBtn from "./FUI_PetDeleteBtn";

export default class FUI_RemotePetSkillsView extends fgui.GComponent {

	public s1:FUI_RemotePetSkillItemView;
	public s2:FUI_RemotePetSkillItemView;
	public s3:FUI_RemotePetSkillItemView;
	public delBtn:FUI_PetDeleteBtn;
	public static URL:string = "ui://dq4xsyl3tllow";

	public static createInstance():FUI_RemotePetSkillsView {
		return <FUI_RemotePetSkillsView>(fgui.UIPackage.createObject("RemotePet", "RemotePetSkillsView"));
	}

	protected onConstruct():void {
		this.s1 = <FUI_RemotePetSkillItemView>(this.getChild("s1"));
		this.s2 = <FUI_RemotePetSkillItemView>(this.getChild("s2"));
		this.s3 = <FUI_RemotePetSkillItemView>(this.getChild("s3"));
		this.delBtn = <FUI_PetDeleteBtn>(this.getChild("delBtn"));
	}
}