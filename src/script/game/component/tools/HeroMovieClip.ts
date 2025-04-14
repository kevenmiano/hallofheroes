/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description 战斗场景形象组合部位加载
 **/

import Logger from "../../../core/logger/Logger";
import ObjectUtils from "../../../core/utils/ObjectUtils";
import { BattleAvatarResUtils } from "../../avatar/util/BattleAvatarResUtils";
import { HeroRoleInfo } from "../../battle/data/objects/HeroRoleInfo";
import { Helpers } from "../../battle/utils/Helpers";
import { HeroLoadDataFactory } from "../../battle/utils/HeroLoadDataFactory";
import { RoleUnit } from "../../battle/view/RoleUnit";
import { MovieClip } from "../MovieClip";

export class HeroMovieClip extends Laya.Animation {
  private _heroInfo: HeroRoleInfo;
  private _heroBody: RoleUnit;
  private _heroParts: Array<RoleUnit>;
  private _totalLoadCount: number = 0;
  private _curLoadCount: number = 0;
  public completeFunc: Function;

  public get body(): RoleUnit {
    return this._heroBody;
  }

  public set data(data: any) {
    if (this.body) {
      this.body.data = data;
    }
  }

  public get data(): any {
    if (this.body) {
      return this.body.data;
    }
    return null;
  }

  // 挂点
  public get pos_head(): Laya.Point {
    return this.body.content["pos_head"];
  }
  public get pos_body(): Laya.Point {
    return this.body.content["pos_body"];
  }
  public get pos_leg(): Laya.Point {
    return this.body.content["pos_leg"];
  }

  public get currentFrame(): number {
    return this.body.content.currentFrame;
  }

  public hasOwnProperty(V: any): boolean {
    return this.body.content && this.body.content.hasOwnProperty(V);
  }

  public getBodyMC(): MovieClip {
    return this.body && this.body.content;
  }

  public constructor(heroInfo: HeroRoleInfo) {
    super();
    this._heroInfo = heroInfo;
  }

  public startLoad() {
    this._heroParts = new Array<RoleUnit>();
    if (this._heroInfo.templateId == 100) {
      //神秘人
      this._totalLoadCount = 1;
      this.createParts(HeroLoadDataFactory.PART_BODY, true);
    } else {
      this._totalLoadCount = 9;
      this.createParts(HeroLoadDataFactory.PART_CLOAK2);
      this.createParts(HeroLoadDataFactory.PART_ARMS_BACK);
      this.createParts(HeroLoadDataFactory.PART_HAIR4);

      this.createParts(HeroLoadDataFactory.PART_HAIR3);
      this.createParts(HeroLoadDataFactory.PART_BODY, true);

      this.createParts(HeroLoadDataFactory.PART_HAIR2);
      this.createParts(HeroLoadDataFactory.PART_ARMS);
      this.createParts(HeroLoadDataFactory.PART_HAIR1);
      this.createParts(HeroLoadDataFactory.PART_CLOAK1);
    }
  }

  private createParts(sPart: string, isBody: boolean = false) {
    var roleUnit: RoleUnit = new RoleUnit();
    if (isBody) {
      this._heroBody = roleUnit;
    }
    roleUnit.name = sPart;
    roleUnit.completeFunc = this.onPartComplete.bind(this);
    roleUnit.data = HeroLoadDataFactory.create(
      (this._heroInfo as HeroRoleInfo).heroInfo,
      sPart,
    );

    this.addChild(roleUnit);
    this._heroParts.push(roleUnit);
  }

  private onPartComplete(target: RoleUnit) {
    this._curLoadCount++;
    // Logger.info("[HeroMovieClip]onPartComplete 当前数量", this._curLoadCount, target.data)
    if (target.data.sPart == HeroLoadDataFactory.PART_BODY) {
      Helpers.getPos(this._heroInfo.pos_body_hero, target.content, "pos_body");
      Helpers.getPos(this._heroInfo.pos_head_hero, target.content, "pos_head");
      Helpers.getPos(this._heroInfo.pos_leg_hero, target.content, "pos_leg");
    }
    if (this._curLoadCount >= this._totalLoadCount) {
      this.loadCompleted();
    }
  }

  private loadCompleted() {
    // 由于很多武器的偏移点没有  使用body的偏移点
    if (this._heroBody && this._heroBody.content.pos_leg) {
      let pos_leg = this._heroBody.content.pos_leg;
      this._heroParts.forEach((roleUnit) => {
        let [fixX, fixY] = BattleAvatarResUtils.fixResOffset(roleUnit.data);
        roleUnit.content.pivot(-(-pos_leg.x + fixX), -(-pos_leg.y + fixY));
      });
    }

    // Logger.info(">>>onPartComplete framesMap", Laya.Animation.framesMap)
    // Logger.info(">>>onPartComplete atlasMap", Laya.Loader.atlasMap)
    // Logger.info(">>>onPartComplete textureMap", Laya.Loader.textureMap)
    // Logger.info(">>>onPartComplete loadedMap", Laya.Loader.loadedMap)
    this.completeFunc && this.completeFunc();
  }

  public get headMovie(): RoleUnit {
    return this.body;
  }

  public getPosMovie(): MovieClip {
    return this.headMovie.getChildAt(0) as MovieClip;
  }

  public gotoAndPlay(start?: any, loop?: boolean, aniType?: string) {
    this._heroParts.forEach((part) => {
      if (part.content && aniType) {
        part.content.gotoAndPlay(start, loop, aniType);
      }
    });
  }

  public gotoAndStop(position: any) {
    this._heroParts.forEach((part) => {
      if (part.content) {
        part.content.gotoAndStop(position);
      }
    });
  }

  public gotoAndStopEX(position: any, name: string) {
    this._heroParts.forEach((part) => {
      if (part.content) {
        part.content.gotoAndStopEX(position, name);
      }
    });
  }

  public stop() {
    this._heroParts.forEach((part) => {
      if (part.content) {
        part.content.stop();
      }
    });
  }

  public play() {
    this._heroParts.forEach((part) => {
      if (part.content) {
        part.content.play();
      }
    });
  }

  public get currentLabel(): string {
    return this.body.content.currentLabel;
  }

  public get totalFrames(): number {
    return this.body.content.totalFrames;
  }

  public addFrameScript(...parameters) {
    if (this.body)
      (this.body.content as MovieClip).addFrameScript.apply(
        this.body.content,
        parameters,
      );
  }

  public dispose() {
    this._heroParts.forEach((part) => {
      ObjectUtils.disposeObject(part);
    });
    this._heroParts = [];
    this._heroBody = null;
    this._heroInfo = null;
  }
}
