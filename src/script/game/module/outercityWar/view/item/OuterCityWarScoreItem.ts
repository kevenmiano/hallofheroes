/*
 * @Author: jeremy.xu
 * @Date: 2023-10-27 16:07:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-11-14 17:24:15
 * @Description: 主界面公会积分Item
 */

import FUI_OuterCityWarScoreItem from "../../../../../../fui/OuterCityWar/FUI_OuterCityWarScoreItem";
import { OuterCityWarGuildInfo } from "../../model/OuterCityWarGuildInfo";


export default class OuterCityWarScoreItem extends FUI_OuterCityWarScoreItem {
    public _sonType: number;
    public set sonType(v: number) {
        this._sonType = v
    }
    public get sonType(): number {
        return this._sonType;
    }

    private _info: OuterCityWarGuildInfo;
    public set info(value: OuterCityWarGuildInfo) {
        this._info = value;
        this.refreshView();
    }

    public get info(): OuterCityWarGuildInfo {
        return this._info
    }

    public refreshView() {
        if (this._info) {
            this.txtName.text = this._info.guildName;
            this.txtScore.text = this._info.guildScore.toString();
            this.imgScore.visible = true;
        } else {
            this.txtName.text = "";
            this.txtScore.text = "";
            this.imgScore.visible = false;
        }
    }
}