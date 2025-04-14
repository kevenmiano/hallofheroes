//@ts-expect-error: External dependencies
import FUI_OuterCityResourceInfoItem from "../../../../fui/Castle/FUI_OuterCityResourceInfoItem";
import SimpleAlertHelper from "../../component/SimpleAlertHelper";
import { PlayerManager } from "../../manager/PlayerManager";
import { FieldData } from "../../map/castle/data/FieldData";
import { MapGrid } from "../../map/space/constant/MapGrid";
import LangManager from "../../../core/lang/LangManager";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { OuterCityEvent } from "../../constant/event/NotificationEvent";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityMap } from "../../map/outercity/OuterCityMap";
import { OuterCityMapCameraMediator } from "../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { OuterCitySocketOutManager } from "../../manager/OuterCitySocketOutManager";
import Tiles from "../../map/space/constant/Tiles";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";

export default class OuterCityResourceInfoItem extends FUI_OuterCityResourceInfoItem {
  private _info: FieldData;
  private _mapView: OuterCityMap;
  private _targetPoint: Laya.Point;
  constructor() {
    super();
  }

  protected onConstruct() {
    super.onConstruct();
    this._mapView = OuterCityManager.Instance.mapView;
    this.addEvent();
  }

  private addEvent() {
    this.lookBtn.onClick(this, this.lookBtnHandler);
    this.giveUpBtn.onClick(this, this.giveUpBtnHandler);
  }

  private removeEvent() {
    this.lookBtn.offClick(this, this.lookBtnHandler);
    this.giveUpBtn.offClick(this, this.giveUpBtnHandler);
  }

  private lookBtnHandler() {
    if (SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "map.outercity.OuterCityTreasureItem",
        ),
      );
      return;
    }
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "buildings.politics.view.FieldItem.content3",
      this.nameTxt.text,
      this.posTxt.text,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.lookConfirm.bind(this),
    );
  }

  private lookConfirm(b: boolean, flag: boolean) {
    if (b) {
      this._mapView.motionTo(
        new Laya.Point(
          Tiles.WIDTH * this._targetPoint.x - StageReferance.stageWidth / 2,
          this._targetPoint.y * Tiles.HEIGHT - StageReferance.stageHeight / 2,
        ),
      );
      NotificationManager.Instance.dispatchEvent(
        OuterCityEvent.CLOSE_OUTERCITY_RESOURCE_WND,
      );
      OuterCityMapCameraMediator.lockMapCamera();
    }
  }

  giveUpBtnHandler() {
    var confirm: string = LangManager.Instance.GetTranslation("public.confirm");
    var cancel: string = LangManager.Instance.GetTranslation("public.cancel");
    var prompt: string = LangManager.Instance.GetTranslation("public.prompt");
    var content: string = LangManager.Instance.GetTranslation(
      "buildings.politics.view.FieldItem.content",
      this.nameTxt.text,
      this.posTxt.text,
    );
    SimpleAlertHelper.Instance.Show(
      SimpleAlertHelper.SIMPLE_ALERT,
      null,
      prompt,
      content,
      confirm,
      cancel,
      this.giveUpField.bind(this),
    );
  }

  private giveUpField(b: boolean, flag: boolean) {
    if (b) {
      if (this._info) {
        let position: string = this._targetPoint.x + "," + this._targetPoint.y;
        OuterCitySocketOutManager.removeMine(
          position,
          this._info.nodeId,
          this._info.sonNodeId,
        );
      } else {
        MessageTipManager.Instance.show(
          LangManager.Instance.GetTranslation(
            "buildings.politics.view.FieldItem.content02",
          ),
        );
      }
    }
  }

  public set info(value: FieldData) {
    this._info = value;
    if (this._info) {
      this.refresh();
    }
  }

  private refresh() {
    this._targetPoint = new Laya.Point(
      parseInt(this._info.pos.split(",")[0]),
      parseInt(this._info.pos.split(",")[1]),
    );
    this.posTxt.text = "[" + MapGrid.getPositionString(this._info.pos) + "]";
    this.nameTxt.text = this._info.fieldName;
    this.goldNumTxt.text = LangManager.Instance.GetTranslation(
      "OuterCityResourceInfoItem.goldNumTxt",
      this._info.yield,
    );
  }

  dispose() {
    this._info = null;
    PlayerManager.Instance.currentPlayerModel.mInfo = null;
    this.removeEvent();
    super.dispose();
  }
}
