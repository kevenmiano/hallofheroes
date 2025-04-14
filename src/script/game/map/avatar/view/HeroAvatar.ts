/*
 * @Author: jeremy.xu
 * @Email: 760139307@qq.com
 * @Date: 2021-02-03 21:01:43
 * @LastEditTime: 2024-01-19 15:58:30
 * @LastEditors: jeremy.xu
 * @Description: 非战斗地图上人物形象渲染类3
 */
import Logger from "../../../../core/logger/Logger";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import { AvatarPosition } from "../../../avatar/data/AvatarPosition";
import { Avatar } from "../../../avatar/view/Avatar";
import {
  AvatarResourceType,
  AvatarStandTotalFrameX,
  AvatarTotalFrameX,
} from "../../../constant/AvatarDefine";
import { LoaderHeaderList } from "../../../roadComponent/loader/LoaderHeaderList";
import HitTestUtils from "../../../utils/HitTestUtils";
import { AvatarBaseLayer } from "../data/AvatarBaseLayer";
import { AvatarLayouData } from "../data/AvatarLayouData";
import { ResourceLoaderInfo } from "../data/ResourceLoaderInfo";
import { FootprintView } from "./FootprintView";
import { HumanAvatar } from "./HumanAvatar";
import { ArrayConstant, ArrayUtils } from "../../../../core/utils/ArrayUtils";
import { SharedManager } from "../../../manager/SharedManager";
import FUIHelper from "../../../utils/FUIHelper";
import { EmPackName, EmWindow } from "../../../constant/UIDefine";

export class HeroAvatar extends HumanAvatar {
  protected _curStepFrame: number = 0;
  protected _delayLoad: boolean;

  protected _mirror: number = 0;
  public get mirror(): number {
    return this._mirror;
  }

  private _avatarStandList: AvatarBaseLayer[];
  private _avatarWalkList: AvatarBaseLayer[];

  /** 尘土 */
  private _footPrint: FootprintView;

  private _actionMovieArr = new Map<number, AvatarBaseLayer[]>();

  private _isShowWeapons: boolean;
  public set isShowWeapons(value: boolean) {
    this._isShowWeapons = value;
  }
  public get isShowWeapons(): boolean {
    return this._isShowWeapons;
  }

  private _isStandPosMount: boolean; //是否是站立坐骑  _isStandPoseMount
  public set isStandPosMount(value: boolean) {
    this._isStandPosMount = value;
  }
  public get isStandPosMount(): boolean {
    return this._isStandPosMount;
  }
  private _propertyChangeCallback: Function; //属性改变(frameY mirror state)回调函数
  public set propertyChangeCallback(value: Function) {
    this._propertyChangeCallback = value;
  }
  private _standFrameX: number = 0;
  private _standWalkDValue: number = 2;
  protected get standWalkFrameX(): number {
    return Math.floor(this._standFrameX / this._standWalkDValue);
  }
  private _standTotalFrameX: number = AvatarStandTotalFrameX.DEFAULT;
  public set standTotalFrameX(value: number) {
    this._standTotalFrameX = value;
  }

  public get standTotalFrameX(): number {
    return this._standTotalFrameX;
  }

  private _stepFrame: number = 0; //一张图片播放的侦数
  public get stepFrame(): number {
    return this._stepFrame;
  }

  public set stepFrame(value: number) {
    if (this._isLockStepFrame) return;
    this._stepFrame = value;
  }

  private _isLockStepFrame: boolean = false;
  public get isLockStepFrame(): boolean {
    return this._isLockStepFrame;
  }

  public set isLockStepFrame(value: boolean) {
    this._isLockStepFrame = value;
  }

