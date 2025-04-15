/**
 * @author:jeremy.xu
 * @data: 2020-11-20 18:00
 * @description  战斗角色基类
 **/

import Logger from "../../../../core/logger/Logger";
import { IconFactory } from "../../../../core/utils/IconFactory";
import ObjectUtils from "../../../../core/utils/ObjectUtils";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../component/FilterFrameText";
import { StripUIView } from "../../../component/StripUIView";
import {
  ActionLabesType,
  BattleType,
  BloodType,
  FaceType,
  InheritRoleType,
  RoleType,
} from "../../../constant/BattleDefine";
import {
  BattleEvent,
  RoleEvent,
} from "../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow, UIZOrder } from "../../../constant/UIDefine";
// import { IStrip } from "../../../interfaces/IStrip";
import { NotificationManager } from "../../../manager/NotificationManager";
import { SharedManager } from "../../../manager/SharedManager";
import { ReadyAction } from "../../actions/ReadyAction";
import { BattleManager } from "../../BattleManager";
import { BattleModel } from "../../BattleModel";
import { HeroRoleInfo } from "../../data/objects/HeroRoleInfo";
import { BaseRoleInfo } from "../../data/objects/BaseRoleInfo";
import { BattleEffect } from "../../skillsys/effect/BattleEffect";
import { EffectContainer } from "../../skillsys/effect/EffectContainer";
import { MovieClipEffect } from "../../skillsys/effect/MovieClipEffect";
import { BloodHelper } from "../../skillsys/helper/BloodHelper";
import { DepthSprite } from "../../utils/DepthSprite";
import { RoleInfoUI, RoleInfoUIEnum } from "../ui/RoleInfoUI";
import { t_s_skilltemplateData } from "../../../config/t_s_skilltemplate";
import CollectionEffect from "../../effect/CollectionEffect";
import { UIFilter } from "../../../../core/ui/UIFilter";
import SkillUseItemCell from "../ui/SkillUseItemCell";
import { MovieClip } from "../../../component/MovieClip";
import { BufferDamageData } from "../../data/BufferDamageData";
import { TempleteManager } from "../../../manager/TempleteManager";
import BufferLastEffect from "../buffer/BufferLastEffect";
import BufferIconFactory from "../buffer/BufferIconFactory";
import BufferContainer from "../buffer/BufferContainer";
import { PathManager } from "../../../manager/PathManager";
import { UpgradeType } from "../../../constant/UpgradeType";
// import LoaderInfo from "../../../datas/LoaderInfo";
import { t_s_upgradetemplateData } from "../../../config/t_s_upgradetemplate";
import { t_s_skillbuffertemplateData } from "../../../config/t_s_skillbuffertemplate";
import ResMgr from "../../../../core/res/ResMgr";
import FUIHelper from "../../../utils/FUIHelper";
import { FrameCtrlManager } from "../../../mvc/FrameCtrlManager";
import BattleWnd from "../../../module/battle/BattleWnd";
import { DamageNumView } from "../ui/DamageNumView";
import { EmLayer } from "../../../../core/ui/ViewInterface";
import LayerMgr from "../../../../core/layer/LayerMgr";
import { RoleUnit } from "../RoleUnit";
import { FilterFrameShadowText } from "../../../component/FilterFrameShadowText";
import ConfigMgr from "../../../../core/config/ConfigMgr";
import { t_s_herotemplateData } from "../../../config/t_s_herotemplate";
import { ConfigType } from "../../../constant/ConfigDefine";
import { GlobalConfig } from "../../../constant/GlobalConfig";

interface IStrip {
  resetBloodShield: any;
  bloodLoseValue: number;
  bloodShield: any;
  maxValue: number;
  currentValue: number;
  currentIndex: number;
  dispose(): void;
}

interface LoaderInfo {
  url: string;
  content: any;
}

export enum RoleViewZOrder {
  Back = 0,
  Center,
  Front,
}

export class BaseRoleView extends DepthSprite {
  public inheritType: InheritRoleType = InheritRoleType.Default;

  protected _body: Laya.Sprite;
  protected _shadow: Laya.Sprite;
  protected _movieContainer: Laya.Sprite;
  protected _roleInfoUI: RoleInfoUI;
  protected _middleContainer: Laya.Sprite;
  protected _backEffectContainer: EffectContainer; //特效容器后层
  protected _effectContainer: EffectContainer; //特效容器前层
  protected _bufferContainer: BufferContainer;
  protected _bufferLastEffects: BufferLastEffect[] = [];
  protected _stripView: IStrip; //血条
  protected _stripComp: fgui.GComponent;
  protected _loadingView: fgui.GMovieClip;
  protected _heroNameTxt: FilterFrameShadowText;
  protected _nameContainer: Laya.Sprite;
  protected _debugInfoTxt: FilterFrameText;
  protected _fateSkillEffect: Laya.Sprite;

  public static LOADING_STATE: number = 0;
  public static LOAD_COMPLETE_STATE: number = 1;
  public static BUFFER_OFFSET_Y: number = -30; //对所有挂点在人物头部的特效偏移一定像素
  public static USE_SKILLITEM_POS = new Laya.Point(-100, -10);
  public static ImgShadowReferenceW: number = 225;

  protected _info: any;
  protected _x: number = 0;
  protected _y: number = 0;
  protected _loadingState: number = 0;
  protected _roleLoaded: boolean = false;
  protected _isLockInfoView: boolean = false; //是否锁定血条的位置（会否跟着人物一起动）;
  protected _shadowW: number = 0;
  protected _disposed: boolean = false;
  protected _roleInfoViewVisible: boolean = true;
  public isPetBody: boolean = false;

  protected _rolePart: RoleUnit;
  public get rolePart(): RoleUnit {
    return this._rolePart;
  }

