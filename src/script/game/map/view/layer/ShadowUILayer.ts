// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-04-08 14:37:38
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-07-10 14:38:32
 * @Description: 人物影子分层
 */

import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { ShadowType } from "../../../constant/Const";
import { ShadowUIEvent } from "../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";
import { NotificationManager } from "../../../manager/NotificationManager";
import FUIHelper from "../../../utils/FUIHelper";

export class ShadowUILayerHandler {
    private static _handlerView: ShadowUILayer;

    static setHandlerView(view: ShadowUILayer, name: string = "") {
        Logger.warn("[ShadowUILayer]设置handlerView", view, name);
        this._handlerView = view
    }

    static handle_POSX(uuid: string, x: number) {
        if (!this._handlerView) {
            Logger.warn("[ShadowUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__updateX(uuid, x);
    }
    static handle_POSY(uuid: string, y: number) {
        if (!this._handlerView) {
            Logger.warn("[ShadowUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__updateY(uuid, y);
    }
    static handle_CREATE(uuid: string, type: ShadowType, obj?: any) {
        if (!this._handlerView) {
            Logger.warn("[ShadowUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__createShadow(uuid, type, obj)
    }
    static handle_DISPOSE(uuid: string, type: ShadowType) {
        if (!this._handlerView) {
            Logger.warn("[ShadowUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__disposeShadow(uuid, type)
    }
    static handle_VISIBLE(uuid: string, visible: boolean, type?: ShadowType) {
        if (!this._handlerView) {
            Logger.warn("[ShadowUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__shadowVisible(uuid, visible);
    }
    static handle_ALPHA(uuid: string, alpha: number, type?: ShadowType) {
        if (!this._handlerView) {
            Logger.warn("[ShadowUILayer]未设置handlerView！");
            return
        }

        this._handlerView.__shadowAlpha(uuid, alpha);
    }
}

export class ShadowUILayer extends Laya.Sprite {
    public static INIT_ID = 100000
    public static INIT_SHODOW_POS = new Laya.Point(-42, -30)
    public static INIT_SHODOW_MOUNTPOS = new Laya.Point(-91, -33)

    private shadowMap: Map<string, Laya.Sprite> = new Map();
    private mountShadowMap: Map<string, Laya.Sprite> = new Map();

    constructor() {
        super();
        // this.addEvent()
    }

    public createShadow(uuid: string, name?: string) {
        // Logger.xjy("[ShadowUILayer]createShadow uuid=", uuid, "name=", name)
        if (!uuid) return
        if (this.shadowMap.get(uuid)) return

        // Logger.xjy("[ShadowUILayer]createShadow 创建 uuid=", uuid, "name=", name)

        let standShadow = new Laya.Sprite();
        standShadow.name = name;
        let tex = FUIHelper.getItemAsset(EmPackName.Base, "ImgStandShadow")
        standShadow.graphics.drawTexture(tex)
        this.addChild(standShadow);
        this.shadowMap.set(uuid, standShadow)
    }

    public createMountShadow(uuid: string, name?: string) {
        if (!uuid) return

        if (this.mountShadowMap.get(uuid)) return

        let mountStandShadow = new Laya.Sprite();
        mountStandShadow.name = name;
        let tex = FUIHelper.getItemAsset(EmPackName.Base, "ImgMountStandShadow")
        mountStandShadow.graphics.drawTexture(tex)
        this.addChild(mountStandShadow);

        this.mountShadowMap.set(uuid, mountStandShadow)
    }

    public disposeShadow(uuid: string) {
        let sp = this.shadowMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.shadowMap.delete(uuid);
    }

    public disposeMountShadow(uuid: string) {
        let sp = this.mountShadowMap.get(uuid);
        ObjectUtils.disposeObject(sp);
        this.mountShadowMap.delete(uuid);
    }

    public shadowVisible(uuid: string, visible: boolean, type?: ShadowType) {
        if (!uuid) return

        let standShadow = this.shadowMap.get(uuid)
        let standMountShadow = this.mountShadowMap.get(uuid)
        if (standShadow) {
            standShadow.visible = visible
        }
        if (standMountShadow) {
            standMountShadow.visible = visible
        }
    }

    public shadowAlpha(uuid: string, alpha: number) {
        if (!uuid) return

        let standShadow = this.shadowMap.get(uuid)
        let standMountShadow = this.mountShadowMap.get(uuid)
        if (standShadow) {
            standShadow.alpha = alpha
        }
        if (standMountShadow) {
            standMountShadow.alpha = alpha
        }
    }

    // public addEvent() {
    //     NotificationManager.Instance.addEventListener(ShadowUIEvent.SHADOW_POSX, this.__updateX, this)
    //     NotificationManager.Instance.addEventListener(ShadowUIEvent.SHADOW_POSY, this.__updateY, this)
    //     NotificationManager.Instance.addEventListener(ShadowUIEvent.CREATE_SHADOW, this.__createShadow, this)
    //     NotificationManager.Instance.addEventListener(ShadowUIEvent.DISPOSE_SHADOW, this.__disposeShadow, this)
    //     NotificationManager.Instance.addEventListener(ShadowUIEvent.SHADOW_VISIBLE, this.__shadowVisible, this)
    //     NotificationManager.Instance.addEventListener(ShadowUIEvent.SHADOW_ALPHA, this.__shadowAlpha, this)
    // }

    // public removeEvent() {
    //     NotificationManager.Instance.removeEventListener(ShadowUIEvent.SHADOW_POSX, this.__updateX, this)
    //     NotificationManager.Instance.removeEventListener(ShadowUIEvent.SHADOW_POSY, this.__updateY, this)
    //     NotificationManager.Instance.removeEventListener(ShadowUIEvent.CREATE_SHADOW, this.__createShadow, this)
    //     NotificationManager.Instance.removeEventListener(ShadowUIEvent.DISPOSE_SHADOW, this.__disposeShadow, this)
    //     NotificationManager.Instance.removeEventListener(ShadowUIEvent.SHADOW_VISIBLE, this.__shadowVisible, this)
    //     NotificationManager.Instance.removeEventListener(ShadowUIEvent.SHADOW_ALPHA, this.__shadowAlpha, this)
    // }

    public __createShadow(uuid: string, type: ShadowType = ShadowType.Normal, name?: string) {
        if (type == ShadowType.Normal) {
            this.createShadow(uuid, name)
        } else if (type == ShadowType.Mount) {
            this.createMountShadow(uuid, name)
        } else {
            this.createShadow(uuid, name)
            this.createMountShadow(uuid, name)
        }
    }

    public __disposeShadow(uuid: string, type: ShadowType = ShadowType.ALL) {
        if (type == ShadowType.Normal) {
            this.disposeShadow(uuid)
        } else if (type == ShadowType.Mount) {
            this.disposeMountShadow(uuid)
        } else {
            this.disposeShadow(uuid)
            this.disposeMountShadow(uuid)
        }
    }

    public __shadowVisible(uuid: string, visible:boolean) {
        this.shadowVisible(uuid, visible)
    }

    public __shadowAlpha(uuid: string, alpha:number) {
        this.shadowAlpha(uuid, alpha)
    }

    public __updateX(uuid: string, x: number) {
        let spShadow = this.shadowMap.get(uuid);
        let spMountShadow = this.mountShadowMap.get(uuid);
        if (spShadow) {
            spShadow.x = ShadowUILayer.INIT_SHODOW_POS.x + x
        }
        if (spMountShadow) {
            spMountShadow.x = ShadowUILayer.INIT_SHODOW_MOUNTPOS.x + x
        }
    }

    public __updateY(uuid: string, y: number) {
        let spShadow = this.shadowMap.get(uuid);
        if (spShadow) {
            spShadow.y = ShadowUILayer.INIT_SHODOW_POS.y + y
        }
        let spMountShadow = this.mountShadowMap.get(uuid);
        if (spMountShadow) {
            spMountShadow.y = ShadowUILayer.INIT_SHODOW_MOUNTPOS.y + y
        }
    }

    public dispose() {
        // this.removeEvent()

        this.shadowMap.forEach((sp: Laya.Sprite) => {
            ObjectUtils.disposeObject(sp)
        })
        this.mountShadowMap.forEach((sp: Laya.Sprite) => {
            ObjectUtils.disposeObject(sp)
        })
        this.shadowMap.clear()
        this.mountShadowMap.clear()
    }
}