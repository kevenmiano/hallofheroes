//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";

import FUI_EvaluationCom from "../../../../../fui/PersonalCenter/FUI_EvaluationCom";

/**
 * 客服评价
 */
export default class EvaluationCom extends FUI_EvaluationCom {
  private _checkTextNumber: number = 250;
  private MAX_CHARS: number = 250;
  public evaluateGrade: number = 3;

  onConstruct() {
    super.onConstruct();
  }

  init() {
    (this.txt_desc.displayObject as Laya.Input).wordWrap = true;
    this.txt_num.text = LangManager.Instance.GetTranslation(
      "customerservice.CustomerServiceBaseView.content01",
      this._checkTextNumber,
    );

    this.addEvent();
    this.tab.getChild("item2").asButton.selected = true;
  }

  private _textInputHandler(e: Event): void {
    this._checkTextNumber = this.MAX_CHARS - this.txt_desc.text.length;
    if (this._checkTextNumber < 0) {
      this._checkTextNumber = 0;
      this.txt_desc.text = this.txt_desc.text.substring(0, this.MAX_CHARS);
      this.txt_num.text = LangManager.Instance.GetTranslation(
        "customerservice.CustomerServiceBaseView.content01",
        0,
      );
      return;
    }
    this.txt_num.text = LangManager.Instance.GetTranslation(
      "customerservice.CustomerServiceBaseView.content01",
      this._checkTextNumber,
    );
  }

  private addEvent(): void {
    this.txt_desc.on(Laya.Event.INPUT, this, this._textInputHandler);
    for (let i = 0; i < 4; i++) {
      const btn: fairygui.GButton = this.tab.getChild("item" + i).asButton;
      btn.onClick(this, this.onClickEmoji, [i]);
    }
  }

  onClickEmoji(idx: number) {
    this.evaluateGrade = idx + 1;
  }

  removeEvent(): void {
    this.txt_desc.off(Laya.Event.INPUT, this, this._textInputHandler);
    for (let i = 0; i < 4; i++) {
      const btn: fairygui.GButton = this.tab.getChild("item" + i).asButton;
      btn.offClick(this, this.onClickEmoji);
    }
  }
}
