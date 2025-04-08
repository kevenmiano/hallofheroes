export class FaceType {
    public static LEFT_TEAM = 0x01;
    public static RIGHT_TEAM = 0x02;
}

// 自己的属于哪个side(不管属于哪个side, 自己永远在左边)攻方是1,守方是2;
export class SideType {
    public static ATTACK_TEAM = 0x01;
    public static DEFANCE_TEAM = 0x02;
}

export class RoleType {
    public static T_SINGLE_USER = 0x0001;
    public static T_WILD_LAND = 0x0002;
    public static T_NPC_BOSS = 0x0003;
}

export enum ActionType {
    Stand = 'Stand',
    Walk = 'Walk',
    Danny = 'Danny',
    Attack01 = 'Attack01',
    Attack02 = 'Attack02',
    Attack03 = 'Attack03',
    Die = 'Die',
    Failed = 'Failed',
    Victory = 'Victory',
    Ready = 'Ready',
    guard = 'guard',
}

export class ActionLabesType {
    public static DIE = "Die";
    public static ATTACK = "Attack";
    public static Attack01 = "Attack01";
    public static Attack02 = "Attack02";
    public static Attack03 = "Attack03";
    public static REMOTE_ATTACKS = "RemoteAttacks";
    public static DANNY = "Danny";
    public static WALK = "Walk";
    public static STAND = "Stand";
    public static VICTORY = "Victory";
    public static READY = "Ready";
    public static FAILED = "Failed";

    public static Stand1 = "Stand1";
    public static Stand2 = "Stand2";
    public static Stand3 = "Stand3";
    public static Stand4 = "Stand4";
    public static Stand5 = "Stand5";
    public static Walk1 = "Walk1";
    public static Walk2 = "Walk2";
    public static Walk3 = "Walk3";
    public static Walk4 = "Walk4";
    public static Walk5 = "Walk5";
}

export class BufferCountWayType {
    /**
     * 按回合计算 
     */
    public static TURN = 1;
    /**
     * 按生效次数 
     */
    public static TIME = 2;
}

export class BattleType {
    /**
     * 攻打资源类野地
     */
    public static RES_WILDLAND_BATTLE = 0x01;

    /**
     * 攻打NPC
     */
    public static NPC_WILDLAND_BATTLE = 0x02;

    /**
     * 攻打宝藏
     */
    public static TRE_WILDLAND_BATTLE = 0x03;

    /**
     * 攻城
     */
    public static CASTLE_BATTLE = 0x04;

    /**
     * 玩家间排队遭遇战
     */
    public static WILD_QUEUE_BATTLE = 0x05;

    /**
     * 战役战斗
     */
    public static CAMPAIGN_BATTLE = 0x06;

    /**
     * Boss战斗调试
     */
    public static BATTLE_DEBUG_BOSS = 0x07;

    /**
     * 战斗调试
     */
    public static BATTLE_DEBUG_MODE = 0x08;

    /**
     * 新手战
     */
    public static BATTLE_GUIDEBOOK = 0x09;

    /**
     * 撮合战  多人竞技
     */
    public static BATTLE_MATCHING = 0x0A;

    /**
     * 多人对战  多人副本
     */
    public static BATTLE_MULTIPLAYER = 0x0B;

    /**
     * Boss战
     */
    public static BOSS_BATTLE = 0x0C;

    /**
     * 多人Boss战
     */
    public static MULTIPLAYER_BOSS_BATTLE = 0x0D;

    /**
     * 自定义战斗类型
     */
    public static USER_DEFINE_BATTLE = 0x0E;

    /**
     * 特殊BOSS战
     **/
    public static SPECIAL_BOSS_BATTLE = 0x0F;

    /**
     * 挑战玩家战斗
     **
    **/
    public static BATTLE_CHALLENGE = 0x10;
    /** 
     * 秘境 
     * */
    public static BATTLE_SECRET = 0xf16;

    /**
     * 世界BOSS战
     **/
    public static WORLD_BOSS_BATTLE = 0x11;

    /**
     * NPC跟随战斗
     **/
    public static NPC_FOLLOW_BATTLE = 0x12;

    /**
     * 修行神殿pvp
     **/
    public static HANGUP_PVP = 0x13;
    /**
     * 公会主图腾战
     */
    public static GUILD_TOTEM_BATTLE = 0x14;

    public static ALTAR_BATTLE = 0x15;

    /**公会秘境 人与人*/
    public static SECRECT_LAND = 0x16;
    /**
     *公会秘境, 人打怪 
        */
    public static FAM_NPC_BATTLE = 0x17;
    /**
     *公会战 
        */
    public static GUILD_WAR_BATTLE_PLAYER = 0x18;
    /**
     * 试练之塔 
     */
    public static TRIAL_TOWER_BATTLE = 0x19;
    /**
     * 跨服战场 
     */
    public static CROSS_WAR_FIELD_BATTLE = 0x20;
    /**
     *武斗会 
        */
    public static WARLORDS = 0x21;
    /**
     *武斗会 最后一场战斗
        */
    public static WARLORDS_OVER = 0x22;

