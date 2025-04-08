/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_GemMazeRankItem extends fgui.GComponent {

	public rankIcon:fgui.GLoader;
	public txt_rank:fgui.GTextField;
	public txt_name:fgui.GTextField;
	public txt_reward:fgui.GTextField;
	public txt_lv:fgui.GTextField;
	public txt_point:fgui.GTextField;
	public static URL:string = "ui://iwrz1divbo8xl";

	public static createInstance():FUI_GemMazeRankItem {
		return <FUI_GemMazeRankItem>(fgui.UIPackage.createObject("GemMaze", "GemMazeRankItem"));
	}

	protected onConstruct():void {
		this.rankIcon = <fgui.GLoader>(this.getChild("rankIcon"));
		this.txt_rank = <fgui.GTextField>(this.getChild("txt_rank"));
		this.txt_name = <fgui.GTextField>(this.getChild("txt_name"));
		this.txt_reward = <fgui.GTextField>(this.getChild("txt_reward"));
		this.txt_lv = <fgui.GTextField>(this.getChild("txt_lv"));
		this.txt_point = <fgui.GTextField>(this.getChild("txt_point"));
	}
}