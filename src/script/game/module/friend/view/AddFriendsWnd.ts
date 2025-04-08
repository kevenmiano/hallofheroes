// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { AddFriendsItem } from "./component/AddFriendsItem";
import { FriendManager } from "../../../manager/FriendManager";
import { FindResultEvent, FriendUpdateEvent } from "../../../constant/event/NotificationEvent";
import { RecommendInfo } from "../../../datas/RecommendInfo";
import { FriendSocketOutManager } from "../../../manager/FriendSocketOutManager";
import { YTextInput } from "../../common/YTextInput";
import LangManager from "../../../../core/lang/LangManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import StringUtils from "../../../utils/StringUtils";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/29 15:54
 * @ver 1.0
 *
 */
export class AddFriendsWnd extends BaseWindow {
    public frame: fgui.GComponent;
    public txt_search: YTextInput;
    public btn_search: fgui.GButton;
    public list: fgui.GList;

    private _data: RecommendInfo[];

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.initData();
        this.initView();
        this.initEvent();
        this.setCenter();
        // FriendManager.getInstance().sendRecommendFriendRequest()
    }

    private initData() {
        this._data = [];
    }

    private initView() {
        this.txt_search.singleLine = true;
        this.txt_search.promptText = LangManager.Instance.GetTranslation("GvgAddMembersWnd.txtSearch");
        this.txt_search.fontSize = 22;
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private initEvent() {
        this.txt_search.displayObject.on(Laya.Event.ENTER, this, this.onSearch);
        this.btn_search.onClick(this, this.onSearch.bind(this));
        this.on(Laya.Event.KEY_DOWN, this, this.onKeyDown);

        // FriendManager.getInstance().addEventListener(FriendUpdateEvent.UPDATE_RECOMONDLIST, this.__updateListHandler, this);
        FriendManager.getInstance().addEventListener(FindResultEvent.GET_FIND_RESULTS_BY_NAME, this.__updateFindListHandler, this);
    }

    public OnShowWind() {
        super.OnShowWind();

        // this.__updateListHandler();
    }

    private renderListItem(index: number, item: AddFriendsItem) {
        let infoData = this._data[index]
        if (infoData)
            item.info = this._data[index];
    }

    public getAddBtnByIndex(idx: number): fgui.GButton {
        for (let index = 0; index < this.list.numItems; index++) {
            if (idx == index) {
                const element = this.list.getChildAt(index) as AddFriendsItem;
                return element.bbtn_add
            }
        }
    }

    private onSearch(e: Laya.Event = null) {
        this.list.numItems = 0;
        if (StringUtils.trimAll(this.txt_search.text) == "") {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("friends.view.AddOrDeleteFriendFrame.command01"));
            return;
        }
        FriendSocketOutManager.sendFindFriendByName(this.txt_search.text);
    }

    // private __updateListHandler() {
    //     this._data = FriendManager.getInstance().recommendList;
    //     this.list.numItems = this._data.length;
    // }

    private __updateFindListHandler(list: RecommendInfo[]) {
        this._data = list;
        this.list.numItems = this._data.length;
    }

    private onKeyDown() {

    }

    private removeEvent() {
        this.txt_search.displayObject.off(Laya.Event.ENTER, this, this.onSearch);
        this.btn_search.offClick(this, this.onSearch.bind(this));
        this.off(Laya.Event.KEY_DOWN, this, this.onKeyDown);

        // FriendManager.getInstance().removeEventListener(FriendUpdateEvent.UPDATE_RECOMONDLIST, this.__updateListHandler, this);
        FriendManager.getInstance().removeEventListener(FindResultEvent.GET_FIND_RESULTS_BY_NAME, this.__updateFindListHandler, this);
    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._data = null;
        super.dispose(dispose);
    }
}