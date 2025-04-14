//@ts-expect-error: External dependencies
import Logger from "../../../../core/logger/Logger";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import { HeroRoleInfo } from "../../../battle/data/objects/HeroRoleInfo";
import { WorldBossEvent } from "../../../constant/event/NotificationEvent";
import { ThaneInfo } from "../../../datas/playerinfo/ThaneInfo";
import { CampaignManager } from "../../../manager/CampaignManager";
import { CampaignNode } from "../../../map/space/data/CampaignNode";
import WorldBossModel from "../../../mvc/model/worldboss/WorldBossModel";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import WorldBossInfoView from "../../worldboss/view/WorldBossInfoView";
import ConsortiaBossInfo from "../data/ConsortiaBossInfo";

export default class ConsortiaBossSceneWnd extends BaseWindow {
  private _bossInfoView: WorldBossInfoView;
  private _worldBossModel: WorldBossModel;
  private _bossInfoInited: boolean = false;
  private _preHp: number = 0;
  constructor() {
    super();
    this.resizeContent = true;
  }

  public OnInitWind() {
    super.OnInitWind();
    this.initEvent();
    this._worldBossModel = CampaignManager.Instance.worldBossModel;
    this.addBossInfoUI();
  }

  OnShowWind() {
    super.OnShowWind();
    this.updateBossInfo();
  }

  private initEvent() {
    this.model.addEventListener(
      WorldBossEvent.UPDATE_CONSORTIA_BOSS_HP,
      this.updateBossInfo,
      this,
    );
  }

  private removeEvent() {
    this.model.removeEventListener(
      WorldBossEvent.UPDATE_CONSORTIA_BOSS_HP,
      this.updateBossInfo,
      this,
    );
  }

  private updateBossInfo() {
    if (this._worldBossModel.consortiaBosstotalHp <= 0 || !this._bossInfoView) {
      return;
    }
    if (!this._bossInfoInited) {
      this.updateWorldBossInfo();
      this._bossInfoInited = true;
      this._bossInfoView.setTotalHp(this._worldBossModel.consortiaBosstotalHp);
      this._bossInfoView.setCurrentHp(this._worldBossModel.consortiaBossCurHp);
    }

    if (
      this._preHp != 0 &&
      this._preHp - this._worldBossModel.consortiaBossCurHp > 0
    )
      this._bossInfoView.updateWorldBossHp(
        this._worldBossModel.consortiaBossCurHp - this._preHp,
      );
    this._preHp = this._worldBossModel.consortiaBossCurHp;
  }

  /**更新世界Boss信息 */
  private updateWorldBossInfo() {
    var arr: Array<CampaignNode> =
      CampaignManager.Instance.mapModel.mapNodesData;
    var endBoss: CampaignNode;
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        var node: CampaignNode = arr[key];
        if (
          WorldBossHelper.checkConsortiaBoss(
            CampaignManager.Instance.mapModel.mapId,
          )
        ) {
          if (node.param1 == ConsortiaBossInfo.BOSS_TYPE) {
            endBoss = node;
            break;
          }
        } else {
          endBoss = node;
          break;
        }
      }
    }
    if (!endBoss || !this._worldBossModel) return;
    this._bossInfoView &&
      this._bossInfoView.setInfo(this.createHeroInfo(endBoss));
  }

  private addBossInfoUI() {
    this._bossInfoView =
      WorldBossInfoView.createInstance() as WorldBossInfoView;
    this._bossInfoView.setParent(this.getContentPane());
  }

  private createHeroInfo(endBoss: CampaignNode): HeroRoleInfo {
    var info: HeroRoleInfo = new HeroRoleInfo();
    info.heroInfo = new ThaneInfo();
    info.heroInfo.grades = this._worldBossModel.bossGrades;
    info.heroInfo.nickName = endBoss.info.names;
    info.heroInfo.templateId = endBoss.heroTemplateId;
    return info;
  }

  public get model(): WorldBossModel {
    return CampaignManager.Instance.worldBossModel;
  }

  dispose() {
    this._bossInfoInited = false;
    this.removeEvent();
    super.dispose();
  }
}
