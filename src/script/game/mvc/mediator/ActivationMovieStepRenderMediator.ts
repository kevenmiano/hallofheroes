// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2022-09-08 20:01:19
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2022-11-24 12:24:08
 * @Description: 副本动画分帧生成
 */
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { NodeState } from "../../map/space/constant/NodeState";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import { MapViewHelper } from "../../map/outercity/utils/MapViewHelper";
import { CampaignMapModel } from "../model/CampaignMapModel";
import { CampaignMapScene } from '../../scene/CampaignMapScene';
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { CampaignMapView } from "../../map/campaign/view/CampaignMapView";
import NodeResourceType from "../../map/space/constant/NodeResourceType";
import Tiles from "../../map/space/constant/Tiles";
import { ArmyManager } from "../../manager/ArmyManager";

export default class ActivationMovieStepRenderMediator implements IMediator, IEnterFrame {
    private _disObject: Laya.Sprite;
    private _model: CampaignMapModel;
    private _controler: CampaignMapScene;
    private _mapView: CampaignMapView;
    private _count: number = 0;

    public register(target: any) {
        this._disObject = target as Laya.Sprite;
        this._controler = CampaignManager.Instance.controller;
        this._model = CampaignManager.Instance.mapModel;
        this._mapView = CampaignManager.Instance.mapView;
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    public unregister(target: any) {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }

    public enterFrame() {
        if (!this._mapView) {
            return;
        }
        if (!this._model || this._model.exit) {
            return;
        }

        /**英灵岛重进报错问题  CampaignArmyView.showAvatar  thaneInfo.templateInfo.Sexs templateInfo报空;
         * 保证自己的部队消息的处理在副本成员消息之前;
         * U_C_SERIAL_ARMY = 0x0096一定要保证是在U_C_CAMPAIGN_ENTER = 0x0015之前发;
         */
        let selfThane = ArmyManager.Instance.thane
        if (!selfThane || !selfThane.templateInfo) {
            return
        }

        this._count++;
        if (this._count > CampaignMapView.STEP_RENDER_SPEED) {
            this._count = 0;
            let arr: Array<CampaignNode> = this._model.mapNodesData;
            let rect: Laya.Rectangle = MapViewHelper.getCurrentMapRectFix(CampaignManager.Instance.mapView);
            if (arr) {
                for (let i = 0; i < arr.length; i++) {
                    let node: CampaignNode = arr[i];
                    if (node && NodeState.displayState(node.info.state)) {
                        let outSight = this.outOfSight(node.x, node.y, rect)
                        if (!outSight) {
                            if (node.resource == NodeResourceType.Image) {
                                this._mapView.npcLayer.addNpc(node)
                            } else {
                                this._mapView.mainBuidingLayer.addNpc(node)
                            }
                        }
                    }
                }
            }

            let dic: Map<string, CampaignArmy> = this._model.allBaseArmy;
            if (dic) {
                dic.forEach(aInfo => {
                    let outSight = this.outOfSight(aInfo.curPosX * Tiles.WIDTH, aInfo.curPosY * Tiles.HEIGHT, rect)
                    if (!outSight) {
                        this._mapView.walkLayer.addArmy(aInfo)
                    }
                });
            }
        }
    }

    private outOfSight(x: number, y: number, rect: Laya.Rectangle): boolean {
        let b: boolean = false;
        if (x < rect.x - 100) {
            b = true;
        }
        else if (x > rect.x + StageReferance.stageWidth + 100) {
            b = true;
        }
        else if (y < rect.y - 100) {
            b = true;
        }
        else if (y > rect.y + StageReferance.stageHeight + 100) {
            b = true;
        }
        return b;
    }
}