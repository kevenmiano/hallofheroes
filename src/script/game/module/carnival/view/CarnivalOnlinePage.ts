import FUI_CarnivalOnlinePage from "../../../../../fui/Carnival/FUI_CarnivalOnlinePage";
import LangManager from "../../../../core/lang/LangManager";
import Logger from "../../../../core/logger/Logger";
import Utils from "../../../../core/utils/Utils";
import { t_s_carnivalpointexchangeData } from "../../../config/t_s_carnivalpointexchange";
import { PlayerEvent } from "../../../constant/event/PlayerEvent";
import CarnivalManager from "../../../manager/CarnivalManager";
import GameManager from "../../../manager/GameManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { TempleteManager } from "../../../manager/TempleteManager";
import CarnivalModel from "../model/CarnivalModel";
import { CarnivalBasePage } from "./CarnivalBasePage";
import CarnivalOnlinePageItem from "./CarnivalOnlinePageItem";

/**
 * 嘉年华---在线奖励
 */
export default class CarnivalOnlinePage extends FUI_CarnivalOnlinePage implements CarnivalBasePage {


    private tempList: t_s_carnivalpointexchangeData[];

    protected onConstruct(): void {
        super.onConstruct();
        this.addEvent();
        this.init();
    }

    addEvent() {
        this.itemlist.itemRenderer = Laya.Handler.create(this, this.renderPageItem, null, false);
        Laya.stage.timerLoop(6000, this, this.onSysTimeUpdate);
    }

    offEvent() {
        // this.itemlist.itemRenderer && this.itemlist.itemRenderer.recover();
        Utils.clearGListHandle(this.itemlist);
        Laya.stage.clearTimer(this, this.onSysTimeUpdate);
    }

    onShow() {
        Logger.info("CarnivalOnlinePage:onShow");
        this.refreshView();
    }

    private init() {
        // this.itemlist.setVirtual();
        this.tempList = TempleteManager.Instance.getCarnivalByType(CarnivalModel.TYPE_ONLINE);
        this.itemlist.numItems = this.tempList.length;
        //
        this.refreshView();
    }

    private renderPageItem(index: number, box: CarnivalOnlinePageItem) {
        if (box && !box.isDisposed) {
            box.index = index;
            box.info = this.tempList[index];
            let onLineTimes: number = (new Date().getTime() - this.model.openFrameTime) / 1000 / 60;
            onLineTimes += this.model.dayOnline;
            box.refreshView(parseInt(onLineTimes.toString()));
        }
    }

    private onSysTimeUpdate() {
        this.refreshView();
    }

    private refreshView(op: number = -1): void {
        let sysTime = new Date();
        if (op == CarnivalManager.OP_OPEN) {
            this.model.openFrameTime = sysTime.getTime();
        }
        var onLineTimes: number = (sysTime.getTime() - this.model.openFrameTime) / 1000 / 60;
        onLineTimes += this.model.dayOnline;
        //在线
        this.carnival_online.type.selectedIndex = 3;
        this.carnival_online.txt_title.text = LangManager.Instance.GetTranslation("carnival.onLineTitle");
        this.carnival_online.txt_value.text = LangManager.Instance.GetTranslation("carnival.onLineTime", parseInt(onLineTimes.toString()));
        this.carnival_online.ensureSizeCorrect();
        //重置
        this.carnival_reset.type.selectedIndex = 1;
        this.carnival_reset.txt_title.text = LangManager.Instance.GetTranslation("carnival.today.reset");
        this.carnival_reset.txt_value.text = "";
        this.carnival_reset.ensureSizeCorrect();

        if (this.tempList)
            this.itemlist.numItems = this.tempList.length;
    }

    protected get model(): CarnivalModel {
        return CarnivalManager.Instance.model;
    }

    onHide() {
        Logger.info("CarnivalOnlinePage:onHide");
    }

    onDestroy() {
        Logger.info("CarnivalOnlinePage:onDestroy");
        this.offEvent();
    }

    onUpdate(data: any) {
        Logger.info("CarnivalAwardPointPage:onUpdate-", data);
        this.refreshView();
    }

}