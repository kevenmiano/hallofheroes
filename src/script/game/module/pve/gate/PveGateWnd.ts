/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-05-10 10:32:05
 * @LastEditTime: 2024-04-07 16:03:02
 * @LastEditors: jeremy.xu
 * @Description: 战役入口
 */

import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import OpenGrades from "../../../constant/OpenGrades";
import { EmWindow } from "../../../constant/UIDefine";
import { ArmyManager } from "../../../manager/ArmyManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import PveGateItem from "./PveGateItem";

export type PveGateListData = {
    title: string,
    desc: string,
    locked: boolean,
    emWnd: EmWindow,
    icon: string,
}

export default class PveGateWnd extends BaseWindow {
    public list: fgui.GList;
    private pveGateData: PveGateListData[] = [];
    protected setScenterValue = true; 

    /**界面打开 */
    OnShowWind() {
        super.OnShowWind();
        this.initData();
        this.initView();
    }

    /**关闭界面 */
    OnHideWind() {
        super.OnHideWind();
    }


    private initData() {
        let grade = ArmyManager.Instance.thane.grades
        this.pveGateData = [
            {
                title: LangManager.Instance.GetTranslation("Pve.campaignTitle"),
                desc: grade < OpenGrades.PVE_CAMPAIGN ? LangManager.Instance.GetTranslation("funpreview.openLevelTxt", OpenGrades.PVE_CAMPAIGN) : "",
                locked: grade < OpenGrades.PVE_CAMPAIGN,
                emWnd: EmWindow.PveCampaignWnd,
                icon: "Img_battle01"
            },
            {
                title: LangManager.Instance.GetTranslation("Pve.mazeTitle"),
                desc: grade < OpenGrades.MAZE ? LangManager.Instance.GetTranslation("funpreview.openLevelTxt", OpenGrades.MAZE) : "",
                locked: grade < OpenGrades.MAZE,
                emWnd: EmWindow.MazeFrameWnd,
                icon: "Img_maze01"
            },
            {
                title: LangManager.Instance.GetTranslation("Pve.secretTitle"),
                desc: grade < OpenGrades.PVE_SECRET ? LangManager.Instance.GetTranslation("funpreview.openLevelTxt", OpenGrades.PVE_SECRET) : "",
                locked: grade < OpenGrades.PVE_SECRET,
                emWnd: EmWindow.PveSecretWnd,
                icon: "Img_Mystic"
            },
            {
                title: LangManager.Instance.GetTranslation("Pve.multiSecretTitle"),
                desc: LangManager.Instance.GetTranslation("public.openTip.comingSoon"),
                locked: true,
                emWnd: EmWindow.PveMultiSecretWnd,
                icon: "Img_Mystic_Multi"
            }
        ]
    }

    private initView() {
        this.list.itemRenderer = Laya.Handler.create(this, this.onItemRender, null, false);
        this.list.on(fgui.Events.CLICK_ITEM, this, this.onClickItem);
        this.list.on(fgui.Events.DRAG_END, this, this.onDropItem);
        this.list.on(Laya.Event.MOUSE_OUT, this, this.onDropItem);
        
        this.list.numItems = this.pveGateData.length;
    }


    private onItemRender(index: number, item: PveGateItem) {
        item.info = this.pveGateData[index];
    }

    private onDropItem() {
        for (let index = 0; index < this.list.numItems; index++) {
            const item = this.list.getChildAt(index) as PveGateItem;
            item.imgSelected.visible = false;
        }
    }

    private onClickItem(item: PveGateItem) {
        let info = item.info;
        if (!info) return
        if (item.locked) return;
        if (info.emWnd==EmWindow.PveMultiSecretWnd) {
            MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("TopToolBar.openTips"));
        } else {
            FrameCtrlManager.Instance.open(info.emWnd, { returnToWin: EmWindow.PveGate }, null, EmWindow.PveGate);
        }
    }
}