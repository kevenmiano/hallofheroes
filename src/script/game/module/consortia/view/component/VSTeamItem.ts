import FUI_VSTeamItem from "../../../../../../fui/Consortia/FUI_VSTeamItem";
import { GuildGroupInfo } from "../../data/gvg/GuildGroupInfo";
import { EmWindow } from "../../../../constant/UIDefine";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/20 11:14
 * @ver 1.0
 */
export class VSTeamItem extends FUI_VSTeamItem {
  private _info: any;
  private _index: number;
  private _team01: GuildGroupInfo;
  private _team02: GuildGroupInfo;
  private _dayIndex: number;

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  get info(): any {
    return this._info;
  }

  set info(value: any) {
    this._info = value;

    this._team01 = value.team01;
    this._team02 = value.team02;
    this._index = value.index;
    this._dayIndex = value.day;
    this.initView();
  }

  setBg(index: number) {
    if (index % 2 == 0) {
      this.bg.icon = fgui.UIPackage.getItemURL(
        EmWindow.Consortia,
        "Img_GuildBattle_Bg1",
      );
    } else {
      this.bg.icon = fgui.UIPackage.getItemURL(
        EmWindow.Consortia,
        "Img_GuildBattle_Bg2",
      );
    }
  }

  private initView(): void {
    if (this._team01) {
      this._resultIcon01.url = this.getResultIcon(
        this._team01["result" + this._dayIndex] > 0,
      );
    }
    if (this._team02) {
      this._resultIcon02.url = this.getResultIcon(
        this._team02["result" + this._dayIndex] > 0,
      );
    }
    if (this._team01) {
      this._teamTxt01.text = this._team01.consortiaName
        ? this._team01.consortiaName
        : "";
      this._teamTxt01.color =
        this._team01["result" + this._dayIndex] > 0 ? "#FFF3D3" : "#D3F9FF";
      this._teamTxt01.stroke =
        this._team01["result" + this._dayIndex] > 0 ? 1 : 2;
      this._teamTxt01.strokeColor =
        this._team01["result" + this._dayIndex] > 0 ? "#FF7E00" : "#009CFF";
    }
    if (this._team02) {
      this._teamTxt02.text = this._team02.consortiaName
        ? this._team02.consortiaName
        : "";
      this._teamTxt02.color =
        this._team02["result" + this._dayIndex] > 0 ? "#FFF3D3" : "#D3F9FF";
      this._teamTxt02.stroke =
        this._team02["result" + this._dayIndex] > 0 ? 1 : 2;
      this._teamTxt02.strokeColor =
        this._team02["result" + this._dayIndex] > 0 ? "#FF7E00" : "#009CFF";
    }
    let num: number = 0;
    if (this._team01) {
      num = Number(this._team01["result" + this._dayIndex]);
    }
    if (this._team02) {
      num += Number(this._team02["result" + this._dayIndex]);
    }
    if (num > 0) {
      this._resultIcon01.visible = true;
      this._resultIcon02.visible = true;
    } else {
      this._resultIcon01.visible = false;
      this._resultIcon02.visible = false;
    }
  }

  private getResultIcon(isWin: boolean): string {
    let res: string = "";
    if (isWin) {
      res = fgui.UIPackage.getItemURL(EmWindow.Consortia, "Icon_Victory_S");
    } else {
      res = fgui.UIPackage.getItemURL(EmWindow.Consortia, "Icon_Failure_S");
    }
    return res;
  }

  dispose() {
    this._info = null;
    super.dispose();
  }
}
