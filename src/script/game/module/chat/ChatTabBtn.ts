import FUI_ChatTabBtn from '../../../../fui/Chat/FUI_ChatTabBtn';
import ChatTabData from './data/ChatTabData';
/**
* @author:pzlricky
* @data: 2021-04-29 14:48
* @description 聊天Tab按钮
*/
export default class ChatTabBtn extends FUI_ChatTabBtn {

    private _itemData: ChatTabData;

    public titleDefault: fgui.GTextField;
    public titleSelect: fgui.GTextField;
    public redPoint: fgui.GImage;

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
    }

    set ItemData(value) {
        if (!value) return;
        this._itemData = value;
        this.titleDefault.text = this.titleSelect.text = value.channelText;
        this.redPoint.visible = value.hasNewMessage;
    }

    get ItemData() {
        return this._itemData;
    }

}