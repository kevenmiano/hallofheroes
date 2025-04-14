import { CampaignArmyViewHelper } from "../../CampaignArmyViewHelper";
import { DisplayObject } from "../../../../component/DisplayObject";
import {
  FilterFrameText,
  eFilterFrameText,
} from "../../../../component/FilterFrameText";
import { SimpleMovie } from "../../../../component/tools/SimpleMovie";
import {
  ConsortiaEvent,
  PhysicsEvent,
} from "../../../../constant/event/NotificationEvent";
import { EmPackName, EmWindow } from "../../../../constant/UIDefine";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { ConsortiaManager } from "../../../../manager/ConsortiaManager";
import MediatorMananger from "../../../../manager/MediatorMananger";
import { PathManager } from "../../../../manager/PathManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import { ConsortiaTreeExpView } from "../../../../module/consortia/view/ConsortiaTreeExpView";
import { NpcArriveMediator } from "../../../../mvc/mediator/NpcArriveMediator";
import ComponentSetting from "../../../../utils/ComponentSetting";
import { WorldBossHelper } from "../../../../utils/WorldBossHelper";
import { NodeState } from "../../../space/constant/NodeState";
import { PosType } from "../../../space/constant/PosType";
import { CampaignNode } from "../../../space/data/CampaignNode";
import { MapPhysics } from "../../../space/data/MapPhysics";
import { MapPhysicsAttackingBase } from "../../../space/view/physics/MapPhysicsAttackingBase";
import { ConsortiaDemonInfo } from "../../../../module/consortia/data/ConsortiaDemonInfo";
import { ConsortiaSecretInfo } from "../../../../module/consortia/data/ConsortiaSecretInfo";

export class CampaignNpcView extends MapPhysicsAttackingBase {
  public static NAME: string =
    "map.campaign.view.physics.physicsview.CampaignNpcView";
  private _mediatorKey: string;
  private _npcName: FilterFrameText = new FilterFrameText(
    140,
    20,
    undefined,
    14,
  );
  private _bloodMc: fgui.GProgressBar;
  private _waterLayer: ConsortiaTreeExpView;

  // private static colorTransform : SimpleNodeColorTransform = new SimpleNodeColorTransform();
  constructor() {
    super();
  }

  public get info(): MapPhysics {
    return super.info;
  }

  public set info(value: MapPhysics) {
    super.info = value;
    this.initMediator();
    value.info.addEventListener(
      PhysicsEvent.UP_STATE,
      this.__updateNodeStateHandler,
      this,
    );
    value.addEventListener(
      PhysicsEvent.VISIT_USER_ID,
      this.__updateVisitUserIdHandler,
      this,
    );
    value.addEventListener(
      PhysicsEvent.UPDATE_CUR_HP,
      this.__updateCurHpHandler,
      this,
    );
    value.addEventListener(PhysicsEvent.MOVE_POS, this.__movePosHandler, this);
    value.addEventListener(PhysicsEvent.PARA_1, this.__para1Handler, this);
    if (CampaignArmyViewHelper.checkTreeNode(<CampaignNode>value)) {
      //公会秘境神树
      this._waterLayer = new ConsortiaTreeExpView();
      this._waterLayer.x = -20;
      this.addChild(this._waterLayer);
    }
    if (CampaignArmyViewHelper.checkDemonAltarNode(<CampaignNode>value)) {
      //公会魔神祭坛主祭坛
      if (!this._bloodMc) {
        this._bloodMc = fgui.UIPackage.createObject(
          EmPackName.Base,
          "NpcBloodBar",
        ).asProgress;
      }
      let dura: number = ConsortiaManager.Instance.model.demonInfo.durability;
      this._bloodMc.min = 0;
      this._bloodMc.max = ConsortiaDemonInfo.MAX_ALTAR_DURA;
      this._bloodMc.value = dura;
      this.layouCallBack();
      this.addChild(this._bloodMc.displayObject);
      ConsortiaManager.Instance.model.demonInfo.addEventListener(
        ConsortiaEvent.DEMON_DURA_CHANGE,
        this.__demonAltarDuraUpdateHandler,
        this,
      );
    }
    this.__updateNodeStateHandler(null); //先状态
    this.__updateVisitUserIdHandler(null); //后根据记录
  }

