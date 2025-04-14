import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
/**
 * 好友模块数据的存储、处理类, 提供数据操作的API
 */
export default class FriendModel extends GameEventDispatcher {
  /**
   *item类型——添加分组
   */
  public static ITEMTYPE_ADD_GROUP: number = -1;
  /**
   * item类型——好友
   */
  public static ITEMTYPE_FRIEND: number = 0;
  /**
   *item类型——分组
   */
  public static ITEMTYPE_GROUP: number = 1;
  /**
   * 每页显示查找好友结果数
   */
  public static FIND_RESULTS_PER_PAGE: number = 10;
  /**
   * 上一次请求最近联系人状态时间
   */
  public lastReqRecentsTime: number = -1;
  /**
   *当前选中分组
   */
  public curSelectedGroup: any; //FriendItemCellInfo

  constructor() {
    super();
  }
}
