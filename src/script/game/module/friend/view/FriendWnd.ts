// @ts-nocheck
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { FriendItem } from "./component/FriendItem";
import { PlayerManager } from "../../../manager/PlayerManager";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { FriendManager } from "../../../manager/FriendManager";
import FriendGroupId from "../../../datas/FriendGroupId";
import { StateType } from "../../../constant/StateType";
import FriendItemCellInfo from "../../../datas/FriendItemCellInfo";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { FriendGroupEvent, FriendUpdateEvent, IMEvent } from "../../../constant/event/NotificationEvent";
import IMManager from "../../../manager/IMManager";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import { FriendSocketOutManager } from "../../../manager/FriendSocketOutManager";
import StringUtils from "../../../utils/StringUtils";
import UIManager from "../../../../core/ui/UIManager";
import { EmWindow } from "../../../constant/UIDefine";
import UIButton from '../../../../core/ui/UIButton';
import Utils from "../../../../core/utils/Utils";
import { YTextInput } from "../../common/YTextInput";
import LangManager from "../../../../core/lang/LangManager";
import GameManager from "../../../manager/GameManager";
import ToolInviteInfo from "../../../datas/ToolInviteInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { RecommendInfo } from "../../../datas/RecommendInfo";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/4/27 16:46
 * @ver 1.0
 *
 */
export class FriendWnd extends BaseWindow {
    public c1: fgui.Controller;
    public frame: fgui.GLabel;
    public txt_search: YTextInput;
    public list: fgui.GList;
    public btn_addFriend: UIButton;
    public btn_applyFriend: UIButton;
    public btn_recommend: UIButton;
    public txt_num: fgui.GTextField;

    private _data: ThaneInfo[];

    public modelEnable: boolean = false;

    constructor() {
        super();
    }

    public OnInitWind() {
        super.OnInitWind();
        this.setCenter();
        this.initData();
        this.initView();
        this.initEvent();
        Utils.setDrawCallOptimize(this.list);
    }

    private initData() {
        this._data = [];
    }

    private initView() {
        this.c1 = this.getController("c1");
        this.txt_search.promptText = LangManager.Instance.GetTranslation("InviteWnd.iTxtSearch.text");
        this.txt_search.singleLine = true;
        this.txt_search.fontSize = 22;
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.setVirtual();
    }

