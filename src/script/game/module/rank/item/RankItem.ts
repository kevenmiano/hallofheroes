/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-11 10:32:46
 * @LastEditTime: 2023-07-10 12:10:59
 * @LastEditors: jeremy.xu
 * @Description: 
 */

import FUI_RankItemR5 from "../../../../../fui/Base/FUI_RankItemR5";
import { RankIndex } from "../../../constant/RankDefine";
import { EmPackName } from "../../../constant/UIDefine";
import RankData, { RankItemData } from "../RankData";

// 继承自最长列数的
export default class RankItem extends FUI_RankItemR5 {
    private _info: RankItemData;
    private _titleColorList: Array<string>;
    private _titleBg: string = fgui.UIPackage.getItemURL(EmPackName.Base, "Tab_Menu1_Title1")
    public rankIndex: RankIndex = RankIndex.RankItemR3

    onConstruct() {
        super.onConstruct()

    }

    public set titleColorList(value: Array<string>) {
        this._titleColorList = value;
        for (let index = 0; index < this._info.datalist.length; index++) {
            if (this["txt" + (index + 1)]) {
                (this["txt" + (index + 1)] as fgui.GLabel).color = value.length == 1 ? value[0] : value[index];
            }
        }
    }

    public set info(data: RankItemData) {
        this._info = data
        this.imgRank.url = ""
        if (data) {
            for (let index = 0; index < data.datalist.length; index++) {
                if (this["txt" + (index + 1)]) {
                    this["txt" + (index + 1)].text = data.datalist[index]
                }
                let rank = Number(data.datalist[0])
                if (rank) {
                    this["txt1"].visible = rank > 3
                    if (rank <= 3) {
                        this.imgRank.url = fgui.UIPackage.getItemURL(EmPackName.Base, RankData.RankRes[rank - 1])
                    }
                }
            }
        }
    }

    public get info() {
        return this._info
    }

    public set titleBg(value: string) {
        if (value) {
            this._titleBg = value
        }
        this.icon = this._titleBg
    }
}