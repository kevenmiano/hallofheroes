//@ts-expect-error: External dependencies
import Utils from "../../../../../core/utils/Utils";
import FUIHelper from "../../../../utils/FUIHelper";

/**
 * @author:pzlricky
 * @data: 2021-11-04 19:58
 * @description ***
 */
export default class CampaignDialogOptionItem extends fgui.GComponent {
  private _option: fgui.GButton;
  private _type: number = 0;
  private _title: string = "";
  private _param: number = 0;

  private _mapId: number = 0;
  private _nodeId: number = 0;

  constructor($mapId: number, $nodeId: number, $title: string, $param: number) {
    super();
    this._mapId = $mapId;
    this._nodeId = $nodeId;
    this._title = $title;
    this._param = $param;
    this.initView();
    this.addEvent();
    Utils.setDrawCallOptimize(this);
  }

  private initView() {
    if (!this._option)
      this._option = fgui.UIPackage.createObject("Dialog", "Btn_2red").asButton;
    this.addChild(this._option);
    this._option.getChild("typeTxt").text = this._title;
    (this._option.getChild("typeIcon") as fgui.GLoader).url =
      FUIHelper.getItemURL("Dialog", "Btn_Eve_Amethyst");
    this._option.ensureBoundsCorrect();
    this.ensureBoundsCorrect();
    this.setSize(this._option.width, this._option.height);
  }

  private addEvent() {}

  private removeEvent() {}

  public get title(): string {
    return this._title;
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
