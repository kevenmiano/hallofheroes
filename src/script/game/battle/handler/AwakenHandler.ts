import { FaceType } from "../../constant/BattleDefine";
import { AwakenAppearAction } from "../actions/AwakenAppearAction";
import { BattleManager } from "../BattleManager";
import { BattleUtils } from "../utils/BattleUtils";

export class AwakenHandler {
	/**
	*role BaseRoleInfo
	**/
    public static addRole(role) {
        role.face = role.side == 1 ? FaceType.LEFT_TEAM : FaceType.RIGHT_TEAM;
        role.load();
        BattleManager.Instance.battleModel.addRole(role);

        var temp: Laya.Point = BattleUtils.rolePointByPos(role.pos, role.face);
        role.point = temp;

        new AwakenAppearAction(role);
    }
}
