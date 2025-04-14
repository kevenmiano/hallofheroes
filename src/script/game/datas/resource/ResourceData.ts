import { ResourceEvent } from "../../constant/event/NotificationEvent";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";

export class ResourceData extends GameEventDispatcher {
  private _baseYield: number = 0;
  constructor() {
    super();
  }

  public get baseYield(): number {
    return this._baseYield;
  }

  private _count: number = 0;
  public get count(): number {
    return this._count;
  }
  private _limit: number = 0;
  public get limit(): number {
    return this._limit;
  }

  public synchronizationResource(base: number, count: number, limit: number) {
    var number: number = count - this._count;
    this._baseYield = base;
    this._count = count;
    this._limit = limit;
    this.dispatchEvent(ResourceEvent.RESOURCE_UPDATE, number);
  }
}