    private initEvent() {
        this.c1.on(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
        this.txt_search.on(Laya.Event.INPUT, this, this.onSearch);
        NotificationManager.Instance.addEventListener(FriendUpdateEvent.INVITE_UPDATE, this.__updateInviteView, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.FRIEND_UPDATE, this.__updateList, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.FRIEND_CHANGE, this.__updateList, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.ADD_RECENT_CONTACT, this.__updateList, this);
        // IMManager.Instance.addEventListener(IMEvent.RECEIVE_MSG, this.__receiveIMMsgHandler, this);
        IMManager.Instance.addEventListener(IMEvent.MSG_LIST_DEL, this.__updateList, this);
        // FriendManager.getInstance().addEventListener(FriendGroupEvent.ADD_GROUP, this.__addGroupHandler, this);
        // FriendManager.getInstance().addEventListener(FriendGroupEvent.DEL_GROUP, this.__delGroupHandler, this);
        // FriendManager.getInstance().addEventListener(FriendGroupEvent.RENAME_GROUP, this.__renameGroupHandler, this);
        FriendManager.getInstance().addEventListener(FriendGroupEvent.MOVE_FRIEND, this.__updateList, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.RECENT_CONTACT_UPDATE, this.__recentContactUpdateHandler, this);
        GameManager.Instance.addEventListener(PlayerEvent.SYSTIME_UPGRADE_MINUTE, this.__systimeUpdateHandler, this);
        FriendManager.getInstance().addEventListener(FriendUpdateEvent.UPDATE_RECOMONDLIST, this.__updateRecommendView, this);
    }

    public OnShowWind() {
        super.OnShowWind();

        this.c1.selectedIndex = 0;
        this.__updateList();
        this.__updateInviteView();
        this.__updateRecommendView();
    }

    private renderListItem(index: number, item: FriendItem) {
        item.info = this._data[index];
    }

    private onTabChanged(cc: fgui.Controller) {
        if (UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
            UIManager.Instance.HideWind(EmWindow.ChatItemMenu);
        }
        let onLinelist: FriendItemCellInfo[];
        switch (cc.selectedIndex) {
            case 0:
                //我的好友
                this._data = this.getListByGroupId(FriendGroupId.FRIEND);
                onLinelist = FriendManager.getInstance().getOnlineList(this._data);
                this.txt_num.text = onLinelist.length + "/" + this._data.length;
                this.list.numItems = this._data.length;
                break;
            case 1:
                //最近联系
                this._data = this.getListByGroupId(FriendGroupId.RECENT_CONTACT);
                this.txt_num.text = "" + this._data.length;
                this.list.numItems = this._data.length;
                break;
            case 2:
                //陌生人
                this._data = this.getListByGroupId(FriendGroupId.STRANGER);
                onLinelist = FriendManager.getInstance().getOnlineList(this._data);
                this.txt_num.text = onLinelist.length + "/" + this._data.length;
                this.list.numItems = this._data.length;
                break;
            case 3:
                //黑名单
                this._data = this.getListByGroupId(FriendGroupId.BLACKLIST);
                onLinelist = FriendManager.getInstance().getOnlineList(this._data);
                this.txt_num.text = onLinelist.length + "/" + this._data.length;
                this.list.numItems = this._data.length;
                break;
            case 4:
                //搜索
                this.updateSearchList();
                break;

            default:
                break;
        }
    }

    private getListByGroupId(id: number): ThaneInfo[] {
        let arr: ThaneInfo[] = [];
        switch (id) {
            case FriendGroupId.RECENT_CONTACT:
                arr = FriendManager.getInstance().privatePerson;
                return arr;
            case FriendGroupId.BLACKLIST:
                arr = FriendManager.getInstance().onlineBlacks;
                arr = arr.concat(FriendManager.getInstance().offlineBlacks);
                break;
            default:
                arr = FriendManager.getInstance().getListByGroupIdAndState(id, StateType.NO_LIMIT);
        }
        arr = ArrayUtils.sortOn(arr, ['friendGrade', 'friendGp', 'grades', 'nickName'], [ArrayConstant.NUMERIC | ArrayConstant.DESCENDING, ArrayConstant.NUMERIC | ArrayConstant.DESCENDING, ArrayConstant.NUMERIC | ArrayConstant.DESCENDING, ArrayConstant.CASEINSENSITIVE]);
        //只排序在线和不在线状态,离开等状态不进行排序。
        arr.sort((a, b) => {
            let aValue = a.state == StateType.OFFLINE ? 0 : 1;
            let bValue = b.state == StateType.OFFLINE ? 0 : 1;
            return bValue - aValue;
        })
        return arr;
    }

    private __updateList() {
        this.onTabChanged(this.c1);
    }

    private btn_addFriendClick(e: Laya.Event) {
        UIManager.Instance.ShowWind(EmWindow.AddFriendsWnd);
    }

    private btn_applyFriendClick(e: Laya.Event) {
        UIManager.Instance.ShowWind(EmWindow.FriendInviteWnd);
    }

    private btn_recommendClick(e: Laya.Event) {
        FriendManager.SHOW_RED_DOT = false;
        this.btn_recommend.selfRedDot(0);
        FriendManager.getInstance().dispatchEvent(FriendUpdateEvent.UPDATE_RECOMONDLIST);
        UIManager.Instance.ShowWind(EmWindow.RecommendFriendWnd);
    }

    private __recentContactUpdateHandler() {
        if (this.c1.selectedIndex == 1) {
            this.onTabChanged(this.c1);
        }
    }

    private __systimeUpdateHandler() {
        if ((PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond - FriendManager.getInstance().model.lastReqRecentsTime) > 1800) {
            let privateDataList: Array<ThaneInfo> = FriendManager.getInstance().privatePerson;
            if (privateDataList && privateDataList.length > 0) {
                let userIdList: Array<number> = [];
                let userId: number = 0;
                for (var i = 0; i < privateDataList.length; i++) {
                    userId = privateDataList[i].userId;
                    userIdList.push(userId);
                }
                FriendSocketOutManager.sendReqChatState(userIdList);
                FriendManager.getInstance().model.lastReqRecentsTime = PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;
            }
        }
    }

    private __updateInviteView() {
        let toolInviteFriendList: ToolInviteInfo[] = FriendManager.getInstance().toolInviteFriendList;
        if (toolInviteFriendList && toolInviteFriendList.length > 0) {
            this.btn_applyFriend.enabled = true;
            this.btn_applyFriend.selfRedDot(1, 1);
            this.btn_applyFriend.selfRedDotPos(this.btn_applyFriend.width - 20, 6, true);
        } else {
            this.btn_applyFriend.enabled = false;
            this.btn_applyFriend.selfRedDot(0);
        }
    }

    private __updateRecommendView() {
        let recommendList: RecommendInfo[] = FriendManager.getInstance().recommendList;
        if (recommendList && recommendList.length > 0 && FriendManager.SHOW_RED_DOT) {
            // this.btn_recommend.enabled = true;
            this.btn_recommend.selfRedDot(1, 1);
            this.btn_recommend.selfRedDotPos(this.btn_recommend.width - 20, 6, true);
        } else {
            // this.btn_recommend.enabled = false;
            this.btn_recommend.selfRedDot(0);
        }
    }

    private onSearch(e: Laya.Event = null) {
        let str: string = this.txt_search.text;
        if (!StringUtils.isNullOrEmpty(str)) {
            this.updateSearchList();
            this.c1.selectedIndex = -1;
        } else {
            this.c1.selectedIndex = 0;
        }
    }

    private updateSearchList() {
        let arr: ThaneInfo[] = this.getListByGroupId(FriendGroupId.FRIEND);
        arr = arr.concat(this.getListByGroupId(FriendGroupId.RECENT_CONTACT));
        arr = arr.concat(this.getListByGroupId(FriendGroupId.BLACKLIST));
        arr = arr.concat(this.getListByGroupId(FriendGroupId.STRANGER));
        arr = arr.filter((value, index, array) => {
            return value.nickName.indexOf(this.txt_search.text) != -1
        });
        arr = arr.filter((value, index, array) => array.indexOf(value) === index);
        this._data = arr;
        this.txt_num.text = this._data.length + "";
        this.list.numItems = this._data.length;
    }

    private removeEvent() {
        this.c1.off(fgui.Events.STATE_CHANGED, this, this.onTabChanged);
        this.txt_search.off(Laya.Event.INPUT, this, this.onSearch);
        NotificationManager.Instance.removeEventListener(FriendUpdateEvent.INVITE_UPDATE, this.__updateInviteView, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.FRIEND_UPDATE, this.__updateList, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.FRIEND_CHANGE, this.__updateList, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.ADD_RECENT_CONTACT, this.__updateList, this);
        // IMManager.Instance.removeEventListener(IMEvent.RECEIVE_MSG, this.__receiveIMMsgHandler, this);
        IMManager.Instance.removeEventListener(IMEvent.MSG_LIST_DEL, this.__updateList, this);
        // FriendManager.getInstance().removeEventListener(FriendGroupEvent.ADD_GROUP, this.__addGroupHandler, this);
        // FriendManager.getInstance().removeEventListener(FriendGroupEvent.DEL_GROUP, this.__delGroupHandler, this);
        // FriendManager.getInstance().removeEventListener(FriendGroupEvent.RENAME_GROUP, this.__renameGroupHandler, this);
        FriendManager.getInstance().removeEventListener(FriendGroupEvent.MOVE_FRIEND, this.__updateList, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.RECENT_CONTACT_UPDATE, this.__recentContactUpdateHandler, this);
        GameManager.Instance.removeEventListener(PlayerEvent.SYSTIME_UPGRADE_MINUTE, this.__systimeUpdateHandler, this);
        FriendManager.getInstance().removeEventListener(FriendUpdateEvent.UPDATE_RECOMONDLIST, this.__updateRecommendView, this);

    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._data = null;
        if (UIManager.Instance.isShowing(EmWindow.ChatItemMenu)) {
            UIManager.Instance.HideWind(EmWindow.ChatItemMenu);
        }
        super.dispose(dispose);
    }
}