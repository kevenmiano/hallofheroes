/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_scollText from "./FUI_scollText";
import FUI_VipTitle from "./FUI_VipTitle";

export default class FUI_VipPrivilegeItem extends fgui.GComponent {

	public vipLevel:fgui.GTextField;
	public vipPro:fgui.GTextField;
	public vipDes:FUI_scollText;
	public vipDayGift:FUI_VipTitle;
	public vipWelfare:FUI_VipTitle;
	public vipProGift:FUI_VipTitle;
	public static URL:string = "ui://qcwdul6nqsyf1e";

	public static createInstance():FUI_VipPrivilegeItem {
		return <FUI_VipPrivilegeItem>(fgui.UIPackage.createObject("Shop", "VipPrivilegeItem"));
	}

	protected onConstruct():void {
		this.vipLevel = <fgui.GTextField>(this.getChild("vipLevel"));
		this.vipPro = <fgui.GTextField>(this.getChild("vipPro"));
		this.vipDes = <FUI_scollText>(this.getChild("vipDes"));
		this.vipDayGift = <FUI_VipTitle>(this.getChild("vipDayGift"));
		this.vipWelfare = <FUI_VipTitle>(this.getChild("vipWelfare"));
		this.vipProGift = <FUI_VipTitle>(this.getChild("vipProGift"));
	}
}