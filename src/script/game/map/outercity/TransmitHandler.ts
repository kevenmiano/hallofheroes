import { SocketManager } from "../../../core/net/SocketManager";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { PlayerEffectInfo } from "../../datas/playerinfo/PlayerEffectInfo";
import KeyBoardRegister from "../../keyboard/KeyBoardRegister";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import BuildingManager from "../castle/BuildingManager";
import { BuildInfo } from "../castle/data/BuildInfo";
import { OuterCityMap } from "./OuterCityMap";
import LayerMgr from "../../../core/layer/LayerMgr";
import { EmLayer } from "../../../core/ui/ViewInterface";
import { EmWindow } from "../../constant/UIDefine";
import LangManager from "../../../core/lang/LangManager";
import { C2SProtocol } from "../../constant/protocol/C2SProtocol";
import { ServerDataManager } from "../../../core/net/ServerDataManager";
import { S2CProtocol } from "../../constant/protocol/S2CProtocol";
import Point = Laya.Point;
import Mouse = Laya.Mouse;
//@ts-expect-error: External dependencies
import ArmyPositionMsg = com.road.yishi.proto.army.ArmyPositionMsg;
import { CursorManagerII } from "../../manager/CursorManagerII";
import UIManager from "../../../core/ui/UIManager";
import TemplateIDConstant from "../../constant/TemplateIDConstant";
import { GoodsManager } from "../../manager/GoodsManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { NotificationEvent } from "../../constant/event/NotificationEvent";
import { TempleteManager } from "../../manager/TempleteManager";

/**
 * @description    外城定点传送移动相关操作
 * @author yuanzhan.yu
 * @date 2021/11/23 21:05
 * @ver 1.0
 */
export class TransmitHandler {
  private static _Instance: TransmitHandler;
  private _containter: fgui.GImage;
  public mouseCursor: boolean;
  private _timeid: ReturnType<typeof setInterval>;
  private _downPos: Point = new Point();
  private _upPos: Point = new Point();

  public static get Instance(): TransmitHandler {
    if (!TransmitHandler._Instance) {
      TransmitHandler._Instance = new TransmitHandler();
    }
    return TransmitHandler._Instance;
  }

