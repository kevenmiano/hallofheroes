
/**
 *  NPC攻击 战斗范围的枚举
 */
export class NpcEffectiveState {
    public static ATTACK_RADIUS: number = 600;//攻击范围半径
    public static BATTLE_RADIUS: number = 60;//战斗范围半径
    public static ALERT_RADIUS: number = 300;//警戒范围半径
    public static TOWER_RADIUS: number = 60; //塔防触发半径

    private static _isNovice: boolean = true;
    public static set novice(b: boolean) {
        NpcEffectiveState._isNovice = b;
        if (b) {
            NpcEffectiveState.ATTACK_RADIUS = 600;
            NpcEffectiveState.BATTLE_RADIUS = 80;
            NpcEffectiveState.ALERT_RADIUS = 300;
        }
        else {
            NpcEffectiveState.ATTACK_RADIUS = 600;
            NpcEffectiveState.BATTLE_RADIUS = 60;
            NpcEffectiveState.ALERT_RADIUS = 300;
        }
    }
    constructor() {
    }
}