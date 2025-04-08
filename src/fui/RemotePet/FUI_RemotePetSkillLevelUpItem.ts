/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

export default class FUI_RemotePetSkillLevelUpItem extends fgui.GComponent {

	public bg:fgui.GImage;
	public talent:fgui.GImage;
	public _icon:fgui.GLoader;
	public bg2:fgui.GImage;
	public _skillName:fgui.GTextField;
	public _skillCountTxt:fgui.GTextField;
	public _skillType:fgui.GTextField;
	public _unlockedTxt:fgui.GTextField;
	public _unlockTxt:fgui.GTextField;
	public _skillDesc:fgui.GRichTextField;
	public _cdText:fgui.GTextField;
	public _skillCD:fgui.GTextField;
	public _cost:fgui.GTextField;
	public _getSkillCountTipTxt:fgui.GTextField;
	public static URL:string = "ui://dq4xsyl3uoxt24";

	public static createInstance():FUI_RemotePetSkillLevelUpItem {
		return <FUI_RemotePetSkillLevelUpItem>(fgui.UIPackage.createObject("RemotePet", "RemotePetSkillLevelUpItem"));
	}

	protected onConstruct():void {
		this.bg = <fgui.GImage>(this.getChild("bg"));
		this.talent = <fgui.GImage>(this.getChild("talent"));
		this._icon = <fgui.GLoader>(this.getChild("_icon"));
		this.bg2 = <fgui.GImage>(this.getChild("bg2"));
		this._skillName = <fgui.GTextField>(this.getChild("_skillName"));
		this._skillCountTxt = <fgui.GTextField>(this.getChild("_skillCountTxt"));
		this._skillType = <fgui.GTextField>(this.getChild("_skillType"));
		this._unlockedTxt = <fgui.GTextField>(this.getChild("_unlockedTxt"));
		this._unlockTxt = <fgui.GTextField>(this.getChild("_unlockTxt"));
		this._skillDesc = <fgui.GRichTextField>(this.getChild("_skillDesc"));
		this._cdText = <fgui.GTextField>(this.getChild("_cdText"));
		this._skillCD = <fgui.GTextField>(this.getChild("_skillCD"));
		this._cost = <fgui.GTextField>(this.getChild("_cost"));
		this._getSkillCountTipTxt = <fgui.GTextField>(this.getChild("_getSkillCountTipTxt"));
	}
}