//@ts-expect-error: External dependencies
import Dictionary from "../../../core/utils/Dictionary";
import { Disposeable } from "../../component/DisplayObject";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { BaseCastle } from "../../datas/template/BaseCastle";
import MediatorMananger from "../../manager/MediatorMananger";
import { NotificationManager } from "../../manager/NotificationManager";
import SimpleBuildingFilter from "../castle/filter/SimpleBuildingFilter";
import { WildLand } from "../data/WildLand";
import { NodeState } from "../space/constant/NodeState";
import { PosType } from "../space/constant/PosType";
import Tiles from "../space/constant/Tiles";
import { MapInfo } from "../space/data/MapInfo";
import { MapPhysics } from "../space/data/MapPhysics";
import { PhysicInfo } from "../space/data/PhysicInfo";
import { MapPhysicsBase } from "../space/view/physics/MapPhysicsBase";
import { PhysicsStaticView } from "../space/view/physics/PhysicsStaticView";
import { OuterCityModel } from "./OuterCityModel";
import { MapPhysicsCastle } from "./mapphysics/MapPhysicsCastle";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { PlayerManager } from "../../manager/PlayerManager";
import Sprite = Laya.Sprite;
import { OuterCityNpcView } from "./mapphysics/OuterCityNpcView";
import { OutercityNpcActivationMediator } from "../../mvc/mediator/OutercityNpcActivationMediator";
import { MapPhysicsField } from "./mapphysics/MapPhysicsField";
import TreasureInfo from "../data/TreasureInfo";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";

/**
 * @description	外城建筑层
 * @author yuanzhan.yu
 * @date 2021/11/17 16:05
 * @ver 1.0
 */
export class OuterCityMainBuidingLayer extends Sprite implements Disposeable {
  private _mediatorKey: string;
  private _model: OuterCityModel;
  private _filter: SimpleBuildingFilter;
  private _wildLandList: MapPhysicsBase[] = [];
  public static NAME: string =
    "map.outercity.view.layer.OuterCityMainBuidingLayer";
  public _dic: Dictionary;
  constructor() {
    super();
    this._filter = new SimpleBuildingFilter();
    this.mouseEnabled = true;
    this.scrollRect = null;
    this._dic = new Dictionary();
    this.initRegister();
    this.initTreasure();
  }

  public get wildLandList() {
    return this._wildLandList;
  }

