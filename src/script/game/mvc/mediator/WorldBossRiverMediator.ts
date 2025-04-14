import UIManager from "../../../core/ui/UIManager";
import {
  CampaignEvent,
  CampaignMapEvent,
  NotificationEvent,
  OuterCityEvent,
} from "../../constant/event/NotificationEvent";
import { EmWindow } from "../../constant/UIDefine";
// import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { VIPManager } from "../../manager/VIPManager";
import { CampaignArmy } from "../../map/campaign/data/CampaignArmy";
import { CampaignArmyState } from "../../map/campaign/data/CampaignArmyState";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import WorldBossRiverWnd from "../../module/worldboss/view/WorldBossRiverWnd";
import { PlayerManager } from "../../manager/PlayerManager";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
// import { WorldBossSocketOutManager } from "../../manager/WorldBossSocketOutManager";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { TempleteManager } from "../../manager/TempleteManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import LangManager from "../../../core/lang/LangManager";

/**
 *
 * 世界Boss复活界面控制
 *
 */
export default class WorldBossRiverMediator {
  private _army: CampaignArmy;

  private _autoEnterFight: boolean = false;

  public register(target: object) {
    this._army = CampaignManager.Instance.mapModel.selfMemberData;
    if (this._army) {
      this._army.addEventListener(
        CampaignMapEvent.IS_DIE,
        this.__isDieHandler,
        this,
      );
      CampaignManager.Instance.mapModel.addEventListener(
        OuterCityEvent.CURRENT_NPC_POS,
        this.__autoHandler,
        this,
      );
      if (this.playerModel)
        this.playerModel.addEventListener(
          CampaignEvent.WORLDBOSS_AUTO_WALK_CHANGED,
          this.__autoHandler,
          this,
        );
      this.__autoHandler();
      this.__isDieHandler(null);
    }
  }

  public unregister(target: object) {
    if (this._army) {
      this._army.removeEventListener(
        CampaignMapEvent.IS_DIE,
        this.__isDieHandler,
        this,
      );
      CampaignManager.Instance.mapModel.removeEventListener(
        OuterCityEvent.CURRENT_NPC_POS,
        this.__autoHandler,
        this,
      );
      if (this.playerModel)
        this.playerModel.removeEventListener(
          CampaignEvent.WORLDBOSS_AUTO_WALK_CHANGED,
          this.__autoHandler,
          this,
        );
      UIManager.Instance.HideWind(EmWindow.WorldBossRiverWnd);
    }
    this._army = null;
  }

  private __isDieHandler(evt: CampaignMapEvent) {
    if (this._army.isDie == 1) {
      var time: number = new Date().getTime();
      time = time - this._army.riverStartTime;
      if (time < 20000 && time > 0) {
        time = this._army.riverTime - time;
      } else {
        time = this._army.riverTime;
      }
      let type = 1;
      if (
        WorldBossHelper.checkInPetBossFloor(
          CampaignManager.Instance.mapModel.mapId,
        )
      ) {
        type = WorldBossRiverWnd.PET_BOSS;
      }
      if (type == 1) {
        //世界BOSS
        if (PlayerManager.Instance.currentPlayerModel.worldBossIsAutoLive) {
          //如果是自动复活状态
          MessageTipManager.Instance.show(
            LangManager.Instance.GetTranslation(
              "WorldBossRiverMediator.tips1",
              Math.ceil(time / 1000),
            ),
          );
          let flag: boolean =
            PlayerManager.Instance.currentPlayerModel.wolrdBossAutoLiveCostType;
          PlayerManager.Instance.currentPlayerModel.riverStartTime =
            this._army.riverStartTime;
          PlayerManager.Instance.currentPlayerModel.riverTime =
            this._army.riverTime;
          if (!this.checkAutoLiveCost(flag)) {
            //判断钻石够不够
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "WorldBossRiverMediator.tips2",
              ),
            );
            this.playerModel.setWorldBossAutoLive(
              PlayerModel.WORLDBOSS_CANCEL_AUTO_LIVE,
            ); //取消自动
            UIManager.Instance.ShowWind(EmWindow.WorldBossRiverWnd, {
              count: Math.ceil(time / 1000),
              type: type,
            });
          }
        } else {
          UIManager.Instance.ShowWind(EmWindow.WorldBossRiverWnd, {
            count: Math.ceil(time / 1000),
            type: type,
          });
        }
      } else {
        UIManager.Instance.ShowWind(EmWindow.WorldBossRiverWnd, {
          count: Math.ceil(time / 1000),
          type: type,
        });
      }
    } else {
      UIManager.Instance.HideWind(EmWindow.WorldBossRiverWnd);
      this.__autoHandler();
    }
  }

  private checkAutoLiveCost(payType: boolean): boolean {
    let flag: boolean = true;
    let autoLiveCost = parseInt(
      TempleteManager.Instance.getConfigInfoByConfigName("Live_Fight_Pay")
        .ConfigValue,
    );
    if (payType) {
      //优先使用绑定钻石
      if (this.playerInfo.point + this.playerInfo.giftToken < autoLiveCost) {
        flag = false;
      }
    } else {
      //只使用钻石
      if (this.playerInfo.point < autoLiveCost) {
        flag = false;
      }
    }
    return flag;
  }

  /**是否自动寻路 */
  private __autoHandler() {
    var isAuto: boolean = false;
    let grade = VIPManager.Instance.model.vipInfo.VipGrade;
    let selfArmy = CampaignManager.Instance.mapModel.selfMemberData;
    let isDie = CampaignArmyState.checkDied(selfArmy.isDie);
    // let worldBossAutoTemp = TempleteManager.Instance.getPrivilegeTempletesByTypeLevel(VipPrivilegeType.WORLDBOSS_AUTO, grade);
    // if (worldBossAutoTemp) {
    // 	isAuto = worldBossAutoTemp.para1 > 0 && !isDie;
    // }
    // else{
    // 	isAuto = PlayerManager.Instance.currentPlayerModel.worldBossIsAutoFight && !isDie;
    // }
    isAuto =
      PlayerManager.Instance.currentPlayerModel.worldBossIsAutoFight && !isDie;
    if (isAuto) {
      this.workNextNode();
    } else {
      if (this._army) {
        var armyView = CampaignManager.Instance.controller.getArmyView(
          this._army,
        );
        if (armyView) armyView.aiInfo.pathInfo = [];
      }
    }
  }

  private get playerModel(): PlayerModel {
    return PlayerManager.Instance.currentPlayerModel;
  }

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private workNextNode(e: Event = null) {
    NotificationManager.Instance.dispatchEvent(
      NotificationEvent.WORK_NEXT_NODE,
      null,
    );
  }
}
