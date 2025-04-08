// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-01-25 15:28:08
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-25 16:30:24
 * @Description: 全面屏窗口背景通用框
 */

import FUI_CommonFrame from "../../../../fui/Base/FUI_CommonFrame";
import Resolution from "../../../core/comps/Resolution";
import { NativeEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";

export class CommonFrame extends FUI_CommonFrame {
    protected onConstruct() {
        super.onConstruct();
        this.addEvent();
        this.onAfterStatusBarChange();
    }

    addEvent(){
        NotificationManager.Instance.addEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this); 
    }

    removeEvent(){
        NotificationManager.Instance.removeEventListener(NativeEvent.AFTER_STATUS_BAR_CHANGE, this.onAfterStatusBarChange, this);
    }

    onAfterStatusBarChange() {
        if (this.phFixL) {
            this.phFixL.width = Resolution.deviceStatusBarHeightL;
        }
    }

    dispose(){
        this.removeEvent();
    }
}