  constructor(
    $key: string,
    $type: number,
    $sex: number,
    $delayLoad: boolean,
    job: number = 0,
    pixelSnapping: string = "auto",
    smoothing: boolean = true,
  ) {
    super($key, $type != AvatarResourceType.NPC, pixelSnapping, smoothing);
    // Logger.log("[HeroAvatar]constructor", $key, $type, $sex, $delayLoad, job)
    this._delayLoad = $delayLoad;
    this._stepFrame = 2;
    this._state = Avatar.WALK;
    this.type = $type; //小心使用, 如果在super前使用, 将会还原为默认值
    this._avatarStandList = [];
    this._avatarWalkList = [];
    this._actionMovieArr.set(HeroAvatar.STAND, this._avatarStandList);
    this._actionMovieArr.set(HeroAvatar.WALK, this._avatarWalkList);
  }

  /**
   * 资源加载完成
   */
  public loaderCompleteHandler(res: any, para: ResourceLoaderInfo) {
    // Logger.xjy("[HeroAvatar]loaderCompleteHandler", res, para)
    let url = para.url;
    let preUrl = para.preUrl;

    let obj = LoaderHeaderList.avatarShowNamePos[preUrl];
    if (!obj) {
      obj = res && res.extra;
      if (!obj) {
        Logger.warn("[HeroAvatar]加载完成 对象没有字段extra", preUrl);
        obj = {};
      }
    }

    let size: number = ObjectUtils.isEmptyObj(obj) ? 1 : obj.sizeType;
    // 站立
    let layer = this.getAvatarByPosition(
      para.position,
      para.positionAddSign,
      this._avatarStandList,
    );
    if (!layer) return;
    layer.avaterType = HeroAvatar.STAND;
    layer.resourceInfo = para;
    layer.layouPara = new AvatarLayouData(obj.standsPara);
    layer.sizeType = size;
    layer.loadOver = true;
    layer.offsetY = obj.offsetY ? obj.offsetY : 0;

    // 行走
    layer = this.getAvatarByPosition(
      para.position,
      para.positionAddSign,
      this._avatarWalkList,
    );
    if (!layer) return;
    layer.avaterType = HeroAvatar.WALK;
    layer.resourceInfo = para;
    if (this._isStandPosMount) {
      if (para.isMountPart) {
        layer.layouPara = new AvatarLayouData(obj.walksPara);
      } else {
        layer.layouPara = new AvatarLayouData(obj.standsPara);
      }
    } else {
      layer.layouPara = new AvatarLayouData(obj.walksPara);
    }
    layer.sizeType = size;
    layer.loadOver = true;
    layer.offsetY = obj.offsetY ? obj.offsetY : 0;

    this.resetSizeType();
    this.updateDepth();

    if (para.position == AvatarPosition.BODY) {
      this._body = url;
    } else if (para.position == AvatarPosition.MOUNT) {
      this._mount = url;
      this.flight = obj && obj.flight ? obj.flight : 0;
    }
  }

