import Dictionary from "../../../core/utils/Dictionary";
import { Disposeable } from "../../component/DisplayObject";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { IEnterFrame } from "../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import MediatorMananger from "../../manager/MediatorMananger";
import AIBaseInfo from "../ai/AIBaseInfo";
import SimpleBuildingFilter from "../castle/filter/SimpleBuildingFilter";
import { WildLand } from "../data/WildLand";
import { NodeState } from "../space/constant/NodeState";
import { MapInfo } from "../space/data/MapInfo";
import { OuterCityModel } from "./OuterCityModel";
import Sprite = Laya.Sprite;
import { OuterCityNpcView } from "./mapphysics/OuterCityNpcView";
import { OutercityNpcActivationMediator } from "../../mvc/mediator/OutercityNpcActivationMediator";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import UIManager from "../../../core/ui/UIManager";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerManager } from "../../manager/PlayerManager";
import { OuterCityScene } from "../../scene/OuterCityScene";
import { SceneManager } from "../scene/SceneManager";
import { MapPhysicsBase } from "../space/view/physics/MapPhysicsBase";
import { eAvatarBaseViewType } from "../view/hero/AvatarBaseView";
import { HeroAvatarView } from "../view/hero/HeroAvatarView";
import { OuterCityArmyView } from "./OuterCityArmyView";
import { MapPhysicsField } from "./mapphysics/MapPhysicsField";

/**
 * @description    外城npc层
 * @author yuanzhan.yu
 * @date 2021/11/17 17:05
 * @ver 1.0
 */
export class OuterCityNpcLayer extends Sprite implements IEnterFrame, Disposeable {
    private _mediatorKey: string;
    private _model: OuterCityModel;
    private _filter: SimpleBuildingFilter;
    private _npcList: OuterCityNpcView[] = [];
    private _bossList: OuterCityNpcView[] = [];
    private clickPlayerArr: Array<HeroAvatarView | MapPhysicsBase> = [];
    private clickPlayerFlag: boolean = false;
    public get npcList() {
        return this._npcList;
    }
    public static NAME: string = "map.outercity.view.layer.OuterCityNpcLayer";

    constructor() {
        super();
        this.mouseEnabled = true;
        this.scrollRect = null;
        this._filter = new SimpleBuildingFilter();
        this.initRegister();
    }

    public set mapData(data: MapInfo) {
        this._model = <OuterCityModel>data;
        this._model.addEventListener(OuterCityEvent.CURRENT_WILD_LAND, this.__initCurrentWildLandHandler, this);
        this._model.addEventListener(OuterCityEvent.REMOVE_NODE_NPC, this.__removeNodeHandler, this);
        EnterFrameManager.Instance.registeEnterFrame(this);
    }

