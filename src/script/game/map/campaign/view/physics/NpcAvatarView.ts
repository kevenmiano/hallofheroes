import Logger from "../../../../../core/logger/Logger";
import { AvatarActionType } from "../../../../avatar/data/AvatarActionType";
import { AvatarPosition } from "../../../../avatar/data/AvatarPosition";
import { AvatarStaticData } from "../../../../avatar/data/AvatarStaticData";
import { Avatar } from "../../../../avatar/view/Avatar";
import { SimpleAvatarView } from "../../../../avatar/view/SimpleAvatarView";
import {
  eFilterFrameText,
  FilterFrameText,
} from "../../../../component/FilterFrameText";
import { MovieClip } from "../../../../component/MovieClip";
import { AvatarResourceType } from "../../../../constant/AvatarDefine";
import { AvatarInfoTag } from "../../../../constant/Const";
import {
  AiEvents,
  AvatarInfoUIEvent,
  NotificationEvent,
  PhysicsEvent,
} from "../../../../constant/event/NotificationEvent";
import { JobType } from "../../../../constant/JobType";
import LoaderPriority from "../../../../constant/LoaderPriority";
import { CampaignManager } from "../../../../manager/CampaignManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { NotificationManager } from "../../../../manager/NotificationManager";
import { PathManager } from "../../../../manager/PathManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ResRefCountManager } from "../../../../managerRes/ResRefCountManager";
import ChatData from "../../../../module/chat/data/ChatData";
import { FollowTargetMediator } from "../../../../mvc/mediator/FollowTargetMediator";
import { NpcAlertMediator } from "../../../../mvc/mediator/NpcAlertMediator";
import { NpcAttackAndChaseMediator } from "../../../../mvc/mediator/NpcAttackAndChaseMediator";
import { NpcAttackIIMediator } from "../../../../mvc/mediator/NpcAttackIIMediator";
import { NpcEnterFightMediator } from "../../../../mvc/mediator/NpcEnterFightMediator";
import { NpcStateMediator } from "../../../../mvc/mediator/NpcStateMediator";
import { CampaignMapModel } from "../../../../mvc/model/CampaignMapModel";
import { NpcAttackHelper } from "../../../../utils/NpcAttackHelper";
import { SearchPathHelper } from "../../../../utils/SearchPathHelper";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import AIBaseInfo from "../../../ai/AIBaseInfo";
import NpcAiInfo from "../../../ai/NpcAiInfo";
import { ResourceLoaderInfo } from "../../../avatar/data/ResourceLoaderInfo";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { HumanAvatar } from "../../../avatar/view/HumanAvatar";
import { AiStateType } from "../../../space/constant/AiStateType";
import { NodeState } from "../../../space/constant/NodeState";
import { PosType } from "../../../space/constant/PosType";
import { SpeedEnumerate } from "../../../space/constant/SpeedEnumerate";
import Tiles from "../../../space/constant/Tiles";
import { CampaignNode } from "../../../space/data/CampaignNode";
import { MapPhysics } from "../../../space/data/MapPhysics";
import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import { eAvatarBaseViewType } from "../../../view/hero/AvatarBaseView";
import { HeroAvatarView } from "../../../view/hero/HeroAvatarView";
import { AvatarInfoUILayerHandler } from "../../../view/layer/AvatarInfoUILayer";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CollectionRobotData } from "../../data/CollectionRobotData";
import { CampaignWalkLayer } from "../layer/CampaignWalkLayer";
import { CampaignArmyView } from "./CampaignArmyView";

/**
 * @author:shujin.ou
 * @email:1009865728@qq.com
 * @data: 2020-12-14 20:17
 */
export class NpcAvatarView extends HeroAvatarView implements IBaseMouseEvent {
  protected _nodeInfo: MapPhysics;
  public static NAME: string = "map.campaign.view.npc.NpcAvatarView";
  protected _mediatorKey: string;
  public avatarBaseViewType: eAvatarBaseViewType =
    eAvatarBaseViewType.CampaignNpc;
  // private _chatPopView:ChatPopView;
  private _attackView: SimpleAvatarView;
  discriminator: string = "I-AM-A";
  IBaseMouseEvent: string = "IBaseMouseEvent";