  // 播放行走动画
  protected drawWalk() {
    this._bitmap && this._bitmap.graphics.clear();
    // 方式2
    if (this._showTranslucenceView) {
      return;
    }

    let mountOffsetY: number = this.getMountOffsetY(HeroAvatar.WALK);
    for (let index = 0; index < this._avatarWalkList.length; index++) {
      const layer = this._avatarWalkList[index];
      const layouPara = layer.layouPara;
      const resourceInfo = layer.resourceInfo;

      let isTranslucencePart = resourceInfo.isTranslucencePart;
      if (this._showTranslucenceView) {
        // 只显示替代模型
        if (!isTranslucencePart) {
          continue;
        }
      } else {
        // 正常情况不显示替代模型
        if (isTranslucencePart) {
          continue;
        }
      }

      if (!layer.visible || !layer.loadOver) {
        continue;
      }

      if (!layer.tempBitmapData) {
        // Logger.warn("check walk resource1:" + resourceInfo.url + ", frameX=" + this.frameX + ", frameY=" + this.frameY);
        continue;
      }

      let rect = this.sizeMax[layer.sizeType];
      if (!rect) {
        continue;
      }

      //////////////////////////////////////
      let cellInfo: any;
      var fY: number = this.getFrameY(this.frameY);
      if (this._isStandPosMount) {
        if (resourceInfo.isMountPart) {
          cellInfo = layouPara.getCellByKey(this.frameX, this.frameY);
        } else {
          cellInfo = layouPara.getCellByKey(this.standWalkFrameX, fY);
        }
      } else {
        cellInfo = layouPara.getCellByKey(this.frameX, this.frameY);
      }
      if (cellInfo == null) {
        let frameY = this.getFrameY(this.frameY);
        cellInfo = layouPara.getCellByKey(this.frameX, frameY);
      }

      let cellInfoX = 0;
      let cellInfoY = 0;
      if (!cellInfo) {
        // Logger.warn("[HeroAvatar]drawWalk cellInfo is null:" + resourceInfo.url + ", frameX=" + this.frameX + ", frameY=" + this.frameY);
        // continue;
      } else {
        cellInfoX = ~~cellInfo["x"];
        cellInfoY = ~~cellInfo["y"];
      }

      let finalOffsetX = layer.offsetX;
      let finalOffsetY: number = resourceInfo.isMountPart ? 0 : mountOffsetY;
      this._destPoint.x =
        rect.x - this.sizeMax[this.sizeType].x + cellInfoX + finalOffsetX;
      this._destPoint.y =
        rect.y - this.sizeMax[this.sizeType].y + cellInfoY + finalOffsetY;
      this._bitmap &&
        this._bitmap.graphics.drawImage(
          layer.tempBitmapData,
          this._destPoint.x,
          this._destPoint.y,
        );

      if (this._showTranslucenceView && isTranslucencePart) {
        break;
      }
    }

    this.contentBitmap.scaleX = this._mirror;
    if (this._mirror == -1) {
      // this.contentBitmap.x = this.contentBitmap.width / 2;
      this.contentBitmap.x = -this.sizeMax[this.sizeType].x;
    } else {
      // this.contentBitmap.x = -this.contentBitmap.width / 2;
      this.contentBitmap.x = this.sizeMax[this.sizeType].x;
    }
    if (this._footPrint) {
      this._footPrint.drawFootPrints(this.frameX, this.frameY);
    }
  }

  protected drawAttack() {}

  protected drawJump() {}

  protected drawStand() {
    this._bitmap && this._bitmap.graphics.clear();
    // 方式2
    if (this._showTranslucenceView) {
      return;
    }

    let fY: number = this.getFrameY(this.frameY);
    let mountOffsetY: number = this.getMountOffsetY(HeroAvatar.STAND);
    for (let index = 0; index < this._avatarStandList.length; index++) {
      const layer = this._avatarStandList[index];
      const layouPara = layer.layouPara;
      const resourceInfo = layer.resourceInfo;

      let isTranslucencePart = resourceInfo.isTranslucencePart;
      if (this._showTranslucenceView) {
        if (!isTranslucencePart) {
          continue;
        }
      } else {
        if (isTranslucencePart) {
          continue;
        }
      }

      if (!layer.visible || !layer.loadOver) {
        continue;
      }

      if (!layer.tempBitmapData) {
        // Logger.warn("check stand resource1:" + resourceInfo.url + ", frameX=" + this.frameX + ", frameY=" + fY);
        continue;
      }

      let rect = this.sizeMax[layer.sizeType];
      if (!rect) {
        continue;
      }

      let cellInfo: any = layouPara.getCellByKey(this.frameX, fY);
      if (cellInfo == null) {
        cellInfo = layouPara.getCellByKey(
          this.frameX,
          this.getFrameY(this.frameY),
        );
      }

      let cellInfoX = 0;
      let cellInfoY = 0;
      if (!cellInfo) {
        // Logger.warn("[HeroAvatar]drawStand cellInfo is null:" + resourceInfo.url + ", frameX=" + this.frameX + ", frameY=" + fY);
        // continue;
      } else {
        cellInfoX = ~~cellInfo["x"];
        cellInfoY = ~~cellInfo["y"];
      }

      let finalOffsetX: number = layer.offsetX;
      let finalOffsetY: number = resourceInfo.isMountPart ? 0 : mountOffsetY;

      this._destPoint.x =
        rect.x - this.sizeMax[this.sizeType].x + cellInfoX + finalOffsetX;
      this._destPoint.y =
        rect.y - this.sizeMax[this.sizeType].y + cellInfoY + finalOffsetY;
      this._bitmap &&
        this._bitmap.graphics.drawImage(
          layer.tempBitmapData,
          this._destPoint.x,
          this._destPoint.y,
        );

      if (this._showTranslucenceView && isTranslucencePart) {
        break;
      }
    }

    this.contentBitmap.scaleX = this._mirror;
    if (this._mirror == -1) {
      this.contentBitmap.x = this.contentBitmap.width / 2;
    } else {
      this.contentBitmap.x = -this.contentBitmap.width / 2;
    }
    if (this._footPrint) {
      this._footPrint.drawFootPrints(this.frameX, this.frameY);
    }
  }

