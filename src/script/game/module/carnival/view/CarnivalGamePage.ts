// @ts-nocheck
import FUI_CarnivalGamePage from "../../../../../fui/Carnival/FUI_CarnivalGamePage";
import MouseMgr from "../../../../core/Input/MouseMgr";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import CarnivalManager from "../../../manager/CarnivalManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import FUIHelper from "../../../utils/FUIHelper";
import CarnivalModel, { CARNIVAL_THEME } from "../model/CarnivalModel";
import { CarnivalBasePage } from "./CarnivalBasePage";
import CarnivalGamePageItem from "./CarnivalGamePageItem";
import UIButton from "../../../../core/ui/UIButton";

/**
 * 嘉年华---欢乐游戏
 */
export default class CarnivalGamePage extends FUI_CarnivalGamePage implements CarnivalBasePage {

    private _itemList: Array<any> = [];

    private _centerGameItemIndex: number = 1;

    private _gameItems: Array<CarnivalGamePageItem> = [];

    private _mouseDown: boolean;

    private _mouseTime: number = 0;

    private _mouseDownPos: Laya.Point = null;

    private leftBtn: UIButton;
    private rightBtn: UIButton;

    protected onConstruct(): void {
        super.onConstruct();
        this.leftBtn = new UIButton(this.btn_arrow_l);
        this.rightBtn = new UIButton(this.btn_arrow_r);
        this.leftBtn.btnInternal = this.rightBtn.btnInternal = 500;
        this.addEvent()
        let themeType = this.model.themeType;
        if (themeType == CARNIVAL_THEME.SUMMER) {
            this.isSummer.selectedIndex = 1;
        } else {
            this.isSummer.selectedIndex = 0;
        }
    }

    addEvent() {
        this.leftBtn.onClick(this, this.onGameL);
        this.rightBtn.onClick(this, this.onGameR);
        // this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        // this.list.scrollPane.mouseWheelEnabled = false;
        MouseMgr.Instance.register(this.displayObject, null, this.__onMouseDownHandler.bind(this), this.__onMouseUpHandler.bind(this), null);
    }

    offEvent() {
        this.leftBtn.offClick(this, this.onGameL);
        this.rightBtn.offClick(this, this.onGameR);
    }

    private __onMouseDownHandler(evt: Laya.Event) {
        this._mouseDown = true;
        this._mouseTime = new Date().getTime();
        this._mouseDownPos = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
    }

    private __onMouseUpHandler(evt: Laya.Event) {
        let time: number = new Date().getTime() - this._mouseTime;
        this._mouseDown = false;
        if (time < 300) {
            return
        }
        let nowPos = new Laya.Point(Laya.stage.mouseX, Laya.stage.mouseY);
        try {
            if (nowPos.x > this._mouseDownPos.x) {
                this.moveGameItem(1);
            } else if (nowPos.x < this._mouseDownPos.x) {
                this.moveGameItem(-1);
            }
        } catch (error) {
            Logger.error("__onMouseUpHandler:", error.msg);
        }
    }

    // private renderListItem(index: number, item: CarnivalGamePageItem) {
    //     if (item && !item.isDisposed) {
    //         item.info = this._itemList[index];
    //         item.refreshView(this.model.gameInfo);
    //     }
    // }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    private isMoving: boolean = false;
    onGameL() {
        this.moveGameItem(-1);
    }

    onGameR() {
        this.moveGameItem(1);
    }

    onShow() {
        Logger.info("CarnivalGamePage:onShow");
        this.initView();
    }

    private startX: number = 550;
    private startY: number = 100;
    private initView() {
        this._itemList = [];
        this._gameItems = [];
        this.startX = this.btn_arrow_l.x + 50;
        this.startY = this.btn_arrow_l.y - 572 / 2;
        let gameBoxItemView: CarnivalGamePageItem;
        for (var i: number = 1; i < 4; i++) {
            let tempInfo = TempleteManager.Instance.getCarnivalByType(i + CarnivalModel.TypeAdd);
            let tempData = null;
            if (tempInfo.length) {
                tempData = tempInfo[0]
            }
            this._itemList.push(tempData);
            gameBoxItemView = FUIHelper.createFUIByURL(CarnivalGamePageItem.URL);
            gameBoxItemView.info = tempData;
            gameBoxItemView.refreshView(this.model.gameInfo);
            gameBoxItemView.x = this.startX + 5 + i * 200;
            gameBoxItemView.y = this.startY + 30;
            gameBoxItemView.scaleX = gameBoxItemView.scaleY = 0.9;
            gameBoxItemView.alpha = 0.5;
            gameBoxItemView.index = i;
            gameBoxItemView.onClick(this, this.onMoveItem);
            this._gameItems.push(gameBoxItemView);
            this.addChild(gameBoxItemView);
        }

        this.btn_arrow_l.visible = this._itemList.length > 0;
        this.btn_arrow_r.visible = this._itemList.length > 0;

        this.moveGameItem(0);

        this.carnival_reset.type.selectedIndex = 1;
        this.carnival_reset.txt_title.text = LangManager.Instance.GetTranslation("carnival.today.reset");
        this.carnival_reset.txt_value.text = "";
        this.carnival_reset.ensureSizeCorrect();
    }

