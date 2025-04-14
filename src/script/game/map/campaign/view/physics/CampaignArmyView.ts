import AudioManager from "../../../../../core/audio/AudioManager";
import LangManager from "../../../../../core/lang/LangManager";
import Logger from "../../../../../core/logger/Logger";
import { UIFilter } from "../../../../../core/ui/UIFilter";
import ObjectUtils from "../../../../../core/utils/ObjectUtils";
import StringHelper from "../../../../../core/utils/StringHelper";
import { AvatarActionType } from "../../../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../../avatar/data/AvatarStaticData";
import { Avatar } from "../../../../avatar/view/Avatar";
import { SimpleAvatarView } from "../../../../avatar/view/SimpleAvatarView";
import { eFilterFrameText } from "../../../../component/FilterFrameText";
import { MovieClip } from "../../../../component/MovieClip";
import { t_s_mounttemplateData } from "../../../../config/t_s_mounttemplate";
import { t_s_skilltemplateData } from "../../../../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../../../../config/t_s_upgradetemplate";
import { ArmyState } from "../../../../constant/ArmyState";
import { AvatarResourceType } from "../../../../constant/AvatarDefine";
import {
  ArmyEvent,
  CampaignMapEvent,
  JoyStickEvent,
  NotificationEvent,
  ObjectsEvent,
  PetEvent,
  PhysicsEvent,
} from "../../../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../../../constant/event/PlayerEvent";
import { GlobalConfig } from "../../../../constant/GlobalConfig";
import { JobType } from "../../../../constant/JobType";
import LoaderPriority from "../../../../constant/LoaderPriority";
import { SoundIds } from "../../../../constant/SoundIds";
import { UpgradeType } from "../../../../constant/UpgradeType";
import { ArmyPetInfo } from "../../../../datas/ArmyPetInfo";
import { PlayerInfo } from "../../../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../../../manager/ArmyManager";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { ConfigManager } from "../../../../manager/ConfigManager";
import FreedomTeamManager from "../../../../manager/FreedomTeamManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PathManager } from "../../../../manager/PathManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { RoomManager } from "../../../../manager/RoomManager";
import { SharedManager } from "../../../../manager/SharedManager";
import { TempleteManager } from "../../../../manager/TempleteManager";
import { ResRefCountManager } from "../../../../managerRes/ResRefCountManager";
import ChatData from "../../../../module/chat/data/ChatData";
import { BattleMovieMediator } from "../../../../mvc/mediator/BattleMovieMediator";
import { PlayerWalkMediator } from "../../../../mvc/mediator/PlayerWalkMediator";
import { TranseferWaitMediator } from "../../../../mvc/mediator/TranseferWaitMediator";
import { TransportMediator } from "../../../../mvc/mediator/TransportMediator";
import { CampaignMapModel } from "../../../../mvc/model/CampaignMapModel";
import { CampaignMapScene } from "../../../../scene/CampaignMapScene";
import { ArmySpeedUtils } from "../../../../utils/ArmySpeedUtils";
import { SearchPathHelper } from "../../../../utils/SearchPathHelper";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { BaseArmyAiInfo } from "../../../ai/BaseArmyAiInfo";
import { ResourceLoaderInfo } from "../../../avatar/data/ResourceLoaderInfo";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { PetAvatarView } from "../../../avatar/view/PetAvatarView";
import Tiles from "../../../space/constant/Tiles";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CampaignArmyState } from "../../data/CampaignArmyState";
import ResMgr from "../../../../../core/res/ResMgr";
import { AnimationManager } from "../../../../manager/AnimationManager";
import { ChatManager } from "../../../../manager/ChatManager";
import { BaseArmy } from "../../../space/data/BaseArmy";
import { AvatarInfoTag } from "../../../../constant/Const";
import { eAvatarBaseViewType } from "../../../view/hero/AvatarBaseView";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";

/**
 * 副本人物显示对象
 *
 */
export class CampaignArmyView extends HeroAvatarView {
  public avatarBaseViewType: eAvatarBaseViewType =
    eAvatarBaseViewType.CampaignArmy;
  public static NAME: string = "map.campaign.view.hero.CampaignArmyView";

  public static DEFAULT_SPEED: number = 7;
  public static HALF_SPEED: number = 4;

  protected _data: CampaignArmy;

  private _controller: CampaignMapScene;
  private _mediatorKey: string;
  private _bloodMc: MovieClip;
  private _hangupView: SimpleAvatarView;
  private _attackView: SimpleAvatarView;
  private _buffEffect: SimpleAvatarView;
  protected _appellId: number = 0;
  public layoutCB: Function = null;
  /**
   * 主角与其他玩家距离权重
   */
  public distanceWeight: number = 0;
  protected isMonopoly: boolean = false;

  constructor() {
    super();
    this.autoSize = true;
    this.mouseEnabled = true;
    this.hitTestPrior = true;
    this._controller = CampaignManager.Instance.controller;
    this.initView();
  }

  protected initView() {}

  protected mapId: number = 0;
  public get isSelf(): boolean {
    if (!this._data) return false;
    if (this.mapModel && this.mapModel.isCross) {
      return (
        this._data.userId == this.thane.userId &&
        this._data.baseHero.serviceName == this.playerInfo.serviceName
      );
    }
    return this._data.userId == this.thane.userId;
  }

  public get isSelfConsortia(): boolean {
    if (this._data && this._data.baseHero) {
      if (StringHelper.isNullOrEmpty(this._data.baseHero.consortiaName))
        return false;
      if (StringHelper.isNullOrEmpty(this.playerInfo.consortiaName))
        return false;
      if (this.mapModel && this.mapModel.isCross) {
        let consortiaID: number = this.playerInfo.consortiaID;
        return (
          this._data.baseHero.consortiaName == this.playerInfo.consortiaName &&
          this._data.baseHero.consortiaID == consortiaID
        );
      } else {
        return (
          this._data.baseHero.consortiaName == this.playerInfo.consortiaName
        );
      }
    }
    return false;
  }

