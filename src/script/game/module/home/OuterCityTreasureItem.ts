//@ts-expect-error: External dependencies
import FUI_OuterCityTreasureItem from "../../../../fui/Home/FUI_OuterCityTreasureItem";
import ConfigMgr from "../../../core/config/ConfigMgr";
import LangManager from "../../../core/lang/LangManager";
import StringHelper from "../../../core/utils/StringHelper";
import { t_s_herotemplateData } from "../../config/t_s_herotemplate";
import { t_s_mapphysicpositionData } from "../../config/t_s_mapphysicposition";
import { ConfigType } from "../../constant/ConfigDefine";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import TreasureInfo from "../../map/data/TreasureInfo";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import Tiles from "../../map/space/constant/Tiles";
import { OuterCityMapCameraMediator } from "../../mvc/mediator/OuterCityMapCameraMediator";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";

export default class OuterCityTreasureItem extends FUI_OuterCityTreasureItem {
  private _info: TreasureInfo;
  onConstruct() {
    super.onConstruct();
    this.addEvent();
  }

  public set info(value: TreasureInfo) {
    this._info = value;
    if (this._info) {
      this.refreshView();
    } else {
      this.bigImg.visible = this.smallImg.visible = false;
      this.link.getChild("posTxt").text = "";
      this.userNameTxt.text = "";
    }
  }

  public get info(): TreasureInfo {
    return this._info;
  }

  private addEvent() {
    this.link.onClick(this, this.linkClickHandler);
  }

  private removeEvent() {
    this.link.offClick(this, this.linkClickHandler);
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
  }

  private refreshView() {
    let tempInfo: t_s_mapphysicpositionData =
      ConfigMgr.Instance.getTemplateByID(
        ConfigType.t_s_mapphysicposition,
        this._info.templateId,
      );
    if (tempInfo) {
      if (tempInfo.SonType == 202) {
        this.bigImg.visible = true;
        this.smallImg.visible = false;
      } else {
        this.bigImg.visible = false;
        this.smallImg.visible = true;
      }
    }
    let x = parseInt(((this._info.posX * Tiles.WIDTH) / 50).toString());
    let y = parseInt(((this._info.posY * Tiles.HEIGHT) / 50).toString());
    this.link.getChild("posTxt").text = "[" + x + "," + y + "]";
    if (!StringHelper.isNullOrEmpty(this._info.info.occupyLeagueName)) {
      this.userNameTxt.text = this._info.info.occupyLeagueName;
    } else {
      if (tempInfo) {
        let heroId: number = parseInt(tempInfo.Heroes);
        let heroTemplateData: t_s_herotemplateData =
          ConfigMgr.Instance.getTemplateByID(
            ConfigType.t_s_herotemplate,
            heroId,
          );
        if (heroTemplateData) {
          this.userNameTxt.text = heroTemplateData.TemplateNameLang;
        }
      }
    }
  }

  public dispose() {
    this.removeEvent();
    super.dispose();
  }
}
