// @ts-nocheck
import FUI_QuestionItem from "../../../../../fui/QuestionNaire/FUI_QuestionItem";
import { MessageTipManager } from '../../../manager/MessageTipManager';
import { NotificationManager } from "../../../manager/NotificationManager";
import QuestionData, { QuestionType } from '../QuestionData';
import { QuestionEvent } from '../../../constant/event/NotificationEvent';
import LangManager from '../../../../core/lang/LangManager';
import AnswerItem from "./AnswerItem";
import Logger from '../../../../core/logger/Logger';
import Utils from "../../../../core/utils/Utils";

/**
 * 问卷调查Item
 */
export default class QuestionItem extends FUI_QuestionItem {

    private _itemData: QuestionData;

    onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private addEvent() {
    }

    /**渲染消息列表 */
    private renderListItem(index: number, item: AnswerItem) {
        let itemData: string = this._itemData.Options[index];
        item.optData = this._itemData;
        item.itemData = itemData;
        item.parentItem = this;
    }



    public set itemData(value: QuestionData) {
        this._itemData = value;
        switch (value.Type) {
            case QuestionType.Single:
                this.list.selectionMode = fgui.ListSelectionMode.Single;
                this.QuestTitle.text = value.Subject;
                break;
            case QuestionType.Multi:
                this.list.selectionMode = fgui.ListSelectionMode.Multiple_SingleClick;
                this.QuestTitle.text = value.Subject + LangManager.Instance.GetTranslation("questionnaire.QuestionnaireFrame.multiSelect");
                break;
            default:
                this.list.selectionMode = fgui.ListSelectionMode.None;
                this.QuestTitle.text = value.Subject;
                break;
        }
        let count = value.Options.length;
        this.list.numItems = count;
        this.list.resizeToFit(count);
        this.group.ensureBoundsCorrect();
    }

    private offEvent() {
        if (this.list && !this.list.isDisposed) {
            // this.list.itemRenderer.recover();
            Utils.clearGListHandle(this.list);
        }
    }

    public get questionId(): number {
        return this._itemData.Id;
    }

    public get answerData(): string {
        var answerStr: string = "";
        let selectCount = this.list.numItems;
        for (var i: number = 0; i < selectCount; i++) {
            let selectItem = this.list.getChildAt(i) as AnswerItem;
            if (selectItem.check.selected) {
                let selectData = selectItem.itemData;
                answerStr += selectData + "|";
            }

        }
        return answerStr;
    }

    dispose() {
        this.offEvent();
        super.dispose();
    }

}