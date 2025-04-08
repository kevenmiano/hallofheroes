// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2023-03-17 15:32:58
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-10-16 17:28:48
 * @Description: 
 */

import Logger from "../../../../core/logger/Logger";
import Utils from "../../../../core/utils/Utils";
import { NotificationEvent } from "../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../manager/NotificationManager";
import NewbieModule from "../NewbieModule";
import AutoNewbieBase from "./AutoNewbieBase";
import AutoNewbieQQ from "./AutoNewbieQQ";

export default class AutoNewbieMgr {
    private static _instance: AutoNewbieMgr;
    public static get Instance(): AutoNewbieMgr {
        return this._instance ? this._instance : this._instance = new AutoNewbieMgr();
    }

    private _open: boolean = true;
    public autoNewbie: AutoNewbieBase = new AutoNewbieBase();
    public cancelFunc: Function;
    public delayTime: number = 100;
    public timeCounter: number = 0;

    // 是否打开了对话框
    public showingDialog: boolean = false;
    // 正在执行自动对话
    public executingAutoDialog: boolean = false;
    // 正在执行自动寻路
    public executingAutoPath: boolean = false;

    public setup() {
        if (Utils.isQQHall()) {
        // if (true) {
            this.autoNewbie = new AutoNewbieQQ();
        }

        Logger.info("###启动" + this.autoNewbie.channelName + "自动新手引导！！！")
        this.addEvent()
    }

    public dispose() {
        this.removeEvent();
    }

    private addEvent() {
        Laya.timer.loop(this.delayTime, this, this.onLoop);
        Laya.stage.on(Laya.Event.CLICK, this, this.onClickStage);
        NotificationManager.Instance.on(NotificationEvent.SWITCH_SCENE, this.onSwitchScene, this);
        this.autoNewbie.addEvent()
    }

    private removeEvent() {
        this.autoNewbie.removEvent()
        Laya.timer.clear(this, this.onLoop);
        Laya.stage.off(Laya.Event.CLICK, this, this.onClickStage);
        NotificationManager.Instance.off(NotificationEvent.SWITCH_SCENE, this.onSwitchScene, this);
    }

    private onLoop() {
        if (!this.open) {
            this.dispose();
            return;
        }

        if (this.timeCounter % 1000 == 0) {
            this.autoNewbie.processFunc(this.timeCounter)
        }
        this.timeCounter += this.delayTime
        if (this.timeCounter >= this.autoTimeMs) {
            this.timeCounter = 0;
            this.autoNewbie.processEndFunc()
        }
    }

    private onClickStage() {
        this.reset()
    }

    private onSwitchScene() {
        this.reset()
    }

    public showAllTip(b: boolean) {
        this.autoNewbie.showAllTip(b)
    }

    public onDialogShow() {
        this.showingDialog = true;
        this.reset();
    }

    public onDialogHide() {
        this.showingDialog = false;
        this.reset();
    }

    public reset() {
        this.timeCounter = 0;
        this.executingAutoPath = false;
        this.executingAutoDialog = false;
    }


    public get open(): boolean {
        return this._open && this.autoNewbie.open
    }

    public get autoDialogue(): boolean {
        return this.open && this.autoNewbie.autoDialogue
    }

    public get autoTime() {
        return this.autoNewbie.autoTime
    }

    public get autoTimeMs() {
        return this.autoNewbie.autoTimeMs
    }

    // 自动执行下一步的提示
    public getAutoExecTip(time?: number) {
        if (!time) return "";
        if (!this.open) return "";
        return this.autoNewbie.getAutoExecTip(time);
    }

    // 自动对话的提示
    public getAutoDialogueTip(time?: number) {
        if (!time) return "";
        if (!this.autoDialogue) return "";
        return this.autoNewbie.getAutoDialogueTip(time);
    }
}