// @ts-nocheck
/**
 * 七日目标任务数据
 */
export default class SevenTaskInfo {
    public taskId: number = 0;//任务id
    public day:number = 0//天数
    public taskType: number = 0;//任务类型  0成长任务 1今日挑战
    public status: number = 0;//1、已完成未领取 2、未完成  3、已领取
    public finishNum:number = 0;//目标完成的数量
}