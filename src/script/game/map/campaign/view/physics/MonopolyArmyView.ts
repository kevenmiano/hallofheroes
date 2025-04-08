import { NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { MonopolyManager } from "../../../../manager/MonopolyManager";
import { CampaignArmy } from "../../data/CampaignArmy";
import { CampaignArmyView } from "./CampaignArmyView";

export class MonopolyArmyView extends CampaignArmyView{

    private _isLock:boolean = false;

    constructor() {
        super();
        this.mouseEnabled = false;
    }

    showAvatar(value:CampaignArmy):void {
        this.isMonopoly = true;
        super.showAvatar(value);
    }

    __lockKeyHandler(evt : NotificationEvent) : void
    {
        super.__lockKeyHandler(evt);
        this._isLock = true;
    }

    walkOver():void
    {
        if(!this._isLock)
        {
            MonopolyManager.Instance.sendTriggerEvent();
        }
        super.walkOver();
    }

    setFireView():void
    {
        
    }
		
    clearFireView():void
    {
        
    }

}