import FUI_LoginMethod from "../../../../../fui/Login/FUI_LoginMethod";
import { Func } from "../../../../core/comps/Func";
import LangManager from "../../../../core/lang/LangManager";
import Utils from "../../../../core/utils/Utils";
import { LoginWay } from "../../../constant/LoginWay";
import LoginMethodItem from "./LoginMethodItem";

/**
 * 登陆方式
 */
export class LoginMethod extends FUI_LoginMethod {

    private listTileString: string = "Login.LoginWay.title";

    private listFullKey: Map<number, number[][]> = new Map();

    private keyIndex:Map<number,number> = new Map();

    private currType: number = 0;

    private currList1: number[] = [];
    private currList2: number[] = [];

    private handlerCall: Func;

    onInit(func?: Func) {
        this.handlerCall = func;
        this.listFullKey = new Map();

        this.keyIndex = new Map();
        this.keyIndex.set(LoginWay.Type_7ROAD,0);
        this.keyIndex.set(LoginWay.Type_GG,1);
        this.keyIndex.set(LoginWay.Type_FB,2);
        this.keyIndex.set(LoginWay.Type_GUEST,3);
        this.keyIndex.set(LoginWay.Type_Apple,4);

        if (this.isIos) {
            this.listFullKey.set(0, [[
                LoginWay.Type_7ROAD,
                LoginWay.Type_FB
            ],[
                LoginWay.Type_Apple,
                LoginWay.Type_GG,
                LoginWay.Type_GUEST
            ]])
        } else {
            this.listFullKey.set(0, [[
                LoginWay.Type_7ROAD,
                LoginWay.Type_GG,
            ],[
                LoginWay.Type_FB,
                LoginWay.Type_GUEST
            ]])
        }
        this.listFullKey.set(1, [[
            LoginWay.Type_7ROAD
        ]])
        this.offEvent();
        this.addEvent();
    }

    private get isIos():boolean {
        return Utils.isIOS();
    }

    setItems(type: number = 0) {
        this.currType = type;
        let listData1 = this.listFullKey.get(type);
        this.currList1 = listData1[0];
        this.list1.numItems = this.currList1.length;
        this.list1.ensureBoundsCorrect();

        if(type == 0) {
            this.currList2 = listData1[1];
            this.list2.numItems = this.currList2.length;
        } else {
            this.list2.numItems = 0;
        }
        this.list2.visible = this.list2.numItems > 0;
        this.list2.ensureBoundsCorrect();
        this.group.ensureBoundsCorrect();
    }

    addEvent() {
        this.list1.itemRenderer = Laya.Handler.create(this, this.renderListItem1, null, false);
        this.list1.on(fairygui.Events.CLICK_ITEM, this, this._onSelectedItem);
        this.list2.itemRenderer = Laya.Handler.create(this, this.renderListItem2, null, false);
        this.list2.on(fairygui.Events.CLICK_ITEM, this, this._onSelectedItem);
    }

    offEvent() {
        this.list1 && this.list1.off(fairygui.Events.CLICK_ITEM, this, this._onSelectedItem);
        this.list2 && this.list2.off(fairygui.Events.CLICK_ITEM, this, this._onSelectedItem);
        Utils.clearGListHandle(this.list1);
        Utils.clearGListHandle(this.list2);
    }

    private renderListItem1(index: number, item: LoginMethodItem) {
        if (item && !item.isDisposed) {
            item.key = this.currList1[index];
            item.index = this.keyIndex.get(item.key);
            item.titleName = LangManager.Instance.GetTranslation(this.listTileString + item.key);
        }
    }

    private renderListItem2(index: number, item: LoginMethodItem) {
        if (item && !item.isDisposed) {
            item.key = this.currList2[index];
            item.index = this.keyIndex.get(item.key);
            item.titleName = LangManager.Instance.GetTranslation(this.listTileString + item.key);
        }
    }

    private _onSelectedItem(item: LoginMethodItem) {
        let key = item.key;
        this.handlerCall && this.handlerCall.Invoke(Number(key));
    }

    dispose(): void {
        this.offEvent();
        super.dispose()
    }

}