  protected drawWalkPrepare() {
    // Logger.log("[HeroAvatar]drawWalkPrepare", this._avatarWalkList)
    for (let index = 0; index < this._avatarWalkList.length; index++) {
      const layer: AvatarBaseLayer = this._avatarWalkList[index];
      if (!layer.visible || !layer.loadOver) {
        continue;
      }
      if (this._isStandPosMount) {
        if (layer.resourceInfo.isMountPart) {
          layer.getWalksCellByFrame(this.frameX, this.frameY);
        } else {
          let fY: number = this.getFrameY(this.frameY);
          layer.getStandCellByFrame(this.standWalkFrameX, fY);
        }
      } else {
        layer.getWalksCellByFrame(this.frameX, this.frameY);
      }
    }
  }

  // 修正站立坐骑显示信息
  public fixStandPosMountWalk() {
    for (let index = 0; index < this._avatarWalkList.length; index++) {
      let layer: AvatarBaseLayer = this._avatarWalkList[index];
      if (!layer.visible || !layer.loadOver) {
        continue;
      }

      let resourceInfo = layer.resourceInfo;
      let obj = LoaderHeaderList.avatarShowNamePos[resourceInfo.url];
      if (!obj) {
        // Logger.warn("[HeroAvatar]fixStandPosMountWalk 对象没有字段extra", resourceInfo.url)
        return;
      }

      let paras;
      if (this._isStandPosMount) {
        if (resourceInfo.isMountPart) {
          paras = obj.walksPara;
        } else {
          paras = obj.standsPara;
        }
      } else {
        paras = obj.walksPara;
      }
      if (layer.layouPara && layer.layouPara.embedData != paras) {
        Logger.info(
          "[HeroAvatar]fixStandPosMountWalk 修正前:" +
            layer.layouPara.embedData +
            "修正后:" +
            paras,
        );
        layer.layouPara = new AvatarLayouData(paras);
      }
    }
  }

  protected drawStandPrepare() {
    // Logger.log("[HeroAvatar]drawStandPrepare", this._avatarStandList)
    for (let index = 0; index < this._avatarStandList.length; index++) {
      const layer: AvatarBaseLayer = this._avatarStandList[index];
      if (!layer.visible || !layer.loadOver) {
        continue;
      }
      let fY: number = this.getFrameY(this.frameY);
      layer.getStandCellByFrame(this.frameX, fY);
    }
  }

