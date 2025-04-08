// @ts-nocheck
import FUI_StoreIntensifyCell from "../../../../fui/Base/FUI_StoreIntensifyCell";
import {BaseItem} from "./BaseItem";
import MediatorMananger from "../../manager/MediatorMananger";
import {BagType} from "../../constant/BagDefine";
import {IntensifyBagCellClickMediator} from "../../cell/mediator/storebag/IntensifyBagCellClickMediator";
import {GoodsInfo} from "../../datas/goods/GoodsInfo";
import AudioManager from "../../../core/audio/AudioManager";
import {SoundIds} from "../../constant/SoundIds";
import {t_s_itemtemplateData} from "../../config/t_s_itemtemplate";
import StringHelper from "../../../core/utils/StringHelper";
import {EmWindow} from "../../constant/UIDefine";
import ForgeData from "../../module/forge/ForgeData";
import {TipsShowType} from "../../tips/ITipedDisplay";

/**
 * @description
 * @author yuanzhan.yu
 * @date 2021/5/25 15:23
 * @ver 1.0
 *
 */
export class StoreIntensifyCell extends FUI_StoreIntensifyCell
{
    public item:BaseItem;

    protected _registed:boolean = false;
    protected _mediatorKey:string;
    public sonType:number;
    public resetTip:string;
    public static EQUIP:number = -1;
    public static NAME:string = "cell.view.storebag.StoreIntensifyCell";
    private _info:GoodsInfo;

    constructor()
    {
        super();
    }

    protected onConstruct()
    {
        super.onConstruct();

        this.item.bagType = BagType.Hide;
        this.setNormal();
        // this.registerMediator()
    }

    protected registerMediator()
    {
        this._registed = true;
        var arr:any[] = [
            IntensifyBagCellClickMediator
            // IntensifyBagCellDropMediator
        ];
        this._mediatorKey = MediatorMananger.Instance.registerMediatorList(arr, this, StoreIntensifyCell.NAME);
    }

    get info():GoodsInfo
    {
        return this._info;
    }

    set info(value:GoodsInfo)
    {
        this._info = value;

        if(value)
        {
            this.iconTick.icon = "";
        }
        else
        {
            this.iconTick.icon = ForgeData.getAddIcon();
        }
        AudioManager.Instance.playSound(SoundIds.BAG_EQUIP_SOUND);
        this.item.info = value;
        // this.dispatchEvent(StoreEvent.UPDATA_ITEM_DATA);

        // if(value)
        // {
        //     this.setTipStyle(value.templateInfo);
        // }
    }

    protected setTipStyle(temp:t_s_itemtemplateData)
    {
        if(!StringHelper.isNullOrEmpty(this.resetTip))
        {
            this.item.tipType = EmWindow[this.resetTip];
        }
        else
        {
            this.item.setTipStyle(temp);
        }
    }

    public setIconTick(url: string)
    {
        this.iconTick.icon = url;
    }

    public setNormal()
    {
        this.activeBack.visible = false;
        this.activeBack.playing = false;
    }

    public setFocus()
    {
        this.activeBack.visible = true;
        this.activeBack.playing = true;
    }

    dispose()
    {
        this.item.dispose();
        this._info = null;
        // MediatorMananger.Instance.unregisterMediatorList(this._mediatorKey, this);
        super.dispose();
    }
}