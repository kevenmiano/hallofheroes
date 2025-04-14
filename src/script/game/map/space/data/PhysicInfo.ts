import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { t_s_mapphysicpositionData } from "../../../config/t_s_mapphysicposition";
import { PhysicsEvent } from "../../../constant/event/NotificationEvent";
/**
 *  与表现相关的数据 作为MapPhysics一个属性而存在
 */
export class PhysicInfo extends GameEventDispatcher {
  public id: number = 0;
  public mapId: number = 0;
  public grade: number = 0;
  public vipCastleView: number = 0;
  public vipType: number = 0;
  public vipGrade: number = 0;
  public posX: number = 0;
  public posY: number = 0;
  public _types: number = 0;
  public names: string = ""; //对应NPC名称
  public nodeName: string = ""; //对应节点名称
  public descrption: string = ""; // 描述
  private _state: number = 0; // 当前状态 0表示不存在 1表示存在 2表示正在战斗
  public canOccupied: boolean;
  public occupyPlayerId: number = 0; // 当前占领用户 (未被占领用户ID为0)
  public occupyPlayerName: string = ""; // 占领玩家
  public occupyLeagueName: string = ""; // 占领联盟
  public occupyLeagueConsortiaId: number = 0; // 占领联盟ID
  public crystalsYield: number = 0;
  public goldYield: number = 0;
  public op: number = 0;
  public battleType: number = 0;
  public consortiaJoin: number = 0;
  public bagJoin: number = 0;
  public nodeData: t_s_mapphysicpositionData; //类型——1城堡、2宝藏矿脉、3矿区、4boss、5精英、6小怪

  public get state(): number {
    return this._state;
  }

  public set state(value: number) {
    this._state = value;
    this.dispatchEvent(PhysicsEvent.UP_STATE, value);
  }

  public get types(): number {
    return this._types;
  }

  public set types(values: number) {
    this._types = values;
  }
}
