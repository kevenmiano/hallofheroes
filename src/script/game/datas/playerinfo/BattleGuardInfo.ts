import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import ConfigMgr from "../../../core/config/ConfigMgr";
import { ConfigType } from "../../constant/ConfigDefine";
import { t_s_itemtemplateData } from "../../config/t_s_itemtemplate";
import { BattleGuardSocketInfo } from "./BattleGuardSocketInfo";
import { ArmyManager } from "../../manager/ArmyManager";

/**
 * 战斗守护信息
 * 包含多个插槽信息
 */
export class BattleGuardInfo extends GameEventDispatcher {
  /**
   * 战斗守护信息开放等级
   */
  public static OPEN_GRADE: number = 55;

  private _notchList: BattleGuardSocketInfo[];
  private _battleWillPower: BattleGuardSocketInfo;

  constructor() {
    super();

    this._notchList = [];
    for (let i: number = 0; i < 6; i++) {
      this._notchList[i] = new BattleGuardSocketInfo(i, 3);
      this._notchList[i].type = 2;
    }
    this._battleWillPower = new BattleGuardSocketInfo(0, 3);
    this._battleWillPower.type = 1;
  }

  public get notchList(): BattleGuardSocketInfo[] {
    return this._notchList;
  }

  public get battleWillPower(): BattleGuardSocketInfo {
    return this._battleWillPower;
  }

  public getSocketInfo(type: number, pos: number): BattleGuardSocketInfo {
    if (type == 1) {
      return this._battleWillPower;
    } else {
      return this._notchList[pos];
    }
  }

  public get battleWillPoint(): number {
    let res: number = 0;
    for (let i = 0; i < this.battleWillPower.itemList.length; i++) {
      let tid: number = this.battleWillPower.itemList[i];
      if (tid > 0) {
        let t: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          tid.toString(),
        );
        res += t.ReduceResi;
      }
    }
    return res;
  }

  public getAllPoint(): any[] {
    let fire: number = 0;
    let water: number = 0;
    let wind: number = 0;
    let ele: number = 0;
    let light: number = 0;
    let dark: number = 0;

    for (const key in this.notchList) {
      let item: BattleGuardSocketInfo = this.notchList[key];
      for (const keyel in item.itemList) {
        let tid: number = item.itemList[keyel];
        if (tid <= 0) {
          continue;
        }
        let t: t_s_itemtemplateData = ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_itemtemplate,
          tid.toString(),
        );
        fire += t.FireResi;
        water += t.WaterResi;
        wind += t.WindResi;
        ele += t.ElectResi;
        light += t.LightResi;
        dark += t.DarkResi;
      }
    }
    let res: any[] = [];
    res.push(this.battleWillPoint);
    res.push(fire);
    res.push(water);
    res.push(wind);
    res.push(ele);
    res.push(light);
    res.push(dark);
    return res;
  }

  /**是否已镶嵌 */
  public isEquiped(gtid: number): boolean {
    let selectItem = ArmyManager.Instance.thane.selectGuardSocketInfo;
    if (selectItem) {
      return selectItem.existGoods(gtid);
    } else {
      for (const key in this.notchList) {
        let item: BattleGuardSocketInfo = this.notchList[key];
        for (const keyel in item.itemList) {
          let tid: number = item.itemList[keyel];
          if (tid == gtid) {
            return true;
          }
        }
      }
      for (let i = 0; i < this.battleWillPower.itemList.length; i++) {
        let tid: number = this.battleWillPower.itemList[i];
        if (tid == gtid) {
          return true;
        }
      }
    }
    return false;
  }
}
