import Dictionary from "../../../../core/utils/Dictionary";
import { t_s_itemtemplateData } from "../../../config/t_s_itemtemplate";
import { SharedManager } from "../../../manager/SharedManager";
import FrameDataBase from "../../../mvc/FrameDataBase";
import HeadFrameInfo from "./HeadFrameInfo";

export default class HeadIconModel extends FrameDataBase {
  public allHeadFrameList: Dictionary; //玩家拥有的所有头像框列表
  public allHeadFrameFrameIdList: Array<number> = []; //玩家拥有的所有头像框的id列表
  public currentEquipFrameId: number = 0; //当前装备的头像框id
  private static _instance: HeadIconModel;
  constructor() {
    super();
  }

  public static get instance(): HeadIconModel {
    if (!HeadIconModel._instance) HeadIconModel._instance = new HeadIconModel();
    return HeadIconModel._instance;
  }

  public hasActive(item: t_s_itemtemplateData): boolean {
    let flag: boolean = false;
    if (this.allHeadFrameFrameIdList.indexOf(item.TemplateId) != -1) {
      flag = true;
    }
    return flag;
  }

  /**
   *
   * @returns 检测所有激活的头像框是否都被点击过
   */
  public checkHasAllClick(): boolean {
    let flag: boolean = true;
    let dic: Dictionary = this.allHeadFrameList;
    for (const key in dic) {
      if (Object.prototype.hasOwnProperty.call(dic, key)) {
        let info: HeadFrameInfo = dic[key];
        if (info && info.clickNum == 0) {
          //未点击
          flag = false;
        }
      }
    }
    return flag;
  }
}
