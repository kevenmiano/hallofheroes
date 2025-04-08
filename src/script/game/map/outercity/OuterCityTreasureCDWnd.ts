import Resolution from "../../../core/comps/Resolution";
import LangManager from "../../../core/lang/LangManager";
import BaseWindow from "../../../core/ui/Base/BaseWindow"
import UIManager from "../../../core/ui/UIManager";
import { DateFormatter } from "../../../core/utils/DateFormatter";
import { EmWindow } from "../../constant/UIDefine";
import { PlayerModel } from "../../datas/playerinfo/PlayerModel";
import ConfigInfoManager from "../../manager/ConfigInfoManager";
import { PlayerManager } from "../../manager/PlayerManager";
import { FrameCtrlManager } from "../../mvc/FrameCtrlManager";

export default class OuterCityTreasureCDWnd extends BaseWindow{
    public timeTxt:fgui.GRichTextField;
	public helpBtn:fgui.GButton;
	public speedBtn:fgui.GButton;
    private _leftMins:number = 0;//剩余秒数
    private _maxValue:number = 0;//CD达到这个值将不能挑战
    private _maxSpeedNumber:number = 0;//最大加速次数
    private _cdCostArray: Array<number> = [];//CD次数和消耗钻石数量关系数组, 数组的第N项代表第N次加速需要消耗的钻石数量
    public OnInitWind() {
        super.OnInitWind();
        this.modelEnable = false;
        this.initData();
        this.initEvent();
        this.setCenter();
        this.y = Resolution.gameHeight - 200;
    }

    private initData() {
        this._leftMins = this.playerModel.sumCD - PlayerManager.Instance.currentPlayerModel.sysCurTimeBySecond;//CD剩余的秒数
        this._cdCostArray = ConfigInfoManager.Instance.getTreasureCdAccelerateSpend();
        this._maxSpeedNumber = this._cdCostArray.length;
        this._maxValue = ConfigInfoManager.Instance.getTreasureCd()*60;
        if(this._leftMins>0){
            if((this.playerModel.isDeath)){//曾经达到过阈值
                this.timeTxt.color = "#FF0000";//红色显示
                this.speedBtn.visible = this.playerModel.skipCount <this._maxSpeedNumber?true:false;
            }
            else{
                if(this._leftMins >=this._maxValue){
                    this.timeTxt.color = "#FF0000";//红色显示
                    this.speedBtn.visible = this.playerModel.skipCount <this._maxSpeedNumber?true:false;
                }
                else{
                    this.timeTxt.color = "#56F038";//绿色显示
                    this.speedBtn.visible = false;
                }
            }
            this.timeTxt.text = DateFormatter.getCountDateByMS(this._leftMins);
            Laya.timer.loop(1000,this,this.updateCDTimeTxt);
        }
        else{
            this.hide();//销毁当前页面的显示
        }
    }

    private updateCDTimeTxt(){
        this._leftMins--;
        if(this._leftMins>0){
            if((this.playerModel.isDeath)){//曾经达到过阈值
                this.timeTxt.color = "#FF0000";//红色显示
                this.speedBtn.visible = this.playerModel.skipCount <this._maxSpeedNumber?true:false;
            }
            else{
                if(this._leftMins >=this._maxValue){
                    this.timeTxt.color = "#FF0000";//红色显示
                    this.speedBtn.visible = this.playerModel.skipCount <this._maxSpeedNumber?true:false;
                }
                else{
                    this.timeTxt.color = "#56F038";//绿色显示
                    this.speedBtn.visible = false;
                }
            }
            this.timeTxt.text = DateFormatter.getCountDateByMS(this._leftMins);
        }
        else{
            Laya.timer.clear(this,this.updateCDTimeTxt);
            this.hide();//销毁当前页面的显示
        }
    }

    private initEvent() {
        this.helpBtn.onClick(this,this.helpBtnHandler);
        this.speedBtn.onClick(this,this.speedBtnHandler);
    }

    private removeEvent() {
        this.helpBtn.offClick(this,this.helpBtnHandler);
        this.speedBtn.offClick(this,this.speedBtnHandler);
    }

    //打开帮助说明
    private helpBtnHandler() {
        let title: string = LangManager.Instance.GetTranslation("public.help");
        let content: string = LangManager.Instance.GetTranslation("OuterCityTreasureCDWnd.help");
        UIManager.Instance.ShowWind(EmWindow.Help, { title: title, content: content });
    }

    //CD加速, 打开CD加速弹窗显示
    private speedBtnHandler() {
        FrameCtrlManager.Instance.open(EmWindow.OuterCityTreasureCDAlertWnd);
    }

    private get playerModel(): PlayerModel {
        return PlayerManager.Instance.currentPlayerModel;
    }

    public OnShowWind() {
        super.OnShowWind();
    }

    public OnHideWind() {
        super.OnHideWind();
        this.removeEvent();
    }

    dispose(dispose?: boolean) {
        super.dispose(dispose);
        Laya.timer.clear(this,this.updateCDTimeTxt);
    }
}