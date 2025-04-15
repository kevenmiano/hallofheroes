import Logger from "../../../../../core/logger/Logger";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { PlayerManager } from "../../../../manager/PlayerManager";
import NewbieBaseActionMediator from "../../../../module/guide/mediators/NewbieBaseActionMediator";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { NodeState } from "../../../space/constant/NodeState";
import { CampaignNode } from "../../../space/data/CampaignNode";
// import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import { CampaignWalkLayer } from "../layer/CampaignWalkLayer";
import { CampaignArmyView } from "./CampaignArmyView";

interface IBaseMouseEvent {
  mouseClickHandler(evt: Laya.Event): boolean;
  mouseOverHandler(evt: Laya.Event): boolean;
  mouseOutHandler(evt: Laya.Event): boolean;
  mouseMoveHandler(evt: Laya.Event): boolean;
}

export class PetLandArmyView
  extends CampaignArmyView
  implements IBaseMouseEvent
{
  constructor() {
    super();
  }

  public lockTargetAndHideFate(): void {
    if (this._fateSkillEffect && this._fateSkillEffect.parent) {
      this._fateSkillEffect.parent.removeChild(this._fateSkillEffect);
    }
  }

  public unlockTargetAndShowFate(): void {
    if (this._fateSkillEffect) {
      this.addChildAt(this._fateSkillEffect, 0);
    }
  }

  public mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }

  public mouseOutHandler(evt: Laya.Event): boolean {
    if (!this.isSelf) {
      if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() > 50) {
        return true;
      }
    }
    if (this._avatar) {
      this._filter.setNormalFilter(this._avatar);
    }
    return false;
  }

  public mouseMoveHandler(evt: Laya.Event): boolean {
    // if(this.isSelf)
    // {
    //     this.mouseEnabled = false;
    //     return false;
    // }
    // if(this._avatar)
    // {
    //     if((<HeroAvatar>this._avatar).getCurrentPixels() > 50)
    //     {
    //         this._filter.setGlowFilter(this._avatar);
    //         return false;
    //     }
    //     else
    //     {
    //         this._filter.setNormalFilter(this._avatar);
    //         if(evt)
    //         {
    //             this.throughDispatch(evt);
    //         }
    //         return false;
    //     }
    // }
    return false;
  }

  public dispose(): void {
    if (this._avatar && this._filter) {
      this._filter.setNormalFilter(this._avatar);
    }
    this._filter = null;
    super.dispose();
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    // if (this._avatar && (<HeroAvatar>this._avatar).getCurrentPixels() < 50 || this.isSelf) {
    //     if (evt) {
    //         this.throughDispatch(evt);
    //     }
    //     return false;
    // }

    //判断是否玩家重叠
    (this.parent as CampaignWalkLayer).checkClickPlayerNum(
      evt.stageX,
      evt.stageY,
    );
    return true;
  }

  private throughDispatch(e: Laya.Event): void {
    let arr: CampaignNode[] = CampaignManager.Instance.mapModel.mapNodesData;
    // for (let i = arr.length, len = arr.length; i < len; i++)
    let len = arr.length;
    for (let i = len; i > 0; i--) {
      const node = arr[i];
      if (NodeState.displayState(node.info.state)) {
        let nodeView = node.nodeView;
        if (
          nodeView &&
          nodeView.mouseEnabled &&
          nodeView != this &&
          nodeView.stage
        ) {
          let bounds: Laya.Rectangle = nodeView.getBounds();
          let pos = NewbieBaseActionMediator.localToGlobal(
            nodeView,
            new Laya.Point(0, 0),
          );
          let rect = new Laya.Rectangle(
            pos.x,
            pos.y,
            bounds.width,
            bounds.height,
          );
          if (rect.contains(e.stageX, e.stageY)) {
            Logger.xjy("throughDispatch mouseClickHandler");
            // nodeView["mouseClickHandler"] && nodeView["mouseClickHandler"]()
            return;
          }
        }
      }
    }
    arr = null;
  }
}
