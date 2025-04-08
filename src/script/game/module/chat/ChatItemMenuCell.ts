// @ts-nocheck
import FUI_ChatOerateBtn from '../../../../fui/Chat/FUI_ChatOerateBtn';
/**
* @author:pzlricky
* @data: 2021-06-07 21:05
* @description *** 
*/
export default class ChatItemMenuCell extends FUI_ChatOerateBtn {

    private _cellData;
    private _index: number = 0;

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
    }

    set itemdata(value) {
        this._cellData = value;
        this._index = value.index;
        this.btn.text = value.text;
    }

    get index(): number {
        return this._index;
    }

    get itemdata() {
        return this._cellData;
    }

}