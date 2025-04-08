/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description 形象组合部位加载  使用战斗模型资源
 **/

import Logger from "../../../core/logger/Logger";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { GameLoadNeedData } from "../../battle/data/GameLoadNeedData";
import { MovieClip } from "../../component/MovieClip";
import { HeroMovieClipRefType } from "../../constant/BattleDefine";
import { BattleAvatarResUtils } from "../util/BattleAvatarResUtils";
import { RoleUnitRef } from "./RoleUnitRef";

export class HeroMovieClipRef extends Laya.Animation {
    private _heroBody: RoleUnitRef;
    private _totalLoadCount: number = 0;
    private _curLoadCount: number = 0;
    private _heroParts: RoleUnitRef[] = [];
    public type: HeroMovieClipRefType;
    public completeFunc: Function;
    public dataMap: Map<string, GameLoadNeedData> = new Map();

    constructor(type: HeroMovieClipRefType) {
        super();
        this.type = type
    }

    public updateParts(dataArr: GameLoadNeedData[]) {
        this._totalLoadCount = dataArr.length;
        for (let i = 0; i < dataArr.length; i++) {
            let data = dataArr[i]
            let existData = this.dataMap.get(data.sPart) as GameLoadNeedData
            if (existData && existData.urlPath == data.urlPath) {
                // 没改变无需更新
                this.onPartComplete(null)
                continue
            }

            let roleUnit = this.getPart(data)
            this.addChild(roleUnit);
            if (data.isBody) {
                this._heroBody = roleUnit;
            }
            roleUnit.name = data.sPart;
            roleUnit.completeFunc = this.onPartComplete.bind(this);
            roleUnit.data = data;
            this.dataMap.set(data.sPart, data)
        }
    }

    public clearParts() {
        this._heroParts.forEach(part => {
            ObjectUtils.disposeObject(part)
        })
        this._heroParts = []
        this.dataMap.clear()
        this._heroBody = null;
    }

    private getPart(data: GameLoadNeedData) {
        let retRoleUnit: RoleUnitRef
        for (let index = 0; index < this._heroParts.length; index++) {
            let roleUnit = this._heroParts[index];
            if (!roleUnit.data) continue
            if (roleUnit.data.sPart == data.sPart) {
                retRoleUnit = roleUnit
                break
            }
        }
        if (!retRoleUnit) {
            retRoleUnit = new RoleUnitRef(this.type);
            this._heroParts.push(retRoleUnit);
        }
        return retRoleUnit
    }

    private onPartComplete(target: RoleUnitRef) {
        this._curLoadCount++;
        if (this._curLoadCount >= this._totalLoadCount) {
            this.loadCompleted()
        }
    }

    private loadCompleted() {
        // 由于很多武器的偏移点没有  使用body的偏移点
        if (this._heroBody && this._heroBody.content.pos_leg) {
            let pos_leg = this._heroBody.content.pos_leg
            this._heroParts.forEach((roleUnit) => {
                let [fixX, fixY] = BattleAvatarResUtils.fixResOffset(roleUnit.data)
                roleUnit.content.pivot(-(-pos_leg.x + fixX), -(-pos_leg.y + fixY))
            });
        }
        this.completeFunc && this.completeFunc();
    }

    public gotoAndPlay(start?: any, loop?: boolean, aniType?: string) {
        this._heroParts.forEach(part => {
            part.gotoAndPlay(start, loop, aniType);
        })
    }

    public gotoAndStop(position: any) {
        this._heroParts.forEach(part => {
            part.gotoAndStop(position);
        })
    }

    public addFrameScript(...parameters) {
        if (this.body)
            (this.body.content as MovieClip).addFrameScript.apply(this.body.content, parameters);
    }

    public get body(): RoleUnitRef {
        return this._heroBody;
    }

    public get currentLabel(): string {
        return this.body && this.body.content.currentLabel;
    }

    public get totalFrames(): number {
        return this.body && this.body.content.totalFrames;
    }

    public get currentFrame(): number {
        return this.body && this.body.content.currentFrame;
    }

    public get pos_head(): Laya.Point {
        return this.body && this.body.content["pos_head"]
    }
    public get pos_body(): Laya.Point {
        return this.body && this.body.content["pos_body"]
    }
    public get pos_leg(): Laya.Point {
        return this.body && this.body.content["pos_leg"]
    }

    public dispose() {
        this.clearParts();
    }
}