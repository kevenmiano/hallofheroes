import LangManager from "../../../../core/lang/LangManager";
import BaseWindow from "../../../../core/ui/Base/BaseWindow";
import UIButton from "../../../../core/ui/UIButton";
import UIManager from "../../../../core/ui/UIManager";
import { DateFormatter } from "../../../../core/utils/DateFormatter";
import Utils from "../../../../core/utils/Utils";
import ColorConstant from "../../../constant/ColorConstant";
import { EmWindow } from "../../../constant/UIDefine";
import { OuterCityEvent } from "../../../constant/event/NotificationEvent";
import { GoodsInfo } from "../../../datas/goods/GoodsInfo";
import { NotificationManager } from "../../../manager/NotificationManager";
import { OuterCityManager } from "../../../manager/OuterCityManager";
import { WildLand } from "../../../map/data/WildLand";
import { OuterCityModel } from "../../../map/outercity/OuterCityModel";
import OuterCityVehicleItem from "../com/OuterCityVehicleItem";
import OuterCityVehicleRewardItem from "../com/OuterCityVehicleRewardItem";

export default class OuterCityVehicleInfoWnd extends BaseWindow {
    public frame: fgui.GLabel;
    public list: fgui.GList;
    public descTxt1: fgui.GTextField;
    public rewardTxt: fgui.GTextField;
    public descTxt2: fgui.GTextField;
    public consortiaNameTxt: fgui.GTextField;
    public addGroup: fgui.GGroup;
    public descTxt3: fgui.GTextField;
    public leftTimeTxt: fgui.GTextField;
    private _wildLand: WildLand;
    private _outercityModel: OuterCityModel;
    public helpBtn: UIButton;
    public goodsList:fgui.GList;
    private _goodsArr:Array<GoodsInfo> = [];
    private _count: number = 0;
    public OnInitWind() {
        super.OnInitWind();
        this.initEvent();
        this.initData();
        this.initView();
        this.setCenter();
    }

    private initData() {
        this._wildLand = this.frameData as WildLand;
        this._outercityModel = OuterCityManager.Instance.model;
        this.descTxt1.text = LangManager.Instance.GetTranslation("OuterCityVehicleInfoWnd.descTxt1");
        this.descTxt2.text = LangManager.Instance.GetTranslation("OuterCityVehicleInfoWnd.descTxt2");
        this.descTxt3.text = LangManager.Instance.GetTranslation("OuterCityVehicleInfoWnd.descTxt3");
        this.frame.getChild('title').text = this._wildLand.tempInfo.NameLang;
        let str:string = this._wildLand.tempInfo.Property2;
            let arr = str.split("|");
            if(arr){
                let goods:GoodsInfo;
                for(let i:number= 0;i<arr.length;i++){
                    goods = new GoodsInfo();
                    goods.templateId = parseInt((arr[i].split(",")[0]).toString());
                    goods.count = parseInt((arr[i].split(",")[1]).toString());
                    this._goodsArr.push(goods);
                }
                this.goodsList.numItems = this._goodsArr.length;
            }
    }

    private initView() {
        if (this._wildLand.info.occupyLeagueName == "") {//占领的公会信息无
            this.consortiaNameTxt.text = LangManager.Instance.GetTranslation("maze.MazeFrame.Order");
            this.consortiaNameTxt.color = ColorConstant.LIGHT_TEXT_COLOR;
        } else {
            this.consortiaNameTxt.text = "<" + this._wildLand.info.occupyLeagueName + ">";
            if (this._outercityModel.checkIsSameConsortiaByName(this._wildLand.info.occupyLeagueName)) {//同工会的
                this.consortiaNameTxt.color = ColorConstant.GREEN_COLOR;
            } else {
                this.consortiaNameTxt.color = ColorConstant.RED_COLOR;
            }
        }
        if (this._wildLand.leftTime > 0) {
            this._count = this._wildLand.leftTime;
            this.leftTimeTxt.text = DateFormatter.getConsortiaCountDate(this._count,false);
            Laya.timer.loop(1000, this, this.refreshLeftTime);
        } else {
            this.leftTimeTxt.text = LangManager.Instance.GetTranslation("OuterCityVehicleInfoWnd.leftTimeTxt");
            Laya.timer.clearAll(this);
        }
        this.list.numItems = 2;
    }

    private refreshLeftTime() {
        if (this._count > 0) {
            this._count--;
            this.leftTimeTxt.text = DateFormatter.getConsortiaCountDate(this._count,false);
        }
    }

    private initEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.__renderListItem, null, false);
        this.goodsList.itemRenderer = Laya.Handler.create(this, this.__renderGoodsListItem, null, false);
        NotificationManager.Instance.addEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE, this.updateView, this);
        this.helpBtn.onClick(this, this.onHelp);
    }

    private removeEvent() {
        Utils.clearGListHandle(this.list);
        Utils.clearGListHandle(this.goodsList);
        NotificationManager.Instance.removeEventListener(OuterCityEvent.OUTER_CITY_VEHICLE_UPDATE, this.updateView, this);
        this.helpBtn.offClick(this, this.onHelp);
        Laya.timer.clearAll(this);
    }

    private __renderGoodsListItem(index: number, item: OuterCityVehicleRewardItem) {
        item.info = this._goodsArr[index];
    }

    private onHelp() {
        let title = LangManager.Instance.GetTranslation("OuterCityVehicleInfoWnd.helpTitle");
        let content  = LangManager.Instance.GetTranslation("OuterCityVehicleInfoWnd.helpContent");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }
    
    private updateView() {
        if(this._wildLand){
            let templateId = this._wildLand.templateId;
            this._wildLand = OuterCityManager.Instance.model.allVehicleNode.get(templateId);
            this.initView();
        }
    }

    private __renderListItem(index: number, item: OuterCityVehicleItem) {
        item.index = index;
        item.info = this._wildLand;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        this._wildLand = null;
        super.dispose(dispose);
    }

}