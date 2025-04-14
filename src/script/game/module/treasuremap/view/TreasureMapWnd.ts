//@ts-expect-error: External dependencies
import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIManager from "../../../../core/ui/UIManager";
import SimpleAlertHelper from "../../../component/SimpleAlertHelper";
import { t_s_mapData } from "../../../config/t_s_map";
import {
  BagEvent,
  TreasureMapEvent,
} from "../../../constant/event/NotificationEvent";
import { EmWindow } from "../../../constant/UIDefine";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { CampaignManager } from "../../../manager/CampaignManager";
import { GoodsManager } from "../../../manager/GoodsManager";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { PlayerManager } from "../../../manager/PlayerManager";
import RechargeAlertMannager from "../../../manager/RechargeAlertMannager";
import { TempleteManager } from "../../../manager/TempleteManager";
import TreasureMapManager from "../../../manager/TreasureMapManager";
import { TreasureMapSocketOutManager } from "../../../manager/TreasureMapSocketOutManager";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import { TreasureMapModel } from "../../../mvc/model/Treasuremap/TreasureMapModel";
import { WorldBossHelper } from "../../../utils/WorldBossHelper";

/**
 * @author:zhihua.zhou
 * @data: 2021-11-11 10:24
 * @description 藏宝图主界面(使用宝图界面)
 */
export default class TreasureMapWnd extends BaseWindow {
  /** 立即挖掘 */
  private btn_fight: fairygui.GButton;
  private btn_check: fairygui.GButton;
  /** 立即挖掘需要消耗 */
  private _digPointsCost: number = 0;

  private _flagPosX: number;
  private _flagPosY: number;
  private _mapName: string;
  private txt_name: fairygui.GTextField;
  private mapContainer: fairygui.GComponent;

  /** 动态加载地图块 */
  private loader: fairygui.GLoader;
  private img_pos: fairygui.GImage;
  private _rect: Laya.Rectangle;
  private FRAME_WIDTH: number = 455;
  private FRAME_HEIGHT: number = 491;
  // private GROUP_WIDTH:number = 1159;

  public get model(): TreasureMapModel {
    return TreasureMapManager.Instance.model;
  }

  public get viewRectangle(): Laya.Rectangle {
    return this._rect;
  }

  public OnInitWind() {
    super.OnInitWind();

    this.img_pos = this.mapContainer.getChild("img_pos").asImage;
    this.loader = this.mapContainer.getChild("loader").asLoader;
    this._digPointsCost = Number(
      TempleteManager.Instance.getConfigInfoByConfigName("treasure_imm_battle")
        .ConfigValue,
    );
    this.analyzeTreasureMap();
    this.img_pos.setXY(
      this._flagPosX - this.img_pos.width / 2,
      this._flagPosY - this.img_pos.height / 2,
    );
    this.txt_name.text = this._mapName;
    this.addEvent();
    this.setBtnEnabled();
  }

  private setBtnEnabled(): void {
    this.btn_fight.enabled = this.model.rewardCount < this.model.rewardMax;
  }

  private addEvent(): void {
    this.btn_fight.onClick(this, this.onFight);
    this.btn_check.onClick(this, this.onCheckMap);
    GoodsManager.Instance.addEventListener(
      BagEvent.DELETE_TREASURE_MAP,
      this.__deleteTreasureMapHandler,
      this,
    );
    this.model.addEventListener(
      TreasureMapEvent.TREASURE_INFO_UPDATE,
      this.__treasureInfoUpdateHandler,
      this,
    );
  }

  private removeEvent(): void {
    this.btn_fight.offClick(this, this.onFight);
    this.btn_check.offClick(this, this.onCheckMap);
    GoodsManager.Instance.removeEventListener(
      BagEvent.DELETE_TREASURE_MAP,
      this.__deleteTreasureMapHandler,
      this,
    );
    this.model.removeEventListener(
      TreasureMapEvent.TREASURE_INFO_UPDATE,
      this.__treasureInfoUpdateHandler,
      this,
    );
  }

  private __treasureInfoUpdateHandler(e: TreasureMapEvent): void {
    if (this.model.mapFrameOpened) {
      this._rect.width = this.FRAME_WIDTH;
      this.x = -this.width / 3.5;
      this.contentPane.setPivot(0.5, 0.5);
      this.contentPane.scaleX = 0.8;
      this.contentPane.scaleY = 0.8;
    } else {
      this.contentPane.scaleX = 1;
      this.contentPane.scaleY = 1;
      this.setCenter();
    }
  }

