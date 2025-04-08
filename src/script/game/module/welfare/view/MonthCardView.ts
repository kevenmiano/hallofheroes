import FUI_MonthCardView from '../../../../../fui/Welfare/FUI_MonthCardView';
import ConfigMgr from '../../../../core/config/ConfigMgr';
import { t_s_configData } from '../../../config/t_s_config';
import { ConfigType } from '../../../constant/ConfigDefine';
import { PlayerEvent } from '../../../constant/event/PlayerEvent';
import { EmWindow } from '../../../constant/UIDefine';
import { PlayerInfo } from '../../../datas/playerinfo/PlayerInfo';
import { PlayerManager } from '../../../manager/PlayerManager';
import { FrameCtrlManager } from '../../../mvc/FrameCtrlManager';
import WelfareCtrl from '../WelfareCtrl';
import WelfareData from '../WelfareData';
import MonthCardCell from './component/MonthCardCell';
import MonthCardInfo from '../data/MonthCardInfo';
import { TempleteManager } from '../../../manager/TempleteManager';
import ProductType from '../../../constant/ProductType';
import { t_s_rechargeData } from '../../../config/t_s_recharge';
import LangManager from '../../../../core/lang/LangManager';
import Utils from '../../../../core/utils/Utils';
/**
* @author:pzlricky
* @data: 2021-06-24 12:06
* @description 超值月卡
*/
export default class MonthCardView extends FUI_MonthCardView {

    private _listData: Array<Object>;

    private monthCardInfos: Array<MonthCardInfo>;

    constructor() {
        super();
    }

    onConstruct() {
        super.onConstruct();
        this.descTxt.text = LangManager.Instance.GetTranslation("MonthCardView.descTxt");
        this.onEvent();
        this.requestInfo();
    }

    requestInfo() {
        this.control.sendMonthCardReward(1);
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

    onInitView() {
        this._listData = [];
        this.monthCardInfos = this.playerInfo.monthCardInfos;
        let monthCardData: t_s_rechargeData[] = TempleteManager.Instance.getRechargeTempletes(ProductType.MONTH_RECHARGE, 1);//普通月卡
        let monthCardSuperData: t_s_rechargeData[] = TempleteManager.Instance.getRechargeTempletes(ProductType.MONTH_RECHARGE, 2);//超级月卡
        //月卡
        let monthlycard_ordinary: number = Number(monthCardData[0].Para2);
        let monthlycard_needordinary: number = Number(monthCardData[0].Para3);
        let monthlycard_ordinarytime: number = Number(monthCardData[0].Para4);
        let monthlycard_ordinarymoney: number = Number(monthCardData[0].MoneyNum);

        let monthlycard_super: number = Number(monthCardSuperData[0].Para2);
        let monthlycard_needsuper: number = Number(monthCardSuperData[0].Para3);
        let monthlycard_supertime: number = Number(monthCardSuperData[0].Para4);
        let monthlycard_supermoney: number = Number(monthCardSuperData[0].MoneyNum);

        this._listData.push(this.createDataObj(
            Number(monthlycard_ordinary),
            Number(monthlycard_needordinary),
            Number(monthlycard_ordinarytime),
            Number(monthlycard_ordinarymoney),
        ));
        this._listData.push(this.createDataObj(
            Number(monthlycard_super),
            Number(monthlycard_needsuper),
            Number(monthlycard_supertime),
            Number(monthlycard_supermoney),
        ));

        this.list.numItems = this._listData.length;
        if (Utils.isWxMiniGame()) {
            this.descTxt.x -= 150;
        }
    }

    private createDataObj(diamond: number = 0, bindDiamond: number = 0, lasttime: number = 0, cost: number = 0): Object {
        let obj = {
            diamond: diamond,
            bindDiamond: bindDiamond,
            lasttime: lasttime,
            cost: cost
        };
        return obj;
    }

    private onEvent() {
        this.list.itemRenderer = Laya.Handler.create(this, this.renderHandler, null, false);
        this.playerInfo.addEventListener(PlayerEvent.MONTH_CARD_CHANGE, this.onInitView, this);
    }


    private offEvent() {
        // this.list.itemRenderer.recover();
        Utils.clearGListHandle(this.list);
        this.playerInfo.removeEventListener(PlayerEvent.MONTH_CARD_CHANGE, this.onInitView, this);
    }

    renderHandler(index: number, item: MonthCardCell) {
        if (!item) return;

        item.index = index;
        if (this._listData[index]) {
            item.itemdata = this._listData[index];
        }
        if (this.monthCardInfos[index]) {
            item.statedata = this.monthCardInfos[index];
        }
    }

    dispose() {
        this.offEvent();
        this._listData = [];
        super.dispose();
    }

}