  protected initView() {
    super.initView();
    let frame = 6;
    if (WorldBossHelper.checkGvg(this.mapId)) {
      frame = this.gvgNameColor();
    }
    this._npcName.text = this.info.info.names;
    this._npcName.setStroke(0, 1);
    this._npcName.y = -10;
    this._npcName.setFrame(frame, eFilterFrameText.AvatarName);
  }

  private gvgNameColor(): number {
    let frame: number = 1;
    if (WorldBossHelper.checkGvg(this.mapId)) {
      let selfTeam: number =
        CampaignManager.Instance.mapModel.selfMemberData.teamId;
      let teamId: number = (<CampaignNode>this.info).param1;
      if (teamId == 0) {
        frame = 1;
      } else if (teamId != selfTeam) {
        frame = 5;
      } else {
        frame = 3;
      }
    }
    return frame;
  }

  private initMediator() {
    if (!this.info || !this.info.info) {
      return;
    }
    let arr: any[] = [];
    switch (this.info.info.types) {
      case PosType.TOWER_DEFENCE:
        arr.push(NpcArriveMediator);
        break;
    }
    this._mediatorKey = MediatorMananger.Instance.registerMediatorList(
      arr,
      this,
      CampaignNpcView.NAME,
    );
  }

  private __updateCurHpHandler(evt: PhysicsEvent) {
    if ((this.info as CampaignNode).curHp == 0 && this._bloodMc) {
      this._bloodMc.displayObject.removeSelf();
      return;
    }
    if (!this._bloodMc) {
      if (WorldBossHelper.checkGvg(this.mapId)) {
        this._bloodMc = fgui.UIPackage.createObject(
          EmPackName.Base,
          "NpcBloodBar",
        ).asProgress;
        this.layouCallBack();
      } else {
        this._bloodMc = fgui.UIPackage.createObject(
          EmPackName.Base,
          "BloodBar",
        ).asProgress;
        this._bloodMc.y = this._bloodMc.height;
      }
    }
    this.addChild(this._bloodMc.displayObject);
    this._bloodMc.min = 0;
    this._bloodMc.max = (this.info as CampaignNode).totalHp;
    this._bloodMc.value = (this.info as CampaignNode).curHp;
  }

  private get mapId(): number {
    return CampaignManager.Instance.mapModel.mapId;
  }

  private __para1Handler(evt: PhysicsEvent) {
    if (WorldBossHelper.checkGvg(this.mapId) && this._npcName) {
      this._npcName.color = ComponentSetting.setColor(this.gvgNameColor());
    }
  }

  private __movePosHandler(evt: PhysicsEvent) {
    this.x = this.info.x;
    this.y = this.info.y;
  }

  private __updateVisitUserIdHandler(evt: PhysicsEvent) {
    if (this.visitUserId) {
      this.info.info.state = NodeState.DESTROYED;
    }
  }

