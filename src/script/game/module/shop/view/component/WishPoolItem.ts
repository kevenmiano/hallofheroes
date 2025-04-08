import FUI_WishPoolItem from "../../../../../../fui/Shop/FUI_WishPoolItem";
import BaseTipItem from "../../../../component/item/BaseTipItem";
import { t_s_wishingpoolData } from "../../../../config/t_s_wishingpool";
import { NotificationEvent } from "../../../../constant/event/NotificationEvent";
import { NotificationManager } from "../../../../manager/NotificationManager";
import WishPoolManager from "../../../../manager/WishPoolManager";
import FUIHelper from "../../../../utils/FUIHelper";
import WishPoolInfo from "../../model/WishPoolInfo";
import WishPoolModel from "../../model/WishPoolModel";

export default class WishPoolItem extends FUI_WishPoolItem {
    private _info: t_s_wishingpoolData;
    //@ts-ignore
    public tipItem: BaseTipItem;
    protected onConstruct() {
        super.onConstruct();
        NotificationManager.Instance.addEventListener(NotificationEvent.UPDATE_WISHDATA, this.update, this);
    }

    public set info(value: t_s_wishingpoolData) {
        this._info = value;
        if (this._info) {
            this.refreshView();
        }
    }

    public get info():t_s_wishingpoolData{
        return this._info;
    }

    public set selected(value: boolean) {
        this.selectedImg.visible = value;
    }

    private update(){
        if(this.selectedImg.visible){
            this.refreshView();
        }
    }

    private refreshView() {
        if (this._info.Type == WishPoolModel.FASHION_CLOTHES) {
            this.typeLoader.icon = FUIHelper.getItemURL("Shop", "Img_WishingPool_Clothing");
        } else if (this._info.Type == WishPoolModel.MOUNT) {
            this.typeLoader.icon = FUIHelper.getItemURL("Shop", "Img_WishingPool_Mount");
        }
        this.nameTxt.text = this._info.nameLang;
        this.tipItem.setInfo(this._info.CostItemId, false);
        this.coinCountTxt.text = this._info.CostItemNum.toString();
        let wishpoolInfo: WishPoolInfo = this.wishPoolModel.allDic.get(this._info.Id);
        let leftCount: number = 0;
        if (wishpoolInfo) {
            leftCount = this._info.WeeklyLimit - wishpoolInfo.WeekBuyCount;
            this.limitCountTxt.text = (leftCount > 0 ? "[color=#FFECC6]" : "[color=#FF0000]") + leftCount + "[/color]" + "/" + this._info.WeeklyLimit;
        } else {
            this.limitCountTxt.text = "";
        }
    }

    private get wishPoolModel(): WishPoolModel {
        return WishPoolManager.Instance.wishPoolModel;
    }

    dispose() {
        super.dispose();
        NotificationManager.Instance.removeEventListener(NotificationEvent.UPDATE_WISHDATA, this.update, this);
    }
}