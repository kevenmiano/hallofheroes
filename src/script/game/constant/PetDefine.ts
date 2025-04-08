// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-10 20:20:02
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-11-15 16:44:20
 * @Description: 
 */


export enum PetTipType {
    Bag,
    PetChallenge,
}

export enum PetChallengeState {
    Equiped,  //已装备
    UnEquiped,//未装备
}

export class PetChallengeEvent {
    public static CHALLENGE_INFO_CHAGNE: string = "CHALLENGE_INFO_CHAGNE";
    public static CHALLENGE_TIME_CHANGE: string = "CHALLENGE_TIME_CHANGE";
    public static CHALLENGE_SKILL_CHANGE: string = "CHALLENGE_SKILL_CHANGE";
    public static CHALLENGE_EVENT_CHANGE: string = "CHALLENGE_EVENT_CHANGE"; //日志列表
    public static READY_ON_FORMATION_STATE: string = "READY_ON_FORMATION_STATE"; //准备上阵状态  废弃
    public static RESET_SELECTED_STATE: string = "RESET_SELECTED_STATE"; //取消选中状态  废弃
}

export class PetChallengeRewardType {
    public static GOODS = 1;
    public static BUFF = 2;
    public static APPELL = 3;
}

export class PetChallengeTimeRewardType {
    public static DayReward = 1;
    public static WeekReward = 2;
}