  private checkInVisituserIds(
    idArr: Array<number>,
    serverNameArr: Array<string>,
  ): boolean {
    let flag: boolean = false;
    let userId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let serverName: string =
      PlayerManager.Instance.currentPlayerModel.playerInfo.serviceName;
    if (idArr && serverNameArr) {
      let len: number = idArr.length;
      for (let i: number = 0; i < len; i++) {
        if (idArr[i] == userId && serverNameArr[i] == serverName) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  }

  private get visitUserId(): boolean {
    let userId: number =
      PlayerManager.Instance.currentPlayerModel.playerInfo.userId;
    let nodeInfo: CampaignNode = <CampaignNode>this.info;
    if (nodeInfo) {
      if (
        nodeInfo.visitUserIds &&
        nodeInfo.visitServerNames &&
        nodeInfo.visitServerNames.length > 0
      ) {
        if (
          this.checkInVisituserIds(
            nodeInfo.visitUserIds,
            nodeInfo.visitServerNames,
          )
        ) {
          return true;
        }
      } else {
        if (nodeInfo.visitUserIds) {
          if (nodeInfo.visitUserIds.indexOf(userId) != -1) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private __updateNodeStateHandler(evt) {
    if (this.visitUserId && this.info.info.state != NodeState.DESTROYED) {
      this.info.info.state = NodeState.DESTROYED;
      return;
    }
    this.visible = true;
    this.active = true;
    switch (this.info.info.state) {
      case NodeState.FRIENDLY:
      case NodeState.EXIST:
      case NodeState.FIGHTING:
      case NodeState.STATE2:
      case NodeState.STATE3:
        this.initView();
        this.setNomalView();
        this.__para1Handler(null);
        this.gotoAndPlayCall(NodeState.getStateValue(this.info.info.state));
        if (!this.parent && this._currentParent) {
          this._currentParent.addChild(this);
        }
        break;
      case NodeState.NONE:
        this.setClearView();
        break;
      case NodeState.DESTROYED:
      case NodeState.HIDE:
        if (this.parent) {
          this._currentParent = this.parent;
          this.parent.removeChild(this);
        }
        break;
    }
  }

  private __demonAltarDuraUpdateHandler() {
    if (this._bloodMc) {
      let dura: number = ConsortiaManager.Instance.model.demonInfo.durability;
      this._bloodMc.value = dura;
    }
  }

  private __consortiaTreeStateUpdateHandler() {
    switch (ConsortiaManager.Instance.model.secretInfo.oper) {
      case ConsortiaSecretInfo.GIVE_POWER_STATE:
        this.disposeTreeOperEffect();
        this.showGivePowerEffect();
        break;
    }
    this.refreshTreeViewByState();
  }

  private refreshTreeViewByState() {
    this.clearHasOperEffect();
    let target: DisplayObject;
    switch (ConsortiaManager.Instance.model.secretInfo.treeState) {
      case ConsortiaSecretInfo.GIVE_POWER_STATE:
        // target = this._givePowerImg;
        break;
    }
    if (!target) {
      return;
    }
    //     this._hasOperEffect.gotoAndStop(1);
    //     this._hasOperEffect["box"].addChild(target);
    //     this._hasOperEffect.play();
    //     this.addChild(this._hasOperEffect);
  }

  private clearHasOperEffect() {
    // if (this._givePowerImg && this._givePowerImg.parent) this._givePowerImg.parent.removeChild(this._givePowerImg);
    // if (this._pickImg && this._pickImg.parent) this._pickImg.parent.removeChild(this._pickImg);
    // if (this._hasOperEffect) {
    //     this._hasOperEffect.stop();
    //     if (this._hasOperEffect.parent) this._hasOperEffect.parent.removeChild(this._hasOperEffect);
    // }
  }

  private clearTreeOperEffect() {
    this._givePowerEffect = null;
  }

  private disposeTreeOperEffect() {
    if (this._givePowerEffect) {
      this._givePowerEffect.dispose();
    }
    this._givePowerEffect = null;
  }

  private _givePowerEffect: SimpleMovie;

  private showGivePowerEffect() {
    // AudioManager.Instance.play(SoundIds.WATER_TREE_GIVEPOW_SOUND);
    // if(!this._givePowerEffect) this._givePowerEffect = new SimpleMovie(ComponentFactory.Instance.creat("asset.campaign.WaterEffect"),this.clearTreeOperEffect);
    // this._givePowerEffect.x = -27;
    // this._givePowerEffect.y = -160;
    // this.addChild(this._givePowerEffect);
  }

  private _currentParent: Laya.Node;

  protected setClearView() {
    this.setSwf();
  }

  public get resourcesPath(): string {
    return PathManager.solveMapPhysicsBySonType(
      (<CampaignNode>this.info).sonType,
    );
  }

  protected layouCallBack() {
    if (this.isRemoveStage || !this._npcName) {
      return;
    }
    this._npcName.x = this.moviePos.x;
    this._npcName.y = this.moviePos.y;
    if (this._isPlaying) {
      this.addChild(this._npcName);
    }
    if (
      WorldBossHelper.checkGvg(this.mapId) ||
      CampaignArmyViewHelper.checkDemonAltarNode(this.info as CampaignNode)
    ) {
      if (this._bloodMc) {
        this._bloodMc.x = this.moviePos.x;
        this._bloodMc.y = this.moviePos.y + 100;
        this._npcName.y = this._bloodMc.y - 30;
      }
    }
  }

  public dispose() {
    MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
    this.disposeTreeOperEffect();
    // if (this._givePowerImg) {
    //     if (this._givePowerImg.parent) this._givePowerImg.parent.removeChild(this._givePowerImg);
    //     if (this._givePowerImg.bitmapData) this._givePowerImg.bitmapData.dispose(); this._givePowerImg.bitmapData = null;
    //     this._givePowerImg = null;
    // }
    // if (this._pickImg) {
    //     if (this._pickImg.parent) this._pickImg.parent.removeChild(this._pickImg);
    //     if (this._pickImg.bitmapData) this._pickImg.bitmapData.dispose(); this._pickImg.bitmapData = null;
    //     this._pickImg = null;
    // }
    // if (this._hasOperEffect) {
    //     if (this._hasOperEffect.parent) {
    //         this._hasOperEffect.parent.removeChild(this._hasOperEffect);
    //     }
    //     this._hasOperEffect.stop();
    //     this._hasOperEffect = null;
    // }
    // if (this._nameBg) this._nameBg.dispose(); this._nameBg = null;
    // if (this._treeExpView) this._treeExpView.dispose(); this._treeExpView = null;
    if (this.info) {
      this.info.info.removeEventListener(
        PhysicsEvent.UP_STATE,
        this.__updateNodeStateHandler,
        this,
      );
      this.info.removeEventListener(
        PhysicsEvent.VISIT_USER_ID,
        this.__updateVisitUserIdHandler,
        this,
      );
      this.info.removeEventListener(
        PhysicsEvent.UPDATE_CUR_HP,
        this.__updateCurHpHandler,
        this,
      );
      this.info.removeEventListener(
        PhysicsEvent.MOVE_POS,
        this.__movePosHandler,
        this,
      );
      this.info.removeEventListener(
        PhysicsEvent.PARA_1,
        this.__para1Handler,
        this,
      );
      if (this.info instanceof CampaignNode) {
        this.info["nodeView"] = null;
      }
      if (this.info instanceof CampaignNode) {
        this.info["preParent"] = null;
      }
    }
    if (this._bloodMc) {
      this._bloodMc.displayObject.removeSelf();
      this._bloodMc.dispose();
    }
    this._bloodMc = null;
    this._currentParent = null;
    ConsortiaManager.Instance.model.secretInfo.removeEventListener(
      ConsortiaEvent.TREE_STATE_UPDATE,
      this.__consortiaTreeStateUpdateHandler,
      this,
    );
    ConsortiaManager.Instance.model.demonInfo.removeEventListener(
      ConsortiaEvent.DEMON_DURA_CHANGE,
      this.__demonAltarDuraUpdateHandler,
      this,
    );
    super.dispose();
  }

  public set isPlaying(value: boolean) {
    super.isPlaying = value;
    if (value) {
      if (this._npcName) {
        this.addChild(this._npcName);
      }
    } else {
      if (this._npcName && this._npcName.parent) {
        this._npcName.parent.removeChild(this._npcName);
      }
    }
  }

  public showName(b: boolean) {
    if (this._npcName) {
      this._npcName.visible = b;
      this._npcName.active = b;
    }
  }
}