  private __deleteTreasureMapHandler(deleteInfo: GoodsInfo): void {
    if (deleteInfo == this.frameData) {
      FrameCtrlManager.Instance.exit(EmWindow.TreasureMapWnd);
    }
  }

  private onhelpBtnClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation("TreasureMap.help0");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  /**
   * 挖掘
   */
  private onFight(): void {
    if (this.checkScene()) {
      let confirm: string =
        LangManager.Instance.GetTranslation("public.confirm");
      let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
      let prompt: string = LangManager.Instance.GetTranslation(
        "map.internals.view.treasuremap.TreasureMapUseFrame.digBtnAlertTitle",
      );
      let content: string = LangManager.Instance.GetTranslation(
        "map.internals.view.treasuremap.TreasureMapUseFrame.digBtnAlertTxt3",
        this._digPointsCost,
        4,
      );
      SimpleAlertHelper.Instance.Show(
        SimpleAlertHelper.USEBINDPOINT_ALERT,
        null,
        prompt,
        content,
        confirm,
        cancel,
        this.digBtnAlertCallBack.bind(this),
      );
    } else {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "map.internals.view.treasuremap.TreasureMapUseFrame.digBtnAlertTxt2",
        ),
      );
    }
  }

  /**
   * 挖掘弹窗确认回调
   */
  private digBtnAlertCallBack(b: boolean, useBind: boolean): void {
    if (b) {
      if (this.frameData) {
        let playerInfo = PlayerManager.Instance.currentPlayerModel.playerInfo;
        var hasMoney: number = playerInfo.point;
        if (useBind) {
          hasMoney = hasMoney + playerInfo.giftToken;
        }
        if (hasMoney >= this._digPointsCost) {
          TreasureMapSocketOutManager.sendDigTreasureMap(
            this.frameData.pos,
            useBind,
          );
        } else {
          RechargeAlertMannager.Instance.show();
        }
      }
    }
  }

  private checkScene(): boolean {
    var currentType: string = SceneManager.Instance.currentType;
    switch (currentType) {
      case SceneType.SPACE_SCENE:
        return true;
      case SceneType.CAMPAIGN_MAP_SCENE:
        if (CampaignManager.Instance.mapModel) {
          var mapId: number = CampaignManager.Instance.mapModel.mapId;
          if (WorldBossHelper.checkPetLand(mapId)) {
            return true;
          }
        }
        break;
    }
    return false;
  }

  /**
   * 查看地图
   */
  private onCheckMap(): void {
    if (!this.inSpaceScene && !this.inPetLand && !this.inMineral) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "map.internals.view.treasuremap.TreasureMapUseFrame.CheckMapTipTxt",
        ),
      );
      return;
    }

    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      UIManager.Instance.ShowWind(EmWindow.SmallMapWnd);
    } else if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
      WorldBossHelper.checkPetLand(CampaignManager.Instance.mapId)
    ) {
      UIManager.Instance.ShowWind(EmWindow.CampaignMapWnd);
    }

    // if(this.inSpaceScene)
    // {
    //     FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.SPACE, SpaceController.MAP);
    // }
    // if(this.inPetLand)
    // {
    //     FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.SPACE, SpaceController.PETLAND_MAP);
    // }
    // if(this.inMineral)
    // {
    //     FrameControllerManager.instance.openControllerByInfo(UIModuleTypes.SPACE, SpaceController.MINERAL_MAP);
    // }
    // this.__treasureInfoUpdateHandler(null);
  }

  /**
   * 是否在天空之城
   */
  private get inSpaceScene(): boolean {
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      return true;
    }
    return false;
  }

  private get inPetLand(): boolean {
    if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
      WorldBossHelper.checkPetLand(CampaignManager.Instance.mapId)
    ) {
      return true;
    }
    return false;
  }

  private get inMineral(): boolean {
    if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
      WorldBossHelper.checkMineral(CampaignManager.Instance.mapId)
    ) {
      return true;
    }
    return false;
  }

  OnShowWind() {
    super.OnShowWind();
    this._rect = new Laya.Rectangle(0, 0, this.FRAME_WIDTH, this.FRAME_HEIGHT);
    this.model.useFrameOpened = true;
    this.model.commit();
    // this.__treasureInfoUpdateHandler(null);
    // if(!this.model.isFirstUse && !SharedManager.Instance.isUsedTreaSureMap)
    // 	{
    // 		var helperFrame:NewGuildFrame = ComponentFactory.Instance.creatComponentByStylename("core.newGuildHelpFrame")
    // 		var newFrameData:Object = new Object();
    // 		newFrameData.frameName = "treasuremap.NewGuildFrame";
    // 		newFrameData.index = 1;
    // 		helperFrame.data = newFrameData;
    // 		helperFrame.show();
    // 		//缓存判断玩家是否使用过藏宝图
    // 		SharedManager.Instance.isUsedTreaSureMap = true;
    // 		SharedManager.Instance.saveIsUsedTreasureMap();
    // 	}

    this.setCenter();
  }

  /**
   * 解析地图
   */
  private analyzeTreasureMap(): void {
    let goodsInfo: GoodsInfo = this.frameData as GoodsInfo;
    let mapTemplate: t_s_mapData =
      TempleteManager.Instance.getMapTemplateDataByID(goodsInfo.randomSkill1);
    let tileWidth: number = Math.ceil(mapTemplate.Width / 3);
    let tileHeight: number = Math.ceil(mapTemplate.Height / 3);
    let posX: number = 0;
    let posY: number = 0;
    let tileIndex: number = 0;
    let flagPosX: number = 0;
    let flagPosY: number = 0;
    if (0 < goodsInfo.randomSkill2 && goodsInfo.randomSkill2 < tileWidth) {
      posX = 1;
      flagPosX = goodsInfo.randomSkill2;
    } else if (
      tileWidth < goodsInfo.randomSkill2 &&
      goodsInfo.randomSkill2 < tileWidth * 2
    ) {
      posX = 2;
      flagPosX = goodsInfo.randomSkill2 - tileWidth;
    } else if (
      tileWidth * 2 < goodsInfo.randomSkill2 &&
      goodsInfo.randomSkill2 < mapTemplate.Width
    ) {
      posX = 3;
      flagPosX = goodsInfo.randomSkill2 - tileWidth * 2;
    }
    if (0 < goodsInfo.randomSkill3 && goodsInfo.randomSkill3 < tileHeight) {
      posY = 1;
      flagPosY = goodsInfo.randomSkill3;
    } else if (
      tileHeight < goodsInfo.randomSkill3 &&
      goodsInfo.randomSkill3 < tileHeight * 2
    ) {
      posY = 2;
      flagPosY = goodsInfo.randomSkill3 - tileHeight;
    } else if (
      tileHeight * 2 < goodsInfo.randomSkill3 &&
      goodsInfo.randomSkill3 < mapTemplate.Height
    ) {
      posY = 3;
      flagPosY = goodsInfo.randomSkill3 - tileHeight * 2;
    }
    tileIndex = (posY - 1) * 3 + posX;
    this._mapName = mapTemplate.MapNameLang;
    this._flagPosX = (flagPosX * 1000) / mapTemplate.Width;
    this._flagPosY = (flagPosY * 1000) / mapTemplate.Height;
    this.loader.url =
      "res/animation/images/treasure/" +
      goodsInfo.randomSkill1.toString() +
      "/0" +
      tileIndex +
      ".png";
  }

  private helpBtnClick() {
    let title = LangManager.Instance.GetTranslation("public.help");
    let content = LangManager.Instance.GetTranslation("TreasureMap.help1");
    UIManager.Instance.ShowWind(EmWindow.Help, {
      title: title,
      content: content,
    });
  }

  OnHideWind() {
    super.OnHideWind();
    this.removeEvent();
    this.model.useFrameOpened = false;
    if (SceneManager.Instance.currentType == SceneType.SPACE_SCENE) {
      UIManager.Instance.HideWind(EmWindow.SmallMapWnd);
    } else if (
      SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE &&
      WorldBossHelper.checkPetLand(CampaignManager.Instance.mapId)
    ) {
      UIManager.Instance.HideWind(EmWindow.CampaignMapWnd);
    }
  }
}
