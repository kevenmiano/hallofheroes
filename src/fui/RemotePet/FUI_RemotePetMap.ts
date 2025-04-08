// @ts-nocheck
/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

import FUI_RemotePetTurnInfoItemView from "./FUI_RemotePetTurnInfoItemView";

export default class FUI_RemotePetMap extends fgui.GComponent {

	public mapCtrl:fgui.Controller;
	public bg01:fgui.GImage;
	public bg02:fgui.GImage;
	public cbg:fgui.GGroup;
	public _map:fgui.GLoader;
	public _line1:fgui.GImage;
	public _line2:fgui.GImage;
	public curLevelLab:fgui.GTextField;
	public rewatdTips:fgui.GTextField;
	public _curLvText:fgui.GTextField;
	public _maxLvText:fgui.GTextField;
	public _curLvNum:fgui.GTextField;
	public _maxLvNum:fgui.GTextField;
	public _btnReward:fgui.GButton;
	public fgoodsList:fgui.GList;
	public t1:FUI_RemotePetTurnInfoItemView;
	public t2:FUI_RemotePetTurnInfoItemView;
	public t3:FUI_RemotePetTurnInfoItemView;
	public t4:FUI_RemotePetTurnInfoItemView;
	public t5:FUI_RemotePetTurnInfoItemView;
	public t6:FUI_RemotePetTurnInfoItemView;
	public t7:FUI_RemotePetTurnInfoItemView;
	public t8:FUI_RemotePetTurnInfoItemView;
	public t9:FUI_RemotePetTurnInfoItemView;
	public t10:FUI_RemotePetTurnInfoItemView;
	public t11:FUI_RemotePetTurnInfoItemView;
	public t12:FUI_RemotePetTurnInfoItemView;
	public t13:FUI_RemotePetTurnInfoItemView;
	public t14:FUI_RemotePetTurnInfoItemView;
	public t15:FUI_RemotePetTurnInfoItemView;
	public static URL:string = "ui://dq4xsyl3h0f629";

	public static createInstance():FUI_RemotePetMap {
		return <FUI_RemotePetMap>(fgui.UIPackage.createObject("RemotePet", "RemotePetMap"));
	}

	protected onConstruct():void {
		this.mapCtrl = this.getController("mapCtrl");
		this.bg01 = <fgui.GImage>(this.getChild("bg01"));
		this.bg02 = <fgui.GImage>(this.getChild("bg02"));
		this.cbg = <fgui.GGroup>(this.getChild("cbg"));
		this._map = <fgui.GLoader>(this.getChild("_map"));
		this._line1 = <fgui.GImage>(this.getChild("_line1"));
		this._line2 = <fgui.GImage>(this.getChild("_line2"));
		this.curLevelLab = <fgui.GTextField>(this.getChild("curLevelLab"));
		this.rewatdTips = <fgui.GTextField>(this.getChild("rewatdTips"));
		this._curLvText = <fgui.GTextField>(this.getChild("_curLvText"));
		this._maxLvText = <fgui.GTextField>(this.getChild("_maxLvText"));
		this._curLvNum = <fgui.GTextField>(this.getChild("_curLvNum"));
		this._maxLvNum = <fgui.GTextField>(this.getChild("_maxLvNum"));
		this._btnReward = <fgui.GButton>(this.getChild("_btnReward"));
		this.fgoodsList = <fgui.GList>(this.getChild("fgoodsList"));
		this.t1 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t1"));
		this.t2 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t2"));
		this.t3 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t3"));
		this.t4 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t4"));
		this.t5 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t5"));
		this.t6 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t6"));
		this.t7 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t7"));
		this.t8 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t8"));
		this.t9 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t9"));
		this.t10 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t10"));
		this.t11 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t11"));
		this.t12 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t12"));
		this.t13 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t13"));
		this.t14 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t14"));
		this.t15 = <FUI_RemotePetTurnInfoItemView>(this.getChild("t15"));
	}
}