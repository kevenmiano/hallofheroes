//@ts-expect-error: External dependencies
import FUI_OuterCityBossInfoItem from "../../../../../fui/OuterCity/FUI_OuterCityBossInfoItem";
import LangManager from "../../../../core/lang/LangManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import ColorConstant from "../../../constant/ColorConstant";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { MessageTipManager } from "../../../manager/MessageTipManager";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { WildLand } from "../../../map/data/WildLand";
import { SceneManager } from "../../../map/scene/SceneManager";
import SceneType from "../../../map/scene/SceneType";
import Tiles from "../../../map/space/constant/Tiles";
import { OuterCityMapCameraMediator } from "../../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../../roadComponent/pickgliss/toplevel/StageReferance";

export default class OuterCityBossInfoItem extends FUI_OuterCityBossInfoItem {
  private _info: WildLand;
  private _count: number = 0;
  onConstruct() {
    super.onConstruct();
    this.addEvent();
    Utils.setDrawCallOptimize(this);
  }

  public set info(value: WildLand) {
    this._info = value;
    if (this._info) {
      this.refreshView();
    }
  }

  public get info(): WildLand {
    return this._info;
  }

  private addEvent() {
    this.attackBtn.onClick(this, this.attackBtnHandler);
    this.posLink.onClick(this, this.linkClickHandler);
  }

  private removeEvent() {
    this.attackBtn.offClick(this, this.attackBtnHandler);
    this.posLink.offClick(this, this.linkClickHandler);
  }

  private linkClickHandler() {
    if (SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "map.outercity.OuterCityTreasureItem",
        ),
      );
      return;
    }
    let posX: number = (this._info.posX * Tiles.WIDTH) / 50;
    let posY: number = (this._info.posY * Tiles.HEIGHT) / 50;
    if (posX > 0 && posY > 0) {
      OuterCityManager.Instance.mapView.motionTo(
        new Laya.Point(
          this._info.posX * 20 - StageReferance.stageWidth / 2,
          this._info.posY * 20 - StageReferance.stageHeight / 2,
        ),
      );
    }
    OuterCityMapCameraMediator.lockMapCamera();
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.CLOSE_OUTERCITY_OUTERCITYBOSS_WND,
    );
  }

  private attackBtnHandler() {
    if (SceneManager.Instance.currentType != SceneType.OUTER_CITY_SCENE) {
      MessageTipManager.Instance.show(
        LangManager.Instance.GetTranslation(
          "map.outercity.OuterCityBossInfoItem",
        ),
      );
      return;
    }
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.CLOSE_OUTERCITY_OUTERCITYBOSS_WND,
    );
    let posX: number = (this._info.posX * Tiles.WIDTH) / 50;
    let posY: number = (this._info.posY * Tiles.HEIGHT) / 50;
    if (posX > 0 && posY > 0) {
      OuterCityManager.Instance.mapView.motionTo(
        new Laya.Point(
          this._info.posX * 20 - StageReferance.stageWidth / 2,
          this._info.posY * 20 - StageReferance.stageHeight / 2,
        ),
      );
    }
    OuterCityMapCameraMediator.lockMapCamera();
    NotificationManager.Instance.dispatchEvent(
      OuterCityEvent.START_MOVE,
      this._info,
    );
  }

  private refreshView() {
    this.nameTxt.text = this._info.bossName;
    this.levelTxt.text = LangManager.Instance.GetTranslation(
      "public.level2",
      this._info.grade,
    );
    let x: number = parseInt(((this._info.posX * Tiles.WIDTH) / 50).toString());
    let y: number = parseInt(
      ((this._info.posY * Tiles.HEIGHT) / 50).toString(),
    );
    this.posLink.getChild("userNameTxt").text = "[" + x + "," + y + "]";
    (this.posLink.getChild("userNameTxt") as fgui.GTextField).color =
      ColorConstant.LIGHT_TEXT_COLOR;
    this._count = this._info.refreshTime;
    this.leftTimeTxt.text = DateFormatter.getConsortiaCountDate(this._count);
    Laya.timer.loop(1000, this, this.__updateTimeHandler);
    this.statusTxt.text = LangManager.Instance.GetTranslation(
      "map.outercity.view.bossinfo.bossStatus" + this._info.bossStatus,
    );
    if (this._info.bossStatus == 1) {
      //boss状态(0已消失, 1存在, 4战斗中)
      this.bossStatusCtr.selectedIndex = 1;
    } else if (this._info.bossStatus == 0) {
      //已经击败
      this.bossStatusCtr.selectedIndex = 0;
      this.statusTxt.color = ColorConstant.RED_COLOR;
    } else if (this._info.bossStatus == 4) {
      //战斗中
      this.bossStatusCtr.selectedIndex = 0;
      this.statusTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
    }
  }

  private __updateTimeHandler() {
    this._count--;
    this.leftTimeTxt.text = DateFormatter.getConsortiaCountDate(this._count);
    if (this._count <= -1) {
      Laya.timer.clear(this, this.__updateTimeHandler);
      this.leftTimeTxt.text = "00:00:00";
    }
  }

  public dispose() {
    Laya.timer.clear(this, this.__updateTimeHandler);
    this.removeEvent();
    super.dispose();
  }
}
