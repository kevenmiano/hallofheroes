// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-03-31 11:50:04
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2024-05-07 17:24:26
 * @Description: 角色模型展示（UI、秘境副本） 使用战斗场景的模型资源animation/equip
 */

import LangManager from "../../../core/lang/LangManager";
import { ActionLabesType, HeroMovieClipRefType, SideType } from "../../constant/BattleDefine";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { GameLoadNeedData } from "../../battle/data/GameLoadNeedData";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import FUIHelper from "../../utils/FUIHelper";
import { EmPackName } from "../../constant/UIDefine";
import { Disposeable } from "../../component/DisplayObject";
import { GlobalConfig } from "../../constant/GlobalConfig";
import { FilterFrameText } from "../../component/FilterFrameText";
import { UIFilter } from "../../../core/ui/UIFilter";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignMapEvent } from "../../constant/event/NotificationEvent";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { HeroMovieClipRef } from "./HeroMovieClipRef";
import { HeroLoadDataFactory } from "../../battle/utils/HeroLoadDataFactory";
import Logger from "../../../core/logger/Logger";

export class ShowAvatarBattle extends Laya.Sprite implements Disposeable {
    private _data: ThaneInfo | CampaignArmy | GameLoadNeedData;
    private _movie: HeroMovieClipRef;
    private _shadow: Laya.Sprite;
    private _txtName: FilterFrameText;

    private _type: HeroMovieClipRefType
    private _showName: boolean
    private _showWeakBreatheAction: boolean

    constructor(type: HeroMovieClipRefType, showName: boolean = true, showWeakBreatheAction: boolean = true) {
        super();
        this._type = type
        this._showName = showName
        this._showWeakBreatheAction = showWeakBreatheAction
        this.addEvent()
        this.initView()
    }

    protected addEvent() {
        if (this._data instanceof CampaignArmy) {
            this._data.addEventListener(CampaignMapEvent.IS_DIE, this.__isDieHandler, this);
        }
    }

    protected removeEvent() {
        if (this._data instanceof CampaignArmy) {
            this._data.removeEventListener(CampaignMapEvent.IS_DIE, this.__isDieHandler, this);
        }
    }

    public get data(): ThaneInfo | CampaignArmy | GameLoadNeedData {
        return this._data;
    }

    public set data(value: ThaneInfo | CampaignArmy | GameLoadNeedData) {
        this._data = value;
        if (value) {
            this.addEvent();
            this.refresh();
        } else {
            this.removeEvent();
            this.resetView();
        }
    }

    protected initView() {
        this._txtName = new FilterFrameText(10, 20, undefined, 186, "#ffffff", "center", "middle", 0.5, 1);

    }

    protected refresh() {
        let nameStr
        let dataArr
        Logger.info("ShowAvatarBattle refresh")
        if (!this._movie) {
            this._movie = new HeroMovieClipRef(this._type)
            this.addChild(this._movie)
            this._movie.completeFunc = this.onMovieLoadComplete.bind(this)
        }

        if (this._data instanceof CampaignArmy) {// 英雄(秘境) 用的是副本中的军队数据
            nameStr = this._data.baseHero.nickName.toString()
            dataArr = HeroLoadDataFactory.createAll(this._data.baseHero)
        } else if (this._data instanceof ThaneInfo) {// 英雄
            nameStr = this._data.nickName.toString()
            dataArr = HeroLoadDataFactory.createAll(this._data)
        } else if (this._data instanceof GameLoadNeedData) { // 士兵、Boss、怪物
            nameStr = this._data.name
            if (this._data.grade) {
                nameStr += ' ' + LangManager.Instance.GetTranslation("public.level4_space2", this._data.grade)
            }
            dataArr = [this._data]
        }

        this._movie.updateParts(dataArr)
        this.setNameText(nameStr)
        this.showName(this._showName)
        this.showWeakBreatheAction(this._showWeakBreatheAction)
    }

    private onMovieLoadComplete() {
        this._movie.gotoAndPlay(0, true, ActionLabesType.STAND)
        this.loadComplete()
    }

    private loadComplete() {
        this.updateDiedState()
    }

    private __isDieHandler() {
        this.updateDiedState();
    }

    private addWeakBreatheAction() {
        let mc = this._movie

        mc.scale(1, 1);
        Laya.Tween.to(mc, { scaleX: 1.01, scaleY: 1.04 }, 800, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
            if (!mc || mc.destroyed) return;
            Laya.Tween.to(mc, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.linearInOut, Laya.Handler.create(this, () => {
                this.addWeakBreatheAction()
            }));
        }));
    }

    private removeWeakBreatheAction() {
        let mc = this._movie

        Laya.Tween.clearAll(mc)
        if (mc && !mc.destroyed) {
            mc.scale(1, 1);
        }
    }

    showWeakBreatheAction(b: boolean) {
        if (b) {
            this.addWeakBreatheAction()
        } else {
            this.removeWeakBreatheAction()
        }
    }

    showShadow(b: boolean) {
        if (b) {
            if (!this._shadow) {
                this._shadow = new Laya.Sprite();
                this._shadow.zOrder = -1;
                this._shadow.graphics.drawImage(FUIHelper.getItemAsset(EmPackName.BaseCommon, "shadow"))
            }
            this.addChild(this._shadow);
            this._shadow.pivot(GlobalConfig.Avatar.battleShadowW / 2, GlobalConfig.Avatar.battleShadowH / 2)
        } else {
            this._shadow.removeSelf();
        }
    }

    showName(b: boolean) {
        this._txtName.visible = b
    }

    setSide(side: SideType) {
        if (side == SideType.ATTACK_TEAM) {
            this.scaleX = 1
        } else if (side == SideType.DEFANCE_TEAM) {
            this.scaleX = -1
        }
    }

    setNameText(str: string = "") {
        this._txtName.text = str
    }

    setNameColor(str: string = "#ffffff") {
        this._txtName.color = str
    }

    setNameStroke(colorIdx: number = 0, width: number = 2) {
        this._txtName.setStroke(0, 1)
    }

    updateDiedState() {
        if (this._data instanceof CampaignArmy) {
            this.gray(CampaignArmyState.checkDied(this._data.isDie))
        } else {

        }
    }

    gray(b: boolean) {
        this._movie.filters = b ? [UIFilter.grayFilter] : []
    }

    resetView() {
        this.showName(false);
        this._movie && ObjectUtils.disposeObject(this._movie); this._movie = null
    }

    dispose() {
        this.removeEvent();
        this._movie && ObjectUtils.disposeObject(this._movie); this._movie = null
    }
}