    private initRegister(): void {
        let arr: any[] = [OutercityNpcActivationMediator];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, OuterCityNpcLayer.NAME);
    }

    private __removeNodeHandler(wl: WildLand): void {
        if (wl && wl.nodeView) {
            let mc: OuterCityNpcView = wl.nodeView as OuterCityNpcView;
            if (mc) {
                mc.dispose();
                if (mc.parent) {
                    mc.parent.removeChild(this);
                }
            }
            mc = null;
        }
    }

    private __initCurrentWildLandHandler(arr: any[]): void {
        for (let i = 0, len = arr.length; i < len; i++) {
            const wl: WildLand = arr[i];
            if(WorldBossHelper.isOutecityNPCNode(wl.info.types)){
                this.addWildLand(wl);
            }
        }
    }
    
    private clearAllBossNode() {
        for (let i: number = 0; i < this._bossList.length; i++) {
            let item: OuterCityNpcView = this._bossList[i];
            if (item && (item instanceof OuterCityNpcView)) {
                item.dispose();
                item = null;
            }
        }
    }

    private addNpcView(info: WildLand): void {
        let mc: OuterCityNpcView = new OuterCityNpcView();
        mc.x = info.x;
        mc.y = info.y;
        mc.info = new AIBaseInfo();
        mc.info.pathInfo = [];
        mc.filter = this._filter;
        info.nodeView = mc;
        this.addChild(mc);
        mc.nodeInfo = info;
        mc.refresh();
        this._npcList.push(mc);
    }

    private addWildLand(wl: WildLand): void {
        let mc: OuterCityNpcView = wl.nodeView as OuterCityNpcView;
        wl.loadTime = new Date().getTime();
        if (mc) {
            if (wl.info.state == NodeState.EXIST) {
                mc.nodeInfo = wl;
            }
        }
        else if (wl.info.state == NodeState.EXIST || wl.info.state == NodeState.FIGHTING)//添加新的野地
        {
            this.addNpcView(wl);
        }
    }

    /**
     * 获得重叠玩家的数量
     * @param posx 被点击玩家的坐标
     * @param posy 
     */
    public checkClickPlayerNum(posx: number, posy: number):boolean{
        if (this.clickPlayerFlag) {
            return false;
        }
        this.clickPlayerFlag = true;//避免快速执行两次
        setTimeout(() => { this.clickPlayerFlag = false; }, 1000);

        let armyArr = []
        this.clickPlayerArr = []

        let mapView = (SceneManager.Instance.currentScene as OuterCityScene).mapView
        if (mapView && mapView.mainBuidingLayer) {
            let wildLandList = mapView.mainBuidingLayer.wildLandList
            wildLandList.forEach(wildLand => {
                if (wildLand) {
                    let ishit = wildLand.hitTestPoint(posx, posy);
                    if (ishit) {
                        this.clickPlayerArr.push(wildLand);
                    }
                }
            });
        }

        if (mapView && mapView.npcLayer) {
            let npcList = mapView.npcLayer.npcList
            npcList.forEach(npcView => {
                if (npcView.avatarView && npcView.avatarBaseViewType == eAvatarBaseViewType.OuterCityNpc) {
                    let ishit = npcView.avatarView.hitTestPoint(posx, posy);
                    if (ishit) {
                        this.clickPlayerArr.push(npcView);
                    }
                }
            });
        }

        this['_children'].forEach(roleView => {
            if (roleView.avatarBaseViewType == eAvatarBaseViewType.OuterCityArmy) {
                // Logger.xjy('-------------roleView.data.baseHero.userId',roleView.data.baseHero.userId,'========',PlayerManager.Instance.currentPlayerModel.playerInfo.nickName,'=======PlayerManager.Instance.currentPlayerModel.playerInfo.userId'+PlayerManager.Instance.currentPlayerModel.playerInfo.userId);
                if (roleView.avatarView && roleView.data.baseHero.userId != PlayerManager.Instance.currentPlayerModel.playerInfo.userId) {
                    let ishit = roleView.avatarView.hitTestPoint(posx, posy);//avatar本身的区域比较大, 要用avatar模型做点击检测
                    if (ishit) {
                        armyArr.push(roleView);
                    }
                }
            }
        });
        this.clickPlayerArr.push(...armyArr)
        if (this.clickPlayerArr.length > 1) {
            UIManager.Instance.ShowWind(EmWindow.LookPlayerList, this.clickPlayerArr);
            return true;
        } else if (this.clickPlayerArr.length == 1) {
            let nodeView = this.clickPlayerArr[0]
            if (nodeView instanceof HeroAvatarView) {
                if (nodeView.avatarBaseViewType == eAvatarBaseViewType.OuterCityArmy) {
                    (nodeView as OuterCityArmyView).showTip();
                } else if (nodeView.avatarBaseViewType == eAvatarBaseViewType.OuterCityNpc) {
                    (nodeView as OuterCityNpcView).attackFun();
                }
            }
            else if (nodeView instanceof MapPhysicsField) {
                (nodeView as MapPhysicsField).attackFun();
            }
            return true;
        }
        return false;
    }

    public onClickHandler(evt: Laya.Event): boolean {
        if (evt.target instanceof OuterCityNpcView) {
            let npcTarget: OuterCityNpcView = evt.target as OuterCityNpcView;
            if (npcTarget) {
                if (npcTarget.mouseClickHandler(evt)) {
                    return true;
                }
            }
        }
        this._npcList.forEach((element) => {
            if (element.mouseClickHandler(evt)) {
                return true;
            }
        });
        return false;
    }

    public enterFrame(): void {
        let dic: Dictionary = this._model.allWildLand;
        for (const dicKey in dic) {
            if (dic.hasOwnProperty(dicKey)) {
                let temp: Dictionary = dic[dicKey];
                for (const tempKey in temp) {
                    if (temp.hasOwnProperty(tempKey)) {
                        let item: WildLand = temp[tempKey];
                        if (item.nodeView instanceof OuterCityNpcView) {
                            (item.nodeView as OuterCityNpcView).execute();
                        }
                    }
                }
            }
        }
    }


   

    public mouseMoveHandler(evt: Laya.Event): boolean {
        let item: OuterCityNpcView = evt.target as OuterCityNpcView;
        if (item instanceof OuterCityNpcView) {
            return item.mouseMoveHandler(evt);
        }
        return false;
    }

    public dispose(): void {
        MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        EnterFrameManager.Instance.unRegisteEnterFrame(this);
        this._model.removeEventListener(OuterCityEvent.CURRENT_WILD_LAND, this.__initCurrentWildLandHandler, this);
        this._model.removeEventListener(OuterCityEvent.REMOVE_NODE_NPC, this.__removeNodeHandler, this);
        this.removeSelf();
    }

}