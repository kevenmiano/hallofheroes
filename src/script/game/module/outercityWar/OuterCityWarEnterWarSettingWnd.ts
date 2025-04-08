// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-10-24 19:52:55
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-12-28 14:56:00
 * @Description: 参战资格列表设置界面
 */

import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow";
import { OuterCityWarManager } from "./control/OuterCityWarManager";
import { OuterCityWarModel } from "./model/OuterCityWarModel";
import ColorConstant from "../../constant/ColorConstant";
import OuterCityWarEnterWarSettingItem from "./view/item/OuterCityWarEnterWarSettingItem";
import { BooleanType } from "../../constant/Const";
import { OuterCityWarEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityWarPlayerInfo } from "./model/OuterCityWarPlayerInfo";
import SortTools, { ArraySort } from "../../../core/utils/SortTools";

export default class OuterCityWarBattleSettingWnd extends BaseWindow {
    protected resizeContent: boolean = true;
    protected setScenterValue: boolean = true;
    private list: fgui.GList;
    private tfBattleCnt: fgui.GRichTextField;
    private txtJob: fgui.GTextField;
    private txtNickName: fgui.GTextField;
    private txtGrade: fgui.GTextField;
    private txtCapaity: fgui.GTextField;
    private txtState: fgui.GTextField;
    private playerInfoList: OuterCityWarPlayerInfo[]

    public OnInitWind() {
        super.OnInitWind();
        this.initView();
    }

    public OnShowWind() {
        super.OnShowWind();
        this.addEvent();
        this.refreshView();
    }

    private addEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onRenderListItem, null, false);
        NotificationManager.Instance.addEventListener(OuterCityWarEvent.ALL_BUILD_INFO, this.__allBuildInfo, this)
    }

    private removeEvent() {
        NotificationManager.Instance.removeEventListener(OuterCityWarEvent.ALL_BUILD_INFO, this.__allBuildInfo, this)
    }

    private initView() {
        this.txtFrameTitle.text = LangManager.Instance.GetTranslation("public.battle.enterBattleList")
        this.txtJob.text = LangManager.Instance.GetTranslation("public.playerInfo.job")
        this.txtNickName.text = LangManager.Instance.GetTranslation("public.playerInfo.nickName")
        this.txtGrade.text = LangManager.Instance.GetTranslation("public.grade")
        this.txtCapaity.text = LangManager.Instance.GetTranslation("public.playerInfo.compositeCapaity")
        this.txtState.text = LangManager.Instance.GetTranslation("public.playerInfo.battleState")
    }

    private __allBuildInfo() {
        this.refreshView();
    }

    private refreshView() {
        this.refreshPlayerInfoList()
        if (this.playerInfoList) {
            this.list.numItems = this.playerInfoList.length
        }

        // 在此城堡公会参战人数/总公会人数
        let cur = this.fightModel.getGuildPlayerCnt(this.fightModel.selfGuildId, false, BooleanType.TRUE)
        let total = this.fightModel.getGuildPlayerCnt(this.fightModel.selfGuildId, false)
        let str = LangManager.Instance.GetTranslation("public.diagonalSign", cur, total)
        this.tfBattleCnt.text = LangManager.Instance.GetTranslation("public.battle.enterWarCnt", ColorConstant.LIGHT_TEXT_COLOR, str)
    }

    private onRenderListItem(index: number, item: OuterCityWarEnterWarSettingItem) {
        item.info = this.playerInfoList[index]
        let hasDuty = this.fightModel.getAttackDuty(this.fightModel.selfUserId)
        item.cType.setSelectedIndex(hasDuty ? 1 : 0)
    }

    private get fightModel(): OuterCityWarModel {
        return OuterCityWarManager.Instance.model;
    }

    private refreshPlayerInfoList(){
        this.playerInfoList = this.fightModel.getGuildPlayerInfoList(this.fightModel.selfGuildId)
        // 排序优先级：（1）是否在线（2）综合战力
        SortTools.MoreKeysSorter(this.playerInfoList, ["onlineSortWeight", "totalCapaity"], [ArraySort.LOWER, ArraySort.LOWER])
    }

    public OnHideWind() {
        this.removeEvent();
        super.OnHideWind();
    }
}