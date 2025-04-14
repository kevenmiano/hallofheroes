import StringHelper from "../../../core/utils/StringHelper";
import { AvatarActionType } from "../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../avatar/data/AvatarStaticData";
import { Avatar } from "../../avatar/view/Avatar";
import { eFilterFrameText } from "../../component/FilterFrameText";
import { ArmyState } from "../../constant/ArmyState";
import { AvatarResourceType } from "../../constant/AvatarDefine";
import {
  ArmyEvent,
  OuterCityEvent,
  PetEvent,
  PhysicsEvent,
} from "../../constant/event/NotificationEvent";
import { PlayerEvent } from "../../constant/event/PlayerEvent";
import { JobType } from "../../constant/JobType";
import LoaderPriority from "../../constant/LoaderPriority";
import { UpgradeType } from "../../constant/UpgradeType";
import { ArmyPetInfo } from "../../datas/ArmyPetInfo";
import { PlayerInfo } from "../../datas/playerinfo/PlayerInfo";
import { ThaneInfo } from "../../datas/playerinfo/ThaneInfo";
import { ArmyManager } from "../../manager/ArmyManager";
import MediatorMananger from "../../manager/MediatorMananger";
import { MessageTipManager } from "../../manager/MessageTipManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { OuterCityManager } from "../../manager/OuterCityManager";
import { PathManager } from "../../manager/PathManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { TempleteManager } from "../../manager/TempleteManager";
import { ArmySpeedUtils } from "../../utils/ArmySpeedUtils";
import { HeroAvatar } from "../avatar/view/HeroAvatar";
import { PetAvatarView } from "../avatar/view/PetAvatarView";
import Tiles from "../space/constant/Tiles";
// import IBaseMouseEvent from "../space/interfaces/IBaseMouseEvent";
import { HeroAvatarView } from "../view/hero/HeroAvatarView";
import { BaseArmy } from "../space/data/BaseArmy";
import { EmWindow } from "../../constant/UIDefine";
import LangManager from "../../../core/lang/LangManager";
import { UserArmy } from "../space/data/UserArmy";
import { OutercityNpcActivationMediator } from "../../mvc/mediator/OutercityNpcActivationMediator";
import { t_s_skilltemplateData } from "../../config/t_s_skilltemplate";
import { t_s_upgradetemplateData } from "../../config/t_s_upgradetemplate";
import { ResourceLoaderInfo } from "../avatar/data/ResourceLoaderInfo";
import { ResRefCountManager } from "../../managerRes/ResRefCountManager";
import { CursorManagerII } from "../../manager/CursorManagerII";
import { TipsShowType } from "../../tips/ITipedDisplay";
import ChatData from "../../module/chat/data/ChatData";
import ResMgr from "../../../core/res/ResMgr";
import { AnimationManager } from "../../manager/AnimationManager";
import { MovieClip } from "../../component/MovieClip";
import Point = Laya.Point;
import Sprite = Laya.Sprite;
import { ChatChannel } from "../../datas/ChatChannel";
import { ChatManager } from "../../manager/ChatManager";
import { AvatarInfoTag } from "../../constant/Const";
import { eAvatarBaseViewType } from "../view/hero/AvatarBaseView";
import UIManager from "../../../core/ui/UIManager";
import { WorldWalkLayer } from "./WorldWalkLayer";
import { AvatarInfoUILayerHandler } from "../view/layer/AvatarInfoUILayer";
import { SharedManager } from "../../manager/SharedManager";
import FreedomTeamManager from "../../manager/FreedomTeamManager";

interface IBaseMouseEvent {
  tipData: any;
  tipType: EmWindow;
  alphaTest: boolean;
  showType: TipsShowType;
  startPoint: Laya.Point;
}

/**
 * @description    外城人物形象
 * @author yuanzhan.yu
 * @date 2021/11/17 11:05
 * @ver 1.0
 */
