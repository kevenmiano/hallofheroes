import {SpaceEvent} from "../../constant/event/NotificationEvent";
import {PlayerModel} from "../../datas/playerinfo/PlayerModel";
import IMediator from "../../interfaces/IMediator";
import {CampaignManager} from "../../manager/CampaignManager";
import {PlayerManager} from "../../manager/PlayerManager";
import {CampaignArmyView} from "../../map/campaign/view/physics/CampaignArmyView";
import {SceneManager} from "../../map/scene/SceneManager";
import SceneType from "../../map/scene/SceneType";
import SpaceManager from "../../map/space/SpaceManager";
import {MapViewHelper} from "../../map/outercity/utils/MapViewHelper";
import {SpaceArmyView} from "../../map/space/view/physics/SpaceArmyView";
import Logger from "../../../core/logger/Logger";
import { EmPackName } from "../../constant/UIDefine";

export class LockTargetMediator implements IMediator
{
    protected _selfInfo:any;
    protected _targetInfo:any;
    protected _selectFlag:fgui.GLoader;
    protected _target:Laya.Sprite;
    protected _playerModel:PlayerModel;
    protected _selectRes:string[] = ["SelectTarget_L", "SelectTarget_S"];

    constructor()
    {
    }

    public register(target:Object)
    {
        this._target = <Laya.Sprite>target;
        this._playerModel = PlayerManager.Instance.currentPlayerModel;
        this.createLoader();
        this._selectFlag.url = fgui.UIPackage.getItemURL(EmPackName.Base, this._selectRes[0]);
        this._playerModel.addEventListener(SpaceEvent.TARGET_CHANGE, this.__lockTargetHandler, this);
        Laya.timer.loop(1000, this, this.__timeTickHandler);
    }

    private createLoader():void
    {
        if(this._selectFlag){
            this._selectFlag.dispose();
            this._selectFlag = null;
        }
        this._selectFlag = new fgui.GLoader();
        this._selectFlag.setPivot(0.5, 0.5, true);
        this._selectFlag.autoSize = true;
    }

    public unregister(target:Object)
    {
        this.unlockTarget();
        this._playerModel.removeEventListener(SpaceEvent.TARGET_CHANGE, this.__lockTargetHandler, this);
        this._playerModel = null;
        this._target = null;
        this.dispose();
    }

    private __lockTargetHandler(data:any)
    {
        this._targetInfo = data;
        if(this._targetInfo)
        {
            this.lockTarget();
            if(PlayerManager.Instance.currentPlayerModel.reinforce && PlayerManager.Instance.currentPlayerModel.reinforce == this._targetInfo)
            {
                this.moveArmyByPos(this._targetInfo);
            }
        }
        else
        {
            this.unlockTarget();
        }
    }

    private moveArmyByPos(army:any)
    {
        var armyView:Object = this.getArmyView(this._targetInfo);
        var targetX:number = 0;
        var targetY:number = 0;
        if(SceneManager.Instance.currentType == SceneType.SPACE_SCENE)
        {
            if(armyView instanceof SpaceArmyView)
            {
                targetX = (<SpaceArmyView>armyView).x;
                targetY = (<SpaceArmyView>armyView).y;
            }
            // else if(armyView is SpaceAvatar)
            // {
            // 	targetX = (<SpaceAvatar> armyView).x;
            // 	targetY = (<SpaceAvatar> armyView).y;
            // }
            SpaceManager.Instance.controller.moveArmyByPos(targetX, targetY);
        }
        else if(SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE)
        {
            if(armyView instanceof CampaignArmyView)
            {
                targetX = (<CampaignArmyView>armyView).x;
                targetY = (<CampaignArmyView>armyView).y;
            }
            CampaignManager.Instance.controller.moveArmyByPos(targetX, targetY);
        }
    }

    private getArmyView(army:any):Object
    {
        var armyView:Object;
        if(SceneManager.Instance.currentType == SceneType.SPACE_SCENE)
        {
            armyView = SpaceManager.Instance.controller.getArmyView(this._targetInfo);
        }
        else if(SceneManager.Instance.currentType == SceneType.CAMPAIGN_MAP_SCENE)
        {
            armyView = CampaignManager.Instance.controller.getArmyView(this._targetInfo);
        }
        return armyView;
    }

    private lockTarget()
    {
        /**
         * 角色不在显示区域的时候会被销毁, 所以他的选中状态也会被销毁, 再次要显示选中状态的时候会报错卡死, 所以要重新创建一个loader 
         * modify by zhihua.zhou 2021-12-10
         */
        if(this._selectFlag.displayObject.destroyed){
            this.createLoader();
        }

        if(this._targetInfo.mountTemplateId > 0)
        {
            this._selectFlag.url = fgui.UIPackage.getItemURL(EmPackName.Base, this._selectRes[0]);
        }
        else
        {
            this._selectFlag.url = fgui.UIPackage.getItemURL(EmPackName.Base, this._selectRes[1]);
        }
        var armyView:Object = this.getArmyView(this._targetInfo);
        if(armyView instanceof SpaceArmyView || armyView instanceof CampaignArmyView)
        {
            this._selectFlag.displayObject.name = ''
            armyView.avatarView.addChildAt(this._selectFlag.displayObject, 0);
        }
        // else if(armyView instanceof SpaceAvatar)
        // {
        // 	armyView.showSelected();
        // }
    }

    private unlockTarget()
    {
        if(!this._targetInfo)
        {
            this._selectFlag.displayObject.removeSelf();
            return;
        }
        var armyView:Object = this.getArmyView(this._targetInfo);
        if(armyView instanceof SpaceArmyView || armyView instanceof CampaignArmyView)
        {
            this._selectFlag.displayObject.removeSelf();
        }
        // else if (armyView instanceof SpaceAvatar)
        // {
        // 	armyView.showUnSelected();
        // }
        this._playerModel.dispatchEvent(SpaceEvent.TARGET_CHANGE, null);
    }

    private __timeTickHandler()
    {
        var rect: Laya.Rectangle = MapViewHelper.getCurrentMapRect(this._target);
        if(this._targetInfo && rect)
        {
            var armyView: Object = this.getArmyView(this._targetInfo)
            if(armyView)
            {
                var inscreen:boolean = !this.getPlaying(armyView, rect);
                if(!inscreen)
                {
                    this._playerModel.selectTarget = null;
                }
            }
        }
    }

    private getPlaying(mc:any, rect:Laya.Rectangle):boolean
    {
        var b:boolean = false;
        if(mc.x < rect.x - Laya.stage.width / 2 - mc.width - 100)
        {
            b = true;
        }
        else if(mc.x > rect.x + Laya.stage.width / 2 + 100)
        {
            b = true;
        }
        else if(mc.y < rect.y - Laya.stage.height / 2 - mc.height - 100)
        {
            b = true;
        }
        else if(mc.y > rect.y + Laya.stage.height / 2 + 100)
        {
            b = true;
        }
        return b;
    }

    private dispose()
    {
        Laya.timer.clear(this, this.__timeTickHandler);
        this._selectFlag.displayObject.removeSelf();
        this._selectFlag.dispose();
    }

}