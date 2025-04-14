import FUI_RuneHoldListItem from "../../../../../fui/Skill/FUI_RuneHoldListItem";
import { RuneHoleInfo } from "../../../datas/RuneHoleInfo";
import { RuneHoldEffectLock } from "./RuneHoldEffectLock";
import { RuneHoldRuneItem } from "./RuneHoldRuneItem";
import { RuneHoldValueLock } from "./RuneHoldValueLock";

export class RuneHoldListItem extends FUI_RuneHoldListItem {
  private _info: RuneHoleInfo;

  declare public effectLock: RuneHoldEffectLock;
  declare public valueLock: RuneHoldValueLock;

  private runeItems: RuneHoldRuneItem[];

  protected onConstruct(): void {
    super.onConstruct();
    this.runeItems = [
      this.rr0 as RuneHoldRuneItem,
      this.rr1 as RuneHoldRuneItem,
      this.rr2 as RuneHoldRuneItem,
      this.rr3 as RuneHoldRuneItem,
      this.rr4 as RuneHoldRuneItem,
    ];
  }

  public set info(info: RuneHoleInfo) {
    this._info = info;
    this.updateView();

    this.updateRune();
  }

  public get info() {
    return this._info;
  }

  private updateView() {
    this.holdName.text = this._info.name;
    this.effectLock.info = this._info;
    this.valueLock.info = this._info;
  }

  private updateRune() {
    this.runeItemGroup.visible = this._info.opened;
    this.openTips.visible = !this._info.opened;
    this.openTips
      .setVar("level", RuneHoleInfo.RuneHoleOpenLevel[this._info.holeId - 1])
      .flushVars();
    if (!this._info.opened) return;
    let pos = 0;
    for (let runeItem of this.runeItems) {
      runeItem.updateView(this._info.getRuneByPos(pos));
      pos++;
    }
  }
}