export class OuterCityArmyView
  extends HeroAvatarView
  implements IBaseMouseEvent
{
  //ITipedDisplay
  private _armyInfo: BaseArmy;
  private _vipIcon: fgui.GImage;
  private _mediatorKey: string;
  protected _showNamePosY: number = -110;
  private _attacking: fgui.GMovieClip;
  private _appellId: number = 0;
  public avatarBaseViewType: eAvatarBaseViewType =
    eAvatarBaseViewType.OuterCityArmy;

  tipData: any;
  tipType: EmWindow;
  alphaTest: boolean = true;
  showType: TipsShowType = TipsShowType.onClick;
  startPoint: Laya.Point = new Laya.Point(0, 0);

  public static NAME: string =
    "map.outercity.view.mapphysics.OuterCityArmyView";

  constructor() {
    super();
    this.autoSize = true;
    this.mouseEnabled = true;
    this.hitTestPrior = true;
  }

  protected setName(name?: string, nameColor?: number, grade?: number) {
    nameColor = this.getNameColor();
    name = this._armyInfo.baseHero.nickName;
    grade = this._armyInfo.baseHero.grades;

    super.setName(name, nameColor, grade);
    this.showVipIcon(this.isVip);
    this.showQQDWKIcon(this.isDwk);
    this.setConsortiaName(this._armyInfo.baseHero.consortiaName, nameColor);
    this.setHonerName();
    this.layoutTxtViewWithNamePosY();
  }

  protected createNickName() {
    AvatarInfoUILayerHandler.handle_CON_CREATE(
      this._uuid,
      AvatarInfoTag.NickName,
      { bold: this.isSelf },
    );
  }

  protected setConsortiaName(
    name: string,
    nameColor: number,
    noSymbol: boolean = false,
  ) {
    if (StringHelper.isNullOrEmpty(name)) {
      AvatarInfoUILayerHandler.handle_CON_VISIBLE(
        this._uuid,
        AvatarInfoTag.ConsortiaName,
        false,
      );
      return;
    }
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.ConsortiaName,
      this._isPlaying,
    );
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
  }

  private setHonerName(): void {
    if (this._appellId == this.appellId) {
      return;
    }
    this._appellId = this.appellId;
    AvatarInfoUILayerHandler.handle_CON_DISPOSE(
      this._uuid,
      AvatarInfoTag.Appell,
    );
    let appellInfo = this._armyInfo.baseHero.appellInfo;
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

  private get isSelfConsortia(): boolean {
    if (this._armyInfo && this._armyInfo.baseHero) {
      if (StringHelper.isNullOrEmpty(this._armyInfo.baseHero.consortiaName)) {
        return false;
      }
      if (StringHelper.isNullOrEmpty(this.playerInfo.consortiaName)) {
        return false;
      }
      return (
        this._armyInfo.baseHero.consortiaName == this.playerInfo.consortiaName
      );
    }
    return false;
  }

  private get appellId(): number {
    if (!this.isSelf && this._armyInfo) {
      return this._armyInfo.baseHero.appellId;
    }
    return this.thane.appellId;
  }

  private get honerStyle(): string {
    return (
      "map.campaign.HonerText" + this._armyInfo.baseHero.appellInfo.Quality
    );
  }

  private get honerName(): string {
    return (
      this._armyInfo.baseHero.appellInfo &&
      this._armyInfo.baseHero.appellInfo.TitleLang
    );
  }

  private get isHoner(): boolean {
    return this._armyInfo.baseHero.appellId != 0;
  }

  private setVipIcon() {
    this._vipIcon && this.addChild(this._vipIcon.displayObject);
  }

  private clearVipIcon() {
    this._vipIcon && this._vipIcon.displayObject.removeSelf();
  }

  protected get isVip(): boolean {
    return this._armyInfo.baseHero.IsVipAndNoExpirt;
  }

  public layoutTxtViewWithNamePosY(): void {
    if (!this._armyInfo) return;
    super.layoutTxtViewWithNamePosY();
  }

  public execute(): void {
    super.execute();
    if (this._avatar) {
      if (this._isStand) {
        (<HeroAvatar>this._avatar).stepFrame = 4;
      } else if (this._isMounting) {
        (<HeroAvatar>this._avatar).stepFrame = 1;
      } else {
        (<HeroAvatar>this._avatar).stepFrame = 2;
      }
      //				_avatar.stepFrame = _isStand ? 4 : 2;
    }
    if (this.isPlaying) {
      if (this._petAvatarView) {
        this._petAvatarView.execute();
      }
    }
  }

  public get armyInfo(): UserArmy {
    return this._armyInfo;
  }

  protected nextWalk(point: Point): void {
    let tileX = parseInt((point.x / Tiles.WIDTH).toString());
    let tileY = parseInt((point.y / Tiles.HEIGHT).toString());
    super.nextWalk(new Point(tileX, tileY));

    point.x = parseInt(point.x.toString());
    point.y = parseInt(point.y.toString());
    if (this._armyInfo.userId == this.selfUserId) {
      let sendData: Point[] = [point];
      OuterCityManager.Instance.controler.sendWalkPathII(sendData);
    }
  }

  private static updateTrun: number = 5;

  protected walkOver(): void {
    super.walkOver();
    this.standImp();
    if (this._armyInfo.userId == this.selfUserId) {
      NotificationManager.Instance.dispatchEvent(
        OuterCityEvent.MOVE_OVER,
        new Point(this.x, this.y),
      );
    }
  }

  private _count: number = 0;

  protected playMovie(): void {
    super.playMovie();
    this._count++;
    if (this._count > 10) {
      let b: boolean = OutercityNpcActivationMediator.checkOutScene(
        this,
        this.sizeInfo,
        this.parent as Sprite,
      );
      this.isPlaying = !b;
      this._count = 0;
    }

    this.changeLandEffect();
  }

  private showFateSkillEffect(): void {
    if (this._fateSkillEffect) {
      this._fateSkillEffect.destroy();
    }
    this._fateSkillEffect = null;
    if (!this._armyInfo.baseHero.fateSkill) {
      return;
    }
    let args: any[] = this._armyInfo.baseHero.fateSkill.split(",");
    let maxId: number = 0;
    let maxGrade: number = 0;
    for (let i = 0, len = args.length; i < len; i++) {
      const id: string = args[i];
      let grade: number = Number(id.substr(id.length - 2, 2));
      if (grade > maxGrade) {
        maxGrade = grade;
        maxId = Number(id);
      }
    }
    let skillTemp: t_s_skilltemplateData =
      TempleteManager.Instance.getSkillTemplateInfoById(maxId);
    if (!skillTemp || skillTemp.Grades == 0) {
      return;
    }
    let upgradeTemp: t_s_upgradetemplateData =
      TempleteManager.Instance.getTemplateByTypeAndLevel(
        skillTemp.Grades,
        UpgradeType.UPGRADE_TYPE_FATE_GUARD,
      );
    if (StringHelper.isNullOrEmpty(upgradeTemp.TemplateNameLang)) {
      return;
    }

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
        this._fateSkillEffect.visible = !SharedManager.Instance.hideOtherPlayer;
        this.addChildAt(this._fateSkillEffect, 0);
        this._fateSkillEffect.pos(-parseInt(offset.x), -parseInt(offset.y));
      },
      null,
      Laya.Loader.ATLAS,
    );
  }

  private __updatePetAvatarHandler(data: ArmyPetInfo): void {
    this.showPet(data);
  }

  public __updateArmyStateHandler(value: UserArmy): void {
    // if(!ArmyState.checkCampaignAttack(value.state))
    // {
    //     this.setFireView();
    //     return;
    // }
    // this.clearFireView();
  }

  public set armyInfo(value: UserArmy) {
    if (value.state == ArmyState.STATE_FIGHT) {
      this.setFireView();
    } else {
      this.clearFireView();
    }
    if (this._armyInfo == value) {
      return;
    }

    this._armyInfo = value;
    let arr: any[] = [];
    value.addEventListener(PhysicsEvent.CHAT_DATA, this.__chatHandler, this);
    value.addEventListener(
      ArmyEvent.UPDATE_STATE,
      this.__updateArmyStateHandler,
      this,
    );
    if (value.userId == this.playerInfo.userId) {
      //todo by yuyuanzhan 外城攻击玩家逻辑
      // arr.push(OuterCityPkMediator);
      // arr.push(OuterCityBattleGetMovieMediator);
      this.thane.addEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__heroPropertyHandler,
        this,
      );
      PlayerManager.Instance.addEventListener(
        PetEvent.PET_LEVEL_UP,
        this.__petLevelUpHandler,
        this,
      );
    } else {
      value.baseHero.addEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__heroPropertyHandler,
        this,
      );
    }
    value.baseHero.addEventListener(
      PlayerEvent.PLAYER_INFO_UPDATE,
      this.__updateInfoHandler,
      this,
    );
    value.petInfo.addEventListener(
      ArmyEvent.PETINFO_CHANGED,
      this.__updatePetAvatarHandler,
      this,
    );
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      OuterCityArmyView.NAME,
    );
    this.showFateSkillEffect();
    this.showAvatar(value);
    this.showPet(value.petInfo);
    this.__updateInfoHandler(null);
    this.tipType = EmWindow.OuterCityArmyTips;
    this.tipData = this._armyInfo;
  }

  public showTip() {
    UIManager.Instance.ShowWind(EmWindow.OuterCityArmyTips, [this._armyInfo]);
  }

  private showPet(petInfo: ArmyPetInfo): void {
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
      this.petAvatarView.followTarget = this;
      this.petAvatarView.isSelfPet = this.isSelf;
      this.petAvatarView.petTemplate = petInfo.petTemplate;
      this.petAvatarView.changeFollowType(petInfo.petTemplate);
      if (this.petAvatarView.followType == 1) {
        if (
          this._petAvatarView.parent !=
          OuterCityManager.Instance.mapView.worldWalkLayer
        ) {
          OuterCityManager.Instance.mapView.worldWalkLayer.addChild(
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

  private initPetPos(): void {
    let s: number = -1;
    if (this.avatarView) {
      s = -(<HeroAvatar>this.avatarView).mirror;
    }
    this.petAvatarView.x = this.data.curPosX * Tiles.WIDTH + s * 100;
    this.petAvatarView.y = this.data.curPosY * Tiles.HEIGHT;
  }

  private __petLevelUpHandler(e: PetEvent): void {
    if (this.petAvatarView) {
      this.petAvatarView.playPetLevelUpMovie();
    }
  }

  private __updateInfoHandler(t: ThaneInfo): void {
    if (t) {
      this.data.petInfo.petTemplateId = t.petTemplateId;
      this.data.petInfo.petName = t.petName;
      this.data.petInfo.petQuaity = t.petQuaity;
      this.data.petInfo.petTemQuality = t.temQuality;
      this.data.petInfo.commit();
    }

    this.setName();
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

  private get playerInfo(): PlayerInfo {
    return PlayerManager.Instance.currentPlayerModel.playerInfo;
  }

  private get thane(): ThaneInfo {
    return ArmyManager.Instance.thane;
  }

  public get avatarView(): Avatar {
    return this._avatar;
  }

  /**
   * 显示装备avatar的方法
   * @param value
   *
   */
  private showAvatar(value: UserArmy): void {
    this.info.speed = ArmySpeedUtils.getMoveSpeed(value);

    let changeShapeId: number;
    let showFashionAvatar: boolean;
    let thaneInfo: ThaneInfo;
    let army: BaseArmy;
    if (this._armyInfo.userId == this.playerInfo.userId) {
      thaneInfo = this.thane;
      army = ArmyManager.Instance.army;
    } else {
      thaneInfo = value.baseHero;
      if (value.mountTemplate) {
        this.thane.avatarChange[AvatarPosition.MOUNT] = true;
      }
      army = value;
    }
    let mountTemplate = army.mountTemplate;
    this.isMounting = Boolean(mountTemplate);
    if (this.info) this.info.speed = ArmySpeedUtils.getMoveSpeed(army);
    let bodyAvatar: string = thaneInfo.bodyEquipAvata;
    let armyAvatar: string = thaneInfo.armsEquipAvata;
    changeShapeId = thaneInfo.changeShapeId;
    showFashionAvatar = !thaneInfo.hideFashion;
    if (!thaneInfo.templateInfo) {
      return;
    }
    let sex: number = thaneInfo.templateInfo.Sexs;
    let job: number = thaneInfo.templateInfo.Job;
    if (bodyAvatar == "") {
      bodyAvatar = JobType.getDefaultBodyEquipNameByJob(job);
    } //"200";
    if (armyAvatar == "") {
      armyAvatar = JobType.getDefaultArmysEquipNameByJob(job);
    } //""
    let hairUpAvatar: string = JobType.getDefaultHairUpByJob(job);
    let hairDownAvatar: string = JobType.getDefaultHairDownByJob(job);
    let cloakAvatar: string = JobType.getCloakEquipNameByBodyEquip(bodyAvatar);
    let wingAvatar: string = thaneInfo.wingAvata;
    let mountAvatar: string = "";
    // let petAvatar: string;
    // if (thaneInfo.petTemplate) {
    //     petAvatar = thaneInfo.petTemplate.PetAvatar;
    // }

    let args: ResourceLoaderInfo;
    let url: string;
    let priority: number = this.isSelf
      ? LoaderPriority.Priority_10
      : LoaderPriority.Priority_4;
    if (changeShapeId > 0) {
      bodyAvatar = changeShapeId + "";
      armyAvatar = "";
      if (!this.avatarView) {
        this.avatarView = new HeroAvatar(
          bodyAvatar,
          AvatarResourceType.NPC,
          sex,
          true,
          job,
        );
      }
      this.avatarView.currentMountId = mountTemplate
        ? mountTemplate.TemplateId
        : -1;
      this.objName = value.baseHero.nickName;
      this.uuid = value.id + value.baseHero.serviceName;
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
        [0, 0, 0, 0, 0],
        [0, 0, 0],
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
    } else {
      if (!this.avatarView) {
        this.avatarView = new HeroAvatar(
          bodyAvatar,
          AvatarResourceType.PLAYER_ARMY,
          sex,
          true,
          job,
        );
      }
      this.avatarView.currentMountId = mountTemplate
        ? mountTemplate.TemplateId
        : -1;
      this.objName = value.baseHero.nickName;
      this.uuid = value.id + value.baseHero.serviceName;
      this.avatarView.changeShapeId = 0;
      this.avatarView.type = AvatarResourceType.PLAYER_ARMY;

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
          hairUpAvatar = thaneInfo.hairFashionAvata + "up";
          hairDownAvatar = thaneInfo.hairFashionAvata + "down";
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
        mountAvatar =
          mountTemplate.AvatarPath == ""
            ? JobType.getDefaultMount()
            : mountTemplate.AvatarPath;
        // this.isMounting = true;
      } else {
        (this.avatarView as HeroAvatar).isStandPosMount = false;
      }

      let isStandMount = this._isMounting && mountTemplate.useStandPose;
      if (wingAvatar) {
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
      // if (wingAvatar) {
      //     this.avatarView.updateAvatar(wingAvatar,
      //         AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.WING, this._isMounting, isStandMount, job, sex),
      //         AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.WING, this._isMounting, isStandMount, job, sex),
      //         AvatarPosition.WING, null, 1);
      // }
      // else if (cloakAvatar) {
      //     this.avatarView.updateAvatar(cloakAvatar,
      //         AvatarStaticData.getBaseNumByType(AvatarActionType.STAND, AvatarPosition.CLOAK, this._isMounting, isStandMount, job, sex),
      //         AvatarStaticData.getBaseNumByType(AvatarActionType.WALK, AvatarPosition.CLOAK, this._isMounting, isStandMount, job, sex),
      //         AvatarPosition.CLOAK, null, 1);
      // }

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
    }

    this.avatarView.scaleX = this.avatarView.scaleY = 0.85;
    this.showMountShadow = this._isMounting;
    this.avatarView.mouseEnabled = false;
  }

  public set avatarView(value: Avatar) {
    if (this._avatar) {
      this._avatar.off(
        Avatar.SIZETYPE_CHANGE,
        this,
        this.__onSizeTypeChangeHandler,
      );
    }
    super.avatarView = value;
    if (this._petAvatarView && this._petAvatarView.parent == this) {
      this.addChild(this._petAvatarView);
    }
  }

  private __onSizeTypeChangeHandler(e: Event): void {
    this.layoutTxtViewWithNamePosY();
  }

  private __heroPropertyHandler(): void {
    this.showAvatar(this._armyInfo);
  }

  public dispose(): void {
    this.thane.removeEventListener(
      PlayerEvent.PLAYER_AVATA_CHANGE,
      this.__heroPropertyHandler,
      this,
    );
    if (this._armyInfo) {
      this._armyInfo.baseHero.removeEventListener(
        PlayerEvent.PLAYER_AVATA_CHANGE,
        this.__heroPropertyHandler,
        this,
      );
      this._armyInfo.baseHero.removeEventListener(
        PlayerEvent.PLAYER_INFO_UPDATE,
        this.__updateInfoHandler,
        this,
      );
      this._armyInfo.removeEventListener(
        PhysicsEvent.CHAT_DATA,
        this.__chatHandler,
        this,
      );
      this._armyInfo.removeEventListener(
        ArmyEvent.UPDATE_STATE,
        this.__updateArmyStateHandler,
        this,
      );
      PlayerManager.Instance.removeEventListener(
        PetEvent.PET_LEVEL_UP,
        this.__petLevelUpHandler,
        this,
      );
    }
    if (this._avatar) {
      this._avatar.off(
        Avatar.SIZETYPE_CHANGE,
        this,
        this.__onSizeTypeChangeHandler,
      );
    }
    if (this._armyInfo) {
      OuterCityManager.Instance.model.removeWorldArmyById(this._armyInfo.id);
      this._armyInfo.armyView = null;
    }
    this._armyInfo.petInfo.removeEventListener(
      ArmyEvent.PETINFO_CHANGED,
      this.__updatePetAvatarHandler,
      this,
    );
    if (this._attacking) {
      this._attacking.playing = false;
      this._attacking.dispose();
    }
    this._attacking = null;
    // if (isDie) return;
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    // ToolTipsManager.Instance.unRegister(this);
    super.dispose();
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    if (!this._avatar) return false;

    if (
      (this.parent as WorldWalkLayer).checkClickPlayerNum(
        evt.stageX,
        evt.stageY,
      )
    )
      return true;

    if ((<HeroAvatar>this._avatar).getCurrentPixels() < 50) {
      if (
        CursorManagerII.Instance.currentState !=
        CursorManagerII.PVP_ATTACT_CURSOR
      ) {
        OuterCityManager.Instance.mapView.worldWalkLayer.mouseClickHandler(
          null,
        );
      }
      return false;
    }
    if (
      this._armyInfo.baseHero.userId !=
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId
    ) {
      if (
        CursorManagerII.Instance.currentState ==
        CursorManagerII.PVP_ATTACT_CURSOR
      ) {
        OuterCityManager.Instance.model.selectPkArmy = this._armyInfo;
        return true;
      }
    }
    let info: ThaneInfo = this._armyInfo.baseHero;
    if (info.userId == this.selfUserId) {
      return false;
    }

    // this.showTip()
    // let menu:PlayerMenu = new PlayerMenu(false, false, false, false ,true);
    // menu.setData(info);
    // menu.x = StageReferance.stage.mouseX + menu.width >= StageReferance.stageWidth ? StageReferance.stageWidth - menu.width: StageReferance.stage.mouseX;
    // menu.y = StageReferance.stage.mouseY + menu.height >= StageReferance.stageHeight ? StageReferance.stageHeight - menu.height : StageReferance.stage.mouseY;
    // LayerManager.Instance.addToLayer(menu, LayerManager.GAME_MENU_LAYER);
    return true;
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    if (this._armyInfo.baseHero.userId == this.selfUserId) {
      this.mouseEnabled = false;
      return false;
    }
    if (this._avatar) {
      if (!evt) {
        this._filter.setLightFilter(this._avatar);
        return true;
      } else if ((<HeroAvatar>this._avatar).getCurrentPixels() > 50) {
        this._filter.setLightFilter(this._avatar);
        return true;
      } else {
        this._filter.setNormalFilter(this._avatar);
      }
    }
    return false;
  }

  private get selfUserId(): number {
    return PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
  }

  private returnCastle(): void {
    OuterCityManager.Instance.controler.sendReturnHomeArmy();
  }

  public armyBack(): void {
    let str: string = LangManager.Instance.GetTranslation(
      "map.OuterCityArmyView.command01",
    );
    MessageTipManager.Instance.show(str);
  }

  private __chatHandler(chatData: ChatData): void {
    let isOpen: boolean = ChatManager.Instance.getSwitchState(
      OuterCityManager.Instance.model.mapTempInfo.MessageBoxType,
    );
    if (!isOpen || chatData.uid == 0) {
      return;
    }
    if (
      chatData.channel != ChatChannel.TEAM &&
      chatData.channel != ChatChannel.WORLD &&
      chatData.channel != ChatChannel.BIGBUGLE &&
      chatData.channel != ChatChannel.CONSORTIA
    ) {
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

  protected setFireView(): void {
    if (!this._attacking) {
      this._attacking = fgui.UIPackage.createObject(
        EmWindow.OuterCity,
        "asset.outercity.AttackingAsset",
      ).asMovieClip;
      this._attacking.setPivot(0.5, 0.75, true);
      this._attacking.x = 0;
      this._attacking.y = -110;
    }
    if (this._isPlaying) {
      this.addChild(this._attacking.displayObject);
      this._attacking.playing = true;
    }
  }

  protected clearFireView(): void {
    if (this._attacking) {
      this._attacking.displayObject.removeSelf();
      this._attacking.playing = false;
      this._attacking.dispose();
      this._attacking = null;
    }
  }

  public get data(): UserArmy {
    return this._armyInfo;
  }

  public get isSelf(): boolean {
    if (this._armyInfo && this._armyInfo.baseHero) {
      return this._armyInfo.baseHero.userId == this.playerInfo.userId;
    }
    return false;
  }

  public get isTeammate() {
    if (!this.isSelf) {
      if (
        FreedomTeamManager.Instance.inMyTeam(
          this._armyInfo && this._armyInfo.userId,
        )
      ) {
        return true;
      }
    }
    return false;
  }

  protected changeLandEffect() {
    // if (SharedManager.Instance.hideOtherPlayer) {//需要隐藏
    //     if(this.isSelf && this._fateSkillEffect && !this._fateSkillEffect.visible){
    //         this._fateSkillEffect.visible = true;
    //         this.noShadow = false;
    //     }
    //     else if(this._fateSkillEffect && this._fateSkillEffect.visible){
    //         this._fateSkillEffect.visible = false;
    //         this.noShadow = true;
    //     }
    // } else {
    //     if(this._fateSkillEffect && !this._fateSkillEffect.visible){
    //         this._fateSkillEffect.visible = true;
    //         this.noShadow = false;
    //     }
    // }
  }

  private showFateSkill(b: boolean) {
    if (!this._fateSkillEffect) {
      return;
    }

    this._fateSkillEffect.visible = b;
  }

  public get sizeInfo() {
    return this._avatar && this._avatar.sizeInfo;
  }
}
