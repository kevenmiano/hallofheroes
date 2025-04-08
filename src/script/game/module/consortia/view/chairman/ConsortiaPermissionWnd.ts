// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-07-20 20:31:46
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-07-26 16:08:07
 * @Description: 公会权限一览 v2.46 ConsortiaPermissionFrame
 */
import BaseWindow from "../../../../../core/ui/Base/BaseWindow";
import { ConsortiaControler } from "../../control/ConsortiaControler";
import { ConsortiaModel } from "../../model/ConsortiaModel";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../../constant/UIDefine";
import { ConsortiaDutyInfo } from "../../data/ConsortiaDutyInfo";
import { ConsortiaDutyLevel } from "../../data/ConsortiaDutyLevel";

export class ConsortiaPermissionWnd extends BaseWindow {

    private _contorller: ConsortiaControler;
    private _data: ConsortiaModel;
    private _dataList: any[] = [];
    private itemlist: fgui.GList;

    public OnInitWind() {
        super.OnInitWind();

        this.initData();
        this.initEvent();
        this.initView();
        this.setCenter();
    }

    private initEvent() {
        // this._data.addEventListener(ConsortiaEvent.UPDA_CONSORTIA_RIGHTS, this.__onConsortiaDutyInfoUpdata, this);
        this.itemlist.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);
    }

    private initData() {
        this._contorller = FrameCtrlManager.Instance.getCtrl(EmWindow.Consortia) as ConsortiaControler;
        this._data = this._contorller.model;
    }

    private initView() {
        this.refreshView()
    }

    public OnShowWind() {
        super.OnShowWind();

    }

    public OnHideWind() {
        super.OnHideWind();

        this.removeEvent();
    }

    private __onConsortiaDutyInfoUpdata() {
        this.refreshView()
    }

    private __renderListItem(index: number, item: fgui.GComponent) {
        if (this._dataList.length === 0) return
        let itemData = this._dataList[index]
        if (!itemData) {
            item.getChild("title1").asLabel.text = ""
            item.getController("state2").selectedIndex = 0
            item.getController("state3").selectedIndex = 0
            item.getController("state4").selectedIndex = 0
            item.getController("state5").selectedIndex = 0
            return
        }

        item.getChild("title1").asLabel.text = itemData[0]
        item.getController("state2").selectedIndex = itemData[1]
        item.getController("state3").selectedIndex = itemData[2]
        item.getController("state4").selectedIndex = itemData[3]
        item.getController("state5").selectedIndex = itemData[4]
    }

    private refreshView() {
        let tmp = []
        for (let index = 0; index < ConsortiaDutyLevel.dutyOpenNameList.length; index++) {
            const dutyName = ConsortiaDutyLevel.dutyOpenNameList[index];
            if (!tmp[index]) {
                tmp[index] = []
            }
            tmp[index].push(dutyName)
        }

        for (const key in this._data.consortiaDutyList) {
            if (Object.prototype.hasOwnProperty.call(this._data.consortiaDutyList, key)) {
                const dInfo: ConsortiaDutyInfo = this._data.consortiaDutyList[key];
                let pos = ConsortiaDutyLevel.showDutyList.indexOf(dInfo.levels)
                if (pos >= 0) {
                    tmp[0][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.USESKILL) ? 1 : 0
                    tmp[1][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.UPDATESKILL) ? 1 : 0
                    tmp[2][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.PASSINVITE) ? 1 : 0
                    tmp[3][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.KICKMEMBER) ? 1 : 0
                    tmp[4][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.CHANGEDUTY) ? 1 : 0
                    tmp[5][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.SPEAK) ? 1 : 0
                    tmp[6][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.SPEAK) ? 1 : 0
                    tmp[7][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.TRANSFER) ? 1 : 0
                    tmp[8][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.RENAME) ? 1 : 0
                    tmp[9][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.MOIDIFYBBS) ? 1 : 0
                    tmp[10][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.LEVEL) ? 1 : 0
                    tmp[11][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.CALL_TREE) ? 1 : 0
                    tmp[12][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.CALL_BOSS) ? 1 : 0
                    tmp[13][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.STACKHEAD_SIGNIN) ? 1 : 0
                    tmp[14][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.STACKHEAD_EDITNOTICE) ? 1 : 0
                    tmp[15][pos + 1] = dInfo.getRightsByIndex(ConsortiaDutyInfo.STACKHEAD_SENIORGENERAL) ? 1 : 0
                }
            }
        }
        this._dataList = tmp
        this.itemlist.numItems = ConsortiaDutyLevel.dutyOpenNameList.length
    }


    private removeEvent() {
        // this._data.removeEventListener(ConsortiaEvent.UPDA_CONSORTIA_RIGHTS, this.__onConsortiaDutyInfoUpdata, this);
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
    }
}