  public set angle(num: number) {
    if (this.angle == num) {
      return;
    }
    super.angle = num;
    let oldFrameY: number = this.frameY;
    let oldMirror: number = this._mirror;

    if (this._isStandPosMount) {
      if (num >= 270 && num < 310) {
        this.frameY = 4;
        this._mirror = 1;
      } else if (num >= 225 && num < 270) {
        this.frameY = 4;
        this._mirror = -1;
      } else if (num >= 310 && num < 320) {
        this.frameY = 3;
        this._mirror = 1;
      } else if (num >= 320 || num < 40) {
        this.frameY = 2;
        this._mirror = 1;
      } else if (num >= 40 && num < 45) {
        this.frameY = 1;
        this._mirror = 1;
      } else if (num >= 45 && num <= 90) {
        this.frameY = 0;
        this._mirror = 1;
      } else if (num > 90 && num < 135) {
        this.frameY = 0;
        this._mirror = -1;
      } else if (num < 140 && num >= 135) {
        this.frameY = 1;
        this._mirror = -1;
      } else if (num < 220 && num >= 140) {
        this.frameY = 2;
        this._mirror = -1;
      } else if (num < 225 && num >= 220) {
        this.frameY = 3;
        this._mirror = -1;
      }
    } else {
      //-90逆时针旋转至90,frameY=[0 1 2 3 4]
      if (num >= 270 && num < 280) {
        this.frameY = 4;
        this._mirror = 1;
      } else if (num >= 260 && num < 270) {
        this.frameY = 4;
        this._mirror = -1;
      } else if (num >= 280 && num < 350) {
        this.frameY = 3;
        this._mirror = 1;
      } else if (num >= 350 || num < 10) {
        this.frameY = 2;
        this._mirror = 1;
      } else if (num >= 10 && num < 80) {
        this.frameY = 1;
        this._mirror = 1;
      } else if (num >= 80 && num <= 90) {
        this.frameY = 0;
        this._mirror = 1;
      } else if (num > 90 && num < 100) {
        this.frameY = 0;
        this._mirror = -1;
      } else if (num < 170 && num >= 100) {
        this.frameY = 1;
        this._mirror = -1;
      } else if (num < 190 && num >= 170) {
        this.frameY = 2;
        this._mirror = -1;
      } else if (num < 260 && num >= 190) {
        this.frameY = 3;
        this._mirror = -1;
      }
    }

    // Logger.log("[HeroAvatar]angle angle=", num, "this.frameY=", this.frameY, "this._mirror=", this._mirror)
    let isFrameYChange = oldFrameY != this.frameY;
    let isMirrorChange = oldMirror != this._mirror;
    if (isFrameYChange) {
      this._curStepFrame = this._stepFrame;
    }
    if (
      this._propertyChangeCallback != null &&
      (isMirrorChange || isFrameYChange)
    ) {
      this._propertyChangeCallback();
    }
    this.play();
  }

  public get angle(): number {
    return super.angle;
  }

  public getCurrentPixels(point?: Laya.Point): number {
    if (this._showTranslucenceView) {
      let pix = HitTestUtils.hitTestAlpha(
        this._translucenceView.displayObject,
        point,
      );
      return pix;
    }
    if (!point) {
      let cmds = this.contentBitmap.graphics.cmds as Laya.DrawImageCmd[];
      if (!cmds) {
        let cmd = this.contentBitmap.graphics["_one"];
        return this.checkHit(cmd);
      }
      for (let index = 0; index < cmds.length; index++) {
        const cmd = cmds[index];
        let pix = this.checkHit(cmd);
        if (pix > 0) {
          return 255;
        }
      }
      return 0;
    } else {
      return HitTestUtils.hitTestAlpha(this.contentBitmap, point);
    }
  }

  private checkHit(cmd: Laya.DrawImageCmd): number {
    if (!cmd) return 0;

    let pt = new Laya.Point();
    pt.x = this.contentBitmap.mouseX - cmd.x;
    pt.y = this.contentBitmap.mouseY - cmd.y;
    let pix = HitTestUtils.hitTestAlpha(cmd.texture, pt);
    if (pix && pix > 0) {
      return pix;
    }
    return 0;
  }

  public run() {
    if (this._curStepFrame == this._stepFrame - 1) {
      this.nextFramePrepare();
      this._curStepFrame++;
    } else if (this._curStepFrame >= this._stepFrame) {
      this._curStepFrame = 0;
      super.run();
    } else {
      this._curStepFrame++;
    }
  }

