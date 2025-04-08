import LangManager from "../../../core/lang/LangManager";
import { VIPEvent } from "../../constant/event/NotificationEvent";
import { TipMessageData } from "../../datas/TipMessageData";
import { VipInfo } from "../../datas/vip/VipInfo";
import { VipRouletteInfo } from "../../datas/vip/VipRouletteInfo";
import GameEventDispatcher from "../../../core/event/GameEventDispatcher";
import { TempleteManager } from "../../manager/TempleteManager";
import { t_s_vipprerogativetemplateData } from "../../config/t_s_vipprerogativetemplate";
import { VipPrivilegeType } from "../../constant/VipPrivilegeType";
import { ArrayConstant, ArrayUtils } from "../../../core/utils/ArrayUtils";

export class VIPModel extends GameEventDispatcher {
  private _one_MonthPoint: number = 0;
  private _three_MonthPoint: number = 0;
  private _six_MonthPoint: number = 0;
  private _delayTime: number = 0;

  public curOpenVipBox: boolean = false;

  public static OPEN_GIFT_FRAME: number = 1;
  public static OPEN_PRIVILEGE_FRAME: number = 2;
  public static OPEN_VIPBOX_FRAME: number = 3;

  public static VIP_FRIEND: number = 6; //好友
  public static VIP_HDILA: number = 7; //光晶
  public static VIP_ACTIVE: number = 2; //活跃
  public static VIP_COOL: number = 16; //冷却队列

  private _vipInfo: VipInfo;
  private _rouletteInfo: VipRouletteInfo;

  constructor() {
    super();
    this._vipInfo = new VipInfo();
  }

  public get one_MonthPoint(): number {
    return this._one_MonthPoint;
  }

  public set one_MonthPoint(value: number) {
    this._one_MonthPoint = value;
  }

  public get three_MonthPoint(): number {
    return this._three_MonthPoint;
  }

  public set three_MonthPoint(value: number) {
    this._three_MonthPoint = value;
  }

  public get six_MonthPoint(): number {
    return this._six_MonthPoint;
  }

  public set six_MonthPoint(value: number) {
    this._six_MonthPoint = value;
  }

  public get delayTime(): number {
    return this._delayTime;
  }

  public set delayTime(value: number) {
    this._delayTime = value;
  }

  public get vipInfo(): VipInfo {
    return this._vipInfo;
  }

  public set vipInfo(value: VipInfo) {
    let title: string;
    let data: Object;
    if (this._vipInfo.VipGrade < value.VipGrade && this._vipInfo.VipGrade > 0) {
      this._vipInfo = value;
      title = LangManager.Instance.GetTranslation(
        "tasktracetip.view.VipUpGradeTipView.TitleTxt"
      );
      data = { type: TipMessageData.VIP_GRADE, title: title };
      this.dispatchEvent(VIPEvent.VIP_RECHARGE_TIP, data);
    } else {
      this._vipInfo = value;
    }
    if (this._vipInfo.IsTakeGift && this._vipInfo.IsVipAndNoExpirt) {
      title = LangManager.Instance.GetTranslation(
        "tasktracetip.view.VipGiftGetTipView.TitleTxt"
      );
      data = { type: TipMessageData.VIP_GIFT, title: title };
      this.dispatchEvent(VIPEvent.VIP_RECHARGE_TIP, data);
    }
    this.dispatchEvent(VIPEvent.UPFRAMEVIEW_CHANGE);
  }

  public get rouletteInfo(): VipRouletteInfo {
    return this._rouletteInfo;
  }

  public set rouletteInfo(value: VipRouletteInfo) {
    this._rouletteInfo = value;
  }

  public commitOpenBoxEvent() {
    this.dispatchEvent(VIPEvent.VIP_OPEN_BOX);
  }

  public vipOpenTips() {
    let title: string = LangManager.Instance.GetTranslation(
      "tasktracetip.view.VipRechargeTipView.TitleTxt"
    );
    let data: Object = { type: TipMessageData.VIP_OPEN, title: title };
    this.dispatchEvent(VIPEvent.VIP_RECHARGE_TIP, data);
  }

