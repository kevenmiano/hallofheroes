import FUI_SignInDayBtn from '../../../../../../fui/Welfare/FUI_SignInDayBtn';
import FUI_SignInItem from '../../../../../../fui/Welfare/FUI_SignInItem';
import LangManager from '../../../../../core/lang/LangManager';
import SDKManager from '../../../../../core/sdk/SDKManager';
import { RPT_EVENT } from '../../../../../core/thirdlib/RptEvent';
import UIManager from '../../../../../core/ui/UIManager';
import { DateFormatter } from '../../../../../core/utils/DateFormatter';
import { BaseItem } from '../../../../component/item/BaseItem';
import { t_s_dropconditionData } from '../../../../config/t_s_dropcondition';
import { EmWindow } from '../../../../constant/UIDefine';
import { VipPrivilegeType } from '../../../../constant/VipPrivilegeType';
import { PlayerEvent } from '../../../../constant/event/PlayerEvent';
import { GoodsInfo } from '../../../../datas/goods/GoodsInfo';
import { PlayerInfo } from '../../../../datas/playerinfo/PlayerInfo';
import DayGuideManager from '../../../../manager/DayGuideManager';
import { MessageTipManager } from '../../../../manager/MessageTipManager';
import { PlayerManager } from '../../../../manager/PlayerManager';
import { TempleteManager } from '../../../../manager/TempleteManager';
import { VIPManager } from '../../../../manager/VIPManager';
import { FrameCtrlManager } from '../../../../mvc/FrameCtrlManager';
import WelfareCtrl from '../../WelfareCtrl';
import DayGuideCatecory from '../../data/DayGuideCatecory';
/**
* @author:zhihua.zhou
* @data: 2023-9-18
* @description 签到界面中的日期格子
*/
export default class SignInItem extends FUI_SignInItem {
    private _date: Date;

    onConstruct() {
        super.onConstruct();
        // if (!this.displayObject['dyna']) {
            this.displayObject.drawCallOptimize = false;
        // }
    }

    /**补签 */
    private __reSignHandler(e: Laya.Event) {
        // if(!this.cate.hasNotSignDay()){
        //     MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("signInView.signTips"));
        //     return;
        // }
        if (VIPManager.Instance.model.isOpenPrivilege(VipPrivilegeType.RESIGN) && this.playerInfo.reissueNum > 0) {
            this.control.sendSignReward(3,0,0,this._index);
        } else {
            let content: string = LangManager.Instance.GetTranslation("signInView.signContent", this.signCost);
            UIManager.Instance.ShowWind(EmWindow.TodayNotAlert, { state: 1, content: content, backFunction: this.__signConfirmHandler.bind(this) });
        }
    }

    private __signConfirmHandler(b: boolean, flag: boolean) {
        if (flag) {//优先使用绑定钻石
            if (this.playerInfo.giftToken + this.playerInfo.point < this.signCost) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                return;
            }
            // this.btn_resign.enabled = false;
            this.playerInfo.hasGetData = false;
            this.control.sendSignReward(3, 0, 2,this._index);
        }
        else{//只使用钻石
            if (this.playerInfo.point < this.signCost) {
                MessageTipManager.Instance.show(LangManager.Instance.GetTranslation("Auction.ResultAlert11"));
                return;
            }
            // this.btn_resign.enabled = false;
            this.playerInfo.hasGetData = false;
            this.control.sendSignReward(3, 0, 1,this._index);
        }
    }

    private get signCost(): number {
        let cfgValue = 50;
        let cfgItem = TempleteManager.Instance.getConfigInfoByConfigName("Repairsignin_Point");
        if (cfgItem) {
            cfgValue = Number(cfgItem.ConfigValue);
        }
        return cfgValue;
    }

    private initEvent() {
        this.btn_resign.onClick(this,this.__reSignHandler);
        // this.playerInfo.addEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__changeHandler, this);
    }

    private removeEvent() {
        this.btn_resign.offClick(this,this.__reSignHandler);
        // this.playerInfo.removeEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__changeHandler, this);
    }

    updateState(state) {
        this.setSignState(state);
        this.item.touchable = true;
    }

    public get date(): Date {
        return this._date;
    }
    /**
     * 设置值（外部调用）
     * 根据是否当月的日期, 是否签到, 是否过期等设置格子的状态
     * */
    public setDateData(value: Date,today:number) {
        this._date = value;
        if (!this.cate.hasSigned(this._index)) {//没有签到
            if (this.index == today) {//今天
                this.item.touchable = false;
                this.setSignState(SignState.SIGN);//可签到
            }else if(this.index < today){//昨天
                this.initEvent();
                this.setSignState(SignState.RESING);
            }else{//明天
                this.setSignState(SignState.UNSIGN)
            }
        } else {//已经签到
            this.setSignState(SignState.SINGED);
        }
    }

    
    public get index() : number {
        return this._index;
    }
    
    /** 第几天 */
    private _index:number=0;
    public setData(data:t_s_dropconditionData,index:number){
        this._index = index;
        var list = TempleteManager.Instance.getDropItemssByDropId(data.DropId);
        for (const key in list) {
            if (Object.prototype.hasOwnProperty.call(list, key)) {
                var temp = list[key];
                var goods: GoodsInfo = new GoodsInfo();
                goods.templateId = temp.ItemId;
                goods.count = temp.Data;
                (this.item as BaseItem).info = goods;
            }
        }
    }

    onClick(): void {
       
    }

    
    /**
     * 设置签到状态
     * @param value 0未签到 1已签到 2补签
     */
    setSignState(value: number) {
        this.signStateCtrl.selectedIndex = value;
        if(value == SignState.UNSIGN){
            this.txt_day.color = '#ffc68f';
            this.txt_day.text = LangManager.Instance.GetTranslation('singIn.dayIndex',"#FFecc6",this.index);
        }else if(value == SignState.SIGN){
            this.txt_day.color = '#FFFFb4';
            this.txt_day.text = LangManager.Instance.GetTranslation('singIn.dayIndex',"#FFFFb4",this.index);
        }else{
            this.txt_day.color = '#291B15';
            this.txt_day.text = LangManager.Instance.GetTranslation('singIn.dayIndex',"#291B15",this.index);
        }
    }

    private get cate(): DayGuideCatecory {
        return DayGuideManager.Instance.cate;
    }

    private get today(): Date {
        return PlayerManager.Instance.currentPlayerModel.sysCurtime;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }

}

export enum SignState
{
    UNSIGN = 0,//未签到
    SIGN = 1,//可签到
    SINGED = 2,//已签到
    RESING = 3,//补签
}
