import ResMgr from '../../../core/res/ResMgr';
import ObjectUtils from '../../../core/utils/ObjectUtils';
import Utils from '../../../core/utils/Utils';
import OneStatusButton from '../../component/OneStatusButton';
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import IMediator from "../../interfaces/IMediator";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { PathManager } from '../../manager/PathManager';
import SpaceNodeType from "../../map/space/constant/SpaceNodeType";
import SpaceManager from "../../map/space/SpaceManager";
import { SpaceSocketOutManager } from '../../map/space/SpaceSocketOutManager';
import { SpaceNpcView } from "../../map/space/view/physics/SpaceNpcView";
import { SpaceSceneMapZOrder } from '../../map/space/view/SpaceSceneMapView';
import ComponentSetting from '../../utils/ComponentSetting';

export class SpaceUIMediator implements IMediator, IEnterFrame {
    private _btnDic: Map<SpaceNpcView, OneStatusButton>;
    private _itemDic: Map<OneStatusButton, SpaceNpcView>;
    private _uiSprite: Laya.Sprite;

    constructor() {
    }

    public register(target: Object) {
        this._uiSprite = new Laya.Sprite();
        this._uiSprite.zOrder = SpaceSceneMapZOrder.SpaceBtnUI;
        (<Laya.Sprite>target).addChild(this._uiSprite);
        this._uiSprite.name = "SpaceUIMediator";
        Utils.setDrawCallOptimize(this._uiSprite);
        EnterFrameManager.Instance.registeEnterFrame(this);
        SpaceSocketOutManager.Instance.searchYearBox();
    }

    public unregister(target: Object) {
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this.clearAllBtn();
        ObjectUtils.disposeObject(this._uiSprite);
        this._uiSprite = null;
    }

    public enterFrame() {
        let npcList: any[] = SpaceManager.Instance.controller.npcList;
        if (npcList && npcList.length > 0) {
            EnterFrameManager.Instance.unRegisteEnterFrame(this);
            this.load();
        }
    }

    private load() {
        let path: string = PathManager.getNpcBtnPath();
        ResMgr.Instance.loadRes(path, (res) => {
            if (res) {
                this.addAllBtn()
            }
        })
    }

    private check(element: SpaceNpcView): boolean {
        if ((element.nodeInfo.info.id == SpaceNodeType.ID_TREASURE_MAP && !ComponentSetting.TREASURE_MAP)
            || (element.nodeInfo.info.id == SpaceNodeType.ID_SINGLE_PASS && !ComponentSetting.SINGLE_PASS)
            || (element.nodeInfo.info.id == SpaceNodeType.PET_CAMPAIGN && !ComponentSetting.PET_CAMPAIGN)
            || (element.nodeInfo.info.id == SpaceNodeType.ID_PET_CHALLENGE && !ComponentSetting.PET_CHALLENGE)
            || (element.nodeInfo.info.id == SpaceNodeType.PET_REMOTE && !ComponentSetting.PET_REMOTE)) {
            return false;
        }
        return true;
    }

    private addAllBtn() {
        this._btnDic = new Map();
        this._itemDic = new Map();
        let npcList: SpaceNpcView[] = SpaceManager.Instance.controller.npcList;
        if (!npcList) return;
        npcList.forEach(element => {
            if (element.nodeInfo.info.types != SpaceNodeType.MOVEMENT) {
                if (this.check(element)) {
                    let btn: OneStatusButton = this._btnDic.get(element);
                    if (btn) {
                        this._itemDic.set(btn, element);
                        if (!btn.parent) {
                            btn.x = element.x - btn.width / 2;
                            btn.y = element.y - btn.height - 10 + element.getPosYById(element.nodeInfo.info.id);
                            this._uiSprite.addChild(btn);
                        }
                    } else {
                        let path: string;
                        path = "res/game/common/map.space.NPCBtn" + element.nodeInfo.info.id + ".png";
                        let texture = ResMgr.Instance.getRes(path) as Laya.Texture;
                        btn = new OneStatusButton();
                        btn.graphics.drawImage(texture, (texture.width - texture.sourceWidth) / 2, 0, texture.sourceWidth, texture.sourceHeight);
                        btn.on(Laya.Event.CLICK, this, this.__onClickHandler);
                        btn.on(Laya.Event.MOUSE_OVER, this, this.__onOverHandler);
                        btn.on(Laya.Event.MOUSE_OUT, this, this.__onOutHandler);
                        if (this._itemDic) {
                            this._itemDic.set(btn, element);
                        }
                        if (!btn.parent) {
                            btn.x = element.x - btn.width / 2;
                            if (element.nodeInfo && element.nodeInfo.info) {
                                btn.y = element.y - btn.height - 10 + element.getPosYById(element.nodeInfo.info.id);
                            }
                            if (this._uiSprite) {
                                this._uiSprite.addChild(btn);
                            }
                        }
                        btn.nodeData = element.nodeInfo;
                    }
                }
            }
        });
    }

    private clearAllBtn() {
        this._btnDic.forEach(element => {
            element.off(Laya.Event.CLICK, this, this.__onClickHandler);
            element.off(Laya.Event.MOUSE_OVER, this, this.__onOverHandler);
            element.off(Laya.Event.MOUSE_OUT, this, this.__onOutHandler);
            ObjectUtils.disposeObject(element);
        });
        //forEach优化 用clear()？？
        // this._itemDic.forEach(element => {
        //     this._itemDic.set(element, null);
        //     this._itemDic.delete(element);
        // });
        //forEach优化--
        this._itemDic.clear();
        this._itemDic = null;
        this._btnDic = null;
    }

    private __onClickHandler(evt: Laya.Event) {
        if (evt.currentTarget instanceof OneStatusButton) {
            let btn: OneStatusButton = evt.currentTarget as OneStatusButton;
            let nodeView: any = this._itemDic.get(btn);
            nodeView.attackFun();
        }
        evt.stopPropagation();
    }

    private __onOverHandler(evt: Laya.Event) {
        if (evt.currentTarget instanceof OneStatusButton) {
            let btn: OneStatusButton = evt.currentTarget as OneStatusButton;
            let nodeView: any = this._itemDic.get(btn);
            if (nodeView["mouseOverHandler"]) {
                nodeView.mouseOverHandler(evt);
                SpaceManager.Instance.model.glowTarget = <Laya.Sprite>nodeView;
            }
        }
        evt.stopPropagation();
    }

    private __onOutHandler(evt: Laya.Event) {
        if (evt.currentTarget instanceof OneStatusButton) {
            let btn: OneStatusButton = evt.currentTarget as OneStatusButton;
            let nodeView: any = this._itemDic.get(btn);
            if (nodeView["mouseOutHandler"]) {
                nodeView.mouseOutHandler(evt);
            }
        }
        evt.stopPropagation();
    }
}