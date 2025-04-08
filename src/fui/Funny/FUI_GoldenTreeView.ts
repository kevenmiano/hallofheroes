/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_BottleIntergalBox from "./FUI_BottleIntergalBox";
import FUI_ComSacredGoldTree from "./FUI_ComSacredGoldTree";
import FUI_BottleBottomIntergalBox from "./FUI_BottleBottomIntergalBox";

export default class FUI_GoldenTreeView extends fgui.GComponent {

	public txt_currentCount:fgui.GRichTextField;
	public progress_floor:fgui.GProgressBar;
	public box5:FUI_BottleIntergalBox;
	public box4:FUI_BottleIntergalBox;
	public box3:FUI_BottleIntergalBox;
	public box2:FUI_BottleIntergalBox;
	public box1:FUI_BottleIntergalBox;
	public _helpBtn:fgui.GButton;
	public _fallItemsBtn:fgui.GButton;
	public _recordBtn:fgui.GButton;
	public effect_tree:FUI_ComSacredGoldTree;
	public txt_remainTime:fgui.GTextField;
	public txt_currOpenNum:fgui.GRichTextField;
	public item:fgui.GButton;
	public _checkBtn:fgui.GButton;
	public _openBtn1:fgui.GButton;
	public _openBtn2:fgui.GButton;
	public _openBtn3:fgui.GButton;
	public txt_openCost1:fgui.GTextField;
	public txt_openCost2:fgui.GTextField;
	public txt_openCost3:fgui.GTextField;
	public pro_currOpenNum:fgui.GProgressBar;
	public bottomIntergalBox1:FUI_BottleBottomIntergalBox;
	public bottomIntergalBox2:FUI_BottleBottomIntergalBox;
	public bottomIntergalBox3:FUI_BottleBottomIntergalBox;
	public bottomIntergalBox4:FUI_BottleBottomIntergalBox;
	public bottomIntergalBox5:FUI_BottleBottomIntergalBox;
	public static URL:string = "ui://lzu8jcp2jb9sicm";

	public static createInstance():FUI_GoldenTreeView {
		return <FUI_GoldenTreeView>(fgui.UIPackage.createObject("Funny", "GoldenTreeView"));
	}

	protected onConstruct():void {
		this.txt_currentCount = <fgui.GRichTextField>(this.getChild("txt_currentCount"));
		this.progress_floor = <fgui.GProgressBar>(this.getChild("progress_floor"));
		this.box5 = <FUI_BottleIntergalBox>(this.getChild("box5"));
		this.box4 = <FUI_BottleIntergalBox>(this.getChild("box4"));
		this.box3 = <FUI_BottleIntergalBox>(this.getChild("box3"));
		this.box2 = <FUI_BottleIntergalBox>(this.getChild("box2"));
		this.box1 = <FUI_BottleIntergalBox>(this.getChild("box1"));
		this._helpBtn = <fgui.GButton>(this.getChild("_helpBtn"));
		this._fallItemsBtn = <fgui.GButton>(this.getChild("_fallItemsBtn"));
		this._recordBtn = <fgui.GButton>(this.getChild("_recordBtn"));
		this.effect_tree = <FUI_ComSacredGoldTree>(this.getChild("effect_tree"));
		this.txt_remainTime = <fgui.GTextField>(this.getChild("txt_remainTime"));
		this.txt_currOpenNum = <fgui.GRichTextField>(this.getChild("txt_currOpenNum"));
		this.item = <fgui.GButton>(this.getChild("item"));
		this._checkBtn = <fgui.GButton>(this.getChild("_checkBtn"));
		this._openBtn1 = <fgui.GButton>(this.getChild("_openBtn1"));
		this._openBtn2 = <fgui.GButton>(this.getChild("_openBtn2"));
		this._openBtn3 = <fgui.GButton>(this.getChild("_openBtn3"));
		this.txt_openCost1 = <fgui.GTextField>(this.getChild("txt_openCost1"));
		this.txt_openCost2 = <fgui.GTextField>(this.getChild("txt_openCost2"));
		this.txt_openCost3 = <fgui.GTextField>(this.getChild("txt_openCost3"));
		this.pro_currOpenNum = <fgui.GProgressBar>(this.getChild("pro_currOpenNum"));
		this.bottomIntergalBox1 = <FUI_BottleBottomIntergalBox>(this.getChild("bottomIntergalBox1"));
		this.bottomIntergalBox2 = <FUI_BottleBottomIntergalBox>(this.getChild("bottomIntergalBox2"));
		this.bottomIntergalBox3 = <FUI_BottleBottomIntergalBox>(this.getChild("bottomIntergalBox3"));
		this.bottomIntergalBox4 = <FUI_BottleBottomIntergalBox>(this.getChild("bottomIntergalBox4"));
		this.bottomIntergalBox5 = <FUI_BottleBottomIntergalBox>(this.getChild("bottomIntergalBox5"));
	}
}