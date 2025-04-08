import FUI_LevelGiftItem1 from "../../../../../../fui/Welfare/FUI_LevelGiftItem1";
import { GoodsInfo } from "../../../../datas/goods/GoodsInfo";
import { BaseItem } from '../../../../component/item/BaseItem';
import { EmWindow } from "../../../../constant/UIDefine";
import { FrameCtrlManager } from "../../../../mvc/FrameCtrlManager";
import WelfareCtrl from "../../WelfareCtrl";
import WelfareData from "../../WelfareData";
import AudioManager from "../../../../../core/audio/AudioManager";
import { SoundIds } from "../../../../constant/SoundIds";
import LangManager from "../../../../../core/lang/LangManager";
import LevelGiftItemInfo from "../../data/LevelGiftItemInfo";
import StringHelper from "../../../../../core/utils/StringHelper";
import Utils from "../../../../../core/utils/Utils";
import SDKManager from "../../../../../core/sdk/SDKManager";
import { RPT_EVENT } from "../../../../../core/thirdlib/RptEvent";
import { RewardItem } from "../../../../component/item/RewardItem";
/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/6/23 16:03
 * @ver 1.0
 *
 */

export class LevelGiftItem1 extends FUI_LevelGiftItem1 {
    private _info: LevelGiftItemInfo;
    private goodsArr: Array<GoodsInfo>;
    constructor() {
        super();
    }

    protected onConstruct() {
        super.onConstruct();
    }

    public set info(vInfo: LevelGiftItemInfo) {
        if (!vInfo) {
            this.clear();
            this.removeEvent();
        }
        else {
            this._info = vInfo;
            this.addEvent();
            this.refreshView();
        }
    }

    private clear() {
        this.txt_lv.text = "";
        this.list.numItems = 0;
        this.c1.selectedIndex = 0;
    }

    private refreshView() {
        this.txt_lv.text = LangManager.Instance.GetTranslation("public.level4_space2",this._info.grade);
        this.goodsArr = [];
        if (!StringHelper.isNullOrEmpty(this._info.freeStr)) {
            let itemArr: Array<string> = this._info.freeStr.split("|");
            if (itemArr) {
                let len = itemArr.length;
                for (let i = 0; i < len; i++) {
                    let goodsItem: GoodsInfo = new GoodsInfo();
                    goodsItem.templateId = parseInt(itemArr[i].split(",")[0]);
                    goodsItem.count = parseInt(itemArr[i].split(",")[1]);
                    
                    const displayEffect: number = parseInt(itemArr[i].split(",")[2]);
                    goodsItem.displayEffect = isNaN(displayEffect) ? 0 : displayEffect;
                    this.goodsArr.push(goodsItem);
                }
            }
        }
        this.list.numItems = this.goodsArr.length;
        this.c1.selectedIndex = this._info.packageState1 - 1;
    }

    private addEvent() {
        this.btn_receive.onClick(this, this.receiveHandler);
        Utils.setDrawCallOptimize(this.list);
        this.list.itemRenderer = Laya.Handler.create(this, this.renderListItem, null, false);
    }

    private removeEvent() {
        this.btn_receive.offClick(this, this.receiveHandler);
        this.list.itemRenderer = null;
    }

    private renderListItem(index: number, item: RewardItem) {
        item.info = this.goodsArr[index];
    }

    private receiveHandler() {
        // if(this.checkPackageState())//还有可购买的礼包, 则弹窗提示
        // {
        //     let confirm: string = LangManager.Instance.GetTranslation("public.confirm");
        //     let cancel: string = LangManager.Instance.GetTranslation("public.cancel");
        //     let prompt: string = LangManager.Instance.GetTranslation("public.prompt");
        //     let content: string = LangManager.Instance.GetTranslation("LevelGiftView.LevelGiftItem1.receiveTip");
        //     SimpleAlertHelper.Instance.Show(SimpleAlertHelper.SIMPLE_ALERT, null, prompt, content, confirm, cancel, this.getPackage.bind(this));
        // }
        // else
        // {
        //     this.control.sendLevelGiftReward(2,this._info.id);
        // }
        if(this._info.grade == 10){
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_LEVEL_10);
        }else if(this._info.grade == 20){
            SDKManager.Instance.getChannel().adjustEvent(RPT_EVENT.GIFT_LEVEL_20);
        }
        this.control.sendLevelGiftReward(2,this._info.id);
    }

    private getPackage(result: boolean, flag: boolean)
    {
        if(result)
        {
            AudioManager.Instance.playSound(SoundIds.CONFIRM_SOUND);
            this.control.sendLevelGiftReward(2,this._info.id);
        }
    }

    /**
     * 检测是否还有可购买的礼包
     * @returns 
     */
    private checkPackageState():boolean {
        let arr:Array<LevelGiftItemInfo> = this.model.getLevelGiftDimaondArr();
        let len = arr.length;
        let item:LevelGiftItemInfo;
        let flag:boolean = false;
        for(let i = 0; i < len; i++) {
            item = arr[i];
            if(item && item.packageState2 == 1 && item.id <= this.model.currentGetPackageId)
            {
                flag = true;
                break;
            }
        }
        return flag;
    }

    private get model(): WelfareData { 
        return this.control.data;
    }

    private get control(): WelfareCtrl {
        return FrameCtrlManager.Instance.getCtrl(EmWindow.Welfare) as WelfareCtrl;
    }

    dispose() {
        this.removeEvent();
        super.dispose();
    }
}