  public get isSelfTeam(): boolean {
    if (this._data && this._data.baseHero) {
      if (FreedomTeamManager.Instance.inMyTeam(this._data.userId)) {
        return true;
      }
    }
    return false;
  }

  private showFateSkillEffect() {
    if (this._fateSkillEffect) this._fateSkillEffect.destroy();
    this._fateSkillEffect = null;
    if (!this._data.baseHero.fateSkill) return;
    let args: string[] = this._data.baseHero.fateSkill.split(",");
    let maxId: number = 0;
    let maxGrade: number = 0;
    for (const key in args) {
      if (Object.prototype.hasOwnProperty.call(args, key)) {
        let id: string = args[key];
        let grade: number = Number(id.substr(id.length - 2, 2));
        if (grade > maxGrade) {
          maxGrade = grade;
          maxId = Number(id);
        }
      }
    }
    let skillTemp: t_s_skilltemplateData =
      TempleteManager.Instance.getSkillTemplateInfoById(maxId);
    if (!skillTemp || skillTemp.Grades == 0) return;
    let upgradeTemp: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        skillTemp.Grades,
        UpgradeType.UPGRADE_TYPE_FATE_GUARD,
      );
    if (StringHelper.isNullOrEmpty(upgradeTemp.TemplateNameLang)) return;