  /**
   * vip光晶加成
   *
   * */
  public get vipHdilaPrivilege(): number {
    if (!this._vipInfo.IsVipAndNoExpirt) {
      return 0;
    }
    // let arr:any[] = TempleteManager.Instance.vipPrerogativeTemplateCate.getTemplatesByType(VIPModel.VIP_HDILA);
    // for(let i:number = 0 ;i<arr.length;i++)
    // {
    // 	if(this._vipInfo.VipGrade == arr[i].grade)
    // 	{
    // 		return arr[i].para1;
    // 	}
    // }
    return 0;
  }

  /**
   * vip好友特权加成
   *
   * */
  public get vipFriendPrivilege(): number {
    if (!this._vipInfo.IsVipAndNoExpirt) {
      return 0;
    }
    let arr: any[] = TempleteManager.Instance.getPrivilegeTempletesByType(
      VipPrivilegeType.FRIEND_COUNT
    );
    for (let i: number = 0; i < arr.length; i++) {
      if (this._vipInfo.VipGrade == arr[i].grade) {
        if (arr[i].para1 == 0) return 0;
        else return Number(arr[i].para1);
      }
    }
    return 0;
  }

  /**
   * vip活跃值特权加成
   *
   * */
  public get vipActivePrivilege(): number {
    if (!this._vipInfo.IsVipAndNoExpirt) {
      return 0;
    }
    // let arr:any[] = TempleteManager.Instance.vipPrerogativeTemplateCate.getTemplatesByType(9);
    // for(let i:number = 0 ;i<arr.length;i++)
    // {
    // 	if(this._vipInfo.VipGrade == arr[i].grade)
    // 	{
    // 		return arr[i].para1;
    // 	}
    // }
    return 0;
  }

  /**
   * vip冷却特权
   *
   * */
  public get vipCoolPrivilege(): boolean {
    return this.isOpenPrivilege(VipPrivilegeType.COLD_QUEUE);
  }

  /**
   * 玩家是否拥有该特权
   * @param type 特权类型 VipPrivilegeType
   * @param vipLevel 玩家VIP等级
   * @returns
   */
  public isOpenPrivilege(type: number, vipLevel?: number): boolean {
    if (!vipLevel) {
      vipLevel = this._vipInfo.VipGrade;
    }
    let temples =
      TempleteManager.Instance.getPrivilegeTempletesByLevel(vipLevel);
    for (let index = 0; index < temples.length; index++) {
      let element = temples[index];
      if (element.type == type && element.para1 != 0) {
        return true;
      }
    }
    return false;
  }

  public isVipMount(mountId: number): boolean {
    let temples = TempleteManager.Instance.getPrivilegeTempletesByType(
      VipPrivilegeType.MOUNT
    );
    for (let index = 0; index < temples.length; index++) {
      let element = temples[index];
      if (element.para1 == mountId) {
        return true;
      }
    }
    return false;
  }

  /**
   *
   * @param type 特权类型 VipPrivilegeType
   * @param currentGrade 玩家VIP等级
   */
  public getMinGradeHasPrivilege(type: number): number {
    let grade = 0;
    let temples: t_s_vipprerogativetemplateData[] =
      TempleteManager.Instance.getPrivilegeTempletesByType(type);
    temples = ArrayUtils.sortOn(temples, ["grade"], [ArrayConstant.NUMERIC]);
    let item = temples[0];
    if (item) grade = item.grade;
    return grade;
  }

  /**
   * 获取特权配置Param1
   * @param type 特权类型
   * @param grade grade等级
   * @returns
   */
  public getPrivilegeParam1ByGrade(type: number, grade: number): number {
    let temp = TempleteManager.Instance.getPrivilegeTempletesByTypeLevel(
      type,
      grade
    );
    if (temp) {
      return Number(temp.para1);
    }
    return 0;
  }
}