  public get rolePartUrlPath(): string {
    return this._rolePart && this._rolePart.data && this._rolePart.data.urlPath;
  }

  public get bodyMc(): MovieClip {
    return;
  }

  constructor(info) {
    super();
    this._info = info;

    this.initView();
  }

  protected initView() {
    this._body = new Laya.Sprite();
    this._body.zOrder = RoleViewZOrder.Center;
    this.addChild(this._body);

    this._movieContainer = new Laya.Sprite();
    this._body.addChild(this._movieContainer);
    this._movieContainer.name = "movieContainer";

    this._middleContainer = new Laya.Sprite();
    this._middleContainer.zOrder = RoleViewZOrder.Center;
    this.addChild(this._middleContainer);

    this._effectContainer = new EffectContainer();
    this._effectContainer.zOrder = RoleViewZOrder.Front;
    this.addChild(this._effectContainer);

    this._backEffectContainer = new EffectContainer();
    this._backEffectContainer.zOrder = RoleViewZOrder.Back;
    this.addChild(this._backEffectContainer);
    this.scaleX = this.scaleY = BattleModel.DEFAULT_SCALE;

    if (!this._roleInfoUI) this._roleInfoUI = new RoleInfoUI();
    this.addChild(this._roleInfoUI);
    this._roleInfoUI.zOrder = RoleViewZOrder.Front;
    if (this.checkCanshowBuffIcon()) {
      this._bufferContainer = new BufferContainer(this._info);
      this._roleInfoUI.addChildWithTag(
        this._bufferContainer,
        RoleInfoUIEnum.BufferContainer,
      );
    }

    this._heroNameTxt = new FilterFrameShadowText(
      200,
      30,
      undefined,
      18,
      undefined,
      "center",
      undefined,
      0.5,
    );
    this._roleInfoUI.addChildWithTag(
      this._heroNameTxt,
      RoleInfoUIEnum.RoleName,
    );
    // if (!this._debugInfoTxt) this._debugInfoTxt = new FilterFrameText(200, 30, undefined, 18, undefined, "right", undefined, 1);
    // this.addChild(this._debugInfoTxt);
    // this._debugInfoTxt.y = -200;
    // this._debugInfoTxt.zOrder = 999;

    // 直接预加载了
    if (BattleModel.battleUILoaded) {
      this.delayInitView();
    } else {
      NotificationManager.Instance.addEventListener(
        BattleEvent.BATTLE_UI_LOADED,
        this.onBattleUILoaded,
        this,
      );
    }

    NotificationManager.Instance.addEventListener(
      BattleEvent.BATTLE_MUSIC_ON_OFF,
      this.onBattleMusicOnOff,
      this,
    );
  }

  // 增援face设置在load之前
  public load() {
    this.initBloodBar();
    this.refreshHeroText();
  }

  protected onLoadComplete() {}

  public get heroNameTxt(): FilterFrameShadowText {
    return this._heroNameTxt;
  }

  public setHeroNameTxtValue(nickName: string, $serverName: string = "") {
    let serverName = $serverName || this.info.battleServerName;
    if (
      serverName &&
      this.isShowServiceNameBattleType(
        this.battleModel && this.battleModel.battleType,
      )
    ) {
      this._heroNameTxt.text = "[" + serverName + "]" + nickName;
    } else {
      this._heroNameTxt.text = nickName;
    }
  }

  //监听声音开关 TODO
  private onBattleMusicOnOff(event: BattleEvent) {
    if (
      this._info &&
      this._info.actionLaya &&
      this._info.actionLaya.Animation
    ) {
      this._info.actionLaya.Animation.soundTransform =
        SharedManager.Instance.getSkillSoundTransform();
    }
  }

  protected onBattleUILoaded(event: BattleEvent) {
    NotificationManager.Instance.removeEventListener(
      BattleEvent.BATTLE_UI_LOADED,
      this.onBattleUILoaded,
      this,
    );
    this.delayInitView();
  }

  protected delayInitView() {
    if (this._disposed) {
      return;
    }

    if (!this._shadow) {
      this._shadow = new Laya.Sprite();
      this._shadow.zOrder = RoleViewZOrder.Back;
      this.addChild(this._shadow);
      this._shadow.graphics.drawImage(
        FUIHelper.getItemAsset(EmPackName.BaseCommon, "shadow"),
      );
      this._shadow.pivot(
        GlobalConfig.Avatar.battleShadowW / 2,
        GlobalConfig.Avatar.battleShadowH / 2,
      );
    }
    if (this._shadowW != 0) {
      this.initShadeScale(this._shadowW);
    }
    this.addFateSkillEffect();

    this.addEvent();
    this.updataDirectionByFace();
    this.updataPosByInfo();
  }

  protected refreshHeroText() {
    let colorFrame = 1;
    if (this._info.face == FaceType.RIGHT_TEAM) {
      colorFrame = 5;
    } else {
      let heroTempInfo: t_s_herotemplateData =
        ConfigMgr.Instance.getTemplateByID(
          ConfigType.t_s_herotemplate,
          this._info.templateId,
        );
      //友方npc:  1玩家, 2机器人, 3为Boss类型
      if (heroTempInfo && heroTempInfo.HeroType == 3) {
        colorFrame = 4;
      } else {
        if (this.isSelf) {
          colorFrame = 3;
        } else if (this.isSelfConsortiaAndSide) {
          colorFrame = 2;
        }
      }
    }
    this._heroNameTxt.setFrame(colorFrame, eFilterFrameText.AvatarName);
  }

