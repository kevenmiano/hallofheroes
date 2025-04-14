import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../manager/ArmyManager";
import FrameDataBase from "../../../mvc/FrameDataBase";

/**
 * @author:zhihua.zhou
 * @data: 2021-12-1 16:28
 * @description 邮箱验证模型数据
 */
export default class MailCheckModel extends FrameDataBase {
  public isShow: boolean = false; //是否显示图标
  public state: number; //0 代表未填写邮箱, 1代表已填写邮箱,未验证,3代表已验证完毕
  public mailAddress: string; //
  public refreshTime: number = -1;
  public static HAND_REFRESH_LIMIT: number = 60;

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }
}
