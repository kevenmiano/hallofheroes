import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import { MovieClip } from "../../../../component/MovieClip";
import { NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import ComponentSetting from "../../../../utils/ComponentSetting";
import BuildingManager from "../../BuildingManager";
import { BuildInfo } from "../../data/BuildInfo";
import { BuildingEvent } from "../../event/BuildingEvent";
import IStopEffect from "../../interfaces/IStopEffect";
import FUIHelper from "../../../../utils/FUIHelper";
import { EmPackName } from "../../../../constant/UIDefine";
import BuildingType from "../../consant/BuildingType";
import CastleConfigUtil, { EmCastlePos } from "../../utils/CastleConfigUtil";

/**
 * 内城建筑显示基类
 *
 */
export default class BuildingBase extends Laya.Sprite implements IStopEffect {
  protected _curViewContainer: Laya.Sprite;
  protected _curView: Laya.Sprite;
  public get curView(): Laya.Sprite {
    return this._curView;
  }
  protected _effectView: Map<string, MovieClip>;
  protected _buildingInfo: BuildInfo;
  protected _nameContain: Laya.Sprite;
  protected _nameBack: Laya.Image;

  protected _nameTxt: Laya.Text;
  protected _levelTxt: Laya.Text;

  constructor() {
    super();
    this.mouseEnabled = true;
    this._curViewContainer = new Laya.Sprite();
    this.addChild(this._curViewContainer);
    this.initName();
    this._imgRedPoint = FUIHelper.createFUIInstance(
      EmPackName.Base,
      "Img_RedDot",
    );
    this.addEvent();
  }

  protected addEvent() {
    BuildingManager.Instance.addEventListener(
      BuildingEvent.BUILDING_NAME_SHOW_HIDE,
      this._changeBuildName,
      this,
    );
    NotificationManager.Instance.on(
      NotificationEvent.STOP_EFFECT,
      this.__notificationHandler,
      this,
    );
  }

  protected removeEvent() {
    BuildingManager.Instance.removeEventListener(
      BuildingEvent.BUILDING_NAME_SHOW_HIDE,
      this._changeBuildName,
      this,
    );
    NotificationManager.Instance.off(
      NotificationEvent.STOP_EFFECT,
      this.__notificationHandler,
      this,
    );
  }

  protected initName() {
    this._nameContain = new Laya.Sprite();
    this._nameTxt = new Laya.Text();
    this._nameTxt.stroke = 1;
    this._nameTxt.strokeColor = "#000000";
    this._nameTxt.fontSize = 16;
    this._nameTxt.align = "center";
    this._nameTxt.color = "#FFFFE2";

    this._levelTxt = new Laya.Text();
    this._levelTxt.stroke = 1;
    this._levelTxt.strokeColor = "#000000";
    this._levelTxt.fontSize = 16;
    this._levelTxt.color = "#ffffff";
    this._levelTxt.align = "center";
    this._levelTxt.width = 24;
    // this._levelTxt.x = 24;
    this._levelTxt.y = 4;
  }

  private __notificationHandler(target: any, data: any) {
    if (data) {
      this.startEffet();
    } else {
      this.stopEffect();
    }
  }

  public stopEffect() {
    if (this._effectView) {
      this._effectView.forEach((mcView: MovieClip) => {
        mcView.stop();
      });
    }
  }

  public startEffet() {
    if (this._effectView) {
      this._effectView.forEach((mcView: MovieClip) => {
        mcView.play();
      });
    }
  }

  private _changeBuildName(e: BuildingEvent) {
    this.showName = BuildingManager.Instance.isShowBuildingName;
  }

  public addChildByScale(scale: number) {
    let namePos = CastleConfigUtil.Instance.getBuildNamePos(
      this._buildingInfo.templeteInfo.SonType,
      EmCastlePos.Castle,
    );
    this._nameContain.x = namePos.x;
    this._nameContain.y = namePos.y;
    if (this._buildingInfo.templeteInfo.SonType != BuildingType.TREE) {
      this.addChildAt(this._nameContain, this.numChildren);
    }
  }

  public removeName() {
    if (this._nameContain.parent)
      this._nameContain.parent.removeChild(this._nameContain);
  }

  protected clean() {}

  protected initTipData() {}

  protected initTipStyle() {}

  refreshView() {
    if (!this._buildingInfo || this._buildingInfo.templateId < 0) return;
    let namePos = CastleConfigUtil.Instance.getBuildNamePos(
      this._buildingInfo.templeteInfo.SonType,
      EmCastlePos.Castle,
    );
    this._nameContain.x = namePos.x;
    this._nameContain.y = namePos.y;
    this.addChild(this._nameContain);
    if (!this._nameBack) {
      this._nameBack = new Laya.Image();
      if (this._buildingInfo.templeteInfo.SonType >= 1501) {
        //不带等级的这种  用loadImage,不会设置9宫,里面source依旧是空值,source有值才会设置9宫
        this._nameBack.skin = ComponentSetting.CASTEL_BUILD_LEVELBG_PATH2;
        this._nameBack.sizeGrid = "8,30,8,30,1";
        this._nameTxt.text = this._buildingInfo.templeteInfo.BuildingNameLang;
        this._nameTxt.x = 5;
        this._nameTxt.y = 7;
        this._nameBack.width = this._nameTxt.width + 10;
        this._nameContain.addChild(this._nameBack);
        this._nameContain.addChild(this._nameTxt);
      } else {
        //带等级的  用loadImage,不会设置9宫,里面source依旧是空值,source有值才会设置9宫
        this._nameBack.skin = ComponentSetting.CASTEL_BUILD_LEVELBG_PATH1;
        this._nameBack.sizeGrid = "8,30,8,40,1";
        this._nameContain.addChild(this._nameBack);
        this._nameContain.addChild(this._nameTxt);
        this._nameContain.addChild(this._levelTxt);
        this._nameTxt.x = 24;
        this._nameTxt.y = this._levelTxt.y = 7;
        this._nameTxt.text = this._buildingInfo.templeteInfo.BuildingNameLang;
        this._levelTxt.text =
          this._buildingInfo.templeteInfo.BuildingGrade.toString();
        this._nameBack.width = this._nameTxt.x + this._nameTxt.textWidth + 8;
      }
    } else {
      if (this._buildingInfo.templeteInfo.SonType < 1501) {
        this._nameTxt.text = this._buildingInfo.templeteInfo.BuildingNameLang;
        this._levelTxt.text =
          this._buildingInfo.templeteInfo.BuildingGrade.toString();
      }
    }
    this.showName = BuildingManager.Instance.isShowBuildingName;
  }

  private _imgRedPoint: fgui.GComponent = null;
  /**红点状态 */
  public setRedPoint(b: boolean) {
    if (this._imgRedPoint) {
      this._nameContain.addChild(this._imgRedPoint.displayObject);
      this._imgRedPoint.scaleX = this._imgRedPoint.scaleY = 0.6;
      this._imgRedPoint.x =
        this._nameBack.x + this._nameBack.width - this._imgRedPoint.width / 2;
      this._imgRedPoint.y =
        this._nameBack.y -
        (this._imgRedPoint.height * this._imgRedPoint.scaleY) / 2;
      this._imgRedPoint.visible = b;
      this._imgRedPoint.displayObject.active = b;
    }
  }

  public set buildingInfo(value: BuildInfo) {
    if (value == null) return;
    this._buildingInfo = value;
    this.initTipStyle();
    this.initTipData();
    this.refreshView();
  }

  public get buildingInfo(): BuildInfo {
    return this._buildingInfo;
  }
  public set showName(value: boolean) {
    if (this._nameContain && this._buildingInfo.templateId > 0)
      this._nameContain.visible = value;
    this._nameContain.active = value;
  }

  public dispose() {
    this.removeEvent();
    this.clean();
    // if(this._buildingInfo && this._buildingInfo.templeteInfo &&
    // 	!StringHelper.isNullOrEmpty(this._buildingInfo.templeteInfo.animationStr1))
    // {
    // 	AnimationManager.Instance.clearAnimation(this._buildingInfo.templeteInfo.animationStr1,"")
    // }
    // if (this._effectView2) {
    // 	if(this._buildingInfo && this._buildingInfo.templeteInfo &&
    // 		!StringHelper.isNullOrEmpty(this._buildingInfo.templeteInfo.animationStr2))
    // 	{
    // 		AnimationManager.Instance.clearAnimation(this._buildingInfo.templeteInfo.animationStr2,"")
    // 	}
    // 	ObjectUtils.disposeObject(this._effectView2);
    // 	this._effectView2 = null;
    // }
    //子类已经清理过了。
    if (this._effectView) {
      this._effectView.forEach((mcView: MovieClip) => {
        ObjectUtils.disposeObject(mcView);
      });
      this._effectView.clear();
      this._effectView = null;
    }

    ObjectUtils.disposeObject(this._nameContain);
    this._nameContain = null;
    this._buildingInfo = null;
    if (this._imgRedPoint) this._imgRedPoint.dispose();
    this.removeSelf();
  }
}