  protected async initBloodBar() {
    if (!this._stripView) {
      let totalBloodA = this._info.totalBloodA;
      let bloodA = this._info.bloodA;
      if (
        this._info.inheritType == InheritRoleType.Hero &&
        this._info.type == RoleType.T_NPC_BOSS &&
        (this._info.face == FaceType.RIGHT_TEAM || this._info.face == 0)
      ) {
        this._stripComp = (await fgui.UIPackage.createObject(
          EmPackName.Battle,
          "Prog_BossSmallCon",
        )) as fgui.GComponent;
        let realStrp = this._stripComp.getChild("strip").asCom;
        let stripNum = BattleModel.getBossHpStripNum(
          this._info.heroInfo.templateId,
        );
        let asset = [];
        if (stripNum <= 1) {
          asset.push(realStrp.getChild("level4"));
        } else {
          for (let i = 1; i <= stripNum; i++) {
            asset.push(realStrp.getChild("level" + i));
          }
        }
        this._stripView = new StripUIView(
          asset,
          totalBloodA ? totalBloodA : -1,
          bloodA ? bloodA : -1,
        );
      } else {
        this._stripComp = (await fgui.UIPackage.createObject(
          EmPackName.Battle,
          this._info.face == FaceType.LEFT_TEAM ? "Prog_HpGreen" : "Prog_HpRed",
        )) as fgui.GComponent;
        let img = this._stripComp.getChild("level1").asImage;
        this._stripView = new StripUIView(
          [img],
          totalBloodA ? totalBloodA : -1,
          bloodA ? bloodA : -1,
        );
      }
    }
    this._roleInfoUI.addChildWithTag(
      this._stripComp.displayObject,
      RoleInfoUIEnum.StripUIView,
    );

    Logger.battle(
      "[BaseRoleView]initBloodBar livingId",
      this._info.livingId,
      "totalBloodA",
      this._info.totalBloodA,
      "bloodA",
      this._info.bloodA,
      this._info,
    );
  }

  private addFateSkillEffect() {
    if (this._info instanceof HeroRoleInfo) {
      if (!(this._info as HeroRoleInfo).heroInfo.fateSkill) return;
      let fateArr = (this._info as HeroRoleInfo).heroInfo.fateSkill.split(",");
      let maxId: number = 0;
      let maxGrade: number = 0;
      fateArr.forEach((id) => {
        let grade: number = Number(id.substr(id.length - 2, 2));
        if (grade > maxGrade) {
          maxGrade = grade;
          maxId = Number(id);
        }
      });
      let skillTemp: t_s_skilltemplateData =
        TempleteManager.Instance.getSkillTemplateInfoById(maxId);
      if (!skillTemp) return;
      let upgradeTemp: t_s_upgradetemplateData =
        TempleteManager.Instance.getTemplateByTypeAndLevel(
          skillTemp.Grades,
          UpgradeType.UPGRADE_TYPE_FATE_GUARD,
        );
      if (!upgradeTemp) return;

      let path: string = PathManager.getFateBattlePath(
        upgradeTemp.ActiveObject,
      );
      ResMgr.Instance.loadRes(path, this.fateSkillComplete.bind(this), null);
    }
  }

  private fateSkillComplete(info: LoaderInfo, content: object) {
    if (this._disposed) {
      return;
    }
    if (this._fateSkillEffect) {
      ObjectUtils.disposeObject(this._fateSkillEffect);
      this._fateSkillEffect = null;
    }
    this._fateSkillEffect = content as Laya.Sprite;
    if (!this._fateSkillEffect) return;
    this.addChildAt(this._fateSkillEffect, 0);
  }

  private isShowServiceNameBattleType(battleType: number): boolean {
    switch (battleType) {
      case BattleType.BATTLE_MATCHING:
      case BattleType.CROSS_WAR_FIELD_BATTLE:
      case BattleType.WARLORDS:
      case BattleType.WARLORDS_OVER:
        return true;
      default:
        return false;
    }
  }

  //BaseRoleInfo
  public get info(): any {
    return this._info;
  }

  protected addEvent() {
    this._info.addEventListener(RoleEvent.ACTION, this.__action, this);
    this._info.addEventListener(RoleEvent.POINT_CHANGE, this.__point, this);
    this._info.addEventListener(RoleEvent.DIE, this.__die, this);
    this._info.addEventListener(RoleEvent.SCALE_X, this.__scaleX, this);
    this._info.addEventListener(RoleEvent.FACE_CHANGE, this.__faceChange, this);
    this._info.addEventListener(RoleEvent.BLOOD_CHANGE, this.__blood, this);
    this._info.addEventListener(
      RoleEvent.BLOOD_CHANGE_S,
      this.__bloodChangedSecurity,
      this,
    );
    this._info.addEventListener(
      RoleEvent.DIRECTION_CHANGE,
      this.__directionChange,
      this,
    );
    this._info.addEventListener(
      RoleEvent.EFFECT_PLAY,
      this.__effectcPlay,
      this,
    );
    this._info.addEventListener(RoleEvent.SHOW_BUFFER, this.__showBuffer, this);
    this._info.addEventListener(
      RoleEvent.RESET_BLOOD_SHIELD,
      this.resetStripShiled,
      this,
    );
    this._info.addEventListener(
      RoleEvent.REFRESH_BUFFER,
      this.__reFreshBuffer,
      this,
    );
  }

  private checkCanshowBuffIcon(): boolean {
    if (
      this.battleModel.battleType == BattleType.PET_PK ||
      this.battleModel.battleType == BattleType.REMOTE_PET_BATLE ||
      (!this.isRightBoss() && !this.isSelf)
    ) {
      return true;
    }
    return false;
  }

  private __faceChange(event: RoleEvent) {
    this.updataDirectionByFace();
  }

  private updataDirectionByFace() {
    let face: number = this.info.face;
    if (face == FaceType.RIGHT_TEAM) {
      this.info.direction = "left";
    } else {
      this.info.direction = "right";
    }
  }
  /**
   * 设置人物和特效容器的方向
   * @param value
   */
  private setRoleAllContainerScaleX(value: number) {
    if (this._backEffectContainer && !this._backEffectContainer.destroyed)
      this._backEffectContainer.scaleX = value;
    if (this._effectContainer && !this._effectContainer.destroyed)
      this._effectContainer.scaleX = value;
    if (this._movieContainer && !this._movieContainer.destroyed)
      this._movieContainer.scaleX = value;
  }