  private initRegister(): void {
    let arr: any[] = [OutercityNpcActivationMediator];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      OuterCityMainBuidingLayer.NAME,
    );
  }

  public set mapData(data: MapInfo) {
    this._model = <OuterCityModel>data;
    this._model.addEventListener(
      OuterCityEvent.CURRENT_CASTLES,
      this.__initCurrentCastlesHandler,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.CURRENT_WILD_LAND,
      this.__initCurrentWildLandHandler,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.CURRENT_CONFIG_CHANGE,
      this.__moviesHandler,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.REMOVE_NODE_MOVIE,
      this.__removeNodeHandler,
      this,
    );
    this._model.addEventListener(
      OuterCityEvent.REMOVE_CASTLE,
      this.__removeCastleHandler,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.UPDATE_TREASURE_INFO,
      this.updateTreasureInfo,
      this,
    );
    NotificationManager.Instance.addEventListener(
      OuterCityEvent.UPDATE_SECOND_NODE_SELE_DATA,
      this.updateWildInfo,
      this,
    );
  }

  private __moviesHandler(obj: any): void {
    if (obj && obj.hasOwnProperty("movies") && obj.hasOwnProperty("tops")) {
      this.addMoviesByLayer(obj.movies, 0);
      this.addMoviesByLayer(obj.tops, 2);
    }
  }

  private addMoviesByLayer(arr: any[], layer: number): void {
    if (!arr) {
      return;
    }
    let movies: Dictionary = this._model.staticMovies;
    for (let i = 0, len = arr.length; i < len; i++) {
      const info: any = arr[i];
      let nodeInfo: WildLand = movies[info.x + "," + info.y] as WildLand;
      if (nodeInfo && nodeInfo.nodeView && nodeInfo.nodeView.parent) {
        continue;
      }
      if (!nodeInfo) {
        nodeInfo = new WildLand();
      }
      let node: MapPhysicsBase = nodeInfo.nodeView as PhysicsStaticView;
      if (!node) {
        node = new PhysicsStaticView();
      }
      node.mouseEnabled = false;
      node.scrollRect = null;
      nodeInfo.nodeView = node;
      let pInfo: PhysicInfo = nodeInfo.info;
      if (!pInfo) {
        pInfo = new PhysicInfo();
      }
      pInfo.types = PosType.MOVIE;
      pInfo.state = NodeState.EXIST;
      pInfo.names = info.url;
      pInfo.posX = info.x / Tiles.WIDTH;
      pInfo.posY = info.y / Tiles.HEIGHT;
      nodeInfo.info = pInfo;
      node.rotation = info.rotation;
      node.info = nodeInfo;
      node.x = info.x;
      node.y = info.y;
      if (layer == 0) {
        this.addChildAt(node, 0);
      } else if (layer == 2) {
        this.addChild(node);
      }
      this._model.addStaticMovie(nodeInfo, info.x + "," + info.y);
    }
  }

  private initTreasure() {
    let treasureArr: Array<TreasureInfo> = this.playerModel.currentMinerals;
    for (let i: number = 0; i < treasureArr.length; i++) {
      let item: TreasureInfo = treasureArr[i] as TreasureInfo;
      let mc: MapPhysicsField = item.nodeView as MapPhysicsField;
      if (!mc) {
        mc = new MapPhysicsField();
      }
      item.nodeView = mc;
      mc.info = item;
      mc.filter = this._filter;
      mc.x = item.x;
      mc.y = item.y;
      if (!this._dic.get(item.templateId)) {
        this._dic.set(item.templateId, mc);
        this.addChild(mc);
        this._wildLandList.push(mc);
      }
    }
  }

  private updateTreasureInfo() {
    let treasureArr: Array<TreasureInfo> = this.playerModel.currentMinerals;
    for (let i: number = 0; i < treasureArr.length; i++) {
      let treasureInfo: TreasureInfo = treasureArr[i] as TreasureInfo;
      if (this._dic.get(treasureInfo.templateId)) {
        let item: MapPhysicsField = this._dic.get(treasureInfo.templateId);
        item.info = treasureInfo;
      }
    }
  }

  private __initCurrentCastlesHandler(arr: any[]): void {
    let itemArr: Array<BaseCastle> = [];
    for (let i: number = 0; i < arr.length; i++) {
      let item: BaseCastle = arr[i] as BaseCastle;
      let mc: MapPhysicsCastle = item.nodeView as MapPhysicsCastle;
      if (!mc) {
        mc = new MapPhysicsCastle();
      }
      item.nodeView = mc;
      mc.info = item;
      mc.filter = this._filter;
      mc.x = item.x;
      mc.y = item.y;
      if (!this._dic.get(item.templateId)) {
        this._dic.set(item.templateId, mc);
        this.addChild(mc);
        itemArr.push(item);
        this._wildLandList.push(mc);
      }
    }
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.ADD_DENSEFOG_BY_BUILD,
      itemArr,
    );
  }

  private __initCurrentWildLandHandler(arr: any[]): void {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      const wl: WildLand = arr[i];
      if (
        wl.info.types == PosType.RESOURCE ||
        wl.info.types == PosType.TREASURE_MINERAL ||
        wl.info.types == PosType.TREASURE
      ) {
        this.addWildLand(wl);
      }
    }
    this.outSceneMovies();
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.ADD_DENSEFOG_BY_MINE,
      arr,
    );
  }

  updateWildInfo(wildInfo: WildLand) {
    let len: number = this.numChildren;
    let item: any;
    for (let i: number = 0; i < len; i++) {
      item = this.getChildAt(i);
      if (item && item instanceof MapPhysicsField) {
        if (item.nodeInfo && item.nodeInfo.templateId == wildInfo.templateId) {
          item.info = wildInfo;
        }
      }
    }
  }

  private __removeNodeHandler(wl: WildLand) {
    if (wl) {
      let mc: MapPhysicsBase = wl.nodeView as MapPhysicsBase;
      if (mc) {
        let index = this._wildLandList.indexOf(mc);
        if (index > -1) {
          this._wildLandList.splice(index, 1);
        }
        if (mc.parent) {
          mc.parent.removeChild(mc);
        }
        mc.dispose();
      }
      mc = null;
    }
  }

  private __removeCastleHandler(bInfo: BaseCastle) {
    if (bInfo) {
      let mc: MapPhysicsCastle = bInfo.nodeView as MapPhysicsCastle;
      if (mc) {
        if (mc.parent) {
          mc.parent.removeChild(mc);
        }
        mc.dispose();
      }
      mc = null;
    }
  }

  private addWildLand(wl: WildLand) {
    wl.loadTime = new Date().getTime();
    let isAdd: boolean = true;
    if (wl.nodeView) {
      if (wl.nodeView instanceof OuterCityNpcView) {
        (wl.nodeView as OuterCityNpcView).dispose();
        wl.nodeView = null;
      } else {
        wl.nodeView["info"] = wl;
        isAdd = false;
      }
    }
    if (
      (isAdd && wl.info.state == NodeState.EXIST) ||
      wl.info.state == NodeState.FIGHTING
    ) {
      //添加新的野地
      this.addNewWildland(wl);
    }
  }

  private addNewWildland(info: WildLand): void {
    let mc: MapPhysicsBase = info.nodeView as MapPhysicsBase;
    if (mc) {
      return;
    }
    mc = new MapPhysicsField();
    mc.info = info;
    mc.filter = this._filter;
    mc.x = info.x;
    mc.y = info.y;
    info.nodeView = mc;
    if (!this._dic.get(info.templateId)) {
      this._dic.set(info.templateId, mc);
      this.addChild(mc);
      this._wildLandList.push(mc);
    }
  }

  public outSceneMovies(): void {
    this.event(OuterCityEvent.DRAG_SCENE_END, this._model.allWildLand);
    this.event(OuterCityEvent.DRAG_SCENE_END, this._model.allCastles);
  }

  public dispose(): void {
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    if (this._model) {
      this._model.removeEventListener(
        OuterCityEvent.CURRENT_WILD_LAND,
        this.__initCurrentWildLandHandler,
        this,
      );
      this._model.removeEventListener(
        OuterCityEvent.CURRENT_CASTLES,
        this.__initCurrentCastlesHandler,
        this,
      );
      this._model.removeEventListener(
        OuterCityEvent.CURRENT_CONFIG_CHANGE,
        this.__moviesHandler,
        this,
      );
      this._model.removeEventListener(
        OuterCityEvent.REMOVE_NODE_MOVIE,
        this.__removeNodeHandler,
        this,
      );
      this._model.removeEventListener(
        OuterCityEvent.REMOVE_CASTLE,
        this.__removeCastleHandler,
        this,
      );
      NotificationManager.Instance.removeEventListener(
        OuterCityEvent.UPDATE_TREASURE_INFO,
        this.updateTreasureInfo,
        this,
      );
      NotificationManager.Instance.removeEventListener(
        OuterCityEvent.UPDATE_SECOND_NODE_SELE_DATA,
        this.updateWildInfo,
        this,
      );
      this.disposeNode(this._model.allCastles);
      this.disposeNode(this._model.allWildLand);
    }
    this._filter = null;
    this._model = null;
    ObjectUtils.disposeAllChildren(this);
    this.removeSelf();
  }

  private disposeNode(dic: Dictionary): void {
    for (const dicKey in dic) {
      if (dic.hasOwnProperty(dicKey)) {
        let temp: Dictionary = dic[dicKey];
        for (const tempKey in temp) {
          if (temp.hasOwnProperty(tempKey)) {
            let item: MapPhysics = temp[tempKey];
            if (item && item.nodeView) {
              item.nodeView["dispose"]();
            }
            item = null;
          }
        }
      }
    }
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    let mc: any = evt.target;
    if (mc && mc.mouseClickHandler) {
      return mc.mouseClickHandler(evt);
    }
    return false;
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    let mc: any = evt.target;
    if (mc && mc.mouseOverHandler) {
      return mc.mouseOverHandler(evt);
    }
    return false;
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    let mc: any = evt.target;
    if (mc && mc.mouseOutHandler) {
      return mc.mouseOutHandler(evt);
    }
    return false;
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }
}
