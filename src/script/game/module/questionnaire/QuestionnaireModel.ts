//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { QuestionnaireEvent } from "../../constant/event/NotificationEvent";

export default class QuestionnaireModel extends GameEventDispatcher {
  /**
   * 问题列表
   */
  private _questionList: Array<any> = [];
  /**
   * 问题ID
   */
  private _questionId: number = 0;
  /**
   * 奖励物品
   */
  private _questionGoodList: Array<any> = [];
  /**
   * 已回答答案列表
   */
  private _answerList: Array<any> = [];
  /**
   * 问卷调查描述
   */
  private _questionContent: string = "";
  /**
   * 按钮是否显示
   */
  private _questionnaireVisible: boolean;

  /**
   * 问卷调查标题
   */
  private _questionnaireTitle: string = "";

  /**
   * 问卷调查开始时间
   */
  private _questionnaireStarTime: number = 0;
  /**
   * 问卷调查结束时间
   */
  private _questionnaireEndTime: number = 0;
  /**
   * 问卷调查红点
   */
  public questionNaireRedpoint: boolean = true;

  public set questionList(value: Array<any>) {
    this._questionList = value;
  }

  public get questionList(): Array<any> {
    return this._questionList;
  }

  public set questionId(value: number) {
    this._questionId = value;
  }

  public get questionId(): number {
    return this._questionId;
  }

  public set questionTitle(value: string) {
    this._questionnaireTitle = value;
  }

  public get questionTitle(): string {
    return this._questionnaireTitle;
  }

  public get questionStartTime(): number {
    return this._questionnaireStarTime;
  }

  public set questionStartTime(value: number) {
    this._questionnaireStarTime = value;
  }

  public get questionEndTime(): number {
    return this._questionnaireEndTime;
  }

  public set questionEndTime(value: number) {
    this._questionnaireEndTime = value;
  }

  public set questionContent(value: string) {
    this._questionContent = value;
  }

  public get questionContent(): string {
    return this._questionContent;
  }

  public set questionnaireVisible(value: boolean) {
    this._questionnaireVisible = value;
    this.dispatchEvent(QuestionnaireEvent.QUESTIONNAIRE_CHANGE);
  }

  public get questionnaireVisible(): boolean {
    return this._questionnaireVisible;
  }

  public set questionGoodList(value: Array<any>) {
    this._questionGoodList = value;
  }

  public get questionGoodList(): Array<any> {
    return this._questionGoodList;
  }

  public set answerList(value: Array<any>) {
    if (value && value.length > 0) {
      for (var i: number = 0; i < value.length; i++) {
        if (value[i].answer != 0) {
          for (var j: number = 0; j < this._questionList.length; j++) {
            if (this._questionList[j].id == value[i].questId) {
              this._questionList.splice(j, 1);
              j--;
            }
          }
        }
      }
    }
    this.dispatchEvent(QuestionnaireEvent.QUESTIONNAIRE_FRESH);
    if (this.questionList && this.questionList.length > 0) {
    } else {
      this.questionnaireVisible = false;
    }
  }

  public questionnaireCheck() {
    this.dispatchEvent(QuestionnaireEvent.QUESTIONNAIRE_CHECKED);
  }
}