  //buffer特效
  private __showBuffer(evtData) {
    let bufferDamageData: BufferDamageData = evtData;
    let bufferTempInfo = TempleteManager.Instance.getSkillBuffTemplateByID(
      bufferDamageData.templateId,
    );
    if (!bufferTempInfo) {
      return;
    }
    let effectData = bufferTempInfo.getAddEffectArr();
    let effectName = effectData[0];
    let posFlag = effectData[1];
    if (effectName) {
      let fullUrl = PathManager.solveSkillResPath(effectName, true, true);
      ResMgr.Instance.loadRes(fullUrl, (res) => {
        let effect = BufferIconFactory.Instance.getBufferEffectII(effectName);
        let movie = effect.getDisplayObject();
        let mountPt: Laya.Point = this._info.getSpecialPos(posFlag);
        let basePt: Laya.Point = this._info.getSpecialPos(BaseRoleInfo.POS_LEG);
        let dstPtX = mountPt.x - basePt.x;
        let dstPtY = mountPt.y - basePt.y;
        if (posFlag == BaseRoleInfo.POS_HEAD) {
          dstPtY += BaseRoleView.BUFFER_OFFSET_Y;
        }
        movie.pos(dstPtX, dstPtY);
        movie.mountPt = posFlag;
        this._effectContainer.addEffect(effect);
      });
    }
    let lastEffectData: Array<string> = bufferTempInfo.getLastEffectArr();
    let lastEffectRes: string = lastEffectData[0];
    let lastEffect: BufferLastEffect;

    if (lastEffectRes) {
      let finded: boolean;
      for (let i: number = 0; i < this._bufferLastEffects.length; i++) {
        lastEffect = this._bufferLastEffects[i];
        if (lastEffect.bufferData.templateId == bufferDamageData.templateId) {
          finded = true;
          break;
        }
      }
      if (!finded) {
        lastEffect = new BufferLastEffect(
          this._info,
          bufferDamageData,
          this._effectContainer,
          lastEffectRes,
        );
        this._bufferLastEffects.push(lastEffect);
        lastEffect.show();
      }
    }
    Logger.battle(
      `[BaseRoleView]${this._info.roleName}(${this._info.livingId})添加特效buff:${bufferTempInfo.BufferNameLang}(${bufferTempInfo.Id}), buff资源:${effectName}, 持续性buff:${lastEffectRes}`,
    );
  }

  private __reFreshBuffer(datas: Array<BufferDamageData>) {
    if (!this._stripView) return;

    let bloodloseValue = 0;
    let bloodloseBuffer: BufferDamageData[] = [];
    for (let buffer of datas) {
      if (
        buffer.currentTurn > 0 &&
        buffer.Icon &&
        (buffer.AttackData == 1 || buffer.AttackData == 2)
      ) {
        //流血
        if (buffer.AttackType == 305) {
          bloodloseBuffer.push(buffer);
        }
      }
    }

    for (let loseBuffer of bloodloseBuffer) {
      for (let d of loseBuffer.damages) {
        //24 流程展示伤害, 6真实伤害。第一回合24, 生效后为6
        if (d.bloodType == 24 || d.bloodType == 6) {
          bloodloseValue +=
            d.damageValue *
            (loseBuffer.layerCount > 1 ? loseBuffer.layerCount : 1);
        }
      }
    }

    this._stripView.bloodLoseValue = bloodloseValue;
  }

  private isRightBoss(): boolean {
    if (!this.battleModel) return;

    let boss: any;
    let heroList = this.battleModel.armyInfoRight.getHeros;
    for (const key in heroList) {
      if (Object.prototype.hasOwnProperty.call(heroList, key)) {
        const hero: HeroRoleInfo = heroList[key];
        if (hero.type == RoleType.T_NPC_BOSS) {
          if (!boss) boss = hero;
          if (
            boss &&
            boss.heroInfo &&
            boss.heroInfo.grades < hero.heroInfo.grades
          )
            boss = hero;
        }
      }
    }
    return boss == this._info;
  }

  private removeLastEffect(bufTempId: number) {
    let effect: BufferLastEffect;
    for (let i: number = 0; i < this._bufferLastEffects.length; i++) {
      effect = this._bufferLastEffects[i];
      if (effect.bufferData.templateId == bufTempId) {
        effect.dispose();
        this._bufferLastEffects.splice(i, 1);
        break;
      }
    }
  }

  public addBufferActionEffect(bufferId: number) {
    if (this._disposed) {
      return;
    }
    let bufferTempInfo: t_s_skillbuffertemplateData =
      TempleteManager.Instance.getSkillBuffTemplateByID(bufferId);
    let effectData: Array<string>;
    if (bufferTempInfo) {
      effectData = bufferTempInfo.getActionEffectArr();
      let res: string = effectData[0];
      let posFlag: number = Number(effectData[1]);
      let effect: BattleEffect;
      if (res) {
        effect = BufferIconFactory.Instance.getBufferEffectII(res);
        let movie = effect.getDisplayObject();
        let mountPt: Laya.Point = this._info.getSpecialPos(posFlag);
        let basePt: Laya.Point = this._info.getSpecialPos(BaseRoleInfo.POS_LEG);
        let dstPtX = mountPt.x - basePt.x;
        let dstPtY = mountPt.y - basePt.y;
        movie.pos(dstPtX, dstPtY);

        this._effectContainer.addEffect(effect);
      }
    }
  }

