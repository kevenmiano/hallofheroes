// @ts-nocheck
import UIManager from "../../../core/ui/UIManager";
import { CampaignMapEvent, NotificationEvent } from "../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../constant/UIDefine";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { CampaignMainBuidingLayer } from "../../map/campaign/view/layer/CampaignMainBuidingLayer";
import { NpcLayer } from "../../map/campaign/view/layer/NpcLayer";
import { CampaignNpcPhysics } from "../../map/campaign/view/physics/CampaignNpcPhysics";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { PosType } from "../../map/space/constant/PosType";
import { CampaignNode } from "../../map/space/data/CampaignNode";



export default class MineralUIMediator implements IMediator, IEnterFrame {

    private _selfArmy: CampaignArmy;
    private _btnDic: Map<string, any>;
    private _itemDic: Map<string, any>;
    private _npcLayer: NpcLayer;
    private _uiSprite: Laya.Sprite;
    private _frameCount: number = 0;

    public register(target) {
        this._btnDic = new Map()
        this._itemDic = new Map();
        this._npcLayer = CampaignManager.Instance.mapView.npcLayer;
        this._uiSprite = new Laya.Sprite();
        this._uiSprite.name = "MineralUIMediator";
        (target as Laya.Sprite).addChild(this._uiSprite);

        this._selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
        this._selfArmy.addEventListener(CampaignMapEvent.IS_DIE, this.__dieHandler, this);
        this.__dieHandler(null);
        NotificationManager.Instance.addEventListener(NotificationEvent.NPC_LOAD_COMPLETE, this.layout, this);
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    public unregister(target) {
        if (this._selfArmy) this._selfArmy.removeEventListener(CampaignMapEvent.IS_DIE, this.__dieHandler, this);
        UIManager.Instance.HideWind(EmWindow.GvgRiverWnd);
        this._uiSprite.removeSelf();
        this._uiSprite.destroy();
        this._uiSprite = null;
        this._npcLayer = null;
        NotificationManager.Instance.removeEventListener(NotificationEvent.NPC_LOAD_COMPLETE, this.layout, this);
        this.clearAllBtn();
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
    }

    private layout(e: NotificationEvent) {

    }

    private __onClickHandler(evt: Laya.Event) {
        var btn = fgui.GObject.cast(evt.currentTarget);
        var nodeView1: NpcAvatarView = this._itemDic.get(btn.name) as NpcAvatarView;
        if (nodeView1) {
            CampaignManager.Instance.mapModel.selectNode = nodeView1.nodeInfo as CampaignNode;
            nodeView1.attackFun();
        } else {
            var nodeView2: CampaignNpcPhysics = this._itemDic.get(btn.name) as CampaignNpcPhysics;
            CampaignManager.Instance.mapModel.selectNode = nodeView2.info as CampaignNode;
            nodeView2.mouseClickHandler(evt);
        }
        evt.stopPropagation();
    }

    private __onOverHandler(evt: Laya.Event) {
        var btn = fgui.GObject.cast(evt.currentTarget);
        var nodeView1: NpcAvatarView = this._itemDic.get(btn.name) as NpcAvatarView;
        if (nodeView1) {
            nodeView1.mouseMoveHandler(evt);
        } else {
            var nodeView2: CampaignNpcPhysics = this._itemDic.get(btn.name) as CampaignNpcPhysics;
            nodeView2.mouseMoveHandler(evt);
        }
        evt.stopPropagation();
    }

    private __onOutHandler(evt: Laya.Event) {
        var btn = fgui.GObject.cast(evt.currentTarget);
        var nodeView1: NpcAvatarView = this._itemDic.get(btn.name) as NpcAvatarView;
        if (nodeView1) {
            nodeView1.mouseOutHandler(evt);
        } else {
            var nodeView2: CampaignNpcPhysics = this._itemDic.get(btn.name) as CampaignNpcPhysics;
            nodeView2.mouseOutHandler(evt);
        }
        evt.stopPropagation();
    }

    /**
     * 每帧检测
     * 如果紫晶矿点被移出舞台 , 相应的按钮也应该移出舞台 <br/>
     * 如果紫晶矿点重新添加到舞台,也把按钮加入舞台
     */
    public enterFrame() {
        this._frameCount++;
        if (this._frameCount >= 24) {
            this.addAllBtn();
            this._frameCount = 0;
        }

        var layer: CampaignMainBuidingLayer = CampaignManager.Instance.mapView.mainBuidingLayer;
        let values = layer.items.values();
        for (var displayObject of values) {
            if (displayObject instanceof CampaignNpcPhysics) {
                var npcView: CampaignNpcPhysics = displayObject as CampaignNpcPhysics;
                var nodeInfo: CampaignNode = npcView.info as CampaignNode;
                if (!nodeInfo || nodeInfo.sonType != 2351) continue;//不是采集点

                var btn: fgui.GButton = this._btnDic.get(npcView.x + "," + npcView.y);
                if (!btn) {
                    btn = fgui.UIPackage.createObject(EmPackName.Home, "mineral_NpcBtn" + nodeInfo.sonType).asButton;
                    btn.name = npcView.x + "," + npcView.y;
                    btn.onClick(this, this.__onClickHandler);
                    btn.on(Laya.Event.MOUSE_OVER, this, this.__onOverHandler)
                    btn.on(Laya.Event.MOUSE_OUT, this, this.__onOutHandler)
                    this._btnDic.set(npcView.x + "," + npcView.y, btn);
                    this._itemDic.set(btn.name, npcView);
                }

                if (!npcView.parent) {
                    if (btn.parent) btn.parent.removeChild(btn);
                } else {
                    if (!btn.displayObject.parent) {
                        btn.x = npcView.x - btn.width / 2;
                        btn.y = npcView.y - btn.height - 125;
                        this._uiSprite.addChild(btn.displayObject);
                    }
                }
            }
        }
    }

    private addAllBtn() {
        let list = this._npcLayer.avatarList;
        for (const key in list) {
            if (Object.prototype.hasOwnProperty.call(list, key)) {
                var npcTarget = list[key];
                if (!npcTarget || !npcTarget.nodeInfo || !npcTarget.nodeInfo.info || npcTarget.nodeInfo.info.types != PosType.COPY_HANDLER) {
                    continue;
                }
                var nodeInfo: CampaignNode = npcTarget.nodeInfo as CampaignNode;

                var btn: fgui.GButton = this._btnDic.get(npcTarget.x + "," + npcTarget.y);
                if (!btn) {
                    btn = fgui.UIPackage.createObject(EmPackName.Home, "mineral_NpcBtn" + nodeInfo.nodeId).asButton;
                    btn.name = npcTarget.x + "," + npcTarget.y;
                    btn.onClick(this, this.__onClickHandler);
                    btn.on(Laya.Event.MOUSE_OVER, this, this.__onOverHandler)
                    btn.on(Laya.Event.MOUSE_OUT, this, this.__onOutHandler)
                    this._btnDic.set(npcTarget.x + "," + npcTarget.y, btn);
                }
                this._itemDic.set(btn.name, npcTarget);
                if (!btn.displayObject.parent) {
                    btn.x = npcTarget.x - btn.width / 2;
                    btn.y = npcTarget.y - btn.height - 125;
                    this._uiSprite.addChild(btn.displayObject);
                }
            }
        }

    }

    private __dieHandler(evt: CampaignMapEvent) {
        if (CampaignArmyState.checkDied(this._selfArmy.isDie)) {
            let riverTime = this._selfArmy.riverTime / 1000 - 2;
            UIManager.Instance.ShowWind(EmWindow.GvgRiverWnd, [riverTime]);
        } else {
            UIManager.Instance.HideWind(EmWindow.GvgRiverWnd);
        }
    }

    private clearAllBtn() {
        for (const key1 in this._btnDic) {
            if (Object.prototype.hasOwnProperty.call(this._btnDic, key1)) {
                if (this._btnDic[key1] instanceof fgui.GButton) {
                    this._btnDic[key1].offClick(this, this.__onClickHandler);
                    this._btnDic[key1].dispose(true);
                }
                this._btnDic[key1] = null;
                delete this._btnDic[key1];
            }
        }
        for (const key in this._itemDic) {
            if (Object.prototype.hasOwnProperty.call(this._itemDic, key)) {
                let key2 = this._itemDic[key];
                this._itemDic[key2] = null;
                delete this._itemDic[key2];
            }
        }
        this._itemDic = null;
        this._btnDic = null;
    }



}