// @ts-nocheck
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { Avatar } from "../../../avatar/view/Avatar";
import { Disposeable } from "../../../component/DisplayObject";
import { MovieClip } from "../../../component/MovieClip";
import { AvatarResourceType } from "../../../constant/AvatarDefine";


export class FootprintView implements Disposeable {
    private _avatar: Avatar;
    private _footPrintLayer: Laya.Sprite;
    private _type: number = 0;
    private _footPrints: any[] = [];
    private _footRect: Laya.Rectangle = new Laya.Rectangle(0, 0, 178, 200);

    constructor($avatar: Avatar) {
        this._avatar = $avatar;
    }

    public set type(value: number) {
        this._type = value;
    }


    public get footPrintLayer(): Laya.Sprite {
        return this._footPrintLayer;
    }

    public set footPrintLayer(value: Laya.Sprite) {
        this._footPrintLayer = value;
    }

    private _lFootPrints1: any[] = [];
    private _lFootPrints2: any[] = [];
    private _lFootPrints3: any[] = [];
    private _lFootPrints4: any[] = [];
    private _lFootPrints5: any[] = [];
    private _rFootPrints1: any[] = [];
    private _rFootPrints2: any[] = [];
    private _rFootPrints3: any[] = [];
    private _rFootPrints4: any[] = [];
    private _rFootPrints5: any[] = [];
    private _clFootPrints: any[];
    private _crFootPrints: any[];
    public createFoots() {
        this.createFootPrints(this._lFootPrints1, "asset.map.FootFireAssetL1");
        this.createFootPrints(this._lFootPrints2, "asset.map.FootFireAssetL2");
        this.createFootPrints(this._lFootPrints3, "asset.map.FootFireAssetL3");
        this.createFootPrints(this._lFootPrints4, "asset.map.FootFireAssetL4");
        this.createFootPrints(this._lFootPrints5, "asset.map.FootFireAssetL5");
        this.createFootPrints(this._rFootPrints1, "asset.map.FootFireAssetR1");
        this.createFootPrints(this._rFootPrints2, "asset.map.FootFireAssetR2");
        this.createFootPrints(this._rFootPrints3, "asset.map.FootFireAssetR3");
        this.createFootPrints(this._rFootPrints4, "asset.map.FootFireAssetR4");
        this.createFootPrints(this._rFootPrints5, "asset.map.FootFireAssetR5");
    }

    public clearFoots() {
        this.clearFootPrints(this._lFootPrints1);
        this.clearFootPrints(this._lFootPrints2);
        this.clearFootPrints(this._lFootPrints3);
        this.clearFootPrints(this._lFootPrints4);
        this.clearFootPrints(this._lFootPrints5);
        this.clearFootPrints(this._rFootPrints1);
        this.clearFootPrints(this._rFootPrints2);
        this.clearFootPrints(this._rFootPrints3);
        this.clearFootPrints(this._rFootPrints4);
        this.clearFootPrints(this._rFootPrints5);
    }

    private createFootPrints(footPrints: any[], source: string) {
        var i: number = 0;
        var len: number = 2;
        var mc: MovieClip;
        if (footPrints.length == 0) {
            for (i = 0; i < len; i++) {
                // mc = ComponentFactory.Instance.creatCustomObject(source);
                let mc = new MovieClip()
                footPrints.push(mc);
            }
        }
    }

    private clearFootPrints(footPrints: any[]) {
        var mc: MovieClip;
        footPrints.forEach(mc => {
            ObjectUtils.disposeObject(mc);
            mc = null;
        });
        footPrints = [];
    }

    private resetFootPrints(footPrints: any[]) {
        footPrints.forEach(mc => {
            if (mc.parent) {
                mc.parent.removeChild(mc);
                mc.scaleX = 1;
                mc.x = 0;
                mc.y = 0;
                mc.stop();
            }
        })
    }

    private getIndex(fy: number, scaleX: number): number {
        var index: number = 1;
        switch (fy) {
            case 0:
                index = 5;
                break;
            case 1:
                index = 4;
                break;
            case 2:
                index = 3;
                break;
            case 3:
                index = 2;
                break;
            case 4:
                index = 1;
                break;
        }
        return index;
    }

    public drawFootPrints(fx: number, fy: number = 0) {
        if (this._type == AvatarResourceType.NPC) {
            return;
        }
        if (this.footPrintLayer && this._avatar.parent && (fx == 0 || fx == 4)) {
            var scaleX: number = this._avatar.contentBitmap.scaleX;
            var index: number = this.getIndex(fy, scaleX);
            if (this["_lFootPrints" + index] != this._clFootPrints) {
                this.resetFootPrints(this._clFootPrints);
            }
            if (this["_rFootPrints" + index] != this._crFootPrints) {
                this.resetFootPrints(this._crFootPrints);
            }
            this._clFootPrints = this["_lFootPrints" + index];
            this._crFootPrints = this["_rFootPrints" + index];
            var lFoot: MovieClip = this._clFootPrints.pop();
            var rFoot: MovieClip = this._crFootPrints.pop();
            if (this._avatar.state == Avatar.WALK) {
                lFoot.scaleX = scaleX;
                // lFoot.x=this._avatar.parent.x;
                // lFoot.y=this._avatar.parent.y;
                lFoot.gotoAndPlay(1);
                this.footPrintLayer.addChild(lFoot);

                rFoot.scaleX = scaleX;
                // rFoot.x=this._avatar.parent.x;
                // rFoot.y=this._avatar.parent.y;
                rFoot.gotoAndPlay(1);
                this.footPrintLayer.addChild(rFoot);
            }
            else {
                if (lFoot.parent) {
                    lFoot.parent.removeChild(lFoot);
                    lFoot.scaleX = 1;
                    lFoot.x = 0;
                    lFoot.y = 0;
                    lFoot.stop();
                }

                if (rFoot.parent) {
                    rFoot.parent.removeChild(rFoot);
                    rFoot.scaleX = 1;
                    rFoot.x = 0;
                    rFoot.y = 0;
                    rFoot.stop();
                }
            }
            this._clFootPrints.unshift(lFoot);
            this._crFootPrints.unshift(rFoot);
        }
    }

    public dispose() {
        this.clearFoots();
        this._footPrintLayer = null;
        this._footPrints = null;
        this._avatar = null;
    }
}