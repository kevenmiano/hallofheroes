//@ts-expect-error: External dependencies
import SimpleBuildingFilter from "../../../castle/filter/SimpleBuildingFilter";
import NodeResourceType from "../../constant/NodeResourceType";
import SpaceNodeType from "../../constant/SpaceNodeType";
import { SpaceNode } from "../../data/SpaceNode";
import SpaceManager from "../../SpaceManager";
import { SpaceModel } from "../../SpaceModel";
import SpaceScene from "../../../../scene/SpaceScene";
import { SpaceNpcView } from "../physics/SpaceNpcView";
import NpcAiInfo from "../../../ai/NpcAiInfo";
import Tiles from "../../constant/Tiles";
import { AiStateType } from "../../constant/AiStateType";
import { SpaceArmyView } from "../physics/SpaceArmyView";
import { IEnterFrame } from "../../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../../manager/EnterFrameManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import Logger from "../../../../../core/logger/Logger";
import { SpeedEnumerate } from "../../constant/SpeedEnumerate";
import { ConfigManager } from "../../../../manager/ConfigManager";

export class SpaceNpcLayer implements IEnterFrame {
  public static NAME: string = "map.space.view.layer.SpaceNpcLayer";
  private _mediatorKey: string;
  private _container: Laya.Sprite;
  private _avatarList: SpaceNpcView[] = [];
  private _filter: SimpleBuildingFilter = new SimpleBuildingFilter();
  private _controlder: SpaceScene;

  constructor($parent: Laya.Sprite) {
    this._container = $parent;
    this._controlder = SpaceManager.Instance.controller;
    this.init(this.model.mapNodesData);
    this.addEvent();
    this.initRegister();
  }

  private init(arr: SpaceNode[]) {
    // Logger.xjy("[SpaceNpcLayer]init arr", arr)
    // let testArr = []
    if (!arr) {
      return;
    }
    let len: number = arr.length;
    let node: SpaceNode;
    let npc: SpaceNpcView;
    let aiInfo: NpcAiInfo;
    for (let i: number = 0; i < len; i++) {
      node = arr[i];
      if (node.resource != NodeResourceType.Image) {
        continue;
      }
      if (node.info.types == SpaceNodeType.BORN_POINT) {
        continue;
      }
      if (node.info.types == SpaceNodeType.TREASURE_MAP) {
        continue;
      }
      if (node.nodeId == SpaceNodeType.ID_SINGLE_PASS) {
        continue;
      }
      npc = new SpaceNpcView("", "", 0, 0);
      this._container.addChild(npc);
      aiInfo = new NpcAiInfo();
      aiInfo.isLiving = true;
      aiInfo.moveState = AiStateType.STAND;
      aiInfo.centerPoint = new Laya.Point(node.x, node.y);
      if (node.info.types == SpaceNodeType.MOVEMENT && node.patrolPos) {
        this.initPathInfo(node, npc, aiInfo);
        aiInfo.speed = SpeedEnumerate.NPC_SPACE_MOVE_SPEED;
      }
      npc.info = aiInfo;
      node.nodeView = npc;
      npc.nodeInfo = node;
      npc.filter = this._filter;
      npc.x = node.curPosX * Tiles.WIDTH;
      npc.y = node.curPosY * Tiles.HEIGHT;
      this._avatarList.push(npc);
      this._controlder.addNpcView(npc);

      // testArr.push(node)
    }
    // Logger.xjy("[SpaceNpcLayer]init testArr", testArr)
  }

  private initPathInfo(cInfo: SpaceNode, npc: SpaceNpcView, aiInfo: NpcAiInfo) {
    npc.pathCache = [];
    aiInfo.pathInfo = [];
    let posArray: any[] = cInfo.patrolPos.split("|");
    let pos: any[];
    let point: Laya.Point;
    for (let i: number = 0; i < posArray.length; i++) {
      pos = posArray[i].split(",");
      point = new Laya.Point();
      point.x = pos[0];
      point.y = pos[1];
      npc.pathCache.push(point);
      aiInfo.pathInfo.push(point);
    }
  }

  private initRegister() {
    let arr: any[] = [];
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this._container,
      SpaceNpcLayer.NAME,
    );
  }

  private addEvent() {
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  private removeEvent() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  public enterFrame() {
    this._avatarList.forEach((element) => {
      element.execute();
    });
  }

  public onClickHandler(evt: Laya.Event): boolean {
    if (evt.target instanceof SpaceNpcView) {
      let npcTarget: SpaceNpcView = evt.target as SpaceNpcView;
      if (npcTarget) {
        if (npcTarget.mouseClickHandler(evt)) {
          return true;
        }
      }
    }
    this._avatarList.forEach((element) => {
      if (element.mouseClickHandler(evt)) {
        return true;
      }
    });
    return false;
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    if (evt.target instanceof SpaceNpcView) {
      let npcTarget: SpaceNpcView = evt.target as SpaceNpcView;
      if (npcTarget) {
        if (npcTarget.mouseMoveHandler(evt)) {
          return true;
        }
      }
    }
    this._avatarList.forEach((element) => {
      if (element.mouseMoveHandler(evt)) {
        return true;
      }
    });
    if (evt.target instanceof SpaceArmyView) {
      let armyTarget: SpaceArmyView = evt.target as SpaceArmyView;
      if (armyTarget) {
        if (armyTarget.mouseMoveHandler(evt)) {
          return true;
        }
      }
    }
    return false;
  }

  public get avatarList(): any[] {
    return this._avatarList;
  }

  private get model(): SpaceModel {
    return SpaceManager.Instance.model;
  }

  public dispose() {
    this.removeEvent();
    this._avatarList.forEach((element) => {
      element.dispose();
    });
    this._filter = null;
  }
}