  // private _testTip: FilterFrameText = new FilterFrameText(140, 20, undefined, 14);

  constructor($body: string, $weapons: string, $sex: number, $job: number) {
    super();
    this.autoSize = true;
    this.mouseEnabled = true;
    this.hitTestPrior = true;

    // // 测试
    // var img:Laya.Sprite = new Laya.Sprite();
    // img.loadImage("res/game/common/blank2.png");
    // img.pos(0, 0)
    // this.addChild(img)

    // this._testTip.y = 10;
    // this.addChild(this._testTip);
    // this._testTip.zOrder = 999;
  }

  getNpcTypes() {
    return this._nodeInfo.info.types;
  }

  protected setName(name: string = "", nameColor: number, grade?: number) {
    super.setName(name, nameColor, grade);
    this.setNameColor();
  }

  private setNameColor() {
    var mapId: number = CampaignManager.Instance.mapModel.mapId;
    var cInfo: CampaignNode = <CampaignNode>this._nodeInfo;
    var myTeamId: number = -1;
    var selfArmy: CampaignArmy =
      CampaignManager.Instance.mapModel.selfMemberData;
    if (selfArmy) {
      myTeamId = selfArmy.teamId;
    }
    let nameColor: number;
    if (WorldBossHelper.checkPvp(mapId)) {
      nameColor = cInfo.param1 == myTeamId ? 3 : 5;
    } else if (
      WorldBossHelper.checkGvg(mapId) &&
      this._nodeInfo.info.types == PosType.BOMBER_MAN
    ) {
      // if (cInfo.param1 == 0) {
      //     nameColor = 1
      // }
      // else if (cInfo.param1 == myTeamId) {
      //     nameColor = 3
      // }
      // else {
      //     nameColor = 5
      // }
      nameColor = cInfo.param1 == myTeamId ? 3 : 5;
    }
    if (cInfo.info.types == PosType.ROBOT) {
      nameColor = 1;
    }
    AvatarInfoUILayerHandler.handle_NAME_FRAME(
      this._uuid,
      nameColor,
      eFilterFrameText.AvatarName,
    );
  }

  public set info($baseInfo: AIBaseInfo) {
    super.info = $baseInfo;
    this.initDataImp();
    this.initSpeed();
  }

  public get info(): AIBaseInfo {
    return super.info;
  }

  public set nodeInfo(value: MapPhysics) {
    this._nodeInfo = value;
    this.refreshAvatarView();
    this.initDataImp();
    this.initSpeed();

    // this._testTip.text = (value as CampaignNode).nodeId + "," +(value as CampaignNode).nextNodeIds
  }

  public get nodeInfo(): MapPhysics {
    return this._nodeInfo;
  }

  private initSpeed() {
    if (this._nodeInfo && this.info) {
      if (this._nodeInfo.info.types == PosType.ROBOT) {
        this.info.speed = CampaignArmyView.DEFAULT_SPEED;
        return;
      } else if (WorldBossHelper.checkConsortiaDemon(this.mapModel.mapId)) {
        //公会魔神祭坛
        switch (this._nodeInfo.info.types) {
          case PosType.COPY_NPC:
            this.info.speed = SpeedEnumerate.DEMON_NORMAL_SPEED;
            break;
          case PosType.BOMBER_MAN:
            this.info.speed = SpeedEnumerate.DEMON_SPECIAL_SPEED;
            break;
        }
        return;
      }
    }
  }

