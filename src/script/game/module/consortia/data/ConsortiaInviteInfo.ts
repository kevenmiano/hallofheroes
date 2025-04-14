//@ts-expect-error: External dependencies
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { TempleteManager } from "../../../manager/TempleteManager";
/**
 * 公会邀请数据
 * @author yuanzhan.yu
 */
export class ConsortiaInviteInfo extends GameEventDispatcher {
  public id: number;
  /**
   * consortiaId
   */
  public consortiaId: number;

  /**
   * consortiaName
   */
  public consortiaName: string;

  /**
   * createDate
   */
  public createDate: Date;

  /**
   * userId
   */
  public userId: number;

  /**
   * userNickName
   */
  public userNickName: string;

  /**
   * inviteId
   */
  public inviteId: number;

  /**
   * inviteNickName
   */
  public inviteNickName: string;
  /**
   * chairmanName
   */
  public chairmanName: string;

  /**
   * inviteDate
   */
  public inviteDate: Date;

  /**
   * true为公会向用户申请
   */
  public fromType: boolean;
  /**
   * isExist
   */
  public isExist: boolean;
  /**
   * levels
   */
  public levels: number = 0;

  /**
   * addCount
   */
  public addCount: number = 0;

  constructor() {
    super();
  }

  public get SortiaMaxMembers(): number {
    let config =
      TempleteManager.Instance.getConfigInfoByConfigName("Consortia_Member");
    let levelAdd = 0;
    if (config) {
      let add = Number(config.ConfigValue);
      levelAdd = this.levels * add;
    }
    return 30 + levelAdd;
  }
}
