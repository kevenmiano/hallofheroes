/*
 * @Author: jeremy.xu
 * @Date: 2024-01-26 10:04:34
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-01-26 10:54:31
 * @Description:
 */

import FUI_DebugHelpItem from "../../../../../fui/Debug/FUI_DebugHelpItem";
import { DebugHelpInfo } from "../DebugCfg";

export class DebugHelpItem extends FUI_DebugHelpItem {
  protected onConstruct() {
    super.onConstruct();
  }

  private _info: DebugHelpInfo;
  get info(): DebugHelpInfo {
    return this._info;
  }

  set info(value: DebugHelpInfo) {
    this._info = value;
    if (value) {
      this.txt1.text = value.code;
      this.txt2.text = value.name;
      this.txt3.text = value.example;
      this.txt4.text = value.desc;
    } else {
      this.txt1.text = "";
      this.txt2.text = "";
      this.txt3.text = "";
      this.txt4.text = "";
    }
  }
}