  public resetCursor(): void {
    // StageReferance.stage.off(Event.ENTER_FRAME,this,this.__stageFrameHandler);
    Laya.timer.clear(this, this.__stageFrameHandler);
    StageReferance.stage.off(Laya.Event.CLICK, this, this.__stageClickHandler);
    StageReferance.stage.off(Laya.Event.KEY_DOWN, this, this.__stageKeyHandler);
    StageReferance.stage.off(Laya.Event.KEY_UP, this, this.__stageKeyHandler);
    if (this.mapView) {
      this.mapView.off(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
    }
    if (this.mapView) {
      this.mapView.off(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
    }
    if (this.mapView) {
      this.mapView.off(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    }
    if (this.mapView) {
      this.mapView.off(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
    }

    if (this._containter) {
      this._containter.displayObject.removeSelf();
    }
    this._containter = null;
    this.mouseCursor = false;
    CursorManagerII.Instance.resetCursor();
  }

  public show(): void {
    this.resetCursor();
    Mouse.hide();
    this.mouseCursor = true;
    this._containter = fgui.UIPackage.createObject(
      EmWindow.OuterCity,
      "asset.outercity.transmitBim",
    ).asImage;
    LayerMgr.Instance.addToLayer(this._containter, EmLayer.GAME_BASE_LAYER);

    Laya.timer.frameLoop(1, this, this.__stageFrameHandler);
    StageReferance.stage.on(Laya.Event.CLICK, this, this.__stageClickHandler);
    StageReferance.stage.on(Laya.Event.KEY_DOWN, this, this.__stageKeyHandler);
    StageReferance.stage.on(Laya.Event.KEY_UP, this, this.__stageKeyHandler);
    if (this.mapView) {
      this.mapView.on(Laya.Event.MOUSE_OVER, this, this.__mouseOverHandler);
    }
    if (this.mapView) {
      this.mapView.on(Laya.Event.MOUSE_OUT, this, this.__mouseOutHandler);
    }
    if (this.mapView) {
      this.mapView.on(Laya.Event.MOUSE_DOWN, this, this.__mouseDownHandler);
    }
    if (this.mapView) {
      this.mapView.on(Laya.Event.MOUSE_UP, this, this.__mouseUpHandler);
    }

    this.__stageFrameHandler();
  }

  private __stageKeyHandler(event: KeyboardEvent): void {
    this.resetCursor();
  }

  private __mouseOverHandler(event: Laya.Event): void {
    if (this._containter) {
      this._containter.visible = true;
      Mouse.hide();
      this.mouseCursor = true;
    }
  }

  private __mouseOutHandler(event: Laya.Event): void {
    if (this._containter) {
      this._containter.visible = false;
    }
    this.mouseCursor = false;
    CursorManagerII.Instance.resetCursor();
  }

  private __mouseDownHandler(event: Laya.Event): void {
    this._downPos.x = StageReferance.stage.mouseX;
    this._downPos.y = StageReferance.stage.mouseY;
  }

  private __mouseUpHandler(event: Laya.Event): void {
    this._upPos.x = StageReferance.stage.mouseX;
    this._upPos.y = StageReferance.stage.mouseY;
    let leng: number = this._downPos.distance(this._upPos.x, this._upPos.y);
    if (leng < 3 && this._containter) {
      let walkable: Point = this.mapView.worldWalkLayer.globalToLocal(
        this._upPos,
        true,
      );
      if (!this.isWalkable(walkable.x, walkable.y)) {
        KeyBoardRegister.Instance.keyEnable = false;
        let confirm: string =
          LangManager.Instance.GetTranslation("public.confirm");
        let cancel: string =
          LangManager.Instance.GetTranslation("public.cancel");
        let prompt: string =
          LangManager.Instance.GetTranslation("public.prompt");
        let build: BuildInfo =
          BuildingManager.Instance.model.buildingListByID[-11];
        let leftEnergy: number = build.property1;
        let totalEnergy: number = 500;
        let content: string = LangManager.Instance.GetTranslation(
          "map.campaign.view.ui.RiverView.txt.TransmitHandler.content",
          leftEnergy,
          totalEnergy,
        );
        SimpleAlertHelper.Instance.Show(
          SimpleAlertHelper.SIMPLE_ALERT,
          null,
          prompt,
          content,
          confirm,
          cancel,
          this.__transferHandler.bind(this),
        );
      } else {
        let str: string = LangManager.Instance.GetTranslation(
          "map.outercity.mediator.mapview.TransmitHandler.command01",
        );
        MessageTipManager.Instance.show(str);
      }
    }
  }

  private __transferHandler(b: boolean, flag: boolean) {
    if (b) {
      let build: BuildInfo =
        BuildingManager.Instance.model.buildingListByID[-11];
      let current: number = build.property1;
      if (100 <= current) {
        this.transferBack(true, true);
      } else {
        let multi: number = 1;
        let Cfg =
          TempleteManager.Instance.getConfigInfoByConfigName("AddEnergy_Price");
        if (Cfg) {
          multi = Number(Cfg.ConfigValue);
        }
        //500 能量 multi 个钻石
        let recharge2 = (multi * 500) / 5;

        let content = LangManager.Instance.GetTranslation(
          "map.outercity.mediator.mapview.TransmitHandler.command02",
          recharge2,
        );
        let check1RickText: string = LangManager.Instance.GetTranslation(
          "yishi.view.base.check2RickText.text",
        );
        var num: number = GoodsManager.Instance.getGoodsNumByTempId(
          TemplateIDConstant.TEMP_ID_ENERG_STNE,
        );
        let goodsCount: string = LangManager.Instance.GetTranslation(
          "transmitHandler.goodsCount.text",
          num,
        );
        UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {
          content: content,
          goodsId: TemplateIDConstant.TEMP_ID_ENERG_STNE,
          goodsCount: goodsCount,
          check1RickText: check1RickText,
          callback: this.promptCallback.bind(this),
        });
        return;
      }
    }
    KeyBoardRegister.Instance.keyEnable = true;
  }

  private promptCallback(flag: boolean, useBind: boolean) {
    if (flag) {
      var num: number = GoodsManager.Instance.getGoodsNumByTempId(
        TemplateIDConstant.TEMP_ID_ENERG_STNE,
      );
      let type: number = 0;
      if (num >= 1) {
        //道具数量足够, 直接传送
        let walkable: Point = this.mapView.worldWalkLayer.globalToLocal(
          this._upPos,
          true,
        );
        this.senPosation(walkable.x, walkable.y, type);
      } else {
        let selfPoint: number =
          PlayerManager.Instance.currentPlayerModel.playerInfo.point;
        let bindPoint: number =
          PlayerManager.Instance.currentPlayerModel.playerInfo.giftToken;
        let totalPoint: number = useBind ? selfPoint + bindPoint : selfPoint;
        if (totalPoint < 100) {
          NotificationManager.Instance.dispatchEvent(
            NotificationEvent.SHOW_RECHARGE,
          );
          // let str: string = LangManager.Instance.GetTranslation("Auction.ResultAlert11");
          // MessageTipManager.Instance.show(str);
          return;
        }
        type = useBind ? 2 : 1;
        let walkable: Point = this.mapView.worldWalkLayer.globalToLocal(
          this._upPos,
          true,
        );
        this.senPosation(walkable.x, walkable.y, type);
      }
    }
  }

  private transferBack(
    result: boolean,
    flag: boolean,
    id: number = 0,
    type: number = 2,
  ): void {
    if (result) {
      if (!flag) {
        type = 1;
      }
      let walkable: Point = this.mapView.worldWalkLayer.globalToLocal(
        this._upPos,
        true,
      );
      this.senPosation(walkable.x, walkable.y, type);
    }
  }

  private isWalkable(tarX: number, tarY: number): boolean {
    return OuterCityManager.Instance.model.getWalkable(tarX, tarY);
  }

  private get playerEffect(): PlayerEffectInfo {
    return PlayerManager.Instance.currentPlayerModel.playerEffect;
  }

  private __stageFrameHandler(): void {
    this._containter.x =
      StageReferance.stage.mouseX - this._containter.width / 2;
    this._containter.y =
      StageReferance.stage.mouseY - this._containter.height / 2;
  }

  private __stageClickHandler(event: Laya.Event): void {
    this.resetCursor();
  }

  private get mapView(): OuterCityMap {
    return OuterCityManager.Instance.mapView;
  }

  /**
   *外城定点传送
   * @param pointX  X坐标
   * @param pointY  Y坐标
   * @param type  类型
   *
   */
  public senPosation(pointX: number, pointY: number, type: number): void {
    pointX = Math.floor(pointX);
    pointY = Math.floor(pointY);
    let msg: ArmyPositionMsg = new ArmyPositionMsg();
    msg.posX = Math.floor(pointX / 20);
    msg.posY = Math.floor(pointY / 20);
    msg.payType = type;
    SocketManager.Instance.send(C2SProtocol.C_ARMY_POSATION, msg);

    // MaskUtils.Instance.maskShow(0);
    this._timeid = setInterval(
      this.__transferPosationHandler.bind(this),
      50000,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ARMY_POSATION,
      this,
      this.__transferPosationHandler,
    );
    ServerDataManager.listen(
      S2CProtocol.U_C_ARMYPOS_FAIL,
      this,
      this.__transferPosationHandler,
    );
  }

  private __transferPosationHandler(): void {
    clearTimeout(this._timeid);
    // MaskUtils.Instance.dispose();
    ServerDataManager.cancel(
      S2CProtocol.U_C_ARMY_POSATION,
      this,
      this.__transferPosationHandler,
    );
    ServerDataManager.cancel(
      S2CProtocol.U_C_ARMYPOS_FAIL,
      this,
      this.__transferPosationHandler,
    );
  }
}
