import { DebugHelpInfo, EmDebugCode } from "../DebugCfg"

/*
 * @Author: jeremy.xu
 * @Date: 2024-01-25 18:35:37
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-26 14:58:42
 * @Description: 
 */
export class DebugHelpModel {
    dataList: DebugHelpInfo[]
    
    constructor() {
        this.dataList = [
            new DebugHelpInfo(EmDebugCode.ChangeLv, "修改等级", "lv,50","并不真正修改，只是模拟派发事件"),
            new DebugHelpInfo(EmDebugCode.ChangeStatusBar, "模拟手机状态栏改变", "statusBar,50,50", "PC端模拟手机两边留空"),
            new DebugHelpInfo(EmDebugCode.SdkEvent, "SDK事件模拟", "待完善...",""),
            new DebugHelpInfo(EmDebugCode.AutoShowDebug, "通过Debug打开的窗口关闭时是否打开Debug", "autoShowDebug,1",""),
        ] 
    }
}