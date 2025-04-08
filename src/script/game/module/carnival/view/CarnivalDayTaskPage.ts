import FUI_CarnivalDayTaskPage from "../../../../../fui/Carnival/FUI_CarnivalDayTaskPage";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import Utils from "../../../../core/utils/Utils";
import CarnivalManager from "../../../manager/CarnivalManager";
import CarnivalModel, { CARNIVAL_FOLDER } from "../model/CarnivalModel";
import CarnivalTaskInfo from "../model/CarnivalTaskInfo";
import { CarnivalBasePage } from "./CarnivalBasePage";
import CarnivalDayTaskPageItem from "./CarnivalDayTaskPageItem";

/**
 * 嘉年华---每日挑战
 */
export default class CarnivalDayTaskPage extends FUI_CarnivalDayTaskPage implements CarnivalBasePage {

    private _itemList: Array<CarnivalTaskInfo> = [];
    protected onConstruct(): void {
        super.onConstruct();
        this.addEvent();
    }

    addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    offEvent() {
        Utils.clearGListHandle(this.list);
    }

    onShow() {
        Logger.info("CarnivalDayTaskPage:onShow");
        this.initData();
    }

    onHide() {
        Logger.info("CarnivalDayTaskPage:onHide");
    }

    onDestroy() {
        Logger.info("CarnivalDayTaskPage:onDestroy");
        this.offEvent();
    }

    onUpdate(data: any) {
        Logger.info("CarnivalAwardPointPage:onUpdate-", data);
        this.refreshView();
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    private initData() {
        this.Img_Role_3.url = this.model.getThemeFolderImgPath(CARNIVAL_FOLDER.DAYTASK, "Img_Role_3");
        //重置时间
        this.carnival_reset.type.selectedIndex = 1;
        this.carnival_reset.txt_title.text = LangManager.Instance.GetTranslation("carnival.today.reset");
        this.carnival_reset.txt_value.text = "";
        this.carnival_reset.ensureSizeCorrect();

        this.refreshView();
    }

    private refreshView() {
        var list: Array<CarnivalTaskInfo> = this.model.getAllTaskInfo();
        list = ArrayUtils.sortOn(list, ["isReward", "data", "taskId"], [ArrayConstant.NUMERIC, ArrayConstant.DESCENDING, ArrayConstant.NUMERIC]);
        this._itemList = list;
        this.list.numItems = this._itemList.length;
    }

    renderListItem(index: number, item: CarnivalDayTaskPageItem) {
        if (item && !item.isDisposed) {
            item.info = this._itemList[index];
        }
    }

}