// @ts-nocheck
import { CampaignMapEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { NodeState } from "../../map/space/constant/NodeState";
import { PosType } from "../../map/space/constant/PosType";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { MapViewHelper } from "../../map/outercity/utils/MapViewHelper";
import { AvatarBaseView } from "../../map/view/hero/AvatarBaseView";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";
import { CampaignMapScene } from '../../scene/CampaignMapScene';
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import Logger from "../../../core/logger/Logger";
import { PlayerManager } from "../../manager/PlayerManager";

export default class ActivationMovieMediator implements IMediator, IEnterFrame {
    private _disObject: Laya.Sprite;
    private _playerLimit: number = 100;
    private _needPlayerLimit: boolean = false;
    private _model: CampaignMapModel;
    private _controler: CampaignMapScene;
    private _walkLayer: Laya.Sprite;
    private mapView: Laya.Sprite;
    private _count: number = 0;

    public register(target: any) {
        this._disObject = target as Laya.Sprite;
        this._model = CampaignManager.Instance.mapModel;
        this._controler = CampaignManager.Instance.controller;
        this.mapView = CampaignManager.Instance.mapView;
        if (WorldBossHelper.checkPetLand(this._model.mapId)) {
            this._needPlayerLimit = true;
            this._playerLimit = 50;
        }
        if (this.mapView) {
            this.mapView.on(CampaignMapEvent.MOVE_SCENET_END, this, this.__moveSceneHandler);
        }
        NotificationManager.Instance.addEventListener(NotificationEvent.CHECK_PLAYING, this.__moveSceneHandler, this);
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    public unregister(target: any) {
        if (this.mapView) {
            this.mapView.off(CampaignMapEvent.MOVE_SCENET_END, this, this.__moveSceneHandler);
        }
        NotificationManager.Instance.removeEventListener(NotificationEvent.CHECK_PLAYING, this.__moveSceneHandler, this);
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this.mapView = null;
        this._model = null;
        this._disObject = null;
        this._controler = null;
    }

    public enterFrame() {
        if (!this._model || this._model.exit) {
            return;
        }
        this._count++;
        if (this._count > 25) {
            this._count = 0;
            let arr: Array<CampaignNode> = this._model.mapNodesData;
            let rect: Laya.Rectangle = MapViewHelper.getCurrentMapRectFix(CampaignManager.Instance.mapView);
            if(arr){
                for (let i = 0; i < arr.length; i++) {
                    let node: CampaignNode = arr[i];
                    if (node && NodeState.displayState(node.info.state)) {
                        this.checkNodePlaying(node.nodeView as Laya.Sprite, rect, node);
                    }
                }
            }
         
            let dic: Map<string, CampaignArmy> = this._model.allBaseArmy;
            if (dic) {
                dic.forEach(aInfo => {
                    let armyView: any = this._controler.getArmyView(aInfo);
                    this.checkArmyPlaying(armyView, rect, aInfo);
                });
            }
        }
    }

    private __moveSceneHandler() {
        let arr: Array<CampaignNode> = this._model.mapNodesData;
        if (!arr) return;
        let rect: Laya.Rectangle = MapViewHelper.getCurrentMapRectFix(CampaignManager.Instance.mapView);
        for (let i = 0; i < arr.length; i++) {
            let node: CampaignNode = arr[i];
            if (node && NodeState.displayState(node.info.state)) {
                this.checkNodePlaying(node.nodeView as Laya.Sprite, rect, node);
            }
        }

        arr = this._model.staticMovies;
        for (let i = 0; i < arr.length; i++) {
            let node = arr[i];
            if (node) {
                this.checkNodePlaying(node.nodeView as Laya.Sprite, rect, node);
            }
        }

        let dic: Map<string, CampaignArmy> = this._model.allBaseArmy;
        if (dic) {
            dic.forEach(aInfo => {
                let armyView: any = this._controler.getArmyView(aInfo);
                this.checkArmyPlaying(armyView, rect, aInfo);
            });
        }
    }

    private checkArmyPlaying(mc: any, rect: Laya.Rectangle, army: CampaignArmy) {
        if (!mc || mc.destroyed) return;

        let isSelf = (army.userId == PlayerManager.Instance.currentPlayerModel.playerInfo.userId);
        let isHideOthers = CampaignManager.Instance.getScenePlayerVisible(army.mapId, army.online);
        let bRemove: boolean = (this.outOfSight(mc, rect) && !isHideOthers);
        if (isSelf) {
            bRemove = false;
        }
        mc.isPlaying = !bRemove && army.online;

        if (bRemove) {
            if (mc.parent) {
                mc.removeSelf();
                // 移出视野位置重置 只是重置到一个看不到的点
                mc.x = mc.y = -300;
            }
        }
        else {
            if (!mc.parent && army.preParent) {
                army.preParent.addChild(mc);
            }
        }
    }

    private checkNodePlaying(mc: any, rect: Laya.Rectangle, node: CampaignNode) {
        if (!mc || mc.destroyed) return;

        let b: boolean = this.outOfSight(mc, rect);
        mc.visible = !b;
        mc['isPlaying'] = !b;
        // if (b) {
        //     if (mc.parent) {
        //         mc.parent.removeChild(mc);
        //     }
        // }
        // else {
        //     if (!mc.parent && node.preParent) {
        //         if (node.info.types == PosType.COPY_LOGO || node.info.types == PosType.STATIC) {
        //             node.preParent.addChildAt(mc, 0);
        //         }
        //         else {
        //             node.preParent.addChild(mc);
        //         }
        //     }
        // }
    }

    private outOfSight(mc: any, rect: Laya.Rectangle): boolean {
        if (!mc || mc.destroyed) return;

        let b: boolean = false;
        if (mc.x < rect.x - mc.width - 100) {
            b = true;
        }
        else if (mc.x > rect.x + StageReferance.stageWidth + 100) {
            b = true;
        }
        else if (mc.y < rect.y - mc.height - 100) {
            b = true;
        }
        else if (mc.y > rect.y + StageReferance.stageHeight + 100) {
            b = true;
        }
        return b;
    }

}