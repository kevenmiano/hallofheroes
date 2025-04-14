/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2021-04-13 17:46
 */
export default class SelectTaskItemData {
  constructor(
    type: number,
    taskType: number,
    name: string,
    itemData: any = null,
    enabled: boolean = true,
  ) {
    this.type = type;
    this.taskType = taskType;
    this.titleName = name;
    this.itemData = itemData;
    this.enabled = enabled;
  }
  public type: number;
  public taskType: number;
  public titleName: string;
  public itemData: any;
  public enabled: boolean; // 是否可用
}
