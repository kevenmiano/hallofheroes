//@ts-expect-error: External dependencies
import FUI_AnswerItem from "../../../../../fui/QuestionNaire/FUI_AnswerItem";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import QuestionItem from "./QuestionItem";
import { NotificationManager } from "../../../manager/NotificationManager";
import { QuestionEvent } from "../../../constant/event/NotificationEvent";
import QuestionData, { QuestionType } from "../QuestionData";
import { MessageTipManager } from "../../../manager/MessageTipManager";

/**
 * 问卷调查选项Item
 */
export default class AnswerItem extends FUI_AnswerItem {
  private _itemData: string;
  private _optData: QuestionData;
  private _inputMax: number = 0;
  private _parentItem: QuestionItem;
  private contentWords: string = "";

  protected onConstruct() {
    super.onConstruct();
    this.input.editable = false;
    this.addEvent();
  }

  private addEvent() {
    this.check.on(fgui.Events.STATE_CHANGED, this, this.onItemStateChange);
    this.input.on(Laya.Event.INPUT, this, this.onInputAnswer);
    this.input.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.input.on(Laya.Event.BLUR, this, this.onBlurTarget);
  }

  private offEvent() {
    this.check.off(fgui.Events.STATE_CHANGED, this, this.onItemStateChange);
    this.input.off(Laya.Event.INPUT, this, this.onInputAnswer);
    this.input.off(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.input.off(Laya.Event.BLUR, this, this.onBlurTarget);
  }

  /** */
  onFocusTarget() {
    NotificationManager.Instance.dispatchEvent(QuestionEvent.FOCUS);
  }

  /** */
  onBlurTarget() {
    NotificationManager.Instance.dispatchEvent(QuestionEvent.BLUR);
  }

  /**
   * 监听输入
   */
  onInputAnswer(evt) {
    Logger.info(evt);
    let input: string = this.input.text;
    if (input.length > this._inputMax) {
      this.input.text = this.contentWords;
      let text = LangManager.Instance.GetTranslation(
        "questionnaire.QuestionnaireFrame.maxWordCount",
        this._inputMax,
      );
      MessageTipManager.Instance.show(text);
      return;
    }
    this.contentWords = input;
    this.input.text = this.contentWords;
  }

  /**选项状态变化 */
  onItemStateChange(evt) {
    let count = 0;
    if (!this._parentItem) return;
    let itemsCount = this._parentItem.list.numItems;
    for (let index = 0; index < itemsCount; index++) {
      let questionItem = this._parentItem.list.getChildAt(index) as AnswerItem;
      if (questionItem.check.selected) {
        count += 1;
      }
    }
    if (this._optData.Type == QuestionType.Multi) {
      if (count > this._optData.MaxChoose) {
        let text = LangManager.Instance.GetTranslation(
          "questionnaire.QuestionnaireFrame.maxSelect",
          this._optData.MaxChoose,
        );
        MessageTipManager.Instance.show(text);
        this.check.selected = !this.check.selected;
      } else if (count == this._optData.MaxChoose) {
        //选择完成,跳转下一题
        NotificationManager.Instance.dispatchEvent(
          QuestionEvent.SCROLL_TO_NEXT,
          this._optData.Id,
        );
      }
    } else if (this._optData.Type == QuestionType.Single) {
      //选择完成,跳转下一题
      if (count == 1) {
        //选择完成,跳转下一题
        NotificationManager.Instance.dispatchEvent(
          QuestionEvent.SCROLL_TO_NEXT,
          this._optData.Id,
        );
      } else if (count > 1) {
        let text = LangManager.Instance.GetTranslation(
          "questionnaire.QuestionnaireFrame.maxSelect",
          this._optData.MaxChoose,
        );
        MessageTipManager.Instance.show(text);
        this.check.selected = !this.check.selected;
      }
    }
    this.input.editable =
      this.check.selected && this.inputCtrl.selectedIndex == 1;
    if (!this.input.editable) {
      this.input.text = "";
    }
  }

  public set parentItem(value: QuestionItem) {
    this._parentItem = value;
  }

  public get parentItem(): QuestionItem {
    return this._parentItem;
  }

  public set optData(value: QuestionData) {
    this._optData = value;
  }

  public set itemData(value: string) {
    this._itemData = value;
    let hasInput = value.indexOf("$") != -1;
    if (hasInput) {
      let textValue = value.split("$")[0];
      this._inputMax = Number(value.split("$")[1]);
      this.check.getChild("title").text = textValue;
    } else {
      this.check.getChild("title").text = value;
    }
    this.inputCtrl.selectedIndex = hasInput ? 1 : 0;
    if (this.check.group) {
      this.check.group.ensureBoundsCorrect();
      this.check.group.ensureSizeCorrect();
    }
    this.group && this.group.ensureBoundsCorrect();
    this.ensureBoundsCorrect();
  }

  public get itemData(): string {
    let hasInput = this._itemData.indexOf("$") != -1;
    let textValue = "";
    if (hasInput) {
      let titleTxt = this._itemData.split("$")[0];
      textValue = titleTxt + "$" + this.contentWords;
    } else {
      textValue = this._itemData;
    }
    return textValue;
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