  protected refreshAvatarView() {
    var cInfo: CampaignNode = <CampaignNode>this._nodeInfo;
    if (!cInfo) {
      return;
    }

    this.avatarView = new HeroAvatar(
      cInfo.sonType.toString(),
      AvatarResourceType.NPC,
      0,
      true,
    );
    this.objName = cInfo.info.names;
    // this.uuid = cInfo.nodeId.toString();
    //【【战场】玩家采集到矿后, 向NPC走动交矿的路上, 矿车顶上的文字消失了, 附视频】https://www.tapd.cn/36229514/bugtrace/bugs/view?bug_id=1136229514001030598
    this.uuid = (cInfo.nodeId + cInfo.followTarget).toString();

    cInfo.toward = cInfo.sizeType == 10 ? 0 : cInfo.toward;
    this.updateDirection(cInfo.toward);
    this.setName(cInfo.info.names, cInfo.nameColor, cInfo.info.grade);

    var args: object;
    var url: string;
    if (cInfo.info.types != PosType.ROBOT) {
      // Logger.log("[NpcAvatarView]refreshAvatarView !PosType.ROBOT")
      url = PathManager.getAvatarResourcePath(
        cInfo.sonType.toString(),
        -1,
        1,
        AvatarPosition.BODY,
        -1,
        AvatarResourceType.NPC,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.BODY,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.BODY,
        ),
        AvatarPosition.BODY,
      );

      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        LoaderPriority.Priority_7,
        null,
        null,
        null,
        null,
        args,
      );
      if (
        WorldBossHelper.checkCrystal(this.mapModel.mapId) &&
        cInfo.info.types == PosType.COPY_NPC
      ) {
        //采集本 蒂娜
        this._avatar.scaleX = this._avatar.scaleY = 0.85;
      }
    } else {
      // Logger.log("[NpcAvatarView]refreshAvatarView PosType.ROBOT")
      this.avatarView.type = AvatarResourceType.PLAYER_ARMY;
      var obj = CollectionRobotData.robotData[cInfo.sonType];
      var bodyAvatar: string = "/" + obj.body;
      var armyAvatar: string = "/" + obj.army;
      var job: number = obj.job;
      this._avatar.scaleX = this._avatar.scaleY = 0.85;

      url = PathManager.getAvatarResourcePath(
        bodyAvatar,
        obj.sex,
        1,
        AvatarPosition.BODY,
        -1,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.BODY,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.BODY,
        ),
        AvatarPosition.BODY,
      );
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        LoaderPriority.Priority_7,
        null,
        null,
        null,
        null,
        args,
      );

      url = PathManager.getAvatarResourcePath(
        armyAvatar,
        obj.sex,
        1,
        AvatarPosition.ARMY,
        -1,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.ARMY,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.ARMY,
        ),
        AvatarPosition.ARMY,
      );
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        LoaderPriority.Priority_7,
        null,
        null,
        null,
        null,
        args,
      );

      url = PathManager.getAvatarResourcePath(
        JobType.getDefaultHairUpByJob(job),
        obj.sex,
        1,
        AvatarPosition.HAIR_UP,
        -1,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.HAIR_UP,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.HAIR_UP,
        ),
        AvatarPosition.HAIR_UP,
      );
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        LoaderPriority.Priority_7,
        null,
        null,
        null,
        null,
        args,
      );

      url = PathManager.getAvatarResourcePath(
        JobType.getDefaultHairDownByJob(job),
        obj.sex,
        1,
        AvatarPosition.HAIR_DOWN,
        -1,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.HAIR_DOWN,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.HAIR_DOWN,
        ),
        AvatarPosition.HAIR_DOWN,
      );
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        LoaderPriority.Priority_7,
        null,
        null,
        null,
        null,
        args,
      );

      url = PathManager.getAvatarResourcePath(
        bodyAvatar + "_cloak",
        obj.sex,
        1,
        AvatarPosition.CLOAK,
        -1,
        AvatarResourceType.PLAYER_ARMY,
      );
      args = this.createResourceLoadInfo(
        url,
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.STAND,
          AvatarPosition.CLOAK,
        ),
        AvatarStaticData.getBaseNumByType(
          AvatarActionType.WALK,
          AvatarPosition.CLOAK,
        ),
        AvatarPosition.CLOAK,
      );
      ResRefCountManager.loadRes(
        url,
        this.loaderCompleteHandler.bind(this),
        null,
        Laya.Loader.ATLAS,
        LoaderPriority.Priority_7,
        null,
        null,
        null,
        null,
        args,
      );
    }
    if (cInfo.info.types == PosType.TRANSPORT_CAR) {
      this.mouseEnabled = false;
      this.avatarView.setShadowScaleXY(1.5, 1.5);
      this.avatarView.moveShadow(-68, -42);
    }
  }

  private initDataImp() {
    if (this._nodeInfo && this._info) {
      this.__updateNodeStateHandler(null);
      this.addEvent();
      this.initMediator();
    }
  }

  private initMediator() {
    if (!this._nodeInfo) {
      return;
    }
    if (this._nodeInfo.info.types == PosType.ROBOT) {
      return;
    }
    if (!CampaignManager.Instance.mapModel) {
      return;
    }

    var mapId: number = CampaignManager.Instance.mapModel.mapId;
    var arr: any[] = [NpcStateMediator];
    var para1: number = (<CampaignNode>this._nodeInfo).param1;
    var selfArmay: CampaignArmy =
      CampaignManager.Instance.mapModel.selfMemberData;
    var b: boolean = false;
    if (selfArmay && para1 > 0 && para1 == selfArmay.teamId) {
      b = true;
    }
    if (b) {
      b = this._nodeInfo.info.types == PosType.COPY_NPC;
    }
    if ((<CampaignNode>this._nodeInfo).attackTypes == 1) {
      arr.push(NpcAlertMediator);
      arr.push(NpcAttackAndChaseMediator);
      arr.push(NpcEnterFightMediator);
    } else if (
      !b &&
      this._nodeInfo.info.types != PosType.BOMBER_MAN &&
      this._nodeInfo.info.types != PosType.COLLECTION
    ) {
      //战场同team的npc不需要
      if (!WorldBossHelper.checkPetLand(mapId)) {
        // Logger.log("[NpcAvatarView]initMediator push NpcAttackIIMediator")
        arr.push(NpcAttackIIMediator);
      }
    }
    // Logger.log("[NpcAvatarView]initMediator", arr)
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      NpcAvatarView.NAME,
    );
  }

  protected addEvent() {
    super.addEvent();
    if (this._nodeInfo) {
      if (this._nodeInfo.info) {
        this._nodeInfo.info.addEventListener(
          PhysicsEvent.UP_STATE,
          this.__updateNodeStateHandler,
          this,
        );
      }
      this._nodeInfo.addEventListener(
        PhysicsEvent.UP_SONTYPE,
        this.__updateAvatarHandler,
        this,
      );
      this._nodeInfo.addEventListener(
        PhysicsEvent.FOLLOW_TARGET,
        this.__followTargetHandler,
        this,
      );
      this._nodeInfo.addEventListener(
        PhysicsEvent.CHAT_DATA,
        this.__chatDataHandler,
        this,
      );
      this._nodeInfo.addEventListener(
        PhysicsEvent.UPDATE_CUR_HP,
        this.__updateCurHpHandler,
        this,
      );
      this._nodeInfo.addEventListener(
        PhysicsEvent.MOVE_POS,
        this.__movePosHandler,
        this,
      );
    }
    if (this.info) {
      this.info.addEventListener(
        AiEvents.UPDATE_NEXT_POINT,
        this.__nextPointHandler,
        this,
      );
    }
    this.on(Laya.Event.DISPLAY, this, this.__addToStageHandler);
  }

  protected removeEvent() {
    super.removeEvent();
    if (this._nodeInfo) {
      if (this._nodeInfo.info) {
        this._nodeInfo.info.removeEventListener(
          PhysicsEvent.UP_STATE,
          this.__updateNodeStateHandler,
          this,
        );
      }
      this._nodeInfo.removeEventListener(
        PhysicsEvent.UP_SONTYPE,
        this.__updateAvatarHandler,
        this,
      );
      this._nodeInfo.removeEventListener(
        PhysicsEvent.FOLLOW_TARGET,
        this.__followTargetHandler,
        this,
      );
      this._nodeInfo.removeEventListener(
        PhysicsEvent.CHAT_DATA,
        this.__chatDataHandler,
        this,
      );
      this._nodeInfo.removeEventListener(
        PhysicsEvent.UPDATE_CUR_HP,
        this.__updateCurHpHandler,
        this,
      );
      this._nodeInfo.removeEventListener(
        PhysicsEvent.MOVE_POS,
        this.__movePosHandler,
        this,
      );
    }
    if (this.info) {
      this.info.removeEventListener(
        AiEvents.UPDATE_NEXT_POINT,
        this.__nextPointHandler,
        this,
      );
    }
    this.off(Laya.Event.DISPLAY, this, this.__addToStageHandler);
  }

  private __movePosHandler(evt: PhysicsEvent) {
    this.x = this._nodeInfo.x;
    this.y = this._nodeInfo.y;
  }

  private __chatDataHandler(chatData: ChatData) {
    // if (this._nodeInfo.chatData == null) {
    //     if (this._chatPopView) this._chatPopView.dispose(); this._chatPopView = null; return;
    // }
    // if (this._chatPopView) {
    //     this._chatPopView.dispose();
    //     this._chatPopView = null;
    // }
    // if (!this._chatPopView) {
    //     this._chatPopView = FUIHelper.createFUIInstance(EmPackName.Base, "ChatBubbleTip");
    //     this._chatPopView.x = - this._chatPopView.width / 2;
    //     this._chatPopView.y = this._npcName.y + 20 - this._chatPopView.height;
    //     this._chatPopView.updateContent(chatData.msg,this.__chatBackCall);
    //     this.addChild(this._chatPopView.displayObject);
    // }
  }

  public __chatBackCall() {
    // this._chatPopView = null;
  }

  private __addToStageHandler(evt: Event) {
    this.__followTargetHandler(null);
  }

  private __followTargetHandler(evt: PhysicsEvent) {
    if ((<CampaignNode>this._nodeInfo).followTarget) {
      MediatorMananger.Instance.addRegisterMediator(
        FollowTargetMediator,
        this,
        this._mediatorKey,
      );
      MediatorMananger.Instance.removeRegisterMediator(
        NpcAttackAndChaseMediator,
        this,
        this._mediatorKey,
      );
    } else {
      MediatorMananger.Instance.removeRegisterMediator(
        FollowTargetMediator,
        this,
        this._mediatorKey,
      );
    }
  }

  public get aiInfo(): AIBaseInfo {
    return this._info;
  }

  public execute() {
    if (this.info && this.info.isLiving) {
      var mapId: number = CampaignManager.Instance.mapModel
        ? CampaignManager.Instance.mapModel.mapId
        : 0;
      if (!WorldBossHelper.checkConsortiaDemon(mapId)) {
        super.execute();
      } else {
        if (
          this._info &&
          this._info.pathInfo &&
          this._info.pathInfo.length > this._info.walkIndex
        ) {
          this._isStand = false;
          if (this.info.currentFrame >= this.info.totalFrame) {
            if (!this._nodeInfo) {
              return;
            }
            var len: number = this._info.pathInfo.length;
            var offTime: number =
              PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond *
                1000 -
              (<CampaignNode>this._nodeInfo).createTime;
            var unitTime: number;
            var curPoint: Laya.Point;
            offTime = offTime < 0 ? 0 : offTime;
            switch (this._nodeInfo.info.types) {
              case PosType.BOMBER_MAN:
                unitTime = 400;
                break;
              default:
                unitTime = 800;
            }
            var frame = Math.ceil(offTime / unitTime);
            if (frame >= len) {
              curPoint = this._info.pathInfo[len - 1];
            } else {
              curPoint = this._info.pathInfo[frame];
            }

            if (
              new Laya.Point(this.x, this.y).distance(
                curPoint.x * 20,
                curPoint.y * 20,
              ) > 150
            ) {
              this.x = curPoint.x * 20;
              this.y = curPoint.y * 20;
              this._info.walkIndex = frame;
            }
            var nextPoint = this._info.pathInfo[this.info.walkIndexToNext];
            if (nextPoint) {
              this.nextWalk(nextPoint);
            }
          } else {
            this.info.currentFrame++;
            this.playMovie();
          }
        } else {
          if (this.info) {
            if (this.info.currentFrame < this.info.totalFrame - 1) {
              this.info.currentFrame++;
              this.playMovie();
              return;
            } else if (this.info.currentFrame == this.info.totalFrame - 1) {
              this.info.currentFrame++;
              this.playMovie();
            }
          }
          if (!this._isStand) {
            this.walkOver();
          }
          this._isStand = true;
        }
        if (this._avatar && this._isPlaying) {
          this._avatar.run();
          if (!this._isStand) {
            this._avatar.state = Avatar.WALK;
          }
        }
      }
    }
    if (this._attackView) {
      this._attackView.draw();
    }
  }

  public set isPlaying(value: boolean) {
    super.isPlaying = value;
  }

  public get isPlaying(): boolean {
    return this._isPlaying;
  }

  private __updateAvatarHandler(e: PhysicsEvent) {
    this.refreshAvatarView();
    super.info = this._info;
  }

  private __updateNodeStateHandler(evt: PhysicsEvent) {
    this.removeFireView();
    switch (this._nodeInfo.info.state) {
      case NodeState.DESTROYED:
      case NodeState.HIDE:
      case NodeState.NONE:
        this._info.isLiving = false;
        this.visible = false;
        Logger.info(
          "[NpcAvatarView]不可见状态",
          this.objName,
          this._nodeInfo.info.state,
        );
        break;
      case NodeState.FIGHTING:
        this._info.isLiving = true;
        this.aiInfo.pathInfo = [];
        this.visible = true;
        this.setFireView();
        Logger.info(
          "[NpcAvatarView]可见状态 交战中",
          this.objName,
          this._nodeInfo.info.state,
        );
        break;
      default:
        this._info.isLiving = true;
        this.visible = true;
        Logger.info(
          "[NpcAvatarView]可见状态",
          this.objName,
          this._nodeInfo.info.state,
        );
    }
    this.active = this.visible;
  }

  public set visible(value: boolean) {
    super.visible = value;
    this.displayVisible = value;
  }

  public get visible(): boolean {
    return super.visible;
  }

  private setFireView() {
    if (!this._attackView) {
      this._attackView = new SimpleAvatarView(
        110,
        110,
        PathManager.fightStatePath,
        10,
      );
    }
    this._attackView.drawFrame = 2;
    this.addChild(this._attackView);
    this._attackView.x = -55;
    this._attackView.y = -170;
  }

  private set displayVisible(value: boolean) {
    AvatarInfoUILayerHandler.handle_CON_VISIBLE(
      this._uuid,
      AvatarInfoTag.ConsortiaName,
      value,
    );
    // NotificationManager.Instance.dispatchEvent(AvatarInfoUIEvent.CON_VISIBLE, AvatarInfoTag.ConsortiaName, this._uuid, value)
    if (value) {
      if (this._avatar) {
        this.addChild(this._avatar);
      }
    } else {
      if (this._avatar) {
        this._avatar.removeSelf();
      }
    }
  }

  private removeFireView() {
    if (this._attackView) {
      this._attackView.dispose();
    }
    this._attackView = null;
    if (this._bloodMc) {
      if (this._bloodMc.parent) {
        this._bloodMc.parent.removeChild(this._bloodMc);
      }
      this._bloodMc.stop();
      this._bloodMc = null;
    }
  }

  private _bloodMc: MovieClip;

  private __updateCurHpHandler(evt: PhysicsEvent) {
    // if (!this._bloodMc) this._bloodMc = ComponentFactory.Instance.creatCustomObject("asset.campaign.map.BloodAsset");
    // this._bloodMc.play();
    // this.addChild(this._bloodMc);
    // this._bloodMc.y = this._bloodMc.height;
    // this._bloodMc.bloodMc.gotoAndStop(number(((< CampaignNode > this._nodeInfo).curHp / (< CampaignNode > this._nodeInfo).totalHp) * 100));
  }

  protected nextWalk(point: Laya.Point) {
    super.nextWalk(point);
    if (!this._nodeInfo) return;
    if (this.aiInfo.moveState == AiStateType.NPC_FOLLOW_STATE) {
      (<CampaignNode>this._nodeInfo).curPosX = point.x;
      (<CampaignNode>this._nodeInfo).curPosY = point.y;
    }
  }

  private __nextPointHandler(data: any) {
    // Logger.log("[NpcAvatarView]__nextPointHandler")
    var cur: Laya.Point = new Laya.Point(this.x, this.y);
    var next: Laya.Point = data;
    var leng: number = next.distance(cur.x, cur.y);
    if (leng < 20) {
      this.info.pathInfo = [];
      return;
    } else {
      cur = this.mapModel.getNeighborII(cur.x / 20, cur.y / 20);
      next = this.mapModel.getNeighborII(next.x / 20, next.y / 20);
      if (!cur || !next) {
        return;
      }
      cur.x = cur.x * 20;
      cur.y = cur.y * 20;
      next.x = next.x * 20;
      next.y = next.y * 20;
      this.info.pathInfo = SearchPathHelper.searchPath(cur, next);
    }
  }

  protected get mapModel(): CampaignMapModel {
    return CampaignManager.Instance.mapModel;
  }

  protected walkOver() {
    super.walkOver();
    this.standImp();
    this.npcAiInfo.moveState = AiStateType.STAND;
  }

  protected loaderCompleteHandler(res: any, info: ResourceLoaderInfo) {
    super.loaderCompleteHandler(res, info);
    if (info.url.indexOf("body") >= 0 || info.url.indexOf("npc") >= 0) {
      this.layouTextView(info.url);
    }
  }

  private layouTextView(key: string) {
    // var posData = LoaderHeaderList.avatarShowNamePos[key];
    // this._showNamePosY = this.defShowNpcNamePosY;
    // if (posData) {
    //     if (posData.showNamePosY) {
    //         this._showNamePosY = posData.showNamePosY;
    //     }
    //     if (posData.hasOwnProperty("noShadow")) {
    //         this.noShadow = posData.noShadow;
    //     }
    //     if (posData.hasOwnProperty("curTotalFrameX")) {
    //         this._avatar.curTotalFrameX = posData.curTotalFrameX;
    //     }
    // }
    // AvatarInfoUILayerHandler.handle_CON_POSY(this._uuid, this.y + this._showNamePosY)
    NotificationManager.Instance.sendNotification(
      NotificationEvent.NPC_LOAD_COMPLETE,
      this,
    );
  }

  public dispose() {
    if (this.nodeInfo instanceof CampaignNode) {
      (<CampaignNode>this.nodeInfo).curPosX = this.x / Tiles.WIDTH;
      (<CampaignNode>this.nodeInfo).curPosY = this.y / Tiles.HEIGHT;
    }
    this.removeFireView();
    this.removeEvent();
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    super.dispose();
    if (this._nodeInfo instanceof CampaignNode) {
      this._nodeInfo["nodeView"] = null;
    }
    this._nodeInfo = null;
    // if (this._chatPopView) this._chatPopView.dispose(); this._chatPopView = null;
  }

  // 不开启这个可能会出现怪(sizetype)较大, 会挡住npc, 如公会BOSS副本
  public mouseClickHandler(evt: Laya.Event): boolean {
    let pix = this.getCurrentPixels();
    if (this._hitTestAlpha && pix <= 50) {
      return false;
    } else {
      var mapId: number = CampaignManager.Instance.mapModel.mapId;
      if (WorldBossHelper.checkPvp(mapId)) {
        (this.parent as CampaignWalkLayer).checkClickPlayerNum(
          evt.stageX,
          evt.stageY,
        );
        return true;
      }
    }
    CampaignManager.Instance.mapModel.selectNode = this
      ._nodeInfo as CampaignNode; //设置选中节点, 用于在enterframe中的检测
    if (
      CampaignManager.Instance.mapModel.chckeNpcFriendState(
        this._nodeInfo as CampaignNode,
      )
    ) {
      return false;
    }
    return this.attackFun();
  }

  public attackFunEx(): boolean {
    if (
      CampaignManager.Instance.mapModel.chckeNpcFriendState(
        this._nodeInfo as CampaignNode,
      )
    ) {
      var mapId: number = CampaignManager.Instance.mapModel.mapId;
      if (!WorldBossHelper.checkPvp(mapId)) {
        return false;
      }
    }
    CampaignManager.Instance.mapModel.selectNode = this
      ._nodeInfo as CampaignNode;
    this.attackFun();
  }

  public attackFun(): boolean {
    if (!this.mapModel.mapTielsData) {
      return false;
    }

    if (this._nodeInfo.info.types == PosType.BOMBER_MAN) {
      var teamId: number = (<CampaignNode>this._nodeInfo).param1;
      if (teamId > 0 && this.mapModel.selfMemberData.teamId == teamId) {
        return false;
      }
      NotificationManager.Instance.dispatchEvent(
        NotificationEvent.LOCK_PVP_WARFIGHT,
        this._nodeInfo,
      );
      return true;
    }

    if (this._nodeInfo.info.state == NodeState.FIGHTING) {
      if (
        this._nodeInfo.info.types == PosType.COLLECTION ||
        this._nodeInfo.info.types == PosType.TREASURE_HUNTER
      ) {
        CampaignManager.Instance.mapModel.selectNode = null;
        return true;
      }
    } else {
      if (this._nodeInfo.info.types == PosType.COLLECTION) {
        //pet
        NotificationManager.Instance.sendNotification(
          NotificationEvent.CHASE_NPC,
          this.nodeInfo,
        );
        return true;
      }
    }
    var armyView: CampaignArmy = this.mapModel.selfMemberData;
    if (!armyView) {
      return false;
    }
    var aView = CampaignManager.Instance.controller.getArmyView(armyView);
    var attackPoint = NpcAttackHelper.getAttackPoint(
      <CampaignNode>this.nodeInfo,
      new Laya.Point(aView.x, aView.y),
      new Laya.Point(this.x, this.y),
    );
    CampaignManager.Instance.controller.moveArmyByPos(
      attackPoint.x,
      attackPoint.y,
      false,
      true,
    );
    return true;
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    var canAttack: boolean = false;
    if (
      CampaignManager.Instance.mapModel.chckeNpcFriendState(
        <CampaignNode>this._nodeInfo,
      )
    ) {
      return canAttack;
    }
    if (this._avatar) {
      var teamId: number = (<CampaignNode>this._nodeInfo).param1;
      if (
        this._nodeInfo.info.types != PosType.COPY_NPC_HANDLER &&
        teamId > 0 &&
        this.mapModel.selfMemberData.teamId == teamId
      ) {
        return canAttack;
      }
      canAttack = true;
      if (this._nodeInfo.info.types == PosType.COPY_NPC_HANDLER) {
        //资源回收官
        if (teamId > 0 && this.mapModel.selfMemberData.teamId == teamId) {
          canAttack = false;
        } else {
          canAttack = true;
        }
      }
      if (!evt) {
        // this._filter.setGlowFilter(this._avatar.contentBitmap);
        return canAttack;
      } else if ((<HumanAvatar>this._avatar).getCurrentPixels() > 50) {
        // this._filter.setGlowFilter(this._avatar.contentBitmap);
        return canAttack;
      } else {
        // this._filter.setNormalFilter(this._avatar.contentBitmap);
      }
    }
    return false;
  }

  private throughDispatch(evt: MouseEvent) {
    var arr: any[] = CampaignManager.Instance.mapModel.mapNodesData;
    if (!arr) return;
    for (let index = 0; index < arr.length; index++) {
      const node = arr[index];
      if (NodeState.displayState(node.info.state)) {
        if (node.nodeView && node.nodeView.stage) {
          var rect: Laya.Rectangle = node.nodeView.getRect(this.stage);
          if (rect.contains(evt.screenX, evt.screenY)) {
            node.nodeView.dispatchEvent(evt);
            return;
          }
        }
      }
    }
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    // this._filter.setNormalFilter(this._avatar.contentBitmap);//未使用
    return true;
  }

  public get npcAiInfo(): NpcAiInfo {
    return <NpcAiInfo>this._info;
  }
}