  private __effectcPlay(param: any) {
    let effect: MovieClipEffect = new MovieClipEffect(param.effect);
    let effectDobj = effect.getDisplayObject(); //操作effect显示对象须调用此方法
    effectDobj.x = param.x || 0;
    effectDobj.y = param.y || 0;
    this._effectContainer.addEffect(effect, param.repeat || 1);
  }

  protected removeEvent() {
    if (this._info) {
      this._info.removeEventListener(RoleEvent.ACTION, this.__action, this);
      this._info.removeEventListener(
        RoleEvent.POINT_CHANGE,
        this.__point,
        this,
      );
      this._info.removeEventListener(RoleEvent.DIE, this.__die, this);
      this._info.removeEventListener(RoleEvent.SCALE_X, this.__scaleX, this);
      this._info.removeEventListener(
        RoleEvent.EFFECT_PLAY,
        this.__effectcPlay,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.SHOW_BUFFER,
        this.__showBuffer,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.FACE_CHANGE,
        this.__faceChange,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.BLOOD_CHANGE,
        this.__blood,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.BLOOD_CHANGE_S,
        this.__bloodChangedSecurity,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.DIRECTION_CHANGE,
        this.__directionChange,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.RESET_BLOOD_SHIELD,
        this.resetStripShiled,
        this,
      );
      this._info.removeEventListener(
        RoleEvent.REFRESH_BUFFER,
        this.__reFreshBuffer,
        this,
      );
    }
    NotificationManager.Instance.removeEventListener(
      BattleEvent.BATTLE_MUSIC_ON_OFF,
      this.onBattleMusicOnOff,
      this,
    );
  }
  private __action(data: any) {
    this.action.apply(this, data);
  }

  public initPos(pt: Laya.Point) {
    this.updateDepthInfo();
    if (this._info.face == FaceType.RIGHT_TEAM) this.info.direction = "left";
    else this.info.direction = "right";

    this.x = this._info.point.x;
    this.y = this._info.point.y + -this.pointZ;
  }

  private __point(evt: RoleEvent) {
    this.updateDepthInfo();

    if (this.x > this._info.point.x) {
      this.info.direction = "left";
    } else if (this.x == this._info.point.x) {
      if (this._info.face == FaceType.RIGHT_TEAM) this.info.direction = "left";
      else this.info.direction = "right";
    } else {
      this.info.direction = "right";
    }
    this.x = this._info.point.x;
    this.y = this._info.point.y + -this.pointZ;
  }

  private updataPosByInfo() {
    this.updateDepthInfo();
    this.x = this._info.point.x;
    this.y = this._info.point.y + -this.pointZ;
  }

  private updateDepthInfo() {
    if (this._disposed) {
      return;
    }
    this.pointZ = this._info.pointZ;
    this.pointY = this._info.point.y;
    if (this.isSelf) {
      this.pointY += 1; //使自己英雄在同一Y坐标的对象中排在最前面.
    }
    if (this._info.inheritType == InheritRoleType.Pet) {
      this.pointY += -2; //宠物在人物之上
    }
    if (this._arrangePriority) {
      this.pointY += 2;
    }
  }
  private _arrangePriority: boolean;
  public setArrangePriority(value: boolean) {
    this._arrangePriority = value;
    this.updateDepthInfo();
  }
  protected __die(evt: RoleEvent) {
    // Logger.battle(`[BaseRoleView]${this.info.roleName}(${this.info.livingId})死亡`, this._info.bloodA + "/" + this._info.totalBloodA)
    // this._debugInfoTxt.text = "角色死亡 livingId: " + this.info.livingId + "," + this._info.bloodA + "/" + this._info.totalBloodA
    let battleUI = BattleManager.Instance.battleUIView;
    if (!battleUI) return;
    if (battleUI.getRoleShowViewII()) {
      let bossBufferContainer =
        battleUI.getRoleShowViewII().bossBufferContainer;
      if (this.isRightBoss() && bossBufferContainer) {
        bossBufferContainer.dispose(this.info);
      }
    }
  }
  public clearEffectWhenDie() {
    let effect: BufferLastEffect;
    for (let i: number = 0; i < this._bufferLastEffects.length; i++) {
      effect = this._bufferLastEffects[i];
      effect.dispose();
    }
    this._bufferLastEffects = [];

    this.removeSkillAimFlag();
    this.removeSkillFlag();
  }

  private __scaleX(data) {
    if (data > 0) this.info.direction = "left";
    else this.info.direction = "right";
  }

  protected removeLoadingView() {
    this._roleLoaded = true;
  }

  private action(
    type: string,
    repeatType: string = null,
    nextType: string = ActionLabesType.STAND,
    waitFrame: number = 5,
    isStop: boolean = false,
  ) {
    this._info.actionMovie.actionAndPlay(
      type,
      repeatType,
      nextType,
      waitFrame,
      isStop,
    );
    if (type == ActionLabesType.STAND) {
      this.info.direction =
        this._info.face == FaceType.RIGHT_TEAM ? "left" : "right";
    }
  }

  public addEffect(
    effect: BattleEffect,
    repeat: number = 1,
    arrange: number = 1,
  ) {
    if (!SharedManager.Instance.allowAttactedEffect) {
      return;
    }
    if (this._disposed) {
      return;
    }
    if (arrange == 1) {
      this._effectContainer.addEffect(effect, repeat);
    } else {
      this._backEffectContainer.addEffect(effect, repeat);
    }
  }

  public get effectContainer(): EffectContainer {
    return this._effectContainer;
  }

  public get loadingState(): number {
    return this._loadingState;
  }

  public get movieContainer(): Laya.Sprite {
    return this._movieContainer;
  }