  protected preframeX() {
    this.frameX--;
    this._standFrameX--;
    if (this.frameX < 0) {
      switch (this._state) {
        case HeroAvatar.WALK:
          this.frameX = this.totalFrameX - 1;
          this._standFrameX = this.standTotalFrameX * this._standWalkDValue - 1;
          break;
        case HeroAvatar.STAND:
          this.frameX = this.standTotalFrameX - 1;
          break;
      }
    }
  }

  protected nextFrameX() {
    this.frameX++;
    this._standFrameX++;
    // Logger.log("[HeroAvatar]nextFrameX", this.frameX)
    switch (this._state) {
      case HeroAvatar.WALK:
        if (this.frameX >= this.totalFrameX) {
          this.frameX = 0;
        }
        if (
          this._standFrameX >=
          this.standTotalFrameX * this._standWalkDValue
        ) {
          this._standFrameX = 0;
        }
        break;
      case HeroAvatar.STAND:
        if (this.frameX >= this.standTotalFrameX) {
          this.frameX = 0;
        }
        break;
    }
  }

  public set sizeType(value: number) {
    super.sizeType = value;
    if (this.type == AvatarResourceType.NPC) {
      return;
    }
    if (!this._footPrint) {
      this._footPrint = new FootprintView(this);
      this._footPrint.footPrintLayer = this.footPrintLayer;
      this._footPrint.type = this.type;
    }
    this._footPrint.createFoots();
  }

  public get sizeType(): number {
    return this._sizeType;
  }

  public set footPrintLayer(value: Laya.Sprite) {
    super.footPrintLayer = value;
    if (!this._footPrint) {
      this._footPrint = new FootprintView(this);
      this._footPrint.type = this.type;
      this._footPrint.createFoots();
    }
    this._footPrint.footPrintLayer = this.footPrintLayer;
  }

  public set frameY(value: number) {
    if (value == this.frameY) {
      return;
    }
    super.frameY = value;
    this.nextFramePrepare();
    this.updateDepth();
  }

  public get frameY(): number {
    return super.frameY;
  }

  public set state(value: number) {
    if (value != this._state) {
      super.state = value;
      this.nextFrameX();
      this._curStepFrame = this._stepFrame;
      this.nextFramePrepare();
      this._propertyChangeCallback && this._propertyChangeCallback();
    }
  }

  public get state(): number {
    return super.state;
  }

  public set type(value: number) {
    super.type = value;
    if (this.type == AvatarResourceType.NPC) {
      this.totalFrameX = this.curTotalFrameX;
      if (this._footPrint) {
        this._footPrint.clearFoots();
      }
    } else if (this.type == AvatarResourceType.PLAYER_ARMY) {
      this.totalFrameX = AvatarTotalFrameX.PLAYER_ARMY;
    }
  }

  public get type(): number {
    return super.type;
  }

  /**
   *  重新计算sizeType 取可见部位最大的那个
   *
   */
  public resetSizeType() {
    super.resetSizeType();

    if (!this.isMounting) {
      this.flight = 0;
    }

    let sizeMax = this.sizeMax;

    // 加载顺序不同
    let translucenceBodySizeType = this.translucenceBodySizeType;
    if (this._showTranslucenceView) {
      let rect = sizeMax[translucenceBodySizeType];
      if (this.aSize.x != rect.width || this.aSize.y != rect.height) {
        this.setBitmapSize(translucenceBodySizeType);
        this.contentBitmap.y = this.flight + sizeMax[this.sizeType].y;
      }
      return;
    }

    if (this.isMorph) {
      this.sizeType = this.npcBodySizeType;
    } else if (this._showTranslucenceView) {
      this.sizeType = translucenceBodySizeType;
    } else {
      let maxSize: number = 7;
      this._avatarWalkList.forEach((layer) => {
        if (layer.visible) {
          let layerSize = sizeMax[layer.sizeType];
          if (layerSize && layerSize.size > sizeMax[maxSize].size) {
            maxSize = layer.sizeType;
          }
        }
      });
      this._avatarStandList.forEach((layer) => {
        if (layer.visible) {
          let layerSize = sizeMax[layer.sizeType];
          if (layerSize && layerSize.size > sizeMax[maxSize].size) {
            maxSize = layer.sizeType;
          }
        }
      });
      // Logger.xjy("[HeroAvatar]resetSizeType 改变前: " + this.sizeType + "改变后: " + maxSize)
      this.sizeType = maxSize;
    }

    this.contentBitmap.y = this.flight + sizeMax[this.sizeType].y;
  }

