import FUI_QuestionAnswer from "../../../../fui/QuestionNaire/FUI_QuestionAnswer";
import FUI_QuestionItem from "../../../../fui/QuestionNaire/FUI_QuestionItem";
import FUI_QuestionTitle from "../../../../fui/QuestionNaire/FUI_QuestionTitle";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { QuestionEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import QuestionnaireManager from "../../manager/QuestionnaireManager";
import { TempleteManager } from "../../manager/TempleteManager";
import QuestionData, { QuestionType } from "./QuestionData";
import SimpleAlertHelper, {
  AlertBtnType,
} from "../../component/SimpleAlertHelper";
import { MessageTipManager } from "../../manager/MessageTipManager";
import FUI_QuestionSubmit from "../../../../fui/QuestionNaire/FUI_QuestionSubmit";
import FUI_QuestionInput from "../../../../fui/QuestionNaire/FUI_QuestionInput";

//@ts-expect-error: External dependencies
import QuestionDataRspInfo = com.road.yishi.proto.questionnarie.QuestionDataRspInfo;
import Utils from "../../../core/utils/Utils";

/**
 * @author:pzlricky
 * @data: 2021-10-15 16:08
 * @description 问卷调查
 */
export default class QuestionWnd extends BaseWindow {
  private static SEND_ANSWER: number = 1;
  private static END_ANSWER: number = 2;

  private frame: fgui.GComponent;
  private questList: fgui.GList;
  private listData: Array<QuestionData> = [];

  public OnInitWind() {
    super.OnInitWind();
    this.setCenter();
    this.frame.getChild("title").text = LangManager.Instance.GetTranslation(
      "questionnaire.QuestionnaireFrame.titleText",
    );
    this.addEvent();
    this.onInitListData();
  }

  private addEvent() {
    this.questList.itemProvider = Laya.Handler.create(
      this,
      this.getListItemResource,
      null,
      false,
    );
    this.questList.itemRenderer = Laya.Handler.create(
      this,
      this.renderListItem,
      null,
      false,
    );
    NotificationManager.Instance.addEventListener(
      QuestionEvent.SCROLL_TO_NEXT,
      this.scrollToNext,
      this,
    );
    NotificationManager.Instance.addEventListener(
      QuestionEvent.FINISH_QUESTION,
      this.finishQuestion,
      this,
    );
    NotificationManager.Instance.addEventListener(
      QuestionEvent.FOCUS,
      this.disableScroll,
      this,
    );
    NotificationManager.Instance.addEventListener(
      QuestionEvent.BLUR,
      this.enableScroll,
      this,
    );
  }

  private offEvent() {
    if (this.questList && !this.questList.isDisposed) {
      // this.questList.itemProvider.recover();
      // this.questList.itemRenderer.recover();
      Utils.clearGListHandle(this.questList);
    }
    NotificationManager.Instance.removeEventListener(
      QuestionEvent.SCROLL_TO_NEXT,
      this.scrollToNext,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      QuestionEvent.FINISH_QUESTION,
      this.finishQuestion,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      QuestionEvent.FOCUS,
      this.disableScroll,
      this,
    );
    NotificationManager.Instance.removeEventListener(
      QuestionEvent.BLUR,
      this.enableScroll,
      this,
    );
  }

  enableScroll() {
    this.questList.scrollPane.touchEffect = true;
    this.questList.scrollPane.mouseWheelEnabled = true;
  }

  disableScroll() {
    this.questList.scrollPane.touchEffect = false;
    this.questList.scrollPane.mouseWheelEnabled = false;
  }

  /**渲染消息列表 */
  private renderListItem(index: number, item: any) {
    item.itemData = this.listData[index];
    item.ensureSizeCorrect();
  }

  //不同渲染聊天单元格
  private getListItemResource(index: number) {
    let itemData = this.listData[index];
    //系统信息
    switch (itemData.Type) {
      case QuestionType.NONE:
        return FUI_QuestionTitle.URL;
      case QuestionType.Single:
        return FUI_QuestionItem.URL;
      case QuestionType.Multi:
        return FUI_QuestionItem.URL;
      case QuestionType.Write:
        return FUI_QuestionAnswer.URL;
      case QuestionType.Input:
        return FUI_QuestionInput.URL;
      case QuestionType.Max:
        return FUI_QuestionSubmit.URL;
    }
  }

  public get answerList(): Array<QuestionDataRspInfo> {
    let _answerList = [];
    let itemCount = this.questList.numItems;
    for (let i: number = 0; i < itemCount; i++) {
      let item: any = this.questList.getChildAt(i);
      if (item.questionId) {
        let answer: QuestionDataRspInfo = new QuestionDataRspInfo();
        answer.questId = item.questionId;
        answer.answer = item.answerData;
        _answerList.push(answer);
      }
    }
    return _answerList;
  }

  /**完成问卷调查 */
  private finishQuestion() {
    let ret = this.checkFinish();
    if (!ret) {
      //跳转至未完成题目
      let index = this.getFirstUnFinish();
      let withoutAns = LangManager.Instance.GetTranslation(
        "questionnaire.QuestionnaireFrame.withoutAns",
        index + 1,
      ); //答题未完成
      MessageTipManager.Instance.show(withoutAns);
      this.questList.scrollToView(index, true);
      return;
    }
    let finishExit = LangManager.Instance.GetTranslation(
      "questionnaire.QuestionnaireFrame.finishExit",
    ); //答题完成退出
    let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    let confirm1: string =
      LangManager.Instance.GetTranslation("public.confirm");
    let cancel1: string = LangManager.Instance.GetTranslation("public.cancel");
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      finishExit,
      confirm1,
      cancel1,
      this.alertFinishCB.bind(this),
      AlertBtnType.O,
    );
  }

  private alertFinishCB(b: boolean, flag: boolean) {
    QuestionnaireManager.Instance.sendQuestionAnswer(
      QuestionWnd.END_ANSWER,
      QuestionnaireManager.Instance.model.questionId,
      this.answerList,
    );
    QuestionnaireManager.Instance.model.questionnaireVisible = false;
    super.OnBtnClose();
  }

  private checkFinish(): boolean {
    let finish = true;
    let datalist: Array<QuestionDataRspInfo> = this.answerList;
    for (let index = 0; index < datalist.length; index++) {
      let data = datalist[index];
      if (data.answer == "") {
        finish = false;
        break;
      }
    }
    return finish;
  }

  private getFirstUnFinish(): number {
    let finish = 0;
    let datalist: Array<QuestionDataRspInfo> = this.answerList;
    for (let index = 0; index < datalist.length; index++) {
      let data = datalist[index];
      if (data.answer == "") {
        finish = index;
        break;
      }
    }
    return finish;
  }

  private checkStartAns(): boolean {
    let start = false;
    let datalist: Array<QuestionDataRspInfo> = this.answerList;
    for (let index = 0; index < datalist.length; index++) {
      let data = datalist[index];
      if (data.answer != "") {
        start = true;
        break;
      }
    }
    return start;
  }

  protected OnBtnClose() {
    let ret = this.checkStartAns(); //检查是否已开始答题
    if (ret) {
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let confirm1: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel1: string =
        LangManager.Instance.GetTranslation("public.cancel");
      let msg = LangManager.Instance.GetTranslation(
        "questionnaire.QuestionnaireFrame.withoutExit",
      ); //答题未完成退出
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        msg,
        confirm1,
        cancel1,
        (b: boolean, flag: boolean) => {
          if (b) {
            super.OnBtnClose();
          }
        },
        AlertBtnType.OC,
      );
    } else {
      super.OnBtnClose();
    }
  }

  scrollToNext(currId: number = 0) {
    if (this.questList && !this.questList.isDisposed) {
      let beforeIndex = currId + 1;
      if (beforeIndex < this.questList.numItems - 1) {
        this.questList.scrollToView(beforeIndex, true);
      } else {
        this.questList.scrollPane.scrollBottom(true);
      }
    }
  }

  /**问卷答题数据 */
  onInitListData() {
    let tempDatalist: QuestionData[] = [];
    let cfglist = TempleteManager.Instance.getQuestionTempletes();
    let titleData = new QuestionData();
    titleData.Id = 0;
    titleData.Type = QuestionType.NONE;
    titleData.Subject = QuestionnaireManager.Instance.model.questionTitle;
    tempDatalist.push(titleData);

    let count = cfglist.length;
    for (let index = 0; index < count; index++) {
      let dataelement = cfglist[index];
      let itemData = new QuestionData();
      itemData.Id = dataelement.Id;
      itemData.Subject = dataelement.SubjectLang;
      itemData.MaxChoose = dataelement.MaxChoose;
      itemData.Options = dataelement.OptionsLang.split("|");
      itemData.Type = dataelement.Type;
      tempDatalist.push(itemData);
    }

    let submitData = new QuestionData();
    submitData.Id = 0;
    submitData.Type = QuestionType.Max;
    tempDatalist.push(submitData);
    this.listData = tempDatalist;
    this.questList.numItems = tempDatalist.length;
    this.questList.ensureSizeCorrect();
  }

  OnShowWind() {
    super.OnShowWind();
  }

  OnHideWind() {
    super.OnHideWind();
    this.offEvent();
  }
}
