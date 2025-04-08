import FUI_BottleIntergalBoxView from "../../../../../fui/Funny/FUI_BottleIntergalBoxView";
import {BottleManager} from "../../../manager/BottleManager";
import {ITipedDisplay, TipsShowType} from "../../../tips/ITipedDisplay";
import {EmWindow} from "../../../constant/UIDefine";
import {PlayerInfo} from "../../../datas/playerinfo/PlayerInfo";
import {PlayerManager} from "../../../manager/PlayerManager";
import {BottleModel} from "../model/BottleModel";
import {BottleUserInfo} from "../model/BottleUserInfo";
import {ToolTipsManager} from "../../../manager/ToolTipsManager";
import BottlePackage = com.road.yishi.proto.item.BottlePackage;
import { FunnyContent } from "./FunnyContent";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2023/3/23 9:52
 * @ver 1.0
 */
export class BottleIntergalBoxView extends FUI_BottleIntergalBoxView implements ITipedDisplay,FunnyContent
{
    tipData:any;
    tipType:EmWindow;
    showType:TipsShowType;
    startPoint:Laya.Point = new Laya.Point(0, 0);

    private _index:number = -1;//0--4
    private _packData:BottlePackage;
    private currentArray:number[];

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();

        this.tipType = EmWindow.BottleIntergalBoxTips;
    }

    onShow() {
        
    }

    onUpdate() {

    }

    onHide() {
        
    }

    public set boxIndex(index:number)
    {
        ToolTipsManager.Instance.register(this);
        this._index = index;
        this._packData = this.bottleModel.floorRewardArr[this._index];
        let object:Object = {};
        if(this.bottleModel.userArray[this._index])
        {
            object["userInfo"] = this.bottleModel.userArray[this._index];
        }
        object["packageData"] = this._packData;
        if(this._packData)
        {
            this.tipData = object;
        }

        this.currentArray = this.bottleModel.getHeightArray();
        //{floor=100}层
        this.txt_floor.setVar("floor", this.currentArray[index] + "").flushVars();
    }

    public refreshStatus():void
    {
        this.showType = TipsShowType.onClick;
        let userInfo:BottleUserInfo = this.bottleModel.userArray[this._index];
        if(userInfo && userInfo.userId > 0 && userInfo.state == 0)//可领取
        {
            if(userInfo.userName == this.playerInfo.nickName)
            {
                this.canAward.selectedIndex = 1;
                this.showType = TipsShowType.onLongPress;
            }
            else
            {
                this.canAward.selectedIndex = 2;
            }
        }
        else if(userInfo && userInfo.userId > 0 && userInfo.state == 1)//已经领取
        {
            this.canAward.selectedIndex = 3;
        }
        else
        {
            this.canAward.selectedIndex = 0;
        }
    }


    private get playerInfo():PlayerInfo
    {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get bottleModel():BottleModel
    {
        return BottleManager.Instance.model;
    }

    dispose()
    {
        ToolTipsManager.Instance.unRegister(this);
        super.dispose();
    }
}