    /**
     * 宠物PK 
     */
    public static PET_PK = 0x23;
    /**
     * 宠物岛PK 
     */
    public static PET__HUMAN_PK = 0x24;
    /**
     * 紫晶矿场PK 
     */
    public static MINERAL_PK = 0x26;
    /**
     * 王者之塔 
     */
    public static KING_TOWER_BATTLE = 0x122;
    /**
     * 藏宝图战斗 
     */
    public static TREASUREMAP_BATTLE = 0x123;
    /**
     * 公会秘境攻打盗宝者 
     */
    public static CONSORTIA_FAM_LORDS_BATTLE = 0x27;
    /**
     * 天穹之径 
     */
    public static SINGLE_PASS = 0x125;
    /**
     * 诸神降临挑战
     */
    public static TOLLGATE_GOD_BATTLE = 0x126;
    /**
     * 野外战斗
     */
    public static WORLD_MAP_NPC = 0xf01;
    /**
    * 跨服多人副本战斗
    */
    public static CROSS_MULTI_CAMPAIGN = 0xf08;
    /**
     * 宝矿战斗
     */
    public static TREASURE_MINE_BATTLE = 0x136;
    /**
     * 公会BOSS战
     */
    public static CONSORTIA_BOSS_BATTLE = 0x135;
    /**
     * 公会BOSS小怪战
    */
    public static CONSORTIA_BOSS_MONSTER_BATTLE = 0xf09;
    /**
    * 英灵副本战斗 
    */
    public static PET_CAMPAIGN = 0x28;
    /**
    * 双BOSS战
    */
    public static DOUBLE_BOSS_BATTLE = 0x137;
    /**
    * 泰拉神庙一:多人本房间共享Boss战
     */
    public static ROOM_BOSS_BATTLE = 0xf06;

    /**
     * 多人武斗会 
     */
    public static MULTILORDS = 0x134;

    public static MONOPOLY_MIRROR_BATTLE = 0xf0a;

    /**
    * 英灵远征战斗
    */
    public static REMOTE_PET_BATLE = 0xf04;

    /**
    * 大富翁请求援助战斗
    */
    public static MONOPOLY_BATTLE_HELP = 0x133;
    /**
     * 外域战斗
     */
    public static OUTYARD_BATLE = 0xf0f;
    /**
         * 外城pk
         */
    public static OUT_CITY_PK = 0xf10;
    /**
     * 天空之城英灵PK
     */
    public static SPACEMAP_PET_PK = 0xf11;
    /**
     * 外城城战战斗(攻打进攻方)
     */
    public static OUT_CITY_WAR_PK = 0xf12;

    /**
     * 外城英灵城战战斗(英灵PK英灵)
     */
    public static OUT_CITY_WAR_PET_PK = 0xf13;
    /**
     * 外城英灵npc城战战斗（英灵打NPC怪物）
     */
    public static OUT_CITY_WAR_PET_MONSTER_PK = 0xf14;
    /**
     * 外城物资车战斗
     */
    public static OUT_CITY_VEHICLE = 0xf15;
}

export class BloodType {
    //护盾
    public static BLOOD_TYPE_ARMY = 7;
    /**
     * 自身血量 
     */
    public static BLOOD_TYPE_SELF = 6;
    /**
     * 第三条血,不需要实际作用的. 
     */
    public static BLOOD_TYPE_THIRD = 8;
    /**
     * 怒气 
     */
    public static BLOOD_TYPE_SP = 9;
    /**
     *  复活
     */
    public static REVIVE = 10;
    /**
     * 禁用技能 
     */
    public static UNENABLE_SKILL = 11;

    /** 血量恢复正常 不播动画 */
    public static BLOOD_MAXHP = 21;
}

export class PawnViewType {
    public static swf = "-1"
}

export class BattleModelNotic {
    /**
     * battleModel添加或改变roleInfo
     * 
     *  var obj:Object = {oldInfo:<RoleInfo>,newInfo:<RoleInfo>}
     */
    public static ADD_ROLE = "BattleModelNotic.ADD_ROLE";
}

//Buffer生效类型常量类
export class BufferEffectiveType {
    /**
     * 行动时 
     */
    public static ATTACKWAY_ACTION = 1;
    /**
     * 受到伤害时 
     */
    public static ATTACKWAY_BE_DAMAGE = 2;
    /**
     * 造成伤害时 
     */
    public static ATTACKWAY_TAKE_DAMAGE = 3;
    /**
     * 格档时 
     */
    public static ATTACKWAY_PARRY = 4;
}

//buffer处理类型常量类.
export class BufferProcessType {
    /**
     * 添加一个BUFFER. 
     */
    public static ADD = 0;
    /**
     * BUFFER生效 
     */
    public static EFFECTIVE = 1;
    /**
     * 移除BUFFER
     */
    public static REMOVE = 2;
}

/**
 * 区分继承自 RoleInfo 与 RoleViewBase的派生类
 */
export class InheritRoleType {
    public static Default = 0;
    public static Hero = 1;
    public static Pet = 2;
    public static Pawn = 3;
}


/**
 * 区分继承自IAction的派生类
 */
export class InheritIActionType {
    public static IAction: number = 0;
    public static BaseAction: number = 1;
    public static GameBaseAction: number = 2;
    public static SimpleScriptAction: number = 3;
    public static MovePointAction: number = 4;
    public static JumpMoveAction: number = 5;
    public static HideRoleAction: number = 6;
    public static DisplacementAction: number = 7;
    public static DieAction: number = 8;
    public static DannyAction: number = 9;
    public static AwakenAppearAction: number = 10;
    // 



    //技能
    public static BaseSkill: number = 100;
    public static SuccessSkill: number = 101;
    public static FailedSkill: number = 102;
    public static CommonActionSkill: number = 103;
    public static EmptyActionSkill: number = 104;
    public static ShootActionSkill: number = 105;
    public static SpecialActionSkill105: number = 106;
}


export class BattleRoleBufferType {
    public static ALL = 0
    public static OWN = 1
    public static ENEMY = 2
}


export class HeroMovieClipRefType {
    /** UI界面 秘境场景 */
    public static UI_PANEL = 1
    /** 使用单张图片做背景的副本场景 */
    public static SINGLEBG_CAMPAIGN_SCENE = 2
    /** 外城物资车 */
    public static OUTERCITY_VEHICLE = 3
}