  public get backEffectContainer(): EffectContainer {
    return this._backEffectContainer;
  }
  public get roleInfoView(): RoleInfoUI {
    return this._roleInfoUI;
  }
  public get middleContainer(): Laya.Sprite {
    return this._middleContainer;
  }
  public setRoleViewVisible(value: boolean) {
    // 消融shader会改变目标父亲节点的方向 还原
    this._info.dispatchEvent(RoleEvent.DIRECTION_CHANGE, this._info.direction);
  }

  public setRoleInfoViewVisible(value: boolean) {
    if (!this._roleInfoUI) {
      return;
    }
    this._roleInfoViewVisible = value;
    if (!this._info.isLiving) {
      if (
        this._info.inheritType == InheritRoleType.Hero &&
        (this._info as HeroRoleInfo).type != 3
      ) {
        this.setBloodStripVisible(false, true);
      } else {
        this._roleInfoUI.visible = false;
        this._roleInfoUI.active = false;
      }
    } else {
      this._roleInfoUI.visible = this._roleInfoViewVisible;
      this._roleInfoUI.active = this._roleInfoViewVisible;
      if (this._bufferContainer) {
        this._bufferContainer.visible = this._roleInfoViewVisible;
        this._bufferContainer.active = this._roleInfoViewVisible;
      }
      if (this._stripView && this._stripComp) {
        this._stripComp.visible = this._roleInfoViewVisible;
        this._stripComp.displayObject.active = this._roleInfoViewVisible;
      }
      // if(this._roleInfoUI.strip_pos){
      //     this._roleInfoUI.strip_pos.visible = this._roleInfoViewVisible;
      // }
      // if(this._roleInfoUI.bgMc){
      //     this._roleInfoUI.bgMc.visible = this._roleInfoViewVisible;
      // }
    }
  }
  public setBloodStripVisible(value: boolean, showName: boolean = false) {
    if (!this._roleInfoUI) {
      return;
    }
    if (this._info && !this._info.canTakeDamage) {
      this._roleInfoUI.visible = false;
      this._roleInfoUI.active = false;
      return;
    }
    if (showName) {
      this._roleInfoUI.visible = true;
      this._roleInfoUI.active = true;
      if (this._bufferContainer) {
        this._bufferContainer.visible = false;
        this._bufferContainer.active = false;
      }
      if (this._stripView && this._stripComp) {
        this._stripComp.visible = false;
        this._stripComp.displayObject.active = false;
      }
      // if (this._roleInfoUI.strip_pos) {
      //     this._roleInfoUI.strip_pos.visible = false;
      // }
      // if (this._roleInfoUI.bgMc) {
      //     this._roleInfoUI.bgMc.visible = false;
      // }
      return;
    }
    this._roleInfoUI.visible = value;
    this._roleInfoUI.active = value;
  }

  protected __blood(data: any) {
    if (!BattleModel.battleUILoaded) return;
    if (!(this._info && this._info.map)) {
      Logger.battle("[BaseRoleView]_info or _info.map 不存在");
      return;
    }

    // Logger.battle("[BaseRoleView]血量", this.info.livingId, data.displayBlood, this._info.bloodA + "/" + this._info.totalBloodA, data)
    // this._debugInfoTxt.text = this.info.livingId + "," + data.displayBlood + "," + this._info.bloodA + "/" + this._info.totalBloodA

    let blood: number = data.displayBlood;
    let critical: boolean = data.havoc as boolean;
    let selfCause: boolean = data.selfCause;
    let bloodType: number = data.bloodType;
    let parry: boolean = data.isParry;
    let mc: DamageNumView = null;
    let pt = this.localToGlobal(new Laya.Point(0, -130));
    if (critical) {
      if (this.isSelf) {
        BattleManager.Instance.battleScene.playRedScreen();
      }
    }

    if (blood == 0 && bloodType != BloodType.BLOOD_TYPE_ARMY) return;
    if (bloodType == BloodType.BLOOD_TYPE_SELF) {
      mc = new DamageNumView(
        Math.abs(blood),
        bloodType,
        critical,
        blood > 0,
        selfCause,
        parry,
      );
      let boss: HeroRoleInfo = this.battleModel.getWorldBoss();
      if (boss && this.info == boss) {
        BloodHelper.worldBossBloodCached += data.blood;
      }
    } else if (
      bloodType == BloodType.BLOOD_TYPE_THIRD ||
      bloodType == BloodType.BLOOD_TYPE_ARMY
    ) {
      mc = new DamageNumView(
        blood,
        bloodType,
        critical,
        false,
        selfCause,
        parry,
      );
    } else if (bloodType == BloodType.REVIVE) {
      this.updateStrip();
      return;
    } else if (bloodType == BloodType.BLOOD_MAXHP) {
      this.updateStrip();
      return;
    } else {
      return;
    }

    if (mc) {
      mc.x = pt.x;
      mc.y = pt.y;
      let layer = LayerMgr.Instance.getLayer(EmLayer.GAME_BASE_LAYER);
      layer.pushView(mc, UIZOrder.TopTIP);
      mc.addToStage();
    }

    if (selfCause && !data.isDefault) {
      if (critical) {
        this._info.map.shakeScreen(4, 24);
      } else {
        this._info.map.shakeScreen(4, 12);
      }
    }

    this.updateStrip();
  }

  private __bloodChangedSecurity() {
    this.updateStrip();
  }

  protected updateStrip() {
    if (this._stripView) {
      this._stripView.maxValue = this._info.totalBloodA;
      this._stripView.currentValue = this._info.bloodA;
      this._stripView.bloodShield = this._info.bloodB;
      this._info.dispatchEvent(
        RoleEvent.HP,
        this._info.bloodA,
        this._info.totalBloodA,
      );
    }
  }

  private resetStripShiled() {
    if (!this._stripView) return;
    this._info.bloodB = 0;
    this._stripView.resetBloodShield();
  }

