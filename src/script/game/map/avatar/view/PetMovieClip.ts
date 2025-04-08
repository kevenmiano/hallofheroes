// @ts-nocheck
/*
 * @Author: jeremy.xu
 * @Date: 2021-11-04 10:07:28
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2023-05-08 14:17:32
 * @Description: 宠物修炼形象  与PetAvatarView相比, 少了一些部件, 少了跟随, 少了随机走动等等
 *
 * TODO:与PetAvatarView一样暂时资源不释放  后面考虑和PetAvatarView合并, 合并后由HeroAvatarView采用引用计数释放
 */

import { AvatarPosition } from "../../../avatar/data/AvatarPosition";
import { Avatar } from "../../../avatar/view/Avatar";
// import { IEnterFrame } from "../../../interfaces/IEnterFrame";
import { EnterFrameManager } from "../../../manager/EnterFrameManager";
import { PathManager } from "../../../manager/PathManager";
import { LoaderHeaderList } from "../../../roadComponent/loader/LoaderHeaderList";
import { AvatarLayouData } from "../data/AvatarLayouData";
import { ResourceLoaderInfo } from "../data/ResourceLoaderInfo";
import { AvatarActions } from "../../../avatar/data/AvatarActions";
import ResMgr from "../../../../core/res/ResMgr";
import Logger from "../../../../core/logger/Logger";

export class PetMovieClip extends Laya.Sprite implements IEnterFrame {
  protected _urlKey: string;
  protected _stepFrame: number;
  protected _sizeType: number;
  protected _bitmap: Laya.Sprite;

  protected _curStepFrame: number = 0;
  protected standTotalFrameX: number = 5;

  protected _resourceInfo: ResourceLoaderInfo;
  protected _standLayouPara: AvatarLayouData;
  protected _walkLayouPara: AvatarLayouData;
  protected _loadCompleted: boolean = false;
  public bpHeight: number = 100;

  protected _frameX: number = 0;
  public get frameX(): number {
    return this._frameX;
  }
  public set frameX(value: number) {
    this._frameX = value;
    if (this._frameX >= this.standTotalFrameX) {
      this._frameX = 0;
    }
  }

  private _frameY: number = 0;
  public get frameY(): number {
    return this._frameY;
  }
  public set frameY(value: number) {
    this._frameY = value;
  }

  private _state: number = Avatar.STAND;
  public get state(): number {
    return this._state;
  }

  public set state(value: number) {
    if (this._state == value) return;
    this._state = value;
  }

  constructor() {
    super();
    this._stepFrame = 2;
    this._bitmap = new Laya.Sprite();
    this.addChild(this._bitmap);
  }

  public play() {
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  public stop() {
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  public get urlKey(): string {
    return this._urlKey;
  }

  public set urlKey(value: string) {
    this._urlKey = value;
    this.url = PathManager.getPetFollowPath(value);
  }

  private _url: string;

  public get url(): string {
    return this._url;
  }

  public set url(value: string) {
    this._url = value;
    this._bitmap.visible = Boolean(value);
    this._bitmap.active = Boolean(value);
    if (!value) {
      this.clear();
      return;
    }

    let args = this.createResourceLoadInfo(
      this._url,
      [],
      [],
      AvatarPosition.PET
    );
    ResMgr.Instance.loadRes(
      this._url,
      this.loaderCompleteHandler.bind(this),
      null,
      Laya.Loader.ATLAS,
      undefined,
      null,
      null,
      null,
      null,
      args
    );
  }

  private createResourceLoadInfo(
    url: string,
    sornStand: any[],
    sornWalk: any[],
    position: string
  ): ResourceLoaderInfo {
    let loadInfo: ResourceLoaderInfo = new ResourceLoaderInfo();
    loadInfo.packageName = "";
    loadInfo.stand = sornStand;
    loadInfo.walk = sornWalk;
    loadInfo.position = position;
    loadInfo.url = url;
    return loadInfo;
  }

  private loaderCompleteHandler(res: any, para: ResourceLoaderInfo) {
    if (!res) return;

    Logger.xjy("[PetMovieClip]loaderCompleteHandler", res, para);
    para.preUrl = res.meta ? res.meta.prefix : "";

    let obj = LoaderHeaderList.avatarShowNamePos[para.preUrl];
    if (!obj) {
      obj = res && res.extra;
      if (!obj) {
        Logger.warn("[PetMovieClip]英灵形象显示出错 extra==null");
        return;
      }
    }

    let size: number = obj ? obj.sizeType : 1;
    this._sizeType = size;
    this._resourceInfo = para;
    this._standLayouPara = new AvatarLayouData(obj.standsPara);
    this._walkLayouPara = new AvatarLayouData(obj.walksPara);
    this._loadCompleted = true;
    this.draw();
  }

  private drawStand() {
    if (!this._loadCompleted) return;
    if (!this._standLayouPara) return;

    let fy: number = this.getFrameY(this.frameY);
    let pngName: string =
      AvatarActions.ACTION_STOP + "_" + this.frameX + "_" + fy + ".png";
    let texture = ResMgr.Instance.getRes(this._resourceInfo.preUrl + pngName);

    if (texture) {
      let rect: any = Avatar.sizeMaxOld[this._sizeType];
      let cell: any = this._standLayouPara.getCellByKey(this.frameX, fy);
      let destPoint = new Laya.Point();
      destPoint.x = rect.x + Number(cell["x"]);
      destPoint.y = rect.y + Number(cell["y"]);

      this._bitmap && this._bitmap.graphics.clear();
      this._bitmap &&
        this._bitmap.graphics.drawImage(
          texture,
          destPoint.x,
          destPoint.y,
          texture.width,
          texture.height
        );
    }
  }

  private drawWalk() {
    if (!this._loadCompleted) return;
    if (!this._walkLayouPara) return;

    let fy: number = this.getFrameY(this.frameY);
    let pngName: string =
      AvatarActions.ACTION_WALK + "_" + this.frameX + "_" + fy + ".png";
    let texture = ResMgr.Instance.getRes(this._resourceInfo.preUrl + pngName);

    if (texture) {
      let rect: any = Avatar.sizeMaxOld[this._sizeType];
      let cell: any = this._walkLayouPara.getCellByKey(this.frameX, fy);
      let destPoint = new Laya.Point();
      destPoint.x = rect.x + Number(cell["x"]);
      destPoint.y = rect.y + Number(cell["y"]);

      this._bitmap && this._bitmap.graphics.clear();
      this._bitmap &&
        this._bitmap.graphics.drawImage(
          texture,
          destPoint.x,
          destPoint.y,
          texture.width,
          texture.height
        );
    }
  }

  protected draw() {
    switch (this._state) {
      case Avatar.WALK:
        this.drawWalk();
        break;
      case Avatar.STAND:
        this.drawStand();
        break;
    }
  }

  private getFrameY($frameY: number): number {
    let fY: number = 2;
    if ($frameY == 1 || $frameY == 0) fY = 0;
    else if ($frameY == 3 || $frameY == 2) fY = 1;
    return fY;
  }

  public enterFrame() {
    if (this._curStepFrame >= this._stepFrame) {
      this._curStepFrame = 0;
      this.draw();
      this.frameX++;
    } else {
      this._curStepFrame++;
    }
  }

  public clear() {
    this._loadCompleted = false;
    this._standLayouPara = null;
    this._walkLayouPara = null;
    this._url = null;
    this._urlKey = null;
    this._bitmap && this._bitmap.graphics.clear();
  }

  public dispose() {
    this.clear();
  }
}
