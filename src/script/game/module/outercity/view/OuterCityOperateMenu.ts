import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import HomeWnd from "../../home/HomeWnd";
import SmallMapBar from "../../home/SmallMapBar";
import AudioManager from "../../../../core/audio/AudioManager";
import {SoundIds} from "../../../constant/SoundIds";
import {CursorManagerII} from "../../../manager/CursorManagerII";
import {TransmitHandler} from "../../../map/outercity/TransmitHandler";
import {ArmyManager} from "../../../manager/ArmyManager";
import {OuterCityManager} from "../../../manager/OuterCityManager";
import {NotificationEvent} from "../../../constant/event/NotificationEvent";
import {BaseCastle} from "../../../datas/template/BaseCastle";
import {MessageTipManager} from "../../../manager/MessageTipManager";
import {NotificationManager} from "../../../manager/NotificationManager";
import {PlayerManager} from "../../../manager/PlayerManager";
import {OuterCityArmyView} from "../../../map/outercity/OuterCityArmyView";
import {BaseArmy} from "../../../map/space/data/BaseArmy";
import {StageReferance} from "../../../roadComponent/pickgliss/toplevel/StageReferance";
import LangManager from "../../../../core/lang/LangManager";
import {OuterCityMap} from "../../../map/outercity/OuterCityMap";
import UIManager from "../../../../core/ui/UIManager";
import {EmWindow} from "../../../constant/UIDefine";
import {GoodsManager} from "../../../manager/GoodsManager";
import {GoodsInfo} from "../../../datas/goods/GoodsInfo";
import {SocketSendManager} from "../../../manager/SocketSendManager";
import ItemID from "../../../constant/ItemID";
import Point = Laya.Point;
import OutercityVehicleArmyView from "../../../map/campaign/view/physics/OutercityVehicleArmyView";

/**
 * @description 外城操作菜单
 * @author yuanzhan.yu
 * @date 2021/11/29 20:24
 * @ver 1.0
 */
export class OuterCityOperateMenu extends BaseWindow
{
    public bg:fgui.GImage;
    public list:fgui.GList;

    constructor()
    {
        super();
    }

    public OnInitWind()
    {
        super.OnInitWind();

        this.initData();
        this.initView();
        this.initEvent();
    }

    private initData()
    {
        // this._data = [];
    }

    private initView()
    {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
        this.list.numItems = 6;
    }

    private initEvent()
    {
        this.list.on(fgui.Events.CLICK_ITEM, this, this.onListItemClick);
    }

    createModel()
    {
        super.createModel();
        this.modelMask.alpha = 0;
    }

    public OnShowWind()
    {
        super.OnShowWind();

        let smallMap:SmallMapBar = HomeWnd.Instance.getSmallMapBar();
        let pos:Point = smallMap.view.displayObject.localToGlobal(new Point(smallMap.opBtn.x, smallMap.opBtn.y), true);
        this.pos(pos.x, pos.y);
    }

    private renderListItem(index:number, item:fgui.GButton)
    {
        item.data = index;
    }

    private onListItemClick(item:fgui.GButton, evt:Laya.Event)
    {
        AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);

