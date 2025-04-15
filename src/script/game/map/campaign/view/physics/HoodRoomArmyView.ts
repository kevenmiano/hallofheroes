import { CampaignArmyView } from "./CampaignArmyView";
// import IBaseMouseEvent from "../../../space/interfaces/IBaseMouseEvent";
import { HeroAvatar } from "../../../avatar/view/HeroAvatar";
import { CampaignManager } from "../../../../manager/CampaignManager";
import { NodeState } from "../../../space/constant/NodeState";
import { CampaignNpcPhysics } from "./CampaignNpcPhysics";
import { CampaignNode } from "../../../space/data/CampaignNode";

interface IBaseMouseEvent {
  mouseClickHandler(evt: Laya.Event): boolean;
  mouseOverHandler(evt: Laya.Event): boolean;
  mouseOutHandler(evt: Laya.Event): boolean;
  mouseMoveHandler(evt: Laya.Event): boolean;
}

/**
 * @author:pzlricky
 * @data: 2021-11-29 09:57
 * @description 修行神殿 公会秘境中的人物形象 人物可以点击 弹出菜单 进行切磋
 */
export default class HoodRoomArmyView
  extends CampaignArmyView
  implements IBaseMouseEvent
{
  public mouseOverHandler(evt: Laya.Event): boolean {
    return false;
  }
  public mouseOutHandler(evt: Laya.Event): boolean {
    if (!this.isSelf) {
      if (
        this._avatar &&
        (this._avatar as HeroAvatar).getCurrentPixels() > 50
      ) {
        this._filter.setNormalFilter(this._avatar);
        return true;
      }
    }
    return false;
  }
  public mouseMoveHandler(evt: Laya.Event): boolean {
    if (this.isSelf) {
      this.mouseEnabled = false;
      return false;
    }
    if (this._avatar) {
      if ((this._avatar as HeroAvatar).getCurrentPixels() > 50) {
        this._filter.setLightFilter(this._avatar);
        return false;
      } else {
        this._filter.setNormalFilter(this._avatar);
        if (evt) {
          this.throughDispatch(evt);
        }
        return false;
      }
    }
    return false;
  }
  private throughDispatch(e: Laya.Event) {
    var arr: Array<CampaignNode> =
      CampaignManager.Instance.mapModel.mapNodesData;
    for (const key in arr) {
      if (Object.prototype.hasOwnProperty.call(arr, key)) {
        var node: CampaignNode = arr[key];
        if (NodeState.displayState(node.info.state)) {
          if (node.nodeView && node.nodeView instanceof CampaignNpcPhysics) {
            var view: CampaignNpcPhysics = node.nodeView as CampaignNpcPhysics;
            var rect: Laya.Rectangle = view.getBounds();
            if (rect.contains(e.stageX, e.stageY)) {
              node.nodeView.event(e.type, this.data);
              return;
            }
          }
        }
      }
    }
    arr = null;
  }

  public dispose() {
    if (this._avatar && this._filter)
      this._filter.setNormalFilter(this._avatar);
    this._filter = null;
    super.dispose();
  }

  public mouseClickHandler(evt: Laya.Event): boolean {
    if (
      (this._avatar && (this._avatar as HeroAvatar).getCurrentPixels() < 50) ||
      this.isSelf
    ) {
      if (evt) {
        this.throughDispatch(evt);
      }
      return false;
    }

    // var menu: PlayerMenu = new PlayerMenu(true);
    // menu.setData(this.data);
    // menu.x = StageReferance.stage.mouseX + menu.width >= StageReferance.stageWidth ? StageReferance.stageWidth - menu.width : StageReferance.stage.mouseX;
    // menu.y = StageReferance.stage.mouseY + menu.height >= StageReferance.stageHeight ? StageReferance.stageHeight - menu.height : StageReferance.stage.mouseY;
    // LayerManager.Instance.addToLayer(menu, LayerManager.GAME_MENU_LAYER);
    evt.stopPropagation();
    return true;
  }

  public get isSelf(): boolean {
    return this.data.userId == this.playerInfo.userId;
  }
}
