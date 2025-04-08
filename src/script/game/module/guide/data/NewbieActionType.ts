// @ts-nocheck
/**
* @author:pzlricky
* @data: 2021-05-25 12:11
* @description *** 
*/
export default class NewbieActionType {

    public static a1: string = "NewbieBaseActionMediator|showMask";  //显示新手遮罩
    public static a2: string = "NewbieBaseActionMediator|drawTargetOnMask";  //在遮罩上绘制显示目标对象
    public static a3: string = "NewbieBaseActionMediator|hideMask";  //隐藏新手遮罩
    public static a4: string = "NewbieBaseActionMediator|cleanDrawContainer";  //清除遮罩上的绘制
    public static a5: string = "NewbieBaseActionMediator|sendEnterScene";  //发送进入场景
    public static a6: string = "NewbieBaseActionMediator|emptyAction";  //空指引
    public static a7: string = "NewbieBaseActionMediator|showDialog";  //显示对话
    public static a8: string = "NewbieBaseActionMediator|showMapName";  //播放地图名动画
    public static a9: string = "NewbieBaseActionMediator|moveNPC";  //移动NPC（寻路）
    public static a10: string = "NewbieBaseActionMediator|taskTraceItemShine";  //任务追踪闪烁
    public static a11: string = "NewbieBaseActionMediator|setTaskArrowGuild";  //设置任务追踪箭头指引
    public static a12: string = "NewbieBaseActionMediator|moveFocusToCastleBuild";  //移动焦点到内城建筑
    public static a13: string = "NewbieBaseActionMediator|castleBuildShine";  //内城建筑闪烁
    public static a14: string = "NewbieBaseActionMediator|createGuildFrame1";  //创建指引对话框1（带蒂娜头像, tragetObj会发光）
    public static a15: string = "NewbieBaseActionMediator|createGuildFrame2";  //创建指引对话框2（不带蒂娜头像）
    public static a17: string = "NewbieBaseActionMediator|createGuildFrame4";  //创建指引对话框4（内城建筑说明框）
    public static a18: string = "NewbieBaseActionMediator|tweenTarget";  //对目标执行tween动画
    public static a19: string = "NewbieBaseActionMediator|controlBattleState";  //控制当前战斗状态
    public static a20: string = "NewbieBaseActionMediator|createGuildArrow1";  //创建指引箭头1
    public static a21: string = "NewbieBaseActionMediator|cleanGuildArrow";  //清除指引箭头
    public static a22: string = "NewbieBaseActionMediator|cleanGuildFrame";  //清除指引对话框
    public static a23: string = "NewbieBaseActionMediator|cleanAll";  //清除所有（遮罩、遮罩上的绘制、指引对话框等）
    public static a24: string = "NewbieBaseActionMediator|setMainToolBarBtn";  //设置主工具条按钮
    public static a28: string = "NewbieBaseActionMediator|sendInitBuildAndQueue";  //发送初始化内城建筑和队列
    public static a29: string = "NewbieBaseActionMediator|createSelectRoleView";  //创建选择角色界面
    public static a30: string = "NewbieBaseActionMediator|visitSpaceNPC";  //访问天空之城NPC
    public static a31: string = "NewbieBaseActionMediator|sendCallInCampaign";  //发送执行副本中回调
    public static a32: string = "NewbieSpecialActionMediator|tinaTreatEffect";  //播放蒂娜治疗效果
    public static a33: string = "NewbieSpecialActionMediator|addDropWeaponMovie";  //添加遗弃武器的动画
    public static a34: string = "NewbieBaseActionMediator|closeFrameByType";  //关闭窗口
    public static a35: string = "NewbieBaseActionMediator|createGuildTarget";  //创建指引对象
    public static a36: string = "NewbieBaseActionMediator|cleanCreateTarget";  //清除创建的指引对象
    public static a37: string = "NewbieBaseActionMediator|setTargetPosAndScale";  //设置目标对象位置和缩放
    public static a38: string = "NewbieBaseActionMediator|sendSetSkillFastKey";  //发送设置技能快捷键
    public static a39: string = "NewbieBaseActionMediator|showNewSkillInBattle";  //在战斗中显示技能
    public static a40: string = "NewbieBaseActionMediator|setTargetDisplayIndex";  //设置目标对象显示层次
    public static a41: string = "NewbieBaseActionMediator|openHelpFrame";  //打开帮助窗口
    public static a43: string = "NewbieSpecialActionMediator|pawnAllocateGuild";  //配兵指引
    public static a44: string = "NewbieSpecialActionMediator|weaponIntensifyGuild";  //强化武器指引
    public static a45: string = "NewbieBaseActionMediator|moveNPCByTween";  //移动NPC（非寻路）
    public static a46: string = "NewbieBaseActionMediator|sendEnterCollectionBattle";  //触发采集战斗
    public static a47: string = "NewbieBaseActionMediator|setKeyboardState";  //设置键盘状态
    public static a48: string = "NewbieBaseActionMediator|clearCurrentGameAction";  //清除游戏中当前action
    public static a49: string = "NewbieBaseActionMediator|cleanGameLayer";  //清理游戏层
    public static a50: string = "NewbieBaseActionMediator|setNPC";  //设置NPC
    public static a51: string = "NewbieSpecialActionMediator|showOutCityBattleMovie";  //设置外城城堡站状态
    public static a52: string = "NewbieBaseActionMediator|sendOuterCityBattleAndQueue";  //请求外城城堡战斗
    public static a53: string = "NewbieBaseActionMediator|moveOuterCityMap";  //移动外城地图
    public static a54: string = "NewbieSpecialActionMediator|getWorldMapMovie";  //获取世界地图11-20加上动画
    public static a55: string = "NewbieBaseActionMediator|autoMoveAndAttack";  //获取世界地图11-20加上动画
    public static a60: string = "NewbieBaseActionMediator|showMapBtn";  //刷新天空之城、内城切换按钮
    public static a61: string = "NewbieBaseActionMediator|showTaskWnd";  //是否显示任务引导窗口
    public static a62: string = "NewbieBaseActionMediator|moveFocusToFarmBuild";  //移动焦点到农场建筑
    public static a63: string = "NewbieBaseActionMediator|showFarmFriend";  //农场好友列表显示
    public static a64: string = "NewbieBaseActionMediator|sendFinishCampaign";  //退出副本
    public static a65: string = "NewbieBaseActionMediator|closeWindowsByTypes";  //关闭窗口集
}