/*
 * @Author: jeremy.xu
 * @Date: 2021-10-25 11:32:42
 * @Email: 760139307@qq.com
 * @LastEditors: jeremy.xu
 * @LastEditTime: 2021-12-31 15:25:42
 * @Description: UI上展示单个的英灵  觉醒形象
 */

import { MovieClip } from "../../component/MovieClip";
import { t_s_pettemplateData } from "../../config/t_s_pettemplate";
import { PathManager } from "../../manager/PathManager";
import ResMgr from "../../../core/res/ResMgr";
import { AnimationManager } from "../../manager/AnimationManager";
import Logger from "../../../core/logger/Logger";
import HitTestUtils from "../../utils/HitTestUtils";

export class ShowPetAvatar extends Laya.Sprite {
  private _fullUrl: string;
  private _cacheName: string;
  private _data: t_s_pettemplateData;
  public clickFunc: Function;
  public layoutNameFunc: Function;
  public nameHeight: number = 0;
  private _mc: MovieClip = new MovieClip();

  public static figureResMap: Map<string, boolean> = new Map<string, boolean>();
  public static figureAniMap: Map<string, boolean> = new Map<string, boolean>();
  public static figureResUnLoadMap: Map<string, boolean> = new Map<
    string,
    boolean
  >();

  constructor() {
    super();
    this.addChild(this._mc);
  }

  public get data(): t_s_pettemplateData {
    return this._data;
  }

  public set data(value: t_s_pettemplateData) {
    this._data = value;
    this._mc.visible = Boolean(value);
    if (value) {
      let newUrl = PathManager.getPetMorphShowPath(value.PetAvatar);
      if (newUrl == this._fullUrl) {
        return;
      }
      this._fullUrl = newUrl;
      ShowPetAvatar.figureResUnLoadMap.set(this._fullUrl, true);
      ResMgr.Instance.loadRes(this._fullUrl, this.__onResComplete.bind(this));
    }
  }

  public set avatarPath(petAvatar: string) {
    this._mc.visible = petAvatar != "";
    if (petAvatar != "") {
      let newUrl = PathManager.getPetMorphShowPath(petAvatar);
      if (newUrl == this._fullUrl) {
        return;
      }
      this._fullUrl = newUrl;
      ShowPetAvatar.figureResUnLoadMap.set(this._fullUrl, true);
      ResMgr.Instance.loadRes(this._fullUrl, this.__onResComplete.bind(this));
    }
  }

  private __onResComplete(res: any) {
    if (this.destroyed) return;
    if (!res || !res.meta) {
      Logger.base("英灵UI展示模型资源不存在！");
      return;
    }

    let pre_url = res.meta.prefix;
    this._cacheName = pre_url;
    // Logger.xjy("[ShowAvatarLoader]缓存动画:", cacheName)
    if (!AnimationManager.Instance.getCache(pre_url)) {
      let sucess = AnimationManager.Instance.createAnimation(
        pre_url,
        "",
        undefined,
        "",
        AnimationManager.BattleEffectFormatLen,
      );
      // Logger.xjy("ShowPetAvatar", pre_url, sucess)
    }

    let offsetX: number = 0;
    let offsetY: number = 0;
    if (res.offset) {
      let offset = res.offset;
      if (offset.posDownX) offsetX = offset.posDownX;
      if (offset.posDownY) offsetY = offset.posDownY;
      if (offset.posUpY) this.nameHeight = offset.posDownY - offset.posUpY;
    }
    let frames = res.frames;
    let sourceSize = new Laya.Rectangle();
    for (let key in frames) {
      if (Object.prototype.hasOwnProperty.call(frames, key)) {
        let sourceItem = frames[key].spriteSourceSize;
        sourceSize.width = sourceItem.w;
        sourceSize.height = sourceItem.h;
        break;
      }
    }

    this._mc.pivot(sourceSize.width >> 1, sourceSize.height);
    this._mc.x = this.width / 2 - offsetX + 100;
    this._mc.y = this.height - offsetY + 50;
    this._mc.gotoAndPlay(0, true, this._cacheName);

    let bounds = this._mc.getBounds();
    // 特殊处理 修正"雅典娜"点击区域
    if (this._fullUrl.indexOf("/pet_athena") > -1) {
      bounds.width = 363;
      bounds.height = 389;
    }
    let hitArea: Laya.HitArea = new Laya.HitArea();
    hitArea.hit.drawRect(0, 0, bounds.width, bounds.height, "#FF0000");
    // Logger.xjy("ShowPetAvatar的点击区域: ", hitArea);

    this._mc.hitArea = hitArea;
    this._mc.on(Laya.Event.CLICK, this, this.__mouseClick);

    this.layoutNameFunc && this.layoutNameFunc(this);

    ShowPetAvatar.figureResMap.set(this._fullUrl, true);
    ShowPetAvatar.figureAniMap.set(this._cacheName, true);
  }

  // 特殊处理 修正"雅典娜"点击区域
  public isAthena(): boolean {
    return this._fullUrl.indexOf("/pet_athena") > -1;
  }

  private __mouseClick(evt: Laya.Event) {
    let point = new Laya.Point(evt.stageX, evt.stageY);

    let isOver = true;
    let view = this._mc;
    if (view) {
      view.globalToLocal(point);
      isOver = HitTestUtils.hitTest(view, point);
    }
    if (!isOver) {
      return;
    }

    this.clickFunc && this.clickFunc();
  }

  public dispose() {}

  // 由引用ShowPetAvatar的模块在退出模块时调用释放资源
  public static releaseAllRes() {
    ShowPetAvatar.figureResUnLoadMap.forEach((element, url) => {
      ResMgr.Instance.cancelLoadByUrl(url);
    });
    ShowPetAvatar.figureResMap.forEach((element, url) => {
      ResMgr.Instance.releaseRes(url);
    });
    ShowPetAvatar.figureAniMap.forEach((element, aniName) => {
      AnimationManager.Instance.clearAnimationByName(aniName);
    });
  }
}
