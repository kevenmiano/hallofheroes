//@ts-expect-error: External dependencies
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import { WorldMapHelper } from "../../../utils/WorldMapHelper";
import LangManager from "../../../../core/lang/LangManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import SceneType from "../../../map/scene/SceneType";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";
import { SceneManager } from "../../../map/scene/SceneManager";
import { CampaignManager } from "../../../manager/CampaignManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { EmWindow } from "../../../constant/UIDefine";
import { WorldMapCtrl } from "../../castle/control/WorldMapCtrl";
import { TempleteManager } from "../../../manager/TempleteManager";
import BuildingManager from "../../../map/castle/BuildingManager";
import { FieldData } from "../../../map/castle/data/FieldData";
import { PlayerModel } from "../../../datas/playerinfo/PlayerModel";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/11/15 21:05
 * @ver 1.0
 */
export class WorldMapWnd extends BaseWindow {
  public title: fgui.GTextField;
  public closeBtn: UIButton;
  public btn_map1: UIButton;
  public btn_map2: UIButton;
  public btn_map3: UIButton;
  public btn_map4: UIButton;
  public btn_map5: UIButton;

  private __mapId: number = 0;

  constructor() {
    super();
  }

  public OnInitWind() {
    super.OnInitWind();

    this.initData();
    this.initView();
    this.initEvent();
    this.setCenter();
  }

  private initData() {}

  private initView() {}

  private initEvent() {
    this.btn_map1.view.onClick(this, this.__mouseClickHandler, [1]);
    this.btn_map2.view.onClick(this, this.__mouseClickHandler, [2]);
    this.btn_map3.view.onClick(this, this.__mouseClickHandler, [3]);
    this.btn_map4.view.onClick(this, this.__mouseClickHandler, [4]);
    this.btn_map5.view.onClick(this, this.__mouseClickHandler, [5]);
  }

  public OnShowWind() {
    super.OnShowWind();
  }

  /**
   *
   * @param mapId 检测玩家在当前地图是否有占领的宝藏矿脉
   * @returns
   */
  private checkCurrentMapId(mapId: number): boolean {
    let flag: boolean = false;
    //forEach优化
    // BuildingManager.Instance.model.treasureDic.forEach((ele) => {
    //     if (ele && ele.mapId == mapId) {
    //         flag = true;
    //     }
    // });
    //forEach优化--
    // let treasureDic = BuildingManager.Instance.model.treasureDic;
    // for (let ele of treasureDic.values()) {
    //     if (ele && ele.mapId == mapId) {
    //         flag = true;
    //         break;
    //     }
    // }
    return flag;
  }

  private __mouseClickHandler(mapId: number, e: Laya.Event) {
    this.__mapId = mapId;
    if (!WorldMapHelper.chcekMapId(mapId)) {
      return;
    }
    if (this.checkCurrentMapId(mapId)) {
      //当玩家切换地图时, 如果玩家拥有宝藏矿脉则需要弹出提示框
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "worldmap.view.WorldMapFrame.content2",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.__exitSocketHandler2.bind(this),
      );
    } else {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "worldmap.view.WorldMapFrame.content",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.__exitSocketHandler.bind(this),
      );
    }
  }

  private __exitSocketHandler2(boolean: boolean, flag: boolean) {
    if (boolean) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
      let content: string = LangManager.Instance.GetTranslation(
        "worldmap.view.WorldMapFrame.content",
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.SIMPLE_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.__exitSocketHandler.bind(this),
      );
    }
  }

  private __exitSocketHandler(boolean: boolean, flag: boolean): void {
    if (boolean) {
      if (!this.checkScene()) {
        return;
      }
      if (!this.checkArmyState()) {
        return;
      }
      if (
        this.__mapId ==
        PlayerManager.Instance.currentPlayerModel.mapNodeInfo.info.mapId
      ) {
        let str: string = LangManager.Instance.GetTranslation(
          "worldmap.view.WorldMapFrame.command01",
        );
        MessageTipManager.Instance.show(str);
      } else {
        let ctrl: WorldMapCtrl = FrameCtrlManager.Instance.getCtrl(
          EmWindow.WorldMapWnd,
        ) as WorldMapCtrl;
        ctrl.sendMap(this.__mapId);
      }
    }
  }

  private checkArmyState(): boolean {
    let result: boolean = true;

    if (this.currentScene == SceneType.OUTER_CITY_SCENE) {
      if (
        OuterCityManager.Instance.controler.selfArmy &&
        OuterCityManager.Instance.controler.selfArmy.armyView
      ) {
        let armyView: object =
          OuterCityManager.Instance.controler.selfArmy.armyView;
        if (armyView.hasOwnProperty("isStand")) {
          if (armyView["isStand"]) {
            return true;
          } else {
            MessageTipManager.Instance.show(
              LangManager.Instance.GetTranslation(
                "worldmap.view.WorldMapFrame.walking",
              ),
            );
            return false;
          }
        }
      }
    }
    return result;
  }

  public checkScene(): boolean {
    let str: string = "";
    if (this.currentScene == SceneType.CAMPAIGN_MAP_SCENE) {
      let mapId: number = CampaignManager.Instance.mapModel.mapId;
      if (WorldBossHelper.checkGvg(mapId)) {
        str = LangManager.Instance.GetTranslation(
          "worldboss.helper.WorldBossHelper.tip07",
        );
      } else if (WorldBossHelper.checkConsortiaSecretLand(mapId)) {
        str = LangManager.Instance.GetTranslation(
          "worldboss.helper.WorldBossHelper.tip08",
        );
      } else if (WorldBossHelper.checkHoodRoom(mapId)) {
        str = LangManager.Instance.GetTranslation(
          "worldmap.view.WorldMapFrame.command04",
        );
      } else {
        str = LangManager.Instance.GetTranslation(
          "worldmap.view.WorldMapFrame.command02",
        );
      }
      MessageTipManager.Instance.show(str);
      return false;
    } else if (
      this.currentScene == SceneType.PVE_ROOM_SCENE ||
      this.currentScene == SceneType.PVP_ROOM_SCENE ||
      this.currentScene == SceneType.WARLORDS_ROOM
    ) {
      str = LangManager.Instance.GetTranslation(
        "worldmap.view.WorldMapFrame.command03",
      );
      MessageTipManager.Instance.show(str);
      return false;
    }
    return true;
  }

  private get currentScene(): string {
    return SceneManager.Instance.currentType;
  }

  private removeEvent() {
    this.btn_map1.view.offClick(this, this.__mouseClickHandler);
    this.btn_map2.view.offClick(this, this.__mouseClickHandler);
    this.btn_map3.view.offClick(this, this.__mouseClickHandler);
    this.btn_map4.view.offClick(this, this.__mouseClickHandler);
    this.btn_map5.view.offClick(this, this.__mouseClickHandler);
  }

  public OnHideWind() {
    super.OnHideWind();

    this.removeEvent();
  }

  dispose(dispose?: boolean) {
    super.dispose(dispose);
  }
}
