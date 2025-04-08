/*
 * @Author: jeremy.xu
 * @Date: 2021-05-31 10:54:31
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-30 20:49:47
 * @Description: 用来触发显示tip
 */

import FUI_CommonTipItem from "../../../../fui/Base/FUI_CommonTipItem";
import { EmWindow } from "../../constant/UIDefine";
import { ToolTipsManager } from "../../manager/ToolTipsManager";
import { ITipedDisplay, TipsShowType } from "../../tips/ITipedDisplay";


export default class CommonTipItem extends FUI_CommonTipItem implements ITipedDisplay {
    tipType: EmWindow = EmWindow.CommonTips;
    tipData: any;
    showType?: TipsShowType;
    canOperate?: boolean;
    extData?: any;
    startPoint: Laya.Point = new Laya.Point(0, 0);
    tipDirctions?: string;
    tipGapV?: number;
    tipGapH?: number;

    private _info: any;
    public set info(data: any) {
        this._info = data
        if (data) {
            ToolTipsManager.Instance.register(this);
            this.tipData = data
        }
    }

    public get info() {
        return this._info
    }

    public dispose() {
        ToolTipsManager.Instance.unRegister(this);
        super.dispose();
    }
}