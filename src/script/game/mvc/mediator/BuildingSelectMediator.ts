import {
  DisplayObject,
  DisplayObjectContainer,
} from "../../component/DisplayObject";
import { IMediator } from "@/script/game/interfaces/Mediator";
import { CampaignManager } from "../../manager/CampaignManager";
import { SceneManager } from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import { NodeState } from "../../map/space/constant/NodeState";
import { MapPhysics } from "../../map/space/data/MapPhysics";
// import ISelectMovie from "../../map/space/interfaces/ISelectMovie";
import { MapPhysicsBase } from "../../map/space/view/physics/MapPhysicsBase";
import { HeroAvatarView } from "../../map/view/hero/HeroAvatarView";
import { StageReferance } from "../../roadComponent/pickgliss/toplevel/StageReferance";
import { WorldBossHelper } from "../../utils/WorldBossHelper";

/**
 * 副本中全选的快捷键
 * 按下ctrl键 节点变红
 */
export class BuildingSelectMediator implements IMediator {
  private _target: object;
  constructor() {}

  public register(target: object) {
    this._target = target;
    // KeyboardManager.getInstance().addEventListener(Laya.Event.KEY_DOWN , this.__kayDownHandler);
    // KeyboardManager.getInstance().addEventListener(Laya.Event.KEY_UP , this.__keyUpHandler);
    // StageReferance.stage.addEventListener(Laya.Event.DEACTIVATE,        this.__deactiveHandler);
    // StageReferance.stage.addEventListener(Laya.Event.MOUSE_LEAVE ,      this.__deactiveHandler);
  }
  public unregister(target: object) {
    this._target = null;
    // KeyboardManager.getInstance().removeEventListener(Laya.Event.KEY_DOWN , this.__kayDownHandler);
    // KeyboardManager.getInstance().removeEventListener(Laya.Event.KEY_UP , this.__keyUpHandler);
    // StageReferance.stage.removeEventListener(Event.DEACTIVATE,        this.__deactiveHandler);
    // StageReferance.stage.removeEventListener(Event.MOUSE_LEAVE ,      this.__deactiveHandler);
  }
  private __deactiveHandler(evt: Event) {
    if (SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE) {
      this.clearAllPhysicsFilter();
    }
  }
  private _isDown: boolean;
  private __kayDownHandler(evt: KeyboardEvent) {
    // if(this._isDown)return;
    // if(evt.keyCode == Keyboard.CONTROL)
    // {
    // 	this._isDown = true;
    // 	if(SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE)
    // 	{
    // 		var arr :any[] = CampaignManager.Instance.mapModel.mapNodesData;
    // 		if(!WorldBossHelper.checkPvp(CampaignManager.Instance.mapModel.mapId))this.setAllPhysicsFilter(arr);
    // 	}
    // 	evt.stopPropagation();
    // }
  }
  private __keyUpHandler(evt: KeyboardEvent) {
    // if(evt.keyCode == Keyboard.CONTROL)
    // {
    // 	this._isDown = false;
    // 	if(SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE)
    // 	{
    // 		if(!WorldBossHelper.checkPvp(CampaignManager.Instance.mapModel.mapId))this.clearAllPhysicsFilter();
    // 	}
    // 	evt.stopPropagation();
    // }
  }
  private canAttack: any[] = [];
  private selected: any[] = [];
  private setAllPhysicsFilter(arr: object) {
    var timeline1: TimelineMax = new TimelineMax({
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    });

    var timeline2: TimelineMax = new TimelineMax({
      repeat: -1,
      yoyo: true,
      repeatDelay: 0.5,
    });

    this.clearAllPhysicsFilter();
    // for each(var item : MapPhysics in arr)
    // {
    // 	if(item.info.state != NodeState.EXIST)continue;

    // 	if(item.nodeView is MapPhysicsBase)
    // 	{
    // 		this.canAttack.push((item.<MapPhysicsBase> nodeView).movie);
    // 		this.selected.push(item.nodeView);
    // 	}
    // 	else if(item.nodeView is HeroAvatarView)
    // 	{
    // 		this.canAttack.push((item.<HeroAvatarView> nodeView).avatarView);
    // 		this.selected.push(item.nodeView);
    // 	}
    // 	if(item.nodeView is ISelectMovie)
    // 	{
    // 		(item.<ISelectMovie> nodeView).beginSelectMovie();
    // 	}
    // }
    // timeline1.insertMultiple( TweenMax.allFrom(this.canAttack, 0.5, {colorTransform:{tint:0xff0000, tintAmount:0.4},glowFilter:{color:0xFF0000, alpha:.9, blurX:17, blurY:17}}));
    // timeline2.insertMultiple( TweenMax.allFrom(this.canAttack, 0.5, {colorTransform:{tint:0xff0000, tintAmount:0.18},glowFilter:{color:0xFF0000, alpha:1, blurX:0, blurY:0,delay:.5}}));
  }
  private clearAllPhysicsFilter() {
    // killChildTweensOf(false);
    // while(this.selected.length > 0)
    // {
    // 	var item : DisplayObject  = this.selected.pop();
    // 	if(item.parent instanceof ISelectMovie)
    // 	{
    // 		(<ISelectMovie>item.parent).resetSelectMovie();
    // 	}
    // 	else if(item instanceof ISelectMovie)
    // 	{
    // 		(<ISelectMovie> item).resetSelectMovie();
    // 	}
    // 	else
    // 	{
    // 		item.filters = null;
    // 	}
    // }
  }

  public killChildTweensOf(complete: boolean = false) {
    var a: any[] = TweenMax.getAllTweens();
    var curTarget: object, curParent: DisplayObjectContainer;
    var i: number = a.length;
    while (--i > -1) {
      curTarget = a[i].target;
      if (this.canAttack.indexOf(curTarget) != -1) {
        if (complete) {
          a[i].complete(false);
        } else {
          a[i].setEnabled(false, false);
        }
      }
    }
  }
}