  public get npcBodySizeType(): number {
    if (this._npcBodySizeType > 0) return this._npcBodySizeType;

    let sizeType: number = 1;
    for (let index = 0; index < this._avatarWalkList.length; index++) {
      const layer = this._avatarWalkList[index];
      if (
        layer.resourceInfo.isNpc &&
        layer.resourceInfo.position == AvatarPosition.BODY
      ) {
        sizeType = layer.sizeType;
        break;
      }
    }
    this._npcBodySizeType = sizeType;
    return sizeType;
  }

  public get translucenceBodySizeType(): number {
    if (this._translucenceBodySizeType > 0)
      return this._translucenceBodySizeType;

    let sizeType: number = 1;
    for (let index = 0; index < this._avatarWalkList.length; index++) {
      const layer = this._avatarWalkList[index];
      if (layer.resourceInfo.isTranslucencePart) {
        sizeType = layer.sizeType;
        break;
      }
    }
    this._translucenceBodySizeType = sizeType;
    return sizeType;
  }

  /**
   * 显示隐藏身上某个部位的装备
   */
  public showAvatar(show: boolean, position: string = "") {
    // Logger.xjy("[HeroAvatar]showAvatar", show, position)

    this.showByPosition(show, position, this._avatarStandList);
    this.showByPosition(show, position, this._avatarWalkList);
    if (position == AvatarPosition.BODY && !show) {
      this._body = "";
    }
    if (position == AvatarPosition.MOUNT && !show) {
      this._mount = "";
    }
  }

  /**
   * 显示隐藏身上所有的装备
   */
  public showAllAvatar(show: boolean = true, exceptPosList: string[] = []) {
    // Logger.xjy("[HeroAvatar]showAllAvatar", show, exceptPosList)
    AvatarPosition.avatarList.forEach((position) => {
      if (exceptPosList.indexOf(position) == -1) {
        this.showAvatar(show, position);
      }
    });
  }

  /**
   * 隐藏某个动作指定部位的装备
   */
  private showByPosition(show, position: string, arr: AvatarBaseLayer[]) {
    let baseLayer: AvatarBaseLayer;
    if (!arr) {
      return;
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      baseLayer = arr[i];
      if (!position || baseLayer.resourceInfo.position == position) {
        baseLayer.visible = show;
        // break;
      }
    }
  }

  /**
   * 通过positionAddSign字段删除相关部件资源
   * @param position
   * @param positionAddSign
   *
   */
  public removeAvatarByPositionAddSign(
    positionAddSign: string,
    position: string = null,
  ) {
    let isMountPosition: boolean = position == AvatarPosition.MOUNT;
    if (isMountPosition) {
      this._mount = "";
    }

    function spliceBypositionAddSign(arr: any[]) {
      let baseLayer: AvatarBaseLayer;
      let len: number = arr.length;
      let toContinue: boolean = false;
      for (let i: number = len - 1; i >= 0; i--) {
        baseLayer = arr[i];
        if (baseLayer.resourceInfo.positionAddSign == positionAddSign) {
          toContinue = false;
          if (position != null && baseLayer.resourceInfo.position != position) {
            toContinue = true;
          }
          if (
            toContinue &&
            isMountPosition &&
            baseLayer.resourceInfo.position == AvatarPosition.MOUNT_WING
          ) {
            //如果为坐骑时连同翅膀也删除
            toContinue = false;
          }
          if (toContinue) {
            continue;
          }
          arr.splice(i, 1);
          baseLayer.dispose();
        }
      }
    }
    spliceBypositionAddSign(this._avatarStandList);
    spliceBypositionAddSign(this._avatarWalkList);
  }