    private onMoveItem(event: Laya.Event) {
        event.stopPropagation();
        let target = fgui.GObject.cast(event.currentTarget);
        if (target instanceof fgui.GButton) {
            return;
        }
        let moveIndex = (target as CarnivalGamePageItem).index;
        if (moveIndex != 0) {
            this.moveGameItem(moveIndex);
        }
    }

    private moveGameItem(moveCount: number) {
        if (this.isMoving) return;
        var i: number = 0;
        var flag: number = 1;
        let itemsCount = this._gameItems.length
        for (i = 0; i < Math.abs(moveCount); i++) {
            if (moveCount < 0) flag = -1;
            this._centerGameItemIndex += flag;
            if (this._centerGameItemIndex < 0) this._centerGameItemIndex = this._centerGameItemIndex = itemsCount - 1;
            if (this._centerGameItemIndex > itemsCount - 1) this._centerGameItemIndex = 0;
        }

        for (i = 0; i < itemsCount; i++) {
            if (i - this._centerGameItemIndex <= -2) {
                this._gameItems[i].x = this.startX - 60;
                this._gameItems[i].y = this.startY + 30;
                this._gameItems[i].scaleX = this._gameItems[i].scaleY = 0.9;
                this._gameItems[i].alpha = 0.5;
                this._gameItems[i].Enabled = false;
                this._gameItems[i].moveOver = false;
            } else if (i - this._centerGameItemIndex >= 2) {
                this._gameItems[i].x = this.startX + 60;
                this._gameItems[i].y = this.startY + 30;
                this._gameItems[i].scaleX = this._gameItems[i].scaleY = 0.9;
                this._gameItems[i].alpha = 0.5;
                this._gameItems[i].Enabled = false;
                this._gameItems[i].moveOver = false;
            }
        }

        this._gameItems[this._centerGameItemIndex].Enabled =  true;
        this._gameItems[this._centerGameItemIndex].index = 0;
        TweenMax.to(this._gameItems[this._centerGameItemIndex], 0.3, { x: this.startX + 232, y: this.startY + 5, scaleX: 1, scaleY: 1, alpha: 1, onComplete: this.onTweenComplete, onCompleteParams: [this._gameItems[this._centerGameItemIndex], flag, itemsCount] });

        //左侧
        var leftItemIndex: number = (this._centerGameItemIndex - 1) < 0 ? this._gameItems.length - 1 : (this._centerGameItemIndex - 1);
        this._gameItems[leftItemIndex].Enabled = false;
        this._gameItems[leftItemIndex].index = -1;
        TweenMax.to(this._gameItems[leftItemIndex], 0.1, { x: this.startX + 5, y: this.startY + 30, scaleX: 0.9, scaleY: 0.9, alpha: 0.5, onComplete: this.onTweenComplete, onCompleteParams: [this._gameItems[leftItemIndex], flag, itemsCount] });

        //右侧
        var rightItemIndex: number = (this._centerGameItemIndex + 1) > (this._gameItems.length - 1) ? 0 : (this._centerGameItemIndex + 1);
        this._gameItems[rightItemIndex].Enabled = false;
        this._gameItems[rightItemIndex].index = 1;
        TweenMax.to(this._gameItems[rightItemIndex], 0.1, { x: this.startX + 495, y: this.startY + 30, scaleX: 0.9, scaleY: 0.9, alpha: 0.5, onComplete: this.onTweenComplete, onCompleteParams: [this._gameItems[rightItemIndex], flag, itemsCount] });

        this.setChildIndex(this._gameItems[this._centerGameItemIndex], this.numChildren - 1);
    }

    onTweenComplete(tweenItem: CarnivalGamePageItem, flag: number, count: number) {
        tweenItem.moveOver = true;
        Logger.warn("onTweenComplete:", tweenItem);
    }

    onHide() {
        Logger.info("CarnivalGamePage:onHide");
        this.clearItems();
    }

    private clearItems() {
        if (this._gameItems)
            for (const key in this._gameItems) {
                if (Object.prototype.hasOwnProperty.call(this._gameItems, key)) {
                    let element = this._gameItems[key];
                    element.removeFromParent();
                    element.dispose();
                }
            }
        this._gameItems = null;
    }

    onDestroy() {
        Logger.info("CarnivalGamePage:onDestroy");
        this.clearItems();
    }

    onUpdate(data: any) {
        Logger.info("CarnivalGamePage:onUpdate-", data);
        if (this._gameItems)
            for (const key in this._gameItems) {
                if (Object.prototype.hasOwnProperty.call(this._gameItems, key)) {
                    let element = this._gameItems[key];
                    if (element && !element.isDisposed)
                        element.refreshView(this.model.gameInfo);
                }
            }
    }

}