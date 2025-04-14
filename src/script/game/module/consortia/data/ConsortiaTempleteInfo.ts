//@ts-expect-error: External dependencies
import { ConsortiaEvent } from "../../../constant/event/NotificationEvent";
import { TempleteManager } from "../../../manager/TempleteManager";
import { ConsortiaUpgradeType } from "../../../constant/ConsortiaUpgradeType";
import GameEventDispatcher from "../../../../core/event/GameEventDispatcher";
import { t_s_consortialevelData } from "../../../config/t_s_consortialevel";

/**
 * 公会技能数据
 * @author yuanzhan.yu
 */
export class ConsortiaTempleteInfo extends GameEventDispatcher {
  private _templateId: number = 0;
  public type: number = 0;
  private _level: number = 0;
  /**
   * 是否是下一级才引出
   */
  public isNext: boolean;

  constructor() {
    super();
  }

  /**
   * 获得物品模板
   * @return
   *
   */
  public get templateInfo(): t_s_consortialevelData {
    return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
      this.type,
      this.level,
    );
  }

  public get nextTemplateInfo(): t_s_consortialevelData {
    if (this.level == ConsortiaUpgradeType.MAX_LEVEL) {
      return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
        this.type,
        this.level,
      );
    }
    return TempleteManager.Instance.getConsortiaTempleteByTypeAndLevel(
      this.type,
      this.level + 1,
    );
  }

  /**
   * 模板ID
   */
  public get templateId(): number {
    return this._templateId;
  }

  /**
   * @private
   */
  public set templateId(value: number) {
    this._templateId = value;
    this.dispatchEvent(ConsortiaEvent.ON_TEMPLETEID_UPDATA);
  }

  public get level(): number {
    return this._level;
  }

  public set level(value: number) {
    if (this._level == value) {
      return;
    }
    this._level = value;
    this.dispatchEvent(ConsortiaEvent.ON_TEMPLETEID_UPDATA);
  }
}
