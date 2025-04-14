import ObjectUtils from "../../../core/utils/ObjectUtils";
import {
  CampaignEvent,
  NotificationEvent,
  TaskEvent,
} from "../../constant/event/NotificationEvent";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { NotificationManager } from "../../manager/NotificationManager";
import { TaskManage } from "../../manager/TaskManage";
import { NpcLayer } from "../../map/campaign/view/layer/NpcLayer";
import { NpcAvatarView } from "../../map/campaign/view/physics/NpcAvatarView";
import { PosType } from "../../map/space/constant/PosType";
import { CampaignNode } from "../../map/space/data/CampaignNode";
import OneStatusButton from "../../component/OneStatusButton";
import ResMgr from "../../../core/res/ResMgr";
import { PathManager } from "../../manager/PathManager";
import PetBossModel from "../../module/petguard/PetBossModel";
import { MsgMan } from "../../manager/MsgMan";
import { WorldBossHelper } from "../../utils/WorldBossHelper";
import { IEnterFrame } from "@/script/game/interfaces/EnterFrame";
import { EnterFrameManager } from "../../manager/EnterFrameManager";

export class PetLandUIMediator implements IMediator, IEnterFrame {
  private _btnDic: Map<NpcAvatarView, OneStatusButton> = new Map();
  private _itemDic: Map<OneStatusButton, NpcAvatarView> = new Map();
  private _uiSprite: Laya.Sprite;
  private _npcLayer: NpcLayer;
  private _petBossModel: PetBossModel;
  private _frameCount: number = 0;

  enterFrame() {
    this._frameCount++;
    if (this._frameCount >= 24) {
      this.addAllBtn();
      this._frameCount = 0;
    }
  }

  public register(target: object): void {
    this._npcLayer = CampaignManager.Instance.mapView.npcLayer;
    this._uiSprite = new Laya.Sprite();
    (<Laya.Sprite>target).addChild(this._uiSprite);
    this._petBossModel = CampaignManager.Instance.petBossModel;

    this.addEvent();
    this.__petBossSwitchHandler(null, null);
    EnterFrameManager.Instance.registeEnterFrame(this);
  }

  private addEvent(): void {
    if (TaskManage.Instance.cate) {
      TaskManage.Instance.cate.addEventListener(
        TaskEvent.TASK_ADDED,
        this.__refreshTaskHandler,
        this,
      );
      TaskManage.Instance.cate.addEventListener(
        TaskEvent.TASK_REMOVE,
        this.__refreshTaskHandler,
        this,
      );
    }
    NotificationManager.Instance.addEventListener(
      NotificationEvent.NPC_LOAD_COMPLETE,
      this.layout,
      this,
    );
    MsgMan.addObserver(
      CampaignEvent.PET_BOSS_SWITCH,
      this,
      this.__petBossSwitchHandler,
    );
  }

  private removeEvent(): void {
    if (TaskManage.Instance.cate) {
      TaskManage.Instance.cate.removeEventListener(
        TaskEvent.TASK_ADDED,
        this.__refreshTaskHandler,
        this,
      );
      TaskManage.Instance.cate.removeEventListener(
        TaskEvent.TASK_REMOVE,
        this.__refreshTaskHandler,
        this,
      );
    }
    NotificationManager.Instance.removeEventListener(
      NotificationEvent.NPC_LOAD_COMPLETE,
      this.layout,
      this,
    );
    MsgMan.removeObserver(
      CampaignEvent.PET_BOSS_SWITCH,
      this,
      this.__petBossSwitchHandler,
    );
  }

  private __petBossSwitchHandler(msg: string, obj: object): void {
    if (WorldBossHelper.checkInPetBossFloor(CampaignManager.Instance.mapId)) {
      // this.addAllBtn();
    } else {
      let npcs: NpcAvatarView[] = this._npcLayer.avatarList;
      for (let i = 0, len = npcs.length; i < len; i++) {
        const npcTarget = npcs[i];
        // if(!(npcTarget && npcTarget.nodeInfo && npcTarget.nodeInfo.info))
        // {
        //     continue;
        // }
        let nodeInfo: CampaignNode = npcTarget.nodeInfo as CampaignNode;
        let btn: OneStatusButton = this._btnDic.get(npcTarget);
        if (nodeInfo.param4 == "3" && btn) {
          btn.off(Laya.Event.CLICK, this, this.__onClickHandler);
          btn.off(Laya.Event.MOUSE_OVER, this, this.__onOverHandler);
          btn.off(Laya.Event.MOUSE_OUT, this, this.__onOutHandler);
          ObjectUtils.disposeObject(btn);

          this._itemDic.set(btn, null);
          this._itemDic.delete(btn);
          break;
        }
      }
    }
    // TopToolsBar.instance.show();
    // if(TaskTraceBar.instance.isLoaded)TaskTraceBar.instance.show();
  }

  private __refreshTaskHandler(): void {
    let npcs: NpcAvatarView[] = this._npcLayer.avatarList;
    for (let i = 0, len = npcs.length; i < len; i++) {
      const npcTarget = npcs[i];
      if (!(npcTarget && npcTarget.nodeInfo && npcTarget.nodeInfo.info)) {
        continue;
      }
      if (npcTarget.nodeInfo.info.types != PosType.COPY_HANDLER) {
        continue;
      }
      let nodeInfo: CampaignNode = npcTarget.nodeInfo as CampaignNode;
      if (nodeInfo && nodeInfo.param4 == "1") {
        //要有921任务才能显示
        let btn: OneStatusButton = this._btnDic.get(npcTarget);
        if (btn) {
          let flag: boolean = TaskManage.Instance.cate.hasTaskAndNotCompleted(
            TaskManage.PET_SYSTEM_OPEN_TASK02,
          );
          btn.visible = flag;
        }
      }
    }
  }

