/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_ConsortiaActivityListView from "./FUI_ConsortiaActivityListView";
import FUI_ConsortiaMemberPage from "./FUI_ConsortiaMemberPage";

export default class FUI_ConsortiaActivityPage extends fgui.GComponent {

	public c1:fgui.Controller;
	public txtConsortiaLevel:fgui.GTextField;
	public txtConsortiaName:fgui.GTextField;
	public txtAnnouncement_:fgui.GTextField;
	public consortiaInfoTxt:fgui.GTextField;
	public renameBtn:fgui.GButton;
	public txtConsortChairman:fgui.GTextField;
	public txtConsortiaRank:fgui.GTextField;
	public txtConsortiaNum:fgui.GTextField;
	public txtConsortiaWealth:fgui.GTextField;
	public txtConsortiawuzi:fgui.GTextField;
	public txtConsortiaMaintain:fgui.GTextField;
	public txtConsortiaContribution:fgui.GTextField;
	public txtSelfJianse:fgui.GTextField;
	public donateBtn:fgui.GButton;
	public upgradeBtn:fgui.GButton;
	public extiConsortiaBtn:fgui.GButton;
	public activityListView:FUI_ConsortiaActivityListView;
	public impeachBtn:fgui.GButton;
	public changeBtn:fgui.GButton;
	public member:FUI_ConsortiaMemberPage;
	public static URL:string = "ui://8w3m5duwfszci87";

	public static createInstance():FUI_ConsortiaActivityPage {
		return <FUI_ConsortiaActivityPage>(fgui.UIPackage.createObject("Consortia", "ConsortiaActivityPage"));
	}

	protected onConstruct():void {
		this.c1 = this.getController("c1");
		this.txtConsortiaLevel = <fgui.GTextField>(this.getChild("txtConsortiaLevel"));
		this.txtConsortiaName = <fgui.GTextField>(this.getChild("txtConsortiaName"));
		this.txtAnnouncement_ = <fgui.GTextField>(this.getChild("txtAnnouncement "));
		this.consortiaInfoTxt = <fgui.GTextField>(this.getChild("consortiaInfoTxt"));
		this.renameBtn = <fgui.GButton>(this.getChild("renameBtn"));
		this.txtConsortChairman = <fgui.GTextField>(this.getChild("txtConsortChairman"));
		this.txtConsortiaRank = <fgui.GTextField>(this.getChild("txtConsortiaRank"));
		this.txtConsortiaNum = <fgui.GTextField>(this.getChild("txtConsortiaNum"));
		this.txtConsortiaWealth = <fgui.GTextField>(this.getChild("txtConsortiaWealth"));
		this.txtConsortiawuzi = <fgui.GTextField>(this.getChild("txtConsortiawuzi"));
		this.txtConsortiaMaintain = <fgui.GTextField>(this.getChild("txtConsortiaMaintain"));
		this.txtConsortiaContribution = <fgui.GTextField>(this.getChild("txtConsortiaContribution"));
		this.txtSelfJianse = <fgui.GTextField>(this.getChild("txtSelfJianse"));
		this.donateBtn = <fgui.GButton>(this.getChild("donateBtn"));
		this.upgradeBtn = <fgui.GButton>(this.getChild("upgradeBtn"));
		this.extiConsortiaBtn = <fgui.GButton>(this.getChild("extiConsortiaBtn"));
		this.activityListView = <FUI_ConsortiaActivityListView>(this.getChild("activityListView"));
		this.impeachBtn = <fgui.GButton>(this.getChild("impeachBtn"));
		this.changeBtn = <fgui.GButton>(this.getChild("changeBtn"));
		this.member = <FUI_ConsortiaMemberPage>(this.getChild("member"));
	}
}