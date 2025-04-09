/**
* @author:pzlricky
* @data: 2021-07-19 21:00
* @description ***
*/
export default class WorldRewardVO {

    public campaignId: number = 0; // 战役ID
    public rewardid: number = 0;   // 奖励id
    public woundmsg: string = '';// 伤害
    public rewardmsg: string = ''// 奖励
    public state: number = 0//状态,0是未领取,1是已领.

    public needEffect: boolean = true;

}