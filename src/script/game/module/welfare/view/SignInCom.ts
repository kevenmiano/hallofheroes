
import { DateFormatter } from '../../../../core/utils/DateFormatter';
import { VIPEvent } from '../../../constant/event/NotificationEvent';
import { PlayerEvent } from '../../../constant/event/PlayerEvent';
import { EmWindow } from '../../../constant/UIDefine';
import { PlayerInfo } from '../../../datas/playerinfo/PlayerInfo';
import DayGuideManager from '../../../manager/DayGuideManager';
import { PlayerManager } from '../../../manager/PlayerManager';
import { TempleteManager } from '../../../manager/TempleteManager';
import { VIPManager } from '../../../manager/VIPManager';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import { VIPModel } from '../../../mvc/model/VIPModel';
import DayGuideCatecory from '../data/DayGuideCatecory';
import WelfareCtrl from '../WelfareCtrl';
import { ArrayConstant, ArrayUtils } from '../../../../core/utils/ArrayUtils';
import { t_s_dropconditionData } from '../../../config/t_s_dropcondition';
import WelfareData from '../WelfareData';
import SDKManager from '../../../../core/sdk/SDKManager';
import { RPT_EVENT } from '../../../../core/thirdlib/RptEvent';
import FUI_SignInCom from '../../../../../fui/Welfare/FUI_SignInCom';
import SignInItem, { SignState } from './component/SignInItem';

/**
* @author:pzlricky
* @data: 2021-06-24 12:00
* @description 签到
*/
export default class SignInCom extends FUI_SignInCom {
    private _dateItemList: Array<Date>;
    private _listData: Array<t_s_dropconditionData>;
    private _toadyIndex:number=0;
    private _curSignItem:SignInItem;
    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.control.sendSignReward(1);
        this.displayObject.drawCallOptimize = false;
        this.init();
    }

    private init() {
        this.initEvent();

        this.cate.initDate();
        this._toadyIndex = Math.floor(DateFormatter.compareDayIndex(this.playerInfo.signDate,this.today));
        if(this._toadyIndex == 0){
            this._toadyIndex = 1;
        }
        this._dateItemList = this.cate.dateItemList;
        this.initSignCount(); 
        this.updateResignCount();  
    }

     /**
     * 取得签到次数计数点
     * */
     private initSignCount() {
        this._listData = [];
        let dic = TempleteManager.Instance.getSignDropTemplates();
        for (let tmpItem of dic) {
            if (tmpItem.Para1[0] > 0)
                this._listData.push(tmpItem);
        }
        this._listData = ArrayUtils.sortOn(this._listData, "DropId", ArrayConstant.NUMERIC);
        this.list.numItems = this._listData.length;
    }

    private initEvent() {
        //@ts-ignore
        this.list.itemRenderer = Laya.Handler.create(this, this.renderDateItemListItem, null, false);
        this.list.on(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        this.playerInfo.addEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__changeHandler, this);
        this.playerInfo.addEventListener(PlayerEvent.REWARDSTATE_CHANGE, this.__changeHandler, this);
        this.vipModel.addEventListener(VIPEvent.UPFRAMEVIEW_CHANGE, this.__upGifViewHandler, this);
    }

    private removeEvent() {
        this.list.off(fairygui.Events.CLICK_ITEM, this, this.onClickItem);
        this.playerInfo.removeEventListener(PlayerEvent.PLAYER_SIGNSITE_CHANGE, this.__changeHandler, this);
        this.playerInfo.removeEventListener(PlayerEvent.REWARDSTATE_CHANGE, this.__changeHandler, this);
        this.vipModel.removeEventListener(VIPEvent.UPFRAMEVIEW_CHANGE, this.__upGifViewHandler, this);
    }

    private onClickItem(item: SignInItem) {
        this._curSignItem = item;
        if(item){
            if(item.signStateCtrl.selectedIndex == SignState.SIGN){
                this.control.sendSignReward(2,0,0,item.index);
            }
        }
    }

    /**
     * 签到成功
     */
    private __changeHandler(evtData) {
        // this.signInUIButton.enabled = false;
        if(this._curSignItem){
            this._curSignItem.updateState(SignState.SINGED);
        }
        this.updateResignCount();
    }

    /**签到 */
    private __signHandler() {
        if(this.playerInfo.signTimes == 1){
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_TWO_LOGIN);
        }else if(this.playerInfo.signTimes == 2){
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_THREE_LOGIN);
        }else if(this.playerInfo.signTimes == 6){
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_SEVEN_LOGIN);
        }
        this.control.sendSignReward(2);
    }

    /**是否存在未签到的天数 */
    private hasNotSignDay(): boolean {
        let flag: boolean = false;
        let len: number = this._dateItemList.length;
        let item: Date;
        for (let i: number = 0; i < len; i++) {
            item = this._dateItemList[i];
            if (!this.cate.hasSigned(i+1)) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    private __upGifViewHandler(event: Laya.Event) {
        if (this.vipModel.vipInfo.IsTakeGift && this.vipModel.vipInfo.IsVipAndNoExpirt) {
            FrameCtrlManager.Instance.open(EmWindow.VipCoolDownFrameWnd, VIPModel.OPEN_GIFT_FRAME);
        } else {
            FrameCtrlManager.Instance.open(EmWindow.VipCoolDownFrameWnd);
        }
    }

    /**
     * 更新免费补签次数
     */
    private updateResignCount() {
        this.txt_resign_count.setVar("count", this.playerInfo.reissueNum.toString()).flushVars();//剩余补签次数
    }

    private get cate(): DayGuideCatecory {
        return DayGuideManager.Instance.cate;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    private get ctrlData(): WelfareData {
        return this.control.data;
    }

    private get playerInfo(): PlayerInfo {
        return PlayerManager.Instance.currentPlayerModel.playerInfo;
    }

    private get today(): Date {
        return PlayerManager.Instance.currentPlayerModel.sysCurtime;
    }
    private get vipModel(): VIPModel {
        return VIPManager.Instance.model;
    }

    private renderDateItemListItem(index: number, item: SignInItem) {
        if (!item) return;
        item.setData(this._listData[index],index+1);
        item.setDateData(this._dateItemList[index],this._toadyIndex); 
    }


    dispose() {
        this.removeEvent();
        this._dateItemList = [];
        super.dispose();
    }

}