        switch(item.data)
        {
            case 0:
                //英雄
                this.localArmyHandler();
                break;
            case 1:
                //城堡
                this.localCastleHandler();
                break;
            case 2:
                //回城
                let selfVehicleView1: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
                if(selfVehicleView1){
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                    return;
                }
                this.returnCastle();
                break;
            case 3:
                //坐标
                this.showOuterCityTransmitWnd();
                break;
            case 4:
                //传送
                let selfVehicleView: OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
                if(selfVehicleView){
                    MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("OuterCityCastleTips.gotoBtnTips"));
                    return;
                }
                this.transmitHandler();
                break;
            case 5:
                //驱散迷雾
                this.removeDenseFog();
                break;
        }
        this.hide();
    }

    private localCastleHandler():void
    {
        let army:BaseArmy = ArmyManager.Instance.army;
        let castleInfo:BaseCastle = PlayerManager.Instance.currentPlayerModel.mapNodeInfo;
        if(castleInfo.info.mapId != OuterCityManager.Instance.model.mapId)
        {
            let str:string = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCitySmallMapMediator.command02");
            MessageTipManager.Instance.show(str);
            return;
        }
        if(castleInfo)
        {
            this.mapView.motionTo(new Point(castleInfo.x - StageReferance.stageWidth / 2, castleInfo.y - StageReferance.stageHeight / 2));
        }
    }

    private returnCastle():void
    {
        OuterCityManager.Instance.controler.sendReturnHomeArmy();
    }

    private transmitHandler():void
    {
        CursorManagerII.Instance.resetCursor();
        TransmitHandler.Instance.show();
    }

    private removeDenseFog():void
    {
        let title:string = LangManager.Instance.GetTranslation("public.prompt");
        let str:string = LangManager.Instance.GetTranslation("Outercity.RemoveDenseFog");
        let num:number = GoodsManager.Instance.getGoodsNumByTempId(ItemID.HOLY_LIGHT)
        let goodsCount:string = LangManager.Instance.GetTranslation("MazeShopWnd.HasNumTxt") + num;
        // UIManager.Instance.ShowWind(EmWindow.IconAlertHelperWnd, {data:[this.removeDenseFogCallBack.bind(this)], content:[title, str, ItemID.HOLY_LIGHT, 1]});
        UIManager.Instance.ShowWind(EmWindow.UseGoodsAlert, {content:str, goodsId:ItemID.HOLY_LIGHT, goodsCount:goodsCount, callback:this.removeDenseFogCallBack.bind(this)});
    }

    private removeDenseFogCallBack(flag:boolean):void
    {
        if(flag)
        {
            let goods:GoodsInfo[] = GoodsManager.Instance.getBagGoodsByTemplateId(ItemID.HOLY_LIGHT);
            if(goods.length <= 0)
            {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("singlepass.bugle.SinglePassBugleView.NoLeftCount"));
                return;
            }
            SocketSendManager.Instance.sendUseItem(goods[0].pos);
        }
    }

    private localArmyHandler():void
    {
        let army:BaseArmy = ArmyManager.Instance.army;
        if(army.mapId != OuterCityManager.Instance.model.mapId)
        {
            let str:string = LangManager.Instance.GetTranslation("map.outercity.mediator.mapview.OuterCitySmallMapMediator.command01");
            MessageTipManager.Instance.show(str);
            NotificationManager.Instance.dispatchEvent(NotificationEvent.ARMY_SYSC_CALL, null);
            return;
        }
        let selfVehicle:OutercityVehicleArmyView = OuterCityManager.Instance.model.getSelfVehicle();
        if(selfVehicle)
        {
            this.mapView.motionTo(new Point(selfVehicle.x - StageReferance.stageWidth / 2, selfVehicle.y - StageReferance.stageHeight / 2));
            return;
        }
        let aInfo:BaseArmy = OuterCityManager.Instance.model.getWorldArmyById(army.id);
        if(!aInfo)
        {
            return;
        }
        let armyView:OuterCityArmyView = aInfo.armyView as OuterCityArmyView;
        if(armyView)
        {
            this.mapView.motionTo(new Point(armyView.x - StageReferance.stageWidth / 2, armyView.y - StageReferance.stageHeight / 2));
            return;
        }
        if(army)
        {
            this.mapView.motionTo(new Point(army.curPosX * 20 - StageReferance.stageWidth / 2, army.curPosY * 20 - StageReferance.stageHeight / 2));
        }
    }

    private showOuterCityTransmitWnd()
    {
        UIManager.Instance.ShowWind(EmWindow.OuterCityTransmitWnd);
    }

    private get mapView():OuterCityMap
    {
        return OuterCityManager.Instance.mapView;
    }

    private removeEvent()
    {
    }

    public OnHideWind()
    {
        super.OnHideWind();

        this.removeEvent();
    }

    dispose(dispose?:boolean)
    {
        super.dispose(dispose);
    }
}