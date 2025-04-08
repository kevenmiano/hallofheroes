// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2024-01-26 10:04:34
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 18:21:18
 * @Description: 
 */

import FUI_QuickOpenFrameItem from "../../../../../fui/Debug/FUI_QuickOpenFrameItem";
import { QuickOpenFrameInfo } from "../DebugCfg";

export class QuickOpenFrameItem extends FUI_QuickOpenFrameItem {
    protected onConstruct() {
        super.onConstruct();
    }

    private _info: QuickOpenFrameInfo
    get info(): QuickOpenFrameInfo {
        return this._info;
    }

    set info(value: QuickOpenFrameInfo) {
        this._info = value;
        this.txt1.color = value.isDataDependent ? "#FF0000" : "#FFECC6"
        if (value) {
            this.txt1.text = value.name
        } else {
            this.txt1.text = ""
        }
    }
}