  protected __directionChange(data: any) {
    if (data == "left") {
      this.setRoleAllContainerScaleX(-1);
    } else {
      this.setRoleAllContainerScaleX(1);
    }
  }
  /**
   * 是否锁定血条的位置（会否跟着人物一起动）;
   * @return
   *
   */
  public get isLockInfoView(): boolean {
    return this._isLockInfoView;
  }

  public set isLockInfoView(value: boolean) {
    this._isLockInfoView = value;
  }

  public get body(): Laya.Sprite {
    return this._body;
  }
  //override
  public set x(value: number) {
    super.x = value;
    if (this._isLockInfoView && this._roleInfoUI)
      this._roleInfoUI.x -= value - this._x;
    this._x = value;
  }
  //override
  public get x(): number {
    return super.x;
  }

  //override
  public set y(value: number) {
    super.y = value;
    if (this._isLockInfoView && this._roleInfoUI)
      this._roleInfoUI.y -= value - this._y;
    this._y = value;
  }
  //override
  public get y(): number {
    return super.y;
  }

  private heroCollectionEffect: Laya.Animation;
  private _collectionEffect: CollectionEffect;

  /**
   * 蓄气
   */
  public addCollectionEffect(showEffect: boolean = true) {
    if (this._disposed) {
      return;
    }
    if (this._collectionEffect) {
      this._collectionEffect.dispose();
      this._collectionEffect = null;
      this._info.removeActionByType(ReadyAction.READY);
    }
    if (showEffect && BattleModel.battleDynamicLoaded) {
      this._collectionEffect = new CollectionEffect(
        this.backEffectContainer,
        this._effectContainer,
        this._info.heroInfo.templateInfo.Job,
      );
    }
    new ReadyAction(this._info);
  }

  public removeCollectionEffect() {
    if (this._disposed) {
      return;
    }
    if (this._collectionEffect) {
      this._collectionEffect.dispose();
      this._collectionEffect = null;
    }
    this._info.removeActionByType(ReadyAction.READY);
  }

  public updateQteCollectionEffect() {
    if (this._disposed) {
      return;
    }
    if (this._collectionEffect) {
      this._collectionEffect.updateToQteState();
    }
  }

  //颜色变换
  public setColorTransform(type: number = BattleModel.NORMAL) {
    if (this._disposed) {
      return;
    }
    switch (type) {
      case BattleModel.NORMAL:
        this._movieContainer.filters = [UIFilter.normalFilter];
        break;
      case BattleModel.DEFENSE:
        this._movieContainer.filters = [UIFilter.BattleModel_ATTACK_TRANSFORM];
        break;
      case BattleModel.ATTACK:
        this._movieContainer.filters = [UIFilter.BattleModel_DEFENSE_TRANSFORM];
        break;
      case BattleModel.DANNY:
        this._movieContainer.filters = [UIFilter.battleDannyFilter];
        break;
    }
  }

  private _skillUsedFlag: Laya.Animation;
  private _skillItemUseCell: SkillUseItemCell;
  protected _readySkillTemp: t_s_skilltemplateData;

  /**
   * 添加使用技能图标
   * @param data
   */
  public addSkillFlag(data: t_s_skilltemplateData) {
    this._readySkillTemp = data;
    if (data && data.Icons) {
      this.addSkillFlagByIconPath(IconFactory.getTecIconByIcon(data.Icons));
    }
  }

  /**
   * 站立在出生点技能技能图标要置于最上层, 防止队友挡住导致看不清释放的技能, 1.2s后技能图标放玩家身上
   * 移动过程中点技能技能图标放玩家身上
   * @param iconPath
   * @returns
   */
  public addSkillFlagByIconPath(iconPath: string) {
    if (this._disposed || !BattleModel.battleUILoaded) {
      return;
    }
    ObjectUtils.disposeObject(this._skillItemUseCell);
    this._skillItemUseCell = null;
    this._skillItemUseCell = new SkillUseItemCell();
    this._skillItemUseCell.hideBorder();
    this._skillItemUseCell.data = iconPath;
    this._skillItemUseCell.flash();

    let wnd = FrameCtrlManager.Instance.getCtrl(EmWindow.Battle)
      .view as BattleWnd;
    wnd.addChildAt(this._skillItemUseCell, BattleModel.ZIndex_Bottom);

    // 在出生点位置附近
    let inBornPos =
      Math.abs(this.info.point.x - this.x) < 50 &&
      Math.abs(this.info.point.y - this.y) < 50;

    if (this.info.moving || !inBornPos) {
      this.addSkillItemUseCellToEffectCon();
    } else {
      this.addSkillItemUseCellToBattleWnd();
      Laya.timer.once(1200, this, () => {
        if (this.destroyed) return;
        this.addSkillItemUseCellToEffectCon();
      });
    }
  }

  private addSkillItemUseCellToEffectCon() {
    if (!this._skillItemUseCell || this._skillItemUseCell.destroyed) return;
    this._skillItemUseCell.setScaleX(1);
    this._skillItemUseCell.x = BaseRoleView.USE_SKILLITEM_POS.x;
    this._skillItemUseCell.y = BaseRoleView.USE_SKILLITEM_POS.y;
    this._effectContainer.addChild(this._skillItemUseCell);
  }

  private addSkillItemUseCellToBattleWnd() {
    let fixDir = this.info.direction == "left" ? -1 : 1;
    let globalPos = this._effectContainer.localToGlobal(
      new Laya.Point(0, 0),
      false,
    );
    this._skillItemUseCell.setScaleX(fixDir);
    this._skillItemUseCell.x =
      globalPos.x + BaseRoleView.USE_SKILLITEM_POS.x * fixDir;
    this._skillItemUseCell.y = globalPos.y + BaseRoleView.USE_SKILLITEM_POS.y;
  }

