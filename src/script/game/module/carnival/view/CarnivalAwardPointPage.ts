// @ts-nocheck
import FUI_CarnivalAwardPointPage from "../../../../../fui/Carnival/FUI_CarnivalAwardPointPage";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import Utils from "../../../../core/utils/Utils";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import CarnivalManager from "../../../manager/CarnivalManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel from "../model/CarnivalModel";
import CarnivalAwardPointPageItem from "./CarnivalAwardPointPageItem";
import { CarnivalBasePage } from "./CarnivalBasePage";

/**
 * 嘉年华---积分领奖
 */
export default class CarnivalAwardPointPage extends FUI_CarnivalAwardPointPage implements CarnivalBasePage {

    private _itemList: t_s_carnivalpointexchangeData[];
    private _itemList2: t_s_carnivalpointexchangeData[];

    protected onConstruct(): void {
        super.onConstruct();
        this.addEvent();
        this.list.displayObject['dyna'] = true;
        Utils.setDrawCallOptimize(this.list);
        this.list2.scrollPane.mouseWheelEnabled = true;
        this.list2.scrollPane.touchEffect = false;
    }

    addEvent() {
        this.list.setVirtual();
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list2.itemRenderer = Laya.Handler.create(this, this.renderListItem2, null, false);
        // this.list.on(fgui.Events.SCROLL, this, this.scrollListChange);
    }

    offEvent() {
        this.list.itemRenderer && this.list.itemRenderer.recover();
        this.list2.itemRenderer && this.list2.itemRenderer.recover();
        this.list.itemRenderer =null;
        this.list2.itemRenderer=null;
        // this.list.off(fgui.Events.SCROLL, this, this.scrollListChange);
    }

    onShow() {
        Logger.info("CarnivalAwardPointPage:onShow");
        this.setScore();
        this.refreshView()
    }

    onHide() {
        Logger.info("CarnivalAwardPointPage:onHide");
    }

    onUpdate(data: any) {
        Logger.info("CarnivalAwardPointPage:onUpdate-", data);
        this.refreshView();
    }

    private getPointIndex(data: t_s_carnivalpointexchangeData): number {
        let i: number = 0;
        let tInfo: t_s_carnivalpointexchangeData;
        let len: number = this._itemList.length;
        for (i = 0; i < len; i++) {
            tInfo = this._itemList[i];
            if (tInfo.Id == data.Id) {
                return i;
            }
        }
        return 0;
    }

    private scrollToIndex: number = 0;
    private refreshView() {
        this.setScore();
        this.list.numItems = 0;
        let _tempList = TempleteManager.Instance.getCarnivalByType(CarnivalModel.TYPE_AWARD);

        this.parseData(_tempList);
        let len = this._itemList.length
        this.list.numItems = len;
        this.scrollToIndex = 0;

        //设置我的积分
        let currScore: number = this.model.score;
        let tInfo: t_s_carnivalpointexchangeData;
        let nextInfo: t_s_carnivalpointexchangeData;
        let hasRewardStr: string = this.model.scoreRewardInfo;
        let hasRewardList: Array<string> = hasRewardStr.split(",");

        for (let i = 0; i < len; i++) {
            tInfo = this._itemList[i];
            let findId = tInfo.Id + "";
            if (hasRewardList.indexOf(findId) == -1 && this.scrollToIndex == 0) {
                this.scrollToIndex = i;
            }
            if (tInfo.Target > currScore && !nextInfo) {
                nextInfo = tInfo;
                break;
            }
        }
        this.list.scrollToView(this.scrollToIndex, false, true);//当前第一个未完成条件

        if (nextInfo == null) {
            this.txt_describe.visible = false;
        } else {
            this.txt_describe.visible = true;
            this.txt_describe.text = LangManager.Instance.GetTranslation("carnival.awardpoint.describe", nextInfo.Target - currScore)
        }

        this.list2.numItems = this._itemList2.length;
        // this.scrollListChange();
    }

    /**滚动List */
    private scrollListChange() {
        let dataCount: number = this._itemList.length;
        let itemCount: number = this.list.numChildren;//显示对象
        let tInfo: t_s_carnivalpointexchangeData;
        let sInfo: t_s_carnivalpointexchangeData;
        let i: number = 0;
        let tempData = [];
        let lastItem: CarnivalAwardPointPageItem = this.list.getChildAt(itemCount - 1) as CarnivalAwardPointPageItem;
        let lastItemInfo = lastItem.info;
        let lastChildIndex = this.getPointIndex(lastItemInfo);
        for (i = lastChildIndex; i < dataCount; i++) {
            tInfo = this._itemList[i];
            let findId = tInfo.Sort;
            if (findId % 5 == 0 && lastChildIndex != dataCount - 1) {
                sInfo = tInfo;
                tempData.push(sInfo);
                break;
            }
        }
        this._itemList2 = tempData;
        this.list2.numItems = this._itemList2.length;
        this.list2.visible = this._itemList2.length > 0;
    }

    renderListItem(index: number, item: CarnivalAwardPointPageItem) {
        if (item && !item.isDisposed) {
            item.state.selectedIndex = 0;
            item.info = this._itemList[index];
            let lastIndex = this.list.childIndexToItemIndex(4)
            let selectedIndex = ((lastIndex - 1) / 4) >> 0

            let count = this.list2.numItems;
            if (count > 0 && selectedIndex != this.list2.selectedIndex) {
                selectedIndex = selectedIndex >= count ? count - 1 : selectedIndex;
                this.list2.selectedIndex = selectedIndex;
                this.list2.scrollToView(selectedIndex, false);
            }
        }
    }

    renderListItem2(index: number, item: CarnivalAwardPointPageItem) {
        if (item && !item.isDisposed) {
            item.state.selectedIndex = 1;
            item.info = this._itemList2[index];
        }
    }

    private setScore() {
        //设置我的积分
        let currScore: number = this.model.score;
        this.carnival_point.type.selectedIndex = 0;
        this.carnival_point.txt_title.text = LangManager.Instance.GetTranslation("carnival.awardpoint.point", currScore)
        this.carnival_point.txt_value.text = "";
        this.carnival_point.ensureSizeCorrect();
    }
    //解析分离数据
    private parseData(dataArry: t_s_carnivalpointexchangeData[]) {
        this._itemList2 = [];
        this._itemList = [];
        let len = dataArry.length;
        for (let i = 0; i < len; i++) {
            this._itemList.push(dataArry[i]);
            if ((i + 1) % 5 == 0) {
                this._itemList2.push(dataArry[i]);
                continue;
            }
        }
        //最后一个不要
        this._itemList.pop();
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    onDestroy() {
        Logger.info("CarnivalAwardPointPage:onDestroy");
        this.offEvent();
        // this.list.numItems = 0;
        this.list.dispose();
        this._itemList = null;
        super.dispose();
    }

}