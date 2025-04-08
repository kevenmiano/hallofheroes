import BaseWindow from '../../core/ui/Base/BaseWindow';
/**
* @author:pzlricky
* @data: 2022-01-17 17:07
* @description *** 
*/
export default class BaseTips extends BaseWindow {

    constructor() {
        super();
        this.onClickEvent();
    }

    protected onClickEvent() {
        
    }

    protected onInitClick() {
        this.on(Laya.Event.CLICK, this, this.OnClickModal);
    }

}