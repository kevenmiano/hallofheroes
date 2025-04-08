/**
* @author:pzlricky
* @data: 2021-08-03 17:59
* @description 设置界面数据 
*/
export default class SettingData {


    public Type: SettingType = SettingType.NONE;

    public Value: number | string = null;

    public Progress: number | boolean = 0;
    /** 隐私列表每条权限 */
    public Title: string = '';
    type: string;

    constructor() {

    }

}
export enum MessageBoxType {
    SPACE = 1,//天空之城气泡是否显示
    OUTTERCITY = 2,//野外场景气泡是否显示
    CAMPAIGN = 3,//副本地图气泡是否显示
}

/**设置类型 */
export enum SettingType {
    NONE = 0,
    GAME_MUSIC,//背景音乐
    GAME_EFFECT,//游戏音效
    SCENE_EFFECT,//场景特效
    REFUSE_ROOM_INVITE,//拒绝房间邀请
    SHADOW_Effect,//战斗幻影
    HIDE_FIGHTING_OBJECT,//技能特效
    REFUSE_TEAM_INVITE,//拒绝队伍邀请
    REFUSE_INVITATION,//拒绝切磋邀请
    REFUSE_FRIEND,//拒绝被添加为好友
    BUILDING_NAME,//建筑名称

    REFUSE_CONSORTIA_INVITE,//拒绝公会邀请
    REFUSE_ACCESS_INFO,//拒绝被查看信息
    HIGH_FRAME,//高帧率模式
    HIDE_PLAYER_NAME,//屏蔽玩家名字
    HIDE_OTHER_PLAYER,//隐藏其他玩家
    PUSH_MSG,//消息推送
    mbSetingTK,//天空之城气泡是否显示
    mbSetingYW,//野外场景气泡是否显示
    mbSetingFB,//副本地图气泡是否显示
    mbSetingHD,//活动地图气泡是否显示
    mbSetingZD,//战斗场景气泡是否显示
    mbSetingDW,//队伍房间气泡是否显示
    PUSH_FARM,//
    PUSH_WORLDBOSS,//
    PUSH_GUILD_TREE,//
    PUSH_GUILD_WAR,//
    PUSH_MULTICAMP,//
    PUSH_BUILD_ORDER,//
    Push_TEMPLE_REWARD,//
    ShortCut_InTeam,//
    ShortCut_AllTeam,//
    //11是否接收push农场消息(result: 0: 不接收 1: 接收)
    //12是否接收push世界BOSS消息(result: 0: 不接收 1: 接收)
    //13是否接收push公会神树消息(result: 0: 不接收 1: 接收)
    //14是否接收push公会战消息(result: 0: 不接收 1: 接收)
    //15是否接收push多人副本消息(result: 0: 不接收 1: 接收)
    //16是否接收push建筑队列消息(result: 0: 不接收 1: 接收)
}

export enum OptType {
    refuseFamInvite = 1,
    refuseLookInfo = 2,
    refuseConsortiaInvite = 3,
    isOpenPushMsg = 4,
    mbSetingTK = 5,//
    mbSetingYW = 6,//
    mbSetingFB = 7,//
    mbSetingHD = 8,//
    mbSetingZD = 9,//
    mbSetingDW = 10,//

    push_farm = 11,//
    push_worldboss = 12,//
    push_guild_tree = 13,//
    push_guild_war = 14,//
    push_multicamp = 15,//
    push_building_order = 16,//
    push_temple_reward = 17,//
    ShortCut_InTeam = 18,//
    ShortCut_AllTeam = 19,//
    chat_translate = 20
}
