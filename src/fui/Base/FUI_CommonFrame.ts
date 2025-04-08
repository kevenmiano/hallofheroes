/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_Btn_Common_2 from "./FUI_Btn_Common_2";
import FUI_CommonBtn from "./FUI_CommonBtn";

export default class FUI_CommonFrame extends fgui.GLabel {

	public cShowBg:fgui.Controller;
	public cShowTitleAni:fgui.Controller;
	public cShowHelpBtn:fgui.Controller;
	public phFixL:fgui.GGraph;
	public bg:fgui.GImage;
	public btnClose:FUI_Btn_Common_2;
	public gTitleBg:fgui.GGroup;
	public closeBtn:FUI_CommonBtn;
	public helpBtn:FUI_CommonBtn;
	public gTitle:fgui.GGroup;
	public static URL:string = "ui://og5jeos3129oeihy";

	public static createInstance():FUI_CommonFrame {
		return <FUI_CommonFrame>(fgui.UIPackage.createObject("Base", "CommonFrame"));
	}

	protected onConstruct():void {
		this.cShowBg = this.getController("cShowBg");
		this.cShowTitleAni = this.getController("cShowTitleAni");
		this.cShowHelpBtn = this.getController("cShowHelpBtn");
		this.phFixL = <fgui.GGraph>(this.getChild("phFixL"));
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.btnClose = <FUI_Btn_Common_2>(this.getChild("btnClose"));
		this.gTitleBg = <fgui.GGroup>(this.getChild("gTitleBg"));
		this.closeBtn = <FUI_CommonBtn>(this.getChild("closeBtn"));
		this.helpBtn = <FUI_CommonBtn>(this.getChild("helpBtn"));
		this.gTitle = <fgui.GGroup>(this.getChild("gTitle"));
	}
}