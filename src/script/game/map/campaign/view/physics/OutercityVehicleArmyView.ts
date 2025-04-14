import GameConfig from "../../../../../../GameConfig";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { DateFormatter } from "../../../../../core/utils/DateFormatter";
import { IconFactory } from "../../../../../core/utils/IconFactory";
import { HeroMovieClipRef } from "../../../../avatar/view/HeroMovieClipRef";
import { GameLoadNeedData } from "../../../../battle/data/GameLoadNeedData";
import { FilterFrameText } from "../../../../component/FilterFrameText";
import { HeroMovieClipRefType } from "../../../../constant/BattleDefine";
import ColorConstant from "../../../../constant/ColorConstant";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { EnterFrameManager } from "../../../../manager/EnterFrameManager";
import { OuterCityManager } from "../../../../manager/OuterCityManager";
import { ToolTipsManager } from "../../../../manager/ToolTipsManager";
import { TipsShowType } from "../../../../tips/ITipedDisplay";
import FUIHelper from "../../../../utils/FUIHelper";
import { WildLand } from "../../../data/WildLand";
import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import { CampaignArmyViewHelper } from "../../CampaignArmyViewHelper";

export default class OutercityVehicleArmyView
  extends HeroAvatarView
  implements IBaseMouseEvent
{
  tipData: any;
  tipType: EmWindow.OuterCityCastleTips;
  alphaTest: boolean = true;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(-315, -200);
  IBaseMouseEvent: string = "IBaseMouseEvent";
  discriminator: string = "I-AM-A";
  private static STAND: string = "Stand";
  private static WALK: string = "Walk";
  //剩余到达时间
  private _leftTimeTxt: FilterFrameText;
  //所属公会
  private _consortiaNameTxt: FilterFrameText;
  //名字
  private _nameTxt: FilterFrameText;
  private _rolePart: HeroMovieClipRef;
  private frameY: number = 0;
  private _windInfo: WildLand;
  private _hasLoadComplete: boolean = false;
  private _oldPoint: Laya.Point;
  private _count: number = 0;
  private _totalDistance: number = 0;
  private _totalStepX: number = 0;
  private _totalStepY: number = 0;
  private _timeStr: string = LangManager.Instance.GetTranslation(
    "OuterCityVehicleInfoWnd.descTxt3",
  );
  private _type: number = 0;
  private _leftTime: number = 0;
  /**
   * 攻击锁定的动画
   */
  private _attacking: fgui.GMovieClip;
  private attackBuild(): void {
    if (!this._attacking) {
      this._attacking = fgui.UIPackage.createObject(
        EmWindow.OuterCity,
        "ComAttackingAsset2",
      ).asMovieClip;
    }
    this._attacking.x = -60;
    this._attacking.y = -170;
    this._attacking.visible = false;
    this.addChild(this._attacking.displayObject);
  }

  constructor() {
    super();
    this.autoSize = true;
    this.mouseEnabled = true;
    this.hitTestPrior = true;
    this.initView();
  }

  private initView() {
    let standShadow = new Laya.Sprite();
    let tex = FUIHelper.getItemAsset(EmPackName.Base, "ImgStandShadow");
    standShadow.graphics.drawTexture(tex);
    standShadow.x = -90;
    standShadow.y = -60;
    standShadow.scaleX = standShadow.scaleY = 2;
    this.addChild(standShadow);

    if (!this._leftTimeTxt) {
      this._leftTimeTxt = new FilterFrameText(240, 24, undefined, 18);
      this._leftTimeTxt.y = this.showNamePosY - 45;
      this.addChild(this._leftTimeTxt);
    }
    if (!this._consortiaNameTxt) {
      this._consortiaNameTxt = new FilterFrameText(240, 24, undefined, 18);
      this._consortiaNameTxt.y = this.showNamePosY - 20;
      this.addChild(this._consortiaNameTxt);
    }
    if (!this._nameTxt) {
      this._nameTxt = new FilterFrameText(
        240,
        24,
        undefined,
        18,
        ColorConstant.YELLOW_COLOR,
      );
      this._nameTxt.y = this.showNamePosY + 5;
      this.addChild(this._nameTxt);
    }
  }

  private onPartLoadComplete() {
    this._hasLoadComplete = true;
    this.playVehicleBody();
  }

  private playVehicleBody() {
    var label: string;
    if (this.wildInfo.leftTime <= 0) {
      label = "Stand2";
      this._rolePart.scaleX = -1;
    } else if (this.wildInfo.leftTime > 0 && this.wildInfo.targetPosX) {
      let angle = Math.atan2(
        this.wildInfo.targetPosY * 20 -
          parseInt((this.wildInfo.movePosY * 20).toString()),
        this.wildInfo.targetPosX * 20 -
          parseInt((this.wildInfo.movePosX * 20).toString()),
      );
      var tempAngle: number = parseInt(((angle * 180) / Math.PI).toString());
      if (tempAngle < 0) tempAngle += 360;
      let arr = CampaignArmyViewHelper.calcFrameY(tempAngle);
      this.frameY = arr[0];
      this._rolePart.scaleX = arr[1];
      label = OutercityVehicleArmyView.WALK + (this.frameY + 1);
    }
    if (label != this._rolePart.currentLabel) {
      this._rolePart.gotoAndPlay(0, true, label);
    }
  }

  private refreshView() {
    this._leftTimeTxt.text = "";
    this._consortiaNameTxt.text = "";
    this._nameTxt.text =
      this._windInfo.tempInfo && this._windInfo.tempInfo.NameLang;
    if (this._windInfo && this._windInfo.info) {
      if (this._windInfo.info.occupyLeagueName != "") {
        //占领的公会信息有
        this._consortiaNameTxt.text =
          "<" + this._windInfo.info.occupyLeagueName + ">";
        if (
          OuterCityManager.Instance.model.checkIsSameConsortiaByName(
            this._windInfo.info.occupyLeagueName,
          )
        ) {
          //同工会的
          this._consortiaNameTxt.color = ColorConstant.GREEN_COLOR;
        } else {
          this._consortiaNameTxt.color = ColorConstant.RED_COLOR;
        }
      }
    }
    if (this._rolePart && this._hasLoadComplete) {
      this.playVehicleBody();
    }
    if (this.wildInfo.leftTime > 0 && this.wildInfo.targetPosX) {
      this._leftTime = this.wildInfo.leftTime;
      this._leftTimeTxt.text =
        this._timeStr +
        DateFormatter.getConsortiaCountDate(this._leftTime, false);
      Laya.timer.clearAll(this);
      this._oldPoint = new Laya.Point(
        this.wildInfo.movePosX * 20,
        this.wildInfo.movePosY * 20,
      );
      this._count = 0;
      this._type = this.validateType(
        this._oldPoint,
        this.wildInfo.targetPosX * 20,
        this.wildInfo.targetPosY * 20,
      );
      this._totalDistance = this._oldPoint.distance(
        this.wildInfo.targetPosX * 20,
        this.wildInfo.targetPosY * 20,
      );
      this._totalStepX = Math.abs(
        this.wildInfo.movePosX * 20 - this.wildInfo.targetPosX * 20,
      );
      this._totalStepY = Math.abs(
        this.wildInfo.movePosY * 20 - this.wildInfo.targetPosY * 20,
      );
      Laya.timer.loop(1000 / EnterFrameManager.FPS, this, this.playWalk);
      Laya.timer.loop(1000, this, this.refreshLeftTime);
      // let currentPoint:Laya.Point = new Laya.Point(this.x,this.y);
      // let endPoint:Laya.Point = new Laya.Point(this.wildInfo.targetPosX,this.wildInfo.targetPosY);
      // let paths = [currentPoint, endPoint];
      // this.info.pathInfo = paths;
    } else {
      Laya.timer.clearAll(this);
      this._count = 0;
      // this.info.pathInfo = [];
    }
  }

  private refreshLeftTime() {
    if (this._leftTime > 0) {
      this._leftTime--;
      this._leftTimeTxt.text =
        this._timeStr +
        DateFormatter.getConsortiaCountDate(this._leftTime, false);
    }
  }

  private validateType(
    oldPoint: Laya.Point,
    targetX: number,
    targetY: number,
  ): number {
    let type: number = 0;
    if (oldPoint.x < targetX) {
      //目标点在物资车右边
      type = 1;
    } else if (oldPoint.x > targetX) {
      //目标点在物资车左边
      type = 2;
    } else if (oldPoint.x == targetX) {
      if (oldPoint.y < targetY) {
        //目标点在物资车正下方
        type = 3;
      } else {
        //正上方
        type = 4;
      }
    }
    return type;
  }

  playWalk() {
    this._count++;
    let stepX =
      (this._count *
        this._windInfo.speed *
        (20 / EnterFrameManager.FPS) *
        this._totalStepX) /
      this._totalDistance;
    let stepY =
      (this._count *
        this._windInfo.speed *
        (20 / EnterFrameManager.FPS) *
        this._totalStepY) /
      this._totalDistance;
    if (this._type == 1) {
      //目标点在物资车右边
      if (this.x < this.wildInfo.targetPosX * 20) {
        if (this.y < this.wildInfo.targetPosY * 20) {
          //右下方
          stepY = stepY;
        } else {
          //右上方
          stepY = -stepY;
        }
      } else {
        Laya.timer.clearAll(this);
        this._count = 0;
      }
    } else if (this._type == 2) {
      //目标点在物资车左边
      if (this.x > this.wildInfo.targetPosX * 20) {
        stepX = -stepX;
        if (this.y < this.wildInfo.targetPosY * 20) {
          //左下方
          stepY = stepY;
        } else {
          //左上方
          stepY = -stepY;
        }
      } else {
        Laya.timer.clearAll(this);
        this._count = 0;
      }
    } else if (this._type == 3) {
      //目标点在物资车正下方
      if (this.y < this.wildInfo.targetPosY * 20) {
        stepY = stepY;
      } else {
        Laya.timer.clearAll(this);
        this._count = 0;
      }
    } else if (this._type == 4) {
      //目标点在物资车正上方
      if (this.y > this.wildInfo.targetPosY * 20) {
        stepY = -stepY;
      } else {
        Laya.timer.clearAll(this);
        this._count = 0;
      }
    }
    this.newX = this._oldPoint.x + stepX;
    this.newY = this._oldPoint.y + stepY;
  }

  public set wildInfo(value: WildLand) {
    if (value) {
      ToolTipsManager.Instance.register(this);
      this.tipType = EmWindow.OuterCityCastleTips;
      this.tipData = value;
      this._windInfo = value;
      if (!this._rolePart) {
        this._rolePart = new HeroMovieClipRef(
          HeroMovieClipRefType.OUTERCITY_VEHICLE,
        );
        this._rolePart.mouseEnabled = true;
        this._rolePart.completeFunc = this.onPartLoadComplete.bind(this);
        let gameLoadData: GameLoadNeedData = new GameLoadNeedData(
          IconFactory.getOutercityVehicle(this._windInfo.tempInfo.SonType),
        );
        this._rolePart.updateParts([gameLoadData]);
        this.addChild(this._rolePart);
        this.attackBuild();
        this.setHitArea();
      }
      this.refreshView();
    } else {
      ToolTipsManager.Instance.unRegister(this);
      this.tipData = null;
    }
  }

  public get wildInfo(): WildLand {
    return this._windInfo;
  }

  public setAttackVisible(value: boolean) {
    this._attacking.visible = value;
  }

  public async attackFun() {
    let event: Laya.Event = new Laya.Event();
    event.currentTarget = this;
    ToolTipsManager.Instance.showTip(event);
  }

  mouseClickHandler(evt: Laya.Event): boolean {
    return true;
  }

  mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }

  mouseOutHandler(evt: Laya.Event): boolean {
    return false;
  }

  mouseMoveHandler(evt: Laya.Event): boolean {
    return false;
  }

  protected setHitArea() {
    let rect = { x: -80, y: -90, width: 134, height: 110 };
    if (rect != this._hitRect) {
      this._hitRect = rect;
      if (!this.hitArea) {
        this.hitArea = new Laya.HitArea();
      }
      this.hitArea.hit.clear();
      this.hitArea.hit.drawRect(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        "#FF0000",
      );

      if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") {
        if (!this._debugSp) {
          this._debugSp = new Laya.Sprite();
          this._debugSp.alpha = 0.5;
          this.addChild(this._debugSp);
        }
        this._debugSp.graphics.drawRect(
          rect.x,
          rect.y,
          rect.width,
          rect.height,
          "#FF0000",
        );
        // Logger.yyz("Avatar的点击区域: ", this.hitArea);
      }
    }
  }

  public dispose() {
    Laya.timer.clearAll(this);
    this._count = 0;
    super.dispose();
  }
}
