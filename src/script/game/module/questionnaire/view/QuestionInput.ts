import FUI_QuestionInput from "../../../../../fui/QuestionNaire/FUI_QuestionInput";
import LangManager from "../../../../core/lang/LangManager";
import QuestionData from "../QuestionData";
import InputItem from "./InputItem";
import { NotificationManager } from "../../../manager/NotificationManager";
import { QuestionEvent } from "../../../constant/event/NotificationEvent";
import LTextInput from "../../../component/laya/LTextInput";
import { MessageTipManager } from "../../../manager/MessageTipManager";

export default class QuestionInput extends FUI_QuestionInput {
  private _itemData: QuestionData;
  private content: LTextInput;

  onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  private addEvent() {}

  private offEvent() {}

  public set itemData(value: any) {
    this._itemData = value;
    this.QuestTitle.text = value.Subject;
    let lineCount = Math.ceil(this._itemData.MaxChoose / 42); //向上取整
    this.inputlist.numItems = lineCount;
    this.inputlist.resizeToFit();
    this.answerGroup.ensureBoundsCorrect();
    this.content = LTextInput.create(
      this.displayObject,
      "",
      20,
      "#FFECC6",
      this.inputlist.width,
      this.inputlist.height,
      this.inputlist.x,
      this.inputlist.y,
      10,
    );
    this.content.register(
      this,
      this.__onContentChange,
      this.onContentFocusIn,
      this.onContentFocusOut,
    );
    this.content.on(Laya.Event.FOCUS, this, this.onFocusTarget);
    this.content.on(Laya.Event.BLUR, this, this.onBlurTarget);
    if (lineCount > 1) {
      this.content.wordWrap = true;
      this.content.multiline = true;
    } else {
      this.content.wordWrap = false;
      this.content.multiline = false;
    }
  }

  /** */
  onFocusTarget() {
    NotificationManager.Instance.dispatchEvent(QuestionEvent.FOCUS);
  }

  /** */
  onBlurTarget() {
    NotificationManager.Instance.dispatchEvent(QuestionEvent.BLUR);
  }

  /**文本内容变化 */
  private contentWords: string = "";
  private __onContentChange(evt: Event) {
    let input: string = this.content.text;
    if (input.length > this._itemData.MaxChoose) {
      this.content.text = this.contentWords;
      let text = LangManager.Instance.GetTranslation(
        "questionnaire.QuestionnaireFrame.maxWordCount",
        this._itemData.MaxChoose,
      );
      MessageTipManager.Instance.show(text);
      return;
    }
    this.contentWords = input;
    this.content.text = this.contentWords;
  }

  private onContentFocusIn() {}

  private onContentFocusOut() {}

  public get questionId(): number {
    return this._itemData.Id;
  }

  public get answerData(): string {
    var answerStr: string = this.contentWords;
    return answerStr;
  }

  dispose(): void {
    this.offEvent();
    super.dispose();
  }
}
