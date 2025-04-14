/**
 * 通行证任务单条数据
 */
export default class PassTaskItemData {
  public taskId: number; //任务id

  public taskType: number; //任务类型  1今日任务 2周任务 3 成就任务

  public status: number; //1、已完成未领取 2、未完成 3、已领取

  public finishNum: number; //目前完成的数量
  public id: number; //任务唯一Id
  public area: number; //页签
}
