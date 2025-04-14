import PassTaskItemData from "./PassTaskItemData";

/**
 * 通行证任务数据
 */
export default class PassTaskModel {
  public dayFreshNum: number = 0; //今日任务已刷新次数
  public weekFreshNum: number; //周任务已刷新次数
  public originId: number; //任务刷新前的任务唯一Id
  public opType: number; // 操作类型  1 重置所有任务
  taskListData: Array<PassTaskItemData> = [];

  constructor() {}

  /**
   * 获取不同页签类型的任务
   * @param area
   * @returns
   */
  getTaskListByType(area: number): Array<PassTaskItemData> {
    let arr: Array<PassTaskItemData> = [];
    for (let i = 0; i < this.taskListData.length; i++) {
      const element = this.taskListData[i];
      if (element.area == area) {
        arr.push(element);
      }
    }
    return arr;
  }

  /**
   * 刷新后要重置日任务
   */
  // resetDayTask(){
  //     let arr:Array<PassTaskItemData> = [];
  //     for (let i = 0; i <this.taskListData.length;  i++) {
  //         const element = this.taskListData[i];
  //         if(element && element.area == 1){
  //             this.taskListData.splice(i,1);
  //             i--;
  //         }
  //     }
  // }

  /**
   *
   * @param taskType
   * @param taskId
   */
  getTaskItemData(id: number): PassTaskItemData {
    for (let i = 0; i < this.taskListData.length; i++) {
      const element = this.taskListData[i];
      if (element.id == id) {
        return element;
      }
    }
    return null;
  }
}