  private getAvatarByPosition(
    position: string,
    positionAddSign: string,
    arr: any[],
  ): AvatarBaseLayer {
    if (!arr) return null;
    for (let index = 0; index < arr.length; index++) {
      const layer = arr[index];
      if (
        layer.resourceInfo.position == position &&
        layer.resourceInfo.positionAddSign == positionAddSign
      ) {
        return layer;
      }
    }
    let layer = new AvatarBaseLayer();
    arr.push(layer);
    return layer;
  }

  private getFrameY($frameY: number): number {
    let fY: number = 2;
    if (
      this.sizeType != 10 ||
      HeroAvatar.SizeType_NEW10.indexOf(this.currentMountId) != -1
    ) {
      if ($frameY == 1 || $frameY == 0) {
        fY = 0;
      } else if ($frameY == 3 || $frameY == 2) {
        fY = 1;
      }
    } else {
      fY = 0;
    }
    return fY;
  }

  /**
   * 针对坐骑的, 使坐骑上下偏移一定的距离
   * @param type 站立或行走
   * @return
   *
   */
  private getMountOffsetY(type: number = HeroAvatar.STAND): number {
    // 变身与半透明替代人物不需要偏移
    if (this._showTranslucenceView || this.isMorph) {
      return 0;
    }

    let offsetY: number = 0;
    let arr: AvatarBaseLayer[] = [];
    if (type == HeroAvatar.WALK) {
      arr = this._avatarWalkList;
    } else if (type == HeroAvatar.STAND) {
      arr = this._avatarStandList;
    }
    for (let index = 0; index < arr.length; index++) {
      const layer = arr[index];
      if (
        layer.visible &&
        layer.resourceInfo.position == AvatarPosition.MOUNT
      ) {
        offsetY = layer.offsetY;
        break;
      }
    }
    // Logger.xjy("[HeroAvatar]getMountOffsetY", type, offsetY)
    return offsetY;
  }

  /**
   * 对当前身上的avatar进行一个排序以便渲染
   *
   */
  private updateDepth() {
    this._avatarWalkList.forEach((layer: AvatarBaseLayer) => {
      let baseNum = layer.resourceInfo.walk[this.frameY];
      layer.curBaseNum = baseNum ? baseNum : 0;
    });
    // Logger.xjy("[HeroAvatar]updateDepth", this._avatarWalkList)
    this._avatarWalkList = ArrayUtils.sortOn(
      this._avatarWalkList,
      "curBaseNum",
      ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
    );

    let fY: number = 0;
    switch (this.frameY) {
      case 0:
      case 1:
        fY = 0;
        break;
      case 2:
      case 3:
        fY = 1;
        break;
      default:
        fY = 2;
    }
    this._avatarStandList.forEach((layer: AvatarBaseLayer) => {
      let baseNum = layer.resourceInfo.stand[fY];
      layer.curBaseNum = baseNum ? baseNum : 0;
    });
    this._avatarStandList = ArrayUtils.sortOn(
      this._avatarStandList,
      "curBaseNum",
      ArrayConstant.NUMERIC | ArrayConstant.DESCENDING,
    );
    // Logger.log("[HeroAvatar]updateDepth frameY=" + this.frameY + ",fY=", fY, this._avatarStandList, this._avatarWalkList)
  }

  public clearLayoutOffset() {
    this._avatarStandList.forEach((curLayer: AvatarBaseLayer) => {
      curLayer.layouPara.clearOffset();
    });
    this._avatarWalkList.forEach((curLayer: AvatarBaseLayer) => {
      curLayer.layouPara.clearOffset();
    });
  }

  public dispose() {
    this.showAllAvatar(false);
    ObjectUtils.disposeObject(this._footPrint);
    this._footPrint = null;
    this._avatarStandList = null;
    this._avatarWalkList = null;
    super.dispose();
  }
}