    let url: string = PathManager.getFateWalkPath(
      upgradeTemp.ActiveObject,
      ".json",
    );
    ResMgr.Instance.loadRes(
      url,
      (res) => {
        if (!res || !res.meta) return;
        let _preUrl = res.meta.prefix;
        let offset = res.offset;
        if (!offset) {
          offset = { x: 0, y: 0 };
        }
        let _cacheName = _preUrl;
        let aniName = "";
        AnimationManager.Instance.createAnimation(
          _preUrl,
          aniName,
          undefined,
          "",
          AnimationManager.MapPhysicsFormatLen,
        );
        this._fateSkillEffect = new MovieClip(_cacheName);
        this._fateSkillEffect.gotoAndPlay(0, true, _cacheName);
        this.addChildAt(this._fateSkillEffect, 0);
        this._fateSkillEffect.pos(-parseInt(offset.x), -parseInt(offset.y));
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  public set data(value: CampaignArmy) {
    if (value) {
      this.mapId = value.mapId;
    }
    this.removeEvent();
    this._data = value;

    this.showFateSkillEffect();
    this.showAvatar(value);
    this.showPet(value.petInfo);
    this.__isDieHandler(null);
    this.__updateCampaignArmyHandler(null);
    this.__hangupStateHandler(null);
    this.addEvent();
    let arr: any[];
    if (WorldBossHelper.checkGvg(this.mapId)) {
      arr = [TranseferWaitMediator]; //工会战中不会有战斗获取动画
    } else {
      arr = [TranseferWaitMediator, BattleMovieMediator];
    }
    if (WorldBossHelper.checkConsortiaSecretLand(this.mapId)) {
      this.mouseThrough = true;
      this.mouseEnabled = false;
    } else {
      this.mouseThrough = false;
      if (this.isSelf) {
        this.mouseEnabled = false;
      } else {
        this.mouseEnabled = true;
      }
    }
    if (this.isSelf) {
      arr.push(PlayerWalkMediator);
    }
    if (
      WorldBossHelper.checkPvp(this._data.mapId) ||
      WorldBossHelper.checkMineral(this._data.mapId)
    ) {
      arr.push(TransportMediator);
    }
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      CampaignArmyView.NAME,
    );
  }

  public get data(): CampaignArmy {
    return this._data;
  }

  protected removeEvent() {
    super.removeEvent();
    if (this.thane) {
      this.thane.removeEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__heroPropertyHandler,
        this,
      );
      this.thane.removeEventListener(
        PlayerEvent.PLAYER_INFO_UPDATE,
        this.__updateInfoHandler,
        this,
      );
      this.thane.removeEventListener(
        PlayerEvent.APPELL_CHANGE,
        this.__updateInfoHandler,
        this,
      );
    }
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.QUIT_CAMPAIGN,
      this.__lockKeyHandler,
      this,
    );
    PlayerManager.Instance.removeEventListener(
      PetEvent.PET_LEVEL_UP,
      this.__petLevelUpHandler,
      this,
    );
    if (this._data) {
      this._data.baseHero.removeEventListener(
        PlayerEvent.PLAYER_INFO_UPDATE,
        this.__updateInfoHandler,
        this,
      );
      this._data.baseHero.removeEventListener(
        PlayerEvent.APPELL_CHANGE,
        this.__updateInfoHandler,
        this,
      );
      this._data.baseHero.removeEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__avatarChangeHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.UPDATE_CAMPAIGN_ARMY,
        this.__updateCampaignArmyHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.ONLINE_STATE,
        this.__onlineStateHandler,
        this,
      );
      this._data.baseHero.removeEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__heroPropertyHandler,
        this,
      );
      this._data.removeEventListener(
        PhysicsEvent.CHAT_DATA,
        this.__chatHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.IS_DIE,
        this.__isDieHandler,
        this,
      );
      this._data.removeEventListener(
        PhysicsEvent.UPDATE_CUR_HP,
        this.__updateCurHpHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.HANGUP_STATE,
        this.__hangupStateHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.HANGUP_ADD,
        this.__hangupAddHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.BUFFER_TEMP_ID,
        this.__updateBufferHandler,
        this,
      );
      this._data.removeEventListener(
        CampaignMapEvent.UPDATE_TEAM_ID,
        this.__updateTeamHandler,
        this,
      );
      this._data.petInfo.removeEventListener(
        ArmyEvent.PETINFO_CHANGED,
        this.__updatePetAvatarHandler,
        this,
      );
      this._data.removeEventListener(
        ArmyEvent.UPDATE_STATE,
        this.__refresArmyStateHandler,
        this,
      );
    }

    NotificationManager.Instance.off(
      JoyStickEvent.JoystickUp,
      this.onJoystickUp,
      this,
    );
    NotificationManager.Instance.off(
      JoyStickEvent.JoystickMoving,
      this.onJoystickMoving,
      this,
    );
  }

  protected addEvent() {
    super.addEvent();
    this._data.addEventListener(
      CampaignMapEvent.UPDATE_CAMPAIGN_ARMY,
      this.__updateCampaignArmyHandler,
      this,
    );
    this._data.addEventListener(
      CampaignMapEvent.ONLINE_STATE,
      this.__onlineStateHandler,
      this,
    );
    this._data.addEventListener(
      PhysicsEvent.CHAT_DATA,
      this.__chatHandler,
      this,
    );
    this._data.addEventListener(
      ArmyEvent.UPDATE_STATE,
      this.__refresArmyStateHandler,
      this,
    );
    if (this.isSelf) {
      this.thane.addEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__heroPropertyHandler,
        this,
      );
      this.thane.addEventListener(
        PlayerEvent.PLAYER_INFO_UPDATE,
        this.__updateInfoHandler,
        this,
      );
      this.thane.addEventListener(
        PlayerEvent.APPELL_CHANGE,
        this.__updateInfoHandler,
        this,
      );
      NotificationManager.Instance.addEventListener(
        NotificationEvent.QUIT_CAMPAIGN,
        this.__lockKeyHandler,
        this,
      );
      PlayerManager.Instance.addEventListener(
        PetEvent.PET_LEVEL_UP,
        this.__petLevelUpHandler,
        this,
      );
      NotificationManager.Instance.on(
        JoyStickEvent.JoystickUp,
        this.onJoystickUp,
        this,
      );
      NotificationManager.Instance.on(
        JoyStickEvent.JoystickMoving,
        this.onJoystickMoving,
        this,
      );
    } else {
      this._data.baseHero.addEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__avatarChangeHandler,
        this,
      );
      this._data.baseHero.addEventListener(
        PlayerEvent.PLAYER_INFO_UPDATE,
        this.__updateInfoHandler,
        this,
      );
      this._data.baseHero.addEventListener(
        PlayerEvent.APPELL_CHANGE,
        this.__updateInfoHandler,
        this,
      );
    }

    this._data.addEventListener(
      PhysicsEvent.UPDATE_CUR_HP,
      this.__updateCurHpHandler,
      this,
    );
    this._data.addEventListener(
      CampaignMapEvent.IS_DIE,
      this.__isDieHandler,
      this,
    );
    this._data.addEventListener(
      CampaignMapEvent.HANGUP_STATE,
      this.__hangupStateHandler,
      this,
    );
    this._data.addEventListener(
      CampaignMapEvent.HANGUP_ADD,
      this.__hangupAddHandler,
      this,
    );
    this._data.addEventListener(
      CampaignMapEvent.BUFFER_TEMP_ID,
      this.__updateBufferHandler,
      this,
    );
    this._data.addEventListener(
      CampaignMapEvent.UPDATE_TEAM_ID,
      this.__updateTeamHandler,
      this,
    );
    this._data.petInfo.addEventListener(
      ArmyEvent.PETINFO_CHANGED,
      this.__updatePetAvatarHandler,
      this,
    );
  }

  protected onJoystickUp() {
    this.isJoyStickWalk = false;
    this.walkOver();
    this.standImp();
  }

  // 遥感控制移动
  protected onJoystickMoving(rad: number, angle: number) {
    this._angle = rad;
    let movePoint = new Laya.Point();
    movePoint.x = this.x + this._info.speed * Math.cos(rad);
    movePoint.y = this.y - this._info.speed * Math.sin(rad);

    let tempAngle = angle < 0 ? (angle += 360) : angle;
    tempAngle = 360 - tempAngle; // 转为顺时针
    this.updateDirection(tempAngle);

    //判断改点是否可行走
    let walkable = SearchPathHelper.checkWalkable(movePoint);
    if (!walkable) {
      this.isJoyStickWalk = false;
      return;
    }

    this.info.pathInfo = [];

    this.isJoyStickWalk = true;
    this._isStand = false;
    this._avatar.state = Avatar.WALK;
    this.setAvaterStepFrame();
    this._avatar.run();

    this.playMovie();
    this.x = movePoint.x;
    this.y = movePoint.y;
  }

  private __updatePetAvatarHandler(data: any) {
    this.showPet(<ArmyPetInfo>data);
  }

  protected setName(name: string = "", nameColor?: number, grade?: number) {
    nameColor = this.getNameColor();
    name = this._data.baseHero.nickName;
    grade = this._data.baseHero.grades;

    super.setName(name, nameColor, grade);
    this.setConsortiaName(this.consortiaName, nameColor);
    this.setHonerName();
    this.showVipIcon(this.isVip);
    this.showQQDWKIcon(this.isDwk);
    this.layoutTxtViewWithNamePosY();
  }

  protected createNickName() {
    //Logger.info("[AvatarBaseView]CampaignArmyView-createNickName", this.objName, this._uuid)
    AvatarInfoUILayerHandler.handle_CON_CREATE(
      this._uuid,
      AvatarInfoTag.NickName,
      { bold: this.isSelf },
    );
  }

  protected getNameColor(): number {
    let nameColor: number = 1;
    if (this.isSelf) {
      nameColor = 3;
    } else if (this.isSelfConsortia) {
      nameColor = 2;
    }
    return nameColor;
  }

  protected setConsortiaName(
    name: string,
    nameColor: number,
    noSymbol: boolean = false,
  ) {
    //Logger.info("[AvatarBaseView]setConsortiaName", this.objName, this.uuid, name)
    if (StringHelper.isNullOrEmpty(name)) {
      AvatarInfoUILayerHandler.handle_CON_VISIBLE(
        this._uuid,
        AvatarInfoTag.ConsortiaName,
        false,
      );
      return;
    }
    AvatarInfoUILayerHandler.handle_CONSORTIA_TEXT(
      this._uuid,
      noSymbol
        ? name
        : LangManager.Instance.GetTranslation(
            "map.avatar.view.consortiaName",
            name,
          ),
    );
    AvatarInfoUILayerHandler.handle_CONSORTIA_FRAME(
      this._uuid,
      nameColor,
      eFilterFrameText.AvatarName,
    );
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.ConsortiaName,
      this._isPlaying,
    );
  }

  private get appellId(): number {
    if (!this.isSelf && this._data) {
      return this._data.baseHero.appellId;
    }
    return this.thane.appellId;
  }

  private setHonerName() {
    if (this._appellId == this.appellId) {
      return;
    }
    this._appellId = this.appellId;
    AvatarInfoUILayerHandler.handle_CON_DISPOSE(
      this._uuid,
      AvatarInfoTag.Appell,
    );
    let appellInfo = this._data.baseHero.appellInfo;
    if (this.isHoner && appellInfo && this._isPlaying) {
      let obj = {
        imgWidth: appellInfo.ImgWidth,
        imgHeight: appellInfo.ImgHeight,
        appellId: this.appellId,
        imgCount: appellInfo.ImgCount,
      };
      AvatarInfoUILayerHandler.handle_CON_CREATE(
        this._uuid,
        AvatarInfoTag.Appell,
        obj,
      );
      this.showHoner();
      AvatarInfoUILayerHandler.handle_CON_POSX(this._uuid, this.x);
      AvatarInfoUILayerHandler.handle_CON_POSY(
        this._uuid,
        this.y + this._showNamePosY,
      );
    }
  }

  private get honerName(): string {
    let info: ThaneInfo;
    if (this.isSelf) {
      info = this.thane;
    } else {
      info = this._data.baseHero;
    }
    if (info.appellInfo) {
      return info.appellInfo.TitleLang;
    } else {
      return info.honerTemp.TemplateNameLang;
    }
  }

  public get isHoner(): boolean {
    // 现在没有type14荣誉了
    return false;
    if (this.isSelf) {
      return this.thane.honer >= this.thane.firstHonerTemp.Data;
    } else {
      return (
        this._data.baseHero.honer >= this._data.baseHero.firstHonerTemp.Data
      );
    }
  }

  protected get isVip(): boolean {
    return this._data.baseHero.IsVipAndNoExpirt;
  }

  protected layoutTxtViewWithNamePosY() {
    if (!this._data) return;
    super.layoutTxtViewWithNamePosY();

    this.layoutCB && this.layoutCB();
  }

  public caluateTopPos(): number {
    let thaneInfo: ThaneInfo = this.isSelf ? this.thane : this.data.baseHero;
    let pos: number = this._showNamePosY - 20;
    if (this.consortiaName) {
      pos -= 20;
    }
    if (this.isHoner && thaneInfo.appellInfo) {
      pos -= thaneInfo.appellInfo.ImgHeight;
    }
    return pos;
  }

  protected get consortiaName(): string {
    let name = "";
    if (this.isSelf) {
      name = this.thane.consortiaName;
      //Logger.info("[AvatarBaseView]CampaignArmyView-createNickName获取名字1", name)
    }

    //Logger.info("[AvatarBaseView]CampaignArmyView-createNickName获取名字2", this._data.baseHero.consortiaName)
    if (!name && this._data && this._data.baseHero) {
      name = this._data.baseHero.consortiaName;
    }
    return name;
  }

  protected showAvatar(value: CampaignArmy) {
    let roomPlayer: CampaignArmy;
    if (RoomManager.Instance.roomInfo)
      roomPlayer = RoomManager.Instance.roomInfo.getPlayerByUserId(
        value.baseHero.userId,
        value.baseHero.serviceName,
      );
    if (roomPlayer == null || roomPlayer.baseHero == null) {
      roomPlayer = value;
    }
    let speed = ArmySpeedUtils.getMoveSpeed(roomPlayer);
    this.aiInfo && (this.aiInfo.speed = speed);

    let thaneInfo: ThaneInfo = this.isSelf ? this.thane : roomPlayer.baseHero;
    let mountTemplate: t_s_mounttemplateData = roomPlayer.mountTemplate;
    this.isMounting = Boolean(mountTemplate);
    let changeShapeId: number = thaneInfo.changeShapeId;
    let sex: number = thaneInfo.templateInfo.Sexs;
    let job: number = thaneInfo.templateInfo.Job;
    let bodyAvatar: string =
      thaneInfo.bodyEquipAvata == ""
        ? JobType.getDefaultBodyEquipNameByJob(job)
        : thaneInfo.bodyEquipAvata;
    let armyAvatar: string =
      thaneInfo.armsEquipAvata == ""
        ? JobType.getDefaultArmysEquipNameByJob(job)
        : thaneInfo.armsEquipAvata;
    //測試
    // let bodyAvatar: string =  JobType.getDefaultBodyEquipNameByJob(job);
    // let armyAvatar: string =  JobType.getDefaultArmysEquipNameByJob(job);
    if (this.isMonopoly) {
      mountTemplate = null;
      this._isMounting = false;
    }
    let hairUpAvatar: string = JobType.getDefaultHairUpByJob(job);
    let hairDownAvatar: string = JobType.getDefaultHairDownByJob(job);
    let cloakAvatar: string = JobType.getCloakEquipNameByBodyEquip(bodyAvatar);
    let wingAvatar: string = thaneInfo.wingAvata;
    let mountAvatar: string = mountTemplate ? mountTemplate.AvatarPath : "";
    let showFashionAvatar: boolean = !thaneInfo.hideFashion;

    let delay: boolean = this.isSelf;
    let args: ResourceLoaderInfo;
    let url: string;
    let priority: number = this.isSelf
      ? LoaderPriority.Priority_10
      : LoaderPriority.Priority_4;

    // 方式2 先注释
    // 半透明替代模型不做引用计数处理
    // url = PathManager.getTranslucencePath(job, sex)
    // args = this.createResourceLoadInfo(url, undefined, undefined, AvatarPosition.TRANSLUCENCE);
    // ResMgr.Instance.loadRes(url, this.loaderCompleteHandler.bind(this), null, Laya.Loader.ATLAS, priority, null, null, null, null, args);

    if (changeShapeId > 0) {
      // Logger.xjy("[CampaignArmyView]changeShapeId", changeShapeId)
      bodyAvatar = changeShapeId + "";
      armyAvatar = "";
      if (!this.avatarView) {
        this.avatarView = new HeroAvatar(
          bodyAvatar,
          AvatarResourceType.NPC,
          sex,
          delay,
          job,
        );
      }
      this.avatarView.currentMountId = mountTemplate
        ? mountTemplate.TemplateId
        : -1;
      this.objName = value.baseHero.nickName;
      this.uuid = value.id + "_" + value.baseHero.serviceName;
      this.avatarView.changeShapeId = changeShapeId;
      this.avatarView.type = AvatarResourceType.NPC;
      this.avatarView.showAllAvatar(false);

      url = PathManager.getAvatarResourcePath(
        bodyAvatar,
        sex,
        1,
        AvatarPosition.BODY,
        job,
        AvatarResourceType.NPC,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.BASE_NPC_STAND,
        AvatarStaticData.BASE_NPC_WALK,
        AvatarPosition.BODY,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
      return;
    }

    if (!this.avatarView) {
      this.avatarView = new HeroAvatar(
        bodyAvatar,
        AvatarResourceType.PLAYER_ARMY,
        sex,
        delay,
      );
    }
    this.avatarView.currentMountId = mountTemplate
      ? mountTemplate.TemplateId
      : -1;
    this.objName = value.baseHero.nickName;
    this.uuid = value.id + "_" + value.baseHero.serviceName;
    this.avatarView.changeShapeId = 0;
    this.avatarView.type = AvatarResourceType.PLAYER_ARMY;

    //测试
    // showFashionAvatar = false
    let bodyType: number = 1;
    let armsType: number = 1;
    let hairType: number = 1;
    if (showFashionAvatar) {
      if (thaneInfo.bodyFashionAvata) {
        bodyAvatar = thaneInfo.bodyFashionAvata;
        cloakAvatar = "";
        bodyType = 2;
      }
      if (thaneInfo.armsFashionAvata) {
        armyAvatar = thaneInfo.armsFashionAvata;
        armsType = 2;
      }
      if (thaneInfo.hairFashionAvata) {
        hairUpAvatar = thaneInfo.hairFashionAvata + "Up";
        hairDownAvatar = thaneInfo.hairFashionAvata + "Down";
        hairType = 2;
      }
    }
    if (mountTemplate) {
      (this.avatarView as HeroAvatar).isStandPosMount =
        mountTemplate.useStandPose;
      if (!mountTemplate.useStandPose) {
        bodyAvatar = JobType.getMapMountEquipment(bodyAvatar);
        armyAvatar = JobType.getMapMountEquipment(armyAvatar);
        hairUpAvatar = JobType.getMapMountEquipment(hairUpAvatar);
        hairDownAvatar = JobType.getMapMountEquipment(hairDownAvatar);
        cloakAvatar = JobType.getMapMountEquipment(cloakAvatar);
        wingAvatar = JobType.getMapMountEquipment(wingAvatar);
      }
      if (!mountAvatar) {
        mountAvatar = JobType.getDefaultMount();
      }
    } else {
      (this.avatarView as HeroAvatar).isStandPosMount = false;
    }

    let isStandMount = this._isMounting && mountTemplate.useStandPose;
    if (wingAvatar) {
      //有翅膀
      cloakAvatar = "";
      url = PathManager.getAvatarResourcePath(
        wingAvatar,
        sex,
        1,
        AvatarPosition.WING,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.WING,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.WING,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.WING,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    } else if (cloakAvatar) {
      url = PathManager.getAvatarResourcePath(
        cloakAvatar,
        sex,
        1,
        AvatarPosition.CLOAK,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.CLOAK,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.CLOAK,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.CLOAK,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    }
    if (hairDownAvatar) {
      url = PathManager.getAvatarResourcePath(
        hairDownAvatar,
        sex,
        hairType,
        AvatarPosition.HAIR_DOWN,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.HAIR_DOWN,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.HAIR_DOWN,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.HAIR_DOWN,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    }
    if (hairUpAvatar) {
      url = PathManager.getAvatarResourcePath(
        hairUpAvatar,
        sex,
        hairType,
        AvatarPosition.HAIR_UP,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.HAIR_UP,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.HAIR_UP,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.HAIR_UP,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    }
    if (armyAvatar) {
      url = PathManager.getAvatarResourcePath(
        armyAvatar,
        sex,
        armsType,
        AvatarPosition.ARMY,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.ARMY,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.ARMY,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.ARMY,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    }
    if (bodyAvatar) {
      url = PathManager.getAvatarResourcePath(
        bodyAvatar,
        sex,
        bodyType,
        AvatarPosition.BODY,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.BODY,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.BODY,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.BODY,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    }
    if (mountAvatar) {
      url = PathManager.getAvatarResourcePath(
        mountAvatar,
        sex,
        1,
        AvatarPosition.MOUNT,
        job,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.MOUNT,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.MOUNT,
          this._isMounting,
          isStandMount,
          job,
          sex,
        ),
        AvatarPosition.MOUNT,
      );
      this.addRes2UnloadMap(args);
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        priority,
        null,
        null,
        null,
        null,
        args,
      );
    }

    if (this._avatar) {
      //隐藏处理  身体武器总是会存在不做处理
      (<HeroAvatar>this._avatar).showAvatar(
        cloakAvatar ? true : false,
        AvatarPosition.CLOAK,
      );
      (<HeroAvatar>this._avatar).showAvatar(
        hairDownAvatar ? true : false,
        AvatarPosition.HAIR_DOWN,
      );
      (<HeroAvatar>this._avatar).showAvatar(
        hairUpAvatar ? true : false,
        AvatarPosition.HAIR_UP,
      );
      (<HeroAvatar>this._avatar).showAvatar(
        mountAvatar ? true : false,
        AvatarPosition.MOUNT,
      );
      (<HeroAvatar>this._avatar).showAvatar(
        wingAvatar ? true : false,
        AvatarPosition.WING,
      );
    }

    Logger.xjy(
      "[CampaignArmyView]changeShapeId=",
      changeShapeId,
      ", showFashionAvatar=",
      showFashionAvatar,
      ", mountTemplate=",
      value.mountTemplate,
    );
    Logger.xjy(
      "[CampaignArmyView]showAvatar wingAvatar=" +
        wingAvatar +
        ", cloakAvatar=" +
        cloakAvatar +
        ", hairDownAvatar=" +
        hairDownAvatar +
        ", hairUpAvatar=" +
        hairUpAvatar +
        ", armyAvatar=" +
        armyAvatar +
        ", bodyAvatar=" +
        bodyAvatar +
        ", mountAvatar=" +
        mountAvatar,
    );

    this.showMountShadow = this._isMounting;
  }

  private showPet(petInfo: ArmyPetInfo) {
    if (this._petAvatarView) {
      this._petAvatarView.dispose();
      this._petAvatarView = null;
    }

    if (!petInfo.petTemplate) {
      return;
    }
    let petAvatar = petInfo.petTemplate.PetAvatar;

    if (!petAvatar) {
      return;
    }

    this._petAvatarView = new PetAvatarView();
    if (this.petAvatarView) {
      this.petAvatarView.isSelfPet = this.isSelf;
      this.petAvatarView.followTarget = this;
      this.petAvatarView.petTemplate = petInfo.petTemplate;
      this.petAvatarView.changeFollowType(petInfo.petTemplate);
      if (this.petAvatarView.followType == 1) {
        if (
          this._petAvatarView.parent !=
          CampaignManager.Instance.mapView.walkLayer
        ) {
          CampaignManager.Instance.mapView.walkLayer.addChild(
            this._petAvatarView,
          );
          this.initPetPos();
        }
      } else {
        this.addChild(this.petAvatarView);
      }
      let petName: string;
      let petTemQuaity: number = 1;
      petName = petInfo.petName ? petInfo.petName : "";
      if (petInfo.petQuaity > 0) {
        petTemQuaity = petInfo.petTemQuality;
      }

      this.petAvatarView.showAvatar(
        petName,
        petTemQuaity,
        petAvatar,
        petInfo.petTemplateId,
        this.uuid,
      );
    }
  }

  private initPetPos() {
    let s: number = -1;
    if (this.avatarView) {
      s = -(<HeroAvatar>this.avatarView).mirror;
    }
    this.petAvatarView.x = this.data.curPosX * Tiles.WIDTH + s * 100;
    this.petAvatarView.y = this.data.curPosY * Tiles.HEIGHT;
  }

  protected loaderCompleteHandler(res: any, info: ResourceLoaderInfo) {
    if (this.destroyed) return;
    super.loaderCompleteHandler(res, info);
  }

  protected __heroPropertyHandler(evt: PlayerEvent) {
    if (!this._data || !this._data.baseHero || !RoomManager.Instance.roomInfo) {
      return;
    }
    let roomPlayer: CampaignArmy =
      RoomManager.Instance.roomInfo.getPlayerByUserId(
        this._data.baseHero.userId,
        this._data.baseHero.serviceName,
      );
    if (!roomPlayer) {
      return;
    }
    if (this.isSelf) {
      roomPlayer.baseHero.nickName = this.thane.nickName;
    }
    roomPlayer.baseHero.hideFashion = this.thane.hideFashion;
    roomPlayer.baseHero.changeShapeId = this.thane.changeShapeId;
    roomPlayer.baseHero.bodyEquipAvata = this.thane.bodyEquipAvata;
    roomPlayer.baseHero.armsEquipAvata = this.thane.armsEquipAvata;
    roomPlayer.baseHero.wingAvata = this.thane.wingAvata;
    roomPlayer.baseHero.bodyFashionAvata = this.thane.bodyFashionAvata;
    roomPlayer.baseHero.armsFashionAvata = this.thane.armsFashionAvata;
    roomPlayer.baseHero.hairFashionAvata = this.thane.hairFashionAvata;
    roomPlayer.baseHero.wingAvata = this.thane.wingAvata;
    roomPlayer.mountTemplateId = ArmyManager.Instance.army.mountTemplateId;
    this.avatarView.angle += 1;
    this.showAvatar(this._data);
  }

  private __avatarChangeHandler(e: PlayerEvent) {
    if (this.isSelf) {
      ArmyManager.Instance.army.mountTemplateId = this.data.mountTemplateId;
    }
    this.showAvatar(this._data);
  }

  protected setFireView() {
    if (!this._attackView)
      this._attackView = new SimpleAvatarView(
        110,
        110,
        PathManager.fightStatePath,
        10,
      );
    this._attackView.drawFrame = 2;
    this.addChild(this._attackView);
    this._attackView.x = -55;
    this._attackView.y = this._showNamePosY - 90;
  }

  protected clearFireView() {
    if (this._attackView) this._attackView.dispose();
    this._attackView = null;

    if (this._bloodMc) {
      this._bloodMc.stop();
      if (this._bloodMc.parent) this._bloodMc.parent.removeChild(this._bloodMc);
    }
  }

  private __updateInfoHandler(evt) {
    // 会引起 副本内切换英灵显示不正确
    // if (evt) {
    //     let t: ThaneInfo = evt;
    //     this.data.petInfo.petTemplateId = t.petTemplateId;
    //     this.data.petInfo.petName = t.petName;
    //     this.data.petInfo.petQuaity = t.petQuaity;
    //     this.data.petInfo.petTemQuality = t.temQuality;
    //     this.data.petInfo.commit();
    // }
    if (!this._data || !this._data.baseHero || !RoomManager.Instance.roomInfo) {
      return;
    }
    let roomPlayer: CampaignArmy =
      RoomManager.Instance.roomInfo.getPlayerByUserId(
        this._data.baseHero.userId,
        this._data.baseHero.serviceName,
      );
    if (!roomPlayer) {
      return;
    }
    if (this.isSelf) {
      roomPlayer.baseHero.nickName = this.thane.nickName;
    }
    this.setName();
  }

  private __updateTeamHandler(evtData) {
    this.setName();
    let armyInfo: CampaignArmy = this.data;
    let newX: number = armyInfo.curPosX * Tiles.WIDTH;
    let newY: number = armyInfo.curPosY * Tiles.HEIGHT;
    if (Math.abs(this.x - newX) > 100 || Math.abs(this.y - newY) > 100) {
      this.x = newX;
      this.y = newY;
      this._info.pathInfo = [];
    }
  }

  private __updateBufferHandler(evt: CampaignMapEvent) {
    if (!WorldBossHelper.checkPvp(this._data.mapId)) return;
    if (this._data.bufferTempId > 0) {
      this._buffEffect = new SimpleAvatarView(
        178,
        200,
        PathManager.warFightBuff,
      );
      this.addChildAt(this._buffEffect, 0);
      this._buffEffect.x = -91;
      this._buffEffect.y = -146;
    } else {
      if (this._buffEffect) {
        if (this._buffEffect.parent)
          this._buffEffect.parent.removeChild(this._buffEffect);
        this._buffEffect.dispose();
        this._buffEffect = null;
      }
    }
  }

  protected __lockKeyHandler(evt: NotificationEvent) {
    this.info.pathInfo = [];
  }

  private __hangupAddHandler(e: CampaignMapEvent) {
    // let mc:MovieClip = ComponentFactory.Instance.creat("asset.campaign.map.HangupAddAsset");
    // let numberBitmapData:BitmapData = ComponentFactory.Instance.creatBitmapData("asset.core.number_img_05");
    // HintUtils.refreshValue(number(e.data),mc['content']['num_pos'],numberBitmapData,40,40,25,40,"0123456789.");
    // let hangupAddCiew:SimpleMovie = new SimpleMovie(mc);
    // hangupAddCiew.y = -50;
    // this.addChild(hangupAddCiew);
    // numberBitmapData.dispose();
    // numberBitmapData = null;
  }

  private __hangupStateHandler(evt: CampaignMapEvent) {
    if (this._data.hangupState > 0) {
      if (!this._hangupView)
        this._hangupView = new SimpleAvatarView(
          80,
          180,
          PathManager.getHookStatePath(this._data.hangupState),
        );
      this.addChild(this._hangupView);
      this._hangupView.x = -47;
      this._hangupView.y = -157;
    } else {
      if (this._hangupView) this._hangupView.dispose();
      this._hangupView = null;
    }
  }

  private __updateCurHpHandler(evt: PhysicsEvent) {
    if (this._data.curHp <= 0 || this._data.totalHp <= 0) return;
    // if(!this._bloodMc)this._bloodMc = ComponentFactory.Instance.creatCustomObject("asset.campaign.map.BloodAsset");
    // this._bloodMc.play();
    // this.addChild(this._bloodMc);
    // this._bloodMc.y = this._bloodMc.height;
    // this._bloodMc.bloodMc.gotoAndStop(Number((this._data.curHp/this._data.totalHp)*100));
  }

  protected __isDieHandler(evt: CampaignMapEvent) {
    this.updateDiedState();
  }

  public updateDiedState() {
    if (CampaignArmyState.checkDied(this._data.isDie)) {
      this.gray(true);
    } else {
      this.gray(false);
    }
  }

  private __chatHandler(chatData: ChatData) {
    let isOpen: boolean = ChatManager.Instance.getSwitchState(
      CampaignManager.Instance.mapModel.mapTempInfo.MessageBoxType,
    );
    if (!isOpen || chatData.uid == 0) {
      return;
    }
    if (
      chatData.htmlText.indexOf("<a") > -1 &&
      chatData.htmlText.indexOf("/>") > -1
    ) {
      return;
    }
    if (chatData.serverId) {
      return;
    }

    this.showChatPopView(chatData);
  }

  protected __onlineStateHandler(evt: CampaignMapEvent) {
    this.visible = this._data.online;
    this.active = this._data.online;
    if (this.avatarView) {
      if (this._data.online) {
        if (!this.avatarView.parent) {
          this.addChildAt(this.avatarView, 0);
          this.x = this._data.curPosX * Tiles.WIDTH;
          this.y = this._data.curPosY * Tiles.HEIGHT;
        }
        if (this.petAvatarView && !this.petAvatarView.parent) {
          this.addChildAt(this.petAvatarView, 1);
        }
        this.__updateCampaignArmyHandler(null);
      } else {
        if (this.avatarView.parent) {
          this.avatarView.parent.removeChild(this.avatarView);
        }
        if (this.petAvatarView && this.petAvatarView.parent) {
          this.petAvatarView.parent.removeChild(this.petAvatarView);
        }
        this.x = this._data.curPosX * Tiles.WIDTH;
        this.y = this._data.curPosY * Tiles.HEIGHT;
      }
    }

    if (this.visible) {
      this.visible = this._data.mapId == this.mapModel.mapId ? true : false;
      this.active = this._data.mapId == this.mapModel.mapId ? true : false;
    }
    this.execute();
  }

  public __refresArmyStateHandler(value: BaseArmy) {
    if (value && this._data && value.userId == this._data.userId) {
      if (!ArmyState.checkCampaignAttack(value.state)) {
        this.setFireView();
        return;
      }
      this.clearFireView();
    }
  }

  public __updateCampaignArmyHandler(evt: CampaignMapEvent) {
    if (!ArmyState.checkCampaignAttack(this._data.state)) {
      this.info.pathInfo = [];
      this.setFireView();
      return;
    }
    this.clearFireView();
  }

  protected newMove() {
    if (this.info.moveOverState == 1) {
      //移进视野
      CampaignManager.Instance.mapModel.moveToVisible(this.data);
    } else if (this.info.moveOverState == 2) {
      //移出视野
      CampaignManager.Instance.mapModel.moveToUnVisible(this.data);
    }
  }

  public execute() {
    super.execute();
    this.petAvatarView && this.petAvatarView.execute();

    this.setAvaterStepFrame();
    if (this.isPlaying) {
      if (this._hangupView) this._hangupView.draw();
      if (this._buffEffect) this._buffEffect.draw();
    }
  }

  private setAvaterStepFrame() {
    if (this._avatar) {
      if (this._isStand) {
        (<HeroAvatar>this._avatar).stepFrame = 4;
      } else if (this._isMounting) {
        (<HeroAvatar>this._avatar).stepFrame = 1;
      } else {
        (<HeroAvatar>this._avatar).stepFrame = 2;
      }
      if (
        this._avatar.state == Avatar.WALK &&
        this.isSelf &&
        (this._avatar.frameX == 0 ||
          this._avatar.frameX == 2 ||
          this._avatar.frameX == 4)
      ) {
        AudioManager.Instance.playSound(SoundIds.CAMPAIGN_WALK_SOUND);
      }
    }
  }

  /**
   *
   * @param point 格子点
   *
   */
  public nextWalk(point: Laya.Point) {
    this._currentPos = this.getTilePos();
    this._data.curPosX = this._currentPos.x;
    this._data.curPosY = this._currentPos.y;

    super.nextWalk(point);
    this.dispatchEvent(PhysicsEvent.WALK_NEXT_POINT, null);
  }

  private _currentPos: Laya.Point = new Laya.Point(0, 0);

  protected playMovie() {
    super.playMovie();

    let pos: Laya.Point = this.getTilePos();
    if (pos.x != this._currentPos.x || pos.y != this._currentPos.y) {
      this.event(ObjectsEvent.WALK_NEXT, { point: pos });
      this._currentPos = pos;

      if (this._data.isDie == 0) {
        let b: boolean = this.mapModel.walkableValueIsPara(
          4,
          this.x / Tiles.WIDTH,
          this.y / Tiles.HEIGHT,
        );
        this._avatar.alpha = b ? 0.5 : 1;
        if (this._petAvatarView) {
          this._petAvatarView.alpha = b ? 0.5 : 1;
        }
      }
      this._data.curPosX = this._currentPos.x;
      this._data.curPosY = this._currentPos.y;
    }

    this.changeLandEffect();
  }

  protected walkOver() {
    super.walkOver();
  }

  protected updateDirection(num: number) {
    let angle: number = num;
    super.updateDirection(angle);
    this._data.angle = angle;
  }

  public get aiInfo(): BaseArmyAiInfo {
    return <BaseArmyAiInfo>this._info;
  }

  protected get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }

  protected get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  protected get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public set avatarView(value: Avatar) {
    if (this._avatar) {
      NotificationManager.Instance.removeEventListener(
        HeroAvatar.SIZETYPE_CHANGE,
        this.__onSizeTypeChangeHandler,
        this,
      );
    }
    super.avatarView = value;
    if (this._isPlaying) {
      if (this._petAvatarView && this._petAvatarView.parent == this) {
        this.addChild(this._petAvatarView);
      }
    }
  }

  public get avatarView(): Avatar {
    return super.avatarView;
  }

  private __onSizeTypeChangeHandler(e: Event) {
    this.layoutTxtViewWithNamePosY();
  }

  private __petLevelUpHandler(e: PetEvent) {
    // if (this.petAvatarView) {
    // 	this.petAvatarView.playPetLevelUpMovie();
    // }
  }

  public precentSpeed: number = 1;

  public changeSpeedTo(precent: number = 0.5) {
    this.precentSpeed = precent;
    let normalSpeed: number = ArmySpeedUtils.getMoveSpeed(this._data);

    this.info.speed = Math.ceil(normalSpeed * precent);
  }

  private getPlayerWalkMediator() {
    let meditiators = MediatorMananger.Instance.allMediators[this._mediatorKey];
    for (let index = 0; index < meditiators.length; index++) {
      const meditiator = meditiators[index];
      if (meditiator instanceof PlayerWalkMediator) {
        return meditiator;
      }
    }
    return null;
  }

  public dispose() {
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    NotificationManager.Instance.removeEventListener(
      HeroAvatar.SIZETYPE_CHANGE,
      this.__onSizeTypeChangeHandler,
      this,
    );
    this.removeEvent();
    if (this._data) {
      if (this.mapId == this._data.mapId) {
        this._data.curPosX = this.x / Tiles.WIDTH;
        this._data.curPosY = this.y / Tiles.HEIGHT;
      }
      this._data.preParent = null;
    }

    this.clearFireView();
    ObjectUtils.disposeViolentMc(this._bloodMc);
    this._bloodMc = null;

    if (this._hangupView) this._hangupView.dispose();
    this._hangupView = null;
    if (this._buffEffect) this._buffEffect.dispose();
    this._buffEffect = null;
    if (this._attackView) this._attackView.dispose();
    this._attackView = null;
    super.dispose();
  }
}
