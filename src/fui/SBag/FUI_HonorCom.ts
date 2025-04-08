// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_AttrItem from "./FUI_AttrItem";
import FUI_rankItem from "./FUI_rankItem";

export default class FUI_HonorCom extends fgui.GComponent {

	public pageCtrl:fgui.Controller;
	public c2:fgui.Controller;
	public c3:fgui.Controller;
	public tab:fgui.GList;
	public txt1:fgui.GTextField;
	public txt2:fgui.GTextField;
	public txt3:fgui.GTextField;
	public tipItem2:fgui.GButton;
	public txt_cost:fgui.GTextField;
	public btn_levelUp:fgui.GButton;
	public tipItem1:fgui.GButton;
	public txt_gold:fgui.GTextField;
	public txtLv0:fgui.GTextField;
	public txtLv1:fgui.GTextField;
	public attrItem0:FUI_AttrItem;
	public attrItem1:FUI_AttrItem;
	public attrItem2:FUI_AttrItem;
	public attrItem3:FUI_AttrItem;
	public attrItem4:FUI_AttrItem;
	public attrItem5:FUI_AttrItem;
	public attrItem6:FUI_AttrItem;
	public txt4:fgui.GTextField;
	public g0:fgui.GGroup;
	public txt5:fgui.GTextField;
	public attr_item0:FUI_AttrItem;
	public attr_item1:FUI_AttrItem;
	public txt6:fgui.GTextField;
	public helpBtn:fgui.GButton;
	public item0:FUI_rankItem;
	public item1:FUI_rankItem;
	public bar:fgui.GProgressBar;
	public txt8:fgui.GTextField;
	public btn_gradeUp:fgui.GButton;
	public txt7:fgui.GTextField;
	public g1:fgui.GGroup;
	public static URL:string = "ui://6fvk31suj4xaehirh";

	public static createInstance():FUI_HonorCom {
		return <FUI_HonorCom>(fgui.UIPackage.createObject("SBag", "HonorCom"));
	}

	protected onConstruct():void {
		this.pageCtrl = this.getController("pageCtrl");
		this.c2 = this.getController("c2");
		this.c3 = this.getController("c3");
		this.tab = <fgui.GList>(this.getChild("tab"));
		this.txt1 = <fgui.GTextField>(this.getChild("txt1"));
		this.txt2 = <fgui.GTextField>(this.getChild("txt2"));
		this.txt3 = <fgui.GTextField>(this.getChild("txt3"));
		this.tipItem2 = <fgui.GButton>(this.getChild("tipItem2"));
		this.txt_cost = <fgui.GTextField>(this.getChild("txt_cost"));
		this.btn_levelUp = <fgui.GButton>(this.getChild("btn_levelUp"));
		this.tipItem1 = <fgui.GButton>(this.getChild("tipItem1"));
		this.txt_gold = <fgui.GTextField>(this.getChild("txt_gold"));
		this.txtLv0 = <fgui.GTextField>(this.getChild("txtLv0"));
		this.txtLv1 = <fgui.GTextField>(this.getChild("txtLv1"));
		this.attrItem0 = <FUI_AttrItem>(this.getChild("attrItem0"));
		this.attrItem1 = <FUI_AttrItem>(this.getChild("attrItem1"));
		this.attrItem2 = <FUI_AttrItem>(this.getChild("attrItem2"));
		this.attrItem3 = <FUI_AttrItem>(this.getChild("attrItem3"));
		this.attrItem4 = <FUI_AttrItem>(this.getChild("attrItem4"));
		this.attrItem5 = <FUI_AttrItem>(this.getChild("attrItem5"));
		this.attrItem6 = <FUI_AttrItem>(this.getChild("attrItem6"));
		this.txt4 = <fgui.GTextField>(this.getChild("txt4"));
		this.g0 = <fgui.GGroup>(this.getChild("g0"));
		this.txt5 = <fgui.GTextField>(this.getChild("txt5"));
		this.attr_item0 = <FUI_AttrItem>(this.getChild("attr_item0"));
		this.attr_item1 = <FUI_AttrItem>(this.getChild("attr_item1"));
		this.txt6 = <fgui.GTextField>(this.getChild("txt6"));
		this.helpBtn = <fgui.GButton>(this.getChild("helpBtn"));
		this.item0 = <FUI_rankItem>(this.getChild("item0"));
		this.item1 = <FUI_rankItem>(this.getChild("item1"));
		this.bar = <fgui.GProgressBar>(this.getChild("bar"));
		this.txt8 = <fgui.GTextField>(this.getChild("txt8"));
		this.btn_gradeUp = <fgui.GButton>(this.getChild("btn_gradeUp"));
		this.txt7 = <fgui.GTextField>(this.getChild("txt7"));
		this.g1 = <fgui.GGroup>(this.getChild("g1"));
	}
}