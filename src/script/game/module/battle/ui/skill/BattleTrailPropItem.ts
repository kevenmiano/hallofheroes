// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-09-03 16:51:12
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-02-02 14:37:27
 * @Description: 
 * 试练技能格子, 普通技能相比, 格子更小, 并且有一个复活的特殊显示状态
 * 在战斗中还可能获得试练技能, 多了一个获得效果
 */

import { IconFactory } from "../../../../../core/utils/IconFactory";
import { BattleEvent } from "../../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../../constant/UIDefine";
import { TrailPropInfo } from "../../../../datas/TrailPropInfo";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { BattleSkillItemII } from "./BattleSkillItemII";

export class BattleTrailPropItem extends BattleSkillItemII {
    protected _txtGetSkillCount: fgui.GLabel;
    private tGetSkillCount: fgui.Transition;
    public index: number = 0;

    protected initView() {
        super.initView();
        this._txtGetSkillCount = this.view.getChild('txtGetSkillCount') as fgui.GLabel;
        this.tGetSkillCount = this.view.getTransition("t0");
        this._txtSkillCount.visible = true;
        this._icon.setScale(0.8, 0.8);
    }

    public set data(value: any) {
        this._data = value;
        if (this._data && this._data instanceof TrailPropInfo) {
            this._data.addEventListener(BattleEvent.TRAIL_USECOUNT_CHANGE, this.__countChangeHandler, this);
            this._icon.icon = IconFactory.getTecIconByIcon((<TrailPropInfo>this._data).skillTemp.Icons);
            this._txtSkillCount.text = this._data.useCount.toString();

            if (!this.isLock) {
                FUIHelper.setTipData(
                    this.view,
                    EmWindow.SkillTip,
                    (<TrailPropInfo>this._data).skillTemp,
                    undefined,
                    TipsShowType.onLongPress
                )
            }

            this.enabled = this._data.useCount > 0
        }
    }

    public get data(): any {
        return this._data;
    }

    public startCD(delay: number = 0, cd: number = -1) {
        if (!this._data || !(this._data instanceof TrailPropInfo)) return;

        cd = cd > 0 ? cd : (<TrailPropInfo>this._data).skillTemp.CoolDown
        if ((<TrailPropInfo>this._data).coolDown <= 0 || cd <= 0) {
            this.resetCD();
            return;
        }

        this.startCDProcess(cd)
        this.showCDNum();
    }

    protected cdCompleteHandler() {
        super.cdCompleteHandler();
        this.__countChangeHandler(null);
    }

    private __countChangeHandler(data: any) {
        if (!(this._data instanceof TrailPropInfo)) return;

        if (data) {
            this.tGetSkillCount.play(null, 1)
        }
        this._txtSkillCount.text = this._data.useCount.toString();
        if (!this.parentEnable) return;
        this.enabled = this._data.useCount > 0;
    }

    public set enabled(value: boolean) {
        if (this.view && !this.view.isDisposed) {
            if (this._data.useCount <= 0) {
                this._enabled = false
                this.setState(BattleSkillItemII.STATE_GRAY)
            } else {
                this._enabled = value
                this.setState(this._enabled ? BattleSkillItemII.STATE_NORMAL : BattleSkillItemII.STATE_DARK)
            }
        }
    }

    public get enabled() {
        return this._enabled
    }

    protected removeEvent() {
        super.removeEvent();
        this._data.removeEventListener(BattleEvent.TRAIL_USECOUNT_CHANGE, this.__countChangeHandler, this);
    }

    public dispose() {
        this._data = null;
        this.tGetSkillCount.stop();
        this.removeEvent();
        super.dispose();
    }
}