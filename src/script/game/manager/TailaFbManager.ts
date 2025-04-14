import { PackageIn } from "../../core/net/PackageIn";
import { ServerDataManager } from "../../core/net/ServerDataManager";
import { MovePointAction } from "../battle/actions/MovePointAction";
import { BattleManager } from "../battle/BattleManager";
import { BaseRoleInfo } from "../battle/data/objects/BaseRoleInfo";
import { BattleUtils } from "../battle/utils/BattleUtils";
import { FaceType } from "../constant/BattleDefine";
import { BattleNotic } from "../constant/event/NotificationEvent";
import { S2CProtocol } from "../constant/protocol/S2CProtocol";
import { NotificationManager } from "./NotificationManager";
//@ts-expect-error: External dependencies
import ControlBuffStateMsg = com.road.yishi.proto.battle.ControlBuffStateMsg;
export class TailaFbManager {
  private static _Instance: TailaFbManager;

  public static get Instance(): TailaFbManager {
    if (!this._Instance) {
      this._Instance = new TailaFbManager();
    }
    return this._Instance;
  }

  public setup() {
    this.initEvent();
  }

  private initEvent() {
    ServerDataManager.listen(
      S2CProtocol.U_BATTLE_CONTROL_BUFF_STATE,
      this,
      this.__bossControlHandle,
    );
  }

  private __bossControlHandle(pkg: PackageIn) {
    let msg: ControlBuffStateMsg = pkg.readBody(
      ControlBuffStateMsg,
    ) as ControlBuffStateMsg;
    BattleManager.Instance.battleModel.bossControlLivingId = msg.controled
      ? msg.livingId
      : 0;
    if (BattleManager.Instance.battleModel.selfHero.livingId == msg.livingId) {
      NotificationManager.Instance.sendNotification(
        BattleNotic.SKILL_ENABLE,
        !msg.controled,
      );
    }
    BattleManager.Instance.battleModel.getRoleById(msg.livingId).side =
      msg.side;
    this.runTo(msg.livingId, msg.side, msg.pos);
  }

  private runTo(livingId: number, side: number, pos: number) {
    var role: BaseRoleInfo =
      BattleManager.Instance.battleModel.getRoleById(livingId);
    role.pos = pos;
    role.face =
      role.side == BattleManager.Instance.battleModel.selfSide
        ? FaceType.LEFT_TEAM
        : FaceType.RIGHT_TEAM;
    var temp: Laya.Point = BattleUtils.rolePointByPos(role.pos, role.face);
    new MovePointAction(
      role.livingId,
      temp,
      25,
      0,
      false,
      false,
      true,
      false,
      function () {
        BattleManager.Instance.battleModel.getRoleById(livingId).side = side;
      },
      null,
      true,
      null,
      100,
      true,
    );
  }
}