  // 准备移动过程中点了技能, 开始移动后需要把技能父节点改变为_effectContainer
  public changeSkillItemUseCellParentToEffectCon() {
    let wnd = FrameCtrlManager.Instance.getCtrl(EmWindow.Battle)
      .view as BattleWnd;
    if (this._skillItemUseCell && wnd && this._skillItemUseCell.parent == wnd) {
      this.addSkillItemUseCellToEffectCon();
    }
  }

  public getHeroBounds(): Laya.Rectangle {
    return this.movieContainer.getGraphicBounds(true);
  }

  public removeSkillFlag() {
    this._readySkillTemp = null;
    if (this._disposed) {
      return;
    }
    if (this._qteSuccessAnimation) {
      this._qteSuccessAnimation.dispose();
      this._qteSuccessAnimation = null;
    }

    if (this._skillItemUseCell && this._skillItemUseCell.parent) {
      this._skillItemUseCell.dispose();
      this._skillItemUseCell = null;
    }
  }

  public cancelReadyState(): boolean {
    this.removeCollectionEffect();
    this.removeSkillFlag();
    if (this.info.actionMovie.currentLabels == ActionLabesType.READY) {
      this.info.action(ActionLabesType.STAND);
      return true;
    }
    return false;
  }

  private _qteSuccessAnimation: any;
  public showQteSuccessEffect(startPt: Laya.Point, endPt: Laya.Point) {
    if (this._disposed) {
      return;
    }
    if (this._qteSuccessAnimation) {
      this._qteSuccessAnimation.dispose();
      this._qteSuccessAnimation = null;
    }
    let cont: Laya.Sprite = this._effectContainer; //BattleManager.Instance.battleUIView;
    // this._qteSuccessAnimation = new QteSuccessAnimation(cont, startPt, endPt);
    // this._qteSuccessAnimation.play();
  }

  private _skillAimMc: fgui.GMovieClip;
  /**
   * 被技能锁定时的效果
   *
   */
  public addSkillAimFlag() {
    if (this._disposed || !BattleModel.battleDynamicLoaded) {
      return;
    }
    if (this._skillAimMc) {
      this._skillAimMc.displayObject.removeSelf();
      this._skillAimMc.frame = 0;
      this._skillAimMc.playing = false;
      this._skillAimMc.dispose();
      this._skillAimMc = null;
    }
    let aimRes: string;
    if (this._info.face == 1) {
      aimRes = "AssetBattleSkillUsedSelected1";
    } else {
      aimRes = "AssetBattleSkillUsedSelected2";
    }
    this._skillAimMc = FUIHelper.createFUIInstance(
      EmWindow.BattleDynamic,
      aimRes,
    ) as fgui.GMovieClip;
    if (this._skillAimMc) {
      this._skillAimMc.playing = true;
      this._skillAimMc.frame = 0;
      this._backEffectContainer.addChild(this._skillAimMc.displayObject);
      this._skillAimMc.displayObject.x = -110;
      this._skillAimMc.displayObject.y = -40;
    }
  }

  public updateShadowPos() {
    //子类覆盖了此方法
  }

  public removeBuffer(bufTempId: number, buffId?: number) {
    if (this._disposed) {
      return;
    }
    this.info.removeBufferById(bufTempId, buffId);
    this.removeLastEffect(bufTempId);
  }
  /**
   *移除选中效果
   */
  public removeSkillAimFlag() {
    if (!this._skillAimMc || this._skillAimMc.isDisposed) {
      return;
    }
    if (this._skillAimMc) {
      this._skillAimMc.displayObject.removeSelf();
    }
    this._skillAimMc.dispose();
    this._skillAimMc = null;
  }

  // TODO 暂时根据宽度来放大影子  图片大小为最小
  protected initShadeScale(w: number = 0) {
    this._shadowW = w;
    if (w != 0 && this._shadow) {
      let tempScale = Math.max(1, w / BaseRoleView.ImgShadowReferenceW);
      this._shadow.scale(tempScale, tempScale);
    }
  }

  public set scaleX(sx: number) {
    super.scaleX = sx;
  }
  public get scaleX() {
    return super.scaleX;
  }

  public set scaleY(sy: number) {
    super.scaleY = sy;
  }
  public get scaleY() {
    return super.scaleY;
  }

  public get battleModel() {
    return BattleManager.Instance.battleModel;
  }

  public get isSelf() {
    return (
      this._info && this.battleModel && this._info == this.battleModel.selfHero
    );
  }

  public get isSelfConsortiaAndSide() {
    if (
      this._info &&
      this._info.inheritType == InheritRoleType.Hero &&
      this.battleModel
    ) {
      let selfHero = this.battleModel.selfHero;
      if (
        this._info.consortiaId &&
        this._info.consortiaId == selfHero.consortiaId
      ) {
        if (this._info.serverName == selfHero.serverName) {
          return true;
        } else {
          Logger.battle(
            "[BaseRoleView]同公会不同服务器",
            this._info.serverName,
            selfHero.serverName,
          );
          return false;
        }
      }
    }
    return false;
  }

  public dispose() {
    this.removeEvent();
    if (this._info && this._info.actionMovie) {
      this._info.actionMovie.removeWeakBreatheAction();
    }
    this._rolePart && ObjectUtils.disposeObject(this._rolePart);
    this._rolePart = null;
    this._fateSkillEffect && ObjectUtils.disposeObject(this._fateSkillEffect);
    this._fateSkillEffect = null;
    this._roleInfoUI && ObjectUtils.disposeObject(this._roleInfoUI);
    this._roleInfoUI = null;
    this._stripView && ObjectUtils.disposeObject(this._stripView);
    this._stripView = null;
    this._stripComp && ObjectUtils.disposeObject(this._stripComp);
    this._stripComp = null;
    this._bufferContainer && ObjectUtils.disposeObject(this._bufferContainer);
    this._bufferContainer = null;
    this._effectContainer = null;
    this._disposed = true;
    super.destroy(true);
  }
}
