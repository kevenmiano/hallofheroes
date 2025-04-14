/*
 * @Author: jeremy.xu
 * @Date: 2024-01-26 10:33:24
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 18:20:57
 * @Description:
 */

import { EmWindow } from "../../constant/UIDefine";

export enum EmDebugCode {
  ChangeLv = "lv",
  ChangeStatusBar = "statusBar",
  SdkEvent = "sdkEvent",
  AutoShowDebug = "autoShowDebug",
}

export class QuickOpenFrameInfo {
  type: EmWindow;
  name: string;
  frameData: any;
  desc: string;
  /** 依赖外部数据 只能看界面  数据需要自己模拟 */
  isDataDependent: boolean;
  constructor(
    type: EmWindow,
    name: string,
    frameData?: any,
    desc?: string,
    isDataDependent?: boolean,
  ) {
    this.type = type;
    this.name = name;
    this.frameData = frameData;
    this.desc = desc;
    this.isDataDependent = isDataDependent;
  }
}

export class DebugHelpInfo {
  code: string;
  name: string;
  example: string;
  desc: string;
  constructor(code: string, name: string, example: string, desc: string) {
    this.code = code;
    this.name = name;
    this.example = example;
    this.desc = desc;
  }
}
