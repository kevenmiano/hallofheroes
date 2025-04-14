//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import {
  OuterCityEvent,
  PhysicsEvent,
} from "../../../constant/event/NotificationEvent";
import ChatData from "../../../module/chat/data/ChatData";
import { MapGrid } from "../constant/MapGrid";
import Tiles from "../constant/Tiles";
import { PhysicInfo } from "./PhysicInfo";

/**
 * 地图所有显示元素基类
 */
export class MapPhysics extends GameEventDispatcher {
  protected _info: PhysicInfo;
  public visitState: number = 0;
  public nodeView: Laya.Sprite;
  private _chatData: ChatData;

  public get info(): PhysicInfo {
    return this._info;
  }

  public get chatData(): ChatData {
    return this._chatData;
  }

  public set chatData(value: ChatData) {
    this._chatData = value;
    this.dispatchEvent(PhysicsEvent.CHAT_DATA, this._chatData);
  }

  public set info(value: PhysicInfo) {
    this._info = value;
    this._x = this._info.posX * Tiles.WIDTH;
    this._convertX = MapGrid.getConvertWidth(this._info.posX);
    this._y = this._info.posY * Tiles.HEIGHT;
    this._convertY = MapGrid.getConvertHeight(this._info.posY);
  }

  private _convertX: number = 0;
  private _convertY: number = 0;
  private _x: number = 0;
  private _y: number = 0;

  public get posX(): number {
    return this._info.posX;
  }

  public get posY(): number {
    return this._info.posY;
  }

  public get convertX(): number {
    return this._convertX;
  }

  public move(px: number, py: number) {
    this._info.posX = px;
    this._info.posY = py;
    this._x = this._info.posX * Tiles.WIDTH;
    this._convertX = MapGrid.getConvertWidth(this._info.posX);
    this._y = this._info.posY * Tiles.HEIGHT;
    this._convertY = MapGrid.getConvertHeight(this._info.posY);
    this.emit(PhysicsEvent.MOVE_POS, this._chatData);
  }

  public get convertY(): number {
    return this._convertY;
  }

  get x(): number {
    return this._x;
  }

  get y(): number {
    return this._y;
  }

  set x(value: number) {
    this._x = value;
  }

  set y(value: number) {
    this._y = value;
  }

  public set nodeViewVisible(b: boolean) {
    this.nodeView.visible = b;
  }

  public get nodeViewVisible(): boolean {
    return this.nodeView.visible;
  }

  public commit() {
    this.dispatchEvent(OuterCityEvent.UPDATA_MAP_PHYSICS, this);
  }
}
