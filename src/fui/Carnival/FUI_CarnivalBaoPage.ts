/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_CarnivalBaoPage extends fgui.GComponent {

	public Img_LuckyDraw:fgui.GLoader;
	public Img_Txt_LuckyDraw:fgui.GLoader;
	public moveComponet:fgui.GComponent;
	public bao1StartBtn:fgui.GButton;
	public bao10StartBtn:fgui.GButton;
	public leftCC:fgui.GGraph;
	public rightCC:fgui.GGraph;
	public arr_down:fgui.GImage;
	public arr_up:fgui.GImage;
	public txt_BaoNum:fgui.GTextField;
	public txt_rules:fgui.GTextField;
	public gameGroup:fgui.GGroup;
	public static URL:string = "ui://qvbm8hnzpf9kgh";

	public static createInstance():FUI_CarnivalBaoPage {
		return <FUI_CarnivalBaoPage>(fgui.UIPackage.createObject("Carnival", "CarnivalBaoPage"));
	}

	protected onConstruct():void {
		this.Img_LuckyDraw = <fgui.GLoader>(this.getChild("Img_LuckyDraw"));
		this.Img_Txt_LuckyDraw = <fgui.GLoader>(this.getChild("Img_Txt_LuckyDraw"));
		this.moveComponet = <fgui.GComponent>(this.getChild("moveComponet"));
		this.bao1StartBtn = <fgui.GButton>(this.getChild("bao1StartBtn"));
		this.bao10StartBtn = <fgui.GButton>(this.getChild("bao10StartBtn"));
		this.leftCC = <fgui.GGraph>(this.getChild("leftCC"));
		this.rightCC = <fgui.GGraph>(this.getChild("rightCC"));
		this.arr_down = <fgui.GImage>(this.getChild("arr_down"));
		this.arr_up = <fgui.GImage>(this.getChild("arr_up"));
		this.txt_BaoNum = <fgui.GTextField>(this.getChild("txt_BaoNum"));
		this.txt_rules = <fgui.GTextField>(this.getChild("txt_rules"));
		this.gameGroup = <fgui.GGroup>(this.getChild("gameGroup"));
	}
}