  public unregister(target: object): void {
    this.removeEvent();
    this.clearAllBtn();
    ObjectUtils.disposeObject(this._uiSprite);
    this._uiSprite = null;
    this._petBossModel = null;
    EnterFrameManager.Instance.unRegisteEnterFrame(this);
  }

  private layout(npcTarget: NpcAvatarView): void {
    if (!this._btnDic.get(npcTarget)) {
      return;
    }
    let btn: OneStatusButton = this._btnDic.get(npcTarget);
    if (btn) {
      btn.y = npcTarget.y - btn.height + npcTarget.showNamePosY;
    }
  }

  private addAllBtn(): void {
    let npcs: NpcAvatarView[] = this._npcLayer.avatarList;
    for (let i = 0, len = npcs.length; i < len; i++) {
      const npcTarget = npcs[i];
      if (npcTarget.nodeInfo.info.types != PosType.COPY_HANDLER) {
        continue;
      }
      let nodeInfo: CampaignNode = npcTarget.nodeInfo as CampaignNode;
      let btn: OneStatusButton = this._btnDic.get(npcTarget);
      if (btn) {
        this._itemDic.set(btn, npcTarget);
        if (!btn.parent) {
          btn.x = npcTarget.x - btn.width / 2;
          btn.y = npcTarget.y - btn.height + npcTarget.showNamePosY;
          this._uiSprite.addChild(btn);
        }

        if (nodeInfo.param4 == "1") {
          //要有921任务才能显示
          let flag: boolean = TaskManage.Instance.cate.hasTaskAndNotCompleted(
            TaskManage.PET_SYSTEM_OPEN_TASK02,
          );
          btn.visible = flag;
        }
      } else {
        let path: string = PathManager.getNpcBtnPath();
        ResMgr.Instance.loadRes(path, (res) => {
          if (res) {
            let path: string =
              "res/game/common/map.space.NPCBtn" + nodeInfo.sonType + ".png";
            if (nodeInfo.param4 == "3") {
              //英灵岛boss
              path = "res/game/common/map.space.NPCBtnAttack.png";
            }
            let texture = ResMgr.Instance.getRes(path) as Laya.Texture;
            btn = new OneStatusButton();
            btn.graphics.drawImage(
              texture,
              (texture.width - texture.sourceWidth) / 2,
              0,
              texture.sourceWidth,
              texture.sourceHeight,
            );
            btn.on(Laya.Event.CLICK, this, this.__onClickHandler);
            btn.on(Laya.Event.MOUSE_OVER, this, this.__onOverHandler);
            btn.on(Laya.Event.MOUSE_OUT, this, this.__onOutHandler);
            this._btnDic.set(npcTarget, btn);
            this._itemDic.set(btn, npcTarget);
            if (!btn.parent) {
              btn.x = npcTarget.x - btn.width / 2;
              btn.y = npcTarget.y - btn.height + npcTarget.showNamePosY;
              if (this._uiSprite) {
                this._uiSprite.addChild(btn);
              }
            }
            if (nodeInfo.param4 == "1") {
              //要有921任务才能显示
              let flag: boolean =
                TaskManage.Instance.cate.hasTaskAndNotCompleted(
                  TaskManage.PET_SYSTEM_OPEN_TASK02,
                );
              btn.visible = flag;
            }
            btn.nodeData = nodeInfo;
          }
        });
      }
    }
  }

  private clearAllBtn() {
    this._btnDic.forEach((element) => {
      element.off(Laya.Event.CLICK, this, this.__onClickHandler);
      element.off(Laya.Event.MOUSE_OVER, this, this.__onOverHandler);
      element.off(Laya.Event.MOUSE_OUT, this, this.__onOutHandler);
      ObjectUtils.disposeObject(element);
    });
    this._itemDic.clear();
    this._itemDic = null;
    this._btnDic = null;
  }

  private __onClickHandler(evt: Laya.Event): void {
    let btn: OneStatusButton = evt.currentTarget as OneStatusButton;
    let nodeView: NpcAvatarView = this._itemDic.get(btn) as NpcAvatarView;
    if (nodeView) {
      CampaignManager.Instance.mapModel.selectNode =
        nodeView.nodeInfo as CampaignNode;
      nodeView.attackFun();
      evt.stopPropagation();
    }
  }

  private __onOverHandler(evt: Laya.Event): void {
    let btn: OneStatusButton = evt.currentTarget as OneStatusButton;
    let nodeView: NpcAvatarView = this._itemDic.get(btn) as NpcAvatarView;
    if (nodeView) {
      nodeView.mouseMoveHandler(evt);
      evt.stopPropagation();
    }
  }

  private __onOutHandler(evt: Laya.Event): void {
    let btn: OneStatusButton = evt.currentTarget as OneStatusButton;
    let nodeView: NpcAvatarView = this._itemDic.get(btn) as NpcAvatarView;
    if (nodeView) {
      nodeView.mouseOutHandler(evt);
      evt.stopPropagation();
    }
  }
}
