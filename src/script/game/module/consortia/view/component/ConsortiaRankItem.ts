//@ts-expect-error: External dependencies
import FUI_ConsortiaRankItem from "../../../../../../fui/Consortia/FUI_ConsortiaRankItem";
import { EmPackName } from "../../../../constant/UIDefine";
import { GuildGroupInfo } from "../../data/gvg/GuildGroupInfo";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/10/20 10:32
 * @ver 1.0
 */
export class ConsortiaRankItem extends FUI_ConsortiaRankItem {
  private _info: GuildGroupInfo;
  private _icons: string[] = ["Icon_1st_S", "Icon_2nd_S", "Icon_3rd_S"];

  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
  }

  get info(): GuildGroupInfo {
    return this._info;
  }

  set info(value: GuildGroupInfo) {
    this._info = value;
    this.initView();
  }

  private initView(): void {
    if (this._info.order < 4 && this._info.order != 0) {
      this.c1.selectedIndex = 1;
      this.rankIcon.url = fgui.UIPackage.getItemURL(
        EmPackName.Base,
        this._icons[this._info.order - 1],
      );
    } else {
      this.c1.selectedIndex = 0;
      this.rankIcon.url = "";
    }
    this.txt_rank.text = this._info.order + "";
    this.txt_name.text = this._info.consortiaName;
    this.txt_power.text = this._info.fightPower + "";
  }

  dispose() {
    this._info = null;
    super.dispose();
  }
}
