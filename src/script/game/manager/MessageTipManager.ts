// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-20 10:09:35
 * @LastEditTime: 2024-02-01 15:12:49
 * @LastEditors: jeremy.xu
 * @Description: 简单游戏中的简单飘字提示 
 */

import Resolution from "../../core/comps/Resolution";
import LayerMgr from "../../core/layer/LayerMgr";
import { EmLayer } from "../../core/ui/ViewInterface";
import { SceneManager } from "../map/scene/SceneManager";
import SceneType from "../map/scene/SceneType";
import { EmPackName } from "../constant/UIDefine";
import FUI_MessageLabel from "../../../fui/BaseInit/FUI_MessageLabel";

export class MessageTipManager {

    private static _instance: MessageTipManager;
    //起始点
    private defaultPoint: Laya.Point;
    //对象池
    private pool: MessageTipLab[];
    //缓存数量  1400/(8*16) =11。界面最多停留的Tips不超过12个。
    private poolCount = 12;
    //消息列表
    private messageList: { msg: string, callBack?: Function }[];
    //正在展示消息
    private showingMsgView: MessageTipLab[];
    //消息的展示间隔 帧
    private tickUpdater = 8;
    //帧计数器
    private tickCounter = 0;
    //y 轴距离
    private pad = 42;
    //y 轴时间
    private padDuration = 80;
    //渐显时间
    private showAlphaDuration = 200;
    //渐隐时间
    private hideAlphaDuration = 200;
    //停留时间
    private showTime = 1000;

    private constructor() {
        this.defaultPoint = new Laya.Point(Resolution.gameWidth / 2, Resolution.gameHeight / 2);
        this.showingMsgView = [];
        this.messageList = [];
        this.initPool();
        Laya.timer.frameLoop(1, this, this.frameLoop);
    }

    private initPool() {
        this.pool = [];
        for (let i = 0; i < this.poolCount; i++) {
            this.pool.push(MessageTipLab.createInstance());
        }
    }

    private getTipLab() {
        let tipLab = this.pool.pop();
        if (!tipLab) {
            tipLab = MessageTipLab.createInstance()
        }
        return tipLab;
    }

    private returnTipLab(tipLab: MessageTipLab) {
        if (this.pool.length >= this.poolCount) return;
        this.pool.push(tipLab);
    }

    public static get Instance(): MessageTipManager {
        if (this._instance == null) {
            this._instance = new MessageTipManager();
        }
        return this._instance;
    }

    private frameLoop() {
        if (this.messageList.length <= 0) {
            return;
        }
        this.tickCounter++;
        if (this.tickCounter < this.tickUpdater) return;
        this.tickCounter = 0;
        this.updateShowing();
        this.aninationMsg(this.popMessage());
    }

    public show(str: string, callBack?: Function, force:boolean = false) {
        if (!str || (!force && SceneManager.Instance.currentType == SceneType.BATTLE_SCENE)) {
            callBack && callBack();
            return;
        }
        this.messageList.push({ msg: str, callBack: callBack });

        if (this.showingMsgView.length > 0) {
            return;
        }
        this.aninationMsg(this.popMessage());      
    }


    private updateShowing() {
        let pos = 1;
        let length = this.showingMsgView.length + 1;
        for (let msgView of this.showingMsgView) {
            Laya.Tween.to(msgView, { y: this.defaultPoint.y - (length - pos) * this.pad }, this.padDuration, Laya.Ease.linearIn);
            pos++;
        }
    }

    private popMessage() {
        if (this.messageList.length == 0) return;
        let message = this.messageList.shift();
        let messageView = this.getTipLab();
        messageView.message = message;
        return messageView;
    }

    private aninationMsg(msgView: MessageTipLab) {
        if (!msgView) return;
        this.showingMsgView.push(msgView);

        msgView.alpha = 0;
        msgView.x = this.defaultPoint.x;
        msgView.y = this.defaultPoint.y;

        LayerMgr.Instance.addToLayer(msgView, EmLayer.STAGE_TIP_LAYER);
        //渐显
        Laya.Tween.to(msgView, { alpha: 1 }, this.showAlphaDuration);
        //等待 + 渐隐
        Laya.Tween.to(msgView, { alpha: 0.2 }, this.hideAlphaDuration, Laya.Ease.linearNone, Laya.Handler.create(this, this.completeMsg, [msgView]), this.showAlphaDuration + this.showTime);

    }

    private completeMsg(msgView: MessageTipLab) {
        msgView.complete();
        this.returnTipLab(msgView);
        //理论上 可以直接移除顶部数据
        this.showingMsgView.shift();
    }

}

class MessageTipLab extends FUI_MessageLabel {
    public static createInstance(): MessageTipLab {
        return <MessageTipLab>(fgui.UIPackage.createObject(EmPackName.BaseInit, "MessageLabel", MessageTipLab));
    }

    private _message: { msg: string, callBack?: Function };

    public set message(msg: { msg: string, callBack?: Function }) {
        this._message = msg;
        if (!msg) return;
        this.txt.text = this._message.msg
    }

    public get message() {
        return this._message;
    }

    public complete() {
        this.displayObject.removeSelf();
        if (!this._message) return
        let callBack = this._message.callBack;
        this._message = null;
        callBack && callBack();
    }

}