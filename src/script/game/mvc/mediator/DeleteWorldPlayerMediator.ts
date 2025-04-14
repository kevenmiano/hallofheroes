import Dictionary from "../../../core/utils/Dictionary";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { ArmyManager } from "../../manager/ArmyManager";
import { EnterFrameManager } from "../../manager/EnterFrameManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { OuterCityArmyView } from "../../map/outercity/OuterCityArmyView";
import { BaseArmy } from "../../map/space/data/BaseArmy";

/**
 * @description    移除不在同一屏幕的玩家
 * @author yuanzhan.yu
 * @date 2021/11/23 17:22
 * @ver 1.0
 */
export class DeleteWorldPlayerMediator implements IMediator, IEnterFrame {
  constructor() {}

  public register(target: object): void {
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  public unregister(target: object): void {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  private _count: number;

  public enterFrame(): void {
    this._count++;
    if (this._count >= 125) {
      this._count = 0;
      this.checkPlayerOutScene();
    }
  }

  private checkPlayerOutScene(): void {
    let dict: Dictionary = OuterCityManager.Instance.model.allArmyDict;
    let arr: any[] = OuterCityManager.Instance.model.nineSliceScaling;
    let armys: any[] = [];

    for (const dictKey in dict) {
      if (dict.hasOwnProperty(dictKey)) {
        let bArmy: BaseArmy = dict[dictKey];
        if (bArmy.id != ArmyManager.Instance.army.id) {
          if (!bArmy.armyView) {
            delete dict[bArmy.id];
            continue;
          }
          let vx: number = Number(bArmy.armyView.x / 1000);
          let vy: number = Number(bArmy.armyView.y / 1000);
          let sceneId: string = vx + "," + vy;
          if (arr.indexOf(sceneId) == -1) {
            delete dict[bArmy.id];
            (bArmy.armyView as OuterCityArmyView).dispose();
          }
        }
      }
    }
  }
}
